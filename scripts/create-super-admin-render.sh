#!/bin/bash
# Create Super Admin User on Render
# This script can be run in the Render shell to create a super admin user

set -e

echo "🚀 Creating Super Admin account on Render..."
echo ""

# Create super admin using Node and existing dependencies
node << 'NODESCRIPT'
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  // Dynamically import Prisma
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const email = 'superadmin@trellis.com';
    const password = 'SuperAdmin123!';

    // Check if super admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existing) {
      console.log('✅ Super Admin already exists!');
      console.log(`   Email: ${email}`);
      console.log(`   Role: ${existing.role}`);
      await prisma.$disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    const superAdmin = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        organizationId: null,
        isActive: true,
        onboardingCompleted: true,
      }
    });

    console.log('✅ Super Admin created successfully!\n');
    console.log('📧 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}\n`);
    console.log('⚠️  IMPORTANT: Change this password after first login!\n');
    console.log('🎉 Access the Super Admin Dashboard at /dashboard/super-admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
NODESCRIPT

echo ""
echo "✨ Done!"
