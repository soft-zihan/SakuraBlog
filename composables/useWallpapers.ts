import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore'

export interface WallpaperItem {
  filename: string
  path: string
  name: string
}

export interface WallpapersData {
  light: WallpaperItem[]
  dark: WallpaperItem[]
}

// 缓存壁纸数据（模块级别，跨组件共享）
const wallpapersData = ref<WallpapersData | null>(null)
const isLoading = ref(false)
const bingWallpapers = ref<WallpaperItem[]>([])
const upx8Wallpapers = ref<WallpaperItem[]>([])
const isApiLoading = ref(false)

export function useWallpapers() {
  const appStore = useAppStore()
  
  // 加载壁纸列表
  const loadWallpapers = async () => {
    if (wallpapersData.value || isLoading.value) return
    
    isLoading.value = true
    try {
      const response = await fetch('./wallpapers.json')
      if (response.ok) {
        wallpapersData.value = await response.json()
      } else {
        // 回退到默认壁纸
        wallpapersData.value = {
          light: [{ filename: 'wallpaper-light.jpg', path: '/image/light/wallpaper-light.jpg', name: 'Default Light' }],
          dark: [{ filename: 'pexels-minan1398-813269.jpg', path: '/image/dark/pexels-minan1398-813269.jpg', name: 'Default Dark' }]
        }
      }
    } catch (e) {
      console.warn('Failed to load wallpapers.json:', e)
      // 回退到默认壁纸（使用相对路径，避免手机端显示问题）
      wallpapersData.value = {
        light: [{ filename: 'wallpaper-light.jpg', path: './image/light/wallpaper-light.jpg', name: 'Default Light' }],
        dark: [{ filename: 'pexels-minan1398-813269.jpg', path: './image/dark/pexels-minan1398-813269.jpg', name: 'Default Dark' }]
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const customThemeWallpapers = computed(() => {
    const theme = appStore.isDark ? 'dark' : 'light'
    return appStore.customWallpapers.filter(item => item.theme === theme || item.theme === 'auto')
      .map(item => ({
        filename: item.url,
        path: item.url,
        name: item.name
      }))
  })

  const normalizePath = (path: string) => {
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path
    if (path.startsWith('/')) return '.' + path
    return path
  }

  // 当前主题的壁纸列表
  const currentThemeWallpapers = computed(() => {
    if (!wallpapersData.value) return []
    const base = appStore.isDark ? wallpapersData.value.dark : wallpapersData.value.light
    return [...base, ...customThemeWallpapers.value]
  })
  
  // 当前选中的壁纸路径
  const currentWallpaper = computed(() => {
    const filename = appStore.currentWallpaperFilename
    const wallpapers = currentThemeWallpapers.value
    
    if (filename && (filename.startsWith('http') || filename.startsWith('data:') || filename.startsWith('blob:'))) {
      return filename
    }
    
    if (!wallpapers.length) return ''
    
    // 如果未设置或找不到，回退到第一张
    const found = wallpapers.find((w: WallpaperItem) => w.filename === filename)
    let path = found ? found.path : (wallpapers[0]?.path || '')
    
    // 确保路径是相对路径（手机端兼容）
    return normalizePath(path)
  })
  
  // 设置壁纸
  function setWallpaper(filename: string) {
    appStore.setWallpaper(filename)
  }
  
  // 获取壁纸信息
  function getWallpaperInfo(filename: string): WallpaperItem | undefined {
    if (!wallpapersData.value) return undefined
    
    const allWallpapers = [...wallpapersData.value.light, ...wallpapersData.value.dark]
    return allWallpapers.find(w => w.filename === filename)
  }
  
  const addCustomWallpaper = (payload: { name: string; url: string; theme: 'light' | 'dark' | 'auto'; source: 'url' | 'local' | 'api' }) => {
    const id = `${payload.source}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    appStore.customWallpapers.push({ id, ...payload })
    appStore.setWallpaper(payload.url)
  }
  
  const removeCustomWallpaper = (url: string) => {
    const index = appStore.customWallpapers.findIndex(item => item.url === url)
    if (index > -1) {
      appStore.customWallpapers.splice(index, 1)
    }
  }

  const fetchBingWallpapers = async (country: string, count: number) => {
    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      const response = await fetch(`https://peapix.com/bing/feed?country=${country}`)
      if (response.ok) {
        const data = await response.json()
        const items = (Array.isArray(data) ? data : []).slice(0, count).map((item, idx) => ({
          filename: item.fullUrl,
          path: item.fullUrl,
          name: item.title || `Bing ${idx + 1}`
        }))
        bingWallpapers.value = items
      }
    } catch (e) {
      console.warn('Failed to load Bing wallpapers:', e)
    } finally {
      isApiLoading.value = false
    }
  }
  
  const updateBingDaily = async () => {
    const today = new Date().toISOString().slice(0, 10)
    if (!appStore.wallpaperApiSettings.bingEnabled) return
    if (appStore.wallpaperApiSettings.bingLastDate === today && appStore.wallpaperApiSettings.bingLastUrl) {
      appStore.setWallpaper(appStore.wallpaperApiSettings.bingLastUrl)
      return
    }
    try {
      const response = await fetch(`https://peapix.com/bing/feed?country=${appStore.wallpaperApiSettings.bingCountry}`)
      if (response.ok) {
        const data = await response.json()
        const first = Array.isArray(data) ? data[0] : null
        if (first?.fullUrl) {
          appStore.wallpaperApiSettings.bingLastDate = today
          appStore.wallpaperApiSettings.bingLastUrl = first.fullUrl
          appStore.setWallpaper(first.fullUrl)
        }
      }
    } catch (e) {
      console.warn('Failed to update Bing daily wallpaper:', e)
    }
  }

  const fetchUpx8Wallpaper = async (keyword?: string) => {
    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      const url = keyword ? `https://wp.upx8.com/api.php?content=${encodeURIComponent(keyword)}` : 'https://wp.upx8.com/api.php'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const itemUrl = data?.data?.url
        if (itemUrl) {
          upx8Wallpapers.value = [{
            filename: itemUrl,
            path: itemUrl,
            name: keyword ? `UPX8: ${keyword}` : 'UPX8 Random'
          }]
        }
      }
    } catch (e) {
      console.warn('Failed to load UpX8 wallpaper:', e)
    } finally {
      isApiLoading.value = false
    }
  }
  
  // 初始化时加载壁纸
  loadWallpapers().then(() => {
    const wallpapers = currentThemeWallpapers.value
    if (wallpapers.length && !appStore.currentWallpaperFilename) {
      appStore.setWallpaper(wallpapers[0].filename)
    }
  })
  
  return {
    wallpapersData,
    isLoading,
    currentThemeWallpapers,
    customThemeWallpapers,
    bingWallpapers,
    upx8Wallpapers,
    isApiLoading,
    currentWallpaper,
    loadWallpapers,
    setWallpaper,
    getWallpaperInfo,
    addCustomWallpaper,
    removeCustomWallpaper,
    fetchBingWallpapers,
    fetchUpx8Wallpaper,
    updateBingDaily
  }
}
