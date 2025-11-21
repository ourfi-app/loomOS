/**
 * Committees API Route
 *
 * GET /api/committees - List all active committees with members
 * POST /api/committees - Create a new committee (Admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { withTenant, withAdminTenant, validateRequestBody } from '@/lib/api-middleware';
import { createCommitteeSchema } from '@/lib/validation-schemas';
import { handleApiError, ApiError } from '@/lib/api-errors';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/committees
 * Returns all active committees with their members
 */
export const GET = withTenant(async (req, session, organizationId) => {
  try {
    const committees = await prisma.committee.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
                unitNumber: true,
                phone: true,
                image: true,
              },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ committees });
  } catch (error) {
    return handleApiError(error, '/api/committees');
  }
});

/**
 * POST /api/committees
 * Creates a new committee
 * Requires admin access
 */
export const POST = withAdminTenant(async (req, session, organizationId) => {
  try {
    // Validate request body
    const validation = await validateRequestBody(req, createCommitteeSchema);
    if (validation.success === false) {
      return validation.error;
    }

    const { name, description, type, email, displayOrder } = validation.data;

    // Check if committee with same name already exists
    const existingCommittee = await prisma.committee.findFirst({
      where: {
        organizationId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingCommittee) {
      throw ApiError.duplicate('Committee', { name });
    }

    // Create the committee
    const committee = await prisma.committee.create({
      data: {
        organizationId,
        name,
        description,
        type,
        email: email || null,
        displayOrder: displayOrder ?? 0,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
                unitNumber: true,
                phone: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ committee }, { status: 201 });
  } catch (error) {
    return handleApiError(error, '/api/committees');
  }
});
