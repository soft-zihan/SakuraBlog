<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-teal-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    
    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <button 
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
        :class="activeTab === tab.id 
          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 1: v-if vs v-show -->
    <div v-if="activeTab === 'conditional'" class="animate-fade-in">
      <h3 class="text-lg font-bold text-teal-800 dark:text-teal-300 mb-4 flex items-center gap-2">
        {{ t.lab_directives_title }}
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ t.lab_directives_info }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Controls -->
        <div class="space-y-6">
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
             <div class="flex items-center justify-between mb-4">
               <span class="font-mono text-sm font-bold text-gray-600 dark:text-gray-300">isVisible:</span>
               <button 
                 @click="isVisible = !isVisible" 
                 class="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                 :class="isVisible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
               >
                 {{ isVisible }}
               </button>
             </div>
             <div class="text-[10px] text-gray-400">{{ lang === 'zh' ? '切换变量，观察两种指令的行为差异' : 'Toggle to see the difference between directives' }}</div>
          </div>

          <div class="space-y-4">
             <!-- Code v-if -->
             <div class="bg-[#1e1e1e] p-3 rounded-lg font-mono text-xs text-gray-300 border-l-4 border-purple-500">
               <span class="text-gray-500">&lt;div</span> <span class="text-purple-400">v-if</span>=<span class="text-green-400">"isVisible"</span><span class="text-gray-500">&gt;</span><br>
               &nbsp;&nbsp;I am v-if<br>
               <span class="text-gray-500">&lt;/div&gt;</span>
             </div>

             <!-- Code v-show -->
             <div class="bg-[#1e1e1e] p-3 rounded-lg font-mono text-xs text-gray-300 border-l-4 border-blue-500">
               <span class="text-gray-500">&lt;div</span> <span class="text-purple-400">v-show</span>=<span class="text-green-400">"isVisible"</span><span class="text-gray-500">&gt;</span><br>
               &nbsp;&nbsp;I am v-show<br>
               <span class="text-gray-500">&lt;/div&gt;</span>
             </div>
          </div>

          <!-- Summary -->
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl text-sm space-y-2">
            <p class="font-bold text-yellow-800 dark:text-yellow-300">{{ lang === 'zh' ? '何时使用？' : 'When to use?' }}</p>
            <p class="text-gray-600 dark:text-gray-400"><strong>v-if:</strong> {{ lang === 'zh' ? '条件很少改变时' : 'When condition rarely changes' }}</p>
            <p class="text-gray-600 dark:text-gray-400"><strong>v-show:</strong> {{ lang === 'zh' ? '频繁切换时' : 'When toggling frequently' }}</p>
          </div>
        </div>

        <!-- DOM Visualization -->
        <div class="space-y-6">
          
          <!-- v-if Result -->
          <div class="relative p-4 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-900 min-h-[80px] flex items-center justify-center bg-white dark:bg-gray-800">
            <div class="absolute top-0 left-0 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-br-lg">DOM Tree (v-if)</div>
            
            <div v-if="isVisible" class="animate-fade-in bg-purple-500 text-white px-4 py-2 rounded shadow-lg">
              {{ lang === 'zh' ? '我在 DOM 中' : 'I am in the DOM' }}
            </div>
            <div v-else class="text-gray-400 italic text-xs">
              &lt;!--v-if--&gt; ({{ lang === 'zh' ? '节点已移除' : 'Node Removed' }})
            </div>
          </div>

          <!-- v-show Result -->
          <div class="relative p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-900 min-h-[80px] flex items-center justify-center bg-white dark:bg-gray-800">
            <div class="absolute top-0 left-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-br-lg">DOM Tree (v-show)</div>
            
            <div 
              class="transition-all duration-300 bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
              :style="{ display: isVisible ? 'block' : 'none' }"
            >
              {{ lang === 'zh' ? '被 CSS 隐藏' : 'Hidden via CSS' }}
            </div>
            <div v-if="!isVisible" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
               <span class="text-[10px] font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-600 dark:text-gray-300">style="display: none"</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Tab 2: v-bind -->
    <div v-else-if="activeTab === 'bind'" class="animate-fade-in space-y-6">
      <h3 class="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">
        v-bind / : {{ lang === 'zh' ? '动态属性绑定' : 'Dynamic Attribute Binding' }}
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {{ lang === 'zh' ? '使用 v-bind 或简写 : 将数据绑定到 HTML 属性。' : 'Use v-bind or shorthand : to bind data to HTML attributes.' }}
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Demo -->
        <div class="space-y-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <label class="text-sm font-bold block mb-2">{{ lang === 'zh' ? '图片 URL:' : 'Image URL:' }}</label>
            <input 
              v-model="imageUrl" 
              type="text" 
              class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm"
            />
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <label class="text-sm font-bold block mb-2">{{ lang === 'zh' ? '链接 href:' : 'Link href:' }}</label>
            <input 
              v-model="linkUrl" 
              type="text" 
              class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm"
            />
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
            <label class="text-sm font-bold block mb-2">{{ lang === 'zh' ? '按钮禁用:' : 'Button disabled:' }}</label>
            <button 
              @click="isDisabled = !isDisabled" 
              class="px-4 py-2 bg-purple-500 text-white rounded"
            >
              {{ isDisabled ? 'true' : 'false' }}
            </button>
          </div>
        </div>

        <!-- Result -->
        <div class="space-y-4">
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
            <p class="text-xs text-gray-500 mb-2">{{ lang === 'zh' ? '结果预览:' : 'Preview:' }}</p>
            <img :src="imageUrl" alt="demo" class="w-20 h-20 object-cover rounded mb-2" />
            <a :href="linkUrl" target="_blank" class="text-blue-500 underline block mb-2">{{ lang === 'zh' ? '动态链接' : 'Dynamic Link' }}</a>
            <button :disabled="isDisabled" class="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50">
              {{ lang === 'zh' ? '按钮' : 'Button' }} (disabled={{ isDisabled }})
            </button>
          </div>
          
          <div class="bg-[#1e1e1e] p-3 rounded-lg font-mono text-xs text-gray-300">
            <div>&lt;img <span class="text-purple-400">:src</span>=<span class="text-green-400">"imageUrl"</span> /&gt;</div>
            <div>&lt;a <span class="text-purple-400">:href</span>=<span class="text-green-400">"linkUrl"</span>&gt;...&lt;/a&gt;</div>
            <div>&lt;button <span class="text-purple-400">:disabled</span>=<span class="text-green-400">"isDisabled"</span>&gt;</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: v-model -->
    <div v-else-if="activeTab === 'model'" class="animate-fade-in space-y-6">
      <h3 class="text-lg font-bold text-green-800 dark:text-green-300 mb-4">
        v-model {{ lang === 'zh' ? '双向绑定' : 'Two-way Binding' }}
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {{ lang === 'zh' ? 'v-model 实现表单输入和数据的双向同步。' : 'v-model syncs form inputs with data bidirectionally.' }}
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Input Types -->
        <div class="space-y-4">
          <!-- Text -->
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <label class="text-sm font-bold block mb-2">{{ lang === 'zh' ? '文本输入:' : 'Text Input:' }}</label>
            <input v-model="textInput" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" />
            <p class="text-xs text-gray-500 mt-1">{{ lang === 'zh' ? '值:' : 'Value:' }} "{{ textInput }}"</p>
          </div>

          <!-- Checkbox -->
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <label class="text-sm font-bold block mb-2">{{ lang === 'zh' ? '复选框:' : 'Checkbox:' }}</label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="checkboxValue" type="checkbox" class="w-5 h-5" />
              <span>{{ lang === 'zh' ? '同意条款' : 'Agree to terms' }}</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">{{ lang === 'zh' ? '值:' : 'Value:' }} {{ checkboxValue }}</p>
          </div>

          <!-- Radio -->
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
            <label class="text-sm font-bold block mb-2">{{ lang === 'zh' ? '单选框:' : 'Radio:' }}</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="radioValue" type="radio" value="A" />
                <span>A</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="radioValue" type="radio" value="B" />
                <span>B</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="radioValue" type="radio" value="C" />
                <span>C</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ lang === 'zh' ? '选中:' : 'Selected:' }} {{ radioValue }}</p>
          </div>

          <!-- Select -->
          <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
            <label class="text-sm font-bold block mb-2">{{ lang === 'zh' ? '下拉选择:' : 'Select:' }}</label>
            <select v-model="selectValue" class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600">
              <option value="">{{ lang === 'zh' ? '请选择' : 'Please select' }}</option>
              <option value="vue">Vue</option>
              <option value="react">React</option>
              <option value="angular">Angular</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">{{ lang === 'zh' ? '选中:' : 'Selected:' }} {{ selectValue || '(empty)' }}</p>
          </div>
        </div>

        <!-- Code -->
        <div class="space-y-4">
          <div class="bg-[#1e1e1e] p-4 rounded-lg font-mono text-xs text-gray-300 space-y-3">
            <div class="border-b border-gray-700 pb-2">
              <span class="text-gray-500">// Text</span><br/>
              &lt;input <span class="text-purple-400">v-model</span>=<span class="text-green-400">"text"</span> /&gt;
            </div>
            <div class="border-b border-gray-700 pb-2">
              <span class="text-gray-500">// Checkbox</span><br/>
              &lt;input <span class="text-purple-400">v-model</span>=<span class="text-green-400">"checked"</span> type="checkbox" /&gt;
            </div>
            <div class="border-b border-gray-700 pb-2">
              <span class="text-gray-500">// Radio</span><br/>
              &lt;input <span class="text-purple-400">v-model</span>=<span class="text-green-400">"picked"</span> type="radio" value="A" /&gt;
            </div>
            <div>
              <span class="text-gray-500">// Select</span><br/>
              &lt;select <span class="text-purple-400">v-model</span>=<span class="text-green-400">"selected"</span>&gt;<br/>
              &nbsp;&nbsp;&lt;option value="vue"&gt;Vue&lt;/option&gt;<br/>
              &lt;/select&gt;
            </div>
          </div>

          <!-- Modifiers -->
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
            <p class="text-sm font-bold mb-2">{{ lang === 'zh' ? 'v-model 修饰符' : 'v-model Modifiers' }}</p>
            <div class="space-y-2 text-xs">
              <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">.lazy</code> - {{ lang === 'zh' ? '失焦时同步' : 'Sync on blur' }}</div>
              <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">.number</code> - {{ lang === 'zh' ? '转为数字' : 'Cast to number' }}</div>
              <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">.trim</code> - {{ lang === 'zh' ? '去除首尾空格' : 'Trim whitespace' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 4: v-for -->
    <div v-else-if="activeTab === 'for'" class="animate-fade-in space-y-6">
      <h3 class="text-lg font-bold text-orange-800 dark:text-orange-300 mb-4">
        v-for {{ lang === 'zh' ? '列表渲染' : 'List Rendering' }}
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {{ lang === 'zh' ? '使用 v-for 遍历数组或对象渲染列表。' : 'Use v-for to render lists from arrays or objects.' }}
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Demo -->
        <div class="space-y-4">
          <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
            <p class="text-sm font-bold mb-3">{{ lang === 'zh' ? '待办列表:' : 'Todo List:' }}</p>
            <div class="flex gap-2 mb-3">
              <input 
                v-model="newTodo" 
                @keyup.enter="addTodo"
                type="text" 
                :placeholder="lang === 'zh' ? '添加待办...' : 'Add todo...'"
                class="flex-1 px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm"
              />
              <button @click="addTodo" class="px-4 py-2 bg-orange-500 text-white rounded font-bold">+</button>
            </div>
            <ul class="space-y-2">
              <li 
                v-for="(todo, index) in todos" 
                :key="todo.id"
                class="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow-sm"
              >
                <span class="text-gray-400 text-xs">{{ index + 1 }}.</span>
                <span class="flex-1">{{ todo.text }}</span>
                <button @click="removeTodo(index)" class="text-red-500 text-sm">×</button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Code -->
        <div class="space-y-4">
          <div class="bg-[#1e1e1e] p-4 rounded-lg font-mono text-xs text-gray-300">
            <div class="text-gray-500 mb-2">// {{ lang === 'zh' ? '基本语法' : 'Basic syntax' }}</div>
            <div>&lt;li <span class="text-purple-400">v-for</span>=<span class="text-green-400">"item in items"</span> <span class="text-purple-400">:key</span>=<span class="text-green-400">"item.id"</span>&gt;</div>
            <div>&nbsp;&nbsp;{'{{ item.text }}'}</div>
            <div>&lt;/li&gt;</div>
            
            <div class="text-gray-500 mt-4 mb-2">// {{ lang === 'zh' ? '带索引' : 'With index' }}</div>
            <div>&lt;li <span class="text-purple-400">v-for</span>=<span class="text-green-400">"(item, index) in items"</span>&gt;</div>
            <div>&nbsp;&nbsp;{'{{ index }}: {{ item }}'}</div>
            <div>&lt;/li&gt;</div>

            <div class="text-gray-500 mt-4 mb-2">// {{ lang === 'zh' ? '遍历对象' : 'Iterate object' }}</div>
            <div>&lt;div <span class="text-purple-400">v-for</span>=<span class="text-green-400">"(value, key) in object"</span>&gt;</div>
            <div>&nbsp;&nbsp;{'{{ key }}: {{ value }}'}</div>
            <div>&lt;/div&gt;</div>
          </div>

          <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-l-4 border-red-500">
            <p class="text-sm font-bold text-red-700 dark:text-red-300 mb-2">⚠️ {{ lang === 'zh' ? '重要：始终提供 :key' : 'Important: Always provide :key' }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ lang === 'zh' ? 'key 帮助 Vue 追踪每个节点的身份，优化 DOM 更新性能。' : 'key helps Vue track each node\'s identity for optimized DOM updates.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 5: v-on shortcuts -->
    <div v-else-if="activeTab === 'on'" class="animate-fade-in space-y-6">
      <h3 class="text-lg font-bold text-pink-800 dark:text-pink-300 mb-4">
        v-on / @ {{ lang === 'zh' ? '事件绑定' : 'Event Binding' }}
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {{ lang === 'zh' ? '使用 v-on 或简写 @ 绑定事件监听器。' : 'Use v-on or shorthand @ to bindvent listeners.' }}
      </p>

      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-pink-100 dark:bg-pink-900/30">
              <th class="border dark:border-gray-600 p-3 text-left">{{ lang === 'zh' ? '完整写法' : 'Full Syntax' }}</th>
              <th class="border dark:border-gray-600 p-3 text-left">{{ lang === 'zh' ? '简写' : 'Shorthand' }}</th>
              <th class="border dark:border-gray-600 p-3 text-left">{{ lang === 'zh' ? '说明' : 'Description' }}</th>
            </tr>
          </thead>
          <tbody class="font-mono text-xs">
            <tr>
              <td class="border dark:border-gray-600 p-3">v-on:click="fn"</td>
              <td class="border dark:border-gray-600 p-3 text-pink-600">@click="fn"</td>
              <td class="border dark:border-gray-600 p-3 font-sans">{{ lang === 'zh' ? '点击事件' : 'Click event' }}</td>
            </tr>
            <tr class="bg-gray-50 dark:bg-gray-800">
              <td class="border dark:border-gray-600 p-3">v-on:input="fn"</td>
              <td class="border dark:border-gray-600 p-3 text-pink-600">@input="fn"</td>
              <td class="border dark:border-gray-600 p-3 font-sans">{{ lang === 'zh' ? '输入事件' : 'Input event' }}</td>
            </tr>
            <tr>
              <td class="border dark:border-gray-600 p-3">v-on:submit="fn"</td>
              <td class="border dark:border-gray-600 p-3 text-pink-600">@submit="fn"</td>
              <td class="border dark:border-gray-600 p-3 font-sans">{{ lang === 'zh' ? '表单提交' : 'Form submit' }}</td>
            </tr>
            <tr class="bg-gray-50 dark:bg-gray-800">
              <td class="border dark:border-gray-600 p-3">v-on:keyup.enter="fn"</td>
              <td class="border dark:border-gray-600 p-3 text-pink-600">@keyup.enter="fn"</td>
              <td class="border dark:border-gray-600 p-3 font-sans">{{ lang === 'zh' ? '按 Enter 键' : 'Press Enter' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-xl">
        <p class="text-sm font-bold mb-2">💡 {{ lang === 'zh' ? '小贴士' : 'Tips' }}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          {{ lang === 'zh' 
            ? '实际开发中几乎总是使用简写 @ 和 :，它们更简洁易读。' 
            : 'In practice, always use shorthand @ and : for cleaner code.' }}
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { I18N } from '../../../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const tabs = computed(() => [
  { id: 'conditional', label: props.lang === 'zh' ? 'v-if/v-show' : 'v-if/v-show' },
  { id: 'bind', label: props.lang === 'zh' ? 'v-bind (:)' : 'v-bind (:)' },
  { id: 'model', label: 'v-model' },
  { id: 'for', label: 'v-for' },
  { id: 'on', label: props.lang === 'zh' ? 'v-on (@)' : 'v-on (@)' },
]);

const activeTab = ref('conditional');

// v-if/v-show demo
const isVisible = ref(true);

// v-bind demo
const imageUrl = ref('https://vuejs.org/images/logo.png');
const linkUrl = ref('https://vuejs.org');
const isDisabled = ref(false);

// v-model demo
const textInput = ref('Hello Vue!');
const checkboxValue = ref(false);
const radioValue = ref('A');
const selectValue = ref('');

// v-for demo
const newTodo = ref('');
const todos = ref([
  { id: 1, text: 'Learn Vue' },
  { id: 2, text: 'Build something awesome' },
]);
let todoId = 3;

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({ id: todoId++, text: newTodo.value });
    newTodo.value = '';
  }
};

const removeTodo = (index: number) => {
  todos.value.splice(index, 1);
};
</script>