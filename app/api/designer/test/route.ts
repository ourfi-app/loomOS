
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runTestSuite, generateTestReport } from '@/lib/app-testing';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, componentName } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    if (!componentName || typeof componentName !== 'string') {
      return NextResponse.json(
        { error: 'Component name is required' },
        { status: 400 }
      );
    }

    // Run test suite
    const testSuite = await runTestSuite(code, componentName);

    // Generate report
    const report = generateTestReport(testSuite);

    return NextResponse.json({
      suite: testSuite,
      report,
    });
  } catch (error) {
    console.error('Testing error:', error);
    return NextResponse.json(
      { error: 'Testing failed' },
      { status: 500 }
    );
  }
}
