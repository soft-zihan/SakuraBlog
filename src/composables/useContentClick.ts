import { ref, type Ref } from 'vue'
import { NodeType } from '../types'
import type { FileNode } from '../types'
import { extractTagsFromFile } from './useArticleMeta'

/**
 * 链接处理工具函数
 */
export const normalizeHref = (raw: string): string => {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.startsWith('#')) return ''
  const hashIndex = trimmed.indexOf('#')
  const queryIndex = trimmed.indexOf('?')
  const cutIndex = [hashIndex, queryIndex].filter(i => i >= 0).sort((a, b) => a - b)[0]
  const base = cutIndex !== undefined ? trimmed.slice(0, cutIndex) : trimmed
  try {
    return decodeURIComponent(base)
  } catch {
    return base
  }
}

export const stripHashQuery = (raw: string): string => {
  const trimmed = raw.trim()
  const hashIndex = trimmed.indexOf('#')
  const queryIndex = trimmed.indexOf('?')
  const cutIndex = [hashIndex, queryIndex].filter(i => i >= 0).sort((a, b) => a - b)[0]
  return cutIndex !== undefined ? trimmed.slice(0, cutIndex) : trimmed
}

/**
 * 支持的内部链接文件扩展名
 */
const SUPPORTED_EXTENSIONS = ['.md', '.pdf', '.vue', '.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.scss']
const CODE_PROTOCOL = 'code://'

/**
 * 检查是否为支持的内部链接
 * 完整的 http/https 链接不拦截，让浏览器正常跳转
 * 相对链接（./xxx、xxx）和绝对链接（/xxx）都拦截并弹窗显示
 */
export const isSupportedInternalLink = (raw?: string | null): boolean => {
  if (!raw) return false
  // 完整的外部链接不拦截
  if (raw.startsWith('http') || raw.startsWith('//')) return false

  // 实验室深链接：lab:dashboard?tab=css-layout
  if (raw.startsWith('lab:')) return true

  // 项目代码深链接：code://path/to/file#L10-L20
  if (raw.startsWith(CODE_PROTOCOL)) return true
  
  const cleaned = stripHashQuery(raw)
  if (!cleaned || cleaned.startsWith('#')) return false
  
  const lower = cleaned.toLowerCase()
  return SUPPORTED_EXTENSIONS.some(ext => lower.endsWith(ext))
}

/**
 * 检查是否为代码文件（非 .md）
 */
export const isCodeFile = (path: string): boolean => {
  const lower = path.toLowerCase()
  if (lower.endsWith('.pdf')) return false
  return !lower.endsWith('.md') && SUPPORTED_EXTENSIONS.some(ext => lower.endsWith(ext))
}

export const isPdfFile = (path: string): boolean => {
  const lower = path.toLowerCase()
  return lower.endsWith('.pdf')
}

/**
 * 内容点击处理 composable
 */
export function useContentClick(
  currentFile: Ref<FileNode | null>,
  fileSystem: Ref<FileNode[]>,
  findNodeByPath: (nodes: FileNode[], path: string) => FileNode | null,
  fetchFileContent: (file: FileNode) => Promise<string>,
  openFile: (file: FileNode) => Promise<void>,
  openCodeModal: (title: string, content: string, path: string) => Promise<void>,
  setCodeModalContent: (content: string) => void,
  fetchSourceCodeFile: (filePath: string) => Promise<string>,
  handleImageClick: (target: HTMLElement) => boolean,
  hideSelectionMenu: () => void,
  showToast: (msg: string) => void,
  openLabDashboard?: (tab?: string) => void
) {
  type CodeLinkInfo = {
    path: string
    startLine?: number
    endLine?: number
    anchor?: string  // 函数名/锚点定位
  }

  const parseLineRangeToken = (raw?: string | null) => {
    if (!raw) return { startLine: undefined, endLine: undefined }
    const match = raw.match(/L?(\d+)(?:-L?(\d+))?/i)
    if (!match) return { startLine: undefined, endLine: undefined }
    const startLine = Number(match[1])
    const endLine = match[2] ? Number(match[2]) : undefined
    return {
      startLine: Number.isFinite(startLine) ? startLine : undefined,
      endLine: Number.isFinite(endLine || 0) ? endLine : undefined
    }
  }

  /**
   * 解析 code:// 链接
   * 支持格式：
   * - code://path/to/file                    整个文件
   * - code://path/to/file#functionName       定位到函数/变量/组件区块
   * - code://path/to/file?fn=functionName    定位到函数（备选格式）
   * - code://path/to/file#L10-L20            行号定位（兼容旧格式）
   */
  const parseCodeLink = (href: string): CodeLinkInfo | null => {
    if (!href.startsWith(CODE_PROTOCOL)) return null
    const raw = href.slice(CODE_PROTOCOL.length)
    const [beforeHash, hash] = raw.split('#', 2)
    const [pathPart, query] = beforeHash.split('?', 2)
    const params = new URLSearchParams(query || '')
    
    // 优先使用函数名定位
    const fnName = params.get('fn') || params.get('func') || params.get('function')
    
    // 检查 hash 是否是行号格式还是锚点格式
    let anchor: string | undefined
    let startLine: number | undefined
    let endLine: number | undefined
    
    if (hash) {
      // 如果 hash 匹配行号格式 L10 或 L10-L20
      if (/^L?\d+(-L?\d+)?$/i.test(hash)) {
        const range = parseLineRangeToken(hash)
        startLine = range.startLine
        endLine = range.endLine
      } else {
        // 否则视为锚点（函数名等）
        anchor = hash
      }
    }
    
    // 如果 query 中有行号参数
    if (!startLine) {
      const rangeToken = params.get('lines') || params.get('line') || params.get('L')
      if (rangeToken) {
        const range = parseLineRangeToken(rangeToken)
        startLine = range.startLine
        endLine = range.endLine
      }
    }
    
    return {
      path: decodeURIComponent(pathPart || ''),
      startLine,
      endLine,
      anchor: fnName || anchor
    }
  }

  /**
   * 根据锚点（函数名/变量名/组件区块）在代码中定位
   * 返回起始行和结束行（尽量包含完整的函数/区块）
   */
  const findAnchorInCode = (content: string, anchor: string): { startLine: number; endLine: number } | null => {
    const lines = content.split(/\r?\n/)
    const anchorLower = anchor.toLowerCase()
    
    // 常见的定义模式
    const patterns = [
      // Vue SFC 区块
      new RegExp(`^<(script|template|style)\\b`, 'i'),
      // export function / export const / export default
      new RegExp(`^export\\s+(default\\s+)?(function|const|let|var|class|interface|type)\\s+${anchor}\\b`, 'i'),
      new RegExp(`^export\\s+\\{[^}]*\\b${anchor}\\b`, 'i'),
      // function declaration
      new RegExp(`^(async\\s+)?function\\s+${anchor}\\s*[(<]`, 'i'),
      // const/let/var = function/arrow
      new RegExp(`^(export\\s+)?(const|let|var)\\s+${anchor}\\s*=`, 'i'),
      // class
      new RegExp(`^(export\\s+)?(abstract\\s+)?class\\s+${anchor}\\b`, 'i'),
      // interface/type
      new RegExp(`^(export\\s+)?(interface|type)\\s+${anchor}\\b`, 'i'),
      // Vue defineProps/defineEmits/computed/watch etc
      new RegExp(`^const\\s+${anchor}\\s*=\\s*(ref|reactive|computed|watch|defineProps|defineEmits)`, 'i'),
      // 对象方法
      new RegExp(`^\\s*${anchor}\\s*[:(]`, 'i'),
    ]
    
    // 特殊处理 Vue SFC 区块
    if (['script', 'template', 'style', 'setup'].includes(anchorLower)) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (anchorLower === 'setup' && /^<script[^>]*\bsetup\b/.test(line)) {
          return findBlockEnd(lines, i, '</script>')
        }
        if (line.toLowerCase().startsWith(`<${anchorLower}`)) {
          const closeTag = `</${anchorLower}>`
          return findBlockEnd(lines, i, closeTag)
        }
      }
    }
    
    // 搜索匹配的定义
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      
      for (const pattern of patterns) {
        if (pattern.test(trimmed)) {
          // 找到匹配，尝试找到完整的代码块结束位置
          return findCodeBlockEnd(lines, i)
        }
      }
      
      // 宽松匹配：行中包含锚点名且看起来像定义
      if (trimmed.includes(anchor) && /^(export|const|let|var|function|class|interface|type|async)\b/.test(trimmed)) {
        return findCodeBlockEnd(lines, i)
      }
    }
    
    return null
  }
  
  /**
   * 查找 Vue SFC 区块的结束位置
   */
  const findBlockEnd = (lines: string[], startIdx: number, closeTag: string): { startLine: number; endLine: number } => {
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (lines[i].trim().toLowerCase().startsWith(closeTag.toLowerCase())) {
        return { startLine: startIdx + 1, endLine: i + 1 }
      }
    }
    return { startLine: startIdx + 1, endLine: Math.min(startIdx + 50, lines.length) }
  }
  
  /**
   * 尝试找到代码块的结束位置（基于括号匹配和缩进）
   */
  const findCodeBlockEnd = (lines: string[], startIdx: number): { startLine: number; endLine: number } => {
    let braceCount = 0
    let parenCount = 0
    let bracketCount = 0
    let foundFirstBrace = false
    let endIdx = startIdx
    
    // 向前展示几行上下文
    const contextBefore = Math.max(0, startIdx - 2)
    
    for (let i = startIdx; i < lines.length && i < startIdx + 200; i++) {
      const line = lines[i]
      for (const char of line) {
        if (char === '{') { braceCount++; foundFirstBrace = true }
        else if (char === '}') braceCount--
        else if (char === '(') parenCount++
        else if (char === ')') parenCount--
        else if (char === '[') bracketCount++
        else if (char === ']') bracketCount--
      }
      
      endIdx = i
      
      // 如果括号都闭合了，找到结束
      if (foundFirstBrace && braceCount === 0 && parenCount <= 0) {
        break
      }
      
      // 如果遇到空行且不在括号内，可能是函数结束
      if (i > startIdx + 3 && !foundFirstBrace && line.trim() === '' && braceCount === 0) {
        endIdx = i - 1
        break
      }
    }
    
    // 向后展示几行上下文
    const contextAfter = Math.min(lines.length, endIdx + 3)
    
    return { startLine: contextBefore + 1, endLine: contextAfter }
  }

  const buildLineSnippet = (content: string, startLine?: number, endLine?: number) => {
    if (!startLine) return content
    const lines = content.split(/\r?\n/)
    const safeStart = Math.max(1, startLine)
    const safeEnd = Math.min(lines.length, endLine && endLine >= safeStart ? endLine : safeStart)
    const width = String(safeEnd).length
    const slice = lines.slice(safeStart - 1, safeEnd)
    return slice.map((line, idx) => `${String(safeStart + idx).padStart(width, ' ')} | ${line}`).join('\n')
  }

  /**
   * 解析目标路径
   */
  const resolveTargetPath = (href: string, currentFilePath?: string): string => {
    const normalized = normalizeHref(href)
    
    if (normalized.startsWith('/')) {
      // 绝对路径 /xxx -> xxx
      return normalized.substring(1)
    } else if (currentFilePath) {
      // 相对路径解析
      const currentDir = currentFilePath.split('/').slice(0, -1)
      const parts = normalized.split('/')
      
      for (const part of parts) {
        if (part === '.') continue
        if (part === '..') {
          if (currentDir.length > 0) currentDir.pop()
        } else {
          currentDir.push(decodeURIComponent(part))
        }
      }
      return currentDir.join('/')
    }
    
    return normalized
  }

  /**
   * 处理内容点击事件
   */
  const handleContentClick = async (e: MouseEvent, isLocked: boolean): Promise<void> => {
    const target = e.target as HTMLElement
    if (isLocked) return

    // 1. 处理图片点击（灯箱）
    if (handleImageClick(target)) {
      hideSelectionMenu()
      return
    }

    // 2. 拦截内部链接
    const link = target.closest('a')
    if (link) {
      // 优先使用 data-internal-href（由 marked 渲染器设置的内部链接）
      const internalHref = link.getAttribute('data-internal-href')
      const href = internalHref || link.getAttribute('href')
      
      // 检查是否需要处理（内部链接或有 data-internal-href）
      if (internalHref || (href && isSupportedInternalLink(href))) {
        e.preventDefault()
        e.stopPropagation()

        // 0. 实验室深链接：lab:dashboard?tab=foundation
        if (href && href.startsWith('lab:')) {
          if (!openLabDashboard) {
            showToast('Lab navigation not available')
            hideSelectionMenu()
            return
          }

          const rest = href.slice('lab:'.length)
          const [cmd, queryAndHash] = rest.split('?')
          const query = (queryAndHash || '').split('#')[0]
          const params = new URLSearchParams(query)
          const tab = params.get('tab') || (cmd && cmd !== 'dashboard' ? cmd : undefined)
          openLabDashboard(tab || undefined)
          hideSelectionMenu()
          return
        }

        // 0.1 代码深链接：code://path/to/file#functionName 或 code://path/to/file#L10-L20
        if (href && href.startsWith(CODE_PROTOCOL)) {
          const info = parseCodeLink(href)
          if (!info?.path) {
            showToast('Invalid code link')
            hideSelectionMenu()
            return
          }

          const { path, anchor } = info
          let { startLine, endLine } = info
          const fileName = path.split('/').pop() || path

          await openCodeModal(`${fileName}${anchor ? ` → ${anchor}` : ''}`, 'Loading...', path)

          let node = findNodeByPath(fileSystem.value, path)
          let content = ''

          if (node && node.type === NodeType.FILE) {
            if (!node.content) {
              node.content = await fetchFileContent(node)
            }
            content = node.content
          } else {
            content = await fetchSourceCodeFile(path)
          }

          // 如果有锚点，尝试定位到对应的函数/区块
          if (anchor && !startLine) {
            const anchorRange = findAnchorInCode(content, anchor)
            if (anchorRange) {
              startLine = anchorRange.startLine
              endLine = anchorRange.endLine
            }
          }

          const finalContent = startLine ? buildLineSnippet(content, startLine, endLine) : content
          setCodeModalContent(finalContent)
          hideSelectionMenu()
          return
        }
        
        const targetPath = resolveTargetPath(href!, currentFile.value?.path)
        const isPdf = isPdfFile(targetPath)
        const isCode = isCodeFile(targetPath)

        if (isPdf) {
          const node = findNodeByPath(fileSystem.value, targetPath)
          if (node && node.type === NodeType.FILE) {
            await openFile(node)
          } else if (href) {
            window.open(href, '_blank')
          }
          hideSelectionMenu()
          return
        }

        // 对于代码文件，直接打开代码弹窗
        if (isCode) {
          const fileName = targetPath.split('/').pop() || targetPath
          await openCodeModal(fileName, 'Loading...', targetPath)

          // 尝试从 fileSystem 中查找
          let node = findNodeByPath(fileSystem.value, targetPath)
          let content = ''

          if (node && node.type === NodeType.FILE) {
            if (!node.content) {
              node.content = await fetchFileContent(node)
            }
            content = node.content
          } else {
            // 尝试从项目根目录获取
            content = await fetchSourceCodeFile(targetPath)
          }

          setCodeModalContent(content)
          hideSelectionMenu()
          return
        }

        // 对于 .md 文件，尝试在 fileSystem 中查找
        let node = findNodeByPath(fileSystem.value, targetPath)

        if (node && node.type === NodeType.FILE) {
          if (node.isSource || node.path.startsWith('source')) {
            // Treat source*.md as source code too for viewing
            await openCodeModal(node.name, 'Loading...', node.path)

            if (!node.content) {
              node.content = await fetchFileContent(node)
            }
            setCodeModalContent(node.content)
          } else {
            // Open normal Markdown file
            await openFile(node)
          }
        } else {
          showToast(`File not found: ${href}`)
        }
      }
    }

    hideSelectionMenu()
  }

  return {
    handleContentClick,
    resolveTargetPath
  }
}

/**
 * 文件可见性判断
 * 用于标签筛选和收藏过滤
 */
export function useFileVisibility(
  articleStore: {
    showFavoritesOnly: Ref<boolean> | boolean
    selectedTags: Ref<string[]> | string[]
    availableTags: Ref<string[]> | string[]
    isFavorite: (path: string) => boolean
    isTagSelected: (tag: string) => boolean
  }
) {
  /**
   * 判断文件是否可见
   * 修复：始终检查标签匹配，而不是只在部分选中时检查
   */
  const isFileVisible = (file: FileNode): boolean => {
    const showFavoritesOnly = typeof articleStore.showFavoritesOnly === 'boolean' 
      ? articleStore.showFavoritesOnly 
      : articleStore.showFavoritesOnly.value
    const selectedTags = Array.isArray(articleStore.selectedTags) 
      ? articleStore.selectedTags 
      : articleStore.selectedTags.value
    
    // 收藏筛选
    if (showFavoritesOnly && !articleStore.isFavorite(file.path)) {
      return false
    }
    
    // 如果没有选中任何标签，不显示任何文章
    if (selectedTags.length === 0) {
      return false
    }
    
    // 始终执行标签筛选
    const fileTags = extractTagsFromFile(file)
    if (fileTags.length === 0) {
      return articleStore.isTagSelected('notag')
    }
    return fileTags.some(tag => articleStore.isTagSelected(tag))
  }

  /**
   * 收集所有标签
   */
  const collectAllTags = (
    currentLangRoot: FileNode[],
    setAvailableTags: (tags: string[]) => void
  ) => {
    const flatten = (nodes: FileNode[]): FileNode[] => {
      let files: FileNode[] = []
      for (const node of nodes) {
        if (node.type === NodeType.FILE) files.push(node)
        else if (node.children) files = files.concat(flatten(node.children))
      }
      return files
    }

    const tags = new Set<string>()
    for (const file of flatten(currentLangRoot)) {
      const fileTags = extractTagsFromFile(file)
      fileTags.forEach(t => tags.add(t))
    }

    setAvailableTags([...tags])
  }

  return {
    isFileVisible,
    collectAllTags
  }
}
