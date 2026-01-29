<template>
  <div
    class="border-b border-gray-100 dark:border-gray-700 bg-black/5 dark:bg-black/30 rounded-xl backdrop-blur-sm"
    :style="{
      padding: 'var(--reader-header-padding, 1.5rem)',
      marginBottom: 'var(--reader-header-margin-bottom, 2rem)',
      paddingBottom: 'var(--reader-header-padding-bottom, 1.5rem)'
    }"
  >
    <div class="flex justify-between items-start gap-4">
      <div class="flex flex-wrap items-center gap-3 flex-1">
        <span v-if="authorName || authorUrl" class="text-sm text-gray-400 flex items-center gap-1">
          <span>👤</span>
          <a
            v-if="authorUrl"
            :href="authorUrl"
            target="_blank"
            rel="noopener"
            class="hover:underline"
            :style="authorLinkStyle"
          >
            {{ authorName || authorUrl }}
          </a>
          <span v-else>{{ authorName }}</span>
        </span>
      </div>
      <span v-if="isSource" class="bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded text-xs font-mono">Read Only</span>
    </div>

    <div class="flex items-center gap-4 mt-4 flex-wrap" v-if="!isSource">
      <button
        @click="onLike"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
        :class="liked ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-50'"
      >
        <span>{{ liked ? '❤️' : '🤍' }}</span>
        <span class="font-bold">{{ likes }}</span>
      </button>

      <button
        @click="onToggleFavorite"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
        :class="favorite ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-amber-50'"
      >
        <span>{{ favorite ? '⭐' : '☆' }}</span>
        <span>{{ favoriteText }}</span>
      </button>

      <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-xl border border-gray-200 dark:border-gray-600"
            :style="{ backgroundColor: backgroundColor || rgbPreviewColor }"
          ></div>
          <div class="text-[10px] text-gray-400 leading-tight">
            <div>RGB</div>
            <div class="font-mono">{{ rValue }} , {{ gValue }} , {{ bValue }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-1 flex-1 min-w-[120px]">
          <div class="flex items-center gap-1">
            <span class="w-3 text-[10px] text-red-500">R</span>
            <input
              type="range"
              min="0"
              max="255"
              :value="rValue"
              @input="onRChange(($event.target as HTMLInputElement).value)"
              class="flex-1 h-1"
            />
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 text-[10px] text-green-500">G</span>
            <input
              type="range"
              min="0"
              max="255"
              :value="gValue"
              @input="onGChange(($event.target as HTMLInputElement).value)"
              class="flex-1 h-1"
            />
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 text-[10px] text-blue-500">B</span>
            <input
              type="range"
              min="0"
              max="255"
              :value="bValue"
              @input="onBChange(($event.target as HTMLInputElement).value)"
              class="flex-1 h-1"
            />
          </div>
        </div>
        <button
          v-if="backgroundColor"
          @click="onResetBackgroundColor"
          class="text-xs text-gray-400 hover:text-red-500"
          :title="lang === 'zh' ? '重置背景色' : 'Reset background color'"
        >
          ✕
        </button>
      </div>

      <span v-if="typeof visitors === 'number'" class="text-xs text-gray-400 flex items-center gap-1">
        <span class="text-sm">👨‍💻</span>
        {{ visitors }} {{ visitorsLabel }}
      </span>

      <span v-if="typeof views === 'number'" class="text-xs text-gray-400 flex items-center gap-1">
        <span class="text-sm">📖</span>
        {{ views }} {{ viewsLabel }}
      </span>

      <button
        v-if="showTocButton"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30"
        @click="onOpenToc"
      >
        <span>📑</span>
        <span>{{ lang === 'zh' ? '目录' : 'TOC' }}</span>
      </button>

      <span class="text-xs text-gray-400 flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 8l-4-4V4a2 2 0 012-2h12a2 2 0 01-2 2H7z"/>
        </svg>
        {{ comments }} {{ commentsLabel }}
      </span>

      <span class="text-xs text-gray-400">📝 {{ wordCount }} {{ wordsLabel }}</span>

      <span class="text-xs text-gray-400 flex items-center gap-1">🕐 {{ updatedLabel }}: {{ updatedDate }}</span>

      <span v-if="tags.length" class="text-xs text-gray-400 flex items-center gap-1">
        🏷️
        <span class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in tags"
            :key="tag"
            class="text-[10px] px-2 py-0.5 rounded-full"
            :style="tagBadgeStyle"
          >
            {{ tag }}
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type LinkStyle = Record<string, string>
type BadgeStyle = Record<string, string>

const props = defineProps<{
  lang: 'en' | 'zh'
  isSource: boolean
  authorName: string
  authorUrl: string
  authorLinkStyle: LinkStyle
  liked: boolean
  likes: number
  onLike: () => void
  favorite: boolean
  favoriteText: string
  onToggleFavorite: () => void
  backgroundColor: string
  onResetBackgroundColor: () => void
  visitors?: number
  visitorsLabel: string
  views?: number
  viewsLabel: string
  comments: number
  commentsLabel: string
  wordCount: number
  wordsLabel: string
  updatedLabel: string
  updatedDate: string
  tags: string[]
  tagBadgeStyle: BadgeStyle
  showTocButton: boolean
  onOpenToc: () => void
}>()

const emit = defineEmits(['update:backgroundColor'])

const rValue = ref(255)
const gValue = ref(255)
const bValue = ref(255)

const clampChannel = (value: number) => {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 255) return 255
  return Math.round(value)
}

const parseColorToRgb = (color: string) => {
  if (!color) {
    return { r: 255, g: 255, b: 255 }
  }
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16)
      const g = parseInt(hex[1] + hex[1], 16)
      const b = parseInt(hex[2] + hex[2], 16)
      if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
        return { r, g, b }
      }
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
        return { r, g, b }
      }
    }
  }
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g)
    if (matches && matches.length >= 3) {
      const r = clampChannel(Number(matches[0]))
      const g = clampChannel(Number(matches[1]))
      const b = clampChannel(Number(matches[2]))
      return { r, g, b }
    }
  }
  return { r: 255, g: 255, b: 255 }
}

const rgbPreviewColor = computed(() => `rgb(${rValue.value}, ${gValue.value}, ${bValue.value})`)

const syncFromBackground = (color: string) => {
  const { r, g, b } = parseColorToRgb(color)
  rValue.value = clampChannel(r)
  gValue.value = clampChannel(g)
  bValue.value = clampChannel(b)
}

watch(
  () => props.backgroundColor,
  (color) => {
    syncFromBackground(color)
  },
  { immediate: true }
)

const emitCurrentColor = () => {
  emit('update:backgroundColor', rgbPreviewColor.value)
}

const onRChange = (value: string) => {
  rValue.value = clampChannel(Number(value))
  emitCurrentColor()
}

const onGChange = (value: string) => {
  gValue.value = clampChannel(Number(value))
  emitCurrentColor()
}

const onBChange = (value: string) => {
  bValue.value = clampChannel(Number(value))
  emitCurrentColor()
}
</script>
