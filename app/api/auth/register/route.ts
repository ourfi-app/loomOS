import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { registerSchema } from "@/lib/validation-schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password, name, phone, unitNumber, role = "RESIDENT" } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return createErrorResponse("User already exists with this email", 400, "DUPLICATE_ENTRY");
    }

    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name,
        phone,
        unitNumber,
        role: UserRole[role as keyof typeof UserRole] || UserRole.RESIDENT,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        unitNumber: true,
        role: true,
      },
    });

    return createSuccessResponse(user, { count: 1 });
  } catch (error) {
    console.error('[API Error] Register error:', error);
    
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
