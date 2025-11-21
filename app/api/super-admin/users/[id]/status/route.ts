
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { id } = params;
    const { isActive } = body;

    // Prevent deactivating yourself
    if (id === session.user.id && !isActive) {
      return NextResponse.json(
        { message: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
