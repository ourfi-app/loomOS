// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest, getQueryParams } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('GET', '/api/messages', { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    const userId = (session.user as any).id;
    const searchParams = getQueryParams(request);
    const folder = searchParams.get('folder') || 'inbox';

    let messages: any[] = [];

    if (folder === 'inbox') {
      messages = await prisma.message.findMany({
        where: {
        organizationId,
        recipients: {
            some: {
              userId,
            
      },
          },
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
            where: {
        organizationId,
              userId,
            
      },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (folder === 'sent') {
      messages = await prisma.message.findMany({
        where: {
        organizationId,
        senderId: userId,
        
      },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          recipients: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (folder === 'starred') {
      messages = await prisma.message.findMany({
        where: {
        organizationId,
        recipients: {
            some: {
              userId,
              isStarred: true,
            
      },
          },
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
            where: {
        organizationId,
              userId,
            
      },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = [];
    }

    return createSuccessResponse({ messages }, { count: messages.length });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch messages', request);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', '/api/messages', { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const body = await request.json();
    
    // Validate input
    const { createMessageSchema } = await import('@/lib/validation-schemas');
    const validatedBody = createMessageSchema.parse(body);
    
    const { subject, body: messageBody, recipientIds, priority = 'NORMAL' } = validatedBody;

    const message = await prisma.message.create({
      data: {
        organizationId,
        subject,
        body: messageBody,
        senderId: userId,
        priority,
        sentAt: new Date(),
        recipients: {
          create: recipientIds.map((recipientId: string) => ({
            userId: recipientId,
          })),
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipients: true,
      },
    });

    // Integration: Send notifications to recipients
    try {
      const senderName = session.user?.name || 'A user';
      const notification = await prisma.notification.create({
        data: {
        organizationId,
        title: 'New Message',
          message: `${senderName} sent you a message: ${subject}`,
          type: priority === 'URGENT' ? 'BOTH' : 'EMAIL',
          isUrgent: priority === 'URGENT',
          recipients: {
            create: recipientIds.map((recipientId: string) => ({
              userId: recipientId,
              isRead: false
            }))
          }
        }
      });
    } catch (notificationError) {
      console.error('[Integration] Failed to send notifications:', notificationError);
      // Don't fail the request if notifications fail
    }

    return createSuccessResponse({ message });
  } catch (error) {
    return handleApiError(error, 'Failed to create message', request);
  }
}
