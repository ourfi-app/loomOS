
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { step, completed } = await request.json();

    const user = await prisma.user.update({
      where: {
        email: session.user.email 
      },
      data: {
        onboardingStep: step !== undefined ? step : undefined,
        onboardingCompleted: completed !== undefined ? completed : undefined,
      },
      select: {
        id: true,
        onboardingCompleted: true,
        onboardingStep: true,
      },
    });

    return NextResponse.json({
      success: true,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep,
    });
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding status' },
      { status: 500 }
    );
  }
}
