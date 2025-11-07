# loomOS Design Tokens

**Version:** 1.0
**Last Updated:** November 7, 2025

A complete design token system for loomOS, built on semantic naming and two-tier architecture.

---

## 📁 Token Files

### `core.css`
**Immutable loomOS brand tokens** - NEVER modified by apps.

- Base colors (Orange #F18825, Trust Blue, Growth Green)
- Spacing scale (4px grid)
- Typography scale
- Border radius scale
- Shadow scale
- Component dimensions
- Z-index layers

### `semantic.css`
**Customizable semantic mappings** - Apps override these to customize appearance.

- Semantic color mappings (`--semantic-primary`, `--semantic-accent`)
- Surface colors (`--semantic-surface-*`)
- Text colors (`--semantic-text-*`)
- Border colors (`--semantic-border-*`)
- Component-specific tokens (`--semantic-btn-*`, `--semantic-card-*`)

### `motion.css`
**Animation & transition system** - Physics-based interactions.

- Spring physics (300/25/1 - the loomOS standard)
- Duration scale
- Easing functions
- Gesture thresholds
- Keyframe animations
- Transition presets

---

## 🚀 Quick Start

### 1. Import Tokens

**In your global CSS:**
```css
/* Import semantic tokens (which automatically imports core) */
@import '../design-tokens/semantic.css';

/* Import motion system */
@import '../design-tokens/motion.css';
```

**Or import in HTML:**
```html
<link rel="stylesheet" href="/design-tokens/semantic.css">
<link rel="stylesheet" href="/design-tokens/motion.css">
```

### 2. Use Semantic Tokens

**✅ Preferred approach:**
```tsx
// React/TSX
<div style={{
  backgroundColor: 'var(--semantic-surface-elevated)',
  color: 'var(--semantic-text-primary)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-card)'
}}>
  <h2 style={{
    fontSize: 'var(--text-2xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--semantic-primary)'
  }}>
    Welcome to loomOS
  </h2>
</div>
```

**CSS:**
```css
.card {
  background-color: var(--semantic-surface-elevated);
  color: var(--semantic-text-primary);
  padding: var(--space-lg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
}

.card-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--semantic-primary);
}
```

### 3. Add Animations

**Using CSS classes:**
```html
<div class="card animate-fade-in transition-all hover-lift">
  Card content
</div>
```

**Using inline styles:**
```tsx
<div style={{
  transition: 'var(--transition-all-normal)',
  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
}}>
  Hover me
</div>
```

**Using Framer Motion (recommended):**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: 'spring',
    stiffness: 300,  // var(--spring-stiffness)
    damping: 25,     // var(--spring-damping)
    mass: 1          // var(--spring-mass)
  }}
>
  Card content
</motion.div>
```

---

## 🎨 Creating App Themes

Apps can customize their appearance by overriding semantic tokens.

### Example: Community Manager Theme

Create `community-manager-theme.css`:

```css
/* Override semantic tokens to customize appearance */
:root {
  /* Use Trust Blue as primary instead of Orange */
  --semantic-primary: var(--trust-blue);
  --semantic-primary-light: var(--trust-blue-light);
  --semantic-primary-dark: var(--trust-blue-dark);
  --semantic-primary-subtle: var(--trust-blue-subtle);

  /* Keep loomOS Orange as accent */
  --semantic-accent: var(--loomos-orange);
  --semantic-accent-light: var(--loomos-orange-light);
  --semantic-accent-dark: var(--loomos-orange-dark);
  --semantic-accent-subtle: var(--loomos-orange-subtle);

  /* Customize button colors */
  --semantic-btn-primary-bg: var(--trust-blue);
  --semantic-btn-primary-hover: var(--trust-blue-dark);
}
```

Import after semantic.css:
```css
@import '../design-tokens/semantic.css';
@import './community-manager-theme.css';  /* Override semantic tokens */
```

**All components automatically adapt** to the new theme!

---

## 🎯 Token Architecture

### Two-Tier System

```
┌─────────────────────────────────────────────┐
│  CORE TOKENS (core.css)                     │
│  Immutable loomOS brand                     │
│  --loomos-orange: #F18825                   │
│  --trust-blue: #2196F3                      │
│  --space-lg: 16px                           │
│  --radius-xl: 16px                          │
│  ❌ Apps must NOT override these            │
└─────────────────────────────────────────────┘
                    ↓ References
┌─────────────────────────────────────────────┐
│  SEMANTIC TOKENS (semantic.css)             │
│  Customizable mappings                      │
│  --semantic-primary: var(--loomos-orange)   │
│  --semantic-surface: #FFFFFF                │
│  --semantic-text-primary: #1E1E1E           │
│  ✅ Apps override these to customize        │
└─────────────────────────────────────────────┘
                    ↓ Used by
┌─────────────────────────────────────────────┐
│  COMPONENTS                                 │
│  <Card>, <Button>, <Header>, etc.          │
│  Use semantic tokens exclusively            │
│  Automatically adapt to theme changes       │
└─────────────────────────────────────────────┘
```

### Benefits

1. **Single source of truth** - Core tokens define the loomOS brand
2. **Easy customization** - Apps override semantic tokens only
3. **Automatic adaptation** - Components use semantic tokens
4. **Compatibility** - Apps can't break the loomOS brand
5. **Maintainability** - Update tokens once, changes everywhere

---

## 📖 Common Patterns

### Card Component

```tsx
// Use semantic tokens for consistent, themeable cards
const Card = ({ children }) => (
  <div style={{
    backgroundColor: 'var(--semantic-card-bg)',
    border: '1px solid var(--semantic-card-border)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-lg)',
    boxShadow: 'var(--semantic-card-shadow)',
    transition: 'var(--transition-all-normal)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = 'var(--semantic-card-shadow-hover)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'var(--semantic-card-shadow)';
  }}>
    {children}
  </div>
);
```

### Button Component

```tsx
const PrimaryButton = ({ children, ...props }) => (
  <button
    style={{
      backgroundColor: 'var(--semantic-btn-primary-bg)',
      color: 'var(--semantic-btn-primary-text)',
      padding: 'var(--space-md) var(--space-lg)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--font-semibold)',
      border: 'none',
      cursor: 'pointer',
      transition: 'var(--transition-all-fast)',
      minHeight: 'var(--touch-target-min)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'var(--semantic-btn-primary-hover)';
      e.currentTarget.style.transform = 'scale(var(--scale-102))';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'var(--semantic-btn-primary-bg)';
      e.currentTarget.style.transform = 'scale(1)';
    }}
    {...props}
  >
    {children}
  </button>
);
```

### Animated Card with Framer Motion

```tsx
import { motion } from 'framer-motion';

const AnimatedCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{
      scale: 1.02,
      boxShadow: 'var(--semantic-card-shadow-hover)'
    }}
    transition={{
      type: 'spring',
      stiffness: 300,  // loomOS standard
      damping: 25,
      mass: 1
    }}
    style={{
      backgroundColor: 'var(--semantic-card-bg)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-lg)',
      boxShadow: 'var(--semantic-card-shadow)'
    }}
  >
    {children}
  </motion.div>
);
```

---

## 🎬 Animation Examples

### Spring Physics (loomOS Standard)

```tsx
// Use the loomOS standard: 300/25/1
transition: {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 1
}
```

### CSS Transitions

```css
.element {
  transition: var(--transition-all-normal);
}

/* Or specific properties */
.element {
  transition: var(--transition-transform),
              var(--transition-colors),
              var(--transition-shadow);
}
```

### Keyframe Animations

```css
.fade-in {
  animation: fade-in var(--duration-normal) var(--ease-standard);
}

.slide-in {
  animation: slide-in-up var(--duration-normal) var(--ease-spring);
}
```

---

## 🛠️ Tailwind Integration

If using Tailwind CSS, extend your config with design tokens:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'loomos-orange': '#F18825',
        'trust-blue': '#2196F3',
        'growth-green': '#4CAF50',
        'semantic-primary': 'var(--semantic-primary)',
        'semantic-surface': 'var(--semantic-surface-base)',
        // ... add more semantic colors
      },
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        // ... etc
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'card-active': 'var(--shadow-card-active)',
      }
    }
  }
}
```

Then use in your markup:
```html
<div class="bg-semantic-surface p-lg rounded-xl shadow-card">
  Tailwind + Design Tokens
</div>
```

---

## 📱 Responsive Usage

Design tokens work seamlessly with media queries:

```css
.card {
  padding: var(--space-md);
  font-size: var(--text-sm);
}

@media (min-width: 768px) {
  .card {
    padding: var(--space-lg);
    font-size: var(--text-base);
  }
}

@media (min-width: 1024px) {
  .card {
    padding: var(--space-xl);
    font-size: var(--text-lg);
  }
}
```

---

## ♿ Accessibility

### Focus Indicators

Always use semantic focus tokens:
```css
.button:focus-visible {
  outline: var(--semantic-focus-ring);
  outline-offset: var(--semantic-focus-ring-offset);
}
```

Or use the utility class:
```html
<button class="focus-visible">Click me</button>
```

### Reduced Motion

Tokens automatically respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are shortened to 0.01ms */
}
```

### Touch Targets

Always use minimum touch target size:
```css
.button {
  min-height: var(--touch-target-min);  /* 44px */
  min-width: var(--touch-target-min);
}
```

---

## 🔍 Token Reference

### Most Common Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--semantic-primary` | `#F18825` | Primary brand color |
| `--semantic-surface-base` | `#FFFFFF` | Card backgrounds |
| `--semantic-text-primary` | `#1E1E1E` | Main text |
| `--space-lg` | `16px` | Standard padding |
| `--radius-xl` | `16px` | Card border radius |
| `--shadow-card` | Shadow | Card shadow |
| `--duration-normal` | `200ms` | Standard animation |
| `--ease-spring` | Cubic bezier | Spring-like easing |

### Complete Token Lists

- **Core Tokens**: See `core.css` for full list
- **Semantic Tokens**: See `semantic.css` for full list
- **Motion Tokens**: See `motion.css` for full list

---

## 📚 Additional Resources

- **Master Design System**: `/loomOS_DESIGN_SYSTEM.md`
- **Example Themes**: `/example-themes/`
- **Component Library**: Coming soon
- **Storybook**: Coming soon

---

## 🎯 Best Practices

### ✅ Do

- Use semantic tokens in components (`--semantic-primary`)
- Override semantic tokens for app themes
- Use spring physics for animations (300/25/1)
- Respect `prefers-reduced-motion`
- Use minimum 44px touch targets
- Test in both light and dark mode

### ❌ Don't

- Override core tokens (`--loomos-orange`)
- Use hardcoded colors (`#F18825`)
- Skip semantic layer (don't use core tokens directly)
- Ignore accessibility features
- Use non-standard spring physics
- Forget dark mode support

---

## 🔄 Migration Guide

### From Tailwind Classes

**Before:**
```html
<div class="bg-white text-gray-900 p-6 rounded-2xl shadow-lg">
```

**After:**
```html
<div style="
  background-color: var(--semantic-surface-base);
  color: var(--semantic-text-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
">
```

### From Old Token System

If migrating from `design-tokens.css`:

1. Replace `--brand-primary` → `--semantic-primary`
2. Replace `--surface-tertiary` → `--semantic-surface-base`
3. Replace `--text-primary` → `--semantic-text-primary`
4. Import `semantic.css` instead of `design-tokens.css`

---

## 🐛 Troubleshooting

### Tokens not working?

1. ✅ Check you've imported `semantic.css`
2. ✅ Verify import path is correct
3. ✅ Make sure CSS is loaded before components
4. ✅ Check browser DevTools for CSS custom property support

### Theme not applying?

1. ✅ Ensure theme file is imported AFTER `semantic.css`
2. ✅ Verify you're overriding semantic tokens, not core
3. ✅ Check specificity (use `:root` selector)
4. ✅ Clear browser cache

### Animations not smooth?

1. ✅ Use spring physics (300/25/1)
2. ✅ Import `motion.css`
3. ✅ Check `prefers-reduced-motion` isn't active
4. ✅ Verify GPU acceleration is enabled

---

**loomOS Design Tokens v1.0**
*Liberation from Walled Gardens* 🍊

For questions or issues, see the main documentation at `/loomOS_DESIGN_SYSTEM.md`
