import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { I18N, THEME_COLORS } from '../constants'
import { NodeType } from '../types'
import type { ThemeColorId } from '../constants'
import type { FileNode } from '../types'

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
  // Persisted API wallpapers list
  const apiWallpapers = ref<Array<{
    filename: string
    path: string
    name: string
    source: 'api'
  }>>([])
  
  const wallpaperApiSettings = ref({
    bingEnabled: false,
    bingCountry: 'cn',
    bingCount: 8,
    bingLastDate: '',
    bingLastUrl: '',
    baiduKeyword: '',
    baiduLimit: 8
  })
  
  // User Settings
  const userSettings = ref({
    fontSize: 'normal' as 'small' | 'normal' | 'large',
    fontFamily: 'sans' as 'sans' | 'serif' | 'kaiti',
    petalSpeed: 'slow' as 'off' | 'slow' | 'fast',
    bannerMode: 'normal' as 'normal' | 'fullscreen' | 'background' | 'hide',
    petalLayer: 'back' as 'front' | 'back',
    themeColor: 'sakura' as ThemeColorId,
    articleStyle: 'classic' as 'classic' | 'clean' | 'compact' | 'lined' | 'grid',
    articleBackgroundColor: '',
    wallpaperFill: 'cover' as 'cover' | 'contain' | 'fill',
    autoChangeMode: 'off' as 'off' | 'custom' | 'preset' | 'anime' | 'beauty' | 'search',
    autoChangeTimer: 0 // 0 means off, >0 means seconds
  })
  
  // UI State
  const showParticles = ref(true)
  const showSettings = ref(false)
  const sidebarOpen = ref(true) // For mobile (Left Sidebar)
  const rightSidebarOpen = ref(false) // For mobile (Right Sidebar)
  const toastMessage = ref('')
  const readingMode = ref(false)
  const viewMode = ref<'latest' | 'files' | 'lab'>('latest')
  const expandedFolders = ref<string[]>([])
  
  // File System State
  const fileSystem = ref<FileNode[]>([])
  const currentFile = ref<FileNode | null>(null)
  const currentFolder = ref<FileNode | null>(null)
  const loading = ref(true)
  
  // Actions
  function setFileSystem(files: FileNode[]) {
    fileSystem.value = files
  }

  function setCurrentFile(file: FileNode | null) {
    currentFile.value = file
  }

  function setCurrentFolder(folder: FileNode | null) {
    currentFolder.value = folder
  }

  function setLoading(val: boolean) {
    loading.value = val
  }

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

  function toggleRightSidebar() {
    rightSidebarOpen.value = !rightSidebarOpen.value
  }

  function setSidebarOpen(value: boolean) {
    sidebarOpen.value = value
  }

  function setRightSidebarOpen(value: boolean) {
    rightSidebarOpen.value = value
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

  function setApiWallpapers(wallpapers: Array<{ filename: string; path: string; name: string; source: 'api' }>) {
    apiWallpapers.value = wallpapers
  }
  
  function applyThemeColor(color: ThemeColorId) {
    const p = THEME_COLORS[color].palette
    const root = document.documentElement
    root.style.setProperty('--primary-50', p[50])
    root.style.setProperty('--primary-100', p[100])
    root.style.setProperty('--primary-200', p[200])
    root.style.setProperty('--primary-300', p[300])
    root.style.setProperty('--primary-400', p[400])
    root.style.setProperty('--primary-500', p[500])
    root.style.setProperty('--primary-600', p[600])
    root.style.setProperty('--primary-700', p[700])
    root.style.setProperty('--primary-800', p[800])
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

  // Helper to flatten tree
  const flatten = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = []
    for (const node of nodes) {
      if (node.type === NodeType.FILE) files.push(node)
      else if (node.children) files = files.concat(flatten(node.children))
    }
    return files
  }

  const currentLangRoot = computed(() => {
    const root = fileSystem.value.find((node: FileNode) => node.name === lang.value)
    return root ? root.children : []
  })

  const flatFiles = computed(() => flatten(currentLangRoot.value || []))

  const sortedFiles = computed(() => {
    return [...flatFiles.value].sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime())
  })
  
  return {
    // State
    lang,
    t,
    isDark,
    currentWallpaperFilename,
    customWallpapers,
    apiWallpapers,
    wallpaperApiSettings,
    userSettings,
    showParticles,
    showSettings,
    sidebarOpen,
    rightSidebarOpen,
    toastMessage,
    readingMode,
    viewMode,
    expandedFolders,
    fileSystem,
    currentFile,
    currentFolder,
    loading,
    // Actions
    toggleLang,
    toggleTheme,
    setTheme,
    setLang,
    setDark,
    setWallpaper,
    setApiWallpapers,
    showToast,
    updateSettings,
    toggleSidebar,
    toggleRightSidebar,
    setSidebarOpen,
    setRightSidebarOpen,
    toggleReadingMode,
    setReadingMode,
    applyThemeColor,
    setThemeColor,
    setFileSystem,
    setCurrentFile,
    setCurrentFolder,
    setLoading,
    // Computed
    fontSizeClass
  }
}, {
  persist: {
    pick: ['lang', 'isDark', 'currentWallpaperFilename', 'customWallpapers', 'apiWallpapers', 'wallpaperApiSettings', 'userSettings', 'showParticles', 'readingMode', 'expandedFolders', 'viewMode', 'sidebarOpen', 'rightSidebarOpen']
  }
})
