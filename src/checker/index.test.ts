import { CompatibilityChecker } from './index';
import { GScriptConfig } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('CompatibilityChecker', () => {
  let tempDir: string;
  let checker: CompatibilityChecker;
  const config: GScriptConfig = {
    runtime: 'V8',
    timeZone: 'America/New_York',
    compatibility: {
      strictMode: true,
      warningsAsErrors: false
    }
  };

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `gscript-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
    checker = new CompatibilityChecker(config);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should detect fetch() usage', async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.writeFile(testFile, `
      async function getData() {
        const response = await fetch('https://api.example.com');
        return response.json();
      }
    `);

    const issues = await checker.checkFile(testFile);
    const fetchIssue = issues.find(i => i.code === 'FETCH_PATTERN');

    expect(fetchIssue).toBeDefined();
    expect(fetchIssue?.severity).toBe('error');
    expect(fetchIssue?.message).toContain('UrlFetchApp.fetch()');
  });

  it('should detect crypto.randomUUID() usage', async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.writeFile(testFile, `
      function generateId() {
        return crypto.randomUUID();
      }
    `);

    const issues = await checker.checkFile(testFile);
    const cryptoIssue = issues.find(i => i.message.includes('crypto'));

    expect(cryptoIssue).toBeDefined();
    expect(cryptoIssue?.severity).toBe('error');
  });

  it('should detect import statements', async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.writeFile(testFile, `
      import { foo } from './bar';

      function test() {
        return foo();
      }
    `);

    const issues = await checker.checkFile(testFile);
    const importIssue = issues.find(i => i.code === 'IMPORT_NOT_SUPPORTED');

    expect(importIssue).toBeDefined();
    expect(importIssue?.severity).toBe('error');
  });

  it('should detect localStorage usage', async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.writeFile(testFile, `
      function saveData(key: string, value: string) {
        localStorage.setItem(key, value);
      }
    `);

    const issues = await checker.checkFile(testFile);
    const storageIssue = issues.find(i => i.code === 'GLOBAL_LOCALSTORAGE');

    expect(storageIssue).toBeDefined();
    expect(storageIssue?.message).toContain('PropertiesService');
  });

  it('should not flag valid Apps Script code', async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.writeFile(testFile, `
      function sendEmail(to: string, subject: string, body: string) {
        GmailApp.sendEmail(to, subject, body);
        Logger.log('Email sent');
      }

      function getData() {
        const response = UrlFetchApp.fetch('https://api.example.com');
        return JSON.parse(response.getContentText());
      }
    `);

    const issues = await checker.checkFile(testFile);
    const errors = issues.filter(i => i.severity === 'error');

    expect(errors.length).toBe(0);
  });
});
