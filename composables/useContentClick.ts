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
const SUPPORTED_EXTENSIONS = ['.md', '.vue', '.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.scss']

/**
 * 检查是否为支持的内部链接
 * 完整的 http/https 链接不拦截，让浏览器正常跳转
 * 相对链接（./xxx、xxx）和绝对链接（/xxx）都拦截并弹窗显示
 */
export const isSupportedInternalLink = (raw?: string | null): boolean => {
  if (!raw) return false
  // 完整的外部链接不拦截
  if (raw.startsWith('http') || raw.startsWith('//')) return false
  
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
  return !lower.endsWith('.md') && SUPPORTED_EXTENSIONS.some(ext => lower.endsWith(ext))
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
  showToast: (msg: string) => void
) {
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
        
        const targetPath = resolveTargetPath(href!, currentFile.value?.path)
        const isCode = isCodeFile(targetPath)

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
