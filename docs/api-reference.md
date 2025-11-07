# API Reference

Complete reference for all gscript CLI commands and configuration options.

## Commands

### `gscript init [project-name]`

Initialize a new Apps Script project.

**Arguments:**
- `project-name` (optional): Name of the project directory to create

**Examples:**
```bash
# Initialize in current directory
gscript init

# Create new directory
gscript init my-project
```

**Created Files:**
- `gscript.config.json` - Configuration file
- `src/main.ts` - Sample source file
- `.clasp.json` - Apps Script project configuration
- `package.json` - Node.js package configuration
- `.gitignore` - Git ignore rules

---

### `gscript check`

Run compatibility checks on your source code.

**Options:**
- `--fix`: Automatically fix issues where possible
- `--strict`: Treat warnings as errors

**Examples:**
```bash
# Check for issues
gscript check

# Check and auto-fix
gscript check --fix

# Strict mode
gscript check --strict
```

**Exit Codes:**
- `0`: No errors found
- `1`: Errors found

**Output:**
```
error: Incompatible API usage (GLOBAL_FETCH)
  --> src/main.ts:15:10
   |
15 | const hash = crypto.subtle.digest('SHA-256', data);
   |              ^^^^^^^^^^^^^^^^^^^^
   |
   = note: crypto.subtle is not available in Apps Script
   = help: Use Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data)
   = docs: https://developers.google.com/apps-script/reference/utilities
```

---

### `gscript build`

Build your project for deployment.

**Options:**
- `--output <path>`: Output file path (default: `dist/Code.gs`)
- `--no-check`: Skip compatibility checks before building

**Examples:**
```bash
# Standard build
gscript build

# Custom output location
gscript build --output build/Code.gs

# Skip compatibility check (faster, not recommended)
gscript build --no-check
```

**Output:**
- `dist/Code.gs` - Bundled source code
- `dist/appsscript.json` - Apps Script manifest

**Build Process:**
1. Run compatibility checks (unless `--no-check`)
2. Find all source files in `src/`
3. Remove import/export statements
4. Sort files by dependencies
5. Concatenate into single file
6. Generate manifest

---

### `gscript deploy`

Deploy to Google Apps Script.

**Options:**
- `--project-id <id>`: Apps Script project ID
- `--version <version>`: Version number for this deployment
- `--description <desc>`: Version description
- `--web-app`: Deploy as web application
- `--api`: Deploy as API executable
- `--execute-as <mode>`: Execution mode (`USER_ACCESSING` or `USER_DEPLOYING`)
- `--access <mode>`: Access mode

**Examples:**
```bash
# Deploy using config file
gscript deploy

# Deploy specific project
gscript deploy --project-id abc123xyz

# Deploy with version info
gscript deploy --version 1.2.3 --description "Bug fixes"

# Deploy as web app
gscript deploy --web-app --execute-as USER_ACCESSING --access ANYONE
```

**Prerequisites:**
- `.clasp.json` configured with script ID
- `clasp` installed and authenticated
- Project built (automatically runs build if needed)

---

### `gscript dev`

Start development server with hot reload.

**Options:**
- `--port <port>`: Server port (default: `3000`)
- `--no-open`: Don't automatically open browser

**Examples:**
```bash
# Start dev server
gscript dev

# Custom port
gscript dev --port 8080

# Don't open browser
gscript dev --no-open
```

**Features:**
- Hot reload on file changes
- Mock Apps Script services
- Built-in test runner
- Debug console

*Note: Development server is currently in development*

---

### `gscript pull`

Pull code from Apps Script to local files.

**Options:**
- `--project-id <id>`: Apps Script project ID

**Examples:**
```bash
# Pull from config
gscript pull

# Pull specific project
gscript pull --project-id abc123xyz
```

*Note: This command uses clasp internally*

---

### `gscript logs`

View execution logs from Apps Script.

**Options:**
- `--project-id <id>`: Apps Script project ID
- `--tail`: Follow logs in real-time

**Examples:**
```bash
# View logs
gscript logs

# Follow logs
gscript logs --tail

# Specific project
gscript logs --project-id abc123xyz
```

*Note: Logs functionality is currently in development*

---

### `gscript test`

Run test suite.

**Options:**
- `--watch`: Run in watch mode

**Examples:**
```bash
# Run tests once
gscript test

# Watch mode
gscript test --watch
```

*Note: Test runner is currently in development*

---

## Configuration

### gscript.config.json

Configuration file for your gscript project.

```typescript
interface GScriptConfig {
  // Apps Script project ID
  projectId?: string;

  // Runtime version: "V8" (modern) or "RHINO" (legacy)
  runtime: "V8" | "RHINO";

  // IANA time zone identifier
  timeZone: string;

  // External libraries (Apps Script libraries)
  dependencies?: Record<string, string>;

  // OAuth 2.0 scopes required by your script
  oauthScopes?: string[];

  // Web app configuration
  webApp?: {
    access: "MYSELF" | "DOMAIN" | "ANYONE" | "ANYONE_ANONYMOUS";
    executeAs: "USER_ACCESSING" | "USER_DEPLOYING";
  };

  // Compatibility checking options
  compatibility?: {
    strictMode: boolean;
    warningsAsErrors: boolean;
  };

  // File patterns to exclude from build
  excludePatterns?: string[];
}
```

### Default Configuration

```json
{
  "runtime": "V8",
  "timeZone": "America/New_York",
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request"
  ],
  "compatibility": {
    "strictMode": true,
    "warningsAsErrors": false
  },
  "excludePatterns": [
    "node_modules/**",
    "dist/**",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### OAuth Scopes

Common scopes:

```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/calendar"
  ]
}
```

Full list: https://developers.google.com/identity/protocols/oauth2/scopes

### Web App Configuration

**Access Levels:**
- `MYSELF`: Only you can access
- `DOMAIN`: Anyone in your Google Workspace domain
- `ANYONE`: Anyone with a Google account
- `ANYONE_ANONYMOUS`: Anyone, even without a Google account

**Execute As:**
- `USER_ACCESSING`: Run as the user accessing the web app
- `USER_DEPLOYING`: Run as you (the developer)

Example:
```json
{
  "webApp": {
    "access": "ANYONE_ANONYMOUS",
    "executeAs": "USER_DEPLOYING"
  }
}
```

---

## TypeScript Configuration

gscript works with standard TypeScript configuration.

### Recommended tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["google-apps-script"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Environment Variables

gscript respects these environment variables:

- `GSCRIPT_CONFIG`: Path to config file (default: `./gscript.config.json`)
- `GSCRIPT_SRC_DIR`: Source directory (default: `./src`)
- `GSCRIPT_DIST_DIR`: Output directory (default: `./dist`)

Example:
```bash
GSCRIPT_SRC_DIR=./source gscript build
```

---

## Exit Codes

All commands use standard exit codes:

- `0`: Success
- `1`: Error (compatibility issues, build failure, etc.)

---

## Programmatic API

You can also use gscript programmatically:

```typescript
import { CompatibilityChecker, Builder } from 'gscript';

// Load config
const config = await configLoader.load();

// Check compatibility
const checker = new CompatibilityChecker(config);
const issues = await checker.checkProject('./src');

// Build
const builder = new Builder(config);
const result = await builder.build('./src', './dist/Code.gs');
```

---

## See Also

- [Getting Started Guide](./getting-started.md)
- [Migration Guide](./migration-guide.md)
- [Compatibility Reference](./compatibility-reference.md)
