
/**
 * API Client Wrapper
 * 
 * Centralized API client that handles:
 * - Standardized response format from enhanced APIs
 * - Automatic error handling and toast notifications
 * - Loading state management
 * - Response data extraction
 */

import { toast } from 'sonner';

// Standard API response format (from api-utils.ts)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field?: string; message: string }>;
  timestamp?: string;
  requestId?: string;
}

export interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

/**
 * Main API client function
 * Handles all API calls with standardized error handling
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    headers = {},
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
  } = options;

  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      // API returned an error
      if (showErrorToast) {
        if (data.errors && data.errors.length > 0) {
          // Show validation errors
          data.errors.forEach((error) => {
            toast.error(error.message);
          });
        } else if (data.error || data.message) {
          toast.error(data.error || data.message || 'An error occurred');
        } else {
          toast.error(`Request failed with status ${response.status}`);
        }
      }
      return data;
    }

    // Success
    if (showSuccessToast && (successMessage || data.message)) {
      toast.success(successMessage || data.message || 'Success');
    }

    return data;
  } catch (error) {
    // Network or parsing error
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    
    if (showErrorToast) {
      toast.error(errorMessage);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body?: any, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
