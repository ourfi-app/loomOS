
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = "force-dynamic";

// PUT /api/additional-residents/:id - Update an additional resident
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await getCurrentOrganizationId();
    const body = await req.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { name, relationship, email, phone, isEmergencyContact } = body;

    const resident = await prisma.additionalResident.update({
      where: {
        id: params.id 
      },
      data: {
        ...(name && { name }),
        ...(relationship && { relationship }),
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        isEmergencyContact: isEmergencyContact !== undefined ? isEmergencyContact : undefined,
      },
    });

    return NextResponse.json(resident);
  } catch (error) {
    console.error("Error updating additional resident:", error);
    return NextResponse.json(
      { error: "Failed to update additional resident" },
      { status: 500 }
    );
  }
}

// DELETE /api/additional-residents/:id - Delete an additional resident
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await getCurrentOrganizationId();

    await prisma.additionalResident.delete({
      where: {
        id: params.id 
      },
    });

    return NextResponse.json({ message: "Additional resident deleted successfully" });
  } catch (error) {
    console.error("Error deleting additional resident:", error);
    return NextResponse.json(
      { error: "Failed to delete additional resident" },
      { status: 500 }
    );
  }
}
