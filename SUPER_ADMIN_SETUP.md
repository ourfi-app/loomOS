# Super Admin Setup Guide

This guide explains how to create a super admin user for loomOS in different environments.

## 🏠 Local Development

If you're running the app locally:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Create super admin
npm run create-super-admin
```

**Default Credentials:**
- Email: `superadmin@trellis.com`
- Password: `SuperAdmin123!`
- Access: `http://localhost:3000/dashboard/super-admin`

---

## ☁️ Render Deployment

To create a super admin on your Render deployment:

### Method 1: Using Render Shell (Recommended)

1. Go to your Render dashboard
2. Open your `community-manager` service
3. Click on **"Shell"** in the left sidebar
4. Run this command:

```bash
npm run create-super-admin
```

### Method 2: Using the Shell Script

If the npm script doesn't work, try:

```bash
bash scripts/create-super-admin-render.sh
```

### Method 3: One-Time Manual Command

Copy and paste this into the Render shell:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  const email = 'superadmin@trellis.com';
  const password = 'SuperAdmin123!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Super Admin already exists:', email);
    await prisma.\$disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      organizationId: null,
      isActive: true,
      onboardingCompleted: true,
    }
  });

  console.log('✅ Super Admin created!');
  console.log('Email:', email);
  console.log('Password:', password);
  await prisma.\$disconnect();
})();
"
```

---

## 🔐 Security Notes

**⚠️ IMPORTANT:**

1. **Change the default password immediately** after first login
2. The default credentials are publicly known and should only be used for initial setup
3. Use a strong, unique password for production deployments
4. Consider enabling 2FA once logged in

---

## 📍 Access URLs

### Local Development
- Dashboard: `http://localhost:3000/dashboard/super-admin`
- Login: `http://localhost:3000/auth/login`

### Render Production
- Dashboard: `https://your-app.onrender.com/dashboard/super-admin`
- Login: `https://your-app.onrender.com/auth/login`

(Replace `your-app` with your actual Render service URL)

---

## 🔍 Troubleshooting

### "Super Admin already exists"
If you see this message, a super admin has already been created. You can either:
- Use the existing credentials
- Reset the password via the database
- Create a different admin user with a different email

### "Cannot find module @prisma/client"
Make sure Prisma client is generated:
```bash
npx prisma generate
```

### "Database connection error"
Check that:
1. `DATABASE_URL` environment variable is set correctly
2. Database is running and accessible
3. Network connectivity is working

### "Permission denied" on Render
The Render shell might need the script to be run differently. Try:
```bash
sh scripts/create-super-admin-render.sh
```

---

## 📝 Creating Additional Admin Users

Once logged in as super admin, you can create additional users through the web interface:

1. Navigate to `/dashboard/super-admin/users`
2. Click "Create User"
3. Set their role to ADMIN or SUPER_ADMIN as needed

---

## 🛠 Alternative: Direct Database Access

If all else fails, you can create a super admin directly in the database:

```sql
-- Generate a bcrypt hash for "SuperAdmin123!" first
-- Hash: $2a$10$gvXDEE6tfJjT0B/xw/jqq.uQ2Q6nEpQTzYxRBMCKp3IhpxNf4o0SO

INSERT INTO users (
  id, email, password, "firstName", "lastName", name, role,
  "organizationId", "isActive", "onboardingCompleted", "updatedAt"
)
VALUES (
  'user_superadmin_' || substr(md5(random()::text), 1, 10),
  'superadmin@trellis.com',
  '$2a$10$gvXDEE6tfJjT0B/xw/jqq.uQ2Q6nEpQTzYxRBMCKp3IhpxNf4o0SO',
  'Super',
  'Admin',
  'Super Admin',
  'SUPER_ADMIN',
  NULL,
  true,
  true,
  CURRENT_TIMESTAMP
);
```

You can run this SQL in your Render PostgreSQL database console.
