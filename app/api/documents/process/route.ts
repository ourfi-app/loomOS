
import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, successResponse, errorResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { prisma } from '@/lib/db';
import { processDocumentContent, getCategoryFromFilename } from '@/lib/document-processor';
import { uploadFile } from '@/lib/s3';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    logApiRequest('POST', '/api/documents/process');

    const auth = await validateAuth();
    const organizationId = await getCurrentOrganizationId();
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const userRole = auth.user.role;
    if (userRole !== 'ADMIN' && userRole !== 'BOARD_MEMBER') {
      return errorResponse('Insufficient permissions', 403);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return errorResponse('Only PDF files are supported', 400);
    }

    // Upload to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `documents/${Date.now()}-${file.name}`;
    const cloudStoragePath = await uploadFile(buffer, filename);

    // Create document record
    const document = await prisma.document.create({
      data: {
        organizationId,
        filename,
        originalName: file.name,
        cloudStoragePath,
        category: category || getCategoryFromFilename(file.name),
        status: 'processing'
      }
    });

    // Process PDF using LLM API
    const base64String = buffer.toString('base64');
    
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY || ""}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'file',
                file: {
                  filename: file.name,
                  file_data: `data:application/pdf;base64,${base64String}`
                }
              },
              {
                type: 'text',
                text: `Extract all text content from this PDF document. Return the text in a clean, readable format that preserves the structure and meaning of the document. Include all sections, paragraphs, and important content.`
              }
            ]
          }
        ],
        max_tokens: 16000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to process document: ${response.statusText}`);
    }

    const result = await response.json();
    const extractedText = result.choices?.[0]?.message?.content || '';

    if (!extractedText) {
      throw new Error('Failed to extract text from document');
    }

    // Process and chunk the document
    await processDocumentContent(extractedText, document.id);

    return NextResponse.json({ success: true, data: {
      documentId: document.id
    }, message: 'Document processed successfully' }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'POST /api/documents/process');
  }
}
