import { ref, onMounted, onUnmounted } from 'vue'
import MiniSearch from 'minisearch'
import type { FileNode } from '../types'
import { NodeType } from '../types'

export interface SearchResult {
  id: string
  path: string
  name: string
  content: string
  excerpt: string
  score: number
  fileNode?: any  // Optional reference to FileNode for direct opening
}

export function useSearch(fetchFileContentFn?: (file: FileNode) => Promise<string>) {
  type IndexedDocument = {
    id: string
    path: string
    name: string
    content: string
  }

  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const isSearching = ref(false)
  const showSearchModal = ref(false)
  const isLoadingContent = ref(false)
  const searchIndex = ref<MiniSearch<IndexedDocument> | null>(null)
  const fileSystem = ref<FileNode[]>([])
  const isFullIndexReady = ref(false)
  const currentLang = ref<'en' | 'zh'>('zh')

  const indexedDocumentsById = new Map<string, IndexedDocument>()

  const hasLanguageRoots = (fs: FileNode[]) => {
    return fs.some((n) => n.type === NodeType.DIRECTORY && (n.name === 'zh' || n.name === 'en'))
  }

  const buildLanguageFilter = (fs: FileNode[]) => {
    if (!hasLanguageRoots(fs)) return null
    return currentLang.value === 'zh' ? 'zh/' : 'en/'
  }

  const tokenizeMixed = (input: string): string[] => {
    if (!input) return []
    const tokens: string[] = []
    const text = input.normalize('NFKC')
    const wordMatches = text.match(/[A-Za-z0-9]+/g)
    if (wordMatches) tokens.push(...wordMatches)

    const cjkRuns = text.match(/[\u4E00-\u9FFF]+/g)
    if (cjkRuns) {
      for (const run of cjkRuns) {
        if (run.length >= 2) tokens.push(run)
        for (const ch of run) tokens.push(ch)
      }
    }

    return tokens
  }

  const createMiniSearch = () => {
    return new MiniSearch<IndexedDocument>({
      fields: ['name', 'content'],
      storeFields: ['name', 'path', 'content'],
      tokenize: (text) => tokenizeMixed(text),
      processTerm: (term) => (term ? term.toLowerCase() : term),
      searchOptions: {
        boost: { name: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    })
  }

  const flattenFiles = (nodes: FileNode[], filterPrefix: string | null): FileNode[] => {
    const files: FileNode[] = []
    for (const node of nodes) {
      if (node.type === NodeType.FILE && !node.isSource) {
        if (!filterPrefix || node.path.startsWith(filterPrefix)) files.push(node)
      } else if (node.children) {
        files.push(...flattenFiles(node.children, filterPrefix))
      }
    }
    return files
  }

  const getIndexContent = (node: FileNode) => {
    const contentToIndex = (node.content || node.contentSnippet || '').trim()
    return `${node.name.replace('.md', '')} ${contentToIndex}`.trim()
  }
  
  // Initialize search index - 立即加载当前语言的全部内容
  const initSearchIndex = async (fs: FileNode[], lang: 'en' | 'zh' = 'zh') => {
    fileSystem.value = fs
    currentLang.value = lang
    isFullIndexReady.value = false

    await rebuildSearchIndex()
  }
  
  // Load all file contents and rebuild index with complete data
  const loadFullContentAndRebuild = async () => {
    if (isFullIndexReady.value || isLoadingContent.value) return
    const fetchFn = fetchFileContentFn
    if (!fetchFn) {
      console.warn('fetchFileContentFn not provided to useSearch')
      return
    }
    
    isLoadingContent.value = true
    const langPrefix = buildLanguageFilter(fileSystem.value)
    
    try {
      const filesToLoad = flattenFiles(fileSystem.value, langPrefix).filter((n) => !n.content)
      for (const node of filesToLoad) {
        try {
          node.content = await fetchFn(node)
          const updated: IndexedDocument = {
            id: node.path,
            name: node.name.replace('.md', ''),
            path: node.path,
            content: getIndexContent(node)
          }
          indexedDocumentsById.set(updated.id, updated)
          searchIndex.value?.replace(updated)
        } catch (e) {
          console.warn(`Failed to load content for ${node.path}:`, e)
        }
      }
      isFullIndexReady.value = true
    } finally {
      isLoadingContent.value = false
    }
  }
  
  // Rebuild search index with current file contents
  const rebuildSearchIndex = async () => {
    indexedDocumentsById.clear()

    const langPrefix = buildLanguageFilter(fileSystem.value)
    const nodes = flattenFiles(fileSystem.value, langPrefix)
    const documents: IndexedDocument[] = nodes.map((node) => {
      const doc: IndexedDocument = {
        id: node.path,
        name: node.name.replace('.md', ''),
        path: node.path,
        content: getIndexContent(node)
      }
      indexedDocumentsById.set(doc.id, doc)
      return doc
    })

    const miniSearch = createMiniSearch()
    searchIndex.value = miniSearch
    await miniSearch.addAllAsync(documents, { chunkSize: 200 })
  }
  
  // Perform search with smart sorting
  const search = (query: string): SearchResult[] => {
    if (!searchIndex.value || !query.trim()) {
      searchResults.value = []
      return []
    }
    
    if (!isFullIndexReady.value && !isLoadingContent.value) {
      window.setTimeout(() => {
        loadFullContentAndRebuild()
      }, 0)
    }
    
    isSearching.value = true
    
    try {
      const results = (searchIndex.value.search(query, {
        boost: { name: 3, content: 1 },
        fuzzy: 0.2,
        prefix: true
      }) as any[])
      
      // Smart sorting: exact match > prefix match > fuzzy match
      const queryLower = query.toLowerCase()
      const sorted = results.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        
        // Exact match on name gets highest priority
        const aExact = nameA === queryLower ? 1000 : 0
        const bExact = nameB === queryLower ? 1000 : 0
        if (aExact !== bExact) return bExact - aExact
        
        // Prefix match (name starts with query) gets second priority
        const aPrefix = nameA.startsWith(queryLower) ? 100 : 0
        const bPrefix = nameB.startsWith(queryLower) ? 100 : 0
        if (aPrefix !== bPrefix) return bPrefix - aPrefix
        
        // Then sort by score
        return b.score - a.score
      })
      
      searchResults.value = sorted.slice(0, 20).map(r => {
        const content = r.content || ''
        const contentLower = content.toLowerCase()
        
        // Find excerpt around match
        let excerpt = ''
        const matchIndex = contentLower.indexOf(queryLower)
        if (matchIndex > -1) {
          const start = Math.max(0, matchIndex - 50)
          const end = Math.min(content.length, matchIndex + query.length + 100)
          excerpt = (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '')
        } else {
          excerpt = content.slice(0, 150) + (content.length > 150 ? '...' : '')
        }
        
        return {
          id: r.id,
          path: r.path,
          name: r.name,
          content: content,
          excerpt: excerpt,
          score: r.score
        }
      })
      
      return searchResults.value
    } finally {
      isSearching.value = false
    }
  }
  
  // Highlight matches in text
  const highlightMatches = (text: string, query: string): string => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800/60 rounded px-0.5">$1</mark>')
  }
  
  // Clear search
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
  }
  
  // Open search modal with keyboard shortcut
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      showSearchModal.value = true
    }
    if (e.key === 'Escape' && showSearchModal.value) {
      showSearchModal.value = false
    }
  }
  
  // Set fetch function (called after useSearch is created and fetchFileContent is available)
  const setFetchFunction = (fetchFn: (file: FileNode) => Promise<string>) => {
    fetchFileContentFn = fetchFn
  }
  
  // Update language filter
  const updateLanguage = (lang: 'en' | 'zh') => {
    if (lang !== currentLang.value) {
      currentLang.value = lang
      isFullIndexReady.value = false // Reset to reload for new language
      rebuildSearchIndex() // Rebuild with current content
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
  
  return {
    searchQuery,
    searchResults,
    isSearching,
    isLoadingContent,
    showSearchModal,
    currentLang,
    initSearchIndex,
    rebuildSearchIndex,
    search,
    loadFullContentAndRebuild,
    setFetchFunction,
    updateLanguage,
    highlightMatches,
    clearSearch
  }
}
