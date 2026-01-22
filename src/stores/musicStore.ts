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
  const playMode = ref<'sequence' | 'single' | 'shuffle'>('sequence') // Removed 'loop'
  const showMusicPlayer = ref(false)
  const lyrics = ref<LyricLine[]>([])
  const currentLyricIndex = ref(-1)
  const seekRequestTime = ref<number | null>(null) // 用于通知 GlobalAudio 同步进度
  const customTracks = ref<MusicTrack[]>([])
  
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
  
  function addCustomTrack(track: MusicTrack) {
    if (!customTracks.value.find(t => t.id === track.id)) {
      customTracks.value.push(track)
    }
    addToPlaylist(track)
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
    const modes: typeof playMode.value[] = ['sequence', 'single', 'shuffle'] // Removed 'loop'
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
  
  // Load playlist from JSON and restore persisted track
  async function loadPlaylist() {
    try {
      const res = await fetch('./music.json')
      if (res.ok) {
        const data = await res.json()
        const baseTracks = data.tracks || []
        const mergedTracks = [...baseTracks, ...customTracks.value.filter(track => !baseTracks.find((t: MusicTrack) => t.id === track.id))]
        setPlaylist(mergedTracks)
        
        // Restore persisted track by filename
        const persisted = localStorage.getItem('music_currentTrackFilename')
        if (persisted && playlist.value.length > 0) {
          const index = findTrackByFilename(persisted)
          // If not found (index would be 0 from findTrackByFilename), check if it actually matched
          if (index === 0 && persisted !== getTrackFilename(playlist.value[0])) {
            // Track not found, reset to first track and pause
            currentIndex.value = 0
            isPlaying.value = false
            localStorage.removeItem('music_currentTrackFilename')
            console.log('Persisted track not found, reset to first track')
          } else {
            currentIndex.value = index
            // Restore playing state only if track was found
            const playingState = localStorage.getItem('music_isPlaying')
            if (playingState) {
              isPlaying.value = playingState === 'true'
            }
          }
        } else {
          // No persisted track, set to first and pause
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
    // Computed
    currentTrack,
    progress,
    formattedCurrentTime,
    formattedDuration,
    // Actions
    setPlaylist,
    addToPlaylist,
    addCustomTrack,
    removeFromPlaylist,
    removeCustomTrack,
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
    findTrackByFilename
  }
}, {
  persist: {
    pick: ['volume', 'playMode', 'customTracks']
  }
})
