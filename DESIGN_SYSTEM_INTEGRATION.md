# loomOS Design System Integration

**Date:** November 7, 2025
**Status:** ✅ Complete

This document summarizes the integration of the loomOS Design System v1.0 into the project.

---

## 🎯 What Was Updated

### 1. Tailwind Configuration (`tailwind.config.ts`)

**Updated with design tokens:**
- ✅ Spacing scale from design tokens (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
- ✅ Typography (font families, sizes with line heights)
- ✅ Border radius from design tokens
- ✅ Shadows from design tokens (including card shadows)
- ✅ Colors - Added all semantic tokens for Tailwind usage:
  - loomOS brand colors (loomos-orange, trust-blue, growth-green)
  - Semantic colors (semantic-primary, semantic-accent, etc.)
  - Surface colors (semantic-surface, semantic-bg, etc.)
  - Text colors (semantic-text, semantic-text-secondary, etc.)
  - Border colors (semantic-border, semantic-border-medium, etc.)
  - Status colors (semantic-success, semantic-error, etc.)
- ✅ Transitions - Added easing functions and durations from motion.css
- ✅ Kept legacy color mappings for backwards compatibility

**You can now use in Tailwind:**
```html
<!-- Design token spacing -->
<div class="p-lg mt-xl">

<!-- Semantic colors -->
<div class="bg-semantic-surface text-semantic-text">

<!-- Design token border radius -->
<div class="rounded-xl">

<!-- Design token shadows -->
<div class="shadow-card hover:shadow-card-hover">

<!-- Design token transitions -->
<div class="transition-normal ease-spring">
```

### 2. Global CSS (`app/globals.css`)

**Updated imports:**
```css
/* New design token imports (at top) */
@import '../design-tokens/semantic.css';  /* Imports core.css automatically */
@import '../design-tokens/motion.css';

/* Legacy imports (kept for backwards compatibility) */
@import '../styles/design-tokens.css';
@import '../styles/webos-tokens.css';
@import '../styles/webos-components.css';
```

**Benefits:**
- New semantic tokens available throughout the app
- Motion system (spring physics, animations) available
- Legacy tokens still work for existing components
- Gradual migration path

### 3. loomOS Component Library (`components/loomos/`)

**Created new components using design system:**

#### Button Component (`Button.tsx`)
- Variants: primary, secondary, ghost, outline
- Sizes: sm, md, lg
- Features: loading state, icons, full width
- Uses semantic tokens:
  - `--semantic-btn-primary-bg`, `--semantic-btn-primary-text`
  - `--semantic-btn-primary-hover`
  - Automatic theming support

#### Card Component (`Card.tsx`)
- Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Features: hoverable, clickable, configurable padding
- Uses semantic tokens:
  - `--semantic-card-bg`, `--semantic-card-border`
  - `--semantic-card-shadow`, `--semantic-card-shadow-hover`
  - Automatic lift effect on hover

#### Badge Component (`Badge.tsx`)
- Variants: primary, secondary, success, error, warning, info
- Sizes: sm, md, lg
- Features: dot indicator
- Uses semantic tokens:
  - `--semantic-primary-subtle`, `--semantic-success-bg`
  - Fully themeable

#### Component Library Index (`index.ts`)
- Exports all components with TypeScript types
- Easy import: `import { Button, Card, Badge } from '@/components/loomos'`

#### Documentation (`README.md`)
- Complete usage guide with examples
- Theming instructions
- Accessibility notes
- Migration guide
- TypeScript support

---

## 📊 Integration Summary

### Files Created
```
design-tokens/
├── core.css                      # Immutable loomOS brand tokens
├── semantic.css                  # Customizable semantic mappings
├── motion.css                    # Animation system
└── README.md                     # Usage guide

example-themes/
└── community-manager-theme.css   # Example theme override

components/loomos/
├── Button.tsx                    # Button component
├── Card.tsx                      # Card component  
├── Badge.tsx                     # Badge component
├── index.ts                      # Component exports
└── README.md                     # Component documentation

DESIGN_SYSTEM_INDEX.md             # Design system delivery index
loomOS_DESIGN_SYSTEM.md            # Master design documentation
DESIGN_SYSTEM_INTEGRATION.md       # This file
```

### Files Modified
```
tailwind.config.ts                # Added design token integration
app/globals.css                   # Updated imports
```

### Files Backed Up
```
tailwind.config.ts.backup         # Original config
app/globals.css.backup            # Original globals.css
```

---

## 🚀 How to Use

### 1. Using Components

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/loomos';

function MyComponent() {
  return (
    <Card hoverable>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Content here</p>
        <Badge variant="success">Active</Badge>
      </CardContent>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
```

### 2. Using Tailwind with Design Tokens

```html
<!-- Use semantic color classes -->
<div class="bg-semantic-surface text-semantic-text">

<!-- Use design token spacing -->
<div class="p-lg m-xl">

<!-- Use design token radius and shadows -->
<div class="rounded-xl shadow-card">

<!-- Use design token colors directly -->
<div class="bg-loomos-orange text-white">

<!-- Combine with transitions -->
<button class="transition-normal ease-spring hover:scale-102">
```

### 3. Using CSS Custom Properties Directly

```tsx
<div style={{
  backgroundColor: 'var(--semantic-surface-elevated)',
  color: 'var(--semantic-text-primary)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-card)',
  transition: 'var(--transition-all-normal)'
}}>
  Direct token usage
</div>
```

### 4. Creating Custom Themes

```css
/* my-theme.css */
:root {
  /* Override semantic tokens */
  --semantic-primary: var(--trust-blue);
  --semantic-accent: var(--loomos-orange);
  
  /* All components automatically adapt! */
}
```

Import after semantic.css:
```css
@import '../design-tokens/semantic.css';
@import './my-theme.css';
```

---

## 🎨 Theming Examples

### Example 1: Community Manager (Trust Blue)

```css
/* community-manager-theme.css */
:root {
  --semantic-primary: var(--trust-blue);           /* Primary = Blue */
  --semantic-accent: var(--loomos-orange);         /* Accent = Orange */
  
  --semantic-btn-primary-bg: var(--trust-blue);
  --semantic-btn-primary-hover: var(--trust-blue-dark);
  
  --semantic-btn-secondary-bg: var(--loomos-orange);
  --semantic-btn-secondary-hover: var(--loomos-orange-dark);
}
```

### Example 2: Finance App (Growth Green)

```css
/* finance-theme.css */
:root {
  --semantic-primary: var(--growth-green);         /* Primary = Green */
  --semantic-accent: var(--loomos-orange);         /* Accent = Orange */
  
  --semantic-btn-primary-bg: var(--growth-green);
  --semantic-btn-primary-hover: var(--growth-green-dark);
}
```

---

## 🔄 Migration Path

### Phase 1: ✅ Infrastructure (COMPLETE)
- ✅ Design token files created
- ✅ Tailwind config updated
- ✅ Global CSS updated
- ✅ Base components created

### Phase 2: Component Migration (Next Steps)
1. Identify existing components
2. Replace hardcoded colors with semantic tokens
3. Replace custom spacing with design token spacing
4. Update button components to use `<Button>`
5. Update card wrappers to use `<Card>`
6. Test with different themes

### Phase 3: Feature Development
1. Create additional components (Input, Select, Modal, etc.)
2. Build feature-specific components using base components
3. Document component patterns
4. Create Storybook stories

---

## 📝 Migration Checklist for Existing Components

For each component:

- [ ] Replace `bg-white` → `bg-semantic-surface`
- [ ] Replace `text-gray-900` → `text-semantic-text`
- [ ] Replace `text-gray-600` → `text-semantic-text-secondary`
- [ ] Replace `border-gray-200` → `border-semantic-border`
- [ ] Replace `p-6` → `p-lg` or `style={{ padding: 'var(--space-lg)' }}`
- [ ] Replace `rounded-lg` → `rounded-xl`
- [ ] Replace `shadow-md` → `shadow-card`
- [ ] Replace hardcoded `#F18825` → `semantic-primary` or `loomos-orange`
- [ ] Replace hardcoded `#2196F3` → `trust-blue`
- [ ] Replace custom button styles → `<Button>` component
- [ ] Replace custom card wrappers → `<Card>` component
- [ ] Add transition classes or motion tokens

---

## 🎯 Key Benefits

### 1. Single Source of Truth
- All design decisions in one place (`design-tokens/`)
- No more conflicting color values
- Easy to update globally

### 2. Automatic Theming
- Change tokens = instant re-theme
- Components adapt automatically
- No component modifications needed

### 3. Developer Experience
- Tailwind classes for rapid development
- TypeScript support for components
- Clear, semantic naming
- Comprehensive documentation

### 4. Consistency
- Orange #F18825 is always loomOS orange
- Spacing always uses 4px grid
- Spring physics always 300/25/1
- Touch targets always minimum 44px

### 5. Flexibility
- Apps can customize via semantic tokens
- Core tokens stay protected
- Gradual migration path
- Backwards compatibility maintained

---

## 🔍 Quick Reference

### Most Common Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--semantic-primary` | #F18825 (Orange) | Primary brand color |
| `--semantic-accent` | #2196F3 (Blue) | Accent/secondary color |
| `--semantic-surface-base` | #FFFFFF | Card backgrounds |
| `--semantic-text-primary` | #1E1E1E | Main text |
| `--space-lg` | 16px | Standard padding |
| `--radius-xl` | 16px | Card border radius |
| `--shadow-card` | Shadow | Card shadow |
| `--transition-all-normal` | 200ms | Standard transition |

### Tailwind Classes

| Class | CSS Token | Value |
|-------|-----------|-------|
| `p-lg` | `--space-lg` | 16px padding |
| `bg-semantic-surface` | `--semantic-surface-base` | Surface background |
| `text-semantic-text` | `--semantic-text-primary` | Primary text color |
| `rounded-xl` | `--radius-xl` | 16px border radius |
| `shadow-card` | `--shadow-card` | Card shadow |
| `transition-normal` | `--duration-normal` | 200ms transition |
| `ease-spring` | `--ease-spring` | Spring easing |

---

## 📚 Documentation

- **Master Design System**: `/loomOS_DESIGN_SYSTEM.md`
- **Design Tokens Guide**: `/design-tokens/README.md`
- **Component Library**: `/components/loomos/README.md`
- **Example Theme**: `/example-themes/community-manager-theme.css`
- **Delivery Index**: `/DESIGN_SYSTEM_INDEX.md`

---

## ✅ Testing

To verify everything is working:

1. **Check Tailwind build:**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Test component usage:**
   ```tsx
   import { Button } from '@/components/loomos';
   
   <Button variant="primary">Test</Button>
   ```

3. **Verify tokens in DevTools:**
   - Open browser DevTools
   - Check Computed styles
   - Look for `--semantic-*` variables
   - Values should match design tokens

4. **Test theming:**
   - Import a theme file after semantic.css
   - Components should use new colors
   - Verify in browser

---

## 🎉 Summary

The loomOS Design System v1.0 is now fully integrated!

**What You Can Do Now:**
- ✅ Use loomOS components (`<Button>`, `<Card>`, `<Badge>`)
- ✅ Use design tokens in Tailwind classes
- ✅ Use design tokens in inline styles
- ✅ Create custom themes by overriding semantic tokens
- ✅ Build new components using the design system
- ✅ Gradually migrate existing components

**Next Steps:**
1. Start using components in your features
2. Gradually migrate existing components
3. Create app-specific themes as needed
4. Build additional components on top of base components
5. Share component patterns across teams

---

**loomOS Design System v1.0** - Liberation from Walled Gardens 🍊

For questions or issues, see the full documentation in `/design-tokens/README.md`
