<template>
  <Teleport to="body">
    <div v-if="appStore.toastMessage" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in pointer-events-none">
       <div class="bg-[var(--primary-500)]/90 dark:bg-[var(--primary-400)]/90 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl backdrop-blur font-medium text-sm flex items-center gap-2 border border-[var(--primary-200)]/60 dark:border-[var(--primary-300)]/40">
         <span>🌸</span> {{ appStore.toastMessage }}
       </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/appStore';

const appStore = useAppStore();
</script>
