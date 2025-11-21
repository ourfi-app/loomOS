# Phase 3: App Pages & Integration - Design System Updates

**Date:** November 21, 2025  
**Branch:** phase-3-app-pages-integration  
**Status:** In Progress

## Overview

This document outlines the design system updates applied to all app pages and components during Phase 3 of the loomOS refactoring plan.

## Design System Principles

### Color Palette

**Primary Colors (Neutral Grays)**
```css
Background Gradient: linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)
Card Background: #f5f5f5
Secondary Background: #e8e8e8
Muted Background: #d8d8d8
```

**Text Colors**
```css
Primary Text: #4a4a4a
Secondary Text: #6a6a6a
Tertiary Text: #8a8a8a
Muted Text: #9a9a9a
```

**Chrome/Dark Elements**
```css
Dark Chrome: #1a1a1a (primary buttons, top bar)
Medium Chrome: #4a4a4a
Light Chrome: #5a5a5a
```

**Borders**
```css
Light Border: #e0e0e0
Medium Border: #d0d0d0
Dark Border: #c0c0c0
Glass Border: rgba(255, 255, 255, 0.3)
```

### Typography

**Font Family**
```css
font-family: 'Helvetica Neue', Arial, sans-serif
```

**Font Weights**
```css
font-weight: 200 (font-extralight) - Large headers
font-weight: 300 (font-light) - Default for most text
font-weight: 400 (font-normal) - Emphasis/buttons only
```

**Text Sizes**
```css
text-xs: 11px (labels)
text-sm: 12-13px (secondary text)
text-base: 13-14px (body text)
text-lg: 16px (small headers)
text-xl: 18px (medium headers)
text-2xl: 24px (large headers)
```

**Letter Spacing**
```css
tracking-wide: 0.025em (labels)
tracking-wider: 0.05em (uppercase labels)
```

### Glassmorphism

**Glass Panel Pattern**
```tsx
<GlassPanel variant="medium" blur="medium" rounded="3xl" padding="xl">
  {/* Content */}
</GlassPanel>

// Or manually:
style={{
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
}}
```

### Component Patterns

**Card Component**
```tsx
import { Card } from '@/components/core/cards/Card';

<Card variant="glass" padding="lg">
  <h3 className="text-xs font-light tracking-wider uppercase" style={{ color: '#8a8a8a' }}>
    SECTION TITLE
  </h3>
  <p className="text-sm font-light mt-2" style={{ color: '#4a4a4a' }}>
    Content
  </p>
</Card>
```

**Button Component**
```tsx
import { Button } from '@/components/core/buttons/Button';

// Primary button (dark)
<Button variant="primary" size="lg" fullWidth>
  SIGN IN
</Button>

// Secondary button (light gray)
<Button variant="secondary" size="md">
  CANCEL
</Button>

// Icon button
<Button variant="icon" size="sm">
  <IconComponent />
</Button>
```

**Input Field**
```tsx
<label className="block text-xs font-light tracking-wider uppercase" style={{ color: '#6a6a6a' }}>
  FIELD LABEL
</label>
<input
  type="text"
  className="w-full px-4 py-3 rounded-xl outline-none text-sm font-light transition-all duration-200"
  style={{ 
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid #d0d0d0',
    color: '#4a4a4a'
  }}
  placeholder="Enter value"
/>
```

**Page Background**
```tsx
// All pages should use this gradient background:
<div 
  className="min-h-screen"
  style={{ 
    background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)'
  }}
>
```

## Migration Checklist

### ✅ Pages Updated

- [x] `/auth/login` - Login page with glassmorphic panels
- [x] `/dashboard` - Main dashboard page
- [x] `/dashboard/webos-demo` - WebOS demo page

### 🔄 Pages In Progress

- [ ] `/auth/register` - Registration page
- [ ] `/auth/super-admin-login` - Super admin login
- [ ] `/dashboard/profile` - User profile page
- [ ] `/dashboard/my-community` - Community page
- [ ] `/dashboard/admin` - Admin pages
- [ ] All other dashboard pages (66 remaining)

## Common Replacements

### Before → After

**Background Colors**
```tsx
// Before
className="webos-gradient-bg"
style={{ background: 'var(--semantic-bg-base)' }}

// After
style={{ background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)' }}
```

**Brand Colors (Remove Orange)**
```tsx
// Before
className="text-loomos-orange bg-loomos-orange/10"
style={{ color: 'var(--loomos-orange)' }}

// After
className="font-light"
style={{ color: '#4a4a4a' }}
```

**Typography**
```tsx
// Before
className="font-bold text-xl"

// After
className="font-light text-xl tracking-tight"
style={{ color: '#4a4a4a' }}
```

**Cards**
```tsx
// Before
className="webos-card rounded-lg bg-white/80"

// After
import { Card } from '@/components/core/cards/Card';
<Card variant="glass" padding="lg">
```

**Buttons**
```tsx
// Before
className="bg-loomos-orange hover:bg-loomos-orange-dark text-white"

// After
import { Button } from '@/components/core/buttons/Button';
<Button variant="primary">
```

## Design System Compliance Checklist

For each page/component, verify:

- ✅ Background gradient applied
- ✅ Glassmorphism effects on panels/cards
- ✅ Neutral gray text colors (#4a4a4a, #6a6a6a, #8a8a8a)
- ✅ Font-light typography (weight: 300)
- ✅ Consistent spacing (multiples of 4px)
- ✅ Smooth transitions (200ms duration)
- ✅ Rounded corners (rounded-xl/2xl/3xl)
- ✅ No orange brand colors
- ✅ Core components used where applicable

## Key Files Modified

1. `app/auth/login/page.tsx` - Login page completely redesigned
2. `app/dashboard/page.tsx` - Dashboard background and welcome card updated
3. `app/dashboard/webos-demo/page.tsx` - Demo page background updated

## Next Steps

1. Continue updating remaining app pages with design system
2. Update app-specific components in dashboard subdirectories
3. Apply patterns to admin pages
4. Update messaging/communication pages
5. Final pass for consistency across all pages

## Notes

- All pages should import and use core components from `@/components/core/`
- Avoid inline brand colors - use neutral palette
- Maintain light font weights throughout
- Use glassmorphism for elevated surfaces
- Keep animations subtle (duration-200)
