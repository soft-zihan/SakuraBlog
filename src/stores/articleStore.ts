import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Generate simple fingerprint for duplicate detection
function generateFingerprint(): string {
  const nav = navigator
  const screen = window.screen
  const data = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset()
  ].join('|')
  
  // Simple hash
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export interface ArticleMeta {
  path: string
  likes: number
  views: number
  wordCount?: number
  lineCount?: number
}

export const useArticleStore = defineStore('article', () => {
  // User's liked articles (paths)
  const likedArticles = ref<string[]>([])
  
  // User's favorite/bookmarked articles
  const favorites = ref<string[]>([])
  
  // Local article stats (likes count per article)
  const articleStats = ref<Record<string, { likes: number }>>({})
  
  // User fingerprint for preventing duplicate likes
  const userFingerprint = ref('')
  
  // Liked fingerprints per article to prevent duplicate
  const likeFingerprints = ref<Record<string, string[]>>({})
  
  // Tag 筛选相关
  const availableTags = ref<string[]>(['notag']) // 可用的 tag 列表，notag 表示无 tag 文章
  const selectedTags = ref<string[]>(['notag']) // 选中的 tag 列表，默认全选
  const showFavoritesOnly = ref(false) // 是否仅显示收藏
  
  // Computed
  const likedCount = computed(() => likedArticles.value.length)
  const favoritesCount = computed(() => favorites.value.length)
  
  // Actions
  function initFingerprint() {
    if (!userFingerprint.value) {
      userFingerprint.value = generateFingerprint()
    }
  }
  
  function isLiked(path: string): boolean {
    return likedArticles.value.includes(path)
  }
  
  function isFavorite(path: string): boolean {
    return favorites.value.includes(path)
  }
  
  function getLikes(path: string): number {
    return articleStats.value[path]?.likes || 0
  }
  
  function toggleLike(path: string): boolean {
    initFingerprint()
    
    const fingerprints = likeFingerprints.value[path] || []
    
    if (likedArticles.value.includes(path)) {
      // Unlike
      const idx = likedArticles.value.indexOf(path)
      if (idx > -1) {
        likedArticles.value.splice(idx, 1)
      }
      
      // Update stats
      if (articleStats.value[path]) {
        articleStats.value[path].likes = Math.max(0, articleStats.value[path].likes - 1)
      }
      
      // Remove fingerprint
      const fpIdx = fingerprints.indexOf(userFingerprint.value)
      if (fpIdx > -1) {
        fingerprints.splice(fpIdx, 1)
        likeFingerprints.value[path] = fingerprints
      }
      
      return false
    } else {
      // Check if this fingerprint already liked (prevent abuse)
      if (fingerprints.includes(userFingerprint.value)) {
        // Already liked by this fingerprint, don't count again
        if (!likedArticles.value.includes(path)) {
          likedArticles.value.push(path)
        }
        return true
      }
      
      // Like
      likedArticles.value.push(path)
      
      // Update stats
      if (!articleStats.value[path]) {
        articleStats.value[path] = { likes: 0 }
      }
      articleStats.value[path].likes++
      
      // Record fingerprint
      fingerprints.push(userFingerprint.value)
      likeFingerprints.value[path] = fingerprints
      
      return true
    }
  }
  
  function toggleFavorite(path: string): boolean {
    const idx = favorites.value.indexOf(path)
    if (idx > -1) {
      favorites.value.splice(idx, 1)
      return false
    } else {
      favorites.value.push(path)
      return true
    }
  }
  
  function getFavoriteArticles(): string[] {
    return [...favorites.value]
  }
  
  // Tag 筛选相关方法
  function setAvailableTags(tags: string[]) {
    // 确保 notag 始终在最前面
    const uniqueTags = [...new Set(['notag', ...tags])]
    availableTags.value = uniqueTags
    // 默认全选
    if (selectedTags.value.length === 1 && selectedTags.value[0] === 'notag') {
      selectedTags.value = [...uniqueTags]
    }
  }
  
  function toggleTag(tag: string) {
    const idx = selectedTags.value.indexOf(tag)
    if (idx > -1) {
      // 使用不可变更新确保响应性
      selectedTags.value = selectedTags.value.filter((_, i) => i !== idx)
    } else {
      selectedTags.value = [...selectedTags.value, tag]
    }
  }
  
  function selectAllTags() {
    selectedTags.value = [...availableTags.value]
  }
  
  function deselectAllTags() {
    selectedTags.value = []
  }
  
  function isTagSelected(tag: string): boolean {
    return selectedTags.value.includes(tag)
  }
  
  function toggleShowFavoritesOnly() {
    showFavoritesOnly.value = !showFavoritesOnly.value
  }
  
  // For Umami stats cache
  const umamiCache = ref<Record<string, { views: number; visitors: number; timestamp: number }>>({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  
  function getCachedStats(path: string) {
    const cached = umamiCache.value[path]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return { views: cached.views, visitors: cached.visitors }
    }
    return null
  }
  
  function setCachedStats(path: string, views: number, visitors: number) {
    umamiCache.value[path] = { views, visitors, timestamp: Date.now() }
  }
  
  return {
    // State
    likedArticles,
    favorites,
    articleStats,
    userFingerprint,
    availableTags,
    selectedTags,
    showFavoritesOnly,
    // Computed
    likedCount,
    favoritesCount,
    // Actions
    initFingerprint,
    isLiked,
    isFavorite,
    getLikes,
    toggleLike,
    toggleFavorite,
    getFavoriteArticles,
    setAvailableTags,
    toggleTag,
    selectAllTags,
    deselectAllTags,
    isTagSelected,
    toggleShowFavoritesOnly,
    getCachedStats,
    setCachedStats
  }
}, {
  persist: {
    pick: ['likedArticles', 'favorites', 'articleStats', 'likeFingerprints', 'userFingerprint', 'selectedTags', 'showFavoritesOnly']
  }
})
