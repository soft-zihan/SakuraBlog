<template>
  <aside
    class="w-full flex-shrink-0 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-white/60 dark:border-gray-700/50 h-full z-30 transition-all duration-300 ease-out"
  >
    <div class="p-6 pb-4 flex flex-col border-b border-white/60 dark:border-gray-700/50 flex-shrink-0">
      <div class="flex justify-end items-center mb-4">
        <button
          type="button"
          class="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 shadow-sm inline-flex items-center justify-center transition-colors text-gray-700 dark:text-gray-200 hover:opacity-90"
          :title="lang === 'zh' ? '切换侧边栏' : 'Toggle sidebar'"
          :aria-label="lang === 'zh' ? '切换侧边栏' : 'Toggle sidebar'"
          @click="$emit('action', { type: 'toggle-sidebar' })"
        >
          <span class="text-sm">‹</span>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary-100)] to-purple-100 dark:from-[var(--primary-900)]/40 dark:to-purple-900/30 border-4 border-white dark:border-gray-800 shadow-xl grid place-items-center">
          <span class="text-xl">🌸</span>
        </div>
        <div class="flex flex-col flex-1">
          <div class="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">Sakura Notes</div>
          <div class="text-xs mt-0.5 font-medium px-2 py-0.5 rounded-full bg-[var(--primary-50)]/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200">
            {{ lang === 'zh' ? '站点 UI 空壳（Vue）' : 'UI Shell (Vue)' }}
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 py-4 flex-shrink-0">
      <div class="flex p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-900/20">
        <button
          v-for="mode in viewModes"
          :key="mode.id"
          type="button"
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1"
          :class="viewMode === mode.id ? 'bg-gradient-to-r from-[var(--primary-100)] to-white dark:from-[var(--primary-900)]/40 dark:to-gray-800 text-[var(--primary-800)] dark:text-white shadow-lg ring-2 ring-[var(--primary-400)] dark:ring-[var(--primary-500)] scale-[1.02]' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'"
          @click="$emit('action', { type: 'set-view-mode', mode: mode.id })"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
      <div class="px-2 mb-4 space-y-4">
        <div>
          <div class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 pl-1">
            🎯 {{ lang === 'zh' ? '学习阶段' : 'Stages' }}
          </div>
          <div class="space-y-1">
            <button
              type="button"
              class="w-full text-left p-2 rounded-lg border transition-colors text-xs font-bold"
              :class="stage === 'foundation' ? 'border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/60 dark:bg-[var(--primary-900)]/25 text-[var(--primary-800)] dark:text-[var(--primary-200)]' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-200'"
              @click="$emit('action', { type: 'set-stage', stage: 'foundation' })"
            >
              🧱 {{ lang === 'zh' ? '网页基础' : 'Foundation' }}
            </button>
            <button
              type="button"
              class="w-full text-left p-2 rounded-lg border transition-colors text-xs font-bold"
              :class="stage === 'css' ? 'border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/60 dark:bg-[var(--primary-900)]/25 text-[var(--primary-800)] dark:text-[var(--primary-200)]' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-200'"
              @click="$emit('action', { type: 'set-stage', stage: 'css' })"
            >
              🎨 {{ lang === 'zh' ? 'CSS 布局' : 'CSS Layout' }}
            </button>
            <button
              type="button"
              class="w-full text-left p-2 rounded-lg border transition-colors text-xs font-bold"
              :class="stage === 'js' ? 'border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/60 dark:bg-[var(--primary-900)]/25 text-[var(--primary-800)] dark:text-[var(--primary-200)]' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-200'"
              @click="$emit('action', { type: 'set-stage', stage: 'js' })"
            >
              ⚡ {{ lang === 'zh' ? 'JS 基础' : 'JS Basics' }}
            </button>
          </div>
        </div>

        <div>
          <div class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 pl-1">
            🧰 {{ lang === 'zh' ? '工具' : 'Tools' }}
          </div>
          <div class="space-y-2">
            <button
              type="button"
              class="w-full text-left p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
              :class="currentTool === 'dashboard' ? 'border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/60 dark:bg-[var(--primary-900)]/25' : 'border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 hover:bg-white dark:hover:bg-gray-800'"
              @click="$emit('action', { type: 'select-tool', tool: 'dashboard' })"
            >
              <span class="text-xl">🧭</span>
              <div class="flex-1">
                <div class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ lang === 'zh' ? '教程看板' : 'Tutorial' }}</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ lang === 'zh' ? '按步骤推进：目标 / 操作 / 自检' : 'Step-by-step: goal / tasks / checks' }}</div>
              </div>
            </button>

            <button
              type="button"
              class="w-full text-left p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
              :class="currentTool === 'build' ? 'border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/60 dark:bg-indigo-900/20' : 'border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 hover:bg-white dark:hover:bg-gray-800'"
              @click="$emit('action', { type: 'select-tool', tool: 'build' })"
            >
              <span class="text-xl">📦</span>
              <div class="flex-1">
                <div class="text-sm font-bold text-indigo-900 dark:text-indigo-200">{{ lang === 'zh' ? '项目构建' : 'Build & Export' }}</div>
                <div class="text-[10px] text-indigo-600 dark:text-indigo-300">{{ lang === 'zh' ? '创建工程 / 跑起来 / 构建 / 导出' : 'Scaffold / run / build / export' }}</div>
              </div>
            </button>

            <button
              type="button"
              class="w-full text-left p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
              :class="currentTool === 'source-code' ? 'border-green-200 dark:border-green-800/40 bg-green-50/60 dark:bg-green-900/20' : 'border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 hover:bg-white dark:hover:bg-gray-800'"
              @click="$emit('action', { type: 'select-tool', tool: 'source-code' })"
            >
              <span class="text-xl">💻</span>
              <div class="flex-1">
                <div class="text-sm font-bold text-green-900 dark:text-green-200">{{ lang === 'zh' ? '源码导览' : 'Source Guide' }}</div>
                <div class="text-[10px] text-green-600 dark:text-green-300">{{ lang === 'zh' ? '按“状态 -> 布局 -> 交互”阅读' : 'Read state -> layout -> interactions' }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-white/60 dark:border-gray-700/50 flex flex-wrap gap-2">
      <button
        type="button"
        class="text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold hover:opacity-90"
        @click="$emit('action', { type: 'open-search' })"
      >
        🔎 {{ lang === 'zh' ? '搜索' : 'Search' }}
      </button>
      <button
        type="button"
        class="text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold hover:opacity-90"
        @click="$emit('action', { type: 'open-download' })"
      >
        ⬇️ {{ lang === 'zh' ? '下载' : 'Download' }}
      </button>
      <button
        type="button"
        class="text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold hover:opacity-90"
        @click="$emit('action', { type: 'open-settings' })"
      >
        ⚙️ {{ lang === 'zh' ? '设置' : 'Settings' }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ShellAction, ShellStage, ShellTool, ShellViewMode } from './shellStore'

const props = defineProps<{
  lang: 'en' | 'zh'
  viewMode: ShellViewMode
  stage: ShellStage
  currentTool: ShellTool
  enableFiles?: boolean
}>()

defineEmits<{
  (e: 'action', action: ShellAction): void
}>()

const viewModes = computed(() => {
  const enableFiles = props.enableFiles !== false
  if (props.lang === 'zh') {
    return enableFiles ? [{ id: 'files' as const, label: '📁 文件' }, { id: 'lab' as const, label: '🧪 实验室' }] : [{ id: 'lab' as const, label: '🧪 实验室' }]
  }
  return enableFiles ? [{ id: 'files' as const, label: '📁 Files' }, { id: 'lab' as const, label: '🧪 Lab' }] : [{ id: 'lab' as const, label: '🧪 Lab' }]
})
</script>
