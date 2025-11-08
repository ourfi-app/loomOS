const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'loomos',
  });

  try {
    await client.connect();
    console.log('🔌 Connected to database\n');

    // First, create the necessary enums and tables
    console.log('📋 Creating schema...\n');

    // Create UserRole enum
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'BOARD_MEMBER', 'RESIDENT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create MemberBadge enum
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "MemberBadge" AS ENUM ('NEW_MEMBER', 'VERIFIED', 'MODERATOR');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create MemberStatus enum
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "MemberStatus" AS ENUM ('ONLINE', 'AWAY', 'BUSY', 'OFFLINE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "organizationId" TEXT,
        "email" TEXT NOT NULL,
        "password" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'RESIDENT',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "firstName" TEXT,
        "lastName" TEXT,
        "name" TEXT,
        "phone" TEXT,
        "unitNumber" TEXT,
        "image" TEXT,
        "bio" TEXT,
        "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
        "badge" "MemberBadge" DEFAULT 'NEW_MEMBER',
        "status" "MemberStatus" DEFAULT 'OFFLINE',
        "lastActiveAt" TIMESTAMP(3),
        "emailVerified" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create unique index on email
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
    `);

    console.log('✅ Schema created successfully\n');

    // Check if super admin already exists
    const email = 'superadmin@trellis.com';
    const checkResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ Super Admin account already exists!');
      console.log(`   Email: ${email}`);
      console.log(`   Role: ${checkResult.rows[0].role}`);
      return;
    }

    // Create super admin user
    const password = 'SuperAdmin123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = 'user_' + Math.random().toString(36).substr(2, 9);

    await client.query(`
      INSERT INTO users (
        id, email, password, "firstName", "lastName", name, role,
        "organizationId", "isActive", "onboardingCompleted", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    `, [
      id,
      email,
      hashedPassword,
      'Super',
      'Admin',
      'Super Admin',
      'SUPER_ADMIN',
      null,
      true,
      true
    ]);

    console.log('✅ Super Admin account created successfully!\n');
    console.log('📧 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}\n`);
    console.log('⚠️  IMPORTANT: Change this password after first login!\n');
    console.log('🎉 You can now access the Super Admin Dashboard at /dashboard/super-admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

main();
