// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { getAllApps, APP_REGISTRY } from '../lib/enhanced-app-registry';

const prisma = new PrismaClient();

// Map app registry categories to Prisma AppCategory enum
function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'essentials': 'UTILITIES',
    'personal': 'LIFESTYLE',
    'community': 'COMMUNITY',
    'productivity': 'PRODUCTIVITY',
    'admin': 'UTILITIES',
    'settings': 'UTILITIES'
  };
  return categoryMap[category] || 'UTILITIES';
}

async function seedMarketplace() {

  try {
    // Connect to database
    await prisma.$connect();
    
    // Get default organization
    const org = await prisma.organization.findFirst();
    
    if (!org) {
      console.error('❌ No organization found. Please run the main seed first.');
      process.exit(1);
    }


    // Get all apps from the registry (include admin apps)
    const allApps = getAllApps(true);

    let seededCount = 0;
    let updatedCount = 0;

    for (const app of allApps) {
      // Check if app already exists
      const existingApp = await prisma.marketplaceApp.findFirst({
        where: { 
          slug: app.id,
          organizationId: org.id 
        }
      });

      const appData = {
        slug: app.id,
        name: app.title,
        shortDescription: app.description || `${app.title} application`,
        longDescription: app.longDescription || app.description || `${app.title} application`,
        category: mapCategory(app.category) as any,
        iconName: app.iconKey,
        color: app.gradient,
        path: app.path,
        version: app.version || '1.0.0',
        developer: app.developer || 'Montrecott',
        isSystem: app.category === 'essentials',
        isFeatured: ['home', 'directory', 'messages', 'documents', 'calendar'].includes(app.id),
        rating: app.averageRating || 4.5,
        installCount: 0,
        ratingCount: app.totalRatings || 0,
        screenshots: app.screenshots || [],
        features: app.features || [],
        permissions: app.permissions || [],
        minRole: app.requiresAdmin ? 'ADMIN' : null,
        releaseDate: app.releaseDate ? new Date(app.releaseDate) : new Date(),
        lastUpdated: app.lastUpdated ? new Date(app.lastUpdated) : new Date(),
        organizationId: org.id
      };

      if (existingApp) {
        await prisma.marketplaceApp.update({
          where: { id: existingApp.id },
          data: appData
        });
        updatedCount++;
      } else {
        await prisma.marketplaceApp.create({
          data: appData
        });
        seededCount++;
      }
    }


  } catch (error) {
    console.error('❌ Error seeding marketplace:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedMarketplace()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
