
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb,
  Play,
  Loader2,
  Code,
  Shield,
  Zap,
  Eye
} from 'lucide-react';
import type { 
  ValidationResult, 
  ValidationError, 
  ValidationWarning, 
  ValidationSuggestion 
} from '@/lib/app-validation';

interface ValidationPanelProps {
  code: string;
  onValidate?: (result: ValidationResult) => void;
}

export function ValidationPanel({ code, onValidate }: ValidationPanelProps) {
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const runValidation = async () => {
    setValidating(true);
    try {
      const response = await fetch('/api/designer/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type: 'code' }),
      });

      if (!response.ok) throw new Error('Validation failed');

      const data = await response.json();
      setResult(data);
      onValidate?.(data);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setValidating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Work';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Code Validation</h3>
          <p className="text-sm text-muted-foreground">
            Automated quality checks and error detection
          </p>
        </div>
        <Button
          onClick={runValidation}
          disabled={validating || !code}
          size="sm"
        >
          {validating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Validation
            </>
          )}
        </Button>
      </div>

      {result && (
        <>
          <Separator className="my-4" />
          
          {/* Score Overview */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold">
                  Quality Score
                </span>
                {result.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score.toFixed(0)}
                </span>
                <span className="text-muted-foreground">/100</span>
                <Badge variant={result.score >= 70 ? 'default' : 'destructive'}>
                  {getScoreBadge(result.score)}
                </Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {result.errors.length}
                </div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {result.warnings.length}
                </div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {result.suggestions.length}
                </div>
                <div className="text-xs text-muted-foreground">Tips</div>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {/* Errors Section */}
            {result.errors.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold">Errors ({result.errors.length})</h4>
                </div>
                <div className="space-y-2">
                  {result.errors.map((error, index) => (
                    <ErrorCard key={index} error={error} />
                  ))}
                </div>
              </div>
            )}

            {/* Warnings Section */}
            {result.warnings.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold">Warnings ({result.warnings.length})</h4>
                </div>
                <div className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <WarningCard key={index} warning={warning} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions Section */}
            {result.suggestions.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Suggestions ({result.suggestions.length})</h4>
                </div>
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            )}

            {result.errors.length === 0 && 
             result.warnings.length === 0 && 
             result.suggestions.length === 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Excellent! No issues found. Your code passes all quality checks.
                </AlertDescription>
              </Alert>
            )}
          </ScrollArea>
        </>
      )}

      {!result && !validating && (
        <div className="text-center py-12 text-muted-foreground">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Click "Run Validation" to check your code quality</p>
        </div>
      )}
    </Card>
  );
}

function ErrorCard({ error }: { error: ValidationError }) {
  const getIcon = () => {
    switch (error.type) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'typescript': return <Code className="w-4 h-4" />;
      case 'accessibility': return <Eye className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <Alert variant="destructive">
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <div className="font-semibold">{error.message}</div>
          {error.fix && (
            <div className="text-sm mt-1 opacity-90">
              <strong>Fix:</strong> {error.fix}
            </div>
          )}
          {(error.line || error.column) && (
            <div className="text-xs mt-1 opacity-75">
              Line {error.line}, Column {error.column}
            </div>
          )}
        </div>
        <Badge variant="destructive">
          {error.severity === 'critical' ? 'Critical' : 'Error'}
        </Badge>
      </div>
    </Alert>
  );
}

function WarningCard({ warning }: { warning: ValidationWarning }) {
  return (
    <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <div className="flex-1">
          <div className="font-semibold text-yellow-900 dark:text-yellow-100">
            {warning.message}
          </div>
          <div className="text-sm mt-1 text-yellow-800 dark:text-yellow-200">
            <strong>Suggestion:</strong> {warning.suggestion}
          </div>
          {(warning.line || warning.column) && (
            <div className="text-xs mt-1 opacity-75">
              Line {warning.line}, Column {warning.column}
            </div>
          )}
        </div>
        <Badge className="bg-yellow-200 text-yellow-900">
          {warning.type}
        </Badge>
      </div>
    </Alert>
  );
}

function SuggestionCard({ suggestion }: { suggestion: ValidationSuggestion }) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-900';
      case 'medium': return 'bg-yellow-100 text-yellow-900';
      case 'low': return 'bg-green-100 text-green-900';
      default: return 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-primary)]';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-900';
      case 'medium': return 'bg-yellow-100 text-yellow-900';
      case 'low': return 'bg-green-100 text-green-900';
      default: return 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-primary)]';
    }
  };

  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-blue-600" />
        <div className="flex-1">
          <div className="font-semibold text-blue-900 dark:text-blue-100">
            {suggestion.title}
          </div>
          <div className="text-sm mt-1 text-blue-800 dark:text-blue-200">
            {suggestion.description}
          </div>
          {suggestion.code && (
            <pre className="text-xs mt-2 p-2 bg-black/5 rounded overflow-x-auto">
              <code>{suggestion.code}</code>
            </pre>
          )}
          <div className="flex gap-2 mt-2">
            <Badge className={getImpactColor(suggestion.impact)}>
              Impact: {suggestion.impact}
            </Badge>
            <Badge className={getEffortColor(suggestion.effort)}>
              Effort: {suggestion.effort}
            </Badge>
          </div>
        </div>
        <Badge className="bg-blue-200 text-blue-900">
          {suggestion.category}
        </Badge>
      </div>
    </Alert>
  );
}
