# WebOS Shared Components Library

A collection of reusable WebOS UI components following the WebOS design system principles.

## Philosophy

These components are designed to:
- Maintain consistency across the loomOS application
- Follow WebOS design principles (minimalism, glassmorphism, light typography)
- Provide excellent accessibility
- Support dark mode out of the box
- Offer performance optimizations

## Components

### GlassCard

A glassmorphic card component with customizable blur, opacity, and elevation.

```tsx
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/webos/shared';

<GlassCard blur="lg" opacity={80} rounded="3xl">
  <GlassCardHeader>
    <GlassCardTitle>Card Title</GlassCardTitle>
  </GlassCardHeader>
  <GlassCardContent>
    Card content goes here
  </GlassCardContent>
</GlassCard>
```

**Props:**
- `blur`: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
- `opacity`: 0-100 (default: 80)
- `rounded`: 'lg' | 'xl' | '2xl' | '3xl' (default: '3xl')
- `hoverable`: boolean (default: false) - Adds hover effect
- `pressable`: boolean (default: false) - Adds press effect
- `elevation`: 'sm' | 'md' | 'lg' (default: 'md')

### WebOSButton

A button component with WebOS styling and multiple variants.

```tsx
import { WebOSButton } from '@/components/webos/shared';

<WebOSButton variant="dark" size="md">
  Click me
</WebOSButton>

<WebOSButton variant="glass" loading>
  Loading...
</WebOSButton>
```

**Props:**
- `variant`: 'dark' | 'light' | 'glass' | 'outline' | 'ghost' (default: 'dark')
- `size`: 'sm' | 'md' | 'lg' | 'icon' (default: 'md')
- `loading`: boolean (default: false)
- `icon`: ReactNode - Icon before text
- `iconRight`: ReactNode - Icon after text

### SectionHeader

A consistent section header with optional divider and action.

```tsx
import { SectionHeader } from '@/components/webos/shared';

<SectionHeader divider subtitle="Manage your preferences">
  Settings
</SectionHeader>

<SectionHeader 
  action={<Button>Edit</Button>}
>
  Account Information
</SectionHeader>
```

**Props:**
- `divider`: boolean (default: false) - Show bottom border
- `action`: ReactNode - Action button or element
- `subtitle`: string - Subtitle text

### LoadingSpinner

A loading spinner with customizable size and color.

```tsx
import { LoadingSpinner } from '@/components/webos/shared';

<LoadingSpinner size="md" color="blue" />

<LoadingSpinner 
  size="lg" 
  color="blue" 
  text="Loading your data..."
/>
```

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `color`: 'blue' | 'gray' | 'white' | 'black' (default: 'blue')
- `text`: string - Loading message

## Design Tokens

All components use WebOS design tokens defined in `/styles/webos-design-system.css`:

- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--bg-primary`, `--bg-surface`, `--bg-hover`
- `--border-light`, `--border-medium`, `--border-dark`
- `--glass-white-80`, `--glass-white-95`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

## Dark Mode

All components automatically support dark mode through CSS variables. No additional configuration needed.

## Performance

- Components use `React.forwardRef` for proper ref forwarding
- Animations use GPU-accelerated properties (transform, opacity)
- Glass effects use `backdrop-filter` for native blur
- All components are tree-shakeable

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Screen reader friendly
- Respects `prefers-reduced-motion`

## Migration Guide

### From inline Button to WebOSButton

**Before:**
```tsx
<Button 
  className="rounded-xl font-light"
  style={{ background: 'var(--chrome-darkest)', color: 'white' }}
>
  Submit
</Button>
```

**After:**
```tsx
<WebOSButton variant="dark">
  Submit
</WebOSButton>
```

### From custom card to GlassCard

**Before:**
```tsx
<div 
  className="rounded-3xl shadow-lg"
  style={{
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
  }}
>
  Content
</div>
```

**After:**
```tsx
<GlassCard blur="lg" opacity={80}>
  Content
</GlassCard>
```

## Future Enhancements

Planned additions to the shared library:
- WebOSModal - Glassmorphic modal dialogs
- WebOSInput - Styled form inputs
- WebOSBadge - Status badges and tags
- WebOSToast - Notification toasts
- WebOSAvatar - User avatars
- WebOSTooltip - Contextual tooltips

## Contributing

When adding new shared components:
1. Follow the existing component structure
2. Use TypeScript with proper types
3. Include comprehensive JSDoc comments
4. Support dark mode via CSS variables
5. Ensure accessibility compliance
6. Add examples to this README
