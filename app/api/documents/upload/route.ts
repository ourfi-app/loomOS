
import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, successResponse, errorResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { prisma } from '@/lib/db';
import { uploadFile } from '@/lib/s3';
import { FOLDER_PERMISSIONS } from '@/lib/types';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { serverNotifications, logIntegrationEvent, getAllResidentUserIds } from '@/lib/server-integration';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    logApiRequest('POST', '/api/documents/upload');

    const auth = await validateAuth();
    const organizationId = await getCurrentOrganizationId();
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const userRole = auth.user.role;
    const userId = auth.user.id;

    // Only admins and board members can upload
    if (userRole !== 'ADMIN' && userRole !== 'BOARD_MEMBER') {
      return errorResponse('Only admins and board members can upload documents', 403);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    if (!folder || !FOLDER_PERMISSIONS[folder]) {
      return errorResponse('Invalid folder', 400);
    }

    // Check if user has permission to upload to this folder
    const folderInfo = FOLDER_PERMISSIONS[folder];
    if (!folderInfo) {
      return errorResponse('Invalid folder configuration', 400);
    }
    if (userRole && !folderInfo.allowedRoles.includes(userRole)) {
      return errorResponse('You do not have permission to upload to this folder', 403);
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3FileName = `documents/${folder}/${timestamp}-${sanitizedName}`;

    // Upload to S3
    const cloudStoragePath = await uploadFile(buffer, s3FileName, file.type);

    // Save file metadata to database
    const fileRecord = await prisma.file.create({
      data: {
        organizationId,
        filename: sanitizedName,
        originalName: file.name,
        mimeType: file.type,
        size: BigInt(file.size),
        cloudStoragePath,
        folder,
        permission: folderInfo.permission,
        uploadedById: userId,
        description: description || null,
      },
      include: {
        uploadedBy: {
          select: {
            name: true,
            unitNumber: true,
          },
        },
      },
    });

    // Convert BigInt to Number for JSON serialization
    const serializedFile = {
      ...fileRecord,
      size: Number(fileRecord.size),
    };

    // Integration: Notify users about new document
    try {
      await serverNotifications.notifyDocumentUploaded(
        auth.user.name || auth.user.email || 'Someone',
        sanitizedName,
        fileRecord.id,
        organizationId
      );

      logIntegrationEvent({
        type: 'DOCUMENT_UPLOADED',
        data: {
          documentId: fileRecord.id,
          filename: sanitizedName,
          folder,
          uploadedById: userId,
        },
      });
    } catch (notificationError) {
      console.error('[Integration] Failed to send document upload notifications:', notificationError);
    }

    return NextResponse.json({ success: true, data: serializedFile, message: 'File uploaded successfully' }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/documents/upload');
  }
}
