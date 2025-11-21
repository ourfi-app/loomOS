
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions = [
  // User Management
  { id: 'perm_user_view', name: 'View Users', description: 'View user profiles and information', category: 'User Management', resource: 'users', action: 'view' },
  { id: 'perm_user_create', name: 'Create Users', description: 'Add new users to the system', category: 'User Management', resource: 'users', action: 'create' },
  { id: 'perm_user_edit', name: 'Edit Users', description: 'Modify user profiles and settings', category: 'User Management', resource: 'users', action: 'edit' },
  { id: 'perm_user_delete', name: 'Delete Users', description: 'Remove users from the system', category: 'User Management', resource: 'users', action: 'delete' },
  { id: 'perm_user_manage_roles', name: 'Manage User Roles', description: 'Assign and modify user roles', category: 'User Management', resource: 'users', action: 'manage_roles' },

  // Document Management
  { id: 'perm_document_view', name: 'View Documents', description: 'View community documents', category: 'Document Management', resource: 'documents', action: 'view' },
  { id: 'perm_document_upload', name: 'Upload Documents', description: 'Upload new documents', category: 'Document Management', resource: 'documents', action: 'upload' },
  { id: 'perm_document_edit', name: 'Edit Documents', description: 'Modify document details', category: 'Document Management', resource: 'documents', action: 'edit' },
  { id: 'perm_document_delete', name: 'Delete Documents', description: 'Remove documents', category: 'Document Management', resource: 'documents', action: 'delete' },
  { id: 'perm_document_manage_folders', name: 'Manage Folders', description: 'Create and organize document folders', category: 'Document Management', resource: 'documents', action: 'manage_folders' },

  // Directory Management
  { id: 'perm_directory_view', name: 'View Directory', description: 'View resident directory', category: 'Directory Management', resource: 'directory', action: 'view' },
  { id: 'perm_directory_edit', name: 'Edit Directory', description: 'Modify directory entries', category: 'Directory Management', resource: 'directory', action: 'edit' },
  { id: 'perm_directory_export', name: 'Export Directory', description: 'Export directory data', category: 'Directory Management', resource: 'directory', action: 'export' },
  { id: 'perm_directory_manage_requests', name: 'Manage Update Requests', description: 'Approve directory update requests', category: 'Directory Management', resource: 'directory', action: 'manage_requests' },

  // Financial Management
  { id: 'perm_payment_view', name: 'View Payments', description: 'View payment records', category: 'Financial Management', resource: 'payments', action: 'view' },
  { id: 'perm_payment_create', name: 'Create Payments', description: 'Record new payments', category: 'Financial Management', resource: 'payments', action: 'create' },
  { id: 'perm_payment_edit', name: 'Edit Payments', description: 'Modify payment records', category: 'Financial Management', resource: 'payments', action: 'edit' },
  { id: 'perm_budget_view', name: 'View Budget', description: 'View budget information', category: 'Financial Management', resource: 'budget', action: 'view' },
  { id: 'perm_budget_edit', name: 'Edit Budget', description: 'Modify budget data', category: 'Financial Management', resource: 'budget', action: 'edit' },

  // Communication
  { id: 'perm_message_send', name: 'Send Messages', description: 'Send messages to residents', category: 'Communication', resource: 'messages', action: 'send' },
  { id: 'perm_message_broadcast', name: 'Broadcast Messages', description: 'Send announcements to all', category: 'Communication', resource: 'messages', action: 'broadcast' },
  { id: 'perm_announcement_create', name: 'Create Announcements', description: 'Post announcements', category: 'Communication', resource: 'announcements', action: 'create' },
  { id: 'perm_announcement_edit', name: 'Edit Announcements', description: 'Modify announcements', category: 'Communication', resource: 'announcements', action: 'edit' },
  { id: 'perm_announcement_delete', name: 'Delete Announcements', description: 'Remove announcements', category: 'Communication', resource: 'announcements', action: 'delete' },

  // System Administration
  { id: 'perm_settings_view', name: 'View Settings', description: 'View system settings', category: 'System Administration', resource: 'settings', action: 'view' },
  { id: 'perm_settings_edit', name: 'Edit Settings', description: 'Modify system settings', category: 'System Administration', resource: 'settings', action: 'edit' },
  { id: 'perm_role_view', name: 'View Roles', description: 'View role definitions', category: 'System Administration', resource: 'roles', action: 'view' },
  { id: 'perm_role_create', name: 'Create Roles', description: 'Create custom roles', category: 'System Administration', resource: 'roles', action: 'create' },
  { id: 'perm_role_edit', name: 'Edit Roles', description: 'Modify role permissions', category: 'System Administration', resource: 'roles', action: 'edit' },
  { id: 'perm_role_delete', name: 'Delete Roles', description: 'Remove custom roles', category: 'System Administration', resource: 'roles', action: 'delete' },
  { id: 'perm_org_manage', name: 'Manage Organization', description: 'Manage organization settings', category: 'System Administration', resource: 'organization', action: 'manage' },

  // Tasks & Calendar
  { id: 'perm_task_view', name: 'View Tasks', description: 'View tasks and assignments', category: 'Tasks & Calendar', resource: 'tasks', action: 'view' },
  { id: 'perm_task_create', name: 'Create Tasks', description: 'Create new tasks', category: 'Tasks & Calendar', resource: 'tasks', action: 'create' },
  { id: 'perm_task_edit', name: 'Edit Tasks', description: 'Modify task details', category: 'Tasks & Calendar', resource: 'tasks', action: 'edit' },
  { id: 'perm_task_delete', name: 'Delete Tasks', description: 'Remove tasks', category: 'Tasks & Calendar', resource: 'tasks', action: 'delete' },
  { id: 'perm_calendar_view', name: 'View Calendar', description: 'View community calendar', category: 'Tasks & Calendar', resource: 'calendar', action: 'view' },
  { id: 'perm_calendar_create', name: 'Create Events', description: 'Create calendar events', category: 'Tasks & Calendar', resource: 'calendar', action: 'create' },
  { id: 'perm_calendar_edit', name: 'Edit Events', description: 'Modify calendar events', category: 'Tasks & Calendar', resource: 'calendar', action: 'edit' },
  { id: 'perm_calendar_delete', name: 'Delete Events', description: 'Remove calendar events', category: 'Tasks & Calendar', resource: 'calendar', action: 'delete' },

  // Committees
  { id: 'perm_committee_view', name: 'View Committees', description: 'View committee information', category: 'Committees', resource: 'committees', action: 'view' },
  { id: 'perm_committee_create', name: 'Create Committees', description: 'Create new committees', category: 'Committees', resource: 'committees', action: 'create' },
  { id: 'perm_committee_edit', name: 'Edit Committees', description: 'Modify committee details', category: 'Committees', resource: 'committees', action: 'edit' },
  { id: 'perm_committee_delete', name: 'Delete Committees', description: 'Remove committees', category: 'Committees', resource: 'committees', action: 'delete' },
];

async function main() {
  
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      update: {},
      create: permission,
    });
  }
  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
