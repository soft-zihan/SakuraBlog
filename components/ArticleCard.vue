<template>
  <div 
    class="article-card group p-4 bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-sakura-100/20 dark:hover:shadow-black/20 cursor-pointer transition-all duration-300 animate-fade-in relative overflow-hidden backdrop-blur-sm"
    :class="{ 'ring-2 ring-sakura-300 dark:ring-sakura-600 bg-white dark:bg-gray-800 shadow-md': isActive }"
    @click="emit('click')"
  >
    <!-- Decorative Gradient -->
    <div class="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-sakura-50 to-transparent dark:from-sakura-900/20 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
    
    <!-- Header: Title & Icon -->
    <div class="flex justify-between items-start relative z-10 mb-3">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-xl shrink-0">{{ file.isSource ? '💻' : '📝' }}</span>
        <span class="font-bold text-gray-700 dark:text-gray-200 group-hover:text-sakura-600 dark:group-hover:text-sakura-400 truncate text-sm">
          {{ file.name.replace('.md', '') }}
        </span>
      </div>
      
      <!-- Like Button -->
      <button 
        @click.stop="toggleLike"
        class="shrink-0 p-1.5 rounded-full transition-all"
        :class="isLiked 
          ? 'bg-red-50 dark:bg-red-900/30 text-red-500' 
          : 'hover:bg-sakura-50 dark:hover:bg-gray-700 text-gray-400 hover:text-red-400'"
      >
        <svg 
          class="w-4 h-4 transition-transform" 
          :class="{ 'scale-110': isLiked }"
          :fill="isLiked ? 'currentColor' : 'none'" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>
    </div>
    
    <!-- Meta Info Row -->
    <div class="flex flex-wrap items-center gap-2 relative z-10">
      <!-- Date -->
      <span class="text-[10px] bg-sakura-50 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-300 px-2 py-0.5 rounded-md whitespace-nowrap font-medium">
        {{ formatDate(file.lastModified) }}
      </span>
      
      <!-- Word Count -->
      <span v-if="wordCount > 0" class="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        {{ formatNumber(wordCount) }}
      </span>
      
      <!-- Like Count -->
      <span v-if="likeCount > 0" class="text-[10px] bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-md flex items-center gap-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        {{ likeCount }}
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

const props = defineProps<{
  file: FileNode
  isActive?: boolean
  showPath?: boolean
  lang?: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'like'): void
}>()

const articleStore = useArticleStore()

const isLiked = computed(() => articleStore.isLiked(props.file.path))
const isFavorite = computed(() => articleStore.isFavorite(props.file.path))
const likeCount = computed(() => articleStore.getLikes(props.file.path))

// Calculate word count from content
const wordCount = computed(() => {
  if (!props.file.content) return 0
  // Count Chinese characters and English words
  const chineseChars = (props.file.content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (props.file.content.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
})

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

const toggleLike = () => {
  articleStore.toggleLike(props.file.path)
  emit('like')
}
</script>
