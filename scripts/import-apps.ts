#!/usr/bin/env tsx
/**
 * App Import CLI Tool
 *
 * Command-line tool for importing apps from JSON manifests
 *
 * Usage:
 *   tsx scripts/import-apps.ts dir ./apps
 *   tsx scripts/import-apps.ts file ./apps/my-app/app.json
 *   tsx scripts/import-apps.ts validate ./apps/my-app/app.json
 *   tsx scripts/import-apps.ts export --output ./exported-apps.json
 */

import { AppImportService } from '../lib/marketplace/AppImportService';
import { AppImportOptions, AppManifest } from '../lib/marketplace/app-import-types';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();
const importService = new AppImportService(prisma);

// Simple CLI argument parser
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const flags: Record<string, any> = {};
  const positional: string[] = [];

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('-')) {
        flags[key] = nextArg;
        i++;
      } else {
        flags[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      flags[key] = true;
    } else {
      positional.push(arg);
    }
  }

  return { command, flags, positional };
}

function printUsage() {
  console.log(`
App Import CLI Tool

Usage:
  tsx scripts/import-apps.ts <command> [arguments] [options]

Commands:
  dir <directory>      Import all apps from a directory
  file <file>          Import app from a single JSON file
  validate <file>      Validate app definition without importing
  export               Export apps to JSON format

Options:
  --update             Update existing apps (default: true)
  --publish            Auto-publish imported apps
  --dry-run            Validate without importing
  --organization <id>  Default organization ID
  --developer <id>     Default developer ID
  --app-id <id>        Export specific app by ID
  --output <file>      Output file for exports

Examples:
  tsx scripts/import-apps.ts dir ./apps
  tsx scripts/import-apps.ts file ./apps/my-app/app.json
  tsx scripts/import-apps.ts validate ./apps/my-app/app.json
  tsx scripts/import-apps.ts export --output exported.json
  `);
}

async function main() {
  const { command, flags, positional } = parseArgs();

  try {
    if (!command || command === 'help') {
      printUsage();
      process.exit(0);
    }

    // Import from directory
    if (command === 'dir') {
      const directory = positional[0];
      if (!directory) {
        console.error('Error: Missing directory argument');
        printUsage();
        process.exit(1);
      }

      console.log(`\n📦 Importing apps from directory: ${directory}\n`);

      const importOptions: AppImportOptions = {
        updateExisting: flags.update !== false,
        autoPublish: flags.publish || flags.p || false,
        dryRun: flags['dry-run'] || flags.d || false,
        defaultOrganizationId: flags.organization || flags.o,
        defaultDeveloperId: flags.developer,
      };

      const result = await importService.importFromDirectory(directory, importOptions);

      console.log('\n📊 Import Summary:\n');
      console.log(`  Total apps: ${result.totalApps}`);
      console.log(`  ✓ Successful: ${result.successful}`);
      console.log(`  ✗ Failed: ${result.failed}`);

      console.log('\n📋 Detailed Results:\n');
      for (const appResult of result.results) {
        const icon = appResult.success ? '✓' : '✗';
        const action = appResult.action.toUpperCase();

        console.log(`  ${icon} [${action}] ${appResult.slug}`);
        console.log(`     ${appResult.message}`);

        if (appResult.warnings && appResult.warnings.length > 0) {
          appResult.warnings.forEach((warning) => {
            console.log(`     ⚠ ${warning}`);
          });
        }

        if (appResult.errors && appResult.errors.length > 0) {
          appResult.errors.forEach((error) => {
            console.log(`     ✗ ${error}`);
          });
        }
        console.log('');
      }

      if (importOptions.dryRun) {
        console.log('⚠ This was a dry run. No changes were made.\n');
      }

      process.exit(result.failed > 0 ? 1 : 0);
    }

    // Import from file
    else if (command === 'file') {
      const file = positional[0];
      if (!file) {
        console.error('Error: Missing file argument');
        printUsage();
        process.exit(1);
      }

      console.log(`\n📦 Importing app from file: ${file}\n`);

      const content = await fs.readFile(file, 'utf-8');
      const manifest: AppManifest = JSON.parse(content);

      const importOptions: AppImportOptions = {
        updateExisting: flags.update !== false,
        autoPublish: flags.publish || flags.p || false,
        dryRun: flags['dry-run'] || flags.d || false,
        defaultOrganizationId: flags.organization || flags.o,
        defaultDeveloperId: flags.developer,
      };

      const result = await importService.importApp(manifest.app, importOptions);

      const icon = result.success ? '✓' : '✗';
      console.log(`${icon} ${result.message}\n`);

      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach((warning) => {
          console.log(`⚠ ${warning}`);
        });
      }

      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error) => {
          console.log(`✗ ${error}`);
        });
      }

      if (importOptions.dryRun) {
        console.log('\n⚠ This was a dry run. No changes were made.\n');
      }

      process.exit(result.success ? 0 : 1);
    }

    // Validate
    else if (command === 'validate') {
      const file = positional[0];
      if (!file) {
        console.error('Error: Missing file argument');
        printUsage();
        process.exit(1);
      }

      console.log(`\n🔍 Validating app definition: ${file}\n`);

      const content = await fs.readFile(file, 'utf-8');
      const manifest: AppManifest = JSON.parse(content);

      const validation = importService.validateApp(manifest.app);

      if (validation.valid) {
        console.log('✓ App definition is valid!\n');
        console.log('App Details:');
        console.log(`  Name: ${manifest.app.name}`);
        console.log(`  Slug: ${manifest.app.slug}`);
        console.log(`  Version: ${manifest.app.version}`);
        console.log(`  Category: ${manifest.app.category}`);
        console.log('');
        process.exit(0);
      } else {
        console.log('✗ App definition is invalid!\n');
        console.log('Validation Errors:');
        validation.errors.forEach((error) => {
          console.log(`  ✗ ${error}`);
        });
        console.log('');
        process.exit(1);
      }
    }

    // Export
    else if (command === 'export') {
      console.log('\n📤 Exporting apps...\n');

      let result;

      if (flags['app-id']) {
        const definition = await importService.exportApp(flags['app-id']);
        if (!definition) {
          console.error('✗ App not found');
          process.exit(1);
        }
        result = { app: definition };
      } else {
        const definitions = await importService.exportAllApps(flags.organization || flags.o);
        result = { apps: definitions };
      }

      const json = JSON.stringify(result, null, 2);

      if (flags.output || flags.f) {
        const outputFile = flags.output || flags.f;
        await fs.writeFile(outputFile, json, 'utf-8');
        console.log(`✓ Exported to ${outputFile}\n`);
      } else {
        console.log(json);
      }

      process.exit(0);
    }

    else {
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
    }
  } catch (error) {
    console.error('\n✗ Error:', error instanceof Error ? error.message : error);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
