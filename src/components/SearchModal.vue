<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="showSearchModal" 
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
        @click.self="emit('close')"
        @keydown.esc="emit('close')"
      >
        <!-- Backdrop - clickable to close -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" @click="emit('close')"></div>
        
        <!-- Search Box -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
          
          <!-- Search Input -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <svg class="w-5 h-5 text-[var(--primary-500)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              ref="searchInput"
              v-model="query"
              type="text"
              :placeholder="t.search_placeholder"
              class="flex-1 text-lg bg-transparent border-0 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
              @input="handleSearch"
              @keydown.enter="selectResult"
              @keydown.up.prevent="navigateResults(-1)"
              @keydown.down.prevent="navigateResults(1)"
              @focus="onSearchFocus"
              autofocus
            />
            <!-- Loading indicator on the right -->
            <div v-if="isLoading" class="animate-spin text-xl mr-2">🌸</div>
            <kbd class="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">ESC</kbd>
          </div>
          
          <!-- Results -->
          <div class="max-h-[50vh] overflow-y-auto">
            <!-- Loading -->
            <div v-if="isSearching" class="flex items-center justify-center py-12">
              <div class="animate-spin text-3xl">🌸</div>
            </div>
            
            <!-- Results List -->
            <div v-else-if="results.length > 0" class="py-2">
              <div 
                v-for="(result, idx) in results" 
                :key="result.id"
                @click="selectResultAtIndex(idx)"
                @mouseenter="selectedIndex = idx"
                class="px-5 py-3 cursor-pointer transition-colors"
                :class="selectedIndex === idx 
                  ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'"
              >
                <div class="flex items-center gap-3">
                  <span class="text-xl">📝</span>
                  <div class="flex-1 min-w-0">
                    <div 
                      class="font-bold text-gray-800 dark:text-gray-100 truncate"
                      v-html="highlightText(result.name, query)"
                    ></div>
                    <div 
                      class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1"
                      v-html="highlightText(result.excerpt, query)"
                    ></div>
                  </div>
                  <svg v-if="selectedIndex === idx" class="w-4 h-4 text-[var(--primary-500)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else-if="query && !isSearching" class="py-12 text-center">
              <div class="text-4xl mb-3">🔍</div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ lang === 'zh' ? '未找到相关内容' : 'No results found' }}
              </div>
              <div class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {{ lang === 'zh' ? '试试其他关键词' : 'Try different keywords' }}
              </div>
            </div>
            
            <!-- Initial State -->
            <div v-else class="py-12 text-center">
              <div class="text-4xl mb-3">🌸</div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ lang === 'zh' ? '输入关键词搜索笔记' : 'Search notes by keyword' }}
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center justify-center gap-2">
                <kbd class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                <kbd class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd>
                {{ lang === 'zh' ? '导航' : 'Navigate' }}
                <kbd class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd>
                {{ lang === 'zh' ? '选择' : 'Select' }}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">⌘</kbd>
                <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">K</kbd>
                {{ lang === 'zh' ? '打开搜索' : 'Open search' }}
              </span>
            </div>
            <span>
              {{ results.length }} {{ lang === 'zh' ? '个结果' : 'results' }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import type { SearchResult } from '../composables/useSearch'
import { sanitizeHtml } from '../utils/sanitize'

const props = defineProps<{
  showSearchModal: boolean
  t: any
  lang: 'en' | 'zh'
  searchFn: (query: string) => SearchResult[]
  highlightFn: (text: string, query: string) => string
  isLoadingContent?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', payload: { result: SearchResult; query: string }): void
}>()

const searchInput = ref<HTMLInputElement | null>(null)
const query = ref('')
const results = ref<SearchResult[]>([])
const selectedIndex = ref(0)
const isSearching = ref(false)
const isLoading = ref(false)
const searchDebounceTimer = ref<number | null>(null)

const onSearchFocus = () => {
  // 内容已在初始化时加载，无需额外处理
}

const handleSearch = () => {
  if (searchDebounceTimer.value != null) {
    window.clearTimeout(searchDebounceTimer.value)
    searchDebounceTimer.value = null
  }

  searchDebounceTimer.value = window.setTimeout(() => {
    if (query.value.trim()) {
      isSearching.value = true
      results.value = props.searchFn(query.value)
      isSearching.value = false
      selectedIndex.value = 0
    } else {
      results.value = []
    }
  }, 120)
}

const highlightText = (text: string, q: string): string => {
  return sanitizeHtml(props.highlightFn(text, q))
}

const navigateResults = (direction: number) => {
  if (results.value.length === 0) return
  
  selectedIndex.value += direction
  if (selectedIndex.value < 0) selectedIndex.value = results.value.length - 1
  if (selectedIndex.value >= results.value.length) selectedIndex.value = 0
}

const selectResult = () => {
  if (results.value.length > 0 && selectedIndex.value >= 0) {
    emit('select', { result: results.value[selectedIndex.value], query: query.value })
    emit('close')
    query.value = ''
    results.value = []
  }
}

const selectResultAtIndex = (idx: number) => {
  selectedIndex.value = idx
  selectResult()
}

// Focus input when modal opens
watch(() => props.showSearchModal, (show) => {
  if (show) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    if (searchDebounceTimer.value != null) {
      window.clearTimeout(searchDebounceTimer.value)
      searchDebounceTimer.value = null
    }
    query.value = ''
    results.value = []
    selectedIndex.value = 0
  }
})

watch(
  () => props.isLoadingContent,
  (v) => {
    isLoading.value = !!v
  },
  { immediate: true }
)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateY(-20px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
