
/**
 * Enhanced API Hooks
 * 
 * SWR-based hooks that integrate with the new API client
 * Provides consistent loading, error, and data patterns
 */

import useSWR, { SWRConfiguration, KeyedMutator } from 'swr';
import { apiClient, api, ApiResponse } from '@/lib/api-client';
import { toast } from 'sonner';

interface UseApiResult<T> {
  data: T | undefined;
  error: string | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<ApiResponse<T>>;
  refresh: () => void;
}

/**
 * Enhanced SWR hook that works with our API client
 */
export function useApi<T = any>(
  endpoint: string | null,
  config?: SWRConfiguration
): UseApiResult<T> {
  const fetcher = async (url: string) => {
    const response = await apiClient<T>(url, { showErrorToast: false });
    
    // If API returned an error, throw it so SWR can handle it
    if (!response.success) {
      throw new Error(response.error || 'An error occurred');
    }
    
    return response;
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<T>, Error>(
    endpoint,
    fetcher,
    {
      revalidateOnFocus: false,
      ...config,
    }
  );

  const refresh = () => {
    mutate();
  };

  return {
    data: data?.data,
    error: error?.message,
    isLoading,
    isValidating,
    mutate,
    refresh,
  };
}

/**
 * Hook for API mutations (POST, PUT, DELETE)
 * Returns a function that executes the mutation with proper loading/error handling
 */
interface UseMutationOptions<TData = any, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: string, variables: TVariables) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

interface UseMutationResult<TData = any, TVariables = any> {
  mutate: (variables: TVariables) => Promise<ApiResponse<TData>>;
  isLoading: boolean;
  error: string | undefined;
  data: TData | undefined;
  reset: () => void;
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const [state, setState] = React.useState<{
    isLoading: boolean;
    error: string | undefined;
    data: TData | undefined;
  }>({
    isLoading: false,
    error: undefined,
    data: undefined,
  });

  const mutate = async (variables: TVariables): Promise<ApiResponse<TData>> => {
    setState({ isLoading: true, error: undefined, data: undefined });

    try {
      const response = await mutationFn(variables);

      if (response.success) {
        setState({ isLoading: false, error: undefined, data: response.data });
        
        if (options.showSuccessToast !== false) {
          toast.success(options.successMessage || response.message || 'Success');
        }
        
        await options.onSuccess?.(response.data!, variables);
      } else {
        const errorMessage = response.error || 'An error occurred';
        setState({ isLoading: false, error: errorMessage, data: undefined });
        
        if (options.showErrorToast !== false) {
          if (response.errors && response.errors.length > 0) {
            response.errors.forEach((err) => toast.error(err.message));
          } else {
            toast.error(errorMessage);
          }
        }
        
        options.onError?.(errorMessage, variables);
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ isLoading: false, error: errorMessage, data: undefined });
      
      if (options.showErrorToast !== false) {
        toast.error(errorMessage);
      }
      
      options.onError?.(errorMessage, variables);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const reset = () => {
    setState({ isLoading: false, error: undefined, data: undefined });
  };

  return {
    mutate,
    ...state,
    reset,
  };
}

// React import (needed for useMutation)
import React from 'react';

// ============================================================================
// Domain-Specific Hooks
// ============================================================================

/**
 * Hook for fetching messages
 */
export function useMessages(folder?: string) {
  const endpoint = folder ? `/api/messages?folder=${folder}` : '/api/messages';
  return useApi<{ messages: any[]; count: number }>(endpoint, {
    revalidateOnMount: true,
  });
}

/**
 * Hook for message mutations
 */
export function useMessageMutation() {
  return {
    markAsRead: (messageId: string) =>
      api.post(`/api/messages/${messageId}/read`),
    toggleStar: (messageId: string, starred: boolean) =>
      api.post(`/api/messages/${messageId}/star`, { starred }),
    deleteMessage: (messageId: string) =>
      api.delete(`/api/messages/${messageId}`),
    sendMessage: (data: {
      recipientEmails: string[];
      subject: string;
      body: string;
      priority?: string;
    }) => api.post('/api/messages/send', data),
  };
}

/**
 * Hook for fetching documents
 */
export function useDocuments() {
  return useApi<{ documents: any[]; folders: Record<string, any> }>('/api/documents', {
    revalidateOnMount: true,
  });
}

/**
 * Hook for document mutations
 */
export function useDocumentMutation() {
  return {
    deleteDocument: (documentId: string) =>
      api.delete(`/api/documents/${documentId}/delete`),
    getDownloadUrl: (documentId: string) =>
      api.get(`/api/documents/${documentId}/download`),
  };
}

/**
 * Hook for fetching committees
 */
export function useCommittees() {
  return useApi<{ committees: any[] }>('/api/committees', {
    revalidateOnMount: true,
  });
}

/**
 * Hook for fetching residents
 */
export function useResidents() {
  return useApi<{ residents: any[] }>('/api/users/residents', {
    revalidateOnMount: true,
  });
}

/**
 * Combined hook for directory data (committees + residents)
 */
export function useDirectoryData() {
  const committees = useCommittees();
  const residents = useResidents();
  
  return {
    committees: committees.data?.committees || [],
    residents: residents.data?.residents || [],
    isLoadingCommittees: committees.isLoading,
    isLoadingResidents: residents.isLoading,
    isLoading: committees.isLoading || residents.isLoading,
    error: committees.error || residents.error,
    refetch: () => {
      committees.refresh();
      residents.refresh();
    }
  };
}

/**
 * Hook for fetching tasks
 */
export function useTasks(filters?: {
  status?: string;
  category?: string;
  priority?: string;
  favorite?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.favorite !== undefined) params.append('favorite', String(filters.favorite));
  
  const endpoint = `/api/tasks${params.toString() ? `?${params.toString()}` : ''}`;
  
  return useApi<any[]>(endpoint, {
    revalidateOnMount: true,
  });
}

/**
 * Hook for task mutations
 */
export function useTaskMutations() {
  return {
    createTask: async (data: any) => {
      return api.post<any>('/api/tasks', data);
    },
    updateTask: async (taskId: string, data: any) => {
      return api.put<any>(`/api/tasks/${taskId}`, data);
    },
    deleteTask: async (taskId: string) => {
      return api.delete<void>(`/api/tasks/${taskId}`);
    },
    toggleComplete: async (taskId: string, task: any) => {
      const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      return api.put<any>(`/api/tasks/${taskId}`, {
        ...task,
        status: newStatus,
        completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : null,
      });
    }
  };
}

/**
 * Hook for fetching notes
 */
export function useNotes(filters?: {
  category?: string;
  favorite?: boolean;
  archived?: boolean;
}) {
  const params = new URLSearchParams();
  
  if (filters?.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  if (filters?.favorite) {
    params.append('favorite', 'true');
  }
  if (filters?.archived) {
    params.append('archived', 'true');
  }
  
  const endpoint = `/api/notes${params.toString() ? `?${params.toString()}` : ''}`;
  
  return useApi<any[]>(endpoint, {
    revalidateOnMount: true,
  });
}

/**
 * Hook for note mutations
 */
export function useNoteMutations() {
  return {
    createNote: async (data: any) => {
      return api.post<any>('/api/notes', data);
    },
    updateNote: async (noteId: string, data: any) => {
      return api.patch<any>(`/api/notes/${noteId}`, data);
    },
    deleteNote: async (noteId: string) => {
      return api.delete<void>(`/api/notes/${noteId}`);
    },
    toggleFavorite: async (noteId: string, isFavorite: boolean) => {
      return api.patch<any>(`/api/notes/${noteId}`, {
        isFavorite: !isFavorite,
      });
    },
    toggleArchive: async (noteId: string, isArchived: boolean) => {
      return api.patch<any>(`/api/notes/${noteId}`, {
        isArchived: !isArchived,
      });
    },
    togglePin: async (noteId: string, isPinned: boolean) => {
      return api.patch<any>(`/api/notes/${noteId}`, {
        isPinned: !isPinned,
      });
    }
  };
}

// ===========================
// Profile Hooks
// ===========================

/**
 * Hook for fetching user profile
 */
export function useProfile() {
  return useApi<{
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      name: string | null;
      unitNumber: string | null;
      phone: string | null;
      image: string | null;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
  }>('/api/profile', {
    revalidateOnMount: true,
  });
}

/**
 * Hook for profile mutations
 */
export function useProfileMutations() {
  return {
    updateProfile: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      return api.put<{
        user: {
          id: string;
          email: string;
          firstName: string | null;
          lastName: string | null;
          name: string | null;
          unitNumber: string | null;
          phone: string | null;
          image: string | null;
          role: string;
          updatedAt: string;
        };
      }>('/api/profile', data);
    },
    uploadAvatar: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload avatar');
      }
      
      return result;
    }
  };
}

// ===========================
// Household Hooks
// ===========================

/**
 * Hook for fetching pets
 */
export function usePets(unitNumber?: string) {
  const endpoint = unitNumber ? `/api/pets?unitNumber=${unitNumber}` : null;
  
  return useApi<any[]>(endpoint, {
    revalidateOnMount: true,
  });
}

/**
 * Hook for pet mutations
 */
export function usePetMutations() {
  return {
    createPet: async (data: any) => {
      return api.post<any>('/api/pets', data);
    },
    updatePet: async (petId: string, data: any) => {
      return api.put<any>(`/api/pets/${petId}`, data);
    },
    deletePet: async (petId: string) => {
      return api.delete<void>(`/api/pets/${petId}`);
    }
  };
}

/**
 * Hook for fetching children
 */
export function useChildren(unitNumber?: string) {
  const endpoint = unitNumber ? `/api/children?unitNumber=${unitNumber}` : null;
  
  return useApi<any[]>(endpoint, {
    revalidateOnMount: true,
  });
}

/**
 * Hook for child mutations
 */
export function useChildMutations() {
  return {
    createChild: async (data: any) => {
      return api.post<any>('/api/children', data);
    },
    updateChild: async (childId: string, data: any) => {
      return api.put<any>(`/api/children/${childId}`, data);
    },
    deleteChild: async (childId: string) => {
      return api.delete<void>(`/api/children/${childId}`);
    }
  };
}

/**
 * Hook for fetching additional residents
 */
export function useAdditionalResidents(unitNumber?: string) {
  const endpoint = unitNumber ? `/api/additional-residents?unitNumber=${unitNumber}` : null;
  
  return useApi<any[]>(endpoint, {
    revalidateOnMount: true,
  });
}

/**
 * Hook for additional resident mutations
 */
export function useAdditionalResidentMutations() {
  return {
    createResident: async (data: any) => {
      return api.post<any>('/api/additional-residents', data);
    },
    updateResident: async (residentId: string, data: any) => {
      return api.put<any>(`/api/additional-residents/${residentId}`, data);
    },
    deleteResident: async (residentId: string) => {
      return api.delete<void>(`/api/additional-residents/${residentId}`);
    }
  };
}

// ========================================
// PAYMENTS HOOKS
// ========================================

interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: string;
  description: string;
  type: string;
  createdAt: string;
  user?: {
    name: string;
    unitNumber: string;
    email: string;
  };
}

interface PaymentStats {
  totalPaid: number;
  currentDue: number;
  overdueCount?: number;
  paymentStatus: string;
  nextDueDate?: string;
}

interface PaymentsResponse {
  payments: Payment[];
  stats: PaymentStats;
}

/**
 * Hook for fetching all payments with stats (role-based)
 */
export function usePayments() {
  return useApi<PaymentsResponse>('/api/payments', {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
}

/**
 * Hook for fetching next upcoming payment
 */
export function useNextPayment() {
  return useApi<Payment | null>('/api/payments/next', {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
}

/**
 * Hook for payment operations
 */
export function usePaymentMutations() {
  return {
    createCheckoutSession: async (data: { 
      paymentId: string; 
      amount: number; 
      description: string;
    }) => {
      return api.post<{ sessionId: string; url: string }>(
        '/api/payments/create-checkout-session', 
        data
      );
    }
  };
}

// =============================================================================
// Calendar Hooks
// =============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  isAllDay: boolean;
  type: string;
  color: string;
  attendees: any[];
  attendeeCount: number | null;
  isRecurring: boolean;
  recurrence: string;
  recurrenceEnd: string | null;
  reminders: any[];
  isCancelled: boolean;
  isPrivate: boolean;
  isFavorite: boolean;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useCalendarEvents(filters?: {
  category?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  
  const endpoint = `/api/calendar${params.toString() ? `?${params.toString()}` : ''}`;
  
  return useApi<CalendarEvent[]>(endpoint);
}

export function useCalendarMutations() {
  return {
    createEvent: async (eventData: {
      title: string;
      description?: string;
      location?: string;
      startDate: string;
      endDate: string;
      startTime?: string;
      endTime?: string;
      isAllDay?: boolean;
      type?: string;
      color?: string;
      attendees?: any[];
      attendeeCount?: number;
      isRecurring?: boolean;
      recurrence?: string;
      recurrenceEnd?: string | null;
      reminders?: any[];
      isPrivate?: boolean;
      isFavorite?: boolean;
      category?: string;
    }) => {
      return api.post<CalendarEvent>('/api/calendar', eventData);
    },

    updateEvent: async (eventId: string, eventData: Partial<{
      title: string;
      description: string;
      location: string;
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      isAllDay: boolean;
      type: string;
      color: string;
      attendees: any[];
      attendeeCount: number;
      isRecurring: boolean;
      recurrence: string;
      recurrenceEnd: string | null;
      reminders: any[];
      isCancelled: boolean;
      isPrivate: boolean;
      isFavorite: boolean;
      category: string;
    }>) => {
      return api.put<CalendarEvent>(`/api/calendar/${eventId}`, eventData);
    },

    deleteEvent: async (eventId: string) => {
      return api.delete<null>(`/api/calendar/${eventId}`);
    },
  };
}

// =============================================================================
// Notifications Hooks
// =============================================================================

export interface Notification {
  id: string;
  notificationId: string;
  userId: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    isUrgent: boolean;
    createdAt: string;
  };
}

export interface NotificationsData {
  notifications: Notification[];
  unreadCount: number;
  metadata: {
    limit: number;
    onlyUnread: boolean;
    count: number;
  };
}

export function useNotifications(options?: {
  limit?: number;
  unread?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.unread) params.append('unread', 'true');
  
  const endpoint = `/api/notifications${params.toString() ? `?${params.toString()}` : ''}`;
  
  return useApi<NotificationsData>(endpoint);
}

export function useNotificationMutations() {
  return {
    markAsRead: async (notificationId: string) => {
      return api.patch<{ success: boolean; message: string }>(
        `/api/notifications/${notificationId}`,
        { read: true }
      );
    },

    markAsUnread: async (notificationId: string) => {
      return api.patch<{ success: boolean; message: string }>(
        `/api/notifications/${notificationId}`,
        { read: false }
      );
    },

    markAllAsRead: async () => {
      return api.patch<{ success: boolean; message: string; updatedCount: number }>(
        '/api/notifications',
        { markAllAsRead: true }
      );
    },

    deleteNotification: async (notificationId: string) => {
      return api.delete<{ success: boolean }>(`/api/notifications/${notificationId}`);
    },
  };
}
