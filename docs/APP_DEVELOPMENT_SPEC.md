
# Community Manager Application Development Specification

**Version:** 1.0  
**Last Updated:** November 1, 2025  
**Platform:** Community Manager - webOS-style Condo Association Management System

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [Component Architecture](#component-architecture)
6. [Database Integration](#database-integration)
7. [API Development](#api-development)
8. [Authentication & Authorization](#authentication--authorization)
9. [Routing & Navigation](#routing--navigation)
10. [State Management](#state-management)
11. [Integration Requirements](#integration-requirements)
12. [Code Style & Best Practices](#code-style--best-practices)
13. [Testing Requirements](#testing-requirements)
14. [Documentation Requirements](#documentation-requirements)
15. [Deployment & GitHub Workflow](#deployment--github-workflow)

---

## Overview

Community Manager is a comprehensive condo association management platform built with Next.js 14, featuring a webOS-inspired desktop interface with window management, multitasking, and a rich application ecosystem. This specification defines how to build applications that seamlessly integrate with the platform.

### Core Principles

- **Desktop-First Design**: Apps run in windowed environments with full window management
- **Responsive**: All apps must work across desktop, tablet, and mobile viewports
- **Accessible**: WCAG 2.1 AA compliance required
- **Performance**: Lazy loading, code splitting, optimized rendering
- **Consistent UX**: Follow webOS design patterns and Brandy design system

---

## Technology Stack

### Core Technologies

```json
{
  "framework": "Next.js 14.2.28",
  "runtime": "React 18.2.0",
  "language": "TypeScript 5.2.2",
  "database": "PostgreSQL (via Prisma 6.7.0)",
  "auth": "NextAuth 4.24.11",
  "styling": "Tailwind CSS 3.3.3",
  "ui": "Radix UI + Custom webOS Components",
  "state": "Zustand 5.0.3 + React Query 5.0.0",
  "forms": "React Hook Form 7.53.0 + Zod 3.23.8",
  "package-manager": "yarn"
}
```

### Required Dependencies

All apps MUST use these existing dependencies (already installed):

```bash
# UI Components
@radix-ui/react-* (accordion, dialog, dropdown-menu, etc.)
lucide-react
framer-motion

# Forms & Validation
react-hook-form
zod
yup

# State Management
zustand
@tanstack/react-query
jotai

# Utilities
clsx
tailwind-merge
date-fns
lodash
```

**DO NOT** add new dependencies without justification. Use existing libraries first.

---

## Project Structure

### File Organization

All app files must be placed within the following structure:

```
nextjs_space/
├── app/
│   ├── api/
│   │   └── [your-app]/          # API routes
│   │       ├── route.ts         # Main CRUD endpoint
│   │       └── [id]/
│   │           └── route.ts     # Individual resource endpoint
│   └── dashboard/
│       └── [your-app]/          # UI pages
│           ├── page.tsx         # Main app page
│           └── layout.tsx       # Optional app-specific layout
├── components/
│   └── [your-app]/              # App-specific components
│       ├── [app-name]-header.tsx
│       ├── [app-name]-list.tsx
│       └── [app-name]-form.tsx
├── lib/
│   └── [your-app]/              # Business logic, utilities
│       ├── types.ts
│       ├── validation.ts
│       └── utils.ts
└── prisma/
    └── schema.prisma            # Database schema (extend existing)
```

### Naming Conventions

- **Routes**: kebab-case (`/dashboard/my-app`)
- **Files**: kebab-case (`my-component.tsx`)
- **Components**: PascalCase (`MyComponent`)
- **Functions**: camelCase (`myFunction`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Types/Interfaces**: PascalCase (`MyInterface`)

---

## Design System

### Color Palette (Brandy Design System)

```css
/* Primary Colors */
--color-primary: #4F46E5      /* Indigo */
--color-primary-dark: #4338CA
--color-primary-light: #818CF8

/* Accent Colors */
--color-accent: #10B981       /* Emerald */
--color-accent-dark: #059669
--color-accent-light: #34D399

/* Neutral Colors */
--color-background: #FFFFFF
--color-surface: #F9FAFB
--color-border: #E5E7EB
--color-text: #1F2937
--color-text-muted: #6B7280

/* Status Colors */
--color-success: #10B981
--color-warning: #F59E0B
--color-error: #EF4444
--color-info: #3B82F6
```

### Typography

```css
/* Font Families */
font-sans: "Inter", system-ui, sans-serif
font-serif: "Lora", Georgia, serif
font-mono: "Fira Code", monospace

/* Font Sizes */
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
text-3xl: 1.875rem  /* 30px */
text-4xl: 2.25rem   /* 36px */
```

### Spacing System

Use Tailwind's spacing scale (4px base unit):

```
p-1: 4px    p-2: 8px    p-3: 12px   p-4: 16px
p-5: 20px   p-6: 24px   p-8: 32px   p-12: 48px
```

### Shadows (Custom Brandy Shadows)

```css
shadow-soft: 0 2px 8px rgba(0,0,0,0.08)
shadow-medium: 0 4px 16px rgba(0,0,0,0.12)
shadow-strong: 0 8px 32px rgba(0,0,0,0.16)
shadow-floating: 0 12px 48px rgba(0,0,0,0.2)
```

---

## Component Architecture

### webOS Desktop App Pattern

**REQUIRED**: All dashboard apps MUST use the desktop windowing system.

#### Standard App Page Structure

```tsx
// app/dashboard/[your-app]/page.tsx
'use client';

import { DesktopAppWindow } from '@/components/webos/desktop-app-window';
import { WebOSAppLayout } from '@/components/webos/webos-app-layout';
import { useState } from 'react';

export default function YourAppPage() {
  const [items, setItems] = useState([]);

  return (
    <DesktopAppWindow
      appId="your-app"
      title="Your App Name"
      icon="icon-name"
      defaultWidth={1000}
      defaultHeight={600}
      minWidth={800}
      minHeight={400}
    >
      <WebOSAppLayout
        title="Your App Name"
        description="Brief app description"
        showSearch={true}
        onSearch={(query) => {/* search logic */}}
        actions={[
          {
            label: "New Item",
            icon: "Plus",
            onClick: () => {/* create logic */}
          }
        ]}
      >
        {/* Your app content here */}
      </WebOSAppLayout>
    </DesktopAppWindow>
  );
}
```

### Multi-Pane Layout Pattern

For list-detail views, use the webOS pane system:

```tsx
import { MultiPaneLayout } from '@/components/webos/multi-pane-layout';
import { WebOSListPane } from '@/components/webos/webos-list-pane';
import { WebOSDetailPane } from '@/components/webos/webos-detail-pane';

<MultiPaneLayout>
  <WebOSListPane title="Items">
    {/* List items */}
  </WebOSListPane>
  
  <WebOSDetailPane title="Details">
    {/* Detail content */}
  </WebOSDetailPane>
</MultiPaneLayout>
```

### Required webOS Components

Use these components for consistency:

- `<WebOSListItem>` - List items with hover states
- `<WebOSCard>` - Content containers
- `<WebOSButton>` - Action buttons
- `<WebOSDialog>` - Modal dialogs
- `<WebOSSearchBar>` - Search inputs
- `<WebOSEmptyState>` - Empty state screens
- `<WebOSLoadingState>` - Loading skeletons

---

## Database Integration

### Schema Design

Extend the existing Prisma schema in `prisma/schema.prisma`:

```prisma
// Add your models to the existing schema
model YourModel {
  id              String   @id @default(cuid())
  name            String
  description     String?
  
  // Multi-tenant support (REQUIRED)
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // User association (if applicable)
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Timestamps (REQUIRED)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Indexes for performance
  @@index([organizationId])
  @@index([userId])
  @@index([createdAt])
}
```

### Multi-Tenant Rules

**CRITICAL**: All data MUST be scoped to organizations:

```typescript
// Always filter by organizationId
const items = await prisma.yourModel.findMany({
  where: {
    organizationId: session.user.organizationId
  }
});

// Always include organizationId when creating
await prisma.yourModel.create({
  data: {
    ...data,
    organizationId: session.user.organizationId,
    userId: session.user.id
  }
});
```

### Migration Process

1. Add models to `schema.prisma`
2. Run: `cd nextjs_space && yarn prisma migrate dev --name add_your_feature`
3. Run: `yarn prisma generate`
4. Commit migration files

---

## API Development

### API Route Pattern

All API routes MUST follow this pattern:

```typescript
// app/api/[your-app]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional()
});

// GET - List items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.yourModel.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/your-app error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createSchema.parse(body);

    const item = await prisma.yourModel.create({
      data: {
        ...validated,
        organizationId: session.user.organizationId,
        userId: session.user.id
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/your-app error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### API Security Checklist

- ✅ **Always** check session authentication
- ✅ **Always** validate input with Zod
- ✅ **Always** filter by organizationId
- ✅ **Always** handle errors gracefully
- ✅ **Never** expose sensitive data
- ✅ **Never** trust client input

---

## Authentication & Authorization

### Session Management

```typescript
import { useSession } from 'next-auth/react';

function YourComponent() {
  const { data: session, status } = useSession() || {};
  
  if (status === 'loading') {
    return <WebOSLoadingState />;
  }
  
  if (!session) {
    return <div>Please sign in</div>;
  }
  
  return <div>Welcome, {session.user.name}</div>;
}
```

### Role-Based Access Control

```typescript
import { hasPermission } from '@/lib/permissions';

// Check permissions
if (!hasPermission(session.user, 'your_app.create')) {
  return <div>Access denied</div>;
}

// Available roles
type Role = 'SUPER_ADMIN' | 'ADMIN' | 'BOARD_MEMBER' | 'RESIDENT';

// Permission naming convention
// Format: [app_name].[action]
// Examples: calendar.create, documents.delete, directory.update
```

---

## Routing & Navigation

### App Registration

Register your app in the app registry:

```typescript
// lib/enhanced-app-registry.ts
export const appRegistry = [
  // ... existing apps
  {
    id: 'your-app',
    name: 'Your App Name',
    description: 'Brief description of your app',
    icon: 'IconName', // Lucide icon name
    category: 'productivity', // or 'communication', 'management', 'utilities'
    color: 'indigo', // Tailwind color
    route: '/dashboard/your-app',
    permissions: ['your_app.view'],
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3'
    ],
    isSystemApp: false, // true only for core system apps
    isNew: true, // for "New" badge
    version: '1.0.0'
  }
];
```

### Navigation Patterns

```typescript
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Programmatic navigation
const router = useRouter();
router.push('/dashboard/your-app');

// Link component
<Link href="/dashboard/your-app">Open App</Link>

// External app links
import { AppLink } from '@/components/integration/app-link';
<AppLink appId="calendar" itemId="event-123">View Event</AppLink>
```

---

## State Management

### Component State (useState)

For simple, local state:

```typescript
const [items, setItems] = useState<Item[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

### Global State (Zustand)

For app-wide state, create a store:

```typescript
// lib/your-app-store.ts
import { create } from 'zustand';

interface YourAppState {
  items: Item[];
  selectedItem: Item | null;
  setItems: (items: Item[]) => void;
  setSelectedItem: (item: Item | null) => void;
}

export const useYourAppStore = create<YourAppState>((set) => ({
  items: [],
  selectedItem: null,
  setItems: (items) => set({ items }),
  setSelectedItem: (selectedItem) => set({ selectedItem })
}));

// Usage in components
const { items, setItems } = useYourAppStore();
```

### Server State (React Query)

For API data fetching:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['your-app', 'items'],
  queryFn: async () => {
    const res = await fetch('/api/your-app');
    return res.json();
  }
});

// Mutate data
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: async (newItem: Item) => {
    const res = await fetch('/api/your-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['your-app', 'items'] });
  }
});
```

---

## Integration Requirements

### Dock Integration

Your app will automatically appear in the dock once registered in `appRegistry`. No additional code needed.

### Marketplace Integration

For apps to appear in the marketplace:

```typescript
// Marketplace entry is auto-generated from appRegistry
// Ensure your app has:
// - Clear description
// - Feature list
// - Appropriate category
// - Icon assigned
```

### Universal Search Integration

Make your app searchable:

```typescript
// In your main page component
useEffect(() => {
  // Register search handler
  window.addEventListener('universal-search', handleSearch);
  return () => window.removeEventListener('universal-search', handleSearch);
}, []);

function handleSearch(event: CustomEvent) {
  const query = event.detail.query;
  // Filter your app's data
  // Update UI to show search results
}
```

### AI Assistant Integration

Allow AI assistant to interact with your app:

```typescript
// app/api/your-app/ai-actions/route.ts
export async function POST(request: NextRequest) {
  const { action, params } = await request.json();
  
  switch (action) {
    case 'create':
      // Handle AI-triggered creation
      break;
    case 'search':
      // Handle AI-triggered search
      break;
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
```

### Notifications Integration

Send notifications from your app:

```typescript
import { createNotification } from '@/lib/notifications';

await createNotification({
  userId: session.user.id,
  organizationId: session.user.organizationId,
  type: 'info', // 'success' | 'warning' | 'error' | 'info'
  title: 'Item Created',
  message: 'Your item has been created successfully',
  appId: 'your-app',
  actionUrl: '/dashboard/your-app',
  priority: 'medium'
});
```

---

## Code Style & Best Practices

### TypeScript Configuration

- **Always** use TypeScript (no `.js` or `.jsx`)
- **Always** define types for props, state, API responses
- **Avoid** `any` type (use `unknown` if needed)

```typescript
// Good
interface ItemProps {
  item: Item;
  onSelect: (id: string) => void;
}

function ItemCard({ item, onSelect }: ItemProps) {
  // ...
}

// Bad
function ItemCard(props: any) {
  // ...
}
```

### Component Best Practices

```typescript
// ✅ Use functional components with hooks
export default function MyComponent() {
  // ...
}

// ✅ Destructure props
function MyComponent({ title, onClose }: Props) {
  // ...
}

// ✅ Use early returns
if (!data) return <WebOSLoadingState />;
if (error) return <ErrorState error={error} />;

// ✅ Extract complex logic to custom hooks
const { items, isLoading, error } = useItems();

// ✅ Memoize expensive computations
const filteredItems = useMemo(
  () => items.filter(item => item.status === 'active'),
  [items]
);

// ✅ Use proper key props in lists
{items.map(item => (
  <ItemCard key={item.id} item={item} />
))}
```

### Error Handling

```typescript
// API routes
try {
  // ... operation
} catch (error) {
  console.error('Error in operation:', error);
  return NextResponse.json(
    { error: 'Operation failed', details: error.message },
    { status: 500 }
  );
}

// Components
try {
  await mutation.mutateAsync(data);
  toast.success('Operation successful');
} catch (error) {
  toast.error('Operation failed: ' + error.message);
}
```

### Performance Optimization

```typescript
// ✅ Lazy load heavy components
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <WebOSLoadingState />
});

// ✅ Use React.memo for expensive renders
export const ItemCard = React.memo(({ item }: Props) => {
  // ...
});

// ✅ Debounce search inputs
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => setSearchQuery(value),
  300
);
```

---

## Testing Requirements

### Unit Tests

Test business logic and utilities:

```typescript
// lib/__tests__/your-utils.test.ts
import { describe, it, expect } from '@jest/globals';
import { yourUtilFunction } from '../your-utils';

describe('yourUtilFunction', () => {
  it('should return correct value', () => {
    expect(yourUtilFunction('input')).toBe('expected');
  });
});
```

### Component Tests

Test React components:

```typescript
// components/__tests__/your-component.test.tsx
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../your-component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### API Tests

Test API endpoints:

```typescript
// app/api/__tests__/your-app.test.ts
import { GET, POST } from '../your-app/route';

describe('/api/your-app', () => {
  it('requires authentication', async () => {
    const response = await GET(new Request('http://localhost/api/your-app'));
    expect(response.status).toBe(401);
  });
});
```

---

## Documentation Requirements

### Code Documentation

```typescript
/**
 * Component description
 * 
 * @param {string} title - The title to display
 * @param {Function} onClose - Callback when closed
 * @returns {JSX.Element}
 */
export function MyComponent({ title, onClose }: Props) {
  // ...
}
```

### README File

Every app MUST include a README:

```markdown
# Your App Name

## Overview
Brief description of what the app does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Usage
How to use the app.

## API Endpoints
- GET /api/your-app - List items
- POST /api/your-app - Create item
- PUT /api/your-app/[id] - Update item
- DELETE /api/your-app/[id] - Delete item

## Database Schema
Description of models and relationships.

## Permissions
- your_app.view - View items
- your_app.create - Create items
- your_app.update - Update items
- your_app.delete - Delete items

## Dependencies
List any special dependencies.

## Known Issues
Any known limitations or issues.
```

### Changelog

Document changes in `CHANGELOG.md`:

```markdown
# Changelog

## [1.0.0] - 2025-11-01
### Added
- Initial release
- Feature X
- Feature Y

### Fixed
- Bug A
- Bug B
```

---

## Deployment & GitHub Workflow

### Branch Strategy

```bash
# Feature branches
git checkout -b feature/your-app-name

# Bug fixes
git checkout -b fix/your-app-bug-description

# Commit messages
git commit -m "feat(your-app): Add new feature"
git commit -m "fix(your-app): Fix bug description"
git commit -m "docs(your-app): Update documentation"
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement

## Checklist
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Documentation updated
- [ ] App registered in registry
- [ ] Multi-tenant compliance verified
- [ ] Permissions defined
- [ ] Mobile responsive
- [ ] Accessibility tested

## Screenshots
(if applicable)

## Testing
How to test the changes
```

### Pre-commit Checklist

Before committing:

```bash
# 1. Type check
cd nextjs_space && yarn tsc --noEmit

# 2. Build check
yarn build

# 3. Run tests
yarn test

# 4. Format code
# Ensure consistent formatting
```

### Deployment Process

1. Create feature branch
2. Develop and test locally
3. Run `yarn build` to verify production build
4. Commit changes with descriptive messages
5. Push to GitHub
6. Create Pull Request
7. Wait for review and approval
8. Merge to main
9. Automatic deployment triggers

---

## Quick Start Checklist

When building a new app, follow this checklist:

### Phase 1: Planning
- [ ] Define app purpose and features
- [ ] Identify required database models
- [ ] Plan API endpoints
- [ ] Design UI mockups
- [ ] Define permissions

### Phase 2: Database
- [ ] Add Prisma models to `schema.prisma`
- [ ] Run migrations: `yarn prisma migrate dev --name add_your_app`
- [ ] Generate Prisma client: `yarn prisma generate`
- [ ] Add seed data (optional)

### Phase 3: API Development
- [ ] Create API route folder: `app/api/[your-app]/`
- [ ] Implement GET, POST, PUT, DELETE endpoints
- [ ] Add Zod validation schemas
- [ ] Test with Postman or curl
- [ ] Verify multi-tenant filtering

### Phase 4: UI Development
- [ ] Create page: `app/dashboard/[your-app]/page.tsx`
- [ ] Implement `<DesktopAppWindow>` wrapper
- [ ] Build main UI using webOS components
- [ ] Add forms with validation
- [ ] Implement CRUD operations
- [ ] Add loading and error states

### Phase 5: Integration
- [ ] Register app in `lib/enhanced-app-registry.ts`
- [ ] Add permissions to database
- [ ] Implement universal search handler
- [ ] Add notification triggers
- [ ] Test dock integration

### Phase 6: Polish
- [ ] Add responsive breakpoints
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add empty states

### Phase 7: Documentation
- [ ] Write README.md
- [ ] Add inline code comments
- [ ] Document API endpoints
- [ ] Create user guide (optional)

### Phase 8: Testing & Deployment
- [ ] Write unit tests
- [ ] Write component tests
- [ ] Write API tests
- [ ] Run full build: `yarn build`
- [ ] Test in production mode: `yarn start`
- [ ] Create Pull Request

---

## Common Patterns & Examples

### CRUD Page Template

```tsx
'use client';

import { DesktopAppWindow } from '@/components/webos/desktop-app-window';
import { WebOSAppLayout } from '@/components/webos/webos-app-layout';
import { WebOSCard } from '@/components/webos/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function YourAppPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch items
  const { data: items, isLoading } = useQuery({
    queryKey: ['your-app', 'items'],
    queryFn: async () => {
      const res = await fetch('/api/your-app');
      if (!res.ok) throw new Error('Failed to fetch items');
      return res.json() as Promise<Item[]>;
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Item>) => {
      const res = await fetch('/api/your-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['your-app', 'items'] });
      toast.success('Item created successfully');
      setIsCreateOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create item: ' + error.message);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/your-app/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['your-app', 'items'] });
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete item: ' + error.message);
    }
  });

  return (
    <DesktopAppWindow
      appId="your-app"
      title="Your App"
      icon="Folder"
      defaultWidth={1000}
      defaultHeight={600}
    >
      <WebOSAppLayout
        title="Your App"
        description="Manage your items"
        actions={[
          {
            label: 'New Item',
            icon: 'Plus',
            onClick: () => setIsCreateOpen(true)
          }
        ]}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <WebOSCard key={item.id}>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  Delete
                </Button>
              </WebOSCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items yet</p>
            <Button onClick={() => setIsCreateOpen(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create First Item
            </Button>
          </div>
        )}
      </WebOSAppLayout>
    </DesktopAppWindow>
  );
}
```

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export function ItemForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

## Support & Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives)

### Internal Resources

- `README.md` - Project overview
- `STYLE_GUIDE.md` - Design system guide
- `CONTRIBUTING.md` - Contribution guidelines
- `docs/` - Additional documentation

### Getting Help

1. Check existing documentation
2. Review similar apps in the codebase
3. Search issues on GitHub
4. Ask in development channel
5. Create detailed issue report

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-01 | Initial specification release |

---

## License

Community Manager is proprietary software. All apps developed for this platform must comply with the project license.

---

**Ready to build?** Follow this specification to create apps that seamlessly integrate with Community Manager's ecosystem. Happy coding! 🚀
