<template>
  <div 
    class="article-card group p-4 bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg dark:hover:shadow-black/20 cursor-pointer transition-all duration-300 animate-fade-in relative overflow-hidden backdrop-blur-sm"
    :class="{ 'ring-2 bg-white dark:bg-gray-800 shadow-md': isActive }"
    :style="isActive ? activeRingStyle : undefined"
    @click="emit('click')"
  >
    <!-- Decorative Gradient -->
    <div class="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" :style="decorativeStyle"></div>
    
    <!-- Header: Title & Icon -->
    <div class="flex justify-between items-start relative z-10 mb-3">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-xl shrink-0">{{ getFileIcon(file) }}</span>
        <span class="font-bold truncate text-sm" :style="titleStyle">
          {{ getDisplayName(file.name) }}
        </span>
      </div>
    </div>
    
    <!-- Meta Info Row -->
    <div class="flex flex-wrap items-center gap-2 relative z-10">
      <!-- Date -->
      <span class="text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap font-medium" :style="primaryBadgeStyle">
        {{ formatDate(file.lastModified) }}
      </span>
      
      <!-- Like Count -->
      <span v-if="likeCount > 0" class="text-[10px] bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-md flex items-center gap-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        {{ likeCount }}
      </span>

      <span class="text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1" :style="secondaryBadgeStyle">
        <span class="text-[10px]">👨‍💻</span>
        {{ visitorCountDisplay }}
      </span>

      <span class="text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1" :style="secondaryBadgeStyle">
        <span class="text-[10px]">📖</span>
        {{ viewCountDisplay }}
      </span>

      <span v-if="typeof commentCount === 'number'" class="text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1" :style="secondaryBadgeStyle">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 8l-4-4V4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H7z"/>
        </svg>
        {{ formatNumber(commentCount) }}
      </span>
      
      <!-- Parent Path -->
      <div v-if="showPath && parentPath" class="text-[10px] text-gray-400 dark:text-gray-500 truncate flex items-center gap-1 ml-auto">
        <span class="opacity-50">/</span> {{ parentPath }}
      </div>
    </div>
    
    <!-- Favorite Star (if favorited) -->
    <div 
      v-if="isFavorite" 
      class="absolute top-2 right-2 text-yellow-400"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FileNode } from '../types'
import { useArticleStore } from '../stores/articleStore'
import { useAppStore } from '../stores/appStore'

const props = defineProps<{
  file: FileNode
  isActive?: boolean
  showPath?: boolean
  lang?: 'en' | 'zh'
  viewCount?: number
  visitorCount?: number
  commentCount?: number
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const articleStore = useArticleStore()
const appStore = useAppStore()

const isLiked = computed(() => articleStore.isLiked(props.file.path))
const isFavorite = computed(() => articleStore.isFavorite(props.file.path))
const likeCount = computed(() => articleStore.getLikes(props.file.path))
const viewCountDisplay = computed(() => (typeof props.viewCount === 'number' ? formatNumber(props.viewCount) : '--'))
const visitorCountDisplay = computed(() => (typeof props.visitorCount === 'number' ? formatNumber(props.visitorCount) : '--'))

const activeRingStyle = computed(() => ({
  '--tw-ring-color': appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)'
}))

const decorativeStyle = computed(() => ({
  backgroundImage: `linear-gradient(135deg, ${appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-50)'}, transparent)`
}))

const titleStyle = computed(() => ({
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-700)'
}))

const primaryBadgeStyle = computed(() => ({
  backgroundColor: appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-50)',
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)'
}))

const secondaryBadgeStyle = computed(() => ({
  backgroundColor: appStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  color: appStore.isDark ? 'var(--primary-400)' : 'var(--primary-500)'
}))

const parentPath = computed(() => {
  const parts = props.file.path.split('/')
  if (parts.length <= 1) return ''
  return parts.slice(0, -1).join('/')
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const isPdfFile = (file: FileNode) => file.path.toLowerCase().endsWith('.pdf')

const getFileIcon = (file: FileNode) => {
  if (file.isSource) return '💻'
  if (isPdfFile(file)) return '📕'
  return '📝'
}

const getDisplayName = (name: string) => {
  if (name.toLowerCase().endsWith('.md')) return name.slice(0, -3)
  if (name.toLowerCase().endsWith('.pdf')) return name.slice(0, -4)
  return name
}
</script>
