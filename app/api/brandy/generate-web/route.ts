
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import Anthropic from '@anthropic-ai/sdk';
import { authOptions } from '@/lib/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

interface WebGenerationRequest {
  template: 'landing' | 'about' | 'contact' | 'portfolio' | 'blank';
  businessName: string;
  tagline?: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logoDataUrl?: string;
  customInstructions?: string;
}

// POST /api/brandy/generate-web - Generate a web page using Claude
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: WebGenerationRequest = await req.json();
    const { template, businessName, tagline, brandColors, logoDataUrl, customInstructions } = body;

    // Build the prompt for Claude
    const prompt = `You are an expert web designer. Generate a complete, production-ready HTML page for a ${template} page.

Business Details:
- Business Name: ${businessName}
- Tagline: ${tagline || 'N/A'}
- Brand Colors:
  - Primary: ${brandColors.primary}
  - Secondary: ${brandColors.secondary}
  - Accent: ${brandColors.accent}

${customInstructions ? `Additional Requirements:\n${customInstructions}\n` : ''}

Requirements:
1. Use Tailwind CSS via CDN (include the script tag)
2. Make it fully responsive (mobile-first design)
3. Use the provided brand colors consistently throughout
4. ${logoDataUrl ? 'Include the provided logo image in the header (use the data URL provided below)' : 'Create a text-based logo using the business name'}
5. Include smooth animations and transitions
6. Use semantic HTML5 elements
7. Make it modern, professional, and visually appealing
8. Include placeholder content that's realistic and relevant
9. Add a navigation bar, hero section, and footer (adjust based on template type)
10. Ensure excellent contrast and accessibility

${logoDataUrl ? `Logo Data URL to use in <img> tags:\n${logoDataUrl}\n` : ''}

Template Type: ${template.toUpperCase()}
${template === 'landing' ? '- Include a hero section with CTA button\n- Add features/benefits section\n- Include testimonials\n- Add pricing or call-to-action section' : ''}
${template === 'about' ? '- Include company story section\n- Add team members section\n- Include mission/vision/values\n- Add timeline or milestones' : ''}
${template === 'contact' ? '- Include contact form with validation hints\n- Add contact information (phone, email, address)\n- Include map placeholder or location info\n- Add social media links' : ''}
${template === 'portfolio' ? '- Include project grid/cards\n- Add project categories/filters\n- Include case study sections\n- Add client testimonials' : ''}
${template === 'blank' ? '- Create a clean, minimal starting point\n- Include header and footer\n- Add a flexible content area' : ''}

Generate ONLY the complete HTML code. No explanations, no markdown code blocks, just the raw HTML starting with <!DOCTYPE html>.`;

    // Call Claude to generate the HTML
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the HTML from Claude's response
    let html = '';
    for (const block of message.content) {
      if (block.type === 'text') {
        html += block.text;
      }
    }

    // Clean up the HTML (remove any markdown code blocks if present)
    html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    // Ensure it starts with <!DOCTYPE html>
    if (!html.toLowerCase().startsWith('<!doctype')) {
      html = '<!DOCTYPE html>\n' + html;
    }

    return NextResponse.json({
      html,
      metadata: {
        template,
        businessName,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error generating web page:', error);
    return NextResponse.json(
      { error: 'Failed to generate web page', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
