
# Quick Start App Template

**Use this template to rapidly scaffold new apps for Community Manager**

## 1. Create File Structure

```bash
# Create directories
mkdir -p nextjs_space/app/api/[your-app]
mkdir -p nextjs_space/app/dashboard/[your-app]
mkdir -p nextjs_space/components/[your-app]
mkdir -p nextjs_space/lib/[your-app]
```

## 2. Database Model (prisma/schema.prisma)

```prisma
model YourModel {
  id              String   @id @default(cuid())
  name            String
  description     String?
  
  // Required: Multi-tenant
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Required: User association
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Required: Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
  @@index([userId])
}

// Don't forget to add relation to User model:
// model User {
//   ...
//   yourModels      YourModel[]
// }

// And Organization model:
// model Organization {
//   ...
//   yourModels      YourModel[]
// }
```

```bash
# Run migrations
cd nextjs_space
yarn prisma migrate dev --name add_your_model
yarn prisma generate
```

## 3. API Route (app/api/[your-app]/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation
const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional()
});

// GET - List
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.yourModel.findMany({
      where: { organizationId: session.user.organizationId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/your-app error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 4. API Route (app/api/[your-app]/[id]/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional()
});

// GET - Single item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const item = await prisma.yourModel.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      }
    });

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('GET /api/your-app/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateSchema.parse(body);

    const item = await prisma.yourModel.updateMany({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      },
      data: validated
    });

    if (item.count === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('PUT /api/your-app/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const item = await prisma.yourModel.deleteMany({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      }
    });

    if (item.count === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/your-app/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 5. Main Page (app/dashboard/[your-app]/page.tsx)

```typescript
'use client';

import { DesktopAppWindow } from '@/components/webos/desktop-app-window';
import { WebOSAppLayout } from '@/components/webos/webos-app-layout';
import { WebOSCard } from '@/components/webos/card';
import { WebOSEmptyState } from '@/components/webos/webos-empty-state';
import { WebOSLoadingState } from '@/components/webos/webos-loading-state';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { ItemForm } from '@/components/[your-app]/item-form';

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function YourAppPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Item> }) => {
      const res = await fetch(`/api/your-app/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['your-app', 'items'] });
      toast.success('Item updated successfully');
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error('Failed to update item: ' + error.message);
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

  // Filter items based on search
  const filteredItems = items?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DesktopAppWindow
      appId="your-app"
      title="Your App"
      icon="Folder"
      defaultWidth={1000}
      defaultHeight={600}
      minWidth={800}
      minHeight={400}
    >
      <WebOSAppLayout
        title="Your App"
        description="Manage your items"
        showSearch={true}
        onSearch={setSearchQuery}
        actions={[
          {
            label: 'New Item',
            icon: 'Plus',
            onClick: () => setIsCreateOpen(true)
          }
        ]}
      >
        {isLoading ? (
          <WebOSLoadingState message="Loading items..." />
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredItems.map((item) => (
              <WebOSCard key={item.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this item?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Created by {item.user.name}
                </div>
              </WebOSCard>
            ))}
          </div>
        ) : (
          <WebOSEmptyState
            icon="Folder"
            title="No items yet"
            description={
              searchQuery
                ? 'No items match your search'
                : 'Get started by creating your first item'
            }
            action={
              !searchQuery ? {
                label: 'Create Item',
                onClick: () => setIsCreateOpen(true)
              } : undefined
            }
          />
        )}
      </WebOSAppLayout>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Item</DialogTitle>
          </DialogHeader>
          <ItemForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <ItemForm
              initialData={editingItem}
              onSubmit={(data) =>
                updateMutation.mutate({ id: editingItem.id, data })
              }
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </DesktopAppWindow>
  );
}
```

## 6. Form Component (components/[your-app]/item-form.tsx)

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface ItemFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function ItemForm({ initialData, onSubmit, isLoading }: ItemFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
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
                <Input placeholder="Enter item name" {...field} />
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
                <Textarea
                  placeholder="Enter item description (optional)"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## 7. App Registry (lib/enhanced-app-registry.ts)

Add your app to the registry:

```typescript
{
  id: 'your-app',
  name: 'Your App Name',
  description: 'Brief description of your app',
  icon: 'Folder', // Lucide icon name
  category: 'productivity', // 'productivity' | 'communication' | 'management' | 'utilities'
  color: 'indigo', // Tailwind color
  route: '/dashboard/your-app',
  permissions: ['your_app.view', 'your_app.create', 'your_app.update', 'your_app.delete'],
  features: [
    'Create and manage items',
    'Search functionality',
    'Real-time updates',
    'Multi-user collaboration'
  ],
  isSystemApp: false,
  isNew: true,
  version: '1.0.0'
}
```

## 8. TypeScript Types (lib/[your-app]/types.ts)

```typescript
export interface Item {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemInput {
  name: string;
  description?: string;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
}

export interface ItemWithUser extends Item {
  user: {
    id: string;
    name: string;
    email: string;
  };
}
```

## 9. README (components/[your-app]/README.md)

```markdown
# Your App

## Overview
Brief description of what this app does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Usage
1. Navigate to Dashboard → Your App
2. Click "New Item" to create
3. Use search to filter
4. Click item to edit/delete

## API Endpoints
- `GET /api/your-app` - List all items
- `POST /api/your-app` - Create new item
- `GET /api/your-app/[id]` - Get single item
- `PUT /api/your-app/[id]` - Update item
- `DELETE /api/your-app/[id]` - Delete item

## Permissions
- `your_app.view` - View items
- `your_app.create` - Create items
- `your_app.update` - Update items
- `your_app.delete` - Delete items

## Database Schema
See `prisma/schema.prisma` for the `YourModel` model.
```

## 10. Build & Test

```bash
# Type check
cd nextjs_space
yarn tsc --noEmit

# Build
yarn build

# Run dev server
yarn dev

# Visit: http://localhost:3000/dashboard/your-app
```

## 11. Create Pull Request

```bash
# Create branch
git checkout -b feature/your-app

# Commit changes
git add .
git commit -m "feat(your-app): Add new app with CRUD functionality"

# Push
git push origin feature/your-app

# Create PR on GitHub
```

---

## Checklist

- [ ] Database model added to `prisma/schema.prisma`
- [ ] Migrations run successfully
- [ ] API routes created (`/api/your-app/route.ts` and `/api/your-app/[id]/route.ts`)
- [ ] Main page created (`/dashboard/your-app/page.tsx`)
- [ ] Form component created
- [ ] App registered in `lib/enhanced-app-registry.ts`
- [ ] TypeScript types defined
- [ ] README documentation written
- [ ] Multi-tenant filtering verified
- [ ] Authentication/authorization working
- [ ] Mobile responsive
- [ ] Build succeeds (`yarn build`)
- [ ] No TypeScript errors
- [ ] Tested in browser

---

**That's it!** Your app is now fully integrated with Community Manager. 🎉
