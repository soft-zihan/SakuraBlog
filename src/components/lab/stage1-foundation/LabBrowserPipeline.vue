<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-indigo-200 dark:border-indigo-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🧠</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '浏览器渲染流水线（从 HTML 到像素）' : 'Browser Rendering Pipeline (HTML → Pixels)' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh
            ? '把“白屏 / 卡顿 / 为什么要把脚本放到底部”讲清楚，并对齐本项目的 index.html 与 Vite 入口。'
            : 'Explains blank screen, jank, and how index.html + Vite entry fits into the pipeline.'
          }}
        </p>
      </div>
    </div>

    <!-- Controls -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
        <div class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
          {{ isZh ? '脚本加载方式' : 'Script Loading Mode' }}
        </div>
        <div class="flex gap-2">
          <button
            class="flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition"
            :class="scriptMode === 'sync' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'"
            @click="scriptMode = 'sync'"
          >
            {{ isZh ? '同步（阻塞）' : 'Sync (blocking)' }}
          </button>
          <button
            class="flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition"
            :class="scriptMode === 'defer' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'"
            @click="scriptMode = 'defer'"
          >
            defer
          </button>
          <button
            class="flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition"
            :class="scriptMode === 'async' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'"
            @click="scriptMode = 'async'"
          >
            async
          </button>
        </div>
        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
          {{ scriptModeDesc }}
        </p>
      </div>

      <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
        <div class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
          {{ isZh ? '影响渲染的关键开关' : 'Key Rendering Switches' }}
        </div>

        <label class="flex items-center justify-between gap-3 text-xs mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ isZh ? '包含外部 CSS（link）' : 'Has external CSS (link)' }}</span>
          <input type="checkbox" v-model="hasExternalCss" class="accent-indigo-500" />
        </label>

        <label class="flex items-center justify-between gap-3 text-xs mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ isZh ? '包含同步脚本（head 内）' : 'Script in <head>' }}</span>
          <input type="checkbox" v-model="scriptInHead" class="accent-indigo-500" />
        </label>

        <label class="flex items-center justify-between gap-3 text-xs">
          <span class="text-gray-600 dark:text-gray-300">{{ isZh ? 'DOCTYPE 正确（标准模式）' : 'Valid DOCTYPE (standards mode)' }}</span>
          <input type="checkbox" v-model="hasValidDoctype" class="accent-indigo-500" />
        </label>

        <div class="mt-3 p-3 rounded-xl bg-white/70 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
          <div class="text-[11px] text-gray-500">
            {{ isZh ? '对应本站：' : 'In this project:' }}
          </div>
          <div class="text-xs text-gray-700 dark:text-gray-200 mt-1">
            <span class="font-mono">index.html</span> → <span class="font-mono">&lt;script type=&quot;module&quot; src=&quot;/index.tsx&quot;&gt;</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pipeline -->
    <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="text-sm font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '渲染流水线模拟' : 'Pipeline Simulation' }}
        </div>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition disabled:opacity-50"
            :disabled="running"
            @click="run"
          >
            {{ running ? (isZh ? '运行中…' : 'Running…') : (isZh ? '开始模拟' : 'Run') }}
          </button>
          <button
            class="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            :disabled="running"
            @click="reset"
          >
            {{ isZh ? '重置' : 'Reset' }}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="(step, idx) in steps"
          :key="step.id"
          class="flex items-center gap-3 p-3 rounded-xl border"
          :class="idx === currentStepIndex ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30'"
        >
          <div class="w-7 text-center">
            <span v-if="idx < currentStepIndex" class="text-green-600">✓</span>
            <span v-else-if="idx === currentStepIndex" class="text-indigo-600">●</span>
            <span v-else class="text-gray-400">○</span>
          </div>
          <div class="flex-1">
            <div class="text-xs font-bold text-gray-800 dark:text-gray-100">{{ step.title }}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">{{ step.desc }}</div>
          </div>
          <div class="text-[11px] font-mono text-gray-500">{{ step.costLabel }}</div>
        </div>
      </div>

      <div class="mt-4 text-[11px] text-gray-500 leading-relaxed">
        {{ summaryText }}
      </div>
    </div>

    <!-- Practical takeaways -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 rounded-2xl bg-sakura-50/60 dark:bg-sakura-900/20 border border-sakura-200 dark:border-sakura-700">
        <div class="text-xs font-bold text-sakura-700 dark:text-sakura-300 mb-2">🌸 {{ isZh ? '本项目里你应该观察什么' : 'What to observe in this repo' }}</div>
        <ul class="text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
          <li>• {{ isZh ? 'index.html 的模块脚本如何触发 Vite 的依赖加载' : 'How module script triggers Vite dependency loading' }}</li>
          <li>• {{ isZh ? '为什么 CSS（含 Tailwind）通常要尽早加载' : 'Why CSS (Tailwind) should be loaded early' }}</li>
          <li>• {{ isZh ? 'JS 长任务会阻塞渲染（GUI 线程会被“冻结”）' : 'Long JS tasks block rendering (GUI gets “frozen”)' }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

type ScriptMode = 'sync' | 'defer' | 'async'

type PipelineStep = {
  id: string
  title: string
  desc: string
  costLabel: string
}

const hasExternalCss = ref(true)
const scriptInHead = ref(true)
const hasValidDoctype = ref(true)
const scriptMode = ref<ScriptMode>('sync')

const running = ref(false)
const currentStepIndex = ref(-1)

const scriptModeDesc = computed(() => {
  if (scriptMode.value === 'sync') {
    return isZh.value
      ? '同步脚本下载/执行会打断 HTML 解析；如果还依赖 CSSOM，白屏更明显。'
      : 'Sync scripts interrupt HTML parsing; if CSSOM is required, blank screen gets worse.'
  }
  if (scriptMode.value === 'defer') {
    return isZh.value
      ? 'defer 会并行下载，等 HTML 解析完再按顺序执行，适合依赖 DOM 的脚本。'
      : 'defer downloads in parallel and executes after parsing, in order.'
  }
  return isZh.value
    ? 'async 下载完立刻执行，顺序不可控；适合独立脚本（统计/上报）。'
    : 'async executes ASAP after download, order not guaranteed.'
})

const steps = computed<PipelineStep[]>(() => {
  const doctypePenalty = hasValidDoctype.value ? 0 : 40
  const cssCost = hasExternalCss.value ? 160 : 20

  const base: PipelineStep[] = [
    {
      id: 'parse-html',
      title: isZh.value ? '解析 HTML → 生成 DOM' : 'Parse HTML → DOM',
      desc: isZh.value ? '分词/建树，遇到阻塞资源会暂停。' : 'Tokenize/build tree, can pause on blocking resources.',
      costLabel: `${120 + doctypePenalty}ms`
    },
    {
      id: 'parse-css',
      title: isZh.value ? '解析 CSS → 生成 CSSOM' : 'Parse CSS → CSSOM',
      desc: isZh.value ? 'CSS 会参与样式计算；JS 可能依赖它。' : 'CSS participates in style calc; JS may depend on it.',
      costLabel: `${cssCost}ms`
    },
    {
      id: 'style',
      title: isZh.value ? '样式计算（层叠/继承）' : 'Style (cascade/inheritance)',
      desc: isZh.value ? '把选择器规则应用到 DOM 节点上。' : 'Apply selector rules to DOM nodes.',
      costLabel: `80ms`
    },
    {
      id: 'layout',
      title: isZh.value ? '布局 Layout（回流）' : 'Layout (reflow)',
      desc: isZh.value ? '计算每个盒子的尺寸与位置。' : 'Compute box sizes & positions.',
      costLabel: `90ms`
    },
    {
      id: 'paint',
      title: isZh.value ? '绘制 Paint' : 'Paint',
      desc: isZh.value ? '把边框、文字、背景等变成绘制指令。' : 'Turn borders/text/background into paint commands.',
      costLabel: `80ms`
    },
    {
      id: 'composite',
      title: isZh.value ? '合成 Composite（GPU）' : 'Composite (GPU)',
      desc: isZh.value ? '图层合成并显示到屏幕。' : 'Compose layers and present to screen.',
      costLabel: `40ms`
    }
  ]

  // Script effect: insert an extra step representing JS download/execute
  if (scriptInHead.value) {
    const jsLabel = scriptMode.value === 'sync'
      ? (isZh.value ? '同步脚本会阻塞解析' : 'Sync blocks parsing')
      : (scriptMode.value === 'defer'
        ? (isZh.value ? 'defer 不阻塞解析' : 'defer non-blocking')
        : (isZh.value ? 'async 非顺序执行' : 'async unordered'))

    base.splice(1, 0, {
      id: 'script',
      title: isZh.value ? '加载/执行 JS' : 'Load/Execute JS',
      desc: jsLabel,
      costLabel: scriptMode.value === 'sync' ? '180ms' : '120ms'
    })
  }

  return base
})

const summaryText = computed(() => {
  const parts: string[] = []

  if (!hasValidDoctype.value) {
    parts.push(isZh.value
      ? '未声明或错误 DOCTYPE 可能触发怪异模式：布局行为更不可控。'
      : 'Missing/invalid DOCTYPE may trigger quirks mode: less predictable layout.')
  }

  if (scriptInHead.value && scriptMode.value === 'sync') {
    parts.push(isZh.value
      ? '同步脚本放在 head 更容易造成“解析暂停 + 白屏”。'
      : 'Sync scripts in head are more likely to cause parser pause + blank screen.')
  }

  if (hasExternalCss.value) {
    parts.push(isZh.value
      ? '外部 CSS 的下载/解析会影响首次渲染；link 通常比 @import 更友好。'
      : 'External CSS impacts first render; link is generally better than @import.')
  }

  if (parts.length === 0) {
    return isZh.value
      ? '当前设置比较“理想化”：阻塞少、首次渲染更快。'
      : 'Current setup is relatively ideal: less blocking, faster first render.'
  }

  return parts.join(' ')
})

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const reset = () => {
  currentStepIndex.value = -1
}

const run = async () => {
  running.value = true
  reset()

  // Simulate step-by-step progression
  for (let i = 0; i < steps.value.length; i++) {
    currentStepIndex.value = i

    // a rough delay based on the displayed label
    const label = steps.value[i].costLabel
    const ms = Math.min(280, Math.max(60, parseInt(label, 10) || 120))

    // Simulate additional blocking for sync script
    const extra = steps.value[i].id === 'script' && scriptMode.value === 'sync' ? 80 : 0
    await sleep(ms + extra)
  }

  currentStepIndex.value = steps.value.length
  running.value = false
}
</script>

<style scoped>
</style>
