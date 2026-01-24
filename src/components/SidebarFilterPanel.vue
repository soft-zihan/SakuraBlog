<template>
  <div class="px-2 mb-4">
    <div class="mb-3">
      <div class="flex flex-wrap gap-1.5 items-center">
        <button
          @click="articleStore.toggleShowFavoritesOnly()"
          class="px-2 py-1 text-xs rounded-full transition-all flex items-center gap-1.5"
          :class="articleStore.showFavoritesOnly
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/30'"
        >
          <span>{{ articleStore.showFavoritesOnly ? '★' : '☆' }}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-gray-800/60 text-amber-600 dark:text-amber-300">
            {{ articleStore.favoritesCount }}
          </span>
        </button>
        <template v-for="tag in articleStore.availableTags" :key="tag">
          <label v-if="tag === 'notag'" class="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              class="h-3.5 w-3.5 rounded border-gray-300"
              :checked="allTagsSelected"
              @change="toggleAllTags"
            />
          </label>
          <button
            @click="articleStore.toggleTag(tag)"
            class="px-2 py-1 text-xs rounded-full transition-all flex items-center gap-1.5"
            :class="articleStore.isTagSelected(tag)
              ? 'text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-900)]/30'"
            :style="articleStore.isTagSelected(tag) ? { backgroundColor: 'var(--primary-500)' } : {}"
          >
            <span>{{ tag === 'notag' ? (lang === 'zh' ? '无标签' : 'No Tag') : tag }}</span>
            <span
              class="text-[10px] px-1.5 py-0.5 rounded-full"
              :class="articleStore.isTagSelected(tag) ? 'bg-white/20 text-white' : 'bg-white/70 dark:bg-gray-800/60 text-gray-500 dark:text-gray-300'"
            >
              {{ tagCounts[tag] || 0 }}
            </span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FileNode } from '../types'
import { NodeType } from '../types'
import { useArticleStore } from '../stores/articleStore'
import { extractTagsFromFile } from '../composables/useArticleMeta'

const props = defineProps<{
  lang: string
  fileSystem: FileNode[]
}>()

const articleStore = useArticleStore()

const allTagsSelected = computed(() => {
  const total = articleStore.availableTags.length
  return total > 0 && articleStore.selectedTags.length === total
})

const toggleAllTags = () => {
  if (allTagsSelected.value) {
    articleStore.deselectAllTags()
  } else {
    articleStore.selectAllTags()
  }
}

const tagCounts = computed(() => {
  const counts: Record<string, number> = {}
  const langRoot = props.fileSystem?.find((node) => node.name === props.lang)
  const walk = (nodes: FileNode[]) => {
    for (const node of nodes) {
      if (node.type === NodeType.FILE) {
        const tags = extractTagsFromFile(node)
        if (tags.length === 0) {
          counts.notag = (counts.notag || 0) + 1
        } else {
          for (const tag of tags) {
            counts[tag] = (counts[tag] || 0) + 1
          }
        }
      } else if (node.children) {
        walk(node.children)
      }
    }
  }
  if (langRoot?.children) walk(langRoot.children)
  return counts
})
</script>
