# Unified App Launcher Architecture

## Directory Structure

```
components/app-launcher/
├── index.ts                          # Main export
├── types.ts                          # TypeScript interfaces and types
├── README.md                         # Documentation
│
├── AppLauncher.tsx                   # Main container component
│
├── components/                       # Sub-components
│   ├── AppLauncherHeader.tsx        # Header with search and close button
│   ├── AppLauncherTabs.tsx          # Tab navigation (All/Favorites/Recent)
│   ├── AppLauncherToolbar.tsx       # Sort/filter controls
│   ├── AppLauncherGrid.tsx          # Grid view container
│   ├── AppLauncherList.tsx          # List view container
│   ├── AppCard.tsx                   # Individual app card (grid mode)
│   ├── AppListItem.tsx               # Individual app list item (list mode)
│   ├── AppContextMenu.tsx            # Context menu for app actions
│   ├── AppEmptyState.tsx             # Empty state messages
│   ├── AppCategorySection.tsx        # Category header with divider
│   └── AppSearchBar.tsx              # Search input with clear button
│
├── hooks/                            # Custom hooks
│   ├── useAppLauncher.ts            # Main launcher state management
│   ├── useAppSearch.ts              # Search and filter logic
│   ├── useAppActions.ts             # App action handlers
│   ├── useKeyboardNavigation.ts     # Keyboard navigation logic
│   └── useAppLauncherPreferences.ts # User preferences integration
│
├── utils/                            # Utility functions
│   ├── appFilters.ts                # Filter and sort utilities
│   ├── appGrouping.ts               # Category grouping logic
│   ├── constants.ts                 # Constants and configuration
│   └── animations.ts                # Animation variants
│
└── __tests__/                        # Tests
    ├── AppLauncher.test.tsx
    ├── useAppSearch.test.ts
    └── appFilters.test.ts
```

---

## Component Hierarchy

```
AppLauncher (Main Container)
├── AppLauncherHeader
│   ├── AppSearchBar
│   └── CloseButton
│
├── AppLauncherTabs
│   ├── TabButton (All Apps)
│   ├── TabButton (Favorites)
│   └── TabButton (Recent)
│
├── AppLauncherToolbar
│   ├── ViewModeToggle (Grid/List)
│   ├── SortModeButtons
│   └── CategoryFilterChips
│
└── AppLauncherContent
    ├── AppEmptyState (if no apps)
    │
    ├── AppLauncherGrid (Grid View)
    │   └── AppCategorySection (for each category)
    │       └── AppCard (for each app)
    │           └── AppContextMenu
    │
    └── AppLauncherList (List View)
        └── AppListItem (for each app)
            └── AppContextMenu
```

---

## TypeScript Interfaces

### Core Types

```typescript
// App Definition (from enhanced-app-registry)
interface AppDefinition {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  iconKey?: string;
  colorKey?: string;
  gradient: string;
  category: AppCategory;
  keywords?: string[];
  isNew?: boolean;
  isBeta?: boolean;
  requiresAdmin?: boolean;
}

// App Categories
type AppCategory = 'essentials' | 'personal' | 'community' | 'productivity' | 'admin' | 'settings';

// Tab Types
type TabType = 'all' | 'favorites' | 'recent';

// View Modes
type ViewMode = 'grid' | 'list';

// Sort Modes
type SortMode = 'alphabetical' | 'recent' | 'frequent' | 'category';
```

### Component Props

```typescript
// Main Launcher Props
interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onAppLaunch?: (app: AppDefinition) => void;
  defaultTab?: TabType;
  defaultViewMode?: ViewMode;
  defaultSortMode?: SortMode;
  showAdminApps?: boolean;
  className?: string;
}

// Header Props
interface AppLauncherHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  totalApps: number;
}

// Tabs Props
interface AppLauncherTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
  recentCount: number;
}

// Toolbar Props
interface AppLauncherToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  selectedCategories: AppCategory[];
  onCategoryToggle: (category: AppCategory) => void;
}

// Grid Props
interface AppLauncherGridProps {
  apps: AppDefinition[];
  groupByCategory: boolean;
  onAppClick: (app: AppDefinition) => void;
  onAppAction: (app: AppDefinition, action: AppAction) => void;
  activeAppPath?: string;
  dockAppIds: string[];
  favoriteAppIds: string[];
}

// List Props
interface AppLauncherListProps {
  apps: AppDefinition[];
  onAppClick: (app: AppDefinition) => void;
  onAppAction: (app: AppDefinition, action: AppAction) => void;
  activeAppPath?: string;
  dockAppIds: string[];
  favoriteAppIds: string[];
}

// App Card Props
interface AppCardProps {
  app: AppDefinition;
  isActive: boolean;
  isInDock: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onContextAction: (action: AppAction) => void;
  index: number; // For stagger animations
  className?: string;
}

// App List Item Props
interface AppListItemProps {
  app: AppDefinition;
  isActive: boolean;
  isInDock: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onContextAction: (action: AppAction) => void;
  className?: string;
}

// Context Menu Props
interface AppContextMenuProps {
  app: AppDefinition;
  isInDock: boolean;
  isFavorite: boolean;
  onAction: (action: AppAction) => void;
  children: React.ReactNode;
}

// Empty State Props
interface AppEmptyStateProps {
  type: 'search' | 'favorites' | 'recent' | 'category';
  searchQuery?: string;
  onClearSearch?: () => void;
}

// Category Section Props
interface AppCategorySectionProps {
  category: AppCategory;
  apps: AppDefinition[];
  categoryLabel: string;
  onAppClick: (app: AppDefinition) => void;
  onAppAction: (app: AppDefinition, action: AppAction) => void;
  activeAppPath?: string;
  dockAppIds: string[];
  favoriteAppIds: string[];
}

// Search Bar Props
interface AppSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}
```

### Action Types

```typescript
// App Actions (for context menu and keyboard shortcuts)
type AppAction = 
  | 'open'
  | 'add-to-favorites'
  | 'remove-from-favorites'
  | 'add-to-dock'
  | 'remove-from-dock'
  | 'view-details';

interface AppActionEvent {
  app: AppDefinition;
  action: AppAction;
  timestamp: number;
}
```

### Hook Return Types

```typescript
// useAppLauncher hook
interface UseAppLauncherReturn {
  // State
  isOpen: boolean;
  activeTab: TabType;
  viewMode: ViewMode;
  sortMode: SortMode;
  searchQuery: string;
  selectedCategories: AppCategory[];
  
  // Computed
  filteredApps: AppDefinition[];
  groupedApps: Record<AppCategory, AppDefinition[]>;
  favoritesCount: number;
  recentCount: number;
  
  // Actions
  open: () => void;
  close: () => void;
  setActiveTab: (tab: TabType) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortMode: (mode: SortMode) => void;
  setSearchQuery: (query: string) => void;
  toggleCategory: (category: AppCategory) => void;
  clearFilters: () => void;
}

// useAppSearch hook
interface UseAppSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  searchResults: AppDefinition[];
  hasSearchQuery: boolean;
}

// useAppActions hook
interface UseAppActionsReturn {
  handleAppClick: (app: AppDefinition) => void;
  handleAddToFavorites: (app: AppDefinition) => void;
  handleRemoveFromFavorites: (app: AppDefinition) => void;
  handleAddToDock: (app: AppDefinition) => void;
  handleRemoveFromDock: (app: AppDefinition) => void;
  handleContextAction: (app: AppDefinition, action: AppAction) => void;
}

// useKeyboardNavigation hook
interface UseKeyboardNavigationReturn {
  focusedAppId: string | null;
  handleKeyDown: (event: KeyboardEvent) => void;
  focusApp: (appId: string) => void;
  clearFocus: () => void;
}
```

---

## State Management

### Local State (React useState/useReducer)
- Current tab
- View mode
- Search query
- Selected categories
- Focused app (for keyboard nav)

### Global State (Zustand stores)
- `useAppPreferences`: favorites, dock apps, recent apps, usage tracking
- `useCardManager`: app launching, active apps
- `useAdminMode`: admin mode toggle

### Computed State (useMemo)
- Filtered apps based on search and filters
- Grouped apps by category
- Sorted apps by sort mode
- Favorites count
- Recent apps count

---

## Data Flow

```
User Action → Event Handler → State Update → Re-render
                ↓
            Side Effects
                ↓
        (Track usage, toast, etc.)
```

### Example: Launching an App
```
1. User clicks app card
2. AppCard onClick → handleAppClick (from useAppActions)
3. handleAppClick:
   - Tracks app usage (trackAppUsage from useAppPreferences)
   - Launches app (launchApp from useCardManager or router.push)
   - Closes launcher (onClose prop)
4. Toast notification shown (optional)
```

### Example: Search Flow
```
1. User types in search bar
2. AppSearchBar onChange → setSearchQuery (from useAppSearch)
3. searchQuery state updated
4. useMemo recalculates filtered apps based on searchQuery
5. Grid/List re-renders with new filtered apps
```

---

## Keyboard Navigation

### Shortcuts:
- `Escape`: Close launcher
- `Cmd/Ctrl + K`: Open launcher (global)
- `Tab`: Navigate through UI elements
- `Arrow Keys`: Navigate between apps (grid/list)
- `Enter`: Launch focused app
- `Cmd/Ctrl + F`: Focus search (when launcher open)
- `Cmd/Ctrl + 1/2/3`: Switch tabs (All/Favorites/Recent)
- `Cmd/Ctrl + G/L`: Toggle Grid/List view

### Implementation:
- Use `useKeyboardNavigation` hook
- Track focused app with state
- Add keyboard event listeners on mount
- Visual focus indicators
- Prevent default browser shortcuts

---

## Accessibility Features

### ARIA Attributes:
- `role="dialog"` on launcher container
- `aria-modal="true"` on launcher
- `aria-label` on all interactive elements
- `aria-labelledby` for sections
- `aria-describedby` for descriptions
- `aria-pressed` for toggle buttons
- `aria-current` for active tab
- `aria-selected` for selected items

### Focus Management:
- Auto-focus search input when launcher opens
- Trap focus within launcher
- Return focus to trigger element on close
- Visible focus indicators
- Logical tab order

### Screen Reader Support:
- Descriptive labels for all actions
- Live regions for dynamic content updates
- Status announcements for actions
- Hidden text for icon-only buttons

### Color Contrast:
- WCAG 2.1 AA compliance
- High contrast mode support
- Color-blind friendly indicators

---

## Animations

### Entry/Exit:
```typescript
const launcherVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};
```

### App Cards:
```typescript
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.02, // Stagger effect
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  })
};

const cardHoverVariants = {
  hover: { scale: 1.05, y: -4 }
};
```

### Tab Transition:
```typescript
const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};
```

---

## Responsive Design

### Breakpoints:
```typescript
const breakpoints = {
  mobile: '0px',      // 0-639px
  tablet: '640px',    // 640-1023px
  desktop: '1024px',  // 1024-1279px
  desktopLarge: '1280px', // 1280-1535px
  desktopXL: '1536px'     // 1536px+
};
```

### Grid Columns:
```typescript
const gridColumns = {
  mobile: 3,        // 3 columns on phones
  tablet: 4,        // 4 columns on tablets
  desktop: 5,       // 5 columns on laptops
  desktopLarge: 6,  // 6 columns on desktops
  desktopXL: 8      // 8 columns on large displays
};
```

### Responsive Behaviors:
- **Mobile**: Hide toolbar, simplified tabs, 3 columns
- **Tablet**: Show toolbar, 4 columns, compact spacing
- **Desktop**: Full features, 5-6 columns, comfortable spacing
- **Large Desktop**: 8 columns, spacious layout

---

## Performance Optimizations

### Memoization:
```typescript
const filteredApps = useMemo(() => {
  // Expensive filtering logic
}, [apps, searchQuery, selectedCategories, sortMode]);

const groupedApps = useMemo(() => {
  // Expensive grouping logic
}, [filteredApps]);
```

### Virtualization (Future):
```typescript
// For very large app lists (100+)
import { VirtualGrid } from '@/components/ui/virtual-grid';

<VirtualGrid
  items={filteredApps}
  itemHeight={120}
  columns={gridColumns}
  renderItem={(app) => <AppCard app={app} />}
/>
```

### Code Splitting:
```typescript
// Lazy load heavy components
const AppContextMenu = lazy(() => import('./components/AppContextMenu'));
const AppLauncherList = lazy(() => import('./components/AppLauncherList'));
```

### Debouncing:
```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => setSearchQuery(query), 300),
  []
);
```

---

## Testing Strategy

### Unit Tests:
- Component rendering
- Hook logic
- Utility functions
- Filter/sort logic
- Keyboard navigation

### Integration Tests:
- Search flow
- Tab switching
- App launching
- Context menu actions
- Keyboard shortcuts

### E2E Tests:
- Full user flows
- Accessibility checks
- Responsive behavior
- Performance benchmarks

### Test Coverage Goals:
- 80%+ code coverage
- All critical paths tested
- Edge cases covered

---

## Error Handling

### Scenarios:
1. **App registry empty**: Show empty state
2. **Search no results**: Show "No apps found" message
3. **Failed app launch**: Show error toast
4. **Missing app icon**: Fallback to default icon
5. **Invalid preferences**: Reset to defaults

### Implementation:
```typescript
try {
  launchApp(app);
  toast.success(`Launched ${app.title}`);
} catch (error) {
  console.error('Failed to launch app:', error);
  toast.error(`Failed to launch ${app.title}`);
}
```

---

## Future Enhancements

1. **Drag and Drop**: Reorder apps, drag to dock
2. **App Details Panel**: Slide-out panel with app info
3. **Quick Actions**: Context-specific quick actions
4. **App Recommendations**: ML-based suggestions
5. **Custom Categories**: User-defined categories
6. **App Collections**: Curated app groups
7. **Search Filters**: Advanced search with filters
8. **App Ratings**: User ratings and reviews
9. **Offline Support**: Cache app data
10. **Theming**: Customizable launcher themes

---

## Dependencies

### Required:
- React 18+
- TypeScript 5+
- Next.js 14+
- Framer Motion
- Radix UI (ContextMenu, Dialog, etc.)
- Tailwind CSS
- Lucide React (icons)
- Sonner (toasts)

### Optional:
- React Virtuoso (for virtualization)
- Fuse.js (for fuzzy search)

---

## Migration Path

### Step 1: Create new component
```typescript
import { AppLauncher } from '@/components/app-launcher';

// Replace old import
// import { AppGridLauncher } from '@/components/webos/app-grid-launcher';

<AppLauncher
  isOpen={isOpen}
  onClose={onClose}
/>
```

### Step 2: Gradual rollout
- Feature flag for new launcher
- A/B testing
- Monitor performance and errors
- Gather user feedback

### Step 3: Deprecate old launchers
- Add deprecation warnings
- Update documentation
- Remove after 1-2 releases

---

## Success Criteria

✅ **Functionality**: All features from 3 launchers combined
✅ **Performance**: < 100ms render time, smooth 60fps animations
✅ **Accessibility**: WCAG 2.1 AA compliance
✅ **Code Quality**: < 800 lines for main component, 80%+ test coverage
✅ **DX**: Easy to use, well-documented, type-safe
✅ **UX**: Intuitive, responsive, delightful to use

---

## Implementation Timeline

- **Day 1-2**: Architecture design, type definitions (CURRENT)
- **Day 3-5**: Core components implementation
- **Day 6-7**: Hooks and utilities
- **Day 8-9**: Testing and refinement
- **Day 10**: Documentation and migration
- **Day 11**: Cleanup and final review
