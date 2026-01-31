import { VIEW_COUNTER_CONFIG } from '../constants';
import { useArticleStore } from '../stores/articleStore';

interface CountApiResponse {
  value?: number;
}

const warnedUrls = new Set<string>()

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

  const hitCounter = async (namespace: string, key: string): Promise<number | undefined> => {
    const encodedNamespace = encodeURIComponent(namespace);
    const encodedKey = encodeURIComponent(key);
    const url = `https://api.countapi.xyz/hit/${encodedNamespace}/${encodedKey}`
    const response = await fetch(url);
    if (!response.ok) {
      if (!warnedUrls.has(url)) {
        warnedUrls.add(url)
        console.warn('CountAPI hit failed', { status: response.status, url })
      }
      return undefined;
    }
    const data = (await response.json()) as CountApiResponse;
    return typeof data.value === 'number' ? data.value : undefined;
  };

  const incrementAndGetViews = async (path: string): Promise<number | undefined> => {
    const normalizedPath = normalizePath(path)
    const cachedViews = getCachedViews(path)
    const cachedVisitors = getCachedVisitors(path)
    if (typeof cachedViews === 'number') return cachedViews

    if (VIEW_COUNTER_CONFIG.provider !== 'countapi') return cachedViews

    const namespace = getNamespace();
    if (!namespace) {
      return cachedViews;
    }

    try {
      const viewsKey = toCountApiKey('views', normalizedPath);
      const visitorsKey = toCountApiKey('visitors', normalizedPath);

      const views = await hitCounter(namespace, viewsKey);
      let visitors = cachedVisitors;

      if (!articleStore.hasVisited(normalizedPath)) {
        const v = await hitCounter(namespace, visitorsKey);
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
      return cachedViews;
    }

    return cachedViews;
  };

  return {
    getCachedViews,
    getCachedVisitors,
    incrementAndGetViews
  };
}
