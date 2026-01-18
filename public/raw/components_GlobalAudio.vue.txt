<template>
  <!-- Hidden Audio Element -->
  <audio
    ref="audioEl"
    :src="musicStore.currentTrack?.url"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"
    @ended="onEnded"
    @error="onError"
  ></audio>
  
  <!-- Mini FAB Button - Only spinning circle, NO card display -->
  <div 
    v-if="musicStore.currentTrack && !isMusicPage && !isMobileDevice" 
    class="fixed bottom-8 right-8 z-50 pointer-events-auto hidden md:block"
    @mouseenter="showControls"
    @mouseleave="hideControlsDelayed"
  >
    
    <!-- Hover Media Controls -->
    <div 
      class="absolute bottom-full right-0 mb-3 transition-all duration-300 transform"
      :class="isControlsVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'"
    >
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
        <!-- Track Info -->
        <div class="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <img 
            :src="musicStore.currentTrack?.cover || '/image/music-default.jpg'" 
            class="w-12 h-12 rounded-lg object-cover shadow-md"
            :alt="musicStore.currentTrack?.title"
          />
          <div class="flex-1 min-w-0">
            <div class="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">
              {{ musicStore.currentTrack?.title || 'Unknown' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ musicStore.currentTrack?.artist || 'Unknown Artist' }}
            </div>
          </div>
        </div>
        
        <!-- Playback Controls -->
        <div class="flex items-center justify-center gap-2 mb-3">
          <button 
            @click="musicStore.prev()" 
            class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            title="Previous"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button 
            @click="togglePlay" 
            class="w-10 h-10 rounded-full bg-sakura-500 hover:bg-sakura-600 flex items-center justify-center transition-colors shadow-lg"
            :title="musicStore.isPlaying ? 'Pause' : 'Play'"
          >
            <svg v-if="!musicStore.isPlaying" class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          </button>
          
          <button 
            @click="musicStore.next()" 
            class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            title="Next"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2zm-11-1l8.5-6L5 5z"/>
            </svg>
          </button>
          
          <button 
            @click="musicStore.cyclePlayMode()" 
            class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            :title="playModeTitle"
          >
            <svg v-if="musicStore.playMode === 'sequence'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            <svg v-else-if="musicStore.playMode === 'single'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><text x="10" y="16" font-size="8" fill="currentColor">1</text>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </button>
        </div>
        
        <!-- Volume Control -->
        <div class="flex items-center gap-2">
          <button 
            @click="musicStore.toggleMute()" 
            class="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-sakura-500 transition-colors"
          >
            <svg v-if="!musicStore.isMuted && musicStore.volume > 0.5" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <svg v-else-if="!musicStore.isMuted" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            :value="musicStore.volume" 
            @input="(e) => musicStore.setVolume(Number((e.target as HTMLInputElement).value))"
            class="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sakura-500 [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>
    </div>
    
    <!-- Rotating Circle Button -->
    <button
      @click="togglePlay"
      class="w-16 h-16 rounded-full bg-gradient-to-br from-sakura-400 to-sakura-600 shadow-2xl shadow-sakura-500/40 hover:shadow-sakura-500/60 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative overflow-hidden"
    >
      <!-- Rotating Cover Background -->
      <div 
        class="absolute inset-1 rounded-full overflow-hidden"
        :class="{ 'animate-spin-slow': musicStore.isPlaying }"
        :style="{ 
          animationPlayState: musicStore.isPlaying ? 'running' : 'paused',
          background: `url('${musicStore.currentTrack?.cover || '/image/music-default.jpg'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5
        }"
      ></div>
      
      <!-- Center Icon -->
      <div class="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <!-- Visualizer bars when paused -->
        <div v-if="!musicStore.isPlaying" class="w-2.5 h-2.5 flex gap-0.5 items-end justify-center">
          <div class="w-0.5 bg-white h-1.5 rounded-full transition-all duration-300"></div>
          <div class="w-0.5 bg-white h-2 rounded-full transition-all duration-300"></div>
          <div class="w-0.5 bg-white h-1 rounded-full transition-all duration-300"></div>
          <div class="w-0.5 bg-white h-2.5 rounded-full transition-all duration-300"></div>
        </div>
        
        <!-- Play/Pause Icon -->
        <div v-else class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-0.5">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </div>
      </div>
      
      <!-- Hover tooltip (simple one) - Hidden when controls are shown -->
      <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/audio:opacity-0 transition-opacity duration-200 pointer-events-none">
        {{ musicStore.isPlaying ? 'Pause' : 'Play' }}
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()
const audioEl = ref<HTMLAudioElement | null>(null)

// Hover state with delayed hide
const isControlsVisible = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const showControls = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  isControlsVisible.value = true
}

const hideControlsDelayed = () => {
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    isControlsVisible.value = false
  }, 300) // 300ms delay
}

onUnmounted(() => {
  if (hideTimeout) clearTimeout(hideTimeout)
})

// Check if on music page
const isMusicPage = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes('/music')
  }
  return false
})

// Check if on mobile device
const isMobileDevice = ref(false)

const checkMobile = () => {
  isMobileDevice.value = window.innerWidth < 768
}

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  await musicStore.loadPlaylist()
  
  if (audioEl.value) {
    audioEl.value.volume = musicStore.volume
  }
})

// Play mode title
const playModeTitle = computed(() => {
  const modes = {
    sequence: '顺序播放',
    single: '单曲循环',
    shuffle: '随机播放'
  }
  return modes[musicStore.playMode] || ''
})

// Simple play/pause toggle
const togglePlay = () => {
  if (musicStore.isPlaying) {
    musicStore.pause()
  } else {
    musicStore.play()
  }
}

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

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  await musicStore.loadPlaylist()
  
  if (audioEl.value) {
    audioEl.value.volume = musicStore.volume
  }
})

onUnmounted(() => {
  if (hideTimeout) clearTimeout(hideTimeout)
  window.removeEventListener('resize', checkMobile)
})

// Save current track and playing state on changes
watch(() => musicStore.currentTrack, (track) => {
  if (track) {
    localStorage.setItem('music_currentTrackFilename', musicStore.getTrackFilename(track))
  }
})

watch(() => musicStore.isPlaying, (playing) => {
  localStorage.setItem('music_isPlaying', String(playing))
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
