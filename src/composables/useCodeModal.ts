import { ref, computed } from 'vue'
import hljs from 'highlight.js/lib/common'
import type { FileNode } from '../types'

// 状态
const showCodeModal = ref(false)
const codeModalContent = ref('')
const codeModalTitle = ref('')
const codeModalPath = ref('')
const highlightStartLine = ref<number | undefined>(undefined)
const highlightEndLine = ref<number | undefined>(undefined)
const previousUrl = ref<string | null>(null)

/**
 * 代码弹窗管理 composable
 */
export function useCodeModal() {
  const wrapHighlightedLines = (highlightedHtml: string, startLine?: number, endLine?: number) => {
    const lines = highlightedHtml.split('\n')
    const safeStart = startLine && startLine >= 1 ? startLine : undefined
    const safeEnd = endLine && safeStart && endLine >= safeStart ? endLine : safeStart

    return lines
      .map((lineHtml, idx) => {
        const lineNo = idx + 1
        const isTarget = !!safeStart && lineNo >= safeStart && lineNo <= (safeEnd || safeStart)
        const cls = isTarget ? 'code-line is-target' : 'code-line'
        const body = lineHtml && lineHtml.length > 0 ? lineHtml : '&#8203;'
        return `<span class="${cls}" data-line="${lineNo}">${body}</span>`
      })
      .join('\n')
  }


  /**
   * 根据文件扩展名获取语言
   */
  const getLanguageFromFileName = (fileName: string): string => {
    const cleaned = fileName.split('?')[0].split('#')[0]
    const ext = cleaned.split('.').pop()?.toLowerCase() || ''
    const langMap: Record<string, string> = {
      vue: 'html',
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
      html: 'html',
      css: 'css',
      scss: 'scss',
      md: 'markdown',
      py: 'python',
      sh: 'bash',
      yml: 'yaml',
      yaml: 'yaml'
    }
    return langMap[ext] || 'plaintext'
  }

  /**
   * 代码弹窗语法高亮内容
   */
  const highlightedCodeContent = computed(() => {
    if (!codeModalContent.value || codeModalContent.value === 'Loading...') {
      return codeModalContent.value
    }
    const lang = getLanguageFromFileName(codeModalPath.value || codeModalTitle.value)
    try {
      if (hljs.getLanguage(lang)) {
        const html = hljs.highlight(codeModalContent.value, { language: lang }).value
        return wrapHighlightedLines(html, highlightStartLine.value, highlightEndLine.value)
      }
      const html = hljs.highlightAuto(codeModalContent.value).value
      return wrapHighlightedLines(html, highlightStartLine.value, highlightEndLine.value)
    } catch {
      const escaped = codeModalContent.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return wrapHighlightedLines(escaped, highlightStartLine.value, highlightEndLine.value)
    }
  })

  /**
   * 获取项目根目录下的源代码文件（如 App.vue, vite.config.ts 等）
   */
  const fetchSourceCodeFile = async (filePath: string): Promise<string> => {
    // 移除开头的斜杠
    const cleanPath = filePath.replace(/^\/+/, '')

    // 将路径转换为 raw 目录下的文件名格式（/ 替换为 _，加 .txt 后缀）
    const rawFileName = cleanPath.replace(/\//g, '_') + '.txt'

    try {
      // 从 raw 目录获取（构建时生成的源代码文件）
      const res = await fetch(`./raw/${rawFileName}`)
      if (res.ok) {
        return await res.text()
      }

      // 回退：尝试直接获取（开发环境）
      const fallbackRes = await fetch(`./${cleanPath}`)
      if (fallbackRes.ok) {
        return await fallbackRes.text()
      }

      return `// Error: Could not load file\n// Path: ${filePath}\n// Tried: ./raw/${rawFileName}`
    } catch (e: any) {
      return `// Error: ${e.message}\n// Path: ${filePath}`
    }
  }

  /**
   * 打开代码弹窗并更新 URL
   */
  const openCodeModal = async (
    title: string,
    content: string,
    path: string,
    options?: { syncUrl?: boolean; highlight?: { startLine?: number; endLine?: number } }
  ) => {
    if (options?.syncUrl !== false) previousUrl.value = window.location.href

    codeModalTitle.value = title
    codeModalContent.value = content
    codeModalPath.value = path
    highlightStartLine.value = options?.highlight?.startLine
    highlightEndLine.value = options?.highlight?.endLine
    showCodeModal.value = true

    if (options?.syncUrl !== false) {
      const url = new URL(window.location.href)
      url.searchParams.set('source', path)
      window.history.pushState({ source: path }, '', url.toString())
    }
  }

  /**
   * 关闭代码弹窗并恢复 URL
   */
  const closeCodeModal = () => {
    showCodeModal.value = false
    codeModalContent.value = ''
    codeModalTitle.value = ''
    codeModalPath.value = ''
    highlightStartLine.value = undefined
    highlightEndLine.value = undefined

    // 恢复 URL
    const url = new URL(window.location.href)
    url.searchParams.delete('source')
    window.history.pushState({}, '', url.toString())
  }

  /**
   * 复制代码内容
   */
  const copyCodeContent = async (showToast: (msg: string) => void, successMsg: string) => {
    try {
      await navigator.clipboard.writeText(codeModalContent.value)
      showToast(successMsg)
    } catch {
      // 静默失败
    }
  }

  /**
   * 设置代码弹窗内容
   */
  const setCodeModalContent = (content: string) => {
    codeModalContent.value = content
  }

  const setHighlightRange = (startLine?: number, endLine?: number) => {
    highlightStartLine.value = startLine
    highlightEndLine.value = endLine
  }

  return {
    // 状态
    showCodeModal,
    codeModalContent,
    codeModalTitle,
    codeModalPath,
    highlightStartLine,
    highlightEndLine,
    highlightedCodeContent,
    // 方法
    getLanguageFromFileName,
    fetchSourceCodeFile,
    openCodeModal,
    closeCodeModal,
    copyCodeContent,
    setCodeModalContent,
    setHighlightRange
  }
}
