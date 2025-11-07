-- Performance Optimization: Add critical indexes for frequently queried fields

-- Payments: Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS "payments_userId_idx" ON "payments"("userId");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "payments_dueDate_idx" ON "payments"("dueDate");
CREATE INDEX IF NOT EXISTS "payments_paidDate_idx" ON "payments"("paidDate");
CREATE INDEX IF NOT EXISTS "payments_organizationId_status_idx" ON "payments"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "payments_userId_status_idx" ON "payments"("userId", "status");

-- Files: Add indexes for folder and permission queries
CREATE INDEX IF NOT EXISTS "files_folder_idx" ON "files"("folder");
CREATE INDEX IF NOT EXISTS "files_permission_idx" ON "files"("permission");
CREATE INDEX IF NOT EXISTS "files_uploadedById_idx" ON "files"("uploadedById");
CREATE INDEX IF NOT EXISTS "files_createdAt_idx" ON "files"("createdAt");

-- Announcements: Add indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS "announcements_priority_idx" ON "announcements"("priority");
CREATE INDEX IF NOT EXISTS "announcements_isActive_idx" ON "announcements"("isActive");
CREATE INDEX IF NOT EXISTS "announcements_createdAt_idx" ON "announcements"("createdAt");
CREATE INDEX IF NOT EXISTS "announcements_authorId_idx" ON "announcements"("authorId");

-- Documents: Add indexes for category and status filtering
CREATE INDEX IF NOT EXISTS "documents_category_idx" ON "documents"("category");
CREATE INDEX IF NOT EXISTS "documents_status_idx" ON "documents"("status");
CREATE INDEX IF NOT EXISTS "documents_uploadedAt_idx" ON "documents"("uploadedAt");

-- Messages: Add indexes for inbox and filtering
CREATE INDEX IF NOT EXISTS "messages_createdAt_idx" ON "messages"("createdAt");
CREATE INDEX IF NOT EXISTS "messages_sentAt_idx" ON "messages"("sentAt");
CREATE INDEX IF NOT EXISTS "messages_priority_idx" ON "messages"("priority");
CREATE INDEX IF NOT EXISTS "messages_organizationId_status_idx" ON "messages"("organizationId", "status");

-- MessageRecipients: Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS "message_recipients_userId_isRead_idx" ON "message_recipients"("userId", "isRead");
CREATE INDEX IF NOT EXISTS "message_recipients_userId_isStarred_idx" ON "message_recipients"("userId", "isStarred");
CREATE INDEX IF NOT EXISTS "message_recipients_folderId_idx" ON "message_recipients"("folderId");

-- Notes: Add indexes for filtering and search
CREATE INDEX IF NOT EXISTS "notes_isFavorite_idx" ON "notes"("isFavorite");
CREATE INDEX IF NOT EXISTS "notes_isPinned_idx" ON "notes"("isPinned");
CREATE INDEX IF NOT EXISTS "notes_isArchived_idx" ON "notes"("isArchived");
CREATE INDEX IF NOT EXISTS "notes_createdAt_idx" ON "notes"("createdAt");
CREATE INDEX IF NOT EXISTS "notes_updatedAt_idx" ON "notes"("updatedAt");

-- Tasks: Add composite indexes for task management
CREATE INDEX IF NOT EXISTS "tasks_category_idx" ON "tasks"("category");
CREATE INDEX IF NOT EXISTS "tasks_priority_idx" ON "tasks"("priority");
CREATE INDEX IF NOT EXISTS "tasks_createdAt_idx" ON "tasks"("createdAt");
CREATE INDEX IF NOT EXISTS "tasks_userId_status_idx" ON "tasks"("userId", "status");
CREATE INDEX IF NOT EXISTS "tasks_assignedTo_status_idx" ON "tasks"("assignedTo", "status");

-- CalendarEvents: Add indexes for date range queries
CREATE INDEX IF NOT EXISTS "calendar_events_endDate_idx" ON "calendar_events"("endDate");
CREATE INDEX IF NOT EXISTS "calendar_events_userId_startDate_idx" ON "calendar_events"("userId", "startDate");

-- Committees: Add indexes for organization queries
CREATE INDEX IF NOT EXISTS "committees_isActive_idx" ON "committees"("isActive");

-- Notifications: Add indexes for organization queries
CREATE INDEX IF NOT EXISTS "notifications_createdAt_idx" ON "notifications"("createdAt");
CREATE INDEX IF NOT EXISTS "notifications_sentAt_idx" ON "notifications"("sentAt");

-- UserNotifications: Add index for read status
CREATE INDEX IF NOT EXISTS "user_notifications_isRead_idx" ON "user_notifications"("isRead");
CREATE INDEX IF NOT EXISTS "user_notifications_userId_isRead_idx" ON "user_notifications"("userId", "isRead");

-- DirectoryUpdateRequests: Add indexes for organization queries
CREATE INDEX IF NOT EXISTS "directory_update_requests_createdAt_idx" ON "directory_update_requests"("createdAt");

-- Transactions: Add indexes for reporting
CREATE INDEX IF NOT EXISTS "transactions_isReconciled_idx" ON "transactions"("isReconciled");

-- ChartOfAccounts: Add indexes for organization queries
CREATE INDEX IF NOT EXISTS "chart_of_accounts_isActive_idx" ON "chart_of_accounts"("isActive");

-- Sessions: Add index for userId (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Session') THEN
        CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
    END IF;
END
$$;

-- Accounts: Add index for userId (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Account') THEN
        CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
    END IF;
END
$$;
