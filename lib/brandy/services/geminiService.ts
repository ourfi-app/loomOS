/**
 * Gemini Service for Logo Generation and Brand Identity
 * Handles all AI-powered logo creation, editing, and brand strategy
 */

import {
  BrandBrief,
  LogoConcept,
  BrandIdentity,
  LogoVariation,
  ColorPalette,
  InspirationImage,
  ApiError,
  GenerateBrandIdentityRequest,
  LogoAnimation,
} from '../types';

// Google Generative AI imports
// Note: Install with: npm install @google/generative-ai
import { GoogleGenerativeAI, GenerateContentRequest } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Retry wrapper for API calls
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError;
}

/**
 * Handle API errors and convert to friendly messages
 */
export function handleApiError(error: any): ApiError {
  const message = error?.message || 'An unknown error occurred';

  if (message.includes('429') || message.includes('quota')) {
    return {
      message: 'API rate limit exceeded. Please try again in a few moments.',
      type: 'RATE_LIMIT',
      retryable: true,
    };
  }

  if (message.includes('blocked') || message.includes('safety')) {
    return {
      message: 'Content was blocked due to safety filters. Please try a different description.',
      type: 'BLOCKED',
      retryable: false,
    };
  }

  if (message.includes('API key')) {
    return {
      message: 'Invalid API key. Please check your configuration.',
      type: 'INVALID_KEY',
      retryable: false,
    };
  }

  if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return {
      message: 'Request timed out. Please try again.',
      type: 'TIMEOUT',
      retryable: true,
    };
  }

  return {
    message: `Generation failed: ${message}`,
    type: 'GENERIC',
    details: error?.stack,
    retryable: true,
  };
}

// ============================================================================
// LOGO GENERATION
// ============================================================================

const LOGO_GENERATION_SYSTEM_INSTRUCTION = `
You are a world-class brand strategist and logo designer. Your role is to:

1. Understand the brand's essence, values, and target audience
2. Generate 4 unique logo concepts that each explore a different visual direction
3. Each concept should align with the specified brand archetype
4. Provide clear rationale for each design decision
5. Generate prompts that will create professional, memorable logos

For each logo concept:
- Create a detailed Imagen prompt (max 200 words)
- Ensure the prompt specifies: style, composition, colors, typography approach
- Focus on simplicity and memorability
- Avoid overly complex designs
- Consider versatility across different media

Output format:
{
  "concepts": [
    {
      "name": "Concept Name",
      "rationale": "Why this concept works for the brand",
      "imagenPrompt": "Detailed prompt for Imagen",
      "archetype": "Brand Archetype"
    }
  ]
}
`;

export interface GenerateLogosOptions {
  inspirations?: InspirationImage[];
  feedback?: string;
  onProgress?: (progress: number, message?: string) => void;
}

/**
 * Generate logo concepts using Gemini + Imagen
 */
export async function generateLogoConcepts(
  brief: BrandBrief,
  options: GenerateLogosOptions = {}
): Promise<LogoConcept[]> {
  const { inspirations, feedback, onProgress } = options;

  onProgress?.(10, 'Analyzing brand brief...');

  try {
    // Step 1: Generate concepts with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
Generate 4 unique logo concepts for this brand:

Brand Name: ${brief.brandName}
Industry: ${brief.industry}
Brand Archetype: ${brief.brandArchetype}
Core Values: ${brief.coreValues.join(', ')}
Target Audience: ${brief.targetAudienceProfile}
Logo Vision: ${brief.logoVision}
${brief.preferredColors ? `Preferred Colors: ${brief.preferredColors.join(', ')}` : ''}
${brief.avoidColors ? `Avoid Colors: ${brief.avoidColors.join(', ')}` : ''}

${inspirations && inspirations.length > 0 ? `
Reference these inspirations:
${inspirations.map((img, i) => `${i + 1}. ${img.description || 'Inspiration image'}`).join('\n')}
` : ''}

${feedback ? `Previous Feedback: ${feedback}` : ''}

Create 4 diverse concepts that explore different visual directions.
`;

    onProgress?.(30, 'Generating concept strategies...');

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: LOGO_GENERATION_SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.9,
      },
    });

    const conceptData = JSON.parse(result.response.text());

    // Step 2: Generate images for each concept using Imagen
    onProgress?.(50, 'Creating visual designs...');

    const concepts: LogoConcept[] = [];

    for (let i = 0; i < conceptData.concepts.length; i++) {
      const concept = conceptData.concepts[i];
      onProgress?.(50 + (i * 10), `Generating ${concept.name}...`);

      try {
        // Generate main logo image
        const imageModel = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' });
        const imageResult = await imageModel.generateContent({
          contents: [{
            role: 'user',
            parts: [{
              text: `${concept.imagenPrompt}. Professional logo design, clean, vector style, white background, high quality.`,
            }],
          }],
          generationConfig: {
            responseModalities: ['image'],
          },
        });

        // Extract image data
        const imageData = imageResult.response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        const imageBase64 = imageData ? `data:${imageData.mimeType};base64,${imageData.data}` : '';

        concepts.push({
          id: `concept-${Date.now()}-${i}`,
          name: concept.name,
          rationale: concept.rationale,
          main: imageBase64,
          variations: [],
          archetype: concept.archetype,
        });
      } catch (error) {
        console.error(`Failed to generate image for ${concept.name}:`, error);
        // Continue with other concepts
      }
    }

    onProgress?.(100, 'Concepts ready!');

    if (concepts.length === 0) {
      throw new Error('Failed to generate any logo concepts');
    }

    return concepts;

  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// LOGO EDITING
// ============================================================================

/**
 * Edit an existing logo with natural language
 */
export async function editLogo(
  base64ImageData: string,
  mimeType: string,
  editPrompt: string
): Promise<string> {
  try {
    const apiCall = async () => {
      const model = genAI.getGenerativeModel({ model: 'imagen-3.0-capability-001' });

      // Remove data URL prefix if present
      const cleanBase64 = base64ImageData.replace(/^data:image\/\w+;base64,/, '');

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            { text: `Edit this logo: ${editPrompt}. Maintain professional quality and clean design.` },
          ],
        }],
        generationConfig: {
          responseModalities: ['image'],
        },
      });

      const imageData = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!imageData) {
        throw new Error('No image data in response');
      }

      return `data:${imageData.mimeType};base64,${imageData.data}`;
    };

    return await withRetry(apiCall, 2);

  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// LOGO VARIATIONS
// ============================================================================

/**
 * Generate variations of an existing logo
 */
export async function generateVariations(
  base64ImageData: string,
  mimeType: string
): Promise<LogoVariation[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'imagen-3.0-capability-001' });
    const cleanBase64 = base64ImageData.replace(/^data:image\/\w+;base64,/, '');

    const variations: LogoVariation[] = [];
    const variationPrompts = [
      'Create a monochrome black and white version',
      'Create a minimalist simplified version',
      'Create a colorful vibrant version',
    ];

    for (let i = 0; i < variationPrompts.length; i++) {
      try {
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              { text: variationPrompts[i] },
            ],
          }],
          generationConfig: {
            responseModalities: ['image'],
          },
        });

        const imageData = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (imageData) {
          variations.push({
            id: `var-${Date.now()}-${i}`,
            name: variationPrompts[i].replace('Create a ', '').replace(' version', ''),
            imageUrl: `data:${imageData.mimeType};base64,${imageData.data}`,
            description: variationPrompts[i],
          });
        }
      } catch (error) {
        console.error(`Failed to generate variation ${i}:`, error);
      }
    }

    return variations;

  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// BRAND IDENTITY GENERATION
// ============================================================================

const BRAND_IDENTITY_SYSTEM_INSTRUCTION = `
You are an expert brand strategist. Generate a comprehensive brand identity including:

1. Brand Voice: Name and description of the brand's communication style
2. Typography: Recommended fonts for headlines and body text with rationale
3. Messaging Pillars: 3 core themes that should guide all brand communications
4. Taglines: 3-5 compelling tagline options
5. Logo Usage Guidelines: Basic rules for using the logo

Base your recommendations on:
- The logo design and visual style
- The brand archetype
- The target audience
- Industry best practices

Output as JSON with this exact structure:
{
  "voice": {
    "name": "Voice Name",
    "description": "Detailed description"
  },
  "typography": {
    "headlineFont": "Font Name",
    "bodyFont": "Font Name",
    "rationale": "Why these fonts work"
  },
  "messagingPillars": [
    {
      "title": "Pillar Title",
      "description": "What this means for the brand"
    }
  ],
  "taglines": ["Tagline 1", "Tagline 2", "Tagline 3"],
  "logoUsageGuidelines": "Guidelines text"
}
`;

/**
 * Generate complete brand identity from logo
 */
export async function generateBrandIdentity(
  request: GenerateBrandIdentityRequest
): Promise<BrandIdentity> {
  try {
    const apiCall = async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const cleanBase64 = request.base64ImageData.replace(/^data:image\/\w+;base64,/, '');

      const prompt = `
Analyze this logo and generate a comprehensive brand identity.

Brand Information:
- Name: ${request.brandName}
- Industry: ${request.industry}
- Archetype: ${request.brandArchetype}
- Core Values: ${request.coreValues.join(', ')}
- Logo Vision: ${request.logoVision}
- Target Audience: ${request.targetAudienceProfile}

Create a cohesive brand identity that aligns with the visual style of the logo.
`;

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: request.mimeType,
                data: cleanBase64,
              },
            },
            { text: prompt },
          ],
        }],
        systemInstruction: BRAND_IDENTITY_SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      return JSON.parse(result.response.text());
    };

    return await withRetry(apiCall, 2);

  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// COLOR PALETTE GENERATION
// ============================================================================

/**
 * Generate color palettes from logo
 */
export async function generatePalettesForImage(
  base64ImageData: string,
  mimeType: string,
  brandName: string
): Promise<ColorPalette[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const cleanBase64 = base64ImageData.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `
Analyze this logo and extract 3 color palettes that work well with the design.

For each palette:
1. Extract the main colors from the logo
2. Suggest complementary colors
3. Assign roles (primary, secondary, accent, background, text)
4. Provide a name and description

Return as JSON:
{
  "palettes": [
    {
      "name": "Palette Name",
      "description": "When to use this palette",
      "colors": [
        {
          "hex": "#HEXCODE",
          "name": "Color Name",
          "role": "primary|secondary|accent|background|text"
        }
      ]
    }
  ]
}
`;

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(result.response.text());

    return data.palettes.map((p: any, i: number) => ({
      id: `palette-${Date.now()}-${i}`,
      name: p.name,
      description: p.description,
      colors: p.colors,
    }));

  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// LOGO ANIMATION
// ============================================================================

/**
 * Generate animated video from logo using Veo
 * Note: This is a placeholder - actual Veo integration would require specific API access
 */
export async function generateVideoFromLogo(
  base64ImageData: string,
  mimeType: string,
  animationPrompt: string,
  aspectRatio: '16:9' | '9:16',
  onProgress?: (message: string) => void
): Promise<string> {
  try {
    onProgress?.('Initializing animation generation...');

    // TODO: Implement actual Veo API integration
    // This is a placeholder that demonstrates the expected flow

    onProgress?.('Processing logo for animation...');

    // For now, return a placeholder or throw an error indicating the feature is coming soon
    throw new Error('Video animation feature coming soon. Veo API integration in progress.');

    // Expected implementation:
    // 1. Upload logo to Veo
    // 2. Submit animation request with prompt
    // 3. Poll for completion
    // 4. Return video URL

  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// CONTEXTUAL SUGGESTIONS
// ============================================================================

/**
 * Generate contextual edit suggestions for a logo
 */
export async function generateEditSuggestions(
  base64ImageData: string,
  mimeType: string,
  brief: BrandBrief
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const cleanBase64 = base64ImageData.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `
Analyze this logo and suggest 5 specific improvements or variations that would make it even better.

Consider:
- Brand: ${brief.brandName}
- Industry: ${brief.industry}
- Target Audience: ${brief.targetAudienceProfile}

Provide actionable suggestions like "Make the text bolder" or "Add more contrast between elements".

Return as JSON: { "suggestions": ["suggestion1", "suggestion2", ...] }
`;

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(result.response.text());
    return data.suggestions || [];

  } catch (error) {
    console.error('Failed to generate suggestions:', error);
    return [];
  }
}

// ============================================================================
// SINGLE IMAGE GENERATION (for Claude Helper)
// ============================================================================

/**
 * Generate a single logo image from a prompt
 * Used by Claude Helper Service to generate logos with refined prompts
 */
export async function generateSingleLogoImage(
  prompt: string,
  brandName: string
): Promise<string> {
  try {
    const apiCall = async () => {
      const imageModel = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' });

      const fullPrompt = `${prompt}. Professional logo design for "${brandName}", clean, vector style, white background, high quality.`;

      const imageResult = await imageModel.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: fullPrompt,
          }],
        }],
        generationConfig: {
          responseModalities: ['image'],
        },
      });

      // Extract image data
      const imageData = imageResult.response.candidates?.[0]?.content?.parts?.[0]?.inlineData;

      if (!imageData) {
        throw new Error('No image data in response');
      }

      return `data:${imageData.mimeType};base64,${imageData.data}`;
    };

    return await withRetry(apiCall, 2);

  } catch (error) {
    throw handleApiError(error);
  }
}
