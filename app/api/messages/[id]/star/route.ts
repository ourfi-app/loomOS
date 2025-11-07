

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
    logApiRequest('POST', `/api/messages/${params.id}/star`, { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    const userId = (session.user as any).id;
    const body = await request.json();
    const { starred, isStarred } = body;
    
    // Support both 'starred' and 'isStarred' for backwards compatibility
    const starValue = starred !== undefined ? starred : isStarred;

    await prisma.messageRecipient.updateMany({
      where: {
        organizationId,
        messageId: params.id,
        userId,
      
      },
      data: {
        isStarred: starValue,
      },
    });

    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to toggle star', request);
  }
}
