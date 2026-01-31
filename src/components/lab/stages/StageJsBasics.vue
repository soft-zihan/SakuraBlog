<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="js-basics" />

    <section class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-5 border border-yellow-100 dark:border-yellow-800/30">
        <div class="flex items-start gap-3">
          <div class="text-2xl">⚙️</div>
          <div class="flex-1">
            <div class="font-bold text-gray-800 dark:text-gray-100">
              {{ isZh ? 'JS 学到哪里算“会了”' : 'What “knowing JS basics” means here' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ isZh
                ? '不是背语法，而是能把“用户操作 → 事件 → 状态变化 → UI 更新”串起来。本项目里最典型的是：搜索、侧边栏筛选、设置面板等交互。'
                : 'Not memorizing syntax—connecting “user action → event → state → UI update”. In this project: search, sidebar filters, settings.' }}
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-yellow-200 dark:border-yellow-800/40 text-yellow-800 dark:text-yellow-200 font-bold hover:opacity-90"
                @click="openLabNote('/notes/VUE学习笔记/2、JavaScript.md')"
              >
                {{ isZh ? '打开：笔记2（JavaScript）' : 'Open: Note 2 (JavaScript)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/composables/useSearch.ts', 'useSearch')"
              >
                {{ isZh ? '对照：useSearch（数组方法/异步）' : 'Compare: useSearch (arrays/async)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/stores/appStore.ts', 'useAppStore')"
              >
                {{ isZh ? '对照：appStore（对象/函数/持久化）' : 'Compare: appStore (objects/functions)' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <LabJsBasics :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '掌握了 JS 基础，接下来学习异步与网络请求。' : 'Ready for async and networking?'"
      @next="emit('navigate', 'js-advanced')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NextStageGuide from '../NextStageGuide.vue'
import StageLearningGuide from './StageLearningGuide.vue'
import LabJsBasics from '../stage2-js-basics/LabJsBasics.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')

const openLabNote = (path: string) => {
  window.dispatchEvent(new CustomEvent('sakura:open-lab-note', { detail: { path } }))
}

const openCode = (path: string, token?: string) => {
  const raw = (token || '').trim()
  const isLineRange = !!raw && /^L?\d+(-L?\d+)?$/i.test(raw)
  const isFind = raw.toLowerCase().startsWith('find:')
  const range = isLineRange ? raw : undefined
  const anchor = !isLineRange && !isFind && raw ? raw : undefined
  const find = isFind ? raw.slice('find:'.length).trim() : undefined
  window.dispatchEvent(new CustomEvent('sakura-open-code', { detail: { path, range, anchor, find } }))
}
</script>
