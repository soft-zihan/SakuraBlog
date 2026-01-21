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
      img.onload = () => {
        // Check for valid dimensions to avoid broken/small images
        if (img.naturalWidth < 200 || img.naturalHeight < 200) {
           resolve(false)
        } else {
           resolve(true)
        }
      }
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

  // Shuffle Helper
  const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const buildRandomItems = (sources: string[], count: number, label: string) => {
    const stamp = Date.now()
    // Shuffle sources to ensure diversity and avoid single point of failure
    const shuffledSources = shuffleArray(sources)
    
    const items: WallpaperItem[] = []
    // Round robin distribution
    for (let i = 0; i < count; i++) {
        const source = shuffledSources[i % shuffledSources.length]
        const url = withQueryParam(source, 't', `${stamp}-${i}`)
        items.push({
            filename: url,
            path: url,
            name: `${label} ${i + 1}`,
            source: 'api' as const
        })
    }
    return items
  }

  // Fetch and validate wrapper
  const fetchAndValidateRandom = async (sources: string[], count: number, label: string): Promise<WallpaperItem[]> => {
    const validItems: WallpaperItem[] = []
    const maxAttempts = 3
    let attempts = 0
    
    // We try to get 'count' valid items.
    while (validItems.length < count && attempts < maxAttempts) {
        // Generate candidates. +1 buffer to improve hit rate
        const needed = count - validItems.length
        const candidates = buildRandomItems(sources, needed + 1, label)
        
        for (const item of candidates) {
            if (validItems.length >= count) break
            if (await validateImage(item.filename)) {
                // Ensure uniqueness
                if (!validItems.some(v => v.filename === item.filename)) {
                    validItems.push(item)
                }
            }
        }
        attempts++
    }
    return validItems
  }

  const fetchBeautyWallpapers = async (count: number) => {
    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      // Crawl twice each time (fetch at least 2 candidates)
      const targetCount = Math.max(count, 2)
      beautyWallpapers.value = await fetchAndValidateRandom([
        'https://cdn.seovx.com/?mom=3022',
        'https://imgapi.cn/api.php?zd=pc&fl=meizi&gs=images'
      ], targetCount, 'Beauty')
    } catch (e) {
      console.warn('Failed to load beauty wallpapers:', e)
    } finally {
      isApiLoading.value = false
    }
  }

  const fetchAnimeWallpapers = async (count: number) => {
    if (isApiLoading.value) return
    isApiLoading.value = true
    try {
      // Crawl twice each time (fetch at least 2 candidates)
      const targetCount = Math.max(count, 2)
      animeWallpapers.value = await fetchAndValidateRandom([
        'https://cdn.seovx.com/d/?mom=3022',
        'https://www.dmoe.cc/random.php',
        'https://api.mtyqx.cn/tapi/random.php',
        'https://imgapi.cn/api.php?zd=pc&fl=dongman&gs=images'
      ], targetCount, 'Anime')
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
      const userLimit = appStore.wallpaperApiSettings.baiduLimit || limit || 8
      const target = Math.min(Math.max(userLimit, 1), 20)
      
      if (!key) return
      
      const fetchLimit = Math.min(target * 2, 30) 
      const results: WallpaperItem[] = []
      let page = 1
      let attempts = 0
      
      while (results.length < target && attempts < 5) {
        const url = `https://cn.apihz.cn/api/img/apihzimgbaidu.php?id=10012344&key=${key}&words=${encodeURIComponent(keyword || '小姐姐')}&page=${page}&limit=${fetchLimit}&type=2`
        
        try {
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            const list = Array.isArray(data?.res) ? data.res : []
            
            const validationResults = await Promise.all(
              list.map(async (item: string) => {
                if (!item) return null
                const isValid = await validateImage(item)
                return isValid ? item : null
              })
            )
            
            for (const item of validationResults) {
              if (item && results.length < target) {
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
      
      if (results.length > 0) {
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
  
  // Detect current wallpaper mode/series
  const detectCurrentMode = (): string => {
    const current = currentWallpaper.value
    
    // Check Bing
    if (bingWallpapers.value.some(w => w.filename === current) || current.includes('peapix.com') || current.includes('bing.com')) {
      return 'bing'
    }
    
    // Check Preset
    if (presetThemeWallpapers.value.some(w => w.filename === current || w.path === current)) {
      return 'preset'
    }
    
    // Check Custom
    if (customThemeWallpapers.value.some(w => w.filename === current || w.path === current)) {
      return 'custom'
    }

    // Check Search
    if (searchWallpapers.value.some(w => w.filename === current || w.path === current)) {
      return 'search'
    }
    
    // Check Anime (by URL pattern)
    if (current.includes('seovx.com/d/') || current.includes('dmoe.cc') || current.includes('mtyqx.cn') || (current.includes('imgapi.cn') && current.includes('fl=dongman'))) {
      return 'anime'
    }
    
    // Check Beauty (by URL pattern)
    if (current.includes('seovx.com') || (current.includes('imgapi.cn') && current.includes('fl=meizi'))) {
      return 'beauty'
    }
    
    return appStore.userSettings.autoChangeMode
  }

  const autoChangeWallpaper = async (forceRefresh = false, modeOverride?: string) => {
    const mode = modeOverride || appStore.userSettings.autoChangeMode
    if (mode === 'off' && !modeOverride) return

    let nextWallpaper: WallpaperItem | null = null;

    // Retry loop for finding a valid wallpaper
    // "Must crawl twice each time, automatic retry also re-crawls twice each time"
    for (let attempt = 0; attempt < 3; attempt++) {
      if (mode === 'custom') {
        const list = customThemeWallpapers.value
        if (list.length) {
          nextWallpaper = list[Math.floor(Math.random() * list.length)]
        }
      } else if (mode === 'preset') {
        const list = presetThemeWallpapers.value
        if (list.length) {
          nextWallpaper = list[Math.floor(Math.random() * list.length)]
        }
      } else if (mode === 'search') {
         if (forceRefresh || !searchWallpapers.value.length) {
           await fetchBaiduWallpaper()
         }
         const list = searchWallpapers.value
         if (list.length) {
           if (forceRefresh) {
             nextWallpaper = list[0] // or random?
           } else {
             nextWallpaper = list[Math.floor(Math.random() * list.length)]
           }
         }
      } else if (mode === 'anime') {
        // Fetch if needed or forced. Note: fetchAnimeWallpapers now ensures valid items.
        if (forceRefresh || animeWallpapers.value.length === 0) {
           animeWallpapers.value = []
           // Fetch 2 candidates as per "crawl twice" rule
           await fetchAnimeWallpapers(2)
        }
        
        if (animeWallpapers.value.length) {
          // Pick one
          nextWallpaper = animeWallpapers.value[Math.floor(Math.random() * animeWallpapers.value.length)]
        }
      } else if (mode === 'beauty') {
        if (forceRefresh || beautyWallpapers.value.length === 0) {
          beautyWallpapers.value = []
          await fetchBeautyWallpapers(2)
        }
        
        if (beautyWallpapers.value.length) {
          nextWallpaper = beautyWallpapers.value[Math.floor(Math.random() * beautyWallpapers.value.length)]
        }
      } else if (mode === 'bing') {
        // Bing logic: "Bing wallpaper auto-change needs to change from already obtained wallpapers"
        // Ensure we have wallpapers
        if (bingWallpapers.value.length === 0) {
           await fetchBingWallpapers(appStore.wallpaperApiSettings.bingCountry || 'cn', 8)
        }
        if (bingWallpapers.value.length) {
           nextWallpaper = bingWallpapers.value[Math.floor(Math.random() * bingWallpapers.value.length)]
        }
      }

      if (nextWallpaper && nextWallpaper.filename) {
        // Double check validation (even if fetched valid, it's good practice)
        // For anime/beauty, they are already validated.
        // For others, check now.
        const isValid = await validateImage(nextWallpaper.filename)
        if (isValid) {
          appStore.setWallpaper(nextWallpaper.filename)
          return // Success
        } else {
          console.warn(`Wallpaper validation failed for ${nextWallpaper.filename}, retrying...`)
          // If invalid, try to refresh list for next attempt
          forceRefresh = true
          nextWallpaper = null
        }
      } else {
        // No wallpaper found, but we might want to try force refresh if we haven't?
        if (!forceRefresh) {
          forceRefresh = true
        } else {
          // If we already forced refresh and still nothing, break
          break
        }
      }
    }
  }
  
  const changeWallpaperSameSeries = () => {
    const mode = detectCurrentMode()
    console.log('Changing wallpaper in series:', mode)
    autoChangeWallpaper(true, mode)
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
    autoChangeWallpaper,
    changeWallpaperSameSeries
  }
}
