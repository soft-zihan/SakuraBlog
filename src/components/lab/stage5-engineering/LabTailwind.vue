<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-cyan-200 dark:border-cyan-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🎨</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'TailwindCSS 快速入门' : 'TailwindCSS Quickstart' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '组合工具类构建一个按钮。' : 'Compose utility classes to build a button.' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <label class="text-xs text-gray-500">{{ isZh ? '颜色' : 'Color' }}</label>
          <div class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="color in colors"
              :key="color.id"
              @click="selectedColor = color"
              class="px-3 py-1.5 rounded-lg text-xs font-bold"
              :class="selectedColor.id === color.id ? 'ring-2 ring-cyan-400 ' + color.btn : color.btn"
            >
              {{ color.label }}
            </button>
          </div>
        </div>

        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <label class="text-xs text-gray-500">{{ isZh ? '圆角与阴影' : 'Radius & Shadow' }}</label>
          <div class="flex gap-2 mt-2">
            <button
              v-for="opt in radiusOptions"
              :key="opt.id"
              @click="radius = opt.id"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border"
              :class="radius === opt.id ? 'border-cyan-500 text-cyan-600' : 'border-gray-300 dark:border-gray-600 text-gray-500'"
            >
              {{ opt.label }}
            </button>
            <button
              @click="shadow = !shadow"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border"
              :class="shadow ? 'border-cyan-500 text-cyan-600' : 'border-gray-300 dark:border-gray-600 text-gray-500'"
            >
              {{ isZh ? '阴影' : 'Shadow' }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center gap-4">
        <button :class="previewClass" class="transition-all">
          {{ isZh ? '预览按钮' : 'Preview Button' }}
        </button>
        <div class="text-xs text-gray-500">
          <span class="font-mono">{{ previewClass }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

const colors = [
  { id: 'primary', label: 'Primary', btn: 'bg-[var(--primary-500)] text-white' },
  { id: 'cyan', label: 'Cyan', btn: 'bg-cyan-500 text-white' },
  { id: 'violet', label: 'Violet', btn: 'bg-violet-500 text-white' }
]

const radiusOptions: Array<{ id: 'rounded-md' | 'rounded-xl' | 'rounded-full'; label: string }> = [
  { id: 'rounded-md', label: isZh.value ? '中等' : 'Medium' },
  { id: 'rounded-xl', label: isZh.value ? '大' : 'Large' },
  { id: 'rounded-full', label: isZh.value ? '胶囊' : 'Pill' }
]

const selectedColor = ref(colors[0])
const radius = ref<'rounded-md' | 'rounded-xl' | 'rounded-full'>('rounded-xl')
const shadow = ref(true)

const previewClass = computed(() => {
  const base = 'px-6 py-3 font-bold'
  const shadowClass = shadow.value ? 'shadow-lg' : 'shadow-none'
  return `${base} ${selectedColor.value.btn} ${radius.value} ${shadowClass}`
})
</script>
