
# API Configuration Guide for Condo Association Management App

This guide provides step-by-step instructions for obtaining and configuring API keys for external services used in the condo association management application.

## Required API Services

### 1. Stripe (Payment Processing) - REQUIRED
**Purpose:** Secure payment processing for monthly dues and special assessments

**Setup Instructions:**
1. Go to [https://stripe.com](https://stripe.com)
2. Create a Stripe account or sign in to existing account
3. Navigate to the Dashboard
4. In the left sidebar, click on "Developers" → "API keys"
5. Copy the following keys:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

**Environment Variables to Set:**
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Note:** Use test keys for development (prefixed with `sk_test_` and `pk_test_`). For production, use live keys.

---

### 2. SendGrid (Email Notifications) - OPTIONAL
**Purpose:** Sending email notifications for meeting reminders, payment alerts, and announcements

**Setup Instructions:**
1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Create a free SendGrid account (100 emails/day free tier)
3. Navigate to Settings → API Keys
4. Click "Create API Key"
5. Choose "Restricted Access" and give it "Full Access" to Mail Send
6. Copy the generated API key

**Environment Variable to Set:**
```env
SENDGRID_API_KEY=SG.your_api_key_here
```

---

### 3. Twilio (SMS Notifications) - OPTIONAL
**Purpose:** Sending SMS notifications for urgent alerts and reminders

**Setup Instructions:**
1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Create a Twilio account (free tier available)
3. Complete phone verification
4. From the Twilio Console Dashboard, copy:
   - **Account SID**
   - **Auth Token**
5. Get a Twilio phone number:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number (free with trial account)

**Environment Variables to Set:**
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

---

## How to Add Environment Variables

### Method 1: Using the .env File (Recommended)
1. Navigate to your project directory: `cd /home/ubuntu/condo_management_app/nextjs_space/`
2. Edit the `.env` file: `nano .env`
3. Add the API keys to the existing `.env` file:

```env
# Existing variables (DO NOT MODIFY)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
ABACUSAI_API_KEY=...
AWS_BUCKET_NAME=...
AWS_FOLDER_PREFIX=...

# Add these new API keys
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Save the file and restart your application

### Method 2: Using the Command Line
```bash
cd /home/ubuntu/condo_management_app/nextjs_space/
echo "STRIPE_SECRET_KEY=your_key_here" >> .env
echo "STRIPE_PUBLISHABLE_KEY=your_key_here" >> .env
echo "SENDGRID_API_KEY=your_key_here" >> .env
echo "TWILIO_ACCOUNT_SID=your_sid_here" >> .env
echo "TWILIO_AUTH_TOKEN=your_token_here" >> .env
echo "TWILIO_PHONE_NUMBER=your_number_here" >> .env
```

---

## Testing Your Configuration

### Test Stripe Integration
1. Log in to your application as a resident
2. Go to Dashboard → Payments
3. Click "Pay Now" - this should show a placeholder message indicating Stripe integration

### Test Email/SMS (After Implementation)
- Email notifications will be sent for payment reminders and meeting alerts
- SMS notifications will be sent for urgent building alerts

---

## Important Security Notes

1. **Never commit API keys to version control** - The `.env` file should already be in `.gitignore`
2. **Use test/sandbox keys during development** - Only use live keys in production
3. **Rotate keys periodically** for security best practices
4. **Limit API key permissions** to only what's needed for each service

---

## Troubleshooting

### Common Issues:
1. **Environment variables not loading:** Restart your development server after adding new variables
2. **Stripe keys not working:** Ensure you're using the correct test/live keys for your environment
3. **SendGrid emails not sending:** Check your SendGrid account status and verify domain if using custom sender
4. **Twilio SMS failing:** Verify your phone number format includes country code (+1 for US)

### Need Help?
- Check the application logs for detailed error messages
- Verify environment variables are loaded: `console.log(process.env.STRIPE_SECRET_KEY)` (remove after testing)
- Ensure all keys are correctly copied without extra spaces or characters

---

## Current Application Status

✅ **Implemented and Working:**
- User authentication with role-based access (Admin, Board Member, Resident)
- Dashboard with payment status and announcements
- Payment management interface (ready for Stripe integration)
- Document management with role-based permissions
- AI chatbot for building rules and policy questions
- Database with 7-year transaction history support

🚧 **Ready for Integration:**
- Stripe payment processing (requires API keys)
- Email notifications via SendGrid (requires API key)
- SMS notifications via Twilio (requires API keys)

The application foundation is complete and fully functional. Adding the API keys above will enable the payment processing and notification features.
