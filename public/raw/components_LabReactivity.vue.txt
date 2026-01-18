
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">⚛️ {{ lang === 'zh' ? '响应式系统深入' : 'Reactivity System' }}</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">{{ lang === 'zh' ? '理解 ref、reactive 和响应式原理' : 'Understand ref, reactive, and reactivity principles' }}</p>
    </div>

    <!-- Part 1: Original Dependency Tracking -->
    <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-sakura-200 dark:border-gray-700 shadow-sm backdrop-blur-md transition-colors relative">
    
    <div class="flex flex-col xl:flex-row gap-8">
       
       <!-- Left: Interaction Code -->
       <div class="flex-1 space-y-6">
          <h3 class="text-lg font-bold text-sakura-800 dark:text-sakura-300">{{ t.lab_reactivity_title }}</h3>
          <p class="text-xs text-gray-500">{{ t.lab_reactivity_info }}</p>

          <!-- Code Box -->
          <div class="bg-[#1e1e1e] p-4 rounded-xl shadow-inner border border-gray-700 relative overflow-hidden group">
             <div class="absolute top-0 right-0 bg-gray-700 text-[10px] text-white px-2 py-0.5 rounded-bl">simulated_vue.js</div>
             
             <div class="font-mono text-sm leading-relaxed text-gray-300">
                <div class="mb-2">
                   <span class="text-purple-400">const</span> data = <span class="text-blue-400">reactive</span>({ <span class="text-white">price</span>: <span class="text-green-400">{{ price }}</span>, <span class="text-white">qty</span>: <span class="text-green-400">{{ qty }}</span> });
                </div>
                
                <div class="p-2 border border-dashed border-gray-600 rounded bg-gray-800/50 mb-2 relative" :class="{'ring-2 ring-yellow-500': activeEffect === 'totalEffect'}">
                   <div class="text-[10px] text-gray-500 mb-1">// Effect Function (Computed)</div>
                   <span class="text-blue-400">const</span> total = <span class="text-blue-400">computed</span>(() => {<br>
                   &nbsp;&nbsp;<span class="text-gray-500">// Read (Track)</span><br>
                   &nbsp;&nbsp;<span class="text-purple-400">return</span> data.price * data.qty;<br>
                   });
                </div>

                <div class="flex gap-4 mt-4">
                   <div class="flex flex-col gap-1">
                      <label class="text-[10px] uppercase text-gray-500">Price</label>
                      <div class="flex items-center gap-2">
                         <button @click="changeData('price', -1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                         <span class="w-8 text-center">{{ price }}</span>
                         <button @click="changeData('price', 1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
                      </div>
                   </div>
                   <div class="flex flex-col gap-1">
                      <label class="text-[10px] uppercase text-gray-500">Qty</label>
                      <div class="flex items-center gap-2">
                         <button @click="changeData('qty', -1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                         <span class="w-8 text-center">{{ qty }}</span>
                         <button @click="changeData('qty', 1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
    </div>

    <!-- Part 2: ref vs reactive Comparison -->
    <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span class="text-2xl">1️⃣</span> {{ lang === 'zh' ? 'ref vs reactive' : 'ref vs reactive' }}
      </h3>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {{ lang === 'zh' ? 'ref 可以包装任何类型，需要 .value 访问；reactive 只能包装对象，不需要 .value。' : 'ref wraps any type and requires .value; reactive only wraps objects and doesn\'t need .value.' }}
      </p>

      <!-- Demo -->
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <!-- ref Demo -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-300 dark:border-blue-600">
          <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-4">📦 ref (可包装任何类型)</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm">{{ lang === 'zh' ? '字符串：' : 'String:' }}</span>
              <span class="font-mono text-blue-600 dark:text-blue-300">"{{ refString }}"</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">{{ lang === 'zh' ? '数字：' : 'Number:' }}</span>
              <span class="font-mono text-blue-600 dark:text-blue-300">{{ refNumber }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">{{ lang === 'zh' ? '对象：' : 'Object:' }}</span>
              <span class="font-mono text-blue-600 dark:text-blue-300">{{ refObject.name }}</span>
            </div>
            <button 
              @click="updateRef"
              class="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600"
            >
              {{ lang === 'zh' ? '更新 ref' : 'Update ref' }}
            </button>
          </div>
          <div class="bg-blue-900 text-blue-200 p-3 rounded-lg font-mono text-xs mt-4 overflow-x-auto">
            <pre>const count = ref(0)
// 需要 .value
count.value++</pre>
          </div>
        </div>

        <!-- reactive Demo -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-300 dark:border-green-600">
          <h4 class="font-bold text-green-700 dark:text-green-300 mb-4">📦 reactive (仅对象)</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm">{{ lang === 'zh' ? '名字：' : 'Name:' }}</span>
              <span class="font-mono text-green-600 dark:text-green-300">{{ reactiveObj.name }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">{{ lang === 'zh' ? '年龄：' : 'Age:' }}</span>
              <span class="font-mono text-green-600 dark:text-green-300">{{ reactiveObj.age }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">{{ lang === 'zh' ? '城市：' : 'City:' }}</span>
              <span class="font-mono text-green-600 dark:text-green-300">{{ reactiveObj.city }}</span>
            </div>
            <button 
              @click="updateReactive"
              class="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600"
            >
              {{ lang === 'zh' ? '更新 reactive' : 'Update reactive' }}
            </button>
          </div>
          <div class="bg-green-900 text-green-200 p-3 rounded-lg font-mono text-xs mt-4 overflow-x-auto">
            <pre>const obj = reactive({ name: '' })
// 直接访问
obj.name = 'new value'</pre>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700">
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-left">{{ lang === 'zh' ? '特性' : 'Feature' }}</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-left">ref</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-left">reactive</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 dark:border-gray-600 p-3 font-bold">{{ lang === 'zh' ? '支持类型' : 'Supported Types' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 p-3">{{ lang === 'zh' ? '任何类型' : 'Any type' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 p-3">{{ lang === 'zh' ? '仅对象' : 'Objects only' }}</td>
            </tr>
            <tr class="bg-gray-50 dark:bg-gray-800">
              <td class="border border-gray-300 dark:border-gray-600 p-3 font-bold">{{ lang === 'zh' ? '访问方式' : 'Access' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 p-3">.value</td>
              <td class="border border-gray-300 dark:border-gray-600 p-3">{{ lang === 'zh' ? '直接访问' : 'Direct' }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 dark:border-gray-600 p-3 font-bold">{{ lang === 'zh' ? '模板中' : 'In Template' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 p-3">{{ lang === 'zh' ? '自动解包' : 'Auto unwrap' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 p-3">{{ lang === 'zh' ? '直接使用' : 'Direct use' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Part 3: Deep Reactivity Pitfalls -->
    <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span class="text-2xl">2️⃣</span> {{ lang === 'zh' ? '深层修改的响应性' : 'Deep Modification Reactivity' }}
      </h3>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {{ lang === 'zh' ? '直接修改数组索引或对象不会触发更新。需要使用特殊方法。' : 'Direct array index or object modification won\'t trigger updates. Use special methods.' }}
      </p>

      <!-- Demo -->
      <div class="space-y-6">
        <!-- Array Demo -->
        <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-2 border-red-300 dark:border-red-600">
          <h4 class="font-bold text-red-700 dark:text-red-300 mb-4">❌ {{ lang === 'zh' ? '错误方式（不会更新）' : 'Wrong Way (Won\'t Update)' }}</h4>
          <div class="bg-red-900 text-red-200 p-4 rounded-lg font-mono text-xs mb-4 overflow-x-auto">
            <pre>const items = ref([1, 2, 3])
// ❌ 直接修改索引不会响应
items.value[0] = 10</pre>
          </div>
          
          <div class="flex gap-2">
            <span class="text-sm font-bold">{{ lang === 'zh' ? '数组内容：' : 'Array:' }}</span>
            <span class="font-mono">{{ wrongArray }}</span>
          </div>
          <button 
            @click="wrongArray[0] = 999"
            class="mt-3 px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
          >
            {{ lang === 'zh' ? '尝试修改第一项' : 'Try to modify first item' }}
          </button>
        </div>

        <!-- Correct Array Demo -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-300 dark:border-green-600">
          <h4 class="font-bold text-green-700 dark:text-green-300 mb-4">✅ {{ lang === 'zh' ? '正确方式（会更新）' : 'Correct Way (Will Update)' }}</h4>
          <div class="bg-green-900 text-green-200 p-4 rounded-lg font-mono text-xs mb-4 overflow-x-auto">
            <pre>// ✅ 方法 1: 使用 .splice()
items.value.splice(0, 1, 10)

// ✅ 方法 2: 整体赋值
items.value = [10, 2, 3]</pre>
          </div>

          <div class="flex gap-2 mb-3">
            <span class="text-sm font-bold">{{ lang === 'zh' ? '数组内容：' : 'Array:' }}</span>
            <span class="font-mono text-green-600 dark:text-green-300">{{ correctArray }}</span>
          </div>
          <div class="flex gap-2">
            <button 
              @click="correctArray.splice(0, 1, 888)"
              class="px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600"
            >
              {{ lang === 'zh' ? '使用 splice' : 'Use splice' }}
            </button>
            <button 
              @click="correctArray = [777, 2, 3]"
              class="px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600"
            >
              {{ lang === 'zh' ? '整体赋值' : 'Reassign' }}
            </button>
          </div>
        </div>

        <!-- Object Demo -->
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border-2 border-purple-300 dark:border-purple-600">
          <h4 class="font-bold text-purple-700 dark:text-purple-300 mb-4">🔧 {{ lang === 'zh' ? '对象新增属性' : 'Adding New Object Properties' }}</h4>
          <div class="bg-purple-900 text-purple-200 p-4 rounded-lg font-mono text-xs mb-4 overflow-x-auto">
            <pre>const user = reactive({ name: 'Tom' })
// ❌ 动态添加不会响应
user.email = 'test@example.com'

// ✅ 应该这样
user = Object.assign({}, user, { email: '...' })</pre>
          </div>

          <div class="space-y-2 mb-4">
            <div><span class="font-bold text-sm">{{ lang === 'zh' ? '姓名：' : 'Name:' }}</span> {{ objectUser.name }}</div>
            <div><span class="font-bold text-sm">{{ lang === 'zh' ? '邮箱：' : 'Email:' }}</span> {{ objectUser.email || lang === 'zh' ? '（未添加）' : '(Not added)' }}</div>
          </div>
          <button 
            @click="addUserProperty"
            class="px-4 py-2 bg-purple-500 text-white rounded font-bold hover:bg-purple-600"
          >
            {{ lang === 'zh' ? '正确添加邮箱属性' : 'Correctly Add Email' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Part 4: Summary -->
    <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span class="text-2xl">💡</span> {{ lang === 'zh' ? '核心概念总结' : 'Key Takeaways' }}
      </h3>
      
      <div class="space-y-3">
        <div class="flex gap-3 items-start">
          <span class="text-2xl">1️⃣</span>
          <div>
            <p class="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{{ lang === 'zh' ? 'ref 更通用，reactive 更简洁' : 'ref is more universal, reactive is cleaner' }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ lang === 'zh' ? '大多数情况下使用 ref，需要处理对象时可用 reactive。' : 'Prefer ref in most cases, use reactive when working with objects.' }}</p>
          </div>
        </div>

        <div class="flex gap-3 items-start">
          <span class="text-2xl">2️⃣</span>
          <div>
            <p class="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{{ lang === 'zh' ? '模板中 ref 自动解包' : 'ref auto-unwraps in templates' }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ lang === 'zh' ? '在模板中直接使用 ref，不需要加 .value。' : 'Use ref directly in templates without .value.' }}</p>
          </div>
        </div>

        <div class="flex gap-3 items-start">
          <span class="text-2xl">3️⃣</span>
          <div>
            <p class="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{{ lang === 'zh' ? '深层修改需要特殊处理' : 'Deep changes need special handling' }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ lang === 'zh' ? '数组用 splice，对象用 Object.assign() 或整体赋值。' : 'Use splice for arrays, Object.assign() or reassignment for objects.' }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

// Original demo state (keep for backward compat)
const price = ref(10);
const qty = ref(2);
const total = computed(() => price.value * qty.value);

const activeEffect = ref<string | null>(null);
const activeKey = ref<string | null>(null);
const actionPhase = ref<string | null>(null);

const deps = ref({
    price: new Set<string>(),
    qty: new Set<string>()
});

// ref vs reactive demo
const refString = ref('Hello Vue');
const refNumber = ref(42);
const refObject = ref({ name: 'Ref Object', value: 100 });

const updateRef = () => {
  refString.value = 'Updated!';
  refNumber.value += 1;
  refObject.value.value += 10;
};

const reactiveObj = reactive({
  name: 'Alice',
  age: 25,
  city: 'Shanghai'
});

const updateReactive = () => {
  reactiveObj.name = 'Bob';
  reactiveObj.age = 26;
  reactiveObj.city = 'Beijing';
};

// Deep reactivity demo
const wrongArray = ref([1, 2, 3]);
const correctArray = ref([1, 2, 3]);
const objectUser = reactive({ name: 'Tom', email: '' });

const addUserProperty = () => {
  Object.assign(objectUser, { email: 'tom@example.com' });
};

const initSimulation = async () => {
    activeEffect.value = 'totalEffect';
    actionPhase.value = 'Track';
    
    activeKey.value = 'price';
    deps.value.price.add('totalEffect');
    await wait(800);
    
    activeKey.value = 'qty';
    deps.value.qty.add('totalEffect');
    await wait(800);

    activeEffect.value = null;
    activeKey.value = null;
    actionPhase.value = null;
};

const changeData = async (key: 'price' | 'qty', delta: number) => {
    if (activeEffect.value) return;

    if (key === 'price') price.value += delta;
    else qty.value += delta;

    activeKey.value = key;
    actionPhase.value = 'Trigger';
    
    await wait(600);
    
    activeEffect.value = null;
    activeKey.value = null;
    actionPhase.value = null;
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

onMounted(() => {
    setTimeout(initSimulation, 1000);
});
</script>
