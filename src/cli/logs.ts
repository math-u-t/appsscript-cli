import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs-extra';
import { logger } from '../utils/logger';
import { ConfigLoader } from '../config/loader';

const execAsync = promisify(exec);

export async function logsCommand(options: { projectId?: string; tail?: boolean }): Promise<void> {
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
      rootDir: './dist'
    };

    await fs.writeJson(path.join(process.cwd(), '.clasp.json'), claspConfig, { spaces: 2 });

    logger.info('Fetching logs...');

    try {
      const logsCmd = options.tail ? 'clasp logs --watch' : 'clasp logs';

      if (options.tail) {
        logger.info('Watching logs (press Ctrl+C to stop)...');
        // For tail mode, we need to stream the output
        const child = exec(logsCmd, { cwd: process.cwd() });

        child.stdout?.on('data', (data) => {
          process.stdout.write(data);
        });

        child.stderr?.on('data', (data) => {
          process.stderr.write(data);
        });

        child.on('exit', (code) => {
          if (code !== 0) {
            process.exit(code || 1);
          }
        });
      } else {
        const { stdout, stderr } = await execAsync(logsCmd, { cwd: process.cwd() });

        if (stdout) {
          logger.log(stdout);
        }

        if (stderr && !stderr.includes('No logs')) {
          logger.warning(stderr);
        }
      }
    } catch (error) {
      if (error instanceof Error && 'stderr' in error) {
        const execError = error as Error & { stderr?: string };
        if (execError.stderr?.includes('not logged in')) {
          logger.error('Not logged in to clasp. Run: clasp login');
        } else if (execError.stderr?.includes('No logs')) {
          logger.info('No logs found for this project');
        } else if (execError.stderr) {
          logger.error(execError.stderr);
        }
      } else {
        logger.error(error instanceof Error ? error.message : 'Unknown error');
      }

      process.exit(1);
    }
  } catch (error) {
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
