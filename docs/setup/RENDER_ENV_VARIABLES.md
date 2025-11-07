# Environment Variables for Render Deployment

Copy these values into Render Dashboard → Environment

## ✅ REQUIRED VARIABLES (Must have these 4)

### Database
Key: DATABASE_URL
Value: postgresql://role_73379eddb:bZX1aDQkAIOMzg2qqnxBKyf0nKDUBwWa@db-73379eddb.db002.hosteddb.reai.io:5432/73379eddb

### Authentication - NEXTAUTH_SECRET
Key: NEXTAUTH_SECRET
Value: +315B1Eum4OwO8eFHP9ZvfG3wUY8BoliJl7JcmTxU8Q=

### Authentication - NEXTAUTH_URL
Key: NEXTAUTH_URL
Value: https://YOUR-SERVICE-NAME.onrender.com
⚠️ UPDATE THIS after creating your Render service with your actual service name!

### AbacusAI
Key: ABACUSAI_API_KEY
Value: UA48fbmZtIX9ODzFaLAOn8HQr4DCn9i3

### Node Version
Key: NODE_VERSION
Value: 20.11.0

---

## 📦 OPTIONAL VARIABLES (Add only if using these features)

### AWS S3 (for file uploads)
Key: AWS_REGION
Value: us-east-1

Key: AWS_BUCKET_NAME
Value: YOUR-BUCKET-NAME

Key: AWS_FOLDER_PREFIX
Value: community-manager

Key: AWS_ACCESS_KEY_ID
Value: YOUR-AWS-ACCESS-KEY-ID

Key: AWS_SECRET_ACCESS_KEY
Value: YOUR-AWS-SECRET-ACCESS-KEY

---

### Mapbox (for Property Map feature)
Get token at: https://account.mapbox.com/access-tokens/

Key: NEXT_PUBLIC_MAPBOX_TOKEN
Value: YOUR-MAPBOX-TOKEN

---

### Google OAuth (for Google login)
Get from: https://console.cloud.google.com/

Key: GOOGLE_CLIENT_ID
Value: YOUR-GOOGLE-CLIENT-ID.apps.googleusercontent.com

Key: GOOGLE_CLIENT_SECRET
Value: YOUR-GOOGLE-CLIENT-SECRET

---

### Microsoft OAuth (for Microsoft login)
Get from: https://portal.azure.com/

Key: MICROSOFT_CLIENT_ID
Value: YOUR-MICROSOFT-CLIENT-ID

Key: MICROSOFT_CLIENT_SECRET
Value: YOUR-MICROSOFT-CLIENT-SECRET

Key: MICROSOFT_TENANT_ID
Value: YOUR-MICROSOFT-TENANT-ID

---

### Stripe (for payment processing)
Get from: https://dashboard.stripe.com/apikeys

Key: STRIPE_SECRET_KEY
Value: sk_test_YOUR-STRIPE-SECRET-KEY

Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_YOUR-STRIPE-PUBLISHABLE-KEY

Key: STRIPE_WEBHOOK_SECRET
Value: whsec_YOUR-STRIPE-WEBHOOK-SECRET

---

### SendGrid (for email notifications)
Get from: https://app.sendgrid.com/settings/api_keys

Key: SENDGRID_API_KEY
Value: SG.YOUR-SENDGRID-API-KEY

Key: SENDGRID_FROM_EMAIL
Value: noreply@yourdomain.com

Key: SENDGRID_FROM_NAME
Value: Community Manager

---

## 📋 How to Add These in Render

1. Go to: https://dashboard.render.com
2. Select your web service
3. Click "Environment" in left sidebar
4. For each variable above:
   - Click "Add Environment Variable"
   - Copy the Key
   - Copy the Value
   - Click "Add"
5. Click "Save Changes" when done
6. Render will automatically redeploy

---

## ⚡ Quick Start

**Minimum to deploy (start with these 5):**
1. DATABASE_URL ✅
2. NEXTAUTH_SECRET ✅
3. NEXTAUTH_URL ⚠️ (update after service creation)
4. ABACUSAI_API_KEY ✅
5. NODE_VERSION ✅

**Add optional variables later as you need features**

---

## 🔄 Post-Deployment Steps

1. After your service is created, note the URL:
   Example: https://community-manager-xyz123.onrender.com

2. Update NEXTAUTH_URL:
   - Go to Environment tab
   - Find NEXTAUTH_URL
   - Click Edit
   - Replace YOUR-SERVICE-NAME with your actual URL
   - Save

3. Test your deployment!

---

## 🛡️ Security Notes

- Never commit these values to git
- Keep all secrets secure
- Render encrypts environment variables
- Use .env.local for local development only
- Rotate secrets regularly in production

---

Last Updated: 2025-11-03
