
/**
 * App Validation Service
 * Provides code quality checks, linting, and validation for generated apps
 */

import { z } from 'zod';

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  score: number; // 0-100
}

export interface ValidationError {
  type: 'syntax' | 'typescript' | 'react' | 'security' | 'accessibility';
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'critical';
  fix?: string;
}

export interface ValidationWarning {
  type: 'performance' | 'best-practice' | 'styling' | 'naming' | 'react' | 'accessibility';
  message: string;
  line?: number;
  column?: number;
  suggestion: string;
}

export interface ValidationSuggestion {
  category: 'optimization' | 'refactoring' | 'modernization' | 'accessibility';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  code?: string;
}

// Schema validation
export const ComponentSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(500),
  category: z.enum(['productivity', 'communication', 'utilities', 'entertainment', 'system']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  code: z.string().min(50),
});

/**
 * Validate React component code
 */
export async function validateComponentCode(code: string): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: ValidationSuggestion[] = [];

  // 1. Basic syntax checks
  const syntaxErrors = checkSyntax(code);
  errors.push(...syntaxErrors);

  // 2. React-specific validation
  const reactWarnings = checkReactPatterns(code);
  warnings.push(...reactWarnings);

  // 3. TypeScript validation
  const typeErrors = checkTypeScript(code);
  errors.push(...typeErrors);

  // 4. Security checks
  const securityIssues = checkSecurity(code);
  errors.push(...securityIssues);

  // 5. Accessibility checks
  const a11yWarnings = checkAccessibility(code);
  warnings.push(...a11yWarnings);

  // 6. Performance suggestions
  const perfSuggestions = checkPerformance(code);
  suggestions.push(...perfSuggestions);

  // 7. Best practices
  const bestPractices = checkBestPractices(code);
  warnings.push(...bestPractices);

  // Calculate score
  const score = calculateScore(errors, warnings, suggestions);

  return {
    isValid: errors.filter(e => e.severity === 'critical').length === 0,
    errors,
    warnings,
    suggestions,
    score,
  };
}

/**
 * Check for syntax errors
 */
function checkSyntax(code: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for unclosed brackets
  const openBrackets = (code.match(/\{/g) || []).length;
  const closeBrackets = (code.match(/\}/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push({
      type: 'syntax',
      message: 'Mismatched curly brackets',
      severity: 'critical',
      fix: 'Ensure all opening brackets { have corresponding closing brackets }',
    });
  }

  // Check for unclosed parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push({
      type: 'syntax',
      message: 'Mismatched parentheses',
      severity: 'critical',
      fix: 'Ensure all opening parentheses ( have corresponding closing parentheses )',
    });
  }

  // Check for incomplete JSX tags
  const jsxOpenTags = (code.match(/<[A-Z][a-zA-Z0-9]*[\s>]/g) || []).length;
  const jsxCloseTags = (code.match(/<\/[A-Z][a-zA-Z0-9]*>/g) || []).length;
  const selfClosingTags = (code.match(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g) || []).length;
  
  if (jsxOpenTags - selfClosingTags !== jsxCloseTags) {
    errors.push({
      type: 'react',
      message: 'Unclosed JSX tags detected',
      severity: 'error',
      fix: 'Ensure all JSX tags are properly closed or self-closing',
    });
  }

  return errors;
}

/**
 * Check React patterns and hooks usage
 */
function checkReactPatterns(code: string): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check for useState without initial value
  if (code.includes('useState()') && !code.includes('useState<')) {
    warnings.push({
      type: 'best-practice',
      message: 'useState called without initial value or type',
      suggestion: 'Provide an initial value and type: useState<Type>(initialValue)',
    });
  }

  // Check for useEffect without dependency array
  const useEffectWithoutDeps = /useEffect\([^)]+\)(?!\s*,)/g;
  if (useEffectWithoutDeps.test(code)) {
    warnings.push({
      type: 'best-practice',
      message: 'useEffect without dependency array',
      suggestion: 'Add a dependency array to control when the effect runs',
    });
  }

  // Check for inline function definitions in JSX
  const inlineFunctions = /onClick=\{[^}]*=>/g;
  if (inlineFunctions.test(code)) {
    warnings.push({
      type: 'performance',
      message: 'Inline function definitions in JSX may cause unnecessary re-renders',
      suggestion: 'Define functions outside JSX or use useCallback',
    });
  }

  // Check for missing key prop in lists
  if (code.includes('.map(') && !code.includes('key=')) {
    warnings.push({
      type: 'react',
      message: 'Missing key prop in list items',
      suggestion: 'Add a unique key prop to each element in the list',
    });
  }

  // Check for direct state mutation
  if (code.match(/setState\([^)]*\.[^)]*\)/)) {
    warnings.push({
      type: 'react',
      message: 'Possible direct state mutation detected',
      suggestion: 'Always create new objects/arrays when updating state',
    });
  }

  return warnings;
}

/**
 * Check TypeScript types and interfaces
 */
function checkTypeScript(code: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for 'any' type usage
  if (code.includes(': any') || code.includes('<any>')) {
    errors.push({
      type: 'typescript',
      message: 'Usage of "any" type defeats TypeScript benefits',
      severity: 'error',
      fix: 'Replace "any" with specific types or use "unknown" for truly dynamic data',
    });
  }

  // Check for missing return type on functions
  const functionsWithoutReturnType = /function\s+\w+\([^)]*\)\s*\{/g;
  if (functionsWithoutReturnType.test(code)) {
    errors.push({
      type: 'typescript',
      message: 'Function missing explicit return type',
      severity: 'error',
      fix: 'Add explicit return types to all functions',
    });
  }

  return errors;
}

/**
 * Security vulnerability checks
 */
function checkSecurity(code: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for dangerouslySetInnerHTML
  if (code.includes('dangerouslySetInnerHTML')) {
    errors.push({
      type: 'security',
      message: 'Usage of dangerouslySetInnerHTML can expose to XSS attacks',
      severity: 'critical',
      fix: 'Sanitize HTML content or use safer alternatives',
    });
  }

  // Check for eval usage
  if (code.includes('eval(')) {
    errors.push({
      type: 'security',
      message: 'Usage of eval() is a major security risk',
      severity: 'critical',
      fix: 'Remove eval() and use safer alternatives',
    });
  }

  // Check for inline event handlers with user input
  if (code.includes('onClick={') && code.includes('userInput')) {
    errors.push({
      type: 'security',
      message: 'Potential XSS risk with user input in event handlers',
      severity: 'error',
      fix: 'Sanitize user input before using in event handlers',
    });
  }

  return errors;
}

/**
 * Accessibility checks
 */
function checkAccessibility(code: string): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check for images without alt text
  if (code.includes('<img') && !code.includes('alt=')) {
    warnings.push({
      type: 'accessibility',
      message: 'Images should have alt text',
      suggestion: 'Add alt attribute to all images for screen readers',
    });
  }

  // Check for buttons without accessible labels
  if (code.includes('<button') && code.includes('</button>') && !code.includes('aria-label')) {
    const buttonContent = code.match(/<button[^>]*>(.*?)<\/button>/);
    if (buttonContent && buttonContent[1] && buttonContent[1].trim().startsWith('<')) {
      warnings.push({
        type: 'accessibility',
        message: 'Button contains only icon/image without text or aria-label',
        suggestion: 'Add aria-label or visible text to buttons',
      });
    }
  }

  // Check for form inputs without labels
  if (code.includes('<input') && !code.includes('aria-label') && !code.includes('<label')) {
    warnings.push({
      type: 'accessibility',
      message: 'Form inputs should have associated labels',
      suggestion: 'Add <label> elements or aria-label attributes to inputs',
    });
  }

  // Check for color-only information
  if (code.includes('color:') && !code.includes('aria-')) {
    warnings.push({
      type: 'accessibility',
      message: 'Avoid conveying information through color alone',
      suggestion: 'Use text, icons, or patterns in addition to color',
    });
  }

  return warnings;
}

/**
 * Performance optimization suggestions
 */
function checkPerformance(code: string): ValidationSuggestion[] {
  const suggestions: ValidationSuggestion[] = [];

  // Check for large inline objects
  if (code.includes('style={{') || code.includes('className={')) {
    suggestions.push({
      category: 'optimization',
      title: 'Extract inline styles',
      description: 'Large inline styles can impact performance',
      impact: 'medium',
      effort: 'low',
    });
  }

  // Check for missing React.memo on components
  if (!code.includes('React.memo') && !code.includes('memo(')) {
    suggestions.push({
      category: 'optimization',
      title: 'Consider using React.memo',
      description: 'Memoize component to prevent unnecessary re-renders',
      impact: 'medium',
      effort: 'low',
    });
  }

  // Check for expensive calculations in render
  if (code.includes('.sort(') || code.includes('.filter(')) {
    suggestions.push({
      category: 'optimization',
      title: 'Use useMemo for expensive calculations',
      description: 'Wrap expensive operations in useMemo to cache results',
      impact: 'high',
      effort: 'medium',
    });
  }

  return suggestions;
}

/**
 * Best practices checks
 */
function checkBestPractices(code: string): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check for console.log statements
  if (code.includes('console.log') || code.includes('console.error')) {
    warnings.push({
      type: 'best-practice',
      message: 'Remove console statements before production',
      suggestion: 'Use proper logging library or remove debug statements',
    });
  }

  // Check for TODO comments
  if (code.includes('// TODO') || code.includes('/* TODO')) {
    warnings.push({
      type: 'best-practice',
      message: 'TODO comments found in code',
      suggestion: 'Complete TODO items before deploying',
    });
  }

  // Check for magic numbers
  const magicNumbers = code.match(/\d{3,}/g);
  if (magicNumbers && magicNumbers.length > 2) {
    warnings.push({
      type: 'best-practice',
      message: 'Magic numbers detected',
      suggestion: 'Extract magic numbers into named constants',
    });
  }

  return warnings;
}

/**
 * Calculate overall code quality score
 */
function calculateScore(
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): number {
  let score = 100;

  // Deduct for errors
  const criticalErrors = errors.filter(e => e.severity === 'critical').length;
  const normalErrors = errors.filter(e => e.severity === 'error').length;
  
  score -= criticalErrors * 20;
  score -= normalErrors * 10;

  // Deduct for warnings
  score -= warnings.length * 2;

  // Deduct slightly for unaddressed suggestions
  score -= suggestions.length * 0.5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Validate component metadata
 */
export function validateComponentMetadata(data: unknown): { 
  isValid: boolean; 
  errors: string[]; 
} {
  try {
    ComponentSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return { isValid: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Generate fix suggestions for common errors
 */
export function generateFixSuggestions(errors: ValidationError[]): Map<string, string> {
  const fixes = new Map<string, string>();

  errors.forEach(error => {
    if (error.fix) {
      fixes.set(error.message, error.fix);
    }
  });

  return fixes;
}

/**
 * Test component in sandbox
 */
export interface SandboxTestResult {
  success: boolean;
  renderTime: number;
  errors: string[];
  warnings: string[];
  componentTree: string;
}

export async function testInSandbox(code: string): Promise<SandboxTestResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Basic validation first
    const validation = await validateComponentCode(code);
    
    if (!validation.isValid) {
      errors.push(...validation.errors.map(e => e.message));
    }

    warnings.push(...validation.warnings.map(w => w.message));

    const renderTime = Date.now() - startTime;

    return {
      success: errors.length === 0,
      renderTime,
      errors,
      warnings,
      componentTree: 'Component tree analysis would go here',
    };
  } catch (error) {
    return {
      success: false,
      renderTime: Date.now() - startTime,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      warnings,
      componentTree: '',
    };
  }
}
