const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const SRC_DIR = 'src';
const DEST_DIR = 'docs';
const extensionesMinificables = ['.html', '.css', '.js'];

/**
 * Limpia el directorio destino antes del build
 */
function limpiarDirectorio(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`🧹 Limpiado: ${dir}`);
  }
}

/**
 * Minifica contenido según la extensión
 */
async function minifyContent(content, ext) {
  if (ext === '.js') {
    const result = await minify(content, {
      compress: true,
      mangle: true,
      format: { comments: false },
    });
    return result.code;
  }

  if (ext === '.css') {
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\r?\n/g, '')
      .trim();
  }

  if (ext === '.html') {
    return content
      .replace(/<!--(?!<!)[^\[>][\s\S]*?-->/g, '')
      .replace(/\r/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }

  return content;
}

/**
 * Copia y minifica archivos de forma recursiva
 */
async function copiarYMinificar(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      await copiarYMinificar(srcPath, destPath);
    } else {
      const ext = path.extname(item);
      const content = fs.readFileSync(srcPath, 'utf-8');

      if (extensionesMinificables.includes(ext)) {
        const minified = await minifyContent(content, ext);
        fs.writeFileSync(destPath, minified, 'utf-8');
        console.log(`✅ Minificado: ${destPath}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copiado: ${destPath}`);
      }
    }
  }
}

function copiarArchivosRaiz() {
  const archivos = ['sitemap.xml', 'robots.txt'];
  archivos.forEach((archivo) => {
    const origen = path.join(__dirname, archivo);
    const destino = path.join(DEST_DIR, archivo);
    if (fs.existsSync(origen)) {
      fs.copyFileSync(origen, destino);
      console.log(`📄 Copiado: ${archivo} a docs/`);
    }
  });
}

// 🧹 Limpiar y ejecutar build
(async () => {
  limpiarDirectorio(DEST_DIR);
  await copiarYMinificar(SRC_DIR, DEST_DIR);
  copiarArchivosRaiz(); // ✅ Copiar sitemap y robots desde raíz
  fs.copyFileSync('.nojekyll', path.join(DEST_DIR, '.nojekyll'));
  console.log('🏁 Build completo.');
})();

