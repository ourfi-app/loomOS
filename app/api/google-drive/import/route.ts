
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { downloadGoogleDriveFile } from '@/lib/google-drive';
import { uploadFile } from '@/lib/s3';
import { FOLDER_PERMISSIONS } from '@/lib/types';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user?.role;
    const userId = session.user?.id;
    const organizationId = await getCurrentOrganizationId();

    // Only admins and board members can import from Google Drive
    if (userRole !== 'ADMIN' && userRole !== 'BOARD_MEMBER') {
      return NextResponse.json(
        { error: 'Only admins and board members can import files' },
        { status: 403 }
      );
    }

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { fileId, fileName, mimeType, folder, description } = body;

    if (!fileId || !fileName || !folder) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!FOLDER_PERMISSIONS[folder]) {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
    }

    // Check if user has permission to upload to this folder
    const folderInfo = FOLDER_PERMISSIONS[folder];
    if (!folderInfo) {
      return NextResponse.json(
        { error: 'Invalid folder configuration' },
        { status: 400 }
      );
    }
    if (userRole && !folderInfo.allowedRoles.some(role => role === userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to upload to this folder' },
        { status: 403 }
      );
    }

    // Download file from Google Drive
    const { data: fileBuffer, filename: originalFilename, mimeType: fileMimeType } = 
      await downloadGoogleDriveFile(fileId);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = (originalFilename || fileName).replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3FileName = `documents/${folder}/${timestamp}-${sanitizedName}`;

    // Upload to S3
    const cloudStoragePath = await uploadFile(
      fileBuffer,
      s3FileName,
      fileMimeType || mimeType || 'application/octet-stream'
    );

    // Save file metadata to database
    const fileRecord = await prisma.file.create({
      data: {
        organizationId,
        filename: sanitizedName,
        originalName: originalFilename || fileName,
        mimeType: fileMimeType || mimeType || 'application/octet-stream',
        size: BigInt(fileBuffer.length),
        cloudStoragePath,
        folder,
        permission: folderInfo.permission,
        uploadedById: userId!,
        description: description || `Imported from Google Drive`,
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

    return NextResponse.json({
      success: true,
      file: serializedFile,
    });
  } catch (error: any) {
    // Handle Google Drive not configured gracefully
    if (error.message === 'GOOGLE_DRIVE_NOT_CONFIGURED') {
      return NextResponse.json(
        { 
          error: 'Google Drive integration is not configured',
          notConfigured: true 
        },
        { status: 503 }
      );
    }
    
    console.error('Google Drive import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import file from Google Drive' },
      { status: 500 }
    );
  }
}
