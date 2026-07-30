<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-red-200 dark:border-red-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">📚</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'NPM 包管理' : 'NPM Package Management' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '动手创建 package.json 依赖列表。' : 'Build a package.json dependency list.' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '添加依赖' : 'Add dependency' }}</h4>
          <div class="flex gap-2">
            <input
              v-model="depName"
              type="text"
              class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              :placeholder="isZh ? '包名，例如 vue' : 'Package name, e.g. vue'"
            />
            <input
              v-model="depVersion"
              type="text"
              class="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              placeholder="^1.0.0"
            />
            <button
              @click="addDependency"
              class="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-bold"
            >
              {{ isZh ? '添加' : 'Add' }}
            </button>
          </div>
        </div>

        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '依赖列表' : 'Dependencies' }}</h4>
          <div v-if="deps.length === 0" class="text-xs text-gray-400">{{ isZh ? '暂无依赖' : 'No dependencies' }}</div>
          <ul v-else class="space-y-2">
            <li v-for="dep in deps" :key="dep.name" class="flex items-center justify-between text-sm">
              <span class="font-mono text-gray-600 dark:text-gray-300">{{ dep.name }}</span>
              <span class="text-gray-500">{{ dep.version }}</span>
              <button @click="removeDependency(dep.name)" class="text-red-500 text-xs">{{ isZh ? '移除' : 'Remove' }}</button>
            </li>
          </ul>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
        <pre>{{ packageJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

const deps = ref<Array<{ name: string; version: string }>>([
  { name: 'vue', version: '^3.4.0' },
  { name: 'vite', version: '^5.0.0' }
])

const depName = ref('')
const depVersion = ref('^1.0.0')

const addDependency = () => {
  const name = depName.value.trim()
  if (!name) return
  const existing = deps.value.find(d => d.name === name)
  if (existing) {
    existing.version = depVersion.value.trim() || '^1.0.0'
  } else {
    deps.value.push({ name, version: depVersion.value.trim() || '^1.0.0' })
  }
  depName.value = ''
}

const removeDependency = (name: string) => {
  deps.value = deps.value.filter(d => d.name !== name)
}

const packageJson = computed(() => {
  const depMap: Record<string, string> = {}
  deps.value.forEach(dep => {
    depMap[dep.name] = dep.version
  })
  return JSON.stringify({
    name: 'sakura-notes',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: depMap
  }, null, 2)
})
</script>
