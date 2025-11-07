/**
 * Message Send API Route Tests
 *
 * Integration tests for the message sending API endpoint
 * Using __mocks__ directories for better edge-runtime compatibility
 */

import { NextRequest } from 'next/server';

// Use manual mocks from __mocks__ directories
jest.mock('@/lib/db');
jest.mock('@/lib/api-utils');
jest.mock('@/lib/email-service');
jest.mock('@/lib/tenant-context');
jest.mock('@/lib/server-integration');

// Import after mocks are set up
import { POST, GET } from '../send/route';
import { prisma } from '@/lib/db';
import {
  withSecurity,
  createSuccessResponse,
  handleApiError,
  logApiRequest,
} from '@/lib/api-utils';
import {
  sendEmail,
  validateEmails,
  isEmailServiceConfigured,
} from '@/lib/email-service';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { serverNotifications, logIntegrationEvent } from '@/lib/server-integration';

// Type assertions for mocked functions
const mockWithSecurity = withSecurity as jest.MockedFunction<typeof withSecurity>;
const mockCreateSuccessResponse = createSuccessResponse as jest.MockedFunction<
  typeof createSuccessResponse
>;
const mockHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>;
const mockLogApiRequest = logApiRequest as jest.MockedFunction<typeof logApiRequest>;
const mockValidateEmails = validateEmails as jest.MockedFunction<typeof validateEmails>;
const mockIsEmailServiceConfigured = isEmailServiceConfigured as jest.MockedFunction<
  typeof isEmailServiceConfigured
>;
const mockGetCurrentOrganizationId = getCurrentOrganizationId as jest.MockedFunction<
  typeof getCurrentOrganizationId
>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
const mockPrismaUserFindMany = prisma.user.findMany as jest.MockedFunction<
  typeof prisma.user.findMany
>;
const mockPrismaUserFindUnique = prisma.user.findUnique as jest.MockedFunction<
  typeof prisma.user.findUnique
>;
const mockPrismaMessageCreate = prisma.message.create as jest.MockedFunction<
  typeof prisma.message.create
>;
const mockServerNotificationsNotifyMessageReceived = serverNotifications.notifyMessageReceived as jest.MockedFunction<
  typeof serverNotifications.notifyMessageReceived
>;
const mockLogIntegrationEvent = logIntegrationEvent as jest.MockedFunction<
  typeof logIntegrationEvent
>;

describe('POST /api/messages/send', () => {
  const mockSession = {
    user: {
      id: 'user-1',
      email: 'sender@example.com',
      role: 'USER',
    },
  };

  const mockRecipients = [
    { id: 'recipient-1', email: 'recipient1@example.com', name: 'Recipient 1' },
    { id: 'recipient-2', email: 'recipient2@example.com', name: 'Recipient 2' },
  ];

  const mockMessage = {
    id: 'message-1',
    subject: 'Test Subject',
    body: 'Test Body',
    senderId: 'user-1',
    organizationId: 'org-1',
    status: 'SENT',
    priority: 'NORMAL',
    sentAt: new Date(),
    sender: {
      id: 'user-1',
      name: 'Sender Name',
      email: 'sender@example.com',
    },
    recipients: mockRecipients.map(r => ({
      id: `recipient-${r.id}`,
      userId: r.id,
      type: 'TO',
      user: r,
      isRead: false,
      organizationId: 'org-1',
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockWithSecurity.mockResolvedValue(mockSession as any);
    mockLogApiRequest.mockImplementation(() => {});
    mockGetCurrentOrganizationId.mockResolvedValue('org-1');
    mockIsEmailServiceConfigured.mockReturnValue(false);
    mockValidateEmails.mockImplementation((emails: string[]) => ({
      valid: emails.filter(e => e.includes('@')),
      invalid: emails.filter(e => !e.includes('@')),
    }));
    mockCreateSuccessResponse.mockImplementation((data: any) => {
      return {
        ok: true,
        status: 200,
        json: async () => data,
      } as any;
    });
    mockHandleApiError.mockImplementation((error: any, message: string) => {
      return {
        ok: false,
        status: 500,
        json: async () => ({ error: message, details: error.message }),
      } as any;
    });
  });

  it('should successfully send a message with valid recipients', async () => {
    mockPrismaUserFindMany.mockResolvedValue(mockRecipients as any);
    mockPrismaUserFindUnique.mockResolvedValue(mockMessage.sender as any);
    mockPrismaMessageCreate.mockResolvedValue(mockMessage as any);
    mockServerNotificationsNotifyMessageReceived.mockResolvedValue(undefined);
    mockLogIntegrationEvent.mockImplementation(() => {});

    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: ['recipient1@example.com', 'recipient2@example.com'],
        subject: 'Test Subject',
        body: 'Test Body',
        priority: 'NORMAL',
      }),
    });

    const response = await POST(request);

    expect(mockWithSecurity).toHaveBeenCalledWith(request, { requireAuth: true });
    expect(mockLogApiRequest).toHaveBeenCalled();
    expect(mockPrismaUserFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        email: {
          in: ['recipient1@example.com', 'recipient2@example.com'],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    expect(mockPrismaMessageCreate).toHaveBeenCalled();
    expect(mockCreateSuccessResponse).toHaveBeenCalled();
  });

  it('should handle invalid email addresses', async () => {
    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: ['invalid-email', 'valid@example.com'],
        subject: 'Test',
        body: 'Test',
      }),
    });

    mockPrismaUserFindMany.mockResolvedValue([mockRecipients[0]] as any);
    mockPrismaUserFindUnique.mockResolvedValue(mockMessage.sender as any);
    mockPrismaMessageCreate.mockResolvedValue({
      ...mockMessage,
      recipients: [mockMessage.recipients[0]],
    } as any);

    const response = await POST(request);

    expect(mockValidateEmails).toHaveBeenCalledWith([
      'invalid-email',
      'valid@example.com',
    ]);
  });

  it('should require at least one recipient email', async () => {
    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: [],
        subject: 'Test',
        body: 'Test',
      }),
    });

    const response = await POST(request);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      expect.any(Error),
      'Failed to send message',
      request
    );
  });

  it('should require a subject', async () => {
    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: ['test@example.com'],
        subject: '',
        body: 'Test',
      }),
    });

    const response = await POST(request);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      expect.any(Error),
      'Failed to send message',
      request
    );
  });

  it('should require a message body', async () => {
    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: ['test@example.com'],
        subject: 'Test',
        body: '',
      }),
    });

    const response = await POST(request);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      expect.any(Error),
      'Failed to send message',
      request
    );
  });

  it('should validate priority values', async () => {
    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: ['test@example.com'],
        subject: 'Test',
        body: 'Test',
        priority: 'INVALID',
      }),
    });

    const response = await POST(request);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      expect.any(Error),
      'Failed to send message',
      request
    );
  });

  it('should send emails when email service is configured', async () => {
    mockIsEmailServiceConfigured.mockReturnValue(true);
    mockSendEmail.mockResolvedValue({ success: true });
    mockPrismaUserFindMany.mockResolvedValue(mockRecipients as any);
    mockPrismaUserFindUnique.mockResolvedValue(mockMessage.sender as any);
    mockPrismaMessageCreate.mockResolvedValue(mockMessage as any);

    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: ['recipient1@example.com', 'recipient2@example.com'],
        subject: 'Test',
        body: 'Test',
        sendEmail: true,
      }),
    });

    const response = await POST(request);

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it('should handle no recipients found in system', async () => {
    mockPrismaUserFindMany.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        recipientEmails: ['nonexistent@example.com'],
        subject: 'Test',
        body: 'Test',
      }),
    });

    const response = await POST(request);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      expect.any(Error),
      'Failed to send message',
      request
    );
  });
});

describe('GET /api/messages/send', () => {
  const mockSession = {
    user: {
      id: 'user-1',
      email: 'user@example.com',
      role: 'USER',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWithSecurity.mockResolvedValue(mockSession as any);
    mockLogApiRequest.mockImplementation(() => {});
    mockIsEmailServiceConfigured.mockReturnValue(false);
    mockCreateSuccessResponse.mockImplementation((data: any) => {
      return {
        ok: true,
        status: 200,
        json: async () => data,
      } as any;
    });
  });

  it('should return email configuration', async () => {
    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'GET',
    });

    const response = await GET(request);

    expect(mockWithSecurity).toHaveBeenCalledWith(request, { requireAuth: true });
    expect(mockCreateSuccessResponse).toHaveBeenCalledWith({
      configured: false,
      fromEmail: expect.any(String),
      fromName: expect.any(String),
    });
  });

  it('should require authentication', async () => {
    mockWithSecurity.mockRejectedValue(new Error('Authentication required'));
    mockHandleApiError.mockReturnValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/messages/send', {
      method: 'GET',
    });

    const response = await GET(request);

    expect(mockWithSecurity).toHaveBeenCalledWith(request, { requireAuth: true });
    expect(mockHandleApiError).toHaveBeenCalled();
  });
});
