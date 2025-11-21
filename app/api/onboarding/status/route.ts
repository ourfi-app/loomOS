// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;

    // Only admins can access onboarding
    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Try to get organization ID, but don't fail if it doesn't exist yet
    // During initial onboarding, the user may not have an organization yet
    let organizationId: string | null = null;
    try {
      organizationId = await getCurrentOrganizationId();
    } catch (error) {
      // User doesn't have an organization yet - this is expected during initial setup
    }

    // Get or create association settings
    let settings = await prisma.associationSettings.findFirst({
      where: organizationId ? { organizationId } : {},
      orderBy: { createdAt: 'desc' }
    });

    if (!settings) {
      settings = await prisma.associationSettings.create({
        data: {
          organizationId: organizationId || '',
          onboardingCompleted: false,
          onboardingStep: 0
        }
      });
    }

    return NextResponse.json({ 
      settings: {
        ...settings,
        defaultMonthlyDues: settings.defaultMonthlyDues?.toString(),
        lateFeeAmount: settings.lateFeeAmount?.toString()
      }
    });
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' },
      { status: 500 }
    );
  }
}
