<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Notes Panel - With collapsible folder tree -->
    <template v-if="type === 'notes'">
      <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
        <!-- Toggle folder tree button (在左边，和源码查看器一致) -->
        <button 
          @click="showFolderTree = !showFolderTree"
          class="p-1.5 rounded-lg transition-colors flex-shrink-0"
          :class="showFolderTree 
            ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'"
          :title="showFolderTree ? (isZh ? '收起目录' : 'Collapse') : (isZh ? '展开目录' : 'Expand')"
        >
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': !showFolderTree }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>📚</span>
          {{ isZh ? 'VUE学习笔记' : 'VUE Learning Notes' }}
        </h4>
      </div>
      
      <!-- Main content area with optional sidebar -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Collapsible folder tree sidebar -->
        <div 
          v-if="showFolderTree"
          class="w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 overflow-y-auto custom-scrollbar"
        >
          <div class="p-2 space-y-0.5">
            <div 
              v-for="note in notesList" 
              :key="note.path"
              @click="emit('select-note', note)"
              class="p-2 rounded-lg cursor-pointer transition-all text-xs hover:bg-white dark:hover:bg-gray-700 flex items-center gap-1.5"
              :class="selectedNote?.path === note.path 
                ? 'bg-sakura-50 dark:bg-sakura-900/20 text-sakura-700 dark:text-sakura-300 border-l-2 border-sakura-500' 
                : 'text-gray-600 dark:text-gray-400'"
            >
              <span class="text-[10px]">📝</span>
              <span class="truncate">{{ note.name.replace('.md', '') }}</span>
            </div>
          </div>
        </div>
        
        <!-- Note Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div v-if="selectedNote && noteContent" v-html="renderedContent" class="markdown-body dark:text-gray-300 max-w-none"></div>
          <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm flex-col gap-4">
            <span class="text-4xl">📚</span>
            <span>{{ isZh ? '请点击左上角文件夹图标选择笔记' : 'Click folder icon to select note' }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Lab Panel - With collapsible tab sidebar -->
    <template v-else-if="type === 'lab'">
      <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
        <!-- Toggle sidebar button -->
        <button 
          @click="showLabSidebar = !showLabSidebar"
          class="p-1.5 rounded-lg transition-colors flex-shrink-0"
          :class="showLabSidebar 
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'"
          :title="showLabSidebar ? (isZh ? '收起目录' : 'Collapse') : (isZh ? '展开目录' : 'Expand')"
        >
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': !showLabSidebar }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>🧪</span>
          {{ isZh ? '可视化实验室' : 'Visual Lab' }}
        </h4>
      </div>
      
      <!-- Main content area with optional sidebar -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Collapsible lab tabs sidebar -->
        <div 
          v-if="showLabSidebar"
          class="w-44 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 overflow-y-auto custom-scrollbar"
        >
          <div class="p-2 space-y-1">
            <div 
              v-for="tab in labTabs" 
              :key="tab.id"
              @click="selectedLabTab = tab.id; emit('tab-change', tab.id)"
              class="p-2 rounded-lg cursor-pointer transition-all text-xs hover:bg-white dark:hover:bg-gray-700 flex items-center gap-1.5"
              :class="selectedLabTab === tab.id 
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-2 border-purple-500' 
                : 'text-gray-600 dark:text-gray-400'"
            >
              <span class="text-sm">{{ tab.icon }}</span>
              <span class="truncate">{{ tab.shortLabel }}</span>
            </div>
          </div>
        </div>
        
        <!-- Lab Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <LabDashboard 
            :lang="lang" 
            :initial-tab="selectedLabTab" 
            @tab-change="selectedLabTab = $event; emit('tab-change', $event)"
          />
        </div>
      </div>
    </template>

    <!-- Source Code Panel -->
    <template v-else-if="type === 'source'">
      <div class="h-full">
        <SourceCodeViewer :lang="lang" :compact="true" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import type { FileNode } from '../../types'
import { NodeType } from '../../types'
import { sanitizeHtml } from '../../utils/sanitize'
import { LAB_TABS } from '../../labs/labCatalog'
import LabDashboard from './LabDashboard.vue'
import SourceCodeViewer from './SourceCodeViewer.vue'

const props = defineProps<{
  type: 'notes' | 'lab' | 'source'
  lang: 'en' | 'zh'
  labDashboardTab?: string
  labFolder: FileNode | null
  selectedNote?: FileNode | null
}>()

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
  (e: 'select-note', note: FileNode): void
}>()

const isZh = computed(() => props.lang === 'zh')

// Show/hide folder tree sidebar
const showFolderTree = ref(true)

// Show/hide lab tabs sidebar
const showLabSidebar = ref(true)

// Lab tabs configuration
const labTabs = computed(() => {
  return LAB_TABS.map(tab => ({
    id: tab.id,
    icon: tab.icon,
    shortLabel: isZh.value ? tab.shortLabelZh : tab.shortLabelEn
  }))
})

// Selected lab tab
const selectedLabTab = ref(props.labDashboardTab || 'foundation')

// Sync with props
watch(() => props.labDashboardTab, (val) => {
  if (val) selectedLabTab.value = val
}, { immediate: true })

// Notes list from labFolder
const notesList = computed(() => {
  if (!props.labFolder || !props.labFolder.children) return []
  return props.labFolder.children
    .filter(node => node.type === NodeType.FILE && node.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }))
})

// Note content
const noteContent = ref<string>('')

// Rendered markdown content
const renderedContent = computed(() => {
  if (!noteContent.value) return ''
  try {
    const html = marked.parse(noteContent.value) as string
    return sanitizeHtml(html)
  } catch {
    return sanitizeHtml(noteContent.value)
  }
})

// Fetch note content when selected
watch(() => props.selectedNote, async (note) => {
  if (!note) {
    noteContent.value = ''
    return
  }
  
  try {
    const encodedPath = note.path.split('/').map(p => encodeURIComponent(p)).join('/')
    const res = await fetch(`./notes/${encodedPath}`)
    if (res.ok) {
      noteContent.value = await res.text()
    } else {
      noteContent.value = `# Error\nCould not load: ${note.path}`
    }
  } catch (e) {
    noteContent.value = `# Error\n${e}`
  }
}, { immediate: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>
