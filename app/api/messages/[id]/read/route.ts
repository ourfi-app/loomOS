

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('POST', `/api/messages/${params.id}/read`, { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    const userId = (session.user as any).id;

    await prisma.messageRecipient.updateMany({
      where: {
        organizationId,
        messageId: params.id,
        userId,
      
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to mark message as read', request);
  }
}
