// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parse } from 'csv-parse/sync';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read CSV file
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    let imported = 0;
    let failed = 0;

    // Process each record
    for (const record of records) {
      try {
        const email = record['Email']?.toLowerCase().trim();
        const firstName = record['First Name']?.trim();
        const lastName = record['Last Name']?.trim();
        const unitNumber = record['Unit Number']?.trim();
        const phone = record['Phone']?.trim();
        const isOwner = record['Is Owner']?.toLowerCase() === 'yes';
        const moveInDate = record['Move In Date'] ? new Date(record['Move In Date']) : undefined;

        if (!email || !firstName || !lastName) {
          failed++;
          continue;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Update existing user
          await prisma.user.update({
            where: { email },
            data: {
              firstName,
              lastName,
              unitNumber,
              phone,
              role: 'RESIDENT',
            },
          });
        } else {
          // Create new user with temporary password
          const tempPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          await prisma.user.create({
            data: {
              email,
              firstName,
              lastName,
              name: `${firstName} ${lastName}`,
              unitNumber,
              phone,
              role: 'RESIDENT',
              password: hashedPassword,
            },
          });

          // Send invitation email with temp password
          try {
            const { getEmailService, generateResidentInvitationEmail } = await import('@/lib/email-helper');
            const emailService = getEmailService();

            const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;

            await emailService.send({
              to: email,
              subject: 'Welcome to Your Community Portal',
              html: generateResidentInvitationEmail(firstName, email, tempPassword, loginUrl),
              text: `Hi ${firstName},\n\nWelcome to your community portal! An account has been created for you.\n\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nPlease log in at: ${loginUrl}\n\nIMPORTANT: Please change your password after your first login for security.\n\nIf you have any questions, please contact your building management.`,
            });

          } catch (emailError) {
            console.error('Failed to send invitation email:', emailError);
            // Don't fail the import if email fails
          }
        }

        imported++;
      } catch (error) {
        console.error('Error importing resident:', error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      total: records.length,
      imported,
      failed,
    });
  } catch (error) {
    console.error('Error importing residents:', error);
    return NextResponse.json(
      { error: 'Failed to import residents' },
      { status: 500 }
    );
  }
}
