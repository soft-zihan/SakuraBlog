<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="musicStore.showMusicPlayer" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="musicStore.showMusicPlayer = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="musicStore.showMusicPlayer = false"></div>
        
        <!-- Player Card -->
        <div class="relative w-full max-w-lg bg-gradient-to-br from-white/95 to-sakura-50/95 dark:from-gray-900/95 dark:to-gray-800/95 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 overflow-hidden animate-fade-in">
          
          <!-- Close Button -->
          <button 
            @click="musicStore.showMusicPlayer = false"
            class="absolute top-4 right-4 z-10 p-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          
          <!-- Cover Art -->
          <div class="relative aspect-square max-h-64 mx-auto mt-8">
            <img 
              :src="currentTrack?.cover || '/image/music-default.jpg'" 
              class="w-48 h-48 mx-auto rounded-2xl object-cover shadow-2xl transition-transform duration-500"
              :class="{ 'animate-pulse': musicStore.isPlaying }"
              @error="handleCoverError"
            />
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
          
          <!-- Track Info -->
          <div class="text-center px-8 py-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {{ currentTrack?.title || '未选择歌曲' }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400">
              {{ currentTrack?.artist || '未知艺术家' }}
            </p>
          </div>
          
          <!-- Lyrics -->
          <div v-if="musicStore.lyrics.length > 0" class="h-24 px-8 overflow-hidden relative">
            <div class="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white dark:from-gray-900 to-transparent z-10"></div>
            <div class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
            <div 
              class="transition-transform duration-300"
              :style="{ transform: `translateY(${-musicStore.currentLyricIndex * 24 + 36}px)` }"
            >
              <p 
                v-for="(line, idx) in musicStore.lyrics" 
                :key="idx"
                class="text-center text-sm py-1 transition-all duration-300"
                :class="idx === musicStore.currentLyricIndex 
                  ? 'text-sakura-600 dark:text-sakura-400 font-bold scale-105' 
                  : 'text-gray-400 dark:text-gray-500'"
              >
                {{ line.text }}
              </p>
            </div>
          </div>
          
          <!-- Progress -->
          <div class="px-8 py-4">
            <div 
              ref="progressBar"
              class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden relative"
              @click="seekTo"
              @pointerdown="startSeek"
            >
              <div 
                class="h-full bg-gradient-to-r from-sakura-400 to-sakura-600 rounded-full transition-all"
                :style="{ width: musicStore.progress + '%' }"
              ></div>
              <div
                class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border border-sakura-300"
                :style="{ left: `calc(${musicStore.progress}% - 6px)` }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>{{ musicStore.formattedCurrentTime }}</span>
              <span>{{ musicStore.formattedDuration }}</span>
            </div>
          </div>
          
          <!-- Controls -->
          <div class="flex items-center justify-center gap-6 pb-6">
            <!-- Shuffle/Mode -->
            <button 
              @click="musicStore.cyclePlayMode()"
              class="p-2 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded-full transition-colors"
              :class="musicStore.playMode !== 'sequence' ? 'text-sakura-500' : 'text-gray-400'"
            >
              <svg v-if="musicStore.playMode === 'shuffle'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
              <svg v-else-if="musicStore.playMode === 'single'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v10H7V7zm2 2v6h6V9H9z"/>
              </svg>
              <svg v-else-if="musicStore.playMode === 'loop'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
              </svg>
            </button>
            
            <!-- Prev -->
            <button 
              @click="musicStore.prev()"
              class="p-3 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <!-- Play/Pause -->
            <button 
              @click="musicStore.togglePlay()"
              class="p-4 bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 text-white rounded-full transition-all shadow-lg shadow-sakura-500/40 hover:shadow-xl hover:scale-105"
            >
              <svg v-if="!musicStore.isPlaying" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            
            <!-- Next -->
            <button 
              @click="musicStore.next()"
              class="p-3 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            
            <!-- Volume -->
            <div class="relative group">
              <button 
                @click="musicStore.toggleMute()"
                class="p-2 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400"
              >
                <svg v-if="musicStore.isMuted || musicStore.volume === 0" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
              
              <!-- Volume Slider -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  :value="musicStore.volume"
                  @input="e => musicStore.setVolume(parseFloat((e.target as HTMLInputElement).value))"
                  class="w-20 h-1 accent-sakura-500"
                />
              </div>
            </div>
          </div>
          
          <!-- Playlist Toggle -->
          <div class="border-t border-gray-200 dark:border-gray-700">
            <button 
              @click="showPlaylist = !showPlaylist"
              class="w-full px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-sakura-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              播放列表 ({{ musicStore.playlist.length }})
              <svg 
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': showPlaylist }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            
            <!-- Playlist -->
            <Transition name="slide">
              <div v-if="showPlaylist" class="max-h-48 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                <div 
                  v-for="(track, idx) in musicStore.playlist" 
                  :key="track.id"
                  @click="musicStore.play(idx)"
                  class="px-6 py-3 flex items-center gap-3 hover:bg-sakura-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  :class="{ 'bg-sakura-50 dark:bg-gray-800': musicStore.currentIndex === idx }"
                >
                  <img 
                    :src="track.cover || '/image/music-default.jpg'" 
                    class="w-10 h-10 rounded-lg object-cover"
                    @error="handleCoverError"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ track.title }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ track.artist }}</div>
                  </div>
                  <div v-if="musicStore.currentIndex === idx && musicStore.isPlaying" class="text-sakura-500">
                    <svg class="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                </div>
                
                <div v-if="musicStore.playlist.length === 0" class="px-6 py-8 text-center text-gray-400">
                  暂无歌曲
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const musicStore = useMusicStore()
const showPlaylist = ref(false)
const progressBar = ref<HTMLElement | null>(null)
const isSeeking = ref(false)

const currentTrack = computed(() => musicStore.currentTrack)

const updateSeek = (clientX: number) => {
  const target = progressBar.value
  if (!target) return
  const rect = target.getBoundingClientRect()
  const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  musicStore.seek(percent * musicStore.duration)
}

const seekTo = (e: MouseEvent) => {
  updateSeek(e.clientX)
}

const startSeek = (e: PointerEvent) => {
  isSeeking.value = true
  // 捕获指针，确保拖动时事件不会丢失
  const target = e.target as HTMLElement
  target.setPointerCapture(e.pointerId)
  updateSeek(e.clientX)
}

const handlePointerMove = (e: PointerEvent) => {
  if (!isSeeking.value) return
  updateSeek(e.clientX)
}

const handlePointerUp = () => {
  if (isSeeking.value) isSeeking.value = false
}

onMounted(() => {
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
})

const handleCoverError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/image/music-default.jpg'
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
