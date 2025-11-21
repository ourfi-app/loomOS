/**
 * Validation Schemas for API Routes
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ============================================================================
// Common Schemas
// ============================================================================

export const idSchema = z.string().uuid('Invalid ID format');
export const emailSchema = z.string().email('Invalid email format');
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional();
export const urlSchema = z.string().url('Invalid URL format');
export const dateSchema = z.string().datetime().or(z.date());

// ============================================================================
// Auth & User Schemas
// ============================================================================

export const signupSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  unitNumber: z.string().optional(),
  role: z.enum(['RESIDENT', 'BOARD_MEMBER', 'ADMIN']).optional(),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  role: z.enum(['RESIDENT', 'BOARD_MEMBER', 'ADMIN']).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  unitNumber: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(['RESIDENT', 'BOARD_MEMBER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

// ============================================================================
// Message Schemas
// ============================================================================

export const createMessageSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
  recipientIds: z.array(z.string().min(1, 'Recipient ID cannot be empty')).min(1, 'At least one recipient is required'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional().default('NORMAL'),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
  })).optional(),
});

export const updateMessageSchema = z.object({
  isRead: z.boolean().optional(),
  isStarred: z.boolean().optional(),
  folder: z.string().optional(),
});

// ============================================================================
// Calendar Schemas
// ============================================================================

export const createCalendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: dateSchema,
  endDate: dateSchema,
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().optional(),
  type: z.enum(['EVENT', 'MEETING', 'REMINDER', 'TASK']).optional(),
  color: z.string().optional(),
  attendees: z.array(z.any()).optional(),
  attendeeCount: z.number().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.enum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  recurrenceEnd: dateSchema.optional(),
  reminders: z.array(z.any()).optional(),
  isPrivate: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  category: z.string().optional(),
});

// ============================================================================
// Document Schemas
// ============================================================================

export const uploadDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export const searchDocumentsSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// ============================================================================
// Task Schemas
// ============================================================================

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  dueDate: dateSchema.optional(),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  dueDate: dateSchema.optional(),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// ============================================================================
// Payment Schemas
// ============================================================================

export const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  dueDate: dateSchema,
  type: z.enum(['MAINTENANCE', 'SPECIAL_ASSESSMENT', 'FINE', 'OTHER']).optional(),
});

export const processPaymentSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method is required'),
  amount: z.number().positive('Amount must be positive'),
});

// ============================================================================
// Announcement Schemas
// ============================================================================

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  expiresAt: dateSchema.optional(),
  isPinned: z.boolean().optional(),
  category: z.string().optional(),
});

export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  expiresAt: dateSchema.optional(),
  isPinned: z.boolean().optional(),
  category: z.string().optional(),
});

// ============================================================================
// Maintenance Request Schemas
// ============================================================================

export const createMaintenanceRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  location: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const updateMaintenanceRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// Brandy AI Schemas
// ============================================================================

export const brandyGenerateWebSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  context: z.string().optional(),
  style: z.string().optional(),
});

export const brandyClaudeHelperSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
  context: z.any().optional(),
});

// ============================================================================
// Organization Schemas
// ============================================================================

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  domain: z.string().min(1, 'Domain is required'),
  type: z.enum(['HOA', 'CONDO', 'APARTMENT', 'OTHER']).optional(),
  address: z.string().optional(),
  phone: phoneSchema,
  email: emailSchema.optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  type: z.enum(['HOA', 'CONDO', 'APARTMENT', 'OTHER']).optional(),
  address: z.string().optional(),
  phone: phoneSchema,
  email: emailSchema.optional(),
  settings: z.any().optional(),
});

// ============================================================================
// Chat Schemas
// ============================================================================

export const sendChatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
  recipientId: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
});

// ============================================================================
// Notification Schemas
// ============================================================================

export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['EMAIL', 'SMS', 'BOTH']).default('EMAIL'),
  isUrgent: z.boolean().optional().default(false),
  recipientIds: z.array(z.string()).min(1, 'At least one recipient is required'),
  scheduledFor: z.string().datetime().optional(),
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
  readAt: z.string().datetime().optional(),
});

export const markNotificationReadSchema = z.object({
  isRead: z.boolean(),
});

// ============================================================================
// User Management Schemas
// ============================================================================

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN', 'BOARD_MEMBER']),
});

export const updateUserBadgeSchema = z.object({
  badge: z.string().optional(),
  color: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  onlineStatus: z.enum(['ONLINE', 'OFFLINE', 'AWAY', 'BUSY']).optional(),
});

// ============================================================================
// Pet Schemas
// ============================================================================

export const createPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().optional(),
  age: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  color: z.string().optional(),
  microchipId: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const updatePetSchema = z.object({
  name: z.string().min(1).optional(),
  species: z.string().optional(),
  breed: z.string().optional(),
  age: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  color: z.string().optional(),
  microchipId: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// ============================================================================
// Message Folder Schemas
// ============================================================================

export const createMessageFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  icon: z.string().optional(),
  displayOrder: z.number().optional(),
});

export const updateMessageFolderSchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  displayOrder: z.number().optional(),
});

// ============================================================================
// Committee Schemas
// ============================================================================

export const updateCommitteeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(['BOARD', 'ADVISORY', 'SPECIAL']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const addCommitteeMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['CHAIR', 'MEMBER', 'SECRETARY']).optional().default('MEMBER'),
  startDate: z.string().datetime().optional(),
});

export const updateCommitteeMemberSchema = z.object({
  role: z.enum(['CHAIR', 'MEMBER', 'SECRETARY']).optional(),
  endDate: z.string().datetime().optional(),
});

// ============================================================================
// Calendar Update Schema
// ============================================================================

export const updateCalendarEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  allDay: z.boolean().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  recurrence: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    interval: z.number().min(1),
    endDate: z.string().datetime().optional(),
  }).optional(),
});

// ============================================================================
// Google Drive Import Schema
// ============================================================================

export const googleDriveImportSchema = z.object({
  fileId: z.string().min(1, 'File ID is required'),
  folderId: z.string().optional(),
  includePermissions: z.boolean().optional().default(false),
});

// ============================================================================
// Message Star Schema
// ============================================================================

export const starMessageSchema = z.object({
  isStarred: z.boolean(),
});

// ============================================================================
// Generic Schemas
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const idParamSchema = z.object({
  id: idSchema,
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate request body against a schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  return schema.parse(body);
}

/**
 * Safely validate request body and return result
 */
export function safeValidateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(body);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}
