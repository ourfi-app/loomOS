
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { validateAuth, createSuccessResponse, errorResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { searchDocumentChunks } from '@/lib/document-processor';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    logApiRequest('POST', '/api/documents/search');

    const auth = await validateAuth();
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const { query, categories, limit } = await request.json();

    if (!query) {
      return errorResponse('Query is required', 400);
    }

    const results = await searchDocumentChunks(query, {
      limit: limit || 5,
      categories
    });

    return createSuccessResponse({
      results: results.map(item => ({
        content: item.chunk.content,
        documentName: item.chunk.documentName,
        category: item.chunk.category,
        relevance: item.relevance
      }))
    });

  } catch (error) {
    return handleApiError(error, 'POST /api/documents/search');
  }
}
