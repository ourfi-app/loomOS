import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, errorResponse, handleApiError, logApiRequest, createSuccessResponse } from '@/lib/api-utils';
import { uploadFile } from '@/lib/s3';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    logApiRequest('POST', '/api/community-posts/upload-image');

    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return errorResponse(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
        400
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(
        `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        400
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3FileName = `community-posts/${organizationId}/${timestamp}-${sanitizedName}`;

    // Upload to S3
    const imageUrl = await uploadFile(buffer, s3FileName, file.type);

    return createSuccessResponse({
      imageUrl,
      filename: sanitizedName,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to upload image', request);
  }
}
