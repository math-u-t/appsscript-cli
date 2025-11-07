# Basic Web App Example

Simple web application built with gscript that demonstrates form handling and data persistence.

## Features

- HTTP GET/POST handling
- HTML form processing
- Data persistence with PropertiesService
- Type-safe development
- Modern TypeScript code

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create an Apps Script project:
   - Visit https://script.google.com
   - Create a new project
   - Copy the script ID from the URL

3. Update `.clasp.json` with your script ID:
```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  "rootDir": "./dist"
}
```

## Development

Check for compatibility issues:
```bash
npm run check
```

Build the project:
```bash
npm run build
```

## Deployment

1. Login to clasp:
```bash
clasp login
```

2. Deploy:
```bash
npm run deploy
```

3. Deploy as web app:
```bash
clasp deploy --description "Initial deployment"
```

4. Set up web app:
   - In Apps Script editor: Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click "Deploy"

## Usage

After deployment, you'll get a web app URL. Visit it to see the form in action!

## Code Structure

- `src/main.ts` - Main application logic
  - `doGet()` - Handles HTTP GET requests, displays form
  - `doPost()` - Handles HTTP POST requests, processes submissions
  - `saveSubmission()` - Saves data to properties
  - `getSubmissions()` - Retrieves all submissions

## How It Works

1. User visits the web app URL
2. `doGet()` returns HTML form
3. User submits form
4. `doPost()` processes the data
5. Data is saved to PropertiesService
6. Success page is displayed
