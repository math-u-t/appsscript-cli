export interface GScriptConfig {
  projectId?: string;
  runtime: 'V8' | 'RHINO';
  timeZone: string;
  dependencies?: Record<string, string>;
  oauthScopes?: string[];
  webApp?: {
    access: 'MYSELF' | 'DOMAIN' | 'ANYONE' | 'ANYONE_ANONYMOUS';
    executeAs: 'USER_ACCESSING' | 'USER_DEPLOYING';
  };
  compatibility?: {
    strictMode: boolean;
    warningsAsErrors: boolean;
  };
  excludePatterns?: string[];
}

export interface CompatibilityIssue {
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  fix?: string;
  docs?: string;
}

export interface CompatibilityRule {
  available: boolean;
  replacement?: string;
  message?: string;
  docs?: string;
  severity: 'error' | 'warning' | 'info';
  autofix?: boolean | AutoFix;
  requiresRuntime?: 'V8' | 'RHINO';
  notes?: string;
}

export interface AutoFix {
  find: string;
  replace: string;
}

export interface PatternRule {
  pattern: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  autofix?: AutoFix;
  docs?: string;
}

export interface CompatibilityRules {
  globals: Record<string, CompatibilityRule>;
  apis: Record<string, CompatibilityRule>;
  features: Record<string, CompatibilityRule>;
  patterns: Record<string, PatternRule>;
}

export interface BuildResult {
  success: boolean;
  outputFile: string;
  issues: CompatibilityIssue[];
  warnings: number;
  errors: number;
}

export interface DeployOptions {
  projectId?: string;
  version?: string;
  description?: string;
  webApp?: boolean;
  api?: boolean;
  executeAs?: 'USER_ACCESSING' | 'USER_DEPLOYING';
  access?: string;
}
