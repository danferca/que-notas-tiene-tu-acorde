const fs = require('fs');
const path = require('path');

/**
 * Minifica contenido de archivo según su extensión
 * - Elimina comentarios y espacios innecesarios
 * - Trata el HTML con cuidado para no romper etiquetas
 */
function minifyContent(content, ext) {
  let result = content;

  if (ext === '.js' || ext === '.css') {
    result = result
      .replace(/\/\/[^\n\r]*/g, '')            // Comentarios de línea
      .replace(/\/\*[\s\S]*?\*\//g, '')        // Comentarios multilínea
      .replace(/\s{2,}/g, ' ')                 // Espacios múltiples
      .replace(/\r?\n/g, '')                   // Quitar saltos de línea
      .trim();
  }

  if (ext === '.html') {
    result = result
      .replace(/<!--(?!<!)[^\[>][\s\S]*?-->/g, '')  // Comentarios HTML seguros
      .replace(/\r/g, '')                           // Quitar retornos de carro
      .replace(/\n{2,}/g, '\n')                     // Evitar líneas vacías múltiples
      .trim();
  }

  return result;
}

/**
 * Copia y minifica archivos de forma recursiva
 */
function copiarYMinificar(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      copiarYMinificar(srcPath, destPath);
    } else {
      const ext = path.extname(item);
      const content = fs.readFileSync(srcPath, 'utf-8');

      if (['.html', '.css', '.js'].includes(ext)) {
        const minified = minifyContent(content, ext);
        const finalContent = `\n${minified}`;
        fs.writeFileSync(destPath, finalContent, 'utf-8');
        console.log(`✅ Minificado: ${destPath}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copiado: ${destPath}`);
      }
    }
  }
}

// Ejecutar la función desde 'src/' hacia 'dist/'
copiarYMinificar('src', 'docs');