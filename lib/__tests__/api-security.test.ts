/**
 * API Security Middleware Tests
 * 
 * Tests for the comprehensive security middleware (withSecurity)
 */

import { NextRequest } from 'next/server';
import { 
  withSecurity, 
  applyCsrfProtection, 
  applyRateLimit, 
  applyStrictRateLimit 
} from '../api-utils';

// Mock the dependencies
jest.mock('../csrf-protection', () => ({
  csrf: {
    verify: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue(undefined),
  strictRateLimit: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('../auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { csrf } from '../csrf-protection';
import { rateLimit, strictRateLimit } from '../rate-limit';

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockCsrfVerify = csrf.verify as jest.MockedFunction<typeof csrf.verify>;
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;
const mockStrictRateLimit = strictRateLimit as jest.MockedFunction<typeof strictRateLimit>;

describe('API Security Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applyCsrfProtection', () => {
    it('should call csrf.verify', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await applyCsrfProtection(request);
      
      expect(mockCsrfVerify).toHaveBeenCalledWith(request);
    });
  });

  describe('applyRateLimit', () => {
    it('should call rateLimit', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await applyRateLimit(request);
      
      expect(mockRateLimit).toHaveBeenCalledWith(request);
    });
  });

  describe('applyStrictRateLimit', () => {
    it('should call strictRateLimit', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await applyStrictRateLimit(request);
      
      expect(mockStrictRateLimit).toHaveBeenCalledWith(request);
    });
  });

  describe('withSecurity', () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'USER',
      },
    };

    it('should apply rate limiting and CSRF protection by default', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await withSecurity(request);

      expect(mockRateLimit).toHaveBeenCalled();
      expect(mockCsrfVerify).toHaveBeenCalled();
    });

    it('should skip CSRF protection when skipCsrf is true', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await withSecurity(request, { skipCsrf: true });

      expect(mockRateLimit).toHaveBeenCalled();
      expect(mockCsrfVerify).not.toHaveBeenCalled();
    });

    it('should skip rate limiting when skipRateLimit is true', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await withSecurity(request, { skipRateLimit: true });

      expect(mockRateLimit).not.toHaveBeenCalled();
      expect(mockCsrfVerify).toHaveBeenCalled();
    });

    it('should use strict rate limiting when strictRateLimit is true', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await withSecurity(request, { strictRateLimit: true });

      expect(mockStrictRateLimit).toHaveBeenCalled();
      expect(mockRateLimit).not.toHaveBeenCalled();
    });

    it('should validate authentication when requireAuth is true', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      const session = await withSecurity(request, { requireAuth: true });

      expect(mockGetServerSession).toHaveBeenCalled();
      expect(session).toEqual(mockSession);
    });

    it('should throw error when authentication required but no session', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await expect(
        withSecurity(request, { requireAuth: true })
      ).rejects.toThrow('Authentication required');
    });

    it('should validate admin role when requireAdmin is true', async () => {
      const adminSession = {
        user: {
          id: '1',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
      };
      mockGetServerSession.mockResolvedValue(adminSession);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      const session = await withSecurity(request, { requireAdmin: true });

      expect(session).toEqual(adminSession);
    });

    it('should throw error when admin required but user is not admin', async () => {
      const userSession = {
        user: {
          id: '1',
          email: 'user@example.com',
          role: 'USER',
        },
      };
      mockGetServerSession.mockResolvedValue(userSession);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await expect(
        withSecurity(request, { requireAdmin: true })
      ).rejects.toThrow('Admin permission required');
    });

    it('should not require auth when requireAuth is false', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      const result = await withSecurity(request, { requireAuth: false });

      expect(mockGetServerSession).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should apply all security measures in correct order', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      
      const callOrder: string[] = [];
      
      mockRateLimit.mockImplementation(async () => {
        callOrder.push('rateLimit');
      });
      
      mockCsrfVerify.mockImplementation(async () => {
        callOrder.push('csrf');
      });

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await withSecurity(request);

      // Rate limiting should be called before CSRF
      expect(callOrder).toEqual(['rateLimit', 'csrf']);
    });
  });
});
