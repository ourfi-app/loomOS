
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upgradeToAdmin() {

  // **CHANGE THIS EMAIL to your account email**
  const userEmail = 'your-email@example.com';

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email: userEmail },
    data: {
      role: 'ADMIN',
      isActive: true,
    },
  });

}

upgradeToAdmin()
  .catch((e) => {
    console.error('❌ Error upgrading user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
