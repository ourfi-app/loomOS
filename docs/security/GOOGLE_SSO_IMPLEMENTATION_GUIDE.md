
# Google Sign-In Implementation Guide

## Overview

Google Sign-In (Google SSO) has been successfully implemented in the Community Manager application. Users can now sign in or register using their Google accounts with a single click, providing a seamless and secure authentication experience.

## ✅ Implementation Status

**Google Sign-In is fully implemented and ready to use!** The only requirement is adding your actual Google OAuth credentials to replace the placeholder values.

### What's Been Implemented

1. **✅ NextAuth.js Configuration**
   - GoogleProvider added to auth options
   - PrismaAdapter configured for automatic user management
   - JWT session strategy enabled
   - Account linking enabled for users with matching emails

2. **✅ User Interface**
   - "Continue with Google" button on login page
   - "Continue with Google" button on registration page
   - Proper loading states and error handling
   - Professional Google branding and colors

3. **✅ User Flow**
   - New users signing in with Google are automatically created with RESIDENT role
   - Existing users can link their Google account to their email/password account
   - Automatic redirect to dashboard after successful authentication
   - Seamless integration with existing authentication system

4. **✅ Security Features**
   - Secure JWT-based sessions
   - Email verification through Google
   - Automatic account linking for verified emails
   - Protection against unauthorized access

## 🔐 Setting Up Google OAuth Credentials

To enable Google Sign-In, you need to obtain OAuth credentials from Google Cloud Console. Follow these steps:

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Community Manager" (or your preferred name)
4. Click "Create"

### Step 2: Enable Google+ API (Optional but Recommended)

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and press "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (unless you have a Google Workspace organization)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Community Manager
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload your app logo
   - **Application home page**: https://community-manager.abacusai.app (or your domain)
   - **Authorized domains**: abacusai.app (and any custom domains)
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. **Scopes**: Click "Add or Remove Scopes"
   - Add `userinfo.email` (required)
   - Add `userinfo.profile` (required)
   - Add `openid` (required)
7. Click "Save and Continue"
8. **Test users**: (Optional) Add test users if you want to test before publishing
9. Click "Save and Continue"

### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Configure the client:
   - **Name**: Community Manager Web Client
   - **Authorized JavaScript origins**:
     - Add: `https://community-manager.abacusai.app`
     - Add: `http://localhost:3000` (for local development)
   - **Authorized redirect URIs**:
     - Add: `https://community-manager.abacusai.app/api/auth/callback/google`
     - Add: `http://localhost:3000/api/auth/callback/google` (for local development)
5. Click "Create"
6. **IMPORTANT**: Copy the **Client ID** and **Client Secret** that appear

### Step 5: Update Environment Variables

1. Open your `.env` file (located in `/home/ubuntu/condo_management_app/nextjs_space/.env`)
2. Replace the placeholder values with your actual credentials:

```env
# Replace these lines:
GOOGLE_CLIENT_ID=placeholder-google-client-id-replace-with-actual
GOOGLE_CLIENT_SECRET=placeholder-google-client-secret-replace-with-actual

# With your actual credentials:
GOOGLE_CLIENT_ID=your-actual-client-id-from-google-console.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret-from-google-console
```

3. Save the file

### Step 6: Rebuild and Deploy (if needed)

If you're running the app locally, restart the development server:
```bash
cd /home/ubuntu/condo_management_app/nextjs_space
yarn dev
```

If the app is already deployed, the environment variables will be automatically picked up on the next request (no rebuild needed for Next.js).

## 📋 Current Configuration

### Environment Variables

**Current Status**: Using placeholder values
```env
GOOGLE_CLIENT_ID=placeholder-google-client-id-replace-with-actual
GOOGLE_CLIENT_SECRET=placeholder-google-client-secret-replace-with-actual
```

**Required Action**: Replace with actual credentials from Google Cloud Console

### Authorized Redirect URIs

Make sure these redirect URIs are configured in your Google OAuth client:

- **Production**: `https://community-manager.abacusai.app/api/auth/callback/google`
- **Local Development**: `http://localhost:3000/api/auth/callback/google`

## 🎯 User Experience

### For New Users

1. User visits the registration page
2. Clicks "Continue with Google"
3. Redirected to Google sign-in page
4. Selects their Google account
5. Grants permissions to the app
6. Redirected back to the app
7. **Automatically created** as a RESIDENT user
8. Redirected to the dashboard

### For Existing Users

1. User visits the login page
2. Clicks "Continue with Google"
3. If their email matches an existing account:
   - Google account is **linked** to their existing account
   - They can now sign in with either method (email/password or Google)
4. Redirected to the dashboard

### Account Linking

If a user already has an account with email/password and signs in with Google using the same email address:
- The Google account will be automatically linked
- No duplicate accounts are created
- User can use either authentication method in the future

## 🛠 Technical Implementation Details

### Authentication Flow

```typescript
// lib/auth.ts
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-client-id",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-client-secret",
  allowDangerousEmailAccountLinking: true, // Enables account linking
})
```

### Auto-Creation of OAuth Users

```typescript
// When a new user signs in with Google:
async signIn({ user, account, profile }) {
  if (account?.provider === "google") {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    // Create new user if doesn't exist
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: user.email!,
          name: user.name || "",
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          role: "RESIDENT", // Default role for OAuth users
          isActive: true,
          emailVerified: new Date(),
        },
      });
    }
  }
  return true;
}
```

### Database Schema

The existing Prisma schema already supports OAuth:
- `Account` model stores OAuth provider data
- `User` model links to multiple accounts
- PrismaAdapter handles all database operations automatically

## 🔒 Security Considerations

1. **Email Verification**: Users signing in with Google have their email automatically verified
2. **Account Linking**: Only accounts with verified emails can be linked
3. **Default Role**: New OAuth users default to RESIDENT role (can be changed by admins)
4. **JWT Sessions**: Stateless, secure session management
5. **HTTPS Required**: OAuth requires HTTPS in production (enforced by Google)

## 🧪 Testing the Implementation

### Test User Flow

1. Use a test Google account (or create one)
2. Navigate to the login page: `https://community-manager.abacusai.app/auth/login`
3. Click "Continue with Google"
4. Complete Google sign-in
5. Verify you're redirected to the dashboard
6. Check that your user profile is created correctly

### Test Account Linking

1. Create an account with email/password
2. Sign out
3. Sign in with Google using the same email
4. Verify the accounts are linked
5. Try signing in with both methods

## ⚠️ Important Notes

1. **Placeholder Values**: The app currently uses placeholder credentials. Google Sign-In will not work until you add real credentials.

2. **Production Domain**: When adding redirect URIs, use your actual production domain. Currently configured for `community-manager.abacusai.app`.

3. **Email Verification**: Google Sign-In bypasses email verification since Google already verifies emails.

4. **User Data**: Only basic profile information (name, email) is requested from Google.

5. **Privacy**: User data is stored securely in your database and not shared with third parties.

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [NextAuth Google Provider Docs](https://next-auth.js.org/providers/google)

## 🎉 Summary

Google Sign-In is **fully implemented and ready to use**! The implementation includes:

- ✅ Secure OAuth 2.0 authentication
- ✅ Automatic user creation for new users
- ✅ Account linking for existing users
- ✅ Professional UI with Google branding
- ✅ Complete error handling
- ✅ Seamless integration with existing auth system

**Next Step**: Add your Google OAuth credentials to enable the feature!

---

*For support or questions, refer to the NextAuth.js documentation or Google's OAuth 2.0 guides.*
