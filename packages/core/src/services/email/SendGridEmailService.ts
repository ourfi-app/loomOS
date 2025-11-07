import sgMail from '@sendgrid/mail';
import { EmailService, EmailMessage, EmailResult } from './EmailService';
import { EmailConfig } from '../config/ServiceConfig';

/**
 * SendGrid Email Service Implementation
 *
 * Implements the EmailService interface using SendGrid.
 */
export class SendGridEmailService implements EmailService {
  private fromEmail: string;
  private fromName?: string;

  constructor(config: EmailConfig) {
    if (!config.apiKey) {
      throw new Error('SendGrid API key is required');
    }

    sgMail.setApiKey(config.apiKey);
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const from = message.from || (this.fromName
      ? `${this.fromName} <${this.fromEmail}>`
      : this.fromEmail);

    const msg: any = {
      to: message.to,
      from,
      subject: message.subject
    };

    if (message.html) msg.html = message.html;
    if (message.text) msg.text = message.text;
    if (message.replyTo) msg.replyTo = message.replyTo;
    if (message.cc) msg.cc = message.cc;
    if (message.bcc) msg.bcc = message.bcc;
    if (message.attachments) {
      msg.attachments = message.attachments.map(att => ({
        filename: att.filename,
        content: typeof att.content === 'string'
          ? att.content
          : att.content.toString('base64'),
        type: att.contentType,
        disposition: 'attachment'
      }));
    }

    const [response] = await sgMail.send(msg);

    return {
      messageId: response.headers['x-message-id'] || '',
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
    const from = this.fromName
      ? `${this.fromName} <${this.fromEmail}>`
      : this.fromEmail;

    const msg = {
      to,
      from,
      templateId,
      dynamicTemplateData: variables
    };

    const [response] = await sgMail.send(msg);

    return {
      messageId: response.headers['x-message-id'] || '',
      accepted: Array.isArray(to) ? to : [to],
      rejected: []
    };
  }
}
