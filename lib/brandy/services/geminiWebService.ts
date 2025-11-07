/**
 * Gemini Web Generation Service
 * Handles AI-powered website generation from brand identity
 */

import {
  WebGenerationInput,
  WebGenerationOutput,
  WebsitePage,
  WebsiteProject,
  ThemeConfig,
  AssetCollection,
} from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { handleApiError } from './geminiService';
import JSZip from 'jszip';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// ============================================================================
// TEMPLATE DESCRIPTIONS
// ============================================================================

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  landing: 'A single-page landing site with hero section, features, testimonials, and strong call-to-action',
  business: 'A professional multi-page business website with home, about, services, and contact pages',
  portfolio: 'A creative portfolio showcasing projects with image galleries and project details',
  ecommerce: 'An online store with product listings, shopping cart, and checkout flow',
  blog: 'A content-focused blog with article listings, individual posts, and categories',
  saas: 'A SaaS product website with features, pricing tiers, and signup flow',
  restaurant: 'A restaurant website with menu, reservations, location map, and contact',
  agency: 'An agency website showcasing services, case studies, team, and client testimonials',
};

// ============================================================================
// SYSTEM INSTRUCTIONS
// ============================================================================

const WEB_GENERATION_SYSTEM_INSTRUCTION = `
You are an expert web designer and developer. Your role is to generate complete, professional websites that:

1. Are fully responsive (mobile, tablet, desktop)
2. Follow modern web design best practices
3. Are accessible (WCAG AA compliant)
4. Have clean, semantic HTML
5. Include inline CSS (no external stylesheets)
6. Include necessary JavaScript inline
7. Are brand-consistent (use provided colors, fonts, logo)
8. Are SEO-optimized
9. Load fast (no external dependencies except fonts)

Design Principles:
- Mobile-first approach
- Clear visual hierarchy
- Generous white space
- Readable typography (minimum 16px base)
- High contrast for accessibility
- Touch-friendly buttons (44px minimum)
- Smooth transitions and micro-interactions

Technical Requirements:
- Valid HTML5
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Semantic HTML elements
- Meta tags for SEO
- Open Graph tags for social sharing

Output Format:
Return complete HTML with inline CSS and JavaScript.
Do NOT use external libraries or frameworks.
`;

// ============================================================================
// WEBSITE GENERATION
// ============================================================================

export interface GenerateWebsiteOptions {
  onProgress?: (message: string, progress: number) => void;
}

/**
 * Generate a complete website based on brand and template
 */
export async function generateWebsite(
  input: WebGenerationInput,
  options: GenerateWebsiteOptions = {}
): Promise<WebGenerationOutput> {
  const { onProgress } = options;

  try {
    onProgress?.('Analyzing brand identity...', 10);

    // Step 1: Determine theme from brand identity
    const theme = generateThemeFromBrand(input);

    onProgress?.('Creating page structure...', 20);

    // Step 2: Generate each page
    const pages: WebsitePage[] = [];

    for (let i = 0; i < input.pages.length; i++) {
      const pageName = input.pages[i];
      const progress = 20 + ((i + 1) / input.pages.length) * 60;

      onProgress?.(`Generating ${pageName} page...`, progress);

      const page = await generatePage(
        pageName,
        input,
        theme,
        i === 0 // isHomePage
      );

      pages.push(page);
    }

    onProgress?.('Finalizing assets...', 90);

    // Step 3: Compile assets
    const assets: AssetCollection = {
      logo: input.logoBase64,
      images: [],
      icons: [],
    };

    onProgress?.('Website complete!', 100);

    return {
      pages,
      theme,
      assets,
    };

  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Generate a single page
 */
async function generatePage(
  pageName: string,
  input: WebGenerationInput,
  theme: ThemeConfig,
  isHomePage: boolean
): Promise<WebsitePage> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const templateDesc = TEMPLATE_DESCRIPTIONS[input.templateType] || 'A professional website';

  const prompt = `
Generate a complete ${pageName} page for this website:

Template Type: ${input.templateType}
Template Description: ${templateDesc}
Page Description: ${input.description}

Brand Information:
- Name: ${input.brief.brandName}
- Industry: ${input.brief.industry}
- Target Audience: ${input.brief.targetAudienceProfile}
- Brand Values: ${input.brief.coreValues.join(', ')}
${input.identity ? `
- Brand Voice: ${input.identity.voice.name} - ${input.identity.voice.description}
- Messaging Pillars: ${input.identity.messagingPillars.map(p => p.title).join(', ')}
- Tagline Options: ${input.identity.taglines.join(', ')}
` : ''}

Theme:
- Primary Color: ${theme.colors.primary}
- Secondary Color: ${theme.colors.secondary}
- Accent Color: ${theme.colors.accent}
- Heading Font: ${theme.fonts.heading}
- Body Font: ${theme.fonts.body}

${isHomePage ? `
This is the HOME page. Include:
- Hero section with compelling headline
- Clear value proposition
- Call-to-action buttons
- Key features or benefits
- Social proof (testimonials/logos)
- Footer with navigation
` : `
This is the ${pageName.toUpperCase()} page. Create appropriate content for this page type.
`}

Requirements:
1. Include the logo in the header (use this data URL: ${input.logoBase64.substring(0, 100)}...)
2. Create a responsive navigation menu with links to: ${input.pages.join(', ')}
3. Use the brand colors throughout
4. Include proper meta tags
5. Make it fully responsive
6. Add smooth scroll behavior
7. Include a professional footer

Generate ONLY the complete HTML. No explanations, no markdown code blocks, just pure HTML.
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: WEB_GENERATION_SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.7,
    },
  });

  let html = result.response.text();

  // Clean up the response (remove markdown code blocks if present)
  html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

  // Ensure it starts with DOCTYPE
  if (!html.startsWith('<!DOCTYPE')) {
    html = '<!DOCTYPE html>\n' + html;
  }

  return {
    id: `page-${Date.now()}-${pageName.toLowerCase().replace(/\s+/g, '-')}`,
    name: pageName,
    slug: pageName.toLowerCase().replace(/\s+/g, '-'),
    content: html,
    description: `${pageName} page for ${input.brief.brandName}`,
  };
}

/**
 * Generate theme configuration from brand identity
 */
function generateThemeFromBrand(input: WebGenerationInput): ThemeConfig {
  const { identity, brief } = input;

  // Extract colors from brand identity or use defaults
  let primaryColor = '#F18825'; // loomOS orange default
  let secondaryColor = '#2B8ED9';
  let accentColor = '#F18825';

  if (identity?.colorPalettes && identity.colorPalettes.length > 0) {
    const palette = identity.colorPalettes[0];
    const primary = palette.colors.find(c => c.role === 'primary');
    const secondary = palette.colors.find(c => c.role === 'secondary');
    const accent = palette.colors.find(c => c.role === 'accent');

    if (primary) primaryColor = primary.hex;
    if (secondary) secondaryColor = secondary.hex;
    if (accent) accentColor = accent.hex;
  } else if (brief.preferredColors && brief.preferredColors.length > 0) {
    primaryColor = brief.preferredColors[0];
    if (brief.preferredColors.length > 1) {
      secondaryColor = brief.preferredColors[1];
    }
  }

  return {
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      background: '#FFFFFF',
      foreground: '#1F2937',
      muted: '#F3F4F6',
    },
    fonts: {
      heading: identity?.typography?.headlineFont || 'Cambo, Georgia, serif',
      body: identity?.typography?.bodyFont || 'Titillium Web, system-ui, sans-serif',
    },
    spacing: {
      scale: 1,
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
    },
  };
}

// ============================================================================
// MULTI-PAGE GENERATION WITH PROGRESS
// ============================================================================

/**
 * Generate multiple pages with progress tracking
 */
export async function generateMultiPageWebsite(
  input: WebGenerationInput,
  onProgress?: (message: string, progress: number) => void
): Promise<WebGenerationOutput> {
  return generateWebsite(input, { onProgress });
}

// ============================================================================
// EXPORT FUNCTIONALITY
// ============================================================================

/**
 * Export website project as static site ZIP
 */
export async function exportToStaticSite(project: WebsiteProject): Promise<Blob> {
  const zip = new JSZip();

  // Add each page as HTML file
  project.pages.forEach((page) => {
    const filename = page.slug === 'home' ? 'index.html' : `${page.slug}.html`;
    zip.file(filename, page.content);
  });

  // Add README
  const readme = `
# ${project.name}

Generated by Brandy - loomOS Brand Strategist

## Pages Included:
${project.pages.map(p => `- ${p.name} (${p.slug}.html)`).join('\n')}

## To Use:
1. Extract this ZIP file
2. Open index.html in your browser
3. Upload to any web host

## Theme Colors:
- Primary: ${project.theme.colors.primary}
- Secondary: ${project.theme.colors.secondary}
- Accent: ${project.theme.colors.accent}

Generated on: ${new Date().toLocaleDateString()}
`;

  zip.file('README.md', readme.trim());

  // Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
}

// ============================================================================
// PAGE REFINEMENT
// ============================================================================

/**
 * Refine a specific page with AI
 */
export async function refinePage(
  page: WebsitePage,
  refinementPrompt: string,
  theme: ThemeConfig
): Promise<WebsitePage> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
You are editing a website page. Here is the current HTML:

${page.content}

Make the following changes: ${refinementPrompt}

Maintain:
- The overall structure
- Brand consistency
- Responsive design
- Current theme colors

Return ONLY the updated complete HTML. No explanations.
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: WEB_GENERATION_SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.5,
      },
    });

    let html = result.response.text();
    html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    return {
      ...page,
      content: html,
    };

  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

/**
 * Generate content for a specific section
 */
export async function generateContent(
  sectionType: string,
  brandInfo: { name: string; industry: string; audience: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
Generate compelling ${sectionType} content for:
- Brand: ${brandInfo.name}
- Industry: ${brandInfo.industry}
- Audience: ${brandInfo.audience}

Make it engaging, benefit-focused, and persuasive.
Return plain text, no markdown, no formatting.
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();

  } catch (error) {
    throw handleApiError(error);
  }
}
