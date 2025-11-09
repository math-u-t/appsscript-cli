import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';
import { ConfigLoader } from '../config/loader';

const execAsync = promisify(exec);

export async function pullCommand(options: { projectId?: string }): Promise<void> {
  try {
    const configLoader = new ConfigLoader();
    const config = await configLoader.load();

    const projectId = options.projectId || config.projectId;

    if (!projectId) {
      logger.error('Project ID is required. Use --project-id flag or set it in gscript.config.json');
      process.exit(1);
    }

    // Check if clasp is available
    try {
      await execAsync('clasp --version');
    } catch (error) {
      logger.error('clasp is not installed. Install it with: npm install -g @google/clasp');
      logger.info('Then run: clasp login');
      process.exit(1);
    }

    // Update .clasp.json
    const claspConfig = {
      scriptId: projectId,
      rootDir: './src'
    };

    await fs.writeJson(path.join(process.cwd(), '.clasp.json'), claspConfig, { spaces: 2 });

    logger.startSpinner('Pulling from Apps Script...');

    try {
      // Pull from Apps Script
      const { stdout, stderr } = await execAsync('clasp pull', { cwd: process.cwd() });

      logger.succeedSpinner('Successfully pulled from Apps Script!');

      if (stdout) {
        logger.log(stdout);
      }

      if (stderr && !stderr.includes('Cloned')) {
        logger.warning(stderr);
      }

      logger.log('');
      logger.info('Files have been pulled to ./src directory');
      logger.warning('Note: You may need to manually organize the pulled files into your project structure');
    } catch (error) {
      logger.failSpinner('Failed to pull from Apps Script');

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
    logger.failSpinner('Failed to pull from Apps Script');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
