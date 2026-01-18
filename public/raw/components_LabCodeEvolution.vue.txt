<template>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-gray-700 shadow-2xl relative overflow-hidden">
    
    <!-- Background Decoration -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-sakura-200/30 to-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
    
    <!-- Header -->
    <div class="text-center mb-8 relative z-10">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">{{ t.evo_title }}</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto">{{ t.evo_desc }}</p>
    </div>

    <!-- Evolution Timeline -->
    <div class="flex justify-center mb-8 overflow-x-auto pb-2">
      <div class="flex items-center gap-0 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <button 
          v-for="(stage, idx) in stages" 
          :key="stage.id"
          @click="currentStage = stage.id"
          class="relative px-4 md:px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 flex flex-col items-center gap-1 min-w-[80px]"
          :class="currentStage === stage.id 
            ? stage.bgActive + ' text-white shadow-lg transform scale-105' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
        >
          <span class="text-lg md:text-xl">{{ stage.icon }}</span>
          <span>{{ stage.label }}</span>
          <span class="text-[10px] opacity-70">{{ stage.tech }}</span>
          
          <!-- Arrow -->
          <div v-if="idx < stages.length - 1" class="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 z-10">→</div>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      <!-- Code Panel -->
      <div class="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
        <!-- File Tabs -->
        <div class="flex items-center gap-1 px-4 py-2 bg-[#252526] border-b border-gray-700 overflow-x-auto">
          <div 
            v-for="file in currentFiles" 
            :key="file.name"
            @click="activeFile = file.name"
            class="px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap"
            :class="activeFile === file.name 
              ? 'bg-[#1e1e1e] text-white border-t-2 border-blue-500' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-300'"
          >
            <span>{{ file.icon }}</span>
            {{ file.name }}
            <span v-if="file.isNew" class="bg-green-500 text-white text-[8px] px-1 rounded">NEW</span>
          </div>
        </div>
        
        <!-- Code Content -->
        <div class="flex-1 overflow-auto custom-scrollbar p-4 min-h-[400px] max-h-[500px]">
          <pre class="font-mono text-xs md:text-sm leading-relaxed text-slate-100 bg-[#0f172a] rounded-xl border border-slate-700/70 p-4 shadow-inner">
            <code v-html="highlightedCode"></code>
          </pre>
        </div>
        
        <!-- Code Stats -->
        <div class="px-4 py-2 bg-[#252526] border-t border-gray-700 flex justify-between text-[10px] text-gray-500 dark:text-gray-300">
          <span>{{ lineCount }} lines</span>
          <span>{{ currentStageData.tech }}</span>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Browser Chrome -->
        <div class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-500 font-mono mx-2">
            localhost:5173/counter
          </div>
        </div>
        
        <!-- Live Preview -->
        <div class="flex-1 p-6 flex items-center justify-center min-h-[350px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          
          <!-- Stage 1: Pure HTML -->
          <div v-if="currentStage === 'html'" class="text-center animate-fade-in text-gray-800 dark:text-gray-100 space-y-3">
            <div class="text-2xl md:text-3xl font-bold">Counter</div>
            <div class="text-5xl md:text-6xl font-extrabold tracking-tight">0</div>
            <div class="flex justify-center gap-3">
              <span class="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-500 rounded-lg bg-white/90 dark:bg-gray-700/70 shadow-sm">-1</span>
              <span class="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-500 rounded-lg bg-white/90 dark:bg-gray-700/70 shadow-sm">+1</span>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-300">{{ t.evo_html_note }}</div>
          </div>

          <!-- Stage 2: HTML + CSS -->
          <div v-else-if="currentStage === 'css'" class="text-center animate-fade-in">
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-xl max-w-xs">
              <div class="text-2xl font-bold mb-4">Counter</div>
              <div class="text-5xl font-bold mb-6">0</div>
              <div class="flex justify-center gap-3">
                <span class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">-</span>
                <span class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">+</span>
              </div>
            </div>
            <div class="text-gray-400 text-xs mt-4">{{ t.evo_css_note }}</div>
          </div>

          <!-- Stage 3: HTML + CSS + JS -->
          <div v-else-if="currentStage === 'js'" class="text-center animate-fade-in">
            <div class="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-8 rounded-2xl shadow-xl max-w-xs">
              <div class="text-2xl font-bold mb-4">Counter</div>
              <div class="text-5xl font-bold mb-6 transition-all" :class="{'scale-125': jsAnimating}">{{ jsCount }}</div>
              <div class="flex justify-center gap-3">
                <button @click="jsDecrement" class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-xl font-bold transition-all active:scale-90">-</button>
                <button @click="jsIncrement" class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-xl font-bold transition-all active:scale-90">+</button>
              </div>
            </div>
            <div class="text-green-500 text-xs mt-4 font-bold">✨ {{ t.evo_js_note }}</div>
          </div>

          <!-- Stage 4: Vue -->
          <div v-else-if="currentStage === 'vue'" class="text-center animate-fade-in">
            <div class="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-8 rounded-2xl shadow-xl max-w-xs relative overflow-hidden">
              <!-- Vue Reactive Indicator -->
              <div class="absolute top-2 right-2 flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-[10px]">
                <span class="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                Reactive
              </div>
              
              <div class="text-2xl font-bold mb-4">Counter</div>
              <div class="text-5xl font-bold mb-2 transition-all" :class="{'scale-125 text-yellow-300': vueAnimating}">{{ vueCount }}</div>
              <div class="text-xs opacity-70 mb-4">{{ vueCount % 2 === 0 ? t.evo_even : t.evo_odd }} · {{ vueCount >= 0 ? t.evo_positive : t.evo_negative }}</div>
              <div class="flex justify-center gap-3">
                <button @click="vueDecrement" class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-xl font-bold transition-all active:scale-90">-</button>
                <button @click="vueReset" class="px-4 h-12 rounded-full bg-white/20 hover:bg-white/30 text-sm font-bold transition-all active:scale-90">Reset</button>
                <button @click="vueIncrement" class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-xl font-bold transition-all active:scale-90">+</button>
              </div>
            </div>
            <div class="text-emerald-500 text-xs mt-4 font-bold">🚀 {{ t.evo_vue_note }}</div>
          </div>

        </div>
        
        <!-- Feature Comparison -->
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap gap-2 justify-center">
            <span 
              v-for="feature in currentStageData.features" 
              :key="feature"
              class="text-[10px] px-2 py-1 rounded-full font-bold"
              :class="currentStageData.featureClass"
            >
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Explanation Card -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- What Changed -->
        <div class="flex-1">
          <div class="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <span class="text-xl">{{ currentStageData.icon }}</span>
            {{ currentStageData.label }} {{ t.evo_what_changed }}
          </div>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li v-for="point in currentStageData.explanations" :key="point" class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">✓</span>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>
        
        <!-- Problem Solved -->
        <div class="flex-1 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
          <div class="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <span class="text-xl">🎯</span>
            {{ t.evo_problem_solved }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ currentStageData.problemSolved }}</div>
        </div>
      </div>
    </div>

    <!-- Learning Path Summary -->
    <div class="mt-6 text-center">
      <div class="inline-flex items-center gap-2 bg-gradient-to-r from-sakura-100 to-blue-100 dark:from-sakura-900/30 dark:to-blue-900/30 px-6 py-3 rounded-full text-sm flex-wrap justify-center">
        <span class="font-bold text-gray-700 dark:text-gray-300">{{ t.evo_summary }}:</span>
        <span class="text-orange-600 dark:text-orange-400">HTML</span>
        <span class="text-gray-400">→</span>
        <span class="text-blue-600 dark:text-blue-400">+CSS</span>
        <span class="text-gray-400">→</span>
        <span class="text-yellow-600 dark:text-yellow-400">+JS</span>
        <span class="text-gray-400">→</span>
        <span class="text-emerald-600 dark:text-emerald-400">Vue</span>
        <span class="text-gray-400">=</span>
        <span class="font-bold text-sakura-600 dark:text-sakura-400">🚀 Modern Web App</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

type StageId = 'html' | 'css' | 'js' | 'vue';
const currentStage = ref<StageId>('html');
const activeFile = ref('index.html');

// JS Demo State
const jsCount = ref(0);
const jsAnimating = ref(false);
const jsIncrement = () => {
  jsCount.value++;
  jsAnimating.value = true;
  setTimeout(() => jsAnimating.value = false, 150);
};
const jsDecrement = () => {
  jsCount.value--;
  jsAnimating.value = true;
  setTimeout(() => jsAnimating.value = false, 150);
};

// Vue Demo State
const vueCount = ref(0);
const vueAnimating = ref(false);
const vueIncrement = () => {
  vueCount.value++;
  vueAnimating.value = true;
  setTimeout(() => vueAnimating.value = false, 150);
};
const vueDecrement = () => {
  vueCount.value--;
  vueAnimating.value = true;
  setTimeout(() => vueAnimating.value = false, 150);
};
const vueReset = () => {
  vueCount.value = 0;
  vueAnimating.value = true;
  setTimeout(() => vueAnimating.value = false, 150);
};

const stages = computed(() => [
  { id: 'html' as const, icon: '🦴', label: 'HTML', tech: t.value.evo_stage_html, bgActive: 'bg-orange-500' },
  { id: 'css' as const, icon: '🎨', label: '+CSS', tech: t.value.evo_stage_css, bgActive: 'bg-blue-500' },
  { id: 'js' as const, icon: '⚡', label: '+JS', tech: t.value.evo_stage_js, bgActive: 'bg-yellow-500' },
  { id: 'vue' as const, icon: '🥝', label: 'Vue', tech: t.value.evo_stage_vue, bgActive: 'bg-emerald-500' },
]);

// Build code strings programmatically to avoid template parsing issues
const htmlIndexCode = `<!DOCTYPE html>
<html>
<head>
  <title>Counter App</title>
</head>
<body>

  <h1>Counter</h1>
  <p id="count">0</p>
  <button>-1</button>
  <button>+1</button>

</body>
</html>`;

const cssIndexCode = `<!DOCTYPE html>
<html>
<head>
  <title>Counter App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="card">
    <h1>Counter</h1>
    <p id="count">0</p>
    <div class="buttons">
      <button class="btn">-</button>
      <button class="btn">+</button>
    </div>
  </div>

</body>
</html>`;

const cssStyleCode = `/* 卡片容器样式 */
.card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

/* 数字显示样式 */
#count {
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
}

/* 按钮样式 */
.btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.2);
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.1);
}`;

const jsIndexCode = `<!DOCTYPE html>
<html>
<head>
  <title>Counter App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="card">
    <h1>Counter</h1>
    <p id="count">0</p>
    <div class="buttons">
      <button class="btn" onclick="decrement()">-</button>
      <button class="btn" onclick="increment()">+</button>
    </div>
  </div>

  <script src="app.js"><\/script>
</body>
</html>`;

const jsStyleCode = `/* 与上一阶段相同的 CSS */
.card {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  /* ... 其他样式保持不变 */
}`;

const jsAppCode = `// ==========================================
// 原生 JavaScript 实现计数器
// ==========================================

// 1. 定义数据（状态）
let count = 0;

// 2. 获取 DOM 元素
const countDisplay = document.getElementById('count');

// 3. 定义更新函数
function updateDisplay() {
  countDisplay.textContent = count;
}

// 4. 定义事件处理函数
function increment() {
  count = count + 1;   // 修改数据
  updateDisplay();      // 手动更新 DOM
}

function decrement() {
  count = count - 1;   // 修改数据
  updateDisplay();      // 手动更新 DOM
}

// ⚠️ 问题：每次修改数据后，必须手动调用 updateDisplay()
// 如果忘记调用，页面就不会更新！`;

const vueCounterCode = `<template>
  <!-- 模板：定义 UI 结构 -->
  <div class="card">
    <h1>Counter</h1>
    
    <!-- {{ }} 自动绑定数据，数据变化时自动更新 -->
    <p class="count">{{ count }}</p>
    
    <!-- 计算属性：自动根据 count 计算 -->
    <p class="info">
      {{ count % 2 === 0 ? '偶数' : '奇数' }}
    </p>
    
    <div class="buttons">
      <!-- @click 绑定事件 -->
      <button @click="count--">-</button>
      <button @click="count = 0">Reset</button>
      <button @click="count++">+</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ✨ 响应式数据：修改后自动更新 DOM！
const count = ref(0)

// 不需要手动调用 updateDisplay()
// Vue 会自动追踪 count 的变化并更新页面
<\/script>

<style scoped>
/* 样式只作用于当前组件 */
.card {
  background: linear-gradient(135deg, #10b981, #14b8a6);
  /* ... */
}
</style>`;

interface FileInfo {
  name: string;
  icon: string;
  isNew: boolean;
}

interface StageCodeData {
  files: FileInfo[];
  code: Record<string, string>;
}

const codeFiles: Record<StageId, StageCodeData> = {
  html: {
    files: [{ name: 'index.html', icon: '📄', isNew: false }],
    code: { 'index.html': htmlIndexCode }
  },
  css: {
    files: [
      { name: 'index.html', icon: '📄', isNew: false },
      { name: 'style.css', icon: '🎨', isNew: true }
    ],
    code: { 'index.html': cssIndexCode, 'style.css': cssStyleCode }
  },
  js: {
    files: [
      { name: 'index.html', icon: '📄', isNew: false },
      { name: 'style.css', icon: '🎨', isNew: false },
      { name: 'app.js', icon: '⚡', isNew: true }
    ],
    code: { 'index.html': jsIndexCode, 'style.css': jsStyleCode, 'app.js': jsAppCode }
  },
  vue: {
    files: [{ name: 'Counter.vue', icon: '🥝', isNew: true }],
    code: { 'Counter.vue': vueCounterCode }
  }
};

const currentFiles = computed(() => codeFiles[currentStage.value].files);

// Reset active file when stage changes
watch(currentStage, () => {
  const files = codeFiles[currentStage.value].files;
  const newFile = files.find(f => f.isNew);
  activeFile.value = newFile ? newFile.name : files[0].name;
});

const currentFileContent = computed(() => {
  const stageCode = codeFiles[currentStage.value].code;
  return stageCode[activeFile.value] || '';
});

const lineCount = computed(() => currentFileContent.value.split('\n').length);

// Simple syntax highlighting
const highlightedCode = computed(() => {
  let code = currentFileContent.value;
  
  // Escape HTML entities
  code = code.replace(/&/g, '&amp;');
  code = code.replace(/</g, '&lt;');
  code = code.replace(/>/g, '&gt;');
  
  // Comments
  code = code.replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
  code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
  code = code.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-gray-500">$1</span>');
  
  // HTML tags
  code = code.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="text-pink-400">$2</span>');
  code = code.replace(/(&lt;!DOCTYPE)/g, '<span class="text-gray-500">&lt;!DOCTYPE</span>');
  
  // Strings
  code = code.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="text-green-400">"$1"</span>');
  code = code.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="text-green-400">\'$1\'</span>');
  
  // JS keywords
  const jsKeywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'import', 'from', 'export'];
  jsKeywords.forEach(kw => {
    code = code.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="text-purple-400">$1</span>');
  });
  
  // CSS properties
  code = code.replace(/^(\s*)([\w-]+)(:)/gm, '$1<span class="text-blue-300">$2</span>$3');
  
  // Numbers
  code = code.replace(/\b(\d+(?:\.\d+)?)(rem|px|%|deg|s)?\b/g, '<span class="text-orange-300">$1$2</span>');
  
  return code;
});

const currentStageData = computed(() => {
  const isZh = props.lang === 'zh';
  
  const data: Record<StageId, {
    icon: string;
    label: string;
    tech: string;
    features: string[];
    featureClass: string;
    explanations: string[];
    problemSolved: string;
  }> = {
    html: {
      icon: '🦴',
      label: 'HTML',
      tech: 'HTML5',
      features: isZh ? ['结构定义', '语义化标签', '内容组织'] : ['Structure', 'Semantic Tags', 'Content'],
      featureClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      explanations: isZh ? [
        'HTML 定义了页面的"骨架"和内容结构',
        '每个元素都有语义：h1 是标题，p 是段落，button 是按钮',
        '浏览器提供默认样式，但非常简陋',
        '按钮点击无任何反应（没有行为）'
      ] : [
        'HTML defines the "skeleton" and content structure',
        'Each element has semantics: h1 for title, p for paragraph',
        'Browser provides default styling, but very basic',
        'Button clicks do nothing (no behavior)'
      ],
      problemSolved: isZh 
        ? '解决了"页面上有什么"的问题。但页面很丑，而且点击按钮没有任何反应。'
        : 'Solves "what is on the page". But it looks ugly and buttons do nothing.'
    },
    css: {
      icon: '🎨',
      label: '+CSS',
      tech: 'CSS3',
      features: isZh ? ['视觉美化', '布局控制', '动画效果'] : ['Visual Styling', 'Layout', 'Animations'],
      featureClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      explanations: isZh ? [
        'CSS 为 HTML 元素添加"皮肤"和样式',
        '可以控制颜色、字体、间距、布局',
        '支持渐变、阴影、圆角等现代效果',
        '通过 transition 添加过渡动画'
      ] : [
        'CSS adds "skin" and styling to HTML elements',
        'Controls colors, fonts, spacing, layout',
        'Supports gradients, shadows, rounded corners',
        'Adds transition animations'
      ],
      problemSolved: isZh
        ? '解决了"页面长什么样"的问题。现在页面很漂亮了，但按钮点击还是没有反应。'
        : 'Solves "how the page looks". Now beautiful, but buttons still do nothing.'
    },
    js: {
      icon: '⚡',
      label: '+JS',
      tech: 'JavaScript',
      features: isZh ? ['用户交互', '数据处理', 'DOM操作'] : ['Interaction', 'Data', 'DOM'],
      featureClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      explanations: isZh ? [
        'JavaScript 为页面添加"行为"和交互',
        '定义变量存储数据（let count = 0）',
        '监听用户事件（onclick）',
        '通过 DOM API 手动更新页面内容'
      ] : [
        'JavaScript adds "behavior" and interactivity',
        'Define variables to store data',
        'Listen to user events (onclick)',
        'Manually update page via DOM API'
      ],
      problemSolved: isZh
        ? '解决了"页面能做什么"的问题。但问题是：每次修改数据后，必须手动调用函数更新 DOM，代码繁琐且容易出错。'
        : 'Solves "what the page can do". But every data change requires manual DOM updates.'
    },
    vue: {
      icon: '🥝',
      label: 'Vue',
      tech: 'Vue 3',
      features: isZh ? ['响应式数据', '自动更新', '组件化'] : ['Reactive', 'Auto Update', 'Components'],
      featureClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      explanations: isZh ? [
        '使用 ref() 创建响应式数据',
        '数据变化时，Vue 自动更新 DOM',
        '模板语法 {{ }} 直接绑定数据',
        '单文件组件整合 HTML/CSS/JS'
      ] : [
        'Use ref() to create reactive data',
        'Vue auto-updates DOM when data changes',
        'Template {{ }} binds data directly',
        'SFC combines HTML/CSS/JS'
      ],
      problemSolved: isZh
        ? '解决了"数据和视图同步"的问题。开发者只需关心数据逻辑，Vue 自动处理 DOM 更新！'
        : 'Solves data-view sync. Focus on data, Vue handles DOM updates!'
    }
  };
  
  return data[currentStage.value];
});
</script>
