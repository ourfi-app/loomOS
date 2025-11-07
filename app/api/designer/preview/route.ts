
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Preview API
 * Provides a safe preview of generated code without writing to disk
 */
export async function POST(req: NextRequest) {
  try {
    const { code, type = 'component' } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // Validate the code syntax (basic check)
    try {
      // Try to detect common syntax errors
      if (!code.includes('export default')) {
        return NextResponse.json({
          valid: false,
          error: 'Missing default export',
        });
      }

      if (type === 'component' && !code.includes('return (')) {
        return NextResponse.json({
          valid: false,
          error: 'Component must have a return statement',
        });
      }

      // Basic React syntax check
      if (code.includes('class extends') && !code.includes('React.Component')) {
        return NextResponse.json({
          valid: false,
          error: 'Invalid React component syntax',
        });
      }

      return NextResponse.json({
        valid: true,
        code,
        analysis: {
          lines: code.split('\n').length,
          hasTypeScript: code.includes(': ') || code.includes('<'),
          hasHooks: code.includes('useState') || code.includes('useEffect'),
          hasApiIntegration: code.includes('fetch') || code.includes('api'),
        },
      });
    } catch (error) {
      return NextResponse.json({
        valid: false,
        error: 'Syntax error in code',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
