<template>
  <div class="banner-settings">
    <!-- Toggle Button -->
    <button 
      @click="showPanel = !showPanel"
      class="p-2 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
      :title="lang === 'zh' ? '横幅设置' : 'Banner Settings'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    </button>
    
    <!-- Settings Panel -->
    <Transition name="slide">
      <div 
        v-if="showPanel"
        class="absolute top-full right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
      >
        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          {{ lang === 'zh' ? '横幅模式' : 'Banner Mode' }}
        </h4>
        
        <div class="space-y-2">
          <button 
            v-for="mode in modes" 
            :key="mode.value"
            @click="setMode(mode.value)"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
            :class="currentMode === mode.value 
              ? 'bg-sakura-50 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-400' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'"
          >
            <span class="text-lg">{{ mode.icon }}</span>
            <div class="text-left">
              <div class="text-sm font-medium">{{ mode.label[lang] }}</div>
              <div class="text-[10px] text-gray-400">{{ mode.desc[lang] }}</div>
            </div>
            <svg 
              v-if="currentMode === mode.value" 
              class="w-4 h-4 ml-auto text-sakura-500"
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </button>
        </div>
        
        <!-- Wallpaper Selection -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {{ lang === 'zh' ? '壁纸选择' : 'Wallpaper' }}
          </h4>
          
          <div class="grid grid-cols-3 gap-2">
            <button 
              v-for="(wp, idx) in wallpapers" 
              :key="idx"
              @click="selectWallpaper(idx)"
              class="aspect-square rounded-lg overflow-hidden border-2 transition-all"
              :class="selectedWallpaper === idx 
                ? 'border-sakura-500 shadow-lg' 
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'"
            >
              <img :src="wp.thumb" class="w-full h-full object-cover" :alt="wp.name" />
            </button>
          </div>
        </div>
        
        <!-- Close Button -->
        <button 
          @click="showPanel = false"
          class="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'change', mode: string): void
  (e: 'wallpaper-change', index: number): void
}>()

const showPanel = ref(false)
const currentMode = ref('normal')
const selectedWallpaper = ref(0)

const modes = [
  { 
    value: 'normal', 
    icon: '🖼️', 
    label: { en: 'Normal', zh: '标准模式' },
    desc: { en: 'Standard banner', zh: '标准横幅显示' }
  },
  { 
    value: 'fullscreen', 
    icon: '📺', 
    label: { en: 'Fullscreen', zh: '全屏模式' },
    desc: { en: 'Full screen banner', zh: '横幅铺满屏幕' }
  },
  { 
    value: 'background', 
    icon: '🎨', 
    label: { en: 'Background', zh: '背景模式' },
    desc: { en: 'Subtle background', zh: '作为淡化背景' }
  },
  { 
    value: 'hide', 
    icon: '🚫', 
    label: { en: 'Hide', zh: '隐藏壁纸' },
    desc: { en: 'No wallpaper', zh: '不显示壁纸' }
  }
]

const wallpapers = [
  { name: 'Default Light', thumb: '/image/wallpaper-light.jpg' },
  { name: 'Default Dark', thumb: '/image/wallpaper-dark.jpg' },
  { name: 'Sakura', thumb: '/image/banner-1.jpg' },
  { name: 'Sky', thumb: '/image/banner-2.jpg' },
  { name: 'Forest', thumb: '/image/banner-3.jpg' },
  { name: 'Ocean', thumb: '/image/banner-4.jpg' }
]

const setMode = (mode: string) => {
  currentMode.value = mode
  localStorage.setItem('banner-mode', mode)
  document.documentElement.setAttribute('data-banner-mode', mode)
  emit('change', mode)
}

const selectWallpaper = (index: number) => {
  selectedWallpaper.value = index
  localStorage.setItem('selected-wallpaper', index.toString())
  emit('wallpaper-change', index)
}

onMounted(() => {
  currentMode.value = localStorage.getItem('banner-mode') || 'normal'
  selectedWallpaper.value = parseInt(localStorage.getItem('selected-wallpaper') || '0')
  document.documentElement.setAttribute('data-banner-mode', currentMode.value)
})

// Close panel when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.banner-settings')) {
    showPanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
