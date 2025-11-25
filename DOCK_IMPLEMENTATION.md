# Floating Dock Implementation

## Overview
The loomOS floating dock is a webOS-inspired quick launch bar that provides easy access to essential applications. It features a modern glassmorphism design with smooth animations and intelligent auto-hide behavior.

## Features

### 1. **Floating Appearance**
- The dock floats at the bottom of the screen with a glassmorphism effect
- Uses CSS variables for consistent styling:
  - `--glass-bg`: Semi-transparent background
  - `--glass-blur`: Backdrop blur effect
  - `--glass-border`: Subtle border
  - `--shadow-dock`: Multi-layered shadow for depth

### 2. **Default App Configuration**
The dock displays 6 items in the following order:
1. **Home** - Navigate to the main dashboard
2. **Browser** - Browse apps and content
3. **Mail** - Access email functionality
4. **Calendar** - Manage schedule and events
5. **Settings** - Configure system preferences
6. **App Launcher** (fixed) - Open the app grid to access all apps

### 3. **Customization**
- First 5 positions are customizable (can be replaced with other apps)
- 6th position (App Launcher) is fixed and cannot be changed
- Users can:
  - Right-click on any dock item to see options
  - Replace apps in positions 1-5
  - Unpin apps from the dock
  - Close running apps directly from the dock

### 4. **Visual States**
Each dock item displays different visual indicators:
- **Active**: White pulsing dot below the icon
- **Running**: Small white dot (60% opacity)
- **Minimized**: Yellow/warning colored dot with minimize icon badge
- **Hover**: Icon scales up (1.2x) and moves up 8px with spring animation

### 5. **Auto-Hide Behavior**

#### Desktop (≥768px width):
- **On Home/Dashboard**: Always visible
- **In Apps**: Auto-hides after 1 second of inactivity
- **Show Trigger**: Mouse within 100px of bottom edge
- **Hover Protection**: Won't hide while hovering over dock

#### Mobile (<768px width):
- **On Home/Dashboard**: Always visible
- **In Apps**: Hidden by default
- **Show Trigger**: Swipe up from bottom gesture area (>50px movement, <500ms duration)
- **Hide Trigger**: Swipe down gesture

### 6. **Glassmorphism Design**
The dock uses modern glassmorphism effects:
```css
background: var(--glass-bg)           /* rgba(255, 255, 255, 0.8) */
backdrop-filter: var(--glass-blur)    /* blur(10px) */
border: 1px solid var(--glass-border) /* rgba(255, 255, 255, 0.3) */
box-shadow: var(--shadow-dock)        /* Multi-layered shadow */
```

### 7. **Animations**
Powered by Framer Motion for smooth, spring-based animations:
- **Dock Entry**: Slides up from bottom with fade-in
- **Item Hover**: Scale + translate with spring physics
- **Drag Over**: Dock scales up to 1.05x when dragging looms
- **App Launcher**: Rotates 180° when app grid is open

### 8. **Loom Integration**
- Supports drag-and-drop to create "looms" (pinned activity contexts)
- Pinned looms appear in the dock between regular apps and the app launcher
- Right-click looms for AI-powered actions:
  - Analyze loom context
  - Create task lists
  - Draft summary emails

### 9. **Keyboard Shortcuts**
- `Cmd/Ctrl + Space`: Toggle app grid launcher
- `Esc`: Close app grid

### 10. **Accessibility**
- All dock items have proper ARIA labels
- Keyboard navigation support
- Focus indicators with ring styling
- Minimum touch target size (44px+)

## Technical Implementation

### Component Structure
```
components/webos/app-dock.tsx
├── DockItem (memoized component)
│   ├── Icon with gradient background
│   ├── Status indicators (running/active/minimized)
│   └── Context menu with actions
├── Loom Icons (pinned activities)
├── Separator
└── App Grid Launcher (fixed position)
```

### State Management
- **App Preferences Store** (`lib/app-preferences-store.ts`):
  - Manages dock app IDs
  - Tracks app usage
  - Handles customization
  
- **Card Manager Store**:
  - Tracks running apps
  - Manages minimized state
  - Handles app launching/closing

### Configuration Files
1. **lib/app-preferences-store.ts**
   - Default dock configuration: `['home', 'browser', 'mail', 'calendar', 'settings']`
   - Maximum 5 customizable positions

2. **lib/enhanced-app-registry.ts**
   - App definitions with icons, paths, and metadata
   - All dock apps have `canPinToDock: true`

3. **design-tokens/core.css**
   - Glassmorphism CSS variables
   - Shadow definitions
   - Spacing and sizing tokens

## Styling Guidelines

### Dock Container
- Position: `fixed bottom-0 left-0 right-0`
- Z-index: `9999` (highest layer)
- Padding: Responsive (4px mobile, 6px tablet, 8px desktop)
- Pointer events: None on container, auto on dock itself

### Dock Items
- Size: 56px (mobile) / 64px (desktop)
- Border radius: `1rem` (16px)
- Gap: 8px (mobile) / 12px (desktop)
- Gradient backgrounds from app definitions

### Hover Effects
```typescript
whileHover={{ scale: 1.2, y: -8 }}
whileTap={{ scale: 1.05 }}
transition={{ type: 'spring', stiffness: 500, damping: 30 }}
```

## Browser Compatibility
- Modern browsers with backdrop-filter support
- Fallback: Semi-transparent background without blur
- WebKit prefix included for Safari

## Performance Optimizations
1. **Memoized Components**: DockItem uses React.memo
2. **useCallback Hooks**: Event handlers are memoized
3. **Debounced Auto-Hide**: 1 second delay before hiding
4. **Conditional Rendering**: Only renders visible elements
5. **CSS Variables**: Efficient style updates

## Future Enhancements
- [ ] Drag-and-drop reordering of dock items
- [ ] Custom icon upload for apps
- [ ] Dock position customization (left/right/bottom)
- [ ] Multiple dock profiles
- [ ] Dock size adjustment
- [ ] Badge notifications on dock icons

## Testing Checklist
- [x] Dock appears at bottom of screen
- [x] All 5 default apps + launcher are visible
- [x] Glassmorphism effects render correctly
- [x] Hover animations work smoothly
- [x] Auto-hide works on desktop
- [x] Swipe gestures work on mobile
- [x] Context menus function properly
- [x] Running/minimized indicators display correctly
- [x] App launching works from dock
- [x] Keyboard shortcuts function
- [x] Responsive design adapts to screen sizes

## Related Files
- `components/webos/app-dock.tsx` - Main dock component
- `components/webos/app-grid-launcher.tsx` - App grid overlay
- `components/webos/enhanced-dock-item.tsx` - Enhanced dock item variant
- `components/webos/loom-icon.tsx` - Loom icon component
- `lib/app-preferences-store.ts` - Dock configuration store
- `lib/enhanced-app-registry.ts` - App definitions
- `design-tokens/core.css` - Design system tokens

## Support
For issues or questions about the dock implementation, please refer to:
- Design system documentation in `/design-tokens/`
- Component documentation in `/components/webos/README.md`
- App registry documentation in `/lib/enhanced-app-registry.ts`
