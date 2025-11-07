/**
 * Google Apps Script Type Definitions
 * Auto-generated for gscript CLI
 */

declare namespace GoogleAppsScript {
  export namespace Events {
    export interface DoGet {
      parameter: { [key: string]: string };
      parameters: { [key: string]: string[] };
      contextPath: string;
      contentLength: number;
      queryString: string;
    }

    export interface DoPost extends DoGet {
      postData: {
        length: number;
        type: string;
        contents: string;
        name: string;
      };
    }
  }

  export namespace HTML {
    export interface HtmlOutput {
      append(content: string): HtmlOutput;
      appendUntrusted(content: string): HtmlOutput;
      asTemplate(): HtmlTemplate;
      clear(): HtmlOutput;
      getAs(contentType: string): Blob;
      getBlob(): Blob;
      getContent(): string;
      getFaviconUrl(): string;
      getHeight(): number;
      getMetaTags(): HtmlOutputMetaTag[];
      getTitle(): string;
      getWidth(): number;
      setContent(content: string): HtmlOutput;
      setFaviconUrl(iconUrl: string): HtmlOutput;
      setHeight(height: number): HtmlOutput;
      setSandboxMode(mode: SandboxMode): HtmlOutput;
      setTitle(title: string): HtmlOutput;
      setWidth(width: number): HtmlOutput;
      setXFrameOptionsMode(mode: XFrameOptionsMode): HtmlOutput;
      addMetaTag(name: string, content: string): HtmlOutput;
    }

    export interface HtmlTemplate {
      evaluate(): HtmlOutput;
      getCode(): string;
      getCodeWithComments(): string;
      getRawContent(): string;
    }

    export interface HtmlOutputMetaTag {
      getName(): string;
      getContent(): string;
    }

    export enum SandboxMode {
      EMULATED,
      IFRAME,
      NATIVE
    }

    export enum XFrameOptionsMode {
      ALLOWALL,
      DEFAULT
    }
  }

  export namespace Properties {
    export interface Properties {
      deleteAllProperties(): Properties;
      deleteProperty(key: string): Properties;
      getKeys(): string[];
      getProperties(): { [key: string]: string };
      getProperty(key: string): string | null;
      setProperties(properties: { [key: string]: string }): Properties;
      setProperties(properties: { [key: string]: string }, deleteAllOthers: boolean): Properties;
      setProperty(key: string, value: string): Properties;
    }
  }

  export namespace URL_Fetch {
    export interface HTTPResponse {
      getAllHeaders(): { [key: string]: string };
      getAs(contentType: string): Blob;
      getBlob(): Blob;
      getContent(): number[];
      getContentText(): string;
      getContentText(charset: string): string;
      getHeaders(): { [key: string]: string };
      getResponseCode(): number;
    }

    export interface URLFetchRequestOptions {
      contentType?: string;
      headers?: { [key: string]: string };
      method?: 'get' | 'delete' | 'patch' | 'post' | 'put';
      payload?: string | Blob | { [key: string]: any };
      followRedirects?: boolean;
      muteHttpExceptions?: boolean;
      validateHttpsCertificates?: boolean;
      escaping?: boolean;
    }
  }

  export namespace Base {
    export interface Logger {
      clear(): void;
      getLog(): string;
      log(data: any): Logger;
      log(format: string, ...values: any[]): Logger;
    }

    export interface Session {
      getActiveUser(): User;
      getEffectiveUser(): User;
      getScriptTimeZone(): string;
      getTemporaryActiveUserKey(): string;
    }

    export interface User {
      getEmail(): string;
      getUserLoginId(): string;
    }

    export interface Blob {
      copyBlob(): Blob;
      getAs(contentType: string): Blob;
      getAllBlobs(): Blob[];
      getBytes(): number[];
      getContentType(): string;
      getDataAsString(): string;
      getDataAsString(charset: string): string;
      getName(): string;
      isGoogleType(): boolean;
      setBytes(data: number[]): Blob;
      setContentType(contentType: string): Blob;
      setContentTypeFromExtension(): Blob;
      setDataFromString(string: string): Blob;
      setDataFromString(string: string, charset: string): Blob;
      setName(name: string): Blob;
    }
  }

  export namespace Utilities {
    export enum DigestAlgorithm {
      MD2,
      MD5,
      SHA_1,
      SHA_256,
      SHA_384,
      SHA_512
    }

    export enum MacAlgorithm {
      HMAC_MD5,
      HMAC_SHA_1,
      HMAC_SHA_256,
      HMAC_SHA_384,
      HMAC_SHA_512
    }

    export enum Charset {
      US_ASCII,
      UTF_8
    }
  }
}

// Global objects
declare const Logger: {
  clear(): void;
  getLog(): string;
  log(data: any): typeof Logger;
  log(format: string, ...values: any[]): typeof Logger;
};

declare const Session: {
  getActiveUser(): GoogleAppsScript.Base.User;
  getEffectiveUser(): GoogleAppsScript.Base.User;
  getScriptTimeZone(): string;
  getTemporaryActiveUserKey(): string;
};

declare const HtmlService: {
  createHtmlOutput(): GoogleAppsScript.HTML.HtmlOutput;
  createHtmlOutput(blob: Blob): GoogleAppsScript.HTML.HtmlOutput;
  createHtmlOutput(html: string): GoogleAppsScript.HTML.HtmlOutput;
  createHtmlOutputFromFile(filename: string): GoogleAppsScript.HTML.HtmlOutput;
  createTemplate(blob: Blob): GoogleAppsScript.HTML.HtmlTemplate;
  createTemplate(html: string): GoogleAppsScript.HTML.HtmlTemplate;
  createTemplateFromFile(filename: string): GoogleAppsScript.HTML.HtmlTemplate;
  getUserAgent(): string;
  SandboxMode: typeof GoogleAppsScript.HTML.SandboxMode;
  XFrameOptionsMode: typeof GoogleAppsScript.HTML.XFrameOptionsMode;
};

declare const PropertiesService: {
  getDocumentProperties(): GoogleAppsScript.Properties.Properties;
  getScriptProperties(): GoogleAppsScript.Properties.Properties;
  getUserProperties(): GoogleAppsScript.Properties.Properties;
};

declare const UrlFetchApp: {
  fetch(url: string): GoogleAppsScript.URL_Fetch.HTTPResponse;
  fetch(url: string, params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse;
  fetchAll(requests: Array<string | { url: string; params?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions }>): GoogleAppsScript.URL_Fetch.HTTPResponse[];
  getRequest(url: string): any;
  getRequest(url: string, params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): any;
};

declare const Utilities: {
  base64Decode(encoded: string): number[];
  base64Decode(encoded: string, charset: GoogleAppsScript.Utilities.Charset): number[];
  base64DecodeWebSafe(encoded: string): number[];
  base64DecodeWebSafe(encoded: string, charset: GoogleAppsScript.Utilities.Charset): number[];
  base64Encode(data: number[]): string;
  base64Encode(data: string): string;
  base64Encode(data: string, charset: GoogleAppsScript.Utilities.Charset): string;
  base64EncodeWebSafe(data: number[]): string;
  base64EncodeWebSafe(data: string): string;
  base64EncodeWebSafe(data: string, charset: GoogleAppsScript.Utilities.Charset): string;
  computeDigest(algorithm: GoogleAppsScript.Utilities.DigestAlgorithm, value: number[]): number[];
  computeDigest(algorithm: GoogleAppsScript.Utilities.DigestAlgorithm, value: string): number[];
  computeDigest(algorithm: GoogleAppsScript.Utilities.DigestAlgorithm, value: string, charset: GoogleAppsScript.Utilities.Charset): number[];
  computeHmacSignature(algorithm: GoogleAppsScript.Utilities.MacAlgorithm, value: number[], key: number[]): number[];
  computeHmacSignature(algorithm: GoogleAppsScript.Utilities.MacAlgorithm, value: string, key: string): number[];
  computeHmacSignature(algorithm: GoogleAppsScript.Utilities.MacAlgorithm, value: string, key: string, charset: GoogleAppsScript.Utilities.Charset): number[];
  formatDate(date: Date, timeZone: string, format: string): string;
  formatString(template: string, ...args: any[]): string;
  getUuid(): string;
  gzip(blob: Blob): Blob;
  gzip(blob: Blob, name: string): Blob;
  newBlob(data: number[]): Blob;
  newBlob(data: number[], contentType: string): Blob;
  newBlob(data: number[], contentType: string, name: string): Blob;
  newBlob(data: string): Blob;
  newBlob(data: string, contentType: string): Blob;
  newBlob(data: string, contentType: string, name: string): Blob;
  parseCsv(csv: string): string[][];
  parseCsv(csv: string, delimiter: string): string[][];
  parseDate(date: string, timeZone: string, format: string): Date;
  sleep(milliseconds: number): void;
  ungzip(blob: Blob): Blob;
  unzip(blob: Blob): Blob[];
  zip(blobs: Blob[]): Blob;
  zip(blobs: Blob[], name: string): Blob;
  DigestAlgorithm: typeof GoogleAppsScript.Utilities.DigestAlgorithm;
  MacAlgorithm: typeof GoogleAppsScript.Utilities.MacAlgorithm;
  Charset: typeof GoogleAppsScript.Utilities.Charset;
};

declare const ContentService: {
  createTextOutput(): TextOutput;
  createTextOutput(content: string): TextOutput;
  MimeType: {
    ATOM: string;
    CSV: string;
    ICAL: string;
    JAVASCRIPT: string;
    JSON: string;
    RSS: string;
    TEXT: string;
    VCARD: string;
    XML: string;
  };
};

declare interface TextOutput {
  append(addedContent: string): TextOutput;
  clear(): TextOutput;
  downloadAsFile(filename: string): TextOutput;
  getContent(): string;
  getMimeType(): string;
  getFileName(): string;
  setContent(content: string): TextOutput;
  setMimeType(mimeType: string): TextOutput;
}

declare interface Blob extends GoogleAppsScript.Base.Blob {}

// Gmail Service
declare const GmailApp: {
  createDraft(recipient: string, subject: string, body: string): GmailDraft;
  createDraft(recipient: string, subject: string, body: string, options: GmailAdvancedOptions): GmailDraft;
  createLabel(name: string): GmailLabel;
  deleteLabel(label: GmailLabel): GmailApp;
  getAliases(): string[];
  getChatThreads(): GmailThread[];
  getChatThreads(start: number, max: number): GmailThread[];
  getDraftMessages(): GmailMessage[];
  getInboxThreads(): GmailThread[];
  getInboxThreads(start: number, max: number): GmailThread[];
  getMessageById(id: string): GmailMessage;
  sendEmail(recipient: string, subject: string, body: string): GmailApp;
  sendEmail(recipient: string, subject: string, body: string, options: GmailAdvancedOptions): GmailApp;
  search(query: string): GmailThread[];
  search(query: string, start: number, max: number): GmailThread[];
};

declare interface GmailThread {
  getId(): string;
  getFirstMessageSubject(): string;
  getLabels(): GmailLabel[];
  getLastMessageDate(): Date;
  getMessages(): GmailMessage[];
  getMessageCount(): number;
  getPermalink(): string;
  hasStarredMessages(): boolean;
  isImportant(): boolean;
  isInChats(): boolean;
  isInInbox(): boolean;
  isInPriorityInbox(): boolean;
  isInSpam(): boolean;
  isInTrash(): boolean;
  isUnread(): boolean;
  markImportant(): GmailThread;
  markRead(): GmailThread;
  markUnimportant(): GmailThread;
  markUnread(): GmailThread;
  moveToArchive(): GmailThread;
  moveToInbox(): GmailThread;
  moveToSpam(): GmailThread;
  moveToTrash(): GmailThread;
  refresh(): GmailThread;
  removeLabel(label: GmailLabel): GmailThread;
  reply(body: string): GmailThread;
  reply(body: string, options: GmailAdvancedOptions): GmailThread;
}

declare interface GmailMessage {
  getId(): string;
  getBody(): string;
  getDate(): Date;
  getFrom(): string;
  getPlainBody(): string;
  getRawContent(): string;
  getReplyTo(): string;
  getSubject(): string;
  getTo(): string;
  getThread(): GmailThread;
  isDraft(): boolean;
  isInChats(): boolean;
  isInInbox(): boolean;
  isInTrash(): boolean;
  isStarred(): boolean;
  isUnread(): boolean;
  markRead(): GmailMessage;
  markUnread(): GmailMessage;
  moveToTrash(): GmailMessage;
  refresh(): GmailMessage;
  reply(body: string): GmailMessage;
  reply(body: string, options: GmailAdvancedOptions): GmailMessage;
  star(): GmailMessage;
  unstar(): GmailMessage;
}

declare interface GmailLabel {
  getName(): string;
  deleteLabel(): void;
}

declare interface GmailDraft {
  deleteDraft(): void;
  getId(): string;
  getMessage(): GmailMessage;
  getMessageId(): string;
  send(): GmailMessage;
  update(recipient: string, subject: string, body: string): GmailDraft;
  update(recipient: string, subject: string, body: string, options: GmailAdvancedOptions): GmailDraft;
}

declare interface GmailAdvancedOptions {
  attachments?: Blob[];
  bcc?: string;
  cc?: string;
  from?: string;
  htmlBody?: string;
  inlineImages?: { [key: string]: Blob };
  name?: string;
  replyTo?: string;
  noReply?: boolean;
}

// Drive Service
declare const DriveApp: {
  createFile(blob: Blob): DriveFile;
  createFile(name: string, content: string): DriveFile;
  createFile(name: string, content: string, mimeType: string): DriveFile;
  createFolder(name: string): DriveFolder;
  getFileById(id: string): DriveFile;
  getFiles(): FileIterator;
  getFolderById(id: string): DriveFolder;
  getFolders(): FolderIterator;
  getRootFolder(): DriveFolder;
  searchFiles(params: string): FileIterator;
  searchFolders(params: string): FolderIterator;
};

declare interface DriveFile {
  getId(): string;
  getName(): string;
  getUrl(): string;
  getDownloadUrl(): string;
  getBlob(): Blob;
  getAs(contentType: string): Blob;
  getDateCreated(): Date;
  getDescription(): string;
  getLastUpdated(): Date;
  getMimeType(): string;
  getOwner(): User;
  getParents(): FolderIterator;
  getSize(): number;
  isStarred(): boolean;
  isTrashed(): boolean;
  makeCopy(): DriveFile;
  makeCopy(name: string): DriveFile;
  moveTo(destination: DriveFolder): DriveFile;
  setContent(content: string): DriveFile;
  setDescription(description: string): DriveFile;
  setName(name: string): DriveFile;
  setStarred(starred: boolean): DriveFile;
  setTrashed(trashed: boolean): DriveFile;
}

declare interface DriveFolder {
  getId(): string;
  getName(): string;
  getUrl(): string;
  createFile(blob: Blob): DriveFile;
  createFile(name: string, content: string): DriveFile;
  createFile(name: string, content: string, mimeType: string): DriveFile;
  createFolder(name: string): DriveFolder;
  getFiles(): FileIterator;
  getFolders(): FolderIterator;
  getParents(): FolderIterator;
  searchFiles(params: string): FileIterator;
  searchFolders(params: string): FolderIterator;
}

declare interface FileIterator {
  hasNext(): boolean;
  next(): DriveFile;
}

declare interface FolderIterator {
  hasNext(): boolean;
  next(): DriveFolder;
}

declare interface User {
  getEmail(): string;
  getUserLoginId(): string;
}
