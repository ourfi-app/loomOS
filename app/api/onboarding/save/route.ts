
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;

    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const organizationId = await getCurrentOrganizationId();
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { step, data, completed = false } = body;

    // Get existing settings or create new
    let settings = await prisma.associationSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    const updateData: any = {
      ...data,
      onboardingStep: step,
      onboardingCompleted: completed
    };

    if (completed) {
      updateData.onboardingCompletedAt = new Date();
    }

    // Convert string amounts to Decimal
    if (data.defaultMonthlyDues) {
      updateData.defaultMonthlyDues = parseFloat(data.defaultMonthlyDues);
    }
    if (data.lateFeeAmount) {
      updateData.lateFeeAmount = parseFloat(data.lateFeeAmount);
    }

    if (settings) {
      settings = await prisma.associationSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    } else {
      settings = await prisma.associationSettings.create({
        data: updateData
      });
    }

    // If onboarding is completed and financial settings are provided,
    // also create/update DuesSettings
    if (completed && data.defaultMonthlyDues) {
      await prisma.duesSettings.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });

      await prisma.duesSettings.create({
        data: {
          organizationId,
          monthlyAmount: parseFloat(data.defaultMonthlyDues),
          dueDay: data.dueDay || 1,
          lateFee: data.lateFeeAmount ? parseFloat(data.lateFeeAmount) : 0,
          gracePeriod: data.lateFeeGracePeriod || 5,
          isActive: true
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      settings: {
        ...settings,
        defaultMonthlyDues: settings.defaultMonthlyDues?.toString(),
        lateFeeAmount: settings.lateFeeAmount?.toString()
      }
    });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
