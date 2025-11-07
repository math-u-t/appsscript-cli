import * as path from 'path';
import { logger } from '../utils/logger';
import { ConfigLoader } from '../config/loader';
import { CompatibilityChecker } from '../checker';
import { AutoFixer } from '../checker/autofix';

export async function checkCommand(options: { fix?: boolean; strict?: boolean }): Promise<void> {
  try {
    const configLoader = new ConfigLoader();
    const config = await configLoader.load();

    if (options.strict && config.compatibility) {
      config.compatibility.warningsAsErrors = true;
    }

    logger.startSpinner('Running compatibility checks...');

    const srcDir = path.join(process.cwd(), 'src');
    const checker = new CompatibilityChecker(config);
    const issues = await checker.checkProject(srcDir);

    logger.stopSpinner();

    // Count issues by severity
    const errors = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;
    const infos = issues.filter(i => i.severity === 'info').length;

    // Display issues
    if (issues.length === 0) {
      logger.success('Compatibility check passed! No issues found.');
      return;
    }

    logger.log('');
    logger.log(`Found ${issues.length} issue(s):`);
    logger.log('');

    // Group by severity
    const errorIssues = issues.filter(i => i.severity === 'error');
    const warningIssues = issues.filter(i => i.severity === 'warning');
    const infoIssues = issues.filter(i => i.severity === 'info');

    if (errorIssues.length > 0) {
      logger.log('Errors:');
      errorIssues.forEach(issue => {
        logger.log(logger.formatIssue(issue));
        logger.log('');
      });
    }

    if (warningIssues.length > 0) {
      logger.log('Warnings:');
      warningIssues.forEach(issue => {
        logger.log(logger.formatIssue(issue));
        logger.log('');
      });
    }

    if (infoIssues.length > 0) {
      logger.log('Info:');
      infoIssues.forEach(issue => {
        logger.log(logger.formatIssue(issue));
        logger.log('');
      });
    }

    // Summary
    logger.log('Summary:');
    if (errors > 0) logger.error(`${errors} error(s)`);
    if (warnings > 0) logger.warning(`${warnings} warning(s)`);
    if (infos > 0) logger.info(`${infos} info`);
    logger.log('');

    // Auto-fix if requested
    if (options.fix) {
      logger.startSpinner('Applying automatic fixes...');
      const fixer = new AutoFixer();
      const fixedCount = await fixer.fixIssues(issues);
      logger.succeedSpinner(`Fixed ${fixedCount} issue(s) automatically`);

      // Re-run checks to show remaining issues
      logger.log('');
      logger.info('Re-running checks...');
      const remainingIssues = await checker.checkProject(srcDir);
      const remainingErrors = remainingIssues.filter(i => i.severity === 'error').length;

      if (remainingErrors > 0) {
        logger.warning(`${remainingErrors} issue(s) require manual fixing`);
        process.exit(1);
      } else {
        logger.success('All issues fixed!');
      }
    } else if (errors > 0 || (config.compatibility?.warningsAsErrors && warnings > 0)) {
      process.exit(1);
    }
  } catch (error) {
    logger.failSpinner('Compatibility check failed');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
