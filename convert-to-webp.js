const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const jobs = [
  {
    dir: 'Render Fondo Final',
    ext: '.jpg',
    options: { quality: 75 },
  },
  {
    dir: 'Fondo Proyectos',
    ext: '.jpg',
    options: { quality: 75 },
  },
  {
    dir: 'Render 3',
    ext: '.png',
    options: { quality: 80, lossless: false, alphaQuality: 90 },
  },
  {
    dir: 'Render 3_responsive',
    ext: '.png',
    options: { quality: 80, lossless: false, alphaQuality: 90 },
  },
  {
    dir: 'Render Banner Motion-UX&UI',
    ext: '.png',
    options: { quality: 80 },
  },
  {
    dir: 'Render Naranja_Izquierda',
    ext: '.png',
    options: { quality: 80, lossless: false, alphaQuality: 90 },
  },
  {
    dir: 'Render Naranja_Derecha',
    ext: '.png',
    options: { quality: 80, lossless: false, alphaQuality: 90 },
  },
];

const ramaFile = {
  dir: 'Render Rama',
  file: 'Render Rama000.png',
  options: { quality: 80, lossless: false, alphaQuality: 90 },
};

async function convertFile(srcPath, destPath, options) {
  await sharp(srcPath).webp(options).toFile(destPath);
}

async function convertDir(job) {
  const dirPath = path.join(__dirname, job.dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`SKIP (missing folder): ${job.dir}`);
    return { converted: 0, skipped: 0 };
  }

  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith(job.ext));
  let converted = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath  = path.join(dirPath, file);
    const destName = file.slice(0, -job.ext.length) + '.webp';
    const destPath = path.join(dirPath, destName);

    try {
      await convertFile(srcPath, destPath, job.options);
      converted++;
    } catch (err) {
      skipped++;
      console.error(`  ERROR converting ${job.dir}/${file}: ${err.message}`);
    }
  }

  console.log(`${job.dir}: converted ${converted}/${files.length} files`);
  return { converted, skipped };
}

async function main() {
  let totalConverted = 0;

  for (const job of jobs) {
    const result = await convertDir(job);
    totalConverted += result.converted;
  }

  // Single file: Render Rama/Render Rama000.png
  const ramaDir  = path.join(__dirname, ramaFile.dir);
  const ramaSrc  = path.join(ramaDir, ramaFile.file);
  if (fs.existsSync(ramaSrc)) {
    const ramaDest = path.join(ramaDir, ramaFile.file.replace(/\.png$/i, '.webp'));
    try {
      await convertFile(ramaSrc, ramaDest, ramaFile.options);
      totalConverted++;
      console.log(`${ramaFile.dir}/${ramaFile.file}: converted`);
    } catch (err) {
      console.error(`  ERROR converting ${ramaFile.dir}/${ramaFile.file}: ${err.message}`);
    }
  } else {
    console.log(`SKIP (missing file): ${ramaFile.dir}/${ramaFile.file}`);
  }

  console.log(`\nDone. Total files converted: ${totalConverted}`);
}

main();
