<template>
  <header
    class="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/60 dark:border-gray-800/60 shrink-0 z-20 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-colors duration-300"
  >
    <div class="h-16 px-6 flex items-center justify-between">
      <button
        type="button"
        class="mr-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-50)] dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        :title="lang === 'zh' ? '切换侧边栏' : 'Toggle Sidebar'"
        :aria-label="lang === 'zh' ? '切换侧边栏' : 'Toggle sidebar'"
        @click="$emit('action', { type: 'toggle-sidebar' })"
      >
        <span class="text-sm">{{ sidebarOpen ? '◀' : '▶' }}</span>
      </button>

      <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap flex-1 mr-4 py-2">
        <span class="text-[var(--primary-300)] dark:text-[var(--primary-500)] mr-2 shrink-0">🏠</span>

        <template v-for="(item, index) in breadcrumbs" :key="item.path">
          <span v-if="index > 0" class="mx-2 text-[var(--primary-300)] dark:text-gray-600">›</span>
          <button
            v-if="index < breadcrumbs.length - 1"
            type="button"
            class="px-2 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-[var(--primary-700)] dark:hover:text-[var(--primary-300)] transition-colors"
            @click="$emit('action', { type: 'navigate', path: item.path })"
          >
            {{ crumbText(item.name) }}
          </button>
          <span
            v-else
            class="px-2 py-1 rounded-md font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/30"
            aria-current="page"
          >
            {{ crumbText(item.name) }}
          </span>
        </template>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="p-2 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative z-10"
          :title="lang === 'zh' ? '搜索' : 'Search'"
          :aria-label="lang === 'zh' ? '搜索' : 'Search'"
          @click="$emit('action', { type: 'open-search' })"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <button
          type="button"
          class="p-2 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative z-10"
          :title="lang === 'zh' ? '切换主题' : 'Toggle theme'"
          :aria-label="lang === 'zh' ? '切换主题' : 'Toggle theme'"
          @click="$emit('action', { type: 'toggle-theme' })"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
        </button>
        <button
          type="button"
          class="p-2 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative z-10"
          :title="lang === 'zh' ? '音乐' : 'Music'"
          :aria-label="lang === 'zh' ? '音乐' : 'Music'"
          @click="$emit('action', { type: 'open-music' })"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </button>
        <button
          type="button"
          class="p-2 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative z-10"
          :title="lang === 'zh' ? '设置' : 'Settings'"
          :aria-label="lang === 'zh' ? '设置' : 'Settings'"
          @click="$emit('action', { type: 'open-settings' })"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
        <button
          type="button"
          class="p-2 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative z-10"
          :title="lang === 'zh' ? '下载' : 'Download'"
          :aria-label="lang === 'zh' ? '下载' : 'Download'"
          @click="$emit('action', { type: 'open-download' })"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>
        <button
          type="button"
          class="p-2 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative z-10"
          :title="lang === 'zh' ? '右侧面板' : 'Right panel'"
          :aria-label="lang === 'zh' ? '右侧面板' : 'Right panel'"
          @click="$emit('action', { type: 'toggle-right-sidebar' })"
        >
          {{ rightSidebarOpen ? '✕' : '➜' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ShellAction, ShellBreadcrumb } from './shellStore'

const props = defineProps<{
  lang: 'en' | 'zh'
  breadcrumbs: ShellBreadcrumb[]
  sidebarOpen: boolean
  rightSidebarOpen: boolean
  isDark: boolean
}>()

function crumbText(name: string) {
  if (props.lang === 'zh') {
    if (name === 'lab') return '实验室'
    if (name === 'dashboard') return '看板'
    if (name === 'build') return '构建'
    if (name === 'source-code') return '源码'
    if (name === 'latest') return '最近'
    if (name === 'files') return '文件'
    if (name === 'foundation') return '网页基础'
    if (name === 'css') return 'CSS 布局'
    if (name === 'js') return 'JS 基础'
    return name
  }
  if (name === 'lab') return 'Lab'
  if (name === 'dashboard') return 'Dashboard'
  if (name === 'build') return 'Build'
  if (name === 'source-code') return 'Source'
  if (name === 'latest') return 'Latest'
  if (name === 'files') return 'Files'
  if (name === 'foundation') return 'Foundation'
  if (name === 'css') return 'CSS Layout'
  if (name === 'js') return 'JS Basics'
  return name
}

defineEmits<{
  (e: 'action', action: ShellAction): void
}>()
</script>
