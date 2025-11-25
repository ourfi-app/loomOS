// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

/**
 * Email Service
 * 
 * Handles email sending via SendGrid with support for:
 * - HTML and plain text emails
 * - Template rendering
 * - Bulk sending
 * - Email validation
 * - Error handling and retries
 */

import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@montrecott.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Montrecott Condo Association';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  body: string;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
    type?: string;
  }>;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  htmlTemplate: string;
  textTemplate: string;
}

/**
 * Send a single email
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate SendGrid is configured
    if (!SENDGRID_API_KEY) {
      return {
        success: false,
        error: 'Email service not configured. Please add SENDGRID_API_KEY to environment variables.',
      };
    }

    // Validate inputs
    if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
      return { success: false, error: 'No recipients specified' };
    }
    if (!options.subject) {
      return { success: false, error: 'Subject is required' };
    }
    if (!options.body) {
      return { success: false, error: 'Email body is required' };
    }

    // Prepare recipients
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    // Convert plain text to HTML if needed
    const htmlBody = convertTextToHtml(options.body);

    // Build message
    const msg: any = {
      to: recipients,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: options.subject,
      text: options.body,
      html: htmlBody,
    };

    // Add priority headers
    if (options.priority === 'HIGH' || options.priority === 'URGENT') {
      msg.headers = {
        'X-Priority': options.priority === 'URGENT' ? '1' : '2',
        'Importance': options.priority === 'URGENT' ? 'high' : 'high',
      };
    }

    // Add reply-to if specified
    if (options.replyTo) {
      msg.replyTo = options.replyTo;
    }

    // Add attachments if specified
    if (options.attachments && options.attachments.length > 0) {
      msg.attachments = options.attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        type: att.type || 'application/octet-stream',
        disposition: 'attachment',
      }));
    }

    // Send via SendGrid
    const response = await sgMail.send(msg);
    
    return {
      success: true,
      messageId: response[0]?.headers?.['x-message-id'] || 'sent',
    };
  } catch (error: any) {
    console.error('Email send error:', error);
    
    let errorMessage = 'Failed to send email';
    if (error.response) {
      errorMessage = `SendGrid error: ${error.response.body?.errors?.[0]?.message || error.message}`;
    } else {
      errorMessage = error.message || errorMessage;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send bulk emails (to multiple recipients individually)
 */
export async function sendBulkEmails(
  recipients: string[],
  options: Omit<EmailOptions, 'to'>
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Send emails in batches to avoid rate limits
  const batchSize = 50;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const promises = batch.map(recipient =>
      sendEmail({ ...options, to: recipient })
    );

    const batchResults = await Promise.allSettled(promises);
    
    batchResults.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value.success) {
        results.success++;
      } else {
        results.failed++;
        const error = result.status === 'fulfilled' 
          ? result.value.error 
          : (result as any).reason?.message || 'Unknown error';
        results.errors.push(`${batch[idx]}: ${error}`);
      }
    });
  }

  return results;
}

/**
 * Email templates for common scenarios
 */
export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  ANNOUNCEMENT: {
    name: 'Announcement',
    subject: 'Important Announcement',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8a8a8a 0%, #666666 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">{{title}}</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);">
            {{content}}
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>Montrecott Condo Association</p>
          </div>
        </div>
      </div>
    `,
    textTemplate: `{{title}}\n\n{{content}}\n\n---\nMontrecott Condo Association`,
  },
  REMINDER: {
    name: 'Reminder',
    subject: 'Reminder',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #fbbf24; padding: 30px; text-align: center;">
          <h1 style="color: #78350f; margin: 0;">⏰ Reminder</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);">
            {{content}}
          </div>
        </div>
      </div>
    `,
    textTemplate: `⏰ Reminder\n\n{{content}}`,
  },
  URGENT: {
    name: 'Urgent Notice',
    subject: '🚨 Urgent Notice',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚨 Urgent Notice</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9); border-left: 4px solid #ef4444;">
            {{content}}
          </div>
        </div>
      </div>
    `,
    textTemplate: `🚨 URGENT NOTICE\n\n{{content}}`,
  },
};

/**
 * Render email template with variables
 */
export function renderTemplate(template: EmailTemplate, variables: Record<string, string>): { subject: string; html: string; text: string } {
  let html = template.htmlTemplate;
  let text = template.textTemplate;
  let subject = template.subject;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, 'g'), value);
    text = text.replace(new RegExp(placeholder, 'g'), value);
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
  });

  return { subject, html, text };
}

/**
 * Convert plain text to simple HTML
 */
function convertTextToHtml(text: string): string {
  return text
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate multiple email addresses
 */
export function validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  emails.forEach(email => {
    const trimmedEmail = email.trim();
    if (isValidEmail(trimmedEmail)) {
      valid.push(trimmedEmail);
    } else {
      invalid.push(trimmedEmail);
    }
  });

  return { valid, invalid };
}

/**
 * Check if SendGrid is configured
 */
export function isEmailServiceConfigured(): boolean {
  return !!SENDGRID_API_KEY && SENDGRID_API_KEY !== '';
}

