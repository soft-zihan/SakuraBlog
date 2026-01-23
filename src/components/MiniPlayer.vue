<template>
  <Teleport to="body">
    <div 
      v-if="musicStore.isPlaying || musicStore.currentTrack"
      class="fixed bottom-6 right-6 z-[90] flex items-center gap-3 animate-fade-in"
      :class="{ 'translate-y-24': musicStore.showMusicPlayer }"
    >
      <!-- Mini Player Bubble -->
      <div 
        class="group relative flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full p-1.5 shadow-xl border border-white/50 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all duration-300"
        @click="musicStore.showMusicPlayer = true"
      >
        <!-- Spinning Cover -->
        <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-sakura-200 dark:border-gray-600">
          <img 
            :src="musicStore.currentTrack?.cover || '/image/music-default.jpg'" 
            class="w-full h-full object-cover animate-spin-slow"
            :style="{ animationPlayState: musicStore.isPlaying ? 'running' : 'paused' }"
            @error="handleCoverError"
          />
          <!-- Center Hole -->
          <div class="absolute inset-0 m-auto w-3 h-3 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700"></div>
        </div>

        <!-- Controls (Visible on hover) -->
        <div class="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-[max-width] duration-300 flex items-center gap-1 pl-0 group-hover:pl-2">
           <button 
             @click.stop="musicStore.togglePlay()"
             class="p-2 text-gray-600 dark:text-gray-300 hover:text-sakura-500 dark:hover:text-sakura-400"
           >
             <svg v-if="!musicStore.isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
           </button>
           <button 
             @click.stop="musicStore.next()"
             class="p-2 text-gray-600 dark:text-gray-300 hover:text-sakura-500 dark:hover:text-sakura-400"
           >
             <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
           </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useMusicStore } from '../stores/musicStore';

const musicStore = useMusicStore();

const handleCoverError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/image/music-default.jpg';
}
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
