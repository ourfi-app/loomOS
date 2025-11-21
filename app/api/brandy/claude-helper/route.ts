import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as claudeHelper from '@/lib/brandy/services/claudeHelperService';
import { BrandBrief, LogoConcept, ClaudeAnalysis } from '@/lib/brandy/types';

// POST /api/brandy/claude-helper - Handle Claude helper operations
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { action } = body;

    switch (action) {
      case 'analyze':
        return await handleAnalyze(body);

      case 'validate':
        return await handleValidate(body);

      case 'generate-identity':
        return await handleGenerateIdentity(body);

      case 'guidance':
        return await handleGuidance(body);

      case 'explain':
        return await handleExplain(body);

      case 'generate-website':
        return await handleGenerateWebsite(body);

      case 'complete-flow':
        return await handleCompleteFlow(body);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Claude helper error:', error);
    return NextResponse.json(
      {
        error: 'Operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle brand brief analysis
async function handleAnalyze(body: { brandBrief: BrandBrief }) {
  const { brandBrief } = body;

  if (!brandBrief) {
    return NextResponse.json({ error: 'Brand brief is required' }, { status: 400 });
  }

  const analysis = await claudeHelper.analyzeBrandBrief(brandBrief);

  return NextResponse.json({
    success: true,
    analysis,
  });
}

// Handle logo validation
async function handleValidate(body: {
  brandBrief: BrandBrief;
  concepts: LogoConcept[];
  analysis: ClaudeAnalysis;
}) {
  const { brandBrief, concepts, analysis } = body;

  if (!brandBrief || !concepts || !analysis) {
    return NextResponse.json(
      { error: 'Brand brief, concepts, and analysis are required' },
      { status: 400 }
    );
  }

  const validations = await claudeHelper.validateLogoConcepts(
    brandBrief,
    concepts,
    analysis
  );

  return NextResponse.json({
    success: true,
    validations,
  });
}

// Handle brand identity generation
async function handleGenerateIdentity(body: {
  brandBrief: BrandBrief;
  selectedLogo: LogoConcept;
  analysis: ClaudeAnalysis;
}) {
  const { brandBrief, selectedLogo, analysis } = body;

  if (!brandBrief || !selectedLogo || !analysis) {
    return NextResponse.json(
      { error: 'Brand brief, selected logo, and analysis are required' },
      { status: 400 }
    );
  }

  const identity = await claudeHelper.generateCompleteBrandIdentity(
    brandBrief,
    selectedLogo,
    analysis
  );

  return NextResponse.json({
    success: true,
    identity,
  });
}

// Handle contextual guidance
async function handleGuidance(body: {
  context: {
    currentStep: 'brief' | 'generation' | 'selection' | 'identity' | 'website';
    brandBrief?: BrandBrief;
    analysis?: ClaudeAnalysis;
    concepts?: LogoConcept[];
    selectedLogo?: LogoConcept;
  };
  userQuestion?: string;
}) {
  const { context, userQuestion } = body;

  if (!context) {
    return NextResponse.json({ error: 'Context is required' }, { status: 400 });
  }

  const guidance = await claudeHelper.provideGuidance(context, userQuestion);

  return NextResponse.json({
    success: true,
    guidance,
  });
}

// Handle design decision explanation
async function handleExplain(body: {
  decision: {
    type: 'color' | 'typography' | 'layout' | 'style' | 'concept';
    element: string;
    context: any;
  };
}) {
  const { decision } = body;

  if (!decision) {
    return NextResponse.json({ error: 'Decision is required' }, { status: 400 });
  }

  const explanation = await claudeHelper.explainDesignDecision(decision);

  return NextResponse.json({
    success: true,
    explanation,
  });
}

// Handle website generation
async function handleGenerateWebsite(body: {
  brandBrief: BrandBrief;
  brandIdentity: any;
  selectedLogo: LogoConcept;
  pageType: 'landing' | 'about' | 'contact' | 'portfolio';
}) {
  const { brandBrief, brandIdentity, selectedLogo, pageType } = body;

  if (!brandBrief || !brandIdentity || !selectedLogo || !pageType) {
    return NextResponse.json(
      { error: 'All parameters are required' },
      { status: 400 }
    );
  }

  const result = await claudeHelper.generateWebsiteContent(
    brandBrief,
    brandIdentity,
    selectedLogo,
    pageType
  );

  return NextResponse.json({
    success: true,
    ...result,
  });
}

// Handle complete orchestration flow
async function handleCompleteFlow(body: { brandBrief: BrandBrief }) {
  const { brandBrief } = body;

  if (!brandBrief) {
    return NextResponse.json({ error: 'Brand brief is required' }, { status: 400 });
  }

  // Note: This would ideally use streaming or Server-Sent Events for real-time updates
  // For now, we'll return the complete result
  const result = await claudeHelper.runCompleteBrandCreation(brandBrief);

  return NextResponse.json({
    success: true,
    ...result,
  });
}
