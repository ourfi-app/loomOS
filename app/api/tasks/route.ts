
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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
    const { createTaskSchema } = await import('@/lib/validation-schemas');
    const validatedBody = createTaskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        organizationId,
        title: validatedBody.title,
        description: validatedBody.description,
        status: validatedBody.status || 'TODO',
        priority: validatedBody.priority || 'MEDIUM',
        dueDate: validatedBody.dueDate ? new Date(validatedBody.dueDate) : null,
        userId: user.id,
        assignedTo: validatedBody.assignedTo || null,
        category: validatedBody.category || 'general',
        tags: validatedBody.tags || [],
        isRecurring: validatedBody.isRecurring || false,
        recurrencePattern: validatedBody.recurrencePattern,
        reminderDate: validatedBody.reminderDate ? new Date(validatedBody.reminderDate) : null,
        isFavorite: validatedBody.isFavorite || false
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
