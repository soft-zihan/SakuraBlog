<template>
  <!-- 双栏阅读：完全全屏覆盖，Teleport到body后z-[9999]确保在所有元素之上 -->
  <div class="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex flex-col">
    <!-- Top Control Bar with toggle buttons -->
    <div class="flex items-center justify-between p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <!-- Left: Exit Button + Left Panel Selector -->
      <div class="flex items-center gap-3">
        <!-- Exit Button -->
        <button 
          @click="emit('close')"
          class="p-2 rounded-lg transition-colors bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          :title="isZh ? '退出双栏阅读' : 'Exit Dual Column'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        
        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{{ isZh ? '左栏' : 'Left' }}:</span>
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button 
            v-for="opt in panelOptions" 
            :key="opt.value"
            @click="emit('update:left-panel', opt.value)"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
            :class="leftPanel === opt.value 
              ? 'bg-white dark:bg-gray-600 text-sakura-600 dark:text-sakura-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
      </div>
      
      <!-- Center: Title -->
      <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <span>📖</span>
        {{ isZh ? '双栏阅读' : 'Dual Column Reading' }}
      </h3>
      
      <!-- Right: Right Panel Selector -->
      <div class="flex items-center gap-2">
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button 
            v-for="opt in panelOptions" 
            :key="opt.value"
            @click="emit('update:right-panel', opt.value)"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
            :class="rightPanel === opt.value 
              ? 'bg-white dark:bg-gray-600 text-sakura-600 dark:text-sakura-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">:{{ isZh ? '右栏' : 'Right' }}</span>
      </div>
    </div>

    <!-- Dual Panels -->
    <div class="flex-1 flex gap-2 p-2 overflow-hidden">
      <!-- Left Panel -->
      <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
        <PanelContent 
          :type="leftPanel" 
          :lang="lang"
          :lab-dashboard-tab="labDashboardTab"
          :lab-folder="labFolder"
          :selected-note="selectedLeftNote"
          @tab-change="emit('tab-change', $event)"
          @select-note="selectedLeftNote = $event; emit('select-file', $event)"
        />
      </div>
      
      <!-- Right Panel -->
      <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
        <PanelContent 
          :type="rightPanel" 
          :lang="lang"
          :lab-dashboard-tab="labDashboardTab"
          :lab-folder="labFolder"
          :selected-note="selectedRightNote"
          @tab-change="emit('tab-change', $event)"
          @select-note="selectedRightNote = $event; emit('select-file', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FileNode } from '../../types'
import { NodeType } from '../../types'
import PanelContent from './PanelContent.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
  leftPanel: 'notes' | 'lab' | 'source'
  rightPanel: 'notes' | 'lab' | 'source'
  labDashboardTab?: string
  labFolder: FileNode | null
  openNotePath?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:left-panel', value: 'notes' | 'lab' | 'source'): void
  (e: 'update:right-panel', value: 'notes' | 'lab' | 'source'): void
  (e: 'tab-change', tab: string): void
  (e: 'select-file', file: FileNode): void
  (e: 'close'): void
}>()

const isZh = computed(() => props.lang === 'zh')

const panelOptions = computed(() => [
  { value: 'notes' as const, icon: '📚', label: isZh.value ? '笔记' : 'Notes' },
  { value: 'lab' as const, icon: '🧪', label: isZh.value ? '可视化' : 'Lab' },
  { value: 'source' as const, icon: '💻', label: isZh.value ? '源码' : 'Source' }
])

const selectedLeftNote = ref<FileNode | null>(null)
const selectedRightNote = ref<FileNode | null>(null)

const findByPath = (node: FileNode | null, targetPath: string): FileNode | null => {
  if (!node) return null
  if (node.path === targetPath) return node
  if (!node.children) return null
  for (const child of node.children) {
    const found = findByPath(child, targetPath)
    if (found) return found
  }
  return null
}

watch(() => props.openNotePath, (path) => {
  if (!path) return
  const node = findByPath(props.labFolder, path)
  if (!node || node.type !== NodeType.FILE) return
  if (props.leftPanel === 'notes') selectedLeftNote.value = node
  if (props.rightPanel === 'notes') selectedRightNote.value = node
}, { immediate: true })
</script>
