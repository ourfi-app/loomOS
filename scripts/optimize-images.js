const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'public/backgrounds/desktop-bkgrd-goldwave.jpg',
  'public/backgrounds/desktop-bkgrd-tealmtn.jpg',
  'public/montrecott-building.jpg',
  'public/montrecott-watercolor.jpg',
];

async function optimizeImages() {
  console.log('Starting image optimization...\n');

  for (const imagePath of images) {
    const fullPath = path.join(__dirname, '..', imagePath);
    const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    try {
      // Get original file size
      const originalStats = fs.statSync(fullPath);
      const originalSizeKB = (originalStats.size / 1024).toFixed(2);

      // Convert to WebP
      await sharp(fullPath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      // Get new file size
      const newStats = fs.statSync(outputPath);
      const newSizeKB = (newStats.size / 1024).toFixed(2);
      const savings = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);

      console.log(`✓ ${path.basename(imagePath)}`);
      console.log(`  Original: ${originalSizeKB} KB`);
      console.log(`  WebP: ${newSizeKB} KB`);
      console.log(`  Savings: ${savings}%\n`);
    } catch (error) {
      console.error(`✗ Failed to process ${imagePath}:`, error.message);
    }
  }

  console.log('Image optimization complete!');
}

optimizeImages().catch(console.error);
