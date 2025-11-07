import * as path from 'path';
import { logger } from '../utils/logger';
import { ConfigLoader } from '../config/loader';
import { Builder } from '../builder';

export async function buildCommand(options: { output?: string; check?: boolean }): Promise<void> {
  try {
    const startTime = Date.now();

    const configLoader = new ConfigLoader();
    const config = await configLoader.load();

    logger.startSpinner('Building project...');

    const srcDir = path.join(process.cwd(), 'src');
    const outputPath = path.join(process.cwd(), options.output || 'dist/Code.gs');
    const skipCheck = options.check === false;

    const builder = new Builder(config);
    const result = await builder.build(srcDir, outputPath, skipCheck);

    if (!result.success) {
      logger.failSpinner('Build failed');
      logger.log('');
      logger.error(`Found ${result.errors} error(s)`);

      // Display first few errors
      result.issues
        .filter(i => i.severity === 'error')
        .slice(0, 5)
        .forEach(issue => {
          logger.log(logger.formatIssue(issue));
          logger.log('');
        });

      if (result.errors > 5) {
        logger.log(`... and ${result.errors - 5} more error(s)`);
      }

      logger.log('');
      logger.info('Run "gscript check --fix" to automatically fix some issues');
      process.exit(1);
    }

    // Create appsscript.json manifest
    const distDir = path.dirname(outputPath);
    await builder.createAppsScriptManifest(distDir);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    logger.succeedSpinner(`Built successfully in ${duration}s`);

    if (result.warnings > 0) {
      logger.warning(`Found ${result.warnings} warning(s)`);
    }

    logger.log('');
    logger.success(`Output: ${outputPath}`);
    logger.info('Next step: Run "gscript deploy" to deploy to Apps Script');
  } catch (error) {
    logger.failSpinner('Build failed');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
