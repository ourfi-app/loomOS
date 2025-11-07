# Super Admin Setup Guide

This guide will help you set up and access the Super Admin interface for Community Manager.

## 🎯 What is the Super Admin Interface?

The Super Admin interface is a **platform-level administrative dashboard** that provides:

- 🏢 **Multi-tenant Organization Management** - Create and manage multiple organizations
- 👥 **Platform-wide User Management** - Manage all users across all organizations
- 🌐 **Domain Management** - Configure custom domains and subdomains
- 🔐 **Security Settings** - Platform-level security configuration
- 📊 **System Monitoring** - Performance metrics and system health
- 📝 **Activity Logs** - Comprehensive audit trail
- 🔑 **API Management** - API keys and usage tracking

## 🚀 Quick Start

### Prerequisites

1. **PostgreSQL Database** - You need a running PostgreSQL instance
2. **Node.js 18+** - Make sure you have Node.js installed
3. **Environment Variables** - Configure your `.env` file

### Step 1: Environment Setup

The `.env` file has been created with default values. Update these settings:

```bash
# REQUIRED: Database connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/community_manager?schema=public"

# REQUIRED: NextAuth secret (use a secure random string)
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"

# REQUIRED: Application URL
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 2: Database Setup

Run the following commands to set up your database:

```bash
# Generate Prisma Client
npm run prisma generate

# Run database migrations
npx prisma migrate dev

# Optional: Seed initial data
npm run db:seed
```

### Step 3: Create Super Admin User

Run the super admin creation script:

```bash
npx tsx scripts/create-super-admin.ts
```

This will create a super admin account with:
- **Email:** `superadmin@trellis.com`
- **Password:** `SuperAdmin123!`

**⚠️ IMPORTANT:** Change this password immediately after first login!

### Step 4: Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build && npm start
```

### Step 5: Access Super Admin Dashboard

1. Navigate to: `http://localhost:3000/auth/login`
2. Login with super admin credentials:
   - Email: `superadmin@trellis.com`
   - Password: `SuperAdmin123!`
3. You'll be redirected to the dashboard
4. Access Super Admin features at: `http://localhost:3000/dashboard/super-admin`

Or use the dedicated super admin login page:
- Navigate to: `http://localhost:3000/auth/super-admin-login`

## 📋 Features Overview

### Organization Management
- Create new organizations (tenants)
- Configure subscription plans (Trial, Basic, Professional, Enterprise)
- Suspend/activate organizations
- View organization statistics

### User Management
- View all platform users
- Update user roles (SUPER_ADMIN, ADMIN, BOARD_MEMBER, RESIDENT)
- Activate/deactivate users
- Reset user passwords

### Domain Management
- Configure custom domains for organizations
- Set up subdomains
- Manage SSL certificates

### Security Settings
- Two-factor authentication settings
- IP whitelisting
- Session management
- Security audit logs

### System Monitoring
- Platform performance metrics
- Database statistics
- Storage usage
- API call tracking

### Activity Logs
- User authentication logs
- Administrative actions
- System events
- Security incidents

## 🔒 Security Best Practices

1. **Change Default Credentials** - Immediately change the default super admin password
2. **Use Strong Passwords** - Use a password manager to generate secure passwords
3. **Enable 2FA** - Enable two-factor authentication when available
4. **Limit Super Admin Accounts** - Only create super admin accounts when necessary
5. **Regular Audits** - Review activity logs regularly
6. **Secure Environment Variables** - Never commit `.env` files to version control
7. **HTTPS Only** - Always use HTTPS in production

## 🛠 Troubleshooting

### Cannot Generate Prisma Client

If you get errors running `npx prisma generate`, try:

```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Reinstall dependencies
npm install

# Generate client
npx prisma generate
```

### Database Connection Issues

Verify your database is running:
```bash
# For local PostgreSQL
psql -h localhost -U postgres -d community_manager
```

Update `DATABASE_URL` in `.env` with correct credentials.

### Super Admin Already Exists

If the script says super admin already exists, you can:

1. Login with existing credentials
2. Reset password through the database
3. Or create a new super admin with a different email

### Cannot Access Super Admin Routes

Verify:
1. You're logged in with a SUPER_ADMIN role account
2. The middleware is not blocking super admin routes
3. Check browser console for errors

## 📚 Additional Resources

- **Main Documentation:** See `/docs` folder
- **API Documentation:** See `/docs/api` folder
- **Prisma Schema:** See `/prisma/schema.prisma`
- **Auth Configuration:** See `/lib/auth.ts`

## 🆘 Support

For issues or questions:
1. Check existing GitHub issues
2. Review the troubleshooting section
3. Create a new issue with detailed information

## 🔐 Super Admin Capabilities

Super admins have **unrestricted access** to all platform features:

- ✅ Bypass all organization-level restrictions
- ✅ Access all organizations' data
- ✅ Manage all users regardless of organization
- ✅ Configure platform-wide settings
- ✅ View comprehensive system statistics
- ✅ Access all API endpoints
- ✅ Skip onboarding requirements

## 📝 Creating Additional Super Admins

To create additional super admin accounts:

1. **Via Script:**
   ```bash
   # Edit scripts/create-super-admin.ts to use different email
   # Then run:
   npx tsx scripts/create-super-admin.ts
   ```

2. **Via Super Admin Dashboard:**
   - Login as super admin
   - Go to `/dashboard/super-admin/users`
   - Create new user with SUPER_ADMIN role

3. **Via Database:**
   ```sql
   UPDATE "User"
   SET role = 'SUPER_ADMIN', "organizationId" = NULL
   WHERE email = 'your-email@example.com';
   ```

## 🎨 Customization

The super admin interface uses the WebOS-inspired design system. To customize:

- **Colors:** Edit `/lib/app-design-system.ts`
- **Components:** Modify `/components/webos/`
- **Dashboard:** Edit `/app/dashboard/super-admin/page.tsx`

## 📊 Monitoring

Key metrics to monitor:
- Organization count and status
- User registration trends
- Storage usage
- API call volume
- System performance
- Security events

Access these metrics from the Super Admin Dashboard.

---

**Last Updated:** 2025-11-04
**Version:** 1.0.0
