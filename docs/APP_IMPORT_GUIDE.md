# loomOS App Import System - Complete Guide

This guide provides comprehensive documentation for the loomOS app import system, which allows developers to create, distribute, and maintain apps separately from the main codebase.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [App Manifest Format](#app-manifest-format)
- [Import Methods](#import-methods)
- [Validation](#validation)
- [Workflow & Best Practices](#workflow--best-practices)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## Overview

### What is the App Import System?

The app import system is a standardized way to define, package, and distribute apps for loomOS. Instead of hardcoding apps in the main codebase, you can:

- Define apps in JSON manifests
- Develop apps in separate repositories/branches
- Version control app definitions
- Import/export apps programmatically
- Share apps across environments
- Automate app deployment

### Benefits

✅ **Separation of Concerns**: Apps are independent of core platform code
✅ **Version Control**: Track app changes separately
✅ **Easy Distribution**: Share apps as JSON files
✅ **Development Workflow**: Work on apps in isolated branches
✅ **CI/CD Integration**: Automate app deployment
✅ **Multi-tenancy**: Deploy different apps per organization

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                   App Import System                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   CLI Tool   │  │  API Endpoint │  │   Service    │ │
│  │              │  │               │  │              │ │
│  │ import-apps  │  │ /api/import   │  │ AppImport    │ │
│  │              │  │               │  │ Service      │ │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘ │
│         │                 │                   │         │
│         └─────────────────┴───────────────────┘         │
│                           │                             │
│                  ┌────────▼─────────┐                   │
│                  │   Validation     │                   │
│                  │   (Zod Schema)   │                   │
│                  └────────┬─────────┘                   │
│                           │                             │
│                  ┌────────▼─────────┐                   │
│                  │   Database       │                   │
│                  │   (Prisma)       │                   │
│                  └──────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
loomOS/
├── apps/                           # App definitions directory
│   ├── my-app/
│   │   ├── app.json               # App manifest
│   │   └── README.md              # Documentation
│   └── another-app/
│       └── app.json
├── lib/marketplace/
│   ├── AppImportService.ts        # Import logic
│   └── app-import-types.ts        # TypeScript types & schema
├── app/api/marketplace/
│   └── import/
│       └── route.ts               # Import API endpoint
└── scripts/
    └── import-apps.ts             # CLI tool
```

## Getting Started

### Prerequisites

- Node.js 18+
- loomOS development environment
- Database access (PostgreSQL via Prisma)

### Installation

The app import system is built-in to loomOS. No additional installation required.

### Quick Start

1. **Create an app directory**:
   ```bash
   mkdir -p apps/my-first-app
   ```

2. **Create app.json**:
   ```json
   {
     "app": {
       "name": "My First App",
       "slug": "my-first-app",
       "tagline": "A simple example app",
       "description": "This is my first loomOS app using the import system",
       "category": "PRODUCTIVITY",
       "version": "1.0.0"
     }
   }
   ```

3. **Validate**:
   ```bash
   tsx scripts/import-apps.ts validate apps/my-first-app/app.json
   ```

4. **Import**:
   ```bash
   tsx scripts/import-apps.ts file apps/my-first-app/app.json
   ```

## App Manifest Format

### Basic Structure

```json
{
  "manifest": {
    "version": "1.0",
    "createdAt": "2025-01-08",
    "author": "Your Name"
  },
  "app": {
    // App definition here
  }
}
```

### Complete Example

```json
{
  "manifest": {
    "version": "1.0",
    "createdAt": "2025-01-08",
    "updatedAt": "2025-01-15",
    "author": "loomOS Team"
  },
  "app": {
    // Core Identity
    "name": "Project Manager",
    "slug": "project-manager",
    "tagline": "Manage projects with ease",
    "description": "A comprehensive project management tool",
    "longDescription": "Extended description with features...",

    // Visual Identity
    "iconName": "folder",
    "color": "#3b82f6",
    "path": "/project-manager",

    // Categorization
    "category": "PRODUCTIVITY",
    "tags": ["projects", "tasks", "teams"],
    "searchKeywords": ["project", "manage", "team"],

    // Features & Permissions
    "features": [
      "Project planning",
      "Task management",
      "Team collaboration"
    ],
    "permissions": ["read:projects", "write:projects"],
    "minRole": "MEMBER",

    // Version & Status
    "version": "1.2.0",
    "status": "PUBLISHED",
    "isActive": true,

    // Pricing
    "pricingModel": "FREEMIUM",
    "price": 19.99,
    "currency": "USD",

    // Assets
    "screenshots": [
      "/screenshots/overview.png",
      "/screenshots/dashboard.png"
    ],
    "videoUrl": "https://example.com/demo.mp4",

    // Links
    "websiteUrl": "https://example.com",
    "supportUrl": "https://support.example.com",
    "privacyUrl": "https://example.com/privacy",
    "termsUrl": "https://example.com/terms",

    // Technical
    "compatibility": ["web", "mobile"],
    "requiredIntegrations": ["slack", "github"],

    // Import Metadata
    "organizationId": "org-123",
    "developerId": "dev-456",
    "importVersion": "1.0",
    "importSource": "custom-apps-repo"
  }
}
```

### Field Reference

See [apps/README.md](../apps/README.md) for complete field reference.

## Import Methods

### 1. CLI Tool

The command-line tool provides the most flexible import options.

#### Import Single App

```bash
tsx scripts/import-apps.ts file apps/my-app/app.json
```

#### Import All Apps from Directory

```bash
tsx scripts/import-apps.ts dir apps/
```

#### With Options

```bash
tsx scripts/import-apps.ts dir apps/ \
  --update \
  --publish \
  --organization org-123 \
  --developer dev-456
```

#### Dry Run (Test Without Importing)

```bash
tsx scripts/import-apps.ts file apps/my-app/app.json --dry-run
```

### 2. API Endpoint

Import apps via HTTP API for programmatic integration.

#### Import Single App

```bash
curl -X POST http://localhost:3000/api/marketplace/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "apps": {
      "name": "My App",
      "slug": "my-app",
      ...
    },
    "options": {
      "updateExisting": true,
      "autoPublish": false
    }
  }'
```

#### Import Multiple Apps

```bash
curl -X POST http://localhost:3000/api/marketplace/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "apps": [
      { "name": "App 1", "slug": "app-1", ... },
      { "name": "App 2", "slug": "app-2", ... }
    ]
  }'
```

### 3. Programmatic (TypeScript)

Use the service directly in your code.

```typescript
import { AppImportService } from '@/lib/marketplace/AppImportService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const importService = new AppImportService(prisma);

// Import single app
const result = await importService.importApp({
  name: 'My App',
  slug: 'my-app',
  tagline: 'A great app',
  description: 'This app does amazing things',
  category: 'PRODUCTIVITY',
}, {
  updateExisting: true,
  autoPublish: false,
});

console.log(result);

// Import from directory
const bulkResult = await importService.importFromDirectory('./apps');
console.log(`Imported ${bulkResult.successful} apps`);
```

## Validation

### Schema Validation

All apps are validated against a Zod schema before import.

#### Validate Before Importing

```bash
tsx scripts/import-apps.ts validate apps/my-app/app.json
```

#### Common Validation Errors

| Error | Solution |
|-------|----------|
| `slug: Must contain only lowercase letters, numbers, and hyphens` | Fix slug format: `my-app` not `My App` |
| `version: Version must follow semver` | Use format: `1.0.0` not `v1` |
| `color: Color must be a valid hex color` | Use format: `#6366f1` not `blue` |
| `category: Invalid enum value` | Use valid category from list |

### Custom Validation

```typescript
import { AppImportService } from '@/lib/marketplace/AppImportService';

const importService = new AppImportService();
const validation = importService.validateApp(appDefinition);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## Workflow & Best Practices

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-app
   ```

2. **Create App Definition**
   ```bash
   mkdir -p apps/new-app
   # Edit apps/new-app/app.json
   ```

3. **Validate Locally**
   ```bash
   tsx scripts/import-apps.ts validate apps/new-app/app.json
   ```

4. **Test Import (Dry Run)**
   ```bash
   tsx scripts/import-apps.ts file apps/new-app/app.json --dry-run
   ```

5. **Import to Development**
   ```bash
   tsx scripts/import-apps.ts file apps/new-app/app.json
   ```

6. **Commit & Push**
   ```bash
   git add apps/new-app/
   git commit -m "Add new app: New App"
   git push origin feature/new-app
   ```

7. **Production Deploy**
   ```bash
   # In CI/CD pipeline
   tsx scripts/import-apps.ts dir apps/ --publish
   ```

### Versioning Strategy

Use semantic versioning for apps:

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### Multi-Environment Strategy

```bash
# Development
tsx scripts/import-apps.ts dir apps/ --organization dev-org

# Staging
tsx scripts/import-apps.ts dir apps/ --organization staging-org

# Production
tsx scripts/import-apps.ts dir apps/ --organization prod-org --publish
```

## Advanced Usage

### Export Existing Apps

```bash
# Export all apps
tsx scripts/import-apps.ts export -f exported-apps.json

# Export specific app
tsx scripts/import-apps.ts export --app-id app-123 -f my-app.json

# Export by organization
tsx scripts/import-apps.ts export --organization org-123 -f org-apps.json
```

### Bulk Operations

```bash
# Import all apps and publish
tsx scripts/import-apps.ts dir apps/ --publish

# Update existing apps without creating new ones
tsx scripts/import-apps.ts dir apps/ --update

# Skip existing apps
tsx scripts/import-apps.ts dir apps/ --no-update
```

### CI/CD Integration

#### GitHub Actions Example

```yaml
name: Import Apps
on:
  push:
    branches: [main]
    paths:
      - 'apps/**'

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: tsx scripts/import-apps.ts dir apps/ --publish
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Organization-Specific Apps

```json
{
  "app": {
    "name": "Custom CRM",
    "slug": "custom-crm",
    "organizationId": "org-123",
    ...
  }
}
```

## Troubleshooting

### App Already Exists

**Problem**: `App with slug 'my-app' already exists`

**Solutions**:
- Use `--update` flag to update existing app
- Change the slug to create a new app
- Delete the existing app first

### Validation Fails

**Problem**: Schema validation errors

**Solutions**:
- Run `validate` command to see detailed errors
- Check field types and formats
- Refer to schema documentation

### Permission Denied

**Problem**: Unauthorized to import apps

**Solutions**:
- Ensure you're authenticated
- Check your user role (need developer/admin)
- Verify organization access

### Database Connection Error

**Problem**: Cannot connect to database

**Solutions**:
- Check `DATABASE_URL` environment variable
- Verify Prisma client is generated
- Run `npx prisma generate`

## API Reference

### AppImportService

```typescript
class AppImportService {
  // Import single app
  async importApp(
    definition: AppImportDefinition,
    options?: AppImportOptions
  ): Promise<AppImportResult>

  // Import from directory
  async importFromDirectory(
    appsDirectory: string,
    options?: AppImportOptions
  ): Promise<BulkImportResult>

  // Import from JSON
  async importFromJSON(
    json: string,
    options?: AppImportOptions
  ): Promise<BulkImportResult>

  // Validate app
  validateApp(definition: AppImportDefinition): {
    valid: boolean;
    errors: string[];
  }

  // Export app
  async exportApp(appId: string): Promise<AppImportDefinition | null>

  // Export all apps
  async exportAllApps(organizationId?: string): Promise<AppImportDefinition[]>
}
```

### Types

```typescript
interface AppImportDefinition {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: AppCategory;
  // ... see app-import-types.ts
}

interface AppImportOptions {
  updateExisting?: boolean;
  autoPublish?: boolean;
  defaultOrganizationId?: string;
  defaultDeveloperId?: string;
  dryRun?: boolean;
  skipValidation?: boolean;
}

interface AppImportResult {
  success: boolean;
  appId?: string;
  slug: string;
  action: 'created' | 'updated' | 'skipped' | 'failed';
  message: string;
  errors?: string[];
  warnings?: string[];
}
```

## Support

For issues or questions:
- Check this guide and [apps/README.md](../apps/README.md)
- Review example apps in `apps/` directory
- Open an issue on GitHub
- Contact the loomOS team

## Contributing

Contributions welcome! To add features:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

See LICENSE file for details.
