import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR  = 'Naranja Proyectos';
const OUTPUT_DIR = 'Naranja Proyectos/webp';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs.readdirSync(INPUT_DIR)
  .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
  .sort();

console.log(`Converting ${files.length} frames...`);

for (const file of files) {
  const input  = path.join(INPUT_DIR, file);
  const output = path.join(OUTPUT_DIR, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
  await sharp(input)
    .resize({ width: 960 }) // source is 3840x2160; 960px is plenty for on-screen display
    .webp({ quality: 75, effort: 5 })
    .toFile(output);
  process.stdout.write('.');
}
console.log(`\nDone. WebP frames saved to ${OUTPUT_DIR}`);
