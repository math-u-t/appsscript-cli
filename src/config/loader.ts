import * as fs from 'fs-extra';
import * as path from 'path';
import { GScriptConfig } from '../types';

const DEFAULT_CONFIG: GScriptConfig = {
  runtime: 'V8',
  timeZone: 'America/New_York',
  oauthScopes: [
    'https://www.googleapis.com/auth/script.external_request'
  ],
  compatibility: {
    strictMode: true,
    warningsAsErrors: false
  },
  excludePatterns: [
    'node_modules/**',
    'dist/**',
    '**/*.test.ts',
    '**/*.spec.ts'
  ]
};

export class ConfigLoader {
  private configPath: string;

  constructor(basePath: string = process.cwd()) {
    this.configPath = path.join(basePath, 'gscript.config.json');
  }

  async load(): Promise<GScriptConfig> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const userConfig = await fs.readJson(this.configPath);
        return this.mergeConfig(DEFAULT_CONFIG, userConfig);
      }
      return DEFAULT_CONFIG;
    } catch (error) {
      throw new Error(`Failed to load config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async save(config: GScriptConfig): Promise<void> {
    try {
      await fs.writeJson(this.configPath, config, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to save config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async exists(): Promise<boolean> {
    return fs.pathExists(this.configPath);
  }

  private mergeConfig(defaultConfig: GScriptConfig, userConfig: Partial<GScriptConfig>): GScriptConfig {
    const result: GScriptConfig = {
      ...defaultConfig,
      ...userConfig
    };

    // Merge compatibility settings carefully
    if (userConfig.compatibility || defaultConfig.compatibility) {
      result.compatibility = {
        strictMode: userConfig.compatibility?.strictMode ?? defaultConfig.compatibility?.strictMode ?? true,
        warningsAsErrors: userConfig.compatibility?.warningsAsErrors ?? defaultConfig.compatibility?.warningsAsErrors ?? false
      };
    }

    // Merge webApp settings carefully
    if (userConfig.webApp || defaultConfig.webApp) {
      result.webApp = {
        access: userConfig.webApp?.access ?? defaultConfig.webApp?.access ?? 'MYSELF',
        executeAs: userConfig.webApp?.executeAs ?? defaultConfig.webApp?.executeAs ?? 'USER_DEPLOYING'
      };
    }

    return result;
  }
}
