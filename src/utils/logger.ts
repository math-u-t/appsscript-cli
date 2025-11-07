import chalk from 'chalk';
import ora, { Ora } from 'ora';

export class Logger {
  private spinner: Ora | null = null;

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  log(message: string): void {
    console.log(message);
  }

  startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  formatIssue(issue: {
    file: string;
    line: number;
    column: number;
    severity: string;
    code: string;
    message: string;
    fix?: string;
    docs?: string;
  }): string {
    const severityColor =
      issue.severity === 'error' ? chalk.red :
      issue.severity === 'warning' ? chalk.yellow :
      chalk.blue;

    let output = '';
    output += severityColor(`${issue.severity}: `) + chalk.white(issue.message);
    output += chalk.gray(` (${issue.code})`);
    output += '\n';
    output += chalk.cyan(`  --> ${issue.file}:${issue.line}:${issue.column}`);

    if (issue.fix) {
      output += '\n';
      output += chalk.green('   = help: ') + issue.fix;
    }

    if (issue.docs) {
      output += '\n';
      output += chalk.blue('   = docs: ') + issue.docs;
    }

    return output;
  }
}

export const logger = new Logger();
