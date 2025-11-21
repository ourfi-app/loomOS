import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { sendChatMessageSchema } from '@/lib/validation-schemas';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// GET - Fetch chat messages
export async function GET(req: NextRequest) {
  try {
    const session = await validateAuth(req);
    
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id },
      ],
    };

    if (conversationId) {
      where.conversationId = conversationId;
    }

    const messages = await prisma.message.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return createSuccessResponse(messages, { count: messages.length });
  } catch (error) {
    console.error('[API Error] GET chat error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// POST - Send a chat message
export async function POST(req: NextRequest) {
  try {
    const session = await validateAuth(req);
    
    const body = await req.json();
    const validatedData = sendChatMessageSchema.parse(body);

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId: validatedData.recipientId || '',
        conversationId: validatedData.conversationId,
        content: validatedData.message,
        // Add other fields as needed
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return createSuccessResponse(message, { count: 1 });
  } catch (error) {
    console.error('[API Error] POST chat error:', error);
    
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        'Validation failed: ' + error.errors.map(e => e.message).join(', '),
        400,
        'VALIDATION_ERROR',
        error.errors
      );
    }
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
