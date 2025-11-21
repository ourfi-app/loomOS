// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * Signup API Route Tests
 *
 * Integration tests for user registration
 */

import { NextRequest } from 'next/server';
import { POST } from '../signup/route';
import { createMockRequest, expectSuccessResponse, expectErrorResponse } from '@/lib/test-utils';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@prisma/client', () => ({
  UserRole: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    BOARD_MEMBER: 'BOARD_MEMBER',
    RESIDENT: 'RESIDENT',
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const mockPrismaUserFindUnique = prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>;
const mockPrismaUserCreate = prisma.user.create as jest.MockedFunction<typeof prisma.user.create>;
const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

describe('POST /api/signup', () => {
  const validSignupData = {
    email: 'newuser@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    unitNumber: '101',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBcryptHash.mockResolvedValue('hashed-password' as any);
  });

  it('should create a new user successfully', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null); // User doesn't exist

    const mockCreatedUser = {
      id: 'user-1',
      email: validSignupData.email,
      firstName: validSignupData.firstName,
      lastName: validSignupData.lastName,
      unitNumber: validSignupData.unitNumber,
      role: 'RESIDENT',
      createdAt: new Date(),
    };

    mockPrismaUserCreate.mockResolvedValue(mockCreatedUser as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    const response = await POST(request);
    const data = await expectSuccessResponse(response, 201);

    expect(data.message).toBe('User created successfully');
    expect(data.user).toMatchObject({
      email: validSignupData.email,
      firstName: validSignupData.firstName,
      lastName: validSignupData.lastName,
    });

    // Verify password was hashed
    expect(mockBcryptHash).toHaveBeenCalledWith(validSignupData.password, 12);

    // Verify user was created with correct data
    expect(mockPrismaUserCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: validSignupData.email,
        password: 'hashed-password',
        firstName: validSignupData.firstName,
        lastName: validSignupData.lastName,
        name: 'John Doe',
        unitNumber: '101',
        role: 'RESIDENT',
        isActive: true,
      }),
      select: expect.any(Object),
    });
  });

  it('should require email field', async () => {
    const invalidData = { ...validSignupData };
    delete (invalidData as any).email;

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: invalidData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 400, 'Missing required fields');
  });

  it('should require password field', async () => {
    const invalidData = { ...validSignupData };
    delete (invalidData as any).password;

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: invalidData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 400, 'Missing required fields');
  });

  it('should require firstName field', async () => {
    const invalidData = { ...validSignupData };
    delete (invalidData as any).firstName;

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: invalidData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 400, 'Missing required fields');
  });

  it('should require lastName field', async () => {
    const invalidData = { ...validSignupData };
    delete (invalidData as any).lastName;

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: invalidData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 400, 'Missing required fields');
  });

  it('should reject duplicate email addresses', async () => {
    // Mock existing user
    mockPrismaUserFindUnique.mockResolvedValue({
      id: 'existing-user',
      email: validSignupData.email,
    } as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 400, 'User already exists');

    // Verify user was not created
    expect(mockPrismaUserCreate).not.toHaveBeenCalled();
  });

  it('should default to RESIDENT role when not specified', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);

    const signupDataWithoutRole = { ...validSignupData };
    delete (signupDataWithoutRole as any).role;

    mockPrismaUserCreate.mockResolvedValue({
      id: 'user-1',
      role: 'RESIDENT',
    } as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: signupDataWithoutRole,
    });

    await POST(request);

    expect(mockPrismaUserCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        role: 'RESIDENT',
      }),
      select: expect.any(Object),
    });
  });

  it('should allow creating user without unit number', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);

    const signupDataWithoutUnit = { ...validSignupData };
    delete (signupDataWithoutUnit as any).unitNumber;

    mockPrismaUserCreate.mockResolvedValue({
      id: 'user-1',
      unitNumber: null,
    } as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: signupDataWithoutUnit,
    });

    const response = await POST(request);
    await expectSuccessResponse(response, 201);

    expect(mockPrismaUserCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        unitNumber: null,
      }),
      select: expect.any(Object),
    });
  });

  it('should create full name from firstName and lastName', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);
    mockPrismaUserCreate.mockResolvedValue({
      id: 'user-1',
      name: 'John Doe',
    } as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    await POST(request);

    expect(mockPrismaUserCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'John Doe',
      }),
      select: expect.any(Object),
    });
  });

  it('should set user as active by default', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);
    mockPrismaUserCreate.mockResolvedValue({ id: 'user-1' } as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    await POST(request);

    expect(mockPrismaUserCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        isActive: true,
      }),
      select: expect.any(Object),
    });
  });

  it('should not return password in response', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);
    mockPrismaUserCreate.mockResolvedValue({
      id: 'user-1',
      email: validSignupData.email,
      firstName: validSignupData.firstName,
      lastName: validSignupData.lastName,
      role: 'RESIDENT',
    } as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    const response = await POST(request);
    const data = await expectSuccessResponse(response, 201);

    expect(data.user.password).toBeUndefined();
  });

  it('should hash password with 12 salt rounds', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);
    mockPrismaUserCreate.mockResolvedValue({ id: 'user-1' } as any);

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    await POST(request);

    expect(mockBcryptHash).toHaveBeenCalledWith(validSignupData.password, 12);
  });

  it('should handle database errors gracefully', async () => {
    mockPrismaUserFindUnique.mockRejectedValue(new Error('Database connection error'));

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 500, 'Internal server error');
  });

  it('should handle bcrypt errors gracefully', async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);
    mockBcryptHash.mockRejectedValue(new Error('Hashing error'));

    const request = createMockRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: validSignupData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 500, 'Internal server error');
  });

  it('should handle invalid JSON gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    await expectErrorResponse(response, 500);
  });
});
