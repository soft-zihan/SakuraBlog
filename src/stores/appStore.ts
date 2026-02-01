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
    readerDensity: 'compact' as 'compact' | 'normal' | 'loose',
    petalSpeed: 'slow' as 'off' | 'slow' | 'fast',
    bannerMode: 'normal' as 'normal' | 'fullscreen' | 'background' | 'hide',
    petalLayer: 'back' as 'front' | 'back',
    themeColor: 'sakura' as ThemeColorId,
    themeMode: 'manual' as 'manual' | 'system' | 'time',
    themeTimeLight: '07:00',
    themeTimeDark: '19:00',
    articleStyle: 'classic' as 'classic' | 'lined' | 'grid',
    articleSortMode: 'date' as 'date' | 'tree',
    articleBackgroundColorLight: '',
    articleBackgroundColorDark: '',
    wallpaperFill: 'cover' as 'cover' | 'contain' | 'fill',
    autoChangeMode: 'off' as 'off' | 'custom' | 'preset' | 'anime' | 'beauty' | 'search',
    autoChangeTimer: 0,
    musicPlayer: 'new' as 'new' | 'old' | 'off'
  })
  
  // UI State
  const showParticles = ref(true)
  const showSettings = ref(false)
  const showDownloadModal = ref(false)
  const showSearch = ref(false)
  const showWriteEditor = ref(false)
  const sidebarOpen = ref(true) // For mobile (Left Sidebar)
  const rightSidebarOpen = ref(false) // For mobile (Right Sidebar)
  const toastMessage = ref('')
  const readingMode = ref(false)
  const viewMode = ref<'latest' | 'files' | 'lab'>('latest')
  const expandedFolders = ref<string[]>([])
  const searchTarget = ref<string | null>(null)
  
  // File System State
  const fileSystem = ref<FileNode[]>([])
  const currentFile = ref<FileNode | null>(null)
  const currentFolder = ref<FileNode | null>(null)
  const loading = ref(true)
  const contentLoading = ref(false)
  const currentTool = ref<string | null>(null)
  const isRawMode = ref(false)
  
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
    userSettings.value.themeMode = 'manual'
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function setTheme(dark: boolean) {
    userSettings.value.themeMode = 'manual'
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
  
  function setThemeColor(color: ThemeColorId) {
    userSettings.value.themeColor = color
    // Theme color application is now handled by useTheme.ts watching this value
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
    const root = fileSystem.value.find((node: FileNode) => node.type === NodeType.DIRECTORY && node.name === lang.value)
    if (root?.children?.length) return root.children
    return fileSystem.value.filter((node: FileNode) => !(node.type === NodeType.DIRECTORY && node.path === 'source'))
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
// UI State
    showParticles,
    showSettings,
    showDownloadModal,
    showSearch,
    showWriteEditor,
    sidebarOpen,
    rightSidebarOpen,
    toastMessage,
    readingMode,
    viewMode,
    expandedFolders,
    searchTarget,
    fileSystem,
    currentFile,
    currentFolder,
    loading,
    contentLoading,
    currentTool,
    isRawMode,
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
    setThemeColor,
    setFileSystem,
    setCurrentFile,
    setCurrentFolder,
    setLoading,
    // Computed
    fontSizeClass,
    flatFiles,
    sortedFiles
  }
}, {
  persist: {
    pick: ['lang', 'isDark', 'currentWallpaperFilename', 'customWallpapers', 'apiWallpapers', 'wallpaperApiSettings', 'userSettings', 'showParticles', 'readingMode', 'expandedFolders', 'viewMode', 'sidebarOpen', 'rightSidebarOpen']
  }
})
