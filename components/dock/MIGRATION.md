# Migration Guide: Unified Dock

This guide helps you migrate from the old dock implementations to the new unified dock.

## Overview

The unified dock consolidates these implementations:
- `components/webos/app-dock.tsx` (762 lines)
- `components/desktop/Dock.tsx` (115 lines)

**Total**: 877 lines → Modular system (~600 lines distributed)

---

## Quick Migration

### From `components/webos/app-dock.tsx`

#### Before

```typescript
import { AppDock } from '@/components/webos/app-dock';

export default function Layout() {
  return (
    <>
      {/* Your content */}
      <AppDock />
    </>
  );
}
```

#### After

```typescript
import { Dock } from '@/components/dock';

export default function Layout() {
  return (
    <>
      {/* Your content */}
      <Dock />
    </>
  );
}
```

**Changes:**
- ✅ No props changes required
- ✅ All features preserved
- ✅ Drop-in replacement

---

### From `components/desktop/Dock.tsx`

#### Before

```typescript
import { Dock } from '@/components/desktop/Dock';

export function Desktop() {
  return (
    <>
      {/* Your content */}
      <Dock />
    </>
  );
}
```

#### After

```typescript
import { Dock } from '@/components/dock';

export function Desktop() {
  return (
    <>
      {/* Your content */}
      <Dock />
    </>
  );
}
```

**Changes:**
- ✅ Import path changed only
- ✅ All features preserved
- ✅ Drop-in replacement

---

## Feature Comparison

### Features from `app-dock.tsx` (All Preserved)

| Feature | Old Implementation | New Implementation | Notes |
|---------|-------------------|-------------------|-------|
| **Pinned Apps** | ✅ | ✅ | Same functionality |
| **Running Apps** | ✅ | ✅ | Enhanced status indicators |
| **Minimized Apps** | ✅ | ✅ | Better visual feedback |
| **Auto-Hide** | ✅ | ✅ | Improved responsiveness |
| **Gestures** | ✅ | ✅ | More reliable |
| **Looms** | ✅ | ✅ | Same AI features |
| **Drag-Drop** | ✅ | ✅ | Smoother animations |
| **Context Menu** | ✅ | ✅ | More actions |
| **App Launcher** | ✅ | ✅ | Integrated |
| **Keyboard Nav** | ⚠️ Limited | ✅ | Full support |

### Features from `Dock.tsx` (All Preserved)

| Feature | Old Implementation | New Implementation | Notes |
|---------|-------------------|-------------------|-------|
| **Glass Effect** | ✅ | ✅ | Enhanced styling |
| **Favorites** | ✅ | ✅ | Now called "pinned" |
| **Running Indicator** | ✅ | ✅ | More states |
| **Hover Effects** | ✅ | ✅ | Smoother |
| **Tooltips** | ⚠️ Manual | ✅ | Built-in |

---

## Advanced Migration

### Custom Configuration

If you need custom configuration (not available in old docks):

```typescript
<Dock
  orientation="horizontal"  // or "vertical"
  position="bottom"         // or "top", "left", "right"
  size="medium"            // or "small", "large"
  autoHide={true}          // Auto-hide on desktop
  showRunningApps={true}   // Show running apps
  showLooms={true}         // Show looms
  maxPinnedApps={5}        // Max pinned apps
  enableGestures={true}    // Mobile gestures
  enableDragAndDrop={true} // Reordering
  enableKeyboard={true}    // Keyboard nav
/>
```

### Custom Callbacks

For custom app launch logic:

```typescript
<Dock
  onAppLaunch={(app) => {
    // Your custom logic
    console.log('Launching:', app.title);
  }}
  onLoomRestore={(loomId) => {
    // Your custom logic
    console.log('Restoring loom:', loomId);
  }}
/>
```

---

## Breaking Changes

### None! 🎉

The unified dock is designed as a **drop-in replacement** with no breaking changes.

All existing features are preserved and enhanced.

---

## Deprecated Imports

### ⚠️ Deprecated (Still work, but will be removed in v2.0)

```typescript
// DO NOT USE - Deprecated
import { AppDock } from '@/components/webos/app-dock';
import { Dock } from '@/components/desktop/Dock';
```

### ✅ New (Recommended)

```typescript
// USE THIS - Unified implementation
import { Dock } from '@/components/dock';
```

---

## Migration Checklist

Use this checklist to ensure complete migration:

### 1. Update Imports

- [ ] Replace `import { AppDock } from '@/components/webos/app-dock'`
- [ ] Replace `import { Dock } from '@/components/desktop/Dock'`
- [ ] Use `import { Dock } from '@/components/dock'`

### 2. Update Component Usage

- [ ] Replace `<AppDock />` with `<Dock />`
- [ ] Keep existing props (if any)
- [ ] Test functionality

### 3. Test Features

- [ ] App pinning/unpinning works
- [ ] Running app indicators show correctly
- [ ] Minimized apps restore properly
- [ ] Auto-hide behaves as expected (desktop)
- [ ] Gestures work on mobile
- [ ] Looms function correctly
- [ ] Drag-and-drop reordering works
- [ ] Context menus appear and work
- [ ] App launcher opens correctly

### 4. Cleanup (Optional)

- [ ] Remove old dock component files (after testing)
- [ ] Update any documentation
- [ ] Inform team about changes

---

## Troubleshooting

### Issue: Dock not showing

**Solution**: Check auto-hide settings

```typescript
<Dock autoHide={false} />
```

### Issue: Different behavior

**Solution**: The unified dock has the same defaults as `app-dock.tsx`. If you were using `desktop/Dock.tsx`, you may notice enhanced features.

### Issue: TypeScript errors

**Solution**: Update types imports

```typescript
import { Dock } from '@/components/dock';
import type { DockProps } from '@/components/dock';
```

### Issue: Missing features

**Solution**: All features are preserved. Check the props:

```typescript
<Dock
  showRunningApps={true}
  showLooms={true}
  showAppLauncher={true}
/>
```

---

## Need Help?

1. Check [README.md](./README.md) for full documentation
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for implementation details
3. Create an issue on GitHub
4. Ask the team in Slack

---

## Timeline

| Version | Status | Notes |
|---------|--------|-------|
| **v1.0** | ✅ Current | Unified dock released |
| **v1.x** | ⚠️ Deprecation | Old docks marked deprecated |
| **v2.0** | 🔮 Future | Old docks removed |

**Recommended**: Migrate before v2.0 to avoid breaking changes.

---

## Benefits of Migrating

### Code Quality

- ✅ Better TypeScript support
- ✅ Proper type safety
- ✅ No `any` types
- ✅ Comprehensive JSDoc comments

### Features

- ✅ Enhanced accessibility
- ✅ Full keyboard navigation
- ✅ Improved animations
- ✅ Better performance
- ✅ More configuration options

### Maintenance

- ✅ Single implementation to maintain
- ✅ Easier to add features
- ✅ Better tested
- ✅ Comprehensive documentation

### Developer Experience

- ✅ Clear API
- ✅ Intuitive props
- ✅ Great documentation
- ✅ Easy customization

---

## Examples

### Example 1: Basic Dashboard

```typescript
// app/dashboard/layout.tsx
import { Dock } from '@/components/dock';

export default function DashboardLayout({ children }) {
  return (
    <>
      {children}
      <Dock />
    </>
  );
}
```

### Example 2: Desktop App

```typescript
// components/desktop/Desktop.tsx
import { Dock } from '@/components/dock';

export function Desktop({ children }) {
  return (
    <>
      {children}
      <Dock
        orientation="vertical"
        position="left"
        autoHide={true}
      />
    </>
  );
}
```

### Example 3: Mobile App

```typescript
// app/mobile/layout.tsx
import { Dock } from '@/components/dock';

export default function MobileLayout({ children }) {
  return (
    <>
      {children}
      <Dock
        enableGestures={true}
        showRunningApps={false}
        maxPinnedApps={4}
      />
    </>
  );
}
```

---

## Support

For any migration issues, please:

1. Check this guide first
2. Review the [README.md](./README.md)
3. Check existing GitHub issues
4. Create a new issue if needed

---

**Last Updated**: November 25, 2025  
**Version**: 1.0.0
