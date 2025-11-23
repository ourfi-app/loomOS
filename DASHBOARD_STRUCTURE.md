# loomOS Dashboard Structure Reference

## 📍 Quick File Locations

### Core Dashboard Files
| Component | File Path | Description |
|-----------|-----------|-------------|
| Main Dashboard | `app/dashboard/page.tsx` | Card carousel, mail app, main UI |
| Dashboard Layout | `app/dashboard/layout.tsx` | Top bar, app launcher, search, layout wrapper |
| Sidebar | `components/dashboard/sidebar.tsx` | Navigation sidebar (if used) |
| Global Styles | `app/globals.css` | Global CSS, design token imports |
| Tailwind Config | `tailwind.config.ts` | Tailwind customization, design tokens |

### Design System Files
| File | Purpose |
|------|---------|
| `design-tokens/core.css` | Base colors, spacing, typography |
| `design-tokens/semantic.css` | Semantic color aliases, component tokens |
| `design-tokens/motion.css` | Animation timings, easing functions |
| `app/styles/loomos/animations.css` | Custom keyframe animations |

### Component Libraries
| Directory | Contents |
|-----------|----------|
| `components/ui/` | shadcn/ui components (buttons, cards, dialogs, etc.) |
| `components/webos/` | WebOS-style components (desktop, dock, windows) |
| `components/dashboard/` | Dashboard-specific components |
| `components/common/` | Shared utility components |

## 🎯 Dashboard Component Breakdown

### 1. Main Dashboard (`app/dashboard/page.tsx`)

#### Structure
```
DashboardPage
├── Card Carousel
│   ├── Navigation Buttons (left/right)
│   ├── Work Orders Stack Card
│   ├── Browser Card
│   ├── Mail Card
│   └── Calendar Card
├── Mail App (when active)
│   ├── Header
│   ├── Folders Sidebar
│   ├── Message List
│   └── Detail Pane
└── Dock
    ├── Home Icon
    ├── Mail Icon
    ├── Chat Icon
    └── Calendar Icon
```

#### Key Features
- **Card Carousel**: Horizontal scrolling cards with navigation
- **Stack Cards**: Expandable card stacks (e.g., Work Orders with Active/Pending)
- **Single Cards**: Individual app cards (Browser, Mail, Calendar)
- **Full App View**: Mail app expands to full screen
- **Interactive Dock**: Bottom launcher with app shortcuts

#### Styling Opportunities
- Card colors and backgrounds
- Card sizes and spacing
- Border radius and shadows
- Animation timing and easing
- Typography (font-light is prevalent)
- Icon colors and sizes
- Dock appearance and position

### 2. Dashboard Layout (`app/dashboard/layout.tsx`)

#### Structure
```
DashboardLayout
├── SystemStatusBar (Top Bar)
│   ├── Left: loomOS logo + hamburger menu
│   ├── Center: System icons (Mail, Messages, Music, etc.)
│   ├── Right: Clock + User profile dropdown
│   └── Mobile Menu (dropdown)
├── Main Content Area
│   └── {children} (dashboard pages)
├── GlobalSearch (Floating)
│   ├── Search Input
│   ├── Results Dropdown
│   └── Mobile Overlay
└── AppLauncher (Full Screen)
    ├── Search Bar with History
    ├── Tab Navigation
    ├── App Grid (responsive columns)
    └── Pagination
```

#### Key Features
- **Status Bar**: Always visible top navigation
- **Live Clock**: Updates every second
- **App Launcher**: Full-screen app grid with search
- **Global Search**: Floating search with "JUST TYPE" placeholder
- **Responsive Design**: Mobile hamburger menu, adaptive layouts
- **Profile Dropdown**: User menu with sign out

#### Styling Opportunities
- Top bar background and height
- Chrome colors (dark UI elements)
- App launcher grid layout
- Search bar design
- Profile dropdown styling
- Icon colors and spacing
- Responsive breakpoints

## 🎨 Design System Variables

### Most Used Colors
```css
/* Backgrounds */
--semantic-bg-muted: Light background
--semantic-bg-subtle: Slightly darker background
--bg-surface: Card surface
--bg-elevated: Elevated elements

/* Text */
--semantic-text-primary: Main text
--semantic-text-secondary: Secondary text
--semantic-text-tertiary: Muted text

/* Chrome (Dark UI) */
--chrome-darker: Very dark chrome
--chrome-dark: Dark chrome
--chrome-medium: Medium chrome
--chrome-text: Text on chrome
--chrome-text-secondary: Secondary text on chrome

/* Glass Effects */
--glass-white-80: 80% white overlay
--glass-white-60: 60% white overlay
--glass-black-95: 95% black overlay
--glass-black-60: 60% black overlay
--glass-border-light: Light glass border

/* Accent Colors */
--accent-blue: Primary accent
--accent-blue-light: Light accent
--status-success: Green
--status-error: Red
--status-warning: Yellow
```

### Most Used Spacing
```css
--space-xs: 4px
--space-sm: 8px
--space-md: 12px
--space-base: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
```

### Most Used Shadows
```css
--shadow-card: Card shadow
--shadow-card-hover: Card hover shadow
--shadow-modal: Modal/dropdown shadow
--shadow-navbar: Navigation shadow
--shadow-dock: Dock shadow
```

### Most Used Radius
```css
--radius-sm: 4px
--radius-base: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 20px
--radius-3xl: 24px
```

## 📐 Current Layout Measurements

### Card Carousel
- Card width: `400px`
- Card height: `300px`
- Card spacing: `400px` (translateX)
- Navigation button size: `48px` (w-12 h-12)
- Border radius: `24px`

### Status Bar
- Height: `48px` (h-12)
- Padding: `0 24px` (px-6)
- Border: `1px solid var(--glass-border-light)`

### Dock
- Bottom offset: `16px` (bottom-4)
- Padding: `24px 24px` (px-6 py-3)
- Icon size: `48px` (w-12 h-12)
- Icon gap: `16px` (gap-4)
- Border radius: `16px` (rounded-2xl)

### App Launcher
- Grid columns: 6-7 (responsive)
- App icon size: `64px` (w-16 h-16)
- Grid gap: `24px` (gap-6)
- Search bar padding: `24px` (px-6)

## 🎯 Component Patterns

### Card Pattern
```tsx
<div 
  className="relative transition-all duration-500"
  style={{
    width: '400px',
    height: '300px',
    backgroundColor: color,
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  }}
>
```

### Button Pattern
```tsx
<button 
  className="hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
  style={{ minWidth: '44px', minHeight: '44px' }}
>
```

### Glass Pattern
```tsx
<div 
  style={{
    backgroundColor: 'var(--glass-white-60)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
  }}
>
```

### Text Pattern
```tsx
<div 
  className="text-base font-light"
  style={{ color: 'var(--semantic-text-primary)' }}
>
```

## 🔄 Animation Timings

### Transitions
- **Fast**: 100ms - Small state changes
- **Normal**: 150ms - Default transitions
- **Moderate**: 200ms - Button hovers
- **Slow**: 300ms - Larger movements
- **Slower**: 400ms - Complex animations
- **Slowest**: 500ms - Page transitions

### Card Animations
- **Card transition**: 500ms ease-out
- **Card zoom**: 350ms cubic-bezier(0.42, 0, 0.58, 1)
- **Card dismiss**: 400ms cubic-bezier(0.42, 0, 1, 1)
- **Fade in**: 200ms ease-out

## 📱 Responsive Breakpoints

| Breakpoint | Width | Common Use |
|------------|-------|------------|
| Base (Mobile) | < 640px | Single column, stacked layout |
| sm | 640px+ | Mobile landscape, 2 columns |
| md | 768px+ | Tablet portrait, 3 columns |
| lg | 1024px+ | Desktop, 4-6 columns, show more UI |
| xl | 1280px+ | Large desktop, 7+ columns |
| 2xl | 1536px+ | Extra large, maximum features |

## 🎨 Color Usage Map

### Dashboard Background
- Main background: `linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)`

### Card Backgrounds (Current)
1. Work Orders: `#f0f8e8` (light green)
2. Browser: `var(--semantic-surface-base)` (white/neutral)
3. Mail: `#f8f8f8` (light gray)
4. Calendar: `var(--semantic-surface-base)` (white/neutral)

### Dock Icon Backgrounds
1. Home: `#7a9eb5` (blue)
2. Mail: `#b58a7a` (brown)
3. Chat: `#8ab57a` (green)
4. Calendar: `#b5a07a` (tan)

### Status Bar
- Background: `var(--chrome-darker)` (very dark)
- Text: `var(--chrome-text)` (light)
- Border: `var(--glass-border-light)`

## 🔍 Quick Search Guide

### Finding Specific Elements

**Colors:**
```bash
grep -r "#7a9eb5" app/ components/
grep -r "var(--chrome-darker)" app/ components/
```

**Components:**
```bash
grep -r "StatusBar" app/ components/
grep -r "Card Carousel" app/
```

**Styles:**
```bash
grep -r "fontSize" app/dashboard/
grep -r "borderRadius" components/ui/
```

## 📋 Styling Checklist

When modifying the dashboard, consider:

- [ ] Color harmony across all cards
- [ ] Consistent border radius
- [ ] Shadow depth hierarchy
- [ ] Text contrast ratios (WCAG AA minimum)
- [ ] Animation smoothness
- [ ] Mobile responsiveness
- [ ] Dark mode compatibility (if implementing)
- [ ] Icon consistency
- [ ] Spacing rhythm (4px, 8px, 12px, 16px, 24px, etc.)
- [ ] Typography hierarchy
- [ ] Focus states for accessibility
- [ ] Hover states
- [ ] Active/pressed states

## 🎬 Animation Reference

### Card Animations
```css
/* Zoom In */
@keyframes card-zoom-in {
  from { transform: scale(0.25) translateY(50%); opacity: 0.8; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

/* Dismiss */
@keyframes card-dismiss {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-100vh) scale(0.9); opacity: 0; }
}
```

### Common Easings
- `ease-out`: Fast start, slow end
- `ease-in-out`: Slow start and end
- `cubic-bezier(0.42, 0, 0.58, 1)`: Smooth acceleration
- `cubic-bezier(0.34, 1.56, 0.64, 1)`: Bounce effect

## 🎨 Design Philosophy

The loomOS dashboard follows these principles:

1. **Light & Airy**: Font-light typography, generous whitespace
2. **Glass & Depth**: Frosted glass effects, layered shadows
3. **Smooth Motion**: Fluid animations, natural easing
4. **Neutral Palette**: Soft colors, high contrast text
5. **Card-Based**: Everything is a card or window
6. **Touch-Friendly**: 44px minimum touch targets
7. **Responsive**: Mobile-first, progressive enhancement

---

**Quick Reference**: Keep this document open while styling for easy lookups!
