// TODO: Review setTimeout calls for proper cleanup in useEffect return functions
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Brain, Image as ImageIcon, CheckCircle2, MessageCircle } from 'lucide-react';
import { BrandBrief, ClaudeAnalysis, LogoConcept, LogoValidation } from '@/lib/brandy/types';

/**
 * Claude Helper Demo Page
 * Demonstrates the dual-AI workflow where Claude assists Gemini
 */
export default function ClaudeHelperDemo() {
  const [stage, setStage] = useState<'input' | 'analysis' | 'generation' | 'validation' | 'complete'>('input');
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ClaudeAnalysis | null>(null);
  const [concepts, setConcepts] = useState<LogoConcept[]>([]);
  const [validations, setValidations] = useState<LogoValidation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStartWorkflow = async () => {
    if (!brandName || !industry || !description) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Step 1: Claude analyzes the brand brief
      setStage('analysis');

      const brandBrief: BrandBrief = {
        brandName,
        industry,
        logoVision: description,
        brandArchetype: 'The Creator',
        coreValues: ['Innovation', 'Quality', 'Trust'],
        targetAudienceProfile: 'Modern professionals',
        brandPersonality: ['Professional', 'Innovative'],
      };

      const analysisResponse = await fetch('/api/brandy/claude-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          brandBrief,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData.analysis);

      // Step 2: Generate logos with Gemini using Claude's refined prompts
      setStage('generation');

      // Note: In a full implementation, you would call the generation endpoint
      // For now, we'll simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate generated concepts
      const mockConcepts: LogoConcept[] = analysisData.analysis.refinedPrompts.map((prompt: any, index: number) => ({
        id: prompt.id,
        name: `Concept ${index + 1}: ${prompt.expectedStyle}`,
        rationale: prompt.rationale,
        main: '/placeholder-logo.png',
        variations: [],
        archetype: 'The Creator',
      }));

      setConcepts(mockConcepts);

      // Step 3: Claude validates the concepts
      setStage('validation');

      const validationResponse = await fetch('/api/brandy/claude-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          brandBrief,
          concepts: mockConcepts,
          analysis: analysisData.analysis,
        }),
      });

      if (!validationResponse.ok) {
        throw new Error('Validation failed');
      }

      const validationData = await validationResponse.json();
      setValidations(validationData.validations);

      setStage('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStage('input');
    setBrandName('');
    setIndustry('');
    setDescription('');
    setAnalysis(null);
    setConcepts([]);
    setValidations([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-[var(--semantic-primary)]" />
            Claude + Gemini: Dual-AI Brand Creation
          </h1>
          <p className="text-lg text-slate-600">
            Watch Claude analyze and refine your brand vision, then guide Gemini to create perfect logos
          </p>
        </motion.div>

        {/* Progress Indicators */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <StageIndicator
            icon={<Brain className="w-5 h-5" />}
            label="Input"
            active={stage === 'input'}
            complete={stage !== 'input'}
          />
          <div className="w-12 h-0.5 bg-slate-300" />
          <StageIndicator
            icon={<Sparkles className="w-5 h-5" />}
            label="Analysis"
            active={stage === 'analysis'}
            complete={['generation', 'validation', 'complete'].includes(stage)}
          />
          <div className="w-12 h-0.5 bg-slate-300" />
          <StageIndicator
            icon={<ImageIcon className="w-5 h-5" />}
            label="Generation"
            active={stage === 'generation'}
            complete={['validation', 'complete'].includes(stage)}
          />
          <div className="w-12 h-0.5 bg-slate-300" />
          <StageIndicator
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Validation"
            active={stage === 'validation'}
            complete={stage === 'complete'}
          />
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {stage === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Tell us about your brand</CardTitle>
                  <CardDescription>
                    Claude will analyze your vision and create strategic prompts for Gemini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g., TechFlow"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g., Technology, Healthcare, Finance"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Brand Vision</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what your brand stands for, your target audience, and the feeling you want to evoke..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleStartWorkflow}
                    disabled={loading}
                    className="w-full bg-[var(--semantic-primary)] hover:bg-[var(--semantic-primary-dark)] text-white"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Dual-AI Workflow
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {stage === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-[var(--semantic-primary)]" />
                    Claude is analyzing your brand...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Brand DNA</h3>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                          <p className="text-sm"><strong>Essence:</strong> {analysis.brandDNA.essence}</p>
                          <p className="text-sm"><strong>Emotional Core:</strong> {analysis.brandDNA.emotionalCore}</p>
                          <p className="text-sm"><strong>Visual Direction:</strong> {analysis.brandDNA.visualDirection}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">Refined Prompts for Gemini</h3>
                        <div className="space-y-3">
                          {analysis.refinedPrompts.map((prompt, index) => (
                            <Card key={prompt.id}>
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                  <Badge className="bg-[var(--semantic-primary)]">{index + 1}</Badge>
                                  <div className="flex-1">
                                    <p className="font-medium mb-1">{prompt.expectedStyle}</p>
                                    <p className="text-sm text-slate-600 mb-2">{prompt.rationale}</p>
                                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                                      {prompt.prompt}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[var(--semantic-primary)]" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(stage === 'generation' || stage === 'validation' || stage === 'complete') && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Analysis Summary */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    Claude's Brand Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm mb-2"><strong>Essence:</strong> {analysis.brandDNA.essence}</p>
                    <p className="text-sm"><strong>Strategy:</strong> {analysis.designStrategy}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Concepts */}
              {concepts.length > 0 && (
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle>Generated Logo Concepts</CardTitle>
                    <CardDescription>
                      {stage === 'validation' ? 'Validating concepts...' : 'Click any concept to see validation'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {concepts.map((concept, index) => (
                        <Card key={concept.id} className="overflow-hidden">
                          <div className="h-48 bg-slate-100 flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-slate-300" />
                          </div>
                          <CardContent className="pt-4">
                            <h4 className="font-medium mb-1">{concept.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{concept.rationale}</p>
                            {validations[index] && (
                              <div className="space-y-2 mt-3 pt-3 border-t">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Alignment Score</span>
                                  <Badge
                                    className={
                                      validations[index].alignmentScore >= 80
                                        ? 'bg-green-600'
                                        : validations[index].alignmentScore >= 60
                                        ? 'bg-yellow-600'
                                        : 'bg-red-600'
                                    }
                                  >
                                    {validations[index].alignmentScore}/100
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600">{validations[index].brandFit}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {stage === 'complete' && (
                <Card className="shadow-xl bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-lg">Workflow Complete!</h3>
                        <p className="text-sm text-slate-600">
                          Claude analyzed, Gemini generated, and Claude validated your logos
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleReset} variant="outline">
                      Try Another Brand
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Stage Indicator Component
function StageIndicator({
  icon,
  label,
  active,
  complete,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          active
            ? 'bg-[var(--semantic-primary)] text-white'
            : complete
            ? 'bg-green-600 text-white'
            : 'bg-slate-200 text-slate-400'
        }`}
      >
        {complete && !active ? <CheckCircle2 className="w-6 h-6" /> : icon}
      </div>
      <span
        className={`text-sm font-medium ${
          active || complete ? 'text-slate-900' : 'text-slate-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
