
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Only allow super admins to apply code changes
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { 
      slug,
      code, 
      fileName,
      appName,
      createApiRoute = false,
      createTypes = false 
    } = await req.json();

    if (!code || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine the target directory based on slug
    const appDir = join(process.cwd(), 'app', 'dashboard', 'apps', slug);
    const filePath = join(appDir, fileName);

    // Ensure directory exists
    try {
      await mkdir(appDir, { recursive: true });
    } catch (error) {
      console.log('Directory already exists or error creating:', error);
    }

    // Write the main component file
    await writeFile(filePath, code, 'utf-8');

    const result: any = {
      success: true,
      message: 'Code applied successfully',
      filePath: filePath.replace(process.cwd(), ''),
      files: [fileName],
    };

    // Optionally create API route
    if (createApiRoute) {
      const AppCodeGenerator = (await import('@/lib/app-code-generator')).AppCodeGenerator;
      const apiCode = AppCodeGenerator.generateApiRoute(appName);
      const apiDir = join(process.cwd(), 'app', 'api', slug);
      const apiFilePath = join(apiDir, 'route.ts');
      
      await mkdir(apiDir, { recursive: true });
      await writeFile(apiFilePath, apiCode, 'utf-8');
      
      result.files.push('API route');
      result.apiPath = apiFilePath.replace(process.cwd(), '');
    }

    // Optionally create type definitions
    if (createTypes) {
      const AppCodeGenerator = (await import('@/lib/app-code-generator')).AppCodeGenerator;
      const typesCode = AppCodeGenerator.generateTypeDefinitions(appName);
      const typesDir = join(process.cwd(), 'types');
      const typesFilePath = join(typesDir, `${slug}.ts`);
      
      await mkdir(typesDir, { recursive: true });
      await writeFile(typesFilePath, typesCode, 'utf-8');
      
      result.files.push('Type definitions');
      result.typesPath = typesFilePath.replace(process.cwd(), '');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to apply code changes:', error);
    return NextResponse.json(
      { error: 'Failed to apply changes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
