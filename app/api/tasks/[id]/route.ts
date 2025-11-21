// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  createSuccessResponse,
  handleApiError,
  validateAuth,
  logApiRequest
} from '@/lib/api-utils';
import { serverNotifications, logIntegrationEvent, getAdminUserIds } from '@/lib/server-integration';

export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await validateAuth(request);
    logApiRequest('GET', `/api/tasks/${params.id}`, { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    const task = await prisma.task.findUnique({
      where: {
        organizationId,
        id: params.id 
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

    if (!task) {
      const error: any = new Error('Task not found');
      error.code = 'P2025';
      throw error;
    }

    return createSuccessResponse(task);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch task', request);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('PUT', `/api/tasks/${params.id}`, { userId: session?.user?.id });

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    

    const updateData: any = {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      category: body.category,
      tags: body.tags,
      isRecurring: body.isRecurring,
      recurrencePattern: body.recurrencePattern,
      isFavorite: body.isFavorite
    };

    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }

    if (body.reminderDate !== undefined) {
      updateData.reminderDate = body.reminderDate ? new Date(body.reminderDate) : null;
    }

    if (body.assignedTo !== undefined) {
      updateData.assignedTo = body.assignedTo;
    }

    if (body.status === 'COMPLETED' && !body.completedAt) {
      updateData.completedAt = new Date();
    }

    const task = await prisma.task.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: updateData,
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

    // Integration: Notify about task completion
    try {
      if (body.status === 'COMPLETED' && task.user) {
        // Notify the task creator
        await serverNotifications.notifyTaskCompleted(
          task.user.id,
          task.title,
          session.user.name || session.user.email || 'Someone',
          task.id,
          organizationId
        );

        logIntegrationEvent({
          type: 'TASK_COMPLETED',
          data: {
            taskId: task.id,
            title: task.title,
            completedById: (session.user as any).id,
          },
        });
      } else {
        logIntegrationEvent({
          type: 'TASK_UPDATED',
          data: {
            taskId: task.id,
            title: task.title,
            status: task.status,
            userId: (session.user as any).id,
          },
        });
      }
    } catch (integrationError) {
      console.error('[Integration] Failed to send task update notifications:', integrationError);
    }

    return createSuccessResponse(task);
  } catch (error) {
    return handleApiError(error, 'Failed to update task', request);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('DELETE', `/api/tasks/${params.id}`, { userId: session?.user?.id });

    // Get task before deletion for integration logging
    const task = await prisma.task.findUnique({
      where: {
        organizationId,
        id: params.id,
      },
    });

    await prisma.task.delete({
      where: {
        organizationId,
        id: params.id 
      }
    });

    // Integration: Log task deletion
    if (task) {
      try {
        logIntegrationEvent({
          type: 'TASK_DELETED',
          data: {
            taskId: task.id,
            title: task.title,
            deletedById: (session.user as any).id,
          },
        });
      } catch (integrationError) {
        console.error('[Integration] Failed to log task deletion:', integrationError);
      }
    }

    return createSuccessResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Failed to delete task', request);
  }
}
