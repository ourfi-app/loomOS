
-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_roles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "basedOn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_custom_roles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customRoleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "user_custom_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_category_idx" ON "permissions"("category");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");

-- CreateIndex
CREATE INDEX "custom_roles_organizationId_idx" ON "custom_roles"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_roles_organizationId_name_key" ON "custom_roles"("organizationId", "name");

-- CreateIndex
CREATE INDEX "role_permissions_organizationId_idx" ON "role_permissions"("organizationId");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_organizationId_roleId_permissionId_key" ON "role_permissions"("organizationId", "roleId", "permissionId");

-- CreateIndex
CREATE INDEX "user_custom_roles_organizationId_idx" ON "user_custom_roles"("organizationId");

-- CreateIndex
CREATE INDEX "user_custom_roles_userId_idx" ON "user_custom_roles"("userId");

-- CreateIndex
CREATE INDEX "user_custom_roles_customRoleId_idx" ON "user_custom_roles"("customRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_custom_roles_organizationId_userId_customRoleId_key" ON "user_custom_roles"("organizationId", "userId", "customRoleId");

-- AddForeignKey
ALTER TABLE "custom_roles" ADD CONSTRAINT "custom_roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "custom_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_custom_roles" ADD CONSTRAINT "user_custom_roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_custom_roles" ADD CONSTRAINT "user_custom_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_custom_roles" ADD CONSTRAINT "user_custom_roles_customRoleId_fkey" FOREIGN KEY ("customRoleId") REFERENCES "custom_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default system permissions
INSERT INTO "permissions" ("id", "name", "description", "category", "resource", "action", "createdAt", "updatedAt") VALUES
-- User Management
('perm_user_view', 'View Users', 'View user profiles and information', 'User Management', 'users', 'view', NOW(), NOW()),
('perm_user_create', 'Create Users', 'Add new users to the system', 'User Management', 'users', 'create', NOW(), NOW()),
('perm_user_edit', 'Edit Users', 'Modify user profiles and settings', 'User Management', 'users', 'edit', NOW(), NOW()),
('perm_user_delete', 'Delete Users', 'Remove users from the system', 'User Management', 'users', 'delete', NOW(), NOW()),
('perm_user_manage_roles', 'Manage User Roles', 'Assign and modify user roles', 'User Management', 'users', 'manage_roles', NOW(), NOW()),

-- Document Management
('perm_document_view', 'View Documents', 'View community documents', 'Document Management', 'documents', 'view', NOW(), NOW()),
('perm_document_upload', 'Upload Documents', 'Upload new documents', 'Document Management', 'documents', 'upload', NOW(), NOW()),
('perm_document_edit', 'Edit Documents', 'Modify document details', 'Document Management', 'documents', 'edit', NOW(), NOW()),
('perm_document_delete', 'Delete Documents', 'Remove documents', 'Document Management', 'documents', 'delete', NOW(), NOW()),
('perm_document_manage_folders', 'Manage Folders', 'Create and organize document folders', 'Document Management', 'documents', 'manage_folders', NOW(), NOW()),

-- Directory Management
('perm_directory_view', 'View Directory', 'View resident directory', 'Directory Management', 'directory', 'view', NOW(), NOW()),
('perm_directory_edit', 'Edit Directory', 'Modify directory entries', 'Directory Management', 'directory', 'edit', NOW(), NOW()),
('perm_directory_export', 'Export Directory', 'Export directory data', 'Directory Management', 'directory', 'export', NOW(), NOW()),
('perm_directory_manage_requests', 'Manage Update Requests', 'Approve directory update requests', 'Directory Management', 'directory', 'manage_requests', NOW(), NOW()),

-- Financial Management
('perm_payment_view', 'View Payments', 'View payment records', 'Financial Management', 'payments', 'view', NOW(), NOW()),
('perm_payment_create', 'Create Payments', 'Record new payments', 'Financial Management', 'payments', 'create', NOW(), NOW()),
('perm_payment_edit', 'Edit Payments', 'Modify payment records', 'Financial Management', 'payments', 'edit', NOW(), NOW()),
('perm_budget_view', 'View Budget', 'View budget information', 'Financial Management', 'budget', 'view', NOW(), NOW()),
('perm_budget_edit', 'Edit Budget', 'Modify budget data', 'Financial Management', 'budget', 'edit', NOW(), NOW()),

-- Communication
('perm_message_send', 'Send Messages', 'Send messages to residents', 'Communication', 'messages', 'send', NOW(), NOW()),
('perm_message_broadcast', 'Broadcast Messages', 'Send announcements to all', 'Communication', 'messages', 'broadcast', NOW(), NOW()),
('perm_announcement_create', 'Create Announcements', 'Post announcements', 'Communication', 'announcements', 'create', NOW(), NOW()),
('perm_announcement_edit', 'Edit Announcements', 'Modify announcements', 'Communication', 'announcements', 'edit', NOW(), NOW()),
('perm_announcement_delete', 'Delete Announcements', 'Remove announcements', 'Communication', 'announcements', 'delete', NOW(), NOW()),

-- System Administration
('perm_settings_view', 'View Settings', 'View system settings', 'System Administration', 'settings', 'view', NOW(), NOW()),
('perm_settings_edit', 'Edit Settings', 'Modify system settings', 'System Administration', 'settings', 'edit', NOW(), NOW()),
('perm_role_view', 'View Roles', 'View role definitions', 'System Administration', 'roles', 'view', NOW(), NOW()),
('perm_role_create', 'Create Roles', 'Create custom roles', 'System Administration', 'roles', 'create', NOW(), NOW()),
('perm_role_edit', 'Edit Roles', 'Modify role permissions', 'System Administration', 'roles', 'edit', NOW(), NOW()),
('perm_role_delete', 'Delete Roles', 'Remove custom roles', 'System Administration', 'roles', 'delete', NOW(), NOW()),
('perm_org_manage', 'Manage Organization', 'Manage organization settings', 'System Administration', 'organization', 'manage', NOW(), NOW()),

-- Tasks & Calendar
('perm_task_view', 'View Tasks', 'View tasks and assignments', 'Tasks & Calendar', 'tasks', 'view', NOW(), NOW()),
('perm_task_create', 'Create Tasks', 'Create new tasks', 'Tasks & Calendar', 'tasks', 'create', NOW(), NOW()),
('perm_task_edit', 'Edit Tasks', 'Modify task details', 'Tasks & Calendar', 'tasks', 'edit', NOW(), NOW()),
('perm_task_delete', 'Delete Tasks', 'Remove tasks', 'Tasks & Calendar', 'tasks', 'delete', NOW(), NOW()),
('perm_calendar_view', 'View Calendar', 'View community calendar', 'Tasks & Calendar', 'calendar', 'view', NOW(), NOW()),
('perm_calendar_create', 'Create Events', 'Create calendar events', 'Tasks & Calendar', 'calendar', 'create', NOW(), NOW()),
('perm_calendar_edit', 'Edit Events', 'Modify calendar events', 'Tasks & Calendar', 'calendar', 'edit', NOW(), NOW()),
('perm_calendar_delete', 'Delete Events', 'Remove calendar events', 'Tasks & Calendar', 'calendar', 'delete', NOW(), NOW()),

-- Committees
('perm_committee_view', 'View Committees', 'View committee information', 'Committees', 'committees', 'view', NOW(), NOW()),
('perm_committee_create', 'Create Committees', 'Create new committees', 'Committees', 'committees', 'create', NOW(), NOW()),
('perm_committee_edit', 'Edit Committees', 'Modify committee details', 'Committees', 'committees', 'edit', NOW(), NOW()),
('perm_committee_delete', 'Delete Committees', 'Remove committees', 'Committees', 'committees', 'delete', NOW(), NOW());
