import * as fs from 'fs-extra';
import { CompatibilityIssue, CompatibilityRules } from '../types';
import * as path from 'path';

export class AutoFixer {
  private rules: CompatibilityRules;

  constructor() {
    this.rules = this.loadRules();
  }

  private loadRules(): CompatibilityRules {
    const rulesPath = path.join(__dirname, '../../compatibility-rules.json');
    return JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
  }

  async fixIssues(issues: CompatibilityIssue[]): Promise<number> {
    let fixedCount = 0;

    // Group issues by file
    const issuesByFile = new Map<string, CompatibilityIssue[]>();
    for (const issue of issues) {
      if (!issuesByFile.has(issue.file)) {
        issuesByFile.set(issue.file, []);
      }
      issuesByFile.get(issue.file)!.push(issue);
    }

    // Fix each file
    for (const [filePath, fileIssues] of issuesByFile) {
      const fixed = await this.fixFile(filePath, fileIssues);
      fixedCount += fixed;
    }

    return fixedCount;
  }

  private async fixFile(filePath: string, issues: CompatibilityIssue[]): Promise<number> {
    let content = await fs.readFile(filePath, 'utf-8');
    let fixedCount = 0;

    // Apply pattern-based fixes
    for (const [name, rule] of Object.entries(this.rules.patterns)) {
      if (rule.autofix) {
        const regex = new RegExp(rule.autofix.find, 'g');
        const newContent = content.replace(regex, rule.autofix.replace);
        if (newContent !== content) {
          content = newContent;
          fixedCount++;
        }
      }
    }

    // Apply simple replacements for known APIs
    const replacements = [
      { from: /\bcrypto\.randomUUID\(\)/g, to: 'Utilities.getUuid()' },
      { from: /\bfetch\(/g, to: 'UrlFetchApp.fetch(' }
    ];

    for (const { from, to } of replacements) {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        fixedCount++;
      }
    }

    // Remove import/export statements
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => {
      const trimmed = line.trim();
      return !trimmed.startsWith('import ') &&
             !trimmed.startsWith('export ') &&
             !trimmed.startsWith('export{') &&
             !trimmed.startsWith('export {');
    });

    if (filteredLines.length !== lines.length) {
      content = filteredLines.join('\n');
      fixedCount++;
    }

    // Write fixed content back
    if (fixedCount > 0) {
      await fs.writeFile(filePath, content, 'utf-8');
    }

    return fixedCount;
  }
}
