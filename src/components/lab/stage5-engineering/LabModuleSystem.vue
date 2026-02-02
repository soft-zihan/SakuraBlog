<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-purple-200 dark:border-purple-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">📦</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '模块化系统' : 'Module System' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '对比 ESM 与 CommonJS 的导入导出方式。' : 'Compare ESM and CommonJS import/export.' }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        v-for="mode in modes"
        :key="mode.id"
        @click="active = mode.id"
        class="px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="active === mode.id ? 'bg-purple-500 text-white' : 'bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-300'"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
        <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ current.title }}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ current.desc }}</p>
        <ul class="text-xs text-gray-500 space-y-2">
          <li>• {{ current.tip1 }}</li>
          <li>• {{ current.tip2 }}</li>
          <li>• {{ current.tip3 }}</li>
        </ul>
      </div>
      <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
        <pre>{{ current.code }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

const modes = computed<{ id: 'esm' | 'cjs'; label: string }[]>(() => [
  { id: 'esm', label: 'ESM' },
  { id: 'cjs', label: 'CommonJS' }
])

const active = ref<'esm' | 'cjs'>('esm')

const current = computed(() => {
  if (active.value === 'cjs') {
    return {
      title: isZh.value ? 'CommonJS（Node.js）' : 'CommonJS (Node.js)',
      desc: isZh.value ? '使用 require 与 module.exports。' : 'Uses require and module.exports.',
      tip1: isZh.value ? '运行时加载' : 'Runtime loading',
      tip2: isZh.value ? '适合 Node.js 生态' : 'Great for Node.js ecosystem',
      tip3: isZh.value ? '导出一个对象' : 'Exports an object',
      code: `const utils = require('./utils')\n\nfunction sum(a, b) {\n  return a + b\n}\n\nmodule.exports = { sum }`
    }
  }

  return {
    title: isZh.value ? 'ESM（现代浏览器）' : 'ESM (Modern Browsers)',
    desc: isZh.value ? '使用 import/export 语法。' : 'Uses import/export syntax.',
    tip1: isZh.value ? '静态分析，支持 Tree-shaking' : 'Static analysis & tree-shaking',
    tip2: isZh.value ? '可直接在浏览器使用' : 'Browser-ready',
    tip3: isZh.value ? '支持异步加载' : 'Async loading supported',
    code: `import { sum } from './utils.js'\n\nexport function multiply(a, b) {\n  return a * b\n}\n\nexport default { sum, multiply }`
  }
})
</script>
