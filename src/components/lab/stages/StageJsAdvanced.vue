<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="js-advanced" />

    <section class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-sky-50 to-green-50 dark:from-sky-900/20 dark:to-green-900/20 rounded-2xl p-5 border border-sky-100 dark:border-sky-800/30">
        <div class="flex items-start gap-3">
          <div class="text-2xl">🧩</div>
          <div class="flex-1">
            <div class="font-bold text-gray-800 dark:text-gray-100">
              {{ isZh ? '把“异步 + 类型”变成生产力' : 'Turn “async + types” into productivity' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ isZh
                ? '这一阶段不是为了炫技，而是为了把复杂交互写得稳定：错误能被捕获、状态可预测、数据结构有边界。'
                : 'This stage focuses on stability: predictable state, proper error handling, and bounded data shapes.' }}
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-200 font-bold hover:opacity-90"
                @click="openLabNote('/notes/VUE学习笔记/2、JavaScript.md')"
              >
                {{ isZh ? '回顾：笔记2（JS 异步/DOM）' : 'Review: Note 2 (Async/DOM)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-200 font-bold hover:opacity-90"
                @click="openLabNote('/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md')"
              >
                {{ isZh ? '主线：笔记4（TS/工程化）' : 'Main: Note 4 (TS/Engineering)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/types.ts', 'find:export enum NodeType')"
              >
                {{ isZh ? '对照：types.ts（类型边界）' : 'Compare: types.ts (type boundary)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/composables/useContentClick.ts', 'parseCodeLink')"
              >
                {{ isZh ? '对照：代码链接解析（异步/健壮性）' : 'Compare: code link parsing (robust async)' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
          💡 {{ isZh ? '变量和函数是编程的基础。理解作用域、闭包等核心概念，能帮助你写出更健壮的代码。' : 'Variables and functions are programming fundamentals. Understanding scope and closures helps write more robust code.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">⚡</span> {{ isZh ? 'JavaScript 核心机制' : 'JavaScript Core Mechanics' }}
      </h2>
      <LabJs :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
          💡 {{ isZh ? 'DOM（文档对象模型）是 JS 与 HTML 的桥梁。通过 DOM API，我们可以动态修改页面内容、样式和结构。' : 'DOM bridges JS and HTML. Through DOM APIs, we can dynamically modify page content, styles, and structure.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
      </h2>
      <LabDom :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧠</span> {{ isZh ? '闭包与作用域' : 'Closures & Scope' }}
      </h2>
      <LabJsAdvanced :lang="lang" />
    </section>

    <section>
      <LabEventLoop />
    </section>

    <section class="max-w-4xl mx-auto">
      <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
        <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
      </h2>
      <LabAjax :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
          💡 {{ isZh ? 'Promise 和 async/await 是处理异步操作的核心。' : 'Promise and async/await are core for async operations.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">⚡</span> {{ isZh ? '异步编程' : 'Async Programming' }}
      </h2>
      <LabAsync :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
          💡 {{ isZh ? 'TypeScript 是 JavaScript 的超集，添加了类型系统。' : 'TypeScript is a superset of JavaScript with a type system.' }}
        </p>
      </div>
      <LabTypeScript :lang="lang" />
    </section>

    <section class="max-w-4xl mx-auto px-4">
      <details class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 p-5">
        <summary class="cursor-pointer font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '扩展：TypeScript 进阶（可选）' : 'Extras: TypeScript Advanced (optional)' }}
        </summary>
        <div class="mt-5">
          <LabTypeScriptAdvanced :lang="lang" />
        </div>
      </details>
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? 'JS 进阶掌握了！下一步：工程化。' : 'JS advanced done! Next: engineering.'"
      @next="emit('navigate', 'engineering')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { I18N } from '../../../constants'
import NextStageGuide from '../NextStageGuide.vue'
import StageLearningGuide from './StageLearningGuide.vue'
import LabJs from '../stage4-js-advanced/LabJs.vue'
import LabDom from '../stage4-js-advanced/LabDom.vue'
import LabJsAdvanced from '../stage4-js-advanced/LabJsAdvanced.vue'
import LabEventLoop from '../stage4-js-advanced/LabEventLoop.vue'
import LabAjax from '../stage4-js-advanced/LabAjax.vue'
import LabAsync from '../stage4-js-advanced/LabAsync.vue'
import LabTypeScript from '../stage4-js-advanced/LabTypeScript.vue'
import LabTypeScriptAdvanced from '../stage4-js-advanced/LabTypeScriptAdvanced.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
const t = computed(() => I18N[lang.value])

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
