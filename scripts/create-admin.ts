
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'bryanespey@gmail.com';
    const password = 'heyboob1234';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists. Updating to ADMIN role...');
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { 
          role: 'ADMIN',
          isActive: true,
          password: await bcrypt.hash(password, 10)
        }
      });
      console.log('✅ User updated successfully:', updatedUser.email, '- Role:', updatedUser.role);
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: 'Bryan',
          lastName: 'Espey',
          name: 'Bryan Espey',
          role: 'ADMIN',
          isActive: true,
          emailVerified: new Date(),
        }
      });
      
      console.log('✅ Admin user created successfully:', admin.email, '- Role:', admin.role);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
