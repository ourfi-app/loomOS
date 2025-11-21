
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = await getCurrentOrganizationId();

    // Get association settings to check onboarding status
    const settings = await prisma.associationSettings.findFirst();

    if (!settings) {
      return NextResponse.json({
        currentStep: 0,
        data: {},
      });
    }

    return NextResponse.json({
      currentStep: settings.onboardingStep || 0,
      onboardingCompleted: settings.onboardingCompleted,
      data: (settings as any).onboardingData || {},
    });
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = await getCurrentOrganizationId();
    const body = await req.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { currentStep, data } = body;

    // Find or create association settings
    let settings = await prisma.associationSettings.findFirst();

    if (!settings) {
      settings = await prisma.associationSettings.create({
        data: {
          organizationId,
          onboardingStep: currentStep,
          onboardingCompleted: false,
        },
      });
    } else {
      settings = await prisma.associationSettings.update({
        where: { id: settings.id },
        data: {
          onboardingStep: currentStep,
          ...(data.associationInfo && {
            associationName: data.associationInfo.associationName,
            streetAddress: data.associationInfo.streetAddress,
            city: data.associationInfo.city,
            state: data.associationInfo.state,
            zipCode: data.associationInfo.zipCode,
            country: data.associationInfo.country,
            yearEstablished: data.associationInfo.yearEstablished ? parseInt(data.associationInfo.yearEstablished) : null,
            propertyType: data.associationInfo.propertyType,
            totalUnits: data.associationInfo.totalUnits ? parseInt(data.associationInfo.totalUnits) : null,
            officePhone: data.associationInfo.officePhone,
            officeEmail: data.associationInfo.officeEmail,
            emergencyPhone: data.associationInfo.emergencyPhone,
            managementCompany: data.associationInfo.managementCompany,
            websiteUrl: data.associationInfo.websiteUrl,
          }),
          ...(data.settings && {
            defaultMonthlyDues: data.settings.defaultMonthlyDues ? parseFloat(data.settings.defaultMonthlyDues) : null,
            dueDay: data.settings.dueDay ? parseInt(data.settings.dueDay) : 1,
            lateFeeAmount: data.settings.lateFeeAmount ? parseFloat(data.settings.lateFeeAmount) : null,
            lateFeeGracePeriod: data.settings.lateFeeGracePeriod ? parseInt(data.settings.lateFeeGracePeriod) : 5,
            acceptedPaymentMethods: {
              creditCard: data.settings.acceptCreditCard,
              ach: data.settings.acceptACH,
              check: data.settings.acceptCheck,
            },
          }),
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving onboarding progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}
