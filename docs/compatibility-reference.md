# Compatibility Reference

Complete reference of APIs and features available in Google Apps Script.

## Quick Reference

✅ = Available
❌ = Not Available
⚠️ = Available with conditions

---

## Web APIs

### Fetch API

| API | Status | Apps Script Alternative |
|-----|--------|------------------------|
| `fetch()` | ❌ | `UrlFetchApp.fetch()` |
| `Request` | ❌ | `UrlFetchApp` options object |
| `Response` | ❌ | `HTTPResponse` |
| `Headers` | ❌ | Plain object |

**Example:**

```typescript
// ❌ Won't work
const response = await fetch('https://api.example.com/data');
const json = await response.json();

// ✅ Use this
const response = UrlFetchApp.fetch('https://api.example.com/data');
const json = JSON.parse(response.getContentText());
```

---

### Crypto API

| API | Status | Apps Script Alternative |
|-----|--------|------------------------|
| `crypto.subtle.digest()` | ❌ | `Utilities.computeDigest()` |
| `crypto.subtle.encrypt()` | ❌ | `Utilities.computeHmacSignature()` |
| `crypto.getRandomValues()` | ❌ | `Math.random()` |
| `crypto.randomUUID()` | ❌ | `Utilities.getUuid()` |

**Examples:**

```typescript
// ❌ crypto.randomUUID()
const id = crypto.randomUUID();

// ✅ Utilities.getUuid()
const id = Utilities.getUuid();

// ❌ crypto.subtle.digest()
const hash = await crypto.subtle.digest('SHA-256', data);

// ✅ Utilities.computeDigest()
const hash = Utilities.computeDigest(
  Utilities.DigestAlgorithm.SHA_256,
  data
);
```

---

### Storage APIs

| API | Status | Apps Script Alternative |
|-----|--------|------------------------|
| `localStorage` | ❌ | `PropertiesService.getUserProperties()` |
| `sessionStorage` | ❌ | `PropertiesService.getUserProperties()` |
| `IndexedDB` | ❌ | `PropertiesService` or Google Sheets |

**Example:**

```typescript
// ❌ localStorage
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');

// ✅ PropertiesService
const props = PropertiesService.getUserProperties();
props.setProperty('key', 'value');
const value = props.getProperty('key');
```

---

### Timers

| API | Status | Apps Script Alternative |
|-----|--------|------------------------|
| `setTimeout()` | ❌ | `Utilities.sleep()` or Time-driven triggers |
| `setInterval()` | ❌ | Time-driven triggers |
| `clearTimeout()` | ❌ | N/A |
| `clearInterval()` | ❌ | N/A |

**Examples:**

```typescript
// ❌ setTimeout
setTimeout(() => {
  console.log('Delayed');
}, 1000);

// ✅ Utilities.sleep (blocks execution)
Utilities.sleep(1000);
Logger.log('Delayed');

// ❌ setInterval
setInterval(() => {
  checkData();
}, 60000);

// ✅ Time-driven trigger (set up in Apps Script UI)
function checkData() {
  // This function runs every minute via trigger
}
```

---

### DOM APIs

| API | Status | Apps Script Alternative |
|-----|--------|------------------------|
| `window` | ❌ | N/A (server-side) |
| `document` | ❌ | `DocumentApp` for Google Docs |
| `console.log` | ✅ | `Logger.log()` recommended |
| `XMLHttpRequest` | ❌ | `UrlFetchApp.fetch()` |

---

### Node.js APIs

| API | Status | Apps Script Alternative |
|-----|--------|------------------------|
| `fs` | ❌ | `DriveApp` |
| `path` | ❌ | String manipulation |
| `process.env` | ❌ | `PropertiesService` |
| `Buffer` | ❌ | `Utilities.base64Encode/Decode()` |
| `require()` | ❌ | Apps Script Libraries |

**Examples:**

```typescript
// ❌ fs
const fs = require('fs');
const data = fs.readFileSync('file.txt', 'utf-8');

// ✅ DriveApp
const file = DriveApp.getFileById('file-id');
const data = file.getBlob().getDataAsString();

// ❌ process.env
const apiKey = process.env.API_KEY;

// ✅ PropertiesService
const apiKey = PropertiesService.getScriptProperties()
  .getProperty('API_KEY');
```

---

## JavaScript Features

### ES6+ Features

| Feature | V8 | RHINO | Notes |
|---------|-------|--------|-------|
| Arrow functions | ✅ | ❌ | Use V8 runtime |
| Template literals | ✅ | ❌ | Use V8 runtime |
| Destructuring | ✅ | ❌ | Use V8 runtime |
| Spread operator | ✅ | ❌ | Use V8 runtime |
| Rest parameters | ✅ | ❌ | Use V8 runtime |
| Default parameters | ✅ | ❌ | Use V8 runtime |
| `let` / `const` | ✅ | ❌ | Use V8 runtime |
| Classes | ✅ | ❌ | Use V8 runtime |
| `Promise` | ✅ | ❌ | Use V8 runtime |
| `async` / `await` | ✅ | ❌ | Use V8 runtime |
| Generators | ✅ | ❌ | Use V8 runtime |
| `Map` / `Set` | ✅ | ❌ | Use V8 runtime |
| `Symbol` | ✅ | ❌ | Use V8 runtime |

**V8 Runtime Configuration:**

```json
{
  "runtime": "V8"
}
```

---

### Module System

| Feature | Status | Notes |
|---------|--------|-------|
| `import` | ❌ | Removed during build |
| `export` | ❌ | Removed during build |
| `require()` | ❌ | Use Libraries |
| ES6 modules | ❌ | Global scope only |

**How gscript handles this:**

During development:
```typescript
// utils.ts
export function helper() { }

// main.ts
import { helper } from './utils';
```

After build:
```javascript
// All in one file, no imports/exports
function helper() { }
// ...
helper();
```

---

## Apps Script Services

### Base Services

| Service | Available | Description |
|---------|-----------|-------------|
| `Logger` | ✅ | Logging service |
| `Session` | ✅ | Session information |
| `Browser` | ✅ | Alert/prompt dialogs |
| `Utilities` | ✅ | Utility functions |
| `HtmlService` | ✅ | HTML output |
| `ContentService` | ✅ | Text output |
| `ScriptApp` | ✅ | Script management |

---

### Google Services

| Service | Available | Description | OAuth Scope |
|---------|-----------|-------------|-------------|
| `GmailApp` | ✅ | Gmail operations | `gmail.*` |
| `DriveApp` | ✅ | Google Drive | `drive.*` |
| `SpreadsheetApp` | ✅ | Google Sheets | `spreadsheets.*` |
| `DocumentApp` | ✅ | Google Docs | `documents.*` |
| `SlidesApp` | ✅ | Google Slides | `presentations.*` |
| `CalendarApp` | ✅ | Google Calendar | `calendar.*` |
| `FormApp` | ✅ | Google Forms | `forms.*` |
| `AdminDirectory` | ✅ | Admin SDK | `admin.directory.*` |

**Required Scopes Configuration:**

```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets"
  ]
}
```

---

### Network Services

| Service | Available | Description |
|---------|-----------|-------------|
| `UrlFetchApp` | ✅ | HTTP requests |
| `MailApp` | ✅ | Basic email |
| `XmlService` | ✅ | XML parsing |

---

## Common Patterns

### 1. HTTP Requests

```typescript
// ✅ GET request
const response = UrlFetchApp.fetch('https://api.example.com/data');
const data = JSON.parse(response.getContentText());

// ✅ POST request
const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
  method: 'post',
  contentType: 'application/json',
  payload: JSON.stringify({ key: 'value' }),
  headers: {
    'Authorization': 'Bearer ' + getToken()
  }
};
const response = UrlFetchApp.fetch('https://api.example.com/data', options);
```

---

### 2. Encoding/Hashing

```typescript
// ✅ Base64 encoding
const encoded = Utilities.base64Encode('Hello, World!');
const decoded = Utilities.base64Decode(encoded);

// ✅ SHA-256 hash
const hash = Utilities.computeDigest(
  Utilities.DigestAlgorithm.SHA_256,
  'data to hash'
);

// Convert to hex
const hexHash = hash
  .map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
  .join('');

// ✅ HMAC signature
const signature = Utilities.computeHmacSignature(
  Utilities.MacAlgorithm.HMAC_SHA_256,
  'message',
  'secret-key'
);
```

---

### 3. File Operations

```typescript
// ✅ Create file
const file = DriveApp.createFile('filename.txt', 'content', MimeType.PLAIN_TEXT);

// ✅ Read file
const file = DriveApp.getFileById('file-id');
const content = file.getBlob().getDataAsString();

// ✅ Update file
file.setContent('new content');

// ✅ List files
const files = DriveApp.getFiles();
while (files.hasNext()) {
  const file = files.next();
  Logger.log(file.getName());
}

// ✅ Search files
const files = DriveApp.searchFiles('title contains "report"');
```

---

### 4. Key-Value Storage

```typescript
// ✅ User properties (per user)
const userProps = PropertiesService.getUserProperties();
userProps.setProperty('theme', 'dark');
const theme = userProps.getProperty('theme');

// ✅ Script properties (per script)
const scriptProps = PropertiesService.getScriptProperties();
scriptProps.setProperties({
  'API_KEY': 'xyz123',
  'API_URL': 'https://api.example.com'
});

// ✅ Document properties (per document)
const docProps = PropertiesService.getDocumentProperties();
docProps.setProperty('version', '1.0.0');
```

---

### 5. Date/Time Operations

```typescript
// ✅ Format date
const formatted = Utilities.formatDate(
  new Date(),
  Session.getScriptTimeZone(),
  'yyyy-MM-dd HH:mm:ss'
);

// ✅ Parse date
const date = Utilities.parseDate(
  '2024-01-15',
  Session.getScriptTimeZone(),
  'yyyy-MM-dd'
);

// ✅ Sleep/delay
Utilities.sleep(1000); // 1 second
```

---

### 6. Email Operations

```typescript
// ✅ Simple email
GmailApp.sendEmail(
  'user@example.com',
  'Subject',
  'Plain text body'
);

// ✅ HTML email with attachments
GmailApp.sendEmail('user@example.com', 'Subject', 'Text body', {
  htmlBody: '<h1>HTML Body</h1>',
  attachments: [DriveApp.getFileById('file-id').getBlob()],
  cc: 'cc@example.com',
  bcc: 'bcc@example.com',
  name: 'Sender Name',
  replyTo: 'reply@example.com'
});

// ✅ Search emails
const threads = GmailApp.search('subject:invoice is:unread');
threads.forEach(thread => {
  const messages = thread.getMessages();
  // Process messages
});
```

---

### 7. Spreadsheet Operations

```typescript
// ✅ Get active spreadsheet
const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getActiveSheet();

// ✅ Read data
const data = sheet.getDataRange().getValues();

// ✅ Write data
sheet.getRange('A1:B2').setValues([
  ['Header 1', 'Header 2'],
  ['Value 1', 'Value 2']
]);

// ✅ Format cells
sheet.getRange('A1:B1')
  .setFontWeight('bold')
  .setBackground('#4285f4')
  .setFontColor('#ffffff');
```

---

## Performance Considerations

### Execution Time Limits

| Account Type | Limit |
|--------------|-------|
| Free | 6 minutes |
| Workspace | 30 minutes |

**Best Practices:**
- Use batch operations
- Cache results with `CacheService`
- Use time-driven triggers for long operations

---

### Quota Limits

Common quotas (daily, for free accounts):

| Service | Limit |
|---------|-------|
| Email recipients | 100 |
| URL Fetch calls | 20,000 |
| Script runtime | 90 minutes |
| Triggers | 20 |

Full list: https://developers.google.com/apps-script/guides/services/quotas

---

## Error Codes

Common gscript error codes:

| Code | Description |
|------|-------------|
| `GLOBAL_*` | Using unavailable global API |
| `API_*` | Using unavailable API method |
| `IMPORT_NOT_SUPPORTED` | ES6 import statement |
| `EXPORT_NOT_SUPPORTED` | ES6 export statement |
| `PARSE_ERROR` | Syntax error in file |
| `ASYNC_AWAIT_RUNTIME` | async/await with RHINO runtime |

---

## See Also

- [Getting Started Guide](./getting-started.md)
- [API Reference](./api-reference.md)
- [Migration Guide](./migration-guide.md)
- [Apps Script Reference](https://developers.google.com/apps-script/reference)
