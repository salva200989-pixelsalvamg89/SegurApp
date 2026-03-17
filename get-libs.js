/**
 * SegurApp - Descarga las librerías externas para uso offline
 * Ejecuta: node get-libs.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'lib');
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir);

const libs = [
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js',
    file: 'tesseract.min.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    file: 'jspdf.umd.min.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    file: 'html2canvas.min.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js',
    file: 'JsBarcode.all.min.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    file: 'pdf.min.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    file: 'pdf.worker.min.js'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = (fs.statSync(dest).size / 1024).toFixed(0);
        console.log(`✅ ${path.basename(dest)} (${size} KB)`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('📦 Descargando librerías para uso offline...\n');
  for (const lib of libs) {
    const dest = path.join(libDir, lib.file);
    if (fs.existsSync(dest)) {
      const size = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(`⏭️  ${lib.file} ya existe (${size} KB)`);
    } else {
      process.stdout.write(`⬇️  Descargando ${lib.file}...`);
      try {
        await download(lib.url, dest);
      } catch(e) {
        console.log(`\n❌ Error: ${e.message}`);
      }
    }
  }
  console.log('\n✅ ¡Librerías listas! Ahora ejecuta: npm install && npx cap add android && npx cap sync');
}

main();
