# gscript - Google Apps Script のための TypeScript 開発環境

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D16-green)](https://nodejs.org/)

Google Apps Script に TypeScript スタイルの開発体験をもたらす CLI ツールです。リアルタイム互換性チェック、自動修正機能、シームレスなデプロイメントを提供します。

## ✨ 特徴

- 🔍 **リアルタイム互換性チェック** - デプロイ前に互換性のない Web API を検出
- 🔧 **自動修正エンジン** - 一般的な互換性問題を自動で修正
- 📘 **完全な型定義** - すべての Apps Script サービスの完全な TypeScript サポート
- 🏗️ **モダンなファイル構造** - 複数ファイルでコードを整理し、自動的にバンドル
- ⚡ **高速開発** - ホットリロード、モックサービス、統合テスト
- 🚀 **簡単なデプロイ** - ワンコマンドで Apps Script にデプロイ
- 📚 **包括的なドキュメント** - 詳細なガイドと例

## 🚀 クイックスタート

### インストール

```bash
npm install -g gscript
```

### 新規プロジェクトの作成

```bash
gscript init my-project
cd my-project
npm install
```

### 型安全なコードの記述

```typescript
// src/main.ts
function doGet(e: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutput('<h1>Hello, World!</h1>');
}

function sendEmail(to: string, subject: string, body: string): void {
  GmailApp.sendEmail(to, subject, body);
}
```

### 互換性問題のチェック

```bash
gscript check
```

出力例:
```
error: 互換性のない API の使用 (GLOBAL_FETCH)
  --> src/api.ts:15:10
   |
15 | const response = fetch('https://api.example.com');
   |                  ^^^^^
   |
   = help: 代わりに UrlFetchApp.fetch() を使用してください
   = docs: https://developers.google.com/apps-script/reference/url-fetch
```

### 問題の自動修正

```bash
gscript check --fix
```

自動的に変換:
- `fetch()` → `UrlFetchApp.fetch()`
- `crypto.randomUUID()` → `Utilities.getUuid()`
- `import`/`export` 文を削除
- その他多数...

### ビルドとデプロイ

```bash
# プロジェクトのビルド
gscript build

# Apps Script へのデプロイ
gscript deploy
```

## 📋 何がチェックされるか？

### ❌ 検出される互換性のない API

```typescript
// Web API (Apps Script では利用不可)
fetch('url')                          → UrlFetchApp.fetch() を使用
crypto.randomUUID()                   → Utilities.getUuid() を使用
localStorage.setItem('key', 'value')  → PropertiesService を使用
setTimeout(() => {}, 1000)            → Utilities.sleep() またはトリガーを使用
process.env.API_KEY                   → PropertiesService を使用

// Node.js API
const fs = require('fs')              → DriveApp を使用
Buffer.from('data')                   → Utilities.base64Encode() を使用

// ES モジュール
import { foo } from './bar'           → ビルド時に削除
export function baz() {}              → ビルド時に削除
```

### ✅ 提供される Apps Script の代替手段

```typescript
// HTTP リクエスト
const response = UrlFetchApp.fetch('https://api.example.com', {
  method: 'post',
  payload: JSON.stringify({ key: 'value' }),
  headers: { 'Authorization': 'Bearer token' }
});

// UUID 生成
const id = Utilities.getUuid();

// ハッシュ化
const hash = Utilities.computeDigest(
  Utilities.DigestAlgorithm.SHA_256,
  'data'
);

// ストレージ
const props = PropertiesService.getUserProperties();
props.setProperty('key', 'value');
const value = props.getProperty('key');

// ファイル操作
const file = DriveApp.createFile('name.txt', 'content');
const content = file.getBlob().getDataAsString();
```

## 📖 ドキュメント

- [はじめに](./docs/getting-started.md) - 完全なセットアップとワークフローガイド
- [API リファレンス](./docs/api-reference.md) - すべての CLI コマンドとオプション
- [移行ガイド](./docs/migration-guide.md) - clasp や手動開発からの移行
- [互換性リファレンス](./docs/compatibility-reference.md) - 完全な API 互換性リスト

## 🎯 使用例

### Web アプリケーション

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

### メール自動化

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

### データ連携

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

## 🛠️ CLI コマンド

| コマンド | 説明 |
|---------|-------------|
| `gscript init [name]` | 新規プロジェクトの初期化 |
| `gscript check` | 互換性問題のチェック |
| `gscript check --fix` | 問題の自動修正 |
| `gscript build` | デプロイ用にビルド |
| `gscript deploy` | Apps Script へデプロイ |
| `gscript dev` | 開発サーバーの起動 |
| `gscript pull` | Apps Script から取得 |
| `gscript logs` | 実行ログの表示 |
| `gscript test` | テストスイートの実行 |

## ⚙️ 設定

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

## 📦 サンプル

[examples](./examples) ディレクトリをご覧ください:

- **[basic-webapp](./examples/basic-webapp)** - フォーム処理を含むシンプルな Web アプリ
- **[gmail-automation](./examples/gmail-automation)** - 自動メール処理

## 🔄 clasp との比較

| 機能 | clasp | gscript |
|---------|-------|---------|
| TypeScript サポート | ✅ | ✅ |
| 互換性チェック | ❌ | ✅ |
| 自動修正 | ❌ | ✅ |
| 型定義 | 手動 | 含まれる |
| ファイルバンドル | 手動 | 自動 |
| 開発サーバー | ❌ | ✅ |
| エラーメッセージ | 基本的 | 詳細 |

**gscript は clasp と併用できます！** 両方のツールを一緒に使用して最高の体験を得られます。

## 🏗️ プロジェクト構造

```
project/
├── src/
│   ├── main.ts              # エントリーポイント
│   ├── utils/
│   │   └── helpers.ts
│   └── services/
│       └── gmail.ts
├── tests/
│   └── main.test.ts
├── dist/                     # ビルド出力 (自動生成)
│   ├── Code.gs
│   └── appsscript.json
├── gscript.config.json       # gscript 設定
├── .clasp.json               # Apps Script プロジェクト
├── tsconfig.json             # TypeScript 設定
└── package.json
```

## 🧪 開発

### ソースからビルド

```bash
git clone https://github.com/your-org/gscript.git
cd gscript
npm install
npm run build
```

### テストの実行

```bash
npm test
```

### ローカルでリンク

```bash
npm link
gscript --version
```

## 📊 互換性ルール

gscript は包括的な互換性データベースを使用:

- **50以上のグローバル API チェック** (fetch、crypto、localStorage など)
- **30以上の Node.js API チェック** (fs、path、process など)
- **20以上のパターンベースチェック** (import/export、async/await など)
- **ランタイム固有のチェック** (V8 vs RHINO 機能)

完全なリストは [compatibility-rules.json](./compatibility-rules.json) をご覧ください。

## 🎓 学習リソース

- [Apps Script ドキュメント](https://developers.google.com/apps-script)
- [Apps Script ガイド](https://developers.google.com/apps-script/guides/services)
- [Apps Script API リファレンス](https://developers.google.com/apps-script/reference)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/handbook/intro.html)

## 🤝 コントリビューション

コントリビューションを歓迎します！ガイドラインについては [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

### 互換性ルールの追加

`compatibility-rules.json` を編集:

```json
{
  "globals": {
    "yourApi": {
      "available": false,
      "replacement": "AppsScriptEquivalent",
      "message": "代わりに AppsScriptEquivalent を使用してください",
      "severity": "error",
      "autofix": true
    }
  }
}
```

## 📜 ライセンス

MIT ライセンス - 詳細は [LICENSE](./LICENSE) ファイルをご覧ください。

## 🙏 謝辞

- Google の [clasp](https://github.com/google/clasp) 上に構築
- AST 解析に [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) を使用
- TypeScript コンパイラのエラーメッセージに着想を得ています

## 📞 サポート

- 🐛 [バグ報告](https://github.com/your-org/gscript/issues)
- 💡 [機能リクエスト](https://github.com/your-org/gscript/issues)
- 📖 [ドキュメントを読む](./docs)
- 💬 [ディスカッション](https://github.com/your-org/gscript/discussions)

## 🎯 ロードマップ

- [ ] インライン検証のための VS Code 拡張機能
- [ ] GitHub Actions 統合
- [ ] インタラクティブ開発サーバー
- [ ] 自動テストフレームワーク
- [ ] パフォーマンスプロファイリングツール
- [ ] バンドルサイズの最適化
- [ ] ソースマップサポート
- [ ] 自動リビルドのためのウォッチモード

---

**Apps Script コミュニティのために ❤️ を込めて作成**

---

## クイックリンク

- [インストール](#-クイックスタート)
- [ドキュメント](./docs)
- [サンプル](./examples)
- [変更履歴](./CHANGELOG.md)
- [ライセンス](./LICENSE)
