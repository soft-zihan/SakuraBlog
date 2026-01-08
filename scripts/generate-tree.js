
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const rawDir = path.join(publicDir, 'raw'); // New directory for raw code files
const outputFile = path.join(publicDir, 'files.json'); 
const notesDir = path.join(rootDir, 'notes');

console.log("🌸 Sakura Notes: Generating File Tree...");

// Ensure directories exist
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (fs.existsSync(rawDir)) fs.rmSync(rawDir, { recursive: true, force: true });
fs.mkdirSync(rawDir, { recursive: true });

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
          isSource: isCode
        });
      }
    }
  }
  
  return result;
}

// 1. Scan Notes
const notesTree = scanDirectory(notesDir, '', false);

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
