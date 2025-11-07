
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = "force-dynamic";

// PUT /api/children/:id - Update a child
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
    const { name, age, birthYear, grade, school } = body;

    const child = await prisma.child.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: {
        ...(name && { name }),
        age: age !== undefined ? (age ? parseInt(age) : null) : undefined,
        birthYear: birthYear !== undefined ? (birthYear ? parseInt(birthYear) : null) : undefined,
        grade: grade !== undefined ? grade : undefined,
        school: school !== undefined ? school : undefined,
      },
    });

    return NextResponse.json(child);
  } catch (error) {
    console.error("Error updating child:", error);
    return NextResponse.json(
      { error: "Failed to update child" },
      { status: 500 }
    );
  }
}

// DELETE /api/children/:id - Delete a child
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

    await prisma.child.delete({
      where: {
        organizationId,
        id: params.id 
      },
    });

    return NextResponse.json({ message: "Child deleted successfully" });
  } catch (error) {
    console.error("Error deleting child:", error);
    return NextResponse.json(
      { error: "Failed to delete child" },
      { status: 500 }
    );
  }
}
