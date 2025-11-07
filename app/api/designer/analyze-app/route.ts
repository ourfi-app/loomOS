
import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

/**
 * Analyzes an existing app's structure
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'App slug is required' },
        { status: 400 }
      );
    }

    // Determine the app's path
    const appPath = getAppPath(slug);
    const filePath = join(process.cwd(), 'app', appPath, 'page.tsx');

    // Read the file
    let fileContent: string;
    let fileStats;
    
    try {
      fileContent = await readFile(filePath, 'utf-8');
      fileStats = await stat(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: `App not found: ${slug}` },
        { status: 404 }
      );
    }

    // Analyze the code structure
    const analysis = analyzeCode(fileContent, slug);

    return NextResponse.json({
      path: appPath,
      slug,
      name: analysis.name,
      description: analysis.description,
      layout: analysis.layout,
      components: analysis.components,
      colors: analysis.colors,
      dataSource: analysis.dataSource,
      features: analysis.features,
      fileSize: fileStats.size,
      complexity: analysis.complexity,
      lastModified: fileStats.mtime.toISOString(),
    });
  } catch (error) {
    console.error('Error analyzing app:', error);
    return NextResponse.json(
      { error: 'Failed to analyze app' },
      { status: 500 }
    );
  }
}

function getAppPath(slug: string): string {
  // Map slugs to their actual paths
  const pathMap: Record<string, string> = {
    calendar: 'dashboard/apps/calendar',
    messages: 'dashboard/apps/messages',
    tasks: 'dashboard/apps/tasks',
    notes: 'dashboard/apps/notes',
    documents: 'dashboard/documents',
    directory: 'dashboard/directory',
    chat: 'dashboard/chat',
    household: 'dashboard/household',
    profile: 'dashboard/profile',
    payments: 'dashboard/payments',
    'building-services': 'dashboard/building-services',
    notifications: 'dashboard/notifications',
    marketplace: 'dashboard/marketplace',
    help: 'dashboard/help',
    admin: 'dashboard/admin',
    accounting: 'dashboard/accounting',
    budgeting: 'dashboard/budgeting',
    'system-settings': 'dashboard/system-settings',
    'system-config': 'dashboard/system-config',
    'external-connections': 'dashboard/external-connections',
    'my-community': 'dashboard/my-community',
    'resident-portal': 'dashboard/resident-portal',
  };

  return pathMap[slug] || `dashboard/apps/${slug}`;
}

function analyzeCode(code: string, slug: string) {
  // Extract app name and description
  const nameMatch = code.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const descMatch = code.match(/<p[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)<\/p>/i);

  // Detect layout type
  const layout = detectLayout(code);

  // Detect components
  const components = {
    hasStatusBar: code.includes('StatusBar') || code.includes('status-bar'),
    hasHeader: code.includes('<h1') || code.includes('Header') || code.includes('header'),
    hasToolbar: code.includes('Toolbar') || code.includes('toolbar') || code.includes('BottomNav'),
    hasGestureArea: code.includes('GestureArea') || code.includes('gesture-area'),
    hasSearch: code.includes('search') || code.includes('Search'),
    hasTabs: code.includes('<Tabs') || code.includes('TabsList'),
    hasFilters: code.includes('filter') || code.includes('Filter'),
    customComponents: extractCustomComponents(code),
  };

  // Extract colors
  const colors = extractColors(code);

  // Detect data sources
  const dataSource = {
    api: code.includes('fetch(') || code.includes('axios'),
    database: code.includes('prisma') || code.includes('db.'),
    localStorage: code.includes('localStorage'),
    external: extractExternalAPIs(code),
  };

  // Extract features
  const features = extractFeatures(code);

  // Determine complexity
  const complexity = determineComplexity(code, components, features);

  return {
    name: nameMatch && nameMatch[1] ? nameMatch[1].replace(/<[^>]*>/g, '').trim() : formatName(slug),
    description: descMatch && descMatch[1] ? descMatch[1].replace(/<[^>]*>/g, '').trim() : undefined,
    layout,
    components,
    colors,
    dataSource,
    features,
    complexity,
  };
}

function detectLayout(code: string) {
  // Count major panes/sections
  const multiPaneMatches = code.match(/MultiPaneLayout|<div[^>]*className="[^"]*pane[^"]*"/gi);
  const paneCount = multiPaneMatches ? multiPaneMatches.length : 0;

  // Analyze div structure
  const hasNavPane = code.includes('navigation') || code.includes('sidebar') || code.includes('nav-pane');
  const hasListPane = code.includes('list-pane') || code.includes('items-list');
  const hasDetailPane = code.includes('detail-pane') || code.includes('content-pane');

  let type: '1-pane' | '2-pane' | '3-pane' | 'custom' = '1-pane';
  
  if (paneCount >= 3 || (hasNavPane && hasListPane && hasDetailPane)) {
    type = '3-pane';
  } else if (paneCount >= 2 || (hasListPane && hasDetailPane)) {
    type = '2-pane';
  } else if (paneCount === 1 || hasListPane || hasDetailPane) {
    type = '1-pane';
  } else if (code.includes('custom') || code.includes('grid')) {
    type = 'custom';
  }

  return {
    type,
    panes: [], // TODO: Extract detailed pane configs
  };
}

function extractCustomComponents(code: string): string[] {
  const components: string[] = [];
  
  // Look for custom component usage patterns
  const componentPatterns = [
    /import\s+{\s*([A-Z][a-zA-Z0-9,\s]*)\s*}\s+from/g,
    /<([A-Z][a-zA-Z0-9]+)/g,
  ];

  componentPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      const componentName = match[1]?.trim();
      if (componentName && !components.includes(componentName)) {
        components.push(componentName);
      }
    }
  });

  // Filter out common/standard components
  const standardComponents = ['React', 'useState', 'useEffect', 'Button', 'Card', 'Input', 'Label'];
  return components.filter(c => !standardComponents.includes(c)).slice(0, 10);
}

function extractColors(code: string) {
  const colors: any = {};

  // Look for gradient patterns
  const gradientMatch = code.match(/from-(\w+-\d+)\s+via-(\w+-\d+)\s+to-(\w+-\d+)/);
  if (gradientMatch) {
    colors.headerGradient = `${gradientMatch[1]}, ${gradientMatch[2]}, ${gradientMatch[3]}`;
  }

  // Look for color variables
  const colorPatterns = [
    /primary[:\s]+['"]([^'"]+)['"]/i,
    /secondary[:\s]+['"]([^'"]+)['"]/i,
    /accent[:\s]+['"]([^'"]+)['"]/i,
  ];

  colorPatterns.forEach((pattern, index) => {
    const match = code.match(pattern);
    if (match && match[1]) {
      const keys: ('primary' | 'secondary' | 'accent')[] = ['primary', 'secondary', 'accent'];
      const key = keys[index];
      if (key) {
        colors[key] = match[1];
      }
    }
  });

  return colors;
}

function extractExternalAPIs(code: string): string[] {
  const apis: string[] = [];
  
  // Look for API endpoints
  const apiPattern = /fetch\(['"]([^'"]+)['"]\)/g;
  let match;
  while ((match = apiPattern.exec(code)) !== null) {
    const apiUrl = match[1];
    if (apiUrl && !apiUrl.startsWith('/api/') && !apis.includes(apiUrl)) {
      apis.push(apiUrl);
    }
  }

  return apis;
}

function extractFeatures(code: string): string[] {
  const features: string[] = [];

  // Look for common feature patterns
  const featurePatterns: Record<string, RegExp> = {
    'Search functionality': /search|filter/i,
    'Data export': /export|download/i,
    'Real-time updates': /socket|websocket|sse/i,
    'File upload': /upload|file/i,
    'Drag and drop': /drag|drop|dnd/i,
    'Notifications': /notification|alert|toast/i,
    'Dark mode': /dark.*mode|theme/i,
    'Accessibility': /aria-|role=|accessibility/i,
    'Keyboard shortcuts': /keyboard|shortcut|hotkey/i,
    'Responsive design': /responsive|mobile|tablet/i,
  };

  Object.entries(featurePatterns).forEach(([feature, pattern]) => {
    if (pattern.test(code)) {
      features.push(feature);
    }
  });

  return features;
}

function determineComplexity(code: string, components: any, features: string[]): 'simple' | 'moderate' | 'complex' {
  const lines = code.split('\n').length;
  const componentCount = components.customComponents.length;
  const featureCount = features.length;

  if (lines > 500 || componentCount > 10 || featureCount > 7) {
    return 'complex';
  } else if (lines > 200 || componentCount > 5 || featureCount > 4) {
    return 'moderate';
  }
  return 'simple';
}

function formatName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
