import Stripe from 'stripe';
import {
  PaymentService,
  PaymentCustomer,
  CheckoutSession,
  PaymentIntent,
  Subscription
} from './PaymentService';
import { PaymentConfig } from '../config/ServiceConfig';

/**
 * Stripe Payment Service Implementation
 *
 * Implements the PaymentService interface using Stripe.
 */
export class StripePaymentService implements PaymentService {
  private stripe: Stripe;

  constructor(config: PaymentConfig) {
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2025-10-29.clover' as any
    });
  }

  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<PaymentCustomer> {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata
    });

    return {
      id: customer.id,
      email: customer.email!,
      name: customer.name || undefined,
      metadata: customer.metadata
    };
  }

  async getCustomer(customerId: string): Promise<PaymentCustomer> {
    const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;

    return {
      id: customer.id,
      email: customer.email!,
      name: customer.name || undefined,
      metadata: customer.metadata
    };
  }

  async updateCustomer(customerId: string, data: Partial<PaymentCustomer>): Promise<PaymentCustomer> {
    const customer = await this.stripe.customers.update(customerId, {
      email: data.email,
      name: data.name,
      metadata: data.metadata
    });

    return {
      id: customer.id,
      email: customer.email!,
      name: customer.name || undefined,
      metadata: customer.metadata
    };
  }

  async deleteCustomer(customerId: string): Promise<void> {
    await this.stripe.customers.del(customerId);
  }

  async createCheckoutSession(params: {
    customerId?: string;
    priceId: string;
    quantity?: number;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      customer: params.customerId,
      line_items: [
        {
          price: params.priceId,
          quantity: params.quantity || 1
        }
      ],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata
    });

    return {
      id: session.id,
      url: session.url!,
      customerId: session.customer as string,
      status: session.status as any
    };
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    const intent = await this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      customer: params.customerId,
      metadata: params.metadata
    });

    return {
      id: intent.id,
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status as any,
      customerId: intent.customer as string
    };
  }

  async createSubscription(params: {
    customerId: string;
    priceId: string;
    quantity?: number;
    metadata?: Record<string, string>;
  }): Promise<Subscription> {
    const subscription = await this.stripe.subscriptions.create({
      customer: params.customerId,
      items: [
        {
          price: params.priceId,
          quantity: params.quantity || 1
        }
      ],
      metadata: params.metadata
    });

    return this.mapStripeSubscription(subscription);
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    return this.mapStripeSubscription(subscription);
  }

  async cancelSubscription(subscriptionId: string, immediate = false): Promise<Subscription> {
    if (immediate) {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return this.mapStripeSubscription(subscription);
    } else {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
      return this.mapStripeSubscription(subscription);
    }
  }

  constructWebhookEvent(payload: string | Buffer, signature: string, secret: string): any {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  private mapStripeSubscription(sub: Stripe.Subscription): Subscription {
    const subscription = sub as any;
    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status as any,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      items: subscription.items.data.map((item: any) => ({
        id: item.id,
        priceId: item.price.id,
        quantity: item.quantity || 1
      }))
    };
  }
}
