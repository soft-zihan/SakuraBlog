import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('useUmamiViewStats', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.resetModules()
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('tracks and fetches stats by virtual path', async () => {
    vi.mock('../src/constants', () => ({
      UMAMI_CONFIG: {
        enable: true,
        baseUrl: 'https://umami.example.com',
        websiteId: 'website-id-1',
        shareId: 'share-id-1',
        timezone: 'Asia/Shanghai',
        scriptUrl: ''
      }
    }))

    const track = vi.fn()
    window.umami = { track }

    const fetchUmamiStats = vi.fn().mockResolvedValue({
      pageviews: { value: 12 },
      visitors: { value: 3 }
    })
    window.fetchUmamiStats = fetchUmamiStats

    const { useUmamiViewStats } = await import('../src/composables/useUmamiViewStats')
    const { useArticleStore } = await import('../src/stores/articleStore')

    const { trackAndFetch, toUmamiPath } = useUmamiViewStats()
    await trackAndFetch('/zh/你好.md')

    const vpath = toUmamiPath('/zh/你好.md')
    expect(vpath).toBe(`/notes/zh/${encodeURIComponent('你好.md')}`)

    expect(track).toHaveBeenCalledTimes(1)
    const transform = track.mock.calls[0]?.[0]
    expect(typeof transform).toBe('function')
    const expectedUrl = (() => {
      try {
        return new URL(vpath, window.location.origin).toString()
      } catch {
        try {
          return new URL(vpath, window.location.href).toString()
        } catch {
          return `https://example.com${vpath}`
        }
      }
    })()
    const transformedPayload = transform({ url: 'http://example.com/' })
    expect(transformedPayload.url).toBe(expectedUrl)
    expect(fetchUmamiStats).toHaveBeenCalledWith('https://umami.example.com', 'share-id-1', expect.objectContaining({
      timezone: 'Asia/Shanghai',
      path: vpath
    }))

    const articleStore = useArticleStore()
    expect(articleStore.getCachedStats('/zh/你好.md')).toEqual({ views: 12, visitors: 3 })

    const stored = window.sessionStorage.getItem('sakura:umami:stats:v1')
    expect(stored).toBeTruthy()
  })
})
