
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateComponentCode, validateComponentMetadata } from '@/lib/app-validation';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, metadata, type = 'code' } = body;

    if (type === 'metadata') {
      const result = validateComponentMetadata(metadata);
      return NextResponse.json(result);
    }

    if (type === 'code') {
      if (!code || typeof code !== 'string') {
        return NextResponse.json(
          { error: 'Code is required' },
          { status: 400 }
        );
      }

      const validation = await validateComponentCode(code);
      return NextResponse.json(validation);
    }

    return NextResponse.json(
      { error: 'Invalid validation type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
}
