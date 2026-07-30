<template>
  <div class="flex-1 overflow-hidden z-10 relative">
    <div class="flex h-full">
      <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar w-full" :style="{ padding: 'var(--reader-page-padding, 1.5rem)' }">
        <div class="w-full mx-auto bg-white/85 dark:bg-gray-900/85 rounded-[2rem] shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-white/60 dark:border-gray-700/60 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-xl transition-all duration-300 relative max-w-4xl xl:max-w-5xl" :style="{ padding: 'var(--reader-card-padding, 2.5rem)' }">
          <div class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-20 rounded-[2rem] backdrop-blur-sm">
            <div class="flex flex-col items-center gap-4">
              <div class="animate-spin text-4xl">🌸</div>
              <div class="text-sm font-bold animate-pulse text-[var(--primary-600)] dark:text-[var(--primary-300)]">Loading Article...</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">正在准备阅读界面</div>
            </div>
          </div>
          <div class="h-10 w-56 rounded-xl bg-gray-100/70 dark:bg-gray-800/50"></div>
          <div class="mt-8 space-y-4">
            <div class="h-4 w-[85%] rounded-lg bg-gray-100/70 dark:bg-gray-800/50"></div>
            <div class="h-4 w-[92%] rounded-lg bg-gray-100/70 dark:bg-gray-800/50"></div>
            <div class="h-4 w-[78%] rounded-lg bg-gray-100/70 dark:bg-gray-800/50"></div>
            <div class="h-4 w-[88%] rounded-lg bg-gray-100/70 dark:bg-gray-800/50"></div>
            <div class="h-4 w-[70%] rounded-lg bg-gray-100/70 dark:bg-gray-800/50"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

