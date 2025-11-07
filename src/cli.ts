#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './cli/init';
import { checkCommand } from './cli/check';
import { buildCommand } from './cli/build';
import { deployCommand } from './cli/deploy';
import { devCommand } from './cli/dev';
import { pullCommand } from './cli/pull';
import { logsCommand } from './cli/logs';
import { testCommand } from './cli/test';

const program = new Command();

program
  .name('gscript')
  .description('TypeScript-style development experience for Google Apps Script')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize new Apps Script project')
  .argument('[project-name]', 'Project name')
  .action(initCommand);

program
  .command('check')
  .description('Run compatibility checks')
  .option('--fix', 'Automatically fix issues where possible')
  .option('--strict', 'Treat warnings as errors')
  .action(checkCommand);

program
  .command('build')
  .description('Build for deployment')
  .option('--output <path>', 'Output file path', 'dist/Code.gs')
  .option('--no-check', 'Skip compatibility checks')
  .action(buildCommand);

program
  .command('deploy')
  .description('Deploy to Apps Script')
  .option('--project-id <id>', 'Apps Script project ID')
  .option('--version <version>', 'Version number')
  .option('--description <desc>', 'Version description')
  .option('--web-app', 'Deploy as web app')
  .option('--api', 'Deploy as API executable')
  .option('--execute-as <mode>', 'Execute as (USER_ACCESSING or USER_DEPLOYING)')
  .option('--access <mode>', 'Access mode')
  .action(deployCommand);

program
  .command('dev')
  .description('Start development server')
  .option('--port <port>', 'Server port', '3000')
  .option('--no-open', 'Don\'t open browser')
  .action(devCommand);

program
  .command('pull')
  .description('Pull from Apps Script to local')
  .option('--project-id <id>', 'Apps Script project ID')
  .action(pullCommand);

program
  .command('logs')
  .description('View execution logs')
  .option('--project-id <id>', 'Apps Script project ID')
  .option('--tail', 'Follow logs')
  .action(logsCommand);

program
  .command('test')
  .description('Run test suite')
  .option('--watch', 'Watch mode')
  .action(testCommand);

program.parse();
