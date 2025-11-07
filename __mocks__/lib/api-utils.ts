/**
 * Mock API Utilities for Testing
 */

import { NextResponse } from 'next/server';

export const withSecurity = jest.fn();
export const validateAuth = jest.fn();
export const createSuccessResponse = jest.fn((data: any) => {
  return NextResponse.json(data, { status: 200 });
});
export const handleApiError = jest.fn((error: any, message: string) => {
  return NextResponse.json(
    { error: message, details: error.message },
    { status: 500 }
  );
});
export const logApiRequest = jest.fn();
