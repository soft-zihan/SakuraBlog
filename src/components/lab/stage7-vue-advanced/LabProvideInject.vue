<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-sakura-100 dark:border-gray-700 shadow-xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-700 dark:text-teal-300 text-sm mb-4">
        <span>💉</span>
        <span>{{ isZh ? '依赖注入' : 'Dependency Injection' }}</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        provide / inject
      </h2>
      <p class="text-gray-500 text-sm">
        {{ isZh ? '跨层级组件通信的优雅方案' : 'Elegant solution for cross-level component communication' }}
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
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-600 text-teal-600 dark:text-teal-300 shadow' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="min-h-[400px]">
      
      <!-- Concept -->
      <div v-if="activeTab === 'concept'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🤔 为什么需要 provide/inject？' : '🤔 Why provide/inject?' }}
          </h3>
          
          <!-- Problem Visualization -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Props Drilling -->
            <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-800">
              <div class="text-red-600 dark:text-red-400 font-bold text-sm mb-3">❌ Props Drilling {{ isZh ? '问题' : 'Problem' }}</div>
              <div class="space-y-2">
                <div class="bg-red-100 dark:bg-red-900/40 rounded p-2 text-xs font-mono">
                  App (theme) → 
                </div>
                <div class="bg-red-100 dark:bg-red-900/40 rounded p-2 text-xs font-mono ml-4">
                  Layout (theme) →
                </div>
                <div class="bg-red-100 dark:bg-red-900/40 rounded p-2 text-xs font-mono ml-8">
                  Sidebar (theme) →
                </div>
                <div class="bg-red-100 dark:bg-red-900/40 rounded p-2 text-xs font-mono ml-12">
                  Button (theme) 😵
                </div>
              </div>
              <div class="text-xs text-red-600 dark:text-red-400 mt-2">
                {{ isZh ? '每层都要传递 props！' : 'Pass props through every level!' }}
              </div>
            </div>

            <!-- provide/inject -->
            <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
              <div class="text-green-600 dark:text-green-400 font-bold text-sm mb-3">✅ provide/inject</div>
              <div class="space-y-2">
                <div class="bg-green-100 dark:bg-green-900/40 rounded p-2 text-xs font-mono">
                  App <span class="text-green-600">provide('theme')</span>
                </div>
                <div class="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs font-mono ml-4 opacity-50">
                  Layout
                </div>
                <div class="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs font-mono ml-8 opacity-50">
                  Sidebar
                </div>
                <div class="bg-green-100 dark:bg-green-900/40 rounded p-2 text-xs font-mono ml-12">
                  Button <span class="text-green-600">inject('theme')</span> ✅
                </div>
              </div>
              <div class="text-xs text-green-600 dark:text-green-400 mt-2">
                {{ isZh ? '直接跨层级获取！' : 'Get directly across levels!' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Basic Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <pre class="text-sm text-gray-100 font-mono"><code>{{ basicCode }}</code></pre>
        </div>
      </div>

      <!-- Interactive Demo -->
      <div v-else-if="activeTab === 'demo'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🎮 交互演示' : '🎮 Interactive Demo' }}
          </h3>
          
          <!-- Simulated Component Tree -->
          <div class="bg-white dark:bg-gray-700 rounded-xl p-4 mb-4">
            <div class="text-sm text-gray-500 mb-2">{{ isZh ? '模拟组件树' : 'Simulated Component Tree' }}</div>
            
            <!-- Parent (Provider) -->
            <div class="border-2 border-purple-300 dark:border-purple-700 rounded-xl p-4 bg-purple-50 dark:bg-purple-900/20">
              <div class="flex items-center justify-between mb-3">
                <span class="font-bold text-purple-700 dark:text-purple-300">🏠 ParentComponent</span>
                <span class="text-xs bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">provide()</span>
              </div>
              
              <div class="flex items-center gap-3 mb-4">
                <span class="text-sm">{{ isZh ? '提供的值:' : 'Provided value:' }}</span>
                <input 
                  v-model="providedValue"
                  class="flex-1 px-3 py-1 border rounded bg-white dark:bg-gray-800 text-sm"
                  :placeholder="isZh ? '输入要提供的值' : 'Enter value to provide'"
                >
                <select v-model="providedTheme" class="px-3 py-1 border rounded bg-white dark:bg-gray-800 text-sm">
                  <option value="light">☀️ Light</option>
                  <option value="dark">🌙 Dark</option>
                </select>
              </div>

              <!-- Middle (no inject) -->
              <div class="border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 ml-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-medium text-gray-700 dark:text-gray-300">📦 MiddleComponent</span>
                  <span class="text-xs text-gray-400">{{ isZh ? '不需要 props' : 'No props needed' }}</span>
                </div>

                <!-- Child (Consumer) -->
                <div class="border-2 border-green-300 dark:border-green-700 rounded-xl p-4 bg-green-50 dark:bg-green-900/20 ml-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-bold text-green-700 dark:text-green-300">🎯 ChildComponent</span>
                    <span class="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded">inject()</span>
                  </div>
                  
                  <div class="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div class="text-sm mb-2">{{ isZh ? '注入的值:' : 'Injected values:' }}</div>
                    <div class="font-mono text-xs space-y-1">
                      <div>message: <span class="text-green-600 dark:text-green-400">"{{ providedValue }}"</span></div>
                      <div>theme: <span class="text-blue-600 dark:text-blue-400">"{{ providedTheme }}"</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center text-sm text-gray-500">
            {{ isZh ? '修改 Parent 的值，观察 Child 自动更新（中间层无需感知）' : 'Change Parent values, watch Child auto-update (middle layer unaware)' }}
          </div>
        </div>

        <!-- Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <pre class="text-sm text-gray-100 font-mono"><code>{{ demoCode }}</code></pre>
        </div>
      </div>

      <!-- vs Pinia -->
      <div v-else-if="activeTab === 'compare'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🤼 provide/inject vs Pinia' : '🤼 provide/inject vs Pinia' }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- provide/inject -->
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div class="text-teal-600 dark:text-teal-400 font-bold mb-3">💉 provide/inject</div>
              <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>✅ {{ isZh ? '轻量，无需额外依赖' : 'Lightweight, no extra dependency' }}</li>
                <li>✅ {{ isZh ? '适合组件库/可复用组件' : 'Good for component libraries' }}</li>
                <li>✅ {{ isZh ? '局部共享，不污染全局' : 'Local sharing, no global pollution' }}</li>
                <li>⚠️ {{ isZh ? '调试较困难' : 'Harder to debug' }}</li>
                <li>⚠️ {{ isZh ? '没有 DevTools 支持' : 'No DevTools support' }}</li>
              </ul>
              <div class="mt-3 text-xs text-gray-500">
                {{ isZh ? '适用：组件内部状态共享' : 'Use for: Internal component state sharing' }}
              </div>
            </div>

            <!-- Pinia -->
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div class="text-orange-600 dark:text-orange-400 font-bold mb-3">🍍 Pinia</div>
              <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>✅ {{ isZh ? '完整的状态管理方案' : 'Complete state management solution' }}</li>
                <li>✅ {{ isZh ? '强大的 DevTools 支持' : 'Powerful DevTools support' }}</li>
                <li>✅ {{ isZh ? '插件系统，可扩展' : 'Plugin system, extensible' }}</li>
                <li>⚠️ {{ isZh ? '需要额外安装' : 'Requires installation' }}</li>
                <li>⚠️ {{ isZh ? '全局状态，可能过度使用' : 'Global state, may overuse' }}</li>
              </ul>
              <div class="mt-3 text-xs text-gray-500">
                {{ isZh ? '适用：应用级全局状态' : 'Use for: App-level global state' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Sakura Notes Choice -->
        <div class="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🌸 Sakura Notes 的选择' : '🌸 Sakura Notes Choice' }}
          </h4>
          <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>{{ isZh ? '本站主要使用 Pinia 进行状态管理：' : 'This site mainly uses Pinia for state management:' }}</p>
            <ul class="list-disc list-inside ml-4 space-y-1">
              <li><code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">appStore</code> - {{ isZh ? '主题、语言、设置' : 'Theme, language, settings' }}</li>
              <li><code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">musicStore</code> - {{ isZh ? '音乐播放状态' : 'Music player state' }}</li>
              <li><code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">articleStore</code> - {{ isZh ? '文章互动状态' : 'Article interaction state' }}</li>
            </ul>
            <p class="mt-2">{{ isZh ? '如果开发可复用的 UI 组件库，provide/inject 会更合适。' : 'For reusable UI component libraries, provide/inject would be more suitable.' }}</p>
          </div>
        </div>
      </div>

      <!-- Real Examples -->
      <div v-else-if="activeTab === 'real'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '📁 实际应用场景' : '📁 Real-world Use Cases' }}
          </h3>
        </div>

        <!-- Use Cases -->
        <div class="space-y-4">
          <div v-for="(useCase, index) in useCases" :key="index" class="bg-gray-900 rounded-xl overflow-hidden">
            <div 
              class="flex items-center justify-between px-4 py-3 bg-gray-800 cursor-pointer"
              @click="useCase.expanded = !useCase.expanded"
            >
              <div class="flex items-center gap-2">
                <span>{{ useCase.icon }}</span>
                <span class="text-gray-300 text-sm">{{ useCase.title }}</span>
              </div>
              <span class="text-gray-400">{{ useCase.expanded ? '▼' : '▶' }}</span>
            </div>
            <div v-if="useCase.expanded" class="p-4">
              <p class="text-gray-400 text-sm mb-3">{{ useCase.desc }}</p>
              <pre class="text-sm text-gray-100 font-mono overflow-x-auto"><code>{{ useCase.code }}</code></pre>
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

const activeTab = ref('concept')
const tabs = computed(() => [
  { id: 'concept', icon: '💡', label: t.value.lab_provide_inject_tab_concept },
  { id: 'demo', icon: '🎮', label: t.value.lab_provide_inject_tab_demo },
  { id: 'compare', icon: '🤼', label: t.value.lab_provide_inject_tab_compare },
  { id: 'real', icon: '📁', label: t.value.lab_provide_inject_tab_real }
])

// Demo state
const providedValue = ref('Hello from Parent!')
const providedTheme = ref('light')

const basicCode = computed(() => isZh.value ? `// 📍 基础用法

// 父组件 - 提供数据
import { provide, ref } from 'vue'

const theme = ref('light')
const message = ref('Hello!')

// 提供响应式数据
provide('theme', theme)        // 提供 ref
provide('message', message)    // 子组件可以读取和修改

// -----------------------------------

// 子组件（任意层级）- 注入数据
import { inject } from 'vue'

// 注入数据（带默认值）
const theme = inject('theme', ref('light'))
const message = inject('message', ref(''))

// 现在可以直接使用！
console.log(theme.value)  // 'light'` : `// 📍 Basic Usage

// Parent Component - Provide data
import { provide, ref } from 'vue'

const theme = ref('light')
const message = ref('Hello!')

// Provide reactive data
provide('theme', theme)        // provide ref
provide('message', message)    // child can read and modify

// -----------------------------------

// Child Component (any level) - Inject data
import { inject } from 'vue'

// Inject data (with default)
const theme = inject('theme', ref('light'))
const message = inject('message', ref(''))

// Now you can use it directly!
console.log(theme.value)  // 'light'`)

const demoCode = computed(() => `// Parent.vue
<script setup>
import { provide, ref } from 'vue'

const message = ref('${providedValue.value}')
const theme = ref('${providedTheme.value}')

provide('message', message)
provide('theme', theme)
<\/script>

// Child.vue (可以是任意深度的子组件)
<script setup>
import { inject } from 'vue'

const message = inject('message')
const theme = inject('theme')

// message.value === '${providedValue.value}'
// theme.value === '${providedTheme.value}'
<\/script>`)

// Real use cases
const useCases = reactive([
  {
    icon: '🎨',
    title: isZh.value ? '主题系统' : 'Theme System',
    desc: isZh.value ? '为整个组件树提供主题配置' : 'Provide theme configuration for entire component tree',
    expanded: true,
    code: `// ThemeProvider.vue
// <script setup>
import { provide, ref, computed } from 'vue'

const isDark = ref(false)
const theme = computed(() => ({
  primary: isDark.value ? '#f472b6' : '#ec4899',
  background: isDark.value ? '#1f2937' : '#ffffff',
  text: isDark.value ? '#f3f4f6' : '#1f2937'
}))

// 提供主题对象和切换方法
provide('theme', theme)
provide('toggleTheme', () => { isDark.value = !isDark.value })
// <\/script>

// DeepNestedButton.vue
// <script setup>
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
// <\/script>

<template>
  <button 
    @click="toggleTheme"
    :style="{ backgroundColor: theme.primary }"
  >
    Toggle Theme
  </button>
</template>`
  },
  {
    icon: '📝',
    title: isZh.value ? '表单系统' : 'Form System',
    desc: isZh.value ? '表单组件共享校验和状态' : 'Form components share validation and state',
    expanded: false,
    code: `// Form.vue
// <script setup>
import { provide, reactive } from 'vue'

const formState = reactive({
  values: {},
  errors: {},
  isSubmitting: false
})

const setFieldValue = (name, value) => {
  formState.values[name] = value
}

const setFieldError = (name, error) => {
  formState.errors[name] = error
}

provide('form', {
  state: formState,
  setFieldValue,
  setFieldError
})
// <\/script>

// FormField.vue
// <script setup>
const props = defineProps(['name'])
const form = inject('form')

const value = computed({
  get: () => form.state.values[props.name],
  set: (v) => form.setFieldValue(props.name, v)
})

const error = computed(() => form.state.errors[props.name])
// <\/script>`
  },
  {
    icon: '🌐',
    title: isZh.value ? '国际化 (i18n)' : 'Internationalization (i18n)',
    desc: isZh.value ? '提供翻译函数给所有子组件' : 'Provide translation function to all children',
    expanded: false,
    code: `// I18nProvider.vue
// <script setup>
import { provide, ref, computed } from 'vue'
import { I18N } from './constants'

const locale = ref('zh')
const t = computed(() => I18N[locale.value])

const setLocale = (lang) => {
  locale.value = lang
}

provide('i18n', {
  locale,
  t,
  setLocale
})
// <\/script>

// AnyComponent.vue
// <script setup>
const { t, setLocale } = inject('i18n')
// <\/script>

<template>
  <div>
    <p>{{ t.welcome }}</p>
    <button @click="setLocale('en')">English</button>
    <button @click="setLocale('zh')">中文</button>
  </div>
</template>`
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
