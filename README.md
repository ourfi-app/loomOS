# Community Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A modern, full-featured condo association management platform built with Next.js 14, featuring a beautiful webOS-inspired desktop interface.

---

## 🚀 Quick Start

Get running in 5 minutes:

```bash
# 1. Clone and navigate
git clone https://github.com/ourfi-app/community-manager.git
cd community-manager

# 2. Install dependencies
yarn install

# 3. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Set up database
yarn prisma migrate deploy
yarn prisma db seed

# 5. Start development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) and login with:
- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change the default password immediately after first login!

---

## ✨ Key Features

### 🎨 Modern Desktop Interface
- webOS-inspired design with smooth card-based multitasking
- Advanced window management (minimize, maximize, snap)
- Fully responsive from mobile to desktop
- Dark mode with system-aware theme switching

### 📱 Core Applications
- **Dashboard**: Real-time overview with customizable widgets
- **Messages**: Threaded conversations with real-time updates
- **Calendar**: Event management with Google Calendar sync
- **Documents**: Secure document storage with AWS S3
- **Directory**: Resident and household management
- **Tasks**: Project tracking with Kanban boards
- **Payments**: Stripe-powered payment processing
- **Budgeting**: Financial planning and reporting

### 🛠️ Admin Tools
- Super Admin Dashboard with system analytics
- Role-based access control (Admin, Board Member, Resident)
- App Designer for custom applications
- Marketplace for community apps
- Comprehensive audit logs

### 🔐 Security & Performance
- NextAuth.js authentication with multiple providers
- Role-based access control with granular permissions
- React Server Components for optimized rendering
- PWA support with offline functionality
- Real-time updates via WebSocket connections

---

## 🛠️ Tech Stack

| Frontend | Backend | Infrastructure |
|----------|---------|----------------|
| Next.js 14 | PostgreSQL | Vercel |
| TypeScript 5.2 | Prisma ORM | AWS S3 |
| Tailwind CSS | NextAuth.js | SendGrid |
| Radix UI | Stripe | Twilio |
| Framer Motion | API Routes | GitHub Actions |

---

## 📦 Installation

### Prerequisites
- **Node.js**: 18.0 or higher
- **Yarn**: 1.22 or higher
- **PostgreSQL**: 14 or higher

### Required Services
Create accounts for:
- [AWS](https://aws.amazon.com/) (S3 file storage)
- [Stripe](https://stripe.com/) (Payment processing)
- [SendGrid](https://sendgrid.com/) (Email delivery)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ourfi-app/community-manager.git
   cd community-manager
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up PostgreSQL**
   ```bash
   psql -U postgres
   CREATE DATABASE community_manager;
   \q
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/community_manager"
   NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   NEXTAUTH_URL="http://localhost:3000"
   AWS_BUCKET_NAME="your-bucket"
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="your-key"
   AWS_SECRET_ACCESS_KEY="your-secret"
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   SENDGRID_API_KEY="SG..."
   SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
   ```

5. **Run migrations and seed**
   ```bash
   yarn prisma generate
   yarn prisma migrate deploy
   yarn prisma db seed
   ```

6. **Start development**
   ```bash
   yarn dev
   ```

📖 **For detailed setup instructions, see [docs/setup/](docs/setup/)**

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

### Docker
```bash
docker-compose up -d
docker-compose exec app yarn prisma migrate deploy
```

📖 **For detailed deployment guides, see [docs/setup/DEPLOYMENT.md](docs/setup/DEPLOYMENT.md)**

---

## 📚 Documentation

- **[Complete Documentation](docs/INDEX.md)** - Full documentation index
- **[User Guide](docs/USER_GUIDE_COMPREHENSIVE.md)** - End-user documentation
- **[API Documentation](docs/API_SETUP_GUIDE.md)** - API reference
- **[Development Guide](docs/APP_DEVELOPMENT_SPEC.md)** - Building custom apps
- **[FAQ](docs/FAQ_COMPREHENSIVE.md)** - Frequently asked questions

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
yarn type-check
yarn lint
yarn dev

# Commit using conventional commits
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

See [STYLE_GUIDE.md](STYLE_GUIDE.md) for coding standards.

---

## 🐛 Troubleshooting

Common issues and solutions:

**Database connection errors:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify DATABASE_URL
echo $DATABASE_URL
```

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
yarn install
```

📖 **For more help, see [docs/FAQ_COMPREHENSIVE.md](docs/FAQ_COMPREHENSIVE.md)**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://www.prisma.io/) - Database ORM
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

## 📞 Support

- **[GitHub Discussions](https://github.com/ourfi-app/community-manager/discussions)** - Ask questions
- **[GitHub Issues](https://github.com/ourfi-app/community-manager/issues)** - Report bugs
- **Email**: support@communitymanager.app

---

<div align="center">

**Built with ❤️ by the [OurFi Team](https://ourfi.app)**

[Website](https://communitymanager.app) • [Documentation](docs/INDEX.md) • [Twitter](https://twitter.com/communitymanagerapp)

© 2024 OurFi. All rights reserved.

</div>
