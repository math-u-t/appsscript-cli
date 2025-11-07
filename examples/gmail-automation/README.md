# Gmail Automation Example

Automated email processing system that monitors Gmail for invoices and processes them automatically.

## Features

- Searches for unread invoice emails
- Extracts invoice data from email body
- Saves to Google Sheets
- Sends summary notifications
- Label-based organization
- Error handling and logging

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create an Apps Script project and get the script ID

3. Update `.clasp.json` with your script ID

4. Create a Google Sheet for storing invoices

5. Update the script:
```typescript
// In src/main.ts, update:
const CONFIG = {
  notificationEmail: 'your-email@example.com'  // Your email
};

// In setup() function, update:
const spreadsheetId = 'YOUR_SPREADSHEET_ID';
```

## Development

Check and build:
```bash
npm run check
npm run build
```

## Deployment

Deploy to Apps Script:
```bash
npm run deploy
```

## Configuration

After deployment:

1. Run the `setup()` function once:
   - In Apps Script editor
   - Select "setup" from function dropdown
   - Click Run
   - Authorize the required permissions

2. Create a time-driven trigger:
   - Triggers → Add Trigger
   - Function: `processInvoices`
   - Event: Time-driven
   - Type: Hour timer
   - Interval: Every hour

## Usage

The script will automatically:
1. Check for new invoice emails every hour
2. Extract invoice data
3. Save to the spreadsheet
4. Mark emails as read and apply label
5. Send a summary email

## Customization

### Search Query

Modify `CONFIG.searchQuery` to match your invoice emails:
```typescript
const CONFIG = {
  searchQuery: 'is:unread from:vendor@example.com subject:invoice'
};
```

### Invoice Extraction

Update `extractInvoiceData()` to match your invoice format:
```typescript
function extractInvoiceData(message: GmailMessage): InvoiceData | null {
  // Add your custom extraction logic
}
```

## Monitoring

View logs:
```bash
gscript logs
```

Or in Apps Script editor:
- View → Logs

## Security

- Uses OAuth 2.0 for authorization
- Runs under your account
- Requires explicit permission grants
- Script properties for sensitive data
