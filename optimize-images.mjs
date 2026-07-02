import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function findFiles(dir, exts) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(await findFiles(fullPath, exts));
    } else {
      if (exts.some(ext => file.name.toLowerCase().endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function optimizeImages() {
  const targetDir = path.resolve(process.cwd(), 'public');
  console.log(`Scanning ${targetDir} for images...`);
  
  const files = await findFiles(targetDir, ['.png', '.jpg', '.jpeg']);
  console.log(`Found ${files.length} images to optimize.`);
  
  let totalSaved = 0;
  
  for (const file of files) {
    try {
      const stats = await fs.stat(file);
      const originalSize = stats.size;
      
      const ext = path.extname(file).toLowerCase();
      const tmpFile = file + '.tmp' + ext;
      
      if (ext === '.png') {
        await sharp(file).png({ quality: 80, compressionLevel: 9 }).toFile(tmpFile);
      } else if (ext === '.jpg' || ext === '.jpeg') {
        await sharp(file).jpeg({ quality: 80, mozjpeg: true }).toFile(tmpFile);
      }
      
      const newStats = await fs.stat(tmpFile);
      
      if (newStats.size < originalSize) {
        await fs.rename(tmpFile, file);
        const saved = originalSize - newStats.size;
        totalSaved += saved;
        console.log(`Optimized ${path.basename(file)}: Saved ${(saved / 1024 / 1024).toFixed(2)} MB`);
      } else {
        await fs.unlink(tmpFile);
        console.log(`Skipped ${path.basename(file)}: Already optimal.`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
  
  console.log(`\nDone! Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
