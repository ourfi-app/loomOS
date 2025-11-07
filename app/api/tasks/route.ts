
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  createSuccessResponse,
  handleApiError,
  validateAuth,
  getQueryParams,
  logApiRequest
} from '@/lib/api-utils';
import { serverNotifications, logIntegrationEvent } from '@/lib/server-integration';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await validateAuth(request);
    logApiRequest('GET', '/api/tasks', { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email 
      },
    });

    if (!user) {
      return handleApiError(
        new Error('User not found'),
        'Failed to fetch user',
        request
      );
    }

    const searchParams = getQueryParams(request);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const favorite = searchParams.get('favorite');

    const where: any = {
      OR: [
        { userId: user.id },
        { assignedTo: user.id }
      ]
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (priority) {
      where.priority = priority.toUpperCase();
    }

    if (favorite === 'true') {
      where.isFavorite = true;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });

    return createSuccessResponse(tasks, { count: tasks.length });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch tasks', request);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', '/api/tasks', { userId: session?.user?.id });

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email 
      },
    });

    if (!user) {
      return handleApiError(
        new Error('User not found'),
        'Failed to fetch user',
        request
      );
    }

    const body = await request.json();

    const task = await prisma.task.create({
      data: {
        organizationId,
        title: body.title,
        description: body.description,
        status: body.status || 'TODO',
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        userId: user.id,
        assignedTo: body.assignedTo || null,
        category: body.category || 'general',
        tags: body.tags || [],
        isRecurring: body.isRecurring || false,
        recurrencePattern: body.recurrencePattern,
        reminderDate: body.reminderDate ? new Date(body.reminderDate) : null,
        isFavorite: body.isFavorite || false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Integration: Send notification if task is assigned to someone
    if (task.assignedTo && task.assignedTo !== user.id) {
      try {
        await serverNotifications.notifyTaskCreated(
          task.assignedTo,
          task.title,
          user.name || user.email || 'Someone',
          task.id,
          organizationId
        );

        logIntegrationEvent({
          type: 'TASK_CREATED',
          data: {
            taskId: task.id,
            title: task.title,
            assignedTo: task.assignedTo,
            createdById: user.id,
          },
        });
      } catch (notificationError) {
        console.error('[Integration] Failed to send task notification:', notificationError);
        // Don't fail the request if notifications fail
      }
    }

    return createSuccessResponse(task);
  } catch (error) {
    return handleApiError(error, 'Failed to create task', request);
  }
}
