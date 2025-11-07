
import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import {
  successResponse,
  errorResponse,
  logApiCall,
  ApiError
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get raw body and signature
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      throw new ApiError('Missing stripe-signature header', 400);
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      logApiCall('POST', '/api/payments/webhook', 400, Date.now() - startTime, undefined, `Signature verification failed: ${err.message}`);
      throw new ApiError(`Webhook signature verification failed: ${err.message}`, 400);
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const paymentId = session.metadata?.paymentId;
        const userId = session.metadata?.userId;
        const organizationId = session.metadata?.organizationId;

        if (paymentId && userId && organizationId) {
          // Update payment status
          await prisma.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.PAID,
              paidDate: new Date(),
            },
          });

          // Create success notification within organization
          const notification = await prisma.notification.create({
            data: {
              organizationId,
        title: 'Payment Successful',
              message: `Your payment of $${(session.amount_total || 0) / 100} has been processed successfully.`,
              type: 'EMAIL',
              sentAt: new Date(),
            },
          });

          await prisma.userNotification.create({
            data: {
              userId,
              organizationId,
              notificationId: notification.id,
              isRead: false,
            },
          });

          logApiCall('POST', '/api/payments/webhook', 200, Date.now() - startTime, userId, `Payment successful: ${session.id}`);
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        logApiCall('POST', '/api/payments/webhook', 200, Date.now() - startTime, undefined, `Checkout expired: ${session.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;
        const organizationId = paymentIntent.metadata?.organizationId;

        if (userId && organizationId) {
          // Create failure notification within organization
          const notification = await prisma.notification.create({
            data: {
              organizationId,
        title: 'Payment Failed',
              message: 'Your payment could not be processed. Please try again.',
              type: 'EMAIL',
              sentAt: new Date(),
            },
          });

          await prisma.userNotification.create({
            data: {
              userId,
              organizationId,
              notificationId: notification.id,
              isRead: false,
            },
          });

          logApiCall('POST', '/api/payments/webhook', 200, Date.now() - startTime, userId, `Payment failed: ${paymentIntent.id}`);
        }
        break;
      }

      default:
        logApiCall('POST', '/api/payments/webhook', 200, Date.now() - startTime, undefined, `Unhandled event: ${event.type}`);
    }

    return successResponse({ received: true }, 'Webhook processed successfully');

  } catch (error: any) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : 'Webhook handler failed';
    
    logApiCall('POST', '/api/payments/webhook', status, Date.now() - startTime, undefined, message);
    return errorResponse(message, status);
  }
}
