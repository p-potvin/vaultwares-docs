import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translate } from '@vitalets/google-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await walkDir(filePath));
    } else if (filePath.endsWith('.mdx') && !filePath.endsWith('-QC.mdx')) {
      results.push(filePath);
    }
  }
  return results;
}

// naive regex to ignore frontmatter, maybe html tags
async function translateFile(filePath) {
  console.log(`Translating: ${filePath}`);
  const qcPath = filePath.replace('.mdx', '-QC.mdx');
  if (fs.existsSync(qcPath)) return; // skip if already exists

  let content = fs.readFileSync(filePath, 'utf-8');
  let translatedContent = '';

  const chunks = content.split('\n\n');
  for (let chunk of chunks) {
    if (chunk.startsWith('---') || chunk.startsWith('<') || chunk.startsWith('>') || chunk.trim().length === 0) {
      translatedContent += chunk + '\n\n';
      continue;
    }
    
    try {
      const res = await translate(chunk, { to: 'fr-CA' });
      translatedContent += res.text + '\n\n';
    } catch (e) {
      console.log('Error', e.message);
      translatedContent += chunk + '\n\n';
    }
    await new Promise(r => setTimeout(r, 200)); // rate limit protection
  }

  // Restore React component attributes that might have been poorly translated
  // (We're doing a naive chunk replace, so probably mostly text)
  fs.writeFileSync(qcPath, translatedContent.trim() + '\n');
}

async function run() {
  const docsDir = path.join(__dirname, 'docs-content');
  const files = await walkDir(docsDir);
  console.log(`Found ${files.length} files to translate`);
  for (const file of files) {
    await translateFile(file);
  }
}

run();
