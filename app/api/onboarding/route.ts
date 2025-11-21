
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        unitNumber: true,
        createdAt: true
      }
    });

    // Determine if user needs onboarding
    const needsOnboarding = !user?.firstName || !user?.lastName || !user?.unitNumber;
    
    // Check how many days since account creation
    const daysSinceCreation = user?.createdAt 
      ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return NextResponse.json({
      needsOnboarding,
      user,
      daysSinceCreation,
      showOnboarding: needsOnboarding && daysSinceCreation < 30 // Show onboarding prompt for first 30 days
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json({ error: 'Failed to check onboarding status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { step, data } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle different onboarding steps
    switch (step) {
      case 'profile':
        await prisma.user.update({
          where: { id: user.id },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            name: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
            unitNumber: data.unitNumber
          }
        });
        break;

      case 'household':
        // Add pets
        if (data.pets && data.pets.length > 0) {
          await Promise.all(
            data.pets.map((pet: any) =>
              prisma.pet.create({
                data: {
                  organizationId,
                  unitNumber: user.unitNumber!,
                  name: pet.name,
                  type: pet.type,
                  breed: pet.breed,
                  color: pet.color,
                  weight: pet.weight,
                  age: pet.age,
                  description: pet.description
                }
              })
            )
          );
        }

        // Add children
        if (data.children && data.children.length > 0) {
          await Promise.all(
            data.children.map((child: any) =>
              prisma.child.create({
                data: {
                  organizationId,
                  unitNumber: user.unitNumber!,
                  name: child.name,
                  age: child.age,
                  birthYear: child.birthYear,
                  grade: child.grade,
                  school: child.school
                }
              })
            )
          );
        }

        // Add additional residents
        if (data.residents && data.residents.length > 0) {
          await Promise.all(
            data.residents.map((resident: any) =>
              prisma.additionalResident.create({
                data: {
                  organizationId,
                  unitNumber: user.unitNumber!,
                  name: resident.name,
                  relationship: resident.relationship,
                  email: resident.email,
                  phone: resident.phone,
                  isEmergencyContact: resident.isEmergencyContact || false
                }
              })
            )
          );
        }
        break;

      case 'preferences':
        // Future: Save user preferences (notifications, theme, etc.)
        break;

      case 'complete':
        // Mark onboarding as complete
        break;

      default:
        return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Onboarding step completed' });
  } catch (error) {
    console.error('Error processing onboarding:', error);
    return NextResponse.json({ error: 'Failed to process onboarding' }, { status: 500 });
  }
}
