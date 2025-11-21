// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * Documents API Route Tests
 *
 * Integration tests for the documents listing API endpoint
 */

import { NextRequest } from 'next/server';
import { GET } from '../route';
import { createMockRequest, createMockSession, createMockAdminSession, expectSuccessResponse, expectErrorResponse } from '@/lib/test-utils';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    file: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/api-utils', () => ({
  validateAuth: jest.fn(),
  createSuccessResponse: jest.fn((data) => new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })),
  errorResponse: jest.fn((message, status) => new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })),
  handleApiError: jest.fn((error) => new Response(JSON.stringify({ error: 'Internal server error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  })),
  logApiRequest: jest.fn(),
}));

jest.mock('@/lib/tenant-context', () => ({
  getCurrentOrganizationId: jest.fn(),
}));

jest.mock('@/lib/types', () => ({
  FOLDER_PERMISSIONS: {
    documents: { name: 'Documents', permission: 'RESIDENTS_ONLY' },
    bylaws: { name: 'Bylaws', permission: 'PUBLIC' },
    board: { name: 'Board Documents', permission: 'BOARD_ONLY' },
  },
}));

import { prisma } from '@/lib/db';
import { validateAuth } from '@/lib/api-utils';

const mockValidateAuth = validateAuth as jest.MockedFunction<typeof validateAuth>;
const mockGetCurrentOrganizationId = getCurrentOrganizationId as jest.MockedFunction<typeof getCurrentOrganizationId>;
const mockPrismaFileFindMany = prisma.file.findMany as jest.MockedFunction<typeof prisma.file.findMany>;

describe('GET /api/documents', () => {
  const mockDocuments = [
    {
      id: 'file-1',
      name: 'Public Document',
      folder: 'bylaws',
      permission: 'PUBLIC',
      size: BigInt(1024),
      mimeType: 'application/pdf',
      url: 'https://example.com/file1.pdf',
      createdAt: new Date(),
      uploadedBy: {
        name: 'Admin User',
        unitNumber: '101',
      },
    },
    {
      id: 'file-2',
      name: 'Residents Document',
      folder: 'documents',
      permission: 'RESIDENTS_ONLY',
      size: BigInt(2048),
      mimeType: 'application/pdf',
      url: 'https://example.com/file2.pdf',
      createdAt: new Date(),
      uploadedBy: {
        name: 'Admin User',
        unitNumber: '101',
      },
    },
    {
      id: 'file-3',
      name: 'Board Document',
      folder: 'board',
      permission: 'BOARD_ONLY',
      size: BigInt(4096),
      mimeType: 'application/pdf',
      url: 'https://example.com/file3.pdf',
      createdAt: new Date(),
      uploadedBy: {
        name: 'Admin User',
        unitNumber: '101',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentOrganizationId.mockResolvedValue('org-1');
  });

  it('should require authentication', async () => {
    mockValidateAuth.mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    await expectErrorResponse(response, 401, 'Unauthorized');
  });

  it('should return all documents for ADMIN users', async () => {
    const mockAuth = {
      user: {
        id: 'admin-1',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockPrismaFileFindMany.mockResolvedValue(mockDocuments);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    // Admin should see all documents (no permission filter)
    expect(mockPrismaFileFindMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            name: true,
            unitNumber: true,
          },
        },
      },
    });

    expect(data.documents).toHaveLength(3);
  });

  it('should filter documents for BOARD_MEMBER users', async () => {
    const mockAuth = {
      user: {
        id: 'board-1',
        email: 'board@example.com',
        role: 'BOARD_MEMBER',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);

    const boardMemberDocs = mockDocuments.filter(doc =>
      ['PUBLIC', 'RESIDENTS_ONLY', 'BOARD_ONLY'].includes(doc.permission)
    );
    mockPrismaFileFindMany.mockResolvedValue(boardMemberDocs);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    // Board member should see PUBLIC, RESIDENTS_ONLY, and BOARD_ONLY
    expect(mockPrismaFileFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        permission: {
          in: ['PUBLIC', 'RESIDENTS_ONLY', 'BOARD_ONLY'],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            name: true,
            unitNumber: true,
          },
        },
      },
    });
  });

  it('should filter documents for RESIDENT users', async () => {
    const mockAuth = {
      user: {
        id: 'resident-1',
        email: 'resident@example.com',
        role: 'RESIDENT',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);

    const residentDocs = mockDocuments.filter(doc =>
      ['PUBLIC', 'RESIDENTS_ONLY'].includes(doc.permission)
    );
    mockPrismaFileFindMany.mockResolvedValue(residentDocs);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    // Resident should only see PUBLIC and RESIDENTS_ONLY
    expect(mockPrismaFileFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        permission: {
          in: ['PUBLIC', 'RESIDENTS_ONLY'],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            name: true,
            unitNumber: true,
          },
        },
      },
    });

    expect(data.documents).toHaveLength(2);
  });

  it('should convert BigInt size to Number for serialization', async () => {
    const mockAuth = {
      user: {
        id: 'admin-1',
        role: 'ADMIN',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockPrismaFileFindMany.mockResolvedValue([mockDocuments[0]]);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    // Size should be converted from BigInt to Number
    expect(typeof data.documents[0].size).toBe('number');
    expect(data.documents[0].size).toBe(1024);
  });

  it('should include folder counts in response', async () => {
    const mockAuth = {
      user: {
        id: 'admin-1',
        role: 'ADMIN',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockPrismaFileFindMany.mockResolvedValue(mockDocuments);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    expect(data.folders).toBeDefined();
    expect(data.folders.bylaws.count).toBe(1); // 1 public document
    expect(data.folders.documents.count).toBe(1); // 1 residents document
    expect(data.folders.board.count).toBe(1); // 1 board document
  });

  it('should include uploader information with documents', async () => {
    const mockAuth = {
      user: {
        id: 'admin-1',
        role: 'ADMIN',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockPrismaFileFindMany.mockResolvedValue([mockDocuments[0]]);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    expect(data.documents[0].uploadedBy).toBeDefined();
    expect(data.documents[0].uploadedBy.name).toBe('Admin User');
    expect(data.documents[0].uploadedBy.unitNumber).toBe('101');
  });

  it('should sort documents by creation date descending', async () => {
    const mockAuth = {
      user: {
        id: 'admin-1',
        role: 'ADMIN',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockPrismaFileFindMany.mockResolvedValue([]);

    const request = createMockRequest('http://localhost:3000/api/documents');
    await GET(request);

    expect(mockPrismaFileFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      })
    );
  });

  it('should filter by organization ID for tenant isolation', async () => {
    const mockAuth = {
      user: {
        id: 'resident-1',
        role: 'RESIDENT',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockGetCurrentOrganizationId.mockResolvedValue('org-specific');
    mockPrismaFileFindMany.mockResolvedValue([]);

    const request = createMockRequest('http://localhost:3000/api/documents');
    await GET(request);

    expect(mockGetCurrentOrganizationId).toHaveBeenCalled();
    expect(mockPrismaFileFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: 'org-specific',
        }),
      })
    );
  });

  it('should handle empty document list', async () => {
    const mockAuth = {
      user: {
        id: 'resident-1',
        role: 'RESIDENT',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockPrismaFileFindMany.mockResolvedValue([]);

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);
    expect(data.documents).toEqual([]);
    expect(data.folders).toBeDefined();
  });

  it('should handle database errors gracefully', async () => {
    const mockAuth = {
      user: {
        id: 'admin-1',
        role: 'ADMIN',
      },
    };
    mockValidateAuth.mockResolvedValue(mockAuth as any);
    mockPrismaFileFindMany.mockRejectedValue(new Error('Database error'));

    const request = createMockRequest('http://localhost:3000/api/documents');
    const response = await GET(request);

    await expectErrorResponse(response, 500);
  });
});
