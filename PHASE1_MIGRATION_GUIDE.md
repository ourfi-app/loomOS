# Phase 1 Foundation Consolidation - Migration Guide

**Date:** November 24, 2025  
**Branch:** foundation-consolidation  
**Phase:** 1 (Foundation - Weeks 1-2)  
**Status:** Complete

---

## Overview

Phase 1 of the loomOS design system consolidation focuses on establishing a **single source of truth** for:

1. **Styling System** - Unified design tokens
2. **Button Components** - Single button implementation
3. **Card Components** - Single base card implementation

This migration guide will help you update your code to use the new unified components.

---

## 1. Styling System Consolidation

### What Changed

- ✅ All design tokens consolidated into `/design-tokens/` directory
- ✅ `design-tokens/semantic.css` now includes all Tailwind-compatible tokens
- ❌ `styles/webos-theme.css` is now deprecated (tokens moved to semantic.css)
- ✅ All CSS variables are now consistently named and mapped

### Migration Steps

#### Step 1: Update Imports

**Before:**
```css
@import '../styles/webos-theme.css';
```

**After:**
```css
/* No import needed - already imported in globals.css */
```

The design tokens are automatically imported via `app/globals.css`:
```css
@import '../design-tokens/core.css';
@import '../design-tokens/semantic.css';
@import '../design-tokens/motion.css';
```

#### Step 2: Update CSS Variable References

Most CSS variables should work without changes, but if you were using webOS-specific tokens:

**Before:**
```css
background-color: var(--webos-bg-primary);
color: var(--webos-text-primary);
border: 1px solid var(--webos-border-light);
```

**After:**
```css
background-color: var(--semantic-bg-base);
color: var(--semantic-text-primary);
border: 1px solid var(--semantic-border-light);

/* Or use the Tailwind-compatible aliases: */
background-color: var(--bg-primary);
color: var(--text-primary);
border-color: var(--border-light);
```

#### Step 3: Apply webOS Theme (Optional)

If you want webOS-specific styling, apply the `data-theme` attribute:

```tsx
<div data-theme="webos">
  {/* webOS-themed content */}
</div>
```

Or add the class:
```tsx
<div className="webos-theme">
  {/* webOS-themed content */}
</div>
```

### Token Mapping Reference

| Old Token | New Token | Alias |
|-----------|-----------|-------|
| `--webos-bg-primary` | `--semantic-bg-base` | `--bg-primary` |
| `--webos-bg-secondary` | `--semantic-bg-subtle` | `--bg-secondary` |
| `--webos-surface` | `--semantic-surface-base` | `--bg-surface` |
| `--webos-text-primary` | `--semantic-text-primary` | `--text-primary` |
| `--webos-text-secondary` | `--semantic-text-secondary` | `--text-secondary` |
| `--webos-border-light` | `--semantic-border-light` | `--border-light` |
| `--webos-border-medium` | `--semantic-border-medium` | `--border-medium` |

---

## 2. Button Component Migration

### What Changed

- ✅ All 9+ button implementations consolidated into `/components/ui/button.tsx`
- ❌ Legacy button components are deprecated:
  - `components/core/buttons/Button.tsx`
  - `components/loomos/Button.tsx`
  - `components/webos/shared/webos-button.tsx`
- ✅ Unified API with all features from all implementations

### Migration Steps

#### Step 1: Update Imports

**Before:**
```tsx
import { Button } from '@/components/core/buttons/Button'
// or
import { Button } from '@/components/loomos/Button'
// or
import { WebOSButton } from '@/components/webos/shared/webos-button'
```

**After:**
```tsx
import { Button } from '@/components/ui/button'
```

#### Step 2: Update Props

##### Variant Mapping

All variants are supported in the unified component:

```tsx
// Old: components/core/buttons/Button
<Button variant="primary">     → <Button variant="primary">
<Button variant="secondary">   → <Button variant="secondary">
<Button variant="ghost">       → <Button variant="ghost">
<Button variant="icon">        → <Button size="icon">
<Button variant="navigation">  → <Button variant="navigation">

// Old: components/loomos/Button
<Button variant="primary">     → <Button variant="primary">
<Button variant="secondary">   → <Button variant="secondary">
<Button variant="ghost">       → <Button variant="ghost">
<Button variant="outline">     → <Button variant="outline">

// Old: components/webos/shared/webos-button
<WebOSButton variant="dark">   → <Button variant="dark">
<WebOSButton variant="light">  → <Button variant="light">
<WebOSButton variant="glass">  → <Button variant="glass">
<WebOSButton variant="outline"> → <Button variant="outline">
<WebOSButton variant="ghost">  → <Button variant="ghost">
```

##### Feature Mapping

All features are preserved:

```tsx
// Loading state
<Button loading>Save</Button>

// Icons
<Button icon={<SaveIcon />}>Save</Button>
<Button iconRight={<ArrowIcon />}>Next</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Composition (Radix Slot)
<Button asChild>
  <Link href="/page">Link Button</Link>
</Button>
```

### Complete Examples

#### Before (components/core/buttons/Button)

```tsx
import { Button } from '@/components/core/buttons/Button'

function MyComponent() {
  return (
    <>
      <Button variant="primary" size="lg" loading>
        Save Changes
      </Button>
      <Button variant="secondary" fullWidth>
        Cancel
      </Button>
      <Button variant="ghost" size="sm">
        Close
      </Button>
    </>
  )
}
```

#### After (components/ui/button)

```tsx
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <>
      <Button variant="primary" size="lg" loading>
        Save Changes
      </Button>
      <Button variant="secondary" fullWidth>
        Cancel
      </Button>
      <Button variant="ghost" size="sm">
        Close
      </Button>
    </>
  )
}
```

The code is almost identical - just update the import!

---

## 3. Card Component Migration

### What Changed

- ✅ All 18+ base card implementations consolidated into `/components/ui/card.tsx`
- ❌ Legacy base card components are deprecated:
  - `components/loomos/Card.tsx`
  - `components/webos/card.tsx` (re-export)
- ✅ Specialized cards (SwipeableCard, RefinedCard) remain as wrappers
- ✅ Unified API with all base features

### Migration Steps

#### Step 1: Update Imports

**Before:**
```tsx
import { Card } from '@/components/loomos/Card'
// or
import { Card } from '@/components/webos/card'
```

**After:**
```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
```

#### Step 2: Update Props

##### Variant Mapping

```tsx
// Default card
<Card>...</Card>

// Glass morphism (webOS style)
<Card variant="glass">...</Card>

// Elevated surface
<Card variant="elevated">...</Card>

// Outline style
<Card variant="outline">...</Card>

// Flat (no shadow)
<Card variant="flat">...</Card>
```

##### Feature Mapping

All features are preserved:

```tsx
// Padding options
<Card padding="none">...</Card>
<Card padding="sm">...</Card>
<Card padding="md">...</Card>
<Card padding="lg">...</Card>  {/* default */}

// Interactive states
<Card hoverable>...</Card>           {/* Hover lift effect */}
<Card clickable>...</Card>           {/* Clickable cursor */}
<Card interactive>...</Card>         {/* Both hover and click */}

// Combined
<Card 
  variant="glass" 
  padding="lg" 
  hoverable 
  onClick={handleClick}
>
  Content
</Card>
```

### Complete Examples

#### Before (components/loomos/Card)

```tsx
import { Card } from '@/components/loomos/Card'

function MyComponent() {
  return (
    <Card hoverable clickable padding="lg" onClick={handleClick}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        Main content goes here
      </CardContent>
      <CardFooter>
        Footer content
      </CardFooter>
    </Card>
  )
}
```

#### After (components/ui/card)

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'

function MyComponent() {
  return (
    <Card hoverable clickable padding="lg" onClick={handleClick}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        Main content goes here
      </CardContent>
      <CardFooter>
        Footer content
      </CardFooter>
    </Card>
  )
}
```

The only change is the import - the API is identical!

### Specialized Cards

**SwipeableCard**, **RefinedCard**, and other specialized cards should now wrap the base Card:

```tsx
import { Card } from '@/components/ui/card'
import { SwipeableCard } from '@/components/webos/swipeable-card'

// SwipeableCard wraps the base Card
<SwipeableCard
  leftActions={actions}
  rightActions={actions}
>
  <Card>
    Content
  </Card>
</SwipeableCard>
```

---

## 4. Checklist for Migration

Use this checklist to ensure you've migrated everything:

### Styling System
- [ ] Remove imports of `styles/webos-theme.css`
- [ ] Update CSS variable references to use semantic tokens
- [ ] Apply `data-theme="webos"` where webOS styling is needed
- [ ] Test that all colors and styles render correctly

### Button Components
- [ ] Find all button imports: `grep -r "from '@/components/core/buttons/Button'" --include="*.tsx" --include="*.ts"`
- [ ] Find all button imports: `grep -r "from '@/components/loomos/Button'" --include="*.tsx" --include="*.ts"`
- [ ] Find all button imports: `grep -r "from '@/components/webos/shared/webos-button'" --include="*.tsx" --include="*.ts"`
- [ ] Update all imports to `from '@/components/ui/button'`
- [ ] Test all button variants render correctly
- [ ] Test loading states
- [ ] Test icon rendering

### Card Components
- [ ] Find all card imports: `grep -r "from '@/components/loomos/Card'" --include="*.tsx" --include="*.ts"`
- [ ] Find all card imports: `grep -r "from '@/components/webos/card'" --include="*.tsx" --include="*.ts"`
- [ ] Update all imports to `from '@/components/ui/card'`
- [ ] Test all card variants render correctly
- [ ] Test interactive states (hover, click)
- [ ] Test padding options

---

## 5. Deprecation Timeline

### Current Phase (Phase 1)
- ✅ New unified components are available
- ✅ Deprecation warnings added to legacy components
- ⚠️ Legacy components still work but show console warnings in development

### Next Phase (Phase 2 - Weeks 3-4)
- 🔄 Gradual migration of internal components
- 🔄 Update documentation and examples

### Future Phase (Phase 3+)
- ❌ Legacy components will be removed
- 📦 Bundle size optimizations after removal

---

## 6. Benefits of Migration

### 1. Consistency
- Single source of truth for styling
- Consistent API across all components
- Predictable behavior

### 2. Maintainability
- Easier to update and fix bugs
- One place to make changes
- Better code organization

### 3. Performance
- Smaller bundle size (after legacy removal)
- Faster compile times
- Better tree-shaking

### 4. Developer Experience
- Clearer documentation
- Better TypeScript support
- Less confusion about which component to use

---

## 7. Support and Questions

If you encounter any issues during migration:

1. **Check the console warnings** - They include specific migration instructions
2. **Review this guide** - Most common cases are covered
3. **Check component documentation** - See JSDoc comments in component files
4. **Open an issue** - If you find a bug or missing feature

---

## 8. Summary

Phase 1 establishes the foundation for the loomOS design system:

✅ **Styling System**: All design tokens consolidated into `/design-tokens/`  
✅ **Button Component**: Single unified button at `/components/ui/button.tsx`  
✅ **Card Component**: Single unified card at `/components/ui/card.tsx`

**Next Steps:**
- Gradually migrate your components to use the new unified components
- Remove references to deprecated components
- Enjoy a more consistent and maintainable codebase!

---

**Last Updated:** November 24, 2025  
**Version:** 1.0  
**Phase:** 1 (Foundation)
