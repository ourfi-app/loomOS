
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const user = session.user as any;
    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { results } = await request.json();

    if (!results || !Array.isArray(results)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const result of results) {
      if (result.status === 'error') {
        skipped++;
        continue;
      }

      const data = result.data;
      const unitNumber = data.Unit?.trim();
      const email = data.Email?.trim().toLowerCase();
      const firstName = data.FirstName?.trim();
      const lastName = data.LastName?.trim();

      if (!unitNumber) {
        skipped++;
        continue;
      }

      try {
        // Try to find existing user by email or unit number
        let existingUser = null;
        
        if (email) {
          existingUser = await prisma.user.findUnique({
            where: {
        organizationId, email 
      },
          });
        }

        if (!existingUser) {
          existingUser = await prisma.user.findFirst({
            where: {
        organizationId, unitNumber 
      },
          });
        }

        // Prepare user data
        const userData: any = {
          unitNumber,
          firstName: firstName || null,
          lastName: lastName || null,
          name: [firstName, lastName].filter(Boolean).join(' ') || null,
        };

        // Handle phone numbers - prefer Mobile, fallback to Home Phone
        const mobile = data.Mobile?.trim();
        const homePhone = data['Home Phone']?.trim();
        if (mobile) {
          userData.phone = mobile;
        } else if (homePhone) {
          userData.phone = homePhone;
        }

        // Handle address
        const mailingStreet = data['Mailing Street']?.trim();
        const cityStateZip = data['City, State Zip']?.trim();
        if (mailingStreet || cityStateZip) {
          userData.address = [mailingStreet, cityStateZip].filter(Boolean).join(', ');
        }

        if (email) {
          userData.email = email;
        }

        if (existingUser) {
          // Update existing user
          await prisma.user.update({
            where: {
        organizationId,
        id: existingUser.id 
      },
            data: userData,
          });
          updated++;
        } else if (email) {
          // Create new user with email
          const tempPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          await prisma.user.create({
            data: {
        organizationId,
              ...userData,
              password: hashedPassword,
              role: 'RESIDENT',
            },
          });
          imported++;
        } else {
          // Skip if no email and no existing user
          skipped++;
          continue;
        }
      } catch (error) {
        console.error(`Error importing row for unit ${unitNumber}:`, error);
        skipped++;
      }
    }

    return NextResponse.json({ 
      success: true,
      imported,
      updated,
      skipped,
      message: `Imported ${imported} new records, updated ${updated} records, skipped ${skipped} records`,
    });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    );
  }
}
