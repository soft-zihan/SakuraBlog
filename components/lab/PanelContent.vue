<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Notes Panel -->
    <template v-if="type === 'notes'">
      <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>📚</span>
          {{ isZh ? 'VUE学习笔记' : 'VUE Learning Notes' }}
        </h4>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <!-- Note List -->
        <div class="w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-800/50">
          <div 
            v-for="note in notesList" 
            :key="note.path"
            @click="emit('select-note', note)"
            class="p-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors"
            :class="selectedNote?.path === note.path 
              ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-700 dark:text-sakura-300' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <div class="text-xs font-medium truncate">{{ note.name.replace('.md', '') }}</div>
          </div>
        </div>
        <!-- Note Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div v-if="selectedNote && noteContent" v-html="renderedContent" class="markdown-body dark:text-gray-300 prose prose-sm max-w-none"></div>
          <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm">
            {{ isZh ? '选择左侧笔记查看' : 'Select a note to view' }}
          </div>
        </div>
      </div>
    </template>

    <!-- Lab Panel -->
    <template v-else-if="type === 'lab'">
      <div class="h-full overflow-y-auto custom-scrollbar">
        <LabDashboard 
          :lang="lang" 
          :initial-tab="labDashboardTab" 
          @tab-change="emit('tab-change', $event)"
        />
      </div>
    </template>

    <!-- Source Code Panel -->
    <template v-else-if="type === 'source'">
      <div class="h-full">
        <SourceCodeViewer :lang="lang" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import type { FileNode } from '../../types'
import { NodeType } from '../../types'
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
    return marked.parse(noteContent.value) as string
  } catch {
    return noteContent.value
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
