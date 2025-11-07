# @loomos/core

Service Abstraction Layer for loomOS - escape vendor lock-in by wrapping external services in clean interfaces.

## Features

- **Storage**: S3, MinIO, or any S3-compatible service
- **Email**: SendGrid, Resend, or SMTP
- **Payment**: Stripe (more coming soon)
- **AI**: Claude, OpenAI, or none
- **Maps**: MapLibre GL

## Installation

```bash
npm install @loomos/core
# or
yarn add @loomos/core
```

## Quick Start

### 1. Configure Environment Variables

```env
# Storage (choose one)
STORAGE_PROVIDER=aws-s3  # or 'minio'
STORAGE_BUCKET=my-bucket
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY_ID=xxx
STORAGE_SECRET_ACCESS_KEY=xxx

# Email (choose one)
EMAIL_PROVIDER=sendgrid  # or 'resend'
EMAIL_API_KEY=xxx
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME="My App"

# Payment
STRIPE_SECRET_KEY=sk_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AI (optional)
AI_PROVIDER=claude  # or 'openai' or 'none'
AI_API_KEY=xxx
AI_MODEL=claude-sonnet-4-20250514
```

### 2. Initialize Services

```typescript
// app/layout.tsx or pages/_app.tsx
import { ServiceRegistry, loadServiceConfig } from '@loomos/core';

// Initialize once at app startup
ServiceRegistry.initialize(loadServiceConfig());

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}
```

### 3. Use Services

```typescript
import { ServiceRegistry } from '@loomos/core';

// In API routes
export async function POST(request: Request) {
  const storage = ServiceRegistry.get().storage;

  const result = await storage.upload(
    'uploads/file.pdf',
    fileBuffer,
    { contentType: 'application/pdf' }
  );

  return Response.json({ url: result.url });
}
```

Or use React hooks:

```typescript
import { useStorage, useEmail } from '@loomos/core';

function MyComponent() {
  const storage = useStorage();
  const email = useEmail();

  // Use services...
}
```

## Switching Providers

Just change environment variables - no code changes needed!

```env
# Switch from S3 to MinIO
STORAGE_PROVIDER=minio
STORAGE_ENDPOINT=http://localhost:9000

# Switch from SendGrid to Resend
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_xxx

# Switch from Claude to OpenAI
AI_PROVIDER=openai
AI_API_KEY=sk-xxx
AI_MODEL=gpt-4o
```

## API Reference

See the TypeScript types for full documentation. All services are fully typed.

## License

MIT
