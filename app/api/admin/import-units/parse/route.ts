
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parse } from 'csv-parse/sync';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

// Define the expected CSV row structure
interface CSVRow {
  Unit?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  [key: string]: string | undefined;
}

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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    
    // Parse CSV
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRow[];

    if (records.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
    }

    // Validate each row
    const validationResults = [];
    
    for (let i = 0; i < records.length; i++) {
      const row = records[i] as CSVRow;
      const rowNumber = i + 2; // +2 because of header row and 0-based index
      
      // Basic validation
      if (!row.Unit || row.Unit.trim() === '') {
        validationResults.push({
          row: rowNumber,
          data: row,
          status: 'error',
          message: 'Unit number is required',
        });
        continue;
      }

      // Check if first name or last name is provided
      if ((!row.FirstName || row.FirstName.trim() === '') && (!row.LastName || row.LastName.trim() === '')) {
        validationResults.push({
          row: rowNumber,
          data: row,
          status: 'error',
          message: 'First name or last name is required',
        });
        continue;
      }

      // Check if unit already exists
      const existingUnit = await prisma.user.findFirst({
        where: {
        organizationId,
        unitNumber: row.Unit.trim() 
      },
      });

      // Check if email exists
      let existingUser = null;
      if (row.Email && row.Email.trim() !== '') {
        existingUser = await prisma.user.findUnique({
          where: {
        email: row.Email.trim().toLowerCase() 
      },
        });
      }

      let status: 'valid' | 'warning' | 'error' = 'valid';
      let message = 'Ready to import';

      if (existingUnit && existingUser && existingUnit.id !== existingUser.id) {
        status = 'error';
        message = 'Unit and email belong to different users';
      } else if (existingUnit) {
        status = 'warning';
        message = 'Will update existing unit';
      } else if (existingUser) {
        status = 'warning';
        message = 'Will update existing user';
      } else if (!row.Email || row.Email.trim() === '') {
        status = 'warning';
        message = 'No email provided - unit will be created without account';
      }

      validationResults.push({
        row: rowNumber,
        data: row,
        status,
        message,
        existingUser: !!existingUser || !!existingUnit,
      });
    }

    return NextResponse.json({ 
      success: true,
      results: validationResults,
      total: records.length,
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return NextResponse.json(
      { error: 'Failed to parse CSV file' },
      { status: 500 }
    );
  }
}
