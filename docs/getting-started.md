# Getting Started with gscript

## What is gscript?

gscript is a CLI tool that brings a TypeScript-like development experience to Google Apps Script. It provides:

- Real-time compatibility checking for Apps Script APIs
- Type definitions for autocomplete and IntelliSense
- Modern file structure with automatic bundling
- Auto-fix capabilities for common issues
- Seamless deployment to Apps Script

## Installation

### Global Installation

```bash
npm install -g gscript
```

### Project Installation

```bash
npm install --save-dev gscript
```

## Quick Start

### 1. Create a New Project

```bash
# Create a new project
gscript init my-apps-script-project
cd my-apps-script-project

# Install dependencies
npm install
```

This creates:
```
my-apps-script-project/
├── src/
│   └── main.ts          # Your source code
├── gscript.config.json  # Configuration
├── .clasp.json          # Apps Script project config
└── package.json
```

### 2. Write Your Code

Edit `src/main.ts`:

```typescript
/**
 * Responds to HTTP GET requests
 */
function doGet(e: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutput('<h1>Hello, World!</h1>');
}

/**
 * Sample function that uses Apps Script services
 */
function myFunction() {
  // Send an email
  GmailApp.sendEmail(
    'user@example.com',
    'Test Email',
    'This is a test email from Apps Script!'
  );

  // Log to Apps Script console
  Logger.log('Email sent successfully!');
}
```

### 3. Check for Compatibility Issues

```bash
gscript check
```

Example output:
```
✓ Compatibility check passed! No issues found.
```

If there are issues:
```
error: Incompatible API usage (GLOBAL_FETCH)
  --> src/main.ts:5:10
   |
5  | const response = fetch('https://api.example.com');
   |                  ^^^^^
   |
   = help: Use UrlFetchApp.fetch() instead
   = docs: https://developers.google.com/apps-script/reference/url-fetch
```

### 4. Auto-fix Issues

```bash
gscript check --fix
```

This automatically fixes common issues like:
- `fetch()` → `UrlFetchApp.fetch()`
- `crypto.randomUUID()` → `Utilities.getUuid()`
- Removes import/export statements

### 5. Build Your Project

```bash
gscript build
```

This creates:
```
dist/
├── Code.gs           # Bundled code for Apps Script
└── appsscript.json   # Apps Script manifest
```

### 6. Deploy to Apps Script

First, create an Apps Script project:
1. Visit https://script.google.com
2. Create a new project
3. Copy the script ID from the URL

Update `.clasp.json` with your script ID:
```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  "rootDir": "./dist"
}
```

Deploy:
```bash
# Install clasp if you haven't already
npm install -g @google/clasp

# Login to Google
clasp login

# Deploy
gscript deploy
```

## Project Structure

### Recommended Structure

```
project/
├── src/
│   ├── main.ts           # Entry point
│   ├── utils/
│   │   ├── email.ts
│   │   └── logging.ts
│   └── services/
│       ├── gmail.ts
│       └── sheets.ts
├── tests/
│   └── main.test.ts
├── dist/                  # Generated (gitignored)
│   ├── Code.gs
│   └── appsscript.json
├── gscript.config.json
├── .clasp.json
└── package.json
```

### File Organization

- **src/**: All your TypeScript source files
- **tests/**: Test files (automatically excluded from build)
- **dist/**: Build output (don't edit manually)

## Configuration

### gscript.config.json

```json
{
  "projectId": "your-script-id",
  "runtime": "V8",
  "timeZone": "America/New_York",
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/drive"
  ],
  "webApp": {
    "access": "ANYONE_ANONYMOUS",
    "executeAs": "USER_ACCESSING"
  },
  "compatibility": {
    "strictMode": true,
    "warningsAsErrors": false
  }
}
```

**Key Options:**
- `runtime`: `"V8"` (modern) or `"RHINO"` (legacy)
- `timeZone`: IANA time zone identifier
- `strictMode`: Enforce strict compatibility checking
- `warningsAsErrors`: Treat warnings as errors

## Common Workflows

### Development Workflow

```bash
# 1. Make changes to src/
# 2. Check for issues
gscript check

# 3. Build
gscript build

# 4. Deploy
clasp push
```

### Testing Changes

```bash
# Run tests (when implemented)
gscript test

# Check specific files
gscript check src/utils/email.ts
```

### Deployment Workflow

```bash
# Build with version
gscript build

# Deploy with description
gscript deploy --version 1.2.0 --description "Added email notifications"
```

## IDE Setup

### VS Code

1. Install recommended extensions:
   - TypeScript and JavaScript Language Features (built-in)
   - ESLint

2. Your project already includes TypeScript configuration

3. Enjoy autocomplete and type checking!

### IntelliJ IDEA / WebStorm

1. Open the project
2. TypeScript is automatically detected
3. Enable ESLint in preferences

## Troubleshooting

### "Module not found" errors

Make sure you've run `npm install`:
```bash
npm install
```

### Build fails with compatibility errors

Run the check command to see detailed errors:
```bash
gscript check
```

Try auto-fix:
```bash
gscript check --fix
```

### Deployment fails

1. Make sure you're logged in:
   ```bash
   clasp login
   ```

2. Verify your script ID in `.clasp.json`

3. Check you have the necessary permissions

### Type errors in IDE

Make sure `@types/google-apps-script` is installed:
```bash
npm install --save-dev @types/google-apps-script
```

## Next Steps

- Read the [API Reference](./api-reference.md) for all CLI commands
- Check the [Compatibility Reference](./compatibility-reference.md) for supported APIs
- See the [Migration Guide](./migration-guide.md) if you're coming from clasp

## Getting Help

- GitHub Issues: https://github.com/your-org/gscript/issues
- Documentation: https://github.com/your-org/gscript/docs
- Apps Script Reference: https://developers.google.com/apps-script
