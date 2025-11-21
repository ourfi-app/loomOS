
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { getPaletteById } from '@/lib/color-palettes';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Get the current palette setting (public access - no auth required)
    const settings = await prisma.associationSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      paletteId: settings?.colorPalette || 'default',
    });
  } catch (error) {
    console.error('Error fetching palette:', error);
    return NextResponse.json(
      { error: 'Failed to fetch palette' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const organizationId = await getCurrentOrganizationId();
    const { paletteId } = await request.json();

    if (!paletteId) {
      return NextResponse.json(
        { error: 'Palette ID is required' },
        { status: 400 }
      );
    }

    // Validate the palette exists
    const palette = getPaletteById(paletteId);
    if (!palette) {
      return NextResponse.json(
        { error: 'Invalid palette ID' },
        { status: 400 }
      );
    }

    // Update or create settings
    const existingSettings = await prisma.associationSettings.findFirst({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    let settings;
    if (existingSettings) {
      settings = await prisma.associationSettings.update({
        where: {
          id: existingSettings.id
        },
        data: { colorPalette: paletteId },
      });
    } else {
      settings = await prisma.associationSettings.create({
        data: {
          organizationId,
          colorPalette: paletteId
        },
      });
    }

    return NextResponse.json({
      success: true,
      paletteId: settings.colorPalette,
    });
  } catch (error) {
    console.error('Error updating palette:', error);
    return NextResponse.json(
      { error: 'Failed to update palette' },
      { status: 500 }
    );
  }
}
