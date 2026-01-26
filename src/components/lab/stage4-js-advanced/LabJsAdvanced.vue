<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-sakura-100 dark:border-gray-700 shadow-xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-300 text-sm mb-4">
        <span>🧠</span>
        <span>{{ isZh ? 'JavaScript 进阶' : 'JavaScript Advanced' }}</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ isZh ? '闭包、作用域与 this' : 'Closures, Scope & this' }}
      </h2>
      <p class="text-gray-500 text-sm">
        {{ isZh ? '深入理解 JavaScript 核心机制' : 'Deep dive into JavaScript core mechanics' }}
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8">
      <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex gap-1 flex-wrap justify-center">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-300 shadow' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="min-h-[400px]">
      
      <!-- Scope -->
      <div v-if="activeTab === 'scope'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🎯 作用域链可视化' : '🎯 Scope Chain Visualization' }}
          </h3>
          
          <!-- Scope Visualization -->
          <div class="flex justify-center mb-6">
            <div class="space-y-3">
              <!-- Global Scope -->
              <div class="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 min-w-[300px]">
                <div class="text-xs text-red-600 dark:text-red-400 font-bold mb-2">🌐 Global Scope</div>
                <div class="font-mono text-sm">
                  <div>const app = <span class="text-blue-600">'Sakura Notes'</span></div>
                  <div>const isDark = <span class="text-purple-600">ref(false)</span></div>
                </div>
                
                <!-- Function Scope -->
                <div class="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4 mt-3">
                  <div class="text-xs text-yellow-600 dark:text-yellow-400 font-bold mb-2">📦 Function Scope: useSearch()</div>
                  <div class="font-mono text-sm">
                    <div>const searchQuery = <span class="text-purple-600">ref('')</span></div>
                    <div>const miniSearch = <span class="text-green-600">new MiniSearch()</span></div>
                  </div>
                  
                  <!-- Block Scope -->
                  <div class="bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-xl p-4 mt-3">
                    <div class="text-xs text-green-600 dark:text-green-400 font-bold mb-2">📎 Block Scope: if/for</div>
                    <div class="font-mono text-sm">
                      <div>const result = <span class="text-orange-600">miniSearch.search(query)</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center text-sm text-gray-500">
            {{ isZh ? '内层作用域可以访问外层变量，但外层无法访问内层' : 'Inner scope can access outer variables, but not vice versa' }}
          </div>
        </div>

        <!-- Code Example -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-green-400">📍 composables/useSearch.ts</span>
          </div>
          <pre class="text-sm text-gray-100 font-mono"><code>{{ scopeCode }}</code></pre>
        </div>
      </div>

      <!-- Closure -->
      <div v-else-if="activeTab === 'closure'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🔒 闭包：函数记住创建时的环境' : '🔒 Closure: Function Remembers Its Birth Environment' }}
          </h3>
          
          <!-- Closure Demo -->
          <div class="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 w-full md:w-auto">
              <div class="text-sm text-gray-500 mb-2">{{ isZh ? '闭包计数器演示' : 'Closure Counter Demo' }}</div>
              <div class="text-4xl font-bold text-center text-sakura-500 mb-4">{{ closureCount }}</div>
              <div class="flex gap-2 justify-center">
                <button @click="closureIncrement" class="px-3 py-1 bg-green-500 text-white rounded text-sm">+1</button>
                <button @click="closureDecrement" class="px-3 py-1 bg-red-500 text-white rounded text-sm">-1</button>
                <button @click="closureReset" class="px-3 py-1 bg-gray-500 text-white rounded text-sm">Reset</button>
              </div>
            </div>

            <div class="text-gray-400 text-2xl hidden md:block">→</div>

            <div class="bg-gray-800 rounded-xl p-4 text-sm font-mono text-gray-100 w-full md:w-auto">
              <div class="text-green-400 text-xs mb-2">// {{ isZh ? '闭包保持对 count 的引用' : 'Closure keeps reference to count' }}</div>
              <div><span class="text-purple-400">function</span> createCounter() {'{'}</div>
              <div class="pl-4"><span class="text-blue-400">let</span> count = <span class="text-orange-400">0</span></div>
              <div class="pl-4"><span class="text-purple-400">return</span> {'{'}</div>
              <div class="pl-8">increment: () => ++count,</div>
              <div class="pl-8">decrement: () => --count,</div>
              <div class="pl-8">get: () => count</div>
              <div class="pl-4">{'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>

        <!-- Sakura Notes Example -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-green-400">📍 App.vue {{ isZh ? '事件回调中的闭包' : 'Closures in event callbacks' }}</span>
          </div>
          <pre class="text-sm text-gray-100 font-mono"><code>{{ closureCode }}</code></pre>
        </div>
      </div>

      <!-- this Binding -->
      <div v-else-if="activeTab === 'this'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '👆 this 指向诊断器' : '👆 this Binding Diagnostic' }}
          </h3>
          
          <!-- this Examples -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="example in thisExamples" 
              :key="example.id"
              class="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 transition-all cursor-pointer"
              :class="selectedThis === example.id ? 'border-orange-400' : 'border-gray-200 dark:border-gray-600'"
              @click="selectedThis = example.id"
            >
              <div class="font-bold text-sm text-gray-800 dark:text-gray-100 mb-2">{{ example.title }}</div>
              <div class="font-mono text-xs text-gray-600 dark:text-gray-400 mb-2">{{ example.code }}</div>
              <div class="text-xs">
                <span class="text-gray-500">this →</span>
                <span class="text-orange-500 font-bold ml-1">{{ example.thisValue }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Arrow vs Regular -->
        <div class="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '箭头函数 vs 普通函数' : 'Arrow Function vs Regular Function' }}
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div class="text-green-600 font-bold text-sm mb-2">✅ {{ isZh ? '箭头函数（推荐）' : 'Arrow Function (Recommended)' }}</div>
              <div class="font-mono text-xs bg-gray-800 text-gray-100 rounded p-2">
                <div>const handler = () => {'{'}</div>
                <div class="pl-4 text-green-400">// this = {{ isZh ? '定义时的上下文' : 'context when defined' }}</div>
                <div class="pl-4">sidebarOpen.value = false</div>
                <div>{'}'}</div>
              </div>
            </div>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
              <div class="text-red-600 font-bold text-sm mb-2">⚠️ {{ isZh ? '普通函数（需注意）' : 'Regular Function (Be Careful)' }}</div>
              <div class="font-mono text-xs bg-gray-800 text-gray-100 rounded p-2">
                <div>function handler() {'{'}</div>
                <div class="pl-4 text-red-400">// this = {{ isZh ? '调用时决定' : 'determined at call time' }}</div>
                <div class="pl-4">this.sidebarOpen = false // ❓</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <pre class="text-sm text-gray-100 font-mono"><code>{{ thisCode }}</code></pre>
        </div>
      </div>

      <!-- Real Code -->
      <div v-else-if="activeTab === 'real'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '📁 Sakura Notes 中的高级 JS 模式' : '📁 Advanced JS Patterns in Sakura Notes' }}
          </h3>
        </div>

        <!-- Code Examples -->
        <div class="space-y-4">
          <div v-for="(example, index) in realExamples" :key="index" class="bg-gray-900 rounded-xl overflow-hidden">
            <div 
              class="flex items-center justify-between px-4 py-3 bg-gray-800 cursor-pointer"
              @click="example.expanded = !example.expanded"
            >
              <div class="flex items-center gap-2">
                <span class="text-green-400">📍</span>
                <span class="text-gray-300 text-sm font-mono">{{ example.file }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full" :class="example.tagColor">{{ example.tag }}</span>
              </div>
              <span class="text-gray-400">{{ example.expanded ? '▼' : '▶' }}</span>
            </div>
            <div v-if="example.expanded" class="p-4">
              <p class="text-gray-400 text-sm mb-3">{{ example.desc }}</p>
              <pre class="text-sm text-gray-100 font-mono overflow-x-auto"><code>{{ example.code }}</code></pre>
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

const activeTab = ref('scope')
const tabs = computed(() => [
  { id: 'scope', icon: '🎯', label: isZh.value ? '作用域' : 'Scope' },
  { id: 'closure', icon: '🔒', label: isZh.value ? '闭包' : 'Closure' },
  { id: 'this', icon: '👆', label: 'this' },
  { id: 'real', icon: '📁', label: isZh.value ? '实战代码' : 'Real Code' }
])

// Scope Demo
const scopeCode = computed(() => isZh.value ? `// 📍 composables/useSearch.ts - 作用域示例

// 🌐 模块作用域（文件级别）
import MiniSearch from 'minisearch'

export function useSearch(fetchFileFn) {
  // 📦 函数作用域 - 这些变量被"封装"在 useSearch 内部
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const miniSearch = new MiniSearch({...})
  
  const search = async (query: string) => {
    // 📎 块作用域 - result 只在这个函数内可见
    const result = miniSearch.search(query)
    
    // ✅ 可以访问外层的 searchResults
    searchResults.value = result
  }
  
  // 返回公共 API - 控制哪些变量可以被外部访问
  return { searchQuery, searchResults, search }
}

// ❌ 外部无法直接访问 miniSearch（被封装了）` : `// 📍 composables/useSearch.ts - Scope Example

// 🌐 Module Scope (file level)
import MiniSearch from 'minisearch'

export function useSearch(fetchFileFn) {
  // 📦 Function Scope - these variables are "encapsulated"
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const miniSearch = new MiniSearch({...})
  
  const search = async (query: string) => {
    // 📎 Block Scope - result only visible here
    const result = miniSearch.search(query)
    
    // ✅ Can access outer searchResults
    searchResults.value = result
  }
  
  // Return public API - control external access
  return { searchQuery, searchResults, search }
}

// ❌ Cannot access miniSearch from outside`)

// Closure Demo
const closureState = (() => {
  let count = 0
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = 0; return count },
    get: () => count
  }
})()

const closureCount = ref(0)
const closureIncrement = () => { closureCount.value = closureState.increment() }
const closureDecrement = () => { closureCount.value = closureState.decrement() }
const closureReset = () => { closureCount.value = closureState.reset() }

const closureCode = computed(() => isZh.value ? `// 📍 App.vue - 事件处理中的闭包

const sidebarOpen = ref(false)
const currentFile = ref<FileNode | null>(null)

// 这个函数是一个闭包！
// 它"记住"了定义时的 sidebarOpen 和 currentFile
const handleSidebarFileSelect = (file: FileNode) => {
  currentFile.value = file      // ← 访问外部作用域的 currentFile
  sidebarOpen.value = false     // ← 访问外部作用域的 sidebarOpen
}

// 为什么这是闭包？
// 1. handleSidebarFileSelect 是在 setup() 中定义的
// 2. 它引用了 setup() 作用域中的变量
// 3. 当它被调用时（可能是用户点击后很久），
//    它仍然能访问这些变量 - 这就是闭包的"记忆"能力` : `// 📍 App.vue - Closures in Event Handlers

const sidebarOpen = ref(false)
const currentFile = ref<FileNode | null>(null)

// This function is a closure!
// It "remembers" sidebarOpen and currentFile from when it was defined
const handleSidebarFileSelect = (file: FileNode) => {
  currentFile.value = file      // ← Access outer scope's currentFile
  sidebarOpen.value = false     // ← Access outer scope's sidebarOpen
}

// Why is this a closure?
// 1. handleSidebarFileSelect is defined inside setup()
// 2. It references variables from setup()'s scope
// 3. When called later (maybe long after user clicks),
//    it can still access these variables - closure's "memory"`)

// this Demo
const selectedThis = ref('arrow')
const thisExamples = computed(() => [
  {
    id: 'arrow',
    title: isZh.value ? '箭头函数' : 'Arrow Function',
    code: 'const fn = () => this',
    thisValue: isZh.value ? '定义时的上下文 (词法绑定)' : 'Context when defined (lexical)'
  },
  {
    id: 'method',
    title: isZh.value ? '对象方法' : 'Object Method',
    code: 'obj.method()',
    thisValue: isZh.value ? '调用者对象 obj' : 'Caller object obj'
  },
  {
    id: 'global',
    title: isZh.value ? '普通函数调用' : 'Regular Function Call',
    code: 'fn()',
    thisValue: isZh.value ? 'window (非严格) / undefined (严格)' : 'window (non-strict) / undefined (strict)'
  },
  {
    id: 'new',
    title: isZh.value ? 'new 构造调用' : 'new Constructor Call',
    code: 'new Fn()',
    thisValue: isZh.value ? '新创建的实例对象' : 'Newly created instance'
  }
])

const thisCode = computed(() => isZh.value ? `// 📍 Sakura Notes 中为什么大量使用箭头函数？

// ✅ 好：箭头函数保持 this 指向
const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  
  // 箭头函数：this 永远指向定义时的上下文
  const toggleTheme = () => {
    isDark.value = !isDark.value  // ✅ 正确访问
  }
  
  return { isDark, toggleTheme }
})

// ❌ 坏：普通函数会丢失 this
const badStore = {
  isDark: false,
  toggleTheme: function() {
    this.isDark = !this.isDark  // ⚠️ this 可能不是 badStore
  }
}

// 当作为回调传递时：
button.addEventListener('click', badStore.toggleTheme)
// ❌ this 变成了 button 元素，不是 badStore！

// 修复方法：
button.addEventListener('click', () => badStore.toggleTheme())
// 或者
button.addEventListener('click', badStore.toggleTheme.bind(badStore))` : `// 📍 Why Sakura Notes uses arrow functions extensively?

// ✅ Good: Arrow function preserves this binding
const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  
  // Arrow function: this always points to definition context
  const toggleTheme = () => {
    isDark.value = !isDark.value  // ✅ Correct access
  }
  
  return { isDark, toggleTheme }
})

// ❌ Bad: Regular function loses this
const badStore = {
  isDark: false,
  toggleTheme: function() {
    this.isDark = !this.isDark  // ⚠️ this might not be badStore
  }
}

// When passed as callback:
button.addEventListener('click', badStore.toggleTheme)
// ❌ this becomes button element, not badStore!

// Fix:
button.addEventListener('click', () => badStore.toggleTheme())
// or
button.addEventListener('click', badStore.toggleTheme.bind(badStore))`)

// Real Examples
const realExamples = reactive([
  {
    file: 'composables/useContentClick.ts',
    tag: isZh.value ? '闭包' : 'Closure',
    tagColor: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
    desc: isZh.value ? '点击事件处理中的闭包应用' : 'Closure in click event handling',
    expanded: true,
    code: `// useContentClick 返回的函数是一个闭包
export function useContentClick(options: ContentClickOptions) {
  // 这些变量被闭包"捕获"
  const { onImageClick, onLinkClick, onCodeClick } = options
  
  // 返回的 handler 是闭包，它"记住"了 options
  const handleContentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    // 可以访问外层作用域的 onImageClick 等
    if (target.tagName === 'IMG') {
      onImageClick?.(target as HTMLImageElement)
    }
    // ...
  }
  
  return { handleContentClick }
}`
  },
  {
    file: 'stores/musicStore.ts',
    tag: isZh.value ? '作用域封装' : 'Scope Encapsulation',
    tagColor: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
    desc: isZh.value ? '使用函数作用域封装私有状态' : 'Using function scope to encapsulate private state',
    expanded: false,
    code: `export const useMusicStore = defineStore('music', () => {
  // 私有状态 - 只在这个函数作用域内可见
  const audioElement = ref<HTMLAudioElement | null>(null)
  let progressInterval: number | null = null
  
  // 公共状态
  const currentTrack = ref<Track | null>(null)
  const isPlaying = ref(false)
  const volume = ref(0.7)
  
  // 私有方法 - 不会暴露给外部
  const startProgressTracking = () => {
    progressInterval = setInterval(() => {
      if (audioElement.value) {
        currentTime.value = audioElement.value.currentTime
      }
    }, 100)
  }
  
  // 只返回需要公开的 API
  return {
    currentTrack,
    isPlaying,
    volume,
    play,
    pause
    // ❌ 不返回 audioElement, progressInterval
  }
})`
  },
  {
    file: 'components/FileTree.vue',
    tag: 'this',
    tagColor: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300',
    desc: isZh.value ? '递归组件中的 this 处理' : 'this handling in recursive component',
    expanded: false,
    code: `// Vue 3 Composition API 中几乎不需要关心 this
// 因为我们使用的是函数和响应式变量，而不是类实例

// [script setup lang="ts"]
// 所有变量都在函数作用域内，没有 this 的烦恼
const props = defineProps<{
  nodes: FileNode[]
  expandedFolders: string[]
}>()

const emit = defineEmits<{
  'toggle': [path: string]
  'select': [file: FileNode]
}>()

// 箭头函数，无需担心 this
const handleNodeClick = (node: FileNode) => {
  if (node.type === 'directory') {
    emit('toggle', node.path)
  } else {
    emit('select', node)  // ✅ 正常工作
  }
}
// [/script]

// 对比 Vue 2 Options API：
// methods: {
//   handleNodeClick(node) {
//     this.$emit('select', node)  // 需要用 this
//   }
// }`
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
