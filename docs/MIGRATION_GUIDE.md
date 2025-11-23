# Migration Guide to webOS Design System v1.0

> Quick reference for migrating from old design tokens to the new consolidated webOS Design System.

---

## Overview

The new webOS Design System consolidates all design tokens into a single source of truth: `/styles/webos-design-system.css`. This replaces the following legacy files:

- ❌ `styles/webos-design-tokens.css` → ✅ `styles/webos-design-system.css`
- ❌ `styles/webos-theme.css` → ✅ `styles/webos-design-system.css`
- ❌ `styles/loomos-tokens.css` → ✅ `styles/webos-design-system.css`
- ❌ `styles/loomos-design-system.css` → ✅ `styles/webos-design-system.css`
- ❌ `design-tokens/core.css` → ✅ `styles/webos-design-system.css`
- ❌ `design-tokens/semantic.css` → ✅ `styles/webos-design-system.css`
- ❌ `design-tokens/motion.css` → ✅ `styles/webos-design-system.css`

---

## Quick Migration Checklist

- [ ] 1. Update `app/globals.css` imports (already done!)
- [ ] 2. Find and replace color tokens
- [ ] 3. Update spacing references
- [ ] 4. Update typography classes
- [ ] 5. Test in light and dark mode
- [ ] 6. Remove unused legacy CSS files (optional)

---

## Token Migration Map

### Colors

#### Background Colors

| Old Token | New Token | Usage |
|-----------|-----------|-------|
| `--loomos-bg-primary` | `--bg-primary` | Main app background |
| `--loomos-bg-secondary` | `--bg-secondary` | Secondary areas |
| `--loomos-bg-tertiary` | `--bg-tertiary` | Tertiary areas |
| `--loomos-surface` | `--bg-surface` | Cards, panels |
| `--webos-bg-primary` | `--bg-primary` | Main background |
| `--webos-surface` | `--bg-surface` | Cards |
| `--semantic-bg-base` | `--bg-primary` | Main background |
| `--semantic-surface-base` | `--bg-surface` | Surface |

#### Text Colors

| Old Token | New Token | Usage |
|-----------|-----------|-------|
| `--loomos-text-primary` | `--text-primary` | Primary text |
| `--loomos-text-secondary` | `--text-secondary` | Secondary text |
| `--webos-text-primary` | `--text-primary` | Primary text |
| `--semantic-text-primary` | `--text-primary` | Primary text |

#### Border Colors

| Old Token | New Token | Usage |
|-----------|-----------|-------|
| `--loomos-border-light` | `--border-light` | Default borders |
| `--loomos-border-medium` | `--border-medium` | Emphasized borders |
| `--webos-border-light` | `--border-light` | Light borders |

#### Accent Colors

| Old Token | New Token | Usage |
|-----------|-----------|-------|
| `--loomos-accent` | `--accent-blue` | Primary accent |
| `--loomos-orange` | `--accent-blue` | Links, actions |
| `--webos-accent-blue` | `--accent-blue` | Blue accent |

### Tailwind Class Replacements

#### Background Classes

```tsx
// OLD → NEW
bg-loomos-grey          → bg-primary or bg-neutral-300
bg-loomos-surface       → bg-surface
bg-webos-gray-100       → bg-neutral-100
bg-semantic-bg-base     → bg-primary

// Tailwind defaults
bg-gray-100             → bg-neutral-100
bg-gray-200             → bg-neutral-200
bg-white                → bg-surface (for cards)
```

#### Text Classes

```tsx
// OLD → NEW
text-loomos-text        → text-primary
text-webos-text-primary → text-primary
text-semantic-text      → text-primary

// Tailwind defaults
text-gray-900           → text-primary
text-gray-600           → text-secondary
text-gray-400           → text-tertiary
text-black              → text-primary
```

#### Border Classes

```tsx
// OLD → NEW
border-loomos-border    → border-light
border-webos-border     → border-light

// Tailwind defaults
border-gray-200         → border-light
border-gray-300         → border-medium
```

### Spacing

| Old | New |
|-----|-----|
| `p-loomos-md` | `p-md` or `p-3` |
| `gap-loomos-lg` | `gap-lg` or `gap-6` |
| `mt-loomos-xl` | `mt-xl` or `mt-8` |
| `p-[16px]` | `p-4` or `p-base` |
| `gap-[24px]` | `gap-lg` or `gap-6` |

### Typography

| Old | New |
|-----|-----|
| `text-loomos-base` | `text-base` |
| `text-loomos-lg` | `text-lg` |
| `font-loomos` | `font-sans` |
| `font-webos` | `font-sans` |

---

## Component Migration Examples

### Before (Old Tokens)

```tsx
// Old Button
<button className="bg-loomos-orange text-white px-6 py-3 
                   rounded-lg hover:bg-loomos-orange-dark">
  Click Me
</button>

// Old Card
<div className="bg-loomos-surface p-loomos-lg rounded-xl 
                shadow-loomos-card border border-loomos-border">
  <h3 className="text-loomos-text-primary font-loomos">Card Title</h3>
</div>

// Old Input
<input className="bg-semantic-surface border-semantic-border
                 text-semantic-text-primary" />
```

### After (New Tokens)

```tsx
// New Button
<button className="bg-accent-blue text-white px-6 py-3 
                   rounded-md hover:bg-accent-blue-dark transition-fast">
  Click Me
</button>

// New Card
<div className="bg-surface p-4 rounded-lg shadow-card 
                border border-lightest">
  <h3 className="text-primary font-sans">Card Title</h3>
</div>

// New Input
<input className="bg-surface border-light text-primary" />
```

---

## CSS Variable Migration

### Find and Replace in CSS Files

```css
/* OLD → NEW */

/* Backgrounds */
var(--loomos-bg-primary)      → var(--bg-primary)
var(--webos-bg-primary)       → var(--bg-primary)
var(--semantic-bg-base)       → var(--bg-primary)

/* Text */
var(--loomos-text-primary)    → var(--text-primary)
var(--webos-text-primary)     → var(--text-primary)

/* Borders */
var(--loomos-border-light)    → var(--border-light)
var(--webos-border-light)     → var(--border-light)

/* Spacing */
var(--loomos-spacing-md)      → var(--space-md)
var(--space-3)                → var(--space-md)

/* Typography */
var(--loomos-text-base)       → var(--text-base)
var(--loomos-font-family)     → var(--font-sans)

/* Shadows */
var(--loomos-shadow-card)     → var(--shadow-card)
var(--webos-shadow-card)      → var(--shadow-card)
```

---

## VSCode Find & Replace

Use these regex patterns for bulk migration:

### Pattern 1: Background Classes
```
Find:    bg-(loomos-|webos-|semantic-)?(grey|gray)-?(\d{1,3})?
Replace: bg-neutral-$3 (manual verification needed)
```

### Pattern 2: Text Classes
```
Find:    text-(loomos-|webos-|semantic-)?text-?(primary|secondary|tertiary)?
Replace: text-$2
```

### Pattern 3: CSS Variables
```
Find:    var\(--(loomos-|webos-|semantic-)(.*?)\)
Replace: var(--$2)
```

**⚠️ Warning**: Always review changes before committing. These patterns may need manual adjustments.

---

## Testing Checklist

After migration, test these scenarios:

### Visual Testing

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] All colors match the design reference
- [ ] No blue-tinted grays (should be pure neutrals)
- [ ] Cards have subtle shadows
- [ ] Text is readable (high contrast)
- [ ] Borders are visible but subtle

### Component Testing

- [ ] Buttons have correct hover states
- [ ] Inputs focus correctly (blue border)
- [ ] Cards hover correctly
- [ ] Modals have backdrop blur
- [ ] Dock has glassmorphic effect
- [ ] Navigation is accessible

### Responsive Testing

- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch targets are 44px minimum

### Accessibility Testing

- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Keyboard navigation works
- [ ] Screen readers announce correctly

---

## Common Issues & Solutions

### Issue 1: Colors look different

**Problem**: Colors don't match the old design.

**Solution**: Ensure you're using the correct neutral scale. The new system uses pure neutrals (#e8e8e8) instead of blue-tinted grays.

```tsx
// ❌ Wrong - blue tinted
bg-slate-100  // Has blue tint

// ✅ Correct - pure neutral
bg-neutral-100  // Pure gray
```

### Issue 2: Spacing is off

**Problem**: Spacing doesn't match the old layout.

**Solution**: Use the semantic spacing aliases:

```tsx
// ❌ Wrong
p-[16px]

// ✅ Correct
p-4  // or p-base
```

### Issue 3: Dark mode broken

**Problem**: Colors don't invert in dark mode.

**Solution**: Use semantic tokens instead of hardcoded colors:

```tsx
// ❌ Wrong
className="bg-white text-black"

// ✅ Correct
className="bg-surface text-primary"
```

### Issue 4: Typography too bold

**Problem**: Text looks heavier than before.

**Solution**: Use light font weights:

```tsx
// ❌ Wrong
className="font-bold"

// ✅ Correct
className="font-light"  // Default for most text
```

### Issue 5: Missing tokens

**Problem**: Some old tokens don't have direct equivalents.

**Solution**: Check the full token list in `/styles/webos-design-system.css` or use semantic aliases:

```tsx
// Old token not found
--loomos-orange

// Use semantic equivalent
--accent-blue  // Primary accent
```

---

## Rollback Plan

If you encounter critical issues, you can temporarily roll back:

1. **Use unified design token imports** in `app/globals.css`:

```css
/* All design tokens are now unified in /design-tokens/ */
@import '../design-tokens/core.css';
@import '../design-tokens/semantic.css';
@import '../design-tokens/motion.css';
```

**Note:** Legacy token files from `/styles/` have been removed as of PR #94. All design tokens are now consolidated in the `/design-tokens/` directory.

2. **Test thoroughly** after migration.

3. **Migrate gradually** - one component/page at a time.

---

## Benefits After Migration

✅ **Single Source of Truth**: All tokens in one file  
✅ **Better Performance**: Fewer CSS imports  
✅ **Consistent Naming**: Clear, predictable token names  
✅ **Easier Theming**: Simple dark mode switching  
✅ **Better DX**: Autocomplete in VS Code  
✅ **Maintainable**: Easier to update design system  
✅ **Palm webOS Authentic**: True to original design  

---

## Need Help?

- 📚 **Full Documentation**: See `/docs/DESIGN_SYSTEM.md`
- 🎨 **Token Reference**: See `/styles/webos-design-system.css`
- 🐛 **Found a bug?**: Open an issue in #design-system channel

---

**Migration Status**: 🚀 Ready for Production  
**Version**: 1.0.0  
**Last Updated**: November 21, 2025
