<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-pink-200 dark:border-pink-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🧩</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'CSS 性能与渲染成本' : 'CSS Performance & Rendering Cost' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh
            ? '把“回流 / 重绘 / 合成、BFC、margin 折叠、选择器匹配”这些最容易坑人的点变成可视化。'
            : 'Visualizes reflow/paint/composite, BFC, margin collapse, selector matching.'
          }}
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-pink-500 text-white' : 'bg-pink-50 dark:bg-gray-700 text-pink-600 dark:text-pink-300'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Reflow/Paint/Composite -->
    <div v-if="activeTab === 'pipeline'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '三类改动的成本' : 'Three Types of Style Changes' }}</h4>

            <div class="space-y-2">
              <button
                v-for="d in demos"
                :key="d.id"
                @click="activeDemo = d.id"
                class="w-full p-3 rounded-xl border text-left transition-all"
                :class="activeDemo === d.id ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30' : 'border-gray-200 dark:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-gray-800 dark:text-gray-100">{{ d.title }}</span>
                  <span class="text-[10px] px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{{ d.cost }}</span>
                </div>
                <div class="text-[11px] text-gray-500 mt-1">{{ d.desc }}</div>
              </button>
            </div>

            <div class="mt-4 flex items-center gap-2">
              <button
                class="px-4 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white transition"
                @click="togglePlay"
              >
                {{ playing ? (isZh ? '停止动画' : 'Stop') : (isZh ? '播放动画' : 'Play') }}
              </button>
              <div class="text-[11px] text-gray-500">
                {{ isZh ? '目标：优先用 transform/opacity 做动画（更容易走合成）。' : 'Goal: prefer transform/opacity for animation (more compositing-friendly).' }}
              </div>
            </div>
          </div>

          <div class="p-4 rounded-2xl border border-sakura-200 dark:border-sakura-700 bg-sakura-50/50 dark:bg-sakura-900/20">
            <div class="text-xs font-bold text-sakura-700 dark:text-sakura-300 mb-2">🌸 {{ isZh ? '与本站代码的连接' : 'Connected to this repo' }}</div>
            <ul class="text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
              <li>• {{ isZh ? '花瓣/背景动画尽量用 transform（更顺滑）' : 'Petal/background animations should prefer transform (smoother)' }}</li>
              <li>• {{ isZh ? '大量 DOM 更新时，集中改 class（减少回流/重绘）' : 'Batch DOM updates via class changes (reduce reflow/paint)' }}</li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '可视化演示' : 'Visualization' }}</h4>
            <div class="h-40 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 border border-pink-200/60 dark:border-pink-700/40 flex items-center justify-center overflow-hidden relative">
              <div
                class="rounded-2xl shadow-lg border border-white/60 dark:border-gray-700/60"
                :class="demoClass"
                :style="demoStyle"
              >
                <div class="px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-100">
                  {{ demoLabel }}
                </div>
              </div>

              <div class="absolute bottom-2 right-2 text-[10px] px-2 py-1 rounded bg-white/70 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300">
                {{ activeDemoInfo.cost }}
              </div>
            </div>

            <div class="mt-3 p-3 rounded-xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
              <pre>{{ demoCode }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: BFC & margin collapse -->
    <div v-else-if="activeTab === 'bfc'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? 'margin 折叠（外边距重叠）' : 'Margin Collapse' }}</h4>

          <label class="flex items-center justify-between gap-3 text-xs mb-3">
            <span class="text-gray-600 dark:text-gray-300">{{ isZh ? '让父容器形成 BFC（阻止折叠）' : 'Create BFC on parent (prevents collapse)' }}</span>
            <input type="checkbox" v-model="parentCreatesBfc" class="accent-pink-500" />
          </label>

          <div class="text-[11px] text-gray-500 leading-relaxed">
            {{ isZh
              ? '两个块级元素的垂直 margin 可能会“折叠成一个”，常见坑：子元素的 margin-top 把父容器顶开。解决方案之一：让父容器形成 BFC（例如 overflow:auto / display:flow-root）。'
              : 'Vertical margins may collapse; common pitfall: child margin-top appears to push the parent. One fix: create a BFC (overflow:auto / display:flow-root).'
            }}
          </div>
        </div>

        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '效果预览' : 'Preview' }}</h4>

          <div
            class="rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/30 p-4"
            :style="parentStyle"
          >
            <div class="text-[10px] text-gray-500">{{ isZh ? '父容器' : 'Parent' }}</div>
            <div
              class="rounded-xl bg-pink-200/70 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700 px-3 py-2"
              style="margin-top: 24px;"
            >
              <div class="text-xs font-bold text-gray-800 dark:text-gray-100">{{ isZh ? '子元素（margin-top: 24px）' : 'Child (margin-top: 24px)' }}</div>
              <div class="text-[11px] text-gray-600 dark:text-gray-300">{{ isZh ? '观察：父容器顶部 padding 是否“被吃掉”' : 'Observe: whether parent top padding seems eaten' }}</div>
            </div>
          </div>

          <div class="mt-3 p-3 rounded-xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{{ bfcCode }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Selector matching -->
    <div v-else-if="activeTab === 'selectors'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '选择器是“从右往左”匹配的' : 'Selectors Match Right-to-Left' }}</h4>
          <div class="text-[11px] text-gray-500 leading-relaxed mb-4">
            {{ isZh
              ? '复杂后代选择器可能让浏览器做更多匹配工作。实践上：尽量让选择器更“短、更具体”，并减少层级。Tailwind 的工具类天然短。'
              : 'Deep descendant selectors can increase matching work. Prefer shorter selectors and fewer levels. Tailwind utilities are naturally short.'
            }}
          </div>

          <div class="space-y-2">
            <div class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '试试不同选择器' : 'Try selectors' }}</div>
            <button
              v-for="s in selectorSamples"
              :key="s"
              class="w-full p-3 rounded-xl border text-left font-mono text-xs transition"
              :class="selector === s ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30' : 'border-gray-200 dark:border-gray-700'"
              @click="selector = s"
            >
              {{ s }}
            </button>
          </div>

          <div class="mt-4 p-3 rounded-xl bg-white/70 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
            <div class="text-[11px] text-gray-500">{{ isZh ? '估算匹配工作量（教学用近似）' : 'Estimated matching work (teaching approximation)' }}</div>
            <div class="text-sm font-bold text-gray-800 dark:text-gray-100 mt-1">
              {{ matchCost }}
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">{{ isZh ? '示例 DOM（简化）' : 'Sample DOM (simplified)' }}</h4>
          <div class="p-3 rounded-xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{{ domSnippet }}</pre>
          </div>
          <div class="mt-3 text-[11px] text-gray-500">
            {{ isZh ? '提示：越靠右的部分越先过滤候选元素。' : 'Tip: the rightmost part filters candidates first.' }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

const tabs = computed<{ id: 'pipeline' | 'bfc' | 'selectors'; label: string }[]>(() => [
  { id: 'pipeline', label: isZh.value ? '🎛️ 回流/重绘/合成' : '🎛️ Reflow/Paint/Composite' },
  { id: 'bfc', label: isZh.value ? '🧱 BFC 与折叠' : '🧱 BFC & Collapse' },
  { id: 'selectors', label: isZh.value ? '🧬 选择器匹配' : '🧬 Selector Matching' }
])

const activeTab = ref<'pipeline' | 'bfc' | 'selectors'>('pipeline')

const demos = computed<{ id: 'layout' | 'paint' | 'composite'; title: string; cost: string; desc: string }[]>(() => [
  {
    id: 'layout',
    title: isZh.value ? '改变 width（触发布局）' : 'Change width (layout)',
    cost: isZh.value ? '回流 Layout' : 'Layout',
    desc: isZh.value ? '会影响自身与兄弟元素位置。' : 'Affects sizes/positions.'
  },
  {
    id: 'paint',
    title: isZh.value ? '改变 background（触发绘制）' : 'Change background (paint)',
    cost: isZh.value ? '重绘 Paint' : 'Paint',
    desc: isZh.value ? '不改变布局，但需要重新绘制像素。' : 'No layout change, repaints pixels.'
  },
  {
    id: 'composite',
    title: isZh.value ? '改变 transform（更易合成）' : 'Change transform (composite-friendly)',
    cost: isZh.value ? '合成 Composite' : 'Composite',
    desc: isZh.value ? '不触发布局/绘制时更顺滑。' : 'Often avoids layout/paint; smoother.'
  }
])

const activeDemo = ref<'layout' | 'paint' | 'composite'>('composite')
const playing = ref(false)
const tick = ref(0)

const activeDemoInfo = computed(() => demos.value.find(d => d.id === activeDemo.value)!)

const demoLabel = computed(() => {
  if (activeDemo.value === 'layout') return isZh.value ? 'Layout：width 改变' : 'Layout: width change'
  if (activeDemo.value === 'paint') return isZh.value ? 'Paint：颜色改变' : 'Paint: color change'
  return isZh.value ? 'Composite：transform 移动' : 'Composite: transform move'
})

const demoClass = computed(() => {
  return activeDemo.value === 'paint'
    ? 'w-40 h-16'
    : 'w-32 h-16'
})

const demoStyle = computed(() => {
  const phase = tick.value % 2

  if (activeDemo.value === 'layout') {
    return {
      width: phase === 0 ? '8rem' : '12rem',
      height: '4rem',
      background: 'rgba(244,114,182,0.35)'
    } as Record<string, string>
  }

  if (activeDemo.value === 'paint') {
    return {
      width: '10rem',
      height: '4rem',
      background: phase === 0 ? 'rgba(244,114,182,0.25)' : 'rgba(99,102,241,0.25)'
    } as Record<string, string>
  }

  return {
    width: '10rem',
    height: '4rem',
    background: 'rgba(244,114,182,0.25)',
    transform: phase === 0 ? 'translateX(-24px)' : 'translateX(24px)'
  } as Record<string, string>
})

const demoCode = computed(() => {
  if (activeDemo.value === 'layout') {
    return `/* layout（回流） */\n.card { width: 8rem; }\n.card.active { width: 12rem; }\n\n// 典型场景：频繁改 width/height/top/left 会更贵`
  }
  if (activeDemo.value === 'paint') {
    return `/* paint（重绘） */\n.card { background: rgba(244,114,182,.25); }\n.card.active { background: rgba(99,102,241,.25); }\n\n// 典型场景：颜色变化不动布局，但需要重新绘制像素`
  }
  return `/* composite（合成） */\n.card { transform: translateX(-24px); }\n.card.active { transform: translateX(24px); }\n\n// 动画优先 transform/opacity，常更顺滑`
})

const togglePlay = () => {
  playing.value = !playing.value
}

let timer: number | undefined
watchEffect(() => {
  if (playing.value) {
    timer = window.setInterval(() => {
      tick.value++
    }, 650)
  } else if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
})

// BFC demo
const parentCreatesBfc = ref(false)
const parentStyle = computed(() => {
  // flow-root is the cleanest modern BFC trigger
  return parentCreatesBfc.value
    ? { display: 'flow-root', padding: '12px' }
    : { padding: '12px' }
})

const bfcCode = computed(() => {
  return parentCreatesBfc.value
    ? `/* 形成 BFC 的一种方式 */\n.parent { display: flow-root; padding-top: 12px; }\n.child { margin-top: 24px; }\n\n// margin-top 不再“顶开”父容器`
    : `/* 默认情况下，可能发生 margin 折叠 */\n.parent { padding-top: 12px; }\n.child { margin-top: 24px; }\n\n// 观察：视觉上像是父容器的 padding-top 被吃掉`
})

// Selector matching demo
const selectorSamples = computed(() => [
  '.btn',
  'button.btn',
  '.app .sidebar .btn',
  'div div div div .btn'
])

const selector = ref(selectorSamples.value[0])

const domSnippet = computed(() => {
  return `<div class="app">\n  <aside class="sidebar">\n    <div class="group">\n      <button class="btn">Click</button>\n    </div>\n  </aside>\n</div>`
})

const matchCost = computed(() => {
  // Teaching-only heuristic
  const depth = (selector.value.match(/\s+/g) || []).length
  const hasTag = /(^|\s|>)\w+/.test(selector.value)
  const hasClass = selector.value.includes('.')

  let cost = 10
  cost += depth * 18
  if (hasTag) cost -= 3
  if (hasClass) cost -= 2

  if (selector.value.includes('div div div')) cost += 30

  return isZh.value
    ? `约 ${Math.max(6, cost)} 个节点检查`
    : `~${Math.max(6, cost)} node checks`
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.35s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
