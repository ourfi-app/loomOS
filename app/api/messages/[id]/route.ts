// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types


import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, createErrorResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('GET', `/api/messages/${params.id}`, { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    const userId = (session.user as any).id;
    const message = await prisma.message.findFirst({
      where: {
        organizationId,
        id: params.id,
        OR: [
          { senderId: userId 
      },
          {
            recipients: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        attachments: true,
      },
    });

    if (!message) {
      return createErrorResponse('Message not found', 404, 'NOT_FOUND');
    }

    return createSuccessResponse({ message });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch message', request);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('DELETE', `/api/messages/${params.id}`, { userId: session?.user?.id });

    const userId = (session.user as any).id;

    // Check if user is sender or recipient
    const message = await prisma.message.findFirst({
      where: {
        organizationId,
        id: params.id,
        OR: [
          { senderId: userId 
      },
          {
            recipients: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    });

    if (!message) {
      return createErrorResponse('Message not found', 404, 'NOT_FOUND');
    }

    // If user is recipient, just remove their recipient record
    if (message.senderId !== userId) {
      await prisma.messageRecipient.deleteMany({
        where: {
        organizationId,
        messageId: params.id,
          userId,
        
      },
      });
    } else {
      // If user is sender, delete the entire message
      await prisma.message.delete({
        where: {
        organizationId,
        id: params.id,
        
      },
      });
    }

    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete message', request);
  }
}
