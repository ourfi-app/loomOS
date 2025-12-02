# webOS Design System Migration Guide

> **Version 1.0.0** | Last Updated: December 2, 2025

This guide helps you migrate existing components to use the new webOS Design System tokens.

---

## Table of Contents

1. [Overview](#overview)
2. [What Changed](#what-changed)
3. [Migration Steps](#migration-steps)
4. [Color Migration](#color-migration)
5. [Spacing Migration](#spacing-migration)
6. [Typography Migration](#typography-migration)
7. [Component Examples](#component-examples)
8. [Testing Checklist](#testing-checklist)
9. [Common Patterns](#common-patterns)

---

## Overview

The webOS Design System consolidates all design tokens into a single source of truth at `/styles/webos-design-system.css`. This migration ensures:

- ✅ Consistent visual appearance across all components
- ✅ Proper dark mode support
- ✅ Easy theming and customization
- ✅ Better maintainability

---

## What Changed

### Old System (Multiple Sources)
```css
/* Scattered across multiple files */
/design-tokens/core.css
/design-tokens/semantic.css
/design-tokens/colors-extended.css
/* ... plus 7 more files */
```

### New System (Single Source)
```css
/* Single comprehensive file */
/styles/webos-design-system.css
```

### Key Changes

1. **Pure Neutral Grays**: No more blue-tinted grays (warm-gray-*). Use pure neutral palette.
2. **Simplified Color Names**: More intuitive naming (bg-surface, text-primary, border-light)
3. **Component Tokens**: Pre-configured styling for common components
4. **Better Dark Mode**: Automatic inversion of colors

---

## Migration Steps

### Step 1: Update Color References

#### Backgrounds

```tsx
// ❌ OLD
className="bg-white"
className="bg-gray-100"
className="bg-gray-200"

// ✅ NEW
className="bg-surface"       // Pure white cards
className="bg-tertiary"      // #f5f5f5 - Light surfaces
className="bg-secondary"     // #eeeeee - Secondary backgrounds
className="bg-primary"       // #e8e8e8 - Main app background
```

#### Text Colors

```tsx
// ❌ OLD
className="text-black"
className="text-gray-900"
className="text-gray-600"
className="text-gray-500"
className="text-gray-400"

// ✅ NEW
className="text-primary"     // #000000 - Primary text
className="text-primary"     // #000000 - Body text
className="text-secondary"   // #666666 - Secondary text
className="text-tertiary"    // #999999 - Hints, placeholders
className="text-disabled"    // #cccccc - Disabled text
```

#### Borders

```tsx
// ❌ OLD
className="border-gray-300"
className="border-gray-200"
className="border-gray-100"

// ✅ NEW
className="border border-light"     // #e0e0e0 - Default borders
className="border border-lightest"  // #eeeeee - Subtle borders
className="border border-medium"    // #d4d4d4 - Medium borders
className="border border-dark"      // #b0b0b0 - Strong borders
```

#### Hover & Active States

```tsx
// ❌ OLD
className="hover:bg-gray-50"
className="hover:bg-gray-100"
className="active:bg-gray-200"

// ✅ NEW
className="hover:bg-hover"    // #fafafa - Hover state
className="active:bg-active"  // #f5f5f5 - Active state
```

### Step 2: Update Hardcoded Colors

```tsx
// ❌ OLD
style={{ backgroundColor: '#e8e8e8' }}
style={{ color: '#000000' }}

// ✅ NEW
className="bg-primary"
className="text-primary"
```

### Step 3: Use Component Tokens

```tsx
// ❌ OLD - Manual styling
<button className="h-12 px-4 bg-blue-500 text-white rounded-lg">

// ✅ NEW - Using component tokens
<button className="h-12 px-4 bg-accent-blue text-white rounded-md
                   hover:bg-accent-blue-dark transition-fast">

// ✅ OR - Using utility class
<button className="webos-button-primary">
```

### Step 4: Update Spacing

```tsx
// ❌ OLD - Arbitrary values
className="p-[16px]"
className="gap-[24px]"
className="mt-[32px]"

// ✅ NEW - Using spacing scale
className="p-4"      // 16px
className="gap-lg"   // 24px
className="mt-xl"    // 32px
```

---

## Color Migration

### Complete Color Mapping Table

| Old Class | New Class | Token Value | Usage |
|-----------|-----------|-------------|-------|
| `bg-white` | `bg-surface` | `#ffffff` | Cards, panels |
| `bg-gray-50` | `bg-hover` | `#fafafa` | Hover states |
| `bg-gray-100` | `bg-tertiary` | `#f5f5f5` | Light surfaces |
| `bg-gray-200` | `bg-secondary` | `#eeeeee` | Secondary backgrounds |
| `bg-gray-300` | `bg-primary` | `#e8e8e8` | Main background |
| `text-black` | `text-primary` | `#000000` | Primary text |
| `text-gray-900` | `text-primary` | `#000000` | Body text |
| `text-gray-700` | `text-secondary` | `#666666` | Secondary text |
| `text-gray-600` | `text-secondary` | `#666666` | Labels |
| `text-gray-500` | `text-tertiary` | `#999999` | Hints |
| `text-gray-400` | `text-disabled` | `#cccccc` | Disabled |
| `border-gray-300` | `border-light` | `#e0e0e0` | Default borders |
| `border-gray-200` | `border-lightest` | `#eeeeee` | Subtle borders |

### Status Colors

```tsx
// Success
className="text-success"           // Success text
className="bg-success"             // Success background
className="border-success"         // Success border

// Error
className="text-error"             // Error text
className="bg-error"               // Error background
className="border-error"           // Error border

// Warning
className="text-warning"           // Warning text
className="bg-warning"             // Warning background

// Info
className="text-info"              // Info text
className="bg-info"                // Info background
```

### Accent Colors

```tsx
// Primary accent (webOS blue)
className="bg-accent-blue"         // #4a90e2
className="bg-accent-blue-light"   // Lighter variant
className="bg-accent-blue-dark"    // Darker variant
className="bg-accent-blue-subtle"  // Subtle background
```

---

## Spacing Migration

### Spacing Scale Mapping

| Old Class | New Class | Value | Usage |
|-----------|-----------|-------|-------|
| `p-1` | `p-1` | `4px` | Tiny padding |
| `p-2` | `p-2` | `8px` | Small padding |
| `p-3` | `p-md` | `12px` | Medium padding |
| `p-4` | `p-4` or `p-base` | `16px` | Base padding |
| `p-6` | `p-lg` | `24px` | Large padding |
| `p-8` | `p-xl` | `32px` | Extra large |
| `p-12` | `p-2xl` | `48px` | 2x extra large |
| `p-16` | `p-3xl` | `64px` | 3x extra large |

### Gap Utilities

```tsx
// ❌ OLD
className="gap-3"
className="gap-6"
className="gap-8"

// ✅ NEW
className="gap-md"    // 12px
className="gap-lg"    // 24px
className="gap-xl"    // 32px
```

---

## Typography Migration

### Font Sizes

```tsx
// ❌ OLD
className="text-xs"      // 12px
className="text-sm"      // 14px
className="text-base"    // 16px
className="text-lg"      // 18px
className="text-xl"      // 20px
className="text-2xl"     // 24px

// ✅ NEW (webOS scale)
className="text-xs"      // 11px - Small labels
className="text-sm"      // 13px - Secondary text
className="text-base"    // 14px - Base body text
className="text-lg"      // 18px - Small headings
className="text-xl"      // 20px - Headings
className="text-2xl"     // 24px - Large headings
```

### Font Weights

```tsx
// ✅ Prefer light weights for elegance
className="font-light"     // 300 - Default for most text
className="font-normal"    // 400 - Emphasis only
className="font-medium"    // 500 - Strong emphasis

// ❌ Avoid heavy weights
className="font-semibold"  // 600 - Rarely used
className="font-bold"      // 700 - Avoid
```

---

## Component Examples

### Example 1: Card Component

```tsx
// ❌ OLD
<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Card Title
  </h3>
  <p className="text-sm text-gray-600">
    Card content goes here.
  </p>
</div>

// ✅ NEW
<div className="bg-surface p-6 rounded-lg shadow-card border border-lightest">
  <h3 className="text-lg font-light text-primary mb-2">
    Card Title
  </h3>
  <p className="text-sm text-secondary">
    Card content goes here.
  </p>
</div>

// ✅ OR - Using utility class
<div className="webos-card">
  <h3 className="text-lg font-light text-primary mb-2">
    Card Title
  </h3>
  <p className="text-sm text-secondary">
    Card content goes here.
  </p>
</div>
```

### Example 2: Button Component

```tsx
// ❌ OLD
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg
                   hover:bg-blue-600 font-medium">
  Click Me
</button>

// ✅ NEW
<button className="bg-accent-blue text-white px-6 py-3 rounded-md
                   hover:bg-accent-blue-dark transition-fast font-normal">
  Click Me
</button>

// ✅ OR - Using utility class
<button className="webos-button-primary">
  Click Me
</button>
```

### Example 3: Input Component

```tsx
// ❌ OLD
<input
  type="text"
  placeholder="Enter text..."
  className="w-full h-12 px-3 bg-white rounded-lg border border-gray-300
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200
             text-gray-900 placeholder-gray-500"
/>

// ✅ NEW
<input
  type="text"
  placeholder="Enter text..."
  className="w-full h-12 px-3 bg-surface rounded-md border border-light
             focus:border-focus focus:shadow-focus
             text-primary placeholder:text-tertiary
             transition-fast"
/>

// ✅ OR - Using utility class
<input
  type="text"
  placeholder="Enter text..."
  className="webos-input w-full"
/>
```

### Example 4: List Item

```tsx
// ❌ OLD
<div className="flex items-center p-4 hover:bg-gray-50 
                border-b border-gray-200">
  <div className="flex-1">
    <h4 className="font-medium text-gray-900">Item Title</h4>
    <p className="text-sm text-gray-600">Item description</p>
  </div>
</div>

// ✅ NEW
<div className="flex items-center p-4 hover:bg-hover 
                border-b border-lightest transition-fast">
  <div className="flex-1">
    <h4 className="font-normal text-primary">Item Title</h4>
    <p className="text-sm text-secondary">Item description</p>
  </div>
</div>
```

### Example 5: Modal

```tsx
// ❌ OLD
<div className="fixed inset-0 bg-black/50 z-50">
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Modal Title
      </h2>
      <p className="text-base text-gray-600">Modal content...</p>
    </div>
  </div>
</div>

// ✅ NEW
<div className="fixed inset-0 bg-glass-black-40 backdrop-blur-sm z-[600]">
  <div className="fixed inset-0 flex items-center justify-center p-4 z-[700]">
    <div className="bg-surface rounded-3xl shadow-modal p-6 max-w-lg w-full">
      <h2 className="text-2xl font-light text-primary mb-4">
        Modal Title
      </h2>
      <p className="text-base text-secondary">Modal content...</p>
    </div>
  </div>
</div>
```

---

## Testing Checklist

After migrating a component, verify:

- [ ] Component renders correctly in light mode
- [ ] Component renders correctly in dark mode
- [ ] All interactive states work (hover, active, focus)
- [ ] Colors match the webOS aesthetic (neutral, clean)
- [ ] Spacing follows the 4px grid system
- [ ] Typography uses light weights (font-light preferred)
- [ ] No hardcoded colors or spacing values
- [ ] Glassmorphic effects work correctly (if applicable)
- [ ] Focus states are visible and accessible
- [ ] Component is responsive across breakpoints

---

## Common Patterns

### Pattern 1: Glassmorphic Card

```tsx
<div className="bg-glass-white-80 backdrop-blur-lg rounded-2xl 
                shadow-card p-6 border border-glass-border-light">
  {/* Content */}
</div>
```

### Pattern 2: Dark Chrome Navigation

```tsx
<nav className="bg-chrome-dark text-chrome-text h-14 
                shadow-navbar px-4">
  {/* Navigation items */}
</nav>
```

### Pattern 3: Status Badge

```tsx
{/* Success */}
<span className="px-2 py-1 rounded-md bg-success text-white text-xs">
  Success
</span>

{/* Error */}
<span className="px-2 py-1 rounded-md bg-error text-white text-xs">
  Error
</span>

{/* Warning */}
<span className="px-2 py-1 rounded-md bg-warning text-white text-xs">
  Warning
</span>
```

### Pattern 4: Hover Card

```tsx
<div className="bg-surface rounded-lg shadow-card p-4 
                border border-lightest
                hover:shadow-card-hover hover:border-light
                transition-normal cursor-pointer">
  {/* Card content */}
</div>
```

### Pattern 5: Focus Ring

```tsx
<button className="... focus:outline-none focus:shadow-focus">
  Button
</button>
```

---

## FAQ

### Q: Can I still use Tailwind's default colors?

**A:** While technically possible, it's not recommended. Using webOS design tokens ensures:
- Consistent appearance across the app
- Proper dark mode support
- Easy theming

### Q: What if I need a custom color?

**A:** Add it to `/styles/webos-design-system.css` first:

```css
:root {
  --custom-color: #ff6b9d;
}
```

Then update `tailwind.config.ts`:

```ts
colors: {
  'custom': 'var(--custom-color)',
}
```

### Q: How do I test dark mode?

**A:**
1. System preferences: Set your OS to dark mode
2. Browser DevTools: Toggle `prefers-color-scheme: dark`
3. Next.js app: Use `next-themes` for manual toggle

### Q: Should I migrate all components at once?

**A:** No! Migrate incrementally:
1. Start with new components
2. Migrate high-traffic components
3. Gradually update remaining components
4. The old tokens will coexist during transition

---

## Support

For questions or issues:
- Check `/docs/DESIGN_SYSTEM.md` for full documentation
- Review `/styles/webos-design-system.css` for all available tokens
- See example components in this guide

---

**Made with ❤️ for loomOS** | Version 1.0.0
