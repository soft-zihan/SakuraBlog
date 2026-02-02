import { ref, computed, watch, type Ref } from 'vue'
import { NodeType } from '../types'
import type { FileNode, TocItem } from '../types'

import { findNodeByPath, fetchFileContent } from '../utils/fileUtils'

export { findNodeByPath, fetchFileContent }

export function useFile(fileSystem: Ref<FileNode[]>, lang: Ref<'en' | 'zh'>) {
  const currentFile = ref<FileNode | null>(null)
  const currentFolder = ref<FileNode | null>(null)
  const expandedFolders = ref<string[]>([])
  const contentLoading = ref(false)

  // Root Directory Logic based on Language
  const currentLangRoot = computed(() => {
    const root = fileSystem.value?.find(node => node.name === lang.value)
    return root ? root.children : []
  })

  const filteredFileSystem = computed(() => {
    return currentLangRoot.value || []
  })

  const filteredFlatFiles = computed(() => {
    const flatten = (nodes: FileNode[]): FileNode[] => {
      let files: FileNode[] = []
      for (const node of nodes) {
        if (node.type === NodeType.FILE) files.push(node)
        else if (node.children) files = files.concat(flatten(node.children))
      }
      return files
    }
    return flatten(filteredFileSystem.value).sort((a, b) => 
      new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()
    )
  })

  const labFolder = computed(() => {
    const preferredName = lang.value === 'zh' ? 'VUE学习笔记' : 'VUE Learning'
    const fallbackName = lang.value === 'zh' ? 'VUE Learning' : 'VUE学习笔记'
    const findFolderByName = (nodes: FileNode[], name: string): FileNode | null => {
      for (const node of nodes) {
        if (node.type === NodeType.DIRECTORY && node.name.toLowerCase() === name.toLowerCase()) {
          return node
        }
        if (node.children) {
          const found = findFolderByName(node.children, name)
          if (found) return found
        }
      }
      return null
    }
    return findFolderByName(fileSystem.value || [], preferredName) || findFolderByName(fileSystem.value || [], fallbackName)
  })

  const currentPath = computed(() => currentFile.value?.path || currentFolder.value?.path || '')

  const toggleFolder = (path: string) => {
    const idx = expandedFolders.value.indexOf(path)
    if (idx === -1) expandedFolders.value.push(path)
    else expandedFolders.value.splice(idx, 1)
  }

  const updateUrl = (path: string | null) => {
    try {
      const url = new URL(window.location.href)
      if (path) {
        url.searchParams.set('path', path)
      } else {
        url.searchParams.delete('path')
      }
      window.history.pushState({}, '', url.toString())
    } catch (e) {
      console.error("Failed to update URL", e)
    }
  }

  const getCleanParentPath = (path: string) => {
    const parts = path.split('/')
    const parent = parts.slice(0, -1).join('/')
    return parent || 'Root'
  }

  const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : ''

  return {
    currentFile,
    currentFolder,
    expandedFolders,
    contentLoading,
    currentLangRoot,
    filteredFileSystem,
    filteredFlatFiles,
    labFolder,
    currentPath,
    findNodeByPath,
    fetchFileContent,
    toggleFolder,
    updateUrl,
    getCleanParentPath,
    formatDate
  }
}
