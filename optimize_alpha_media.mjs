import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = __dirname;

const targetImages = [
  'public/images/about/Pesh.png',
  'public/images/about/pesh-profile.png'
];

async function optimizeImages() {
  for (const relPath of targetImages) {
    const fullPath = path.join(PROJECT_ROOT, relPath);
    const dir = path.dirname(fullPath);
    const ext = path.extname(fullPath);
    const baseName = path.basename(fullPath, ext);
    const outputPath = path.join(dir, `${baseName}_optimized.webp`);

    console.log(`Optimizing ${baseName}${ext} ...`);
    
    try {
      await sharp(fullPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80, alphaQuality: 80, lossless: false })
        .toFile(outputPath);
        
      console.log(`✅ Created ${baseName}_optimized.webp`);
    } catch (err) {
      console.error(`❌ Failed to optimize ${fullPath}:`, err);
    }
  }
}

optimizeImages();
