
/**
 * Help Content Structure
 * Contains FAQ and feature documentation for all apps
 */

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  appId?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_CATEGORIES = [
  'Getting Started',
  'Navigation',
  'Messages',
  'Documents',
  'Directory',
  'Payments',
  'Account',
  'Technical'
] as const;

export const APP_CATEGORIES = [
  'Core Apps',
  'Communication',
  'Management',
  'Community',
  'Admin Tools'
] as const;

export const faqItems: FAQItem[] = [
  // Getting Started
  {
    id: 'faq-1',
    question: 'How do I get started with the app?',
    answer: 'After logging in, you\'ll be guided through a welcome tutorial that shows you the basics of navigation. You can access the tutorial anytime from the Help menu.',
    category: 'Getting Started'
  },
  {
    id: 'faq-2',
    question: 'What is my role in the system?',
    answer: 'Your role (Resident or Admin) determines what features you can access. Residents can view community information, send messages, and manage their household. Admins have additional access to management tools, user administration, and system settings.',
    category: 'Getting Started'
  },
  {
    id: 'faq-3',
    question: 'How do I change my password?',
    answer: 'Go to your Profile page from the dock, scroll down to the "Change Password" section, enter your current password and new password, then click "Update Password".',
    category: 'Account'
  },

  // Navigation
  {
    id: 'faq-4',
    question: 'How do I navigate between apps?',
    answer: 'Use the dock at the bottom of the screen to switch between apps. Click on any app icon to open it. On desktop, you can also open multiple apps in separate windows.',
    category: 'Navigation'
  },
  {
    id: 'faq-5',
    question: 'What gestures can I use on mobile?',
    answer: 'Swipe left or right to navigate between views. Swipe down from the top to see notifications. Pull down on lists to refresh. Long-press items for additional options.',
    category: 'Navigation'
  },
  {
    id: 'faq-6',
    question: 'How do I use the app launcher?',
    answer: 'Click the grid icon in the dock to open the app launcher. Here you can see all available apps, search for specific apps, and quickly launch them.',
    category: 'Navigation'
  },

  // Messages
  {
    id: 'faq-7',
    question: 'How do I send a message?',
    answer: 'Open the Messages app from the dock, click "New Message", select recipients from the directory, write your message, and click "Send".',
    category: 'Messages'
  },
  {
    id: 'faq-8',
    question: 'Can I send messages to multiple people?',
    answer: 'Yes! When creating a new message, you can select multiple recipients. You can also create groups for frequently messaged contacts.',
    category: 'Messages'
  },
  {
    id: 'faq-9',
    question: 'How do I know if someone read my message?',
    answer: 'Messages show read receipts when the recipient has opened and viewed your message. Look for the "Read" indicator below the message.',
    category: 'Messages'
  },

  // Documents
  {
    id: 'faq-10',
    question: 'How do I upload documents?',
    answer: 'Open the Documents app, navigate to the folder where you want to upload, click the "Upload" button, select your file(s), and they\'ll be uploaded to the cloud.',
    category: 'Documents'
  },
  {
    id: 'faq-11',
    question: 'What file types can I upload?',
    answer: 'You can upload PDFs, Word documents, Excel spreadsheets, images (JPG, PNG), and other common file types. Each file can be up to 50MB.',
    category: 'Documents'
  },
  {
    id: 'faq-12',
    question: 'How do I share documents with others?',
    answer: 'Click on any document, then click the "Share" button. You can generate a shareable link or select specific residents to share with.',
    category: 'Documents'
  },

  // Directory
  {
    id: 'faq-13',
    question: 'How do I find someone in the directory?',
    answer: 'Open the Directory app and use the search bar at the top. You can search by name, unit number, or email address.',
    category: 'Directory'
  },
  {
    id: 'faq-14',
    question: 'How do I update my household information?',
    answer: 'Go to the My Household app from the dock. Here you can add/remove family members, update contact information, and manage your household details.',
    category: 'Directory'
  },
  {
    id: 'faq-15',
    question: 'Can I control who sees my contact information?',
    answer: 'Yes. In your Profile settings, you can control the visibility of your phone number, email, and other personal information.',
    category: 'Directory'
  },

  // Payments
  {
    id: 'faq-16',
    question: 'How do I make a payment?',
    answer: 'Open the Payments app, view your upcoming dues, and click "Pay Now". You\'ll be redirected to a secure payment page powered by Stripe.',
    category: 'Payments'
  },
  {
    id: 'faq-17',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit cards, debit cards, and ACH bank transfers through our secure payment processor, Stripe.',
    category: 'Payments'
  },
  {
    id: 'faq-18',
    question: 'Can I view my payment history?',
    answer: 'Yes! In the Payments app, scroll down to see your complete payment history, including receipts for all past transactions.',
    category: 'Payments'
  },

  // Technical
  {
    id: 'faq-19',
    question: 'Is my data secure?',
    answer: 'Yes. All data is encrypted in transit and at rest. We use industry-standard security practices and comply with data protection regulations.',
    category: 'Technical'
  },
  {
    id: 'faq-20',
    question: 'Can I use this app offline?',
    answer: 'Some features work offline, like viewing previously loaded messages and documents. However, sending messages and uploading files requires an internet connection.',
    category: 'Technical'
  },
  {
    id: 'faq-21',
    question: 'What browsers are supported?',
    answer: 'The app works best on modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). Mobile apps are available for iOS and Android.',
    category: 'Technical'
  }
];

export const helpArticles: HelpArticle[] = [
  // Getting Started
  {
    id: 'help-1',
    title: 'Welcome to Montrecott Community App',
    category: 'Getting Started',
    content: `
# Welcome to Montrecott Community App

This guide will help you get started with your community management platform.

## First Steps

1. **Complete your profile**: Add your contact information and photo
2. **Explore the dock**: The dock at the bottom shows your main apps
3. **Check messages**: Stay connected with your community
4. **Review documents**: Access important community documents

## Key Features

- **Messages**: Communicate with neighbors and the board
- **Documents**: Access forms, rules, and important files
- **Directory**: Find contact information for residents
- **Payments**: View and pay your monthly dues
- **Calendar**: Stay informed about community events

## Need Help?

Click the Help button in the status bar anytime to access this guide, search documentation, or view FAQs.
    `,
    tags: ['getting started', 'welcome', 'introduction']
  },

  // Navigation
  {
    id: 'help-2',
    title: 'Navigation Basics',
    category: 'Navigation',
    content: `
# Navigation Basics

Learn how to navigate efficiently through the app.

## The Dock

The dock at the bottom of your screen is your command center:

- **Home**: Return to the dashboard
- **App Launcher**: Access all apps (grid icon)
- **Messages**: Quick access to messaging
- **Documents**: View and manage documents
- **Directory**: Find resident information
- **Payments**: Manage your dues
- **Profile**: Update your information

## Desktop Mode

On larger screens, you can:

- Open multiple apps in separate windows
- Resize and arrange windows
- Use keyboard shortcuts (press ? to view)

## Mobile Gestures

- **Swipe left/right**: Navigate between sections
- **Pull down**: Refresh content
- **Long press**: Access context menus
- **Swipe down from top**: View notifications
    `,
    tags: ['navigation', 'dock', 'gestures', 'mobile']
  },

  // Messages App
  {
    id: 'help-3',
    title: 'Messages App Guide',
    category: 'Messages',
    appId: 'messages',
    content: `
# Messages App Guide

Stay connected with your community through the Messages app.

## Sending Messages

1. Click **New Message** button
2. Select recipients from the directory
3. Type your message
4. Click **Send**

## Message Features

- **Attachments**: Add files to your messages
- **Read Receipts**: See when messages are read
- **Reply**: Respond to specific messages
- **Search**: Find past conversations quickly

## Group Conversations

Create groups for:
- Building committees
- Floor neighbors
- Event planning

## Notifications

You'll receive notifications for:
- New messages
- Message replies
- Important announcements from the board

## Privacy

- Messages are private between sender and recipients
- Board members can send announcements to all residents
- You control who can message you in settings
    `,
    tags: ['messages', 'communication', 'chat', 'notifications']
  },

  // Documents App
  {
    id: 'help-4',
    title: 'Documents App Guide',
    category: 'Documents',
    appId: 'documents',
    content: `
# Documents App Guide

Access, upload, and manage community documents.

## Document Categories

- **Rules & Regulations**: Community policies
- **Forms**: Applications and request forms
- **Minutes**: Board meeting records
- **Financials**: Budgets and reports (admin only)
- **Maintenance**: Service schedules and logs

## Uploading Documents

1. Navigate to the appropriate folder
2. Click **Upload** button
3. Select file(s) from your device
4. Add description and tags (optional)
5. Click **Upload**

## Viewing Documents

- Click any document to view
- Use the preview for PDFs and images
- Download files for offline access

## Sharing Documents

Click the share icon to:
- Generate a shareable link
- Share with specific residents
- Set expiration dates (admins)

## Organization Tips

- Use folders to organize by category
- Add tags for easy searching
- Star important documents for quick access
    `,
    tags: ['documents', 'files', 'upload', 'share']
  },

  // Directory App
  {
    id: 'help-5',
    title: 'Directory App Guide',
    category: 'Directory',
    appId: 'directory',
    content: `
# Directory App Guide

Find and connect with your neighbors.

## Finding Residents

Use the search bar to find by:
- Name
- Unit number
- Email address
- Phone number

## Resident Profiles

View information such as:
- Contact details
- Unit number
- Move-in date
- Household members
- Pets

## Privacy Controls

Control what information you share:
1. Go to Profile > Privacy Settings
2. Toggle visibility for:
   - Phone number
   - Email address
   - Household details
   - Pet information

## Household Management

In the My Household app, you can:
- Add family members
- Register pets
- Update contact information
- Add additional residents

## Directory Requests

If you need to update information:
1. Submit a directory update request
2. Admin will review and approve
3. Changes appear in the directory
    `,
    tags: ['directory', 'residents', 'contact', 'privacy']
  },

  // Payments App
  {
    id: 'help-6',
    title: 'Payments App Guide',
    category: 'Payments',
    appId: 'payments',
    content: `
# Payments App Guide

Manage your monthly dues and payment history.

## Viewing Dues

The Payments app shows:
- Current month's dues
- Due date
- Payment status
- Amount owed

## Making Payments

1. Click **Pay Now** button
2. You'll be redirected to secure payment page
3. Enter payment information
4. Confirm payment
5. Receive confirmation email

## Payment Methods

Accepted payment methods:
- Credit cards (Visa, Mastercard, Amex, Discover)
- Debit cards
- ACH bank transfer

All payments processed securely through Stripe.

## Payment History

View past payments:
- Payment date
- Amount paid
- Payment method
- Receipt (download PDF)

## Auto-Pay

Set up automatic monthly payments:
1. Go to Payment Settings
2. Enable Auto-Pay
3. Select payment method
4. Confirm

## Payment Issues

If you have payment questions:
- Contact the board through Messages
- Email treasurer@montrecott.com
- Call the management office
    `,
    tags: ['payments', 'dues', 'billing', 'stripe']
  },

  // Profile Management
  {
    id: 'help-7',
    title: 'Profile Management',
    category: 'Account',
    content: `
# Profile Management

Keep your profile information up to date.

## Personal Information

Update your:
- Name
- Email address
- Phone number
- Profile photo

## Changing Password

1. Go to Profile app
2. Scroll to "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password
6. Click **Update Password**

## Unit Information

View your:
- Unit number
- Move-in date
- Ownership status
- Household composition

## Privacy Settings

Control visibility of:
- Contact information
- Household details
- Pet information
- Profile photo

## Notification Preferences

Choose how you receive notifications:
- Email notifications
- Push notifications
- In-app notifications
- Notification frequency

## Account Security

Best practices:
- Use a strong, unique password
- Enable two-factor authentication (if available)
- Log out from shared devices
- Review account activity regularly
    `,
    tags: ['profile', 'account', 'password', 'security']
  },

  // Admin Features
  {
    id: 'help-8',
    title: 'Admin Features',
    category: 'Admin Tools',
    content: `
# Admin Features

Guide for board members and administrators.

## User Management

Manage residents:
- Add new users
- Edit user information
- Activate/deactivate accounts
- Assign roles

## Document Management

Admin document features:
- Upload to all categories
- Set document permissions
- Create folders
- Archive old documents

## Announcement System

Send announcements to:
- All residents
- Specific units
- By building section

## Payment Administration

View and manage:
- Payment records
- Outstanding balances
- Payment disputes
- Generate reports

## Directory Management

Approve:
- New resident registrations
- Information update requests
- Household changes

## System Settings

Configure:
- Organization details
- Email templates
- System preferences
- Integration settings

## Reports

Generate reports for:
- Payment history
- Resident directory
- Document access logs
- System usage statistics
    `,
    tags: ['admin', 'management', 'board', 'administration']
  }
];

// Search function
export function searchHelpContent(query: string): (HelpArticle | FAQItem)[] {
  const lowercaseQuery = query.toLowerCase().trim();
  
  if (!lowercaseQuery) return [];

  const results: (HelpArticle | FAQItem)[] = [];

  // Search FAQ
  faqItems.forEach(faq => {
    if (
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery) ||
      faq.category.toLowerCase().includes(lowercaseQuery)
    ) {
      results.push(faq);
    }
  });

  // Search help articles
  helpArticles.forEach(article => {
    if (
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.includes(lowercaseQuery)) ||
      article.category.toLowerCase().includes(lowercaseQuery)
    ) {
      results.push(article);
    }
  });

  return results;
}

// Get articles by app
export function getArticlesByApp(appId: string): HelpArticle[] {
  return helpArticles.filter(article => article.appId === appId);
}

// Get FAQs by category
export function getFAQsByCategory(category: string): FAQItem[] {
  return faqItems.filter(faq => faq.category === category);
}
