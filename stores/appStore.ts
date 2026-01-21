import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { I18N, THEME_COLORS } from '../constants'
import type { ThemeColorId } from '../constants'

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
    petalLayer: 'back' as 'front' | 'back',
    themeColor: 'sakura' as ThemeColorId,
    articleStyle: 'classic' as 'classic' | 'clean' | 'compact' | 'lined' | 'grid'
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
  
  function applyThemeColor(color: ThemeColorId) {
    const p = THEME_COLORS[color].palette
    const root = document.documentElement
    root.style.setProperty('--primary-50', p[50])
    root.style.setProperty('--primary-100', p[100])
    root.style.setProperty('--primary-300', p[300])
    root.style.setProperty('--primary-400', p[400])
    root.style.setProperty('--primary-500', p[500])
    root.style.setProperty('--primary-600', p[600])
    root.style.setProperty('--primary-700', p[700])
    root.style.setProperty('--primary-900', p[900])
    const hexToRgba = (hex: string, alpha: number) => {
      const h = hex.replace('#', '')
      const r = parseInt(h.substring(0, 2), 16)
      const g = parseInt(h.substring(2, 4), 16)
      const b = parseInt(h.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    root.style.setProperty('--primary-900-30', hexToRgba(p[900], 0.3))
    root.style.setProperty('--primary-100-50', hexToRgba(p[100], 0.5))
    root.setAttribute('data-theme-color', color)
  }
  
  function setThemeColor(color: ThemeColorId) {
    userSettings.value.themeColor = color
    applyThemeColor(color)
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
    applyThemeColor,
    setThemeColor,
    // Computed
    fontSizeClass
  }
}, {
  persist: {
    pick: ['lang', 'isDark', 'currentWallpaperFilename', 'customWallpapers', 'wallpaperApiSettings', 'userSettings', 'showParticles', 'readingMode']
  }
})
