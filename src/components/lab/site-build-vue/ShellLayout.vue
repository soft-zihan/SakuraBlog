<template>
  <div
    class="max-w-6xl mx-auto rounded-[2rem] border border-white/30 dark:border-gray-800/60 shadow-[0_12px_60px_rgba(15,23,42,0.12)] overflow-hidden bg-gradient-to-br from-white/70 via-[var(--primary-50)]/50 to-purple-50/40 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-[var(--primary-900)]/40 backdrop-blur-[3px]"
    :class="isDark ? 'dark' : ''"
  >
    <div class="relative h-[min(720px,calc(100vh-240px))] min-h-[560px] flex">
      <div class="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#9f123f 1px, transparent 1px); background-size: 32px 32px;"></div>
      <div class="absolute -top-[18%] -right-[12%] w-[780px] h-[780px] rounded-full bg-gradient-to-br from-[var(--primary-100)]/40 to-purple-100/30 dark:from-[var(--primary-900)]/10 dark:to-purple-900/10 blur-3xl animate-float opacity-60"></div>
      <div class="absolute top-[30%] -left-[12%] w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-[var(--primary-200)]/30 to-[var(--primary-50)]/20 dark:from-[var(--primary-800)]/10 dark:to-[var(--primary-900)]/5 blur-3xl animate-pulse-fast opacity-50" style="animation-duration: 8s;"></div>

      <div
        class="transition-all duration-300 flex-shrink-0"
        :class="sidebarOpen ? 'w-72 lg:w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden pointer-events-none'"
      >
        <ShellSidebar
          :lang="lang"
          :view-mode="viewMode"
          :stage="stage"
          :current-tool="currentTool"
          :enable-files="enableFiles"
          @action="$emit('action', $event)"
        />
      </div>

      <main class="flex-1 min-w-0 flex flex-col overflow-hidden relative isolate">
        <ShellHeader
          :lang="lang"
          :breadcrumbs="breadcrumbs"
          :sidebar-open="sidebarOpen"
          :right-sidebar-open="rightSidebarOpen"
          :is-dark="isDark"
          @action="$emit('action', $event)"
        />

        <div class="flex-1 flex overflow-hidden">
          <div class="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
            <div class="p-5">
              <slot></slot>
            </div>
          </div>

          <div
            class="hidden md:block transition-all duration-300"
            :class="rightSidebarOpen ? 'w-[320px] lg:w-[360px] opacity-100' : 'w-0 opacity-0 overflow-hidden pointer-events-none'"
          >
            <ShellRightPanel :lang="lang" @close="$emit('action', { type: 'toggle-right-sidebar' })" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShellHeader from './ShellHeader.vue'
import ShellRightPanel from './ShellRightPanel.vue'
import ShellSidebar from './ShellSidebar.vue'
import type { ShellAction, ShellBreadcrumb, ShellStage, ShellTool, ShellViewMode } from './shellStore'

defineProps<{
  lang: 'en' | 'zh'
  isDark: boolean
  sidebarOpen: boolean
  rightSidebarOpen: boolean
  viewMode: ShellViewMode
  stage: ShellStage
  currentTool: ShellTool
  breadcrumbs: ShellBreadcrumb[]
  enableFiles?: boolean
}>()

defineEmits<{
  (e: 'action', action: ShellAction): void
}>()
</script>
