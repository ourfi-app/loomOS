
import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, errorResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { prisma } from '@/lib/db';
import { deleteFile } from '@/lib/s3';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { serverNotifications, logIntegrationEvent, getAllResidentUserIds } from '@/lib/server-integration';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    logApiRequest('DELETE', `/api/documents/${params.id}/delete`);

    const auth = await validateAuth();
    const organizationId = await getCurrentOrganizationId();
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const userRole = auth.user.role;
    const userId = auth.user.id;
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

    // Check permissions - only admins or the uploader can delete
    if (userRole !== 'ADMIN' && file.uploadedById !== userId) {
      return errorResponse('You do not have permission to delete this file', 403);
    }

    // Delete from S3
    await deleteFile(file.cloudStoragePath);

    // Delete from database
    await prisma.file.delete({
      where: {
        organizationId,
        id: fileId 
      },
    });

    // Integration: Notify users about document deletion
    try {
      await serverNotifications.notifyDocumentDeleted(
        auth.user.name || auth.user.email || 'Someone',
        file.filename,
        organizationId
      );

      logIntegrationEvent({
        type: 'DOCUMENT_DELETED',
        data: {
          documentId: file.id,
          filename: file.filename,
          userId: userId,
        },
      });
    } catch (integrationError) {
      console.error('[Integration] Failed to send document deletion notifications:', integrationError);
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    return handleApiError(error, `DELETE /api/documents/${params.id}/delete`);
  }
}
