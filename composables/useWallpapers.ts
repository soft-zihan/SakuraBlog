import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

export interface WallpaperItem {
  filename: string
  path: string
  name: string
  id?: string
  source?: 'preset' | 'custom' | 'api'
}

export interface WallpapersData {
  light: WallpaperItem[]
  dark: WallpaperItem[]
}

// 缓存壁纸数据（模块级别，跨组件共享）
const wallpapersData = ref<WallpapersData | null>(null)
const isLoading = ref(false)
const bingWallpapers = ref<WallpaperItem[]>([])
const beautyWallpapers = ref<WallpaperItem[]>([])
const animeWallpapers = ref<WallpaperItem[]>([])
const searchWallpapers = ref<WallpaperItem[]>([])
const isApiLoading = ref(false)
let cachedWallpaperKey: string | null = null
let wallpaperKeyPromise: Promise<string> | null = null

export function useWallpapers() {
  const appStore = useAppStore()
  
  // Sync with store
  const searchWallpapers = computed({
    get: () => appStore.apiWallpapers || [],
    set: (val) => appStore.setApiWallpapers(val)
  })

  // Timer reference
  let autoChangeTimer: any = null

  // Validate image
  const validateImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

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
        name: item.name,
        id: item.id,
        source: 'custom' as const
      }))
  })

  const presetThemeWallpapers = computed(() => {
    if (!wallpapersData.value) return []
    const base = appStore.isDark ? wallpapersData.value.dark : wallpapersData.value.light
    return base.map(item => ({ ...item, source: 'preset' as const }))
  })

  const normalizePath = (path: string) => {
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path
    if (path.startsWith('/')) return '.' + path
    return path
  }

  // 当前主题的壁纸列表
  const currentThemeWallpapers = computed(() => {
    return [
      ...presetThemeWallpapers.value,
      ...customThemeWallpapers.value
    ]
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
  
  const addCustomWallpaper = (payload: { name: string; url: string; source: 'url' | 'local' | 'api' }) => {
    const id = `${payload.source}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    appStore.customWallpapers.push({
      id,
      name: payload.name,
      url: payload.url,
      source: payload.source,
      theme: appStore.isDark ? 'dark' : 'light'
    })
    appStore.setWallpaper(payload.url)
  }
  
  const removeCustomWallpaper = (id: string) => {
    const index = appStore.customWallpapers.findIndex(item => item.id === id)
    if (index > -1) {
      appStore.customWallpapers.splice(index, 1)
    }
  }

  const downloadWallpaper = (url: string) => {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `wallpaper-${Date.now()}.jpg`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const fetchBingWallpapers = async (country: string, count: number) => {
    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      const response = await fetch(`https://peapix.com/bing/feed?country=${country}&n=${count}`)
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
    if (appStore.wallpaperApiSettings.bingLastDate === today && appStore.wallpaperApiSettings.bingLastUrl) {
      appStore.setWallpaper(appStore.wallpaperApiSettings.bingLastUrl)
      return
    }
    try {
      const response = await fetch(`https://peapix.com/bing/feed?country=${appStore.wallpaperApiSettings.bingCountry}&n=1`)
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

  const withQueryParam = (url: string, key: string, value: string | number) => {
    return url.includes('?') ? `${url}&${key}=${value}` : `${url}?${key}=${value}`
  }

  const buildRandomItems = (sources: string[], count: number, label: string) => {
    const stamp = Date.now()
    const total = Math.min(Math.max(count, 1), 10)
    return Array.from({ length: total }).map((_, idx) => {
      const source = sources[idx % sources.length]
      const url = withQueryParam(source, 't', `${stamp}-${idx}`)
      return {
        filename: url,
        path: url,
        name: `${label} ${idx + 1}`,
        source: 'api' as const
      }
    })
  }

  const fetchBeautyWallpapers = async (count: number) => {
    if (beautyWallpapers.value.length > 0 && !isApiLoading.value) return
    
    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      beautyWallpapers.value = buildRandomItems([
        'https://cdn.seovx.com/?mom=3022',
        'https://imgapi.cn/api.php?zd=pc&fl=meizi&gs=images'
      ], count, 'Beauty')
    } catch (e) {
      console.warn('Failed to load beauty wallpapers:', e)
    } finally {
      isApiLoading.value = false
    }
  }

  const fetchAnimeWallpapers = async (count: number) => {
    if (animeWallpapers.value.length > 0 && !isApiLoading.value) return

    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      animeWallpapers.value = buildRandomItems([
        'https://cdn.seovx.com/d/?mom=3022',
        'https://www.dmoe.cc/random.php',
        'https://api.mtyqx.cn/tapi/random.php',
        'https://imgapi.cn/api.php?zd=pc&fl=dongman&gs=images'
      ], count, 'Anime')
    } catch (e) {
      console.warn('Failed to load anime wallpapers:', e)
    } finally {
      isApiLoading.value = false
    }
  }

  const getWallpaperKey = async () => {
    if (cachedWallpaperKey) return cachedWallpaperKey
    if (!wallpaperKeyPromise) {
      wallpaperKeyPromise = fetch('./wallpaper.key')
        .then(res => res.ok ? res.text() : '')
        .then(text => text.trim())
        .catch(() => '')
    }
    const key = await wallpaperKeyPromise
    cachedWallpaperKey = key
    return key
  }

  const fetchSearchWallpapers = async (keyword: string, limit: number) => {
    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      const key = await getWallpaperKey()
      // Use user setting limit if available, otherwise default
      const userLimit = appStore.wallpaperApiSettings.baiduLimit || limit || 8
      const target = Math.min(Math.max(userLimit, 1), 20)
      
      // If no key, maybe skip? But original code checked key.
      if (!key) {
        // searchWallpapers.value = [] // Do not clear existing on fail if we want persistence
        return
      }
      
      // Fetch 2x limit to account for failures
      const fetchLimit = Math.min(target * 2, 30) 
      const results: WallpaperItem[] = []
      let page = 1
      let attempts = 0
      
      // Fetch loop
      while (results.length < target && attempts < 5) {
        const url = `https://cn.apihz.cn/api/img/apihzimgbaidu.php?id=10012344&key=${key}&words=${encodeURIComponent(keyword || '小姐姐')}&page=${page}&limit=${fetchLimit}&type=2`
        
        try {
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            const list = Array.isArray(data?.res) ? data.res : []
            
            // Validate images in parallel
            const validationResults = await Promise.all(
              list.map(async (item: string) => {
                if (!item) return null
                const isValid = await validateImage(item)
                return isValid ? item : null
              })
            )
            
            for (const item of validationResults) {
              if (item && results.length < target) {
                // Avoid duplicates
                if (!results.some(r => r.filename === item)) {
                  results.push({
                    filename: item,
                    path: item,
                    name: `${keyword || 'Search'} ${results.length + 1}`,
                    source: 'api' as const
                  })
                }
              }
            }
          }
        } catch (err) {
          console.warn('Fetch error:', err)
        }
        
        if (results.length >= target) break
        page += 1
        attempts += 1
      }
      
      // Update store (persistence)
      if (results.length > 0) {
        // If we want to append or replace? 
        // User said "User used wallpapers and API wallpaper list... persisted".
        // Usually search replaces the list.
        appStore.setApiWallpapers(results)
      }
      
    } catch (e) {
      console.warn('Failed to load search wallpapers:', e)
    } finally {
      isApiLoading.value = false
    }
  }

  const fetchBaiduWallpaper = async (keyword?: string, limit = 9) => {
    await fetchSearchWallpapers(keyword || appStore.wallpaperApiSettings.baiduKeyword || '二次元', limit)
  }
  
  const autoChangeWallpaper = async (forceRefresh = false) => {
    const mode = appStore.userSettings.autoChangeMode
    if (mode === 'off') return

    if (mode === 'custom') {
      const list = customThemeWallpapers.value
      if (list.length) {
        const random = list[Math.floor(Math.random() * list.length)]
        appStore.setWallpaper(random.filename)
      }
    } else if (mode === 'preset') {
      const list = presetThemeWallpapers.value
      if (list.length) {
        const random = list[Math.floor(Math.random() * list.length)]
        appStore.setWallpaper(random.filename)
      }
    } else if (mode === 'search') {
       // Search mode auto-change
       if (forceRefresh) {
         await fetchBaiduWallpaper()
         if (searchWallpapers.value.length) {
           appStore.setWallpaper(searchWallpapers.value[0].filename)
         }
       } else {
         // Cycle through existing?
         const list = searchWallpapers.value
         if (list.length) {
           const random = list[Math.floor(Math.random() * list.length)]
           appStore.setWallpaper(random.filename)
         }
       }
    } else if (mode === 'anime') {
      if (forceRefresh) {
         // Clear cache to force new
         animeWallpapers.value = []
         await fetchAnimeWallpapers(1)
      } else if (animeWallpapers.value.length === 0) {
         await fetchAnimeWallpapers(1)
      }
      
      if (animeWallpapers.value.length) {
        const random = animeWallpapers.value[Math.floor(Math.random() * animeWallpapers.value.length)]
        appStore.setWallpaper(random.filename)
      }
    } else if (mode === 'beauty') {
      if (forceRefresh) {
        beautyWallpapers.value = []
        await fetchBeautyWallpapers(1)
      } else if (beautyWallpapers.value.length === 0) {
        await fetchBeautyWallpapers(1)
      }
      
      if (beautyWallpapers.value.length) {
        const random = beautyWallpapers.value[Math.floor(Math.random() * beautyWallpapers.value.length)]
        appStore.setWallpaper(random.filename)
      }
    }
  }

  // Timer Logic
  const stopTimer = () => {
    if (autoChangeTimer) {
      clearInterval(autoChangeTimer)
      autoChangeTimer = null
    }
  }

  const startTimer = () => {
    stopTimer()
    const seconds = appStore.userSettings.autoChangeTimer
    if (seconds > 0 && appStore.userSettings.autoChangeMode !== 'off') {
      console.log('Starting wallpaper timer:', seconds, 's')
      autoChangeTimer = setInterval(() => {
        autoChangeWallpaper(true) // Force refresh
      }, seconds * 1000)
    }
  }

  // Watch for settings changes
  watch(() => [appStore.userSettings.autoChangeMode, appStore.userSettings.autoChangeTimer], () => {
    startTimer()
  })

  // 初始化时加载壁纸
  loadWallpapers().then(() => {
    const wallpapers = currentThemeWallpapers.value
    // If auto change is enabled, run it
    if (appStore.userSettings.autoChangeMode !== 'off') {
      autoChangeWallpaper()
      startTimer()
    } else if (wallpapers.length && !appStore.currentWallpaperFilename) {
      appStore.setWallpaper(wallpapers[0].filename)
    }
    updateBingDaily()
  })
  
  return {
    wallpapersData,
    isLoading,
    currentThemeWallpapers,
    customThemeWallpapers,
    bingWallpapers,
    beautyWallpapers,
    animeWallpapers,
    searchWallpapers,
    baiduWallpapers: searchWallpapers,
    isApiLoading,
    currentWallpaper,
    loadWallpapers,
    setWallpaper,
    getWallpaperInfo,
    addCustomWallpaper,
    removeCustomWallpaper,
    downloadWallpaper,
    fetchBingWallpapers,
    fetchBaiduWallpaper,
    fetchBeautyWallpapers,
    fetchAnimeWallpapers,
    fetchSearchWallpapers,
    updateBingDaily,
    autoChangeWallpaper
  }
}
