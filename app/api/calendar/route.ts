import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  validateRequiredFields,
  logApiCall,
  successResponse,
  errorResponse,
  ApiError,
} from '@/lib/api-utils';
import { serverNotifications, logIntegrationEvent } from '@/lib/server-integration';

// GET all events for the logged-in user
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await validateAuthentication();
    const organizationId = await getCurrentOrganizationId();
    
    logApiCall('GET', '/api/calendar', 200, Date.now() - startTime, user.id);

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {
      userId: user.id,
      isCancelled: false,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Fetch events
    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: [{ startDate: 'asc' }, { startTime: 'asc' }],
    });

    return successResponse(events, 'Events retrieved successfully');
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof ApiError) {
      logApiCall('GET', '/api/calendar', error.statusCode, duration, undefined, error.message);
      return errorResponse(error.message, error.statusCode);
    }
    logApiCall('GET', '/api/calendar', 500, duration, undefined, (error as Error).message);
    return errorResponse('Failed to fetch events', 500);
  }

  } catch (error) {
    console.error('[API Error] GET error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// POST create a new event
export async function POST(req: Request) {
  try {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await validateAuthentication();
    const organizationId = await getCurrentOrganizationId();

    // Parse and validate request body
    const body = await req.json();
    const { createCalendarEventSchema } = await import('@/lib/validation-schemas');
    const validatedBody = createCalendarEventSchema.parse(body);

    // Create event
    const event = await prisma.calendarEvent.create({
      data: {
        organizationId,
        userId: user.id,
        title: validatedBody.title,
        description: validatedBody.description,
        location: validatedBody.location,
        startDate: new Date(validatedBody.startDate),
        endDate: new Date(validatedBody.endDate),
        startTime: validatedBody.startTime,
        endTime: validatedBody.endTime,
        isAllDay: validatedBody.isAllDay || false,
        type: validatedBody.type || 'EVENT',
        color: validatedBody.color || 'from-blue-500 to-blue-600',
        attendees: validatedBody.attendees || [],
        attendeeCount: validatedBody.attendeeCount,
        isRecurring: validatedBody.isRecurring || false,
        recurrence: validatedBody.recurrence || 'NONE',
        recurrenceEnd: validatedBody.recurrenceEnd ? new Date(validatedBody.recurrenceEnd) : null,
        reminders: validatedBody.reminders || [],
        isPrivate: validatedBody.isPrivate || false,
        isFavorite: validatedBody.isFavorite || false,
        category: validatedBody.category || 'personal',
      },
    });

    // Integration: Send notification if event has attendees
    if (validatedBody.attendees && Array.isArray(validatedBody.attendees) && validatedBody.attendees.length > 0) {
      try {
        const attendeeIds = validatedBody.attendees
          .filter((a: any) => a.userId && a.userId !== user.id)
          .map((a: any) => a.userId);

        if (attendeeIds.length > 0) {
          await serverNotifications.notifyEventCreated(
            attendeeIds,
            event.title,
            user.name || user.email || 'Someone',
            event.id,
            organizationId
          );

          logIntegrationEvent({
            type: 'EVENT_CREATED',
            data: {
              eventId: event.id,
              title: event.title,
              startDate: event.startDate,
              createdById: user.id,
              attendees: attendeeIds,
            },
          });
        }
      } catch (notificationError) {
        console.error('[Integration] Failed to send event notifications:', notificationError);
        // Don't fail the request if notifications fail
      }
    }

    logApiCall('POST', '/api/calendar', 201, Date.now() - startTime, user.id);
    return successResponse(event, 'Event created successfully', 201);
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof ApiError) {
      logApiCall('POST', '/api/calendar', error.statusCode, duration, undefined, error.message);
      return errorResponse(error.message, error.statusCode);
    }
    logApiCall('POST', '/api/calendar', 500, duration, undefined, (error as Error).message);
    return errorResponse('Failed to create event', 500);
  }

  } catch (error) {
    console.error('[API Error] POST error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

