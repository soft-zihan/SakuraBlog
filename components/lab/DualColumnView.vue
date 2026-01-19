<template>
  <div class="h-full flex flex-col">
    <!-- Top Control Bar -->
    <div class="flex items-center justify-between p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-t-2xl border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>📖</span>
          {{ isZh ? '双栏阅读' : 'Dual Column Reading' }}
        </h3>
      </div>
      
      <!-- Panel Selectors -->
      <div class="flex items-center gap-4">
        <!-- Left Panel Selector -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ isZh ? '左栏' : 'Left' }}:</span>
          <select 
            :value="leftPanel" 
            @change="emit('update:left-panel', ($event.target as HTMLSelectElement).value as any)"
            class="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-sakura-300"
          >
            <option value="notes">{{ isZh ? 'VUE学习笔记' : 'VUE Notes' }}</option>
            <option value="lab">{{ isZh ? '可视化中心' : 'Visual Lab' }}</option>
            <option value="source">{{ isZh ? '源码阅读' : 'Source Code' }}</option>
          </select>
        </div>
        
        <!-- Right Panel Selector -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ isZh ? '右栏' : 'Right' }}:</span>
          <select 
            :value="rightPanel" 
            @change="emit('update:right-panel', ($event.target as HTMLSelectElement).value as any)"
            class="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-sakura-300"
          >
            <option value="notes">{{ isZh ? 'VUE学习笔记' : 'VUE Notes' }}</option>
            <option value="lab">{{ isZh ? '可视化中心' : 'Visual Lab' }}</option>
            <option value="source">{{ isZh ? '源码阅读' : 'Source Code' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Dual Panels -->
    <div class="flex-1 flex gap-2 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-b-2xl overflow-hidden">
      <!-- Left Panel -->
      <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
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
      <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
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
import { ref, computed } from 'vue'
import type { FileNode } from '../../types'
import PanelContent from './PanelContent.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
  leftPanel: 'notes' | 'lab' | 'source'
  rightPanel: 'notes' | 'lab' | 'source'
  labDashboardTab?: string
  labFolder: FileNode | null
}>()

const emit = defineEmits<{
  (e: 'update:left-panel', value: 'notes' | 'lab' | 'source'): void
  (e: 'update:right-panel', value: 'notes' | 'lab' | 'source'): void
  (e: 'tab-change', tab: string): void
  (e: 'select-file', file: FileNode): void
}>()

const isZh = computed(() => props.lang === 'zh')

const selectedLeftNote = ref<FileNode | null>(null)
const selectedRightNote = ref<FileNode | null>(null)
</script>
