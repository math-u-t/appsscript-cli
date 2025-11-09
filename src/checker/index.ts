import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import { CompatibilityIssue, CompatibilityRules, GScriptConfig } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('@typescript-eslint/typescript-estree');

export class CompatibilityChecker {
  private rules: CompatibilityRules;
  private config: GScriptConfig;

  constructor(config: GScriptConfig) {
    this.config = config;
    this.rules = this.loadRules();
  }

  private loadRules(): CompatibilityRules {
    const rulesPath = path.join(__dirname, '../../compatibility-rules.json');
    return JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
  }

  async checkProject(srcDir: string): Promise<CompatibilityIssue[]> {
    const issues: CompatibilityIssue[] = [];

    // Find all TypeScript/JavaScript files
    const files = await glob('**/*.{ts,js}', {
      cwd: srcDir,
      ignore: this.config.excludePatterns || []
    });

    for (const file of files) {
      const filePath = path.join(srcDir, file);
      const fileIssues = await this.checkFile(filePath);
      issues.push(...fileIssues);
    }

    return issues;
  }

  async checkFile(filePath: string): Promise<CompatibilityIssue[]> {
    const issues: CompatibilityIssue[] = [];
    const content = await fs.readFile(filePath, 'utf-8');

    // Check patterns first (regex-based)
    issues.push(...this.checkPatterns(filePath, content));

    // Parse AST for deeper analysis
    try {
      const ast = parser.parse(content, {
        loc: true,
        range: true,
        tokens: false,
        comment: false,
        jsx: false
      });

      issues.push(...this.checkAST(filePath, content, ast));
    } catch (error) {
      // If parsing fails, add a syntax error
      issues.push({
        file: filePath,
        line: 1,
        column: 1,
        severity: 'error',
        code: 'PARSE_ERROR',
        message: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    return issues;
  }

  private checkPatterns(filePath: string, content: string): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];
    const lines = content.split('\n');

    for (const [name, rule] of Object.entries(this.rules.patterns)) {
      const regex = new RegExp(rule.pattern, 'gm');

      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        const match = regex.exec(line);

        if (match) {
          issues.push({
            file: filePath,
            line: lineNum + 1,
            column: match.index + 1,
            severity: rule.severity,
            code: name.toUpperCase().replace(/-/g, '_'),
            message: rule.message,
            fix: rule.autofix ? `Replace with: ${rule.autofix.replace}` : undefined,
            docs: rule.docs
          });
        }
      }
    }

    return issues;
  }

  private checkAST(filePath: string, content: string, ast: any): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];

    const visit = (node: any, parent?: any) => {
      if (!node) return;

      // Check for global API usage
      if (node.type === parser.AST_NODE_TYPES.Identifier) {
        const name = node.name;

        // Skip if this identifier is a property in a MemberExpression
        // (e.g., skip 'fetch' in 'UrlFetchApp.fetch')
        const isProperty = parent &&
                          parent.type === parser.AST_NODE_TYPES.MemberExpression &&
                          parent.property === node;

        // Check globals only if not a property of a member expression
        if (!isProperty && this.rules.globals[name]) {
          const rule = this.rules.globals[name];
          if (!rule.available) {
            issues.push({
              file: filePath,
              line: node.loc.start.line,
              column: node.loc.start.column,
              severity: rule.severity,
              code: `GLOBAL_${name.toUpperCase()}`,
              message: rule.message || `${name} is not available in Apps Script`,
              fix: rule.replacement ? `Use ${rule.replacement} instead` : undefined,
              docs: rule.docs
            });
          }
        }
      }

      // Check for member expressions (e.g., crypto.subtle.digest)
      if (node.type === parser.AST_NODE_TYPES.MemberExpression) {
        const fullPath = this.getMemberPath(node);

        if (this.rules.apis[fullPath]) {
          const rule = this.rules.apis[fullPath];
          if (!rule.available) {
            issues.push({
              file: filePath,
              line: node.loc.start.line,
              column: node.loc.start.column,
              severity: rule.severity,
              code: `API_${fullPath.toUpperCase().replace(/\./g, '_')}`,
              message: rule.message || `${fullPath} is not available in Apps Script`,
              fix: rule.replacement ? `Use ${rule.replacement} instead` : undefined,
              docs: rule.docs
            });
          }
        }
      }

      // Check for import/export statements
      if (node.type === parser.AST_NODE_TYPES.ImportDeclaration) {
        const rule = this.rules.features['import'];
        if (rule && !rule.available) {
          issues.push({
            file: filePath,
            line: node.loc.start.line,
            column: node.loc.start.column,
            severity: rule.severity,
            code: 'IMPORT_NOT_SUPPORTED',
            message: rule.message || 'import statements are not supported',
            docs: rule.docs
          });
        }
      }

      if (node.type === parser.AST_NODE_TYPES.ExportNamedDeclaration || node.type === parser.AST_NODE_TYPES.ExportDefaultDeclaration) {
        const rule = this.rules.features['export'];
        if (rule && !rule.available) {
          issues.push({
            file: filePath,
            line: node.loc.start.line,
            column: node.loc.start.column,
            severity: rule.severity,
            code: 'EXPORT_NOT_SUPPORTED',
            message: rule.message || 'export statements are not supported',
            docs: rule.docs
          });
        }
      }

      // Check for async/await with wrong runtime
      if (node.type === parser.AST_NODE_TYPES.AwaitExpression) {
        const rule = this.rules.features['async-await'];
        if (rule && rule.requiresRuntime && this.config.runtime !== rule.requiresRuntime) {
          issues.push({
            file: filePath,
            line: node.loc.start.line,
            column: node.loc.start.column,
            severity: 'warning',
            code: 'ASYNC_AWAIT_RUNTIME',
            message: `async/await requires ${rule.requiresRuntime} runtime. Current: ${this.config.runtime}`,
            fix: `Set runtime to ${rule.requiresRuntime} in gscript.config.json`
          });
        }
      }

      // Recursively visit child nodes
      for (const key in node) {
        if (key === 'loc' || key === 'range' || key === 'parent') continue;
        const child = node[key];

        if (Array.isArray(child)) {
          child.forEach(c => visit(c, node));
        } else if (child && typeof child === 'object' && child.type) {
          visit(child, node);
        }
      }
    };

    visit(ast);
    return issues;
  }

  private getMemberPath(node: any): string {
    const parts: string[] = [];

    const traverse = (n: any): void => {
      if (n.type === parser.AST_NODE_TYPES.MemberExpression) {
        traverse(n.object);
        if (n.property.type === parser.AST_NODE_TYPES.Identifier) {
          parts.push(n.property.name);
        }
      } else if (n.type === parser.AST_NODE_TYPES.Identifier) {
        parts.push(n.name);
      }
    };

    traverse(node);
    return parts.join('.');
  }
}
