# Just Type Search Feature

## Overview

The "Just Type" search feature is a universal search system inspired by macOS Spotlight and Windows Search. It allows users to quickly search for apps, contacts, documents, and commands from anywhere in the application by simply typing.

## Features

### 🎯 Core Functionality

- **Universal Trigger**: Start typing anywhere to open search
- **Keyboard Shortcut**: `Cmd/Ctrl + K` to open search manually
- **Smart Detection**: Automatically detects when user is typing in input fields and ignores those events
- **Category Filtering**: Filter results by category (All, Navigation, Financial, Documents, etc.)
- **Keyboard Navigation**: Full keyboard support with arrow keys, Enter, Tab, and Escape
- **Real-time Search**: Instant search results as you type

### 🎨 Design

- **Anchored to Top**: Search bar appears at the top of the viewport for easy access
- **Glassmorphic Effects**: Uses backdrop blur and semi-transparent backgrounds
- **webOS Design System**: Fully integrated with webOS design tokens for consistency
- **Light/Dark Mode**: Automatic support for both color schemes
- **Smooth Animations**: Fade-in and slide-down animations for a polished experience
- **Responsive**: Works on all screen sizes from mobile to desktop

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open search |
| Any letter/number | Open search with that character |
| `↑` / `↓` | Navigate through results |
| `Enter` | Select highlighted result |
| `Tab` | Cycle through categories |
| `Esc` | Close search |

## Architecture

### Components

1. **`JustTypeSearch`** (`/components/webos/just-type-search.tsx`)
   - Main search UI component
   - Handles search input, results display, and keyboard navigation
   - Uses zustand store for state management

2. **`GlobalSearchTrigger`** (`/components/webos/global-search-trigger.tsx`)
   - Listens for global keyboard events
   - Opens search when appropriate keys are pressed
   - Ignores typing in input fields

3. **`useUniversalSearch`** (`/hooks/webos/use-universal-search.ts`)
   - Zustand store for search state
   - Manages searchable items registry
   - Handles search logic with fuzzy matching

### Styling

- **Main Styles**: `/styles/just-type-search.css`
- **Design Tokens**: Uses variables from `/styles/webos-design-system.css`
- All styles are theme-aware and support light/dark modes automatically

## Usage

### Basic Usage

The search is automatically available in the application. Users can:

1. Press `Cmd/Ctrl + K` to open search
2. Start typing anywhere (outside of input fields) to open search
3. Type to filter results
4. Use arrow keys to navigate
5. Press Enter to select a result
6. Press Escape to close

### For Developers

#### Registering New Searchable Items

You can register new items to be searchable from anywhere in your application:

```tsx
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';
import { FileText } from 'lucide-react';

function MyComponent() {
  const { registerSearchable, unregisterSearchable } = useUniversalSearch();

  useEffect(() => {
    registerSearchable({
      id: 'my-feature',
      title: 'My Feature',
      description: 'Description of my feature',
      category: 'Apps',
      icon: FileText,
      path: '/dashboard/my-feature',
      keywords: ['feature', 'custom', 'search'],
    });

    return () => {
      unregisterSearchable('my-feature');
    };
  }, []);

  return <div>My Component</div>;
}
```

#### SearchResult Interface

```typescript
interface SearchResult {
  id: string;              // Unique identifier
  title: string;           // Display title
  description?: string;    // Optional description
  category: string;        // Category for filtering
  icon?: LucideIcon;      // Optional icon component
  path?: string;          // Navigation path
  action?: () => void;    // Custom action on select
  keywords: string[];     // Search keywords
}
```

## Integration

The feature is integrated into the root layout (`/app/layout.tsx`):

```tsx
import { JustTypeSearch } from '@/components/webos/just-type-search';
import { GlobalSearchTrigger } from '@/components/webos/global-search-trigger';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <GlobalSearchTrigger />
          <JustTypeSearch />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## Default Searchable Items

The system comes with pre-configured searchable items:

- **Navigation**: Dashboard, My Community, My Household
- **Financial**: Payments, Billing
- **Documents**: Community documents, Files
- **Communication**: Messages, Notifications, AI Assistant
- **Apps**: Calendar, Notes, Email
- **Settings**: Profile, System Settings
- **Admin**: Admin Panel, User Management, Payment Management (role-based)

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: All interactive elements have proper labels
- **Focus Management**: Automatic focus on search input when opened
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Reduced Motion**: Respects `prefers-reduced-motion` preference
- **Color Contrast**: Meets WCAG AA standards in both light and dark modes

## Performance

- **Lazy Loading**: Component only renders when search is open
- **Debounced Search**: Search is optimized to prevent excessive re-renders
- **Virtual Scrolling**: Results list handles large datasets efficiently
- **Memoization**: Search results are memoized to prevent unnecessary computations

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] AI-powered search suggestions
- [ ] Search history and recent searches
- [ ] File content search
- [ ] Integration with external services (Google Drive, Dropbox)
- [ ] Voice search
- [ ] Search analytics

## Troubleshooting

### Search not opening when typing

- Check if you're typing in an input field or textarea
- Verify that JavaScript is enabled
- Check browser console for errors

### Search results not appearing

- Ensure items are registered with the search system
- Check that keywords match your search query
- Verify that the category filter is set to "ALL" or the correct category

### Styling issues

- Ensure `/styles/just-type-search.css` is imported
- Check that webOS design tokens are loaded
- Verify CSS variables are defined in `:root`

## Support

For issues or feature requests, please contact the development team or create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: December 7, 2025  
**Author**: loomOS Team
