# Bundle Analysis Guide

This guide explains how to analyze your Next.js application bundle to identify optimization opportunities and reduce bundle size.

## Overview

Bundle analysis helps you:
- **Identify large dependencies** that impact page load times
- **Find duplicate dependencies** that could be deduplicated
- **Discover unused code** that can be removed
- **Optimize chunk splitting** for better caching
- **Track bundle size** over time

## Quick Start

### Running Bundle Analysis

The project is already configured with `@next/bundle-analyzer`. To analyze your bundle:

```bash
npm run analyze
```

Or with yarn:

```bash
yarn analyze
```

This command will:
1. Build your Next.js application
2. Generate interactive HTML reports
3. Automatically open the reports in your browser

### Understanding the Reports

After running the analysis, two HTML files will open:

1. **Client Bundle Report** (`client.html`) - Shows what gets sent to the browser
2. **Server Bundle Report** (`server.html`) - Shows server-side rendering bundles

## Reading the Visualization

### Bundle Map Layout

The bundle analyzer displays a **treemap** where:
- **Size of rectangles** = Size of the module
- **Color** = Different colors for different file types/sources
- **Nesting** = Shows the dependency hierarchy

### Key Metrics to Watch

1. **Parsed Size** - Actual size of uncompressed code
2. **Stat Size** - Size before any processing
3. **Gzipped Size** - Size after compression (closest to real-world)

### Finding Optimization Opportunities

#### 1. Large Individual Packages

Look for large rectangles in the visualization:
- Packages > 100KB should be investigated
- Consider lazy loading or finding lighter alternatives
- Example: `lodash` (500KB) → use `lodash-es` or import specific functions

#### 2. Duplicate Dependencies

Multiple instances of the same package indicate bundling issues:
- Check for different versions in `package.json`
- Use `npm dedupe` or `yarn dedupe`
- Consider using webpack aliases to unify duplicates

#### 3. Unused Code

Packages that shouldn't be in the client bundle:
- Node.js modules (fs, path, crypto) - check webpack fallbacks
- Development-only dependencies
- Server-only code in client bundles

#### 4. Heavy UI Libraries

Common culprits for large bundles:
- **Moment.js** → Replace with `date-fns` or `day.js`
- **Chart libraries** → Already optimized (plotly.js → plotly.js-basic-dist)
- **Icon libraries** → Use tree-shakeable imports

## Current Optimizations

The project already includes several optimizations in `next.config.js`:

### 1. Bundle Analyzer Configuration

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
```

### 2. Console Removal in Production

```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],
  } : false,
}
```

### 3. Modularized Imports

```javascript
modularizeImports: {
  'lodash': {
    transform: 'lodash/{{member}}',
  },
  '@radix-ui/react-icons': {
    transform: '@radix-ui/react-icons/dist/{{member}}',
  },
}
```

### 4. Plotly.js Optimization

```javascript
// Replace full plotly.js with basic distribution
config.resolve.alias = {
  'plotly.js': 'plotly.js-basic-dist',
};
```

## Best Practices

### 1. Regular Analysis

Run bundle analysis:
- **Before major releases** - Catch regressions early
- **After adding dependencies** - Understand their impact
- **Monthly** - Track bundle size trends

### 2. Set Size Budgets

Create a `.size-limit.json` file to enforce limits:

```json
[
  {
    "path": ".next/static/**/*.js",
    "limit": "400 KB"
  }
]
```

### 3. Dynamic Imports

Use Next.js dynamic imports for large components:

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

### 4. Code Splitting by Route

Next.js automatically splits code by route. Keep route files lean:
- Move shared logic to separate modules
- Use React.lazy() for conditional components
- Defer loading of below-the-fold content

## Common Issues & Solutions

### Issue: node_modules in Client Bundle

**Symptom:** Server packages appear in client bundle

**Solution:** Update webpack fallbacks in `next.config.js`:

```javascript
config.resolve.fallback = {
  fs: false,
  net: false,
  tls: false,
  dns: false,
  child_process: false,
};
```

### Issue: Duplicate React Instances

**Symptom:** Multiple React copies in bundle

**Solution:** Check for peer dependency conflicts:

```bash
npm ls react
yarn why react
```

### Issue: CSS Bundle Size

**Symptom:** Large CSS files in bundle

**Solution:**
- Remove unused Tailwind classes with purge configuration
- Split global CSS into feature-specific files
- Use CSS modules for component-specific styles

## Advanced Configuration

### Custom Webpack Analysis

For more detailed analysis, use webpack-bundle-analyzer directly:

```bash
npm install --save-dev webpack-bundle-analyzer
```

Then add to `next.config.js`:

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
          openAnalyzer: true,
        })
      );
    }
    return config;
  },
};
```

### Source Map Explorer

Alternative tool for analyzing bundle:

```bash
npm install --save-dev source-map-explorer
```

Add script to `package.json`:

```json
{
  "scripts": {
    "analyze:source": "source-map-explorer '.next/static/**/*.js'"
  }
}
```

## Monitoring Bundle Size in CI/CD

### GitHub Actions Example

```yaml
name: Bundle Size Check

on: [pull_request]

jobs:
  check-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Next.js Optimizing Bundles](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Bundle Size Guide](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

## Changelog

- **2024-11-14**: Initial bundle analysis documentation created
  - Added quick start guide
  - Documented current optimizations
  - Included best practices and troubleshooting
