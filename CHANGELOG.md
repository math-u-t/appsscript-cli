# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-09

### Added

#### Core Features
- **TypeScript Compilation**: Automatic TypeScript to JavaScript transpilation during build process
- **Compatibility Checker**: Real-time detection of incompatible Web/Node.js APIs
- **Auto-fix Engine**: Automatic fixes for common compatibility issues
- **Complete CLI Interface**: Full command-line interface for all operations

#### CLI Commands
- `gscript init` - Initialize new Apps Script project with TypeScript support
- `gscript check` - Run compatibility checks with `--fix` option for auto-fixes
- `gscript build` - Build TypeScript code for Apps Script deployment
- `gscript deploy` - Deploy to Apps Script using clasp integration
- `gscript dev` - Development mode with file watching and auto-rebuild
- `gscript pull` - Pull code from Apps Script to local project
- `gscript test` - Run test suite with optional `--watch` mode
- `gscript logs` - View Apps Script execution logs with `--tail` support

#### Compatibility Rules
- 50+ global API checks (fetch, crypto, localStorage, window, etc.)
- 30+ Node.js API checks (fs, path, process, Buffer, etc.)
- 20+ pattern-based checks (import/export, async/await, etc.)
- Runtime-specific checks (V8 vs RHINO features)
- Auto-fix support for common patterns

#### Developer Experience
- File watching in dev mode
- Detailed error messages with file locations
- Helpful suggestions and documentation links
- Integration with clasp for deployment
- Support for multiple file organization

### Fixed

#### Critical Bugs
- **Fetch Pattern False Positives**: Fixed regex pattern to avoid matching `UrlFetchApp.fetch()` incorrectly
  - Changed from `fetch\s*\(` to `(?<!\.)fetch\s*\(` using negative lookbehind
  - Prevented false positives when `fetch` is a method name on an object

- **Pattern Code Formatting**: Fixed code formatting in error messages
  - Changed from `FETCH-PATTERN` to `FETCH_PATTERN` for consistency
  - Applied `.replace(/-/g, '_')` transformation to pattern names

- **AST Identifier Checking**: Fixed false positives in AST-based global API detection
  - Added parent node tracking to distinguish between standalone identifiers and object properties
  - Prevented flagging of `fetch` in `UrlFetchApp.fetch` as a global API

- **TypeScript Compilation Missing**: Implemented proper TypeScript transpilation
  - Previously only concatenated `.ts` files without compilation
  - Now uses TypeScript compiler API to transpile to JavaScript
  - Ensures Apps Script can execute the output code

#### Implementation Completions
- **Deploy Command**: Fully implemented with clasp integration
  - Added automatic `clasp push` execution
  - Included deployment version creation support
  - Added helpful error messages for common issues

- **Pull Command**: Implemented clasp integration for pulling code
  - Downloads code from Apps Script to local `./src` directory
  - Provides warnings about manual file organization needs

- **Test Command**: Implemented test runner
  - Executes npm test script
  - Supports `--watch` mode for continuous testing
  - Properly handles test failures

- **Dev Command**: Implemented file watching development mode
  - Watches `src/**/*.{ts,js}` for changes
  - Automatically rebuilds on file changes
  - Provides real-time feedback on build status

- **Logs Command**: Implemented log viewing
  - Fetches execution logs from Apps Script
  - Supports `--tail` mode for live log watching
  - Handles "no logs" scenarios gracefully

### Documentation
- Created comprehensive `CONTRIBUTING.md` with development guidelines
- Created `CHANGELOG.md` for tracking changes
- Created `LICENSE` file with MIT license
- Updated README.md with accurate feature descriptions

### Technical Improvements
- Added TypeScript strict mode compliance
- Improved error handling across all commands
- Enhanced type safety with proper TypeScript types
- Added proper parent node tracking in AST traversal
- Implemented robust regex patterns for compatibility checking

### Testing
- All 5 test suites passing
- Fixed compatibility checker tests
- Verified build process
- Tested all CLI commands

### Dependencies
- TypeScript compiler API integration
- clasp integration for deployment
- chokidar for file watching
- All existing dependencies maintained

## [Unreleased]

### Planned Features
- VS Code extension for inline validation
- GitHub Actions integration
- Interactive development server with HTTP endpoints
- Automated testing framework enhancements
- Performance profiling tools
- Bundle size optimization
- Source maps support
- More comprehensive examples

---

For more details, see the [README](README.md) and [documentation](./docs).

[1.0.0]: https://github.com/your-org/gscript/releases/tag/v1.0.0
