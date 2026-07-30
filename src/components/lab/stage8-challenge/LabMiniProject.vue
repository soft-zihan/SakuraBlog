<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-[var(--primary-100)] dark:border-gray-700 shadow-xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-300 text-sm mb-4">
        <span>🏆</span>
        <span>{{ isZh ? '迷你项目挑战' : 'Mini Project Challenge' }}</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ isZh ? '复刻 Sakura Notes 功能' : 'Replicate Sakura Notes Features' }}
      </h2>
      <p class="text-gray-500 text-sm">
        {{ isZh ? '综合运用所学，动手实现真实功能' : 'Apply what you learned, implement real features' }}
      </p>
    </div>

    <!-- Challenge Selection -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button 
        v-for="challenge in challenges" 
        :key="challenge.id"
        @click="selectChallenge(challenge.id)"
        class="p-4 rounded-xl border-2 transition-all text-left"
        :class="selectedChallenge === challenge.id 
          ? 'border-[var(--primary-400)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
      >
        <div class="text-2xl mb-2">{{ challenge.icon }}</div>
        <div class="font-bold text-gray-800 dark:text-gray-100 text-sm">{{ challenge.title }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ challenge.difficulty }}</div>
        <div class="flex gap-1 mt-2">
          <span 
            v-for="tag in challenge.tags" 
            :key="tag"
            class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            {{ tag }}
          </span>
        </div>
      </button>
    </div>

    <!-- Challenge Content -->
    <div v-if="currentChallenge" class="space-y-6">
      <!-- Challenge Info -->
      <div class="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6">
        <div class="flex items-start gap-4">
          <div class="text-4xl">{{ currentChallenge.icon }}</div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">
              {{ currentChallenge.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ currentChallenge.description }}
            </p>
            
            <!-- Requirements -->
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4">
              <div class="font-bold text-sm text-gray-700 dark:text-gray-300 mb-2">
                {{ isZh ? '📋 任务要求' : '📋 Requirements' }}
              </div>
              <ul class="space-y-2">
                <li 
                  v-for="(req, index) in currentChallenge.requirements" 
                  :key="index"
                  class="flex items-start gap-2 text-sm"
                >
                  <input 
                    type="checkbox" 
                    :checked="completedReqs.includes(index)"
                    @change="toggleReq(index)"
                    class="mt-1 rounded"
                  >
                  <span :class="completedReqs.includes(index) ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'">
                    {{ req }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress -->
      <div class="flex items-center gap-4">
        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            class="bg-gradient-to-r from-[var(--primary-400)] to-orange-400 h-3 rounded-full transition-all duration-500"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <span class="text-sm font-bold text-gray-600 dark:text-gray-400">{{ progressPercent }}%</span>
      </div>

      <!-- Hints & Reference Code -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Hints -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div class="flex items-center justify-between mb-3">
            <span class="font-bold text-blue-700 dark:text-blue-300 text-sm">💡 {{ isZh ? '提示' : 'Hints' }}</span>
            <button 
              @click="showHints = !showHints"
              class="text-xs text-blue-500 hover:underline"
            >
              {{ showHints ? (isZh ? '隐藏' : 'Hide') : (isZh ? '显示' : 'Show') }}
            </button>
          </div>
          <div v-if="showHints" class="space-y-2">
            <div 
              v-for="(hint, index) in currentChallenge.hints" 
              :key="index"
              class="text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2"
            >
              {{ index + 1 }}. {{ hint }}
            </div>
          </div>
        </div>

        <!-- Reference Files -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div class="font-bold text-green-700 dark:text-green-300 text-sm mb-3">📁 {{ isZh ? '参考文件' : 'Reference Files' }}</div>
          <div class="space-y-2">
            <div 
              v-for="file in currentChallenge.referenceFiles" 
              :key="file"
              class="text-sm text-green-800 dark:text-green-200 font-mono bg-green-100 dark:bg-green-900/40 rounded-lg px-3 py-2 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
              @click="showReference(file)"
            >
              📄 {{ file }}
            </div>
          </div>
        </div>
      </div>

      <!-- Starter Code -->
      <div class="bg-gray-900 rounded-xl overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 bg-gray-800">
          <span class="text-gray-300 text-sm font-mono">{{ isZh ? '起始代码' : 'Starter Code' }}</span>
          <button 
            @click="copyCode"
            class="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {{ copied ? '✅ Copied!' : '📋 Copy' }}
          </button>
        </div>
        <div class="p-4 overflow-x-auto">
          <pre class="text-sm text-gray-100 font-mono"><code>{{ currentChallenge.starterCode }}</code></pre>
        </div>
      </div>

      <!-- Solution (Expandable) -->
      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <button 
          @click="showSolution = !showSolution"
          class="w-full flex items-center justify-between px-4 py-3"
        >
          <span class="font-bold text-purple-700 dark:text-purple-300 text-sm">
            🔐 {{ isZh ? '参考答案' : 'Reference Solution' }}
          </span>
          <span class="text-purple-500">{{ showSolution ? '▼' : '▶' }}</span>
        </button>
        <div v-if="showSolution" class="px-4 pb-4">
          <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre class="text-sm text-gray-100 font-mono"><code>{{ currentChallenge.solution }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { I18N } from '../../../constants'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const t = computed(() => I18N[props.lang])
const isZh = computed(() => props.lang === 'zh')

const selectedChallenge = ref('theme')
const completedReqs = ref<number[]>([])
const showHints = ref(false)
const showSolution = ref(false)
const copied = ref(false)

const challenges = computed(() => [
  {
    id: 'theme',
    icon: '🌓',
    title: isZh.value ? '主题切换器' : 'Theme Toggler',
    difficulty: isZh.value ? '⭐ 入门' : '⭐ Beginner',
    tags: ['ref', 'computed', 'localStorage']
  },
  {
    id: 'search',
    icon: '🔍',
    title: isZh.value ? '搜索功能' : 'Search Feature',
    difficulty: isZh.value ? '⭐⭐ 进阶' : '⭐⭐ Intermediate',
    tags: ['composable', 'async', 'MiniSearch']
  },
  {
    id: 'filetree',
    icon: '📁',
    title: isZh.value ? '文件树组件' : 'File Tree Component',
    difficulty: isZh.value ? '⭐⭐⭐ 高级' : '⭐⭐⭐ Advanced',
    tags: ['recursive', 'props', 'emit']
  }
])

const challengeDetails = computed(() => ({
  theme: {
    icon: '🌓',
    title: isZh.value ? '挑战1：主题切换器' : 'Challenge 1: Theme Toggler',
    description: isZh.value 
      ? '实现一个主题切换功能，支持亮色/暗色模式，并持久化用户选择。'
      : 'Implement a theme toggle feature with light/dark mode support and persist user preference.',
    requirements: isZh.value ? [
      '创建一个 isDark ref 变量追踪主题状态',
      '实现 toggleTheme 函数切换主题',
      '使用 watch 将主题保存到 localStorage',
      '页面加载时从 localStorage 读取主题',
      '应用 Tailwind dark 类到根元素'
    ] : [
      'Create an isDark ref variable to track theme state',
      'Implement toggleTheme function to switch theme',
      'Use watch to save theme to localStorage',
      'Load theme from localStorage on page load',
      'Apply Tailwind dark class to root element'
    ],
    hints: isZh.value ? [
      '使用 ref(false) 初始化主题状态',
      'localStorage.setItem/getItem 用于持久化',
      'document.documentElement.classList 用于添加/移除 dark 类',
      'watch(isDark, ...) 可以监听变化并自动保存'
    ] : [
      'Use ref(false) to initialize theme state',
      'Use localStorage.setItem/getItem for persistence',
      'Use document.documentElement.classList to add/remove dark class',
      'watch(isDark, ...) can observe changes and auto-save'
    ],
    referenceFiles: ['stores/appStore.ts', 'App.vue'],
    starterCode: `<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// TODO: 创建主题状态
const isDark = ref(false)

// TODO: 实现主题切换函数
const toggleTheme = () => {
  // 你的代码
}

// TODO: 监听主题变化，保存到 localStorage
watch(isDark, (newValue) => {
  // 你的代码
})

// TODO: 组件挂载时加载保存的主题
onMounted(() => {
  // 你的代码
})
<\/script>

<template>
  <button @click="toggleTheme">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>`,
    solution: `<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// 创建主题状态
const isDark = ref(false)

// 实现主题切换函数
const toggleTheme = () => {
  isDark.value = !isDark.value
}

// 监听主题变化，保存到 localStorage 并更新 DOM
watch(isDark, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
  
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

// 组件挂载时加载保存的主题
onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  
  // 初始化 DOM 状态
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})
<\/script>

<template>
  <button 
    @click="toggleTheme"
    class="p-2 rounded-lg transition-colors"
    :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"
  >
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>`
  },
  search: {
    icon: '🔍',
    title: isZh.value ? '挑战2：搜索功能' : 'Challenge 2: Search Feature',
    description: isZh.value 
      ? '实现一个简单的搜索 Composable，支持关键词过滤。'
      : 'Implement a simple search Composable with keyword filtering.',
    requirements: isZh.value ? [
      '创建 useSearch composable 函数',
      '定义 searchQuery ref 存储搜索词',
      '实现 computed 过滤搜索结果',
      '支持防抖处理避免频繁搜索',
      '返回响应式的搜索状态和方法'
    ] : [
      'Create useSearch composable function',
      'Define searchQuery ref to store search term',
      'Implement computed to filter search results',
      'Add debounce to prevent frequent searches',
      'Return reactive search state and methods'
    ],
    hints: isZh.value ? [
      'Composable 是一个返回响应式状态的函数',
      '使用 computed 实现过滤逻辑',
      '可以用 setTimeout + clearTimeout 实现简单防抖',
      '记得返回 { searchQuery, results, ... }'
    ] : [
      'A Composable is a function that returns reactive state',
      'Use computed to implement filter logic',
      'Use setTimeout + clearTimeout for simple debounce',
      'Remember to return { searchQuery, results, ... }'
    ],
    referenceFiles: ['composables/useSearch.ts'],
    starterCode: `// useSearch.ts
import { ref, computed, watch } from 'vue'

interface Item {
  id: number
  title: string
  content: string
}

export function useSearch(items: Item[]) {
  // TODO: 搜索词
  const searchQuery = ref('')
  
  // TODO: 搜索结果（computed）
  const results = computed(() => {
    // 过滤逻辑
  })
  
  // TODO: 是否有结果
  const hasResults = computed(() => {
    // 你的代码
  })
  
  return {
    searchQuery,
    results,
    hasResults
  }
}`,
    solution: `// useSearch.ts
import { ref, computed, watch } from 'vue'

interface Item {
  id: number
  title: string
  content: string
}

export function useSearch(items: Item[]) {
  // 搜索词
  const searchQuery = ref('')
  
  // 防抖后的搜索词
  const debouncedQuery = ref('')
  let debounceTimer: number | null = null
  
  // 监听输入，添加防抖
  watch(searchQuery, (newQuery) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = newQuery
    }, 300)
  })
  
  // 搜索结果
  const results = computed(() => {
    const query = debouncedQuery.value.toLowerCase().trim()
    if (!query) return items
    
    return items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    )
  })
  
  // 是否有结果
  const hasResults = computed(() => results.value.length > 0)
  
  // 清空搜索
  const clearSearch = () => {
    searchQuery.value = ''
    debouncedQuery.value = ''
  }
  
  return {
    searchQuery,
    results,
    hasResults,
    clearSearch
  }
}`
  },
  filetree: {
    icon: '📁',
    title: isZh.value ? '挑战3：文件树组件' : 'Challenge 3: File Tree Component',
    description: isZh.value 
      ? '实现一个递归的文件树组件，支持展开/折叠和文件选择。'
      : 'Implement a recursive file tree component with expand/collapse and file selection.',
    requirements: isZh.value ? [
      '定义 FileNode 类型（name, type, children）',
      '使用递归组件渲染嵌套结构',
      '实现文件夹展开/折叠功能',
      '点击文件时触发选择事件',
      '使用 Props 传递数据，Emit 传递事件'
    ] : [
      'Define FileNode type (name, type, children)',
      'Use recursive component to render nested structure',
      'Implement folder expand/collapse',
      'Emit select event when file is clicked',
      'Use Props for data, Emit for events'
    ],
    hints: isZh.value ? [
      '递归组件需要给自己一个 name',
      '使用 v-if 控制子节点显示',
      '展开状态可以用 Set 或数组存储',
      'emit 可以向上冒泡传递到父组件'
    ] : [
      'Recursive component needs a name',
      'Use v-if to control children visibility',
      'Expanded state can use Set or array',
      'emit can bubble up to parent component'
    ],
    referenceFiles: ['components/FileTree.vue', 'types.ts'],
    starterCode: `<script setup lang="ts">
// 文件节点类型
interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

const props = defineProps<{
  nodes: FileNode[]
  expandedFolders: string[]
}>()

const emit = defineEmits<{
  'toggle': [path: string]
  'select': [file: FileNode]
}>()

// TODO: 处理节点点击
const handleClick = (node: FileNode) => {
  // 你的代码
}

// TODO: 判断文件夹是否展开
const isExpanded = (path: string) => {
  // 你的代码
}
<\/script>

<template>
  <ul class="pl-4">
    <li v-for="node in nodes" :key="node.name">
      <!-- TODO: 渲染节点 -->
    </li>
  </ul>
</template>`,
    solution: `<script setup lang="ts">
interface FileNode {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileNode[]
}

const props = defineProps<{
  nodes: FileNode[]
  expandedFolders: string[]
}>()

const emit = defineEmits<{
  'toggle': [path: string]
  'select': [file: FileNode]
}>()

const handleClick = (node: FileNode) => {
  if (node.type === 'folder') {
    emit('toggle', node.path)
  } else {
    emit('select', node)
  }
}

const isExpanded = (path: string) => {
  return props.expandedFolders.includes(path)
}
<\/script>

<template>
  <ul class="space-y-1">
    <li v-for="node in nodes" :key="node.path">
      <div 
        @click="handleClick(node)"
        class="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span v-if="node.type === 'folder'">
          {{ isExpanded(node.path) ? '📂' : '📁' }}
        </span>
        <span v-else>📄</span>
        <span class="text-sm">{{ node.name }}</span>
      </div>
      
      <!-- 递归渲染子节点 -->
      <FileTree
        v-if="node.children && isExpanded(node.path)"
        :nodes="node.children"
        :expanded-folders="expandedFolders"
        @toggle="emit('toggle', $event)"
        @select="emit('select', $event)"
        class="ml-4"
      />
    </li>
  </ul>
</template>`
  }
}))

const currentChallenge = computed(() => challengeDetails.value[selectedChallenge.value as keyof typeof challengeDetails.value])

const progressPercent = computed(() => {
  if (!currentChallenge.value) return 0
  const total = currentChallenge.value.requirements.length
  return Math.round((completedReqs.value.length / total) * 100)
})

const selectChallenge = (id: string) => {
  selectedChallenge.value = id
  completedReqs.value = []
  showHints.value = false
  showSolution.value = false
}

const toggleReq = (index: number) => {
  const idx = completedReqs.value.indexOf(index)
  if (idx === -1) {
    completedReqs.value.push(index)
  } else {
    completedReqs.value.splice(idx, 1)
  }
}

const showReference = (file: string) => {
  // In real implementation, this would open the file or show its content
  alert(`View reference: ${file}`)
}

const copyCode = async () => {
  if (currentChallenge.value) {
    await navigator.clipboard.writeText(currentChallenge.value.starterCode)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
