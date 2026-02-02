<template>
  <div ref="rootRef" class="banner-settings">
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
              ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)]' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'"
          >
            <span class="text-lg">{{ mode.icon }}</span>
            <div class="text-left">
              <div class="text-sm font-medium">{{ mode.label[lang] }}</div>
              <div class="text-[10px] text-gray-400">{{ mode.desc[lang] }}</div>
            </div>
            <svg 
              v-if="currentMode === mode.value" 
              class="w-4 h-4 ml-auto text-[var(--primary-500)]"
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
              v-for="(wp, idx) in currentThemeWallpapers" 
              :key="wp.filename"
              @click="selectWallpaper(wp.filename)"
              class="aspect-square rounded-lg overflow-hidden border-2 transition-all relative group"
              :class="appStore.currentWallpaperFilename === wp.filename 
                ? 'border-[var(--primary-500)] shadow-lg ring-2 ring-[var(--primary-200)] dark:ring-[var(--primary-800)]' 
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'"
              :title="wp.name"
            >
              <img :src="wp.path" class="w-full h-full object-cover" :alt="wp.name" />
              <div v-if="appStore.currentWallpaperFilename === wp.filename" class="absolute inset-0 bg-[var(--primary-500)]/20 flex items-center justify-center">
                <svg class="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useWallpapers } from '../composables/useWallpapers'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'change', mode: string): void
}>()

const appStore = useAppStore()
const { currentThemeWallpapers, setWallpaper } = useWallpapers()

const showPanel = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const currentMode = ref(appStore.userSettings.bannerMode)

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

const setMode = (mode: string) => {
  currentMode.value = mode as 'normal' | 'fullscreen' | 'background' | 'hide'
  appStore.updateSettings('bannerMode', currentMode.value)
  document.documentElement.setAttribute('data-banner-mode', mode)
  emit('change', mode)
}

const selectWallpaper = (filename: string) => {
  setWallpaper(filename)
}

const handleClickOutside = (e: MouseEvent) => {
  if (!showPanel.value) return
  const root = rootRef.value
  const target = e.target as Node | null
  if (!root || !target) return
  if (!root.contains(target)) showPanel.value = false
}

onMounted(() => {
  currentMode.value = appStore.userSettings.bannerMode
  document.documentElement.setAttribute('data-banner-mode', currentMode.value)
  document.addEventListener('click', handleClickOutside)
})

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
