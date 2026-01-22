
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

// 获取文件的 Git 最后提交时间（解决 CI 环境中文件时间戳问题）
function getGitLastModified(filePath) {
  try {
    // 获取文件相对于仓库根目录的路径
    const relativePath = path.relative(rootDir, filePath);
    // 使用 git log 获取最后一次提交时间
    const result = execSync(
      `git log -1 --format="%aI" -- "${relativePath}"`,
      { cwd: rootDir, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    
    if (result) {
      return new Date(result).toISOString();
    }
  } catch (e) {
    // Git 不可用或文件未被跟踪，使用文件系统时间
  }
  
  // 回退到文件系统时间
  try {
    const stat = fs.statSync(filePath);
    return stat.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

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
      const isPdf = item.endsWith('.pdf');
      const isCode = isSourceCode && (item.endsWith('.vue') || item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.json') || item.endsWith('.html'));

      if (isMd || isPdf || isCode) {
        // Read content only for markdown to compute stats and provide snippet
        let content = '';
        if (isMd) {
          try {
            content = fs.readFileSync(fullPath, 'utf-8');
          } catch (err) {
            console.warn(`⚠️  Failed to read file ${fullPath}:`, err);
          }
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
          lastModified: getGitLastModified(fullPath),
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

// 2. Scan Source Code (Specific Folders/Files)
const sourceTree = [];
// Scan Components
const componentsNodes = scanDirectory(path.join(rootDir, 'src', 'components'), 'src/components', true);
if (componentsNodes.length > 0) sourceTree.push(...componentsNodes);
// Scan Root Files (App.vue, index.html, etc manually picked or scanned)
const rootFilesToScan = ['src/App.vue', 'src/index.html', 'src/main.ts', 'vite.config.ts', 'package.json', 'tsconfig.json'];
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
            lastModified: getGitLastModified(fullPath),
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
