/**
 * Mock Email Service for Testing
 */

export const sendEmail = jest.fn();
export const validateEmails = jest.fn((emails: string[]) => {
  return {
    valid: emails.filter(e => e.includes('@')),
    invalid: emails.filter(e => !e.includes('@')),
  };
});
export const isEmailServiceConfigured = jest.fn(() => false);
