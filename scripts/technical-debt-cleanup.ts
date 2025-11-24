#!/usr/bin/env tsx

/**
 * Technical Debt Cleanup Script
 * 
 * Intelligently cleans up console statements and TODO/FIXME comments
 * while generating comprehensive reports for documentation.
 */

import * as fs from 'fs';
import * as path from 'path';

interface ConsoleUsage {
  file: string;
  line: number;
  type: 'log' | 'error' | 'warn' | 'info' | 'debug';
  content: string;
  shouldKeep: boolean;
  reason: string;
}

interface TodoComment {
  file: string;
  line: number;
  type: 'TODO' | 'FIXME' | 'HACK' | 'XXX';
  content: string;
  context: string;
  category: 'security' | 'performance' | 'feature' | 'refactor' | 'bug' | 'documentation' | 'other';
}

// Files/directories where console statements are intentional
const KEEP_CONSOLE_PATTERNS = [
  /lib\/logger\.ts$/,
  /lib\/error-logger\.ts$/,
  /lib\/dev-utils\.ts$/,
  /scripts\//,
  /public\/sw.*\.js$/,
  /\.test\.(ts|tsx|js|jsx)$/,
  /__tests__\//,
];

// Patterns that indicate intentional logging
const INTENTIONAL_LOGGING_PATTERNS = [
  /console\.(error|warn)\(/,
  /production.*console/i,
  /logger/i,
  /error.*handler/i,
];

const SOURCE_DIRS = ['app', 'components', 'lib', 'hooks'];
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];

function shouldKeepFile(filePath: string): boolean {
  return KEEP_CONSOLE_PATTERNS.some(pattern => pattern.test(filePath));
}

function analyzeConsoleStatement(
  file: string,
  line: number,
  content: string,
  surroundingLines: string[]
): ConsoleUsage {
  const type = content.match(/console\.(log|error|warn|info|debug)/)?.[1] as ConsoleUsage['type'] || 'log';
  
  let shouldKeep = false;
  let reason = 'Debug statement - should be removed';

  // Check if file should keep console statements
  if (shouldKeepFile(file)) {
    shouldKeep = true;
    reason = 'Intentional logging utility file';
  }
  // Keep error and warn in production code
  else if (type === 'error' || type === 'warn') {
    // Check if it's wrapped in a condition or error handler
    const context = surroundingLines.join('\n');
    if (context.includes('catch') || context.includes('error') || context.includes('Error')) {
      shouldKeep = true;
      reason = 'Error handling - keeping for production';
    }
  }
  // Check for intentional logging patterns
  else if (INTENTIONAL_LOGGING_PATTERNS.some(pattern => content.match(pattern))) {
    shouldKeep = true;
    reason = 'Intentional logging pattern detected';
  }

  return { file, line, type, content: content.trim(), shouldKeep, reason };
}

function categorizeComment(content: string): TodoComment['category'] {
  const lower = content.toLowerCase();
  
  if (lower.includes('security') || lower.includes('auth') || lower.includes('permission')) {
    return 'security';
  }
  if (lower.includes('performance') || lower.includes('optimize') || lower.includes('slow')) {
    return 'performance';
  }
  if (lower.includes('implement') || lower.includes('add feature') || lower.includes('new feature')) {
    return 'feature';
  }
  if (lower.includes('refactor') || lower.includes('cleanup') || lower.includes('reorganize')) {
    return 'refactor';
  }
  if (lower.includes('bug') || lower.includes('fix') || lower.includes('broken')) {
    return 'bug';
  }
  if (lower.includes('document') || lower.includes('comment') || lower.includes('describe')) {
    return 'documentation';
  }
  
  return 'other';
}

function analyzeTodoComment(
  file: string,
  line: number,
  content: string,
  fullContext: string
): TodoComment {
  const type = (content.match(/(TODO|FIXME|HACK|XXX)/)?.[1] || 'TODO') as TodoComment['type'];
  const cleanContent = content.replace(/\/\/\s*(TODO|FIXME|HACK|XXX):\s*/i, '').trim();
  const category = categorizeComment(cleanContent);

  return {
    file,
    line,
    type,
    content: cleanContent,
    context: fullContext,
    category,
  };
}

function scanFile(filePath: string): { consoles: ConsoleUsage[]; todos: TodoComment[] } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const consoles: ConsoleUsage[] = [];
  const todos: TodoComment[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check for console statements
    if (/console\.(log|error|warn|info|debug)/.test(line)) {
      const surroundingLines = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3));
      consoles.push(analyzeConsoleStatement(filePath, lineNum, line, surroundingLines));
    }

    // Check for TODO/FIXME comments
    if (/(TODO|FIXME|HACK|XXX):/.test(line)) {
      const context = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join('\n');
      todos.push(analyzeTodoComment(filePath, lineNum, line, context));
    }
  }

  return { consoles, todos };
}

function scanDirectory(dirPath: string): { consoles: ConsoleUsage[]; todos: TodoComment[] } {
  let consoles: ConsoleUsage[] = [];
  let todos: TodoComment[] = [];

  function walk(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!EXCLUDE_DIRS.includes(file)) {
          walk(filePath);
        }
      } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        const results = scanFile(filePath);
        consoles.push(...results.consoles);
        todos.push(...results.todos);
      }
    }
  }

  walk(dirPath);
  return { consoles, todos };
}

function generateReport(consoles: ConsoleUsage[], todos: TodoComment[]): string {
  const removableConsoles = consoles.filter(c => !c.shouldKeep);
  const keepableConsoles = consoles.filter(c => c.shouldKeep);
  
  const todosByCategory = todos.reduce((acc, todo) => {
    if (!acc[todo.category]) acc[todo.category] = [];
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, TodoComment[]>);

  let report = '# Technical Debt Cleanup Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  // Console statements summary
  report += '## Console Statements Analysis\n\n';
  report += `- Total console statements found: ${consoles.length}\n`;
  report += `- Statements to keep (intentional logging): ${keepableConsoles.length}\n`;
  report += `- Statements to remove (debug): ${removableConsoles.length}\n\n`;

  // Console statements by type
  const consolesByType = consoles.reduce((acc, c) => {
    if (!acc[c.type]) acc[c.type] = [];
    acc[c.type].push(c);
    return acc;
  }, {} as Record<string, ConsoleUsage[]>);

  report += '### Console Statements by Type\n\n';
  Object.entries(consolesByType).forEach(([type, items]) => {
    report += `- console.${type}: ${items.length} occurrences\n`;
  });
  report += '\n';

  // Statements to remove
  if (removableConsoles.length > 0) {
    report += '### Debug Statements to Remove\n\n';
    const byFile = removableConsoles.reduce((acc, c) => {
      const relPath = c.file.replace(process.cwd() + '/', '');
      if (!acc[relPath]) acc[relPath] = [];
      acc[relPath].push(c);
      return acc;
    }, {} as Record<string, ConsoleUsage[]>);

    Object.entries(byFile).forEach(([file, items]) => {
      report += `#### ${file}\n\n`;
      items.forEach(item => {
        report += `- Line ${item.line}: \`${item.type}\`\n`;
      });
      report += '\n';
    });
  }

  // TODO/FIXME Analysis
  report += '## TODO/FIXME Comments Analysis\n\n';
  report += `- Total comments found: ${todos.length}\n\n`;

  report += '### Comments by Category\n\n';
  Object.entries(todosByCategory).forEach(([category, items]) => {
    report += `#### ${category.charAt(0).toUpperCase() + category.slice(1)} (${items.length})\n\n`;
    items.slice(0, 5).forEach(todo => {
      const relPath = todo.file.replace(process.cwd() + '/', '');
      report += `- **${todo.type}** in \`${relPath}:${todo.line}\`: ${todo.content}\n`;
    });
    if (items.length > 5) {
      report += `- ... and ${items.length - 5} more\n`;
    }
    report += '\n';
  });

  return report;
}

function removeDebugConsoles(consoles: ConsoleUsage[]) {
  const removableByFile = consoles
    .filter(c => !c.shouldKeep)
    .reduce((acc, c) => {
      if (!acc[c.file]) acc[c.file] = [];
      acc[c.file].push(c);
      return acc;
    }, {} as Record<string, ConsoleUsage[]>);

  let totalRemoved = 0;

  Object.entries(removableByFile).forEach(([file, items]) => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    // Sort by line number descending to avoid index shifting
    items.sort((a, b) => b.line - a.line);

    items.forEach(item => {
      const lineIndex = item.line - 1;
      const line = lines[lineIndex];
      
      // Check if it's the only content on the line
      if (line.trim().startsWith('console.')) {
        // Remove the entire line
        lines.splice(lineIndex, 1);
        totalRemoved++;
      } else {
        // Comment out the console statement
        lines[lineIndex] = line.replace(/console\.(log|error|warn|info|debug)/, '// console.$1');
        totalRemoved++;
      }
    });

    fs.writeFileSync(file, lines.join('\n'), 'utf-8');
  });

  return totalRemoved;
}

// Main execution
console.log('🔍 Scanning codebase for technical debt...\n');

let allConsoles: ConsoleUsage[] = [];
let allTodos: TodoComment[] = [];

SOURCE_DIRS.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Scanning ${dir}/...`);
    const results = scanDirectory(dirPath);
    allConsoles.push(...results.consoles);
    allTodos.push(...results.todos);
  }
});

console.log('\n📊 Generating report...\n');
const report = generateReport(allConsoles, allTodos);

// Save report
const reportPath = path.join(process.cwd(), 'technical-debt-analysis.md');
fs.writeFileSync(reportPath, report, 'utf-8');
console.log(`✅ Report saved to: ${reportPath}\n`);

// Print summary
console.log('Summary:');
console.log(`- Console statements: ${allConsoles.length} (${allConsoles.filter(c => !c.shouldKeep).length} to remove)`);
console.log(`- TODO/FIXME comments: ${allTodos.length}`);

// Ask for confirmation before removing
if (process.argv.includes('--remove')) {
  console.log('\n🧹 Removing debug console statements...');
  const removed = removeDebugConsoles(allConsoles);
  console.log(`✅ Removed ${removed} debug console statements`);
} else {
  console.log('\n💡 Run with --remove flag to automatically remove debug console statements');
}
