export class WallhavenApiError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'WallhavenApiError'
    this.status = status
    this.details = details
  }
}

export type WallhavenPurity = 'sfw' | 'sketchy' | 'nsfw'
export type WallhavenCategory = 'general' | 'anime' | 'people'

export type WallhavenSearchSorting = 'date_added' | 'relevance' | 'random' | 'views' | 'favorites' | 'toplist'
export type WallhavenSearchOrder = 'desc' | 'asc'
export type WallhavenTopRange = '1d' | '3d' | '1w' | '1M' | '3M' | '6M' | '1y'

export interface WallhavenThumbs {
  large: string
  original: string
  small: string
}

export interface WallhavenSearchItem {
  id: string
  url: string
  short_url: string
  views: number
  favorites: number
  source: string
  purity: string
  category: string
  dimension_x: number
  dimension_y: number
  resolution: string
  ratio: string
  file_size: number
  file_type: string
  created_at: string
  colors: string[]
  path: string
  thumbs: WallhavenThumbs
}

export interface WallhavenUploader {
  username: string
  group: string
  avatar: Record<string, string>
}

export interface WallhavenTag {
  id: number
  name: string
  alias: string
  category_id: number
  category: string
  purity: string
  created_at: string
}

export interface WallhavenWallpaperInfo extends WallhavenSearchItem {
  uploader: WallhavenUploader
  tags: WallhavenTag[]
}

export interface WallhavenSearchMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  query: unknown
  seed?: string | null
}

export interface WallhavenSearchResponse {
  data: WallhavenSearchItem[]
  meta: WallhavenSearchMeta
}

export interface WallhavenTagResponse {
  data: WallhavenTag
}

export interface WallhavenWallpaperResponse {
  data: WallhavenWallpaperInfo
}

export interface WallhavenSettings {
  thumb_size: string
  per_page: string
  purity: WallhavenPurity[]
  categories: WallhavenCategory[]
  resolutions: string[]
  aspect_ratios: string[]
  toplist_range: string
  tag_blacklist: string[]
  user_blacklist: string[]
}

export interface WallhavenSettingsResponse {
  data: WallhavenSettings
}

export interface WallhavenCollection {
  id: number
  label: string
  views: number
  public: 0 | 1
  count: number
}

export interface WallhavenCollectionsResponse {
  data: WallhavenCollection[]
}

const WALLHAVEN_BASE = ((import.meta as any).env?.VITE_WALLHAVEN_BASE_URL || '/api/wallhaven').replace(/\/$/, '')

const buildUrl = (path: string, params?: Record<string, string | number | boolean | null | undefined>) => {
  const sp = new URLSearchParams()
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue
      sp.set(k, String(v))
    }
  }
  const qs = sp.toString()
  return `${WALLHAVEN_BASE}${path}${qs ? `?${qs}` : ''}`
}

const buildHeaders = (apiKey?: string) => {
  const headers: Record<string, string> = {
    Accept: 'application/json'
  }
  const key = (apiKey || '').trim()
  if (key) headers['X-API-Key'] = key
  return headers
}

const parseErrorMessage = async (res: Response) => {
  try {
    const data = await res.json()
    const msg = typeof data?.error === 'string' ? data.error : (typeof data?.message === 'string' ? data.message : '')
    return { message: msg || res.statusText || 'Request failed', details: data }
  } catch {
    return { message: res.statusText || 'Request failed', details: undefined }
  }
}

const wallhavenGet = async <T>(
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>,
  apiKey?: string
): Promise<T> => {
  const url = buildUrl(path, params)
  let res: Response
  try {
    res = await fetch(url, { method: 'GET', headers: buildHeaders(apiKey) })
  } catch (e) {
    throw new WallhavenApiError(0, 'Network error', { url, cause: String(e) })
  }
  if (!res.ok) {
    const { message, details } = await parseErrorMessage(res)
    throw new WallhavenApiError(res.status, message, details)
  }
  return res.json() as Promise<T>
}

export const wallhavenSearch = (params: Record<string, string | number | boolean | null | undefined>, apiKey?: string) => {
  return wallhavenGet<WallhavenSearchResponse>('/search', params, apiKey)
}

export const wallhavenWallpaper = (id: string, apiKey?: string) => {
  return wallhavenGet<WallhavenWallpaperResponse>(`/w/${encodeURIComponent(id)}`, undefined, apiKey)
}

export const wallhavenTag = (id: number | string) => {
  return wallhavenGet<WallhavenTagResponse>(`/tag/${encodeURIComponent(String(id))}`)
}

export const wallhavenSettings = (apiKey: string) => {
  return wallhavenGet<WallhavenSettingsResponse>('/settings', undefined, apiKey)
}

export const wallhavenCollections = (opts: { apiKey?: string; username?: string }) => {
  const username = (opts.username || '').trim()
  if (username) return wallhavenGet<WallhavenCollectionsResponse>(`/collections/${encodeURIComponent(username)}`)
  return wallhavenGet<WallhavenCollectionsResponse>('/collections', undefined, opts.apiKey)
}

export const wallhavenCollectionWallpapers = (opts: {
  username: string
  id: number | string
  purity?: string
  page?: number
  apiKey?: string
}) => {
  return wallhavenGet<WallhavenSearchResponse>(
    `/collections/${encodeURIComponent(opts.username)}/${encodeURIComponent(String(opts.id))}`,
    { purity: opts.purity, page: opts.page },
    opts.apiKey
  )
}
