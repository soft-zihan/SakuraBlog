import { ref, computed } from 'vue'
import hljs from 'highlight.js/lib/common'
import type { FileNode } from '../types'

// 状态
const showCodeModal = ref(false)
const codeModalContent = ref('')
const codeModalTitle = ref('')
const codeModalPath = ref('')
const previousUrl = ref<string | null>(null)

/**
 * 代码弹窗管理 composable
 */
export function useCodeModal() {

  /**
   * 根据文件扩展名获取语言
   */
  const getLanguageFromFileName = (fileName: string): string => {
    const cleaned = fileName.split('?')[0].split('#')[0]
    const ext = cleaned.split('.').pop()?.toLowerCase() || ''
    const langMap: Record<string, string> = {
      'vue': 'html',
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'md': 'markdown',
      'py': 'python',
      'sh': 'bash',
      'yml': 'yaml',
      'yaml': 'yaml'
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
        return hljs.highlight(codeModalContent.value, { language: lang }).value
      }
      return hljs.highlightAuto(codeModalContent.value).value
    } catch {
      return codeModalContent.value
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
  const openCodeModal = async (title: string, content: string, path: string, options?: { syncUrl?: boolean }) => {
    if (options?.syncUrl !== false) previousUrl.value = window.location.href

    codeModalTitle.value = title
    codeModalContent.value = content
    codeModalPath.value = path
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

  return {
    // 状态
    showCodeModal,
    codeModalContent,
    codeModalTitle,
    codeModalPath,
    highlightedCodeContent,
    // 方法
    getLanguageFromFileName,
    fetchSourceCodeFile,
    openCodeModal,
    closeCodeModal,
    copyCodeContent,
    setCodeModalContent
  }
}
