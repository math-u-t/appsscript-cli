import * as fs from 'fs-extra';
import * as path from 'path';
import { logger } from '../utils/logger';
import { GScriptConfig } from '../types';

export async function initCommand(projectName?: string): Promise<void> {
  try {
    const targetDir = projectName ? path.join(process.cwd(), projectName) : process.cwd();
    const projectNameValue = projectName || path.basename(process.cwd());

    logger.startSpinner('Initializing Apps Script project...');

    // Create project directory if needed
    if (projectName) {
      await fs.ensureDir(targetDir);
    }

    // Create config file
    const config: GScriptConfig = {
      runtime: 'V8',
      timeZone: 'America/New_York',
      oauthScopes: [
        'https://www.googleapis.com/auth/script.external_request'
      ],
      compatibility: {
        strictMode: true,
        warningsAsErrors: false
      }
    };

    await fs.writeJson(path.join(targetDir, 'gscript.config.json'), config, { spaces: 2 });

    // Create directory structure
    const srcDir = path.join(targetDir, 'src');
    await fs.ensureDir(srcDir);
    await fs.ensureDir(path.join(targetDir, 'tests'));

    // Create sample file
    const sampleCode = `/**
 * Sample Apps Script function
 * This is automatically deployed to Apps Script
 */
function doGet(e: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutput('<h1>Hello, World!</h1>');
}

function myFunction() {
  Logger.log('Hello from ${projectNameValue}!');
}
`;

    await fs.writeFile(path.join(srcDir, 'main.ts'), sampleCode);

    // Create .clasp.json template
    const claspConfig = {
      scriptId: "",
      rootDir: "./dist"
    };

    await fs.writeJson(path.join(targetDir, '.clasp.json'), claspConfig, { spaces: 2 });

    // Create package.json if it doesn't exist
    const packageJsonPath = path.join(targetDir, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      const packageJson = {
        name: projectNameValue,
        version: '1.0.0',
        description: 'Apps Script project',
        scripts: {
          check: 'gscript check',
          build: 'gscript build',
          deploy: 'gscript deploy',
          dev: 'gscript dev'
        },
        devDependencies: {
          '@types/google-apps-script': '^1.0.0',
          'gscript': '^1.0.0'
        }
      };
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    // Create .gitignore
    const gitignorePath = path.join(targetDir, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
      const gitignore = `node_modules/
dist/
.clasp.json
*.log
`;
      await fs.writeFile(gitignorePath, gitignore);
    }

    logger.succeedSpinner('Project initialized successfully!');
    logger.log('');
    logger.info('Next steps:');
    logger.log('  1. Run: npm install');
    logger.log('  2. Update .clasp.json with your Apps Script project ID');
    logger.log('  3. Run: gscript check    (check for compatibility issues)');
    logger.log('  4. Run: gscript build    (build your project)');
    logger.log('  5. Run: gscript deploy   (deploy to Apps Script)');
    logger.log('');
    logger.info('Documentation: https://github.com/your-org/gscript');
  } catch (error) {
    logger.failSpinner('Failed to initialize project');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
