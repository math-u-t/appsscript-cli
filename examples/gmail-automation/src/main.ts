/**
 * Gmail Automation Example
 *
 * This example demonstrates:
 * - Email processing
 * - Label management
 * - Automated responses
 * - Type-safe Gmail operations
 */

/**
 * Configuration
 */
const CONFIG = {
  labelName: 'AutoProcessed',
  searchQuery: 'is:unread subject:invoice',
  notificationEmail: 'admin@example.com'
};

/**
 * Main function - processes unread invoices
 * Set this up as a time-driven trigger (e.g., every hour)
 */
function processInvoices(): void {
  const label = getOrCreateLabel(CONFIG.labelName);
  const threads = GmailApp.search(CONFIG.searchQuery);

  Logger.log(`Found ${threads.length} invoice emails to process`);

  let processedCount = 0;

  threads.forEach(thread => {
    try {
      const messages = thread.getMessages();
      const latestMessage = messages[messages.length - 1];

      // Extract invoice data
      const invoiceData = extractInvoiceData(latestMessage);

      // Process the invoice
      if (invoiceData) {
        processInvoice(invoiceData);

        // Mark as processed
        thread.addLabel(label);
        thread.markRead();

        processedCount++;
      }
    } catch (error) {
      Logger.log(`Error processing thread ${thread.getId()}: ${error}`);
    }
  });

  // Send summary notification
  if (processedCount > 0) {
    sendNotification(processedCount);
  }

  Logger.log(`Processed ${processedCount} invoices`);
}

/**
 * Gets or creates a Gmail label
 */
function getOrCreateLabel(labelName: string): GmailLabel {
  let label = GmailApp.getUserLabelByName(labelName);

  if (!label) {
    label = GmailApp.createLabel(labelName);
    Logger.log(`Created new label: ${labelName}`);
  }

  return label;
}

/**
 * Extracts invoice data from email
 */
function extractInvoiceData(message: GmailMessage): InvoiceData | null {
  const subject = message.getSubject();
  const body = message.getPlainBody();
  const from = message.getFrom();

  // Simple extraction (in real app, use regex or parsing library)
  const invoiceNumberMatch = body.match(/Invoice #(\w+)/i);
  const amountMatch = body.match(/Total: \$?([\d,]+\.?\d*)/i);

  if (!invoiceNumberMatch || !amountMatch) {
    Logger.log(`Could not extract invoice data from: ${subject}`);
    return null;
  }

  return {
    invoiceNumber: invoiceNumberMatch[1],
    amount: parseFloat(amountMatch[1].replace(',', '')),
    vendor: from,
    date: message.getDate(),
    subject
  };
}

/**
 * Processes an invoice
 */
function processInvoice(invoice: InvoiceData): void {
  Logger.log(`Processing invoice ${invoice.invoiceNumber} for $${invoice.amount}`);

  // Save to spreadsheet (example)
  saveToSpreadsheet(invoice);

  // Send to accounting system (example)
  // sendToAccountingSystem(invoice);
}

/**
 * Saves invoice data to a Google Sheet
 */
function saveToSpreadsheet(invoice: InvoiceData): void {
  // In real app, use actual spreadsheet ID
  const spreadsheetId = PropertiesService.getScriptProperties()
    .getProperty('INVOICE_SPREADSHEET_ID');

  if (!spreadsheetId) {
    Logger.log('No spreadsheet configured');
    return;
  }

  try {
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();

    sheet.appendRow([
      invoice.date,
      invoice.invoiceNumber,
      invoice.vendor,
      invoice.amount,
      invoice.subject
    ]);

    Logger.log(`Saved invoice ${invoice.invoiceNumber} to spreadsheet`);
  } catch (error) {
    Logger.log(`Error saving to spreadsheet: ${error}`);
  }
}

/**
 * Sends notification email
 */
function sendNotification(count: number): void {
  const subject = `Invoice Processing Summary`;
  const body = `Processed ${count} invoice(s) automatically.\n\nCheck the spreadsheet for details.`;

  try {
    GmailApp.sendEmail(CONFIG.notificationEmail, subject, body);
    Logger.log(`Sent notification to ${CONFIG.notificationEmail}`);
  } catch (error) {
    Logger.log(`Error sending notification: ${error}`);
  }
}

/**
 * Setup function - run once to configure
 */
function setup(): void {
  // Create label
  getOrCreateLabel(CONFIG.labelName);

  // Set spreadsheet ID (replace with actual ID)
  const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
  PropertiesService.getScriptProperties()
    .setProperty('INVOICE_SPREADSHEET_ID', spreadsheetId);

  Logger.log('Setup complete!');
  Logger.log('Next steps:');
  Logger.log('1. Create a time-driven trigger for processInvoices()');
  Logger.log('2. Update CONFIG.notificationEmail');
  Logger.log('3. Update spreadsheet ID in this script');
}

/**
 * Types
 */
interface InvoiceData {
  invoiceNumber: string;
  amount: number;
  vendor: string;
  date: Date;
  subject: string;
}
