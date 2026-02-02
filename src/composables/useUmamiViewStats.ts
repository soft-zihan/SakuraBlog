import { UMAMI_CONFIG } from '../constants'
import { useArticleStore } from '../stores/articleStore'
import { useAppStore } from '../stores/appStore'

type UmamiStatsResponse = {
  pageviews?: number | { value?: number }
  visitors?: number | { value?: number }
}

type CachedStats = { views: number; visitors: number; timestamp: number }

const STATS_CACHE_KEY = 'sakura:umami:stats:v1'
const STATS_TTL_MS = 5 * 60 * 1000
const STATS_ERROR_NOTIFIED_KEY = 'sakura:umami:share-error-notified:v1'

const normalizeFilePath = (path: string) => (path || '').replace(/^\/+/, '')

const toUmamiPath = (filePath: string) => {
  const normalized = normalizeFilePath(filePath)
  const encoded = normalized
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
  return `/notes/${encoded}`
}

const resolveUmamiBaseUrl = () => {
  const raw = (UMAMI_CONFIG.baseUrl || '').trim()
  const scriptUrl = (UMAMI_CONFIG.scriptUrl || '').trim()
  const scriptBase = (() => {
    if (!scriptUrl) return ''
    try {
      const u = new URL(scriptUrl)
      const basePath = u.pathname.replace(/\/[^/]*$/, '').replace(/\/+$/, '')
      return `${u.origin}${basePath}`
    } catch {
      return ''
    }
  })()

  const normalize = (value: string) => {
    if (!value) return ''
    try {
      const u = new URL(value)
      let path = u.pathname.replace(/\/+$/, '')
      if (path.endsWith('/api')) path = path.slice(0, -4)
      if (path.endsWith('/v1')) path = path.slice(0, -3)
      return `${u.origin}${path}`
    } catch {
      return value.replace(/\/+$/, '')
    }
  }

  const normalized = normalize(raw)
  if (!normalized) return scriptBase || ''

  try {
    const u = new URL(normalized, window.location.origin)
    if (u.hostname === 'api.umami.is') {
      return scriptBase || 'https://cloud.umami.is'
    }
  } catch {
  }

  return normalized
}

const resolveShareId = () => {
  const raw = (UMAMI_CONFIG.shareId || '').trim()
  if (!raw) return ''
  if (!raw.includes('/') && !raw.includes('http')) return raw

  const fromPath = (path: string) => {
    const parts = path.split('/').filter(Boolean)
    const shareIdx = parts.indexOf('share')
    if (shareIdx >= 0 && parts[shareIdx + 1]) return parts[shareIdx + 1]
    return parts[parts.length - 1] || ''
  }

  try {
    const u = new URL(raw)
    return fromPath(u.pathname)
  } catch {
    return fromPath(raw)
  }
}

const getSessionCacheMap = (): Record<string, CachedStats> => {
  try {
    const raw = window.sessionStorage.getItem(STATS_CACHE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, CachedStats>
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

const setSessionCacheMap = (map: Record<string, CachedStats>) => {
  try {
    window.sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify(map))
  } catch {
  }
}

const getSessionCachedStats = (filePath: string): { views: number; visitors: number } | null => {
  const key = normalizeFilePath(filePath)
  const map = getSessionCacheMap()
  const cached = map[key]
  if (!cached) return null
  if (Date.now() - cached.timestamp > STATS_TTL_MS) return null
  return { views: cached.views, visitors: cached.visitors }
}

const setSessionCachedStats = (filePath: string, views: number, visitors: number) => {
  const key = normalizeFilePath(filePath)
  const map = getSessionCacheMap()
  map[key] = { views, visitors, timestamp: Date.now() }
  setSessionCacheMap(map)
}

const readMetricValue = (metric: unknown) => {
  if (typeof metric === 'number') return metric
  if (metric && typeof metric === 'object' && 'value' in metric) {
    const v = (metric as any).value
    return typeof v === 'number' ? v : 0
  }
  return 0
}

const waitForFetchUmamiStats = async (timeoutMs = 10000, intervalMs = 100): Promise<NonNullable<Window['fetchUmamiStats']>> => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (typeof window.fetchUmamiStats === 'function') return window.fetchUmamiStats
    await new Promise((r) => window.setTimeout(r, intervalMs))
  }
  throw new Error('Umami share API is not available')
}

const waitForFetchUmamiMetricsExpanded = async (
  timeoutMs = 10000,
  intervalMs = 100
): Promise<NonNullable<Window['fetchUmamiMetricsExpanded']>> => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (typeof window.fetchUmamiMetricsExpanded === 'function') return window.fetchUmamiMetricsExpanded
    await new Promise((r) => window.setTimeout(r, intervalMs))
  }
  throw new Error('Umami metrics API is not available')
}

const fromUmamiPathToFilePath = (umamiPath: string) => {
  const p = String(umamiPath || '')
  if (!p.startsWith('/notes/')) return null
  return p.slice('/notes/'.length).replace(/^\/+/, '')
}

const waitForUmamiTracker = async (timeoutMs = 10000, intervalMs = 100): Promise<Window['umami']> => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (window.umami && typeof (window.umami as any).track === 'function') return window.umami
    await new Promise((r) => window.setTimeout(r, intervalMs))
  }
  throw new Error('Umami tracker is not available')
}

const trackView = async (filePath: string) => {
  if (!UMAMI_CONFIG.enable) return
  if (!UMAMI_CONFIG.websiteId) return
  const umami = (window.umami && typeof (window.umami as any).track === 'function')
    ? window.umami
    : await waitForUmamiTracker().catch(() => undefined)
  if (!umami || typeof (umami as any).track !== 'function') return
  const urlPath = toUmamiPath(filePath)
  const url = (() => {
    try {
      return new URL(urlPath, window.location.origin).toString()
    } catch {
      try {
        return new URL(urlPath, window.location.href).toString()
      } catch {
        return `https://example.com${urlPath}`
      }
    }
  })()
  try {
    ;(umami as any).track((payload: any) => ({ ...payload, url }))
  } catch {
  }
}

export function useUmamiViewStats() {
  const appStore = useAppStore()
  const articleStore = useArticleStore()

  const getCachedViews = (path: string): number | undefined => {
    const cached = articleStore.getCachedStats(path)
    return cached ? cached.views : undefined
  }

  const getCachedVisitors = (path: string): number | undefined => {
    const cached = articleStore.getCachedStats(path)
    return cached ? cached.visitors : undefined
  }

  const fetchAndCacheStats = async (filePath: string): Promise<{ views: number; visitors: number } | null> => {
    if (!UMAMI_CONFIG.enable) return null
    const baseUrl = resolveUmamiBaseUrl()
    const shareId = resolveShareId()
    if (!baseUrl || !shareId) return null

    const cachedInStore = articleStore.getCachedStats(filePath)
    if (cachedInStore) return cachedInStore

    const cachedInSession = getSessionCachedStats(filePath)
    if (cachedInSession) {
      articleStore.setCachedStats(filePath, cachedInSession.views, cachedInSession.visitors)
      return cachedInSession
    }

    try {
      const fetchFn = await waitForFetchUmamiStats()
      const statsData = (await fetchFn(baseUrl, shareId, {
        timezone: UMAMI_CONFIG.timezone,
        path: toUmamiPath(filePath)
      })) as UmamiStatsResponse

      const views = readMetricValue(statsData.pageviews)
      const visitors = readMetricValue(statsData.visitors)

      articleStore.setCachedStats(filePath, views, visitors)
      setSessionCachedStats(filePath, views, visitors)
      return { views, visitors }
    } catch (err) {
      try {
        if (!window.sessionStorage.getItem(STATS_ERROR_NOTIFIED_KEY)) {
          window.sessionStorage.setItem(STATS_ERROR_NOTIFIED_KEY, '1')
          const msg = appStore.lang === 'zh'
            ? 'Umami 阅读统计获取失败：请确认 Share URL 可公开访问，且 Base URL 指向 Umami Web（不是 api.umami.is）'
            : 'Umami stats failed: ensure Share URL is public and Base URL points to Umami Web (not api.umami.is).'
          appStore.showToast(msg, 4000)
        }
      } catch {
      }
      if (import.meta.env.DEV) {
        console.warn('[umami] fetch stats failed', err)
      }
      return null
    }
  }

  const prefetchAllPathStats = async (filePaths: string[]): Promise<void> => {
    if (!UMAMI_CONFIG.enable) return
    const baseUrl = resolveUmamiBaseUrl()
    const shareId = resolveShareId()
    if (!baseUrl || !shareId) return

    const wanted = new Set(filePaths.map((p) => normalizeFilePath(p)))
    if (wanted.size === 0) return

    try {
      const fetchFn = await waitForFetchUmamiMetricsExpanded()
      const now = Date.now()

      const limit = 500
      const combined: Record<string, { views: number; visitors: number }> = {}

      for (let offset = 0; offset < 20000; offset += limit) {
        const rows = await fetchFn(baseUrl, shareId, {
          timezone: UMAMI_CONFIG.timezone,
          type: 'path',
          limit,
          offset,
          startAt: 0,
          endAt: now
        })
        if (!Array.isArray(rows) || rows.length === 0) break

        for (const row of rows) {
          const filePath = fromUmamiPathToFilePath(String(row?.name || ''))
          if (!filePath) continue
          const key = normalizeFilePath(filePath)
          if (!wanted.has(key)) continue

          const views = typeof row.pageviews === 'number' ? row.pageviews : 0
          const visitors = typeof row.visitors === 'number' ? row.visitors : 0

          const next = combined[key] || { views: 0, visitors: 0 }
          next.views += views
          next.visitors = Math.max(next.visitors, visitors)
          combined[key] = next
        }

        if (rows.length < limit) break
      }

      for (const key of wanted) {
        const v = combined[key] || { views: 0, visitors: 0 }
        articleStore.setCachedStats(key, v.views, v.visitors)
        setSessionCachedStats(key, v.views, v.visitors)
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[umami] prefetch metrics failed', err)
      }
    }
  }

  const trackAndFetch = async (filePath: string) => {
    await trackView(filePath)
    await fetchAndCacheStats(filePath)
  }

  return {
    getCachedViews,
    getCachedVisitors,
    fetchAndCacheStats,
    prefetchAllPathStats,
    trackAndFetch,
    toUmamiPath
  }
}
