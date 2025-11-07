# loomOS Service Abstraction Layer

This guide shows how to use the new service abstraction layer in your application.

## What Changed?

Previously, you were importing AWS S3, Stripe, and SendGrid directly in your code. Now, all external services are abstracted through the `@loomos/core` package.

**Benefits:**
- **Vendor Independence**: Switch providers by changing environment variables
- **Easier Testing**: Mock services easily
- **Type Safety**: Full TypeScript support
- **Consistency**: Unified interface across all services

## Quick Migration Guide

### 1. Initialize Services (One Time)

Add this to your root layout or `_app.tsx`:

```typescript
// app/layout.tsx
import { ServiceRegistry, loadServiceConfig } from '@loomos/core';

// Initialize once at startup
if (!ServiceRegistry.isInitialized()) {
  ServiceRegistry.initialize(loadServiceConfig());
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2. Update Your Environment Variables

Your existing `.env` already has most of these! Just add the provider selections:

```env
# Storage - Choose provider (defaults to aws-s3)
STORAGE_PROVIDER=aws-s3
STORAGE_BUCKET=${AWS_BUCKET_NAME}
STORAGE_REGION=${AWS_REGION}
STORAGE_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
STORAGE_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

# Email - Choose provider (defaults to sendgrid)
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=${SENDGRID_API_KEY}
EMAIL_FROM=${SENDGRID_FROM_EMAIL}

# Payment - Stripe (already configured!)
# No changes needed - STRIPE_* vars work as-is

# AI - Optional (set to 'none' if not using)
AI_PROVIDER=none
```

### 3. Migration Examples

#### Storage (S3)

**Before:**
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

await s3.send(new PutObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: 'uploads/file.pdf',
  Body: buffer
}));
```

**After:**
```typescript
import { ServiceRegistry } from '@loomos/core';

const storage = ServiceRegistry.get().storage;

await storage.upload('uploads/file.pdf', buffer, {
  contentType: 'application/pdf'
});
```

#### Email (SendGrid)

**Before:**
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: 'user@example.com',
  from: process.env.SENDGRID_FROM_EMAIL!,
  subject: 'Welcome',
  html: '<p>Welcome!</p>'
});
```

**After:**
```typescript
import { ServiceRegistry } from '@loomos/core';

const email = ServiceRegistry.get().email;

await email.send({
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<p>Welcome!</p>'
});
```

#### Payment (Stripe)

**Before:**
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const customer = await stripe.customers.create({
  email: 'user@example.com'
});
```

**After:**
```typescript
import { ServiceRegistry } from '@loomos/core';

const payment = ServiceRegistry.get().payment;

const customer = await payment.createCustomer('user@example.com');
```

### 4. Using in React Components

```typescript
import { useStorage, useEmail, usePayment } from '@loomos/core';

function MyComponent() {
  const storage = useStorage();
  const email = useEmail();
  const payment = usePayment();

  async function handleUpload(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await storage.upload(`uploads/${file.name}`, buffer, {
      contentType: file.type
    });

    console.log('Uploaded:', result.url);
  }

  return <div>...</div>;
}
```

## Switching Providers

Want to switch from AWS S3 to MinIO? Just change your `.env`:

```env
STORAGE_PROVIDER=minio
STORAGE_ENDPOINT=http://localhost:9000
STORAGE_BUCKET=my-bucket
```

Want to switch from SendGrid to Resend?

```env
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_xxxxx
```

**No code changes needed!** 🎉

## Files to Update

Here are the files that currently use external services directly:

### Storage (S3)
- `lib/s3.ts` - Replace with `ServiceRegistry.get().storage`
- Any API routes using S3 for document uploads

### Email (SendGrid)
- `lib/email.ts` or wherever SendGrid is initialized
- Any API routes sending emails

### Payment (Stripe)
- `lib/stripe.ts` or wherever Stripe is initialized
- Any API routes handling payments

## Testing

The service layer makes testing much easier:

```typescript
import { ServiceRegistry } from '@loomos/core';

// Mock storage for testing
const mockStorage = {
  upload: jest.fn().mockResolvedValue({
    key: 'test.pdf',
    url: 'https://example.com/test.pdf',
    size: 1024
  }),
  // ... other methods
};

// In your test
ServiceRegistry.reset();
ServiceRegistry.initialize({
  storage: mockStorage,
  // ... other services
});
```

## Next Steps

1. Install dependencies: `npm install`
2. Build core package: `npm run build:core`
3. Update your app to use the service layer
4. Test thoroughly
5. Enjoy vendor independence! 🚀

## Need Help?

The service layer is fully typed. Use your IDE's autocomplete to explore available methods!
