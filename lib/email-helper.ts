/**
 * Email Helper Utilities
 * Provides safe access to the email service and common email templates
 */

import { ServiceRegistry } from '@/packages/core/src/services/ServiceRegistry';
import { loadServiceConfig } from '@/packages/core/src/services/config/loadServiceConfig';
import type { EmailService } from '@/packages/core/src/services/email/EmailService';

/**
 * Get email service with lazy initialization
 */
export function getEmailService(): EmailService {
  if (!ServiceRegistry.isInitialized()) {
    ServiceRegistry.initialize(loadServiceConfig());
  }
  return ServiceRegistry.get().email;
}

/**
 * Generate a verification email HTML
 */
export function generateVerificationEmail(
  displayName: string,
  verificationUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Developer Account</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #F18825 0%, #ff9f4a 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to loomOS</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #F18825; margin-top: 0;">Verify Your Developer Account</h2>

    <p>Hi ${displayName},</p>

    <p>Thank you for registering as a developer on loomOS! To complete your registration and start publishing apps, please verify your email address.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background: #F18825; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
    </div>

    <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
    <p style="background: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 13px; color: #666;">${verificationUrl}</p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #999; font-size: 12px; margin: 0;">If you didn't create a developer account, you can safely ignore this email.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate an app submission notification email HTML
 */
export function generateAppSubmissionEmail(
  appName: string,
  developerName: string,
  version: string,
  submissionId: string,
  reviewUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New App Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #F18825 0%, #ff9f4a 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">New App Submission</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #F18825; margin-top: 0;">App Ready for Review</h2>

    <p>A new app version has been submitted for review:</p>

    <div style="background: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 8px 0;"><strong>App Name:</strong> ${appName}</p>
      <p style="margin: 8px 0;"><strong>Developer:</strong> ${developerName}</p>
      <p style="margin: 8px 0;"><strong>Version:</strong> ${version}</p>
      <p style="margin: 8px 0;"><strong>Submission ID:</strong> ${submissionId}</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${reviewUrl}" style="display: inline-block; background: #F18825; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Review Submission</a>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #999; font-size: 12px; margin: 0;">This is an automated notification from the loomOS Marketplace.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate a resident invitation email HTML
 */
export function generateResidentInvitationEmail(
  firstName: string,
  email: string,
  tempPassword: string,
  loginUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Your Community Portal</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #F18825 0%, #ff9f4a 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to loomOS</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #F18825; margin-top: 0;">Your Account Has Been Created</h2>

    <p>Hi ${firstName},</p>

    <p>Welcome to your community portal! An account has been created for you. Use the credentials below to log in and get started.</p>

    <div style="background: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 8px 0;"><strong>Temporary Password:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #856404; font-size: 14px;"><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" style="display: inline-block; background: #F18825; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Log In Now</a>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #999; font-size: 12px; margin: 0;">If you have any questions, please contact your building management.</p>
  </div>
</body>
</html>
  `.trim();
}
