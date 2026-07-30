<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-emerald-200 dark:border-emerald-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🕹️</div>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'CSS 按钮街机：用样式做点“好玩”的' : 'CSS Button Arcade: Make styling fun' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ isZh ? '把按钮当作一个“交互组件”，练习状态、层次、动效与可访问性。' : 'Treat buttons as interactive components: states, layers, motion, accessibility.' }}
        </p>
      </div>
    </div>
 
    <div class="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-4 mb-6">
      <div class="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2">
        {{ isZh ? '你会练到什么？' : 'What you will practice' }}
      </div>
      <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <li>✅ {{ isZh ? '状态：hover / active / focus-visible / disabled' : 'States: hover / active / focus-visible / disabled' }}</li>
        <li>✅ {{ isZh ? '层次：背景层、发光层、点缀层（伪元素）' : 'Layers: base, glow, accents (pseudo elements)' }}</li>
        <li>✅ {{ isZh ? '性能：尽量用 transform/opacity 触发合成' : 'Performance: prefer transform/opacity compositing' }}</li>
      </ul>
    </div>
 
    <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-emerald-500 text-white' : 'bg-emerald-50 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300'"
        @click="activeTab = tab.id"
      >
        {{ isZh ? tab.labelZh : tab.labelEn }}
      </button>
    </div>
 
    <div v-if="activeTab === 'forge'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div class="font-bold text-gray-700 dark:text-gray-200 mb-3">
              {{ isZh ? '按钮工坊' : 'Button Forge' }}
            </div>
 
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="text-xs text-gray-600 dark:text-gray-400">
                <div class="font-bold mb-1">Variant</div>
                <select v-model="forge.variant" class="w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/40 text-xs">
                  <option value="neon">neon</option>
                  <option value="glass">glass</option>
                  <option value="pixel">pixel</option>
                </select>
              </label>
 
              <label class="text-xs text-gray-600 dark:text-gray-400">
                <div class="font-bold mb-1">Size</div>
                <select v-model="forge.size" class="w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/40 text-xs">
                  <option value="sm">sm</option>
                  <option value="md">md</option>
                  <option value="lg">lg</option>
                </select>
              </label>
 
              <label class="text-xs text-gray-600 dark:text-gray-400">
                <div class="font-bold mb-1">{{ isZh ? '圆角' : 'Radius' }}: <span class="font-mono">{{ forge.radius }}px</span></div>
                <input v-model.number="forge.radius" type="range" min="6" max="28" step="1" class="w-full accent-emerald-500" />
              </label>
 
              <label class="text-xs text-gray-600 dark:text-gray-400">
                <div class="font-bold mb-1">{{ isZh ? '色相' : 'Hue' }}: <span class="font-mono">{{ forge.hue }}</span></div>
                <input v-model.number="forge.hue" type="range" min="0" max="360" step="1" class="w-full accent-emerald-500" />
              </label>
 
              <label class="text-xs text-gray-600 dark:text-gray-400">
                <div class="font-bold mb-1">{{ isZh ? '发光强度' : 'Glow' }}: <span class="font-mono">{{ forge.glow }}%</span></div>
                <input v-model.number="forge.glow" type="range" min="0" max="100" step="5" class="w-full accent-emerald-500" />
              </label>
 
              <div class="flex items-end justify-between gap-3">
                <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <input v-model="forge.pressed" type="checkbox" class="accent-emerald-500" />
                  <span class="font-bold">{{ isZh ? '按下态' : 'Pressed' }}</span>
                </label>
                <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <input v-model="forge.disabled" type="checkbox" class="accent-emerald-500" />
                  <span class="font-bold">{{ isZh ? '禁用' : 'Disabled' }}</span>
                </label>
              </div>
            </div>
          </div>
 
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div class="font-bold text-gray-700 dark:text-gray-200 mb-3">
              {{ isZh ? '要点清单' : 'Checklist' }}
            </div>
            <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• {{ isZh ? '用 :focus-visible 只在键盘操作时显示焦点样式' : 'Use :focus-visible to show focus only for keyboard users' }}</li>
              <li>• {{ isZh ? 'hover 做“加法”，active 做“减法”（按下变实、变近）' : 'Hover adds; active subtracts (pressed feels closer and denser)' }}</li>
              <li>• {{ isZh ? '禁用态要同时处理 pointer-events 与对比度' : 'Disabled should handle pointer-events and contrast' }}</li>
            </ul>
          </div>
        </div>
 
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div class="font-bold text-gray-700 dark:text-gray-200 mb-3">
              {{ isZh ? '预览' : 'Preview' }}
            </div>
 
            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-800/30 p-5" :style="forgeVars">
              <div class="flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  class="arcade-btn"
                  :class="btnClass"
                  :disabled="forge.disabled"
                  @click="forgeClicks++"
                >
                  <span class="arcade-btn__icon">⚡</span>
                  <span class="arcade-btn__label">{{ isZh ? '开始冒险' : 'Start Quest' }}</span>
                  <span class="arcade-btn__badge">{{ forgeClicks }}</span>
                </button>
 
                <button
                  type="button"
                  class="arcade-btn is-secondary"
                  :class="btnClass"
                  :disabled="forge.disabled"
                >
                  <span class="arcade-btn__label">{{ isZh ? '设置' : 'Settings' }}</span>
                </button>
 
                <button
                  type="button"
                  class="arcade-btn is-danger"
                  :class="btnClass"
                  :disabled="forge.disabled"
                >
                  <span class="arcade-btn__label">{{ isZh ? '危险操作' : 'Danger' }}</span>
                </button>
              </div>
 
              <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div class="rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/20 p-3">
                  <div class="font-bold text-gray-700 dark:text-gray-200 mb-1">{{ isZh ? '层次' : 'Layers' }}</div>
                  <div class="text-gray-600 dark:text-gray-400">{{ isZh ? '背景 + 伪元素光晕 + 文字与徽章' : 'Base + pseudo glow + text & badge' }}</div>
                </div>
                <div class="rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/20 p-3">
                  <div class="font-bold text-gray-700 dark:text-gray-200 mb-1">{{ isZh ? '状态' : 'States' }}</div>
                  <div class="text-gray-600 dark:text-gray-400">{{ isZh ? 'hover/active 用 transform，避免 layout 抖动' : 'Hover/active via transform, avoid layout shifts' }}</div>
                </div>
                <div class="rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/20 p-3">
                  <div class="font-bold text-gray-700 dark:text-gray-200 mb-1">{{ isZh ? '可访问性' : 'A11y' }}</div>
                  <div class="text-gray-600 dark:text-gray-400">{{ isZh ? 'focus-visible 高对比描边 + 语义 button' : 'High-contrast focus-visible + semantic button' }}</div>
                </div>
              </div>
            </div>
          </div>
 
          <LabCodeBlock
            :lang="props.lang"
            :title="isZh ? '注释源码：按钮工坊（HTML/CSS）' : 'Annotated source: Button Forge (HTML/CSS)'"
            :code="forgeCode"
            :path="sourcePath"
            token="find:SOURCE: Forge"
          />
        </div>
      </div>
    </div>
 
    <div v-else-if="activeTab === 'reflex'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div>
              <div class="font-bold text-gray-800 dark:text-gray-100">
                {{ isZh ? '反应力小游戏' : 'Reflex Mini Game' }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ isZh ? '点击“开始”，等待按钮变绿后尽快点击。' : 'Press Start, wait until it turns green, then click fast.' }}
              </div>
            </div>
            <div class="flex gap-2">
              <button type="button" class="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:opacity-90" @click="startReflex">
                {{ isZh ? '开始' : 'Start' }}
              </button>
              <button type="button" class="px-3 py-2 rounded-xl text-xs font-bold bg-gray-600 text-white hover:opacity-90" @click="resetReflex">
                {{ isZh ? '重置' : 'Reset' }}
              </button>
            </div>
          </div>
 
          <button
            type="button"
            class="reflex-btn"
            :data-state="reflex.state"
            :disabled="reflex.state === 'idle'"
            @click="hitReflex"
          >
            <span class="reflex-btn__title">
              {{
                reflex.state === 'idle'
                  ? (isZh ? '点击开始' : 'Press Start')
                  : reflex.state === 'waiting'
                    ? (isZh ? '等待...' : 'Wait...')
                    : reflex.state === 'ready'
                      ? (isZh ? '现在点！' : 'Go!')
                      : (isZh ? '已记录' : 'Recorded')
              }}
            </span>
            <span class="reflex-btn__sub">
              {{
                reflex.message ||
                  (reflex.state === 'waiting'
                    ? (isZh ? '别太早点，会扣分' : 'Too early will fail')
                    : reflex.state === 'ready'
                      ? (isZh ? '越快越好' : 'Faster is better')
                      : '')
              }}
            </span>
          </button>
        </div>
 
        <div class="space-y-4">
          <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div class="font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ isZh ? '计分板' : 'Scoreboard' }}
            </div>
            <div class="grid grid-cols-3 gap-3 text-xs">
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3">
                <div class="text-gray-500">{{ isZh ? '尝试' : 'Tries' }}</div>
                <div class="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ reflex.tries }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3">
                <div class="text-gray-500">{{ isZh ? '本次' : 'Last' }}</div>
                <div class="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ reflex.lastMs == null ? '—' : `${reflex.lastMs}ms` }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3">
                <div class="text-gray-500">{{ isZh ? '最佳' : 'Best' }}</div>
                <div class="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{{ reflex.bestMs == null ? '—' : `${reflex.bestMs}ms` }}</div>
              </div>
            </div>
 
            <div class="mt-4 text-xs text-gray-600 dark:text-gray-400">
              {{ isZh ? '实现要点：状态机 + data-state 驱动样式；动效尽量用 transform/opacity。' : 'Key idea: state machine + data-state driven styles; motion via transform/opacity.' }}
            </div>
          </div>
 
          <LabCodeBlock
            :lang="props.lang"
            :title="isZh ? '注释源码：反应力小游戏（data-state + 状态机）' : 'Annotated source: Reflex mini game (data-state + state machine)'"
            :code="reflexCode"
            :path="sourcePath"
            token="find:SOURCE: Reflex"
          />
        </div>
      </div>
    </div>
 
    <div v-else class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div>
              <div class="font-bold text-gray-800 dark:text-gray-100">
                {{ isZh ? '抽卡按钮：用 CSS 做“开箱感”' : 'Loot Button: Unbox feeling with CSS' }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ isZh ? '点击抽取，会翻牌显示稀有度。' : 'Draw a card, flip to reveal rarity.' }}
              </div>
            </div>
            <div class="flex gap-2">
              <button type="button" class="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:opacity-90" @click="drawLoot">
                {{ isZh ? '抽一张' : 'Draw' }}
              </button>
              <button type="button" class="px-3 py-2 rounded-xl text-xs font-bold bg-gray-600 text-white hover:opacity-90" @click="resetLoot">
                {{ isZh ? '重置' : 'Reset' }}
              </button>
            </div>
          </div>
 
          <div class="flex justify-center">
            <div class="loot-card" :class="{ 'is-flipped': loot.flipped }" :data-rarity="loot.result?.rarity || 'none'">
              <div class="loot-card__inner">
                <div class="loot-card__face loot-card__front">
                  <div class="loot-card__icon">?</div>
                  <div class="loot-card__text">{{ isZh ? '未知奖励' : 'Unknown' }}</div>
                </div>
                <div class="loot-card__face loot-card__back">
                  <div class="loot-card__icon">{{ loot.result?.icon || '—' }}</div>
                  <div class="loot-card__text">{{ loot.result ? (isZh ? loot.result.zh : loot.result.en) : (isZh ? '还没抽' : 'Not drawn') }}</div>
                  <div v-if="loot.result" class="loot-card__rarity">{{ loot.result.rarity.toUpperCase() }}</div>
                </div>
              </div>
            </div>
          </div>
 
          <div class="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
              <div class="font-bold text-gray-800 dark:text-gray-100 mb-1">{{ isZh ? '权重示例' : 'Weights example' }}</div>
              <div class="text-gray-600 dark:text-gray-400">{{ isZh ? 'common/rare/epic/legendary' : 'common/rare/epic/legendary' }}</div>
            </div>
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
              <div class="font-bold text-gray-800 dark:text-gray-100 mb-1">{{ isZh ? '视觉要点' : 'Visual key' }}</div>
              <div class="text-gray-600 dark:text-gray-400">{{ isZh ? '3D 翻转 + 稀有度发光边框' : '3D flip + rarity glow border' }}</div>
            </div>
          </div>
        </div>
 
        <div class="space-y-4">
          <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div class="font-bold text-gray-800 dark:text-gray-100 mb-3">
              {{ isZh ? '可复用套路' : 'Reusable pattern' }}
            </div>
            <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• {{ isZh ? '用 data-* 或 class 作为“状态位”，避免在 JS 里拼 style' : 'Use data-* / class as state, avoid styling via JS' }}</li>
              <li>• {{ isZh ? '关键帧只做点缀，主交互用 transition' : 'Keyframes for accents, transitions for core interaction' }}</li>
              <li>• {{ isZh ? '用 prefers-reduced-motion 兜底' : 'Respect prefers-reduced-motion' }}</li>
            </ul>
          </div>
 
          <LabCodeBlock
            :lang="props.lang"
            :title="isZh ? '注释源码：抽卡翻牌（3D 翻转 + 稀有度）' : 'Annotated source: Loot flip (3D + rarity)'"
            :code="lootCode"
            :path="sourcePath"
            token="find:SOURCE: Loot"
          />
        </div>
      </div>
    </div>

    <LabTransferAndCheck
      :lang="props.lang"
      transfer-title-zh="把 ButtonArcade 迁移成你自己的可复用组件"
      transfer-title-en="Transfer ButtonArcade into your own reusable component"
      transfer-desc-zh="目标：不照抄也能写出来——把“状态 / 层次 / 动效 / 可访问性”拆开做，再组合成一个按钮皮肤。"
      transfer-desc-en="Goal: rebuild it without copying—compose states/layers/motion/accessibility into a reusable button skin."
      :transfer-tasks-zh="transferTasksZh"
      :transfer-tasks-en="transferTasksEn"
      :transfer-acceptance-zh="transferAcceptanceZh"
      :transfer-acceptance-en="transferAcceptanceEn"
      :source-path="sourcePath"
      source-token="find:SOURCE: Forge"
      source-focus-zh="阅读本文件的三个标记：\n1) SOURCE: Forge：找出 ::before/::after 分别负责什么。\n2) SOURCE: Reflex：观察 state 只在 data-state 上变化，CSS 如何跟随。\n3) SOURCE: Loot：找出 3D 翻转所需的最小属性集合。"
      source-focus-en="Read the three markers in this file:\n1) SOURCE: Forge: map what ::before/::after do.\n2) SOURCE: Reflex: state changes only via data-state, CSS follows.\n3) SOURCE: Loot: find the minimal set of properties for 3D flip."
      :questions="selfCheckQuestions"
    />
  </div>
</template>
 
<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import LabCodeBlock from '../ui/LabCodeBlock.vue'
import LabTransferAndCheck, { type LabSelfCheckQuestion } from '../ui/LabTransferAndCheck.vue'
 
/*
ButtonArcade（CSS 游戏化组件）说明：
1) Forge：用 CSS 变量 + 伪元素做“可调皮肤”的按钮（neon/glass/pixel）
2) Reflex：用 data-state 作为样式开关，JS 只做状态机与计时
3) Loot：用 class/data-rarity 驱动 3D 翻转与稀有度外观
*/

const props = defineProps<{
  lang: 'en' | 'zh'
}>()
 
const isZh = computed(() => props.lang === 'zh')
const sourcePath = 'src/components/lab/stage3-css/LabCssButtonArcade.vue'
 
const tabs = [
  { id: 'forge', labelZh: '按钮工坊', labelEn: 'Forge' },
  { id: 'reflex', labelZh: '反应力', labelEn: 'Reflex' },
  { id: 'loot', labelZh: '抽卡', labelEn: 'Loot' },
] as const
 
const activeTab = ref<(typeof tabs)[number]['id']>('forge')
 
type ForgeVariant = 'neon' | 'glass' | 'pixel'
type ForgeSize = 'sm' | 'md' | 'lg'
 
const forge = reactive({
  variant: 'neon' as ForgeVariant,
  size: 'md' as ForgeSize,
  radius: 16,
  hue: 155,
  glow: 70,
  pressed: false,
  disabled: false,
})
 
const forgeClicks = ref(0)
 
const forgeVars = computed(() => {
  const vars: Record<string, string> = {
    '--arcade-hue': `${forge.hue}`,
    '--arcade-radius': `${forge.radius}px`,
    '--arcade-glow': `${forge.glow / 100}`,
  }
  return vars
})
 
const btnClass = computed(() => {
  const base = [`is-${forge.variant}`, `is-${forge.size}`]
  if (forge.pressed) base.push('is-pressed')
  return base
})
 
// SOURCE: Forge
const forgeCode = computed(() => {
  const label = isZh.value ? '开始冒险' : 'Start Quest'
  const previewVars = `--arcade-hue: ${forge.hue}; --arcade-radius: ${forge.radius}px; --arcade-glow: ${Math.round((forge.glow / 100) * 100) / 100};`
  const variant =
    forge.variant === 'neon'
      ? `/* neon：更“亮”，靠阴影与发光营造体积感 */
.arcade-btn.is-neon {
  background: linear-gradient(180deg, hsl(var(--_h) 90% 62%), hsl(var(--_h) 85% 52%));
  color: rgba(9, 14, 18, 0.92);
}
.arcade-btn.is-neon::before {
  /* 发光层：模糊 + 透明度由 --arcade-glow 控制 */
  background:
    radial-gradient(circle at 30% 20%, hsl(var(--_h) 95% 70%), transparent 55%),
    radial-gradient(circle at 70% 80%, hsl(calc(var(--_h) + 25) 95% 65%), transparent 60%);
}`
      : forge.variant === 'glass'
        ? `/* glass：玻璃拟态（注意：backdrop-filter 需要浏览器支持） */
.arcade-btn.is-glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08));
  border: 1px solid rgba(255,255,255,0.22);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.92);
}
.arcade-btn.is-glass::after {
  /* 高光条：hover 时“滑过” */
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.7) 38%, transparent 70%);
}`
        : `/* pixel：像素风（用硬边 + 台阶式阴影） */
.arcade-btn.is-pixel {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  border: 2px solid rgba(0,0,0,0.32);
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.22);
}
.arcade-btn.is-pixel:active {
  /* active 做“减法”：更靠近屏幕（translateY + 阴影变短） */
  transform: translateY(6px);
  box-shadow: 0 4px 0 rgba(0,0,0,0.25);
}`
 
  return `<!--
按钮工坊 = 把按钮当作“组件”来写
① 结构：icon / label / badge 三层
② 状态：hover / active / focus-visible / disabled
③ 层次：::before 负责“光晕”，::after 负责“高光”
④ 可配置：用 CSS 变量（色相/圆角/发光强度）驱动不同皮肤
-->

<!-- HTML（关键点：语义用 button；内容分层用 span） -->
<button class="arcade-btn is-${forge.variant} is-${forge.size}">
  <span class="arcade-btn__icon">⚡</span>
  <span class="arcade-btn__label">${label}</span>
  <span class="arcade-btn__badge">3</span>
</button>

/* CSS：把“可调参数”写在容器上，按钮内部只消费变量 */
.preview {
  ${previewVars}
}

/* 共同基座：把所有变体共享的交互与可访问性放在一起 */
.arcade-btn {
  --_h: var(--arcade-hue, 155);   /* 色相：只改它就能换主色 */
  --_r: var(--arcade-radius, 16px); /* 圆角：统一风格 */
  --_g: var(--arcade-glow, 0.7);  /* 发光强度：0~1 */
  position: relative;
  border-radius: var(--_r);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  will-change: transform, filter, box-shadow;
}
.arcade-btn::before,
.arcade-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}
.arcade-btn::before {
  /* 光晕：用 blur + translateY 做“悬浮发光” */
  opacity: calc(var(--_g) * 0.9);
  filter: blur(16px);
  transform: translateY(10px);
}
.arcade-btn::after {
  /* 高光：用 mask 限制高光范围，看起来更“立体” */
  opacity: 0.65;
  mask-image: radial-gradient(circle at 30% 20%, black 0%, transparent 65%);
}
.arcade-btn:hover:not(:disabled) {
  /* hover 做“加法”：上浮一点，不改布局（用 transform） */
  transform: translateY(-2px);
}
.arcade-btn:active:not(:disabled),
.arcade-btn.is-pressed:not(:disabled) {
  /* active 做“减法”：更近、更实 */
  transform: translateY(1px) scale(0.99);
}
.arcade-btn:focus-visible {
  /* 只在键盘操作显示：避免鼠标点击出现“多余描边” */
  outline: 3px solid hsl(var(--_h) 90% 55% / 0.55);
  outline-offset: 3px;
}
.arcade-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  filter: grayscale(0.25);
}

/* Variant（根据 is-* class 切皮肤） */
${variant}`
})
 
// Reflex：最小状态机（idle → waiting → ready → done）
type ReflexState = 'idle' | 'waiting' | 'ready' | 'done'
 
const reflex = reactive({
  state: 'idle' as ReflexState,
  tries: 0,
  lastMs: null as number | null,
  bestMs: null as number | null,
  message: '',
})
 
let reflexTimer: number | undefined
let readyAt: number | null = null
 
const clearReflexTimer = () => {
  if (reflexTimer != null) window.clearTimeout(reflexTimer)
  reflexTimer = undefined
}
 
const startReflex = () => {
  clearReflexTimer()
  reflex.message = ''
  reflex.state = 'waiting'
  readyAt = null
  const delay = Math.round(700 + Math.random() * 1800)
  reflexTimer = window.setTimeout(() => {
    reflex.state = 'ready'
    readyAt = performance.now()
    reflexTimer = undefined
  }, delay)
}
 
const hitReflex = () => {
  if (reflex.state === 'waiting') {
    reflex.tries += 1
    reflex.lastMs = null
    reflex.message = isZh.value ? '太早了' : 'Too early'
    reflex.state = 'done'
    clearReflexTimer()
    return
  }
 
  if (reflex.state === 'ready') {
    reflex.tries += 1
    const now = performance.now()
    const ms = readyAt == null ? 0 : Math.max(0, Math.round(now - readyAt))
    reflex.lastMs = ms
    reflex.bestMs = reflex.bestMs == null ? ms : Math.min(reflex.bestMs, ms)
    reflex.message = isZh.value ? '不错，再来一次？' : 'Nice, again?'
    reflex.state = 'done'
  }
}
 
const resetReflex = () => {
  clearReflexTimer()
  reflex.state = 'idle'
  reflex.tries = 0
  reflex.lastMs = null
  reflex.bestMs = null
  reflex.message = ''
  readyAt = null
}
 
type LootRarity = 'common' | 'rare' | 'epic' | 'legendary'
 
type LootItem = {
  rarity: LootRarity
  icon: string
  zh: string
  en: string
}
 
const lootItems: LootItem[] = [
  { rarity: 'common', icon: '🍡', zh: '团子补给', en: 'Dango Supply' },
  { rarity: 'common', icon: '🧪', zh: '药剂小瓶', en: 'Tiny Potion' },
  { rarity: 'rare', icon: '🗡️', zh: '短刃', en: 'Dagger' },
  { rarity: 'rare', icon: '🧿', zh: '护符', en: 'Amulet' },
  { rarity: 'epic', icon: '🪄', zh: '魔杖', en: 'Wand' },
  { rarity: 'epic', icon: '🐉', zh: '龙鳞护甲', en: 'Dragon Scale' },
  { rarity: 'legendary', icon: '🌸', zh: '樱花圣徽', en: 'Sakura Sigil' },
]
 
const loot = reactive({
  flipped: false,
  result: null as LootItem | null,
})
 
// 权重抽取：只用数组 + weight，方便“调概率”而不改逻辑
const weightedPick = <T,>(entries: Array<{ item: T; weight: number }>): T => {
  const total = entries.reduce((sum, e) => sum + e.weight, 0)
  let r = Math.random() * total
  for (const e of entries) {
    r -= e.weight
    if (r <= 0) return e.item
  }
  return entries[entries.length - 1].item
}
 
const drawLoot = () => {
  const rarity = weightedPick<LootRarity>([
    { item: 'common', weight: 72 },
    { item: 'rare', weight: 20 },
    { item: 'epic', weight: 7 },
    { item: 'legendary', weight: 1 },
  ])
 
  const candidates = lootItems.filter(i => i.rarity === rarity)
  const item = candidates[Math.floor(Math.random() * candidates.length)]
  loot.result = item
  loot.flipped = true
}
 
const resetLoot = () => {
  loot.flipped = false
  loot.result = null
}
 
const transferTasksZh = [
  '写一个按钮 base：padding/圆角/字体/transition，只用 transform/opacity/box-shadow 做交互。',
  '补齐可访问性：:focus-visible 的高对比描边 + disabled 态（cursor/opacity/可点击）。',
  '做一个皮肤：用 CSS 变量控制主色与发光强度，用 ::before/::after 分层（光晕/高光）。',
  '写一个 data-state 的按钮：waiting/ready/done 三个状态由 CSS 渲染。',
  '写一个 3D 翻牌：perspective + preserve-3d + backface-visibility + rotateY。',
]

const transferTasksEn = [
  'Build a button base: padding/radius/typography/transition; interactions via transform/opacity/box-shadow only.',
  'Add a11y: high-contrast :focus-visible ring + proper disabled state (cursor/opacity/clickability).',
  'Create one skin: CSS variables for hue/glow; layer visuals with ::before/::after.',
  'Build a data-state button: waiting/ready/done rendered purely by CSS.',
  'Build a 3D flip: perspective + preserve-3d + backface-visibility + rotateY.',
]

const transferAcceptanceZh = [
  'hover/active 不改变布局（不改 width/height/margin），主要用 transform/opacity/filter/box-shadow。',
  '键盘 Tab 能看到 focus-visible，鼠标点击不出现“多余描边”。',
  '禁用态不可点击（disabled 生效），视觉上对比度与可读性仍 OK。',
  '3D 翻转背面不穿帮（反面不可见），翻转手感稳定。',
  'prefers-reduced-motion: reduce 下，关键循环动画被关闭。',
]

const transferAcceptanceEn = [
  'Hover/active do not change layout (no width/height/margin); use transform/opacity/filter/box-shadow.',
  'Focus ring appears on keyboard Tab via :focus-visible, not on mouse click.',
  'Disabled state is non-clickable and still readable.',
  '3D flip does not show mirrored backside; flip feels stable.',
  'Under prefers-reduced-motion: reduce, looping animations are disabled.',
]

const selfCheckQuestions: LabSelfCheckQuestion[] = [
  {
    id: 'focus-visible',
    questionZh: '为什么按钮更推荐用 :focus-visible，而不是只用 :focus？',
    questionEn: 'Why prefer :focus-visible instead of only :focus on buttons?',
    optionsZh: ['因为 :focus-visible 性能更好', '因为它只在键盘导航时显示焦点，避免鼠标点击出现描边', '因为 :focus-visible 兼容性更好', '因为 :focus 不会触发'],
    optionsEn: ['Because :focus-visible is faster', 'It shows focus only for keyboard navigation, avoiding focus ring on mouse click', 'Because :focus-visible has better compatibility', ':focus never triggers'],
    answerIndex: 1,
    explanationZh: '键盘用户需要清晰焦点；鼠标用户通常不需要。:focus-visible 能兼顾可访问性与观感。',
    explanationEn: 'Keyboard users need a visible focus indicator, mouse users usually don’t. :focus-visible balances a11y and aesthetics.',
  },
  {
    id: 'layout-trigger',
    questionZh: '下面哪个属性变化最容易触发布局（layout）并导致性能更差？',
    questionEn: 'Which property change is most likely to trigger layout and hurt performance?',
    optionsZh: ['transform', 'opacity', 'width', 'filter'],
    optionsEn: ['transform', 'opacity', 'width', 'filter'],
    answerIndex: 2,
    explanationZh: 'width/height/margin 等会影响盒模型与布局，通常比 transform/opacity 更“重”。',
    explanationEn: 'width/height/margin affect layout/box model and are usually heavier than transform/opacity.',
  },
  {
    id: 'pseudo-layering',
    questionZh: '把“光晕/高光”放到 ::before/::after 的主要好处是：',
    questionEn: 'The main benefit of putting glow/highlight into ::before/::after is:',
    optionsZh: ['减少 DOM 层级，用分层做视觉，不影响内容层', '让按钮更容易被点击', '让 CSS 变量自动变成响应式', '避免需要 transition'],
    optionsEn: ['Fewer DOM nodes; layered visuals without affecting content layer', 'Makes the button more clickable', 'Makes CSS variables reactive automatically', 'Avoids needing transitions'],
    answerIndex: 0,
    explanationZh: '伪元素适合做装饰层：内容层（文字/图标）保持干净，视觉层可独立动画/模糊。',
    explanationEn: 'Pseudo-elements are great decoration layers: content stays clean while visuals animate/blur independently.',
  },
  {
    id: 'flip-key',
    questionZh: '3D 翻牌里，避免“背面反着透出来”的关键属性是：',
    questionEn: 'In a 3D flip, which property prevents the mirrored backside from showing through?',
    optionsZh: ['overflow: hidden', 'backface-visibility: hidden', 'position: relative', 'translateZ(0)'],
    optionsEn: ['overflow: hidden', 'backface-visibility: hidden', 'position: relative', 'translateZ(0)'],
    answerIndex: 1,
    explanationZh: 'backface-visibility: hidden 会在元素背向观察者时隐藏它，避免反面穿帮。',
    explanationEn: 'backface-visibility: hidden hides a face when it points away from the viewer.',
  },
  {
    id: 'data-state',
    questionZh: '用 data-state 作为“状态位”驱动样式的优势是：',
    questionEn: 'What is an advantage of using data-state as a styling state flag?',
    optionsZh: ['JS 只改状态，CSS 负责呈现，逻辑与样式解耦', 'CSS 会自动生成状态机', '可以不用写事件监听', '可以不用写 disabled'],
    optionsEn: ['JS only updates state, CSS renders it; logic and styling are decoupled', 'CSS automatically generates a state machine', 'No need for event listeners', 'No need for disabled state'],
    answerIndex: 0,
    explanationZh: '状态位统一、可读性强，也方便 DevTools 观察；样式与逻辑分层更清晰。',
    explanationEn: 'State flags are explicit and DevTools-friendly; it keeps logic and styling cleanly separated.',
  },
]

// SOURCE: Loot
const lootCode = computed(() => {
  return `<!--
抽卡翻牌 = “状态位 + 3D 变换” 的组合拳
① 状态 class：is-flipped 控制翻转
② 状态 data-*：data-rarity 控制稀有度样式（不用 JS 直接写 style）
③ 视觉：perspective + preserve-3d + backface-visibility
-->

<!-- HTML（关键点：外层给 perspective；内层负责 rotateY；正反两面 backface-visibility） -->
<div class="loot-card is-flipped" data-rarity="epic">
  <div class="loot-card__inner">
    <div class="loot-card__face loot-card__front">?</div>
    <div class="loot-card__face loot-card__back">🌸 EPIC</div>
  </div>
</div>

/* CSS（3D 翻转） */
.loot-card {
  perspective: 1100px;
}
.loot-card__inner {
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.loot-card.is-flipped .loot-card__inner {
  transform: rotateY(180deg);
}
.loot-card__face {
  backface-visibility: hidden;
}
.loot-card__back {
  transform: rotateY(180deg);
}

/* 稀有度：把“皮肤规则”写在 CSS，JS 只负责决定 rarity */
.loot-card[data-rarity='rare']      { filter: drop-shadow(0 22px 50px rgba(59, 130, 246, 0.25)); }
.loot-card[data-rarity='epic']      { filter: drop-shadow(0 22px 55px rgba(139, 92, 246, 0.28)); }
.loot-card[data-rarity='legendary'] { filter: drop-shadow(0 22px 60px rgba(245, 158, 11, 0.28)); }

// JS（权重抽取：把概率写成 weight，便于调整）
const rarity = weightedPick([
  { item: 'common', weight: 72 },
  { item: 'rare', weight: 20 },
  { item: 'epic', weight: 7 },
  { item: 'legendary', weight: 1 },
])
loot.result = pickOne(lootItems.filter(i => i.rarity === rarity))
loot.flipped = true`
})
 
// SOURCE: Reflex
const reflexCode = computed(() => {
  return `/*
反应力小游戏 = “状态机 + data-state 驱动样式”
① JS 只负责状态流转（idle → waiting → ready → done）
② CSS 只负责按 data-state 渲染外观（waiting 脉冲 / ready 发光）
③ 关键：避免改 width/height/margin 等会触发布局的属性，动效用 transform/opacity
*/

<!-- HTML（关键点：把状态写进 data-state；样式选择器就很干净） -->
<button class="reflex-btn" data-state="waiting">
  <span class="reflex-btn__title">Wait...</span>
  <span class="reflex-btn__sub">Too early will fail</span>
</button>

/* CSS（用 data-state 做“开关”） */
.reflex-btn[data-state='waiting'] {
  animation: waitingPulse 1.05s ease-in-out infinite;
}
.reflex-btn[data-state='ready'] {
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.92));
  animation: readyGlow 0.7s ease-in-out infinite;
}
.reflex-btn[data-state='ready']:active {
  transform: scale(0.985);
}

// JS（核心：一个 timer + 一个 readyAt 计时点）
let timer = 0
let readyAt = 0

function start() {
  clearTimeout(timer)
  setState('waiting')
  timer = window.setTimeout(() => {
    readyAt = performance.now()
    setState('ready')
  }, 700 + Math.random() * 1800)
}

function hit() {
  if (state === 'waiting') failEarly()
  if (state === 'ready') record(Math.round(performance.now() - readyAt))
  setState('done')
}`
})
 
onBeforeUnmount(() => {
  clearReflexTimer()
})
</script>
 
<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
 
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
 
/* === Arcade Button（base + variants）==================================== */
.arcade-btn {
  --_h: var(--arcade-hue, 155);
  --_r: var(--arcade-radius, 16px);
  --_g: var(--arcade-glow, 0.7);
  appearance: none;
  border: 0;
  border-radius: var(--_r);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: 0.2px;
  user-select: none;
  position: relative;
  transform: translateZ(0);
  will-change: transform, filter, box-shadow;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
 
.arcade-btn.is-sm {
  padding: 10px 14px;
  font-size: 12px;
}
 
.arcade-btn.is-md {
  padding: 12px 16px;
  font-size: 13px;
}
 
.arcade-btn.is-lg {
  padding: 14px 18px;
  font-size: 14px;
}
 
.arcade-btn:focus-visible {
  outline: 3px solid hsl(var(--_h) 90% 55% / 0.55);
  outline-offset: 3px;
}
 
.arcade-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  filter: grayscale(0.25);
}
 
.arcade-btn__icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
}
 
.arcade-btn__label {
  white-space: nowrap;
}
 
.arcade-btn__badge {
  margin-left: 2px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
}
 
.arcade-btn::before,
.arcade-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}
 
.arcade-btn::before {
  opacity: calc(var(--_g) * 0.9);
  filter: blur(16px);
  transform: translateY(10px);
}
 
.arcade-btn::after {
  opacity: 0.65;
  mask-image: radial-gradient(circle at 30% 20%, black 0%, transparent 65%);
}
 
.arcade-btn.is-neon {
  color: rgba(9, 14, 18, 0.92);
  background: linear-gradient(180deg, hsl(var(--_h) 90% 62%), hsl(var(--_h) 85% 52%));
  box-shadow:
    0 14px 35px hsl(var(--_h) 90% 55% / calc(var(--_g) * 0.5)),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
}
 
.arcade-btn.is-neon::before {
  background: radial-gradient(circle at 30% 20%, hsl(var(--_h) 95% 70%), transparent 55%),
    radial-gradient(circle at 70% 80%, hsl(calc(var(--_h) + 25) 95% 65%), transparent 60%);
}
 
.arcade-btn.is-neon::after {
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.6), transparent 55%);
}
 
.arcade-btn.is-neon:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: saturate(1.1);
}
 
.arcade-btn.is-neon:active:not(:disabled),
.arcade-btn.is-neon.is-pressed:not(:disabled) {
  transform: translateY(1px) scale(0.99);
  box-shadow:
    0 8px 18px hsl(var(--_h) 90% 55% / calc(var(--_g) * 0.35)),
    inset 0 2px 0 rgba(0, 0, 0, 0.12);
}
 
.arcade-btn.is-glass {
  color: rgba(255, 255, 255, 0.92);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(10px);
}
 
.arcade-btn.is-glass::before {
  background: radial-gradient(circle at 30% 20%, hsl(var(--_h) 95% 70% / 0.75), transparent 60%);
  opacity: calc(var(--_g) * 0.7);
}
 
.arcade-btn.is-glass::after {
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.7) 38%, transparent 70%);
  transform: translateX(-30%) skewX(-16deg);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
 
.arcade-btn.is-glass:hover:not(:disabled) {
  transform: translateY(-2px);
}
 
.arcade-btn.is-glass:hover:not(:disabled)::after {
  opacity: 0.55;
  transform: translateX(20%) skewX(-16deg);
}
 
.arcade-btn.is-glass:active:not(:disabled),
.arcade-btn.is-glass.is-pressed:not(:disabled) {
  transform: translateY(1px) scale(0.99);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.2),
    inset 0 2px 0 rgba(0, 0, 0, 0.14);
}
 
.arcade-btn.is-pixel {
  color: rgba(17, 24, 39, 0.95);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(236, 253, 245, 0.85));
  border: 2px solid rgba(0, 0, 0, 0.32);
  border-radius: 10px;
  box-shadow:
    0 10px 0 rgba(0, 0, 0, 0.22),
    0 18px 40px rgba(0, 0, 0, 0.16);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
 
.arcade-btn.is-pixel::before {
  background: radial-gradient(circle at 35% 25%, hsl(var(--_h) 95% 70% / 0.55), transparent 58%);
  opacity: calc(var(--_g) * 0.6);
}
 
.arcade-btn.is-pixel::after {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), transparent);
  opacity: 0.55;
}
 
.arcade-btn.is-pixel:hover:not(:disabled) {
  transform: translateY(-2px);
}
 
.arcade-btn.is-pixel:active:not(:disabled),
.arcade-btn.is-pixel.is-pressed:not(:disabled) {
  transform: translateY(6px);
  box-shadow:
    0 4px 0 rgba(0, 0, 0, 0.25),
    0 10px 26px rgba(0, 0, 0, 0.14);
}
 
.arcade-btn.is-secondary {
  filter: saturate(0.88);
}
 
.arcade-btn.is-danger {
  --_h: 350;
}
 
/* === Reflex Button（data-state driven）================================== */
.reflex-btn {
  width: 100%;
  height: 180px;
  border-radius: 22px;
  border: 1px solid rgba(17, 24, 39, 0.12);
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.55), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(249, 250, 251, 0.86));
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.08);
  color: rgba(17, 24, 39, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, background 0.18s ease;
  user-select: none;
}
 
.reflex-btn__title {
  font-weight: 900;
  font-size: 26px;
  letter-spacing: 0.3px;
}
 
.reflex-btn__sub {
  font-size: 12px;
  opacity: 0.8;
}
 
.reflex-btn[data-state='waiting'] {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(226, 232, 240, 0.86));
  filter: saturate(0.95);
  animation: waitingPulse 1.05s ease-in-out infinite;
}
 
.reflex-btn[data-state='ready'] {
  border-color: rgba(16, 185, 129, 0.35);
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.55), transparent 55%),
    linear-gradient(180deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.92));
  color: rgba(255, 255, 255, 0.96);
  box-shadow: 0 25px 70px rgba(16, 185, 129, 0.25);
  animation: readyGlow 0.7s ease-in-out infinite;
}
 
.reflex-btn[data-state='ready']:active {
  transform: scale(0.985);
}
 
.reflex-btn[data-state='done'] {
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.35), transparent 55%),
    linear-gradient(180deg, rgba(99, 102, 241, 0.88), rgba(79, 70, 229, 0.88));
  color: rgba(255, 255, 255, 0.96);
  box-shadow: 0 25px 70px rgba(99, 102, 241, 0.25);
}
 
@keyframes waitingPulse {
  0%,
  100% {
    box-shadow: 0 18px 55px rgba(0, 0, 0, 0.08);
  }
  50% {
    box-shadow: 0 18px 55px rgba(0, 0, 0, 0.12);
  }
}
 
@keyframes readyGlow {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.08);
  }
}
 
@media (prefers-reduced-motion: reduce) {
  .reflex-btn[data-state='waiting'],
  .reflex-btn[data-state='ready'] {
    animation: none;
  }
}
 
/* === Loot Card（3D flip + rarity）====================================== */
.loot-card {
  width: 240px;
  height: 320px;
  border-radius: 22px;
  perspective: 1100px;
  transform: translateZ(0);
  filter: drop-shadow(0 22px 50px rgba(0, 0, 0, 0.14));
}
 
.loot-card__inner {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}
 
.loot-card.is-flipped .loot-card__inner {
  transform: rotateY(180deg);
}
 
.loot-card__face {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(17, 24, 39, 0.12);
}
 
.loot-card__front {
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.55), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(241, 245, 249, 0.9));
}
 
.loot-card__back {
  transform: rotateY(180deg);
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.4), transparent 55%),
    linear-gradient(180deg, rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.14));
}
 
.loot-card__icon {
  font-size: 52px;
  font-weight: 900;
}
 
.loot-card__text {
  font-weight: 900;
  letter-spacing: 0.3px;
  color: rgba(17, 24, 39, 0.9);
}
 
.loot-card__back .loot-card__text {
  color: rgba(17, 24, 39, 0.92);
}
 
.loot-card__rarity {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.2px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(17, 24, 39, 0.12);
}
 
.loot-card[data-rarity='rare'] {
  filter: drop-shadow(0 22px 50px rgba(59, 130, 246, 0.25));
}
 
.loot-card[data-rarity='epic'] {
  filter: drop-shadow(0 22px 55px rgba(139, 92, 246, 0.28));
}
 
.loot-card[data-rarity='legendary'] {
  filter: drop-shadow(0 22px 60px rgba(245, 158, 11, 0.28));
}
</style>
