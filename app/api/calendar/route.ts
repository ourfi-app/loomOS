import { NextResponse } from 'next/server';
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
}

// POST create a new event
export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await validateAuthentication();
    const organizationId = await getCurrentOrganizationId();

    // Parse request body
    const body = await req.json();

    // Validate required fields
    validateRequiredFields(body, ['title', 'startDate', 'endDate']);

    // Create event
    const event = await prisma.calendarEvent.create({
      data: {
        organizationId,
        userId: user.id,
        title: body.title,
        description: body.description,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        startTime: body.startTime,
        endTime: body.endTime,
        isAllDay: body.isAllDay || false,
        type: body.type || 'EVENT',
        color: body.color || 'from-blue-500 to-blue-600',
        attendees: body.attendees || [],
        attendeeCount: body.attendeeCount,
        isRecurring: body.isRecurring || false,
        recurrence: body.recurrence || 'NONE',
        recurrenceEnd: body.recurrenceEnd ? new Date(body.recurrenceEnd) : null,
        reminders: body.reminders || [],
        isPrivate: body.isPrivate || false,
        isFavorite: body.isFavorite || false,
        category: body.category || 'personal',
      },
    });

    // Integration: Send notification if event has attendees
    if (body.attendees && Array.isArray(body.attendees) && body.attendees.length > 0) {
      try {
        const attendeeIds = body.attendees
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
}

