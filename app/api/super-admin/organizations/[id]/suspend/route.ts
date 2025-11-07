
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id } = params;
    const { isSuspended } = body;

    const organization = await prisma.organization.update({
      where: { id },
      data: { 
        isSuspended,
        suspensionReason: isSuspended ? 'Suspended by super admin' : null
      }
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error suspending organization:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
