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
}

export function useSearch() {
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const isSearching = ref(false)
  const showSearchModal = ref(false)
  const searchIndex = ref<MiniSearch<any> | null>(null)
  
  // Initialize search index
  const initSearchIndex = async (fileSystem: FileNode[]) => {
    const miniSearch = new MiniSearch({
      fields: ['name', 'content'],
      storeFields: ['name', 'path', 'content'],
      searchOptions: {
        boost: { name: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    })
    
    // Flatten files and add to index
    const flattenFiles = (nodes: FileNode[]): Array<{ id: string; name: string; path: string; content: string }> => {
      const files: Array<{ id: string; name: string; path: string; content: string }> = []
      
      for (const node of nodes) {
        if (node.type === NodeType.FILE && !node.isSource) {
          files.push({
            id: node.path,
            name: node.name.replace('.md', ''),
            path: node.path,
            content: node.content || ''
          })
        }
        if (node.children) {
          files.push(...flattenFiles(node.children))
        }
      }
      
      return files
    }
    
    const documents = flattenFiles(fileSystem)
    miniSearch.addAll(documents)
    searchIndex.value = miniSearch
  }
  
  // Perform search
  const search = (query: string): SearchResult[] => {
    if (!searchIndex.value || !query.trim()) {
      searchResults.value = []
      return []
    }
    
    isSearching.value = true
    
    try {
      const results = searchIndex.value.search(query, {
        boost: { name: 3, content: 1 },
        fuzzy: 0.2,
        prefix: true
      })
      
      searchResults.value = results.slice(0, 20).map(r => {
        const content = r.content || ''
        const queryLower = query.toLowerCase()
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
    showSearchModal,
    initSearchIndex,
    search,
    highlightMatches,
    clearSearch
  }
}
