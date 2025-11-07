
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Note: We don't require organization ID here as users may not have one during initial onboarding
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email 
      },
      select: {
        id: true,
        role: true,
        onboardingCompleted: true,
        onboardingStep: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep,
      role: user.role,
    });
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' },
      { status: 500 }
    );
  }
}
