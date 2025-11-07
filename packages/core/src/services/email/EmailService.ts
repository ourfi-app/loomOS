/**
 * Email Service Interface
 *
 * This interface abstracts email sending operations, allowing the application
 * to work with different email providers (SendGrid, Resend, SMTP) without changing code.
 */

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

export interface EmailService {
  /**
   * Send a single email
   */
  send(message: EmailMessage): Promise<EmailResult>;

  /**
   * Send multiple emails (batch)
   */
  sendBatch(messages: EmailMessage[]): Promise<EmailResult[]>;

  /**
   * Send using a template (provider-specific)
   */
  sendTemplate(
    to: string | string[],
    templateId: string,
    variables: Record<string, any>
  ): Promise<EmailResult>;
}
