<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-amber-200 dark:border-amber-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🎮</div>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'JS 小游戏扩展：事件与状态机' : 'JS Arcade (Extra): Events & State Machines' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ isZh ? '把“用户操作 → 事件 → 状态变化 → UI 更新”练成肌肉记忆。' : 'Make “action → event → state → UI update” a reflex.' }}
        </p>
      </div>
    </div>

    <div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6">
      <div class="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2">
        {{ isZh ? '这一节专练三件事' : 'Three things to practice' }}
      </div>
      <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
        <li>✅ {{ isZh ? '事件委托：容器一个监听，管理动态子元素' : 'Event delegation: one listener on container for many children' }}</li>
        <li>✅ {{ isZh ? '最小状态机：idle/running + data-* 状态位' : 'Minimal state machine: idle/running + data-* flags' }}</li>
        <li>✅ {{ isZh ? '键盘事件：keydown + 组合键检测' : 'Keyboard events: keydown + combo detection' }}</li>
      </ul>
    </div>

    <div class="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-amber-50 dark:bg-gray-700 text-amber-800 dark:text-amber-200'"
        @click="activeTab = tab.id"
      >
        {{ isZh ? tab.labelZh : tab.labelEn }}
      </button>
    </div>

    <div v-if="activeTab === 'mole'" class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-100">
                  {{ isZh ? '事件委托：点亮的格子' : 'Delegation: Hit the lit cell' }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ isZh ? '点击网格容器即可：用 e.target.closest 找到按钮。' : 'Click inside the grid: use e.target.closest to find a button.' }}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:opacity-90"
                  @click="toggleMole"
                >
                  {{ mole.running ? (isZh ? '暂停' : 'Pause') : (isZh ? '开始' : 'Start') }}
                </button>
                <button
                  type="button"
                  class="px-3 py-2 rounded-xl text-xs font-bold bg-gray-600 text-white hover:opacity-90"
                  @click="resetMole"
                >
                  {{ isZh ? '重置' : 'Reset' }}
                </button>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-4 gap-3 text-xs">
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
                <div class="text-gray-500">{{ isZh ? '分数' : 'Score' }}</div>
                <div class="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ mole.score }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
                <div class="text-gray-500">{{ isZh ? '命中' : 'Hits' }}</div>
                <div class="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{{ mole.hits }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
                <div class="text-gray-500">{{ isZh ? '失误' : 'Miss' }}</div>
                <div class="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">{{ mole.misses }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
                <div class="text-gray-500">{{ isZh ? '速度' : 'Speed' }}</div>
                <div class="text-[11px] font-mono mt-1 text-gray-700 dark:text-gray-200">{{ mole.intervalMs }}ms</div>
              </div>
            </div>

            <div class="mt-4">
              <label class="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
                <span>{{ isZh ? '刷新间隔' : 'Tick interval' }}</span>
                <span class="font-mono">{{ mole.intervalMs }}ms</span>
              </label>
              <input
                v-model.number="mole.intervalMs"
                type="range"
                min="250"
                max="1400"
                step="50"
                class="w-full accent-amber-500"
                @change="restartMoleTimerIfRunning"
              />
            </div>

            <div
              class="mt-5 grid grid-cols-3 gap-3 select-none"
              data-arcade="mole-grid"
              @click="onMoleGridClick"
            >
              <button
                v-for="cell in moleCells"
                :key="cell"
                type="button"
                class="h-16 rounded-2xl border font-bold transition-transform active:scale-[0.98]"
                :data-cell="cell"
                :class="cell === mole.activeCell ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/70 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90'"
              >
                {{ cell === mole.activeCell ? '★' : '' }}
              </button>
            </div>

            <div class="mt-3 text-xs text-gray-600 dark:text-gray-400">
              {{ isZh ? '提示：这里用“事件委托”，容器只绑定一次 click 监听。' : 'Tip: event delegation — the container owns a single click listener.' }}
            </div>
          </div>

          <LabCodeBlock
            :lang="props.lang"
            :title="isZh ? '注释源码：事件委托（vanilla JS）' : 'Annotated source: Event delegation (vanilla JS)'"
            :code="moleCode"
            :path="sourcePath"
            token="find:SOURCE: Mole"
          />
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div class="font-bold text-gray-800 dark:text-gray-100 mb-2">
              {{ isZh ? '为什么它能学到“主线”？' : 'How it connects to the mainline' }}
            </div>
            <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <li>• {{ isZh ? '主线交互都离不开：事件 → 状态 → UI' : 'Mainline interactions are always: event → state → UI' }}</li>
              <li>• {{ isZh ? '事件委托适合：列表/菜单/搜索结果等动态 DOM' : 'Delegation fits dynamic DOM: lists/menus/search results' }}</li>
              <li>• {{ isZh ? '定时器需要清理：否则会“幽灵更新”' : 'Timers must be cleared to avoid “ghost updates”' }}</li>
            </ul>
          </div>

          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div class="font-bold text-gray-800 dark:text-gray-100 mb-2">
              {{ isZh ? '练习建议（读者自己动手）' : 'Suggested exercises' }}
            </div>
            <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <li>• {{ isZh ? '把网格改成 4x4，并保证 activeCell 不连续重复' : 'Change to 4x4 and avoid repeating the same active cell' }}</li>
              <li>• {{ isZh ? '加入 “连击” 规则：连续命中加倍' : 'Add a combo rule: consecutive hits multiply score' }}</li>
              <li>• {{ isZh ? '加入 “难度” 下拉：改变 intervalMs 与扣分策略' : 'Add a difficulty dropdown to change intervalMs and penalty rules' }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="animate-fade-in space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-100">
                  {{ isZh ? '组合键训练器' : 'Key combo trainer' }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ isZh ? '开启捕获后按键；在时间窗内完成序列即算成功。' : 'Enable capture and type; finish sequence in time window to succeed.' }}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:opacity-90"
                  @click="combo.capture = !combo.capture"
                >
                  {{ combo.capture ? (isZh ? '停止捕获' : 'Stop') : (isZh ? '开始捕获' : 'Capture') }}
                </button>
                <button
                  type="button"
                  class="px-3 py-2 rounded-xl text-xs font-bold bg-gray-600 text-white hover:opacity-90"
                  @click="resetCombo"
                >
                  {{ isZh ? '重置' : 'Reset' }}
                </button>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label class="text-xs text-gray-600 dark:text-gray-400">
                <div class="font-bold mb-1">{{ isZh ? '目标连招' : 'Target combo' }}</div>
                <select
                  v-model="combo.selectedId"
                  class="w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/40 text-xs"
                >
                  <option v-for="c in comboList" :key="c.id" :value="c.id">{{ c.label }}</option>
                </select>
              </label>

              <label class="text-xs text-gray-600 dark:text-gray-400">
                <div class="font-bold mb-1">{{ isZh ? '时间窗' : 'Time window' }}: <span class="font-mono">{{ combo.windowMs }}ms</span></div>
                <input v-model.number="combo.windowMs" type="range" min="250" max="1600" step="50" class="w-full accent-amber-500" />
              </label>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
                <div class="text-gray-500">{{ isZh ? '成功' : 'Success' }}</div>
                <div class="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{{ combo.success }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
                <div class="text-gray-500">{{ isZh ? '进度' : 'Progress' }}</div>
                <div class="text-[11px] font-mono mt-1 text-gray-700 dark:text-gray-200">{{ comboProgress }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
                <div class="text-gray-500">{{ isZh ? '捕获' : 'Capture' }}</div>
                <div class="text-[11px] font-mono mt-1" :class="combo.capture ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'">
                  {{ combo.capture ? (isZh ? 'ON' : 'ON') : (isZh ? 'OFF' : 'OFF') }}
                </div>
              </div>
            </div>

            <div class="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-4">
              <div class="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2">
                {{ isZh ? '最近按键（从新到旧）' : 'Recent keys (newest first)' }}
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(k, idx) in combo.recent"
                  :key="idx"
                  class="px-2 py-1 rounded-lg text-[11px] font-mono border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-200"
                >
                  {{ k }}
                </span>
                <span v-if="combo.recent.length === 0" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ isZh ? '还没有输入' : 'No input yet' }}
                </span>
              </div>
            </div>
          </div>

          <LabCodeBlock
            :lang="props.lang"
            :title="isZh ? '注释源码：键盘连招检测（vanilla JS）' : 'Annotated source: Combo matcher (vanilla JS)'"
            :code="comboCode"
            :path="sourcePath"
            token="find:SOURCE: Combo"
          />
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div class="font-bold text-gray-800 dark:text-gray-100 mb-2">
              {{ isZh ? '常见坑点' : 'Common pitfalls' }}
            </div>
            <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <li>• {{ isZh ? '记得移除 window 的监听（mounted 添加，unmount 清理）' : 'Remove window listeners (add on mount, cleanup on unmount)' }}</li>
              <li>• {{ isZh ? 'event.key 不是 keyCode；组合键要考虑大小写与特殊键' : 'event.key is not keyCode; normalize casing and special keys' }}</li>
              <li>• {{ isZh ? '不要在输入框里抢快捷键（需要 guard）' : 'Don’t steal shortcuts inside inputs (guard needed)' }}</li>
            </ul>
          </div>

          <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div class="font-bold text-gray-800 dark:text-gray-100 mb-2">
              {{ isZh ? '扩展玩法' : 'Extensions' }}
            </div>
            <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <li>• {{ isZh ? '加入“节流”：同一按键在 50ms 内忽略，避免长按刷屏' : 'Add throttling: ignore repeats within 50ms to avoid key-hold spam' }}</li>
              <li>• {{ isZh ? '加入“提示”：UI 上高亮下一步应按的键' : 'Add hints: highlight the next expected key in UI' }}</li>
              <li>• {{ isZh ? '加入“持久化”：把 best streak 存到 localStorage' : 'Persist best streak via localStorage' }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <LabTransferAndCheck
      :lang="props.lang"
      transfer-title-zh="把两个小游戏迁移成“可复用工具函数”"
      transfer-title-en="Transfer the two mini games into reusable utilities"
      transfer-desc-zh="目标：写出你自己的 delegate() 与 comboMatcher()，并能解释它们解决了什么问题。"
      transfer-desc-en="Goal: build your own delegate() and comboMatcher() and explain what problems they solve."
      :transfer-tasks-zh="transferTasksZh"
      :transfer-tasks-en="transferTasksEn"
      :transfer-acceptance-zh="transferAcceptanceZh"
      :transfer-acceptance-en="transferAcceptanceEn"
      :source-path="sourcePath"
      source-token="find:SOURCE: Mole"
      source-focus-zh="带问题阅读：1) SOURCE: Mole：看事件委托是怎么通过 closest 找到 cell 的。2) SOURCE: Combo：看“时间窗”是怎么控制连招有效期的。3) 找到所有 timer/listener 的清理点，解释为什么必须清理。"
      source-focus-en="Reading prompts:\n1) SOURCE: Mole: see how closest() locates the cell via delegation.\n2) SOURCE: Combo: see how the time window bounds the combo.\n3) Find all cleanup points for timers/listeners and explain why they matter."
      :questions="selfCheckQuestions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import LabCodeBlock from '../ui/LabCodeBlock.vue'
import LabTransferAndCheck, { type LabSelfCheckQuestion } from '../ui/LabTransferAndCheck.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')
const sourcePath = 'src/components/lab/stage2-js-basics/LabJsDomArcade.vue'

const tabs = [
  { id: 'mole', labelZh: '事件委托', labelEn: 'Delegation' },
  { id: 'combo', labelZh: '键盘连招', labelEn: 'Key Combo' },
] as const

const activeTab = ref<(typeof tabs)[number]['id']>('mole')

const mole = reactive({
  running: false,
  activeCell: 4,
  score: 0,
  hits: 0,
  misses: 0,
  intervalMs: 800,
})

const moleCells = Array.from({ length: 9 }).map((_, i) => i)
let moleTimer: number | undefined

const stopMoleTimer = () => {
  if (moleTimer != null) window.clearInterval(moleTimer)
  moleTimer = undefined
}

const pickNextCell = () => {
  let next = mole.activeCell
  while (next === mole.activeCell) next = Math.floor(Math.random() * moleCells.length)
  mole.activeCell = next
}

const startMoleTimer = () => {
  stopMoleTimer()
  moleTimer = window.setInterval(() => pickNextCell(), mole.intervalMs)
}

const toggleMole = () => {
  mole.running = !mole.running
  if (mole.running) startMoleTimer()
  else stopMoleTimer()
}

const resetMole = () => {
  mole.running = false
  stopMoleTimer()
  mole.activeCell = 4
  mole.score = 0
  mole.hits = 0
  mole.misses = 0
}

const restartMoleTimerIfRunning = () => {
  if (!mole.running) return
  startMoleTimer()
}

const onMoleGridClick = (evt: MouseEvent) => {
  const target = evt.target as HTMLElement | null
  const btn = target?.closest?.('[data-cell]') as HTMLElement | null
  if (!btn) return
  const raw = btn.getAttribute('data-cell')
  const cell = raw == null ? NaN : Number(raw)
  if (!Number.isFinite(cell)) return

  if (!mole.running) return

  if (cell === mole.activeCell) {
    mole.score += 1
    mole.hits += 1
    pickNextCell()
    return
  }

  mole.score -= 1
  mole.misses += 1
}

type ComboDef = { id: string; label: string; keys: string[] }

const comboList: ComboDef[] = [
  { id: 'gg', label: 'g g', keys: ['g', 'g'] },
  { id: 'kj', label: 'k j', keys: ['k', 'j'] },
  { id: 'upup', label: '↑ ↑ ↓ ↓', keys: ['arrowup', 'arrowup', 'arrowdown', 'arrowdown'] },
]

const combo = reactive({
  capture: false,
  selectedId: 'gg',
  windowMs: 700,
  recent: [] as string[],
  buffer: [] as Array<{ key: string; at: number }>,
  success: 0,
})

const selectedCombo = computed(() => comboList.find(c => c.id === combo.selectedId) || comboList[0])

const comboProgress = computed(() => {
  const target = selectedCombo.value.keys
  const buf = combo.buffer.map(b => b.key)
  const ok = buf.join(' ')
  const expect = target.join(' ')
  return `${ok || '—'} / ${expect}`
})

const normalizeKey = (e: KeyboardEvent) => {
  const k = String(e.key || '').toLowerCase()
  if (k === ' ') return 'space'
  return k
}

const pushRecent = (k: string) => {
  combo.recent = [k, ...combo.recent].slice(0, 10)
}

const resetCombo = () => {
  combo.buffer = []
  combo.recent = []
  combo.success = 0
}

const pruneBuffer = (now: number) => {
  const cutoff = now - combo.windowMs
  combo.buffer = combo.buffer.filter(x => x.at >= cutoff)
}

const tryMatchCombo = () => {
  const target = selectedCombo.value.keys
  const buf = combo.buffer.map(b => b.key)
  if (buf.length < target.length) return false
  const tail = buf.slice(-target.length)
  if (tail.join('|') !== target.join('|')) return false
  return true
}

// SOURCE: Combo
const onKeydown = (e: KeyboardEvent) => {
  if (!combo.capture) return
  const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement | null)?.isContentEditable) return

  const now = performance.now()
  const k = normalizeKey(e)
  pushRecent(k)
  combo.buffer = [...combo.buffer, { key: k, at: now }]
  pruneBuffer(now)

  if (tryMatchCombo()) {
    combo.success += 1
    combo.buffer = []
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  stopMoleTimer()
})

// SOURCE: Mole
const moleCode = computed(() => {
  return `/**
 * 事件委托（Event Delegation）
 * 关键点：只在容器上绑定一次 click，用 e.target.closest 找到真正点到的按钮。
 */
const grid = document.querySelector('[data-arcade=\"mole-grid\"]')
let activeCell = 4
let score = 0

function pickNextCell() {
  // 避免连续重复同一个格子
  let next = activeCell
  while (next === activeCell) next = Math.floor(Math.random() * 9)
  activeCell = next
  render()
}

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cell]')
  if (!btn) return
  const cell = Number(btn.getAttribute('data-cell'))
  if (cell === activeCell) {
    score += 1
    pickNextCell()
  } else {
    score -= 1
  }
  render()
})

// 定时器：记得在离开页面时 clearInterval，否则会“幽灵更新”
const timer = setInterval(pickNextCell, 800)`
})

const comboCode = computed(() => {
  return `/**
 * 键盘连招检测（Combo Matcher）
 * 关键点：用“时间窗”丢弃过老输入，只看最后 N 个键是否匹配目标序列。
 */
const target = ['g', 'g']
let buffer = [] // [{ key, at }]

function prune(now, windowMs) {
  const cutoff = now - windowMs
  buffer = buffer.filter(x => x.at >= cutoff)
}

function match() {
  const tail = buffer.map(b => b.key).slice(-target.length)
  return tail.join('|') === target.join('|')
}

window.addEventListener('keydown', (e) => {
  const now = performance.now()
  const key = String(e.key || '').toLowerCase()
  buffer.push({ key, at: now })
  prune(now, 700)
  if (match()) {
    console.log('combo!')
    buffer = []
  }
})`
})

const transferTasksZh = [
  '实现一个 delegate(container, selector, handler)：支持动态元素点击。',
  '把“点亮格子”改成动态列表（新增/删除按钮），确保不需要给每个子项单独绑定监听。',
  '实现 createComboMatcher(keys, windowMs)：返回一个函数，喂入 key 后返回是否命中。',
  '加一个 cleanup：离开页面时移除监听/清理 timer。',
]

const transferTasksEn = [
  'Implement delegate(container, selector, handler): handle clicks on dynamic children.',
  'Turn the grid into a dynamic list (add/remove items) without per-item listeners.',
  'Implement createComboMatcher(keys, windowMs): feed keys and return whether it matches.',
  'Add cleanup: remove listeners / clear timers on unmount.',
]

const transferAcceptanceZh = [
  '新增/删除子元素后，点击仍能触发（证明事件委托生效）。',
  '连招必须在时间窗内完成；超时会失败（buffer 被 prune）。',
  '组件卸载后不再打印按键、不再自动 tick（证明 cleanup 生效）。',
]

const transferAcceptanceEn = [
  'After adding/removing children, clicks still work (delegation works).',
  'Combos must be completed within the time window; timeout fails (buffer pruned).',
  'After unmount, no key logs and no ticking (cleanup works).',
]

const selfCheckQuestions: LabSelfCheckQuestion[] = [
  {
    id: 'delegation-why',
    questionZh: '事件委托最适合解决哪类场景？',
    questionEn: 'Event delegation is best for which scenario?',
    optionsZh: ['只需要监听一个固定按钮', '列表项会频繁增删改（动态 DOM）', '只在 CSS 里做 hover', '只做一次性的 setTimeout'],
    optionsEn: ['One fixed button only', 'List items are frequently added/removed (dynamic DOM)', 'Only CSS hover styling', 'Only one-shot setTimeout'],
    answerIndex: 1,
    explanationZh: '动态列表如果给每个子项绑监听，维护成本高且容易遗漏清理；委托让容器统一处理。',
    explanationEn: 'Per-item listeners are hard to manage and cleanup in dynamic lists; delegation centralizes handling on the container.',
  },
  {
    id: 'closest',
    questionZh: '为什么很多时候要用 e.target.closest(selector)，而不是直接用 e.target？',
    questionEn: 'Why use e.target.closest(selector) instead of using e.target directly?',
    optionsZh: ['因为 closest 更快', '因为点击可能落在子元素上，需要向上找到带标记的父元素', '因为 e.target 不存在', '因为 closest 能阻止冒泡'],
    optionsEn: ['Because closest is faster', 'Click may land on a nested element; closest finds the marked ancestor', 'Because e.target does not exist', 'Because closest stops bubbling'],
    answerIndex: 1,
    explanationZh: '真实 UI 里按钮往往有 icon/span 等嵌套，closest 能把事件归一到“有 data-* 的元素”。',
    explanationEn: 'Real buttons often contain nested spans/icons; closest maps the event to the element carrying data-* attributes.',
  },
  {
    id: 'cleanup',
    questionZh: '以下哪一项最容易导致“幽灵更新/内存泄漏”？',
    questionEn: 'Which is most likely to cause “ghost updates” / memory leaks?',
    optionsZh: ['忘记 clearInterval', '用 transform 做动画', '用 const 声明变量', '用 Array.map'],
    optionsEn: ['Forgetting to clearInterval', 'Animating with transform', 'Using const', 'Using Array.map'],
    answerIndex: 0,
    explanationZh: '定时器和全局事件监听如果不清理，会在组件卸载后继续运行，导致隐藏 bug。',
    explanationEn: 'Timers and global listeners keep running after unmount unless cleaned up, causing hidden bugs.',
  },
  {
    id: 'keydown',
    questionZh: '做快捷键/连招检测时，通常更常用哪个事件？',
    questionEn: 'For shortcuts/combos, which event is commonly used?',
    optionsZh: ['keydown', 'click', 'mousemove', 'resize'],
    optionsEn: ['keydown', 'click', 'mousemove', 'resize'],
    answerIndex: 0,
    explanationZh: 'keydown 触发及时，适合做快捷键；但要注意在输入框里需要 guard，避免抢用户输入。',
    explanationEn: 'keydown triggers immediately and fits shortcuts; guard against inputs to avoid stealing typing.',
  },
]
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
</style>
