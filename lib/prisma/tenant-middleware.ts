/**
 * Prisma Middleware for Automatic Tenant Isolation
 * Ensures all queries are scoped to the correct organization
 */

import { Prisma } from '@prisma/client';

/**
 * Models that should be filtered by organizationId
 */
const TENANT_SCOPED_MODELS = [
  'Payment',
  'File',
  'Notification',
  'UserNotification',
  'Announcement',
  'DuesSettings',
  'AssociationSettings',
  'ChatSession',
  'Document',
  'Committee',
  'CommitteeMember',
  'DirectoryUpdateRequest',
  'Pet',
  'Child',
  'AdditionalResident',
  'PropertyUnit',
  'MessageFolder',
  'Message',
  'MessageRecipient',
  'Note',
  'CalendarEvent',
  'Task',
  'ChartOfAccounts',
  'Transaction',
  'AnnualBudget',
  'Vendor',
  'Invoice',
  'PropertyListing',
  'ResidentInquiry',
  'PropertyAmenity',
  'CustomRole',
  'RolePermission',
  'UserCustomRole',
  'CommunityPost',
  'PostLike',
  'PostComment',
  'CommentLike',
  'MarketplaceApp',
  'UserInstalledApp',
  'AppUpdateHistory',
  'AppReview',
];

/**
 * Create tenant isolation middleware
 * @param organizationId - The organization ID to scope queries to
 */
export function createTenantMiddleware(organizationId: string) {
  return async (params: any, next: any) => {
    const { model, action } = params;

    // Skip if not a tenant-scoped model
    if (!model || !TENANT_SCOPED_MODELS.includes(model)) {
      return next(params);
    }

    // Read operations (findMany, findFirst, findUnique, count, aggregate)
    if (
      action === 'findMany' ||
      action === 'findFirst' ||
      action === 'findUnique' ||
      action === 'count' ||
      action === 'aggregate'
    ) {
      // Add organizationId filter to where clause
      params.args.where = params.args.where || {};

      // Don't override if organizationId is already set
      if (!params.args.where.organizationId) {
        params.args.where.organizationId = organizationId;
      }
    }

    // Write operations (create, createMany, update, updateMany)
    if (action === 'create') {
      // Automatically add organizationId to create data
      params.args.data = params.args.data || {};
      if (!params.args.data.organizationId) {
        params.args.data.organizationId = organizationId;
      }
    }

    if (action === 'createMany') {
      // Add organizationId to all records
      if (Array.isArray(params.args.data)) {
        params.args.data = params.args.data.map((item: any) => ({
          ...item,
          organizationId: item.organizationId || organizationId,
        }));
      }
    }

    if (action === 'update' || action === 'updateMany') {
      // Ensure update only affects records in this organization
      params.args.where = params.args.where || {};
      if (!params.args.where.organizationId) {
        params.args.where.organizationId = organizationId;
      }
    }

    if (action === 'delete' || action === 'deleteMany') {
      // Ensure delete only affects records in this organization
      params.args.where = params.args.where || {};
      if (!params.args.where.organizationId) {
        params.args.where.organizationId = organizationId;
      }
    }

    return next(params);
  };
}

/**
 * Middleware for preventing cross-tenant data access
 * This is a safety check that validates organizationId in results
 */
export function createTenantValidationMiddleware(organizationId: string) {
  return async (params: any, next: any) => {
    const { model, action } = params;

    const result = await next(params);

    // Skip validation for non-tenant models or SUPER_ADMIN queries
    if (!model || !TENANT_SCOPED_MODELS.includes(model)) {
      return result;
    }

    // Validate single result
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      if (result.organizationId && result.organizationId !== organizationId) {
        console.error(`[TENANT ISOLATION VIOLATION] Attempted to access ${model} from different organization`);
        throw new Error('Tenant isolation violation detected');
      }
    }

    // Validate array results
    if (Array.isArray(result)) {
      const violations = result.filter(
        (item) => item.organizationId && item.organizationId !== organizationId
      );

      if (violations.length > 0) {
        console.error(`[TENANT ISOLATION VIOLATION] Found ${violations.length} records from different organization`);
        throw new Error('Tenant isolation violation detected');
      }
    }

    return result;
  };
}

/**
 * Apply tenant middleware to Prisma client instance
 */
export function applyTenantMiddleware(
  prismaClient: any,
  organizationId: string,
  options: { validate?: boolean } = {}
) {
  // Add filtering middleware
  prismaClient.$use(createTenantMiddleware(organizationId));

  // Optionally add validation middleware (for extra safety in development)
  if (options.validate) {
    prismaClient.$use(createTenantValidationMiddleware(organizationId));
  }
}
