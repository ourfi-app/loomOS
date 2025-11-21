
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = "force-dynamic";

// GET /api/additional-residents - Get all additional residents (with optional unit filter)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    const { searchParams } = new URL(req.url);
    const unitNumber = searchParams.get("unitNumber");

    const where = unitNumber ? { unitNumber } : {};

    const residents = await prisma.additionalResident.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(residents);
  } catch (error) {
    console.error("Error fetching additional residents:", error);
    return NextResponse.json(
      { error: "Failed to fetch additional residents" },
      { status: 500 }
    );
  }
}

// POST /api/additional-residents - Create a new additional resident
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
    
    const { unitNumber, name, relationship, email, phone, isEmergencyContact } = body;

    if (!unitNumber || !name || !relationship) {
      return NextResponse.json(
        { error: "Unit number, name, and relationship are required" },
        { status: 400 }
      );
    }

    const resident = await prisma.additionalResident.create({
      data: {
        organizationId,
        unitNumber,
        name,
        relationship,
        email: email || null,
        phone: phone || null,
        isEmergencyContact: isEmergencyContact || false,
      },
    });

    return NextResponse.json(resident, { status: 201 });
  } catch (error) {
    console.error("Error creating additional resident:", error);
    return NextResponse.json(
      { error: "Failed to create additional resident" },
      { status: 500 }
    );
  }
}
