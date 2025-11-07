import { Resend } from 'resend';
import { EmailService, EmailMessage, EmailResult } from './EmailService';
import { EmailConfig } from '../config/ServiceConfig';

/**
 * Resend Email Service Implementation
 *
 * Implements the EmailService interface using Resend.
 */
export class ResendEmailService implements EmailService {
  private client: Resend;
  private fromEmail: string;
  private fromName?: string;

  constructor(config: EmailConfig) {
    if (!config.apiKey) {
      throw new Error('Resend API key is required');
    }

    this.client = new Resend(config.apiKey);
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const from = message.from || (this.fromName
      ? `${this.fromName} <${this.fromEmail}>`
      : this.fromEmail);

    const emailOptions: any = {
      from,
      to: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject
    };

    // Resend requires either html or text
    if (message.html) emailOptions.html = message.html;
    if (message.text) emailOptions.text = message.text;
    if (message.replyTo) emailOptions.replyTo = message.replyTo;
    if (message.cc) emailOptions.cc = message.cc;
    if (message.bcc) emailOptions.bcc = message.bcc;
    if (message.attachments) {
      emailOptions.attachments = message.attachments.map(att => ({
        filename: att.filename,
        content: typeof att.content === 'string'
          ? att.content
          : att.content.toString('base64')
      }));
    }

    const result = await this.client.emails.send(emailOptions);

    if (result.error) {
      throw new Error(`Resend error: ${result.error.message}`);
    }

    return {
      messageId: result.data?.id || '',
      accepted: Array.isArray(message.to) ? message.to : [message.to],
      rejected: []
    };
  }

  async sendBatch(messages: EmailMessage[]): Promise<EmailResult[]> {
    return Promise.all(messages.map(msg => this.send(msg)));
  }

  async sendTemplate(
    to: string | string[],
    templateId: string,
    variables: Record<string, any>
  ): Promise<EmailResult> {
    // Resend doesn't have built-in template support like SendGrid
    // You would need to implement your own template rendering
    // or use React Email (https://react.email)
    throw new Error('Template sending not yet implemented for Resend. Consider using React Email.');
  }
}
