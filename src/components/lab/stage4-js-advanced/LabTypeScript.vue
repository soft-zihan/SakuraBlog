<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-blue-200 dark:border-blue-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🔷</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'TypeScript 类型系统' : 'TypeScript Type System' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '为 JavaScript 添加类型安全，减少运行时错误。' : 'Add type safety to JavaScript and reduce runtime errors.' }}
        </p>
      </div>
    </div>

    <!-- Why TypeScript -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
      <p class="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">💡 {{ isZh ? '为什么使用 TypeScript？' : 'Why TypeScript?' }}</p>
      <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <li>✅ {{ isZh ? '编译时捕获错误，而非运行时' : 'Catch errors at compile time, not runtime' }}</li>
        <li>✅ {{ isZh ? '更好的 IDE 支持和自动补全' : 'Better IDE support and autocompletion' }}</li>
        <li>✅ {{ isZh ? '代码更易于理解和维护' : 'Code is easier to understand and maintain' }}</li>
      </ul>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Basic Types -->
    <div v-if="activeTab === 'basic'" class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '基本类型注解' : 'Basic Annotations' }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ isZh ? '声明变量时指定类型。' : 'Specify types when declaring variables.' }}</p>

            <div class="space-y-3">
              <label class="text-xs text-gray-500">{{ isZh ? '选择类型' : 'Choose type' }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="type in typeOptions"
                  :key="type"
                  @click="selectedType = type"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border"
                  :class="selectedType === type ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
                >
                  {{ type }}
                </button>
              </div>
              <input
                v-model="inputValue"
                type="text"
                class="w-full mt-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                :placeholder="isZh ? '输入值...' : 'Enter a value...'"
              />
              <div class="text-xs text-gray-500">
                {{ isZh ? '推断结果：' : 'Inferred:' }}
                <span class="font-mono text-blue-600 dark:text-blue-300">{{ preview }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{{ basicCode }}</pre>
        </div>
      </div>
    </div>

    <!-- Tab: Union & Literal -->
    <div v-else-if="activeTab === 'union'" class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '联合类型 & 字面量类型' : 'Union & Literal Types' }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ isZh ? '变量可以是多种类型之一。' : 'A variable can be one of several types.' }}</p>

            <div class="space-y-4">
              <div>
                <p class="text-xs font-bold mb-2">{{ isZh ? '状态选择 (字面量联合)' : 'Status (Literal Union)' }}</p>
                <div class="flex gap-2">
                  <button
                    v-for="s in ['pending', 'success', 'error']"
                    :key="s"
                    @click="statusValue = s"
                    class="px-3 py-1 rounded text-xs font-bold"
                    :class="statusValue === s ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'"
                  >
                    {{ s }}
                  </button>
                </div>
                <p class="text-xs mt-2 text-gray-500">{{ isZh ? '当前值:' : 'Current:' }} <span class="font-mono text-blue-500">"{{ statusValue }}"</span></p>
              </div>

              <div>
                <p class="text-xs font-bold mb-2">{{ isZh ? '混合类型 (string | number)' : 'Mixed Type (string | number)' }}</p>
                <input
                  v-model="mixedInput"
                  class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm"
                />
                <p class="text-xs mt-2 text-gray-500">typeof: <span class="font-mono text-blue-500">{{ typeof mixedInput }}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>// {{ isZh ? '联合类型：可以是多种类型' : 'Union: one of several types' }}
let id: string | number
id = 'abc'  // ✅
id = 123    // ✅

// {{ isZh ? '字面量类型：限定具体值' : 'Literal: specific values' }}
type Status = 'pending' | 'success' | 'error'
let status: Status = '{{ statusValue }}'

// {{ isZh ? '类型收窄' : 'Type narrowing' }}
function handle(val: string | number) {
  if (typeof val === 'string') {
    // val {{ isZh ? '被收窄为 string' : 'is narrowed to string' }}
    return val.toUpperCase()
  }
  // val {{ isZh ? '被收窄为 number' : 'is narrowed to number' }}
  return val * 2
}</pre>
        </div>
      </div>
    </div>

    <!-- Tab: Interface -->
    <div v-else-if="activeTab === 'interface'" class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '接口 (Interface)' : 'Interface' }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ isZh ? '定义对象的结构。' : 'Define object shapes.' }}</p>

            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-500">name:</label>
                <input v-model="user.name" class="w-full px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm" />
              </div>
              <div>
                <label class="text-xs text-gray-500">age:</label>
                <input v-model.number="user.age" type="number" class="w-full px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm" />
              </div>
              <div>
                <label class="text-xs text-gray-500">email ({{ isZh ? '可选' : 'optional' }}):</label>
                <input v-model="user.email" class="w-full px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm" />
              </div>
            </div>

            <div class="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg text-xs font-mono">
              {{ JSON.stringify(user, null, 2) }}
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>// {{ isZh ? '定义接口' : 'Define interface' }}
interface User {
  name: string
  age: number
  email?: string  // {{ isZh ? '可选属性' : 'Optional' }}
  readonly id: number  // {{ isZh ? '只读' : 'Readonly' }}
}

// {{ isZh ? '使用接口' : 'Use interface' }}
const user: User = {
  id: 1,
  name: '{{ user.name }}',
  age: {{ user.age }}{{ user.email ? `,\n  email: '${user.email}'` : '' }}
}

// {{ isZh ? '接口扩展' : 'Extend interface' }}
interface Admin extends User {
  role: 'admin'
  permissions: string[]
}</pre>
        </div>
      </div>
    </div>

    <!-- Tab: Generics -->
    <div v-else-if="activeTab === 'generic'" class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '泛型 (Generics)' : 'Generics' }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ isZh ? '创建可重用的类型安全组件。' : 'Create reusable, type-safe components.' }}</p>

            <div class="space-y-4">
              <div>
                <p class="text-xs font-bold mb-2">{{ isZh ? '数字数组操作' : 'Number array operations' }}</p>
                <div class="flex gap-2 flex-wrap">
                  <button @click="genericDemo.numbers.push(Math.floor(Math.random() * 100))" class="px-3 py-1 bg-green-500 text-white rounded text-xs">+ Add</button>
                  <button @click="genericDemo.numbers.pop()" class="px-3 py-1 bg-red-500 text-white rounded text-xs">- Remove</button>
                </div>
                <p class="text-xs mt-2 font-mono">first&lt;number&gt;: {{ genericDemo.numbers[0] ?? 'undefined' }}</p>
              </div>

              <div>
                <p class="text-xs font-bold mb-2">{{ isZh ? '字符串数组操作' : 'String array operations' }}</p>
                <div class="flex gap-2 flex-wrap">
                  <button @click="genericDemo.strings.push(['Vue', 'React', 'Angular'][Math.floor(Math.random() * 3)])" class="px-3 py-1 bg-green-500 text-white rounded text-xs">+ Add</button>
                  <button @click="genericDemo.strings.pop()" class="px-3 py-1 bg-red-500 text-white rounded text-xs">- Remove</button>
                </div>
                <p class="text-xs mt-2 font-mono">first&lt;string&gt;: {{ genericDemo.strings[0] ?? 'undefined' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>// {{ isZh ? '泛型函数' : 'Generic function' }}
function first&lt;T&gt;(arr: T[]): T | undefined {
  return arr[0]
}

// {{ isZh ? '使用时推断类型' : 'Type inferred on use' }}
const nums = [{{ genericDemo.numbers.join(', ') }}]
first(nums)  // {{ isZh ? '返回' : 'returns' }} number | undefined

const strs = [{{ genericDemo.strings.map(s => `'${s}'`).join(', ') }}]
first(strs)  // {{ isZh ? '返回' : 'returns' }} string | undefined

// {{ isZh ? '泛型接口' : 'Generic interface' }}
interface Response&lt;T&gt; {
  data: T
  status: number
}

// {{ isZh ? '常见内置泛型' : 'Common built-in generics' }}
// Array&lt;T&gt;, Promise&lt;T&gt;, Map&lt;K, V&gt;</pre>
        </div>
      </div>
    </div>

    <!-- Tab: Utility Types -->
    <div v-else-if="activeTab === 'utility'" class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ isZh ? '实用类型' : 'Utility Types' }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ isZh ? 'TypeScript 内置的类型转换工具。' : 'Built-in type transformation utilities.' }}</p>

            <div class="space-y-3 text-xs">
              <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="font-bold text-blue-700 dark:text-blue-300">Partial&lt;T&gt;</p>
                <p class="text-gray-600 dark:text-gray-400">{{ isZh ? '所有属性变为可选' : 'Make all properties optional' }}</p>
              </div>
              <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p class="font-bold text-green-700 dark:text-green-300">Required&lt;T&gt;</p>
                <p class="text-gray-600 dark:text-gray-400">{{ isZh ? '所有属性变为必填' : 'Make all properties required' }}</p>
              </div>
              <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p class="font-bold text-purple-700 dark:text-purple-300">Pick&lt;T, K&gt;</p>
                <p class="text-gray-600 dark:text-gray-400">{{ isZh ? '选取部分属性' : 'Pick specific properties' }}</p>
              </div>
              <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p class="font-bold text-orange-700 dark:text-orange-300">Omit&lt;T, K&gt;</p>
                <p class="text-gray-600 dark:text-gray-400">{{ isZh ? '排除部分属性' : 'Omit specific properties' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

// Partial: {{ isZh ? '用于更新操作' : 'For updates' }}
type UpdateUser = Partial&lt;User&gt;
// { id?: number, name?: string, ... }

// Pick: {{ isZh ? '只取需要的字段' : 'Take only needed fields' }}
type UserPreview = Pick&lt;User, 'id' | 'name'&gt;
// { id: number, name: string }

// Omit: {{ isZh ? '排除敏感字段' : 'Exclude sensitive fields' }}
type PublicUser = Omit&lt;User, 'email'&gt;
// { id: number, name: string, avatar?: string }

// Record: {{ isZh ? '键值对映射' : 'Key-value mapping' }}
type UserMap = Record&lt;string, User&gt;</pre>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
      <p class="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 {{ isZh ? '学习路径建议' : 'Learning Path' }}</p>
      <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>1️⃣ {{ isZh ? '先掌握基本类型注解' : 'Master basic type annotations first' }}</p>
        <p>2️⃣ {{ isZh ? '学习接口定义对象结构' : 'Learn interfaces to define object shapes' }}</p>
        <p>3️⃣ {{ isZh ? '理解联合类型和类型收窄' : 'Understand union types and narrowing' }}</p>
        <p>4️⃣ {{ isZh ? '在实际项目中逐步使用泛型' : 'Gradually use generics in real projects' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

const tabs = computed(() => [
  { id: 'basic', label: isZh.value ? '基本类型' : 'Basic Types' },
  { id: 'union', label: isZh.value ? '联合类型' : 'Union Types' },
  { id: 'interface', label: isZh.value ? '接口' : 'Interface' },
  { id: 'generic', label: isZh.value ? '泛型' : 'Generics' },
  { id: 'utility', label: isZh.value ? '实用类型' : 'Utility Types' }
])

const activeTab = ref<'basic' | 'union' | 'interface' | 'generic' | 'utility'>('basic')

// Basic types demo
const selectedType = ref<'number' | 'string' | 'boolean' | 'any'>('number')
const inputValue = ref('42')
const typeOptions: Array<'number' | 'string' | 'boolean' | 'any'> = ['number', 'string', 'boolean', 'any']

const preview = computed(() => {
  const val = inputValue.value
  if (selectedType.value === 'number') {
    const num = Number(val)
    return Number.isNaN(num) ? 'NaN' : String(num)
  }
  if (selectedType.value === 'boolean') {
    return val.toLowerCase() === 'true' ? 'true' : 'false'
  }
  return `"${val}"`
})

const basicCode = computed(() => `// ${isZh.value ? '基本类型' : 'Basic types'}
let count: number = 1
let title: string = 'Hello'
let enabled: boolean = true

// ${isZh.value ? '类型推断' : 'Type inference'}
let inferred = 42  // ${isZh.value ? '自动推断为 number' : 'Auto-inferred as number'}

// ${isZh.value ? '数组类型' : 'Array types'}
let nums: number[] = [1, 2, 3]
let strs: Array<string> = ['a', 'b']

// ${isZh.value ? '当前输入' : 'Your input'}
let value: ${selectedType.value} = ${preview.value}`)

// Union demo
const statusValue = ref('pending')
const mixedInput = ref('hello')

// Interface demo
const user = reactive({
  name: 'Zihan',
  age: 25,
  email: ''
})

// Generics demo
const genericDemo = reactive({
  numbers: [1, 2, 3] as number[],
  strings: ['Vue', 'React'] as string[]
})
</script>