
import { prisma } from "./db";

/**
 * Server-side integration helper for emitting events and triggering notifications
 */

export interface IntegrationEvent {
  type: string;
  sourceApp: string;
  title: string;
  message: string;
  deepLink?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Helper to get all resident user IDs in an organization
 */
export async function getAllResidentUserIds(organizationId: string): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: {
      organizationId,
      role: { in: ["RESIDENT", "BOARD_MEMBER", "ADMIN"] },
    },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

/**
 * Helper to get all admin user IDs in an organization
 */
export async function getAdminUserIds(organizationId: string): Promise<string[]> {
  const admins = await prisma.user.findMany({
    where: {
      organizationId,
      role: { in: ["ADMIN", "BOARD_MEMBER"] },
    },
    select: { id: true },
  });
  return admins.map((a) => a.id);
}

/**
 * Emit an integration event that triggers notifications across apps
 * Note: Using the existing Notification schema which has EMAIL/SMS/BOTH types
 * We encode the deep link in the message for now
 */
export async function emitIntegrationEvent(event: IntegrationEvent) {
  try {
    const enhancedMessage = event.deepLink
      ? `${event.message} [Link: ${event.deepLink}]`
      : event.message;

    // Create notification for the user
    if (event.userId) {
      const notification = await prisma.notification.create({
        data: {
          organizationId: event.metadata?.organizationId || "",
          title: event.title,
          message: enhancedMessage,
          type: "EMAIL", // Using existing enum value
        },
      });

      // Create user notification link
      await prisma.userNotification.create({
        data: {
          organizationId: event.metadata?.organizationId || "",
          userId: event.userId,
          notificationId: notification.id,
        },
      });
    }

    // Broadcast to all relevant users based on event type
    if (event.type.startsWith("announcement.") || event.type.startsWith("document.")) {
      const organizationId = event.metadata?.organizationId || "";
      const users = await prisma.user.findMany({
        where: { organizationId, role: { in: ["RESIDENT", "BOARD_MEMBER", "ADMIN"] } },
        select: { id: true },
      });

      const notification = await prisma.notification.create({
        data: {
          organizationId,
          title: event.title,
          message: enhancedMessage,
          type: "EMAIL",
        },
      });

      await Promise.all(
        users.map((user) =>
          prisma.userNotification.create({
            data: {
              organizationId,
              userId: user.id,
              notificationId: notification.id,
            },
          })
        )
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to emit integration event:", error);
    return { success: false, error };
  }
}

/**
 * Helper to create notification with deep link
 */
export async function notifyWithDeepLink(params: {
  userId: string;
  title: string;
  message: string;
  type: string;
  sourceApp: string;
  deepLink: string;
  metadata?: Record<string, any>;
}) {
  return emitIntegrationEvent({
    type: params.type,
    sourceApp: params.sourceApp,
    title: params.title,
    message: params.message,
    deepLink: params.deepLink,
    userId: params.userId,
    metadata: params.metadata,
  });
}

/**
 * Helper to broadcast notification to all users with deep link
 */
export async function broadcastWithDeepLink(params: {
  title: string;
  message: string;
  type: string;
  sourceApp: string;
  deepLink: string;
  metadata?: Record<string, any>;
}) {
  return emitIntegrationEvent({
    type: params.type,
    sourceApp: params.sourceApp,
    title: params.title,
    message: params.message,
    deepLink: params.deepLink,
    metadata: params.metadata,
  });
}

/**
 * Specific notification helpers for different app events
 */
export const serverNotifications = {
  /**
   * Notify users when a new message is received
   */
  async notifyMessageReceived(
    recipientIds: string[],
    subject: string,
    senderName: string,
    messageId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/messages?itemId=${messageId}`;
    const message = `${senderName} sent you a message: "${subject}" [Link: ${deepLink}]`;
    
    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "New Message",
        message,
        type: "EMAIL",
      },
    });

    await Promise.all(
      recipientIds.map((recipientId) =>
        prisma.userNotification.create({
          data: {
            organizationId,
            userId: recipientId,
            notificationId: notification.id,
          },
        })
      )
    );
  },

  /**
   * Notify users when a calendar event is created
   */
  async notifyEventCreated(
    attendeeIds: string[],
    eventTitle: string,
    creatorName: string,
    eventId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/apps/calendar?itemId=${eventId}`;
    const message = `${creatorName} invited you to "${eventTitle}" [Link: ${deepLink}]`;
    
    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "New Event Invitation",
        message,
        type: "EMAIL",
      },
    });

    await Promise.all(
      attendeeIds.map((attendeeId) =>
        prisma.userNotification.create({
          data: {
            organizationId,
            userId: attendeeId,
            notificationId: notification.id,
          },
        })
      )
    );
  },

  /**
   * Notify user when a task is assigned
   */
  async notifyTaskAssigned(
    assigneeId: string,
    taskTitle: string,
    assignerName: string,
    taskId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/apps/tasks?itemId=${taskId}`;
    const message = `${assignerName} assigned you: "${taskTitle}" [Link: ${deepLink}]`;
    
    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "Task Assigned",
        message,
        type: "EMAIL",
      },
    });

    await prisma.userNotification.create({
      data: {
        organizationId,
        userId: assigneeId,
        notificationId: notification.id,
      },
    });
  },

  /**
   * Notify users when a document is uploaded
   */
  async notifyDocumentUploaded(
    uploaderName: string,
    fileName: string,
    documentId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/apps/documents?itemId=${documentId}`;
    const message = `${uploaderName} uploaded "${fileName}" [Link: ${deepLink}]`;
    
    const users = await prisma.user.findMany({
      where: { organizationId, role: { in: ["RESIDENT", "BOARD_MEMBER", "ADMIN"] } },
      select: { id: true },
    });

    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "New Document",
        message,
        type: "EMAIL",
      },
    });

    await Promise.all(
      users.map((user) =>
        prisma.userNotification.create({
          data: {
            organizationId,
            userId: user.id,
            notificationId: notification.id,
          },
        })
      )
    );
  },

  /**
   * Notify users when an announcement is posted
   */
  async notifyAnnouncementPosted(
    authorName: string,
    title: string,
    announcementId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/admin/announcements?itemId=${announcementId}`;
    const message = `${authorName}: ${title} [Link: ${deepLink}]`;
    
    const users = await prisma.user.findMany({
      where: { organizationId, role: { in: ["RESIDENT", "BOARD_MEMBER", "ADMIN"] } },
      select: { id: true },
    });

    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "New Announcement",
        message,
        type: "EMAIL",
      },
    });

    await Promise.all(
      users.map((user) =>
        prisma.userNotification.create({
          data: {
            organizationId,
            userId: user.id,
            notificationId: notification.id,
          },
        })
      )
    );
  },

  /**
   * Notify user when a directory update request is submitted
   */
  async notifyDirectoryUpdateRequest(
    residentName: string,
    requestId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/admin/directory-requests?itemId=${requestId}`;
    const message = `${residentName} submitted a directory update request [Link: ${deepLink}]`;
    
    const admins = await prisma.user.findMany({
      where: { organizationId, role: { in: ["ADMIN", "BOARD_MEMBER"] } },
      select: { id: true },
    });

    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "Directory Update Request",
        message,
        type: "EMAIL",
      },
    });

    await Promise.all(
      admins.map((admin) =>
        prisma.userNotification.create({
          data: {
            organizationId,
            userId: admin.id,
            notificationId: notification.id,
          },
        })
      )
    );
  },

  /**
   * Notify when an announcement is created (alias for notifyAnnouncementPosted)
   */
  async notifyAnnouncementCreated(
    authorName: string,
    title: string,
    announcementId: string,
    organizationId: string
  ) {
    return this.notifyAnnouncementPosted(authorName, title, announcementId, organizationId);
  },

  /**
   * Notify when an event is updated
   */
  async notifyEventUpdated(
    attendeeIds: string[],
    eventTitle: string,
    updaterName: string,
    eventId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/apps/calendar?itemId=${eventId}`;
    const message = `${updaterName} updated the event "${eventTitle}" [Link: ${deepLink}]`;
    
    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "Event Updated",
        message,
        type: "EMAIL",
      },
    });

    await Promise.all(
      attendeeIds.map((attendeeId) =>
        prisma.userNotification.create({
          data: {
            organizationId,
            userId: attendeeId,
            notificationId: notification.id,
          },
        })
      )
    );
  },

  /**
   * Notify when a task is created
   */
  async notifyTaskCreated(
    assigneeId: string | null,
    taskTitle: string,
    creatorName: string,
    taskId: string,
    organizationId: string
  ) {
    if (!assigneeId) return; // No one to notify
    return this.notifyTaskAssigned(assigneeId, taskTitle, creatorName, taskId, organizationId);
  },

  /**
   * Notify when a task is completed
   */
  async notifyTaskCompleted(
    assignerId: string,
    taskTitle: string,
    completerName: string,
    taskId: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/apps/tasks?itemId=${taskId}`;
    const message = `${completerName} completed the task "${taskTitle}" [Link: ${deepLink}]`;
    
    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "Task Completed",
        message,
        type: "EMAIL",
      },
    });

    await prisma.userNotification.create({
      data: {
        organizationId,
        userId: assignerId,
        notificationId: notification.id,
      },
    });
  },

  /**
   * Notify when a document is deleted
   */
  async notifyDocumentDeleted(
    deleterName: string,
    fileName: string,
    organizationId: string
  ) {
    const message = `${deleterName} deleted the document "${fileName}"`;
    
    const users = await prisma.user.findMany({
      where: { organizationId, role: { in: ["RESIDENT", "BOARD_MEMBER", "ADMIN"] } },
      select: { id: true },
    });

    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "Document Deleted",
        message,
        type: "EMAIL",
      },
    });

    await Promise.all(
      users.map((user) =>
        prisma.userNotification.create({
          data: {
            organizationId,
            userId: user.id,
            notificationId: notification.id,
          },
        })
      )
    );
  },

  /**
   * Notify when a directory update request is approved
   */
  async notifyDirectoryUpdateApproved(
    residentId: string,
    approverName: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/my-community`;
    const message = `${approverName} approved your directory update request [Link: ${deepLink}]`;
    
    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "Directory Update Approved",
        message,
        type: "EMAIL",
      },
    });

    await prisma.userNotification.create({
      data: {
        organizationId,
        userId: residentId,
        notificationId: notification.id,
      },
    });
  },

  /**
   * Notify when a directory update request is rejected
   */
  async notifyDirectoryUpdateRejected(
    residentId: string,
    rejectorName: string,
    reason: string,
    organizationId: string
  ) {
    const deepLink = `/dashboard/my-community`;
    const message = `${rejectorName} rejected your directory update request. Reason: ${reason} [Link: ${deepLink}]`;
    
    const notification = await prisma.notification.create({
      data: {
        organizationId,
        title: "Directory Update Rejected",
        message,
        type: "EMAIL",
      },
    });

    await prisma.userNotification.create({
      data: {
        organizationId,
        userId: residentId,
        notificationId: notification.id,
      },
    });
  },
};

/**
 * Log integration events for debugging and analytics
 */
export function logIntegrationEvent(event: { type: string; data: any }) {
}
