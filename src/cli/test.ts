import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export async function testCommand(options: { watch?: boolean }): Promise<void> {
  try {
    // Check if package.json has a test script
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    if (!await fs.pathExists(packageJsonPath)) {
      logger.error('package.json not found. Initialize your project first.');
      process.exit(1);
    }

    const packageJson = await fs.readJson(packageJsonPath);

    if (!packageJson.scripts || !packageJson.scripts.test) {
      logger.warning('No test script found in package.json');
      logger.info('Add a test script to package.json:');
      logger.log('  "scripts": { "test": "jest" }');
      process.exit(1);
    }

    logger.info('Running tests...');

    try {
      const watchFlag = options.watch ? ' --watch' : '';
      const { stdout, stderr } = await execAsync(`npm test${watchFlag}`, {
        cwd: process.cwd(),
        env: { ...process.env, FORCE_COLOR: '1' }
      });

      if (stdout) {
        logger.log(stdout);
      }

      if (stderr) {
        logger.log(stderr);
      }
    } catch (error) {
      // npm test returns non-zero exit code if tests fail
      if (error instanceof Error && 'stdout' in error) {
        const execError = error as Error & { stdout?: string; stderr?: string };
        if (execError.stdout) {
          logger.log(execError.stdout);
        }
        if (execError.stderr) {
          logger.log(execError.stderr);
        }
      }

      logger.error('Tests failed');
      process.exit(1);
    }
  } catch (error) {
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
