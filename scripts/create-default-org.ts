import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create or get default organization
    const defaultOrg = await prisma.organization.upsert({
      where: { id: 'default-org-id' },
      update: {},
      create: {
        id: 'default-org-id',
        name: 'Default Organization',
        slug: 'default-organization',
        type: 'CONDO_ASSOCIATION',
        settings: {},
        onboardingCompleted: true,
        isActive: true,
      },
    });


    // Update all users without an organization to use the default
    const result = await prisma.user.updateMany({
      where: {
        organizationId: null,
      },
      data: {
        organizationId: 'default-org-id',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
