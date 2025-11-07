/**
 * CSRF Protection Tests
 * 
 * Tests for Cross-Site Request Forgery protection middleware
 */

import { NextRequest } from 'next/server';
import { generateCsrfToken, csrf } from '../csrf-protection';

// Mock cookies storage for edge-runtime compatibility
const mockCookieStore = {
  store: new Map<string, any>(),
  get(name: string) {
    return this.store.get(name) || null;
  },
  set(name: string, value: string, options?: any) {
    this.store.set(name, { name, value, ...options });
  },
  clear() {
    this.store.clear();
  },
};

jest.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

describe('CSRF Protection', () => {
  beforeEach(() => {
    mockCookieStore.clear();
  });

  describe('generateCsrfToken', () => {
    it('should generate a valid token', () => {
      const token = generateCsrfToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('csrf.verify', () => {
    it('should skip verification for GET requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
      });

      await expect(csrf.verify(request)).resolves.not.toThrow();
    });

    it('should skip verification for HEAD requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'HEAD',
      });

      await expect(csrf.verify(request)).resolves.not.toThrow();
    });

    it('should skip verification for OPTIONS requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'OPTIONS',
      });

      await expect(csrf.verify(request)).resolves.not.toThrow();
    });

    it('should throw error for POST request without CSRF token', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      await expect(csrf.verify(request)).rejects.toBeInstanceOf(Response);
    });

    it('should throw error for PUT request without CSRF token', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'PUT',
      });

      await expect(csrf.verify(request)).rejects.toBeInstanceOf(Response);
    });

    it('should throw error for DELETE request without CSRF token', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'DELETE',
      });

      await expect(csrf.verify(request)).rejects.toBeInstanceOf(Response);
    });
  });

  describe('csrf.generate', () => {
    it('should generate a token', () => {
      const token = csrf.generate();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });
});
