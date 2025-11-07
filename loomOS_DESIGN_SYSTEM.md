# loomOS Design System

**Version:** 1.0
**Last Updated:** November 7, 2025
**Status:** Official Design System

---

## 🎯 Design Philosophy

loomOS is a liberation-focused operating system inspired by the revolutionary webOS. Our design system embodies:

### Core Principles

1. **Activity-Centric, Not App-Centric**
   - Focus on what users are doing, not which app they're using
   - Seamless context switching between activities
   - Unified experience across all apps

2. **Live Card Previews**
   - Real-time content updates in minimized cards
   - No static screenshots—apps stay alive
   - Instant resume from any state

3. **Liberation from Walled Gardens**
   - No vendor lock-in
   - Open marketplace (install from anywhere)
   - Data ownership and portability
   - PWAs as first-class citizens

4. **Physics-Based Interactions**
   - Natural, tangible feel
   - Spring physics (300 stiffness, 25 damping, 1 mass)
   - Gesture-driven navigation

---

## 🎨 Color System

### Signature loomOS Brand Color

**Orange #F18825** is the primary brand color representing liberation, warmth, and openness.

```css
--loomos-orange: #F18825;  /* Primary brand color */
```

### Core Color Palette

#### Brand Colors
- **loomOS Orange**: `#F18825` - Primary brand, liberation & warmth
- **Trust Blue**: `#2196F3` - Reliability & openness (secondary)
- **Growth Green**: `#4CAF50` - Freedom & progress

#### Neutral Colors (Warm Gray Scale)
- **Surface Gray**: `#EAEAEA` - Card backgrounds
- **Background Gray**: `#E8E8E8` - Main background
- **Chrome Dark**: `#333333` - Dark chrome elements
- **Chrome Light**: `#4C4C4C` - Light chrome elements

#### Text Colors
- **Primary Text**: `#1E1E1E` - Main content
- **Secondary Text**: `#666666` - Supporting content
- **Tertiary Text**: `#999999` - Subtle hints
- **Inverse Text**: `#FFFFFF` - Text on dark backgrounds
- **Disabled Text**: `#CCCCCC` - Disabled states

#### Semantic Colors
- **Success**: `#4CAF50` - Confirmations, success states
- **Error**: `#F44336` - Errors, destructive actions
- **Warning**: `#FF9800` - Warnings, cautions
- **Info**: `#2196F3` - Informational messages

#### Activity Colors
- **Email**: `#4285F4`
- **Calendar**: `#34A853`
- **Tasks**: `#FBBC04`
- **Notes**: `#EA4335`
- **Social**: `#8E24AA`

### Dark Mode Colors

loomOS automatically adapts to dark mode:

- **Surface Gray**: `#2A2A2A`
- **Background**: `#1E1E1E`
- **Surface Elevated**: `#333333`
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#CCCCCC`
- **Tertiary Text**: `#999999`

---

## 📐 Typography

### Font Family

**Primary**: Prelude (custom loomOS font)
**Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
**Monospace**: `"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace`

### Font Scale

```css
--text-xs: 11px;    /* Small labels */
--text-sm: 13px;    /* Secondary content */
--text-base: 14px;  /* Body text */
--text-lg: 16px;    /* Emphasized text */
--text-xl: 18px;    /* Subheadings */
--text-2xl: 24px;   /* Headings */
--text-3xl: 30px;   /* Large headings */
--text-4xl: 36px;   /* Hero text */
```

### Font Weights

```css
--font-normal: 400;     /* Body text */
--font-medium: 500;     /* Emphasis */
--font-semibold: 600;   /* Strong emphasis */
--font-bold: 700;       /* Headings */
```

### Line Heights

```css
--leading-tight: 1.25;   /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Comfortable reading */
```

---

## 📏 Spacing & Layout

### Spacing Scale (4px grid)

```css
--space-xs: 4px;    /* 0.5 units */
--space-sm: 8px;    /* 1 unit */
--space-md: 12px;   /* 1.5 units */
--space-lg: 16px;   /* 2 units */
--space-xl: 24px;   /* 3 units */
--space-2xl: 32px;  /* 4 units */
--space-3xl: 48px;  /* 6 units */
--space-4xl: 64px;  /* 8 units */
```

### Component Dimensions

```css
--touch-target: 44px;       /* Minimum touch target (iOS/Android standard) */
--card-radius: 8px;         /* Standard card corner radius */
--card-padding: 16px;       /* Standard card padding */
--list-item-height: 56px;   /* Standard list item height */
--header-height: 56px;      /* App header height */
--dock-height: 72px;        /* Dock height */
--gesture-area: 48px;       /* Bottom gesture area */
```

### Border Radius Scale

```css
--radius-sm: 4px;      /* Small elements */
--radius-md: 8px;      /* Cards, buttons */
--radius-lg: 12px;     /* Panels, dialogs */
--radius-xl: 16px;     /* Large cards */
--radius-2xl: 24px;    /* Extra large surfaces */
--radius-full: 9999px; /* Pills, badges, circles */
```

---

## ⚡ Motion System

### Spring Physics (The loomOS Standard)

All animations use spring physics for natural, tangible feel:

```javascript
spring: {
  stiffness: 300,  // How "tight" the spring is
  damping: 25,     // Resistance/bounce
  mass: 1          // Element weight
}
```

### Duration Scale

```css
--duration-instant: 100ms;   /* Immediate feedback */
--duration-fast: 150ms;      /* Quick transitions */
--duration-normal: 200ms;    /* Standard animations */
--duration-slow: 300ms;      /* Emphasis */
--duration-slower: 500ms;    /* Major transitions */
--duration-slowest: 700ms;   /* Dramatic effects */
```

### Easing Functions

```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);    /* Standard ease */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);    /* Deceleration */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);    /* Acceleration */
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);       /* Sharp transition */
--ease-spring: cubic-bezier(0.42, 0, 0.58, 1);    /* Spring-like */
```

### Gesture Thresholds

```javascript
gesture: {
  velocityThreshold: 750,   // px/s for swipe actions
  distanceThreshold: 100,   // px for swipe recognition
  flickVelocity: 300        // px/s for quick flicks
}
```

---

## 🃏 Component Patterns

### Card-Based UI

The fundamental unit of loomOS is the **card**:

- **Live previews** - Content updates in real-time
- **Spring physics** - Natural drag and drop
- **Multiple states** - Normal, minimized, maximized
- **Gesture support** - Flick to dismiss, drag to reorder

**Card States:**
```javascript
{
  normal: { scale: 1, shadow: 'card' },
  minimized: { scale: 0.25, shadow: 'sm' },
  maximized: { scale: 1, shadow: 'xl' },
  active: { scale: 1, shadow: 'card-active' }
}
```

### Three-Pane Layout

The signature loomOS layout pattern (from webOS Mail):

```
┌─────────────┬──────────────┬─────────────────┐
│ Navigation  │ List/Summary │ Detail/Content  │
│ 240-300px   │ 300-400px    │ Flexible        │
└─────────────┴──────────────┴─────────────────┘
```

**Responsive Behavior:**
- **Desktop**: All 3 panes visible
- **Tablet**: 2 panes (navigation OR detail)
- **Mobile**: 1 pane (stack navigation)

### Just Type Search

Global search activated by typing anywhere:

- Appears instantly when typing
- Fuzzy search across all apps
- Keyboard-first navigation
- Spring animation entrance

### Dock

Bottom-aligned app launcher:

- **Icon Size**: 56px
- **Height**: 72px
- **Glassmorphism**: Translucent background with blur
- **Hover**: Scale 1.15 + translateY(-5px)
- **Active indicator**: Orange dot below icon

---

## 🎭 Shadows & Elevation

### Shadow Scale

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);                              /* Subtle */
--shadow-base: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); /* Default */
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);                          /* Raised */
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);                        /* Elevated */
--shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);                        /* Floating */
--shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25);                     /* Modal */
--shadow-card: 0 2px 10px rgba(0,0,0,0.1);                            /* Cards */
--shadow-card-active: 0 8px 20px rgba(0,0,0,0.15);                    /* Active card */
```

### Z-Index Layers

```css
--z-base: 0;              /* Base layer */
--z-card: 10;             /* Card layer */
--z-card-active: 20;      /* Active card */
--z-dock: 100;            /* Dock */
--z-gesture-area: 200;    /* Gesture area */
--z-dropdown: 1000;       /* Dropdowns */
--z-modal-backdrop: 1040; /* Modal backdrop */
--z-modal: 1050;          /* Modals */
--z-popover: 1060;        /* Popovers */
--z-tooltip: 1070;        /* Tooltips */
--z-notification: 1080;   /* Notifications */
```

---

## 📱 Responsive Breakpoints

```css
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

---

## ♿ Accessibility

### Touch Targets

Minimum touch target: **44px × 44px** (iOS/Android standard)

### Focus Indicators

```css
.focus-visible {
  outline: 2px solid var(--loomos-orange);
  outline-offset: 2px;
}
```

### Reduced Motion

Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

All text meets WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio
- **Large text**: 3:1 contrast ratio

---

## 🛠️ Developer Guidelines

### Semantic Token Architecture

loomOS uses a two-tier token system:

1. **Core Tokens** (`design-tokens/core.css`) - **Never modified by apps**
   - Base colors, spacing, typography
   - The immutable loomOS brand

2. **Semantic Tokens** (`design-tokens/semantic.css`) - **Apps customize these**
   - Maps core tokens to contextual meanings
   - `--semantic-primary`, `--semantic-accent`, etc.
   - Apps override to customize their theme

### App Customization

Apps can create theme files that override semantic tokens:

```css
/* community-manager-theme.css */
:root {
  --semantic-primary: var(--trust-blue);  /* Override to Trust Blue */
  --semantic-accent: var(--loomos-orange); /* Keep loomOS orange as accent */
}
```

**All components automatically adapt** to semantic token overrides.

### Using Design Tokens

**✅ Preferred:**
```tsx
<div style={{
  backgroundColor: 'var(--semantic-surface-elevated)',
  color: 'var(--semantic-text-primary)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-xl)'
}}>
```

**❌ Avoid:**
```tsx
<div className="bg-white text-gray-900 p-6 rounded-2xl">
```

### Animation Best Practices

1. **Always use spring physics** for natural feel
2. **Respect `prefers-reduced-motion`**
3. **Keep animations fast** (150-300ms)
4. **Use gesture thresholds** for swipe actions

### Component Development

1. **Build with cards** - The fundamental loomOS unit
2. **Support three-pane layouts** - Navigation, list, detail
3. **Live previews** - Content updates when minimized
4. **Gesture support** - Swipe, flick, long-press

---

## 🌐 Platform Integration

### webOS Heritage

loomOS inherits from webOS:

- **Card multitasking** - Live app previews
- **Just Type** - Universal search
- **Synergy** - Unified data from multiple sources
- **Gestures** - Natural, physics-based interactions

### PWA Support

loomOS treats PWAs as first-class apps:

- **Install from any URL** - No app store required
- **Full system integration** - Notifications, file access
- **Offline support** - Service workers
- **Auto-updates** - Always current

### Open Marketplace

- **No gatekeepers** - Install from anywhere
- **No installation fees** - Free for developers
- **Open standards** - Web technologies
- **Data portability** - Export anytime

---

## 📚 Resources

### Design Token Files

- **Core Tokens**: `/design-tokens/core.css`
- **Semantic Tokens**: `/design-tokens/semantic.css`
- **Motion Tokens**: `/design-tokens/motion.css`
- **Usage Guide**: `/design-tokens/README.md`

### Example Themes

- **Community Manager Theme**: `/example-themes/community-manager-theme.css`

### Documentation

- **Semantic Tokens Implementation**: `/SEMANTIC_TOKENS_IMPLEMENTATION.md`
- **loomOS Rebranding**: `/LOOMOS_REBRANDING.md`

---

## 🎁 Summary

### The loomOS Formula

```
loomOS Orange #F18825 (liberation & warmth)
+ Spring Physics (300/25/1)
+ Card-Based UI (live previews)
+ Three-Pane Layouts (activity-centric)
+ Just Type Search (keyboard-first)
+ Open Marketplace (no lock-in)
= Liberation from Walled Gardens
```

### Key Differentiators

1. **Orange is our signature** - Not blue, not green—orange represents liberation
2. **Spring physics everywhere** - 300/25/1 is the loomOS standard
3. **Live card previews** - Apps stay alive, not frozen screenshots
4. **Install from anywhere** - No app store gatekeepers
5. **Data ownership** - Export anytime, interoperable formats

---

**loomOS Design System v1.0**
*Liberation from Walled Gardens* 🍊

---

## Version History

- **v1.0** (Nov 7, 2025) - Initial unified design system
  - Established Orange #F18825 as primary brand color
  - Defined spring physics standard (300/25/1)
  - Created semantic token architecture
  - Documented three-pane layout pattern
  - Added app customization guidelines
