
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listGoogleDriveFiles } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user?.role;

    // Only admins and board members can access Google Drive integration
    if (userRole !== 'ADMIN' && userRole !== 'BOARD_MEMBER') {
      return NextResponse.json(
        { error: 'Only admins and board members can access Google Drive' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get('folderId') || undefined;
    const pageToken = searchParams.get('pageToken') || undefined;

    const result = await listGoogleDriveFiles(folderId, 50, pageToken);

    return NextResponse.json(result);
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
    
    console.error('Google Drive list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list Google Drive files' },
      { status: 500 }
    );
  }
}
