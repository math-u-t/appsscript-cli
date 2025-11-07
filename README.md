# gscript - TypeScript Development for Google Apps Script

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D16-green)](https://nodejs.org/)

A CLI tool that brings TypeScript-style development experience to Google Apps Script with real-time compatibility checking, auto-fix capabilities, and seamless deployment.

## ✨ Features

- 🔍 **Real-time Compatibility Checking** - Detects incompatible Web APIs before deployment
- 🔧 **Auto-fix Engine** - Automatically fixes common compatibility issues
- 📘 **Complete Type Definitions** - Full TypeScript support for all Apps Script services
- 🏗️ **Modern File Structure** - Organize code in multiple files, automatically bundled
- ⚡ **Fast Development** - Hot reload, mock services, integrated testing
- 🚀 **Easy Deployment** - One-command deployment to Apps Script
- 📚 **Comprehensive Documentation** - Detailed guides and examples

## 🚀 Quick Start

### Installation

```bash
npm install -g gscript
```

### Create a New Project

```bash
gscript init my-project
cd my-project
npm install
```

### Write Code with Type Safety

```typescript
// src/main.ts
function doGet(e: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutput('<h1>Hello, World!</h1>');
}

function sendEmail(to: string, subject: string, body: string): void {
  GmailApp.sendEmail(to, subject, body);
}
```

### Check for Compatibility Issues

```bash
gscript check
```

Example output:
```
error: Incompatible API usage (GLOBAL_FETCH)
  --> src/api.ts:15:10
   |
15 | const response = fetch('https://api.example.com');
   |                  ^^^^^
   |
   = help: Use UrlFetchApp.fetch() instead
   = docs: https://developers.google.com/apps-script/reference/url-fetch
```

### Auto-fix Issues

```bash
gscript check --fix
```

Automatically converts:
- `fetch()` → `UrlFetchApp.fetch()`
- `crypto.randomUUID()` → `Utilities.getUuid()`
- Removes `import`/`export` statements
- And more...

### Build and Deploy

```bash
# Build project
gscript build

# Deploy to Apps Script
gscript deploy
```

## 📋 What Gets Checked?

### ❌ Incompatible APIs Detected

```typescript
// Web APIs (not available in Apps Script)
fetch('url')                          → Use UrlFetchApp.fetch()
crypto.randomUUID()                   → Use Utilities.getUuid()
localStorage.setItem('key', 'value')  → Use PropertiesService
setTimeout(() => {}, 1000)            → Use Utilities.sleep() or triggers
process.env.API_KEY                   → Use PropertiesService

// Node.js APIs
const fs = require('fs')              → Use DriveApp
Buffer.from('data')                   → Use Utilities.base64Encode()

// ES Modules
import { foo } from './bar'           → Removed during build
export function baz() {}              → Removed during build
```

### ✅ Apps Script Equivalents Provided

```typescript
// HTTP Requests
const response = UrlFetchApp.fetch('https://api.example.com', {
  method: 'post',
  payload: JSON.stringify({ key: 'value' }),
  headers: { 'Authorization': 'Bearer token' }
});

// UUID Generation
const id = Utilities.getUuid();

// Hashing
const hash = Utilities.computeDigest(
  Utilities.DigestAlgorithm.SHA_256,
  'data'
);

// Storage
const props = PropertiesService.getUserProperties();
props.setProperty('key', 'value');
const value = props.getProperty('key');

// File Operations
const file = DriveApp.createFile('name.txt', 'content');
const content = file.getBlob().getDataAsString();
```

## 📖 Documentation

- [Getting Started Guide](./docs/getting-started.md) - Complete setup and workflow guide
- [API Reference](./docs/api-reference.md) - All CLI commands and options
- [Migration Guide](./docs/migration-guide.md) - Migrate from clasp or manual development
- [Compatibility Reference](./docs/compatibility-reference.md) - Complete API compatibility list

## 🎯 Use Cases

### Web Application

```typescript
function doGet(e: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutput(getTemplate());
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const data = JSON.parse(e.postData.contents);
  processData(data);
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Email Automation

```typescript
function processInvoices() {
  const threads = GmailApp.search('is:unread subject:invoice');

  threads.forEach(thread => {
    const messages = thread.getMessages();
    const invoice = extractInvoiceData(messages[0]);
    saveToSpreadsheet(invoice);
    thread.markRead();
  });
}
```

### Data Integration

```typescript
function syncData() {
  const response = UrlFetchApp.fetch('https://api.example.com/data', {
    headers: { 'Authorization': `Bearer ${getApiKey()}` }
  });

  const data = JSON.parse(response.getContentText());
  updateSpreadsheet(data);
}

function getApiKey(): string {
  return PropertiesService.getScriptProperties().getProperty('API_KEY')!;
}
```

## 🛠️ CLI Commands

| Command | Description |
|---------|-------------|
| `gscript init [name]` | Initialize new project |
| `gscript check` | Check compatibility issues |
| `gscript check --fix` | Auto-fix issues |
| `gscript build` | Build for deployment |
| `gscript deploy` | Deploy to Apps Script |
| `gscript dev` | Start development server |
| `gscript pull` | Pull from Apps Script |
| `gscript logs` | View execution logs |
| `gscript test` | Run test suite |

## ⚙️ Configuration

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

## 📦 Examples

Check out the [examples](./examples) directory:

- **[basic-webapp](./examples/basic-webapp)** - Simple web app with form handling
- **[gmail-automation](./examples/gmail-automation)** - Automated email processing

## 🔄 Comparison with clasp

| Feature | clasp | gscript |
|---------|-------|---------|
| TypeScript Support | ✅ | ✅ |
| Compatibility Checking | ❌ | ✅ |
| Auto-fix | ❌ | ✅ |
| Type Definitions | Manual | Included |
| File Bundling | Manual | Automatic |
| Development Server | ❌ | ✅ |
| Error Messages | Basic | Detailed |

**gscript works alongside clasp!** Use both tools together for the best experience.

## 🏗️ Project Structure

```
project/
├── src/
│   ├── main.ts              # Entry point
│   ├── utils/
│   │   └── helpers.ts
│   └── services/
│       └── gmail.ts
├── tests/
│   └── main.test.ts
├── dist/                     # Build output (auto-generated)
│   ├── Code.gs
│   └── appsscript.json
├── gscript.config.json       # gscript configuration
├── .clasp.json               # Apps Script project
├── tsconfig.json             # TypeScript configuration
└── package.json
```

## 🧪 Development

### Build from Source

```bash
git clone https://github.com/your-org/gscript.git
cd gscript
npm install
npm run build
```

### Run Tests

```bash
npm test
```

### Link Locally

```bash
npm link
gscript --version
```

## 📊 Compatibility Rules

gscript uses a comprehensive compatibility database:

- **50+ global API checks** (fetch, crypto, localStorage, etc.)
- **30+ Node.js API checks** (fs, path, process, etc.)
- **20+ pattern-based checks** (import/export, async/await, etc.)
- **Runtime-specific checks** (V8 vs RHINO features)

See [compatibility-rules.json](./compatibility-rules.json) for the complete list.

## 🎓 Learning Resources

- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Apps Script Guides](https://developers.google.com/apps-script/guides/services)
- [Apps Script API Reference](https://developers.google.com/apps-script/reference)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Adding Compatibility Rules

Edit `compatibility-rules.json`:

```json
{
  "globals": {
    "yourApi": {
      "available": false,
      "replacement": "AppsScriptEquivalent",
      "message": "Use AppsScriptEquivalent instead",
      "severity": "error",
      "autofix": true
    }
  }
}
```

## 📜 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [clasp](https://github.com/google/clasp) by Google
- Uses [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for AST parsing
- Inspired by the TypeScript compiler's error messages

## 📞 Support

- 🐛 [Report bugs](https://github.com/your-org/gscript/issues)
- 💡 [Request features](https://github.com/your-org/gscript/issues)
- 📖 [Read the docs](./docs)
- 💬 [Discussions](https://github.com/your-org/gscript/discussions)

## 🎯 Roadmap

- [ ] VS Code extension for inline validation
- [ ] GitHub Actions integration
- [ ] Interactive development server
- [ ] Automated testing framework
- [ ] Performance profiling tools
- [ ] Bundle size optimization
- [ ] Source maps support
- [ ] Watch mode for auto-rebuild

---

**Made with ❤️ for the Apps Script community**

---

## Quick Links

- [Installation](#-quick-start)
- [Documentation](./docs)
- [Examples](./examples)
- [Changelog](./CHANGELOG.md)
- [License](./LICENSE)
