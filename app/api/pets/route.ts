
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = "force-dynamic";

// GET /api/pets - Get all pets (with optional unit filter)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    const { searchParams } = new URL(req.url);
    const unitNumber = searchParams.get("unitNumber");

    const where = unitNumber ? { unitNumber } : {};

    const pets = await prisma.pet.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}

// POST /api/pets - Create a new pet
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const body = await req.json();
    const { unitNumber, name, type, breed, color, weight, age, description } = body;

    if (!unitNumber || !name || !type) {
      return NextResponse.json(
        { error: "Unit number, name, and type are required" },
        { status: 400 }
      );
    }

    const pet = await prisma.pet.create({
      data: {
        organizationId,
        unitNumber,
        name,
        type,
        breed: breed || null,
        color: color || null,
        weight: weight || null,
        age: age || null,
        description: description || null,
      },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    console.error("Error creating pet:", error);
    return NextResponse.json(
      { error: "Failed to create pet" },
      { status: 500 }
    );
  }
}
