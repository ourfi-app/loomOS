# loomOS

A modern, open-source operating system framework inspired by webOS, designed to liberate users from the ecosystem lock-in of Apple and Google.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)

---

## What is loomOS?

loomOS is a beautiful, activity-centric operating system that brings the best design principles of webOS to modern web technologies. It features a card-based multitasking interface, smooth physics-based animations, and a comprehensive app framework that works across devices - from IoT displays to desktop computers.

**Philosophy**: Content over chrome. Activity-centric computing. Fluid interactions. Data integration.

### 🎉 What's New

**Developer Portal Now Available!** Create, submit, and monetize apps on loomOS. Get started at `/dashboard/developer`.

---

## ✨ Key Features

### 🎨 Desktop Environment
- **Card-based multitasking** with live app previews
- **Just Type** universal search across apps and data
- **App Grid launcher** with categorized organization
- **Dock** for quick access to favorite apps
- **Window management** (minimize, maximize, snap, fullscreen)
- **Dark mode** with system-aware theme switching

### 🏗️ App Framework
- **React/Next.js based** with TypeScript support
- **Service abstraction layer** for storage, email, payments, AI, maps
- **Multi-tenancy** built-in for SaaS applications
- **App Marketplace** for discovering and installing apps
- **Developer Portal** for publishing and monetizing apps
- **App Designer** for creating custom applications

### 🎯 Core Apps (Included)
- **Dashboard** - Customizable widget-based overview
- **Messages** - Threaded conversations with real-time updates
- **Calendar** - Event management with external sync
- **Documents** - Secure file storage and sharing
- **Directory** - Contact and user management
- **Tasks** - Kanban boards and project tracking

---

## 🚀 Quick Start

Get loomOS running in 5 minutes:

```bash
# Clone the repository
git clone https://github.com/yourorg/loomos.git
cd loomos

# Install dependencies
yarn install

# Configure your environment
cp .env.example .env
# Edit .env with your database URL and service credentials

# Set up the database
yarn prisma migrate deploy
yarn prisma db seed

# Start the development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) and login with:
- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Change the default password immediately after first login!**

---

## 🛠️ Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Radix UI  
**Backend**: PostgreSQL, Prisma ORM, NextAuth.js  
**Services**: Configurable abstraction layer for storage, email, payments, AI, mapping

### Service Abstraction Layer

loomOS features a pluggable service architecture. Swap providers without changing code:

- **Storage**: MinIO, AWS S3
- **Email**: Resend, SendGrid  
- **Payments**: Stripe
- **AI**: Anthropic Claude, OpenAI
- **Maps**: MapLibre GL JS

---

## 📋 Requirements

- **Node.js** 18 or higher
- **PostgreSQL** 14 or higher
- **Yarn** 1.22 or higher

### Optional Services (configure as needed)
- Storage provider (MinIO/S3)
- Email provider (Resend/SendGrid)
- Payment processor (Stripe)
- AI provider (Claude/OpenAI)

---

## 📚 Documentation

- **[Design Principles](docs/DESIGN_PRINCIPLES.md)** - webOS-inspired UX philosophy
- **[App Development Guide](docs/APP_DEVELOPMENT_SPEC.md)** - Building apps for loomOS
- **[Developer Portal Guide](docs/DEVELOPER_PORTAL.md)** - Publishing to marketplace
- **[Service Abstraction](docs/SERVICE_ABSTRACTION.md)** - Integrating external services
- **[API Documentation](docs/API_SETUP_GUIDE.md)** - Platform APIs
- **[Deployment Guide](docs/setup/DEPLOYMENT.md)** - Production deployment

---

## 🎯 Platform Features

### For Users
- Beautiful, card-based interface inspired by webOS
- Consistent experience across all applications
- Activity-centric workflow (not app-centric)
- Multi-tenant support for organizations

### For Developers
- Modern React/TypeScript app framework
- Service abstraction for vendor independence
- Built-in authentication and authorization
- App marketplace for distribution
- Comprehensive component library

---

## 🛠️ Developer Portal

Build and monetize apps on loomOS! Our newly launched Developer Portal provides everything you need to create, publish, and manage applications.

### Features
- **App Submission & Review** - Submit apps for marketplace approval
- **Version Management** - Publish updates with release notes
- **Analytics Dashboard** - Track downloads, installs, active users, and crash rates
- **Revenue Tracking** - Monitor earnings with Stripe integration
- **Developer Tiers**:
  - **Free**: Up to 3 apps
  - **Pro**: Up to 25 apps with priority review
  - **Enterprise**: Unlimited apps with dedicated support

### Getting Started
1. Register as a developer at `/dashboard/developer`
2. Create your app with our intuitive submission form
3. Submit for review and get approved
4. Publish to the marketplace and start earning

### Pricing Options
- Free apps
- One-time paid apps
- Subscription-based apps
- Freemium (free with in-app purchases)

---

## 🚢 Deployment

### Vercel (Recommended for Web)
```bash
git push origin main
# Import to Vercel and configure environment variables
```

### Render (Recommended for Full-Stack)
1. **Create PostgreSQL Database**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - New → PostgreSQL
   - Copy the Internal Database URL

2. **Create Web Service**
   - New → Web Service
   - Connect your repository
   - Configure:
     - **Build Command**: `yarn install && npx prisma generate && npx prisma migrate deploy && yarn build`
     - **Start Command**: `yarn start`
   - Add environment variables:
     ```
     DATABASE_URL=<your-postgres-internal-url>
     NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
     NEXTAUTH_URL=https://your-app.onrender.com
     ```

3. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy on every push to main

### Docker
```bash
docker-compose up -d
```

### Self-Hosted
See [docs/setup/DEPLOYMENT.md](docs/setup/DEPLOYMENT.md) for detailed instructions.

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
yarn type-check
yarn lint
yarn dev

# Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

---

## 🗺️ Roadmap

- ✅ React/Web (PWA) - Current
- 🚧 webOS Open Source Edition
- 📋 Linux Desktop
- 📋 Windows Desktop  
- 📋 macOS Desktop
- 📋 iOS & Android Apps

---

## 💡 Why loomOS?

**Vendor Independence**: Your choice of storage, email, payment, and AI providers. No lock-in.

**Beautiful Design**: webOS-inspired interface that feels modern and delightful.

**Cross-Platform**: One codebase, multiple platforms. From web to native desktop and mobile.

**Open Source**: MIT licensed. Own your platform, control your destiny.

**Activity-Centric**: Focus on what you're doing, not which app you're using.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Inspired by the original **Palm/HP webOS** design system. Built with modern web technologies to bring those principles to today's platforms.

Special thanks to the webOS community and the open-source projects that make loomOS possible.

---

## 📞 Contact

- **GitHub**: [Issues](https://github.com/yourorg/loomos/issues) & [Discussions](https://github.com/yourorg/loomos/discussions)
- **Website**: Coming soon

---

**Built to liberate, not to lock in.**

