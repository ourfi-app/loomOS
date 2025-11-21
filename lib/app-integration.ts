
/**
 * App Integration System
 * Manages cross-app communication and data flow
 */

export type AppEvent = 
  | { type: 'PAYMENT_CREATED'; data: { paymentId: string; userId: string; amount: number } }
  | { type: 'PAYMENT_UPDATED'; data: { paymentId: string; status: string } }
  | { type: 'ANNOUNCEMENT_CREATED'; data: { announcementId: string; title: string; priority: string } }
  | { type: 'DOCUMENT_UPLOADED'; data: { documentId: string; filename: string; folder: string } }
  | { type: 'USER_UPDATED'; data: { userId: string; changes: any } }
  | { type: 'MESSAGE_SENT'; data: { messageId: string; recipients: string[]; subject: string } }
  | { type: 'TASK_CREATED'; data: { taskId: string; title: string; assignedTo?: string } }
  | { type: 'TASK_COMPLETED'; data: { taskId: string; title: string } }
  | { type: 'EVENT_CREATED'; data: { eventId: string; title: string; startDate: Date } }
  | { type: 'NOTE_CREATED'; data: { noteId: string; title: string } }
  | { type: 'DIRECTORY_UPDATE_REQUEST'; data: { requestId: string; userId: string } }
  | { type: 'DIRECTORY_UPDATE_APPROVED'; data: { requestId: string; userId: string } };

type EventHandler = (event: AppEvent) => void | Promise<void>;

class AppIntegrationService {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  /**
   * Subscribe to app events
   */
  on(eventType: AppEvent['type'], handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)?.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Emit an app event
   */
  async emit(event: AppEvent) {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      const promises = Array.from(handlers).map(handler => handler(event));
      await Promise.allSettled(promises);
    }
  }

  /**
   * Trigger notification for an event
   */
  async triggerNotification(event: AppEvent, title: string, message: string, isUrgent = false) {
    // This will be called by API routes to create notifications
    return { title, message, isUrgent };
  }
}

export const appIntegration = new AppIntegrationService();

/**
 * Integration helper functions
 */
export const integrations = {
  // Payment -> Notification
  async notifyPaymentDue(userId: string, amount: number, dueDate: Date) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Payment Due',
        message: `Your payment of $${amount} is due on ${dueDate.toLocaleDateString()}`,
        type: 'EMAIL',
        isUrgent: true,
        userIds: [userId],
      }),
    });
  },

  async notifyPaymentReceived(userId: string, amount: number) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Payment Received',
        message: `Your payment of $${amount} has been processed successfully`,
        type: 'EMAIL',
        isUrgent: false,
        userIds: [userId],
      }),
    });
  },

  // Announcement -> Notification
  async notifyAnnouncement(title: string, content: string, priority: string, targetUserIds: string[]) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `New Announcement: ${title}`,
        message: content,
        type: 'BOTH',
        isUrgent: priority === 'urgent',
        userIds: targetUserIds,
      }),
    });
  },

  // Document -> Notification
  async notifyDocumentUploaded(filename: string, folder: string, targetUserIds: string[]) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Document Available',
        message: `${filename} has been uploaded to ${folder}`,
        type: 'EMAIL',
        isUrgent: false,
        userIds: targetUserIds,
      }),
    });
  },

  // Message -> Notification
  async notifyMessageReceived(recipientIds: string[], subject: string, senderName: string) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Message',
        message: `${senderName} sent you a message: ${subject}`,
        type: 'EMAIL',
        isUrgent: false,
        userIds: recipientIds,
      }),
    });
  },

  // Task -> Notification
  async notifyTaskAssigned(assignedToId: string, taskTitle: string) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task Assigned',
        message: `You have been assigned: ${taskTitle}`,
        type: 'EMAIL',
        isUrgent: false,
        userIds: [assignedToId],
      }),
    });
  },

  async notifyTaskDueSoon(userId: string, taskTitle: string, dueDate: Date) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task Due Soon',
        message: `"${taskTitle}" is due on ${dueDate.toLocaleDateString()}`,
        type: 'EMAIL',
        isUrgent: true,
        userIds: [userId],
      }),
    });
  },

  // Event -> Notification
  async notifyEventCreated(eventTitle: string, startDate: Date, attendeeIds: string[]) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Event Invitation',
        message: `You're invited to "${eventTitle}" on ${startDate.toLocaleDateString()}`,
        type: 'EMAIL',
        isUrgent: false,
        userIds: attendeeIds,
      }),
    });
  },

  async notifyEventReminder(userId: string, eventTitle: string, startTime: string) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Event Reminder',
        message: `"${eventTitle}" starts at ${startTime}`,
        type: 'BOTH',
        isUrgent: true,
        userIds: [userId],
      }),
    });
  },

  // Directory -> Notification
  async notifyDirectoryUpdateRequest(adminIds: string[], requesterName: string, updateType: string) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Directory Update Request',
        message: `${requesterName} has requested a ${updateType} update`,
        type: 'EMAIL',
        isUrgent: false,
        userIds: adminIds,
      }),
    });
  },

  async notifyDirectoryUpdateApproved(userId: string, updateType: string) {
    return fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Directory Update Approved',
        message: `Your ${updateType} update has been approved`,
        type: 'EMAIL',
        isUrgent: false,
        userIds: [userId],
      }),
    });
  },

  // Deep Link Generation
  generateDeepLink(appId: string, itemId?: string, action?: string): string {
    const appPaths: Record<string, string> = {
      'home': '/dashboard',
      'ai-assistant': '/dashboard/chat',
      'notifications': '/dashboard/notifications',
      'profile': '/dashboard/profile',
      'payments': '/dashboard/payments',
      'documents': '/dashboard/documents',
      'directory': '/dashboard/directory',
      'marketplace': '/dashboard/marketplace',
      'admin-panel': '/dashboard/admin',
      'messages': '/dashboard/messages',
      'calendar': '/dashboard/apps/calendar',
      'tasks': '/dashboard/apps/tasks',
      'notes': '/dashboard/apps/notes',
      'email': '/dashboard/apps/email',
      'directory-requests': '/dashboard/admin/directory-requests',
      'budgeting': '/dashboard/budgeting',
      'accounting': '/dashboard/accounting',
    };

    const basePath = appPaths[appId];
    if (!basePath) return '/dashboard';

    const params = new URLSearchParams();
    if (itemId) params.set('id', itemId);
    if (action) params.set('action', action);

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  },

  // Cross-app navigation helpers with deep linking support
  openApp(appId: string, router: any, itemId?: string, action?: string) {
    const deepLink = this.generateDeepLink(appId, itemId, action);
    if (router) {
      router.push(deepLink);
    }
  },

  // Data fetching helpers
  async fetchUserData(userId: string) {
    const response = await fetch(`/api/admin/users/${userId}`);
    return response.ok ? response.json() : null;
  },

  async fetchNotifications(userId: string) {
    const response = await fetch('/api/notifications');
    return response.ok ? response.json() : null;
  },

  async fetchPayments(userId: string) {
    const response = await fetch('/api/payments');
    return response.ok ? response.json() : null;
  },

  async fetchDocuments() {
    const response = await fetch('/api/documents');
    return response.ok ? response.json() : null;
  },

  async fetchAnnouncements() {
    const response = await fetch('/api/announcements');
    return response.ok ? response.json() : null;
  },
};

