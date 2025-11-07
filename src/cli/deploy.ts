import * as path from 'path';
import * as fs from 'fs-extra';
import { logger } from '../utils/logger';
import { ConfigLoader } from '../config/loader';
import { DeployOptions } from '../types';

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

    logger.startSpinner('Deploying to Apps Script...');

    // Update .clasp.json
    const claspConfig = {
      scriptId: projectId,
      rootDir: './dist'
    };

    await fs.writeJson(path.join(process.cwd(), '.clasp.json'), claspConfig, { spaces: 2 });

    // TODO: Use clasp push to deploy
    // For now, we'll just provide instructions
    logger.stopSpinner();
    logger.log('');
    logger.info('To complete deployment:');
    logger.log('1. Install clasp: npm install -g @google/clasp');
    logger.log('2. Login: clasp login');
    logger.log('3. Push: clasp push');
    logger.log('');

    if (options.version) {
      logger.info(`Version: ${options.version}`);
    }

    if (options.description) {
      logger.info(`Description: ${options.description}`);
    }

    logger.log('');
    logger.info(`Project URL: https://script.google.com/home/projects/${projectId}`);
  } catch (error) {
    logger.failSpinner('Deployment failed');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
