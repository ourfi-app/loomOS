# Bundle Optimization Guide

This document describes the bundle optimization strategies implemented in this Next.js application.

## Overview

Total bundle size reduction: **~5.1-5.2 MB** from initial load

## Optimization Phases

### Phase 1: Bundle Analyzer Setup ✅
**Tools:** `@next/bundle-analyzer`
**Usage:** `npm run analyze`
**Benefits:**
- Visualize bundle composition
- Identify optimization opportunities
- Track size changes over time

### Phase 2: Mapbox GL Dynamic Import ✅
**Savings:** ~500 KB from initial bundle
**Implementation:** `components/maps/MapboxMap.tsx`
**Strategy:**
- Extracted Mapbox into reusable component
- Uses `next/dynamic` for code splitting
- Only loads when Property Map page is visited

### Phase 3: Plotly.js Optimization ✅
**Savings:** ~4.2 MB
**Implementation:**
- Replaced `plotly.js` (5 MB) with `plotly.js-basic-dist` (800 KB)
- Webpack alias in `next.config.js` for compatibility
- Supports common chart types (scatter, bar, pie, histogram, etc.)

### Phase 4: Admin Route Code Splitting ✅
**Savings:** ~200-300 KB for non-admin users
**Implementation:** `app/dashboard/admin/layout.tsx`
**Strategy:**
- AdminRouteWrapper component for authentication
- Next.js automatically splits admin routes
- Non-admin users never download admin code

### Phase 5: Tree-Shaking (lodash, date-fns) ✅
**Savings:** Automatic optimization
**Implementation:** `modularizeImports` in `next.config.js`
**Status:**
- lodash: Already using individual imports ✅
- date-fns: Already using individual imports ✅
- Radix UI: Configured for tree-shaking ✅

### Phase 6: Framer Motion LazyMotion ✅
**Savings:** ~90 KB from initial bundle
**Implementation:** `components/providers/motion-provider.tsx`
**Strategy:**
- Uses framer-motion's LazyMotion feature
- Loads core (30 KB) initially
- Loads features (90 KB) on first animation
- Affects all 48 framer-motion components

## Total Impact

| Category | Before | After | Savings |
|----------|--------|-------|---------|
| Mapbox GL | Included | Lazy loaded | -500 KB |
| Plotly.js | 5 MB | 800 KB | -4.2 MB |
| Framer Motion | 120 KB | 30 KB initial | -90 KB |
| Admin Features | Included | Route split | -200-300 KB* |
| **Total** | | | **~5.1-5.2 MB** |

*For non-admin users only

## Configuration Files

### next.config.js
```javascript
{
  swcMinify: true, // Faster minification
  compiler: {
    removeConsole: true // Remove console logs in production
  },
  modularizeImports: {
    'lodash': { transform: 'lodash/{{member}}' },
    '@radix-ui/react-icons': { ... }
  },
  webpack: {
    alias: {
      'plotly.js': 'plotly.js-basic-dist'
    }
  }
}
```

### Dynamic Imports Utility
**File:** `lib/dynamic-imports.ts`
**Exports:**
- `DynamicMapbox` - Mapbox GL component
- `DynamicPlotly` - Plotly charts
- `DynamicLineChart`, `DynamicBarChart`, `DynamicPieChart` - Chart.js
- More helpers for heavy components

### Motion Provider
**File:** `components/providers/motion-provider.tsx`
**Usage:** Wrap your app with `<MotionProvider>`
**Features:** Automatic LazyMotion for all child components

## Best Practices

### ✅ DO
- Use individual imports: `import { format } from 'date-fns'`
- Wrap heavy components with `next/dynamic`
- Use LazyMotion for framer-motion
- Let Next.js handle route-based splitting
- Run `npm run analyze` regularly

### ❌ DON'T
- Use barrel imports: `import * as _ from 'lodash'`
- Import full libraries: `import 'plotly.js'`
- Load heavy code synchronously
- Ignore bundle size warnings

## Measuring Impact

### Development
```bash
npm run analyze
```
Opens interactive bundle visualization showing:
- Size of each chunk
- What's included in each bundle
- Dependencies and their sizes

### Production
Monitor these metrics in Render/production:
- **Build time:** Should be faster
- **Memory usage:** Should be lower
- **Initial load time:** Should be significantly faster
- **Time to Interactive (TTI):** Should improve

## Future Optimizations

### Potential Phase 7: Image Optimization
- Use Next.js Image component everywhere
- Implement responsive images
- Add blur placeholders

### Potential Phase 8: Font Optimization
- Use `next/font` for automatic font optimization
- Subset fonts to only needed characters
- Preload critical fonts

### Potential Phase 9: CSS Optimization
- Remove unused Tailwind classes
- Optimize CSS-in-JS
- Critical CSS extraction

## Troubleshooting

### Build Fails After Optimization
1. Check `next.config.js` syntax
2. Verify all dynamic imports have proper fallbacks
3. Ensure LazyMotion provider wraps all motion components

### Charts Not Rendering
1. Verify plotly.js-basic-dist supports your chart type
2. Check if dynamic import is resolving correctly
3. Look for loading state errors

### Admin Pages Not Loading
1. Check AdminRouteWrapper is in place
2. Verify user role checks
3. Ensure admin layout.tsx exists

## Resources

- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Framer Motion LazyMotion](https://www.framer.com/motion/guide-reduce-bundle-size/)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)

## Maintenance

Run bundle analysis after:
- Adding new dependencies
- Major feature additions
- Before production deployments
- Monthly health checks

**Last Updated:** Phase 1-6 Complete
**Next Review:** After deploying to production
