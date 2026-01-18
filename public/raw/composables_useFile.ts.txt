import { ref, computed, watch, type Ref } from 'vue'
import { NodeType } from '../types'
import type { FileNode, TocItem } from '../types'

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
    const targetName = lang.value === 'zh' ? 'VUE学习笔记' : 'VUE Learning'
    const findFolderByName = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.type === NodeType.DIRECTORY && node.name.toLowerCase() === targetName.toLowerCase()) {
          return node
        }
        if (node.children) {
          const found = findFolderByName(node.children)
          if (found) return found
        }
      }
      return null
    }
    return findFolderByName(fileSystem.value || [])
  })

  const currentPath = computed(() => currentFile.value?.path || currentFolder.value?.path || '')

  const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node
      if (node.children) {
        const found = findNodeByPath(node.children, path)
        if (found) return found
      }
    }
    const decodedPath = decodeURIComponent(path)
    if (decodedPath !== path) {
      for (const node of nodes) {
        if (node.path === decodedPath) return node
        if (node.children) {
          const found = findNodeByPath(node.children, decodedPath)
          if (found) return found
        }
      }
    }
    return null
  }

  const fetchFileContent = async (file: FileNode): Promise<string> => {
    let fetchPath = ''
    if (file.isSource && file.fetchPath) {
      fetchPath = `./${file.fetchPath}`
    } else {
      // Use raw path directly - files are stored with actual characters, not encoded
      fetchPath = `./notes/${file.path}`
    }
    
    try {
      const res = await fetch(fetchPath)
      
      if (res.ok) return await res.text()
      return `# Error ${res.status}\nCould not load file content.\nPath: ${file.path}`
    } catch (e: any) {
      return `# Error\n${e.message}\nPath: ${file.path}`
    }
  }

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
