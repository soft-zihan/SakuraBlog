<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="css-layout" />

    <section class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/30">
        <div class="flex items-start gap-3">
          <div class="text-2xl">🧵</div>
          <div class="flex-1">
            <div class="font-bold text-gray-800 dark:text-gray-100">
              {{ isZh ? '先把 CSS 原理吃透，再去理解 Tailwind' : 'Understand CSS first, then Tailwind makes sense' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ isZh
                ? '本项目使用 Tailwind CDN（在 src/index.html 里配置），页面样式主要来自“工具类 + 少量手写 CSS”。所以本 Stage 会先讲 CSS 基础与布局，再把它映射成 Tailwind 类名。'
                : 'This project uses Tailwind via CDN (configured in src/index.html). Styling is “utilities + a bit of custom CSS”. This stage teaches CSS fundamentals first, then maps them to Tailwind utilities.' }}
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-200 font-bold hover:opacity-90"
                @click="openLabNote('/notes/VUE学习笔记/1、HTML-CSS.md')"
              >
                {{ isZh ? '打开：笔记1（CSS 部分）' : 'Open: Note 1 (CSS section)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/index.html', 'find:tailwindcss')"
              >
                {{ isZh ? '对照：Tailwind CDN 配置' : 'Compare: Tailwind CDN config' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/styles/app.css', 'find:scroll-margin-top')"
              >
                {{ isZh ? '对照：自定义 CSS（app.css）' : 'Compare: custom CSS (app.css)' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
          💡 {{ isZh ? 'CSS 负责「穿衣打扮」。通过选择器、属性值的组合，我们可以精确控制每个元素的外观。' : `CSS handles the "styling". Through selectors and property values, we can precisely control each element's appearance.` }}
        </p>
      </div>
      <LabCssBasics :lang="lang" />
    </section>

    <section>
      <LabCssLayout :lang="lang" />
    </section>

    <section class="max-w-4xl mx-auto px-4">
      <details class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 p-5">
        <summary class="cursor-pointer font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '扩展：CSS 动画与性能（可选）' : 'Extras: CSS Animation & Performance (optional)' }}
        </summary>
        <div class="mt-5 space-y-12">
          <LabCssAnimation :lang="lang" />
          <LabCssPerformance :lang="lang" />
        </div>
      </details>
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '布局搞定！现在进入 JavaScript 的世界。' : 'Layout done! Now enter the world of JavaScript.'"
      @next="emit('navigate', 'js-basics')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NextStageGuide from '../NextStageGuide.vue'
import StageLearningGuide from './StageLearningGuide.vue'
import LabCssBasics from '../stage3-css/LabCssBasics.vue'
import LabCssLayout from '../stage3-css/LabCssLayout.vue'
import LabCssAnimation from '../stage3-css/LabCssAnimation.vue'
import LabCssPerformance from '../stage3-css/LabCssPerformance.vue'

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
