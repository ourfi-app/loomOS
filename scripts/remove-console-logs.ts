#!/usr/bin/env tsx

/**
 * Remove Console Logs Script
 * 
 * This script automatically removes or comments out console.log statements
 * throughout the codebase while preserving console.error, console.warn, and console.info.
 * 
 * Usage:
 *   tsx scripts/remove-console-logs.ts [options]
 * 
 * Options:
 *   --dry-run    Show what would be removed without making changes
 *   --comment    Comment out console.logs instead of removing them
 *   --dir <path> Target specific directory (default: all source directories)
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

interface ScriptOptions {
  dryRun: boolean;
  comment: boolean;
  targetDir?: string;
}

interface ChangeReport {
  file: string;
  lineNumber: number;
  originalLine: string;
  modifiedLine: string;
}

const DEFAULT_DIRECTORIES = ['app', 'components', 'lib', 'hooks', 'utils', 'packages'];
const EXCLUDED_DIRECTORIES = ['node_modules', '.next', '.git', 'scripts', 'dist', 'build'];
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function parseArgs(): ScriptOptions {
  const args = process.argv.slice(2);
  const options: ScriptOptions = {
    dryRun: args.includes('--dry-run'),
    comment: args.includes('--comment'),
  };

  const dirIndex = args.indexOf('--dir');
  if (dirIndex !== -1 && args[dirIndex + 1]) {
    options.targetDir = args[dirIndex + 1];
  }

  return options;
}

function shouldProcessFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  return FILE_EXTENSIONS.includes(ext);
}

function shouldSkipDirectory(dirName: string): boolean {
  return EXCLUDED_DIRECTORIES.includes(dirName);
}

async function getAllFiles(dirPath: string, fileList: string[] = []): Promise<string[]> {
  const files = await readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      if (!shouldSkipDirectory(file)) {
        await getAllFiles(filePath, fileList);
      }
    } else if (shouldProcessFile(filePath)) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function processFileContent(
  content: string,
  filePath: string,
  options: ScriptOptions
): { content: string; changes: ChangeReport[] } {
  const lines = content.split('\n');
  const changes: ChangeReport[] = [];
  const processedLines: string[] = [];

  // Regex to match console.log statements (but not console.error, console.warn, console.info)
  const consoleLogRegex = /^(\s*)console\.log\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(consoleLogRegex);

    if (match) {
      const indent = match[1];
      const lineNumber = i + 1;
      let modifiedLine: string;

      if (options.comment) {
        // Comment out the line
        modifiedLine = `${indent}// ${line.trim()}`;
      } else {
        // Try to find the end of the console.log statement
        let fullStatement = line;
        let openParens = (line.match(/\(/g) || []).length;
        let closeParens = (line.match(/\)/g) || []).length;
        let j = i;

        // Handle multi-line console.log statements
        while (openParens > closeParens && j < lines.length - 1) {
          j++;
          fullStatement += '\n' + lines[j];
          openParens += (lines[j].match(/\(/g) || []).length;
          closeParens += (lines[j].match(/\)/g) || []).length;
        }

        // Remove the entire statement
        if (j > i) {
          // Multi-line statement - skip ahead and don't add these lines
          changes.push({
            file: filePath,
            lineNumber,
            originalLine: fullStatement,
            modifiedLine: '// Removed multi-line console.log',
          });
          i = j; // Skip the lines we've consumed
          continue;
        } else {
          // Single line - just skip it
          changes.push({
            file: filePath,
            lineNumber,
            originalLine: line,
            modifiedLine: '(removed)',
          });
          continue;
        }
      }

      changes.push({
        file: filePath,
        lineNumber,
        originalLine: line,
        modifiedLine,
      });
      processedLines.push(modifiedLine);
    } else {
      processedLines.push(line);
    }
  }

  return {
    content: processedLines.join('\n'),
    changes,
  };
}

async function processFile(filePath: string, options: ScriptOptions): Promise<ChangeReport[]> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const { content: newContent, changes } = processFileContent(content, filePath, options);

    if (changes.length > 0 && !options.dryRun) {
      await writeFile(filePath, newContent, 'utf-8');
    }

    return changes;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}

function printReport(allChanges: ChangeReport[], options: ScriptOptions) {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.cyan}Console.log Removal Report${colors.reset}`);
  console.log('='.repeat(80) + '\n');

  if (options.dryRun) {
    console.log(
      `${colors.yellow}⚠️  DRY RUN MODE - No files were modified${colors.reset}\n`
    );
  }

  if (allChanges.length === 0) {
    console.log(`${colors.green}✓ No console.log statements found!${colors.reset}\n`);
    return;
  }

  // Group changes by file
  const changesByFile = allChanges.reduce((acc, change) => {
    if (!acc[change.file]) {
      acc[change.file] = [];
    }
    acc[change.file].push(change);
    return acc;
  }, {} as Record<string, ChangeReport[]>);

  console.log(
    `${colors.blue}Found ${allChanges.length} console.log statement(s) in ${
      Object.keys(changesByFile).length
    } file(s)${colors.reset}\n`
  );

  // Print details for each file
  Object.entries(changesByFile).forEach(([file, changes]) => {
    console.log(`${colors.cyan}${file}${colors.reset}`);
    changes.forEach((change) => {
      console.log(`  Line ${change.lineNumber}:`);
      console.log(`  ${colors.red}- ${change.originalLine.trim()}${colors.reset}`);
      if (options.comment && change.modifiedLine !== '(removed)') {
        console.log(`  ${colors.green}+ ${change.modifiedLine.trim()}${colors.reset}`);
      }
    });
    console.log('');
  });

  // Print summary
  console.log('='.repeat(80));
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`  Total files affected: ${Object.keys(changesByFile).length}`);
  console.log(`  Total console.log statements: ${allChanges.length}`);
  if (options.dryRun) {
    console.log(
      `  ${colors.yellow}Action: None (dry run)${colors.reset}`
    );
  } else if (options.comment) {
    console.log(`  ${colors.green}Action: Commented out${colors.reset}`);
  } else {
    console.log(`  ${colors.green}Action: Removed${colors.reset}`);
  }
  console.log('='.repeat(80) + '\n');
}

async function main() {
  const options = parseArgs();

  console.log(`${colors.cyan}🧹 Console.log Removal Tool${colors.reset}\n`);
  console.log(`Mode: ${options.dryRun ? 'Dry Run' : 'Live'}`);
  console.log(`Action: ${options.comment ? 'Comment' : 'Remove'}`);
  console.log(
    `Target: ${options.targetDir || DEFAULT_DIRECTORIES.join(', ')}\n`
  );

  let allFiles: string[] = [];

  if (options.targetDir) {
    const targetPath = path.resolve(process.cwd(), options.targetDir);
    if (!fs.existsSync(targetPath)) {
      console.error(`${colors.red}Error: Directory not found: ${targetPath}${colors.reset}`);
      process.exit(1);
    }
    allFiles = await getAllFiles(targetPath);
  } else {
    for (const dir of DEFAULT_DIRECTORIES) {
      const dirPath = path.resolve(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        const files = await getAllFiles(dirPath);
        allFiles.push(...files);
      }
    }
  }

  console.log(`Scanning ${allFiles.length} files...\n`);

  const allChanges: ChangeReport[] = [];

  for (const file of allFiles) {
    const changes = await processFile(file, options);
    allChanges.push(...changes);
  }

  printReport(allChanges, options);

  if (options.dryRun && allChanges.length > 0) {
    console.log(
      `${colors.yellow}To apply these changes, run the script again without --dry-run${colors.reset}\n`
    );
  }
}

// Run the script
main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
