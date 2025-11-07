/**
 * Payment Service Interface
 *
 * This interface abstracts payment operations, allowing the application
 * to work with different payment providers (Stripe, etc.) without changing code.
 */

export interface PaymentCustomer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface PaymentPrice {
  id: string;
  amount: number;
  currency: string;
  interval?: 'day' | 'week' | 'month' | 'year';
  product: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  customerId?: string;
  status: 'open' | 'complete' | 'expired';
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  customerId?: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  items: SubscriptionItem[];
}

export interface SubscriptionItem {
  id: string;
  priceId: string;
  quantity: number;
}

export interface PaymentService {
  // Customer Management
  createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<PaymentCustomer>;
  getCustomer(customerId: string): Promise<PaymentCustomer>;
  updateCustomer(customerId: string, data: Partial<PaymentCustomer>): Promise<PaymentCustomer>;
  deleteCustomer(customerId: string): Promise<void>;

  // Checkout Sessions
  createCheckoutSession(params: {
    customerId?: string;
    priceId: string;
    quantity?: number;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<CheckoutSession>;

  // Payment Intents
  createPaymentIntent(params: {
    amount: number;
    currency: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent>;

  // Subscriptions
  createSubscription(params: {
    customerId: string;
    priceId: string;
    quantity?: number;
    metadata?: Record<string, string>;
  }): Promise<Subscription>;
  getSubscription(subscriptionId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string, immediate?: boolean): Promise<Subscription>;

  // Webhooks
  constructWebhookEvent(payload: string | Buffer, signature: string, secret: string): any;
}
