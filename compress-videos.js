const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirs = [
  'Video Carrousel',
  'proyectos/Caprabo/Ventilador',
  'proyectos/Fallas/Styleframes',
  'proyectos/Sitges/Rigging',
  'proyectos/Sitges/Styleframes',
  'proyectos/Sensory/Animaciones',
  'proyectos/Sensory/Pantallas',
  'proyectos/ISE/Styleframes',
];

dirs.forEach(dir => {
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));
    files.forEach(file => {
      const input = path.join(dir, file);
      const temp = path.join(dir, '_compressed_' + file);
      const before = (fs.statSync(input).size / 1024 / 1024).toFixed(1);
      execSync(`ffmpeg -i "${input}" -vcodec libx264 -crf 28 -vf "scale='min(1280,iw)':-2" -an -movflags +faststart "${temp}" -y`, { stdio: 'inherit' });
      const after = (fs.statSync(temp).size / 1024 / 1024).toFixed(1);
      fs.renameSync(temp, input);
      console.log(`✅ ${input}: ${before}MB → ${after}MB`);
    });
  } catch(e) { console.error('Error in', dir, e.message); }
});
