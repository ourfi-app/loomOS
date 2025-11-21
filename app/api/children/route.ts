
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = "force-dynamic";

// GET /api/children - Get all children (with optional unit filter)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    const { searchParams } = new URL(req.url);
    const unitNumber = searchParams.get("unitNumber");

    const where = unitNumber ? { unitNumber } : {};

    const children = await prisma.child.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
}

// POST /api/children - Create a new child
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const body = await req.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { unitNumber, name, age, birthYear, grade, school } = body;

    if (!unitNumber || !name) {
      return NextResponse.json(
        { error: "Unit number and name are required" },
        { status: 400 }
      );
    }

    const child = await prisma.child.create({
      data: {
        organizationId,
        unitNumber,
        name,
        age: age ? parseInt(age) : null,
        birthYear: birthYear ? parseInt(birthYear) : null,
        grade: grade || null,
        school: school || null,
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    console.error("Error creating child:", error);
    return NextResponse.json(
      { error: "Failed to create child" },
      { status: 500 }
    );
  }
}
