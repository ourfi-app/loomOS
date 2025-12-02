# loomOS

**A modern, open-source operating system framework inspired by webOS**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)

---

## 🌟 What is loomOS?

loomOS is a beautiful, activity-centric operating system that brings the best design principles of webOS to modern web technologies. It features a card-based multitasking interface, smooth physics-based animations, and a comprehensive app framework that works across devices.

**Philosophy**: Content over chrome. Activity-centric computing. Fluid interactions. Data integration.

### Key Highlights

- 🎨 **Modern Design System** - 600+ design tokens, comprehensive component library
- 🚀 **High Performance** - Optimized bundle size, lazy loading, 60fps animations
- ♿ **Accessible** - WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- 🎯 **Developer-Friendly** - TypeScript, React hooks, comprehensive documentation
- 🔐 **Secure** - Built-in authentication, role-based access control, multi-tenancy

---

## ✨ Features

### Desktop Environment
- **Card-based multitasking** with live app previews
- **Universal search** ("Just Type") across apps and data
- **App Grid launcher** with categorized organization
- **Floating dock** for quick access to favorite apps
- **Window management** (minimize, maximize, snap, fullscreen)
- **Dark mode** with system-aware theme switching
- **Glassmorphism design** with backdrop blur effects

### App Framework
- **React/Next.js based** with TypeScript support
- **Service abstraction layer** for storage, email, payments, AI, maps
- **Multi-tenancy** built-in for SaaS applications
- **App Marketplace** for discovering and installing apps
- **Developer Portal** for publishing and monetizing apps
- **Component Library** with 50+ pre-built UI components

### Core Apps (Included)
- **Dashboard** - Customizable widget-based overview
- **Messages** - Threaded conversations with real-time updates
- **Calendar** - Event management with external sync
- **Documents** - Secure file storage and sharing
- **Directory** - Contact and user management
- **Tasks** - Kanban boards and project tracking
- **Accounting** - Financial management and reporting
- **Admin Portal** - Comprehensive administrative tools

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **PostgreSQL** 14 or higher
- **Yarn** 1.22 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/ourfi-app/loomOS.git
cd loomOS

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and service credentials

# Set up database
yarn prisma migrate deploy
yarn prisma db seed

# Start development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Default credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Change the default password immediately after first login!**

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5.2
- **Styling:** Tailwind CSS 3.3 + CSS Variables
- **UI Components:** shadcn/ui + Radix UI
- **Animations:** Framer Motion
- **Icons:** Lucide React + React Icons

### Backend
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **API:** Next.js API Routes

### Services (Configurable)
- **Storage:** MinIO, AWS S3
- **Email:** Resend, SendGrid
- **Payments:** Stripe
- **AI:** Anthropic Claude, OpenAI
- **Maps:** MapLibre GL JS

---

## 📐 Architecture

### Project Structure

```
loomOS/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main application
│   │   ├── admin/                # Admin pages (10 pages)
│   │   ├── super-admin/          # Super admin pages (8 pages)
│   │   ├── apps/                 # Built-in apps
│   │   ├── documents/            # Document management
│   │   ├── messages/             # Messaging system
│   │   └── payments/             # Payment features
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── ui/                       # Base UI components (50+)
│   ├── webos/                    # WebOS-specific components
│   ├── dashboard/                # Dashboard components
│   ├── desktop/                  # Desktop environment
│   └── lazy/                     # Lazy-loaded components
│
├── lib/                          # Utilities and helpers
│   ├── store/                    # Zustand state management
│   ├── app-preferences-store.ts  # App preferences
│   ├── card-manager-store.ts     # Card/window management
│   ├── enhanced-app-registry.ts  # App registry
│   └── utils.ts                  # Utility functions
│
├── design-tokens/                # Design system tokens
│   ├── core.css                  # Base tokens (colors, spacing)
│   ├── semantic.css              # Semantic mappings
│   ├── motion.css                # Animation tokens
│   ├── elevation.css             # Shadows and z-index
│   ├── grid.css                  # Layout tokens
│   ├── typography.css            # Text tokens
│   ├── borders.css               # Border tokens
│   ├── colors-extended.css       # Extended palettes
│   ├── components.css            # Component tokens
│   └── index.css                 # Central import
│
├── prisma/                       # Database schema
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
│
└── public/                       # Static assets
```

### Design System

**Phase 1C Complete:** 600+ design tokens across 10 token files

The loomOS design system uses a three-tier token hierarchy:

1. **Core Tokens** - Immutable foundation (colors, spacing, typography)
2. **Semantic Tokens** - Contextual mappings (text-primary, bg-card, border-default)
3. **Component Tokens** - Specific use cases (button-bg, input-border, nav-text)

**Phase 2 Status:** Component library token integration 80% complete (12/15 Priority 1 components)

#### Using Design Tokens

```tsx
// Use semantic tokens for theming
<div style={{
  backgroundColor: 'var(--semantic-surface-base)',
  color: 'var(--semantic-text-primary)',
  padding: 'var(--space-base)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)'
}}>
  Content
</div>

// Or use Tailwind classes with token values
<div className="bg-background text-foreground p-base rounded-lg shadow-card">
  Content
</div>
```

### Component Library

**50+ UI Components** built with Radix UI primitives and design tokens:

- **Forms:** Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider
- **Data Display:** Card, Badge, Alert, Avatar, Progress, Table, Tabs
- **Overlays:** Dialog, Sheet, Popover, Tooltip, Dropdown Menu
- **Navigation:** Breadcrumb, Pagination, Navigation Menu, Menubar
- **Feedback:** Toast, Alert Dialog, Skeleton
- **Layout:** Separator, Scroll Area, Resizable, Collapsible

### App Launcher System

Unified app launcher with 4 implementations consolidated into one:

- **Tabbed Navigation:** All Apps / Favorites / Recent
- **Category Grouping:** Organized by app category
- **Search & Filter:** Real-time search and filtering
- **Context Menu:** Right-click actions (pin, favorite, open)
- **Keyboard Navigation:** Full keyboard support
- **Usage Tracking:** Recent apps and frequency tracking

### Dock Implementation

Floating glassmorphism dock with:

- **6 Dock Positions:** 5 customizable + 1 fixed (App Launcher)
- **Auto-Hide:** Smart auto-hide on desktop, swipe gestures on mobile
- **Gesture Button:** Glowing button to reveal hidden dock
- **Status Indicators:** Active, running, minimized states
- **Drag & Drop:** Reorder apps (planned)

---

## 🎨 Design Philosophy

loomOS follows webOS design principles:

1. **Light & Airy** - Font-light typography (Helvetica Neue Light), generous whitespace
2. **Glass & Depth** - Frosted glass effects, layered shadows
3. **Smooth Motion** - Fluid animations, natural easing, 60fps
4. **Neutral Palette** - Soft colors, high contrast text
5. **Card-Based** - Everything is a card or window
6. **Touch-Friendly** - 44px minimum touch targets
7. **Responsive** - Mobile-first, progressive enhancement

### Color System

```css
/* Core Colors */
--semantic-primary: #F18825;           /* Loomos Orange */
--semantic-surface-base: #FFFFFF;      /* White surfaces */
--semantic-text-primary: #000000;      /* Primary text */

/* Glass Effects */
--glass-white-80: rgba(255, 255, 255, 0.8);
--glass-white-60: rgba(255, 255, 255, 0.6);
--glass-black-95: rgba(0, 0, 0, 0.95);

/* Chrome (Dark UI) */
--chrome-darker: #1a1a1a;
--chrome-text: #e0e0e0;
```

### Typography

```css
/* Font Stack */
--font-sans: 'Helvetica Neue', -apple-system, sans-serif;
--font-display: 'SF Pro Display', sans-serif;

/* Font Weights */
--font-light: 300;      /* Primary weight */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
```

### Spacing Scale

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-base: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

---

## 💻 Development Guide

### Running the Development Server

```bash
# Start Next.js development server
yarn dev

# Start on different port
PORT=3001 yarn dev

# Run with type checking
yarn type-check

# Run linter
yarn lint
```

### Building for Production

```bash
# Build for production
yarn build

# Start production server
yarn start

# Analyze bundle size
yarn analyze
```

### Database Management

```bash
# Generate Prisma client
yarn prisma generate

# Run migrations
yarn prisma migrate dev

# Reset database
yarn prisma migrate reset

# Seed database
yarn prisma db seed

# Open Prisma Studio
yarn prisma studio
```

### Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run E2E tests
yarn test:e2e
```

### Code Quality

```bash
# Type checking
yarn type-check

# Linting
yarn lint
yarn lint:fix

# Format code
yarn format
```

---

## 🎯 Admin Portal

### Admin Pages (10 pages)

1. **Admin Dashboard** - Overview with key metrics
2. **Announcements** - Create and manage community announcements
3. **Association Settings** - Configure organization settings
4. **Directory Requests** - Review resident update requests
5. **Import Units** - Bulk import units and residents
6. **Payment Management** - Manage resident payments
7. **Property Map** - Visual unit management with Mapbox
8. **Roles & Permissions** - Custom role management
9. **Admin Settings** - Global admin settings
10. **User Management** - Comprehensive user management

### Super Admin Pages (8 pages)

1. **Super Admin Dashboard** - Platform-wide metrics
2. **Activity Logs** - System-wide activity monitoring
3. **API Management** - API keys and usage
4. **Domains Management** - Custom domain configuration
5. **System Monitoring** - Real-time performance monitoring
6. **Organizations** - Manage tenant organizations
7. **Security** - Platform-wide security settings
8. **Users** - All users across organizations

### Access Control

```typescript
// Role-based access control
enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',     // Platform admin
  ADMIN = 'ADMIN',                 // Organization admin
  BOARD_MEMBER = 'BOARD_MEMBER',   // Board member
  RESIDENT = 'RESIDENT'            // Regular user
}

// Check permissions
import { useSession } from 'next-auth/react';

function AdminPage() {
  const { data: session } = useSession();
  
  if (session?.user?.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }
  
  return <div>Admin Content</div>;
}
```

---

## ⚡ Performance Optimization

### Bundle Size Optimization

- **Lazy Loading:** Heavy components loaded on-demand
- **Code Splitting:** Automatic route-based splitting
- **Tree Shaking:** Unused code eliminated
- **Dynamic Imports:** Components loaded when needed

```typescript
// Lazy load heavy components
import { LazyChart, LazyMapView, LazyEditor } from '@/components/lazy';

function Dashboard() {
  return (
    <div>
      {showChart && <LazyChart data={data} />}
      {showMap && <LazyMapView />}
    </div>
  );
}
```

### Performance Metrics

- **Initial Load:** < 100ms Time to Interactive
- **Bundle Size:** < 50 KB (core, gzipped)
- **Component Size:** < 5 KB (per component, gzipped)
- **Animation:** 60fps smooth animations
- **Lighthouse Score:** 90+ (Performance)

### Optimization Techniques

1. **React.memo** for pure components
2. **useMemo** for expensive calculations
3. **useCallback** for event handlers
4. **Virtual scrolling** for long lists
5. **Image optimization** with Next.js Image
6. **Font optimization** with next/font

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel

# Or connect GitHub repository on Vercel dashboard
```

### Render

1. Create PostgreSQL database on Render
2. Create Web Service
3. Configure:
   - **Build Command:** `yarn install && npx prisma generate && npx prisma migrate deploy && yarn build`
   - **Start Command:** `yarn start`
4. Add environment variables
5. Deploy

### Docker

```bash
# Build Docker image
docker build -t loomos .

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/db"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"

# Optional Services
STORAGE_PROVIDER="s3"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket"

EMAIL_PROVIDER="resend"
RESEND_API_KEY="your-key"

STRIPE_SECRET_KEY="your-key"
STRIPE_PUBLISHABLE_KEY="your-key"

ANTHROPIC_API_KEY="your-key"
OPENAI_API_KEY="your-key"
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/loomOS.git
cd loomOS

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
yarn dev

# Run tests and linting
yarn type-check
yarn lint
yarn test

# Commit with conventional commits
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Code Standards

- **TypeScript** - Use proper type annotations
- **React** - Functional components with hooks
- **Tailwind** - Use design tokens where possible
- **ESLint** - Follow project linting rules
- **Testing** - Add tests for new features
- **Documentation** - Update docs for changes

### Pull Request Guidelines

1. **Title:** Clear, descriptive title
2. **Description:** What, why, and how
3. **Tests:** All tests passing
4. **Screenshots:** For UI changes
5. **Documentation:** Updated if needed

---

## 🗺️ Roadmap

### Current Status (Phase 2)

✅ **Phase 1C Complete** - 600+ design tokens  
⏳ **Phase 2** - Component library (80% complete)

### Phase 3: Documentation & Developer Experience (Planned)

- Comprehensive documentation site
- Interactive component playground
- Design token browser
- VS Code extension
- ESLint plugin
- Figma plugin
- Visual regression testing

### Phase 4: Theme System & Customization (Planned)

- Visual theme builder
- Pre-built theme presets
- Runtime theme switching
- Brand theme generator
- Theme marketplace

### Phase 5: Advanced Features (Planned)

- Compound component patterns
- Advanced animation system
- Enhanced accessibility
- Performance optimization
- Internationalization (i18n)
- RTL support

### Phase 6: Ecosystem & Community (Planned)

- Component marketplace
- Template library
- Figma/Sketch design kits
- Video tutorials
- Interactive courses
- Community showcase

### Long-term Vision

- ✅ React/Web (PWA) - **Current**
- 🚧 webOS Open Source Edition
- 📋 Linux Desktop
- 📋 Windows Desktop
- 📋 macOS Desktop
- 📋 iOS & Android Apps

---

## 📊 Project Stats

- **Total Components:** 267 files
- **Dashboard Pages:** 20+ routes
- **Admin Pages:** 23 pages
- **Dependencies:** ~1,600 packages
- **Design Tokens:** 600+ tokens
- **UI Components:** 50+ components
- **Lines of Code:** ~50,000+ LOC

---

## 📚 Additional Resources

### Documentation Files (in this repository)

- **CONTRIBUTING.md** - Contribution guidelines
- **LICENSE** - MIT License
- **CHANGELOG.md** - Version history

### External Links

- **GitHub:** [github.com/ourfi-app/loomOS](https://github.com/ourfi-app/loomOS)
- **Issues:** [GitHub Issues](https://github.com/ourfi-app/loomOS/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ourfi-app/loomOS/discussions)

### Design Inspiration

- **webOS Design:** Palm webOS, LG webOS
- **macOS Big Sur:** Glassmorphism, card UI
- **iPadOS:** Widget layouts, multitasking
- **Material Design 3:** Color systems

---

## ⚠️ Important Notes

### Localhost Reference

**Note:** All localhost URLs (http://localhost:3000) refer to the computer running the application, not your local machine. To access locally or remotely, deploy the application on your own system.

### Security

- ✅ Change default password after first login
- ✅ Use strong NEXTAUTH_SECRET in production
- ✅ Enable HTTPS in production
- ✅ Configure CORS properly
- ✅ Regular security audits
- ✅ Keep dependencies updated

### Performance

- ✅ Monitor bundle size
- ✅ Use lazy loading for heavy components
- ✅ Optimize images with Next.js Image
- ✅ Enable compression
- ✅ Use CDN for static assets
- ✅ Database query optimization

---

## 🎉 Acknowledgments

Inspired by the original **Palm/HP webOS** design system. Built with modern web technologies to bring those principles to today's platforms.

Special thanks to:
- The webOS community
- Open-source contributors
- shadcn for the UI component library
- Vercel for Next.js and hosting platform
- All the amazing open-source projects that make loomOS possible

---

## 📄 License

**MIT License** - see [LICENSE](LICENSE) file for details.

---

## 💡 Why loomOS?

### Vendor Independence
Your choice of storage, email, payment, and AI providers. No lock-in.

### Beautiful Design
webOS-inspired interface that feels modern and delightful.

### Cross-Platform
One codebase, multiple platforms. From web to native desktop and mobile.

### Open Source
MIT licensed. Own your platform, control your destiny.

### Activity-Centric
Focus on what you're doing, not which app you're using.

---

## 📞 Contact & Support

- **GitHub Issues:** For bug reports and feature requests
- **GitHub Discussions:** For questions and community discussions
- **Email:** support@loomos.dev (coming soon)
- **Twitter:** @loomOS (coming soon)

---

**Built to liberate, not to lock in.** 🚀

---

**Last Updated:** December 2, 2025  
**Version:** 1.0.0  
**Status:** Active Development
