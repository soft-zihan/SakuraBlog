import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

// Simple IndexedDB wrapper for caching blobs
const DB_NAME = 'sakura-wallpapers';
const DB_VERSION = 1;
const STORE_NAME = 'blobs';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const cacheBlob = async (key: string, blob: Blob) => {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('Failed to cache blob', e);
  }
};

const getCachedBlob = async (key: string): Promise<Blob | undefined> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return undefined;
  }
};

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
const hasSearched = ref(false)
const isApiLoading = ref(false)
const resolvedWallpaper = ref('')
let cachedWallpaperKey: string | null = null
let wallpaperKeyPromise: Promise<string> | null = null

export function useWallpapers() {
  const appStore = useAppStore()
  const resolvedWallpaper = ref('')
  
  // Sync with store
  const searchWallpapers = computed({
    get: () => appStore.apiWallpapers || [],
    set: (val: any) => appStore.setApiWallpapers(val)
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
      const response = await fetch('./data/wallpapers.json')
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
    return appStore.customWallpapers.filter((item: { theme: string }) => item.theme === theme || item.theme === 'auto')
      .map((item: { url: string; name: string; id: string }) => ({
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
  const currentWallpaperPath = computed(() => {
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

  // Watch for changes and resolve blob if cached
  watch(currentWallpaperPath, async (newPath) => {
    if (!newPath) {
      resolvedWallpaper.value = ''
      return
    }
    
    // Check if it's already a blob url or local path (not needing cache)
    if (newPath.startsWith('blob:') || newPath.startsWith('data:') || newPath.startsWith('./') || newPath.startsWith('/')) {
        resolvedWallpaper.value = newPath
        return
    }

    // Check cache for remote URLs
    const cached = await getCachedBlob(newPath)
    if (cached) {
      const url = URL.createObjectURL(cached)
      resolvedWallpaper.value = url
    } else {
      resolvedWallpaper.value = newPath
    }
  }, { immediate: true })
  
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
  
  const addCustomWallpaper = async (payload: { name: string; url: string; source: 'url' | 'local' | 'api'; theme?: 'light' | 'dark' | 'auto' }) => {
    // Attempt to cache remote images
    if (payload.url.startsWith('http')) {
        try {
            const res = await fetch(payload.url);
            if (res.ok) {
                const blob = await res.blob();
                await cacheBlob(payload.url, blob);
            }
        } catch (e) {
            console.warn('Background cache failed:', e);
        }
    }

    const id = `${payload.source}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    appStore.customWallpapers.push({
      id,
      name: payload.name,
      url: payload.url,
      source: payload.source,
      theme: payload.theme || (appStore.isDark ? 'dark' : 'light')
    })
    appStore.setWallpaper(payload.url)
  }
  
  const removeCustomWallpaper = (id: string) => {
    const index = appStore.customWallpapers.findIndex(item => item.id === id)
    if (index > -1) {
      appStore.customWallpapers.splice(index, 1)
    }
  }

  const downloadWallpaper = async (url: string) => {
    if (!url) return
    try {
      const res = await fetch(url)
      if (res.ok) {
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = blobUrl
        anchor.download = `wallpaper-${Date.now()}.jpg`
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(blobUrl)
        return
      }
    } catch (e) {
    }
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
      // const key = await getWallpaperKey() // No longer needed
      const userLimit = appStore.wallpaperApiSettings.baiduLimit || limit || 8
      const target = Math.min(Math.max(userLimit, 1), 20)
      
      // if (!key) return
      
      const fetchLimit = Math.min(target * 2, 30) 
      const results: Array<WallpaperItem & { source: 'api' }> = []
      
      hasSearched.value = true
      
      let page = 1
      let attempts = 0
      
      while (results.length < target && attempts < 5) {
        // User provided example: https://cn.apihz.cn/api/img/apihzimgbaidu.php?id=10012344&key=e46073f4d678fa87669b88526e7448bc&limit=10&page=1&words=张含韵
        const apiKey = import.meta.env.VITE_BAIDU_IMAGE_API_KEY || '';
        const url = `https://cn.apihz.cn/api/img/apihzimgbaidu.php?id=10012344&key=${apiKey}&words=${encodeURIComponent(keyword || '小姐姐')}&page=${page}&limit=${fetchLimit}`;
        
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

  const fetchBaiduWallpaper = async (keyword?: string, targetCount?: number) => {
    if (isApiLoading.value) return
    isApiLoading.value = true
    
    // Default settings
    const kw = keyword || appStore.wallpaperApiSettings.baiduKeyword || '小姐姐'
    const limit = targetCount || appStore.wallpaperApiSettings.baiduLimit || 5
    // Fetch 2x limit to ensure enough valid images
    const fetchLimit = limit * 2
    
    const validItems: WallpaperItem[] = []
    let page = 1
    const maxPages = 3 // Max pages to try
    
    try {
      while (validItems.length < limit && page <= maxPages) {
        // New Baidu Image Search API
        // Type=2 returns JSON with preview URLs
        const url = `https://cn.apihz.cn/api/img/apihzimgbaidu.php?id=10012344&key=e46073f4d678fa87669b88526e7448bc&words=${encodeURIComponent(kw)}&page=${page}&limit=${fetchLimit}&type=2`
        
        console.log(`Fetching Baidu wallpapers (Page ${page})...`)
        const response = await fetch(url)
        
        if (response.ok) {
          const data = await response.json()
          // Format: { code: 200, res: [url1, url2, ...] }
          if (data.code === 200 && Array.isArray(data.res)) {
            const rawUrls = data.res.filter((url: string) => url && url.startsWith('http'))
            
            // Validate images
            for (const url of rawUrls) {
              if (validItems.length >= limit) break
              
              // Skip if already exists
              if (validItems.some(i => i.path === url)) continue
              
              const isValid = await validateImage(url)
              if (isValid) {
                validItems.push({
                  filename: url,
                  path: url,
                  name: `Baidu ${kw} ${validItems.length + 1}`,
                  source: 'api' as const
                })
              }
            }
          }
        }
        
        page++
        // Small delay to be nice to API
        if (validItems.length < limit) await new Promise(r => setTimeout(r, 500))
      }
      
      if (validItems.length > 0) {
        searchWallpapers.value = validItems
        hasSearched.value = true
        // Automatically switch to first found wallpaper if requested
        // But usually we just update the list.
        // If the user is in 'search' mode, autoChangeWallpaper will pick from this list.
      } else {
        console.warn('No valid wallpapers found from Baidu search.')
      }
      
    } catch (e) {
      console.warn('Failed to load Baidu wallpapers:', e)
    } finally {
      isApiLoading.value = false
    }
  }
  
  // Detect current wallpaper mode/series
  const detectCurrentMode = (): string => {
    const current = currentWallpaperPath.value || appStore.currentWallpaperFilename || ''
    const normalizedCurrent = normalizePath(current)
    
    // Check Bing
    if (bingWallpapers.value.some((w: WallpaperItem) => w.filename === current || normalizePath(w.path) === normalizedCurrent) || current.includes('peapix.com') || current.includes('bing.com')) {
      return 'bing'
    }
    
    // Check Preset
    if (presetThemeWallpapers.value.some((w: WallpaperItem) => w.filename === current || normalizePath(w.path) === normalizedCurrent)) {
      return 'preset'
    }
    
    // Check Custom
    if (customThemeWallpapers.value.some((w: WallpaperItem) => w.filename === current || normalizePath(w.path) === normalizedCurrent)) {
      return 'custom'
    }

    // Check Search
    if (searchWallpapers.value.some((w: WallpaperItem) => w.filename === current || normalizePath(w.path) === normalizedCurrent)) {
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
    
    return appStore.userSettings.autoChangeMode === 'off' ? 'preset' : appStore.userSettings.autoChangeMode
  }

  const resolveWallpaperUrl = (wallpaper: WallpaperItem | null) => {
    if (!wallpaper) return ''
    return wallpaper.path || wallpaper.filename || ''
  }

  const isSameWallpaper = (wallpaper: WallpaperItem | null, current: string) => {
    if (!wallpaper) return false
    return wallpaper.filename === current || wallpaper.path === current
  }

  const pickRandomWallpaper = (list: WallpaperItem[], current: string) => {
    if (!list.length) return null
    if (list.length === 1) return list[0]
    for (let attempt = 0; attempt < 6; attempt++) {
      const candidate = list[Math.floor(Math.random() * list.length)]
      if (!isSameWallpaper(candidate, current)) {
        return candidate
      }
    }
    return list.find(item => !isSameWallpaper(item, current)) || list[0]
  }

  const autoChangeWallpaper = async (forceRefresh = false, modeOverride?: string) => {
    const mode = modeOverride || appStore.userSettings.autoChangeMode
    if (mode === 'off' && !modeOverride) return false

    let nextWallpaper: WallpaperItem | null = null;
    const current = appStore.currentWallpaperFilename || ''

    // Retry loop for finding a valid wallpaper
    // "Must crawl twice each time, automatic retry also re-crawls twice each time"
    for (let attempt = 0; attempt < 3; attempt++) {
      if (mode === 'custom') {
        const list = customThemeWallpapers.value
        if (list.length) {
          nextWallpaper = pickRandomWallpaper(list, current)
        }
      } else if (mode === 'preset') {
        const list = presetThemeWallpapers.value
        if (list.length) {
          nextWallpaper = pickRandomWallpaper(list, current)
        }
      } else if (mode === 'search') {
         if (forceRefresh || !searchWallpapers.value.length) {
           await fetchBaiduWallpaper()
         }
         const list = searchWallpapers.value
         if (list.length) {
           // Always pick random to avoid getting stuck on index 0 if fetch fails
           nextWallpaper = pickRandomWallpaper(list, current)
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
          nextWallpaper = pickRandomWallpaper(animeWallpapers.value, current)
        }
      } else if (mode === 'beauty') {
        if (forceRefresh || beautyWallpapers.value.length === 0) {
          beautyWallpapers.value = []
          await fetchBeautyWallpapers(2)
        }
        
        if (beautyWallpapers.value.length) {
          nextWallpaper = pickRandomWallpaper(beautyWallpapers.value, current)
        }
      } else if (mode === 'bing') {
        // Bing logic: "Bing wallpaper auto-change needs to change from already obtained wallpapers"
        // Ensure we have wallpapers
        if (bingWallpapers.value.length === 0) {
           await fetchBingWallpapers(appStore.wallpaperApiSettings.bingCountry || 'cn', 8)
        }
        if (bingWallpapers.value.length) {
           nextWallpaper = pickRandomWallpaper(bingWallpapers.value, current)
        }
      }

      if (nextWallpaper && nextWallpaper.filename) {
        // Double check validation (even if fetched valid, it's good practice)
        // For anime/beauty, they are already validated.
        // For others, check now.
        const validationUrl = resolveWallpaperUrl(nextWallpaper)
        const isValid = await validateImage(validationUrl)
        if (isValid) {
          appStore.setWallpaper(nextWallpaper.filename)
          return true
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
    return false
  }
  
  const changeWallpaperSameSeries = async () => {
    const mode = detectCurrentMode()
    console.log('Changing wallpaper in series:', mode)
    return autoChangeWallpaper(true, mode)
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
    currentWallpaperPath,
    presetThemeWallpapers,
    customThemeWallpapers,
    bingWallpapers,
    beautyWallpapers,
    animeWallpapers,
    searchWallpapers,
    baiduWallpapers: searchWallpapers,
    hasSearched,
    isApiLoading,
    currentWallpaper: resolvedWallpaper,
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
