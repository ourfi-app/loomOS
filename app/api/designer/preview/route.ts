import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const previewSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  type: z.enum(['component', 'page', 'api']).optional(),
});

/**
 * Preview API
 * Provides a safe preview of generated code without writing to disk
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await validateAuth(req);
    
    const body = await req.json();
    const { code, type = 'component' } = previewSchema.parse(body);

    // Validate the code syntax (basic check)
    try {
      // Try to detect common syntax errors
      if (!code.includes('export default')) {
        return createSuccessResponse({
          valid: false,
          error: 'Missing default export',
        });
      }

      if (type === 'component' && !code.includes('return (')) {
        return createSuccessResponse({
          valid: false,
          error: 'Component must have a return statement',
        });
      }

      // Basic React syntax check
      if (code.includes('class extends') && !code.includes('React.Component')) {
        return createSuccessResponse({
          valid: false,
          error: 'Invalid React component syntax',
        });
      }

      return createSuccessResponse({
        valid: true,
        code,
        analysis: {
          lines: code.split('\n').length,
          hasExport: code.includes('export'),
          hasImports: code.includes('import'),
          type,
        },
      });
    } catch (syntaxError) {
      return createSuccessResponse({
        valid: false,
        error: syntaxError instanceof Error ? syntaxError.message : 'Syntax error',
      });
    }
  } catch (error) {
    console.error('[API Error] Preview error:', error);
    
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        'Validation failed: ' + error.errors.map(e => e.message).join(', '),
        400,
        'VALIDATION_ERROR',
        error.errors
      );
    }
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
