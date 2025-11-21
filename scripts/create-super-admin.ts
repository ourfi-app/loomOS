import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Load environment variables from .env file
config();

const prisma = new PrismaClient();

async function main() {

  const email = 'superadmin@trellis.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'changeme-superadmin-dev';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if super admin already exists
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingSuperAdmin) {
    return;
  }

  // Create super admin user
  const superAdmin = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      organizationId: null, // Super admins are platform-level, not tied to any org
      isActive: true,
      onboardingCompleted: true,
    },
  });

}

main()
  .catch((e) => {
    console.error('❌ Error creating super admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
