/**
 * Claude Helper Service for Brandy
 *
 * This service orchestrates Claude as an intelligent assistant that helps improve
 * the logo generation process with Gemini. Claude acts as:
 * - Strategic analyzer: Deeply understands user requirements
 * - Prompt engineer: Refines prompts for better Gemini outputs
 * - Quality validator: Scores and validates logo concepts
 * - Educational guide: Explains design decisions to users
 * - Brand strategist: Generates comprehensive brand identity
 */

import Anthropic from '@anthropic-ai/sdk';
import { BrandBrief, LogoConcept, BrandIdentity } from '../types';
import * as geminiService from './geminiService';

// ============================================================================
// TYPES
// ============================================================================

export interface ClaudeAnalysis {
  brandDNA: {
    essence: string;
    emotionalCore: string;
    visualDirection: string;
    differentiators: string[];
  };
  refinedPrompts: RefinedPrompt[];
  designStrategy: string;
}

export interface RefinedPrompt {
  id: string;
  prompt: string;
  rationale: string;
  expectedStyle: string;
  targetArchetype: string;
}

export interface LogoValidation {
  conceptId: string;
  alignmentScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  brandFit: string;
  recommendation: 'excellent' | 'good' | 'needs-refinement';
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface GuidanceResponse {
  message: string;
  suggestions?: string[];
  nextSteps?: string[];
}

// ============================================================================
// INITIALIZATION
// ============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

// ============================================================================
// CORE ORCHESTRATION FUNCTIONS
// ============================================================================

/**
 * Step 1: Analyze brand brief and extract strategic insights
 * Claude deeply analyzes the user's requirements to understand brand DNA
 */
export async function analyzeBrandBrief(
  brandBrief: BrandBrief
): Promise<ClaudeAnalysis> {
  const prompt = `You are a world-class brand strategist and design expert. Analyze this brand brief deeply and extract strategic insights for logo creation.

Brand Brief:
${JSON.stringify(brandBrief, null, 2)}

Please provide:
1. Brand DNA - The essence, emotional core, visual direction, and key differentiators
2. Four refined prompts for image generation - Each should be detailed, specific, and designed to produce distinct logo concepts that align with the brand archetype
3. Overall design strategy - How these concepts work together to explore the brand space

Format your response as JSON with this structure:
{
  "brandDNA": {
    "essence": "One sentence capturing the brand's core",
    "emotionalCore": "The emotional feeling the brand should evoke",
    "visualDirection": "Specific visual style guidance",
    "differentiators": ["unique aspect 1", "unique aspect 2", ...]
  },
  "refinedPrompts": [
    {
      "id": "concept-1",
      "prompt": "Detailed image generation prompt",
      "rationale": "Why this approach fits the brand",
      "expectedStyle": "Style description",
      "targetArchetype": "Primary archetype this explores"
    },
    // ... 3 more concepts
  ],
  "designStrategy": "Explanation of how these concepts explore different aspects of the brand"
}

Important: Make prompts concrete and specific for image generation. Include style keywords like 'minimalist', 'geometric', 'organic', 'modern', etc.`;

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse JSON response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Claude analysis response');
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Step 2: Generate logos using refined prompts
 * Takes Claude's refined prompts and passes them to Gemini for generation
 */
export async function generateLogosWithRefinedPrompts(
  brandBrief: BrandBrief,
  analysis: ClaudeAnalysis
): Promise<LogoConcept[]> {
  // Generate logos using Gemini with Claude's refined prompts
  const concepts: LogoConcept[] = [];

  for (const refinedPrompt of analysis.refinedPrompts) {
    try {
      // Call Gemini's image generation with the refined prompt
      const imageUrl = await geminiService.generateSingleLogoImage(
        refinedPrompt.prompt,
        brandBrief.brandName
      );

      concepts.push({
        id: refinedPrompt.id,
        name: `${refinedPrompt.expectedStyle} Concept`,
        rationale: refinedPrompt.rationale,
        main: imageUrl,
        variations: [],
        archetype: brandBrief.brandArchetype,
      });
    } catch (error) {
      console.error(`Failed to generate concept ${refinedPrompt.id}:`, error);
      // Continue with other concepts
    }
  }

  return concepts;
}

/**
 * Step 3: Validate and score generated logos
 * Claude analyzes each logo against the brand brief
 */
export async function validateLogoConcepts(
  brandBrief: BrandBrief,
  concepts: LogoConcept[],
  analysis: ClaudeAnalysis
): Promise<LogoValidation[]> {
  const validations: LogoValidation[] = [];

  for (const concept of concepts) {
    const prompt = `You are an expert design critic. Evaluate this logo concept against the brand requirements.

Brand Brief Summary:
- Brand: ${brandBrief.brandName}
- Industry: ${brandBrief.industry}
- Archetype: ${brandBrief.brandArchetype}
- Brand Essence: ${analysis.brandDNA.essence}
- Target Emotion: ${analysis.brandDNA.emotionalCore}

Logo Concept:
- Name: ${concept.name}
- Design Rationale: ${concept.rationale}
- [Image would be analyzed here - in production, use vision API]

Provide validation in JSON format:
{
  "alignmentScore": 85,
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "brandFit": "Explanation of how well this fits the brand",
  "recommendation": "excellent" | "good" | "needs-refinement"
}`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const validation = JSON.parse(jsonMatch[0]);
      validations.push({
        conceptId: concept.id,
        ...validation,
      });
    }
  }

  return validations;
}

/**
 * Step 4: Generate comprehensive brand identity
 * Once a logo is selected, Claude creates the full brand identity
 */
export async function generateCompleteBrandIdentity(
  brandBrief: BrandBrief,
  selectedLogo: LogoConcept,
  analysis: ClaudeAnalysis
): Promise<BrandIdentity> {
  const prompt = `You are a comprehensive brand strategist. Create a complete brand identity system based on the selected logo and brand brief.

Brand Brief:
${JSON.stringify(brandBrief, null, 2)}

Brand DNA:
${JSON.stringify(analysis.brandDNA, null, 2)}

Selected Logo: ${selectedLogo.name}
Logo Rationale: ${selectedLogo.rationale}

Create a comprehensive brand identity with:
1. Brand Voice (name and detailed description)
2. Typography recommendations (headline and body fonts with rationale)
3. 3-5 Messaging Pillars (key themes to communicate)
4. 5-7 Tagline options
5. Logo usage guidelines
6. Color palette recommendations

Format as JSON:
{
  "voice": {
    "name": "Voice name (e.g., 'Bold Innovator')",
    "description": "Detailed voice description"
  },
  "typography": {
    "headlineFont": "Font name",
    "bodyFont": "Font name",
    "rationale": "Why these fonts work"
  },
  "messagingPillars": [
    {"title": "Pillar 1", "description": "What it means"},
    // ... more pillars
  ],
  "taglines": ["Option 1", "Option 2", ...],
  "logoUsageGuidelines": "Clear usage guidelines",
  "colorPalettes": [
    {
      "id": "primary",
      "name": "Primary Palette",
      "description": "When to use",
      "colors": [
        {"hex": "#RRGGBB", "name": "Color name", "role": "primary"}
      ]
    }
  ]
}`;

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Failed to parse brand identity response');
  }

  return JSON.parse(jsonMatch[0]);
}

// ============================================================================
// CONVERSATIONAL GUIDANCE FUNCTIONS
// ============================================================================

/**
 * Provide contextual guidance during the brand creation process
 */
export async function provideGuidance(
  context: {
    currentStep: 'brief' | 'generation' | 'selection' | 'identity' | 'website';
    brandBrief?: BrandBrief;
    analysis?: ClaudeAnalysis;
    concepts?: LogoConcept[];
    selectedLogo?: LogoConcept;
  },
  userQuestion?: string
): Promise<GuidanceResponse> {
  let prompt = `You are a helpful brand strategy guide. `;

  switch (context.currentStep) {
    case 'brief':
      prompt += `The user is filling out their brand brief. ${
        userQuestion
          ? `They asked: "${userQuestion}"`
          : 'Provide helpful tips for creating a strong brand brief.'
      }`;
      break;

    case 'generation':
      prompt += `Logos are being generated. ${
        userQuestion
          ? `User asked: "${userQuestion}"`
          : 'Explain what makes a great logo and what to look for.'
      }`;
      break;

    case 'selection':
      prompt += `The user is reviewing ${context.concepts?.length || 0} logo concepts. ${
        userQuestion
          ? `They asked: "${userQuestion}"`
          : 'Help them evaluate the concepts strategically.'
      }

Brand Brief: ${JSON.stringify(context.brandBrief, null, 1)}
Analysis: ${JSON.stringify(context.analysis?.brandDNA, null, 1)}`;
      break;

    case 'identity':
      prompt += `Creating complete brand identity for logo: ${context.selectedLogo?.name}. ${
        userQuestion || 'Explain the brand identity elements being created.'
      }`;
      break;

    case 'website':
      prompt += `Building website from brand identity. ${
        userQuestion || 'Explain how the brand translates to web design.'
      }`;
      break;
  }

  prompt += `\n\nProvide a concise, helpful response (2-4 sentences) with optional suggestions and next steps in JSON:
{
  "message": "Your helpful message",
  "suggestions": ["Optional suggestion 1", "Optional suggestion 2"],
  "nextSteps": ["Optional next step 1", "Optional next step 2"]
}`;

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return {
    message: content.trim(),
  };
}

/**
 * Explain design decisions in educational way
 */
export async function explainDesignDecision(
  decision: {
    type: 'color' | 'typography' | 'layout' | 'style' | 'concept';
    element: string;
    context: any;
  }
): Promise<string> {
  const prompt = `You are a design educator. Explain this design decision in a way that helps the user learn:

Decision Type: ${decision.type}
Element: ${decision.element}
Context: ${JSON.stringify(decision.context, null, 2)}

Provide a clear, educational explanation (2-3 paragraphs) that helps the user understand:
1. What this design choice means
2. Why it works for their brand
3. The design principles behind it

Keep it conversational and practical.`;

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// ============================================================================
// WEBSITE GENERATION WITH CLAUDE
// ============================================================================

/**
 * Generate website copy and structure from brand identity
 */
export async function generateWebsiteContent(
  brandBrief: BrandBrief,
  brandIdentity: BrandIdentity,
  selectedLogo: LogoConcept,
  pageType: 'landing' | 'about' | 'contact' | 'portfolio'
): Promise<{
  html: string;
  explanation: string;
}> {
  const prompt = `You are an expert web designer and copywriter. Create a complete ${pageType} page for this brand.

Brand Information:
- Name: ${brandBrief.brandName}
- Industry: ${brandBrief.industry}
- Voice: ${brandIdentity.voice.name} - ${brandIdentity.voice.description}
- Messaging Pillars: ${brandIdentity.messagingPillars.map(p => p.title).join(', ')}
- Typography: ${brandIdentity.typography.headlineFont} (headlines), ${brandIdentity.typography.bodyFont} (body)

Requirements:
1. Use Tailwind CSS (include CDN)
2. Fully responsive design
3. Use brand colors from the palette
4. Write copy that matches the brand voice
5. Include smooth animations
6. Modern, professional design
7. Semantic HTML5

Generate:
1. Complete HTML code
2. Brief explanation of design decisions

Format:
HTML:
[complete HTML here]

EXPLANATION:
[2-3 sentences explaining key design decisions]`;

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';

  // Split HTML and explanation
  const htmlMatch = content.match(/HTML:\s*(<!DOCTYPE[\s\S]*?)(?=\n\nEXPLANATION:|$)/i);
  const explanationMatch = content.match(/EXPLANATION:\s*([\s\S]*?)$/i);

  let html = htmlMatch ? htmlMatch[1].trim() : content;
  const explanation = explanationMatch ? explanationMatch[1].trim() : 'Website generated based on brand identity.';

  // Clean up HTML
  html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

  return {
    html,
    explanation,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// This function is no longer needed - we call geminiService.generateSingleLogoImage directly

/**
 * Stream a response for real-time UI updates
 */
export async function streamGuidance(
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const stream = await anthropic.messages.stream({
    model: DEFAULT_MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onChunk(event.delta.text);
    }
  }
}

// ============================================================================
// COMPLETE ORCHESTRATION FLOW
// ============================================================================

/**
 * Main orchestration function that runs the complete dual-AI workflow
 */
export async function runCompleteBrandCreation(
  brandBrief: BrandBrief,
  onProgress?: (step: string, data?: any) => void
): Promise<{
  analysis: ClaudeAnalysis;
  concepts: LogoConcept[];
  validations: LogoValidation[];
}> {
  try {
    // Step 1: Analyze with Claude
    onProgress?.('Analyzing brand brief with Claude...');
    const analysis = await analyzeBrandBrief(brandBrief);
    onProgress?.('analysis-complete', analysis);

    // Step 2: Generate logos with Gemini using refined prompts
    onProgress?.('Generating logos with Gemini...');
    const concepts = await generateLogosWithRefinedPrompts(brandBrief, analysis);
    onProgress?.('generation-complete', concepts);

    // Step 3: Validate with Claude
    onProgress?.('Validating concepts with Claude...');
    const validations = await validateLogoConcepts(brandBrief, concepts, analysis);
    onProgress?.('validation-complete', validations);

    return {
      analysis,
      concepts,
      validations,
    };
  } catch (error) {
    console.error('Brand creation flow error:', error);
    throw error;
  }
}
