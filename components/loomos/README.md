# loomOS Component Library

React components built on the loomOS Design System v1.0.

All components use semantic tokens, making them automatically themeable.

## Installation

Import components from this directory:

```tsx
import { Button, Card, Badge } from '@/components/loomos';
```

## Components

### Button

A versatile button component with multiple variants.

```tsx
import { Button } from '@/components/loomos';

// Primary button (uses semantic-primary color)
<Button variant="primary">Click me</Button>

// Secondary button (uses semantic-accent color)
<Button variant="secondary">Secondary Action</Button>

// Ghost button (transparent background)
<Button variant="ghost">Ghost Button</Button>

// Outline button
<Button variant="outline">Outline Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icon
<Button icon={<Icon />}>With Icon</Button>

// Loading state
<Button loading>Loading...</Button>

// Disabled
<Button disabled>Disabled</Button>

// Full width
<Button fullWidth>Full Width</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean
- `icon`: ReactNode

### Card

A flexible card component with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/loomos';

<Card hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description text</CardDescription>
  </CardHeader>
  <CardContent>
    Your content goes here
  </CardContent>
  <CardFooter align="right">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

**Card Props:**
- `hoverable`: boolean - Adds hover lift effect
- `clickable`: boolean - Adds click effect and cursor pointer
- `padding`: 'none' | 'sm' | 'md' | 'lg'

**CardFooter Props:**
- `align`: 'left' | 'center' | 'right' | 'between'

### Badge

Small status indicators and labels.

```tsx
import { Badge } from '@/components/loomos';

<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>

// With dot indicator
<Badge variant="success" dot>Online</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean

## Theming

All components use semantic tokens, which means they automatically adapt to theme changes.

### Default Theme (loomOS Orange)

By default, components use:
- Primary: loomOS Orange (#F18825)
- Accent: Trust Blue (#2196F3)

### Custom Themes

Create a theme file to override semantic tokens:

```css
/* my-app-theme.css */
:root {
  --semantic-primary: var(--trust-blue);
  --semantic-accent: var(--loomos-orange);
}
```

Import after semantic.css:

```css
@import '../design-tokens/semantic.css';
@import './my-app-theme.css';
```

All components will automatically use the new colors!

## Design Tokens Used

These components rely on the following semantic tokens:

### Colors
- `--semantic-primary`, `--semantic-primary-dark`, `--semantic-primary-subtle`
- `--semantic-accent`, `--semantic-accent-dark`, `--semantic-accent-subtle`
- `--semantic-surface-base`, `--semantic-surface-elevated`
- `--semantic-text-primary`, `--semantic-text-secondary`
- `--semantic-border-light`, `--semantic-border-medium`
- `--semantic-success`, `--semantic-error`, `--semantic-warning`, `--semantic-info`

### Button-specific
- `--semantic-btn-primary-bg`, `--semantic-btn-primary-text`, `--semantic-btn-primary-hover`
- `--semantic-btn-secondary-bg`, `--semantic-btn-secondary-text`, `--semantic-btn-secondary-hover`
- `--semantic-btn-ghost-bg`, `--semantic-btn-ghost-text`, `--semantic-btn-ghost-hover`

### Card-specific
- `--semantic-card-bg`, `--semantic-card-border`
- `--semantic-card-shadow`, `--semantic-card-shadow-hover`

### Spacing & Layout
- `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`
- `--radius-md`, `--radius-xl`, `--radius-full`
- `--touch-target-min` (44px minimum touch target)

### Motion
- `--transition-all-fast`, `--transition-all-normal`
- `--duration-fast`, `--duration-normal`, `--duration-slower`
- `--ease-standard`, `--ease-spring`

## Accessibility

All components follow accessibility best practices:

- ✅ Minimum 44px touch targets on interactive elements
- ✅ Proper focus indicators
- ✅ Keyboard navigation support
- ✅ ARIA attributes where needed
- ✅ Semantic HTML elements
- ✅ High contrast color combinations

## TypeScript Support

All components are fully typed with TypeScript.

```tsx
import { ButtonProps, CardProps, BadgeProps } from '@/components/loomos';
```

## Examples

### Login Form

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/loomos';

<Card style={{ maxWidth: '400px' }}>
  <CardHeader>
    <CardTitle>Welcome Back</CardTitle>
  </CardHeader>
  <CardContent>
    <input type="email" placeholder="Email" />
    <input type="password" placeholder="Password" />
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Forgot Password?</Button>
    <Button variant="primary" fullWidth>Sign In</Button>
  </CardFooter>
</Card>
```

### Status Dashboard

```tsx
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/loomos';

<Card hoverable>
  <CardHeader>
    <CardTitle>System Status</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge variant="success" dot>API Online</Badge>
    <Badge variant="success" dot>Database Connected</Badge>
    <Badge variant="warning" dot>Cache Warming</Badge>
  </CardContent>
</Card>
```

## Migration from Existing Components

See `/docs/COMPONENT_MIGRATION_GUIDE.md` for detailed migration instructions.

Quick migration checklist:
1. Replace hardcoded colors with semantic tokens
2. Use design token spacing instead of Tailwind classes
3. Replace custom button styles with `<Button>` component
4. Replace custom card wrappers with `<Card>` component
5. Update theme to override semantic tokens instead of components

## Contributing

When creating new components:

1. Use semantic tokens exclusively (no hardcoded values)
2. Support all standard HTML attributes via `...props`
3. Use `forwardRef` for ref forwarding
4. Add TypeScript types
5. Document with JSDoc comments
6. Include usage examples
7. Test with different themes

## Resources

- Design System Documentation: `/loomOS_DESIGN_SYSTEM.md`
- Design Tokens: `/design-tokens/`
- Example Themes: `/example-themes/`
