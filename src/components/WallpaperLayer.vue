<template>
  <div 
    v-if="bannerMode !== 'hide'"
    :class="['pointer-events-none overflow-hidden', containerClass]"
    :style="containerStyle"
  >
    <!-- Current Wallpaper -->
    <div 
      class="absolute inset-0 transition-opacity duration-1000"
      :class="{ 'opacity-100': !isTransitioning, 'opacity-0': isTransitioning }"
      :style="currentBgStyle"
    ></div>
    
    <!-- Next Wallpaper (for transition) -->
    <div 
      class="absolute inset-0 transition-opacity duration-1000"
      :class="{ 'opacity-0': !isTransitioning, 'opacity-100': isTransitioning }"
      :style="nextBgStyle"
    ></div>
    
    <!-- Typewriter Text Overlay -->
    <div 
      v-if="showTypewriter"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="text-center px-8">
        <h1 class="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-wide">
          <span class="inline-block">{{ displayText }}</span>
          <span class="animate-blink text-sakura-400">|</span>
        </h1>
      </div>
    </div>
    
    <!-- Wave Animation -->
    <div 
      v-if="showWaves"
      class="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
    >
      <svg 
        class="absolute bottom-0 w-full h-full" 
        viewBox="0 0 1440 120" 
        preserveAspectRatio="none"
      >
        <path 
          class="wave-path animate-wave-1"
          :fill="isDark ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 240, 245, 0.6)'"
          d="M0,40 C480,100 960,0 1440,40 L1440,120 L0,120 Z"
        />
        <path 
          class="wave-path animate-wave-2"
          :fill="isDark ? 'rgba(17, 24, 39, 0.4)' : 'rgba(255, 240, 245, 0.4)'"
          d="M0,60 C480,20 960,100 1440,60 L1440,120 L0,120 Z"
        />
        <path 
          class="wave-path animate-wave-3"
          :fill="isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 240, 245, 0.8)'"
          d="M0,80 C480,60 960,100 1440,80 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
    
    <!-- Gradient Overlay -->
    <div 
      class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 dark:to-gray-900/50"
      :style="{ opacity: bannerMode === 'background' ? 0.4 : 1 }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useWallpapers } from '../composables/useWallpapers'
import { useAppStore } from '../stores/appStore'

const props = defineProps<{ 
  isDark: boolean
  lightUrl?: string
  darkUrl?: string
  bannerMode?: 'normal' | 'fullscreen' | 'background' | 'hide'
  wallpaperIndex?: number
  typewriterTexts?: string[]
  showTypewriter?: boolean
  showWaves?: boolean
}>()

const appStore = useAppStore()
// Use wallpaper composable
const { currentWallpaper } = useWallpapers()

const isTransitioning = ref(false)

const bannerMode = computed(() => props.bannerMode || 'normal')

const containerClass = computed(() =>
  'fixed inset-0 z-[-2]'
)

const containerStyle = computed(() => {
  if (bannerMode.value === 'background') {
    return { opacity: 0.55, filter: 'blur(3px) saturate(115%)' }
  }
  if (bannerMode.value === 'fullscreen') {
    return { opacity: 0.9 }
  }
  return {}
})

const bgSize = computed(() => {
  const fill = appStore.userSettings.wallpaperFill
  return fill === 'fill' ? '100% 100%' : fill
})

const currentBgStyle = computed(() => {
  return {
    backgroundImage: `url(${currentWallpaper.value})`,
    backgroundSize: bgSize.value,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: props.isDark ? 'saturate(80%) brightness(0.8)' : 'saturate(120%) brightness(1.0)'
  }
})

const nextBgStyle = computed(() => {
  return {
    backgroundImage: `url(${currentWallpaper.value})`,
    backgroundSize: bgSize.value,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: props.isDark ? 'saturate(80%) brightness(0.8)' : 'saturate(120%) brightness(1.0)'
  }
})

// Typewriter effect
const defaultTexts = ['Welcome Home', '欢迎回家', 'Sakura Notes', '探索知识花园']
const typewriterTexts = computed(() => props.typewriterTexts || defaultTexts)
const displayText = ref('')
let typewriterInterval: ReturnType<typeof setTimeout> | null = null
let textIndex = 0
let charIndex = 0
let isDeleting = false

const typeWriter = () => {
  const currentText = typewriterTexts.value[textIndex]
  
  if (!isDeleting) {
    displayText.value = currentText.substring(0, charIndex + 1)
    charIndex++
    
    if (charIndex === currentText.length) {
      isDeleting = true
      typewriterInterval = setTimeout(typeWriter, 2000) // Pause at end
      return
    }
  } else {
    displayText.value = currentText.substring(0, charIndex - 1)
    charIndex--
    
    if (charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % typewriterTexts.value.length
    }
  }
  
  const speed = isDeleting ? 50 : 150
  typewriterInterval = setTimeout(typeWriter, speed)
}

onMounted(() => {
  if (props.showTypewriter !== false) {
    typeWriter()
  }
})

onUnmounted(() => {
  if (typewriterInterval) {
    clearTimeout(typewriterInterval)
  }
})
</script>

<style scoped>
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s infinite;
}

@keyframes wave1 {
  0%, 100% { d: path('M0,40 C480,100 960,0 1440,40 L1440,120 L0,120 Z'); }
  50% { d: path('M0,60 C480,20 960,80 1440,50 L1440,120 L0,120 Z'); }
}

@keyframes wave2 {
  0%, 100% { d: path('M0,60 C480,20 960,100 1440,60 L1440,120 L0,120 Z'); }
  50% { d: path('M0,50 C480,80 960,30 1440,70 L1440,120 L0,120 Z'); }
}

@keyframes wave3 {
  0%, 100% { d: path('M0,80 C480,60 960,100 1440,80 L1440,120 L0,120 Z'); }
  50% { d: path('M0,90 C480,100 960,70 1440,85 L1440,120 L0,120 Z'); }
}

.animate-wave-1 {
  animation: wave1 8s ease-in-out infinite;
}

.animate-wave-2 {
  animation: wave2 6s ease-in-out infinite;
}

.animate-wave-3 {
  animation: wave3 4s ease-in-out infinite;
}
</style>
