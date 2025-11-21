
/**
 * API Integration Examples
 * 
 * This file demonstrates how to use the new API client and hooks
 * with the enhanced backend APIs.
 */

import { api } from './api-client';
import { useApi, useMutation } from '@/hooks/use-api';

// ============================================================================
// EXAMPLE 1: Simple GET request with useApi hook
// ============================================================================
export function useMessages() {
  const { data, error, isLoading, refresh } = useApi('/api/messages');
  
  return {
    messages: data,
    error,
    isLoading,
    refresh,
  };
}

// ============================================================================
// EXAMPLE 2: POST request with useMutation hook
// ============================================================================
export function useCreateMessage() {
  return useMutation(
    async (messageData: { recipientId: string; content: string }) => {
      return await api.post('/api/messages', messageData);
    },
    {
      showSuccessToast: true,
      successMessage: 'Message sent successfully',
      onSuccess: (data, variables) => {
        // Optionally refresh message list or navigate
      },
    }
  );
}

// ============================================================================
// EXAMPLE 3: Direct API call (for one-off requests)
// ============================================================================
export async function deleteMessage(messageId: string) {
  const response = await api.delete(`/api/messages/${messageId}`, {
    showSuccessToast: true,
    successMessage: 'Message deleted',
  });
  
  return response.success;
}

// ============================================================================
// EXAMPLE 4: Handling validation errors
// ============================================================================
export function useUpdateProfile() {
  return useMutation(
    async (profileData: { firstName?: string; lastName?: string; phone?: string }) => {
      return await api.patch('/api/profile', profileData);
    },
    {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully',
      // Validation errors will be automatically shown as toasts
    }
  );
}

// ============================================================================
// EXAMPLE 5: Conditional data fetching
// ============================================================================
export function useUserDocuments(userId?: string) {
  // Pass null to disable fetching until userId is available
  const { data, error, isLoading } = useApi(
    userId ? `/api/documents?userId=${userId}` : null
  );
  
  return {
    documents: data,
    error,
    isLoading,
  };
}

// ============================================================================
// EXAMPLE 6: Form submission with loading state
// ============================================================================
export function CreateTaskForm() {
  const { mutate, isLoading, error } = useMutation(
    async (taskData: { title: string; description?: string; dueDate?: string }) => {
      return await api.post('/api/tasks', taskData);
    },
    {
      showSuccessToast: true,
      successMessage: 'Task created successfully',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form data extraction logic...
    const taskData = { title: 'Example', description: 'Example description' };
    await mutate(taskData);
  };

  // In your component:
  // - Show loading spinner when isLoading is true
  // - Display error message if error is present
  // - Disable form submission when isLoading
  
  return null; // Component implementation...
}

// ============================================================================
// EXAMPLE 7: Optimistic updates with SWR
// ============================================================================
export function useToggleTaskCompletion() {
  const { mutate: mutateTasks } = useApi('/api/tasks');
  
  return useMutation(
    async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      return await api.patch(`/api/tasks/${taskId}`, { completed });
    },
    {
      showSuccessToast: true,
      successMessage: 'Task updated',
      onSuccess: () => {
        // Refresh tasks list after successful update
        mutateTasks();
      },
    }
  );
}
