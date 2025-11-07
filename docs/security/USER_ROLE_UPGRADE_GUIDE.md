
# User Role Upgrade Guide

## Overview
This guide explains how to upgrade user roles in the Community Manager application.

## Available User Roles

| Role | Access Level | Description |
|------|-------------|-------------|
| **SUPER_ADMIN** | Platform-wide | Manages all organizations across the platform |
| **ADMIN** | Organization | Full admin access within their organization |
| **BOARD_MEMBER** | Limited Admin | Board member with some admin privileges |
| **RESIDENT** | Standard | Regular resident user access |

---

## Method 1: Use the Upgrade Script (Recommended)

### Step 1: Edit the Script
```bash
nano /home/ubuntu/condo_management_app/nextjs_space/scripts/upgrade-user-to-admin.ts
```

Change this line:
```typescript
const userEmail = 'your-email@example.com';
```

To your actual email:
```typescript
const userEmail = 'your-actual-email@example.com';
```

### Step 2: Run the Script
```bash
cd /home/ubuntu/condo_management_app/nextjs_space
yarn tsx scripts/upgrade-user-to-admin.ts
```

### Expected Output:
```
🔧 Upgrading user to ADMIN...

✅ User upgraded successfully!
   Email: your-email@example.com
   Name: Your Name
   Role: ADMIN

🎉 You can now access admin features!
```

---

## Method 2: Create a Super Admin Account

Use the pre-existing super admin script:

```bash
cd /home/ubuntu/condo_management_app/nextjs_space
yarn tsx scripts/create-super-admin.ts
```

### Login Credentials:
- **Email:** `superadmin@trellis.com`
- **Password:** `SuperAdmin123!`

⚠️ **Important:** Change this password after first login!

---

## Method 3: Use Prisma Studio (Visual Database Editor)

### Step 1: Launch Prisma Studio
```bash
cd /home/ubuntu/condo_management_app/nextjs_space
yarn prisma studio
```

This opens a web interface (usually at `http://localhost:5555`)

### Step 2: Edit User Role
1. Click on **"User"** table in the left sidebar
2. Find your user by searching for your email
3. Click on the **role** field
4. Change from `RESIDENT` to `ADMIN` (or `SUPER_ADMIN`)
5. Click **Save** button

---

## Method 4: Direct Database Query

For advanced users, you can use direct Prisma commands:

```bash
cd /home/ubuntu/condo_management_app/nextjs_space
yarn prisma studio
```

Or create a custom script:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.user.update({
  where: { email: 'your-email@example.com' },
  data: { role: 'ADMIN' }
});
```

---

## Verification

After upgrading your role:

1. **Log out** of the application
2. **Log back in** with your credentials
3. You should now see admin features like:
   - Admin Dashboard
   - User Management
   - System Settings
   - Organization Settings

---

## Troubleshooting

### "User not found"
- Double-check your email address
- Ensure you're using the exact email from registration

### "Still don't see admin features"
- Clear browser cache and cookies
- Log out completely and log back in
- Check if your session was refreshed

### "Can't run the script"
```bash
# Make sure you're in the right directory
cd /home/ubuntu/condo_management_app/nextjs_space

# Install dependencies if needed
yarn install

# Try running with full path
yarn tsx /home/ubuntu/condo_management_app/nextjs_space/scripts/upgrade-user-to-admin.ts
```

---

## Scripts Available

The following role management scripts are available:

1. **`upgrade-user-to-admin.ts`** - Upgrade existing user to ADMIN
2. **`create-admin.ts`** - Create a specific admin account
3. **`create-super-admin.ts`** - Create platform super admin
4. **`seed.ts`** - Seed database with test users

All scripts located in: `/home/ubuntu/condo_management_app/nextjs_space/scripts/`

---

## Security Notes

- ⚠️ Super Admin accounts have **full platform access**
- 🔒 Always use strong passwords for admin accounts
- 🔑 Change default passwords immediately after creation
- 👥 Limit the number of admin accounts to trusted personnel
- 📝 Keep a log of who has admin access

---

## Related Documentation

- Database Schema: `prisma/schema.prisma`
- Authentication: `/app/api/auth/[...nextauth]/route.ts`
- Role-based Access: Middleware and route guards throughout the app

---

*Created: October 27, 2025*
*Last Updated: October 27, 2025*
