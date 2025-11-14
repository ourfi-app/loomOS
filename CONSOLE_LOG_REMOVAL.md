# Console Log Removal Guide

This guide explains how to manage and remove `console.log` statements from the codebase to improve code quality and reduce noise in production.

## Overview

While console logging is useful during development, it can:
- **Leak sensitive information** in production
- **Clutter the browser console** for end users
- **Impact performance** (minimal but measurable)
- **Make debugging harder** by adding noise

This project provides two complementary approaches:

1. **ESLint Rule** - Catch console.log during development
2. **Automated Script** - Remove or comment out console.log statements in bulk

## Quick Start

### Check for Console Logs

Run ESLint to find all console.log statements:

```bash
npm run lint
```

### Preview Removal (Dry Run)

See what would be removed without making changes:

```bash
npm run console:check
```

### Remove Console Logs

Automatically remove all console.log statements:

```bash
npm run console:remove
```

### Comment Out Console Logs

Keep them as comments for reference:

```bash
npm run console:comment
```

## ESLint Configuration

The project includes an ESLint rule that warns about console.log statements:

```json
{
  "rules": {
    "no-console": [
      "warn",
      {
        "allow": ["warn", "error", "info"]
      }
    ]
  }
}
```

### What's Allowed

✅ **Allowed** (These are kept):
- `console.error()` - For error reporting
- `console.warn()` - For warnings
- `console.info()` - For informational messages

❌ **Flagged** (These trigger warnings):
- `console.log()` - General debugging output
- `console.debug()` - Debug output
- `console.trace()` - Stack traces

### Script Exceptions

Scripts in the `scripts/` directory are exempt from the console rule since they're CLI tools that need console output.

## Automated Removal Script

The `scripts/remove-console-logs.ts` script provides automated console.log removal.

### Usage

```bash
# Dry run - see what would change
tsx scripts/remove-console-logs.ts --dry-run

# Remove all console.log statements
tsx scripts/remove-console-logs.ts

# Comment out instead of removing
tsx scripts/remove-console-logs.ts --comment

# Target specific directory
tsx scripts/remove-console-logs.ts --dir app/components

# Combine options
tsx scripts/remove-console-logs.ts --dry-run --comment --dir lib
```

### Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without modifying files |
| `--comment` | Comment out console.logs instead of removing them |
| `--dir <path>` | Target specific directory (default: all source directories) |

### What It Does

The script:
1. **Scans** TypeScript and JavaScript files in source directories
2. **Identifies** console.log statements (single-line and multi-line)
3. **Preserves** console.error, console.warn, and console.info
4. **Skips** node_modules, .next, scripts, and other build directories
5. **Handles** multi-line console.log statements correctly

### Example Output

```
🧹 Console.log Removal Tool

Mode: Live
Action: Remove
Target: app, components, lib, hooks, utils, packages

Scanning 342 files...

================================================================================
Console.log Removal Report
================================================================================

Found 47 console.log statement(s) in 12 file(s)

app/components/Dashboard.tsx
  Line 23:
  - console.log('User data:', userData);

lib/api-utils.ts
  Line 156:
  - console.log('API request:', {
      method,
      url,
      params
    });

...

================================================================================
Summary:
  Total files affected: 12
  Total console.log statements: 47
  Action: Removed
================================================================================
```

## Production Console Removal

The project is already configured to automatically remove console.log statements in production builds via `next.config.js`:

```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],
  } : false,
}
```

This means:
- ✅ Development builds keep all console statements
- ✅ Production builds remove console.log automatically
- ✅ console.error and console.warn are preserved in production

## Best Practices

### 1. Use Appropriate Log Levels

Instead of `console.log`, use semantic alternatives:

```typescript
// ❌ Bad - Generic logging
console.log('User logged in:', user);

// ✅ Good - Semantic logging
console.info('User logged in:', user);  // For important info
console.error('Login failed:', error);   // For errors
console.warn('Session expiring soon');   // For warnings
```

### 2. Remove Debug Logs Before Committing

Run the cleanup script before committing:

```bash
# Check for console.logs
npm run console:check

# Remove them if found
npm run console:remove

# Commit clean code
git add .
git commit -m "feat: add feature X"
```

### 3. Use a Proper Logging Library

For production applications, consider using a logging library:

```typescript
// Instead of console.log
import { logger } from '@/lib/logger';

logger.debug('Debug information');
logger.info('User action completed');
logger.warn('Potential issue detected');
logger.error('Error occurred', error);
```

Benefits:
- Centralized log management
- Log levels and filtering
- Structured logging
- Integration with monitoring tools

### 4. Add Pre-commit Hooks

Automatically check for console.logs before commits:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run lint
npm run console:check
```

## Integration with CI/CD

### GitHub Actions Example

Add console.log checks to your CI pipeline:

```yaml
name: Code Quality

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - name: Check for console.logs
        run: |
          tsx scripts/remove-console-logs.ts --dry-run
          if [ $? -ne 0 ]; then
            echo "❌ Console.log statements found"
            exit 1
          fi
```

## Alternatives to Console Logging

### 1. Debugging Tools

Use browser DevTools debugger instead:

```typescript
// Instead of:
console.log('Value:', value);

// Use:
debugger; // Pauses execution in DevTools
```

### 2. React DevTools

For React component debugging:
- Install React DevTools browser extension
- Inspect component props and state
- Profile component renders

### 3. Next.js Debugging

```typescript
// For server-side debugging
export async function getServerSideProps(context) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Server props:', context); // OK in development
  }
  // ...
}
```

### 4. Structured Logging

Create a logger utility:

```typescript
// lib/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: any[]) => isDev && console.log('[DEBUG]', ...args),
  info: (...args: any[]) => console.info('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};

// Usage
import { logger } from '@/lib/logger';
logger.debug('This only shows in development');
logger.error('This shows in all environments');
```

## Troubleshooting

### Script Not Finding Console Logs

**Issue:** Script reports 0 console.logs but you know they exist

**Solutions:**
1. Check you're in the right directory:
   ```bash
   pwd  # Should be at project root
   ```

2. Specify the directory explicitly:
   ```bash
   tsx scripts/remove-console-logs.ts --dir app
   ```

3. Check file extensions are included (should be .ts, .tsx, .js, .jsx)

### Multi-line Console Logs Not Removed

**Issue:** Console.log spanning multiple lines not handled correctly

**Solution:** The script handles multi-line statements, but complex cases might need manual review. Use `--comment` first to review:

```bash
tsx scripts/remove-console-logs.ts --comment --dry-run
```

### ESLint Not Showing Warnings

**Issue:** ESLint not flagging console.log statements

**Solutions:**
1. Ensure ESLint is properly installed:
   ```bash
   npm install
   ```

2. Check your editor has ESLint extension installed

3. Run ESLint manually:
   ```bash
   npm run lint
   ```

## NPM Scripts Reference

The following scripts are available in `package.json`:

```json
{
  "scripts": {
    "console:check": "Check for console.log statements (dry run)",
    "console:remove": "Remove all console.log statements",
    "console:comment": "Comment out all console.log statements"
  }
}
```

## Resources

- [ESLint no-console rule](https://eslint.org/docs/rules/no-console)
- [Next.js compiler options](https://nextjs.org/docs/architecture/nextjs-compiler#remove-console)
- [MDN: Console API](https://developer.mozilla.org/en-US/docs/Web/API/Console)
- [Why you should remove console.log](https://kentcdodds.com/blog/why-you-should-remove-console-logs)

## Changelog

- **2024-11-14**: Initial console log removal tools created
  - Added ESLint no-console rule
  - Created automated removal script
  - Added npm scripts for common operations
  - Documented best practices and alternatives
