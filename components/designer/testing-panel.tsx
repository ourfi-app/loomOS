
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  FileCode,
  Download
} from 'lucide-react';
import type { TestSuite, TestCase } from '@/lib/app-testing';

interface TestingPanelProps {
  code: string;
  componentName: string;
  onTestComplete?: (suite: TestSuite) => void;
}

export function TestingPanel({ code, componentName, onTestComplete }: TestingPanelProps) {
  const [testing, setTesting] = useState(false);
  const [suite, setSuite] = useState<TestSuite | null>(null);
  const [report, setReport] = useState<string>('');

  const runTests = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/designer/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, componentName }),
      });

      if (!response.ok) throw new Error('Testing failed');

      const data = await response.json();
      setSuite(data.suite);
      setReport(data.report);
      onTestComplete?.(data.suite);
    } catch (error) {
      console.error('Testing error:', error);
    } finally {
      setTesting(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${componentName}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return 'bg-[var(--semantic-success)]';
    if (coverage >= 70) return 'bg-yellow-600';
    if (coverage >= 50) return 'bg-[var(--semantic-primary-dark)]';
    return 'bg-[var(--semantic-error)]';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Component Testing</h3>
          <p className="text-sm text-muted-foreground">
            Automated test suite for {componentName}
          </p>
        </div>
        <div className="flex gap-2">
          {suite && (
            <Button
              onClick={downloadReport}
              disabled={!report}
              size="sm"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Report
            </Button>
          )}
          <Button
            onClick={runTests}
            disabled={testing || !code}
            size="sm"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {suite && (
        <>
          <Separator className="my-4" />
          
          {/* Test Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Card className="p-4">
              <div className="text-2xl font-bold">{suite.totalTests}</div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </Card>
            
            <Card className="p-4 border-[var(--semantic-success-bg)] bg-[var(--semantic-success-bg)] dark:bg-green-950/20">
              <div className="text-2xl font-bold text-[var(--semantic-success)]">
                {suite.passedTests}
              </div>
              <div className="text-xs text-muted-foreground">Passed</div>
            </Card>
            
            <Card className="p-4 border-[var(--semantic-error-border)] bg-[var(--semantic-error-bg)] dark:bg-red-950/20">
              <div className="text-2xl font-bold text-[var(--semantic-error)]">
                {suite.failedTests}
              </div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </Card>
            
            <Card className="p-4">
              <div className="text-2xl font-bold">{suite.duration}ms</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </Card>
          </div>

          {/* Coverage */}
          {suite.coverage !== undefined && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Test Coverage</span>
                <span className="text-sm font-bold">
                  {suite.coverage.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={suite.coverage} 
                className={getCoverageColor(suite.coverage)}
              />
            </div>
          )}

          <Separator className="my-4" />

          {/* Test Cases */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {suite.tests.map((test) => (
                <TestCaseCard key={test.id} test={test} />
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {!suite && !testing && (
        <div className="text-center py-12 text-muted-foreground">
          <FileCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Click "Run Tests" to start automated testing</p>
        </div>
      )}
    </Card>
  );
}

function TestCaseCard({ test }: { test: TestCase }) {
  const getStatusIcon = () => {
    switch (test.status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-[var(--semantic-success)]" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-[var(--semantic-error)]" />;
      case 'running':
        return <Loader2 className="w-5 h-5 animate-spin text-[var(--semantic-primary)]" />;
      default:
        return <Clock className="w-5 h-5 text-[var(--semantic-text-tertiary)]" />;
    }
  };

  const getStatusColor = () => {
    switch (test.status) {
      case 'passed':
        return 'border-[var(--semantic-success-bg)] bg-[var(--semantic-success-bg)] dark:bg-green-950/20';
      case 'failed':
        return 'border-[var(--semantic-error-border)] bg-[var(--semantic-error-bg)] dark:bg-red-950/20';
      case 'running':
        return 'border-[var(--semantic-primary-light)] bg-[var(--semantic-primary-subtle)] dark:bg-blue-950/20';
      default:
        return '';
    }
  };

  const getTypeColor = () => {
    switch (test.type) {
      case 'unit':
        return 'bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)]';
      case 'integration':
        return 'bg-[var(--semantic-accent-subtle)] text-purple-900';
      case 'accessibility':
        return 'bg-[var(--semantic-success-bg)] text-green-900';
      case 'performance':
        return 'bg-[var(--semantic-primary-subtle)] text-orange-900';
      default:
        return 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-primary)]';
    }
  };

  return (
    <Card className={`p-4 ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{test.name}</span>
            <Badge className={getTypeColor()}>
              {test.type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {test.description}
          </p>
          {test.duration && (
            <div className="text-xs text-muted-foreground">
              Duration: {test.duration}ms
            </div>
          )}
          {test.error && (
            <div className="text-sm text-[var(--semantic-error)] mt-2 p-2 bg-[var(--semantic-error-bg)] dark:bg-red-950/50 rounded">
              <strong>Error:</strong> {test.error}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
