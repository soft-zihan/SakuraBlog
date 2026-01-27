import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { TocItem } from '../types'

export const useArticleNavStore = defineStore('articleNav', () => {
  const toc = ref<TocItem[]>([])
  const activeHeaderId = ref<string>('')
  const pendingScrollToId = ref<string | null>(null)
  const articlePath = ref<string | null>(null)

  const hasToc = computed(() => toc.value.length > 0)

  const setToc = (nextToc: TocItem[], nextArticlePath: string | null) => {
    toc.value = nextToc
    if (articlePath.value !== nextArticlePath) {
      articlePath.value = nextArticlePath
      activeHeaderId.value = ''
      pendingScrollToId.value = null
    }
  }

  const setActiveHeader = (id: string) => {
    activeHeaderId.value = id
  }

  const requestScrollTo = (id: string) => {
    pendingScrollToId.value = id
  }

  const consumePendingScrollTo = () => {
    pendingScrollToId.value = null
  }

  const reset = () => {
    toc.value = []
    activeHeaderId.value = ''
    pendingScrollToId.value = null
    articlePath.value = null
  }

  return {
    toc,
    activeHeaderId,
    pendingScrollToId,
    articlePath,
    hasToc,
    setToc,
    setActiveHeader,
    requestScrollTo,
    consumePendingScrollTo,
    reset
  }
})

