<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-blue-200 dark:border-blue-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🎨</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'CSS 基础入门' : 'CSS Fundamentals' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '掌握 CSS 核心概念，为学习 Tailwind 打下基础。' : 'Master CSS core concepts, building foundation for Tailwind.' }}
        </p>
      </div>
    </div>

    <!-- Why CSS Matters -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
      <p class="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">💡 {{ isZh ? 'CSS 与 Tailwind 的关系' : 'CSS & Tailwind Relationship' }}</p>
      <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <li>✅ {{ isZh ? 'Tailwind 的工具类本质是 CSS 属性的封装' : 'Tailwind utilities are CSS property wrappers' }}</li>
        <li>✅ {{ isZh ? '理解盒模型才能用好 p-4、m-2 等间距类' : 'Understanding box model helps with p-4, m-2 spacing classes' }}</li>
        <li>✅ {{ isZh ? '掌握定位才能用好 absolute、relative 等工具类' : 'Mastering positioning helps with absolute, relative utilities' }}</li>
      </ul>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
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

    <!-- Tab 1: 选择器 -->
    <div v-if="activeTab === 'selectors'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '选择器类型' : 'Selector Types' }}</h4>
            
            <div class="space-y-2">
              <button
                v-for="sel in selectors"
                :key="sel.id"
                @click="selectedSelector = sel.id"
                class="w-full p-3 rounded-lg border text-left transition-all"
                :class="selectedSelector === sel.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ sel.syntax }}</span>
                  <span class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">{{ isZh ? sel.nameZh : sel.nameEn }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ isZh ? sel.descZh : sel.descEn }}</p>
              </button>
            </div>
          </div>

          <!-- Specificity Calculator -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '优先级计算' : 'Specificity Calculator' }}</h4>
            <div class="grid grid-cols-4 gap-2 text-center text-xs">
              <div class="p-2 rounded bg-red-100 dark:bg-red-900/30">
                <div class="font-bold text-red-600">!important</div>
                <div class="text-gray-500">∞</div>
              </div>
              <div class="p-2 rounded bg-orange-100 dark:bg-orange-900/30">
                <div class="font-bold text-orange-600">style=""</div>
                <div class="text-gray-500">1000</div>
              </div>
              <div class="p-2 rounded bg-yellow-100 dark:bg-yellow-900/30">
                <div class="font-bold text-yellow-600">#id</div>
                <div class="text-gray-500">100</div>
              </div>
              <div class="p-2 rounded bg-green-100 dark:bg-green-900/30">
                <div class="font-bold text-green-600">.class</div>
                <div class="text-gray-500">10</div>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-3">
              {{ isZh ? 'Tailwind 使用工具类 (.class)，优先级低，便于覆盖' : 'Tailwind uses utility classes (.class), low specificity, easy to override' }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto h-[300px]">
            <pre>{{ selectorCode }}</pre>
          </div>

          <!-- Sakura Notes Example -->
          <div class="p-4 rounded-2xl border border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/20">
            <p class="text-xs font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)] mb-2">🌸 {{ isZh ? '本站 Tailwind 对应' : 'Tailwind Equivalent' }}</p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto"><!-- CSS 写法 -->
.btn { padding: 1rem; }
.btn:hover { background: pink; }

<!-- Tailwind 写法 -->
&lt;button class="p-4 hover:bg-[var(--primary-300)]"&gt;
  Click me
&lt;/button&gt;</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: 盒模型 -->
    <div v-else-if="activeTab === 'box'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Interactive Box Model -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '交互式盒模型' : 'Interactive Box Model' }}</h4>
            
            <div class="flex justify-center mb-4">
              <!-- Visual Box Model -->
              <div 
                class="relative bg-orange-200 dark:bg-orange-800/50 transition-all"
                :style="{ padding: `${boxModel.margin}px` }"
              >
                <div class="text-[8px] absolute top-0 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-white/60 dark:bg-gray-900/50 border border-orange-300/60 dark:border-orange-600/60 text-orange-700 dark:text-orange-200">margin</div>
                <div 
                  class="bg-yellow-200 dark:bg-yellow-800/50 transition-all"
                  :style="{ padding: `${boxModel.border}px`, borderWidth: `${boxModel.border}px`, borderColor: '#666', borderStyle: 'solid' }"
                >
                  <div class="text-[8px] absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white/60 dark:bg-gray-900/50 border border-gray-300/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-200">border</div>
                  <div 
                    class="bg-green-200 dark:bg-green-800/50 transition-all"
                    :style="{ padding: `${boxModel.padding}px` }"
                  >
                    <div class="text-[8px] inline-block px-1.5 py-0.5 rounded bg-white/60 dark:bg-gray-900/50 border border-green-300/60 dark:border-green-700/60 text-green-700 dark:text-green-200">padding</div>
                    <div class="w-20 h-12 bg-blue-300 dark:bg-blue-700 flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">
                      content
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Controls -->
            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>margin</span>
                  <span class="font-mono">{{ boxModel.margin }}px → m-{{ boxModel.margin / 4 }}</span>
                </label>
                <input type="range" v-model.number="boxModel.margin" min="0" max="32" step="4" class="w-full accent-orange-500" />
              </div>
              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>border</span>
                  <span class="font-mono">{{ boxModel.border }}px → border-{{ boxModel.border }}</span>
                </label>
                <input type="range" v-model.number="boxModel.border" min="0" max="8" step="1" class="w-full accent-gray-500" />
              </div>
              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>padding</span>
                  <span class="font-mono">{{ boxModel.padding }}px → p-{{ boxModel.padding / 4 }}</span>
                </label>
                <input type="range" v-model.number="boxModel.padding" min="0" max="32" step="4" class="w-full accent-green-500" />
              </div>
            </div>
          </div>

          <!-- box-sizing -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">box-sizing</h4>
            <div class="flex gap-2">
              <button
                @click="boxSizing = 'content-box'"
                class="flex-1 p-2 rounded-lg text-xs font-bold border"
                :class="boxSizing === 'content-box' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300'"
              >
                content-box
              </button>
              <button
                @click="boxSizing = 'border-box'"
                class="flex-1 p-2 rounded-lg text-xs font-bold border"
                :class="boxSizing === 'border-box' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300'"
              >
                border-box ✅
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              {{ boxSizing === 'border-box' 
                ? (isZh ? 'Tailwind 默认使用 border-box，宽度包含 padding 和 border' : 'Tailwind uses border-box by default, width includes padding & border')
                : (isZh ? 'content-box 是浏览器默认值，宽度只是内容区' : 'content-box is browser default, width is content only')
              }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{{ boxCode }}</pre>
          </div>

          <div class="p-4 rounded-2xl border border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/20">
            <p class="text-xs font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)] mb-2">🌸 {{ isZh ? '本站样式示例' : 'From This Site' }}</p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto"><!-- AppHeader.vue -->
&lt;header class="p-4 m-2 border border-[var(--primary-200)]"&gt;
  <!-- p-4 = padding: 1rem (16px) -->
  <!-- m-2 = margin: 0.5rem (8px) -->
  <!-- border = border-width: 1px -->
&lt;/header&gt;

<!-- 响应式间距 -->
&lt;div class="p-2 md:p-4 lg:p-6"&gt;
  <!-- 移动端 8px, 平板 16px, 桌面 24px -->
&lt;/div&gt;</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: 文本与颜色 -->
    <div v-else-if="activeTab === 'text'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Font Controls -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '字体属性' : 'Font Properties' }}</h4>
            
            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-500">font-size</label>
                <div class="flex gap-2 mt-1">
                  <button
                    v-for="size in fontSizes"
                    :key="size.value"
                    @click="textDemo.fontSize = size.value"
                    class="px-2 py-1 rounded text-xs border"
                    :class="textDemo.fontSize === size.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                  >
                    {{ size.label }}
                  </button>
                </div>
              </div>
              
              <div>
                <label class="text-xs text-gray-500">font-weight</label>
                <div class="flex gap-2 mt-1">
                  <button
                    v-for="weight in fontWeights"
                    :key="weight.value"
                    @click="textDemo.fontWeight = weight.value"
                    class="px-2 py-1 rounded text-xs border"
                    :class="textDemo.fontWeight === weight.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                  >
                    {{ weight.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs text-gray-500">color</label>
                <div class="flex gap-2 mt-1">
                  <button
                    v-for="color in textColors"
                    :key="color.value"
                    @click="textDemo.color = color.value"
                    class="w-8 h-8 rounded-full border-2 transition-all"
                    :class="textDemo.color === color.value ? 'border-blue-500 scale-110' : 'border-gray-300'"
                    :style="{ backgroundColor: color.hex }"
                  ></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '预览' : 'Preview' }}</h4>
            <div 
              class="p-4 bg-white dark:bg-gray-900 rounded-lg"
              :style="{ 
                fontSize: textDemo.fontSize, 
                fontWeight: textDemo.fontWeight,
                color: textColors.find(c => c.value === textDemo.color)?.hex 
              }"
            >
              Sakura Notes 🌸
            </div>
            <p class="text-xs text-gray-500 mt-2 font-mono">
              {{ textTailwindClass }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{{ textCode }}</pre>
          </div>

          <!-- Color Formats -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '颜色表示法' : 'Color Formats' }}</h4>
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between">
                <span class="text-gray-500">HEX:</span>
                <span class="text-[var(--primary-500)]">#f472b6</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">RGB:</span>
                <span class="text-[var(--primary-500)]">rgb(244, 114, 182)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">HSL:</span>
                <span class="text-[var(--primary-500)]">hsl(330, 86%, 70%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Tailwind:</span>
                <span class="text-[var(--primary-500)]">text-[var(--primary-400)]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 4: 定位与层叠 -->
    <div v-else-if="activeTab === 'position'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Position Types -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? 'position 属性' : 'Position Property' }}</h4>
            
            <div class="space-y-2">
              <button
                v-for="pos in positions"
                :key="pos.id"
                @click="selectedPosition = pos.id"
                class="w-full p-3 rounded-lg border text-left transition-all"
                :class="selectedPosition === pos.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ pos.id }}</span>
                  <span class="text-xs text-gray-500">{{ pos.tailwind }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ isZh ? pos.descZh : pos.descEn }}</p>
              </button>
            </div>
          </div>

          <!-- Visual Demo -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '定位演示' : 'Position Demo' }}</h4>
            <div class="relative h-40 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              <div class="absolute top-2 left-2 text-[10px] font-mono px-2 py-1 rounded bg-white/70 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300">parent (relative)</div>
              
              <div 
                class="w-16 h-16 bg-[var(--primary-400)] rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all duration-300"
                :class="positionDemoClass"
              >
                child
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2 font-mono">
              {{ positionTailwindClass }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{{ positionCode }}</pre>
          </div>

          <!-- z-index explanation -->
          <div class="p-4 rounded-2xl border border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/20">
            <p class="text-xs font-bold text-[var(--primary-700)] dark:text-[var(--primary-300)] mb-2">🌸 {{ isZh ? '本站定位示例' : 'From This Site' }}</p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto"><!-- SearchModal.vue - 模态框 -->
&lt;div class="fixed inset-0 z-50"&gt;
  <!-- fixed: 相对视口定位 -->
  <!-- inset-0: top/right/bottom/left: 0 -->
  <!-- z-50: 最高层级 -->
&lt;/div&gt;

<!-- AppHeader.vue - 固定头部 -->
&lt;header class="sticky top-0 z-40"&gt;
  <!-- sticky: 滚动时固定 -->
&lt;/header&gt;

<!-- 工具提示 -->
&lt;div class="relative group"&gt;
  &lt;span class="absolute -top-8 opacity-0 
               group-hover:opacity-100"&gt;
    Tooltip
  &lt;/span&gt;
&lt;/div&gt;</pre>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';

const props = defineProps<{ lang: 'en' | 'zh' }>();
const isZh = computed(() => props.lang === 'zh');

const tabs = computed(() => [
  { id: 'selectors', label: isZh.value ? '选择器' : 'Selectors' },
  { id: 'box', label: isZh.value ? '盒模型' : 'Box Model' },
  { id: 'text', label: isZh.value ? '文本与颜色' : 'Text & Color' },
  { id: 'position', label: isZh.value ? '定位与层叠' : 'Position' }
]);

const activeTab = ref('selectors');

// Tab 1: Selectors
const selectedSelector = ref('class');
const selectors = [
  { id: 'element', syntax: 'div', nameZh: '元素选择器', nameEn: 'Element', descZh: '选择所有该标签', descEn: 'Selects all tags' },
  { id: 'class', syntax: '.class', nameZh: '类选择器', nameEn: 'Class', descZh: '最常用，可复用', descEn: 'Most common, reusable' },
  { id: 'id', syntax: '#id', nameZh: 'ID选择器', nameEn: 'ID', descZh: '唯一元素，优先级高', descEn: 'Unique, high specificity' },
  { id: 'attribute', syntax: '[attr]', nameZh: '属性选择器', nameEn: 'Attribute', descZh: '按属性筛选', descEn: 'Filter by attribute' },
  { id: 'pseudo', syntax: ':hover', nameZh: '伪类选择器', nameEn: 'Pseudo-class', descZh: '状态变化', descEn: 'State changes' },
  { id: 'child', syntax: 'A > B', nameZh: '子元素选择器', nameEn: 'Child', descZh: '直接子元素', descEn: 'Direct children' }
];

const selectorCode = computed(() => {
  const examples: Record<string, string> = {
    element: `/* 元素选择器 - 选中所有 <div> */
div {
  margin: 10px;
}

/* Tailwind 不直接支持，需用 @layer */
@layer base {
  h1 { font-size: 2rem; }
}`,
    class: `/* 类选择器 - 最常用 ✨ */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.btn-primary {
  background: #f472b6;
  color: white;
}

/* Tailwind 本质是大量预定义的类 */
/* .p-4 { padding: 1rem; } */
/* .rounded-lg { border-radius: 0.5rem; } */`,
    id: `/* ID 选择器 - 优先级高 */
#app {
  min-height: 100vh;
}

#header {
  position: sticky;
  top: 0;
}

/* ⚠️ 尽量少用 ID 选择器 */
/* 因为优先级太高，难以覆盖 */`,
    attribute: `/* 属性选择器 */
[type="text"] {
  border: 1px solid gray;
}

/* 包含某值 */
[class*="btn"] {
  cursor: pointer;
}

/* 以某值开头 */
[href^="https"] {
  color: green;
}

/* 以某值结尾 */
[src$=".png"] {
  border-radius: 8px;
}`,
    pseudo: `/* 伪类选择器 - 交互状态 */
.btn:hover {
  background: #f9a8d4;
}

.btn:active {
  transform: scale(0.95);
}

.input:focus {
  outline: 2px solid #f472b6;
}

/* Tailwind 写法 */
/* hover:bg-[var(--primary-300)] */
/* active:scale-95 */
/* focus:outline-[var(--primary-500)] */`,
    child: `/* 组合选择器 */

/* 后代选择器 (所有后代) */
.card p { color: gray; }

/* 子元素选择器 (直接子元素) */
.list > li { border-bottom: 1px solid; }

/* 相邻兄弟选择器 */
h2 + p { margin-top: 0; }

/* Tailwind 用 group/peer 模拟 */
/* group-hover:opacity-100 */`
  };
  return examples[selectedSelector.value] || '';
});

// Tab 2: Box Model
const boxModel = reactive({
  margin: 16,
  border: 2,
  padding: 16
});
const boxSizing = ref<'content-box' | 'border-box'>('border-box');

const boxCode = computed(() => `/* CSS 盒模型 */

/* 完整写法 */
.box {
  margin: ${boxModel.margin}px;
  border: ${boxModel.border}px solid #666;
  padding: ${boxModel.padding}px;
  width: 200px;
  box-sizing: ${boxSizing.value};
}

/* Tailwind 对应 */
.box {
  @apply m-${boxModel.margin / 4} 
         border-${boxModel.border} 
         p-${boxModel.padding / 4} 
         w-[200px];
}

/* 简写属性 */
margin: 10px 20px;      /* 上下 左右 */
margin: 10px 20px 30px; /* 上 左右 下 */
margin: 10px 20px 30px 40px; /* 上右下左 */

/* Tailwind 分方向 */
mt-4  /* margin-top */
mx-4  /* margin-left + margin-right */
py-2  /* padding-top + padding-bottom */`);

// Tab 3: Text & Color
const textDemo = reactive({
  fontSize: '16px',
  fontWeight: '400',
  color: 'gray'
});

const fontSizes = [
  { value: '12px', label: 'xs' },
  { value: '14px', label: 'sm' },
  { value: '16px', label: 'base' },
  { value: '20px', label: 'xl' },
  { value: '24px', label: '2xl' }
];

const fontWeights = [
  { value: '400', label: 'normal' },
  { value: '500', label: 'medium' },
  { value: '700', label: 'bold' }
];

const textColors = [
  { value: 'gray', hex: '#6b7280' },
  { value: 'primary', hex: 'var(--primary-500)' },
  { value: 'blue', hex: '#3b82f6' },
  { value: 'green', hex: '#22c55e' }
];

const textTailwindClass = computed(() => {
  const sizeMap: Record<string, string> = {
    '12px': 'text-xs',
    '14px': 'text-sm',
    '16px': 'text-base',
    '20px': 'text-xl',
    '24px': 'text-2xl'
  };
  const weightMap: Record<string, string> = {
    '400': 'font-normal',
    '500': 'font-medium',
    '700': 'font-bold'
  };
  const colorMap: Record<string, string> = {
    gray: 'text-gray-500',
    primary: 'text-[var(--primary-400)]',
    blue: 'text-blue-500',
    green: 'text-green-500'
  };
  return `${sizeMap[textDemo.fontSize]} ${weightMap[textDemo.fontWeight]} ${colorMap[textDemo.color]}`;
});

const textCode = computed(() => `/* 文本样式 */

/* 字体大小 */
font-size: 16px;        /* Tailwind: text-base */
font-size: 1.25rem;     /* Tailwind: text-xl */

/* 字体粗细 */
font-weight: 400;       /* Tailwind: font-normal */
font-weight: 700;       /* Tailwind: font-bold */

/* 颜色 */
color: var(--primary-400); /* Tailwind: text-[var(--primary-400)] */
background: var(--primary-50); /* Tailwind: bg-[var(--primary-50)] */

/* 文本对齐 */
text-align: center;     /* Tailwind: text-center */
text-align: justify;    /* Tailwind: text-justify */

/* 行高 */
line-height: 1.5;       /* Tailwind: leading-normal */
line-height: 2;         /* Tailwind: leading-loose */

/* 本站颜色系统 (index.html) */
/* primary: {
  50: 'var(--primary-50)',
  100: 'var(--primary-100)',
  ...
  500: 'var(--primary-500)',  // 主色调
  ...
} */`);

// Tab 4: Position
const selectedPosition = ref('relative');
const positions = [
  { id: 'static', tailwind: '(default)', descZh: '默认值，按文档流排列', descEn: 'Default, normal flow' },
  { id: 'relative', tailwind: 'relative', descZh: '相对自身偏移，保留占位', descEn: 'Offset from self, keeps space' },
  { id: 'absolute', tailwind: 'absolute', descZh: '相对定位祖先，脱离文档流', descEn: 'Relative to positioned ancestor' },
  { id: 'fixed', tailwind: 'fixed', descZh: '相对视口，滚动时固定', descEn: 'Relative to viewport, stays on scroll' },
  { id: 'sticky', tailwind: 'sticky', descZh: '滚动到阈值时固定', descEn: 'Sticks when scrolled to threshold' }
];

const positionDemoClass = computed(() => {
  const classes: Record<string, string> = {
    static: '',
    relative: 'relative top-4 left-4',
    absolute: 'absolute bottom-4 right-4',
    fixed: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    sticky: 'sticky top-0'
  };
  return classes[selectedPosition.value];
});

const positionTailwindClass = computed(() => {
  const classes: Record<string, string> = {
    static: 'class=""',
    relative: 'class="relative top-4 left-4"',
    absolute: 'class="absolute bottom-4 right-4"',
    fixed: 'class="fixed inset-0" 或 "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"',
    sticky: 'class="sticky top-0"'
  };
  return classes[selectedPosition.value];
});

const positionCode = computed(() => {
  const examples: Record<string, string> = {
    static: `/* static - 默认值 */
.element {
  position: static;
  /* top/left/right/bottom 无效 */
}

/* 按照正常文档流排列 */`,
    relative: `/* relative - 相对定位 */
.element {
  position: relative;
  top: 16px;    /* 向下偏移 */
  left: 16px;   /* 向右偏移 */
}

/* Tailwind */
class="relative top-4 left-4"

/* 特点：
   1. 相对自身原位置偏移
   2. 原位置仍占据空间
   3. 常作为 absolute 子元素的参照 */`,
    absolute: `/* absolute - 绝对定位 */
.parent {
  position: relative; /* 必须! */
}

.child {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

/* Tailwind */
class="absolute bottom-4 right-4"

/* 特点：
   1. 脱离文档流
   2. 相对最近的定位祖先
   3. 常用于徽标、关闭按钮 */`,
    fixed: `/* fixed - 固定定位 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
}

/* Tailwind */
class="fixed inset-0 z-50"

/* 居中技巧 */
class="fixed top-1/2 left-1/2 
       -translate-x-1/2 -translate-y-1/2"

/* 特点：相对视口，滚动不动 */`,
    sticky: `/* sticky - 粘性定位 */
.header {
  position: sticky;
  top: 0;
  z-index: 40;
}

/* Tailwind */
class="sticky top-0 z-40"

/* 特点：
   1. 正常流动直到到达阈值
   2. 到达阈值后固定
   3. 父容器滚出视口后恢复 */

/* 本站 AppHeader.vue 使用 sticky */`
  };
  return examples[selectedPosition.value] || '';
});
</script>
