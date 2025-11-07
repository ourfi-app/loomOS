/**
 * API Request Validation Schemas
 *
 * Centralized Zod schemas for validating API request bodies.
 * Ensures type safety and data integrity across all API routes.
 *
 * Usage:
 *   import { createCommitteeSchema } from '@/lib/validation-schemas';
 *   const result = validateRequestBody(req, createCommitteeSchema);
 */

import { z } from 'zod';
import { UserRole, PaymentStatus, NotificationType, MessagePriority, TaskPriority, TaskStatus } from '@prisma/client';

// ============================================================
// COMMITTEE SCHEMAS
// ============================================================

export const createCommitteeSchema = z.object({
  name: z.string().min(1, 'Committee name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  type: z.string().min(1, 'Committee type is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateCommitteeSchema = createCommitteeSchema.partial();

export const addCommitteeMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  position: z.string().max(100, 'Position name too long').optional(),
  bio: z.string().max(1000, 'Bio too long').optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateCommitteeMemberSchema = addCommitteeMemberSchema.partial();

// ============================================================
// USER SCHEMAS
// ============================================================

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  unitNumber: z.string().max(20, 'Unit number too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  role: z.nativeEnum(UserRole).default(UserRole.RESIDENT),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  unitNumber: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional(),
  image: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============================================================
// PAYMENT SCHEMAS
// ============================================================

export const createPaymentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  amount: z.number().positive('Amount must be positive').multipleOf(0.01),
  dueDate: z.string().datetime('Invalid date format').or(z.date()),
  description: z.string().max(200, 'Description too long').optional(),
  type: z.string().default('monthly_dues'),
});

export const updatePaymentSchema = z.object({
  status: z.nativeEnum(PaymentStatus).optional(),
  paidDate: z.string().datetime().or(z.date()).optional(),
  stripePaymentId: z.string().optional(),
});

export const processPaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  stripeToken: z.string().min(1, 'Stripe token is required'),
});

// ============================================================
// TASK SCHEMAS
// ============================================================

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: z.string().datetime().or(z.date()).optional(),
  assignedTo: z.string().optional(),
  category: z.string().max(50).default('general'),
  tags: z.array(z.string().max(30)).default([]),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().max(100).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

// ============================================================
// MESSAGE SCHEMAS
// ============================================================

export const createMessageSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  body: z.string().min(1, 'Message body is required').max(10000, 'Message too long'),
  recipients: z.array(z.object({
    userId: z.string().min(1),
    type: z.enum(['TO', 'CC', 'BCC']).default('TO'),
  })).min(1, 'At least one recipient is required'),
  priority: z.nativeEnum(MessagePriority).default(MessagePriority.NORMAL),
  hasAttachments: z.boolean().default(false),
});

export const updateMessageSchema = z.object({
  isRead: z.boolean().optional(),
  isStarred: z.boolean().optional(),
  folderId: z.string().optional(),
});

// ============================================================
// ANNOUNCEMENT SCHEMAS
// ============================================================

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  priority: z.enum(['urgent', 'normal', 'low']).default('normal'),
  targetRole: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().default(true),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

// ============================================================
// NOTIFICATION SCHEMAS
// ============================================================

export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  type: z.nativeEnum(NotificationType).default(NotificationType.EMAIL),
  isUrgent: z.boolean().default(false),
  scheduledAt: z.string().datetime().or(z.date()).optional(),
  recipientIds: z.array(z.string().min(1)).min(1, 'At least one recipient is required'),
});

// ============================================================
// HOUSEHOLD SCHEMAS
// ============================================================

export const createPetSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number is required').max(20),
  name: z.string().min(1, 'Pet name is required').max(50),
  type: z.string().min(1, 'Pet type is required').max(30),
  breed: z.string().max(50).optional(),
  color: z.string().max(30).optional(),
  weight: z.string().max(20).optional(),
  age: z.string().max(20).optional(),
  description: z.string().max(500).optional(),
});

export const updatePetSchema = createPetSchema.partial().omit({ unitNumber: true });

export const createChildSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number is required').max(20),
  name: z.string().min(1, 'Child name is required').max(100),
  age: z.number().int().min(0).max(18).optional(),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  grade: z.string().max(20).optional(),
  school: z.string().max(100).optional(),
});

export const updateChildSchema = createChildSchema.partial().omit({ unitNumber: true });

export const createAdditionalResidentSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number is required').max(20),
  name: z.string().min(1, 'Resident name is required').max(100),
  relationship: z.string().min(1, 'Relationship is required').max(50),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  isEmergencyContact: z.boolean().default(false),
});

export const updateAdditionalResidentSchema = createAdditionalResidentSchema.partial().omit({ unitNumber: true });

// ============================================================
// PROPERTY SCHEMAS
// ============================================================

export const createPropertyUnitSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number is required').max(20),
  building: z.string().max(50).optional(),
  floor: z.number().int().optional(),
  streetAddress: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().max(10).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  squareFootage: z.number().int().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parkingSpaces: z.number().int().min(0).default(0),
  storageUnit: z.string().max(50).optional(),
  balconySize: z.string().max(50).optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  notes: z.string().max(1000).optional(),
  occupancyStatus: z.enum(['occupied', 'vacant', 'rented', 'for_sale']).default('occupied'),
  monthlyDues: z.number().positive().multipleOf(0.01).optional(),
});

export const updatePropertyUnitSchema = createPropertyUnitSchema.partial().omit({ unitNumber: true });

// ============================================================
// NOTE SCHEMAS
// ============================================================

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(50000, 'Content too long'),
  category: z.string().max(50).default('general'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  isFavorite: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  tags: z.array(z.string().max(30)).default([]),
});

export const updateNoteSchema = createNoteSchema.partial();

// ============================================================
// TYPE EXPORTS
// ============================================================

export type CreateCommitteeInput = z.infer<typeof createCommitteeSchema>;
export type UpdateCommitteeInput = z.infer<typeof updateCommitteeSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
