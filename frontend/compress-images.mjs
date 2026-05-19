/**
 * compress-images.mjs
 * Compresses heavy images using Sharp for web-optimal delivery.
 * Run with: node compress-images.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';

const INPUT_DIR  = './public/images';
const OUTPUT_DIR = './public/images';

const targets = [
  { file: 'home_ms1.jpg',  quality: 80, width: 800 },
  { file: 'home_ms2.jpeg', quality: 82, width: 800 },
  { file: 'home_ms3.jpeg', quality: 82, width: 800 },
  { file: 'home_g1.jpg',   quality: 82, width: 1000 },
  { file: 'home_g2.jpg',   quality: 82, width: 1000 },
  { file: 'home_g3.jpg',   quality: 82, width: 1000 },
  { file: 'home_g4.jpg',   quality: 82, width: 1000 },
  { file: 'rectangle.png', quality: 85, width: 1400 },
];

async function compress() {
  for (const { file, quality, width } of targets) {
    const src  = join(INPUT_DIR, file);
    const dest = join(OUTPUT_DIR, file);
    const ext  = extname(file).toLowerCase();

    const before = statSync(src).size;

    const pipeline = sharp(src).resize({ width, withoutEnlargement: true });

    if (ext === '.png') {
      await pipeline.png({ quality, compressionLevel: 9 }).toBuffer()
        .then(buf => sharp(buf).toFile(dest));
    } else {
      await pipeline.jpeg({ quality, mozjpeg: true }).toFile(dest + '.tmp.jpg');
      // rename tmp back to original name
      const { renameSync } = await import('fs');
      renameSync(dest + '.tmp.jpg', dest);
    }

    const after = statSync(dest).size;
    const saved = (((before - after) / before) * 100).toFixed(1);
    console.log(`✅ ${file}: ${(before/1024/1024).toFixed(2)}MB → ${(after/1024/1024).toFixed(2)}MB  (${saved}% saved)`);
  }
  console.log('\n🎉 All images compressed!');
}

compress().catch(console.error);
