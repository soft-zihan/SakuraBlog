<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-yellow-200 dark:border-yellow-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🟨</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'JavaScript 基础语法' : 'JavaScript Fundamentals' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '学习 JS 核心语法，为 Vue 开发打下基础。' : 'Learn JS core syntax, building foundation for Vue development.' }}
        </p>
      </div>
    </div>

    <!-- Why JS Matters -->
    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6">
      <p class="text-sm font-bold text-yellow-700 dark:text-yellow-300 mb-2">💡 {{ isZh ? '为什么先学 JavaScript？' : 'Why Learn JavaScript First?' }}</p>
      <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <li>✅ {{ isZh ? 'Vue 3 的 Composition API 需要扎实的 JS 基础' : 'Vue 3 Composition API requires solid JS knowledge' }}</li>
        <li>✅ {{ isZh ? '理解 ref、reactive、computed 本质是 JS 的 Proxy' : 'Understanding ref/reactive/computed requires JS Proxy knowledge' }}</li>
        <li>✅ {{ isZh ? '箭头函数、解构赋值在 Vue 中大量使用' : 'Arrow functions & destructuring are heavily used in Vue' }}</li>
      </ul>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-yellow-500 text-white' : 'bg-yellow-50 dark:bg-gray-700 text-yellow-600 dark:text-yellow-300'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 1: 变量声明 -->
    <div v-if="activeTab === 'variables'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Interactive Panel -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? 'let vs const vs var' : 'let vs const vs var' }}</h4>
            
            <div class="space-y-3">
              <div 
                v-for="(item, key) in variableTypes" 
                :key="key"
                class="p-3 rounded-lg border cursor-pointer transition-all"
                :class="selectedVar === key ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-gray-200 dark:border-gray-700'"
                @click="selectedVar = key as 'let' | 'const' | 'var'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-yellow-600 dark:text-yellow-400">{{ key }}</span>
                  <span class="text-xs px-2 py-1 rounded" :class="item.badge">{{ item.recommend }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ isZh ? item.descZh : item.descEn }}</p>
              </div>
            </div>
          </div>

          <!-- Sakura Notes Example -->
          <div class="p-4 rounded-2xl border border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/20">
            <p class="text-xs font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)] mb-2">🌸 {{ isZh ? '本站代码示例' : 'From This Site' }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ isZh 
                ? '在 App.vue 中，我们用 const 定义状态，因为 ref 对象本身不应被重新赋值：' 
                : 'In App.vue, we use const for state because ref objects should not be reassigned:' 
              }}
            </p>
            <pre class="mt-2 text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto">const activeTab = ref('latest');
const isDark = ref(false);
// ✅ 修改 .value 是响应式的
activeTab.value = 'files';
// ❌ 不应重新赋值 ref 本身
// activeTab = ref('lab');</pre>
          </div>
        </div>

        <!-- Code Display -->
        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{{ variableCode }}</pre>
        </div>
      </div>
    </div>

    <!-- Tab 2: 数据类型 -->
    <div v-else-if="activeTab === 'types'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Type Selector -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '7种基本数据类型' : '7 Primitive Types' }}</h4>
            
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="type in dataTypes"
                :key="type.name"
                @click="selectedType = type.name"
                class="p-3 rounded-lg border text-left transition-all"
                :class="selectedType === type.name ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-gray-200 dark:border-gray-700'"
              >
                <span class="text-lg">{{ type.icon }}</span>
                <p class="font-mono text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ type.name }}</p>
                <p class="text-[10px] text-gray-500">{{ isZh ? type.exampleZh : type.exampleEn }}</p>
              </button>
            </div>
          </div>

          <!-- typeof Demo -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? 'typeof 运算符测试' : 'typeof Operator Test' }}</h4>
            <input 
              v-model="typeofInput" 
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-sm"
              :placeholder="isZh ? '输入任意值...' : 'Enter any value...'"
            />
            <div class="mt-2 text-xs">
              <span class="text-gray-500">typeof {{ typeofInput || '...' }} = </span>
              <span class="font-mono font-bold text-yellow-600">{{ computedTypeof }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{{ typeCode }}</pre>
        </div>
      </div>
    </div>

    <!-- Tab 3: 函数 -->
    <div v-else-if="activeTab === 'functions'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '函数定义方式' : 'Function Definitions' }}</h4>
            
            <div class="space-y-3">
              <button
                v-for="fn in functionTypes"
                :key="fn.id"
                @click="selectedFn = fn.id"
                class="w-full p-3 rounded-lg border text-left transition-all"
                :class="selectedFn === fn.id ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-gray-200 dark:border-gray-700'"
              >
                <span class="font-bold text-yellow-600 dark:text-yellow-400">{{ fn.name }}</span>
                <p class="text-xs text-gray-500 mt-1">{{ isZh ? fn.descZh : fn.descEn }}</p>
              </button>
            </div>
          </div>

          <!-- Sakura Notes Example -->
          <div class="p-4 rounded-2xl border border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/20">
            <p class="text-xs font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)] mb-2">🌸 {{ isZh ? '本站代码示例' : 'From This Site' }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {{ isZh 
                ? '在 composables 中，箭头函数是最常用的写法：' 
                : 'In composables, arrow functions are the most common pattern:' 
              }}
            </p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto">// composables/useSearch.ts
export function useSearch() {
  const buildIndex = () => {
    // 箭头函数，简洁且自动绑定 this
    files.forEach(file => {
      index.add(file.path, file.content);
    });
  };
  
  return { buildIndex };
}</pre>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{{ functionCode }}</pre>
        </div>
      </div>
    </div>

    <!-- Tab 4: 数组与对象 -->
    <div v-else-if="activeTab === 'arrays'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Array Methods Demo -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '常用数组方法' : 'Common Array Methods' }}</h4>
            
            <div class="mb-4">
              <p class="text-xs text-gray-500 mb-2">{{ isZh ? '原始数组:' : 'Original:' }}</p>
              <div class="flex gap-2">
                <span v-for="n in demoArray" :key="n" class="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-mono">{{ n }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <button
                v-for="method in arrayMethods"
                :key="method.id"
                @click="selectedArrayMethod = method.id"
                class="w-full p-2 rounded-lg border text-left transition-all flex justify-between items-center"
                :class="selectedArrayMethod === method.id ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-gray-200 dark:border-gray-700'"
              >
                <span class="font-mono text-sm text-yellow-600 dark:text-yellow-400">.{{ method.id }}()</span>
                <span class="text-xs text-gray-500">{{ isZh ? method.descZh : method.descEn }}</span>
              </button>
            </div>

            <div v-if="arrayResult" class="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">{{ isZh ? '结果:' : 'Result:' }}</p>
              <p class="font-mono text-sm text-green-600 dark:text-green-400">{{ arrayResult }}</p>
            </div>
          </div>

          <!-- Destructuring -->
          <div class="p-4 rounded-2xl border border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/20">
            <p class="text-xs font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)] mb-2">🌸 {{ isZh ? '解构赋值 - 本站示例' : 'Destructuring - From This Site' }}</p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto">// stores/appStore.ts
const { isDark, lang, fontSize } = storeToRefs(appStore);

// composables/useContentRenderer.ts
const { toc, html } = renderMarkdown(content);

// 数组解构
const [first, ...rest] = files;</pre>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{{ arrayCode }}</pre>
        </div>
      </div>
    </div>

    <!-- Tab 5: 流程控制 -->
    <div v-else-if="activeTab === 'flow'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '流程控制语句' : 'Control Flow' }}</h4>
            
            <div class="space-y-2">
              <button
                v-for="flow in flowTypes"
                :key="flow.id"
                @click="selectedFlow = flow.id"
                class="w-full p-3 rounded-lg border text-left transition-all"
                :class="selectedFlow === flow.id ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-gray-200 dark:border-gray-700'"
              >
                <span class="font-mono font-bold text-yellow-600 dark:text-yellow-400">{{ flow.syntax }}</span>
                <p class="text-xs text-gray-500 mt-1">{{ isZh ? flow.descZh : flow.descEn }}</p>
              </button>
            </div>
          </div>

          <!-- Ternary Operator Demo -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '三元运算符演示' : 'Ternary Operator Demo' }}</h4>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="ternaryDemo" class="w-5 h-5 rounded accent-yellow-500" />
                <span class="text-sm">{{ isZh ? '条件为真' : 'Condition true' }}</span>
              </label>
            </div>
            <p class="mt-3 text-sm font-mono">
              <span class="text-gray-500">result = </span>
              <span class="text-yellow-600">{{ ternaryDemo ? '"✅ 真值"' : '"❌ 假值"' }}</span>
            </p>
            <pre class="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded">const result = {{ ternaryDemo }} ? "✅ 真值" : "❌ 假值";</pre>
          </div>

          <!-- Vue Example -->
          <div class="p-4 rounded-2xl border border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/20">
            <p class="text-xs font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)] mb-2">🌸 {{ isZh ? '在 Vue 模板中的应用' : 'In Vue Templates' }}</p>
            <pre v-pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto"><!-- 三元运算符在 :class 中 -->
&lt;button :class="isDark ? 'bg-gray-800' : 'bg-white'"&gt;
  {{ isDark ? '🌙 夜间' : '☀️ 日间' }}
&lt;/button&gt;

<!-- v-for 循环 -->
&lt;div v-for="(item, index) in items" :key="item.id"&gt;
  {{ index + 1 }}. {{ item.name }}
&lt;/div&gt;</pre>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{{ flowCode }}</pre>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{ lang: 'en' | 'zh' }>();
const isZh = computed(() => props.lang === 'zh');

const tabs = computed(() => [
  { id: 'variables', label: isZh.value ? '变量声明' : 'Variables' },
  { id: 'types', label: isZh.value ? '数据类型' : 'Data Types' },
  { id: 'functions', label: isZh.value ? '函数' : 'Functions' },
  { id: 'arrays', label: isZh.value ? '数组与对象' : 'Arrays & Objects' },
  { id: 'flow', label: isZh.value ? '流程控制' : 'Control Flow' }
]);

const activeTab = ref('variables');

// Tab 1: Variables
const selectedVar = ref<'let' | 'const' | 'var'>('const');
const variableTypes = {
  const: {
    recommend: '✅ 推荐',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    descZh: '块级作用域，不可重新赋值。适用于常量和 ref() 变量。',
    descEn: 'Block-scoped, cannot be reassigned. Ideal for constants and ref() variables.'
  },
  let: {
    recommend: '✅ 常用',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    descZh: '块级作用域，可重新赋值。适用于需要修改的变量。',
    descEn: 'Block-scoped, can be reassigned. Use when value needs to change.'
  },
  var: {
    recommend: '⚠️ 避免',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    descZh: '函数作用域，有变量提升问题。现代 JS 中应避免使用。',
    descEn: 'Function-scoped, has hoisting issues. Avoid in modern JS.'
  }
};

const variableCode = computed(() => {
  const examples: Record<string, string> = {
    const: `// const - 推荐用于 Vue ref/reactive
const count = ref(0);
const user = reactive({ name: 'Sakura' });

// ✅ 可以修改 .value 或对象属性
count.value++;
user.name = 'Cherry';

// ❌ 不能重新赋值
// count = ref(1); // TypeError!

// 实际应用 (本站 App.vue)
const isDark = ref(false);
const activeTab = ref('latest');
const searchQuery = ref('');`,

    let: `// let - 用于需要重新赋值的变量
let currentPage = 1;
let totalPages = 10;

// ✅ 可以重新赋值
currentPage = 2;

// 块级作用域
if (true) {
  let innerVar = 'only here';
}
// console.log(innerVar); // ReferenceError!

// for 循环中常用 let
for (let i = 0; i < 5; i++) {
  console.log(i);
}`,

    var: `// var - 避免使用 (有陷阱)
var oldStyle = 'legacy';

// ⚠️ 变量提升问题
console.log(hoisted); // undefined (不报错!)
var hoisted = 'surprise';

// ⚠️ 函数作用域 (不是块级)
if (true) {
  var leaked = 'I leak out!';
}
console.log(leaked); // 'I leak out!' (意外!)

// ⚠️ for 循环陷阱
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 输出: 3, 3, 3 (不是 0, 1, 2)`
  };
  return examples[selectedVar.value];
});

// Tab 2: Data Types
const selectedType = ref('string');
const typeofInput = ref('');

const dataTypes = [
  { name: 'string', icon: '📝', exampleZh: '"Hello"', exampleEn: '"Hello"' },
  { name: 'number', icon: '🔢', exampleZh: '42, 3.14', exampleEn: '42, 3.14' },
  { name: 'boolean', icon: '✅', exampleZh: 'true/false', exampleEn: 'true/false' },
  { name: 'undefined', icon: '❓', exampleZh: '未定义', exampleEn: 'undefined' },
  { name: 'null', icon: '⭕', exampleZh: '空值', exampleEn: 'null' },
  { name: 'symbol', icon: '🔑', exampleZh: '唯一标识', exampleEn: 'unique id' },
  { name: 'bigint', icon: '📊', exampleZh: '大整数', exampleEn: 'big integer' },
  { name: 'object', icon: '📦', exampleZh: '对象/数组', exampleEn: 'object/array' }
];

const computedTypeof = computed(() => {
  const val = typeofInput.value.trim();
  if (!val) return '...';
  try {
    const evaluated = new Function(`return (${val})`)();
    return typeof evaluated;
  } catch {
    return 'syntax error';
  }
});

const typeCode = computed(() => {
  const examples: Record<string, string> = {
    string: `// 字符串 string
const title = "Sakura Notes";
const template = \`Hello, \${name}!\`;  // 模板字符串

// 常用方法
title.length;           // 12
title.toUpperCase();    // "SAKURA NOTES"
title.includes('Saku'); // true
title.split(' ');       // ['Sakura', 'Notes']`,
    number: `// 数字 number
const count = 42;
const price = 19.99;
const negative = -10;

// 特殊值
Infinity;    // 无穷大
NaN;         // Not a Number

// 常用方法
Number.isNaN(NaN);       // true
Number.isInteger(42);    // true
(3.14159).toFixed(2);    // "3.14"`,
    boolean: `// 布尔值 boolean
const isDark = true;
const isLoggedIn = false;

// 在 Vue 中控制显示
<div v-if="isDark">夜间模式</div>
<div v-show="isLoggedIn">用户信息</div>

// 布尔运算
!true;           // false
true && false;   // false
true || false;   // true`,
    undefined: `// undefined - 变量已声明但未赋值
let notAssigned;
console.log(notAssigned); // undefined

// 函数无返回值时
function noReturn() {
  console.log('hi');
}
noReturn(); // 返回 undefined

// 访问不存在的属性
const obj = { name: 'Sakura' };
obj.age; // undefined`,
    null: `// null - 明确表示"空"
let user = null; // 明确为空

// 与 undefined 的区别
typeof null;       // "object" (历史遗留bug)
typeof undefined;  // "undefined"
null == undefined; // true (宽松相等)
null === undefined;// false (严格相等)

// 在 Vue 中重置数据
const selectedFile = ref<File | null>(null);`,
    symbol: `// Symbol - 唯一标识符
const id1 = Symbol('id');
const id2 = Symbol('id');
id1 === id2; // false (永远唯一)

// 用作对象的私有属性键
const privateKey = Symbol('private');
const obj = {
  name: 'public',
  [privateKey]: 'secret'
};`,
    bigint: `// BigInt - 超大整数
const big = 9007199254740991n;
const alsooBig = BigInt(9007199254740991);

// 普通 number 的限制
Number.MAX_SAFE_INTEGER; // 9007199254740991
9007199254740992 === 9007199254740993; // true! (精度丢失)

// BigInt 解决此问题
9007199254740992n === 9007199254740993n; // false`,
    object: `// 对象 object (引用类型)
const user = {
  name: 'Sakura',
  age: 18,
  skills: ['Vue', 'TypeScript']
};

// 访问属性
user.name;        // 'Sakura'
user['age'];      // 18

// 数组也是对象
const arr = [1, 2, 3];
typeof arr;       // 'object'
Array.isArray(arr); // true`
  };
  return examples[selectedType.value] || '';
});

// Tab 3: Functions
const selectedFn = ref('arrow');
const functionTypes = [
  { id: 'declaration', name: 'function 声明', descZh: '传统写法，有函数提升', descEn: 'Traditional, hoisted' },
  { id: 'expression', name: '函数表达式', descZh: '赋值给变量，无提升', descEn: 'Assigned to variable, not hoisted' },
  { id: 'arrow', name: '箭头函数 =>', descZh: 'ES6+, 简洁，自动绑定 this', descEn: 'ES6+, concise, auto-binds this' }
];

const functionCode = computed(() => {
  const examples: Record<string, string> = {
    declaration: `// 函数声明 - 会被提升
sayHello(); // ✅ 可以在声明前调用

function sayHello() {
  console.log('Hello!');
}

// 带参数和返回值
function add(a, b) {
  return a + b;
}

// 默认参数
function greet(name = 'Guest') {
  return \`Hello, \${name}!\`;
}`,
    expression: `// 函数表达式 - 不会提升
// sayHi(); // ❌ ReferenceError!

const sayHi = function() {
  console.log('Hi!');
};

// 可以是匿名或具名
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};`,
    arrow: `// 箭头函数 - Vue 3 最常用 ✨
const double = (x) => x * 2;
const add = (a, b) => a + b;

// 单参数可省略括号
const square = x => x * x;

// 多行需要 {} 和 return
const process = (data) => {
  const result = data.filter(x => x > 0);
  return result.map(x => x * 2);
};

// ✅ 本站示例 (composables/useSearch.ts)
const buildIndex = () => {
  files.forEach(file => {
    index.add(file.path, file.content);
  });
};

// ⚠️ 箭头函数没有自己的 this
const obj = {
  name: 'Sakura',
  // ❌ 箭头函数的 this 指向外层
  arrowFn: () => console.log(this.name),
  // ✅ 普通方法的 this 指向 obj
  normalFn() { console.log(this.name); }
};`
  };
  return examples[selectedFn.value] || '';
});

// Tab 4: Arrays & Objects
const demoArray = ref([1, 2, 3, 4, 5]);
const selectedArrayMethod = ref('map');

const arrayMethods = [
  { id: 'map', descZh: '映射每个元素', descEn: 'Transform each element' },
  { id: 'filter', descZh: '过滤符合条件的', descEn: 'Filter by condition' },
  { id: 'reduce', descZh: '累积计算', descEn: 'Accumulate values' },
  { id: 'find', descZh: '找第一个匹配', descEn: 'Find first match' },
  { id: 'some', descZh: '是否存在匹配', descEn: 'Any match exists?' },
  { id: 'every', descZh: '是否全部匹配', descEn: 'All match?' }
];

const arrayResult = computed(() => {
  const arr = demoArray.value;
  const results: Record<string, string> = {
    map: `[${arr.map((x: number) => x * 2).join(', ')}]`,
    filter: `[${arr.filter((x: number) => x > 2).join(', ')}]`,
    reduce: `${arr.reduce((a: number, b: number) => a + b, 0)}`,
    find: `${arr.find((x: number) => x > 3)}`,
    some: `${arr.some((x: number) => x > 3)}`,
    every: `${arr.every((x: number) => x > 0)}`
  };
  return results[selectedArrayMethod.value];
});

const arrayCode = computed(() => `// 数组方法 - Vue 中大量使用

const numbers = [1, 2, 3, 4, 5];

// .map() - 转换每个元素
numbers.map(x => x * 2);
// → [2, 4, 6, 8, 10]

// .filter() - 过滤元素
numbers.filter(x => x > 2);
// → [3, 4, 5]

// .reduce() - 累积计算
numbers.reduce((sum, x) => sum + x, 0);
// → 15

// .find() - 找第一个匹配
numbers.find(x => x > 3);
// → 4

// .some() / .every() - 条件判断
numbers.some(x => x > 3);  // true
numbers.every(x => x > 0); // true

// 🌸 本站示例 (composables/useSearch.ts)
const filtered = files
  .filter(f => f.name.includes(query))
  .map(f => ({ path: f.path, name: f.name }));

// 解构赋值 - 超实用 ✨
const { name, age } = user;
const [first, ...rest] = array;

// 展开运算符
const newArray = [...oldArray, newItem];
const merged = { ...obj1, ...obj2 };`);

// Tab 5: Flow Control
const selectedFlow = ref('if');
const ternaryDemo = ref(true);

const flowTypes = [
  { id: 'if', syntax: 'if / else', descZh: '条件分支', descEn: 'Conditional branch' },
  { id: 'switch', syntax: 'switch / case', descZh: '多值匹配', descEn: 'Multiple value match' },
  { id: 'for', syntax: 'for / for...of', descZh: '循环遍历', descEn: 'Loop iteration' },
  { id: 'ternary', syntax: '? :', descZh: '三元运算符', descEn: 'Ternary operator' }
];

const flowCode = computed(() => {
  const examples: Record<string, string> = {
    if: `// if / else if / else
const score = 85;

if (score >= 90) {
  console.log('优秀');
} else if (score >= 60) {
  console.log('及格');
} else {
  console.log('不及格');
}

// 简写 (单行可省略 {})
if (isDark) document.body.classList.add('dark');

// 空值判断
if (user?.name) {
  console.log(user.name);
}`,
    switch: `// switch - 适合多个固定值
const tab = 'files';

switch (tab) {
  case 'latest':
    showLatest();
    break;
  case 'files':
    showFiles();
    break;
  case 'lab':
    showLab();
    break;
  default:
    showHome();
}

// 🌸 本站示例 (App.vue)
// 也可以用对象映射代替 switch
const handlers = {
  latest: showLatest,
  files: showFiles,
  lab: showLab
};
handlers[tab]?.();`,
    for: `// for 循环
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// for...of - 遍历可迭代对象 (推荐)
const items = ['a', 'b', 'c'];
for (const item of items) {
  console.log(item);
}

// for...in - 遍历对象键 (注意区别)
const obj = { name: 'Sakura', age: 18 };
for (const key in obj) {
  console.log(key, obj[key]);
}

// .forEach() - 数组方法
items.forEach((item, index) => {
  console.log(index, item);
});`,
    ternary: `// 三元运算符 - Vue 模板中超常用 ✨
const status = isActive ? '活跃' : '离线';

// 嵌套 (不推荐过深)
const level = score >= 90 ? 'A' 
            : score >= 60 ? 'B' 
            : 'C';

// 🌸 Vue 模板中的应用
// :class 动态绑定
<div :class="isDark ? 'bg-gray-900' : 'bg-white'">

// 内容显示
<span>{{ user ? user.name : '游客' }}</span>

// 可选链 + 空值合并
const name = user?.profile?.name ?? '默认名';`
  };
  return examples[selectedFlow.value] || '';
});
</script>
