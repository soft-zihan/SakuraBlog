import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MusicTrack {
  id: string
  title: string
  artist: string
  cover?: string
  url: string
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
  const showMiniPlayer = ref(true)
  const showFullPlayer = ref(false)
  const lyrics = ref<LyricLine[]>([])
  const currentLyricIndex = ref(-1)
  
  // User requests (点歌)
  const songRequests = ref<Array<{ name: string; requestedAt: Date }>>([])
  
  // Computed
  const currentTrack = computed(() => playlist.value[currentIndex.value] || null)
  
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
  
  function removeFromPlaylist(trackId: string) {
    const index = playlist.value.findIndex(t => t.id === trackId)
    if (index > -1) {
      playlist.value.splice(index, 1)
      if (currentIndex.value >= playlist.value.length) {
        currentIndex.value = Math.max(0, playlist.value.length - 1)
      }
    }
  }
  
  function play(index?: number) {
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
    if (playlist.value.length === 0) return
    
    if (playMode.value === 'shuffle') {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length)
    } else {
      currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    }
  }
  
  function prev() {
    if (playlist.value.length === 0) return
    
    if (playMode.value === 'shuffle') {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length)
    } else {
      currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    }
  }
  
  function seek(time: number) {
    currentTime.value = Math.max(0, Math.min(time, duration.value))
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
  
  // Song Request (点歌)
  function requestSong(name: string) {
    songRequests.value.push({ name, requestedAt: new Date() })
  }
  
  function clearRequests() {
    songRequests.value = []
  }
  
  // Helper
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Load playlist from JSON
  async function loadPlaylist() {
    try {
      const res = await fetch('./music.json')
      if (res.ok) {
        const data = await res.json()
        setPlaylist(data.tracks || [])
      }
    } catch (e) {
      console.warn('Failed to load music playlist:', e)
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
    showMiniPlayer,
    showFullPlayer,
    lyrics,
    currentLyricIndex,
    songRequests,
    // Computed
    currentTrack,
    progress,
    formattedCurrentTime,
    formattedDuration,
    // Actions
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    cyclePlayMode,
    setCurrentTime,
    setDuration,
    setLyrics,
    updateCurrentLyric,
    requestSong,
    clearRequests,
    loadPlaylist
  }
}, {
  persist: {
    pick: ['volume', 'playMode', 'songRequests']
  }
})
