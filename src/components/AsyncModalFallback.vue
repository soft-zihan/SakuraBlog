<template>
  <div class="fixed inset-0 z-[2500] flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm">
    <div class="flex flex-col items-center gap-3 rounded-3xl bg-white/80 dark:bg-gray-950/70 border border-white/50 dark:border-gray-800/60 px-6 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
      <div class="text-3xl animate-spin-slow select-none">🌸</div>
      <div class="text-sm font-bold text-rose-800 dark:text-rose-200">Loading…</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 1.6s linear infinite;
}
</style>

