# Service Layer Migration Guide

This guide provides step-by-step instructions for migrating from legacy service implementations to the `@loomos/core` service abstraction layer.

## Table of Contents
1. [Setup Service Registry](#setup-service-registry)
2. [Email Service Migration](#email-service-migration)
3. [Storage Service Migration](#storage-service-migration)
4. [Payment Service Migration](#payment-service-migration)
5. [Testing](#testing)
6. [Common Pitfalls](#common-pitfalls)

---

## Setup Service Registry

### Step 1: Create Service Registry Configuration

Create a new file `lib/service-registry-config.ts`:

```typescript
import { ServiceRegistry } from '@loomos/core';
import { SendGridEmailService } from '@loomos/core/services/email/SendGridEmailService';
import { S3StorageService } from '@loomos/core/services/storage/S3StorageService';
import { StripePaymentService } from '@loomos/core/services/payment/StripePaymentService';
import { AnthropicAIService } from '@loomos/core/services/ai/AnthropicAIService';

let registry: ServiceRegistry | null = null;

export function getServiceRegistry(): ServiceRegistry {
  if (!registry) {
    registry = new ServiceRegistry();

    // Email Service Configuration
    const emailProvider = process.env.EMAIL_PROVIDER || 'sendgrid';
    if (emailProvider === 'sendgrid') {
      registry.registerEmailService(new SendGridEmailService({
        apiKey: process.env.SENDGRID_API_KEY || '',
        fromEmail: process.env.SENDGRID_FROM_EMAIL || '',
        fromName: process.env.SENDGRID_FROM_NAME || 'loomOS'
      }));
    }

    // Storage Service Configuration
    const storageProvider = process.env.STORAGE_PROVIDER || 's3';
    if (storageProvider === 's3') {
      registry.registerStorageService(new S3StorageService({
        bucket: process.env.AWS_BUCKET_NAME || '',
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
      }));
    }

    // Payment Service Configuration
    const paymentProvider = process.env.PAYMENT_PROVIDER || 'stripe';
    if (paymentProvider === 'stripe') {
      registry.registerPaymentService(new StripePaymentService({
        apiKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
      }));
    }

    // AI Service Configuration (optional)
    const aiProvider = process.env.AI_PROVIDER || 'anthropic';
    if (aiProvider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      registry.registerAIService(new AnthropicAIService({
        apiKey: process.env.ANTHROPIC_API_KEY
      }));
    }
  }

  return registry;
}
```

### Step 2: Update Environment Variables

Add to `.env`:

```env
# Service Layer Configuration
EMAIL_PROVIDER=sendgrid
STORAGE_PROVIDER=s3
PAYMENT_PROVIDER=stripe
AI_PROVIDER=anthropic

# SendGrid Configuration (existing)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=loomOS

# AWS S3 Configuration (existing)
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Stripe Configuration (existing)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Anthropic Configuration (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## Email Service Migration

### Before: Legacy Implementation

**File**: `app/api/messages/send/route.ts`

```typescript
import { sendEmail, validateEmails } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  // ... validation code ...

  const result = await sendEmail({
    to: recipient.email,
    subject: subject.trim(),
    body: messageBody.trim(),
    priority,
    replyTo: session.user.email || undefined,
  });

  if (!result.success) {
    throw new Error(result.error);
  }
}
```

### After: Service Layer Implementation

```typescript
import { getServiceRegistry } from '@/lib/service-registry-config';

export async function POST(request: NextRequest) {
  // ... validation code ...

  const services = getServiceRegistry();
  const emailService = services.getEmailService();

  try {
    const result = await emailService.send({
      to: recipient.email,
      subject: subject.trim(),
      html: messageBody.trim(),
      text: messageBody.trim(),
      replyTo: session.user.email || undefined,
    });

    console.log('Email sent:', result.messageId);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}
```

### Validation Migration

**Before**:
```typescript
import { validateEmails, isValidEmail } from '@/lib/email-service';

const { valid, invalid } = validateEmails(emailList);
```

**After**: Create a utility function
```typescript
// lib/email-utils.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  emails.forEach(email => {
    const trimmedEmail = email.trim();
    if (isValidEmail(trimmedEmail)) {
      valid.push(trimmedEmail);
    } else {
      invalid.push(trimmedEmail);
    }
  });

  return { valid, invalid };
}
```

---

## Storage Service Migration

### Before: Legacy Implementation

**File**: `app/api/documents/upload/route.ts`

```typescript
import { uploadFile } from '@/lib/s3';

export async function POST(request: NextRequest) {
  // ... file processing ...

  const s3FileName = `documents/${folder}/${timestamp}-${sanitizedName}`;
  const cloudStoragePath = await uploadFile(buffer, s3FileName, file.type);

  // Save to database
  const fileRecord = await prisma.file.create({
    data: {
      cloudStoragePath,
      // ...other fields
    }
  });
}
```

### After: Service Layer Implementation

```typescript
import { getServiceRegistry } from '@/lib/service-registry-config';

export async function POST(request: NextRequest) {
  // ... file processing ...

  const services = getServiceRegistry();
  const storageService = services.getStorageService();

  const s3FileName = `documents/${folder}/${timestamp}-${sanitizedName}`;

  const uploadResult = await storageService.upload(s3FileName, buffer, {
    contentType: file.type,
    metadata: {
      originalName: file.name,
      folder: folder,
      uploadedBy: userId
    }
  });

  // Save to database
  const fileRecord = await prisma.file.create({
    data: {
      cloudStoragePath: uploadResult.key,
      // ...other fields
    }
  });
}
```

### Download Migration

**Before**:
```typescript
import { getDownloadUrl } from '@/lib/s3';

export async function GET(request: NextRequest) {
  const downloadUrl = await getDownloadUrl(file.cloudStoragePath, 3600);
  return NextResponse.json({ url: downloadUrl });
}
```

**After**:
```typescript
import { getServiceRegistry } from '@/lib/service-registry-config';

export async function GET(request: NextRequest) {
  const services = getServiceRegistry();
  const storageService = services.getStorageService();

  const downloadUrl = await storageService.getSignedUrl(file.cloudStoragePath, 3600);
  return NextResponse.json({ url: downloadUrl });
}
```

### Delete Migration

**Before**:
```typescript
import { deleteFile } from '@/lib/s3';

export async function DELETE(request: NextRequest) {
  await deleteFile(file.cloudStoragePath);
  await prisma.file.delete({ where: { id: fileId } });
}
```

**After**:
```typescript
import { getServiceRegistry } from '@/lib/service-registry-config';

export async function DELETE(request: NextRequest) {
  const services = getServiceRegistry();
  const storageService = services.getStorageService();

  await storageService.delete(file.cloudStoragePath);
  await prisma.file.delete({ where: { id: fileId } });
}
```

---

## Payment Service Migration

### Before: Legacy Implementation

**File**: `app/api/payments/create-checkout-session/route.ts`

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Subscription',
        },
        unit_amount: 2999,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
  });

  return NextResponse.json({ sessionId: session.id });
}
```

### After: Service Layer Implementation

```typescript
import { getServiceRegistry } from '@/lib/service-registry-config';

export async function POST(request: NextRequest) {
  const services = getServiceRegistry();
  const paymentService = services.getPaymentService();

  const session = await paymentService.createCheckoutSession({
    amount: 2999,
    currency: 'usd',
    successUrl: `${process.env.NEXTAUTH_URL}/success`,
    cancelUrl: `${process.env.NEXTAUTH_URL}/cancel`,
    metadata: {
      userId: userId,
      plan: 'premium'
    }
  });

  return NextResponse.json({ sessionId: session.id });
}
```

### Webhook Migration

**Before**:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // Handle payment
  }
}
```

**After**:
```typescript
import { getServiceRegistry } from '@/lib/service-registry-config';

export async function POST(request: NextRequest) {
  const services = getServiceRegistry();
  const paymentService = services.getPaymentService();

  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  const event = await paymentService.constructWebhookEvent(body, signature);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Handle payment
  }
}
```

---

## Testing

### Unit Testing with Service Mocks

Create mock services for testing:

```typescript
// __mocks__/service-registry.ts
import { ServiceRegistry } from '@loomos/core';
import { EmailService, EmailMessage, EmailResult } from '@loomos/core/services/email/EmailService';

export class MockEmailService implements EmailService {
  public sentEmails: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<EmailResult> {
    this.sentEmails.push(message);
    return {
      messageId: 'mock-message-id',
      accepted: Array.isArray(message.to) ? message.to : [message.to],
      rejected: []
    };
  }

  async sendBatch(messages: EmailMessage[]): Promise<EmailResult[]> {
    return messages.map(msg => this.send(msg));
  }

  async sendTemplate(
    to: string | string[],
    templateId: string,
    variables: Record<string, any>
  ): Promise<EmailResult> {
    return this.send({
      to,
      subject: `Template ${templateId}`,
      text: JSON.stringify(variables)
    });
  }
}

export function createMockServiceRegistry(): ServiceRegistry {
  const registry = new ServiceRegistry();
  registry.registerEmailService(new MockEmailService());
  // Register other mock services...
  return registry;
}
```

### Test Example

```typescript
// app/api/messages/__tests__/send.test.ts
import { createMockServiceRegistry } from '@/__mocks__/service-registry';

describe('POST /api/messages/send', () => {
  it('should send email via service layer', async () => {
    const mockRegistry = createMockServiceRegistry();

    // Override global registry with mock
    jest.mock('@/lib/service-registry-config', () => ({
      getServiceRegistry: () => mockRegistry
    }));

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    const emailService = mockRegistry.getEmailService() as MockEmailService;
    expect(emailService.sentEmails).toHaveLength(1);
    expect(emailService.sentEmails[0].subject).toBe('Test Message');
  });
});
```

---

## Common Pitfalls

### 1. Forgetting to Initialize Registry

**Problem**:
```typescript
// This will throw an error if registry not initialized
const services = getServiceRegistry();
```

**Solution**: Always ensure environment variables are set before calling `getServiceRegistry()`.

### 2. Different API Signatures

**Problem**: Legacy and new services have slightly different APIs

**Legacy**:
```typescript
sendEmail({ to, subject, body, priority })
```

**New**:
```typescript
emailService.send({ to, subject, html, text, replyTo })
```

**Solution**: Review the interface definitions and adjust parameters accordingly.

### 3. Error Handling Differences

**Legacy**: Returns `{ success: boolean, error?: string }`

**New**: Throws exceptions

**Solution**: Wrap service calls in try-catch:
```typescript
try {
  await emailService.send(message);
} catch (error) {
  console.error('Email failed:', error);
  // Handle error
}
```

### 4. Missing Environment Variables

**Problem**: Services fail silently when env vars missing

**Solution**: Add validation:
```typescript
export function validateServiceConfig(): void {
  const required = [
    'EMAIL_PROVIDER',
    'SENDGRID_API_KEY',
    'AWS_REGION',
    'AWS_BUCKET_NAME'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Call at app startup
validateServiceConfig();
```

---

## Verification Checklist

After migrating each service:

### Email Service
- [ ] Emails are sent successfully
- [ ] Email templates work correctly
- [ ] Error handling catches failures
- [ ] Tests pass with mock service
- [ ] Delivery confirmed in email provider dashboard

### Storage Service
- [ ] Files upload successfully
- [ ] Download URLs work and expire correctly
- [ ] File deletion removes files from storage
- [ ] Metadata is preserved
- [ ] Tests pass with mock storage

### Payment Service
- [ ] Checkout sessions created successfully
- [ ] Webhooks processed correctly
- [ ] Payments recorded in database
- [ ] Stripe dashboard shows correct transactions
- [ ] Tests pass with mock payment service

---

## Rollback Procedure

If issues occur after migration:

1. **Immediate Rollback**:
   ```typescript
   // Temporarily restore legacy import
   import { sendEmail } from '@/lib/email-service';
   // import { getServiceRegistry } from '@/lib/service-registry-config'; // Comment out
   ```

2. **Feature Flag Approach**:
   ```typescript
   const USE_NEW_SERVICE_LAYER = process.env.USE_NEW_SERVICE_LAYER === 'true';

   if (USE_NEW_SERVICE_LAYER) {
     const services = getServiceRegistry();
     await services.getEmailService().send(message);
   } else {
     await sendEmail(legacyOptions);
   }
   ```

3. **Monitor Logs**: Check for increased error rates

4. **Verify Metrics**: Compare before/after metrics

---

## Next Steps

1. Start with **Email Service** (lowest risk)
2. Deploy to staging and test thoroughly
3. Monitor for 24 hours
4. Progress to **Storage Service**
5. Finally migrate **Payment Service** (highest risk)
6. Remove legacy code after 2 weeks of stable operation

---

## Support

If you encounter issues during migration:
1. Check the `@loomos/core` README for interface documentation
2. Review test files for usage examples
3. Create an issue in the repository with migration details
4. Contact the development team

Good luck with your migration! 🚀
