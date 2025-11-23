# webOS Design System Documentation

> **Version 1.0.0** | Last Updated: November 21, 2025

A comprehensive design system for loomOS based on the classic Palm/HP webOS aesthetic, featuring a minimalist neutral palette, glassmorphic effects, and clean typography.

---

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Architecture](#architecture)
4. [Design Tokens](#design-tokens)
5. [Color System](#color-system)
6. [Typography](#typography)
7. [Spacing](#spacing)
8. [Components](#components)
9. [Tailwind Integration](#tailwind-integration)
10. [Usage Guidelines](#usage-guidelines)
11. [Migration Guide](#migration-guide)
12. [Examples](#examples)

---

## Overview

The webOS Design System provides a unified, single source of truth for all design decisions in loomOS. It consolidates previously scattered design tokens and establishes clear naming conventions and hierarchies.

### Key Features

- ✅ **Single Source of Truth**: All design tokens in one consolidated file
- ✅ **Neutral Palette**: Pure grays with no blue tints (following Palm webOS)
- ✅ **CSS Variables**: Runtime theming and dark mode support
- ✅ **Tailwind Integration**: Seamless utility class generation
- ✅ **Component Tokens**: Pre-configured styling for common UI elements
- ✅ **Accessible**: WCAG 2.1 AA compliant color contrasts
- ✅ **Responsive**: Mobile-first with glassmorphic effects

---

## Design Philosophy

### Palm webOS Aesthetic

The design system is inspired by the original Palm/HP webOS interface:

```
┌─────────────────────────────────┐
│  JUST TYPE                    🔍 │  ← Minimalist search
├─────────────────────────────────┤
│                                 │
│   ┌─────────┐  ┌─────────┐    │  ← Pure white cards
│   │         │  │         │    │     on light gray
│   │  Card   │  │  Card   │    │     backgrounds
│   │         │  │         │    │
│   └─────────┘  └─────────┘    │
│                                 │
└─────────────────────────────────┘
│  🌐  ✉️  📅  💬  👤  🖼️  🏠   │  ← Simple, flat dock
└─────────────────────────────────┘
```

### Core Principles

1. **Minimalism**: Clean, uncluttered interface with maximum content focus
2. **Neutrality**: Pure neutral grays - no color bias or blue tints
3. **Clarity**: Light typography (Helvetica Neue) with excellent readability
4. **Subtlety**: Gentle shadows and glassmorphic effects
5. **Consistency**: Predictable patterns and behaviors

### Color Philosophy

- **Backgrounds**: Light neutral grays (#e8e8e8, #f5f5f5)
- **Surfaces**: Pure white (#ffffff) cards with subtle shadows
- **Text**: Pure black (#000000) for maximum contrast
- **Accents**: Minimal color usage - blue for links only (#4a90e2)
- **Glass**: Translucent overlays with backdrop blur

---

## Architecture

### File Structure

```
loomOS/
├── styles/
│   └── webos-design-system.css    # ⭐ Single source of truth
├── tailwind.config.ts              # Tailwind configuration
├── app/
│   └── globals.css                 # Global styles + design system import
└── docs/
    └── DESIGN_SYSTEM.md            # This documentation
```

### Token Hierarchy

```
┌──────────────────────────────────────────┐
│   PART 1: CORE TOKENS (Immutable)       │
│   - Neutral colors                        │
│   - Text colors                           │
│   - Spacing scale                         │
│   - Typography                            │
│   - Shadows                               │
│   - Border radius                         │
│   - Animations                            │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   PART 2: SEMANTIC TOKENS (Contextual)  │
│   - Semantic backgrounds                  │
│   - Semantic text                         │
│   - Semantic borders                      │
│   - Semantic actions                      │
│   - Semantic status                       │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   PART 3: COMPONENT TOKENS               │
│   - Button styling                        │
│   - Input styling                         │
│   - Card styling                          │
│   - Navigation styling                    │
│   - Dock styling                          │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   TAILWIND UTILITIES                     │
│   bg-primary, text-secondary, etc.       │
└──────────────────────────────────────────┘
```

---

## Design Tokens

### What are Design Tokens?

Design tokens are named entities that store visual design attributes. They're the atomic design decisions of your design system.

**Example:**
```css
/* Instead of: */
background-color: #e8e8e8;

/* Use: */
background-color: var(--bg-primary);
```

### Benefits

1. **Consistency**: Same value everywhere
2. **Maintainability**: Change once, update everywhere
3. **Theming**: Easy light/dark mode switching
4. **Documentation**: Self-documenting code
5. **Collaboration**: Shared language between design and development

---

## Color System

### Neutral Palette

Pure neutral grays with **NO blue tints** (following Palm webOS aesthetic).

| Token | Value | Usage | Example |
|-------|-------|-------|---------|
| `--neutral-50` | `#fafafa` | Ultra light surfaces | Hover states |
| `--neutral-100` | `#f5f5f5` | Light surfaces | Secondary backgrounds |
| `--neutral-200` | `#eeeeee` | Secondary backgrounds | Panel backgrounds |
| `--neutral-300` | `#e8e8e8` | **Primary background** | Main app background |
| `--neutral-400` | `#e0e0e0` | Borders, dividers | Default borders |
| `--neutral-500` | `#d4d4d4` | Medium borders | Emphasized borders |
| `--neutral-600` | `#b0b0b0` | Strong borders | Strong dividers |
| `--neutral-700` | `#999999` | Tertiary text | Hints, labels |
| `--neutral-800` | `#666666` | Secondary text | Captions |
| `--neutral-900` | `#333333` | Primary text | Body text |
| `--neutral-950` | `#1a1a1a` | Dark chrome | Headers, toolbars |

### Background Colors

```css
--bg-primary:    #e8e8e8;   /* Main app background */
--bg-secondary:  #eeeeee;   /* Secondary areas */
--bg-tertiary:   #f5f5f5;   /* Tertiary areas */
--bg-surface:    #ffffff;   /* Cards, panels (pure white) */
--bg-elevated:   #ffffff;   /* Elevated surfaces */
--bg-hover:      #fafafa;   /* Hover states */
--bg-active:     #f5f5f5;   /* Active states */
```

### Text Colors

```css
--text-primary:   #000000;  /* Primary text (pure black) */
--text-secondary: #666666;  /* Secondary text, labels */
--text-tertiary:  #999999;  /* Hints, placeholders */
--text-disabled:  #cccccc;  /* Disabled state */
--text-inverse:   #ffffff;  /* Text on dark backgrounds */
```

### Accent Colors

**Minimal usage** - only for critical interactions.

```css
/* Primary Accent (webOS Blue) */
--accent-blue:         #4a90e2;  /* Links, selections */
--accent-blue-light:   #6ba3e8;  /* Light variant */
--accent-blue-dark:    #3a7bc8;  /* Dark variant */
--accent-blue-subtle:  rgba(74, 144, 226, 0.08);  /* Subtle background */
```

### Status Colors

```css
/* Success */
--status-success:        #5cb85c;
--status-success-subtle: rgba(92, 184, 92, 0.08);

/* Error */
--status-error:          #d9534f;
--status-error-subtle:   rgba(217, 83, 79, 0.08);

/* Warning */
--status-warning:        #f0ad4e;
--status-warning-subtle: rgba(240, 173, 78, 0.08);

/* Info */
--status-info:           #4a90e2;
--status-info-subtle:    rgba(74, 144, 226, 0.08);
```

### Glass Effects

For overlays, modals, and floating elements.

```css
/* Glass Backgrounds */
--glass-white-95: rgba(255, 255, 255, 0.95);  /* Near-opaque */
--glass-white-80: rgba(255, 255, 255, 0.80);  /* Standard glass */
--glass-white-60: rgba(255, 255, 255, 0.60);  /* Lighter glass */

--glass-black-80: rgba(0, 0, 0, 0.80);        /* Dark overlays */
--glass-black-40: rgba(0, 0, 0, 0.40);        /* Modal backdrops */

/* Backdrop Blur */
--blur-sm:  8px;   /* Subtle blur */
--blur-md:  12px;  /* Standard blur */
--blur-lg:  20px;  /* Strong blur */
--blur-xl:  32px;  /* Extra strong blur */
```

### Dark Mode

All colors automatically invert in dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary:    #1a1a1a;  /* Dark background */
    --bg-surface:    #2a2a2a;  /* Dark surface */
    --text-primary:  #ffffff;  /* Light text */
    /* ... etc */
  }
}
```

---

## Typography

### Font Families

```css
--font-sans:    'Helvetica Neue', 'Helvetica', Arial, sans-serif;
--font-serif:   Georgia, Cambria, 'Times New Roman', serif;
--font-mono:    'SF Mono', Monaco, Consolas, monospace;
--font-display: var(--font-sans);  /* Use Helvetica Neue for display */
```

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `--text-2xs` | 10px | Tiny labels |
| `--text-xs` | 11px | Small labels, fine print |
| `--text-sm` | 13px | Secondary text |
| `--text-base` | 14px | **Base body text** |
| `--text-md` | 16px | Emphasized body |
| `--text-lg` | 18px | Small headings |
| `--text-xl` | 20px | Headings |
| `--text-2xl` | 24px | Large headings |
| `--text-3xl` | 30px | Display text |
| `--text-4xl` | 36px | Hero text |
| `--text-5xl` | 48px | Large display |
| `--text-6xl` | 60px | Extra large display |

### Font Weights

**Prefer light weights** for elegance:

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-thin` | 100 | Rarely used |
| `--font-extralight` | 200 | Large headings |
| `--font-light` | 300 | **Most text (default)** |
| `--font-normal` | 400 | Emphasis only |
| `--font-medium` | 500 | Strong emphasis |
| `--font-semibold` | 600 | Rare - critical UI only |
| `--font-bold` | 700 | Avoid |

### Line Heights

```css
--leading-none:    1;      /* Tight headings */
--leading-tight:   1.25;   /* Headings */
--leading-snug:    1.375;  /* Comfortable headings */
--leading-normal:  1.5;    /* Body text */
--leading-relaxed: 1.625;  /* Spacious body */
--leading-loose:   2;      /* Very spacious */
```

### Letter Spacing

```css
--tracking-tighter:  -0.05em;  /* Tight display text */
--tracking-tight:    -0.025em; /* Slightly tight */
--tracking-normal:   0em;      /* Default */
--tracking-wide:     0.025em;  /* Labels */
--tracking-wider:    0.05em;   /* Uppercase labels */
--tracking-widest:   0.1em;    /* "JUST TYPE" style */
```

---

## Spacing

### Spacing Scale (4px grid)

| Token | Size | Usage |
|-------|------|-------|
| `--space-0` | 0px | None |
| `--space-1` | 4px | Tiny gaps |
| `--space-2` | 8px | Small gaps |
| `--space-3` | 12px | Medium gaps |
| `--space-4` | 16px | **Base spacing** |
| `--space-6` | 24px | Large gaps |
| `--space-8` | 32px | Extra large gaps |
| `--space-12` | 48px | Section spacing |
| `--space-16` | 64px | Large section spacing |
| `--space-24` | 96px | Hero spacing |

### Semantic Aliases

```css
--space-xs:  4px;   /* Extra small */
--space-sm:  8px;   /* Small */
--space-md:  12px;  /* Medium */
--space-base: 16px; /* Base (default) */
--space-lg:  24px;  /* Large */
--space-xl:  32px;  /* Extra large */
--space-2xl: 48px;  /* 2x extra large */
--space-3xl: 64px;  /* 3x extra large */
--space-4xl: 96px;  /* 4x extra large */
```

---

## Components

### Buttons

```css
/* Button Tokens */
--button-height: 48px;
--button-padding-x: 16px;
--button-radius: 8px;
--button-font-size: 14px;
--button-font-weight: 400;
```

**Example:**

```tsx
// Primary Button
<button className="h-12 px-4 bg-accent-blue text-white rounded-md
                   hover:bg-accent-blue-dark transition-fast">
  Click Me
</button>

// Secondary Button
<button className="h-12 px-4 bg-surface text-primary rounded-md
                   border border-light hover:bg-hover transition-fast">
  Cancel
</button>
```

### Cards

```css
/* Card Tokens */
--card-bg: #ffffff;
--card-border: #eeeeee;
--card-radius: 12px;
--card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
--card-padding: 16px;
```

**Example:**

```tsx
<div className="bg-surface rounded-lg shadow-card p-4
                border border-lightest">
  <h3 className="text-lg font-light mb-2">Card Title</h3>
  <p className="text-sm text-secondary">Card content goes here.</p>
</div>
```

### Inputs

```css
/* Input Tokens */
--input-height: 48px;
--input-padding-x: 12px;
--input-radius: 8px;
--input-bg: #ffffff;
--input-border: #e0e0e0;
--input-border-focus: #4a90e2;
```

**Example:**

```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="h-12 px-3 bg-surface rounded-md border border-light
             focus:border-focus focus:shadow-focus
             text-base text-primary placeholder:text-tertiary
             transition-fast"
/>
```

### Navigation/Dock

```css
/* Dock Tokens */
--dock-bg: rgba(0, 0, 0, 0.80);
--dock-radius: 32px;
--dock-padding: 12px;
--dock-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
--dock-icon-size: 56px;
--dock-backdrop-blur: 20px;
```

**Example:**

```tsx
<nav className="fixed bottom-6 left-1/2 -translate-x-1/2
                bg-glass-black-80 backdrop-blur-lg
                rounded-4xl shadow-dock px-3 py-3
                flex items-center gap-3">
  {/* Dock icons */}
</nav>
```

### Modals

```css
/* Modal Tokens */
--modal-bg: #ffffff;
--modal-radius: 24px;
--modal-shadow: 0 20px 40px rgba(0, 0, 0, 0.30);
--modal-padding: 24px;
--modal-backdrop: rgba(0, 0, 0, 0.5);
--modal-backdrop-blur: 8px;
```

**Example:**

```tsx
{/* Backdrop */}
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[600]" />

{/* Modal */}
<div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
  <div className="bg-surface rounded-3xl shadow-modal p-6
                  max-w-lg w-full">
    <h2 className="text-2xl font-light mb-4">Modal Title</h2>
    <p className="text-base text-secondary">Modal content...</p>
  </div>
</div>
```

---

## Tailwind Integration

### How It Works

1. **CSS Variables defined** in `/styles/webos-design-system.css`
2. **Tailwind config** maps variables to utilities in `tailwind.config.ts`
3. **Utilities generated** - use in components

```tsx
// ✅ Good: Use Tailwind utilities
<div className="bg-primary text-primary p-4 rounded-lg shadow-card">

// ❌ Bad: Inline CSS variables
<div style={{ backgroundColor: 'var(--bg-primary)' }}>
```

### Common Utilities

#### Backgrounds
```tsx
className="bg-primary"     // #e8e8e8 - Main background
className="bg-surface"     // #ffffff - Cards
className="bg-hover"       // #fafafa - Hover state
```

#### Text
```tsx
className="text-primary"   // #000000 - Primary text
className="text-secondary" // #666666 - Secondary text
className="text-tertiary"  // #999999 - Hint text
```

#### Borders
```tsx
className="border border-light"  // Default border
className="border-focus"         // Focus border
```

#### Spacing
```tsx
className="p-4"      // Padding: 16px
className="gap-lg"   // Gap: 24px
className="mt-xl"    // Margin-top: 32px
```

#### Shadows
```tsx
className="shadow-card"   // Card shadow
className="shadow-lg"     // Large shadow
className="shadow-focus"  // Focus shadow
```

#### Typography
```tsx
className="text-base font-light"  // 14px, weight 300
className="text-xl font-normal"   // 20px, weight 400
```

---

## Usage Guidelines

### Do's ✅

1. **Use design tokens** instead of hardcoded values
   ```tsx
   // ✅ Good
   className="bg-primary text-primary"
   
   // ❌ Bad
   style={{ backgroundColor: '#e8e8e8', color: '#000000' }}
   ```

2. **Use semantic names** for clarity
   ```tsx
   // ✅ Good
   className="bg-surface shadow-card"
   
   // ❌ Bad
   className="bg-white shadow-md"
   ```

3. **Follow the spacing scale** (4px grid)
   ```tsx
   // ✅ Good
   className="p-4 gap-lg"  // 16px, 24px
   
   // ❌ Bad
   className="p-[17px] gap-[23px]"
   ```

4. **Prefer light fonts** for elegance
   ```tsx
   // ✅ Good
   className="font-light"
   
   // ❌ Bad
   className="font-bold"
   ```

5. **Use minimal color** - neutrals first
   ```tsx
   // ✅ Good
   <button className="bg-surface text-primary border border-light">
   
   // ❌ Bad - too much color
   <button className="bg-blue-500 text-yellow-300">
   ```

### Don'ts ❌

1. **Don't use arbitrary values** without reason
   ```tsx
   // ❌ Bad
   className="p-[13px] text-[15.5px]"
   ```

2. **Don't mix color systems**
   ```tsx
   // ❌ Bad - mixing Tailwind's blue with design tokens
   className="bg-blue-500 text-primary"
   
   // ✅ Good
   className="bg-accent-blue text-white"
   ```

3. **Don't create custom colors** without adding to design system
   ```tsx
   // ❌ Bad
   style={{ color: '#ff6b9d' }}
   
   // ✅ Good - add to design system first
   --custom-pink: #ff6b9d;
   ```

4. **Don't ignore dark mode**
   ```tsx
   // ❌ Bad
   className="bg-white text-black"
   
   // ✅ Good - works in dark mode
   className="bg-surface text-primary"
   ```

---

## Migration Guide

### Step 1: Update Imports

**In `app/globals.css`:**

```css
/* OLD: Multiple scattered imports from /styles/ */
@import '../styles/webos-design-tokens.css';
@import '../styles/design-tokens.css';
@import '../styles/loomos-tokens.css';

/* CURRENT: Unified design token imports from /design-tokens/ */
@import '../design-tokens/core.css';
@import '../design-tokens/semantic.css';
@import '../design-tokens/motion.css';
```

### Step 2: Update Color References

**Find and replace:**

```tsx
// OLD
bg-loomos-grey          → bg-neutral-300
text-loomos-text        → text-primary
bg-loomos-surface       → bg-surface

// OLD Tailwind colors
bg-gray-100             → bg-neutral-100
bg-gray-200             → bg-neutral-200
text-gray-900           → text-primary
text-gray-600           → text-secondary
border-gray-300         → border-light

// OLD semantic tokens
bg-semantic-bg-base     → bg-primary
text-semantic-text      → text-primary
```

### Step 3: Update Spacing

```tsx
// OLD
p-loomos-md            → p-md
gap-loomos-lg          → gap-lg
mt-loomos-xl           → mt-xl

// OLD arbitrary values
p-[16px]               → p-4
gap-[24px]             → gap-lg
```

### Step 4: Update Component Styles

**Buttons:**
```tsx
// OLD
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg
                   hover:bg-blue-600">

// NEW
<button className="bg-accent-blue text-white px-6 py-3 rounded-md
                   hover:bg-accent-blue-dark transition-fast">
```

**Cards:**
```tsx
// OLD
<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">

// NEW
<div className="bg-surface p-6 rounded-lg shadow-card border border-lightest">
```

### Step 5: Test Dark Mode

```bash
# Enable dark mode
System Preferences → Appearance → Dark

# Or programmatically
document.documentElement.classList.add('dark')
```

Verify all components render correctly in dark mode.

---

## Examples

### Example 1: Simple Card

```tsx
export function SimpleCard() {
  return (
    <div className="bg-surface rounded-lg shadow-card p-4
                    border border-lightest">
      <h3 className="text-lg font-light text-primary mb-2">
        Card Title
      </h3>
      <p className="text-base text-secondary leading-normal">
        This is a simple card with proper design tokens.
      </p>
    </div>
  );
}
```

### Example 2: Button Group

```tsx
export function ButtonGroup() {
  return (
    <div className="flex items-center gap-md">
      {/* Primary Button */}
      <button className="h-12 px-4 bg-accent-blue text-white
                        rounded-md hover:bg-accent-blue-dark
                        transition-fast font-normal">
        Save
      </button>
      
      {/* Secondary Button */}
      <button className="h-12 px-4 bg-surface text-primary
                        border border-light rounded-md
                        hover:bg-hover transition-fast font-normal">
        Cancel
      </button>
    </div>
  );
}
```

### Example 3: Form Input

```tsx
export function FormInput() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-normal text-secondary">
        Email Address
      </label>
      <input
        type="email"
        placeholder="Enter your email..."
        className="w-full h-12 px-3 bg-surface rounded-md
                   border border-light text-base text-primary
                   placeholder:text-tertiary
                   focus:border-focus focus:shadow-focus
                   focus:outline-none transition-fast"
      />
      <p className="text-xs text-tertiary">
        We'll never share your email.
      </p>
    </div>
  );
}
```

### Example 4: Modal Dialog

```tsx
export function ModalDialog({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-glass-black-40 backdrop-blur-sm
                   z-[600] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[700] flex items-center
                     justify-center p-4">
        <div className="bg-surface rounded-3xl shadow-modal p-6
                       max-w-lg w-full animate-scale-in">
          <h2 className="text-2xl font-light text-primary mb-4">
            Confirm Action
          </h2>
          <p className="text-base text-secondary mb-6">
            Are you sure you want to proceed?
          </p>
          <div className="flex items-center justify-end gap-md">
            <button
              onClick={onClose}
              className="h-12 px-4 bg-surface text-primary
                        border border-light rounded-md
                        hover:bg-hover transition-fast">
              Cancel
            </button>
            <button className="h-12 px-4 bg-accent-blue text-white
                              rounded-md hover:bg-accent-blue-dark
                              transition-fast">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
```

### Example 5: Navigation Dock

```tsx
export function Dock() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2
                    bg-glass-black-80 backdrop-blur-lg
                    rounded-4xl shadow-dock px-3 py-3
                    flex items-center gap-3 z-[200]">
      <DockIcon icon="🌐" label="Browser" />
      <DockIcon icon="✉️" label="Email" />
      <DockIcon icon="📅" label="Calendar" />
      <DockIcon icon="💬" label="Messages" />
      <DockIcon icon="👤" label="Contacts" />
    </nav>
  );
}

function DockIcon({ icon, label }) {
  return (
    <button
      className="w-14 h-14 flex items-center justify-center
                rounded-xl hover:bg-white/20 active:scale-95
                transition-spring text-2xl"
      aria-label={label}
    >
      {icon}
    </button>
  );
}
```

### Example 6: Glass Card

```tsx
export function GlassCard() {
  return (
    <div className="bg-glass-white-80 backdrop-blur-lg
                    rounded-2xl shadow-card p-6
                    border border-glass-border-light">
      <h3 className="text-xl font-light text-primary mb-3">
        Glassmorphic Card
      </h3>
      <p className="text-base text-secondary">
        This card uses glassmorphism effects with backdrop blur.
      </p>
    </div>
  );
}
```

---

## FAQ

### Q: When should I use semantic tokens vs core tokens?

**A:** Always prefer semantic tokens in components:

```tsx
// ✅ Good - semantic
className="bg-surface text-primary"

// ❌ Bad - core tokens
className="bg-neutral-50 text-neutral-900"
```

Semantic tokens provide context and are app-customizable.

### Q: Can I add custom colors?

**A:** Yes, but add them to the design system first:

1. Add to `/styles/webos-design-system.css`:
   ```css
   --custom-pink: #ff6b9d;
   ```

2. Add to `tailwind.config.ts`:
   ```ts
   colors: {
     'custom-pink': 'var(--custom-pink)',
   }
   ```

3. Use in components:
   ```tsx
   className="bg-custom-pink"
   ```

### Q: How do I test dark mode?

**A:** Several ways:

```tsx
// 1. System preference
System Preferences → Appearance → Dark

// 2. Programmatically
document.documentElement.classList.add('dark')

// 3. In Next.js app
import { useTheme } from 'next-themes'
const { setTheme } = useTheme()
setTheme('dark')
```

### Q: What if I need a one-off value?

**A:** Use Tailwind arbitrary values sparingly:

```tsx
// OK for one-off cases
className="w-[347px]"

// But prefer adding to design system if reused
```

### Q: How do I override component tokens?

**A:** Use CSS custom properties:

```tsx
<div
  style={{
    '--button-height': '56px',
    '--button-radius': '16px',
  } as React.CSSProperties}
>
  <button>Large Button</button>
</div>
```

---

## Additional Resources

- **File**: `/styles/webos-design-system.css` - View all design tokens
- **File**: `/tailwind.config.ts` - Tailwind configuration
- **Reference**: Palm webOS UI screenshots
- **Figma**: (Coming soon)

---

## Changelog

### Version 1.0.0 (November 21, 2025)

- ✅ Initial release
- ✅ Consolidated design tokens from 6+ files into single source
- ✅ Implemented Palm webOS aesthetic
- ✅ Neutral color palette (no blue tints)
- ✅ Comprehensive documentation
- ✅ Tailwind integration
- ✅ Dark mode support
- ✅ Component tokens
- ✅ Migration guide

---

## Support

For questions or issues:

1. Check this documentation
2. Review `/styles/webos-design-system.css` for all available tokens
3. Consult the team in #design-system channel

---

**Made with ❤️ for loomOS** | Version 1.0.0
