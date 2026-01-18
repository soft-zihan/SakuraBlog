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
  
  // 当前主题的壁纸列表
  const currentThemeWallpapers = computed(() => {
    if (!wallpapersData.value) return []
    return appStore.isDark ? wallpapersData.value.dark : wallpapersData.value.light
  })
  
  // 当前选中的壁纸路径
  const currentWallpaper = computed(() => {
    const filename = appStore.currentWallpaperFilename
    const wallpapers = currentThemeWallpapers.value
    
    if (!wallpapers.length) return ''
    
    // 如果未设置或找不到，回退到第一张
    const found = wallpapers.find((w: WallpaperItem) => w.filename === filename)
    let path = found ? found.path : (wallpapers[0]?.path || '')
    
    // 确保路径是相对路径（手机端兼容）
    if (path.startsWith('/')) {
      path = '.' + path
    }
    return path
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
    currentWallpaper,
    loadWallpapers,
    setWallpaper,
    getWallpaperInfo
  }
}
