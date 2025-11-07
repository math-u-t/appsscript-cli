# Migration Guide

Guide for migrating to gscript from different workflows.

## Table of Contents

- [From Manual Apps Script Development](#from-manual-apps-script-development)
- [From clasp](#from-clasp)
- [Common Migration Patterns](#common-migration-patterns)
- [Breaking Changes](#breaking-changes)

---

## From Manual Apps Script Development

If you've been writing Apps Script directly in the online editor, here's how to migrate to gscript.

### Step 1: Download Your Existing Code

1. Open your Apps Script project
2. File → Download → As .zip
3. Extract the files

### Step 2: Initialize gscript Project

```bash
gscript init my-project
cd my-project
```

### Step 3: Copy Your Code

Copy your `.gs` files to the `src/` directory and rename them to `.ts`:

```bash
cp ~/Downloads/your-project/*.gs src/
rename 's/\.gs$/.ts/' src/*.gs
```

### Step 4: Add Type Annotations

Before:
```javascript
function sendEmail(recipient, subject, body) {
  GmailApp.sendEmail(recipient, subject, body);
}
```

After:
```typescript
function sendEmail(recipient: string, subject: string, body: string): void {
  GmailApp.sendEmail(recipient, subject, body);
}
```

### Step 5: Update API Usage

Run the compatibility checker:
```bash
gscript check
```

Fix any issues (or use auto-fix):
```bash
gscript check --fix
```

### Step 6: Configure Project

Update `.clasp.json` with your script ID:
```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  "rootDir": "./dist"
}
```

### Step 7: Build and Deploy

```bash
gscript build
clasp login
clasp push
```

---

## From clasp

Already using clasp? gscript builds on top of it!

### Key Differences

| Feature | clasp | gscript |
|---------|-------|---------|
| Compatibility checking | ❌ | ✅ |
| Auto-fix | ❌ | ✅ |
| Type definitions | Manual setup | Included |
| File bundling | Manual | Automatic |
| Development server | ❌ | ✅ (planned) |

### Migration Steps

#### 1. Install gscript

```bash
npm install --save-dev gscript
```

#### 2. Create gscript Configuration

```bash
# This creates gscript.config.json
gscript init
```

When prompted, choose "Use existing project" and it will read your `.clasp.json`.

#### 3. Update Project Structure

Move source files to `src/` if they're not already there:

```bash
mkdir -p src
mv *.ts src/
mv *.js src/
```

Update `.clasp.json`:
```json
{
  "scriptId": "your-script-id",
  "rootDir": "./dist"
}
```

#### 4. Update package.json Scripts

Before:
```json
{
  "scripts": {
    "push": "clasp push",
    "pull": "clasp pull"
  }
}
```

After:
```json
{
  "scripts": {
    "check": "gscript check",
    "build": "gscript build",
    "deploy": "gscript deploy",
    "push": "clasp push",
    "pull": "clasp pull"
  }
}
```

#### 5. Add Build Step to Workflow

Before:
```bash
# Old workflow
clasp push
```

After:
```bash
# New workflow
gscript check
gscript build
clasp push
```

Or simply:
```bash
npm run deploy
```

### Keeping Both Tools

gscript works alongside clasp! You can use:
- `gscript` for: checking, building, type safety
- `clasp` for: pulling, version management, logs

Example workflow:
```bash
# Check and build with gscript
gscript check --fix
gscript build

# Deploy with clasp
clasp push
clasp deploy --description "New feature"
```

---

## Common Migration Patterns

### Pattern 1: Multiple Files → Single Bundle

Before (clasp):
```
project/
├── utils.ts
├── main.ts
└── config.ts
```

Each file deployed separately.

After (gscript):
```
project/
├── src/
│   ├── utils.ts
│   ├── main.ts
│   └── config.ts
└── dist/
    └── Code.gs  ← All files bundled
```

**Migration:**
No changes needed to your code! gscript automatically bundles.

---

### Pattern 2: ES6 Imports/Exports → Global Scope

Before:
```typescript
// utils.ts
export function formatDate(date: Date): string {
  return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd');
}

// main.ts
import { formatDate } from './utils';

function myFunction() {
  const today = formatDate(new Date());
  Logger.log(today);
}
```

After building, gscript automatically converts to:
```javascript
// utils.ts content
function formatDate(date) {
  return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd');
}

// main.ts content
function myFunction() {
  const today = formatDate(new Date());
  Logger.log(today);
}
```

**Migration:**
Keep using imports/exports during development! gscript removes them during build.

---

### Pattern 3: Web APIs → Apps Script APIs

Before:
```typescript
// Using Web APIs (won't work in Apps Script)
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}
```

After:
```typescript
// Using Apps Script APIs
function fetchData() {
  const response = UrlFetchApp.fetch('https://api.example.com/data');
  const data = JSON.parse(response.getContentText());
  return data;
}
```

**Migration:**
Run `gscript check --fix` to automatically convert common patterns.

---

### Pattern 4: Environment Variables → Properties Service

Before:
```typescript
const API_KEY = process.env.API_KEY;
```

After:
```typescript
const API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');
```

**Setting Properties:**
```typescript
// In Apps Script, run once to set:
function setupProperties() {
  PropertiesService.getScriptProperties()
    .setProperty('API_KEY', 'your-api-key-here');
}
```

---

### Pattern 5: Node.js crypto → Utilities

Before:
```typescript
import crypto from 'crypto';

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function generateId(): string {
  return crypto.randomUUID();
}
```

After:
```typescript
function hashData(data: string): string {
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    data
  );
  return hash.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function generateId(): string {
  return Utilities.getUuid();
}
```

**Migration:**
gscript will warn about crypto usage and suggest alternatives.

---

## Breaking Changes

### Import/Export Statements

**What changed:**
Apps Script doesn't support ES6 modules.

**Migration:**
```typescript
// Before - won't work in Apps Script
export const CONFIG = { apiKey: 'xyz' };
export function helper() { }

// After - gscript removes exports
const CONFIG = { apiKey: 'xyz' };
function helper() { }
```

**Note:** Keep using exports during development! They're removed during build.

---

### Async/Await

**What changed:**
Async/await requires V8 runtime.

**Migration:**
Update `gscript.config.json`:
```json
{
  "runtime": "V8"
}
```

Or convert to callbacks:
```typescript
// V8 only
async function getData() {
  const response = await UrlFetchApp.fetch(url);
  return response;
}

// Works in both V8 and RHINO
function getData() {
  const response = UrlFetchApp.fetch(url);
  return response;
}
```

---

### Top-level await

**What changed:**
Not supported in Apps Script.

**Migration:**
```typescript
// Before - doesn't work
const data = await fetchData();

// After - wrap in function
function initialize() {
  const data = fetchData();
  return data;
}
```

---

### Class Private Fields (#)

**What changed:**
Private fields (#field) are not supported.

**Migration:**
```typescript
// Before
class MyClass {
  #privateField = 'secret';
}

// After - use convention
class MyClass {
  private _privateField = 'secret';
}
```

---

## Best Practices After Migration

### 1. Use Type Definitions

```typescript
// Good - types help catch errors
function sendEmail(to: string, subject: string): void {
  GmailApp.sendEmail(to, subject, 'Body');
}

// Better - use Apps Script types
function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutput('Hello');
}
```

### 2. Run Checks Regularly

```bash
# Before committing
gscript check

# In CI/CD
gscript check --strict
```

### 3. Enable Strict Mode

In `gscript.config.json`:
```json
{
  "compatibility": {
    "strictMode": true,
    "warningsAsErrors": true
  }
}
```

### 4. Use Modern JavaScript

With V8 runtime, you can use:
- Arrow functions
- Template literals
- Destructuring
- Spread operator
- Classes
- async/await

```typescript
// Modern syntax (V8)
const greet = (name: string) => `Hello, ${name}!`;

const { email, name } = user;

const merged = { ...defaults, ...userSettings };
```

### 5. Organize Code

```
src/
├── index.ts              # Entry point
├── config/
│   └── constants.ts      # Configuration
├── services/
│   ├── gmail.ts          # Gmail operations
│   ├── sheets.ts         # Sheets operations
│   └── drive.ts          # Drive operations
└── utils/
    ├── formatting.ts     # Utility functions
    └── validation.ts     # Validators
```

---

## Troubleshooting Migration

### Issue: "Cannot find module" errors

**Solution:**
Remove actual import statements for Apps Script globals:
```typescript
// Remove this
import { GmailApp } from 'google-apps-script';

// Globals are automatically available
GmailApp.sendEmail(...);
```

### Issue: Build succeeds but deployment fails

**Solution:**
1. Check syntax errors in `dist/Code.gs`
2. Ensure all functions are globally accessible
3. Verify `.clasp.json` has correct script ID

### Issue: Types not working in IDE

**Solution:**
```bash
npm install --save-dev @types/google-apps-script
```

Ensure `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "types": ["google-apps-script"]
  }
}
```

---

## See Also

- [Getting Started Guide](./getting-started.md)
- [API Reference](./api-reference.md)
- [Compatibility Reference](./compatibility-reference.md)
- [clasp Documentation](https://github.com/google/clasp)
