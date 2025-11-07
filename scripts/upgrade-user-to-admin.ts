
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upgradeToAdmin() {
  console.log('🔧 Upgrading user to ADMIN...\n');

  // **CHANGE THIS EMAIL to your account email**
  const userEmail = 'your-email@example.com';

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    console.log(`❌ User with email ${userEmail} not found!`);
    console.log('   Please update the email in the script and try again.');
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email: userEmail },
    data: {
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ User upgraded successfully!');
  console.log(`   Email: ${updatedUser.email}`);
  console.log(`   Name: ${updatedUser.firstName} ${updatedUser.lastName}`);
  console.log(`   Role: ${updatedUser.role}`);
  console.log('\n🎉 You can now access admin features!');
}

upgradeToAdmin()
  .catch((e) => {
    console.error('❌ Error upgrading user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
