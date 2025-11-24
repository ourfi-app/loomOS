# Desktop App Launcher System

A complete app launcher system for loomOS with dock integration, fullscreen app management, and card carousel for minimized apps.

## 🎯 Features

- **App State Management** - Zustand-based state management for running apps
- **App Launcher** - Grid-based launcher with search and category filtering
- **Fullscreen App Windows** - Immersive fullscreen experience for apps
- **Minimized Carousel** - Card-based carousel for minimized apps with swipe gestures
- **Enhanced Dock** - Quick access dock with app launcher button
- **Keyboard Shortcuts** - Cmd/Ctrl + Space to toggle launcher, Escape to close

## 📁 File Structure

```
components/desktop/
├── Desktop.tsx              # Main orchestrator component
├── AppLauncher.tsx         # Grid-based app launcher modal
├── AppWindow.tsx           # Fullscreen app window frame
├── MinimizedCarousel.tsx   # Carousel for minimized apps
├── Dock.tsx                # Bottom dock with favorites
├── index.ts                # Export barrel
└── README.md               # This file

lib/store/
└── appStore.ts             # Zustand store for app state
```

## 🚀 Quick Start

### 1. Wrap your dashboard with Desktop component

```tsx
// app/dashboard/page.tsx
import { Desktop } from '@/components/desktop';

export default function DashboardPage() {
  return (
    <Desktop>
      {/* Your dashboard content here */}
      <div className="p-8">
        <h1>Welcome to loomOS</h1>
        {/* Widgets, cards, etc. */}
      </div>
    </Desktop>
  );
}
```

### 2. Use the app store in your components

```tsx
import { useAppStore } from '@/lib/store/appStore';

function MyComponent() {
  const { launchApp, isAppRunning } = useAppStore();
  const myApp = APP_REGISTRY.find(app => app.id === 'my-app');
  
  return (
    <button onClick={() => launchApp(myApp!)}>
      Launch App
    </button>
  );
}
```

## 🎨 Components

### Desktop

Main orchestrator component that manages the entire desktop experience.

**Props:**
- `children?: React.ReactNode` - Dashboard content or wallpaper
- `showDock?: boolean` - Show/hide the dock (default: true)
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<Desktop showDock={true}>
  <YourDashboardContent />
</Desktop>
```

### AppLauncher

Grid-based app launcher with search and filtering.

**Features:**
- Search by app name, description, or keywords
- Filter by category (Essentials, Personal, Community, etc.)
- Responsive grid layout
- Smooth animations
- Auto-focus search on open

**Usage:**
```tsx
// Controlled by useAppStore
const { toggleLauncher } = useAppStore();

<button onClick={toggleLauncher}>
  Open Launcher
</button>
```

### AppWindow

Fullscreen app window frame with controls.

**Features:**
- Fullscreen app container
- Minimize and close controls
- App-specific header with icon and title
- More options dropdown menu
- Smooth transitions

### MinimizedCarousel

Card carousel for minimized apps with swipe gestures.

**Features:**
- Card-based layout
- Swipe up to close
- Tap to restore
- Smooth animations
- Auto-layout with AnimatePresence

### Dock

Bottom dock with quick access to favorite apps.

**Features:**
- Glass morphism effect
- Running app indicators
- App launcher button
- Hover animations
- Customizable favorites (via app preferences)

## 🔌 Integration with Existing Code

### App Registry Integration

The system uses the existing `enhanced-app-registry.ts` for app definitions:

```tsx
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

// Launch any registered app
launchApp(APP_REGISTRY[0]);
```

### App Preferences Integration

Dock favorites use the existing `app-preferences-store.ts`:

```tsx
import { useAppPreferences } from '@/lib/app-preferences-store';

const { dockApps } = useAppPreferences();
// dockApps contains array of favorite app IDs
```

### Routing Integration

Apps automatically navigate to their registered paths:

```tsx
// When launching an app, it navigates to app.path
// Example: launchApp(calendarApp) → router.push('/dashboard/organizer')
```

## 🎹 Keyboard Shortcuts

- `Cmd/Ctrl + Space` - Toggle App Launcher
- `Escape` - Close App Launcher

## 📊 State Management

### App Store (Zustand)

```tsx
interface AppStore {
  // State
  runningApps: RunningApp[];
  launcherOpen: boolean;
  
  // Actions
  launchApp: (appDef: AppDefinition) => void;
  closeApp: (appId: string) => void;
  minimizeApp: (appId: string) => void;
  restoreApp: (appId: string) => void;
  openLauncher: () => void;
  closeLauncher: () => void;
  toggleLauncher: () => void;
  
  // Utilities
  getRunningApp: (appId: string) => RunningApp | undefined;
  isAppRunning: (appId: string) => boolean;
  getFullscreenApp: () => RunningApp | undefined;
  getMinimizedApps: () => RunningApp[];
}
```

### App States

- `closed` - App is not running
- `minimized` - App is running but minimized (shown in carousel)
- `fullscreen` - App is running in fullscreen mode

## 🎨 Styling & Theming

All components use the webOS design system tokens from `tailwind.config.ts`:

- Colors: `bg-*`, `text-*`, `border-*`, `accent-*`
- Shadows: `shadow-dock`, `shadow-card`, etc.
- Glass effects: `bg-glass-white-90`, `backdrop-blur-xl`
- Animations: Built-in Tailwind animations

## 🔄 Migration from Existing Components

If you're using the existing `app-dock.tsx` or `desktop-app-window.tsx`, you can gradually migrate:

1. **Side-by-side**: Both systems can coexist
2. **Selective adoption**: Use only the components you need
3. **Full migration**: Replace old components with new Desktop system

## 🐛 Troubleshooting

### Apps not launching?

- Check that the app is registered in `enhanced-app-registry.ts`
- Verify the app's `path` is correct
- Ensure routing is set up for the app's path

### Dock not showing?

- Make sure `showDock={true}` is set on Desktop component
- Check z-index conflicts with other components

### Minimized carousel overlapping with content?

- Adjust z-index in `MinimizedCarousel.tsx`
- Ensure proper bottom padding on your content

## 📝 Example Implementation

See the example implementation in the repository:

```tsx
// app/dashboard/page.tsx
'use client';

import { Desktop } from '@/components/desktop';
import { useAppStore } from '@/lib/store/appStore';

export default function DashboardPage() {
  const { runningApps } = useAppStore();
  
  return (
    <Desktop>
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-4xl font-bold mb-8">Welcome to loomOS</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Your dashboard widgets */}
        </div>
        
        {/* Running apps indicator */}
        {runningApps.length > 0 && (
          <div className="fixed top-4 right-4 text-sm text-text-secondary">
            {runningApps.length} app{runningApps.length > 1 ? 's' : ''} running
          </div>
        )}
      </div>
    </Desktop>
  );
}
```

## 🚀 Future Enhancements

- [ ] Window snapping and tiling support
- [ ] Multi-window support (side-by-side apps)
- [ ] App-specific gestures
- [ ] Persistence of app state across sessions
- [ ] App switcher (Cmd+Tab style)
- [ ] Desktop widgets integration
- [ ] Custom dock positions (left, right, bottom)

## 📄 License

Part of the loomOS project.
