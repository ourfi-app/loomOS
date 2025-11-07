# loomOS Rebranding & Enhanced Card System

## Overview

This document describes the comprehensive rebranding and enhanced card system implementation for loomOS - a liberation-focused operating system inspired by webOS principles.

## 🎨 Rebranding Complete

### Core Theme & Colors

loomOS now features a distinctive design language centered around liberation from walled gardens:

**Signature Colors:**
- **loomOS Orange (#F18825)**: Primary accent color representing liberation & warmth
- **Trust Blue (#2196F3)**: Reliability & openness
- **Growth Green (#4CAF50)**: Freedom & progress
- **Surface Gray (#EAEAEA)**: Soft & approachable card backgrounds

### Design System Location

The complete design system is available at:
- **Design Tokens**: `/lib/loomos-design-system.ts`
- **Liberation Features**: `/lib/loomos-liberation.ts`
- **Components**: `/components/loomos/`

### Key Design Principles

1. **Activity-centric over app-centric**: Focus on what users are doing, not which app they're using
2. **Live card previews**: Real-time content updates, not static screenshots
3. **Physics-based animations**: Natural, tangible feel using spring physics
4. **Liberation philosophy**: No vendor lock-in, open marketplace, data ownership

## 🃏 Enhanced Card System

### Features Implemented

#### 1. **Card Component** (`/components/loomos/Card.tsx`)

A fully-featured card system with:

- **Live Preview Windows**: Content updates in real-time even when minimized
- **Multiple States**:
  - Normal: Standard window mode
  - Minimized: Small preview with live content
  - Maximized: Full-screen mode
  - Active: Currently focused card
  - Hover: Interactive feedback

- **Gesture Support**:
  - Drag to reposition
  - Flick down to close (velocity-based)
  - Flick up to maximize
  - Edge snapping

- **Physics-Based Animations**:
  - Spring animations for natural motion
  - Smooth state transitions
  - Drag elasticity

#### 2. **Card Manager** (`/lib/loomos-card-manager.ts`)

State management for card orchestration:

- **Window Management**:
  - Smart positioning for new cards
  - Cascade layout
  - Tile layout
  - Minimize all

- **Z-index Management**: Automatic layer ordering
- **Active Card Tracking**: Focus management
- **State Persistence**: Save/restore card positions

#### 3. **Styling** (`/styles/loomos-card.css`)

Beautiful visual design:

- **Glassmorphism Effects**: Translucent surfaces with backdrop blur
- **Smooth Shadows**: Multi-layered shadows for depth
- **Responsive Design**: Adapts to screen sizes
- **Dark Mode Support**: Complete theme switching

## 🎯 Interactive Demo

### Standalone HTML Demo

A complete, self-contained demo is available at:
```
/public/loomos-desktop-demo.html
```

**To run the demo:**
1. Open in any modern browser
2. No build step required
3. Fully interactive

**Demo Features:**
- Complete loomOS desktop environment
- 8 demo applications showcasing the design system
- Working card system with drag & drop
- App launcher with "Just Type" search
- Dock with app indicators
- System bar with window management
- Welcome notification

**Included Apps:**
1. **Mail** - Three-pane webOS layout
2. **Calendar** - Monthly grid view with Synergy
3. **Notes** - Liberation manifesto editor
4. **Settings** - System preferences
5. **Photos** - Grid gallery
6. **Terminal** - Command line interface
7. **Media Player** - Music controls
8. **Network Manager** - WiFi & Bluetooth

## 🏗️ Architecture

### Component Hierarchy

```
loomOS Desktop
├── System Bar (window controls, clock)
├── Cards Container
│   ├── Card 1 (draggable, resizable)
│   ├── Card 2 (draggable, resizable)
│   └── Card N (draggable, resizable)
├── App Launcher (Just Type search)
└── Dock (app shortcuts)
```

### State Management

The card system uses Zustand for state management:

```typescript
// Card state
interface CardState {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  state: 'normal' | 'minimized' | 'maximized';
  zIndex: number;
}
```

## 🎬 Animation System

### Physics Configuration

All animations use spring physics for natural motion:

```typescript
spring: {
  stiffness: 300,  // How "tight" the spring is
  damping: 25,     // Resistance/bounce
  mass: 1          // Element weight
}
```

### Gesture Thresholds

```typescript
gesture: {
  velocityThreshold: 750,   // px/s for swipe actions
  distanceThreshold: 100,   // px for swipe recognition
  flickVelocity: 300        // px/s for quick flicks
}
```

## 🚀 Usage in React Components

### Basic Card Usage

```tsx
import { LoomOSCard } from '@/components/loomos/Card';

<LoomOSCard
  id="mail-1"
  title="loomOS Mail"
  appIcon={<MailIcon />}
  appColor="#2196F3"
  isActive={activeCardId === 'mail-1'}
  onMaximize={handleMaximize}
  onMinimize={handleMinimize}
  onClose={handleClose}
>
  <MailContent />
</LoomOSCard>
```

### Using the Card Manager Store

```tsx
import { useCardManager } from '@/lib/loomos-card-manager';

function MyComponent() {
  const { cards, createCard, closeCard, minimizeCard } = useCardManager();

  const openMail = () => {
    createCard({
      appId: 'mail',
      title: 'loomOS Mail',
      content: <MailApp />
    });
  };

  return (
    <button onClick={openMail}>Open Mail</button>
  );
}
```

## 🎨 Theming

### CSS Variables

The design system exports CSS variables for easy theming:

```css
:root {
  --loomos-accent: #F18825;
  --loomos-primary: #2196F3;
  --loomos-success: #4CAF50;
  --loomos-surface: #EAEAEA;
  --loomos-spring: cubic-bezier(0.42, 0, 0.58, 1);
}
```

### Using Theme in Components

```tsx
import { loomOSTheme } from '@/lib/loomos-design-system';

const styles = {
  backgroundColor: loomOSTheme.colors.accent,
  borderRadius: loomOSTheme.spacing.cardRadius,
  boxShadow: loomOSTheme.shadows.card,
};
```

## 📱 Responsive Design

The card system adapts to different screen sizes:

- **Mobile**: Single card view, full-screen by default
- **Tablet**: 1-2 cards side by side
- **Desktop**: Multiple cards with cascade/tile layouts
- **Ultrawide**: 3+ cards with optimal spacing

## ♿ Accessibility

- Keyboard navigation support
- ARIA labels for all interactive elements
- Focus management for active cards
- Screen reader announcements for state changes
- High contrast mode support

## 🔒 Liberation Features

### Open Marketplace

Install apps from any source:
- No app store gatekeepers
- No installation fees
- PWAs as first-class citizens
- Direct URL installation

### Synergy (Cloud Unification)

Connect multiple cloud services:
- Unified inbox for all email accounts
- Combined calendars from all services
- Merged contacts from all sources
- Files from any cloud storage

### Data Ownership

- Export data anytime
- Interoperable formats
- No vendor lock-in
- Local-first architecture

## 🎯 Next Steps

### Future Enhancements

1. **Advanced Window Management**:
   - Split view
   - Picture-in-picture
   - Spaces/virtual desktops

2. **Enhanced Gestures**:
   - Swipe between cards
   - Pinch to zoom
   - Two-finger scroll in minimized cards

3. **Smart Features**:
   - Intelligent card placement
   - Auto-arrange based on usage
   - Quick actions menu

4. **Performance**:
   - Virtual scrolling for many cards
   - Lazy loading for card content
   - Memory optimization

## 📚 Resources

### Documentation
- [Design System](/lib/loomos-design-system.ts)
- [Card Component](/components/loomos/Card.tsx)
- [Liberation Features](/lib/loomos-liberation.ts)

### Demo
- [Interactive Demo](/public/loomos-desktop-demo.html)

### Philosophy
- **webOS Inspiration**: Card-based multitasking, activity-centric design
- **Liberation Focus**: Freedom from walled gardens, data ownership
- **User Empowerment**: Install from anywhere, connect any service

---

**loomOS** - Liberation from Walled Gardens 🔷
