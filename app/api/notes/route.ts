
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest, getQueryParams } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

// GET /api/notes - Get all notes for the authenticated user
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('GET', '/api/notes', { userId: session?.user?.id });

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

    // Parse query parameters
    const searchParams = getQueryParams(request);
    const category = searchParams.get('category');
    const isArchived = searchParams.get('archived') === 'true';
    const isFavorite = searchParams.get('favorite') === 'true';

    // Build query filters
    const where: any = {
      userId: user.id,
      isArchived,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (isFavorite) {
      where.isFavorite = true;
    }

    // Fetch notes
    const notes = await prisma.note.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    // Return success
    return createSuccessResponse(notes, { count: notes.length });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch notes', request);
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', '/api/notes', { userId: session?.user?.id });

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

    // Parse and validate request body
    const body = await request.json();
    const { title, content, category, color, tags } = body;

    if (!title || !content) {
      return handleApiError(
        new Error('Title and content are required'),
        'Failed to create note',
        request
      );
    }

    // Create note
    const note = await prisma.note.create({
      data: {
        organizationId,
        userId: user.id,
        title,
        content,
        category: category || 'general',
        color: color || null,
        tags: tags || [],
      },
    });

    // Return success
    return createSuccessResponse(note);
  } catch (error) {
    return handleApiError(error, 'Failed to create note', request);
  }
}
