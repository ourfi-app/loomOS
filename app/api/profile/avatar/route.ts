
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadFile } from '@/lib/s3';
import { getBucketConfig } from '@/lib/aws-config';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  successResponse,
  errorResponse,
  logApiCall,
  ApiError
} from '@/lib/api-utils';
import { validateImageFile } from '@/lib/utils/file-validation';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Validate authentication
    const session = await validateAuthentication(request);

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    userId = session.user.id;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      throw new ApiError('No file provided', 400);
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new ApiError('File size must be less than 5MB', 400);
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate file type with magic number validation for enhanced security
    // This prevents file type spoofing by checking the actual file signature
    const validation = await validateImageFile(file, buffer);
    if (!validation.isValid) {
      throw new ApiError(
        validation.error || 'Invalid image file',
        400
      );
    }

    const { folderPrefix } = getBucketConfig();
    const fileName = `${folderPrefix}avatars/${userId}-${Date.now()}-${file.name}`;

    // Upload to S3
    const cloudStoragePath = await uploadFile(buffer, fileName);

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: {
        organizationId,
        id: userId 
      },
      data: { image: cloudStoragePath },
      select: {
        id: true,
        image: true
      }
    });

    logApiCall('POST', '/api/profile/avatar', 200, Date.now() - startTime, userId);
    return successResponse(
      { image: updatedUser.image },
      'Avatar updated successfully'
    );

  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : 'Failed to upload avatar';
    
    logApiCall('POST', '/api/profile/avatar', status, Date.now() - startTime, userId, message);
    return errorResponse(message, status);
  }

  } catch (error) {
    console.error('[API Error] POST error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
