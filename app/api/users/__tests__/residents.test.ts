/**
 * Residents API Route Tests
 *
 * Integration tests for the residents API endpoint
 */

import { NextRequest } from 'next/server';
import { GET } from '../residents/route';
import { createMockRequest, createMockSession, mockPrismaData, expectSuccessResponse, expectErrorResponse } from '@/lib/test-utils';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
    pet: {
      findMany: jest.fn(),
    },
    child: {
      findMany: jest.fn(),
    },
    additionalResident: {
      findMany: jest.fn(),
    },
    propertyUnit: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/tenant-context', () => ({
  getCurrentOrganizationId: jest.fn(),
}));

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockGetCurrentOrganizationId = getCurrentOrganizationId as jest.MockedFunction<typeof getCurrentOrganizationId>;
const mockPrismaUserFindMany = prisma.user.findMany as jest.MockedFunction<typeof prisma.user.findMany>;
const mockPrismaPetFindMany = prisma.pet.findMany as jest.MockedFunction<typeof prisma.pet.findMany>;
const mockPrismaChildFindMany = prisma.child.findMany as jest.MockedFunction<typeof prisma.child.findMany>;
const mockPrismaAdditionalResidentFindMany = prisma.additionalResident.findMany as jest.MockedFunction<typeof prisma.additionalResident.findMany>;
const mockPrismaPropertyUnitFindMany = prisma.propertyUnit.findMany as jest.MockedFunction<typeof prisma.propertyUnit.findMany>;

describe('GET /api/users/residents', () => {
  const mockResidents = [
    {
      id: 'user-1',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      unitNumber: '101',
      phone: '555-0101',
      image: null,
      role: 'RESIDENT',
      createdAt: new Date(),
      committeeMemberships: [],
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      unitNumber: '102',
      phone: '555-0102',
      image: null,
      role: 'RESIDENT',
      createdAt: new Date(),
      committeeMemberships: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockGetCurrentOrganizationId.mockResolvedValue('org-1');
    mockPrismaUserFindMany.mockResolvedValue(mockResidents);
    mockPrismaPetFindMany.mockResolvedValue([]);
    mockPrismaChildFindMany.mockResolvedValue([]);
    mockPrismaAdditionalResidentFindMany.mockResolvedValue([]);
    mockPrismaPropertyUnitFindMany.mockResolvedValue([]);
  });

  it('should require authentication', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    const response = await GET(request);

    await expectErrorResponse(response, 401, 'Unauthorized');
  });

  it('should return residents for authenticated user', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    expect(mockPrismaUserFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        isActive: true,
      },
      select: expect.objectContaining({
        id: true,
        name: true,
        email: true,
        unitNumber: true,
      }),
      orderBy: { unitNumber: 'asc' },
    });

    expect(data.residents).toBeDefined();
    expect(data.residents.length).toBeGreaterThan(0);
  });

  it('should fetch household data for residents', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    const response = await GET(request);

    await expectSuccessResponse(response, 200);

    // Verify household data queries were made
    expect(mockPrismaPetFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        unitNumber: { in: ['101', '102'] },
      },
    });

    expect(mockPrismaChildFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        unitNumber: { in: ['101', '102'] },
      },
    });

    expect(mockPrismaAdditionalResidentFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        unitNumber: { in: ['101', '102'] },
      },
    });

    expect(mockPrismaPropertyUnitFindMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        unitNumber: { in: ['101', '102'] },
      },
    });
  });

  it('should include committee memberships', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);

    const residentsWithCommittees = [
      {
        ...mockResidents[0],
        committeeMemberships: [
          {
            committee: {
              id: 'committee-1',
              name: 'Finance Committee',
              type: 'FINANCE',
            },
          },
        ],
      },
    ];

    mockPrismaUserFindMany.mockResolvedValue(residentsWithCommittees);

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);

    expect(data.residents[0].committeeMemberships).toBeDefined();
    expect(data.residents[0].committeeMemberships.length).toBeGreaterThan(0);
  });

  it('should filter by organization ID for tenant isolation', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);
    mockGetCurrentOrganizationId.mockResolvedValue('org-specific');

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    await GET(request);

    expect(mockGetCurrentOrganizationId).toHaveBeenCalled();
    expect(mockPrismaUserFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: 'org-specific',
        }),
      })
    );
  });

  it('should only return active residents', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    await GET(request);

    expect(mockPrismaUserFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isActive: true,
        }),
      })
    );
  });

  it('should sort residents by unit number', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    await GET(request);

    expect(mockPrismaUserFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { unitNumber: 'asc' },
      })
    );
  });

  it('should handle database errors gracefully', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);
    mockPrismaUserFindMany.mockRejectedValue(new Error('Database error'));

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    const response = await GET(request);

    await expectErrorResponse(response, 500);
  });

  it('should handle empty resident list', async () => {
    const mockSession = createMockSession();
    mockGetServerSession.mockResolvedValue(mockSession as any);
    mockPrismaUserFindMany.mockResolvedValue([]);

    const request = createMockRequest('http://localhost:3000/api/users/residents');
    const response = await GET(request);

    const data = await expectSuccessResponse(response, 200);
    expect(data.residents).toEqual([]);
  });
});
