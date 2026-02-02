import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { safeLocalStorage } from '@/utils/storage'
import {
  biliBuildProxyAudioUrl,
  biliGetFirstPage,
  biliSearch,
  biliSearchPage,
  type BiliPrefer,
  type BiliSearchPage,
  type BiliSearchItem,
  type BiliStreamMode
} from '@/services/bilibili'

export type MusicSource = 'preset' | 'custom' | 'bili'

export type BiliMeta = {
  bvid: string
  aid?: number
  cid?: number
  page?: number
}

export interface MusicTrack {
  id: string
  title: string
  artist: string
  cover?: string
  url: string
  source?: MusicSource
  resolvedUrl?: string
  bili?: BiliMeta
  lrc?: string // LRC lyrics content or URL
  duration?: number
}

export interface LyricLine {
  time: number // in seconds
  text: string
}

export const useMusicStore = defineStore('music', () => {
  // State
  const playlist = ref<MusicTrack[]>([])
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.7)
  const isMuted = ref(false)
  const playMode = ref<'sequence' | 'loop' | 'single' | 'shuffle'>('sequence')
  const showMusicPlayer = ref(false)
  const lyrics = ref<LyricLine[]>([])
  const currentLyricIndex = ref(-1)
  const seekRequestTime = ref<number | null>(null) // 用于通知 GlobalAudio 同步进度
  const customTracks = ref<MusicTrack[]>([])
  const biliTracks = ref<MusicTrack[]>([])
  const biliSettings = ref<{
    proxyBaseUrl: string
    prefer: BiliPrefer
    streamMode: BiliStreamMode
  }>({
    proxyBaseUrl: '',
    prefer: 'best',
    streamMode: 'dash'
  })
  const biliResolving = ref(false)
  const biliResolveError = ref<string | null>(null)
  const temporaryTrack = ref<MusicTrack | null>(null)
  
  // Computed
  const currentTrack = computed(() => temporaryTrack.value || playlist.value[currentIndex.value] || null)
  const currentPlayableUrl = computed(() => {
    const track = currentTrack.value
    if (!track) return ''
    return track.resolvedUrl || track.url || ''
  })
  const effectiveBiliProxyBaseUrl = computed(() => getEffectiveBiliProxyBaseUrl())
  
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })
  
  const formattedCurrentTime = computed(() => formatTime(currentTime.value))
  const formattedDuration = computed(() => formatTime(duration.value))
  
  // Actions
  function setPlaylist(tracks: MusicTrack[]) {
    playlist.value = tracks
    if (tracks.length > 0 && currentIndex.value >= tracks.length) {
      currentIndex.value = 0
    }
  }
  
  function addToPlaylist(track: MusicTrack) {
    if (!playlist.value.find(t => t.id === track.id)) {
      playlist.value.push(track)
    }
  }
  
  function addCustomTrack(track: MusicTrack) {
    const normalized: MusicTrack = { ...track, source: 'custom' }
    if (!customTracks.value.find(t => t.id === normalized.id)) {
      customTracks.value.push(normalized)
    }
    addToPlaylist(normalized)
  }
  
  function removeCustomTrack(trackId: string) {
    const index = customTracks.value.findIndex(t => t.id === trackId)
    if (index > -1) {
      customTracks.value.splice(index, 1)
    }
    removeFromPlaylist(trackId)
  }
  
  function removeFromPlaylist(trackId: string) {
    const index = playlist.value.findIndex(t => t.id === trackId)
    if (index === -1) return

    const isUsingPlaylist = !temporaryTrack.value
    const removingCurrent = isUsingPlaylist && currentIndex.value === index
    const removingBeforeCurrent = isUsingPlaylist && index < currentIndex.value

    playlist.value.splice(index, 1)

    if (playlist.value.length === 0) {
      currentIndex.value = 0
      isPlaying.value = false
      currentTime.value = 0
      duration.value = 0
      lyrics.value = []
      currentLyricIndex.value = -1
      return
    }

    if (removingBeforeCurrent) {
      currentIndex.value = Math.max(0, currentIndex.value - 1)
      return
    }

    if (removingCurrent) {
      if (currentIndex.value >= playlist.value.length) {
        currentIndex.value = playlist.value.length - 1
      }
      return
    }

    if (currentIndex.value >= playlist.value.length) {
      currentIndex.value = playlist.value.length - 1
    }
  }

  function addBiliTrack(track: MusicTrack) {
    const normalized: MusicTrack = { ...track, source: 'bili' }
    if (!biliTracks.value.find(t => t.id === normalized.id)) {
      biliTracks.value.push(normalized)
    }
    addToPlaylist(normalized)
  }
  
  function play(index?: number) {
    temporaryTrack.value = null
    if (typeof index === 'number' && index >= 0 && index < playlist.value.length) {
      currentIndex.value = index
    }
    isPlaying.value = true
  }
  
  function pause() {
    isPlaying.value = false
  }
  
  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }
  
  function next() {
    if (temporaryTrack.value) temporaryTrack.value = null
    if (playlist.value.length === 0) return
    
    if (playMode.value === 'shuffle') {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length)
    } else {
      currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    }
  }
  
  function prev() {
    if (temporaryTrack.value) temporaryTrack.value = null
    if (playlist.value.length === 0) return
    
    if (playMode.value === 'shuffle') {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length)
    } else {
      currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    }
  }
  
  function seek(time: number) {
    const clampedTime = Math.max(0, Math.min(time, duration.value))
    currentTime.value = clampedTime
    seekRequestTime.value = clampedTime // 触发 GlobalAudio 同步
  }
  
  function clearSeekRequest() {
    seekRequestTime.value = null
  }
  
  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
    if (v > 0) isMuted.value = false
  }
  
  function toggleMute() {
    isMuted.value = !isMuted.value
  }
  
  function cyclePlayMode() {
    const modes: typeof playMode.value[] = ['sequence', 'loop', 'single', 'shuffle']
    const currentIdx = modes.indexOf(playMode.value)
    playMode.value = modes[(currentIdx + 1) % modes.length]
  }
  
  function setCurrentTime(time: number) {
    currentTime.value = time
    updateCurrentLyric()
  }
  
  function setDuration(d: number) {
    duration.value = d
  }
  
  // Lyrics
  function parseLRC(lrcContent: string): LyricLine[] {
    const lines: LyricLine[] = []
    const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/
    
    lrcContent.split('\n').forEach(line => {
      const match = line.match(regex)
      if (match) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const ms = parseInt(match[3].padEnd(3, '0'))
        const time = minutes * 60 + seconds + ms / 1000
        const text = match[4].trim()
        if (text) {
          lines.push({ time, text })
        }
      }
    })
    
    return lines.sort((a, b) => a.time - b.time)
  }
  
  function setLyrics(lrcContent: string) {
    lyrics.value = parseLRC(lrcContent)
    currentLyricIndex.value = -1
  }
  
  function updateCurrentLyric() {
    if (lyrics.value.length === 0) {
      currentLyricIndex.value = -1
      return
    }
    
    for (let i = lyrics.value.length - 1; i >= 0; i--) {
      if (currentTime.value >= lyrics.value[i].time) {
        currentLyricIndex.value = i
        return
      }
    }
    currentLyricIndex.value = -1
  }
  
  // Helper
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Get filename from track URL for persistence matching
  function getTrackFilename(track: MusicTrack | null): string {
    if (!track || !track.url) return ''
    const parts = track.url.split('/')
    return parts[parts.length - 1]
  }
  
  // Find track index by filename
  function findTrackByFilename(filename: string): number {
    if (!filename) return 0
    const index = playlist.value.findIndex(track => getTrackFilename(track) === filename)
    return index >= 0 ? index : 0
  }

  function findTrackById(trackId: string): number {
    if (!trackId) return 0
    const index = playlist.value.findIndex(track => track.id === trackId)
    return index >= 0 ? index : 0
  }

  function upsertTrackById(trackId: string, patch: Partial<MusicTrack>) {
    if (temporaryTrack.value?.id === trackId) {
      temporaryTrack.value = { ...temporaryTrack.value, ...patch }
    }

    const idx = playlist.value.findIndex(t => t.id === trackId)
    if (idx >= 0) playlist.value[idx] = { ...playlist.value[idx], ...patch }

    const bIdx = biliTracks.value.findIndex(t => t.id === trackId)
    if (bIdx >= 0) biliTracks.value[bIdx] = { ...biliTracks.value[bIdx], ...patch }

    const cIdx = customTracks.value.findIndex(t => t.id === trackId)
    if (cIdx >= 0) customTracks.value[cIdx] = { ...customTracks.value[cIdx], ...patch }
  }

  function getEffectiveBiliProxyBaseUrl() {
    return (biliSettings.value.proxyBaseUrl || String(import.meta.env.VITE_BILI_PROXY_BASE_URL || '')).trim()
  }

  function maybeProxyBiliCover(cover?: string) {
    const c = (cover || '').trim()
    if (!c) return cover
    if (c.includes('/api/bili/image?')) return c

    let normalized = c
    if (normalized.startsWith('//')) normalized = `https:${normalized}`
    if (normalized.startsWith('http://')) normalized = normalized.replace(/^http:\/\//, 'https://')
    if (!normalized.includes('hdslb.com')) return normalized

    const base = getEffectiveBiliProxyBaseUrl()
    if (!base) return normalized
    return `${base.replace(/\/+$/, '')}/api/bili/image?url=${encodeURIComponent(normalized)}`
  }

  function normalizeBiliCoversInLists() {
    biliTracks.value = biliTracks.value.map((t) => (t.source === 'bili' ? { ...t, cover: maybeProxyBiliCover(t.cover) } : t))
    playlist.value = playlist.value.map((t) => (t.source === 'bili' ? { ...t, cover: maybeProxyBiliCover(t.cover) } : t))
  }

  function clearTemporaryTrack() {
    temporaryTrack.value = null
  }

  function playBiliTemporary(track: MusicTrack) {
    const meta = track.bili
    if (!meta?.bvid) return
    const tmpId = `temp-bili-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    temporaryTrack.value = {
      ...track,
      id: tmpId,
      source: 'bili',
      url: '',
      resolvedUrl: '',
      bili: { ...meta }
    }
    isPlaying.value = true
  }

  async function resolveBiliAudioUrlForTrack(track: MusicTrack) {
    const proxyBaseUrl = getEffectiveBiliProxyBaseUrl()
    if (!proxyBaseUrl) throw new Error('未配置解析服务地址')
    const meta = track.bili
    if (!meta?.bvid) throw new Error('缺少 bvid')

    const page = await biliGetFirstPage({ proxyBaseUrl, bvid: meta.bvid, aid: meta.aid })
    const cid = page.cid
    const resolvedUrl = biliBuildProxyAudioUrl({
      proxyBaseUrl,
      bvid: meta.bvid,
      cid,
      prefer: biliSettings.value.prefer,
      streamMode: biliSettings.value.streamMode
    })
    return { resolvedUrl, cid, page: page.page }
  }

  async function searchBilibili(keyword: string, page = 1) {
    const proxyBaseUrl = getEffectiveBiliProxyBaseUrl()
    const list: BiliSearchItem[] = await biliSearch({ proxyBaseUrl, keyword, page })
    return list.map((it) => {
      const id = `bili:${it.bvid}`
      const cover = maybeProxyBiliCover(it.cover)
      return {
        id,
        title: it.title || it.bvid,
        artist: it.author || 'Bilibili',
        cover,
        url: '',
        duration: it.durationSeconds,
        source: 'bili' as const,
        bili: { bvid: it.bvid, aid: it.aid }
      } satisfies MusicTrack
    })
  }

  async function searchBilibiliPage(keyword: string, page = 1) {
    const proxyBaseUrl = getEffectiveBiliProxyBaseUrl()
    const res: BiliSearchPage = await biliSearchPage({ proxyBaseUrl, keyword, page })
    const tracks = (res.items || []).map((it) => {
      const id = `bili:${it.bvid}`
      const cover = maybeProxyBiliCover(it.cover)
      return {
        id,
        title: it.title || it.bvid,
        artist: it.author || 'Bilibili',
        cover,
        url: '',
        duration: it.durationSeconds,
        source: 'bili' as const,
        bili: { bvid: it.bvid, aid: it.aid }
      } satisfies MusicTrack
    })
    return {
      page: res.page,
      numPages: res.numPages,
      numResults: res.numResults,
      pageSize: res.pageSize,
      items: tracks
    }
  }

  async function ensureCurrentTrackResolved(force = false) {
    const track = currentTrack.value
    if (!track) return false
    if (track.source !== 'bili') return true
    if (!force && track.resolvedUrl) return true

    biliResolving.value = true
    biliResolveError.value = null
    try {
      const meta = track.bili || { bvid: '' }
      const { resolvedUrl, cid, page } = await resolveBiliAudioUrlForTrack(track)
      upsertTrackById(track.id, { resolvedUrl, bili: { ...meta, cid, page } })
      return true
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      biliResolveError.value = msg
      return false
    } finally {
      biliResolving.value = false
    }
  }

  async function retryResolveCurrentTrack() {
    const track = currentTrack.value
    if (track?.source === 'bili') {
      upsertTrackById(track.id, { resolvedUrl: '' })
    }
    return ensureCurrentTrackResolved(true)
  }

  function sanitizeFileBaseName(input: string) {
    return input.replace(/[\\/:*?"<>|]+/g, ' ').trim()
  }

  function inferExtFromUrl(url: string, fallback: string) {
    const urlNoQuery = url.split('#')[0].split('?')[0]
    const lastDot = urlNoQuery.lastIndexOf('.')
    const extFromUrl = lastDot > -1 ? urlNoQuery.slice(lastDot + 1).slice(0, 8) : ''
    const ext = (extFromUrl || fallback).replace(/[^a-zA-Z0-9]+/g, '').toLowerCase()
    return ext || fallback
  }

  function extractOriginalCoverUrl(cover: string) {
    try {
      const u = new URL(cover, window.location.href)
      if (u.pathname.endsWith('/api/bili/image')) {
        const raw = u.searchParams.get('url')
        if (raw) return raw
      }
      return u.toString()
    } catch {
      return cover
    }
  }

  function triggerDownloadLink(href: string, filename?: string) {
    const a = document.createElement('a')
    a.href = href
    if (filename) a.download = filename
    a.rel = 'noopener'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  async function downloadCoverForTrack(track: MusicTrack, baseName: string) {
    const cover = String(track.cover || '').trim()
    if (!cover) return
    if (cover.includes('music-default.svg')) return

    const rawCoverUrl = extractOriginalCoverUrl(cover)
    const ext = inferExtFromUrl(rawCoverUrl, 'jpg')
    const filename = `${baseName || 'cover'}.${ext}`

    const proxyBaseUrl = getEffectiveBiliProxyBaseUrl()
    if (proxyBaseUrl) {
      const url = `${proxyBaseUrl}/api/wallpaper/file?url=${encodeURIComponent(rawCoverUrl)}&filename=${encodeURIComponent(filename)}`
      triggerDownloadLink(url)
      return
    }

    if (rawCoverUrl.startsWith('blob:') || rawCoverUrl.startsWith('data:') || rawCoverUrl.startsWith('./') || rawCoverUrl.startsWith('/')) {
      triggerDownloadLink(rawCoverUrl, filename)
      return
    }

    try {
      const res = await fetch(rawCoverUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      triggerDownloadLink(blobUrl, filename)
      URL.revokeObjectURL(blobUrl)
    } catch {
      triggerDownloadLink(rawCoverUrl, filename)
    }
  }

  async function downloadBiliTrack(track: MusicTrack) {
    const meta = track.bili
    if (!meta?.bvid) throw new Error('缺少 bvid')
    const { resolvedUrl } = await resolveBiliAudioUrlForTrack(track)
    const name = sanitizeFileBaseName(track.title || meta.bvid)
    const url = `${resolvedUrl}&download=1&filename=${encodeURIComponent(`${name || 'bili-audio'}.mp4`)}`
    triggerDownloadLink(url)
    await downloadCoverForTrack(track, name || meta.bvid)
  }

  async function downloadTrack(track: MusicTrack) {
    if (track.source === 'bili') {
      return downloadBiliTrack(track)
    }

    const src = String(track.resolvedUrl || track.url || '').trim()
    if (!src) throw new Error('缺少下载地址')

    const baseName = sanitizeFileBaseName(track.title || 'audio') || 'audio'
    const urlNoQuery = src.split('#')[0].split('?')[0]
    const lastDot = urlNoQuery.lastIndexOf('.')
    const extFromUrl = lastDot > -1 ? urlNoQuery.slice(lastDot + 1).slice(0, 8) : ''
    const extFromData = src.startsWith('data:') ? src.slice(5, src.indexOf(';') > -1 ? src.indexOf(';') : src.length).split('/')[1] : ''
    const ext = (extFromData || extFromUrl || 'mp3').replace(/[^a-zA-Z0-9]+/g, '').toLowerCase()
    const fileName = `${baseName}.${ext}`

    const downloadByAnchor = (href: string) => {
      const a = document.createElement('a')
      a.href = href
      a.download = fileName
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }

    if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('./') || src.startsWith('/')) {
      downloadByAnchor(src)
      await downloadCoverForTrack(track, baseName)
      return
    }

    try {
      const res = await fetch(src)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      downloadByAnchor(blobUrl)
      URL.revokeObjectURL(blobUrl)
      await downloadCoverForTrack(track, baseName)
      return
    } catch {
      triggerDownloadLink(src)
      await downloadCoverForTrack(track, baseName)
    }
  }
  
  // Load playlist from JSON and restore persisted track
  async function loadPlaylist() {
    try {
      const res = await fetch('./data/music.json')
      if (res.ok) {
        const data = await res.json()
        const rawTracks: MusicTrack[] = Array.isArray(data) ? data : (data.tracks || [])
        const baseTracks = rawTracks.map((track, index) => ({
          ...track,
          id: track.id || `track-${index}-${track.url || track.title || 'unknown'}`,
          source: track.source || 'preset'
        }))
        const mergedTracks = [
          ...baseTracks,
          ...customTracks.value.filter(track => !baseTracks.find((t: MusicTrack) => t.id === track.id)),
          ...biliTracks.value.filter(track =>
            !baseTracks.find((t: MusicTrack) => t.id === track.id) &&
            !customTracks.value.find((t: MusicTrack) => t.id === track.id)
          )
        ]
        setPlaylist(mergedTracks)
        normalizeBiliCoversInLists()
        
        const persistedFilename = safeLocalStorage.getItem('music_currentTrackFilename')
        const persistedId = safeLocalStorage.getItem('music_currentTrackId')

        if (playlist.value.length === 0) {
          currentIndex.value = 0
          isPlaying.value = false
        } else if (persistedFilename) {
          const index = findTrackByFilename(persistedFilename)
          if (index === 0 && persistedFilename !== getTrackFilename(playlist.value[0])) {
            if (persistedId) {
              const idxById = findTrackById(persistedId)
              if (idxById === 0 && persistedId !== playlist.value[0]?.id) {
                currentIndex.value = 0
                isPlaying.value = false
                safeLocalStorage.removeItem('music_currentTrackFilename')
                safeLocalStorage.removeItem('music_currentTrackId')
                console.log('Persisted track not found, reset to first track')
              } else {
                currentIndex.value = idxById
                const playingState = safeLocalStorage.getItem('music_isPlaying')
                if (playingState) {
                  isPlaying.value = playingState === 'true'
                }
              }
            } else {
              currentIndex.value = 0
              isPlaying.value = false
              safeLocalStorage.removeItem('music_currentTrackFilename')
              console.log('Persisted track not found, reset to first track')
            }
          } else {
            currentIndex.value = index
            const playingState = safeLocalStorage.getItem('music_isPlaying')
            if (playingState) {
              isPlaying.value = playingState === 'true'
            }
          }
        } else if (persistedId) {
          const idxById = findTrackById(persistedId)
          if (idxById === 0 && persistedId !== playlist.value[0]?.id) {
            currentIndex.value = 0
            isPlaying.value = false
            safeLocalStorage.removeItem('music_currentTrackId')
          } else {
            currentIndex.value = idxById
            const playingState = safeLocalStorage.getItem('music_isPlaying')
            if (playingState) {
              isPlaying.value = playingState === 'true'
            }
          }
        } else {
          currentIndex.value = 0
          isPlaying.value = false
        }
      }
    } catch (e) {
      console.warn('Failed to load music playlist:', e)
      // Ensure we have at least one track
      currentIndex.value = 0
      isPlaying.value = false
    }
  }
  
  return {
    // State
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    showMusicPlayer,
    lyrics,
    currentLyricIndex,
    seekRequestTime,
    customTracks,
    biliTracks,
    biliSettings,
    biliResolving,
    biliResolveError,
    effectiveBiliProxyBaseUrl,
    temporaryTrack,
    // Computed
    currentTrack,
    currentPlayableUrl,
    progress,
    formattedCurrentTime,
    formattedDuration,
    // Actions
    setPlaylist,
    addToPlaylist,
    addCustomTrack,
    removeFromPlaylist,
    removeCustomTrack,
    addBiliTrack,
    playBiliTemporary,
    clearTemporaryTrack,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    clearSeekRequest,
    setVolume,
    toggleMute,
    cyclePlayMode,
    setCurrentTime,
    setDuration,
    setLyrics,
    updateCurrentLyric,
    loadPlaylist,
    getTrackFilename,
    findTrackByFilename,
    findTrackById,
    searchBilibili,
    searchBilibiliPage,
    ensureCurrentTrackResolved,
    retryResolveCurrentTrack,
    downloadBiliTrack,
    downloadTrack
  }
}, {
  persist: {
    pick: ['volume', 'playMode', 'customTracks', 'biliTracks', 'biliSettings']
  }
})
