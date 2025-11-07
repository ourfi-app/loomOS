
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const user = session.user as any;
    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the first (and should be only) association settings record
    const settings = await prisma.associationSettings.findFirst();

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching association settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch association settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const user = session.user as any;
    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Remove undefined values to prevent overwriting with null
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
    );

    // Check if settings already exist
    const existingSettings = await prisma.associationSettings.findFirst({
      where: { organizationId }
    });

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.associationSettings.update({
        where: {
          id: existingSettings.id
        },
        data: {
          ...cleanData,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new settings
      settings = await prisma.associationSettings.create({
        data: {
          organizationId,
          ...cleanData,
        },
      });
    }

    return NextResponse.json({ 
      success: true,
      settings,
      message: 'Association settings saved successfully'
    });
  } catch (error) {
    console.error('Error saving association settings:', error);
    return NextResponse.json(
      { error: 'Failed to save association settings' },
      { status: 500 }
    );
  }
}
