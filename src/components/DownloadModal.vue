<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-2xl w-full animate-fade-in border border-white/50 dark:border-gray-700 max-h-[85vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            📥 {{ lang === 'zh' ? '批量下载笔记' : 'Batch Download Notes' }}
          </h3>
          <button @click="$emit('close')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      
      <!-- Filter Section (参考边栏实现) -->
      <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <!-- Favorites Filter -->
        <div class="mb-3">
          <button 
            @click="showFavoritesOnly = !showFavoritesOnly"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            :class="showFavoritesOnly 
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <span>{{ showFavoritesOnly ? '⭐' : '☆' }}</span>
            <span class="font-medium">{{ lang === 'zh' ? '仅显示收藏' : 'Favorites Only' }}</span>
            <span class="ml-auto text-xs opacity-70">({{ favoritesCount }})</span>
          </button>
        </div>
        
        <!-- Tags Filter -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{{ lang === 'zh' ? '标签筛选' : 'Tags' }}</span>
            <div class="flex gap-1">
              <button 
                @click="selectAllTags"
                class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-sakura-100 hover:text-sakura-600"
              >
                {{ lang === 'zh' ? '全选' : 'All' }}
              </button>
              <button 
                @click="deselectAllTags"
                class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-sakura-100 hover:text-sakura-600"
              >
                {{ lang === 'zh' ? '清空' : 'None' }}
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button 
              v-for="tag in availableTags"
              :key="tag"
              @click="toggleTag(tag)"
              class="px-2 py-1 text-xs rounded-full transition-all"
              :class="isTagSelected(tag)
                ? 'bg-sakura-500 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-sakura-100 dark:hover:bg-sakura-900/30'"
            >
              {{ tag === 'notag' ? (lang === 'zh' ? '无标签' : 'No Tag') : tag }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- File Tree (for manual selection) -->
      <div class="flex-1 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div class="p-3">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between">
            <span>
              {{ lang === 'zh' ? '当前语言文件夹' : 'Current Language Folder' }}: 
              <span class="font-bold text-sakura-500">notes/{{ lang }}/</span>
            </span>
            <span class="text-sakura-600 dark:text-sakura-400 font-medium">
              {{ filteredFiles.length }} {{ lang === 'zh' ? '个文件已筛选' : 'files filtered' }}
            </span>
          </div>
          
          <!-- Filtered File List -->
          <div class="space-y-1 max-h-48 overflow-y-auto">
            <div 
              v-for="file in filteredFiles" 
              :key="file.path"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm"
            >
              <span class="text-gray-400">📄</span>
              <span class="flex-1 truncate text-gray-700 dark:text-gray-300">{{ file.name.replace('.md', '') }}</span>
              <span v-if="file.tags?.length" class="text-[10px] px-1.5 py-0.5 bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-400 rounded">
                {{ file.tags[0] }}
              </span>
              <button 
                @click.stop="downloadSingleFile(file)"
                class="ml-auto p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-sakura-500 transition-colors"
                :title="lang === 'zh' ? '下载此文件' : 'Download file'"
              >
                ⬇️
              </button>
            </div>
            <div v-if="filteredFiles.length === 0" class="text-center text-gray-400 py-4 text-sm">
              {{ lang === 'zh' ? '没有匹配的文件' : 'No matching files' }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Download Actions -->
      <div class="flex flex-col gap-3">
        <!-- Row 1: Notes Download -->
        <div class="flex gap-3">
          <button 
            @click="downloadNotes"
            :disabled="isDownloading || filteredFiles.length === 0"
            class="flex-1 py-3 border rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
            :class="isDownloading || filteredFiles.length === 0 
              ? 'border-gray-300 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'"
          >
            <span v-if="isDownloading" class="animate-spin">⏳</span>
            <span v-else>📦</span>
            {{ isDownloading 
              ? (lang === 'zh' ? '打包中...' : 'Packaging...') 
              : (lang === 'zh' ? `下载 ${filteredFiles.length} 个文件` : `Download ${filteredFiles.length} files`) 
            }}
          </button>
        </div>
        
        <!-- Row 2: Special Downloads -->
        <div class="flex gap-3">
          <button 
            @click="downloadVueNotes"
            :disabled="isDownloading"
            class="flex-1 py-2.5 border rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            :class="{ 'opacity-50 cursor-not-allowed': isDownloading }"
          >
            <span>📚</span>
            {{ lang === 'zh' ? 'VUE笔记' : 'VUE Notes' }}
          </button>
        </div>
        
        <!-- Row 3: Source Code Downloads -->
        <div class="flex gap-3">
          <button 
            @click="downloadSourceCode"
            :disabled="isDownloading"
            class="flex-1 py-2.5 border rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
            :class="{ 'opacity-50 cursor-not-allowed': isDownloading }"
          >
            <span>💻</span>
            {{ lang === 'zh' ? '纯源码' : 'Source Only' }}
          </button>
          
          <button 
            @click="downloadSourceCodeWithNotesBtn"
            :disabled="isDownloading"
            class="flex-1 py-2.5 border rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
            :class="{ 'opacity-50 cursor-not-allowed': isDownloading }"
          >
            <span>📝</span>
            {{ lang === 'zh' ? '源码+笔记' : 'Source+Notes' }}
          </button>
        </div>
      </div>
      
      <!-- Status Message -->
      <p v-if="downloadMessage" class="mt-3 text-center text-sm" :class="downloadSuccess ? 'text-green-500' : 'text-red-500'">
        {{ downloadMessage }}
      </p>
    </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../stores/articleStore'
import JSZip from 'jszip'
import { buildPresetNoteMap } from '../utils/i18nText'

const props = defineProps<{
  lang: 'zh' | 'en'
  fileSystem: any[]
  labFolder?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const articleStore = useArticleStore()

// State - 独立的筛选状态（不影响边栏）
const showFavoritesOnly = ref(false)
const selectedTags = ref<string[]>([])
const isDownloading = ref(false)
const downloadMessage = ref('')
const downloadSuccess = ref(false)

// Get available tags from current language files
const availableTags = computed(() => {
  const tags = new Set<string>()
  let hasNoTagFiles = false
  
  const langFolder = props.fileSystem?.find(f => f.name === props.lang)
  if (!langFolder?.children) return ['notag']
  
  const processFiles = (files: any[]) => {
    for (const file of files) {
      if (file.children) {
        processFiles(file.children)
      } else if (file.name?.endsWith('.md')) {
        if (file.tags && Array.isArray(file.tags) && file.tags.length > 0) {
          file.tags.forEach((tag: string) => tags.add(tag))
        } else {
          hasNoTagFiles = true
        }
      }
    }
  }
  processFiles(langFolder.children)
  
  const sortedTags = Array.from(tags).sort()
  if (hasNoTagFiles) {
    return ['notag', ...sortedTags]
  }
  return sortedTags.length > 0 ? sortedTags : ['notag']
})

// Initialize selected tags with all available tags
onMounted(() => {
  selectedTags.value = [...availableTags.value]
})

// Get favorites count
const favoritesCount = computed(() => articleStore.favoritesCount)

// Tag selection methods
const isTagSelected = (tag: string) => selectedTags.value.includes(tag)

const toggleTag = (tag: string) => {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value = [...selectedTags.value, tag]
  }
}

const selectAllTags = () => {
  selectedTags.value = [...availableTags.value]
}

const deselectAllTags = () => {
  selectedTags.value = []
}

// Get filtered files based on current filter settings
const filteredFiles = computed(() => {
  const result: any[] = []
  
  const langFolder = props.fileSystem?.find(f => f.name === props.lang)
  if (!langFolder?.children) return result
  
  const processFiles = (items: any[]) => {
    for (const item of items) {
      if (item.children) {
        processFiles(item.children)
      } else if (item.name?.endsWith('.md')) {
        let include = true
        
        // 收藏筛选
        if (showFavoritesOnly.value && !articleStore.isFavorite(item.path)) {
          include = false
        }
        
        // 标签筛选
        if (include && selectedTags.value.length > 0) {
          const fileTags = item.tags || []
          const hasNoTags = !fileTags || fileTags.length === 0
          
          const tagMatch = selectedTags.value.some(tag => {
            if (tag === 'notag') return hasNoTags
            return fileTags.includes(tag)
          })
          
          if (!tagMatch) {
            include = false
          }
        } else if (selectedTags.value.length === 0) {
          // 没有选中任何标签时不显示任何文件
          include = false
        }
        
        if (include) {
          result.push(item)
        }
      }
    }
  }
  
  processFiles(langFolder.children)
  return result
})

// Download notes as zip
const downloadNotes = async () => {
  if (isDownloading.value || filteredFiles.value.length === 0) return
  isDownloading.value = true
  downloadMessage.value = ''
  
  try {
    const zip = new JSZip()
    const files = filteredFiles.value
    let successCount = 0
    
    for (const file of files) {
      try {
        // 正确的路径格式: ./notes/ + file.path
        // file.path 格式如 "zh/folder/file.md"
        const encodedPath = file.path.split('/').map((p: string) => encodeURIComponent(p)).join('/')
        const fetchUrl = `./notes/${encodedPath}`
        
        const res = await fetch(fetchUrl)
        if (res.ok) {
          const content = await res.text()
          // 保存时去掉语言前缀，保留相对路径
          const langPrefix = `${props.lang}/`
          const relativePath = file.path.startsWith(langPrefix) 
            ? file.path.slice(langPrefix.length) 
            : file.name
          zip.file(relativePath, content)
          successCount++
        } else {
          console.warn('Failed to fetch file:', fetchUrl, res.status)
        }
      } catch (e) {
        console.error('Failed to fetch file:', file.path, e)
      }
    }
    
    if (successCount === 0) {
      downloadMessage.value = props.lang === 'zh' ? '没有成功获取任何文件' : 'Failed to fetch any files'
      downloadSuccess.value = false
      return
    }
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sakura-notes-${props.lang}-${new Date().toISOString().split('T')[0]}.zip`
    a.click()
    URL.revokeObjectURL(url)
    
    downloadMessage.value = `${props.lang === 'zh' ? '下载成功' : 'Download success'}: ${successCount}/${files.length} ${props.lang === 'zh' ? '个文件' : 'files'}`
    downloadSuccess.value = true
  } catch (e) {
    console.error('Download error:', e)
    downloadMessage.value = props.lang === 'zh' ? '下载失败' : 'Download failed'
    downloadSuccess.value = false
  } finally {
    isDownloading.value = false
    setTimeout(() => { downloadMessage.value = '' }, 5000)
  }
}

// Download VUE learning notes
const downloadVueNotes = async () => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadMessage.value = ''
  
  try {
    const zip = new JSZip()
    
    let vueFiles: any[] = []
    if (props.labFolder?.children) {
      vueFiles = props.labFolder.children.filter((f: any) => f.name.endsWith('.md'))
    } else {
      // 根据语言查找 VUE 学习笔记文件夹
      const vueFolderName = props.lang === 'zh' ? 'VUE学习笔记' : 'VUE学习笔记'//由于配图复杂，暂时没有英文版，等待贡献
      const findVueFolder = (items: any[]): any[] => {
        for (const item of items) {
          if (item.name === vueFolderName && item.children) {
            return item.children.filter((f: any) => f.name.endsWith('.md'))
          }
          if (item.children) {
            const found = findVueFolder(item.children)
            if (found.length > 0) return found
          }
        }
        return []
      }
      vueFiles = findVueFolder(props.fileSystem || [])
    }
    
    if (vueFiles.length === 0) {
      downloadMessage.value = props.lang === 'zh' ? '未找到 VUE 学习笔记' : 'VUE notes not found'
      downloadSuccess.value = false
      return
    }
    
    let successCount = 0
    for (const file of vueFiles) {
      try {
        // 正确的路径格式
        const encodedPath = file.path.split('/').map((p: string) => encodeURIComponent(p)).join('/')
        const fetchUrl = `./notes/${encodedPath}`
        
        const res = await fetch(fetchUrl)
        if (res.ok) {
          const content = await res.text()
          zip.file(file.name, content)
          successCount++
        } else {
          console.warn('Failed to fetch VUE note:', fetchUrl, res.status)
        }
      } catch (e) {
        console.error('Failed to fetch VUE note:', file.path, e)
      }
    }
    
    if (successCount === 0) {
      downloadMessage.value = props.lang === 'zh' ? '没有成功获取任何文件' : 'Failed to fetch any files'
      downloadSuccess.value = false
      return
    }
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vue-learning-notes-${new Date().toISOString().split('T')[0]}.zip`
    a.click()
    URL.revokeObjectURL(url)
    
    downloadMessage.value = `${props.lang === 'zh' ? '下载成功' : 'Download success'}: ${successCount}/${vueFiles.length} ${props.lang === 'zh' ? '个文件' : 'files'}`
    downloadSuccess.value = true
  } catch (e) {
    console.error('Download error:', e)
    downloadMessage.value = props.lang === 'zh' ? '下载失败' : 'Download failed'
    downloadSuccess.value = false
  } finally {
    isDownloading.value = false
    setTimeout(() => { downloadMessage.value = '' }, 5000)
  }
}

// Helper to get all source files from tree
const getAllSourceFiles = (nodes: any[]): string[] => {
  const files: string[] = []
  const traverse = (items: any[]) => {
    for (const item of items) {
      if (item.type === 'file') {
        files.push(item.path)
      } else if (item.children) {
        traverse(item.children)
      }
    }
  }
  traverse(nodes)
  return files
}

// Convert file path to raw file path format
// e.g., "components/AppHeader.vue" -> "components_AppHeader.vue.txt"
const toRawFilePath = (filePath: string): string => {
  return filePath.replace(/\//g, '_') + '.txt'
}

const getUserNotesKey = () => `sakura_source_code_notes_user_${props.lang}`

// Load user notes from localStorage
const loadUserNotes = (): Record<string, Array<{line: number, content: string}>> => {
  try {
    const saved = localStorage.getItem(getUserNotesKey())
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('Failed to load user notes:', e)
  }
  return {}
}

// Download single file
const downloadSingleFile = async (file: any) => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadMessage.value = ''
  
  try {
    let fetchUrl = ''
    let fileName = file.name
    
    // Check if it is a source file or a note
    // Source files usually start with src/ or are specific root files
    const isSource = file.isSource || file.path.startsWith('src/') || ['package.json', 'vite.config.ts', 'tsconfig.json', 'index.html'].includes(file.path)
    
    if (isSource) {
        const baseUrl = (import.meta as any).env?.BASE_URL || './'
        const rawFileName = toRawFilePath(file.path)
        fetchUrl = `${baseUrl}raw/${rawFileName}`
    } else {
        // It's a note
        const encodedPath = file.path.split('/').map((p: string) => encodeURIComponent(p)).join('/')
        fetchUrl = `./notes/${encodedPath}`
    }

    const res = await fetch(fetchUrl)
    if (res.ok) {
        const content = await res.text()
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
        downloadMessage.value = props.lang === 'zh' ? '下载成功' : 'Download success'
        downloadSuccess.value = true
    } else {
        throw new Error(`Fetch failed: ${res.status}`)
    }
  } catch (e) {
    console.error('Download error:', e)
    downloadMessage.value = props.lang === 'zh' ? '下载失败' : 'Download failed'
    downloadSuccess.value = false
  } finally {
    isDownloading.value = false
    setTimeout(() => { downloadMessage.value = '' }, 5000)
  }
}

// Download source code with optional embedded notes
const downloadSourceCodeWithNotes = async (withNotes: boolean) => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadMessage.value = ''
  
  try {
    const zip = new JSZip()
    let successCount = 0
    
    // Get all source files dynamically from fileSystem
    const sourceNode = props.fileSystem?.find(f => f.name === 'Project Source Code')
    const sourceFiles = sourceNode ? getAllSourceFiles(sourceNode.children || []) : []
    
    if (sourceFiles.length === 0) {
       throw new Error('No source files found in file system')
    }

    // Load preset notes for embedding (only if withNotes is true)
    let presetNotes: Record<string, Array<{ line: number; content: string; match?: string; matchRegex?: string; occurrence?: number; offset?: number }>> = {}
    let userNotes: Record<string, Array<{line: number, content: string}>> = {}
    
    if (withNotes) {
      // Load preset notes from server
      try {
        const baseUrl = (import.meta as any).env?.BASE_URL || './'
        const notesRes = await fetch(`${baseUrl}data/source-notes-preset.${props.lang}.json`)
        if (notesRes.ok) {
          const data = await notesRes.json()
          presetNotes = data.notes || {}
        }
      } catch (e) {
        console.warn('Failed to load preset notes:', e)
      }
      
      // Load user notes from localStorage
      userNotes = loadUserNotes()
    }
    
    // Fetch and process source files
    for (const filePath of sourceFiles) {
      try {
        const baseUrl = (import.meta as any).env?.BASE_URL || './'
        // Use the correct raw file naming: components/AppHeader.vue -> components_AppHeader.vue.txt
        const rawFileName = toRawFilePath(filePath)
        const fetchUrl = `${baseUrl}raw/${rawFileName}`
        
        const res = await fetch(fetchUrl)
        if (res.ok) {
          let content = await res.text()
          
          // Embed notes as comments if available and withNotes is true
          if (withNotes) {
            const lines = content.split('\n')
            const ext = filePath.split('.').pop()?.toLowerCase()
            const commentStyle = getCommentStyle(ext || '')
            
            // Merge preset notes and user notes for this file
            const filePresetNotes = presetNotes[filePath] || []
            const fileUserNotes = userNotes[filePath] || []
            
            // Combine both with different markers
            type NoteWithType = { line: number, content: string, type: 'preset' | 'user' }
            const resolvedPresetMap = buildPresetNoteMap(filePresetNotes as any, lines)
            const allNotes: NoteWithType[] = [
              ...Array.from(resolvedPresetMap.entries()).map(([line, content]) => ({ line, content, type: 'preset' as const })),
              ...fileUserNotes.map(n => ({ ...n, type: 'user' as const }))
            ]
            
            if (allNotes.length > 0) {
              // Insert notes from bottom to top to preserve line numbers
              const sortedNotes = allNotes.sort((a, b) => b.line - a.line)
              for (const note of sortedNotes) {
                if (note.line > 0 && note.line <= lines.length && note.content) {
                  const marker = note.type === 'user' ? '👤 [My Note]' : '💡 [Note]'
                  const commentedNote = formatNoteAsComment(note.content, commentStyle, marker)
                  lines.splice(note.line, 0, commentedNote)
                }
              }
              content = lines.join('\n')
            }
          }
          
          zip.file(filePath, content)
          successCount++
        } else {
          console.warn('Failed to fetch source:', fetchUrl, res.status)
        }
      } catch (e) {
        console.error('Failed to fetch source:', filePath, e)
      }
    }
    
    if (successCount === 0) {
      downloadMessage.value = props.lang === 'zh' ? '没有成功获取任何文件' : 'Failed to fetch any files'
      downloadSuccess.value = false
      return
    }
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const suffix = withNotes ? '-with-notes' : ''
    a.download = `sakura-notes-source${suffix}-${new Date().toISOString().split('T')[0]}.zip`
    a.click()
    URL.revokeObjectURL(url)
    
    downloadMessage.value = `${props.lang === 'zh' ? '源码下载成功' : 'Source download success'}: ${successCount} ${props.lang === 'zh' ? '个文件' : 'files'}`
    downloadSuccess.value = true
  } catch (e) {
    console.error('Download error:', e)
    downloadMessage.value = props.lang === 'zh' ? '下载失败' : 'Download failed'
    downloadSuccess.value = false
  } finally {
    isDownloading.value = false
    setTimeout(() => { downloadMessage.value = '' }, 5000)
  }
}

// Wrapper functions for download buttons
const downloadSourceCode = () => downloadSourceCodeWithNotes(false)
const downloadSourceCodeWithNotesBtn = () => downloadSourceCodeWithNotes(true)

// Get comment style based on file extension
const getCommentStyle = (ext: string): { start: string, end: string, line: string } => {
  switch (ext) {
    case 'html':
    case 'vue':
      return { start: '<!-- ', end: ' -->', line: '// ' }
    case 'css':
      return { start: '/* ', end: ' */', line: '// ' }
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'json':
      return { start: '/* ', end: ' */', line: '// ' }
    default:
      return { start: '# ', end: '', line: '# ' }
  }
}

// Format note content as comment
const formatNoteAsComment = (content: string, style: { start: string, end: string, line: string }, marker: string = '📝 [Note]'): string => {
  const lines = content.split('\n')
  if (lines.length === 1) {
    return `${style.line}${marker} ${content}`
  }
  return lines.map((line, i) => {
    if (i === 0) return `${style.line}${marker} ${line}`
    return `${style.line}    ${line}`
  }).join('\n')
}
</script>
