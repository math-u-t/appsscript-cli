import * as path from 'path';
import * as chokidar from 'chokidar';
import { logger } from '../utils/logger';
import { ConfigLoader } from '../config/loader';
import { Builder } from '../builder';
import { CompatibilityChecker } from '../checker';

export async function devCommand(options: { port?: string; open?: boolean }): Promise<void> {
  try {
    const port = options.port || '3000';

    logger.info('Starting development mode with file watching...');

    const configLoader = new ConfigLoader();
    const config = await configLoader.load();

    const srcDir = path.join(process.cwd(), 'src');
    const outputPath = path.join(process.cwd(), 'dist', 'Code.gs');

    // Initial build
    logger.info('Performing initial build...');
    const builder = new Builder(config);

    try {
      const result = await builder.build(srcDir, outputPath, false);

      if (result.success) {
        logger.success('Initial build completed successfully!');
        if (result.warnings > 0) {
          logger.warning(`Found ${result.warnings} warnings`);
        }
      } else {
        logger.error(`Build failed with ${result.errors} errors`);
        result.issues.filter(i => i.severity === 'error').forEach(issue => {
          logger.error(`${issue.file}:${issue.line}:${issue.column} - ${issue.message}`);
        });
      }
    } catch (error) {
      logger.error('Initial build failed');
      logger.error(error instanceof Error ? error.message : 'Unknown error');
    }

    // Watch for file changes
    logger.info('Watching for file changes in ./src...');
    logger.log('Press Ctrl+C to stop');

    const watcher = chokidar.watch('src/**/*.{ts,js}', {
      persistent: true,
      ignoreInitial: true,
      cwd: process.cwd()
    });

    watcher.on('change', async (filePath) => {
      logger.info(`File changed: ${filePath}`);
      logger.startSpinner('Rebuilding...');

      try {
        const result = await builder.build(srcDir, outputPath, false);

        if (result.success) {
          logger.succeedSpinner('Build completed!');
          if (result.warnings > 0) {
            logger.warning(`Found ${result.warnings} warnings`);
          }
        } else {
          logger.failSpinner('Build failed');
          result.issues.filter(i => i.severity === 'error').forEach(issue => {
            logger.error(`${issue.file}:${issue.line}:${issue.column} - ${issue.message}`);
          });
        }
      } catch (error) {
        logger.failSpinner('Build failed');
        logger.error(error instanceof Error ? error.message : 'Unknown error');
      }
    });

    watcher.on('add', async (filePath) => {
      logger.info(`File added: ${filePath}`);
      logger.startSpinner('Rebuilding...');

      try {
        const result = await builder.build(srcDir, outputPath, false);

        if (result.success) {
          logger.succeedSpinner('Build completed!');
        } else {
          logger.failSpinner('Build failed');
        }
      } catch (error) {
        logger.failSpinner('Build failed');
        logger.error(error instanceof Error ? error.message : 'Unknown error');
      }
    });

    watcher.on('unlink', async (filePath) => {
      logger.info(`File removed: ${filePath}`);
      logger.startSpinner('Rebuilding...');

      try {
        const result = await builder.build(srcDir, outputPath, false);

        if (result.success) {
          logger.succeedSpinner('Build completed!');
        } else {
          logger.failSpinner('Build failed');
        }
      } catch (error) {
        logger.failSpinner('Build failed');
        logger.error(error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Keep the process running
    process.on('SIGINT', () => {
      logger.log('');
      logger.info('Stopping development mode...');
      watcher.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
