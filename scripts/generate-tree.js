
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const rawDir = path.join(publicDir, 'raw'); // New directory for raw code files
const outputFile = path.join(publicDir, 'files.json'); 
const notesDir = path.join(rootDir, 'notes');
const publicNotesDir = path.join(publicDir, 'notes');

console.log("🌸 Sakura Notes: Generating File Tree...");

// Ensure directories exist
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (fs.existsSync(rawDir)) fs.rmSync(rawDir, { recursive: true, force: true });
fs.mkdirSync(rawDir, { recursive: true });
// Ensure public/notes exists and is cleanly recreated for static serving
if (fs.existsSync(publicNotesDir)) fs.rmSync(publicNotesDir, { recursive: true, force: true });
fs.mkdirSync(publicNotesDir, { recursive: true });

// Helper to recursively scan directory
function scanDirectory(basePath, relativePath, isSourceCode = false) {
  if (!fs.existsSync(basePath)) return [];
  
  const items = fs.readdirSync(basePath);
  const result = [];

  for (const item of items) {
    if (item.startsWith('.') || item === 'node_modules' || item === 'dist' || item === 'public' || item === 'assets') continue;

    const fullPath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    // Normalize path for web (forward slashes)
    let itemRelativePath = relativePath ? path.join(relativePath, item) : item;
    itemRelativePath = itemRelativePath.split(path.sep).join('/');

    if (stat.isDirectory()) {
      const children = scanDirectory(fullPath, itemRelativePath, isSourceCode);
      if (children.length > 0) {
        result.push({
          name: item,
          path: itemRelativePath,
          type: 'directory',
          children: children
        });
      }
    } else {
      // Filter for Notes or Source Code
      const isMd = item.endsWith('.md');
      const isCode = isSourceCode && (item.endsWith('.vue') || item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.json') || item.endsWith('.html'));

      if (isMd || isCode) {
        // Read content once to compute stats and provide a lightweight snippet for search/metadata
        let content = '';
        try {
          content = fs.readFileSync(fullPath, 'utf-8');
        } catch (err) {
          console.warn(`⚠️  Failed to read file ${fullPath}:`, err);
        }

        const lines = content ? content.split(/\r?\n/) : [];
        // Count Chinese characters + English words for a better approximation of word count
        const chineseChars = content ? (content.match(/[\u4e00-\u9fa5]/g) || []).length : 0;
        const englishWords = content ? (content.match(/[a-zA-Z]+/g) || []).length : 0;
        const wordCount = chineseChars + englishWords;
        const lineCount = lines.length || undefined;
        // Keep snippet small to avoid bloating files.json while still enabling content search
        const contentSnippet = content ? content.slice(0, 1200) : '';

        // For source code, we copy it to public/raw with .txt extension to ensure fetchability on GitHub Pages
        let fetchPath = itemRelativePath;
        if (isCode) {
            const rawFileName = itemRelativePath.replace(/\//g, '_') + '.txt';
            const rawDestPath = path.join(rawDir, rawFileName);
            fs.copyFileSync(fullPath, rawDestPath);
            fetchPath = `raw/${rawFileName}`; // The frontend will fetch this
        }

        result.push({
          name: item,
          path: itemRelativePath, // Logical path for UI
          fetchPath: fetchPath,   // Actual path to fetch content
          type: 'file',
          lastModified: stat.mtime,
          isSource: isCode,
          wordCount: isMd ? wordCount : undefined,
          lineCount: isMd ? lineCount : undefined,
          contentSnippet: isMd ? contentSnippet : undefined
        });
      }
    }
  }
  
  return result;
}

// 1. Scan Notes
const notesTree = scanDirectory(notesDir, '', false);

// 1.1 Copy notes (.md) into public/notes preserving structure for static fetch
function copyNotesToPublic(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'public' || entry.name === 'assets') continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyNotesToPublic(srcPath, destPath);
    } else {
      if (entry.name.endsWith('.md')) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

copyNotesToPublic(notesDir, publicNotesDir);

// 2. Scan Source Code (Specific Folders/Files)
const sourceTree = [];
// Scan Components
const componentsNodes = scanDirectory(path.join(rootDir, 'components'), 'components', true);
if (componentsNodes.length > 0) sourceTree.push(...componentsNodes);
// Scan Root Files (App.vue, index.html, etc manually picked or scanned)
const rootFilesToScan = ['App.vue', 'index.html', 'index.tsx', 'vite.config.ts', 'tailwind.config.js'];
rootFilesToScan.forEach(file => {
    const fullPath = path.join(rootDir, file);
    if(fs.existsSync(fullPath)) {
        const rawFileName = file.replace(/\//g, '_') + '.txt';
        const rawDestPath = path.join(rawDir, rawFileName);
        fs.copyFileSync(fullPath, rawDestPath);
        
        sourceTree.push({
            name: file,
            path: file,
            fetchPath: `raw/${rawFileName}`,
            type: 'file',
            lastModified: fs.statSync(fullPath).mtime,
            isSource: true
        });
    }
});

// Combine trees
// We put source code in a virtual folder
const finalTree = [
    ...notesTree,
    {
        name: 'Project Source Code',
        path: 'source-code',
        type: 'directory',
        children: sourceTree
    }
];

fs.writeFileSync(outputFile, JSON.stringify(finalTree, null, 2));
console.log(`✨ File tree generated at ${outputFile}`);
console.log(`✨ Source code copied to ${rawDir} for static serving.`);
