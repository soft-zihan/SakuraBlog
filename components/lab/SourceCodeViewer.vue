<template>
  <div class="flex h-full min-h-[600px] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
    <!-- Left: File Tree -->
    <div class="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800/50">
      <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>📁</span> {{ isZh ? '项目结构' : 'Project Structure' }}
        </h3>
      </div>
      <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
        <SourceFileTree 
          :nodes="projectTree" 
          :selected-path="selectedFile?.path"
          @select="selectFile"
        />
      </div>
    </div>

    <!-- Center: Code View -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- File Tab Bar -->
      <div class="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-gray-700 overflow-x-auto">
        <div v-if="selectedFile" class="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] rounded text-sm">
          <span>{{ getFileIcon(selectedFile.name) }}</span>
          <span class="text-gray-300 font-mono text-xs">{{ selectedFile.name }}</span>
        </div>
        <div v-else class="text-gray-500 text-sm italic">
          {{ isZh ? '选择文件查看源码' : 'Select a file to view source' }}
        </div>
        <div class="ml-auto flex items-center gap-2">
          <button 
            @click="showNotes = !showNotes"
            class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
            :class="showNotes ? 'bg-sakura-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'"
          >
            <span>📝</span>
            {{ isZh ? '笔记' : 'Notes' }}
          </button>
        </div>
      </div>

      <!-- Code Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Code Area -->
        <div class="flex-1 overflow-auto bg-[#1e1e1e] custom-scrollbar relative" ref="codeContainer">
          <div v-if="selectedFile && fileContent" class="flex min-w-max">
            <!-- Line Numbers -->
            <div class="flex-shrink-0 py-4 pl-4 pr-2 text-right select-none bg-[#1e1e1e] sticky left-0 z-10">
              <div 
                v-for="(_, idx) in fileLines" 
                :key="idx" 
                class="font-mono text-xs leading-6 cursor-pointer transition-colors"
                :class="hasNoteAtLine(idx + 1) ? 'text-sakura-400 font-bold' : 'text-gray-600 hover:text-gray-400'"
                @click="toggleNoteAtLine(idx + 1)"
              >
                {{ idx + 1 }}
              </div>
            </div>
            <!-- Code -->
            <pre class="flex-1 py-4 pr-4 text-sm font-mono leading-6 overflow-visible"><code v-html="highlightedCode" class="hljs"></code></pre>
          </div>
          <div v-else class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <div class="text-4xl mb-4">📂</div>
              <p>{{ isZh ? '从左侧选择文件开始阅读' : 'Select a file from the left to start reading' }}</p>
            </div>
          </div>
        </div>

        <!-- Notes Panel (Right Side) -->
        <div 
          v-if="showNotes && selectedFile" 
          class="w-80 flex-shrink-0 border-l border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col"
        >
          <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300">
              📝 {{ isZh ? '代码笔记' : 'Code Notes' }}
            </h4>
            <button @click="showNotes = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>
          <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            <div v-if="currentFileNotes.length === 0" class="text-center text-gray-400 py-8 text-sm">
              <p>{{ isZh ? '点击行号添加笔记' : 'Click line numbers to add notes' }}</p>
            </div>
            <div 
              v-for="note in currentFileNotes" 
              :key="note.line"
              class="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono text-sakura-500 bg-sakura-50 dark:bg-sakura-900/30 px-2 py-0.5 rounded">
                  L{{ note.line }}
                </span>
                <button 
                  @click="deleteNote(note.line)"
                  class="text-gray-400 hover:text-red-500 text-xs"
                >
                  🗑️
                </button>
              </div>
              <textarea
                v-model="note.content"
                @input="saveNotes"
                class="w-full text-sm bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 min-h-[60px]"
                :placeholder="isZh ? '在此输入笔记...' : 'Type your note here...'"
              ></textarea>
            </div>
          </div>
          <div class="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 text-center">
            {{ isZh ? '笔记自动保存到本地' : 'Notes auto-saved locally' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'

// Register languages
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)

// Child component for file tree
import SourceFileTree from './SourceFileTree.vue'

interface SourceFile {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: SourceFile[]
}

interface CodeNote {
  line: number
  content: string
}

interface FileNotes {
  [filePath: string]: CodeNote[]
}

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

// Project file tree (hardcoded for this project)
const projectTree = ref<SourceFile[]>([
  {
    name: 'Root',
    path: '',
    type: 'directory',
    children: [
      { name: 'index.html', path: 'index.html', type: 'file' },
      { name: 'index.tsx', path: 'index.tsx', type: 'file' },
      { name: 'App.vue', path: 'App.vue', type: 'file' },
      { name: 'constants.ts', path: 'constants.ts', type: 'file' },
      { name: 'types.ts', path: 'types.ts', type: 'file' },
      { name: 'vite.config.ts', path: 'vite.config.ts', type: 'file' },
      { name: 'package.json', path: 'package.json', type: 'file' },
      { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file' },
      {
        name: 'components',
        path: 'components',
        type: 'directory',
        children: [
          { name: 'AppHeader.vue', path: 'components/AppHeader.vue', type: 'file' },
          { name: 'AppSidebar.vue', path: 'components/AppSidebar.vue', type: 'file' },
          { name: 'ArticleCard.vue', path: 'components/ArticleCard.vue', type: 'file' },
          { name: 'FileTree.vue', path: 'components/FileTree.vue', type: 'file' },
          { name: 'FolderView.vue', path: 'components/FolderView.vue', type: 'file' },
          { name: 'SearchModal.vue', path: 'components/SearchModal.vue', type: 'file' },
          { name: 'SettingsModal.vue', path: 'components/SettingsModal.vue', type: 'file' },
          { name: 'WriteEditor.vue', path: 'components/WriteEditor.vue', type: 'file' },
          { name: 'MusicPlayer.vue', path: 'components/MusicPlayer.vue', type: 'file' },
          { name: 'GiscusComments.vue', path: 'components/GiscusComments.vue', type: 'file' },
          { name: 'PetalBackground.vue', path: 'components/PetalBackground.vue', type: 'file' },
          { name: 'WallpaperLayer.vue', path: 'components/WallpaperLayer.vue', type: 'file' },
          {
            name: 'lab',
            path: 'components/lab',
            type: 'directory',
            children: [
              { name: 'index.ts', path: 'components/lab/index.ts', type: 'file' },
              { name: 'LabDashboard.vue', path: 'components/lab/LabDashboard.vue', type: 'file' },
              { name: 'LabProjectTour.vue', path: 'components/lab/LabProjectTour.vue', type: 'file' },
            ]
          },
          {
            name: 'petal',
            path: 'components/petal',
            type: 'directory',
            children: [
              { name: 'usePetals.ts', path: 'components/petal/usePetals.ts', type: 'file' },
            ]
          }
        ]
      },
      {
        name: 'composables',
        path: 'composables',
        type: 'directory',
        children: [
          { name: 'index.ts', path: 'composables/index.ts', type: 'file' },
          { name: 'useArticleMeta.ts', path: 'composables/useArticleMeta.ts', type: 'file' },
          { name: 'useBackup.ts', path: 'composables/useBackup.ts', type: 'file' },
          { name: 'useCodeModal.ts', path: 'composables/useCodeModal.ts', type: 'file' },
          { name: 'useContentClick.ts', path: 'composables/useContentClick.ts', type: 'file' },
          { name: 'useContentRenderer.ts', path: 'composables/useContentRenderer.ts', type: 'file' },
          { name: 'useFile.ts', path: 'composables/useFile.ts', type: 'file' },
          { name: 'useGitHubPublish.ts', path: 'composables/useGitHubPublish.ts', type: 'file' },
          { name: 'useLightbox.ts', path: 'composables/useLightbox.ts', type: 'file' },
          { name: 'useMarkdown.ts', path: 'composables/useMarkdown.ts', type: 'file' },
          { name: 'useRawEditor.ts', path: 'composables/useRawEditor.ts', type: 'file' },
          { name: 'useSearch.ts', path: 'composables/useSearch.ts', type: 'file' },
          { name: 'useSelectionMenu.ts', path: 'composables/useSelectionMenu.ts', type: 'file' },
          { name: 'useWallpapers.ts', path: 'composables/useWallpapers.ts', type: 'file' },
        ]
      },
      {
        name: 'stores',
        path: 'stores',
        type: 'directory',
        children: [
          { name: 'index.ts', path: 'stores/index.ts', type: 'file' },
          { name: 'appStore.ts', path: 'stores/appStore.ts', type: 'file' },
          { name: 'articleStore.ts', path: 'stores/articleStore.ts', type: 'file' },
          { name: 'learningStore.ts', path: 'stores/learningStore.ts', type: 'file' },
          { name: 'musicStore.ts', path: 'stores/musicStore.ts', type: 'file' },
        ]
      },
      {
        name: 'scripts',
        path: 'scripts',
        type: 'directory',
        children: [
          { name: 'generate-tree.js', path: 'scripts/generate-tree.js', type: 'file' },
          { name: 'generate-raw.js', path: 'scripts/generate-raw.js', type: 'file' },
          { name: 'generate-music.js', path: 'scripts/generate-music.js', type: 'file' },
          { name: 'generate-wallpapers.js', path: 'scripts/generate-wallpapers.js', type: 'file' },
        ]
      }
    ]
  }
])

const selectedFile = ref<SourceFile | null>(null)
const fileContent = ref<string>('')
const showNotes = ref(true)
const codeContainer = ref<HTMLElement | null>(null)

// Notes stored in localStorage
const NOTES_STORAGE_KEY = 'sakura_source_code_notes'
const allNotes = ref<FileNotes>({})

// Load notes from localStorage
onMounted(() => {
  const saved = localStorage.getItem(NOTES_STORAGE_KEY)
  if (saved) {
    try {
      allNotes.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse saved notes:', e)
    }
  }
})

// Current file notes
const currentFileNotes = computed(() => {
  if (!selectedFile.value) return []
  return allNotes.value[selectedFile.value.path] || []
})

// File lines
const fileLines = computed(() => fileContent.value.split('\n'))

// Syntax highlighted code
const highlightedCode = computed(() => {
  if (!fileContent.value || !selectedFile.value) return ''
  
  const ext = selectedFile.value.name.split('.').pop()?.toLowerCase()
  let language = 'plaintext'
  
  switch (ext) {
    case 'vue':
    case 'html':
      language = 'xml'
      break
    case 'ts':
    case 'tsx':
      language = 'typescript'
      break
    case 'js':
    case 'jsx':
      language = 'javascript'
      break
    case 'css':
      language = 'css'
      break
    case 'json':
      language = 'json'
      break
    case 'sh':
      language = 'bash'
      break
  }
  
  try {
    return hljs.highlight(fileContent.value, { language }).value
  } catch {
    return fileContent.value
  }
})

// Check if line has a note
const hasNoteAtLine = (line: number) => {
  return currentFileNotes.value.some(n => n.line === line)
}

// Toggle note at line
const toggleNoteAtLine = (line: number) => {
  if (!selectedFile.value) return
  
  const path = selectedFile.value.path
  if (!allNotes.value[path]) {
    allNotes.value[path] = []
  }
  
  const existingIdx = allNotes.value[path].findIndex(n => n.line === line)
  if (existingIdx >= 0) {
    // If note exists and empty, remove it
    if (!allNotes.value[path][existingIdx].content.trim()) {
      allNotes.value[path].splice(existingIdx, 1)
    }
  } else {
    // Add new note
    allNotes.value[path].push({ line, content: '' })
    allNotes.value[path].sort((a, b) => a.line - b.line)
  }
  
  saveNotes()
}

// Delete note
const deleteNote = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  if (allNotes.value[path]) {
    allNotes.value[path] = allNotes.value[path].filter(n => n.line !== line)
    saveNotes()
  }
}

// Save notes to localStorage
const saveNotes = () => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes.value))
}

// Get file icon
const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'vue': return '💚'
    case 'ts':
    case 'tsx': return '🔷'
    case 'js':
    case 'jsx': return '🟨'
    case 'css': return '🎨'
    case 'html': return '🌐'
    case 'json': return '📋'
    case 'md': return '📝'
    default: return '📄'
  }
}

// Select file and load content
const selectFile = async (file: SourceFile) => {
  if (file.type !== 'file') return
  selectedFile.value = file
  
  try {
    // Try to fetch from raw folder first
    const rawPath = `./raw/${file.path.replace(/\//g, '_').replace(/\./g, '_')}.txt`
    let res = await fetch(rawPath)
    
    if (!res.ok) {
      // Fallback to direct file path
      res = await fetch(`./${file.path}`)
    }
    
    if (res.ok) {
      fileContent.value = await res.text()
    } else {
      fileContent.value = `// Could not load file: ${file.path}`
    }
  } catch (e) {
    fileContent.value = `// Error loading file: ${e}`
  }
}

// Export notes for backup
const exportNotes = () => {
  const blob = new Blob([JSON.stringify(allNotes.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sakura-source-notes.json'
  a.click()
  URL.revokeObjectURL(url)
}

// Import notes from backup
const importNotes = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      allNotes.value = { ...allNotes.value, ...imported }
      saveNotes()
    } catch (err) {
      console.error('Failed to import notes:', err)
    }
  }
  reader.readAsText(file)
}

// Expose for parent backup functionality
defineExpose({
  exportNotes,
  importNotes,
  allNotes
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
