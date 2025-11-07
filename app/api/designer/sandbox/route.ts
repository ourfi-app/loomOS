
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { testInSandbox } from '@/lib/app-validation';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Test in sandbox environment
    const result = await testInSandbox(code);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Sandbox error:', error);
    return NextResponse.json(
      { error: 'Sandbox test failed' },
      { status: 500 }
    );
  }
}
