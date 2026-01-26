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
    v-if="showFloating && musicStore.currentTrack && !isMusicPage && !isMobileDevice" 
    ref="fabContainer"
    class="fixed z-50 pointer-events-auto hidden md:block group/fab"
    :style="{ bottom: fabPosition.bottom + 'px', right: fabPosition.right + 'px' }"
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
    
    <!-- Rotating Circle Button - 支持拖动 -->
    <div
      @mousedown="handleButtonMouseDown"
      @touchstart="handleButtonTouchStart"
      class="w-16 h-16 rounded-full bg-gradient-to-br from-sakura-400 to-sakura-600 shadow-2xl shadow-sakura-500/40 hover:shadow-sakura-500/60 transition-all duration-300 hover:scale-110 flex items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
      :class="{ 'scale-95': isDragging }"
    >
      <!-- Drag Indicator -->
      <div 
        class="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/40 rounded-full opacity-0 group-hover/fab:opacity-100 transition-opacity"
      ></div>
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
      <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/fab:opacity-100 transition-opacity duration-200 pointer-events-none">
        {{ isDragging ? '拖动中' : (musicStore.isPlaying ? 'Pause' : 'Play') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const props = defineProps<{
  isMusicPage?: boolean
  showFloating?: boolean
}>()

const musicStore = useMusicStore()
const audioEl = ref<HTMLAudioElement | null>(null)
const fabContainer = ref<HTMLElement | null>(null)

const isMusicPage = computed(() => props.isMusicPage ?? (typeof window !== 'undefined' ? window.location.pathname.includes('/music') : false))
const showFloating = computed(() => props.showFloating !== false)

// 拖动相关
const fabPosition = ref({ bottom: 32, right: 32 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const positionStart = ref({ bottom: 0, right: 0 })
const hasMoved = ref(false) // 用于区分点击和拖动

// 处理鼠标按下 - 准备拖动
const handleButtonMouseDown = (e: MouseEvent) => {
  e.preventDefault()
  hasMoved.value = false
  
  dragStart.value = { x: e.clientX, y: e.clientY }
  positionStart.value = { ...fabPosition.value }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', handleButtonMouseUp)
}

// 处理触摸开始
const handleButtonTouchStart = (e: TouchEvent) => {
  hasMoved.value = false
  
  const touch = e.touches[0]
  dragStart.value = { x: touch.clientX, y: touch.clientY }
  positionStart.value = { ...fabPosition.value }
  
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', handleButtonTouchEnd)
}

// 鼠标释放 - 判断是点击还是拖动
const handleButtonMouseUp = () => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', handleButtonMouseUp)
  
  if (!hasMoved.value) {
    // 没有移动，视为点击
    togglePlay()
  } else {
    // 有移动，保存位置
    localStorage.setItem('music_fab_position', JSON.stringify(fabPosition.value))
  }
  
  isDragging.value = false
  hasMoved.value = false
}

// 触摸结束
const handleButtonTouchEnd = () => {
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', handleButtonTouchEnd)
  
  if (!hasMoved.value) {
    togglePlay()
  } else {
    localStorage.setItem('music_fab_position', JSON.stringify(fabPosition.value))
  }
  
  isDragging.value = false
  hasMoved.value = false
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDragging.value = true
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  dragStart.value = { x: clientX, y: clientY }
  positionStart.value = { ...fabPosition.value }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y
  
  // 检测是否有足够的移动（超过5px视为拖动）
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    hasMoved.value = true
    isDragging.value = true
  }
  
  if (!hasMoved.value) return
  
  // 阻止触摸事件的默认行为（防止滚动）
  if ('touches' in e) {
    e.preventDefault()
  }
  
  // 计算新位置（注意：right 和 bottom 是从右下角计算的）
  const newRight = Math.max(8, Math.min(window.innerWidth - 80, positionStart.value.right - deltaX))
  const newBottom = Math.max(8, Math.min(window.innerHeight - 80, positionStart.value.bottom - deltaY))
  
  fabPosition.value = { bottom: newBottom, right: newRight }
}

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    // 保存位置到 localStorage
    localStorage.setItem('music_fab_position', JSON.stringify(fabPosition.value))
  }
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 从 localStorage 恢复位置
const loadFabPosition = () => {
  const saved = localStorage.getItem('music_fab_position')
  if (saved) {
    try {
      const pos = JSON.parse(saved)
      // 确保位置在屏幕范围内
      fabPosition.value = {
        bottom: Math.max(8, Math.min(window.innerHeight - 80, pos.bottom || 32)),
        right: Math.max(8, Math.min(window.innerWidth - 80, pos.right || 32))
      }
    } catch (e) {
      fabPosition.value = { bottom: 32, right: 32 }
    }
  }
}

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

// Check if on mobile device
const isMobileDevice = ref(false)

const checkMobile = () => {
  isMobileDevice.value = window.innerWidth < 768
}

onMounted(async () => {
  checkMobile()
  loadFabPosition() // 恢复播放器位置
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
    loop: '列表循环',
    single: '单曲循环',
    shuffle: '随机播放'
  }
  return modes[musicStore.playMode] || ''
})

const playAudio = async () => {
  if (!audioEl.value) return
  try {
    await audioEl.value.play()
  } catch (e) {
    const el = audioEl.value
    const onCanPlay = () => {
      el.removeEventListener('canplay', onCanPlay)
      el.play().catch(() => musicStore.pause())
    }
    el.addEventListener('canplay', onCanPlay, { once: true })
  }
}

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
    playAudio()
  } else {
    audioEl.value.pause()
  }
})

watch(() => musicStore.currentIndex, () => {
  if (!audioEl.value) return
  audioEl.value.currentTime = 0
  musicStore.setCurrentTime(0)
  musicStore.setDuration(0)
  audioEl.value.load()
  if (musicStore.isPlaying) {
    playAudio()
  }
})

watch(() => musicStore.currentTrack?.url, (url) => {
  if (!audioEl.value || !url) return
  audioEl.value.currentTime = 0
  musicStore.setCurrentTime(0)
  musicStore.setDuration(0)
  audioEl.value.load()
  if (musicStore.isPlaying) {
    playAudio()
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

// 监听 seek 请求，同步 audioEl.currentTime
watch(() => musicStore.seekRequestTime, (time) => {
  if (time !== null && audioEl.value) {
    audioEl.value.currentTime = time
    musicStore.clearSeekRequest()
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

// 删除重复的 onMounted，合并到上面的 onMounted 中

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
