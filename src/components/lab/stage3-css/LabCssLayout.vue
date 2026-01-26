<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-purple-200 dark:border-purple-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">📐</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'CSS 布局系统' : 'CSS Layout Systems' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '掌握 Flexbox 和 Grid，轻松构建任何布局。' : 'Master Flexbox and Grid to build any layout with ease.' }}
        </p>
      </div>
    </div>

    <!-- Why Layout Matters -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-6">
      <p class="text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">💡 {{ isZh ? '本站布局分析' : 'This Site\'s Layout' }}</p>
      <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <li>🏠 {{ isZh ? '整体结构：Flex 垂直排列 (header + main + footer)' : 'Overall: Flex column (header + main + footer)' }}</li>
        <li>📱 {{ isZh ? '侧边栏：Flex + 响应式隐藏 (md:flex)' : 'Sidebar: Flex + responsive hide (md:flex)' }}</li>
        <li>🃏 {{ isZh ? '卡片网格：Grid auto-fill 自适应列数' : 'Card grid: Grid auto-fill adaptive columns' }}</li>
      </ul>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-300'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 1: Flexbox -->
    <div v-if="activeTab === 'flex'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Flex Container Controls -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '容器属性' : 'Container Properties' }}</h4>
            
            <div class="space-y-4">
              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>flex-direction</span>
                  <span class="font-mono text-purple-600">{{ flexDemo.direction }}</span>
                </label>
                <div class="flex gap-2 mt-1">
                  <button
                    v-for="dir in ['row', 'row-reverse', 'column', 'column-reverse']"
                    :key="dir"
                    @click="flexDemo.direction = dir"
                    class="px-2 py-1 rounded text-xs border"
                    :class="flexDemo.direction === dir ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-300'"
                  >
                    {{ dir }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>justify-content</span>
                  <span class="font-mono text-purple-600">{{ flexDemo.justify }}</span>
                </label>
                <div class="flex flex-wrap gap-2 mt-1">
                  <button
                    v-for="j in ['flex-start', 'center', 'flex-end', 'space-between', 'space-around']"
                    :key="j"
                    @click="flexDemo.justify = j"
                    class="px-2 py-1 rounded text-xs border"
                    :class="flexDemo.justify === j ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-300'"
                  >
                    {{ j.replace('flex-', '') }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>align-items</span>
                  <span class="font-mono text-purple-600">{{ flexDemo.align }}</span>
                </label>
                <div class="flex gap-2 mt-1">
                  <button
                    v-for="a in ['flex-start', 'center', 'flex-end', 'stretch']"
                    :key="a"
                    @click="flexDemo.align = a"
                    class="px-2 py-1 rounded text-xs border"
                    :class="flexDemo.align === a ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-300'"
                  >
                    {{ a.replace('flex-', '') }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>gap</span>
                  <span class="font-mono text-purple-600">{{ flexDemo.gap }}px</span>
                </label>
                <input type="range" v-model.number="flexDemo.gap" min="0" max="32" step="4" class="w-full accent-purple-500" />
              </div>
            </div>
          </div>

          <!-- Visual Demo -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '预览' : 'Preview' }}</h4>
            <div class="h-40 bg-gray-100 dark:bg-gray-900 rounded-lg p-2 flex transition-all" :style="flexPreviewStyle">
              <div class="w-12 h-12 bg-sakura-400 rounded-lg flex items-center justify-center text-white font-bold">1</div>
              <div class="w-16 h-10 bg-purple-400 rounded-lg flex items-center justify-center text-white font-bold">2</div>
              <div class="w-10 h-14 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">3</div>
            </div>
            <p class="text-xs text-gray-500 mt-2 font-mono">
              class="flex {{ flexTailwindClass }}"
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto h-[280px]">
            <pre>{{ flexCode }}</pre>
          </div>

          <!-- Sakura Notes Example -->
          <div class="p-4 rounded-2xl border border-sakura-200 dark:border-sakura-700 bg-sakura-50/50 dark:bg-sakura-900/20">
            <p class="text-xs font-bold text-sakura-700 dark:text-sakura-300 mb-2">🌸 {{ isZh ? '本站 Flex 应用' : 'Flex Usage in This Site' }}</p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto"><!-- AppHeader.vue - 头部布局 -->
&lt;header class="flex items-center justify-between px-4"&gt;
  &lt;Logo /&gt;
  &lt;nav class="flex gap-4"&gt;...&lt;/nav&gt;
  &lt;Settings /&gt;
&lt;/header&gt;

<!-- 垂直居中 + 水平分散 -->
&lt;div class="flex items-center justify-between"&gt;

<!-- 完全居中 (常用于 Loading) -->
&lt;div class="flex items-center justify-center h-screen"&gt;</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Grid -->
    <div v-else-if="activeTab === 'grid'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Grid Controls -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '网格属性' : 'Grid Properties' }}</h4>
            
            <div class="space-y-4">
              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>grid-template-columns</span>
                  <span class="font-mono text-purple-600">{{ gridDemo.cols }} {{ isZh ? '列' : 'cols' }}</span>
                </label>
                <div class="flex gap-2 mt-1">
                  <button
                    v-for="n in [1, 2, 3, 4]"
                    :key="n"
                    @click="gridDemo.cols = n"
                    class="px-3 py-1 rounded text-xs border"
                    :class="gridDemo.cols === n ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-300'"
                  >
                    {{ n }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs text-gray-500 flex justify-between">
                  <span>gap</span>
                  <span class="font-mono text-purple-600">{{ gridDemo.gap }}px</span>
                </label>
                <input type="range" v-model.number="gridDemo.gap" min="0" max="24" step="4" class="w-full accent-purple-500" />
              </div>

              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="gridDemo.autoFill" id="autofill" class="accent-purple-500" />
                <label for="autofill" class="text-xs text-gray-500">
                  {{ isZh ? '使用 auto-fill (响应式列数)' : 'Use auto-fill (responsive columns)' }}
                </label>
              </div>
            </div>
          </div>

          <!-- Visual Demo -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '预览' : 'Preview' }}</h4>
            <div 
              class="bg-gray-100 dark:bg-gray-900 rounded-lg p-2 grid transition-all min-h-[200px]"
              :style="gridStyle"
            >
              <div v-for="i in 6" :key="i" class="bg-gradient-to-br from-sakura-400 to-purple-400 rounded-lg p-4 flex items-center justify-center text-white font-bold">
                {{ i }}
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2 font-mono">
              class="grid {{ gridTailwindClass }}"
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto h-[280px]">
            <pre>{{ gridCode }}</pre>
          </div>

          <div class="p-4 rounded-2xl border border-sakura-200 dark:border-sakura-700 bg-sakura-50/50 dark:bg-sakura-900/20">
            <p class="text-xs font-bold text-sakura-700 dark:text-sakura-300 mb-2">🌸 {{ isZh ? '本站 Grid 应用' : 'Grid Usage in This Site' }}</p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto"><!-- FolderView.vue - 文章卡片网格 -->
&lt;div class="grid grid-cols-1 md:grid-cols-2 
            lg:grid-cols-3 gap-4"&gt;
  &lt;ArticleCard v-for="article in articles" /&gt;
&lt;/div&gt;

<!-- 响应式自适应列数 -->
&lt;div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4"&gt;

<!-- LabDashboard - 两栏布局 -->
&lt;div class="grid grid-cols-1 xl:grid-cols-2 gap-8"&gt;</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Responsive -->
    <div v-else-if="activeTab === 'responsive'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Breakpoints -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? 'Tailwind 断点' : 'Tailwind Breakpoints' }}</h4>
            
            <div class="space-y-2">
              <div 
                v-for="bp in breakpoints" 
                :key="bp.name"
                class="flex items-center justify-between p-2 rounded-lg"
                :class="currentBreakpoint === bp.name ? 'bg-purple-100 dark:bg-purple-900/30' : ''"
              >
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ bp.icon }}</span>
                  <span class="font-mono font-bold text-purple-600 dark:text-purple-400">{{ bp.name }}:</span>
                </div>
                <div class="text-xs text-gray-500">
                  {{ bp.minWidth }}px {{ bp.name !== 'sm' ? '↑' : '' }}
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p class="text-xs text-blue-700 dark:text-blue-300">
                📱 {{ isZh ? '当前视口宽度:' : 'Current viewport:' }} 
                <span class="font-bold">{{ viewportWidth }}px</span>
                ({{ currentBreakpoint }})
              </p>
            </div>
          </div>

          <!-- Mobile First Explanation -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '移动优先设计' : 'Mobile-First Design' }}</h4>
            <div class="space-y-3 text-xs">
              <div class="p-2 bg-gray-100 dark:bg-gray-900 rounded font-mono">
                <span class="text-gray-500">/* 基础样式 (移动端) */</span><br>
                <span class="text-purple-600">p-2</span>
              </div>
              <div class="text-center text-gray-400">↓ 屏幕变大</div>
              <div class="p-2 bg-gray-100 dark:bg-gray-900 rounded font-mono">
                <span class="text-gray-500">/* 平板 */</span><br>
                <span class="text-purple-600">md:</span>p-4
              </div>
              <div class="text-center text-gray-400">↓ 屏幕更大</div>
              <div class="p-2 bg-gray-100 dark:bg-gray-900 rounded font-mono">
                <span class="text-gray-500">/* 桌面 */</span><br>
                <span class="text-purple-600">lg:</span>p-6
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{{ responsiveCode }}</pre>
          </div>

          <div class="p-4 rounded-2xl border border-sakura-200 dark:border-sakura-700 bg-sakura-50/50 dark:bg-sakura-900/20">
            <p class="text-xs font-bold text-sakura-700 dark:text-sakura-300 mb-2">🌸 {{ isZh ? '本站响应式示例' : 'Responsive Examples' }}</p>
            <pre class="text-xs font-mono bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto"><!-- AppSidebar.vue - 移动端隐藏 -->
&lt;aside class="hidden md:flex w-64"&gt;
  <!-- 移动端隐藏，平板以上显示 -->
&lt;/aside&gt;

<!-- 响应式文字大小 -->
&lt;h1 class="text-xl md:text-2xl lg:text-3xl"&gt;

<!-- 响应式网格列数 -->
&lt;div class="grid grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4"&gt;

<!-- 响应式间距 -->
&lt;div class="p-4 md:p-6 lg:p-8"&gt;</pre>
          </div>

          <!-- Common Patterns -->
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '常见响应式模式' : 'Common Patterns' }}</h4>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-500">{{ isZh ? '隐藏/显示' : 'Hide/Show' }}</span>
                <span class="font-mono text-purple-600">hidden md:block</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">{{ isZh ? '堆叠→行' : 'Stack→Row' }}</span>
                <span class="font-mono text-purple-600">flex-col md:flex-row</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">{{ isZh ? '全宽→固定' : 'Full→Fixed' }}</span>
                <span class="font-mono text-purple-600">w-full md:w-96</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onUnmounted, type CSSProperties } from 'vue';

const props = defineProps<{ lang: 'en' | 'zh' }>();
const isZh = computed(() => props.lang === 'zh');

const tabs = computed(() => [
  { id: 'flex', label: 'Flexbox' },
  { id: 'grid', label: 'Grid' },
  { id: 'responsive', label: isZh.value ? '响应式' : 'Responsive' }
]);

const activeTab = ref('flex');

// Tab 1: Flexbox
const flexDemo = reactive({
  direction: 'row' as string,
  justify: 'flex-start' as string,
  align: 'center' as string,
  gap: 8
});

const flexTailwindClass = computed(() => {
  const dirMap: Record<string, string> = {
    'row': '',
    'row-reverse': 'flex-row-reverse',
    'column': 'flex-col',
    'column-reverse': 'flex-col-reverse'
  };
  const justifyMap: Record<string, string> = {
    'flex-start': 'justify-start',
    'center': 'justify-center',
    'flex-end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around'
  };
  const alignMap: Record<string, string> = {
    'flex-start': 'items-start',
    'center': 'items-center',
    'flex-end': 'items-end',
    'stretch': 'items-stretch'
  };
  const gapClass = `gap-${flexDemo.gap / 4}`;
  return [dirMap[flexDemo.direction], justifyMap[flexDemo.justify], alignMap[flexDemo.align], gapClass].filter(Boolean).join(' ');
});

const flexCode = computed(() => `/* Flexbox 容器属性 */

.container {
  display: flex;
  flex-direction: ${flexDemo.direction};
  justify-content: ${flexDemo.justify};
  align-items: ${flexDemo.align};
  gap: ${flexDemo.gap}px;
}

/* Tailwind 写法 */
class="flex ${flexTailwindClass.value}"

/* 主轴方向 (flex-direction) */
flex-row        /* → 水平 (默认) */
flex-row-reverse /* ← 水平反向 */
flex-col        /* ↓ 垂直 */
flex-col-reverse /* ↑ 垂直反向 */

/* 主轴对齐 (justify-content) */
justify-start   /* 起点对齐 */
justify-center  /* 居中 */
justify-end     /* 终点对齐 */
justify-between /* 两端对齐 */
justify-around  /* 均匀分布 */

/* 交叉轴对齐 (align-items) */
items-start     /* 顶部对齐 */
items-center    /* 垂直居中 */
items-end       /* 底部对齐 */
items-stretch   /* 拉伸填充 */`);

const flexPreviewStyle = computed<CSSProperties>(() => ({
  flexDirection: flexDemo.direction as any,
  justifyContent: flexDemo.justify as any,
  alignItems: flexDemo.align as any,
  gap: `${flexDemo.gap}px`
}));

// Tab 2: Grid
const gridDemo = reactive({
  cols: 3,
  gap: 16,
  autoFill: false
});

const gridStyle = computed(() => {
  if (gridDemo.autoFill) {
    return {
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: `${gridDemo.gap}px`
    };
  }
  return {
    gridTemplateColumns: `repeat(${gridDemo.cols}, 1fr)`,
    gap: `${gridDemo.gap}px`
  };
});

const gridTailwindClass = computed(() => {
  if (gridDemo.autoFill) {
    return `grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-${gridDemo.gap / 4}`;
  }
  return `grid-cols-${gridDemo.cols} gap-${gridDemo.gap / 4}`;
});

const gridCode = computed(() => `/* CSS Grid 布局 */

.container {
  display: grid;
  ${gridDemo.autoFill 
    ? 'grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));' 
    : `grid-template-columns: repeat(${gridDemo.cols}, 1fr);`}
  gap: ${gridDemo.gap}px;
}

/* Tailwind 写法 */
class="grid ${gridTailwindClass.value}"

/* 固定列数 */
grid-cols-1     /* 1 列 */
grid-cols-2     /* 2 列 */
grid-cols-3     /* 3 列 */
grid-cols-4     /* 4 列 */

/* 响应式列数 */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* 自适应列数 (auto-fill) */
grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
/* 每列最小 280px，自动计算列数 */

/* 间距 */
gap-4           /* 行列间距 16px */
gap-x-4         /* 仅列间距 */
gap-y-2         /* 仅行间距 */`);

// Tab 3: Responsive
const breakpoints = [
  { name: 'sm', minWidth: 640, icon: '📱' },
  { name: 'md', minWidth: 768, icon: '📱' },
  { name: 'lg', minWidth: 1024, icon: '💻' },
  { name: 'xl', minWidth: 1280, icon: '🖥️' },
  { name: '2xl', minWidth: 1536, icon: '🖥️' }
];

const viewportWidth = ref(0);
const currentBreakpoint = computed(() => {
  const w = viewportWidth.value;
  if (w >= 1536) return '2xl';
  if (w >= 1280) return 'xl';
  if (w >= 1024) return 'lg';
  if (w >= 768) return 'md';
  if (w >= 640) return 'sm';
  return 'base';
});

const updateViewport = () => {
  viewportWidth.value = window.innerWidth;
};

onMounted(() => {
  updateViewport();
  window.addEventListener('resize', updateViewport);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport);
});

const responsiveCode = computed(() => `/* Tailwind 响应式设计 - 移动优先 */

/* 断点前缀 */
sm:   /* @media (min-width: 640px)  */
md:   /* @media (min-width: 768px)  */
lg:   /* @media (min-width: 1024px) */
xl:   /* @media (min-width: 1280px) */
2xl:  /* @media (min-width: 1536px) */

/* 示例：响应式 padding */
class="p-2 md:p-4 lg:p-6"
/* 
  移动端: 8px
  ≥768px: 16px  
  ≥1024px: 24px
*/

/* 示例：响应式网格 */
class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

/* 示例：响应式显示/隐藏 */
class="hidden md:block"   /* 移动隐藏，平板显示 */
class="block md:hidden"   /* 移动显示，平板隐藏 */

/* 示例：响应式方向 */
class="flex flex-col md:flex-row"
/* 移动端垂直堆叠，平板水平排列 */

/* 原生 CSS Media Query */
@media (min-width: 768px) {
  .element { padding: 1rem; }
}`);
</script>
