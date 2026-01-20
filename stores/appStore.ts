import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { I18N } from '../constants'

export const useAppStore = defineStore('app', () => {
  // Language
  const lang = ref<'en' | 'zh'>('zh')
  const t = computed(() => I18N[lang.value])
  
  // Theme
  const isDark = ref(false)
  
  // Wallpaper - persist filename or url
  const currentWallpaperFilename = ref('')
  const customWallpapers = ref<Array<{
    id: string
    name: string
    url: string
    theme: 'light' | 'dark' | 'auto'
    source: 'url' | 'local' | 'api'
  }>>([])
  const wallpaperApiSettings = ref({
    bingEnabled: false,
    bingCountry: 'cn',
    bingCount: 8,
    bingLastDate: '',
    bingLastUrl: '',
    upx8Keyword: ''
  })
  
  // User Settings
  const userSettings = ref({
    fontSize: 'normal' as 'small' | 'normal' | 'large',
    fontFamily: 'sans' as 'sans' | 'serif',
    petalSpeed: 'slow' as 'off' | 'slow' | 'fast',
    bannerMode: 'normal' as 'normal' | 'fullscreen' | 'background' | 'hide',
    petalLayer: 'back' as 'front' | 'back'  // 樱花在文章前还是后，默认在后
  })
  
  // UI State
  const showParticles = ref(true)
  const showSettings = ref(false)
  const sidebarOpen = ref(true) // For mobile
  const toastMessage = ref('')
  const readingMode = ref(false)
  
  // Actions
  function toggleLang() {
    lang.value = lang.value === 'en' ? 'zh' : 'en'
  }
  
  function toggleTheme() {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function setTheme(dark: boolean) {
    isDark.value = dark
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function showToast(msg: string, duration = 2000) {
    toastMessage.value = msg
    setTimeout(() => {
      toastMessage.value = ''
    }, duration)
  }
  
  function updateSettings<K extends keyof typeof userSettings.value>(key: K, value: typeof userSettings.value[K]) {
    userSettings.value[key] = value
  }
  
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function toggleReadingMode() {
    readingMode.value = !readingMode.value
  }

  function setReadingMode(value: boolean) {
    readingMode.value = value
  }

  function setLang(newLang: 'en' | 'zh') {
    lang.value = newLang
  }

  function setDark(dark: boolean) {
    isDark.value = dark
  }
  
  function setWallpaper(filename: string) {
    currentWallpaperFilename.value = filename
  }
  
  // Computed
  const fontSizeClass = computed(() => {
    switch (userSettings.value.fontSize) {
      case 'small': return 'text-sm lg:text-base leading-relaxed'
      case 'large': return 'text-xl lg:text-2xl leading-loose'
      default: return 'text-base lg:text-lg leading-loose'
    }
  })
  
  return {
    // State
    lang,
    t,
    isDark,
    currentWallpaperFilename,
    customWallpapers,
    wallpaperApiSettings,
    userSettings,
    showParticles,
    showSettings,
    sidebarOpen,
    toastMessage,
    readingMode,
    // Actions
    toggleLang,
    toggleTheme,
    setTheme,
    setLang,
    setDark,
    setWallpaper,
    showToast,
    updateSettings,
    toggleSidebar,
    toggleReadingMode,
    setReadingMode,
    // Computed
    fontSizeClass
  }
}, {
  persist: {
    pick: ['lang', 'isDark', 'currentWallpaperFilename', 'customWallpapers', 'wallpaperApiSettings', 'userSettings', 'showParticles', 'readingMode']
  }
})
