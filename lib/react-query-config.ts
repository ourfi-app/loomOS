/**
 * React Query Configuration for Performance Optimization
 * 
 * This file provides optimized cache settings for different data types:
 * - Static data: Rarely changes (organization settings, committees)
 * - Semi-static: Changes occasionally (directory, documents)
 * - Dynamic: Changes frequently (messages, notifications)
 * - Real-time: Needs frequent updates (payments, tasks)
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Default configuration for all queries
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Default stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
    // Default cache time: 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus for fresh data
    refetchOnWindowFocus: true,
    // Don't refetch on mount if data is fresh
    refetchOnMount: false,
    // Network mode
    networkMode: 'online',
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
    retryDelay: 1000,
    networkMode: 'online',
  },
};

/**
 * Cache configuration by data type
 */
export const cacheConfig = {
  // Static data - Changes very rarely (60 minutes)
  static: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  
  // Semi-static data - Changes occasionally (15 minutes)
  semiStatic: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  
  // Dynamic data - Changes frequently (5 minutes)
  dynamic: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: false,
  },
  
  // Real-time data - Needs frequent updates (30 seconds)
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
};

/**
 * Query key patterns for different data types
 */
export const queryKeys = {
  // Static data
  organization: (orgId?: string) => ['organization', orgId] as const,
  settings: (orgId?: string) => ['settings', orgId] as const,
  committees: (orgId?: string) => ['committees', orgId] as const,
  
  // Semi-static data
  directory: (orgId?: string, filters?: any) => ['directory', orgId, filters] as const,
  documents: (orgId?: string, filters?: any) => ['documents', orgId, filters] as const,
  users: (orgId?: string) => ['users', orgId] as const,
  
  // Dynamic data
  messages: (userId?: string, filters?: any) => ['messages', userId, filters] as const,
  notifications: (userId?: string, filters?: any) => ['notifications', userId, filters] as const,
  notes: (userId?: string, filters?: any) => ['notes', userId, filters] as const,
  
  // Real-time data
  payments: (userId?: string, filters?: any) => ['payments', userId, filters] as const,
  tasks: (userId?: string, filters?: any) => ['tasks', userId, filters] as const,
  stats: (type: string, params?: any) => ['stats', type, params] as const,
};

/**
 * Create a configured QueryClient instance
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
  });
}

/**
 * Get optimized options for a specific data type
 */
export function getQueryOptions(dataType: 'static' | 'semiStatic' | 'dynamic' | 'realtime') {
  return cacheConfig[dataType];
}

/**
 * Prefetch strategies
 */
export const prefetchStrategies = {
  // Prefetch on hover for navigation links
  onHover: {
    enabled: true,
    delay: 200, // ms
  },
  
  // Prefetch next page on scroll
  onScroll: {
    enabled: true,
    threshold: 0.8, // 80% scroll
  },
  
  // Background refetch on window focus
  onFocus: {
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
};

/**
 * Cache invalidation helpers
 */
export const invalidationHelpers = {
  // Invalidate all queries for an organization
  invalidateOrganization: (queryClient: QueryClient, orgId: string) => {
    queryClient.invalidateQueries({ queryKey: ['organization', orgId] });
    queryClient.invalidateQueries({ queryKey: ['settings', orgId] });
  },
  
  // Invalidate user-specific data
  invalidateUserData: (queryClient: QueryClient, userId: string) => {
    queryClient.invalidateQueries({ queryKey: ['messages', userId] });
    queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    queryClient.invalidateQueries({ queryKey: ['notes', userId] });
    queryClient.invalidateQueries({ queryKey: ['payments', userId] });
  },
  
  // Invalidate directory data
  invalidateDirectory: (queryClient: QueryClient, orgId: string) => {
    queryClient.invalidateQueries({ queryKey: ['directory', orgId] });
    queryClient.invalidateQueries({ queryKey: ['users', orgId] });
  },
  
  // Invalidate documents
  invalidateDocuments: (queryClient: QueryClient, orgId: string) => {
    queryClient.invalidateQueries({ queryKey: ['documents', orgId] });
  },
};

export default createQueryClient;
