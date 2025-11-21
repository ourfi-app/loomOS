
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = "force-dynamic";

// PUT /api/pets/:id - Update a pet
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { name, type, breed, color, weight, age, description } = body;

    const pet = await prisma.pet.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        breed: breed !== undefined ? breed : undefined,
        color: color !== undefined ? color : undefined,
        weight: weight !== undefined ? weight : undefined,
        age: age !== undefined ? age : undefined,
        description: description !== undefined ? description : undefined,
      },
    });

    return NextResponse.json(pet);
  } catch (error) {
    console.error("Error updating pet:", error);
    return NextResponse.json(
      { error: "Failed to update pet" },
      { status: 500 }
    );
  }
}

// DELETE /api/pets/:id - Delete a pet
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const organizationId = await getCurrentOrganizationId();

    await prisma.pet.delete({
      where: {
        organizationId,
        id: params.id 
      },
    });

    return NextResponse.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      { error: "Failed to delete pet" },
      { status: 500 }
    );
  }
}
