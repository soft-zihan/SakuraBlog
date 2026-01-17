<template>
  <div v-if="musicStore.showMiniPlayer && musicStore.currentTrack" class="mini-player">
    <!-- Hidden Audio Element -->
    <audio
      ref="audioEl"
      :src="musicStore.currentTrack?.url"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @error="onError"
    ></audio>
    
    <!-- Mini Player UI -->
    <div 
      class="fixed bottom-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-sakura-200/50 dark:border-gray-700 p-3 flex items-center gap-3 transition-all duration-300 hover:shadow-sakura-200/30 dark:hover:shadow-sakura-900/30 group"
      :class="{ 'w-64': !isExpanded, 'w-80': isExpanded }"
    >
      <!-- Cover Art -->
      <div class="relative w-12 h-12 shrink-0">
        <img 
          :src="musicStore.currentTrack?.cover || '/image/music-default.jpg'" 
          class="w-full h-full rounded-xl object-cover shadow-md"
          :class="{ 'animate-spin-slow': musicStore.isPlaying }"
          @error="handleCoverError"
        />
        <div v-if="musicStore.isPlaying" class="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <!-- Track Info -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
          {{ musicStore.currentTrack?.title || 'No Track' }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {{ musicStore.currentTrack?.artist || 'Unknown' }}
        </div>
        
        <!-- Progress Bar -->
        <div 
          class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 cursor-pointer overflow-hidden"
          @click="seekTo"
        >
          <div 
            class="h-full bg-gradient-to-r from-sakura-400 to-sakura-600 rounded-full transition-all duration-100"
            :style="{ width: musicStore.progress + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- Controls -->
      <div class="flex items-center gap-1">
        <button 
          @click="musicStore.prev()"
          class="p-1.5 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button 
          @click="musicStore.togglePlay()"
          class="p-2 bg-sakura-500 hover:bg-sakura-600 text-white rounded-full transition-colors shadow-lg shadow-sakura-500/30"
        >
          <svg v-if="!musicStore.isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        
        <button 
          @click="musicStore.next()"
          class="p-1.5 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
        
        <!-- Expand Button -->
        <button 
          @click="musicStore.showFullPlayer = true"
          class="p-1.5 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
        </button>
        
        <!-- Close Button -->
        <button 
          @click="musicStore.showMiniPlayer = false"
          class="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()
const audioEl = ref<HTMLAudioElement | null>(null)
const isExpanded = ref(false)

// Sync audio element with store state
watch(() => musicStore.isPlaying, (playing) => {
  if (!audioEl.value) return
  if (playing) {
    audioEl.value.play().catch(e => {
      console.warn('Autoplay prevented:', e)
      musicStore.pause()
    })
  } else {
    audioEl.value.pause()
  }
})

watch(() => musicStore.currentIndex, () => {
  if (audioEl.value) {
    audioEl.value.currentTime = 0
    if (musicStore.isPlaying) {
      audioEl.value.play().catch(() => musicStore.pause())
    }
  }
})

watch(() => musicStore.volume, (vol) => {
  if (audioEl.value) {
    audioEl.value.volume = musicStore.isMuted ? 0 : vol
  }
})

watch(() => musicStore.isMuted, (muted) => {
  if (audioEl.value) {
    audioEl.value.volume = muted ? 0 : musicStore.volume
  }
})

const onTimeUpdate = () => {
  if (audioEl.value) {
    musicStore.setCurrentTime(audioEl.value.currentTime)
  }
}

const onLoadedMetadata = () => {
  if (audioEl.value) {
    musicStore.setDuration(audioEl.value.duration)
  }
}

const onEnded = () => {
  if (musicStore.playMode === 'single') {
    if (audioEl.value) {
      audioEl.value.currentTime = 0
      audioEl.value.play()
    }
  } else {
    musicStore.next()
  }
}

const onError = (e: Event) => {
  console.error('Audio error:', e)
}

const seekTo = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const time = percent * musicStore.duration
  
  if (audioEl.value) {
    audioEl.value.currentTime = time
  }
  musicStore.seek(time)
}

const handleCoverError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/image/music-default.jpg'
}

onMounted(async () => {
  await musicStore.loadPlaylist()
  
  if (audioEl.value) {
    audioEl.value.volume = musicStore.volume
  }
})
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>
