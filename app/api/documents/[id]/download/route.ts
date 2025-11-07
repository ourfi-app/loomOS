
import { NextRequest } from 'next/server';
import { validateAuth, createSuccessResponse, errorResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { prisma } from '@/lib/db';
import { getDownloadUrl } from '@/lib/s3';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    logApiRequest('GET', `/api/documents/${params.id}/download`);

    const auth = await validateAuth();
    const organizationId = await getCurrentOrganizationId();
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const userRole = auth.user.role;
    const fileId = params.id;

    // Get file metadata
    const file = await prisma.file.findUnique({
      where: {
        organizationId,
        id: fileId 
      },
    });

    if (!file) {
      return errorResponse('File not found', 404);
    }

    // Check permissions
    const hasPermission = checkFilePermission(file.permission, userRole);
    if (!hasPermission) {
      return errorResponse('You do not have permission to access this file', 403);
    }

    // Generate signed URL
    const downloadUrl = await getDownloadUrl(file.cloudStoragePath);

    return createSuccessResponse({
      url: downloadUrl,
      filename: file.originalName,
      mimeType: file.mimeType,
    });
  } catch (error) {
    return handleApiError(error, `GET /api/documents/${params.id}/download`);
  }
}

function checkFilePermission(filePermission: string, userRole?: string): boolean {
  if (!userRole) return false;

  switch (filePermission) {
    case 'PUBLIC':
      return true;
    case 'RESIDENTS_ONLY':
      return ['ADMIN', 'BOARD_MEMBER', 'RESIDENT'].includes(userRole);
    case 'BOARD_ONLY':
      return ['ADMIN', 'BOARD_MEMBER'].includes(userRole);
    case 'ADMIN_ONLY':
      return userRole === 'ADMIN';
    default:
      return false;
  }
}
