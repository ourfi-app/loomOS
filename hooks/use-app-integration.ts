
/**
 * React hooks for app integration
 */

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { appIntegration, type AppEvent, integrations } from '@/lib/app-integration';

/**
 * Subscribe to app events
 */
export function useAppEvent(eventType: AppEvent['type'], handler: (event: AppEvent) => void) {
  useEffect(() => {
    const unsubscribe = appIntegration.on(eventType, handler);
    return unsubscribe;
  }, [eventType, handler]);
}

/**
 * Emit app events
 */
export function useEmitEvent() {
  return useCallback((event: AppEvent) => {
    return appIntegration.emit(event);
  }, []);
}

/**
 * Navigate to another app
 */
export function useNavigateToApp() {
  const router = useRouter();

  return useCallback((appId: string) => {
    integrations.openApp(appId, router);
  }, [router]);
}

/**
 * Send notifications from any app
 */
export function useNotificationService() {
  return {
    notifyPaymentDue: integrations.notifyPaymentDue,
    notifyPaymentReceived: integrations.notifyPaymentReceived,
    notifyAnnouncement: integrations.notifyAnnouncement,
    notifyDocumentUploaded: integrations.notifyDocumentUploaded,
    notifyMessageReceived: integrations.notifyMessageReceived,
    notifyTaskAssigned: integrations.notifyTaskAssigned,
    notifyTaskDueSoon: integrations.notifyTaskDueSoon,
    notifyEventCreated: integrations.notifyEventCreated,
    notifyEventReminder: integrations.notifyEventReminder,
    notifyDirectoryUpdateRequest: integrations.notifyDirectoryUpdateRequest,
    notifyDirectoryUpdateApproved: integrations.notifyDirectoryUpdateApproved,
  };
}

/**
 * Fetch data from other apps
 */
export function useCrossAppData() {
  return {
    fetchUserData: integrations.fetchUserData,
    fetchNotifications: integrations.fetchNotifications,
    fetchPayments: integrations.fetchPayments,
    fetchDocuments: integrations.fetchDocuments,
    fetchAnnouncements: integrations.fetchAnnouncements,
  };
}

/**
 * Quick actions for context menus
 */
export function useQuickActions() {
  const router = useRouter();
  const notify = useNotificationService();

  return {
    // User actions
    viewUserProfile: (userId: string) => router.push(`/dashboard/directory?user=${userId}`),
    sendMessageToUser: (userId: string) => router.push(`/dashboard/messages/compose?to=${userId}`),
    viewUserPayments: (userId: string) => router.push(`/dashboard/admin/payments?user=${userId}`),

    // Payment actions
    viewPayment: (paymentId: string) => router.push(`/dashboard/payments?id=${paymentId}`),
    sendPaymentReminder: async (userId: string, amount: number, dueDate: Date) => {
      await notify.notifyPaymentDue(userId, amount, dueDate);
    },

    // Document actions
    viewDocument: (documentId: string) => router.push(`/dashboard/documents?doc=${documentId}`),
    shareDocument: (documentId: string) => {
      // Copy link to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/dashboard/documents?doc=${documentId}`);
    },

    // Task actions
    viewTask: (taskId: string) => router.push(`/dashboard/apps/tasks?id=${taskId}`),
    createTaskFromNote: (noteTitle: string, noteContent: string) => {
      router.push(`/dashboard/apps/tasks/create?from=note&title=${encodeURIComponent(noteTitle)}&description=${encodeURIComponent(noteContent)}`);
    },

    // Event actions
    viewEvent: (eventId: string) => router.push(`/dashboard/apps/calendar?event=${eventId}`),
    createEventFromTask: (taskTitle: string, dueDate: Date) => {
      router.push(`/dashboard/apps/calendar/create?from=task&title=${encodeURIComponent(taskTitle)}&date=${dueDate.toISOString()}`);
    },

    // Announcement actions
    viewAnnouncement: (announcementId: string) => router.push(`/dashboard/admin/announcements?id=${announcementId}`),
  };
}

