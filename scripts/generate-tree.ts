
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(publicDir, 'data');
const rawDir = path.join(publicDir, 'raw'); // New directory for raw code files
const publicNotesDir = path.join(publicDir, 'notes'); // Target directory for notes in public
const outputFile = path.join(dataDir, 'files.json'); 
const notesDir = path.join(rootDir, 'notes');

console.log("🌸 Sakura Notes: Generating File Tree...");

// Ensure directories exist
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (fs.existsSync(rawDir)) fs.rmSync(rawDir, { recursive: true, force: true });
fs.mkdirSync(rawDir, { recursive: true });

// Copy notes to public/notes to make them accessible via fetch

const cleanupDir = (dir: string) => {
    if (fs.existsSync(dir)) {
        try {
            fs.rmSync(dir, { recursive: true, force: true });
        } catch (e: any) {
            console.warn(`⚠️ Failed to clean ${dir}: ${e.message}. Retrying in 1s...`);
            // Simple synchronous delay retry
            const start = Date.now();
            while (Date.now() - start < 1000) {} 
            try {
                fs.rmSync(dir, { recursive: true, force: true });
            } catch (retryErr) {
                 console.error(`❌ Could not clean ${dir}. Proceeding anyway (files might be stale).`);
            }
        }
    }
};

cleanupDir(publicNotesDir);

// Use cpSync for recursive copy (Node 16.7+)
if (fs.existsSync(notesDir)) {
    console.log(`📦 Copying notes to ${publicNotesDir}...`);
    try {
        fs.cpSync(notesDir, publicNotesDir, { recursive: true });
    } catch (e: any) {
        console.error(`❌ Error copying notes: ${e.message}`);
    }
} else {
    console.warn(`⚠️ Notes directory not found at ${notesDir}`);
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  fetchPath?: string;
  children?: FileNode[];
  lastModified?: string;
  isSource?: boolean;
  wordCount?: number;
  lineCount?: number;
  contentSnippet?: string;
}

// 获取文件的 Git 最后提交时间（解决 CI 环境中文件时间戳问题）
function getGitLastModified(filePath: string): string {
  if (process.env.SKIP_GIT_LOG) {
      try {
        const stat = fs.statSync(filePath);
        return stat.mtime.toISOString();
      } catch {
        return new Date().toISOString();
      }
  }

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
function scanDirectory(basePath: string, relativePath: string, isSourceCode = false): FileNode[] {
  if (!fs.existsSync(basePath)) return [];
  
  const items = fs.readdirSync(basePath);
  const result: FileNode[] = [];

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
const sourceTree: FileNode[] = [];

// Scan Root Files (Dynamic)
const rootItems = fs.readdirSync(rootDir);
for (const item of rootItems) {
    const fullPath = path.join(rootDir, item);
    const stat = fs.statSync(fullPath);

    // Ignore directories and specific files
    if (stat.isDirectory()) continue; // We only want files in root (folders like src/notes are handled separately)
    
    // Ignore specific files
    if (item === 'files.json' || item.endsWith('.log') || item.endsWith('.lock')) continue;
    
    // Allowed extensions or specific files
     const isConfig = item.endsWith('.json') || item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.html');
     const isDoc = item.endsWith('.md');
     const isDotFile = item.startsWith('.'); // .gitignore, .env, etc.
     
     if (isConfig || isDoc || isDotFile) {
          console.log(`+ Adding root file: ${item}`);
          const rawFileName = item.replace(/\//g, '_') + '.txt';
         const rawDestPath = path.join(rawDir, rawFileName);
         fs.copyFileSync(fullPath, rawDestPath);
         
         sourceTree.push({
             name: item,
             path: item,
             fetchPath: `raw/${rawFileName}`,
             type: 'file',
             lastModified: getGitLastModified(fullPath),
             isSource: true
         });
    }
}

// Scan src folder
const srcTree = scanDirectory(path.join(rootDir, 'src'), 'src', true);
if (srcTree.length > 0) {
    // Add src directory as a node instead of flattening it
    sourceTree.push({
        name: 'src',
        path: 'src',
        type: 'directory',
        children: srcTree
    });
}

// Scan scripts folder
const scriptsTree = scanDirectory(path.join(rootDir, 'scripts'), 'scripts', true);
if (scriptsTree.length > 0) {
    sourceTree.push({
        name: 'scripts',
        path: 'scripts',
        type: 'directory',
        children: scriptsTree
    });
}

// 3. Combine Trees
// "zh" and "en" from notes are root nodes. "Project Source Code" is a root node.
const combinedTree: FileNode[] = [...notesTree, {
    name: 'Project Source Code', // Renamed for clarity
    path: 'source',
    type: 'directory',
    children: sourceTree
}];

// Write output
fs.writeFileSync(outputFile, JSON.stringify(combinedTree, null, 2), 'utf-8');
console.log(`✅ File tree generated at ${outputFile}`);
