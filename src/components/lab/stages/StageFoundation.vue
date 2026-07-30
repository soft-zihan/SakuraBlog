<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="foundation" />

    <section class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-orange-50 to-sakura-50 dark:from-orange-900/20 dark:to-[var(--primary-900)]/20 rounded-2xl p-5 border border-orange-100 dark:border-orange-800/30">
        <div class="flex items-start gap-3">
          <div class="text-2xl">📚</div>
          <div class="flex-1">
            <div class="font-bold text-gray-800 dark:text-gray-100">
              {{ isZh ? '先读笔记，再做实验（推荐）' : 'Read the note first, then do the labs (recommended)' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ isZh ? '主线材料来自 VUE 学习笔记 1：HTML & CSS。读完“网页骨架/标签/语义化/表单”后，再回来看本 Stage 的可视化组件，会更不迷路。' : 'The main narrative is in Vue Notes #1 (HTML & CSS). Read it first, then come back to these interactive labs.' }}
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-orange-200 dark:border-orange-800/40 text-orange-700 dark:text-orange-200 font-bold hover:opacity-90"
                @click="openLabNote('/notes/VUE学习笔记/1、HTML-CSS.md')"
              >
                {{ isZh ? '打开：笔记1（HTML & CSS）' : 'Open: Note 1 (HTML & CSS)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/index.html', 'find:<!DOCTYPE html')"
              >
                {{ isZh ? '对照源码：src/index.html（网页骨架）' : 'Compare: src/index.html (skeleton)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/App.vue', 'template')"
              >
                {{ isZh ? '对照源码：App.vue（页面结构）' : 'Compare: App.vue (layout)' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto">
      <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-[var(--primary-100)] dark:border-gray-700 shadow-xl relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>

        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_standards_title }}</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t.lab_standards_desc }}</p>
        </div>

        <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div
            class="w-48 h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative transition-all duration-500"
            :class="{'border-[var(--primary-400)] dark:border-[var(--primary-500)] shadow-lg shadow-[var(--primary-500)]/20': standards.css}"
          >
            <div v-if="standards.css" class="absolute inset-2 bg-gradient-to-br from-[var(--primary-100)] to-purple-100 dark:from-[var(--primary-900)]/50 dark:to-purple-900/50 rounded-xl transition-all duration-500"></div>
            <div v-if="standards.html" class="relative z-10 text-6xl transition-all duration-500" :class="{'animate-bounce': standards.js}">
              <span v-if="!standards.css">🦴</span>
              <span v-else>🤵</span>
            </div>
            <div v-else class="text-gray-300 dark:text-gray-700 text-sm font-mono text-center px-4">
              &lt;div&gt;<br>Empty<br>&lt;/div&gt;
            </div>
            <div v-if="standards.js" class="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
            <div v-if="standards.js" class="absolute -left-4 -bottom-4 text-2xl animate-spin">⚙️</div>
          </div>

          <div class="flex flex-col gap-3 w-full md:w-auto">
            <button
              @click="standards.html = !standards.html"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
              :class="standards.html ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'"
            >
              <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-lg">H</div>
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_html }}</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_html }}</div>
              </div>
              <div class="ml-auto">
                <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-orange-500 border-orange-500': standards.html}"></div>
              </div>
            </button>

            <button
              @click="standards.css = !standards.css"
              :disabled="!standards.html"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
              :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.css ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']"
            >
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">C</div>
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_css }}</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_css }}</div>
              </div>
              <div class="ml-auto">
                <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-blue-500 border-blue-500': standards.css}"></div>
              </div>
            </button>

            <button
              @click="standards.js = !standards.js"
              :disabled="!standards.html"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
              :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.js ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']"
            >
              <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 font-bold text-lg">J</div>
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_js }}</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_js }}</div>
              </div>
              <div class="ml-auto">
                <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-yellow-500 border-yellow-500': standards.js}"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
          💡 {{ isZh ? '理解了 Web 标准后，我们来深入学习 HTML——网页的「骨架」。HTML 使用标签来描述页面结构，每个标签都有特定的语义含义。' : `After understanding web standards, let's dive into HTML — the "skeleton" of web pages. HTML uses tags to describe page structure, each with specific semantic meaning.` }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧱</span> {{ t.lab_html_title }}
      </h2>
      <LabHtml :lang="lang" />
    </section>

    <section>
      <LabHtmlSemantic :lang="lang" />
    </section>

    <section>
      <LabHtmlBasics :lang="lang" />
    </section>

    <section class="max-w-4xl mx-auto px-4">
      <details class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 p-5">
        <summary class="cursor-pointer font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '扩展：浏览器解析与代码演进（可选）' : 'Extras: browser pipeline & code evolution (optional)' }}
        </summary>
        <div class="mt-5 space-y-12">
          <LabCodeEvolution :lang="lang" />
          <LabBrowserPipeline :lang="lang" />
        </div>
      </details>
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '你已经理解了网页的基本结构！接下来深入学习 CSS 布局。' : 'You understand web structure! Next, dive into CSS layout.'"
      @next="emit('navigate', 'css-layout')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { I18N } from '../../../constants'
import NextStageGuide from '../NextStageGuide.vue'
import StageLearningGuide from './StageLearningGuide.vue'
import LabHtml from '../stage1-foundation/LabHtml.vue'
import LabHtmlBasics from '../stage1-foundation/LabHtmlBasics.vue'
import LabHtmlSemantic from '../stage1-foundation/LabHtmlSemantic.vue'
import LabCodeEvolution from '../stage1-foundation/LabCodeEvolution.vue'
import LabBrowserPipeline from '../stage1-foundation/LabBrowserPipeline.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const t = computed(() => I18N[lang.value])
const isZh = computed(() => lang.value === 'zh')

const standards = reactive({
  html: true,
  css: false,
  js: false
})

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
