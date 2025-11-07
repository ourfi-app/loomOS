import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  logApiCall,
  successResponse,
  errorResponse,
  ApiError,
} from '@/lib/api-utils';
import { serverNotifications, logIntegrationEvent } from '@/lib/server-integration';

// GET a single event by ID
export const dynamic = 'force-dynamic';
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await validateAuthentication();
    const organizationId = await getCurrentOrganizationId();

    const { id } = await params;

    // Fetch event with ownership verification
    const event = await prisma.calendarEvent.findFirst({
      where: {
        organizationId,
        id,
        userId: user.id,
      
      },
    });

    if (!event) {
      throw new ApiError('Event not found', 404);
    }

    logApiCall('GET', `/api/calendar/${id}`, 200, Date.now() - startTime, user.id);
    return successResponse(event, 'Event retrieved successfully');
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof ApiError) {
      logApiCall('GET', `/api/calendar/${(await params).id}`, error.statusCode, duration, undefined, error.message);
      return errorResponse(error.message, error.statusCode);
    }
    logApiCall('GET', `/api/calendar/${(await params).id}`, 500, duration, undefined, (error as Error).message);
    return errorResponse('Failed to fetch event', 500);
  }
}

// PUT update an event
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await validateAuthentication();
    const organizationId = await getCurrentOrganizationId();

    const { id } = await params;
    const body = await req.json();

    // Verify ownership
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        organizationId,
        id,
        userId: user.id,
      
      },
    });

    if (!existingEvent) {
      throw new ApiError('Event not found or you do not have permission to update it', 404);
    }

    // Build update data
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    if (body.startTime !== undefined) updateData.startTime = body.startTime;
    if (body.endTime !== undefined) updateData.endTime = body.endTime;
    if (body.isAllDay !== undefined) updateData.isAllDay = body.isAllDay;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.attendees !== undefined) updateData.attendees = body.attendees;
    if (body.attendeeCount !== undefined) updateData.attendeeCount = body.attendeeCount;
    if (body.isRecurring !== undefined) updateData.isRecurring = body.isRecurring;
    if (body.recurrence !== undefined) updateData.recurrence = body.recurrence;
    if (body.recurrenceEnd !== undefined) {
      updateData.recurrenceEnd = body.recurrenceEnd ? new Date(body.recurrenceEnd) : null;
    }
    if (body.reminders !== undefined) updateData.reminders = body.reminders;
    if (body.isCancelled !== undefined) updateData.isCancelled = body.isCancelled;
    if (body.isPrivate !== undefined) updateData.isPrivate = body.isPrivate;
    if (body.isFavorite !== undefined) updateData.isFavorite = body.isFavorite;
    if (body.category !== undefined) updateData.category = body.category;

    // Update event
    const event = await prisma.calendarEvent.update({
      where: {
        organizationId, id 
      },
      data: updateData,
    });

    // Integration: Notify attendees if event was updated
    try {
      if (existingEvent.attendees && Array.isArray(existingEvent.attendees)) {
        const attendeeIds = existingEvent.attendees
          .filter((a: any) => a.userId && a.userId !== user.id)
          .map((a: any) => a.userId);

        if (attendeeIds.length > 0) {
          await serverNotifications.notifyEventUpdated(
            attendeeIds,
            event.title,
            user.name || user.email || 'Someone',
            event.id,
            organizationId
          );

          logIntegrationEvent({
            type: 'EVENT_UPDATED',
            data: {
              eventId: event.id,
              title: event.title,
              userId: user.id,
            },
          });
        }
      }
    } catch (notificationError) {
      console.error('[Integration] Failed to send event update notifications:', notificationError);
    }

    logApiCall('PUT', `/api/calendar/${id}`, 200, Date.now() - startTime, user.id);
    return successResponse(event, 'Event updated successfully');
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof ApiError) {
      logApiCall('PUT', `/api/calendar/${(await params).id}`, error.statusCode, duration, undefined, error.message);
      return errorResponse(error.message, error.statusCode);
    }
    logApiCall('PUT', `/api/calendar/${(await params).id}`, 500, duration, undefined, (error as Error).message);
    return errorResponse('Failed to update event', 500);
  }
}

// DELETE an event
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await validateAuthentication();
    const organizationId = await getCurrentOrganizationId();

    const { id } = await params;

    // Verify ownership
    const event = await prisma.calendarEvent.findFirst({
      where: {
        organizationId,
        id,
        userId: user.id,
      
      },
    });

    if (!event) {
      throw new ApiError('Event not found or you do not have permission to delete it', 404);
    }

    // Delete event
    await prisma.calendarEvent.delete({
      where: {
        organizationId, id 
      },
    });

    // Integration: Log event deletion
    try {
      logIntegrationEvent({
        type: 'EVENT_DELETED',
        data: {
          eventId: event.id,
          title: event.title,
          deletedById: user.id,
        },
      });
    } catch (notificationError) {
      console.error('[Integration] Failed to log event deletion:', notificationError);
    }

    logApiCall('DELETE', `/api/calendar/${id}`, 200, Date.now() - startTime, user.id);
    return successResponse(null, 'Event deleted successfully');
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof ApiError) {
      logApiCall('DELETE', `/api/calendar/${(await params).id}`, error.statusCode, duration, undefined, error.message);
      return errorResponse(error.message, error.statusCode);
    }
    logApiCall('DELETE', `/api/calendar/${(await params).id}`, 500, duration, undefined, (error as Error).message);
    return errorResponse('Failed to delete event', 500);
  }
}

