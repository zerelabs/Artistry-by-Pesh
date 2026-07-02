import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = [
  './public/hero',
  './public/stopmotion',
  './public/images/gallery',
  './public/images/about'
];

async function optimizeImages() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')) {
        const filePath = path.join(dir, file);
        const tmpPath = filePath + '.tmp.webp';
        try {
          const metadata = await sharp(filePath).metadata();
          if (metadata.width > 1200) {
            console.log(`Resizing ${filePath} from ${metadata.width}x${metadata.height}...`);
            await sharp(filePath)
              .resize(1200, null, { withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(tmpPath);
            const newPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
            if (filePath !== newPath) {
                fs.renameSync(tmpPath, newPath);
                fs.unlinkSync(filePath); // delete original png
            } else {
                fs.renameSync(tmpPath, filePath);
            }
            console.log(`Successfully optimized ${filePath}`);
          }
        } catch (err) {
          console.error(`Error processing ${filePath}:`, err);
        }
      }
    }
  }
}

optimizeImages();
