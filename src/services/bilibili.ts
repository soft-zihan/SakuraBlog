export type BiliPrefer = 'lossless' | 'dolby' | 'high' | 'medium' | 'low' | 'best'

export type BiliStreamMode = 'dash' | 'html5'

export type BiliSearchItem = {
  bvid: string
  aid?: number
  title: string
  author: string
  cover?: string
  durationSeconds?: number
}

export type BiliSearchPage = {
  page: number
  numPages: number
  numResults: number
  pageSize: number
  items: BiliSearchItem[]
}

type BiliViewPage = {
  cid: number
  page: number
  part: string
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, '').trim()
}

function normalizeCoverUrl(url?: string | null) {
  if (!url) return undefined
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('http://')) return url.replace('http://', 'https://')
  return url
}

function parseDurationToSeconds(duration?: string | null) {
  if (!duration) return undefined
  const parts = duration.split(':').map((x) => x.trim())
  if (!parts.length) return undefined
  const nums = parts.map((x) => Number(x))
  if (nums.some((n) => Number.isNaN(n))) return undefined
  if (nums.length === 2) return nums[0] * 60 + nums[1]
  if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2]
  return undefined
}

function normalizeProxyBaseUrl(proxyBaseUrl: string) {
  return proxyBaseUrl.trim().replace(/\/+$/, '')
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, init)
  const text = await res.text()
  let data: T
  try {
    data = JSON.parse(text) as T
  } catch {
    throw new Error(`Invalid JSON response: ${text.slice(0, 200)}`)
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
  return data
}

export async function biliSearch(args: {
  proxyBaseUrl?: string
  keyword: string
  page?: number
}) {
  const pageResult = await biliSearchPage(args)
  return pageResult.items
}

export async function biliSearchPage(args: {
  proxyBaseUrl?: string
  keyword: string
  page?: number
}): Promise<BiliSearchPage> {
  const page = args.page ?? 1
  const keyword = args.keyword.trim()
  if (!keyword) {
    return { page: 1, numPages: 1, numResults: 0, pageSize: 0, items: [] }
  }

  const base = normalizeProxyBaseUrl(args.proxyBaseUrl || '')
  if (!base) throw new Error('Missing proxyBaseUrl')
  const url = `${base}/api/bili/search?q=${encodeURIComponent(keyword)}&page=${encodeURIComponent(String(page))}`
  const root = await fetchJson<any>(url)
  const list = Array.isArray(root?.data?.result) ? root.data.result : []
  const items = list
    .map((it: any) => {
      const bvid = String(it?.bvid || '').trim()
      if (!bvid) return null
      return {
        bvid,
        aid: typeof it?.aid === 'number' ? it.aid : undefined,
        title: stripHtml(String(it?.title || '')),
        author: stripHtml(String(it?.author || '')),
        cover: normalizeCoverUrl(String(it?.pic || '')),
        durationSeconds: parseDurationToSeconds(String(it?.duration || ''))
      } satisfies BiliSearchItem
    })
    .filter(Boolean) as BiliSearchItem[]
  const data = root?.data || {}
  return {
    page: Number(data?.page) || page,
    numPages: Number(data?.numPages) || 1,
    numResults: Number(data?.numResults) || items.length,
    pageSize: Number(data?.pagesize || data?.pageSize) || items.length,
    items
  }
}

export async function biliGetFirstPage(args: {
  proxyBaseUrl?: string
  bvid: string
  aid?: number
}): Promise<BiliViewPage> {
  const bvid = args.bvid.trim()
  if (!bvid && !args.aid) throw new Error('Missing bvid/aid')

  const base = normalizeProxyBaseUrl(args.proxyBaseUrl || '')
  if (!base) throw new Error('Missing proxyBaseUrl')
  const qs = bvid ? `bvid=${encodeURIComponent(bvid)}` : `aid=${encodeURIComponent(String(args.aid))}`
  const url = `${base}/api/bili/view?${qs}`
  const root = await fetchJson<any>(url)
  const pages = Array.isArray(root?.data?.pages) ? root.data.pages : []
  const first = pages[0]
  const cid = Number(first?.cid)
  if (!cid || Number.isNaN(cid)) throw new Error('No cid found')
  return {
    cid,
    page: Number(first?.page) || 1,
    part: String(first?.part || '')
  }
}

export function biliBuildProxyAudioUrl(args: {
  proxyBaseUrl: string
  bvid: string
  cid: number
  prefer: BiliPrefer
  streamMode: BiliStreamMode
}) {
  const base = normalizeProxyBaseUrl(args.proxyBaseUrl)
  return `${base}/api/bili/audio?bvid=${encodeURIComponent(args.bvid)}&cid=${encodeURIComponent(String(args.cid))}&prefer=${encodeURIComponent(args.prefer)}&mode=${encodeURIComponent(args.streamMode)}`
}
