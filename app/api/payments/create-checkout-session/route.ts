
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  validateRequiredFields,
  successResponse,
  errorResponse,
  logApiCall,
  ApiError
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Validate authentication
    const session = await validateAuthentication(request);
    userId = session.user.id;

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    // Parse request body
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { paymentId, amount, description } = body;

    // Validate required fields
    validateRequiredFields(body, ['amount']);

    // Validate amount
    if (!amount || amount <= 0) {
      throw new ApiError('Invalid amount: must be greater than 0', 400);
    }

    // Get origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'HOA Payment',
              description: `Payment for ${session.user.name} - Unit ${session.user.unitNumber || 'N/A'}`,
            },
            unit_amount: formatAmountForStripe(amount),
          },
          quantity: 1,
        },
      ],
      metadata: {
        paymentId: paymentId || '',
        userId: session.user.id,
        userEmail: session.user.email || '',
        unitNumber: session.user.unitNumber || '',
        organizationId: organizationId || '', // Include organization ID for webhook
      },
      customer_email: session.user.email || undefined,
      success_url: `${origin}/dashboard/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/payments?canceled=true`,
    });

    logApiCall('POST', '/api/payments/create-checkout-session', 200, Date.now() - startTime, userId);
    return successResponse(
      {
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
      },
      'Checkout session created successfully'
    );

  } catch (error: any) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : (error.message || 'Failed to create checkout session');
    
    logApiCall('POST', '/api/payments/create-checkout-session', status, Date.now() - startTime, userId, message);
    return errorResponse(message, status);
  }

  } catch (error) {
    console.error('[API Error] POST error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
