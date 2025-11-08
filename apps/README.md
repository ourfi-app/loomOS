# loomOS App Import System

This directory contains app definitions that can be imported into the loomOS marketplace. The app import system allows you to develop and maintain apps separately from the main codebase, making it easy to create, share, and distribute custom applications.

## 📁 Directory Structure

```
apps/
├── README.md                           # This file
├── example-task-manager/               # Example app 1
│   ├── app.json                        # App manifest
│   └── README.md                       # App documentation
└── example-analytics-dashboard/        # Example app 2
    ├── app.json                        # App manifest
    └── README.md                       # App documentation
```

## 🚀 Quick Start

### Import a Single App

```bash
# Using CLI
tsx scripts/import-apps.ts file apps/example-task-manager/app.json

# Using API
curl -X POST http://localhost:3000/api/marketplace/import \
  -H "Content-Type: application/json" \
  -d @apps/example-task-manager/app.json
```

### Import All Apps from Directory

```bash
tsx scripts/import-apps.ts dir apps/
```

### Validate an App Definition

```bash
tsx scripts/import-apps.ts validate apps/example-task-manager/app.json
```

### Export Existing Apps

```bash
# Export all apps
tsx scripts/import-apps.ts export -f exported-apps.json

# Export specific app
tsx scripts/import-apps.ts export --app-id <app-id> -f my-app.json
```

## 📝 Creating a New App

### 1. Create App Directory

```bash
mkdir -p apps/my-custom-app
```

### 2. Create App Manifest (app.json)

```json
{
  "manifest": {
    "version": "1.0",
    "createdAt": "2025-01-08",
    "author": "Your Name"
  },
  "app": {
    "name": "My Custom App",
    "slug": "my-custom-app",
    "tagline": "A brief description",
    "description": "Detailed description of your app",
    "iconName": "package",
    "color": "#6366f1",
    "path": "/my-custom-app",
    "category": "PRODUCTIVITY",
    "tags": ["custom", "productivity"],
    "features": [
      "Feature 1",
      "Feature 2"
    ],
    "permissions": ["read:data", "write:data"],
    "minRole": "MEMBER",
    "version": "1.0.0",
    "status": "DRAFT",
    "pricingModel": "FREE",
    "price": 0,
    "currency": "USD"
  }
}
```

### 3. Import Your App

```bash
tsx scripts/import-apps.ts file apps/my-custom-app/app.json
```

## 📋 App Manifest Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | App name (max 100 chars) |
| `slug` | string | URL-friendly identifier (lowercase, hyphens only) |
| `tagline` | string | Short description (max 200 chars) |
| `description` | string | Detailed description (min 10 chars) |
| `category` | enum | App category (see categories below) |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `iconName` | string | "package" | Icon identifier |
| `color` | string | "#6366f1" | Hex color code |
| `path` | string | `/${slug}` | App route path |
| `tags` | string[] | [] | Search/filter tags |
| `features` | string[] | [] | Feature list |
| `permissions` | string[] | [] | Required permissions |
| `minRole` | enum | "MEMBER" | Minimum user role |
| `isActive` | boolean | true | Active status |
| `version` | string | "1.0.0" | Semantic version |
| `status` | enum | "DRAFT" | Publishing status |
| `pricingModel` | enum | "FREE" | Pricing model |
| `price` | number | 0 | Price (if paid) |
| `currency` | string | "USD" | Currency code |
| `screenshots` | string[] | [] | Screenshot URLs |
| `videoUrl` | string | - | Demo video URL |
| `websiteUrl` | string | - | App website |
| `supportUrl` | string | - | Support page |
| `privacyUrl` | string | - | Privacy policy |
| `termsUrl` | string | - | Terms of service |

### Categories

- `PRODUCTIVITY` - Task management, notes, calendars
- `COMMUNICATION` - Chat, email, messaging
- `ANALYTICS` - Data visualization, reporting
- `DEVELOPER_TOOLS` - Code editors, testing, deployment
- `DESIGN` - Graphics, prototyping, mockups
- `FINANCE` - Accounting, invoicing, expenses
- `HR` - Recruiting, onboarding, performance
- `MARKETING` - Campaigns, social media, SEO
- `SALES` - CRM, pipeline, proposals
- `SUPPORT` - Helpdesk, ticketing, knowledge base
- `OTHER` - Everything else

### Status Values

- `DRAFT` - App is being developed
- `PENDING_REVIEW` - Submitted for approval
- `PUBLISHED` - Available in marketplace

### Pricing Models

- `FREE` - No cost
- `FREEMIUM` - Free with paid upgrades
- `PAID` - Requires payment
- `ENTERPRISE` - Custom pricing

### User Roles

- `VIEWER` - Read-only access
- `MEMBER` - Standard user
- `ADMIN` - Administrative access
- `OWNER` - Full control

## 🔧 CLI Commands

```bash
# Import from directory
tsx scripts/import-apps.ts dir <directory> [options]

# Import from file
tsx scripts/import-apps.ts file <file> [options]

# Validate definition
tsx scripts/import-apps.ts validate <file>

# Export apps
tsx scripts/import-apps.ts export [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-u, --update` | Update existing apps (default: true) |
| `-p, --publish` | Auto-publish imported apps |
| `-d, --dry-run` | Validate without importing |
| `-o, --organization <id>` | Default organization ID |
| `--developer <id>` | Default developer ID |
| `-f, --output <file>` | Output file for exports |

## 🌐 API Endpoints

### Import Apps

```http
POST /api/marketplace/import
Content-Type: application/json

{
  "apps": [{ ... }],  // Single app or array of apps
  "options": {
    "updateExisting": true,
    "autoPublish": false,
    "organizationId": "org-123",
    "developerId": "dev-456",
    "dryRun": false
  }
}
```

### Export Apps

```http
# Export all apps
GET /api/marketplace/import?export=true

# Export specific app
GET /api/marketplace/import?export=true&appId=app-123

# Export by organization
GET /api/marketplace/import?export=true&organizationId=org-123
```

## 💡 Best Practices

1. **Use Semantic Versioning**: Follow semver (e.g., 1.0.0) for versions
2. **Descriptive Slugs**: Use clear, URL-friendly slugs (e.g., `task-manager-pro`)
3. **Detailed Descriptions**: Provide comprehensive descriptions and feature lists
4. **Proper Categorization**: Choose the most relevant category and tags
5. **Permission Scoping**: Only request necessary permissions
6. **Version Control**: Keep app definitions in git for history
7. **Test First**: Use `--dry-run` to validate before importing
8. **Document Changes**: Update version and add release notes for changes

## 🔒 Security Considerations

- **Permissions**: Only request permissions your app actually needs
- **Validation**: All imports are validated against the schema
- **Authentication**: API imports require authenticated user
- **Authorization**: Only admins/developers can import apps (configurable)

## 🐛 Troubleshooting

### Validation Errors

```bash
# Check detailed validation errors
tsx scripts/import-apps.ts validate apps/my-app/app.json
```

### Import Conflicts

If you get "app already exists" errors:
- Use `--update` flag to update existing apps
- Change the `slug` to create a new app instead
- Use `--dry-run` to preview changes

### Permission Issues

Make sure you have the necessary permissions:
- Be authenticated when using the API
- Have developer or admin role
- Have access to the target organization

## 📚 Examples

See the example apps in this directory:
- [Task Manager Pro](./example-task-manager) - Productivity app example
- [Analytics Dashboard](./example-analytics-dashboard) - Analytics app example

## 🤝 Contributing

To contribute a new app:

1. Create your app directory in `apps/`
2. Add `app.json` with complete manifest
3. Include a `README.md` with documentation
4. Test import with `--dry-run` flag
5. Submit a pull request

## 📖 Further Reading

- [App Development Guide](../docs/app-development.md)
- [API Documentation](../docs/api-reference.md)
- [Marketplace Guidelines](../docs/marketplace-guidelines.md)
