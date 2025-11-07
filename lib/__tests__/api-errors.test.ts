/**
 * Tests for API Error Handling
 *
 * This file demonstrates:
 * - Testing custom error classes
 * - Testing factory methods
 * - Testing error response formatting
 */

import { ApiError, ErrorCode, handleApiError } from '../api-errors';

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an error with all properties', () => {
      const error = new ApiError(
        400,
        ErrorCode.BAD_REQUEST,
        'Test error',
        { field: 'email' }
      );

      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ErrorCode.BAD_REQUEST);
      expect(error.message).toBe('Test error');
      expect(error.details).toEqual({ field: 'email' });
      expect(error.isOperational).toBe(true);
    });

    it('should mark non-operational errors correctly', () => {
      const error = new ApiError(
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
        'Server error',
        undefined,
        false
      );

      expect(error.isOperational).toBe(false);
    });
  });

  describe('toResponse', () => {
    it('should convert error to NextResponse with correct status', () => {
      const error = new ApiError(404, ErrorCode.NOT_FOUND, 'Resource not found');
      const response = error.toResponse('/api/test');

      expect(response.status).toBe(404);
    });

    it('should include all error properties in response', async () => {
      const error = new ApiError(
        400,
        ErrorCode.VALIDATION_ERROR,
        'Validation failed',
        { field: 'email', reason: 'invalid format' }
      );

      const response = error.toResponse('/api/users');
      const body = await response.json();

      expect(body.error).toBe(ErrorCode.VALIDATION_ERROR);
      expect(body.message).toBe('Validation failed');
      expect(body.statusCode).toBe(400);
      expect(body.details).toEqual({ field: 'email', reason: 'invalid format' });
      expect(body.path).toBe('/api/users');
      expect(body.timestamp).toBeDefined();
    });

    it('should not include details if none provided', async () => {
      const error = new ApiError(401, ErrorCode.UNAUTHORIZED, 'Not authenticated');
      const response = error.toResponse();
      const body = await response.json();

      expect(body.details).toBeUndefined();
      expect(body.path).toBeUndefined();
    });
  });

  describe('Factory Methods', () => {
    describe('badRequest', () => {
      it('should create a 400 error', () => {
        const error = ApiError.badRequest('Invalid input');

        expect(error.statusCode).toBe(400);
        expect(error.code).toBe(ErrorCode.BAD_REQUEST);
        expect(error.message).toBe('Invalid input');
      });

      it('should use default message when none provided', () => {
        const error = ApiError.badRequest();

        expect(error.message).toBe('Bad request');
      });
    });

    describe('unauthorized', () => {
      it('should create a 401 error', () => {
        const error = ApiError.unauthorized();

        expect(error.statusCode).toBe(401);
        expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
        expect(error.message).toContain('logged in');
      });

      it('should accept custom message', () => {
        const error = ApiError.unauthorized('Session expired');

        expect(error.message).toBe('Session expired');
      });
    });

    describe('forbidden', () => {
      it('should create a 403 error', () => {
        const error = ApiError.forbidden();

        expect(error.statusCode).toBe(403);
        expect(error.code).toBe(ErrorCode.FORBIDDEN);
      });
    });

    describe('notFound', () => {
      it('should create a 404 error with resource name', () => {
        const error = ApiError.notFound('User');

        expect(error.statusCode).toBe(404);
        expect(error.code).toBe(ErrorCode.NOT_FOUND);
        expect(error.message).toBe('User not found');
      });

      it('should use default resource name', () => {
        const error = ApiError.notFound();

        expect(error.message).toBe('Resource not found');
      });
    });

    describe('conflict', () => {
      it('should create a 409 error', () => {
        const error = ApiError.conflict('Email already exists');

        expect(error.statusCode).toBe(409);
        expect(error.code).toBe(ErrorCode.CONFLICT);
        expect(error.message).toBe('Email already exists');
      });
    });

    describe('validation', () => {
      it('should create a 422 error with details', () => {
        const details = { fields: ['email', 'password'] };
        const error = ApiError.validation('Invalid fields', details);

        expect(error.statusCode).toBe(422);
        expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
        expect(error.details).toEqual(details);
      });
    });

    describe('internal', () => {
      it('should create a 500 error', () => {
        const error = ApiError.internal();

        expect(error.statusCode).toBe(500);
        expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
        expect(error.isOperational).toBe(false);
      });
    });

    describe('duplicate', () => {
      it('should create a conflict error for duplicates', () => {
        const error = ApiError.duplicate('User', { email: 'test@example.com' });

        expect(error.statusCode).toBe(409);
        expect(error.code).toBe(ErrorCode.DUPLICATE_ENTRY);
        expect(error.message).toBe('User already exists');
        expect(error.details).toEqual({ email: 'test@example.com' });
      });
    });
  });

  describe('handleApiError', () => {
    it('should handle ApiError instances', async () => {
      const error = ApiError.notFound('User');
      const response = handleApiError(error, '/api/users/123');

      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body.error).toBe(ErrorCode.NOT_FOUND);
      expect(body.path).toBe('/api/users/123');
    });

    it('should handle Prisma P2002 (unique constraint) errors', async () => {
      const prismaError = {
        code: 'P2002',
        meta: { target: ['email'] },
      };

      const response = handleApiError(prismaError);
      expect(response.status).toBe(409);

      const body = await response.json();
      expect(body.error).toBe(ErrorCode.DUPLICATE_ENTRY);
    });

    it('should handle Prisma P2025 (not found) errors', async () => {
      const prismaError = {
        code: 'P2025',
      };

      const response = handleApiError(prismaError);
      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body.error).toBe(ErrorCode.NOT_FOUND);
    });

    it('should handle standard Error objects', async () => {
      const error = new Error('Something went wrong');
      const response = handleApiError(error);

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body.message).toBe('Something went wrong');
    });

    it('should handle unknown error types', async () => {
      const response = handleApiError('string error');

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body.error).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Error Codes', () => {
    it('should have all expected error codes', () => {
      expect(ErrorCode.BAD_REQUEST).toBe('BAD_REQUEST');
      expect(ErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ErrorCode.FORBIDDEN).toBe('FORBIDDEN');
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCode.CONFLICT).toBe('CONFLICT');
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCode.INTERNAL_SERVER_ERROR).toBe('INTERNAL_SERVER_ERROR');
      expect(ErrorCode.DATABASE_ERROR).toBe('DATABASE_ERROR');
    });
  });
});
