import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Load environment variables from .env file
config();

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creating Super Admin account...\n');

  const email = 'superadmin@trellis.com';
  const password = 'SuperAdmin123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if super admin already exists
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingSuperAdmin) {
    console.log('✅ Super Admin account already exists!');
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${existingSuperAdmin.role}`);
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

  console.log('✅ Super Admin account created successfully!');
  console.log('\n📧 Login Credentials:');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log('\n⚠️  IMPORTANT: Change this password after first login!');
  console.log('\n🎉 You can now access the Super Admin Dashboard at /super-admin');
}

main()
  .catch((e) => {
    console.error('❌ Error creating super admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
