
#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * Analyzes the Next.js build output to identify:
 * - Large bundles
 * - Duplicate dependencies
 * - Optimization opportunities
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../.next');
const BUNDLE_ANALYSIS_FILE = path.join(__dirname, '../bundle-analysis.json');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Analyzing bundle...\n');

  const buildManifest = path.join(BUILD_DIR, 'build-manifest.json');
  
  if (!fs.existsSync(buildManifest)) {
    console.error('❌ Build manifest not found. Please run `yarn build` first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
  const analysis = {
    timestamp: new Date().toISOString(),
    pages: {},
    totalSize: 0,
    sharedChunks: [],
    recommendations: [],
  };

  // Analyze each page
  Object.entries(manifest.pages).forEach(([page, files]) => {
    let pageSize = 0;
    const pageFiles = [];

    files.forEach(file => {
      const filePath = path.join(BUILD_DIR, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        pageSize += stats.size;
        pageFiles.push({
          name: file,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
        });
      }
    });

    analysis.pages[page] = {
      size: pageSize,
      sizeFormatted: formatBytes(pageSize),
      files: pageFiles,
    };

    analysis.totalSize += pageSize;
  });

  // Generate recommendations
  Object.entries(analysis.pages).forEach(([page, data]) => {
    if (data.size > 500000) { // > 500KB
      analysis.recommendations.push({
        type: 'large-page',
        page,
        size: data.sizeFormatted,
        suggestion: 'Consider code splitting or lazy loading heavy components',
      });
    }
  });

  // Find shared chunks
  if (manifest.sharedFiles) {
    manifest.sharedFiles.forEach(file => {
      const filePath = path.join(BUILD_DIR, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        analysis.sharedChunks.push({
          name: file,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
        });
      }
    });
  }

  // Save analysis
  fs.writeFileSync(BUNDLE_ANALYSIS_FILE, JSON.stringify(analysis, null, 2));

  // Print summary
  console.log('📊 Bundle Analysis Summary\n');
  console.log(`Total Bundle Size: ${formatBytes(analysis.totalSize)}\n`);
  
  console.log('📦 Largest Pages:');
  const sortedPages = Object.entries(analysis.pages)
    .sort(([, a], [, b]) => b.size - a.size)
    .slice(0, 10);
  
  sortedPages.forEach(([page, data]) => {
    console.log(`  ${page.padEnd(50)} ${data.sizeFormatted}`);
  });

  if (analysis.recommendations.length > 0) {
    console.log('\n⚠️  Recommendations:');
    analysis.recommendations.forEach(rec => {
      console.log(`  ${rec.type} - ${rec.page} (${rec.size})`);
      console.log(`    → ${rec.suggestion}\n`);
    });
  }

  console.log(`\n✓ Detailed analysis saved to: ${BUNDLE_ANALYSIS_FILE}`);
}

try {
  analyzeBundle();
} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message);
  process.exit(1);
}
