import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { signupSchema } from "@/lib/validation-schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    const { email, password, firstName, lastName, unitNumber, role = "RESIDENT" } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return createErrorResponse("User already exists with this email", 400, "DUPLICATE_ENTRY");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        unitNumber: unitNumber || null,
        role: UserRole[role as keyof typeof UserRole] || UserRole.RESIDENT,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        unitNumber: true,
        role: true,
      },
    });

    return createSuccessResponse(user, { count: 1 });
  } catch (error) {
    console.error('[API Error] Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        'Validation failed: ' + error.errors.map(e => e.message).join(', '),
        400,
        'VALIDATION_ERROR',
        error.errors
      );
    }
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
