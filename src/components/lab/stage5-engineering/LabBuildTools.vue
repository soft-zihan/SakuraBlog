<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-orange-200 dark:border-orange-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">⚙️</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '构建工具（Vite）' : 'Build Tools (Vite)' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '理解开发/生产模式与配置入口。' : 'Understand dev/prod modes and config entry.' }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        v-for="item in modes"
        :key="item.id"
        @click="mode = item.id"
        class="px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="mode === item.id ? 'bg-orange-500 text-white' : 'bg-orange-50 dark:bg-gray-700 text-orange-600 dark:text-orange-300'"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
        <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '常用命令' : 'Common Commands' }}</h4>
        <ul class="text-xs text-gray-500 space-y-2">
          <li>• {{ isZh ? '开发：' : 'Dev:' }} <span class="font-mono">npm run dev</span></li>
          <li>• {{ isZh ? '构建：' : 'Build:' }} <span class="font-mono">npm run build</span></li>
          <li>• {{ isZh ? '预览：' : 'Preview:' }} <span class="font-mono">npm run preview</span></li>
        </ul>
        <div class="mt-4 text-xs text-gray-500">
          {{ isZh ? '当前模式：' : 'Current mode:' }}
          <span class="font-bold text-orange-500">{{ mode }}</span>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
        <pre>{{ configSnippet }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

const modes = computed<{ id: 'development' | 'production'; label: string }[]>(() => [
  { id: 'development', label: isZh.value ? '开发模式' : 'Development' },
  { id: 'production', label: isZh.value ? '生产模式' : 'Production' }
])

const mode = ref<'development' | 'production'>('development')

const configSnippet = computed(() => {
  const base = mode.value === 'production' ? "'/soft-zihan.github.io/'" : "'/'"
  const sourcemap = mode.value === 'production' ? 'false' : 'true'
  return `// vite.config.ts\nimport { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig(({ mode }) => ({\n  plugins: [vue()],\n  base: ${base},\n  build: {\n    sourcemap: ${sourcemap}\n  },\n  define: {\n    __APP_ENV__: JSON.stringify(mode)\n  }\n}))`
})
</script>
