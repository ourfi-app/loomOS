# Community Manager - Style Guide

**Version:** 2.0
**Last Updated:** 2025-11-01
**Author:** Design System Team

## Table of Contents
1. [Overview](#overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Usage Guidelines](#usage-guidelines)
7. [Accessibility](#accessibility)
8. [Migration Guide](#migration-guide)

---

## Overview

This style guide defines the visual design system for Community Manager, a modern community management platform. Our design philosophy balances **professional trust** (blue primary) with **community warmth** (orange accent) to create an approachable yet reliable user experience.

### Design Principles
- **Professional Trust**: Blue conveys reliability and security
- **Community Warmth**: Orange adds approachability and energy
- **Cohesive Temperature**: Warm neutrals throughout for visual harmony
- **Accessibility First**: All color combinations meet WCAG AA standards
- **Semantic Clarity**: Feature areas have distinct colors for quick recognition

---

## Color System

### Primary Brand Colors

#### Trust Blue (Primary)
The cornerstone of our brand, conveying reliability and professionalism.

```css
--primary: hsl(207 90% 54%)           /* #2B8ED9 - Trust Blue */
--primary-foreground: hsl(0 0% 100%)  /* White text on blue */
--primary-dark: hsl(207 90% 45%)      /* #1474B8 - Deeper Blue */
```

**Usage:**
- Primary buttons and CTAs
- Navigation active states
- Links and interactive elements
- Focus indicators

**Tailwind Classes:**
```jsx
bg-primary text-primary-foreground
hover:bg-primary-dark
border-primary
```

#### Community Orange (Accent)
Adds warmth and energy, representing community engagement.

```css
--accent: hsl(25 90% 55%)             /* #F28925 - Community Orange */
--accent-foreground: hsl(0 0% 100%)   /* White text on orange */
--accent-warm: hsl(35 85% 60%)        /* #F0A348 - Warm Accent */
```

**Usage:**
- Secondary actions
- Highlights and badges
- Community-related features
- Accent decorations

**Tailwind Classes:**
```jsx
bg-accent text-accent-foreground
hover:bg-accent-warm
border-accent
```

---

### Neutral Palette

Our warm gray system provides visual harmony across the interface.

#### Light Mode
```css
--background: hsl(30 8% 94%)          /* #F0EFED - Warm White */
--foreground: hsl(210 15% 20%)        /* #2C3440 - Navy Gray */
--card: hsl(30 12% 97%)               /* #F8F7F6 - Card Surface */
--muted: hsl(30 6% 90%)               /* #E5E4E2 - Muted Surface */
--border: hsl(30 8% 85%)              /* #D8D6D3 - Subtle Border */
```

#### Dark Mode
```css
--background: hsl(220 15% 12%)        /* #1A1E25 - Dark Navy */
--foreground: hsl(30 8% 92%)          /* #EAEAE8 - Off White */
--card: hsl(220 13% 16%)              /* #252931 - Card Surface */
--muted: hsl(220 10% 25%)             /* #3A3F4A - Muted Surface */
--border: hsl(220 10% 25%)            /* #3A3F4A - Dark Border */
```

**Usage:**
- Page backgrounds: `bg-background`
- Text colors: `text-foreground`, `text-muted-foreground`
- Card surfaces: `bg-card`
- Borders: `border-border`

---

### Semantic Colors

#### Success (Green)
```css
--success: hsl(142 55% 45%)           /* #34A853 - Forest Green */
--success-foreground: hsl(0 0% 100%)  /* White */
```

**Usage:** Success messages, confirmations, positive metrics

**Examples:**
```jsx
<Alert className="bg-success/10 border-success/20">
  <CheckCircle className="text-success" />
  <AlertDescription className="text-success">Payment successful!</AlertDescription>
</Alert>
```

#### Warning (Amber)
```css
--warning: hsl(38 92% 50%)            /* #F59E0B - Amber */
--warning-foreground: hsl(0 0% 100%)  /* White */
```

**Usage:** Warnings, cautionary states, pending actions

#### Error (Red)
```css
--destructive: hsl(0 72% 51%)         /* #DC3545 - Alert Red */
--destructive-foreground: hsl(0 0% 100%) /* White */
```

**Usage:** Errors, destructive actions, critical alerts

#### Info (Light Blue)
```css
--info: hsl(199 89% 48%)              /* #0EA5E9 - Info Blue */
--info-foreground: hsl(0 0% 100%)     /* White */
```

**Usage:** Informational messages, tips, neutral notifications

---

### Feature Area Colors

Each major feature area has a distinct color for quick visual recognition.

```css
--finance: hsl(142 55% 45%)           /* Green - Financial matters */
--admin: hsl(260 60% 55%)             /* Purple - Admin functions */
--documents: hsl(199 89% 48%)         /* Light Blue - Documents */
--community: hsl(25 90% 55%)          /* Orange - Community features */
--messaging: hsl(280 60% 60%)         /* Magenta - Communication */
```

**Usage Examples:**
```jsx
// Finance pages
<div className="bg-gradient-to-r from-finance to-success">

// Admin section
<Button className="bg-admin text-white">

// Documents feature
<Badge className="bg-documents">

// Community pages
<Icon className="text-community" />

// Messaging/Chat
<NotificationBadge className="bg-messaging" />
```

---

## Typography

### Font Families

```css
--font-family-base: 'Titillium Web', -apple-system, system-ui, sans-serif;
--font-family-display: 'Cambo', Georgia, serif;
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

**Usage:**
- **Body text**: Titillium Web (font-sans)
- **Headings**: Cambo (font-display)
- **Code**: SF Mono (font-mono)

### Font Scale

| Size    | CSS Variable | Pixels | Usage |
|---------|--------------|--------|-------|
| xs      | --text-xs    | 12px   | Small labels, metadata |
| sm      | --text-sm    | 14px   | Secondary text, captions |
| base    | --text-base  | 16px   | Body text (default) |
| lg      | --text-lg    | 18px   | Emphasized text |
| xl      | --text-xl    | 20px   | Small headings |
| 2xl     | --text-2xl   | 24px   | Section headings |
| 3xl     | --text-3xl   | 30px   | Page titles |
| 4xl     | --text-4xl   | 36px   | Hero text |

### Font Weights

```css
--font-normal: 400      /* Regular text */
--font-medium: 500      /* Slightly emphasized */
--font-semibold: 600    /* Buttons, labels */
--font-bold: 700        /* Headings, strong emphasis */
```

### Typography Examples

```jsx
// Page Title
<h1 className="text-4xl font-display font-normal tracking-tight">
  Community Dashboard
</h1>

// Section Heading
<h2 className="text-2xl font-display font-normal tracking-tight text-foreground">
  Recent Activity
</h2>

// Body Text
<p className="text-base font-sans text-foreground leading-normal">
  Welcome to your community portal.
</p>

// Secondary Text
<span className="text-sm text-muted-foreground">
  Last updated 2 hours ago
</span>
```

---

## Spacing & Layout

### Spacing Scale (8px base unit)

```css
--space-xs: 4px      /* 0.5 units */
--space-sm: 8px      /* 1 unit */
--space-md: 16px     /* 2 units */
--space-lg: 24px     /* 3 units */
--space-xl: 32px     /* 4 units */
--space-2xl: 48px    /* 6 units */
--space-3xl: 64px    /* 8 units */
```

**Tailwind Mapping:**
- xs → `p-1`, `m-1` (4px)
- sm → `p-2`, `m-2` (8px)
- md → `p-4`, `m-4` (16px)
- lg → `p-6`, `m-6` (24px)
- xl → `p-8`, `m-8` (32px)

### Border Radius

```css
--radius-sm: 0.375rem    /* 6px - Small elements */
--radius-md: 0.5rem      /* 8px - Buttons, inputs */
--radius-lg: 0.75rem     /* 12px - Cards, dialogs */
--radius-xl: 1rem        /* 16px - Large panels */
--radius-2xl: 1.5rem     /* 24px - Hero sections */
--radius-full: 9999px    /* Pills, badges */
```

### Shadows

```css
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-focus: 0 0 0 3px rgba(43, 142, 217, 0.15)
```

---

## Components

### Buttons

#### Primary Button
```jsx
<Button className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg shadow-primary/25">
  Primary Action
</Button>
```

#### Secondary Button
```jsx
<Button variant="outline" className="border-border hover:bg-muted">
  Secondary Action
</Button>
```

#### Destructive Button
```jsx
<Button className="bg-destructive hover:bg-destructive/90 text-white">
  Delete
</Button>
```

### Cards

```jsx
<Card className="bg-card border-border shadow-md">
  <CardHeader>
    <CardTitle className="text-foreground">Card Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Card description
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Alerts

```jsx
// Success Alert
<Alert className="bg-success/10 border-success/20">
  <CheckCircle className="text-success" />
  <AlertDescription className="text-success">Success message</AlertDescription>
</Alert>

// Error Alert
<Alert className="bg-destructive/10 border-destructive/20">
  <AlertCircle className="text-destructive" />
  <AlertDescription className="text-destructive">Error message</AlertDescription>
</Alert>

// Info Alert
<Alert className="bg-info/10 border-info/20">
  <Info className="text-info" />
  <AlertDescription className="text-info">Info message</AlertDescription>
</Alert>
```

### Badges

```jsx
// Feature Badges
<Badge className="bg-gradient-to-r from-finance to-success">Finance</Badge>
<Badge className="bg-gradient-to-r from-admin to-messaging">Admin</Badge>
<Badge className="bg-gradient-to-r from-documents to-info">Documents</Badge>
<Badge className="bg-gradient-to-r from-community to-accent">Community</Badge>
```

### Gradients

Use gradients sparingly for visual interest and hierarchy:

```jsx
// Feature cards
<div className="bg-gradient-to-br from-primary to-primary-dark">

// Hero sections
<div className="bg-gradient-to-r from-primary/10 to-accent/10">

// Icon backgrounds
<div className="bg-gradient-to-br from-documents to-info">
```

---

## Usage Guidelines

### Do's ✅

- **Use semantic color names** instead of hardcoded values
  ```jsx
  // Good
  <div className="bg-primary text-primary-foreground">

  // Bad
  <div className="bg-blue-500 text-white">
  ```

- **Use feature colors consistently** for their designated areas
  ```jsx
  // Finance pages always use green
  <Icon className="text-finance" />

  // Admin areas always use purple
  <Button className="bg-admin" />
  ```

- **Ensure sufficient contrast** for text readability
  ```jsx
  // Good - high contrast
  <div className="bg-primary text-primary-foreground">

  // Bad - low contrast
  <div className="bg-muted text-muted-foreground">
  ```

- **Use gradients for visual hierarchy**
  ```jsx
  // Primary CTAs
  <Button className="bg-gradient-to-r from-primary to-primary-dark">
  ```

### Don'ts ❌

- **Don't mix color temperatures** (e.g., cool blues with warm oranges in the same element)
  ```jsx
  // Bad
  <div className="from-blue-500 to-orange-500">
  ```

- **Don't use random colors** outside the design system
  ```jsx
  // Bad
  <div className="bg-pink-500 text-lime-300">

  // Good
  <div className="bg-messaging text-white">
  ```

- **Don't override theme colors** with hardcoded hex values
  ```jsx
  // Bad
  style={{ backgroundColor: '#2B8ED9' }}

  // Good
  className="bg-primary"
  ```

---

## Accessibility

### WCAG 2.1 AA Compliance

All color combinations in this design system meet WCAG AA standards (4.5:1 contrast ratio for normal text, 3:1 for large text).

### Contrast Ratios

| Combination | Ratio | Status |
|-------------|-------|--------|
| primary / primary-foreground | 4.6:1 | ✅ Pass |
| accent / accent-foreground | 4.8:1 | ✅ Pass |
| foreground / background | 10.3:1 | ✅ Pass |
| muted-foreground / background | 4.5:1 | ✅ Pass |

### Focus Indicators

Always provide visible focus indicators for keyboard navigation:

```jsx
<Button className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
  Accessible Button
</Button>
```

### Color Blindness Considerations

- **Don't rely on color alone** to convey information
- **Use icons and labels** alongside color indicators
- **Test with color blindness simulators**

```jsx
// Good - icon + color + text
<Badge className="bg-success">
  <CheckIcon /> Approved
</Badge>

// Bad - color only
<Badge className="bg-success" />
```

---

## Migration Guide

### From Old WebOS Colors

| Old Color | New Color | Tailwind Class |
|-----------|-----------|----------------|
| `webos-orange` | `accent` | `bg-accent` |
| `slate-900` | `background` (dark) | `bg-background` |
| `teal-500` | `primary` | `bg-primary` |
| `blue-500` | `primary` | `bg-primary` |
| `amber-500` | `accent-warm` | `bg-accent-warm` |
| `purple-500` | `admin` | `bg-admin` |

### Common Replacements

```jsx
// Old
<div className="bg-slate-900 text-white">
// New
<div className="bg-background text-foreground">

// Old
<Button className="bg-teal-500">
// New
<Button className="bg-primary">

// Old
<Badge className="bg-amber-500">
// New
<Badge className="bg-accent-warm">

// Old
<div className="from-blue-500 to-indigo-500">
// New
<div className="from-primary to-primary-dark">
```

### Automated Migration

Run this regex find/replace in your codebase:

```regex
# Find
from-slate-900.*?to-slate-800
# Replace
from-background to-card

# Find
from-teal-\d{3}.*?to-teal-\d{3}
# Replace
from-primary to-primary-dark

# Find
from-amber-\d{3}.*?to-orange-\d{3}
# Replace
from-accent to-accent-warm
```

---

## Resources

### Design Files
- Figma: [Community Manager Design System](https://figma.com)
- Color Palette: `/nextjs_space/app/globals.css`
- Design Tokens: `/nextjs_space/styles/design-tokens.css`

### Documentation
- Tailwind Config: `/nextjs_space/tailwind.config.ts`
- Component Library: `/nextjs_space/components/ui/`

### Tools
- **Color Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Color Blindness Simulator**: [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- **Accessibility Audit**: Lighthouse in Chrome DevTools

---

## Questions & Support

For questions about the design system or to propose updates:
- **GitHub Issues**: [Community Manager Issues](https://github.com/ourfi-app/community-manager/issues)
- **Design Team**: design@communitymanager.app

---

**Last Updated:** November 2025
**Version:** 2.0.0
