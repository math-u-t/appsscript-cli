/**
 * Basic Web App Example
 *
 * This example demonstrates:
 * - Web app entry points (doGet, doPost)
 * - Using Apps Script services
 * - Type-safe development
 */

/**
 * Handles HTTP GET requests
 * Displays a simple HTML form
 */
function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
          }
          input, textarea {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            box-sizing: border-box;
          }
          button {
            background: #4285f4;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 4px;
          }
          button:hover {
            background: #357ae8;
          }
        </style>
      </head>
      <body>
        <h1>Apps Script Web App</h1>
        <p>Built with gscript CLI</p>

        <form method="POST">
          <input type="text" name="name" placeholder="Your Name" required>
          <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setTitle('Basic Web App')
    .setFaviconUrl('https://www.google.com/images/icons/product/apps_script-32.png');
}

/**
 * Handles HTTP POST requests
 * Processes form submissions
 */
function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.HTML.HtmlOutput {
  const name = e.parameter.name;
  const message = e.parameter.message;

  // Log the submission
  Logger.log(`Received submission from ${name}: ${message}`);

  // Save to properties (simple database)
  saveSubmission(name, message);

  // Return success page
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .success {
            color: #0f9d58;
            font-size: 24px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="success">✓ Submission Received!</div>
        <p>Thank you, ${name}!</p>
        <p><a href="${ScriptApp.getService().getUrl()}">Submit Another</a></p>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html);
}

/**
 * Saves submission to script properties
 */
function saveSubmission(name: string, message: string): void {
  const props = PropertiesService.getScriptProperties();
  const timestamp = new Date().toISOString();
  const key = `submission_${timestamp}`;

  const data = {
    name,
    message,
    timestamp
  };

  props.setProperty(key, JSON.stringify(data));
}

/**
 * Gets all submissions
 */
function getSubmissions(): Array<{ name: string; message: string; timestamp: string }> {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();

  const submissions: Array<{ name: string; message: string; timestamp: string }> = [];

  for (const key in allProps) {
    if (key.startsWith('submission_')) {
      submissions.push(JSON.parse(allProps[key]));
    }
  }

  return submissions.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
