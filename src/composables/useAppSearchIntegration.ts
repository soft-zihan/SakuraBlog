import { watch, type Ref } from 'vue'
import { NodeType } from '../types'
import type { FileNode } from '../types'
import { findNodeByPath } from '../utils/fileUtils'

export function useAppSearchIntegration(params: {
  appStore: any
  lang: Ref<'en' | 'zh'>
  t: Ref<any>
  openFile: (file: FileNode) => Promise<void>
  initSearchIndex: (fs: FileNode[], lang: 'en' | 'zh') => Promise<void>
  updateLanguage: (lang: 'en' | 'zh') => void
  showToast: (msg: string) => void
}) {
  const handleSearchSelect = async (payload: { result: any; query: string }) => {
    params.appStore.showSearch = false
    params.appStore.sidebarOpen = false

    const node = findNodeByPath(params.appStore.fileSystem, payload.result.path)
    if (node && node.type === NodeType.FILE) {
      const target = payload.query.trim()
      const targetLower = target.toLowerCase()
      const contentLower = (node.content || '').toLowerCase()
      const snippetLower = (node.contentSnippet || '').toLowerCase()
      const shouldJump = !!target && (contentLower.includes(targetLower) || snippetLower.includes(targetLower))
      params.appStore.searchTarget = shouldJump ? target : null
      await params.openFile(node)
      return
    }

    params.showToast(params.t.value.file_not_found)
  }

  watch(params.lang, async (newLang, oldLang) => {
    if (!oldLang) return
    if (!params.appStore.fileSystem.length) return
    params.updateLanguage(newLang)
    await params.initSearchIndex(params.appStore.fileSystem, newLang)
  })

  return { handleSearchSelect }
}
