import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';
import { ConfigLoader } from '../config/loader';
import { DeployOptions } from '../types';

const execAsync = promisify(exec);

export async function deployCommand(options: DeployOptions): Promise<void> {
  try {
    const configLoader = new ConfigLoader();
    const config = await configLoader.load();

    const projectId = options.projectId || config.projectId;

    if (!projectId) {
      logger.error('Project ID is required. Use --project-id flag or set it in gscript.config.json');
      logger.info('To create a new Apps Script project, visit: https://script.google.com');
      process.exit(1);
    }

    // Check if dist directory exists
    const distDir = path.join(process.cwd(), 'dist');
    if (!await fs.pathExists(distDir)) {
      logger.error('Build directory not found. Run "gscript build" first.');
      process.exit(1);
    }

    // Update .clasp.json
    const claspConfig = {
      scriptId: projectId,
      rootDir: './dist'
    };

    await fs.writeJson(path.join(process.cwd(), '.clasp.json'), claspConfig, { spaces: 2 });

    // Check if clasp is available
    try {
      await execAsync('clasp --version');
    } catch (error) {
      logger.error('clasp is not installed. Install it with: npm install -g @google/clasp');
      logger.info('Then run: clasp login');
      process.exit(1);
    }

    logger.startSpinner('Deploying to Apps Script...');

    try {
      // Push to Apps Script
      const { stdout, stderr } = await execAsync('clasp push --force', { cwd: process.cwd() });

      logger.succeedSpinner('Successfully deployed to Apps Script!');

      if (stdout) {
        logger.log(stdout);
      }

      if (stderr && !stderr.includes('Pushed')) {
        logger.warning(stderr);
      }

      logger.log('');
      logger.info(`Project URL: https://script.google.com/home/projects/${projectId}`);

      // Create deployment version if requested
      if (options.version && options.description) {
        logger.startSpinner('Creating deployment version...');
        const versionCmd = `clasp deploy --description "${options.description}"`;
        const { stdout: versionOut } = await execAsync(versionCmd, { cwd: process.cwd() });
        logger.succeedSpinner('Deployment version created!');
        if (versionOut) {
          logger.log(versionOut);
        }
      }
    } catch (error) {
      logger.failSpinner('Deployment failed');

      if (error instanceof Error && 'stderr' in error) {
        const execError = error as Error & { stderr?: string };
        if (execError.stderr?.includes('not logged in')) {
          logger.error('Not logged in to clasp. Run: clasp login');
        } else if (execError.stderr) {
          logger.error(execError.stderr);
        }
      } else {
        logger.error(error instanceof Error ? error.message : 'Unknown error');
      }

      process.exit(1);
    }
  } catch (error) {
    logger.failSpinner('Deployment failed');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
