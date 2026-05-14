const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'apps'),
  path.join(__dirname, 'libraries'),
  path.join(__dirname, 'dynamicconfig'),
  path.join(__dirname, '.env.example')
];

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css', '.md', '.html', '.example'];

function walkAndReplace(dir) {
  if (!fs.existsSync(dir)) return;

  const stats = fs.statSync(dir);
  if (stats.isFile()) {
    processFile(dir);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (['node_modules', '.next', 'dist', 'build', '.git', '.pnpm-store'].includes(file)) {
      continue;
    }
    const filePath = path.join(dir, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isDirectory()) {
      walkAndReplace(filePath);
    } else {
      processFile(filePath);
    }
  }
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!extensions.includes(ext) && ext !== '') {
    return; // skip unsupported extensions
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/OminiFlow/g, 'FlowStack360');
  content = content.replace(/ominiflow/g, 'flowstack360');
  content = content.replace(/OMINIFLOW/g, 'FLOWSTACK360');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

for (const dir of targetDirs) {
  walkAndReplace(dir);
}

console.log('Rebranding complete.');
