<template>
  <aside
    class="w-[320px] lg:w-[360px] flex-shrink-0 border-l border-white/60 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/30 backdrop-blur-xl h-full"
  >
    <div class="p-4 border-b border-white/60 dark:border-gray-700/50 flex items-center gap-3">
      <div class="font-extrabold text-gray-800 dark:text-gray-100">
        {{ lang === 'zh' ? '右侧面板（占位）' : 'Right panel (placeholder)' }}
      </div>
      <div class="ml-auto">
        <button
          type="button"
          class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90"
          :title="lang === 'zh' ? '关闭' : 'Close'"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>
    </div>
    <div class="p-4 space-y-3">
      <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/40 p-4 text-sm text-gray-700 dark:text-gray-200">
        {{ lang === 'zh' ? '这里保留布局与动效占位，不接真实目录/统计逻辑。' : 'Layout and motion placeholders only. No real TOC/stats logic.' }}
      </div>
      <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/40 p-4 text-sm text-gray-700 dark:text-gray-200">
        {{ lang === 'zh' ? '目标：对齐“形状 + 交互链路”，再逐步补真实功能。' : 'Goal: align shape + interaction flow, then add real features later.' }}
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  lang: 'en' | 'zh'
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

