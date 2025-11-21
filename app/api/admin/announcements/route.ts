
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { serverNotifications, logIntegrationEvent, getAllResidentUserIds } from '@/lib/server-integration';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const user = session.user as any;

    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const organizationId = await getCurrentOrganizationId();
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const user = session.user as any;

    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { title, content, priority, targetRole } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        organizationId,
        title,
        content,
        priority: priority || 'normal',
        targetRole: targetRole || null,
        authorId: user.id,
        isActive: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Integration: Send notifications to affected users
    try {
      let targetUserIds: string[];
      if (targetRole) {
        const targetUsers = await prisma.user.findMany({
          where: {
            organizationId,
            role: targetRole,
            isActive: true,
          },
          select: { id: true }
        });
        targetUserIds = targetUsers.map(u => u.id);
      } else {
        targetUserIds = await getAllResidentUserIds(organizationId);
      }

      if (targetUserIds.length > 0) {
        // Use standardized notification service
        await serverNotifications.notifyAnnouncementCreated(
          announcement.author.name || announcement.author.email || 'Admin',
          title,
          announcement.id,
          organizationId
        );
        
        // Log integration event
        logIntegrationEvent({
          type: 'ANNOUNCEMENT_CREATED',
          data: {
            announcementId: announcement.id,
            title,
            priority,
            authorId: user.id,
          },
        });
      }
    } catch (notificationError) {
      console.error('[Integration] Failed to send notifications:', notificationError);
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
