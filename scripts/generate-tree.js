import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const outputFile = path.join(publicDir, 'files.json'); 

// Directories to scan at the project root
const SCAN_ROOTS = ['notes', 'VUE学习笔记'];

console.log("🌸 Scanning directories:", SCAN_ROOTS);

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Helper to recursively scan directory
function scanDirectory(dirPath, relativePath) {
  if (!fs.existsSync(dirPath)) return [];
  
  const items = fs.readdirSync(dirPath);
  const result = [];

  for (const item of items) {
    if (item.startsWith('.')) continue; // skip hidden files

    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    // Ensure forward slashes for web compatibility
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      const children = scanDirectory(fullPath, itemRelativePath);
      // Only add directories if they have content or are specific folders
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'directory',
        children: children
      });
    } else if (item.endsWith('.md')) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'file',
        lastModified: stat.mtime.toISOString()
      });
    }
  }
  return result;
}

// Generate structure
try {
  const fileTree = [];

  SCAN_ROOTS.forEach(folderName => {
    const folderPath = path.join(rootDir, folderName);
    if (fs.existsSync(folderPath)) {
      fileTree.push({
        name: folderName,
        path: folderName,
        type: 'directory',
        children: scanDirectory(folderPath, folderName)
      });
    } else {
      console.warn(`⚠️ Warning: Folder '${folderName}' not found at root.`);
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(fileTree, null, 2));
  console.log('✅ Successfully generated public/files.json (Metadata only)');
} catch (error) {
  console.error('❌ Error generating tree:', error);
  process.exit(1);
}