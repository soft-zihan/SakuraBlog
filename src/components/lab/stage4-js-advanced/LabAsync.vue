<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-sakura-100 dark:border-gray-700 shadow-xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-700 dark:text-yellow-300 text-sm mb-4">
        <span>⚡</span>
        <span>{{ isZh ? '异步编程' : 'Async Programming' }}</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ isZh ? 'Promise 与 async/await' : 'Promise & async/await' }}
      </h2>
      <p class="text-gray-500 text-sm">
        {{ isZh ? '学习异步编程，理解 Sakura Notes 如何加载文件' : 'Learn async programming, understand how Sakura Notes loads files' }}
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8">
      <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex gap-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-600 text-yellow-600 dark:text-yellow-300 shadow' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="min-h-[400px]">
      
      <!-- Promise Basics -->
      <div v-if="activeTab === 'promise'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🎰 Promise 状态机' : '🎰 Promise State Machine' }}
          </h3>
          
          <!-- Promise State Visualization -->
          <div class="flex justify-center items-center gap-4 mb-6">
            <div 
              class="w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-500"
              :class="{
                'bg-gray-200 dark:bg-gray-700': promiseState === 'pending',
                'bg-green-200 dark:bg-green-900/50': promiseState === 'fulfilled',
                'bg-red-200 dark:bg-red-900/50': promiseState === 'rejected'
              }"
            >
              <span class="text-3xl">{{ promiseState === 'pending' ? '⏳' : promiseState === 'fulfilled' ? '✅' : '❌' }}</span>
              <span class="text-xs font-mono mt-1">{{ promiseState }}</span>
            </div>
            <div class="text-2xl">→</div>
            <div class="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 text-center">
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ isZh ? '结果' : 'Result' }}</div>
              <div class="font-mono text-sm">{{ promiseResult || '...' }}</div>
            </div>
          </div>

          <div class="flex justify-center gap-3">
            <button 
              @click="simulatePromise('success')"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-all"
              :disabled="promiseState === 'pending'"
            >
              {{ isZh ? '模拟成功' : 'Simulate Success' }}
            </button>
            <button 
              @click="simulatePromise('fail')"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
              :disabled="promiseState === 'pending'"
            >
              {{ isZh ? '模拟失败' : 'Simulate Failure' }}
            </button>
            <button 
              @click="resetPromise"
              class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-all"
            >
              {{ isZh ? '重置' : 'Reset' }}
            </button>
          </div>
        </div>

        <!-- Code Example -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-gray-400">📍 Promise {{ isZh ? '基础语法' : 'Basic Syntax' }}</span>
          </div>
          <pre class="text-sm text-gray-100 font-mono"><code>{{ promiseCode }}</code></pre>
        </div>
      </div>

      <!-- async/await -->
      <div v-else-if="activeTab === 'async'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🚀 async/await 执行流程' : '🚀 async/await Execution Flow' }}
          </h3>

          <!-- Execution Steps -->
          <div class="space-y-3 mb-6">
            <div 
              v-for="(step, index) in asyncSteps" 
              :key="index"
              class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
              :class="currentAsyncStep >= index ? 'bg-white dark:bg-gray-700 shadow' : 'bg-gray-100 dark:bg-gray-800 opacity-50'"
            >
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                :class="currentAsyncStep >= index ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-800 dark:text-gray-100 text-sm">{{ step.title }}</div>
                <div class="text-xs text-gray-500">{{ step.desc }}</div>
              </div>
              <div v-if="currentAsyncStep === index && asyncRunning" class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div v-else-if="currentAsyncStep > index" class="text-green-500">✓</div>
            </div>
          </div>

          <div class="flex justify-center gap-3">
            <button 
              @click="runAsyncDemo"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
              :disabled="asyncRunning"
            >
              {{ asyncRunning ? (isZh ? '执行中...' : 'Running...') : (isZh ? '运行 async 函数' : 'Run async function') }}
            </button>
            <button 
              @click="resetAsyncDemo"
              class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-all"
            >
              {{ isZh ? '重置' : 'Reset' }}
            </button>
          </div>
        </div>

        <!-- Sakura Notes Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-green-400">📍 composables/useFile.ts</span>
            <span class="text-xs text-gray-500">{{ isZh ? '本站文件加载函数' : 'Site file loading function' }}</span>
          </div>
          <pre class="text-sm text-gray-100 font-mono"><code>{{ asyncCode }}</code></pre>
        </div>
      </div>

      <!-- Error Handling -->
      <div v-else-if="activeTab === 'error'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🛡️ 错误处理模式' : '🛡️ Error Handling Patterns' }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- try-catch -->
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 border-green-300 dark:border-green-700">
              <div class="text-green-600 dark:text-green-400 font-bold mb-2">✅ try-catch ({{ isZh ? '推荐' : 'Recommended' }})</div>
              <pre class="text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto"><code>try {
  const data = await fetch(url)
  return await data.json()
} catch (error) {
  console.error('Failed:', error)
  return null
}</code></pre>
            </div>

            <!-- .catch() -->
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 border-blue-300 dark:border-blue-700">
              <div class="text-blue-600 dark:text-blue-400 font-bold mb-2">🔗 .catch() {{ isZh ? '链式' : 'Chain' }}</div>
              <pre class="text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto"><code>fetch(url)
  .then(res => res.json())
  .catch(err => {
    console.error(err)
    return null
  })</code></pre>
            </div>
          </div>
        </div>

        <!-- Live Error Demo -->
        <div class="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🧪 模拟网络请求' : '🧪 Simulate Network Request' }}
          </h4>
          
          <div class="flex gap-3 mb-4">
            <input 
              v-model="testUrl"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              :placeholder="isZh ? '输入URL测试' : 'Enter URL to test'"
            >
            <button 
              @click="testFetch"
              class="px-4 py-2 bg-sakura-500 hover:bg-sakura-600 text-white rounded-lg text-sm transition-all"
              :disabled="fetchLoading"
            >
              {{ fetchLoading ? '...' : 'Fetch' }}
            </button>
          </div>

          <div 
            v-if="fetchResult"
            class="p-4 rounded-lg text-sm font-mono"
            :class="fetchResult.success ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'"
          >
            <div class="font-bold mb-1">{{ fetchResult.success ? '✅ Success' : '❌ Error' }}</div>
            <div class="text-xs opacity-80">{{ fetchResult.message }}</div>
          </div>
        </div>
      </div>

      <!-- Real Code Analysis -->
      <div v-else-if="activeTab === 'real'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '📁 Sakura Notes 异步代码剖析' : '📁 Sakura Notes Async Code Analysis' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {{ isZh ? '本站多处使用异步操作，以下是核心示例：' : 'This site uses async operations in many places. Here are the core examples:' }}
          </p>
        </div>

        <!-- Code Examples -->
        <div class="space-y-4">
          <div v-for="(example, index) in realCodeExamples" :key="index" class="bg-gray-900 rounded-xl overflow-hidden">
            <div 
              class="flex items-center justify-between px-4 py-3 bg-gray-800 cursor-pointer"
              @click="example.expanded = !example.expanded"
            >
              <div class="flex items-center gap-2">
                <span class="text-green-400">📍</span>
                <span class="text-gray-300 text-sm font-mono">{{ example.file }}</span>
                <span class="text-gray-500 text-xs">{{ example.desc }}</span>
              </div>
              <span class="text-gray-400">{{ example.expanded ? '▼' : '▶' }}</span>
            </div>
            <div v-if="example.expanded" class="p-4 overflow-x-auto">
              <pre class="text-sm text-gray-100 font-mono"><code>{{ example.code }}</code></pre>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { I18N } from '../../../constants'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const t = computed(() => I18N[props.lang])
const isZh = computed(() => props.lang === 'zh')

const activeTab = ref('promise')
const tabs = computed(() => [
  { id: 'promise', icon: '🎰', label: 'Promise' },
  { id: 'async', icon: '🚀', label: 'async/await' },
  { id: 'error', icon: '🛡️', label: isZh.value ? '错误处理' : 'Error Handling' },
  { id: 'real', icon: '📁', label: isZh.value ? '本站代码' : 'Site Code' }
])

// Promise Demo
const promiseState = ref<'pending' | 'fulfilled' | 'rejected'>('pending')
const promiseResult = ref('')

const simulatePromise = (type: 'success' | 'fail') => {
  promiseState.value = 'pending'
  promiseResult.value = ''
  
  setTimeout(() => {
    if (type === 'success') {
      promiseState.value = 'fulfilled'
      promiseResult.value = '{ data: "Hello!" }'
    } else {
      promiseState.value = 'rejected'
      promiseResult.value = 'Error: Network failed'
    }
  }, 1500)
}

const resetPromise = () => {
  promiseState.value = 'pending'
  promiseResult.value = ''
}

const promiseCode = computed(() => isZh.value ? `// Promise 三种状态
const promise = new Promise((resolve, reject) => {
  // pending 状态
  setTimeout(() => {
    if (成功) {
      resolve({ data: "Hello!" })  // → fulfilled
    } else {
      reject(new Error("失败"))    // → rejected
    }
  }, 1000)
})

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))` : `// Promise Three States
const promise = new Promise((resolve, reject) => {
  // pending state
  setTimeout(() => {
    if (success) {
      resolve({ data: "Hello!" })  // → fulfilled
    } else {
      reject(new Error("Failed"))  // → rejected
    }
  }, 1000)
})

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))`)

// Async Demo
const asyncSteps = computed(() => isZh.value ? [
  { title: '调用 async 函数', desc: '函数开始执行' },
  { title: '遇到 await', desc: '暂停执行，等待 Promise' },
  { title: 'Promise 完成', desc: '获取结果，继续执行' },
  { title: '返回结果', desc: '函数执行完毕' }
] : [
  { title: 'Call async function', desc: 'Function starts executing' },
  { title: 'Encounter await', desc: 'Pause and wait for Promise' },
  { title: 'Promise resolves', desc: 'Get result, continue' },
  { title: 'Return result', desc: 'Function completes' }
])

const currentAsyncStep = ref(-1)
const asyncRunning = ref(false)

const runAsyncDemo = async () => {
  asyncRunning.value = true
  currentAsyncStep.value = 0
  
  await new Promise(r => setTimeout(r, 800))
  currentAsyncStep.value = 1
  
  await new Promise(r => setTimeout(r, 1200))
  currentAsyncStep.value = 2
  
  await new Promise(r => setTimeout(r, 800))
  currentAsyncStep.value = 3
  
  await new Promise(r => setTimeout(r, 500))
  asyncRunning.value = false
}

const resetAsyncDemo = () => {
  currentAsyncStep.value = -1
  asyncRunning.value = false
}

const asyncCode = computed(() => `// 📍 composables/useFile.ts
const fetchFileContent = async (file: FileNode): Promise<string> => {
  let fetchPath = ''
  if (file.isSource && file.fetchPath) {
    fetchPath = \`./\${file.fetchPath}\`
  } else {
    fetchPath = \`./notes/\${file.path}\`
  }
  
  try {
    const res = await fetch(fetchPath)  // ← await 等待网络请求
    
    if (res.ok) return await res.text() // ← await 等待读取响应
    return \`# Error \${res.status}\\nCould not load file.\`
  } catch (e: any) {
    return \`# Error\\n\${e.message}\`     // ← 捕获网络错误
  }
}`)

// Error Handling Demo
const testUrl = ref('./public/files.json')
const fetchLoading = ref(false)
const fetchResult = ref<{ success: boolean; message: string } | null>(null)

const testFetch = async () => {
  fetchLoading.value = true
  fetchResult.value = null
  
  try {
    const res = await fetch(testUrl.value)
    if (res.ok) {
      const text = await res.text()
      fetchResult.value = { 
        success: true, 
        message: `Status: ${res.status}, Size: ${text.length} bytes` 
      }
    } else {
      fetchResult.value = { 
        success: false, 
        message: `HTTP Error: ${res.status} ${res.statusText}` 
      }
    }
  } catch (e: any) {
    fetchResult.value = { 
      success: false, 
      message: `Network Error: ${e.message}` 
    }
  }
  
  fetchLoading.value = false
}

// Real Code Examples
const realCodeExamples = reactive([
  {
    file: 'composables/useSearch.ts',
    desc: isZh.value ? '搜索索引初始化' : 'Search index init',
    expanded: true,
    code: `// 搜索功能：异步加载和索引文件
const initSearchIndex = async () => {
  if (searchIndexReady.value) return
  
  const flatten = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = []
    for (const node of nodes) {
      if (node.type === NodeType.FILE) files.push(node)
      else if (node.children) files = files.concat(flatten(node.children))
    }
    return files
  }
  
  const files = flatten(fileSystem.value)
  
  // 并行加载所有文件内容
  const documents = await Promise.all(
    files.map(async (file) => {
      const content = await fetchFileFn(file)  // ← 异步获取文件
      return { id: file.path, title: file.name, content }
    })
  )
  
  miniSearch.addAll(documents)
  searchIndexReady.value = true
}`
  },
  {
    file: 'composables/useWallpapers.ts',
    desc: isZh.value ? '壁纸列表加载' : 'Wallpaper list loading',
    expanded: false,
    code: `// 壁纸管理：异步加载壁纸配置
export function useWallpapers() {
  const wallpapers = ref<WallpaperList>({ light: [], dark: [] })
  
  const loadWallpapers = async () => {
    try {
      const res = await fetch('./wallpapers.json')
      if (res.ok) {
        wallpapers.value = await res.json()
      }
    } catch (e) {
      console.error('Failed to load wallpapers:', e)
    }
  }
  
  onMounted(() => {
    loadWallpapers()  // ← 组件挂载时异步加载
  })
  
  return { wallpapers, loadWallpapers }
}`
  },
  {
    file: 'composables/useGitHubPublish.ts',
    desc: isZh.value ? 'GitHub API 调用' : 'GitHub API calls',
    expanded: false,
    code: `// GitHub 发布：多个异步操作串联
const publishToGitHub = async (content: string, path: string) => {
  // 1. 获取当前文件 SHA（如果存在）
  const sha = await getFileSha(path)
  
  // 2. 创建或更新文件
  const response = await fetch(\`\${GITHUB_API}/contents/\${path}\`, {
    method: 'PUT',
    headers: {
      'Authorization': \`token \${token}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: \`Update \${path}\`,
      content: btoa(content),
      sha  // 更新时需要提供旧文件的 SHA
    })
  })
  
  if (!response.ok) {
    throw new Error(\`GitHub API Error: \${response.status}\`)
  }
  
  return await response.json()
}`
  }
])
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
