// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

/**
 * Send Message API
 * 
 * Handles sending messages to residents via email and internal messaging system.
 * 
 * POST /api/messages/send
 * Body:
 *   - recipientEmails: string[] - Array of recipient email addresses
 *   - subject: string - Message subject
 *   - body: string - Message body (plain text or HTML)
 *   - priority?: 'NORMAL' | 'HIGH' | 'URGENT' - Message priority
 *   - sendEmail?: boolean - Whether to send actual email (default: true)
 *   - template?: string - Optional email template to use
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest, withSecurity } from '@/lib/api-utils';
import { sendEmail, validateEmails, isEmailServiceConfigured } from '@/lib/email-service';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { serverNotifications, logIntegrationEvent } from '@/lib/server-integration';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    // Apply security middleware (CSRF + Rate Limiting) and Authentication
    const session = await withSecurity(request, { requireAuth: true });
    logApiRequest('POST', '/api/messages/send', { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    const userId = (session.user as any).id;
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    

    const {
      recipientEmails,
      subject,
      body: messageBody,
      priority = 'NORMAL',
      sendEmail: shouldSendEmail = true,
      template,
    } = body;

    // Validate inputs
    if (!recipientEmails || !Array.isArray(recipientEmails) || recipientEmails.length === 0) {
      return handleApiError(
        new Error('At least one recipient email is required'),
        'Failed to send message',
        request
      );
    }

    if (!subject || subject.trim() === '') {
      return handleApiError(
        new Error('Subject is required'),
        'Failed to send message',
        request
      );
    }

    if (!messageBody || messageBody.trim() === '') {
      return handleApiError(
        new Error('Message body is required'),
        'Failed to send message',
        request
      );
    }

    // Validate priority
    const validPriorities = ['NORMAL', 'HIGH', 'URGENT'];
    if (!validPriorities.includes(priority)) {
      return handleApiError(
        new Error('Invalid priority. Must be NORMAL, HIGH, or URGENT'),
        'Failed to send message',
        request
      );
    }

    // Validate email addresses
    const { valid: validEmails, invalid: invalidEmails } = validateEmails(recipientEmails);

    if (validEmails.length === 0) {
      return handleApiError(
        new Error(`No valid email addresses provided. Invalid: ${invalidEmails.join(', ')}`),
        'Failed to send message',
        request
      );
    }

    // Find users by email
    const recipients = await prisma.user.findMany({
      where: {
        organizationId,
        email: {
          in: validEmails,
        
      },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (recipients.length === 0) {
      return handleApiError(
        new Error('No recipients found in the system'),
        'Failed to send message',
        request
      );
    }

    // Create message in database
    const message = await prisma.message.create({
      data: {
        organizationId,
        subject: subject.trim(),
        body: messageBody.trim(),
        senderId: userId,
        status: 'SENT',
        priority,
        hasAttachments: false,
        sentAt: new Date(),
        recipients: {
          create: recipients.map(recipient => ({
            userId: recipient.id,
            type: 'TO',
            organizationId,
            isRead: false,
          })),
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Send actual emails if requested and SendGrid is configured
    const emailResults = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
      configured: isEmailServiceConfigured(),
    };

    if (shouldSendEmail && isEmailServiceConfigured()) {
      // Send emails to all recipients
      const emailPromises = recipients.map(recipient =>
        sendEmail({
          to: recipient.email,
          subject: subject.trim(),
          body: messageBody.trim(),
          priority,
          replyTo: session.user.email || undefined,
        })
      );

      const results = await Promise.allSettled(emailPromises);

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled' && result.value.success) {
          emailResults.sent++;
        } else {
          emailResults.failed++;
          const error = result.status === 'fulfilled'
            ? result.value.error
            : (result as any).reason?.message || 'Unknown error';
          const recipient = recipients[idx];
          if (recipient) {
            emailResults.errors.push(`${recipient.email}: ${error}`);
          }
        }
      });
    } else if (shouldSendEmail && !isEmailServiceConfigured()) {
      emailResults.errors.push(
        'Email service not configured. Messages saved to database but emails not sent. ' +
        'Please configure SENDGRID_API_KEY in environment variables.'
      );
    }

    // Determine overall status
    const allEmailsSent = shouldSendEmail 
      ? (emailResults.sent === recipients.length && isEmailServiceConfigured())
      : true; // If not sending emails, consider it successful

    // Integration: Notify recipients about new message
    try {
      const recipientIds = recipients.map(r => r.id);
      const senderUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      if (senderUser && recipientIds.length > 0) {
        await serverNotifications.notifyMessageReceived(
          recipientIds,
          subject.trim(),
          senderUser.name || senderUser.email || 'Someone',
          message.id,
          organizationId
        );

        logIntegrationEvent({
          type: 'MESSAGE_SENT',
          data: {
            messageId: message.id,
            recipients: recipientIds,
            subject: subject.trim(),
            senderId: userId,
          },
        });
      }
    } catch (notificationError) {
      console.error('[Integration] Failed to send message notifications:', notificationError);
    }

    return createSuccessResponse({
      success: true,
      message: {
        id: message.id,
        subject: message.subject,
        sentAt: message.sentAt,
        recipientCount: recipients.length,
      },
      emailResults: shouldSendEmail ? emailResults : null,
      warnings: [
        ...invalidEmails.length > 0 
          ? [`Invalid email addresses: ${invalidEmails.join(', ')}`] 
          : [],
        ...(!isEmailServiceConfigured() && shouldSendEmail)
          ? ['Email service not configured. Messages saved but emails not sent.']
          : [],
      ].filter(Boolean),
    });

  } catch (error) {
    return handleApiError(error, 'Failed to send message', request);
  }
}

// Get send message configuration
export async function GET(request: NextRequest) {
  try {
    // Apply security middleware (Rate Limiting only, CSRF skipped for GET) and Authentication
    const session = await withSecurity(request, { requireAuth: true });
    logApiRequest('GET', '/api/messages/send', { userId: session?.user?.id });

    return createSuccessResponse({
      configured: isEmailServiceConfigured(),
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@montrecott.com',
      fromName: process.env.SENDGRID_FROM_NAME || 'Montrecott Condo Association',
    });
  } catch (error) {
    return handleApiError(error, 'Failed to get configuration', request);
  }
}

