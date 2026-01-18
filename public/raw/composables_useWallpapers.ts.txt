import { ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

export interface WallpaperInfo {
  filename: string
  lightPath: string
  darkPath: string
}

// Hardcoded wallpaper list (to be updated when adding/removing wallpapers)
const availableWallpapers: WallpaperInfo[] = [
  {
    filename: 'wallpaper-light.jpg',
    lightPath: '/image/light/wallpaper-light.jpg',
    darkPath: '/image/dark/pexels-minan1398-813269.jpg' // Default dark wallpaper
  },
  {
    filename: 'pexels-minan1398-813269.jpg',
    lightPath: '/image/light/wallpaper-light.jpg', // Default light wallpaper
    darkPath: '/image/dark/pexels-minan1398-813269.jpg'
  },
  {
    filename: 'pexels-krisof-1252869.jpg',
    lightPath: '/image/light/wallpaper-light.jpg', // Default light wallpaper
    darkPath: '/image/dark/pexels-krisof-1252869.jpg'
  }
]

export function useWallpapers() {
  const appStore = useAppStore()
  
  // Get all wallpapers
  const wallpapers = computed(() => availableWallpapers)
  
  // Get current wallpaper based on theme
  const currentWallpaper = computed(() => {
    const filename = appStore.currentWallpaperFilename
    
    // Find wallpaper by filename
    let wp = availableWallpapers.find(w => w.filename === filename)
    
    // If not found or no filename set, use first wallpaper
    if (!wp) {
      wp = availableWallpapers[0]
    }
    
    return appStore.isDark ? wp.darkPath : wp.lightPath
  })
  
  // Get wallpapers for current theme (for display in settings)
  const currentThemeWallpapers = computed(() => {
    return availableWallpapers.map(wp => ({
      filename: wp.filename,
      path: appStore.isDark ? wp.darkPath : wp.lightPath,
      name: wp.filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/[-_]/g, ' ')
    }))
  })
  
  // Set wallpaper by filename
  function setWallpaper(filename: string) {
    appStore.setWallpaper(filename)
  }
  
  // Get wallpaper info by filename
  function getWallpaperInfo(filename: string): WallpaperInfo | undefined {
    return availableWallpapers.find(w => w.filename === filename)
  }
  
  return {
    wallpapers,
    currentWallpaper,
    currentThemeWallpapers,
    setWallpaper,
    getWallpaperInfo
  }
}
