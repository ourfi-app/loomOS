# webOS Design System - Quick Reference Card

> Print this out and keep it at your desk! 📌

---

## 🎨 Most Used Colors

```tsx
// Backgrounds
bg-primary          // #e8e8e8 - Main app background
bg-surface          // #ffffff - Cards, panels
bg-hover            // #fafafa - Hover states

// Text
text-primary        // #000000 - Primary text
text-secondary      // #666666 - Secondary text
text-tertiary       // #999999 - Hints, labels

// Borders
border-light        // #e0e0e0 - Default borders
border-focus        // #4a90e2 - Focus states

// Accents
bg-accent-blue      // #4a90e2 - Links, actions
bg-success          // #5cb85c - Success
bg-error            // #d9534f - Error
```

---

## 📏 Spacing (4px Grid)

```tsx
space-xs    // 4px
space-sm    // 8px
space-md    // 12px
space-base  // 16px ⭐ Default
space-lg    // 24px
space-xl    // 32px
space-2xl   // 48px
```

**Usage:**
```tsx
p-4         // Padding: 16px
gap-lg      // Gap: 24px
m-xl        // Margin: 32px
```

---

## 📝 Typography

```tsx
// Sizes
text-xs     // 11px
text-sm     // 13px
text-base   // 14px ⭐ Default
text-lg     // 18px
text-xl     // 20px
text-2xl    // 24px

// Weights
font-light  // 300 ⭐ Default (use this!)
font-normal // 400 - For emphasis
font-medium // 500 - Rare

// Family
font-sans   // Helvetica Neue
```

---

## 🔘 Component Patterns

### Button (Primary)
```tsx
<button className="h-12 px-4 bg-accent-blue text-white rounded-md
                   hover:bg-accent-blue-dark transition-fast">
```

### Button (Secondary)
```tsx
<button className="h-12 px-4 bg-surface text-primary border border-light
                   rounded-md hover:bg-hover transition-fast">
```

### Card
```tsx
<div className="bg-surface rounded-lg shadow-card p-4 border border-lightest">
```

### Input
```tsx
<input className="h-12 px-3 bg-surface border border-light rounded-md
                 focus:border-focus text-base" />
```

### Glass Card
```tsx
<div className="bg-glass-white-80 backdrop-blur-lg rounded-2xl p-6">
```

---

## 💡 Golden Rules

1. **Use semantic tokens** → `bg-primary` not `bg-neutral-300`
2. **Use light fonts** → `font-light` by default
3. **Follow 4px grid** → `p-4` not `p-[17px]`
4. **Minimal color** → Neutrals first, accent sparingly
5. **Pure grays** → No blue tints!

---

## 🚫 Don't Do This

```tsx
❌ bg-white text-black
❌ font-bold
❌ p-[17px]
❌ bg-blue-500
❌ style={{ backgroundColor: '#e8e8e8' }}
```

## ✅ Do This Instead

```tsx
✅ bg-surface text-primary
✅ font-light
✅ p-4
✅ bg-accent-blue
✅ className="bg-primary"
```

---

## 🌙 Dark Mode

All tokens automatically invert:
```tsx
// Same code works in light and dark mode
<div className="bg-surface text-primary">
```

---

## 📚 Full Docs

- **Complete Reference**: `/docs/DESIGN_SYSTEM.md`
- **Migration Guide**: `/docs/MIGRATION_GUIDE.md`
- **Token File**: `/styles/webos-design-system.css`

---

**Version 1.0.0** | Keep this handy! 📌
