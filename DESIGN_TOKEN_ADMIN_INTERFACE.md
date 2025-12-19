# Design Token Admin Interface

## Overview

A comprehensive admin interface for visual customization of design tokens in the loomOS repository. This interface allows administrators to customize colors, spacing, typography, elevation, glassmorphism effects, motion, and border radius values through an intuitive visual editor.

## Features

### 1. Admin Page Route
- **Location**: `/admin/design-tokens`
- **Access Control**: Protected by `AdminRouteGuard` component
- **Requires**: Admin role and admin mode enabled

### 2. Visual Editor Components

#### Color Tokens Editor
- Brand colors (primary, secondary, accent)
- Status colors (success, warning, error)
- Text colors (primary, secondary)
- Background colors (base, surface)
- Interactive color picker with hex input
- Real-time color preview

#### Spacing Tokens Editor
- 6 spacing scales (xs, sm, md, lg, xl, 2xl)
- Slider controls for precise adjustment
- Visual preview bars showing actual spacing
- Range from 2px to 64px

#### Typography Tokens Editor
- Base font size control
- Font weight controls (normal, medium, bold)
- Line height controls (normal, relaxed)
- Live text preview for each setting

#### Elevation Tokens Editor
- 4 shadow levels (sm, md, lg, xl)
- Custom shadow CSS input
- Preset reset functionality
- Live shadow preview cards

#### Glassmorphism Tokens Editor
- 4 blur levels (sm, md, lg, xl)
- Backdrop saturation control
- Glass opacity control
- Live glassmorphism preview with gradient background

#### Motion Tokens Editor
- 3 duration settings (fast, normal, slow)
- Easing function presets (standard, spring, ease-in, etc.)
- Custom easing input
- Animated preview with trigger button

#### Border Radius Tokens Editor
- 4 radius sizes (sm, md, lg, xl)
- Full radius (pill shape) option
- Preview for buttons, cards, and inputs

### 3. Color Palette Integration
- 6 pre-made color palettes:
  - loomOS Orange (default)
  - Ocean Blue
  - Forest Green
  - Sunset
  - Corporate Blue
  - Monochrome
- One-click palette application
- Visual palette cards with color swatches

### 4. Real-Time Preview
- Toggle preview mode
- Live token application to document
- Preview cards, buttons, and glassmorphism effects
- Instant visual feedback

### 5. Save & Export Functionality
- **Save**: Persist tokens to localStorage via zustand
- **Export**: Download custom tokens as CSS file
- Toast notifications for user feedback

### 6. Reset Functionality
- One-click reset to default values
- Confirmation dialog to prevent accidents
- Restores all token categories

### 7. User Interface Design
- Glassmorphism design system throughout
- Organized tabs for different token categories
- Sticky header with action buttons
- Responsive layout (mobile-friendly)
- Clean, intuitive controls

## Technical Implementation

### Dependencies
- **zustand**: State management with persistence
- **react-hot-toast**: Toast notifications
- **lucide-react**: Icons
- All required dependencies already in package.json

### File Structure
```
app/
  admin/
    design-tokens/
      page.tsx                    # Main admin page

components/
  design-token-editor/
    color-tokens-editor.tsx       # Color customization
    color-picker.tsx              # Color picker component
    spacing-tokens-editor.tsx     # Spacing controls
    typography-tokens-editor.tsx  # Typography controls
    elevation-tokens-editor.tsx   # Shadow controls
    glassmorphism-tokens-editor.tsx # Glass effects
    motion-tokens-editor.tsx      # Animation controls
    radius-tokens-editor.tsx      # Border radius controls
    slider.tsx                    # Reusable slider component

lib/
  design-token-store.ts           # Zustand store for tokens
  admin-mode-store.ts             # Admin mode state
  color-palettes.ts               # Color palette definitions

app/api/admin/palette/
  route.ts                        # API for palette persistence
```

### State Management
- **useDesignTokenStore**: Manages all design tokens
- **Zustand persist middleware**: Auto-saves to localStorage
- **Real-time application**: Tokens applied via CSS custom properties

### Token Categories
1. **Colors**: 10 color tokens
2. **Spacing**: 6 spacing scales
3. **Typography**: 6 typography properties
4. **Elevation**: 4 shadow levels
5. **Glassmorphism**: 5 glass effect properties
6. **Motion**: 5 animation properties
7. **Radius**: 5 border radius values

**Total**: 41 customizable design tokens

## How to Use

### Accessing the Interface
1. Log in as an admin user
2. Enable admin mode (if not already enabled)
3. Navigate to `/admin/design-tokens`

### Customizing Tokens
1. Select a token category tab
2. Adjust values using color pickers, sliders, or inputs
3. Preview changes in real-time
4. Click "Save Changes" to persist

### Applying Color Palettes
1. Navigate to the "Color Palettes" tab
2. Click on a palette card to apply
3. Colors automatically update across the interface

### Exporting Custom Theme
1. Customize tokens as desired
2. Click "Export CSS" button
3. CSS file downloads with all custom tokens
4. Can be used in external projects or for backup

### Resetting to Defaults
1. Click "Reset" button in header
2. Confirm the action
3. All tokens revert to default values

## Benefits

### For Administrators
- Visual, no-code customization
- Instant feedback and preview
- Easy to experiment and iterate
- Export for backup or sharing

### For Developers
- CSS custom properties for easy integration
- Consistent token usage across codebase
- Centralized token management
- Type-safe token definitions

### For Users
- Consistent visual experience
- Better accessibility with customizable contrast
- Personalized interface appearance

## Future Enhancements

Potential additions:
- Dark mode token overrides
- Import custom CSS tokens
- Token presets/themes
- Sharing tokens between instances
- A/B testing different token sets
- Per-user token preferences
- Animation of token changes
- Undo/redo functionality
- Token usage analytics

## Git Information

- **Branch**: `feature/design-token-admin-interface`
- **Commit**: Added comprehensive design token admin interface
- **Status**: Ready for review and testing
- **Pull Request**: Available on GitHub

## Testing Checklist

- [ ] Admin access control works
- [ ] All token editors render correctly
- [ ] Real-time preview updates work
- [ ] Save functionality persists tokens
- [ ] Export downloads correct CSS
- [ ] Reset restores defaults
- [ ] Palette selector applies colors
- [ ] Responsive on mobile devices
- [ ] Toast notifications appear
- [ ] All animations work smoothly

## Notes

- The interface uses the existing admin mode system
- All design follows loomOS glassmorphism guidelines
- Tokens persist in browser localStorage
- Compatible with existing design token structure
- No breaking changes to existing code

---

Built with ❤️ for loomOS
