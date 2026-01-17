import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { I18N } from '../constants'

export const useAppStore = defineStore('app', () => {
  // Language
  const lang = ref<'en' | 'zh'>('zh')
  const t = computed(() => I18N[lang.value])
  
  // Theme
  const isDark = ref(false)
  
  // User Settings
  const userSettings = ref({
    fontSize: 'normal' as 'small' | 'normal' | 'large',
    fontFamily: 'sans' as 'sans' | 'serif',
    petalSpeed: 'slow' as 'slow' | 'fast',
    bannerMode: 'normal' as 'normal' | 'fullscreen' | 'background' | 'hide'
  })
  
  // UI State
  const showParticles = ref(true)
  const showSettings = ref(false)
  const sidebarOpen = ref(true) // For mobile
  const toastMessage = ref('')
  
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

  function setLang(newLang: 'en' | 'zh') {
    lang.value = newLang
  }

  function setDark(dark: boolean) {
    isDark.value = dark
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
    userSettings,
    showParticles,
    showSettings,
    sidebarOpen,
    toastMessage,
    // Actions
    toggleLang,
    toggleTheme,
    setTheme,
    setLang,
    setDark,
    showToast,
    updateSettings,
    toggleSidebar,
    // Computed
    fontSizeClass
  }
}, {
  persist: {
    pick: ['lang', 'isDark', 'userSettings']
  }
})
