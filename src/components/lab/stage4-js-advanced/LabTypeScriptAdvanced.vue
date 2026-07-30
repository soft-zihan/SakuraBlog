<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
      <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
        🛡️ TypeScript 进阶实战
      </h2>
      <p class="text-blue-600 dark:text-blue-300 text-sm">
        掌握泛型、接口与类型别名，以及高级类型技巧（类型体操）。
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 font-medium transition-colors rounded-t-lg flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === tab.id 
          ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-b-0 border-gray-200 dark:border-gray-700 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
      >
        <span>{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 1: Employee Data Drill (Interfaces) -->
    <div v-if="activeTab === 'employee'" class="animate-fade-in">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Interface Definition -->
        <div class="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-auto">
          <div class="text-gray-500 mb-4">// 定义员工接口</div>
          <div class="text-purple-400">interface <span class="text-yellow-300">Employee</span> {</div>
          <div class="pl-4 text-blue-300">id: <span class="text-green-300">number</span>;</div>
          <div class="pl-4 text-blue-300">name: <span class="text-green-300">string</span>;</div>
          <div class="pl-4 text-blue-300">role: <span class="text-green-300">'admin' | 'user'</span>;</div>
          <div class="pl-4 text-blue-300">skills: <span class="text-green-300">string[]</span>;</div>
          <div class="pl-4 text-blue-300">status?: <span class="text-green-300">'active' | 'inactive'</span>; <span class="text-gray-500">// Optional</span></div>
          <div class="text-purple-400">}</div>
        </div>

        <!-- Interactive Form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">构造符合接口的数据</h3>
          
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-500">id (number)</label>
              <input v-model.number="employeeData.id" type="number" class="w-full mt-1 p-2 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-600" />
              <div v-if="typeof employeeData.id !== 'number'" class="text-xs text-red-500 mt-1">❌ 类型错误: 必须是 number</div>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500">name (string)</label>
              <input v-model="employeeData.name" type="text" class="w-full mt-1 p-2 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-600" />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500">role ('admin' | 'user')</label>
              <select v-model="employeeData.role" class="w-full mt-1 p-2 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
                <option value="admin">admin</option>
                <option value="user">user</option>
                <option value="guest">guest (Invalid)</option>
              </select>
              <div v-if="!['admin', 'user'].includes(employeeData.role)" class="text-xs text-red-500 mt-1">❌ 类型错误: 必须是 'admin' 或 'user'</div>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500">skills (string[])</label>
              <div class="flex gap-2 mt-1">
                <input v-model="newSkill" @keyup.enter="addSkill" type="text" placeholder="Add skill..." class="flex-1 p-2 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-600" />
                <button @click="addSkill" class="px-3 bg-blue-500 text-white rounded">Add</button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span v-for="skill in employeeData.skills" :key="skill" class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                  {{ skill }} <button @click="removeSkill(skill)" class="ml-1 text-blue-500 hover:text-blue-700">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-lg" :class="isEmployeeValid ? 'bg-green-100 dark:bg-green-900/30 border border-green-300' : 'bg-red-100 dark:bg-red-900/30 border border-red-300'">
            <div class="font-bold text-sm" :class="isEmployeeValid ? 'text-green-700' : 'text-red-700'">
              {{ isEmployeeValid ? '✅ 类型检查通过' : '❌ 类型检查失败' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Generics -->
    <div v-if="activeTab === 'generics'" class="animate-fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">泛型 (Generics) 可视化</h3>
        <p class="text-sm text-gray-500 mb-6">泛型就像是类型的"变量"。你可以把类型传递给函数或类。</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Code -->
          <div class="bg-gray-900 rounded-xl p-6 font-mono text-sm">
            <div class="text-purple-400">function <span class="text-yellow-300">wrap</span>&lt;<span class="text-red-400">T</span>&gt;(value: <span class="text-red-400">T</span>): <span class="text-red-400">T</span>[] {</div>
            <div class="pl-4 text-blue-300">return [value];</div>
            <div class="text-purple-400">}</div>
            
            <div class="mt-6 border-t border-gray-700 pt-4">
              <div class="text-gray-500">// 调用</div>
              <div>
                <span class="text-blue-300">const res = wrap&lt;</span>
                <span class="text-red-400 font-bold text-lg animate-pulse">{{ selectedGenericType }}</span>
                <span class="text-blue-300">&gt;(</span>
                <span class="text-green-300">{{ genericValue }}</span>
                <span class="text-blue-300">);</span>
              </div>
            </div>
          </div>

          <!-- Interactive Control -->
          <div class="space-y-6">
            <div>
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">选择类型 T:</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <button 
                  v-for="t in ['string', 'number', 'boolean']" 
                  :key="t"
                  @click="setGenericType(t)"
                  class="px-4 py-2 rounded-lg border transition-all"
                  :class="selectedGenericType === t ? 'bg-red-100 border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'border-gray-300 dark:border-gray-600'"
                >
                  {{ t }}
                </button>
              </div>
            </div>

            <div>
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">输入值 (value):</label>
              <input v-model="genericInput" type="text" class="w-full mt-2 p-2 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-600" placeholder="Matches type T..." />
              <div v-if="!isGenericInputValid" class="text-xs text-red-500 mt-1">❌ 值与类型 T 不匹配</div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <div class="text-xs text-gray-500 mb-1">Result (T[]):</div>
              <div class="font-mono text-green-600 dark:text-green-400">
                [ {{ isGenericInputValid ? (selectedGenericType === 'string' ? `"${genericInput}"` : genericInput) : '...' }} ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Type vs Interface -->
    <div v-if="activeTab === 'compare'" class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-blue-600 mb-4">Interface</h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>✅ 描述对象形状</li>
            <li>✅ 支持 extends 继承</li>
            <li>✅ 支持声明合并 (Declaration Merging)</li>
            <li>❌ 不能描述基本类型别名</li>
          </ul>
          <div class="bg-gray-900 rounded-lg p-4 mt-4 font-mono text-xs text-gray-300">
            interface User {<br>
            &nbsp;&nbsp;name: string;<br>
            }<br>
            interface User {<br>
            &nbsp;&nbsp;age: number; // Merges<br>
            }
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-purple-600 mb-4">Type Alias</h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>✅ 描述任意类型 (联合, 交叉, 基本)</li>
            <li>✅ 支持 & (Intersection)</li>
            <li>❌ 不支持声明合并</li>
            <li>✅ 更灵活 (Mapped Types)</li>
          </ul>
          <div class="bg-gray-900 rounded-lg p-4 mt-4 font-mono text-xs text-gray-300">
            type ID = string | number;<br>
            type User = { name: string } & { age: number };
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 4: Gymnastics -->
    <div v-if="activeTab === 'gym'" class="animate-fade-in">
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-yellow-400">🤸 类型体操 (Type Gymnastics)</h3>
          <div class="text-sm text-gray-400">Level: {{ gymLevel }}</div>
        </div>

        <div v-if="gymLevel === 1" class="space-y-4">
          <p class="text-gray-300">1. 实现一个类型 `MyPick`，模拟 TS 内置的 `Pick&lt;T, K&gt;`。</p>
          <div class="bg-black rounded p-4 font-mono text-sm text-blue-300">
            type MyPick&lt;T, K extends keyof T&gt; = {<br>
            &nbsp;&nbsp;[P in K]: T[P]<br>
            }
          </div>
          <button @click="gymLevel++" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">下一题</button>
        </div>

        <div v-if="gymLevel === 2" class="space-y-4">
          <p class="text-gray-300">2. 实现 `Readonly&lt;T&gt;`。</p>
          <div class="bg-black rounded p-4 font-mono text-sm text-blue-300">
            type MyReadonly&lt;T&gt; = {<br>
            &nbsp;&nbsp;readonly [P in keyof T]: T[P]<br>
            }
          </div>
          <button @click="gymLevel++" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">下一题</button>
        </div>
        
        <div v-if="gymLevel > 2" class="text-center py-10 text-green-400">
          🎉 恭喜！你已经入门了类型体操！
          <button @click="gymLevel = 1" class="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-300">重来</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const tabs = [
  { id: 'employee', label: '接口演练', icon: '📋' },
  { id: 'generics', label: '泛型可视化', icon: '🧊' },
  { id: 'compare', label: 'Interface vs Type', icon: '⚖️' },
  { id: 'gym', label: '类型体操', icon: '🤸' }
]

const activeTab = ref('employee')

// === Employee Drill ===
const employeeData = reactive({
  id: 1,
  name: 'Alice',
  role: 'admin',
  skills: ['Vue', 'TS']
})
const newSkill = ref('')

function addSkill() {
  if (newSkill.value.trim()) {
    employeeData.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

function removeSkill(skill: string) {
  employeeData.skills = employeeData.skills.filter(s => s !== skill)
}

const isEmployeeValid = computed(() => {
  return typeof employeeData.id === 'number' &&
         typeof employeeData.name === 'string' &&
         ['admin', 'user'].includes(employeeData.role) &&
         Array.isArray(employeeData.skills)
})

// === Generics ===
const selectedGenericType = ref('string')
const genericInput = ref('Hello')

function setGenericType(type: string) {
  selectedGenericType.value = type
  genericInput.value = '' // Reset input
}

const isGenericInputValid = computed(() => {
  if (selectedGenericType.value === 'string') return true // Everything input is string in html input
  if (selectedGenericType.value === 'number') return !isNaN(Number(genericInput.value)) && genericInput.value !== ''
  if (selectedGenericType.value === 'boolean') return ['true', 'false'].includes(genericInput.value.toLowerCase())
  return false
})

const genericValue = computed(() => {
  if (selectedGenericType.value === 'string') return `"${genericInput.value}"`
  return genericInput.value
})

// === Gym ===
const gymLevel = ref(1)

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
