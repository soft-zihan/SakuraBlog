<template>
  <div class="flex-1 overflow-hidden z-10 relative">
    <div class="flex h-full">
      <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar w-full" :style="{ padding: 'var(--reader-page-padding, 1.5rem)' }">
        <div class="w-full mx-auto bg-white/85 dark:bg-gray-900/85 rounded-[2rem] shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-white/60 dark:border-gray-700/60 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-xl transition-all duration-300 relative max-w-4xl xl:max-w-5xl" :style="{ padding: 'var(--reader-card-padding, 2.5rem)' }">
          <div class="flex flex-col items-center justify-center text-center gap-4 min-h-[50vh]">
            <div class="text-4xl">🌸</div>
            <div class="text-base font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)]">Article view failed to load</div>
            <div class="text-sm text-gray-600 dark:text-gray-400 max-w-md">可能是网络较慢或资源加载失败。请刷新重试。</div>
            <button type="button" class="px-4 py-2 rounded-full bg-[var(--primary-600)] text-white font-bold hover:bg-[var(--primary-700)] transition-colors" @click="retry">刷新重试</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const retry = () => {
  window.location.reload()
}
</script>

