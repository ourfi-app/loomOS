
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { logIntegrationEvent } from '@/lib/server-integration';

// GET /api/notes/[id] - Get a specific note
export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('GET', `/api/notes/${params.id}`, { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    // Get user ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email 
      },
    });

    if (!user) {
      return handleApiError(
        new Error('User not found'),
        'Failed to fetch user',
        request
      );
    }

    // Fetch note with ownership verification
    const note = await prisma.note.findFirst({
      where: {
        organizationId,
        id: params.id,
        userId: user.id,
      
      },
    });

    if (!note) {
      const error: any = new Error('Note not found');
      error.code = 'P2025';
      throw error;
    }

    // Return success
    return createSuccessResponse(note);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch note', request);
  }
}

// PATCH /api/notes/[id] - Update a note
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('PATCH', `/api/notes/${params.id}`, { userId: session?.user?.id });

    // Get user ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email 
      },
    });

    if (!user) {
      return handleApiError(
        new Error('User not found'),
        'Failed to fetch user',
        request
      );
    }

    // Parse request body
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { title, content, category, color, tags, isFavorite, isArchived, isPinned } = body;

    // Verify ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        organizationId,
        id: params.id,
        userId: user.id,
      
      },
    });

    if (!existingNote) {
      const error: any = new Error('Note not found');
      error.code = 'P2025';
      throw error;
    }

    // Update note
    const note = await prisma.note.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(color !== undefined && { color }),
        ...(tags !== undefined && { tags }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(isArchived !== undefined && { isArchived }),
        ...(isPinned !== undefined && { isPinned }),
      },
    });

    // Integration: Log note update
    try {
      logIntegrationEvent({
        type: 'NOTE_UPDATED',
        data: {
          noteId: note.id,
          title: note.title,
          userId: user.id,
        },
      });
    } catch (integrationError) {
      console.error('[Integration] Failed to log note update:', integrationError);
    }

    // Return success
    return createSuccessResponse(note);
  } catch (error) {
    return handleApiError(error, 'Failed to update note', request);
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('DELETE', `/api/notes/${params.id}`, { userId: session?.user?.id });

    // Get user ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email 
      },
    });

    if (!user) {
      return handleApiError(
        new Error('User not found'),
        'Failed to fetch user',
        request
      );
    }

    // Verify ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        organizationId,
        id: params.id,
        userId: user.id,
      
      },
    });

    if (!existingNote) {
      const error: any = new Error('Note not found');
      error.code = 'P2025';
      throw error;
    }

    // Delete note
    await prisma.note.delete({
      where: {
        organizationId,
        id: params.id 
      },
    });

    // Integration: Log note deletion
    try {
      logIntegrationEvent({
        type: 'NOTE_DELETED',
        data: {
          noteId: existingNote.id,
          title: existingNote.title,
          deletedById: user.id,
        },
      });
    } catch (integrationError) {
      console.error('[Integration] Failed to log note deletion:', integrationError);
    }

    // Return success
    return createSuccessResponse({ message: 'Note deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Failed to delete note', request);
  }
}
