
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { AppCategory, AppStatus, UserRole } from '@prisma/client';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

// Map app registry categories to marketplace categories
function mapCategory(category: string): AppCategory {
  const categoryMap: Record<string, AppCategory> = {
    'essentials': AppCategory.PRODUCTIVITY,
    'personal': AppCategory.LIFESTYLE,
    'community': AppCategory.COMMUNITY,
    'productivity': AppCategory.PRODUCTIVITY,
    'admin': AppCategory.UTILITIES,
    'settings': AppCategory.UTILITIES,
  };
  return categoryMap[category] || AppCategory.PRODUCTIVITY;
}

// Seed marketplace with ALL apps from registry
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const userRole = (session.user as any).role;
    if (!hasAdminAccess(userRole)) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    // Convert ALL apps from APP_REGISTRY to marketplace format
    const apps = Object.entries(APP_REGISTRY).map(([key, app]) => {
      // Determine app status
      let status: AppStatus = AppStatus.AVAILABLE;
      if (app.isBeta) status = AppStatus.BETA;
      
      // Determine if app is a system app (cannot be uninstalled)
      const isSystem = ['home', 'notifications', 'profile'].includes(app.id);
      
      // Map the minRole
      let minRole: UserRole | null = null;
      if (app.requiresAdmin) {
        minRole = UserRole.ADMIN;
      }
      
      // Create slug from id
      const slug = app.id;
      
      // Get icon name - convert iconKey to proper case for Lucide icons
      let iconName: string = app.iconKey;
      // Handle special cases for icon names
      const iconMap: Record<string, string> = {
        'home': 'Home',
        'assistant': 'MessageSquare',
        'notifications': 'Bell',
        'profile': 'User',
        'payments': 'CreditCard',
        'documents': 'FileText',
        'directory': 'Users',
        'marketplace': 'Store',
        'admin': 'Shield',
        'messages': 'Mail',
        'buildingServices': 'Wrench',
        'externalConnections': 'Link',
        'onboarding': 'Sparkles',
        'systemConfig': 'Settings',
        'accounting': 'Calculator',
        'budgeting': 'PiggyBank',
        'residentPortal': 'Home',
        'appDesigner': 'Palette',
        'emailApp': 'Mail',
        'calendarApp': 'Calendar',
        'help': 'HelpCircle',
        'tasksApp': 'CheckSquare',
        'notesApp': 'FileText',
        'household': 'Home',
        'myCommunity': 'Users',
        'myHousehold': 'Home',
        'systemSettings': 'Settings',
      };
      iconName = iconMap[iconName] || 'Package';
      
      // Get color gradient - extract gradient colors
      const color = app.gradient || 'from-blue-500 to-blue-600';
      
      // Calculate random but consistent rating
      const rating = app.averageRating || (4.0 + Math.random() * 0.9);
      const ratingCount = app.totalRatings || Math.floor(50 + Math.random() * 150);
      
      // Generate app size
      const size = `${(2 + Math.random() * 3).toFixed(1)} MB`;
      
      return {
        organizationId,
        name: app.title,
        slug: slug,
        shortDescription: app.description || 'A helpful community application',
        longDescription: app.longDescription || app.description || 'This app helps you manage your community activities more efficiently.',
        category: mapCategory(app.category),
        status: status,
        version: app.version || '1.0.0',
        developer: app.developer || 'Montrecott Team',
        iconName: iconName,
        color: color,
        path: app.path,
        features: app.features || ['Easy to use', 'Community focused', 'Mobile friendly'],
        permissions: app.permissions || [],
        minRole: minRole,
        isSystem: isSystem,
        installCount: isSystem ? 999 : Math.floor(Math.random() * 500),
        rating: rating,
        ratingCount: ratingCount,
        size: size,
        releaseDate: app.releaseDate ? new Date(app.releaseDate) : new Date('2024-01-15'),
        lastUpdated: app.lastUpdated ? new Date(app.lastUpdated) : new Date('2024-10-01'),
        isFeatured: app.isNew || app.isBeta || false,
      };
    });

    // Upsert all apps
    let successCount = 0;
    let errorCount = 0;
    
    for (const appData of apps) {
      try {
        await prisma.marketplaceApp.upsert({
          where: {
            slug: appData.slug,
          },
          update: {
            ...appData,
            updatedAt: new Date(),
          },
          create: appData,
        });
        successCount++;
      } catch (error) {
        console.error(`Error upserting app ${appData.name}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      totalApps: apps.length,
      successCount,
      errorCount,
      message: `Successfully seeded ${successCount} apps${errorCount > 0 ? `, ${errorCount} failed` : ''}`
    });
  } catch (error) {
    console.error('Error seeding marketplace:', error);
    return NextResponse.json({ error: 'Failed to seed marketplace' }, { status: 500 });
  }
}
