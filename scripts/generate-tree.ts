
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/common';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(publicDir, 'data');
const rawDir = path.join(publicDir, 'raw'); // New directory for raw code files
const renderedDir = path.join(publicDir, 'rendered');
const publicNotesDir = path.join(publicDir, 'notes'); // Target directory for notes in public
const outputFile = path.join(dataDir, 'files.json'); 
const notesDir = path.join(rootDir, 'notes');

console.log("🌸 Sakura Notes: Generating File Tree...");

// Ensure directories exist
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (fs.existsSync(rawDir)) fs.rmSync(rawDir, { recursive: true, force: true });
fs.mkdirSync(rawDir, { recursive: true });
if (fs.existsSync(renderedDir)) fs.rmSync(renderedDir, { recursive: true, force: true });
fs.mkdirSync(renderedDir, { recursive: true });

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
  renderPath?: string;
  renderVersion?: number;
  children?: FileNode[];
  lastModified?: string;
  isSource?: boolean;
  wordCount?: number;
  lineCount?: number;
  contentSnippet?: string;
  excerpt?: string;
  toc?: TocItem[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
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

const stripLeadingMeta = (content: string) => {
  let next = content || ''
  next = next.replace(/^\s*<!--[\s\S]*?-->\s*/, '')
  next = next.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
  return next
}

const getLeadingMetaBlock = (content: string) => {
  const raw = content || ''
  const commentMatch = raw.match(/^\s*<!--[\s\S]*?-->\s*/)
  if (commentMatch?.[0]) return commentMatch[0]
  const fmMatch = raw.match(/^---\s*\n[\s\S]*?\n---\s*\n?/)
  if (fmMatch?.[0]) return fmMatch[0]
  return ''
}

const normalizeHeadingText = (input: string) => {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/[`*_]+/g, '')
}

const slugifyHeading = (input: string) => {
  const text = normalizeHeadingText(input).toLowerCase().trim()
  const slug = text
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

const splitPathSuffix = (input: string) => {
  const trimmed = (input || '').trim()
  const hashIndex = trimmed.indexOf('#')
  const queryIndex = trimmed.indexOf('?')
  const cutIndex = [hashIndex, queryIndex].filter(i => i >= 0).sort((a, b) => a - b)[0]
  if (cutIndex === undefined) return { base: trimmed, suffix: '' }
  return { base: trimmed.slice(0, cutIndex), suffix: trimmed.slice(cutIndex) }
}

const isPdfPath = (href?: string | null) => {
  if (!href) return false
  const { base } = splitPathSuffix(href)
  return base.toLowerCase().endsWith('.pdf')
}

const isSupportedInternalLink = (raw?: string | null) => {
  if (!raw) return false
  if (raw.startsWith('http') || raw.startsWith('//')) return false
  if (raw.startsWith('lab:')) return true
  if (raw.startsWith('code://')) return true
  const { base } = splitPathSuffix(raw)
  if (!base || base.startsWith('#')) return false
  const lower = base.toLowerCase()
  return ['.md', '.pdf', '.vue', '.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.scss'].some(ext => lower.endsWith(ext))
}

const resolveContentPathForNotes = (currentFilePath: string, relPath: string) => {
  const raw = (relPath || '').trim()
  if (!raw) return relPath
  const { base, suffix } = splitPathSuffix(raw)
  if (!base) return relPath
  if (base.startsWith('http') || base.startsWith('//') || base.startsWith('data:') || base.startsWith('blob:')) return relPath
  if (base.includes('githubusercontent.com') || base.includes('github.com')) return relPath

  if (base.startsWith('/notes/')) return `${base.replace(/^\/+/, '')}${suffix}`
  if (base.startsWith('notes/')) return `${base}${suffix}`
  if (base.startsWith('/')) return `${base.replace(/^\/+/, '')}${suffix}`

  const parent = path.posix.dirname(currentFilePath)
  const resolved = path.posix.normalize(path.posix.join(parent, base)).replace(/^(\.\/)+/, '')
  return `notes/${resolved}${suffix}`
}

const renderPdfEmbed = (href: string, label?: string, title?: string) => {
  const display = (label || '').trim() || 'PDF'
  const iframeTitle = (title || display || 'PDF').replace(/"/g, '&quot;')
  const iframeSrc = href.includes('#')
    ? (href.includes('view=') ? href : `${href}&view=FitH`)
    : `${href}#view=FitH`

  return `
<div class="pdf-embed-wrapper">
  <div class="pdf-embed-toolbar">
    <span class="pdf-embed-title">📄 ${display}</span>
    <span class="pdf-embed-actions">
      <a href="${href}" target="_blank" rel="noopener noreferrer">打开</a>
      <a href="${href}" download>下载</a>
    </span>
  </div>
  <iframe class="pdf-embed" src="${iframeSrc}" title="${iframeTitle}" loading="lazy"></iframe>
</div>
  `.trim()
}

const renderMarkdownToHtmlWithToc = (currentFilePath: string, content: string): { html: string; toc: TocItem[] } => {
  let headingIdCount = new Map<string, number>()
  const nextUniqueHeadingId = (raw: string) => {
    const base = slugifyHeading(raw)
    const current = headingIdCount.get(base) ?? 0
    const next = current + 1
    headingIdCount.set(base, next)
    return next === 1 ? base : `${base}-${next}`
  }

  const splitImageToken = (raw: string) => {
    let cleaned = raw.trim()
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      cleaned = cleaned.slice(1, -1)
    }
    const [pathPart, ...rest] = cleaned.split(/\s+/)
    return { path: pathPart, tail: rest.join(' ') }
  }

  let rawContent = stripLeadingMeta(content)

  rawContent = rawContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, raw) => {
    const { path: p, tail } = splitImageToken(raw)
    const resolved = resolveContentPathForNotes(currentFilePath, p)
    const finalToken = tail ? `${resolved} ${tail}` : resolved
    return `![${alt}](${finalToken})`
  })

  rawContent = rawContent.replace(/src="([^"]+)"/g, (match, src) => {
    const { path: p, tail } = splitImageToken(src)
    const resolved = resolveContentPathForNotes(currentFilePath, p)
    const finalToken = tail ? `${resolved} ${tail}` : resolved
    return `src="${finalToken}"`
  })

  const toc: TocItem[] = []
  const renderer = new marked.Renderer()
  renderer.heading = function (text, level, raw) {
    const id = nextUniqueHeadingId(String(raw ?? text))
    toc.push({ id, text: normalizeHeadingText(String(text)).trim(), level })
    return `<h${level} id="${id}">${text}</h${level}>`
  }
  renderer.code = function (code, language) {
    const lang = (language && hljs.getLanguage(language)) ? language : 'plaintext'
    const highlighted = hljs.highlight(code, { language: lang }).value
    return `<pre class="hljs"><code class="hljs language-${lang}">${highlighted}</code></pre>`
  }
  renderer.image = function (href, title, text) {
    if (href && isPdfPath(href)) {
      const resolved = resolveContentPathForNotes(currentFilePath, href)
      return renderPdfEmbed(resolved, text, title || text)
    }
    const titleAttr = title ? ` title="${title}"` : ''
    const safeHref = href ? resolveContentPathForNotes(currentFilePath, href) : ''
    return `<img src="${safeHref}" alt="${text}"${titleAttr}>`
  }
  renderer.link = function (href, title, text) {
    const titleAttr = title ? ` title="${title}"` : ''
    if (href && isPdfPath(href)) {
      const resolved = resolveContentPathForNotes(currentFilePath, href)
      return renderPdfEmbed(resolved, text, title || text)
    }
    if (isSupportedInternalLink(href)) {
      const safe = href || ''
      return `<a href="javascript:void(0)" data-internal-href="${safe}"${titleAttr}>${text}</a>`
    }
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
  }
  marked.use({ renderer })

  const parsed = marked.parse(rawContent)
  return { html: typeof parsed === 'string' ? parsed : '', toc }
}

const extractTocFromMarkdown = (content: string): TocItem[] => {
  const raw = stripLeadingMeta(content)
  const lines = raw.split(/\r?\n/)
  const toc: TocItem[] = []
  const headingIdCount = new Map<string, number>()
  const nextUniqueHeadingId = (headingRaw: string) => {
    const base = slugifyHeading(headingRaw)
    const current = headingIdCount.get(base) ?? 0
    const next = current + 1
    headingIdCount.set(base, next)
    return next === 1 ? base : `${base}-${next}`
  }

  let inCodeBlock = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || ''
    const trimmed = line.trim()
    if (/^```|^~~~/.test(trimmed)) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue
    const atx = trimmed.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (atx) {
      const level = atx[1].length
      const text = atx[2]
      const id = nextUniqueHeadingId(text)
      toc.push({ id, text: normalizeHeadingText(text).trim(), level })
      if (toc.length >= 240) break
      continue
    }
    const next = (lines[i + 1] || '').trim()
    if (next && /^(=+|-+)\s*$/.test(next) && trimmed) {
      const level = next.startsWith('=') ? 1 : 2
      const text = trimmed
      const id = nextUniqueHeadingId(text)
      toc.push({ id, text: normalizeHeadingText(text).trim(), level })
      i++
      if (toc.length >= 240) break
    }
  }
  return toc
}

const extractExcerptFromMarkdown = (content: string, maxLen = 220) => {
  const raw = stripLeadingMeta(content)
  const lines = raw.split(/\r?\n/)
  let inCodeBlock = false
  const parts: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || ''
    const trimmed = line.trim()
    if (/^```|^~~~/.test(trimmed)) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue
    if (!trimmed) continue
    if (/^#{1,6}\s+/.test(trimmed)) continue
    if (/^(\*|-|_){3,}\s*$/.test(trimmed)) continue
    if (/^\|.*\|\s*$/.test(trimmed)) continue

    let text = trimmed
    text = text.replace(/^>\s+/, '')
    text = text.replace(/^[-*+]\s+/, '')
    text = text.replace(/^\d+\.\s+/, '')
    parts.push(text)
    if (parts.join(' ').length >= maxLen * 2) break
  }

  let excerpt = parts.join(' ')
  excerpt = excerpt.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
  excerpt = excerpt.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  excerpt = excerpt.replace(/`([^`]+)`/g, '$1')
  excerpt = excerpt.replace(/<[^>]+>/g, ' ')
  excerpt = excerpt.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
  excerpt = excerpt.replace(/\s+/g, ' ').trim()
  if (excerpt.length > maxLen) excerpt = excerpt.slice(0, maxLen).trim()
  return excerpt
}

const buildContentSnippet = (content: string) => {
  const meta = getLeadingMetaBlock(content)
  const metaPart = meta.length > 600 ? meta.slice(0, 600) : meta
  const body = stripLeadingMeta(content).slice(0, 300)
  const joined = `${metaPart}${metaPart ? '\n' : ''}${body}`
  return joined.slice(0, 900)
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
        const contentSnippet = content ? buildContentSnippet(content) : '';
        const excerpt = content ? extractExcerptFromMarkdown(content) : '';
        const renderVersion = 1
        let renderPath: string | undefined = undefined
        let toc: TocItem[] = []
        if (isMd && content) {
          const rendered = renderMarkdownToHtmlWithToc(itemRelativePath, content)
          const renderedFileName = itemRelativePath.replace(/\//g, '_') + '.html'
          const renderedDestPath = path.join(renderedDir, renderedFileName)
          fs.writeFileSync(renderedDestPath, rendered.html, 'utf-8')
          renderPath = `rendered/${renderedFileName}`
          toc = rendered.toc
        }

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
          renderPath,
          renderVersion: isMd ? renderVersion : undefined,
          type: 'file',
          lastModified: getGitLastModified(fullPath),
          isSource: isCode,
          wordCount: isMd ? wordCount : undefined,
          lineCount: isMd ? lineCount : undefined,
          contentSnippet: isMd ? contentSnippet : undefined,
          excerpt: isMd ? excerpt : undefined,
          toc: isMd ? toc : undefined
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
