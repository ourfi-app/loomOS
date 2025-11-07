# Application Specification Usage Guide

## Overview

This repository contains comprehensive documentation for developing applications that seamlessly integrate with Community Manager. These specifications are designed to guide both human developers and AI assistants in building consistent, high-quality applications.

## Documentation Files

### 1. **APP_DEVELOPMENT_SPEC.md** (Main Specification)
- **Purpose**: Complete development specification covering all aspects of app development
- **Length**: ~1,000 lines, comprehensive and detailed
- **Use Case**: Primary reference for understanding the full architecture and requirements
- **Topics Covered**:
  - Technology stack and dependencies
  - Project structure and file organization
  - Design system (Brandy design tokens, colors, typography)
  - Component architecture and webOS patterns
  - Database integration with Prisma
  - API development patterns
  - Authentication and authorization
  - State management strategies
  - Integration requirements (dock, marketplace, search, AI assistant)
  - Code style and best practices
  - Testing requirements
  - Deployment workflow

### 2. **APP_TEMPLATE_QUICKSTART.md** (Quick Reference)
- **Purpose**: Rapid app scaffolding with copy-paste templates
- **Length**: ~600 lines, concise and actionable
- **Use Case**: Quick start guide with boilerplate code
- **Contains**:
  - Complete file templates ready to copy
  - Database schema template
  - API route templates (CRUD operations)
  - Page component template
  - Form component template
  - App registry configuration
  - Step-by-step checklist

## How to Use These Specifications

### For AI Assistants

When instructing an AI assistant to build an app for Community Manager:

1. **Initial Context**
   ```
   I need you to build an app for Community Manager, a webOS-style condo management platform.
   
   Please read and follow the specifications in:
   - APP_DEVELOPMENT_SPEC.md (for complete architecture understanding)
   - APP_TEMPLATE_QUICKSTART.md (for boilerplate code templates)
   
   The app should be called "[Your App Name]" and should [describe functionality].
   ```

2. **Provide Specific Requirements**
   - App name and purpose
   - Required features
   - Data model (what entities/fields are needed)
   - User interactions
   - Any special integrations

3. **Reference Sections**
   Point the AI to specific sections when needed:
   ```
   - "Follow the Component Architecture section for window management"
   - "Use the API Development pattern for all endpoints"
   - "Ensure multi-tenant compliance as described in Database Integration"
   ```

### For Human Developers

1. **First-Time Setup**
   - Read `APP_DEVELOPMENT_SPEC.md` in full to understand the architecture
   - Bookmark both documents for quick reference
   - Review existing apps in the codebase to see patterns in action

2. **Building a New App**
   - Use `APP_TEMPLATE_QUICKSTART.md` as your scaffolding guide
   - Copy and customize the provided templates
   - Follow the step-by-step checklist at the end

3. **Reference During Development**
   - Consult the Design System section for colors, typography, spacing
   - Check API patterns for consistent endpoint structure
   - Review integration requirements for dock/marketplace/search features

## Key Compliance Requirements

Every app MUST comply with these non-negotiable requirements:

### 1. Multi-Tenant Architecture
```typescript
// ALWAYS filter by organizationId
where: { organizationId: session.user.organizationId }
```

### 2. Desktop Window Wrapper
```typescript
<DesktopAppWindow appId="..." title="..." icon="...">
  {/* Your app content */}
</DesktopAppWindow>
```

### 3. Authentication
```typescript
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

### 4. Input Validation
```typescript
import { z } from 'zod';
const schema = z.object({ /* validation rules */ });
const validated = schema.parse(body);
```

### 5. App Registry
```typescript
// Register in lib/enhanced-app-registry.ts
{ id, name, description, icon, category, route, permissions, features }
```

## Common Use Cases

### Case 1: Simple CRUD App
```
"Build a simple CRUD app for managing [entity name].
Follow APP_TEMPLATE_QUICKSTART.md exactly.
The app should have list, create, edit, and delete functionality."
```

### Case 2: Complex Multi-Pane App
```
"Build a [app name] with a list-detail layout using MultiPaneLayout.
Reference the Component Architecture section in APP_DEVELOPMENT_SPEC.md
for the multi-pane pattern."
```

### Case 3: App with External API
```
"Build an app that integrates with [service name] API.
Follow the API Development section for backend structure,
and add custom API client logic in lib/[app-name]/"
```

### Case 4: App with File Upload
```
"Build an app with document upload functionality.
Use S3 for storage (see lib/s3.ts).
Follow the File Upload with S3 guidelines in the spec."
```

## File Naming Conventions

- Routes: `kebab-case` (`/dashboard/my-app`)
- Files: `kebab-case` (`my-component.tsx`)
- Components: `PascalCase` (`MyComponent`)
- Functions: `camelCase` (`myFunction`)
- Constants: `UPPER_SNAKE_CASE` (`MAX_ITEMS`)

## Technology Stack Reference

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.28 | React framework |
| React | 18.2.0 | UI library |
| TypeScript | 5.2.2 | Type safety |
| Prisma | 6.7.0 | Database ORM |
| PostgreSQL | Latest | Database |
| Tailwind | 3.3.3 | CSS framework |
| Radix UI | Latest | UI components |
| Zustand | 5.0.3 | State management |
| React Query | 5.0.0 | Server state |
| NextAuth | 4.24.11 | Authentication |

## Design System Quick Reference

### Colors
```
Primary: Indigo (#4F46E5)
Accent: Emerald (#10B981)
Success: Emerald (#10B981)
Warning: Amber (#F59E0B)
Error: Red (#EF4444)
Info: Blue (#3B82F6)
```

### Typography
```
Font: Inter (sans-serif)
Sizes: text-xs to text-4xl
Weights: font-normal, font-medium, font-semibold, font-bold
```

### Spacing
```
Base unit: 4px
Scale: p-1 (4px) → p-2 (8px) → p-4 (16px) → p-6 (24px) → p-8 (32px)
```

## Verification Checklist

Before submitting your app:

- [ ] TypeScript compiles: `yarn tsc --noEmit`
- [ ] Production build succeeds: `yarn build`
- [ ] Multi-tenant filtering in all queries
- [ ] Authentication on all API routes
- [ ] Input validation with Zod
- [ ] App registered in app registry
- [ ] Desktop window wrapper used
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Empty states included
- [ ] Loading states included
- [ ] Error handling implemented
- [ ] README documentation written

## Getting Help

1. **Check existing apps**: Look at similar apps in `app/dashboard/` for examples
2. **Review documentation**: Read the relevant sections in the spec
3. **Search codebase**: Find patterns and reusable components
4. **Test incrementally**: Build and test each feature as you go

## Version Information

- **Spec Version**: 1.0.0
- **Last Updated**: November 1, 2025
- **Platform**: Community Manager
- **Repository**: condo_management_app

## Quick Links

- [Main Specification](./APP_DEVELOPMENT_SPEC.md)
- [Quick Start Template](./APP_TEMPLATE_QUICKSTART.md)
- [Style Guide](./STYLE_GUIDE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Project README](./README.md)

---

**Ready to build?** Choose your starting point:
- 📚 **Learning**: Read `APP_DEVELOPMENT_SPEC.md`
- ⚡ **Building**: Use `APP_TEMPLATE_QUICKSTART.md`
- 🤖 **AI Assistant**: Provide both documents as context

Happy coding! 🚀
