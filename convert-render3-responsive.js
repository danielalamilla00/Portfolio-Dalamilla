const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const folder = 'Render 3_responsive';
const files = fs.readdirSync(folder).filter(f => f.endsWith('.png'));

async function main() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const input = path.join(folder, file);
    const output = path.join(folder, file.replace('.png', '.webp'));
    await sharp(input)
      .webp({ quality: 80, alphaQuality: 90, lossless: false })
      .toFile(output);

    if (i < 3) {
      const beforeSize = fs.statSync(input).size;
      const afterSize  = fs.statSync(output).size;
      console.log(`Converted: ${output}  (before: ${(beforeSize/1024).toFixed(1)} KB, after: ${(afterSize/1024).toFixed(1)} KB)`);
    } else {
      console.log('Converted:', output);
    }
  }
  console.log('Done. Total files converted:', files.length);
}

main();
