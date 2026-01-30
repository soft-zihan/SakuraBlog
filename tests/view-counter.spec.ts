import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('useViewCounter (CountAPI)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses a safe key and normalizes leading slash', async () => {
    vi.mock('../src/constants', () => ({
      VIEW_COUNTER_CONFIG: { provider: 'countapi', countApiNamespace: 'mysite.com' }
    }))

    const hitCalls: string[] = []
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      hitCalls.push(url)
      return {
        ok: true,
        json: async () => ({ value: 1 })
      } as any
    })

    const { useViewCounter } = await import('../src/composables/useViewCounter')
    const { useArticleStore } = await import('../src/stores/articleStore')

    const { incrementAndGetViews } = useViewCounter()
    await incrementAndGetViews('/zh/你好.md')

    expect(hitCalls.length).toBe(2)
    expect(hitCalls[0]).toContain('https://api.countapi.xyz/hit/mysite.com/views_')
    expect(hitCalls[1]).toContain('https://api.countapi.xyz/hit/mysite.com/visitors_')

    const m1 = hitCalls[0].match(/views_([0-9a-f]{8})/i)
    const m2 = hitCalls[1].match(/visitors_([0-9a-f]{8})/i)
    expect(m1?.[1]).toBeTruthy()
    expect(m1?.[1]).toEqual(m2?.[1])

    const articleStore = useArticleStore()
    expect(articleStore.hasVisited('zh/你好.md')).toBe(true)
  })
})

