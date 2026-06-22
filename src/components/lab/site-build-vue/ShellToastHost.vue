<template>
  <Teleport to="body">
    <div v-if="message" class="fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-4 pointer-events-none">
      <div
        class="pointer-events-auto max-w-[min(680px,calc(100vw-32px))] rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.22)] px-4 py-3 flex items-start gap-3"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div class="w-8 h-8 rounded-xl bg-[var(--primary-50)]/80 dark:bg-[var(--primary-900)]/35 border border-white/60 dark:border-gray-700/50 grid place-items-center text-sm">
          💡
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold text-gray-800 dark:text-gray-100">
            {{ message }}
          </div>
        </div>
        <button
          type="button"
          class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90"
          :title="lang === 'zh' ? '关闭' : 'Close'"
          :aria-label="lang === 'zh' ? '关闭提示' : 'Close toast'"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  lang: 'en' | 'zh'
  message: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>
