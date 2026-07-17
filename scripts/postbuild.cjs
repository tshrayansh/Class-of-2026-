const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error("postbuild.js: dist/index.html not found!");
  process.exit(1);
}

const originalHtml = fs.readFileSync(indexPath, 'utf8');

// Rewrite relative script and asset links to step up one directory
let modifiedHtml = originalHtml
  .replace(/src="\.\/assets\//g, 'src="../assets/')
  .replace(/href="\.\/assets\//g, 'href="../assets/')
  .replace(/href="\.\/favicon\.svg/g, 'href="../favicon.svg')
  .replace(/href="\.\/characters\//g, 'href="../characters/');

const b21Dir = path.join(distPath, 'B21');
const mndlDir = path.join(distPath, 'MNDL');

if (!fs.existsSync(b21Dir)) fs.mkdirSync(b21Dir);
if (!fs.existsSync(mndlDir)) fs.mkdirSync(mndlDir);

fs.writeFileSync(path.join(b21Dir, 'index.html'), modifiedHtml);
fs.writeFileSync(path.join(mndlDir, 'index.html'), modifiedHtml);

// Also copy index.html to 404.html as a fallback
fs.writeFileSync(path.join(distPath, '404.html'), originalHtml);

console.log("postbuild.js: Created independent B21/ and MNDL/ directories and index.html copies successfully.");
