<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-purple-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <div class="flex items-start gap-4">
      <div class="flex-1">
        <h3 class="text-lg font-bold text-purple-800 dark:text-purple-300">
          {{ isZh ? 'computed 与 watch / watchEffect' : 'computed & watch / watchEffect' }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{
            isZh
              ? 'computed 用来“派生值”，watch 用来“响应变化做副作用”。本例用一个小计价器对比两者的触发时机与写法。'
              : 'computed is for derived values; watch is for side effects on change. This demo compares triggers and usage with a tiny calculator.'
          }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
          :class="
            watchEnabled
              ? 'bg-purple-600 text-white border-purple-700'
              : 'bg-white/60 dark:bg-gray-900/30 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          "
          @click="toggleWatch()"
        >
          {{ isZh ? 'watch' : 'watch' }}: {{ watchEnabled ? (isZh ? '开' : 'on') : (isZh ? '关' : 'off') }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
          :class="
            effectEnabled
              ? 'bg-indigo-600 text-white border-indigo-700'
              : 'bg-white/60 dark:bg-gray-900/30 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          "
          @click="toggleEffect()"
        >
          {{ isZh ? 'watchEffect' : 'watchEffect' }}: {{ effectEnabled ? (isZh ? '开' : 'on') : (isZh ? '关' : 'off') }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-900 text-white border-gray-800 hover:bg-black transition-all"
          @click="clearLogs()"
        >
          {{ isZh ? '清空日志' : 'Clear logs' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="space-y-5">
        <div class="bg-purple-50 dark:bg-purple-900/15 rounded-xl border border-purple-200 dark:border-purple-900/40 p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm font-bold text-purple-800 dark:text-purple-200">
              {{ isZh ? '输入（响应式来源）' : 'Inputs (reactive sources)' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ isZh ? '改动这里会触发 watch/watchEffect' : 'Changes here trigger watch/watchEffect' }}
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                <span>{{ isZh ? '单价' : 'Price' }}</span>
                <span class="font-mono text-purple-700 dark:text-purple-300">{{ price }}</span>
              </div>
              <input v-model.number="price" type="range" min="1" max="99" class="w-full accent-purple-600" />
            </div>

            <div>
              <div class="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                <span>{{ isZh ? '数量' : 'Quantity' }}</span>
                <span class="font-mono text-purple-700 dark:text-purple-300">{{ qty }}</span>
              </div>
              <input v-model.number="qty" type="range" min="1" max="12" class="w-full accent-purple-600" />
            </div>

            <div>
              <div class="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                <span>{{ isZh ? '折扣（%）' : 'Discount (%)' }}</span>
                <span class="font-mono text-purple-700 dark:text-purple-300">{{ discount }}</span>
              </div>
              <input v-model.number="discount" type="range" min="0" max="60" class="w-full accent-purple-600" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">
            {{ isZh ? '派生值（computed）' : 'Derived values (computed)' }}
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-1">subtotal</div>
              <div class="font-mono text-gray-800 dark:text-gray-100">{{ subtotal }}</div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-1">total</div>
              <div class="font-mono text-purple-700 dark:text-purple-300">{{ total }}</div>
            </div>
          </div>

          <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {{
              isZh
                ? 'computed 只有在依赖变化时才会重新计算，并且会缓存结果。模板/其他 computed 读取时才会求值。'
                : 'computed recomputes when dependencies change and caches results. It evaluates when accessed by template/other computed.'
            }}
          </div>
        </div>
      </div>

      <div class="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {{ isZh ? '副作用日志' : 'Side-effect logs' }}
          </div>
          <div class="ml-auto text-[10px] text-gray-500 font-mono">
            {{ isZh ? '最多保留 60 条' : 'Keeps last 60' }}
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 font-mono text-[11px] leading-relaxed">
          <div v-if="logs.length === 0" class="text-gray-600 italic">
            {{ isZh ? '暂无日志，试试拖动滑块。' : 'No logs yet. Try moving sliders.' }}
          </div>
          <div v-for="(l, idx) in logs" :key="idx" class="text-gray-200">
            <span class="text-gray-500">[{{ l.time }}]</span>
            <span class="ml-2" :class="l.kind === 'watch' ? 'text-purple-300' : l.kind === 'effect' ? 'text-indigo-300' : 'text-gray-300'">
              {{ l.tag }}
            </span>
            <span class="ml-2 text-gray-200">{{ l.message }}</span>
          </div>
        </div>

        <div class="border-t border-gray-800 p-4">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {{ isZh ? '核心写法' : 'Key snippets' }}
          </div>
          <pre class="text-[11px] text-green-300 overflow-x-auto whitespace-pre-wrap">{{ codePreview }}</pre>
        </div>
      </div>
    </div>

    <details class="rounded-xl border border-purple-100 dark:border-gray-700 bg-purple-50/40 dark:bg-gray-900/20 p-4">
      <summary class="cursor-pointer font-bold text-purple-800 dark:text-purple-300 text-sm">
        {{ isZh ? '常见误区与判断标准' : 'Common pitfalls & decision rules' }}
      </summary>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
          <div class="font-bold text-gray-800 dark:text-gray-100">{{ isZh ? '误区：把副作用写进 computed' : 'Pitfall: side effects inside computed' }}</div>
          <div class="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
            {{ isZh ? 'computed 负责派生值，保持可缓存、可复用、可预测；请求/日志/存储放 watch/watchEffect。' : 'computed should stay pure and cacheable; put requests/logging/storage into watch/watchEffect.' }}
          </div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-3">
          <div class="font-bold text-gray-800 dark:text-gray-100">{{ isZh ? '误区：觉得 computed “不触发”' : 'Pitfall: “computed did not run”' }}</div>
          <div class="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
            {{ isZh ? 'computed 是惰性的：依赖变了会标脏，但只有被读取（模板/其他计算）时才会重新求值。' : 'computed is lazy: it re-evaluates when accessed (template/other computed), not immediately.' }}
          </div>
        </div>
      </div>
    </details>

    <LabTransferAndCheck
      :lang="props.lang"
      :transfer-title-zh="'迁移题：做一个“价格计算 + 上报”的小模块'"
      :transfer-title-en="'Transfer: a mini price module with reporting'"
      :transfer-desc-zh="'把本 Lab 的 computed / watch 思路迁移到一个更接近业务的场景：派生展示 + 变化上报。'"
      :transfer-desc-en="'Move computed/watch into a more business-like scenario: derived display + change reporting.'"
      :transfer-tasks-zh="[
        '实现：subtotal/total 用 computed 计算并渲染展示',
        '实现：total 变化时用 watch 触发“上报”（这里可以用日志列表代替请求）',
        '实现：提供一个“重置”为默认值的按钮'
      ]"
      :transfer-tasks-en="[
        'Use computed to derive subtotal/total and render them',
        'Use watch to “report” when total changes (logs instead of real network)',
        'Provide a reset button to restore defaults'
      ]"
      :transfer-acceptance-zh="[
        '拖动滑块时，computed 区域值稳定更新且不会重复计算到不可控',
        '上报只在 total 变化时发生，不写进 computed',
        '清空日志/重置后行为一致'
      ]"
      :transfer-acceptance-en="[
        'Computed values update predictably when inputs change',
        'Reporting happens on total change via watch (not inside computed)',
        'Clear logs/reset keeps behavior consistent'
      ]"
      source-path="src/components/lab/stage6-vue-core/LabComputedWatch.vue"
      :questions="selfCheck"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import LabTransferAndCheck, { type LabSelfCheckQuestion } from '../ui/LabTransferAndCheck.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

const price = ref(18)
const qty = ref(2)
const discount = ref(10)

const subtotal = computed(() => price.value * qty.value)
const total = computed(() => Math.max(0, Math.round(subtotal.value * (1 - discount.value / 100))))

type LogKind = 'watch' | 'effect' | 'system'
type LogItem = { time: string; kind: LogKind; tag: string; message: string }

const logs = ref<LogItem[]>([])

const pushLog = (kind: LogKind, tag: string, message: string) => {
  const time = new Date().toLocaleTimeString()
  logs.value = [{ time, kind, tag, message }, ...logs.value].slice(0, 60)
}

const clearLogs = () => {
  logs.value = []
}

const watchEnabled = ref(true)
const effectEnabled = ref(true)

let stopWatchFn: (() => void) | undefined
let stopEffectFn: (() => void) | undefined

const startWatch = () => {
  stopWatchFn?.()
  stopWatchFn = watch(
    total,
    (next, prev) => {
      pushLog('watch', 'watch(total)', isZh.value ? `total: ${prev} → ${next}` : `total: ${prev} → ${next}`)
    },
    { flush: 'sync' }
  )
  pushLog('system', 'system', isZh.value ? 'watch 已启动' : 'watch started')
}

const stopWatch = () => {
  stopWatchFn?.()
  stopWatchFn = undefined
  pushLog('system', 'system', isZh.value ? 'watch 已停止' : 'watch stopped')
}

const startEffect = () => {
  stopEffectFn?.()
  stopEffectFn = watchEffect(
    () => {
      const v = total.value
      pushLog('effect', 'watchEffect', isZh.value ? `读取 total = ${v}` : `read total = ${v}`)
    },
    { flush: 'sync' }
  )
  pushLog('system', 'system', isZh.value ? 'watchEffect 已启动' : 'watchEffect started')
}

const stopEffect = () => {
  stopEffectFn?.()
  stopEffectFn = undefined
  pushLog('system', 'system', isZh.value ? 'watchEffect 已停止' : 'watchEffect stopped')
}

const selfCheck: LabSelfCheckQuestion[] = [
  {
    id: 'cw-1',
    questionZh: '哪一种更适合写“请求/日志/本地存储”等副作用？',
    questionEn: 'Which one is for side effects like requests/logging/storage?',
    optionsZh: ['computed', 'watch / watchEffect', 'template 表达式'],
    optionsEn: ['computed', 'watch / watchEffect', 'template expressions'],
    answerIndex: 1,
    explanationZh: 'computed 用于派生值且应保持纯；副作用应该由 watch/watchEffect 承担。',
    explanationEn: 'computed is for derived values and should stay pure; use watch/watchEffect for side effects.'
  },
  {
    id: 'cw-2',
    questionZh: '为什么有时你感觉 computed “不触发”？',
    questionEn: 'Why does computed sometimes “not run”?',
    optionsZh: ['因为 computed 必须手动调用', '因为 computed 只有被读取时才会求值', '因为 computed 只能依赖 ref 不能依赖 reactive'],
    optionsEn: ['Because computed must be called manually', 'Because computed evaluates when accessed', 'Because computed can only depend on ref'],
    answerIndex: 1,
    explanationZh: 'computed 是惰性的：依赖变化后会标记为脏，但只有被读取（模板/其他计算）时才会重新求值并缓存。',
    explanationEn: 'computed is lazy: dependency changes mark it dirty, but it re-evaluates when accessed and caches the result.'
  }
]

const toggleWatch = () => {
  watchEnabled.value = !watchEnabled.value
  if (watchEnabled.value) startWatch()
  else stopWatch()
}

const toggleEffect = () => {
  effectEnabled.value = !effectEnabled.value
  if (effectEnabled.value) startEffect()
  else stopEffect()
}

if (watchEnabled.value) startWatch()
if (effectEnabled.value) startEffect()

onBeforeUnmount(() => {
  stopWatchFn?.()
  stopEffectFn?.()
})

const codePreview = computed(() => {
  if (isZh.value) {
    return `const subtotal = computed(() => price.value * qty.value)
const total = computed(() => Math.round(subtotal.value * (1 - discount.value / 100)))

watch(total, (next, prev) => {
  console.log('total changed', prev, '→', next)
})

watchEffect(() => {
  console.log('total read', total.value)
})`
  }
  return `const subtotal = computed(() => price.value * qty.value)
const total = computed(() => Math.round(subtotal.value * (1 - discount.value / 100)))

watch(total, (next, prev) => {
  console.log('total changed', prev, '→', next)
})

watchEffect(() => {
  console.log('total read', total.value)
})`
})
</script>
