<template>
  <div v-if="toc.length > 0">
    <nav
      ref="navRef"
      class="space-y-1 relative border-l-2 pl-4 cursor-pointer select-none"
      :style="tocBorderStyle"
    >
      <div
        v-if="activeHeaderId"
        class="absolute left-[-2px] w-[2px] transition-all duration-300"
        :style="{
          top: activeIndicatorTop + 'px',
          height: activeIndicatorHeight + 'px',
          ...tocIndicatorStyle
        }"
      ></div>
      <a
        v-for="item in toc"
        :key="item.id"
        :ref="(el) => setTocItemRef(el, item.id)"
        :href="`#${item.id}`"
        class="block text-sm py-1.5 transition-all duration-200 leading-tight pr-2"
        :class="[
          item.level === 1 ? 'font-bold mb-2 mt-4' : 'font-normal',
          activeHeaderId === item.id ? 'translate-x-1 font-medium scale-105 origin-left' : ''
        ]"
        :style="{
          ...getTocItemStyle(item),
          marginLeft: item.level > 1 ? `${(item.level - 1) * 0.75}rem` : undefined,
          fontSize: item.level > 1 ? '0.75rem' : undefined
        }"
        @touchstart.stop
        @touchend.stop
        @click.prevent="$emit('select', item.id)"
      >
        {{ item.text }}
      </a>
    </nav>
  </div>
  <div v-else class="text-sm text-gray-500 dark:text-gray-400">
    {{ emptyText }}
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import type { TocItem } from '../types'

const props = defineProps<{
  toc: TocItem[]
  activeHeaderId: string
  emptyText?: string
  autoScroll?: boolean
  scrollContainer?: HTMLElement | null
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

const appStore = useAppStore()

const emptyText = computed(() => props.emptyText || (appStore.lang === 'zh' ? '暂无目录' : 'No TOC'))

const navRef = ref<HTMLElement | null>(null)
const tocItemRefs = ref<Record<string, HTMLElement>>({})

const setTocItemRef = (el: any, id: string) => {
  if (el) tocItemRefs.value[id] = el
}

const activeIndicatorTop = computed(() => {
  if (!props.activeHeaderId) return 0
  const el = tocItemRefs.value[props.activeHeaderId]
  return el ? el.offsetTop : 0
})

const activeIndicatorHeight = computed(() => {
  if (!props.activeHeaderId) return 24
  const el = tocItemRefs.value[props.activeHeaderId]
  return el ? el.offsetHeight : 24
})

const tocBorderStyle = computed(() => ({
  borderColor: appStore.isDark ? 'rgba(255,255,255,0.1)' : 'var(--primary-100)'
}))

const tocIndicatorStyle = computed(() => ({
  backgroundColor: appStore.isDark ? 'var(--primary-400)' : 'var(--primary-500)',
  boxShadow: `0 0 8px ${appStore.isDark ? 'var(--primary-400)' : 'var(--primary-500)'}`
}))

const getTocItemStyle = (item: TocItem) => ({
  color:
    props.activeHeaderId === item.id
      ? appStore.isDark
        ? 'var(--primary-400)'
        : 'var(--primary-600)'
      : appStore.isDark
        ? 'rgba(255,255,255,0.6)'
        : 'var(--primary-800)'
})

const getScrollBehavior = () => {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth'
}

const scrollActiveItemIntoView = (el: HTMLElement) => {
  const container = props.scrollContainer
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const itemRect = el.getBoundingClientRect()
  const margin = 12

  const itemTop = itemRect.top - containerRect.top + container.scrollTop
  const itemBottom = itemTop + itemRect.height

  const viewTop = container.scrollTop
  const viewBottom = viewTop + container.clientHeight

  if (itemTop < viewTop + margin) {
    container.scrollTo({ top: Math.max(0, itemTop - margin), behavior: getScrollBehavior() })
    return
  }
  if (itemBottom > viewBottom - margin) {
    container.scrollTo({
      top: Math.max(0, itemBottom - container.clientHeight + margin),
      behavior: getScrollBehavior()
    })
  }
}

watch(
  () => props.activeHeaderId,
  async (id) => {
    if (!id) return
    if (props.autoScroll === false) return
    await nextTick()
    const el = tocItemRefs.value[id]
    if (el) scrollActiveItemIntoView(el)
  }
)
</script>
