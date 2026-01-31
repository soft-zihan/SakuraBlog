import { VIEW_COUNTER_CONFIG } from '../constants';
import { useArticleStore } from '../stores/articleStore';

interface CountApiResponse {
  value?: number;
}

const warnedUrls = new Set<string>()
const COUNTAPI_BASE_URLS = ['https://api.countapi.xyz', 'https://countapi.xyz']

export function useViewCounter() {
  const articleStore = useArticleStore();

  const normalizePath = (path: string) => (path || '').replace(/^\/+/, '')

  const fnv1a32 = (input: string) => {
    let hash = 0x811c9dc5
    for (const ch of input) {
      hash ^= ch.codePointAt(0) || 0
      hash = Math.imul(hash, 0x01000193)
    }
    return (hash >>> 0).toString(16).padStart(8, '0')
  }

  const toCountApiKey = (prefix: 'views' | 'visitors', path: string) => {
    const normalized = normalizePath(path)
    const hash = fnv1a32(normalized)
    return `${prefix}_${hash}`
  }

  const getCachedViews = (path: string): number | undefined => {
    const cached = articleStore.getCachedStats(path);
    return cached ? cached.views : undefined;
  };

  const getCachedVisitors = (path: string): number | undefined => {
    const cached = articleStore.getCachedStats(path);
    return cached ? cached.visitors : undefined;
  };

  const getNamespace = () => {
    let namespace = VIEW_COUNTER_CONFIG.countApiNamespace;
    if (!namespace && typeof window !== 'undefined') {
      namespace = window.location.hostname || 'sakura-notes';
    }
    return namespace;
  };

  const fetchWithTimeout = async (url: string, timeoutMs: number) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      return await fetch(url, { signal: controller.signal })
    } finally {
      clearTimeout(timer)
    }
  }

  const requestCounter = async (mode: 'hit' | 'get', namespace: string, key: string): Promise<number | undefined> => {
    const encodedNamespace = encodeURIComponent(namespace);
    const encodedKey = encodeURIComponent(key);

    for (const baseUrl of COUNTAPI_BASE_URLS) {
      const url = `${baseUrl}/${mode}/${encodedNamespace}/${encodedKey}`
      try {
        const response = await fetchWithTimeout(url, 5000);
        if (!response.ok) {
          if (!warnedUrls.has(url)) {
            warnedUrls.add(url)
            console.warn(`CountAPI ${mode} failed`, { status: response.status, url })
          }
          continue
        }
        const data = (await response.json()) as CountApiResponse;
        if (typeof data.value === 'number') return data.value
      } catch (error) {
        if (!warnedUrls.has(url)) {
          warnedUrls.add(url)
          if (error instanceof Error) {
            console.warn(`CountAPI ${mode} error`, { message: error.message, url })
          } else {
            console.warn(`CountAPI ${mode} error`, { error, url })
          }
        }
      }
    }

    return undefined
  };

  const incrementAndGetViews = async (path: string): Promise<number | undefined> => {
    const normalizedPath = normalizePath(path)
    const cachedViews = getCachedViews(path)
    const cachedVisitors = getCachedVisitors(path)
    if (typeof cachedViews === 'number') return cachedViews

    const namespace = getNamespace();
    if (!namespace) {
      return cachedViews;
    }

    const viewsKey = toCountApiKey('views', normalizedPath);
    const visitorsKey = toCountApiKey('visitors', normalizedPath);

    if (VIEW_COUNTER_CONFIG.provider !== 'countapi') return cachedViews

    try {
      const views = await requestCounter('hit', namespace, viewsKey);
      let visitors = cachedVisitors;

      if (!articleStore.hasVisited(normalizedPath)) {
        const v = await requestCounter('hit', namespace, visitorsKey);
        if (typeof v === 'number') {
          visitors = v;
          articleStore.markVisited(normalizedPath);
        }
      }

      if (typeof views === 'number') {
        articleStore.setCachedStats(path, views, typeof visitors === 'number' ? visitors : visitors ?? 0);
        return views;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn('CountAPI hit error', { message: error.message })
      } else {
        console.warn('CountAPI hit error', { error })
      }
    }

    return cachedViews;
  };

  const fetchAndCacheStats = async (path: string): Promise<{ views: number; visitors: number } | null> => {
    const cached = articleStore.getCachedStats(path)
    if (cached) return cached

    const normalizedPath = normalizePath(path)
    const namespace = getNamespace()
    if (!namespace) return null

    const viewsKey = toCountApiKey('views', normalizedPath);
    const visitorsKey = toCountApiKey('visitors', normalizedPath);

    if (VIEW_COUNTER_CONFIG.provider !== 'countapi') return null

    const [views, visitors] = await Promise.all([
      requestCounter('get', namespace, viewsKey),
      requestCounter('get', namespace, visitorsKey)
    ])

    if (typeof views === 'number' || typeof visitors === 'number') {
      articleStore.setCachedStats(path, views ?? 0, visitors ?? 0)
      return { views: views ?? 0, visitors: visitors ?? 0 }
    }

    return null
  }

  return {
    getCachedViews,
    getCachedVisitors,
    incrementAndGetViews,
    fetchAndCacheStats
  };
}
