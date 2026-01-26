<template>
  <div class="flex h-full min-h-[600px] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
    <!-- Left: File Tree (collapsible in compact mode) -->
    <div 
      v-if="!isMobile"
      class="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800/50 transition-all duration-300"
      :class="fileTreeVisible ? 'w-64' : (compact ? 'w-10' : 'w-64')"
    >
      <div class="p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
        <h3 v-if="fileTreeVisible" class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>📁</span> {{ isZh ? '项目结构' : 'Project' }}
        </h3>
        <button 
          v-if="compact"
          @click="fileTreeVisible = !fileTreeVisible"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :title="fileTreeVisible ? (isZh ? '收起' : 'Collapse') : (isZh ? '展开' : 'Expand')"
        >
          <svg class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': !fileTreeVisible }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>
      <div v-if="fileTreeVisible" class="flex-1 overflow-y-auto custom-scrollbar p-2">
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
      <div class="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto" :class="isDark ? 'bg-[#252526] border-gray-700' : 'bg-gray-100 border-gray-300'">
        <button
          v-if="isMobile"
          @click="mobileFileTreeOpen = true"
          class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
          :class="isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          <span>📁</span>
          {{ isZh ? '文件' : 'Files' }}
        </button>
        <div v-if="selectedFile" class="flex items-center gap-2 px-3 py-1.5 rounded text-sm" :class="isDark ? 'bg-[#1e1e1e]' : 'bg-white shadow-sm'">
          <span>{{ getFileIcon(selectedFile.name) }}</span>
          <span class="font-mono text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ selectedFile.name }}</span>
        </div>
        <div v-if="selectedFile" class="text-xs px-2 py-1 rounded" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
          {{ isZh ? '点击行号添加笔记' : 'Click line number to add note' }}
        </div>
        <div v-else class="text-sm italic" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          {{ isZh ? '选择文件查看源码' : 'Select a file to view source' }}
        </div>
        <div class="ml-auto flex items-center gap-3">
          <!-- Preset Notes Toggle -->
          <button 
            @click="showPresetNotes = !showPresetNotes"
            class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
            :class="showPresetNotes ? 'bg-cyan-500 text-white' : (isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')"
          >
            <span>💡</span>
            {{ isZh ? '预置笔记' : 'Preset Notes' }}
          </button>
          <button 
            @click="showNotes = !showNotes"
            class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
            :class="showNotes ? 'bg-[var(--primary-500)] text-white' : (isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')"
          >
            <span>📝</span>
            {{ isZh ? '用户笔记' : 'User Notes' }}
          </button>
          <!-- Submit Notes to GitHub -->
          <button 
            v-if="hasUserNotes && hasToken"
            @click="submitNotesToGitHub"
            :disabled="isSubmitting"
            class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600"
          >
            <span v-if="isSubmitting" class="animate-spin">⏳</span>
            <span v-else>📤</span>
            {{ isZh ? '提交笔记' : 'Submit' }}
          </button>
        </div>
      </div>

      <!-- File Introduction Bar -->
      <div 
        v-if="selectedFile && currentFileIntro" 
        class="px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/20 border-b border-cyan-200 dark:border-cyan-700/50"
      >
        <div class="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words leading-6">
          <span class="mr-2">💡</span><span>{{ currentFileIntro }}</span>
        </div>
      </div>

      <!-- Code Content with Inline Notes -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Main Code Area -->
        <div 
          class="flex-1 overflow-auto custom-scrollbar relative" 
          :class="isDark ? 'bg-[#1e1e1e]' : 'bg-[#fafafa]'"
          ref="codeContainer" 
        >
          <div v-if="selectedFile && fileContent" class="py-4">
            <!-- Render each line with possible inline note -->
            <template v-for="(line, idx) in fileLines" :key="idx">
              <!-- Drop indicator line -->
              <div 
                v-if="showNotes && dragOverLine === idx + 1 && draggingNoteLine !== idx + 1"
                class="h-1 mx-4 bg-[var(--primary-400)] rounded-full animate-pulse"
              ></div>
              
              <!-- Code Line -->
              <div 
                class="flex group relative"
                :class="[
                  isDark ? 'hover:bg-[#2a2d2e]' : 'hover:bg-gray-100',
                  { 'bg-[var(--primary-900)]/20 dark:bg-[var(--primary-900)]/20': hasNonEmptyUserNoteAtLine(idx + 1) && !isLineCollapsed(idx + 1) }
                ]"
                @dragover.prevent="onDragOver($event, idx + 1)"
                @dragleave="onDragLeave"
                @drop.prevent="onDrop($event, idx + 1)"
              >
                <!-- Line Number - always at the left, click to toggle user notes -->
                <div 
                  class="flex-shrink-0 w-12 pr-2 text-right select-none font-mono text-xs leading-6 cursor-pointer transition-colors"
                  :class="getLineNumberClass(idx + 1)"
                  @click="toggleUserNoteAtLine(idx + 1)"
                >
                  {{ idx + 1 }}</div>
                <!-- Code Content with indent guides -->
                <pre 
                  class="flex-1 pr-4 text-sm font-mono leading-6 whitespace-pre relative"
                  :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                ><!-- Indent Guide Lines at the beginning of code --><span class="inline-block relative" :style="{ width: getIndentWidth(line) + 'px', minWidth: '0' }"><template v-for="level in getIndentLevels(line)" :key="'indent-' + level"><span class="absolute top-0 bottom-0 w-px" :style="{ left: (level * indentSize) + 'px' }" :class="getIndentGuideClass(level)"></span></template></span><code v-html="highlightedLines[idx] || sanitizeHtml(line.replace(/^\s+/, '') || ' ')" :class="isDark ? 'hljs-dark' : 'hljs-light'"></code></pre>
              </div>
              
              <!-- Preset Note (below the line) - Blue/Cyan theme - controlled by global toggle only -->
              <div 
                v-if="showPresetNotes && hasPresetNoteAtLine(idx + 1)"
                class="flex mx-4 my-1"
              >
                <div class="w-14"></div>
                <div class="flex-1 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700/50 shadow-sm">
                  <div class="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{{ getPresetNoteContent(idx + 1) }}</div>
                </div>
              </div>
              
              <!-- User Note (below the line) - Pink/Sakura theme -->
              <div 
                v-if="showNotes && hasUserNoteAtLine(idx + 1) && !isLineCollapsed(idx + 1)"
                class="flex mx-4 my-1"
                draggable="true"
                @dragstart="onDragStart($event, idx + 1)"
                @dragend="onDragEnd"
              >
                <div class="w-14"></div>
                <div class="flex-1 bg-gradient-to-r from-[var(--primary-50)] to-amber-50 dark:from-[var(--primary-900)]/30 dark:to-amber-900/20 rounded-lg p-3 border border-[var(--primary-200)] dark:border-[var(--primary-700)]/50 shadow-sm group relative">
                  <!-- Drag Handle -->
                  <div class="absolute -left-6 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[var(--primary-400)]">
                    ⋮⋮
                  </div>
                  <div class="flex items-end justify-end gap-2 mb-1">
                    <button 
                      @click="deleteUserNote(idx + 1)"
                      class="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      🗑️
                    </button>
                  </div>
                  <textarea
                    :value="getUserNoteContent(idx + 1)"
                    @input="handleNoteInput($event, idx + 1)"
                    class="w-full text-sm bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 overflow-hidden"
                    :placeholder="isZh ? '在此输入笔记...' : 'Type your note here...'"
                    rows="1"
                  ></textarea>
                </div>
              </div>
            </template>
            
            <!-- Drop indicator at the end -->
            <div 
              v-if="showNotes && dragOverLine === fileLines.length + 1"
              class="h-1 mx-4 bg-[var(--primary-400)] rounded-full animate-pulse"
            ></div>
          </div>
          <div v-else class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <div class="text-4xl mb-4">📂</div>
              <p>{{ isZh ? '从左侧选择文件开始阅读' : 'Select a file from the left to start reading' }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Minimap (hidden in compact mode) -->
        <CodeMinimap 
          v-if="!isMobile && !compact && selectedFile && fileContent && fileLines.length > 20"
          :lines="fileLines"
          :code-container="codeContainer"
          :has-note="hasNonEmptyNoteAtLine"
        />
      </div>
      
      <!-- Bottom hint -->
      <div v-if="selectedFile && showNotes" class="px-4 py-2 bg-[#252526] border-t border-gray-700 text-xs text-gray-500 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded bg-cyan-400/50"></span>
            {{ isZh ? '预置笔记' : 'Preset' }}
          </span>
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded bg-[var(--primary-400)]/50"></span>
            {{ isZh ? '我的笔记' : 'My Notes' }}
          </span>
        </div>
        <span>💡 {{ isZh ? '点击行号添加/折叠笔记，拖拽可移动' : 'Click line number to add/toggle, drag to move' }}</span>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="isMobile && mobileFileTreeOpen" class="fixed inset-0 z-[180]">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="mobileFileTreeOpen = false"></div>
      <div class="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col">
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <span>📁</span> {{ isZh ? '项目结构' : 'Project' }}
          </div>
          <button @click="mobileFileTreeOpen = false" class="text-gray-400 hover:text-[var(--primary-500)]">✕</button>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
          <SourceFileTree 
            :nodes="projectTree" 
            :selected-path="selectedFile?.path"
            @select="selectFile"
          />
        </div>
      </div>
    </div>
  </Teleport>
  
  <!-- Submit Result Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div 
        v-if="submitMessage" 
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-xl text-sm font-medium"
        :class="submitSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      >
        {{ submitMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import { useGitHubPublish } from '../../composables/useGitHubPublish'
import { useAppStore } from '../../stores/appStore'
import { sanitizeHtml } from '../../utils/sanitize'
import { buildPresetNoteMap } from '../../utils/i18nText'

// Register languages
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)

// Child component for file tree
import SourceFileTree from './SourceFileTree.vue'
import CodeMinimap from './CodeMinimap.vue'

interface SourceFile {
  name: string
  path: string
  type: 'file' | 'directory'
  fetchPath?: string
  children?: SourceFile[]
}

interface CodeNote {
  line: number
  content: string
  match?: string
  matchRegex?: string
  occurrence?: number
  offset?: number
}

interface FileNotes {
  [filePath: string]: CodeNote[]
}

interface FileIntros {
  [filePath: string]: string
}

interface CollapsedState {
  [filePath: string]: number[] // array of collapsed line numbers
}

interface FoldRange {
  start: number
  end: number
  type: string // 'function' | 'class' | 'block' etc.
}

interface FoldedState {
  [filePath: string]: number[] // array of folded start line numbers
}

const props = defineProps<{
  lang: 'en' | 'zh'
  compact?: boolean // Compact mode for dual-column view: hide minimap, collapse file tree by default
}>()

const isZh = computed(() => props.lang === 'zh')
const compact = computed(() => props.compact || false)

const isMobile = ref(false)
const mobileFileTreeOpen = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) mobileFileTreeOpen.value = false
}

// App Store for theme
const appStore = useAppStore()
const isDark = computed(() => appStore.isDark)

// Toggle for preset notes visibility
const showPresetNotes = ref(true)

// GitHub API
const { hasToken: checkHasToken, uploadFile, getToken } = useGitHubPublish()
const hasToken = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)

// Project file tree (fetched from files.json)
const projectTree = ref<SourceFile[]>([
  { name: 'index.html', path: 'index.html', type: 'file' },
  { name: 'index.tsx', path: 'index.tsx', type: 'file' },
  { 
    name: 'src', 
    path: 'src', 
    type: 'directory',
    children: [
       { name: 'App.vue', path: 'src/App.vue', type: 'file' },
       { name: 'main.ts', path: 'src/main.ts', type: 'file' }
    ]
  }
])

// ... existing onMounted ...
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  hasToken.value = checkHasToken()
  
  await loadPresetNotes()
  loadUserNotes()
  loadCollapsedState()
  loadFoldedState()
  
  // Fetch files.json to populate project tree
  try {
    const res = await fetch('./data/files.json')
    if (res.ok) {
      const allFiles = await res.json()
      // Find "Project Source Code" node
      const sourceNode = allFiles.find((node: any) => node.name === 'Project Source Code')
      if (sourceNode && sourceNode.children) {
        projectTree.value = sourceNode.children
      }
    }
  } catch (e) {
    console.error('Failed to load source tree, using default:', e)
    // Fallback is already set in ref initialization
  }
})

watch(() => props.lang, async () => {
  await loadPresetNotes()
  loadUserNotes()
  loadCollapsedState()
  loadFoldedState()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const selectedFile = ref<SourceFile | null>(null)
const fileContent = ref<string>('')
const showNotes = ref(true)
// File tree visibility - controlled by compact prop, can be toggled in compact mode
const fileTreeVisible = ref(true)
const codeContainer = ref<HTMLElement | null>(null)

// Initialize fileTreeVisible based on compact mode
watch(() => props.compact, (isCompact: boolean | undefined) => {
  if (isCompact) {
    fileTreeVisible.value = false
  }
}, { immediate: true })

// Drag state
const draggingNoteLine = ref<number | null>(null)
const dragOverLine = ref<number | null>(null)

const getUserNotesKey = () => `sakura_source_code_notes_user_${props.lang}`
const getCollapsedKey = () => `sakura_source_code_notes_collapsed_${props.lang}`
const getFoldedKey = () => `sakura_source_code_folded_${props.lang}`
const getPresetVersionKey = () => `sakura_source_code_notes_preset_version_${props.lang}`

const getPresetNotesUrl = () => {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/'
  return `${baseUrl}data/source-notes-preset.${props.lang}.json`
}

// Preset notes (from server)
const presetNotes = ref<FileNotes>({})
const presetIntros = ref<FileIntros>({})

// User notes (from localStorage)
const userNotes = ref<FileNotes>({})

// Collapsed state (from localStorage) - for notes visibility
const collapsedState = ref<CollapsedState>({})

// Folded state (from localStorage) - for code folding
const foldedState = ref<FoldedState>({})

// Load preset notes from server or local import
const loadPresetNotes = async () => {
  try {
    const res = await fetch(getPresetNotesUrl())
    if (!res.ok) return
    const data: any = await res.json()
    
    if (data) {
      const serverVersion = data.version || '1.0.0'
      
      // Store preset notes and intros
      presetNotes.value = {}
      presetIntros.value = data.intros || {}
      
      // Convert notes format: filter out line 0 (now stored as intro)
      if (data.notes) {
        for (const [filePath, notes] of Object.entries(data.notes)) {
          const filteredNotes = (notes as CodeNote[]).filter((n: CodeNote) => n.line !== 0)
          if (filteredNotes.length > 0) {
            presetNotes.value[filePath] = filteredNotes
          }
        }
      }
      
      // Update version marker
      localStorage.setItem(getPresetVersionKey(), serverVersion)
    }
  } catch (e) {
    console.error('Failed to load preset notes:', e)
  }
}

// Load user notes from localStorage
const loadUserNotes = () => {
  const saved = localStorage.getItem(getUserNotesKey())
  if (saved) {
    try {
      userNotes.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse user notes:', e)
    }
  }
}

// Load collapsed state from localStorage
const loadCollapsedState = () => {
  const saved = localStorage.getItem(getCollapsedKey())
  if (saved) {
    try {
      collapsedState.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse collapsed state:', e)
    }
  }
}

// Load folded state from localStorage
const loadFoldedState = () => {
  const saved = localStorage.getItem(getFoldedKey())
  if (saved) {
    try {
      foldedState.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse folded state:', e)
    }
  }
}

// Save user notes
const saveUserNotes = () => {
  localStorage.setItem(getUserNotesKey(), JSON.stringify(userNotes.value))
}

// Save collapsed state
const saveCollapsedState = () => {
  localStorage.setItem(getCollapsedKey(), JSON.stringify(collapsedState.value))
}

// Save folded state
const saveFoldedState = () => {
  localStorage.setItem(getFoldedKey(), JSON.stringify(foldedState.value))
}

// Current file intro
const currentFileIntro = computed(() => {
  if (!selectedFile.value) return ''
  return presetIntros.value[selectedFile.value.path] || ''
})

// Current file notes
const currentPresetNotes = computed(() => {
  if (!selectedFile.value) return []
  return presetNotes.value[selectedFile.value.path] || []
})

const currentUserNotes = computed(() => {
  if (!selectedFile.value) return []
  return userNotes.value[selectedFile.value.path] || []
})

const currentCollapsedLines = computed(() => {
  if (!selectedFile.value) return []
  return collapsedState.value[selectedFile.value.path] || []
})

const currentFoldedLines = computed(() => {
  if (!selectedFile.value) return []
  return foldedState.value[selectedFile.value.path] || []
})

// Check if user has any notes
const hasUserNotes = computed(() => {
  return Object.values(userNotes.value).some((notes: CodeNote[]) => notes.length > 0)
})

// File lines
const fileLines = computed((): string[] => fileContent.value.split('\n'))

const highlightedCache = new Map<string, { content: string; lines: string[] }>()

const highlightedLines = computed((): string[] => {
  if (!selectedFile.value) return []
  const key = selectedFile.value.path
  const content = fileContent.value
  const cached = highlightedCache.get(key)
  if (cached && cached.content === content) return cached.lines

  const language = getLanguage()
  const lines = fileLines.value.map((raw) => {
    const line = raw.replace(/^\s+/, '')
    try {
      const highlighted = hljs.highlight(line || ' ', { language }).value
      return sanitizeHtml(highlighted)
    } catch {
      return sanitizeHtml(line || ' ')
    }
  })

  highlightedCache.set(key, { content, lines })
  return lines
})

// Get language for highlighting
const getLanguage = () => {
  if (!selectedFile.value) return 'plaintext'
  const ext = selectedFile.value.name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'vue':
    case 'html':
      return 'xml'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    case 'sh':
      return 'bash'
    case 'py':
      return 'python'
    case 'java':
      return 'java'
    default:
      return 'plaintext'
  }
}

// ==================== Code Folding Logic ====================

// Detect foldable ranges based on file type and content
const foldableRanges = computed((): FoldRange[] => {
  if (!fileContent.value || !selectedFile.value) return []
  
  const lines = fileLines.value
  const ranges: FoldRange[] = []
  const ext = selectedFile.value.name.split('.').pop()?.toLowerCase()
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1
    const trimmed = line.trim()
    
    // Vue SFC sections: <template>, <script>, <style>
    if (ext === 'vue') {
      if (/^<(template|script|style)/.test(trimmed)) {
        const tag = trimmed.match(/^<(template|script|style)/)?.[1]
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim().startsWith(`</${tag}>`)) {
            ranges.push({ start: lineNum, end: j + 1, type: 'vue-section' })
            break
          }
        }
      }
    }
    
    // TypeScript/JavaScript/Java patterns
    if (['ts', 'tsx', 'js', 'jsx', 'java', 'vue'].includes(ext || '')) {
      // Function declarations
      if (/^(export\s+)?(async\s+)?function\s+\w+/.test(trimmed) ||
          /^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?\(/.test(trimmed) ||
          /^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?function/.test(trimmed) ||
          /^(public|private|protected)?\s*(static)?\s*(async)?\s*\w+\s*\([^)]*\)\s*[:{]/.test(trimmed)) {
        let braceCount = 0
        let foundOpen = false
        for (let j = i; j < lines.length; j++) {
          const checkLine = lines[j]
          for (const char of checkLine) {
            if (char === '{') {
              braceCount++
              foundOpen = true
            } else if (char === '}') {
              braceCount--
              if (foundOpen && braceCount === 0) {
                if (j > i) {
                  ranges.push({ start: lineNum, end: j + 1, type: 'function' })
                }
                break
              }
            }
          }
          if (foundOpen && braceCount === 0) break
        }
      }
      
      // Class declarations
      if (/^(export\s+)?(abstract\s+)?class\s+\w+/.test(trimmed)) {
        let braceCount = 0
        let foundOpen = false
        for (let j = i; j < lines.length; j++) {
          const checkLine = lines[j]
          for (const char of checkLine) {
            if (char === '{') {
              braceCount++
              foundOpen = true
            } else if (char === '}') {
              braceCount--
              if (foundOpen && braceCount === 0) {
                if (j > i) {
                  ranges.push({ start: lineNum, end: j + 1, type: 'class' })
                }
                break
              }
            }
          }
          if (foundOpen && braceCount === 0) break
        }
      }
      
      // Interface/Type declarations
      if (/^(export\s+)?(interface|type)\s+\w+/.test(trimmed) && trimmed.includes('{')) {
        let braceCount = 0
        let foundOpen = false
        for (let j = i; j < lines.length; j++) {
          const checkLine = lines[j]
          for (const char of checkLine) {
            if (char === '{') {
              braceCount++
              foundOpen = true
            } else if (char === '}') {
              braceCount--
              if (foundOpen && braceCount === 0) {
                if (j > i) {
                  ranges.push({ start: lineNum, end: j + 1, type: 'interface' })
                }
                break
              }
            }
          }
          if (foundOpen && braceCount === 0) break
        }
      }
    }
    
    // Python patterns
    if (ext === 'py') {
      if (/^(async\s+)?def\s+\w+/.test(trimmed) || /^class\s+\w+/.test(trimmed)) {
        const indent = line.search(/\S/)
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j]
          const nextTrimmed = nextLine.trim()
          if (nextTrimmed && nextLine.search(/\S/) <= indent) {
            ranges.push({ start: lineNum, end: j, type: trimmed.startsWith('class') ? 'class' : 'function' })
            break
          }
          if (j === lines.length - 1) {
            ranges.push({ start: lineNum, end: j + 1, type: trimmed.startsWith('class') ? 'class' : 'function' })
          }
        }
      }
    }
    
    // CSS patterns
    if (ext === 'css') {
      if ((trimmed.endsWith('{') && !trimmed.startsWith('@')) || (trimmed.startsWith('@') && trimmed.endsWith('{'))) {
        let braceCount = 1
        for (let j = i + 1; j < lines.length; j++) {
          const checkLine = lines[j]
          for (const char of checkLine) {
            if (char === '{') braceCount++
            else if (char === '}') braceCount--
          }
          if (braceCount === 0) {
            ranges.push({ start: lineNum, end: j + 1, type: 'css-rule' })
            break
          }
        }
      }
    }
  }
  
  // Remove duplicates
  const uniqueRanges: FoldRange[] = []
  for (const range of ranges) {
    const isDuplicate = uniqueRanges.some(r => r.start === range.start && r.end === range.end)
    if (!isDuplicate) {
      uniqueRanges.push(range)
    }
  }
  
  return uniqueRanges.sort((a, b) => a.start - b.start)
})

// Check if a line is the start of a foldable range
const isFoldStartLine = (line: number): boolean => {
  return foldableRanges.value.some((r: FoldRange) => r.start === line)
}

// Check if a line is currently folded
const isLineFolded = (line: number): boolean => {
  return currentFoldedLines.value.includes(line)
}

// Get the fold range for a start line
const getFoldRange = (startLine: number): FoldRange | undefined => {
  return foldableRanges.value.find((r: FoldRange) => r.start === startLine)
}

// Get count of folded lines
const getFoldedLinesCount = (startLine: number): number => {
  const range = getFoldRange(startLine)
  if (!range) return 0
  return range.end - range.start
}

// Check if a line is hidden by a fold
const isLineHiddenByFold = (line: number): boolean => {
  for (const foldedLine of currentFoldedLines.value) {
    const range = getFoldRange(foldedLine)
    if (range && line > range.start && line <= range.end) {
      return true
    }
  }
  return false
}

// Toggle fold at a specific line
const toggleFoldAtLine = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  
  if (!foldedState.value[path]) {
    foldedState.value[path] = []
  }
  
  const idx = foldedState.value[path].indexOf(line)
  if (idx >= 0) {
    foldedState.value[path].splice(idx, 1)
  } else {
    foldedState.value[path].push(line)
  }
  saveFoldedState()
}

// Check if all foldable ranges are folded
const allFolded = computed(() => {
  if (foldableRanges.value.length === 0) return false
  return foldableRanges.value.every((r: FoldRange) => currentFoldedLines.value.includes(r.start))
})

// Toggle all folds
const toggleAllFolds = () => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  
  if (allFolded.value) {
    foldedState.value[path] = []
  } else {
    foldedState.value[path] = foldableRanges.value.map((r: FoldRange) => r.start)
  }
  saveFoldedState()
}

// ==================== Note Functions ====================

// Indent guide constants and functions
const indentSize = 16 // pixels per indent level

const getIndentWidth = (line: string): number => {
  const match = line.match(/^(\s*)/)
  if (!match) return 0
  const spaces = match[1].replace(/\t/g, '  ').length
  return Math.floor(spaces / 2) * indentSize
}

const getIndentLevels = (line: string): number[] => {
  const match = line.match(/^(\s*)/)
  if (!match) return []
  const spaces = match[1].replace(/\t/g, '  ').length
  const levels = Math.floor(spaces / 2)
  return Array.from({ length: levels }, (_, i) => i)
}

const getIndentGuideClass = (level: number): string => {
  // Colorful indent guides based on level
  const colors = [
    'bg-gray-600/30',
    'bg-blue-500/30',
    'bg-green-500/30',
    'bg-yellow-500/30',
    'bg-purple-500/30',
    'bg-pink-500/30',
    'bg-cyan-500/30',
    'bg-orange-500/30',
  ]
  return colors[level % colors.length]
}

const presetNoteContentByLine = computed(() => {
  return buildPresetNoteMap(currentPresetNotes.value as any, fileLines.value)
})

const userNoteContentByLine = computed(() => {
  const map = new Map<number, string>()
  for (const n of currentUserNotes.value) map.set(n.line, n.content)
  return map
})

const presetNonEmptyLineSet = computed(() => {
  const set = new Set<number>()
  for (const [line, content] of presetNoteContentByLine.value.entries()) {
    if (content.trim()) set.add(line)
  }
  return set
})

const userNonEmptyLineSet = computed(() => {
  const set = new Set<number>()
  for (const n of currentUserNotes.value) {
    if (n.content.trim()) set.add(n.line)
  }
  return set
})

const collapsedLineSet = computed(() => new Set<number>(currentCollapsedLines.value))

// Check if user has non-empty note at line
const hasNonEmptyUserNoteAtLine = (line: number) => {
  return userNonEmptyLineSet.value.has(line)
}

// Toggle only user notes at line (preset notes are controlled by global toggle)
const toggleUserNoteAtLine = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  
  const hasUser = hasUserNoteAtLine(line)
  const isCollapsed = isLineCollapsed(line)
  
  if (hasUser) {
    if (!collapsedState.value[path]) {
      collapsedState.value[path] = []
    }
    
    if (isCollapsed) {
      collapsedState.value[path] = collapsedState.value[path].filter((l: number) => l !== line)
    } else {
      const userNote = currentUserNotes.value.find((n: CodeNote) => n.line === line)
      if (userNote && !userNote.content.trim()) {
        // Remove empty user note
        userNotes.value[path] = userNotes.value[path].filter((n: CodeNote) => n.line !== line)
        saveUserNotes()
        return
      }
      collapsedState.value[path].push(line)
    }
    saveCollapsedState()
  } else {
    // Create new user note
    if (!userNotes.value[path]) {
      userNotes.value[path] = []
    }
    userNotes.value[path].push({ line, content: '' })
    userNotes.value[path].sort((a: CodeNote, b: CodeNote) => a.line - b.line)
    saveUserNotes()
    
    // Uncollapse if collapsed
    if (collapsedState.value[path]) {
      collapsedState.value[path] = collapsedState.value[path].filter((l: number) => l !== line)
      saveCollapsedState()
    }
  }
}

const hasPresetNoteAtLine = (line: number) => {
  return presetNoteContentByLine.value.has(line)
}

const hasUserNoteAtLine = (line: number) => {
  return userNoteContentByLine.value.has(line)
}

const hasAnyNoteAtLine = (line: number) => {
  return hasPresetNoteAtLine(line) || hasUserNoteAtLine(line)
}

const hasNonEmptyNoteAtLine = (line: number) => {
  return presetNonEmptyLineSet.value.has(line) || userNonEmptyLineSet.value.has(line)
}

const isLineCollapsed = (line: number) => {
  return collapsedLineSet.value.has(line)
}

const getLineNumberClass = (line: number) => {
  const hasPreset = presetNonEmptyLineSet.value.has(line)
  const hasUser = userNonEmptyLineSet.value.has(line)
  
  if (hasPreset || hasUser) {
    if (hasPreset && hasUser) {
      return 'text-purple-400 font-bold bg-purple-900/20'
    } else if (hasPreset) {
      return 'text-cyan-400 font-bold bg-cyan-900/20'
    } else {
      return 'text-[var(--primary-400)] font-bold bg-[var(--primary-900)]/20'
    }
  }
  return 'text-gray-600 hover:text-gray-400'
}

const toggleNoteAtLine = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  
  const hasPreset = hasPresetNoteAtLine(line)
  const hasUser = hasUserNoteAtLine(line)
  const isCollapsed = isLineCollapsed(line)
  
  if (hasPreset || hasUser) {
    if (!collapsedState.value[path]) {
      collapsedState.value[path] = []
    }
    
    if (isCollapsed) {
      collapsedState.value[path] = collapsedState.value[path].filter((l: number) => l !== line)
    } else {
      if (hasUser) {
        const userNote = currentUserNotes.value.find((n: CodeNote) => n.line === line)
        if (userNote && !userNote.content.trim()) {
          userNotes.value[path] = userNotes.value[path].filter((n: CodeNote) => n.line !== line)
          saveUserNotes()
          return
        }
      }
      collapsedState.value[path].push(line)
    }
    saveCollapsedState()
  } else {
    if (!userNotes.value[path]) {
      userNotes.value[path] = []
    }
    userNotes.value[path].push({ line, content: '' })
    userNotes.value[path].sort((a: CodeNote, b: CodeNote) => a.line - b.line)
    saveUserNotes()
    
    if (collapsedState.value[path]) {
      collapsedState.value[path] = collapsedState.value[path].filter((l: number) => l !== line)
      saveCollapsedState()
    }
  }
}

const deleteUserNote = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  if (userNotes.value[path]) {
    userNotes.value[path] = userNotes.value[path].filter((n: CodeNote) => n.line !== line)
    saveUserNotes()
  }
}

const getPresetNoteContent = (line: number): string => {
  return presetNoteContentByLine.value.get(line) || ''
}

const getUserNoteContent = (line: number): string => {
  return userNoteContentByLine.value.get(line) || ''
}

const updateUserNoteContent = (line: number, content: string) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  if (!userNotes.value[path]) return
  const note = userNotes.value[path].find((n: CodeNote) => n.line === line)
  if (note) {
    note.content = content
    saveUserNotes()
  }
}

const handleNoteInput = (event: Event, line: number) => {
  const textarea = event.target as HTMLTextAreaElement
  updateUserNoteContent(line, textarea.value)
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

// Drag and drop handlers
const onDragStart = (e: DragEvent, line: number) => {
  draggingNoteLine.value = line
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(line))
  }
}

const onDragEnd = () => {
  draggingNoteLine.value = null
  dragOverLine.value = null
}

const onDragOver = (e: DragEvent, targetLine: number) => {
  if (draggingNoteLine.value === null) return
  e.preventDefault()
  dragOverLine.value = targetLine
}

const onDragLeave = () => {
  setTimeout(() => {
    if (dragOverLine.value !== null) {
    }
  }, 50)
}

const onDrop = (e: DragEvent, targetLine: number) => {
  if (!selectedFile.value || draggingNoteLine.value === null) return
  const sourceLine = draggingNoteLine.value
  if (sourceLine === targetLine) {
    dragOverLine.value = null
    draggingNoteLine.value = null
    return
  }
  
  const path = selectedFile.value.path
  if (!userNotes.value[path]) {
    dragOverLine.value = null
    draggingNoteLine.value = null
    return
  }
  
  const noteIdx = userNotes.value[path].findIndex((n: CodeNote) => n.line === sourceLine)
  if (noteIdx < 0) {
    dragOverLine.value = null
    draggingNoteLine.value = null
    return
  }
  
  userNotes.value[path][noteIdx].line = targetLine
  userNotes.value[path].sort((a: CodeNote, b: CodeNote) => a.line - b.line)
  saveUserNotes()
  
  if (collapsedState.value[path]) {
    const collapsedIdx = collapsedState.value[path].indexOf(sourceLine)
    if (collapsedIdx >= 0) {
      collapsedState.value[path][collapsedIdx] = targetLine
      saveCollapsedState()
    }
  }
  
  dragOverLine.value = null
  draggingNoteLine.value = null
}

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
    case 'py': return '🐍'
    case 'java': return '☕'
    default: return '📄'
  }
}

const selectFile = async (file: SourceFile) => {
  if (file.type !== 'file') return
  selectedFile.value = file
  if (isMobile.value) mobileFileTreeOpen.value = false
  
  try {
    const rawFileName = file.path.replace(/\//g, '_') + '.txt'
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'
    const candidates = [
      file.fetchPath,
      file.fetchPath && `${baseUrl}${file.fetchPath.replace(/^\//, '')}`,
      `${baseUrl}raw/${rawFileName}`,
      `./raw/${rawFileName}`,
      `${baseUrl}${file.path}`,
      `./${file.path}`
    ].filter(Boolean) as string[]

    const tried = new Set<string>()
    for (const fetchUrl of candidates) {
      if (tried.has(fetchUrl)) continue
      tried.add(fetchUrl)
      const res = await fetch(fetchUrl)
      if (res.ok) {
        fileContent.value = await res.text()
        return
      }
    }
    fileContent.value = `// Failed to load file: ${file.path}\n// Tried: ${Array.from(tried).join(', ')}`
  } catch (e) {
    console.error('Failed to fetch file content:', e)
    fileContent.value = `// Failed to load file: ${file.path}\n// Error: ${e}`
  }
}

const submitNotesToGitHub = async () => {
  if (!hasUserNotes.value || isSubmitting.value) return
  
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    const token = await getToken()
    if (!token) {
      submitMessage.value = isZh.value ? '请先配置 GitHub Token' : 'Please configure GitHub Token first'
      submitSuccess.value = false
      return
    }
    
    const repoOwner = 'soft-zihan'
    const repoName = 'soft-zihan.github.io'
    const authorName = localStorage.getItem('author_name') || 'Anonymous'
    
    const mergedNotes: FileNotes = { ...presetNotes.value }
    
    for (const [filePath, notes] of Object.entries(userNotes.value)) {
      if (!mergedNotes[filePath]) {
        mergedNotes[filePath] = []
      }
      for (const note of notes) {
        if (note.content.trim()) {
          const existingIdx = mergedNotes[filePath].findIndex(n => n.line === note.line)
          if (existingIdx >= 0) {
            mergedNotes[filePath][existingIdx].content += '\n\n---\n' + note.content
          } else {
            mergedNotes[filePath].push({ line: note.line, content: note.content })
          }
        }
      }
      mergedNotes[filePath].sort((a, b) => a.line - b.line)
    }
    
    const presetData = {
      version: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      lastUpdated: new Date().toISOString().split('T')[0],
      intros: presetIntros.value,
      notes: mergedNotes
    }
    
    const content = JSON.stringify(presetData, null, 2)
    
    const result = await uploadFile(
      { owner: repoOwner, repo: repoName, branch: 'main', token },
      `public/data/source-notes-preset.${props.lang}.json`,
      content,
      `docs: add source code notes by ${authorName}`
    )
    
    if (result.success) {
      submitMessage.value = isZh.value 
        ? `笔记已提交！${result.isPR ? 'PR 已创建' : '已直接合并'}`
        : `Notes submitted! ${result.isPR ? 'PR created' : 'Merged directly'}`
      submitSuccess.value = true
    } else {
      submitMessage.value = result.message
      submitSuccess.value = false
    }
  } catch (e) {
    submitMessage.value = isZh.value ? '提交失败，请稍后重试' : 'Submit failed, please try again'
    submitSuccess.value = false
  } finally {
    isSubmitting.value = false
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)
  }
}

const exportNotes = () => {
  const data = {
    userNotes: userNotes.value,
    collapsedState: collapsedState.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'source-notes.json'
  a.click()
  URL.revokeObjectURL(url)
}

const importNotes = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      if (imported.userNotes) {
        userNotes.value = { ...userNotes.value, ...imported.userNotes }
        saveUserNotes()
      }
      if (imported.collapsedState) {
        collapsedState.value = { ...collapsedState.value, ...imported.collapsedState }
        saveCollapsedState()
      }
    } catch (err) {
      console.error('Failed to import notes:', err)
    }
  }
  reader.readAsText(file)
}

defineExpose({
  exportNotes,
  importNotes,
  userNotes,
  presetNotes
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.minimap-content {
  pointer-events: none;
}

/* Enhanced syntax highlighting for dark theme */
:deep(.hljs-dark) {
  color: #d4d4d4;
}
:deep(.hljs-dark .hljs-comment),
:deep(.hljs-dark .hljs-quote) {
  color: #6a9955;
  font-style: italic;
}
:deep(.hljs-dark .hljs-keyword),
:deep(.hljs-dark .hljs-selector-tag),
:deep(.hljs-dark .hljs-built_in) {
  color: #569cd6;
  font-weight: 500;
}
:deep(.hljs-dark .hljs-string),
:deep(.hljs-dark .hljs-doctag),
:deep(.hljs-dark .hljs-attr) {
  color: #ce9178;
}
:deep(.hljs-dark .hljs-number),
:deep(.hljs-dark .hljs-literal) {
  color: #b5cea8;
}
:deep(.hljs-dark .hljs-function),
:deep(.hljs-dark .hljs-title) {
  color: #dcdcaa;
}
:deep(.hljs-dark .hljs-variable),
:deep(.hljs-dark .hljs-template-variable) {
  color: #9cdcfe;
}
:deep(.hljs-dark .hljs-type),
:deep(.hljs-dark .hljs-class .hljs-title) {
  color: #4ec9b0;
}
:deep(.hljs-dark .hljs-tag) {
  color: #808080;
}
:deep(.hljs-dark .hljs-name) {
  color: #569cd6;
}
:deep(.hljs-dark .hljs-attribute) {
  color: #9cdcfe;
}
:deep(.hljs-dark .hljs-regexp) {
  color: #d16969;
}
:deep(.hljs-dark .hljs-symbol),
:deep(.hljs-dark .hljs-bullet) {
  color: #d7ba7d;
}
:deep(.hljs-dark .hljs-meta) {
  color: #569cd6;
}
:deep(.hljs-dark .hljs-params) {
  color: #9cdcfe;
}
:deep(.hljs-dark .hljs-selector-class),
:deep(.hljs-dark .hljs-selector-id) {
  color: #d7ba7d;
}

/* Enhanced syntax highlighting for light theme */
:deep(.hljs-light) {
  color: #383a42;
}
:deep(.hljs-light .hljs-comment),
:deep(.hljs-light .hljs-quote) {
  color: #008000;
  font-style: italic;
}
:deep(.hljs-light .hljs-keyword),
:deep(.hljs-light .hljs-selector-tag),
:deep(.hljs-light .hljs-built_in) {
  color: #0000ff;
  font-weight: 500;
}
:deep(.hljs-light .hljs-string),
:deep(.hljs-light .hljs-doctag),
:deep(.hljs-light .hljs-attr) {
  color: #a31515;
}
:deep(.hljs-light .hljs-number),
:deep(.hljs-light .hljs-literal) {
  color: #098658;
}
:deep(.hljs-light .hljs-function),
:deep(.hljs-light .hljs-title) {
  color: #795e26;
}
:deep(.hljs-light .hljs-variable),
:deep(.hljs-light .hljs-template-variable) {
  color: #001080;
}
:deep(.hljs-light .hljs-type),
:deep(.hljs-light .hljs-class .hljs-title) {
  color: #267f99;
}
:deep(.hljs-light .hljs-tag) {
  color: #800000;
}
:deep(.hljs-light .hljs-name) {
  color: #800000;
}
:deep(.hljs-light .hljs-attribute) {
  color: #ff0000;
}
:deep(.hljs-light .hljs-regexp) {
  color: #811f3f;
}
:deep(.hljs-light .hljs-symbol),
:deep(.hljs-light .hljs-bullet) {
  color: #0451a5;
}
:deep(.hljs-light .hljs-meta) {
  color: #0000ff;
}
:deep(.hljs-light .hljs-params) {
  color: #001080;
}
:deep(.hljs-light .hljs-selector-class),
:deep(.hljs-light .hljs-selector-id) {
  color: #800000;
}
</style>
