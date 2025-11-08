'use client';

/**
 * Tenant-aware data fetching hooks
 * Automatically includes organization context in API calls
 */

import useSWR, { SWRConfiguration } from 'swr';
import { useOrganizationId } from '@/lib/tenant/context';

interface FetchOptions extends RequestInit {
  organizationId?: string;
}

/**
 * Fetch wrapper that includes organization context
 */
async function tenantFetcher(url: string, organizationId?: string) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(organizationId && { 'X-Organization-ID': organizationId }),
    },
  });

  if (!response.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Tenant-aware SWR hook
 * Automatically includes organization ID in requests
 */
export function useTenantData<T>(
  key: string | null,
  config?: SWRConfiguration
) {
  const organizationId = useOrganizationId();

  return useSWR<T>(
    key ? [key, organizationId] : null,
    ([url]) => tenantFetcher(url, organizationId),
    config
  );
}

/**
 * Fetch data for the current organization
 */
export async function fetchTenantData<T>(
  url: string,
  organizationId: string,
  options?: FetchOptions
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Organization-ID': organizationId,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Mutate data for the current organization
 */
export async function mutateTenantData<T>(
  url: string,
  organizationId: string,
  data: any,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Organization-ID': organizationId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}
