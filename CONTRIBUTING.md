# Contributing to gscript

Thank you for your interest in contributing to gscript! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, gscript version)
- **Code samples** if applicable
- **Error messages** and stack traces

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** and motivation
- **Expected behavior**
- **Examples** of how the feature would be used

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if applicable
4. **Update documentation** as needed
5. **Run tests** to ensure everything passes
6. **Commit your changes** with clear, descriptive messages
7. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Setup

```bash
# Clone your fork
git clone https://github.com/your-username/gscript.git
cd gscript

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Link for local testing
npm link
```

### Project Structure

```
gscript/
├── src/
│   ├── cli/          # CLI commands
│   ├── builder/      # Build system
│   ├── checker/      # Compatibility checker
│   ├── config/       # Configuration handling
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript types
├── compatibility-rules.json
├── tests/
└── docs/
```

## Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Enable **strict mode**
- Provide **type annotations** for public APIs
- Avoid `any` type when possible

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **semicolons**
- Follow existing code style
- Run `npm run lint` before committing

### Naming Conventions

- **camelCase** for variables and functions
- **PascalCase** for classes and types
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for file names

### Testing

- Write tests for new features
- Maintain or improve code coverage
- Use descriptive test names
- Test edge cases and error conditions

Example test structure:

```typescript
describe('FeatureName', () => {
  it('should do something correctly', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Commit Messages

Write clear, descriptive commit messages following this format:

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or tool changes

**Examples:**

```
feat: add support for custom compatibility rules

Allow users to define custom compatibility rules in their config file.
This enables project-specific API restrictions.

Closes #123
```

```
fix: resolve false positive in fetch pattern detection

The regex pattern was matching 'UrlFetchApp.fetch()' incorrectly.
Added negative lookbehind to exclude method calls on objects.

Fixes #456
```

## Adding Compatibility Rules

To add new compatibility rules, edit `compatibility-rules.json`:

```json
{
  "globals": {
    "yourApi": {
      "available": false,
      "replacement": "AppsScriptEquivalent",
      "message": "Use AppsScriptEquivalent instead",
      "severity": "error",
      "autofix": true,
      "docs": "https://link-to-documentation"
    }
  }
}
```

Then add tests in `src/checker/index.test.ts`:

```typescript
it('should detect yourApi usage', async () => {
  const testFile = path.join(tempDir, 'test.ts');
  await fs.writeFile(testFile, `
    const result = yourApi();
  `);

  const issues = await checker.checkFile(testFile);
  const apiIssue = issues.find(i => i.code === 'GLOBAL_YOURAPI');

  expect(apiIssue).toBeDefined();
  expect(apiIssue?.severity).toBe('error');
});
```

## Documentation

- Update `README.md` for user-facing changes
- Add JSDoc comments for public APIs
- Create examples for new features
- Update the changelog

## Release Process

Maintainers will handle releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Publish to npm
5. Create GitHub release

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion in GitHub Discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to gscript! 🎉
