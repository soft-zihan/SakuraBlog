<template>
  <ShellGlassCard>
    <div class="p-6 border-b border-white/60 dark:border-gray-700/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <div class="text-xs font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] tracking-wide">
          {{ eyebrow }}
        </div>
        <div class="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
          {{ title }}
        </div>
        <div v-if="description" class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {{ description }}
        </div>
        <div v-if="stepperEnabled && stepLabel" class="text-xs text-gray-600 dark:text-gray-300 mt-2">
          {{ stepLabel }}
        </div>
      </div>

      <div class="flex flex-wrap gap-2 items-center">
        <template v-if="stepperEnabled">
          <select
            v-model.number="stepJumpIndex"
            class="px-3 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90 outline-none"
            @change="jumpToStep(stepJumpIndex)"
          >
            <option v-for="(s, idx) in stepperSteps" :key="idx" :value="idx">
              {{ idx + 1 }}. {{ String(s.label || '').trim() || (lang === 'zh' ? '未命名步骤' : 'Untitled step') }}
            </option>
          </select>

          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90 disabled:opacity-50"
            :disabled="activeStepIndex <= 0 || stepperBusy"
            @click="applyStep(activeStepIndex - 1)"
          >
            ← {{ lang === 'zh' ? '上一步' : 'Prev' }}
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-extrabold bg-[var(--primary-600)] text-white hover:opacity-90"
            @click="advanceStep"
          >
            {{ stepperButtonText }}
          </button>

          <button
            v-if="stepperBusy"
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
            @click="togglePause"
          >
            {{ pauseButtonText }}
          </button>

          <div class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/25">
            <div class="text-[11px] font-extrabold text-gray-600 dark:text-gray-300">
              {{ lang === 'zh' ? '速度' : 'Speed' }} {{ speedText }}
            </div>
            <input v-model.number="typingSpeed" type="range" min="0.5" max="2" step="0.25" class="w-28" />
          </div>
          <label
            class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/25 text-[11px] font-extrabold text-gray-600 dark:text-gray-300 select-none"
          >
            <input v-model="livePreviewWhileTyping" type="checkbox" class="accent-[var(--primary-500)]" />
            <span>{{ lang === 'zh' ? '实时预览' : 'Live preview' }}</span>
          </label>
        </template>
        <button
          v-if="allowReset"
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
          @click="resetToInitial"
        >
          {{ lang === 'zh' ? '还原' : 'Reset' }}
        </button>
      </div>
    </div>

    <div v-if="practiceEnabled" class="px-6 pt-4">
      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
              {{ practiceTitle }}
            </div>
            <div class="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
              {{ lang === 'zh' ? `已通过 ${practicePassed}/${practiceTotal}` : `${practicePassed}/${practiceTotal} passed` }}
            </div>
          </div>

          <button
            v-if="practiceHintTotal > 0"
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90 disabled:opacity-50"
            :disabled="practiceHintShown >= practiceHintTotal"
            @click="revealNextHint"
          >
            {{ practiceHintShown >= practiceHintTotal ? (lang === 'zh' ? '没有更多提示' : 'No more hints') : (lang === 'zh' ? '下一条提示' : 'Next hint') }}
          </button>
        </div>

        <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="space-y-2">
            <div v-for="r in practiceResults" :key="r.id" class="flex items-start gap-2 text-sm">
              <span class="font-extrabold" :class="r.ok ? 'text-green-600 dark:text-green-300' : 'text-amber-600 dark:text-amber-300'">
                {{ r.ok ? '✓' : '•' }}
              </span>
              <div class="flex-1">
                <div class="text-gray-800 dark:text-gray-100 font-semibold">
                  {{ r.label }}
                </div>
                <div v-if="r.detail" class="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  {{ r.detail }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="shownHints.length" class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-3">
            <div class="text-xs font-extrabold text-gray-700 dark:text-gray-200">
              {{ lang === 'zh' ? '提示' : 'Hints' }}
            </div>
            <ul class="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li v-for="(h, idx) in shownHints" :key="idx" class="flex gap-2">
                <span class="font-extrabold text-[var(--primary-500)]">•</span>
                <span class="flex-1">{{ h }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div class="space-y-3">
          <ShellEditableCodeBlock
            v-model="indexHtml"
            v-model:collapsed="collapsed.index"
            :lang="lang"
            :typing="activeTypewriteTarget === 'index'"
            :highlight="stepperGuideMode === 'highlight'"
            title="index.html"
            language="html"
            :action="fileAction"
            :action-label="fileActionLabel"
            :reset-value="initial.indexHtml"
            :editor-height="editorHeight"
            :placeholder="lang === 'zh' ? '从空白开始：写 HTML…' : 'Start from blank: write HTML...'"
            :reveal="reveal.index"
            :follow="follow.index"
          />
          <ShellEditableCodeBlock
            v-model="stylesCss"
            v-model:collapsed="collapsed.styles"
            :lang="lang"
            :typing="activeTypewriteTarget === 'styles'"
            :highlight="stepperGuideMode === 'highlight'"
            title="styles.css"
            language="css"
            :action="fileAction"
            :action-label="fileActionLabel"
            :reset-value="initial.stylesCss"
            :editor-height="editorHeight"
            :placeholder="lang === 'zh' ? '写 CSS…' : 'Write CSS...'"
            :reveal="reveal.styles"
            :follow="follow.styles"
          />
          <ShellEditableCodeBlock
            v-model="mainJs"
            v-model:collapsed="collapsed.main"
            :lang="lang"
            :typing="activeTypewriteTarget === 'main'"
            :highlight="stepperGuideMode === 'highlight'"
            title="main.js"
            language="javascript"
            :action="fileAction"
            :action-label="fileActionLabel"
            :reset-value="initial.mainJs"
            :editor-height="editorHeight"
            :placeholder="lang === 'zh' ? '写 JS…' : 'Write JS...'"
            :reveal="reveal.main"
            :follow="follow.main"
          />
        </div>

        <div>
          <ShellLivePreview
            :lang="lang"
            :title="lang === 'zh' ? '沙盒预览' : 'Sandbox preview'"
            :html="previewBody"
            :css="previewStylesCss"
            :js="previewMainJs"
            :js-mode="jsMode"
            :height="height"
            :show-reload="true"
          />
        </div>
      </div>
    </div>
  </ShellGlassCard>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import ShellGlassCard from './ShellGlassCard.vue'
import ShellEditableCodeBlock from './ShellEditableCodeBlock.vue'
import ShellLivePreview from './ShellLivePreview.vue'
import { sanitizeHtml } from '../../../utils/sanitize'
import { safeGetJson, safeSetJson } from '../../../utils/storage'

type ThreeFiles = {
  indexHtml: string
  stylesCss: string
  mainJs: string
}

type StepperStep = {
  id?: string
  label?: string
  goal?: string
  guide?: string
  target?: 'index' | 'styles' | 'main'
  files: ThreeFiles
}

type PracticeRule = {
  id: string
  file: 'index' | 'styles' | 'main' | 'all'
  kind: 'contains' | 'not_contains' | 'regex'
  value: string
  labelZh: string
  labelEn: string
  hintZh?: string
  hintEn?: string
}

const props = defineProps<{
  lang: 'en' | 'zh'
  eyebrow: string
  title: string
  description?: string
  allowReset?: boolean
  fileAction?: 'none' | 'clear' | 'reset'
  fileActionLabel?: string
  jsMode?: 'script' | 'module'
  height?: number
  editorHeight?: number
  storageKey?: string
  initial: {
    indexHtml: string
    stylesCss: string
    mainJs: string
  }
  stepper?: {
    steps: StepperStep[]
    buttonLabel?: string
    persist?: boolean
    guide?: 'highlight' | 'comment'
    guideLevel?: 'fine' | 'coarse'
    startAt?: 'blank' | 'complete'
  }
  practice?: {
    titleZh?: string
    titleEn?: string
    rules: PracticeRule[]
  }
}>()

const jsMode = computed(() => props.jsMode || 'script')
const height = computed(() => {
  const h = Number(props.height ?? 360)
  return Number.isFinite(h) && h > 220 ? h : 360
})

const editorHeight = computed(() => {
  const h = Number(props.editorHeight ?? 220)
  return Number.isFinite(h) && h >= 140 ? h : 220
})

const fileAction = computed(() => {
  const a = (props.fileAction || '').trim()
  if (a === 'reset' || a === 'clear' || a === 'none') return a
  return 'none'
})

const fileActionLabel = computed(() => (props.fileActionLabel || '').trim() || undefined)

const indexHtml = ref(props.initial.indexHtml)
const stylesCss = ref(props.initial.stylesCss)
const mainJs = ref(props.initial.mainJs)
const collapsed = reactive({ index: false, styles: false, main: false })

const practiceEnabled = computed(() => Array.isArray(props.practice?.rules) && props.practice!.rules.length > 0)
const practiceTitle = computed(() => {
  if (!practiceEnabled.value) return ''
  if (props.lang === 'zh') return (props.practice?.titleZh || '').trim() || '即时自检'
  return (props.practice?.titleEn || '').trim() || 'Instant checks'
})

function textForFile(file: PracticeRule['file']) {
  if (file === 'index') return indexHtml.value
  if (file === 'styles') return stylesCss.value
  if (file === 'main') return mainJs.value
  return `${indexHtml.value}\n${stylesCss.value}\n${mainJs.value}`
}

function countTodos(text: string) {
  const m = String(text || '').match(/\bTODO\b/g)
  return m ? m.length : 0
}

const practiceResults = computed(() => {
  if (!practiceEnabled.value) return []
  return (props.practice?.rules || []).map((rule) => {
    const t = textForFile(rule.file)
    let ok = false
    if (rule.kind === 'contains') ok = t.includes(rule.value)
    if (rule.kind === 'not_contains') ok = !t.includes(rule.value)
    if (rule.kind === 'regex') {
      try {
        ok = new RegExp(rule.value, 'm').test(t)
      } catch {
        ok = false
      }
    }
    const label = props.lang === 'zh' ? rule.labelZh : rule.labelEn
    let detail: string | undefined
    if (rule.kind === 'not_contains' && rule.value === 'TODO') {
      const n = countTodos(t)
      detail = props.lang === 'zh' ? `剩余 TODO：${n}` : `TODO remaining: ${n}`
      ok = n === 0
    }
    const hint = props.lang === 'zh' ? rule.hintZh : rule.hintEn
    return { id: rule.id, ok, label, detail, hint: String(hint || '').trim() || null }
  })
})

const practiceTotal = computed(() => practiceResults.value.length)
const practicePassed = computed(() => practiceResults.value.filter((r) => r.ok).length)

const practiceHints = computed(() => practiceResults.value.map((r) => r.hint).filter((h): h is string => !!h))
const practiceHintTotal = computed(() => practiceHints.value.length)
const practiceHintShown = ref(0)

const shownHints = computed(() => practiceHints.value.slice(0, practiceHintShown.value))

function revealNextHint() {
  practiceHintShown.value = Math.min(practiceHintTotal.value, practiceHintShown.value + 1)
}

const reveal = reactive({
  index: { token: 0, fromLine: 1, toLine: 1 },
  styles: { token: 0, fromLine: 1, toLine: 1 },
  main: { token: 0, fromLine: 1, toLine: 1 }
})

const follow = reactive({
  index: { token: 0, line: 1 },
  styles: { token: 0, line: 1 },
  main: { token: 0, line: 1 }
})

const stepperSteps = computed(() => {
  const steps = props.stepper?.steps
  if (!Array.isArray(steps) || steps.length === 0) return []
  return steps.filter((s) => !!s && !!s.files)
})

const stepperEnabled = computed(() => stepperSteps.value.length > 0)
const stepperGuideMode = computed(() => props.stepper?.guide || 'highlight')
const stepperGuideLevel = computed(() => props.stepper?.guideLevel || 'fine')
const stepperStartAt = computed(() => props.stepper?.startAt || 'blank')
const activeStepIndex = ref(0)
const stepperBusy = ref(false)
let typewriteRunId = 0
const activeTypewriteTarget = ref<'index' | 'styles' | 'main' | null>(null)
const activeTypewriteFinal = ref<string>('')
const activeTypewriteFollowLine = ref<number | null>(null)
const typewritePaused = ref(false)
const typingSpeed = ref(1)
const stepJumpIndex = ref(0)
const livePreviewWhileTyping = ref(false)

watch(
  () => activeStepIndex.value,
  (idx) => {
    stepJumpIndex.value = idx
  },
  { immediate: true }
)

const stepLabel = computed(() => {
  if (!stepperEnabled.value) return ''
  return String(stepperSteps.value[activeStepIndex.value]?.label || '').trim()
})

const stepperButtonText = computed(() => {
  if (!stepperEnabled.value) return ''
  const base = String(props.stepper?.buttonLabel || '').trim() || (props.lang === 'zh' ? '逐步' : 'Step')
  const total = stepperSteps.value.length
  const isLast = activeStepIndex.value >= total - 1
  const label = stepperBusy.value
    ? props.lang === 'zh'
      ? '快进本步'
      : 'Fast-forward'
    : isLast
      ? props.lang === 'zh'
        ? '重播'
        : 'Replay'
      : base
  const shownIdx = Math.min(activeStepIndex.value + 1, total)
  return `${label}（${shownIdx}/${total}）`
})

const pauseButtonText = computed(() => {
  if (!stepperBusy.value) return ''
  if (props.lang === 'zh') return typewritePaused.value ? '继续' : '暂停'
  return typewritePaused.value ? 'Resume' : 'Pause'
})

const speedText = computed(() => `x${Number(typingSpeed.value || 1).toFixed(2).replace(/\.00$/, '')}`)

const persisted = computed(() => (props.storageKey || '').trim())
const shouldPersistStepIndex = computed(() => props.stepper?.persist !== false)
let loadedFromStorage = false
const initializedFromStepperStartAt = ref(false)

if (persisted.value) {
  const saved = safeGetJson<{
    indexHtml?: unknown
    stylesCss?: unknown
    mainJs?: unknown
    collapsed?: unknown
    stepIndex?: unknown
  }>(persisted.value)
  if (saved) {
    loadedFromStorage = true
    if (typeof saved.indexHtml === 'string') indexHtml.value = saved.indexHtml
    if (typeof saved.stylesCss === 'string') stylesCss.value = saved.stylesCss
    if (typeof saved.mainJs === 'string') mainJs.value = saved.mainJs
    if (saved.collapsed && typeof saved.collapsed === 'object') {
      const c = saved.collapsed as any
      collapsed.index = !!c.index
      collapsed.styles = !!c.styles
      collapsed.main = !!c.main
    }
    if (shouldPersistStepIndex.value && stepperEnabled.value && typeof saved.stepIndex === 'number' && Number.isFinite(saved.stepIndex)) {
      const idx = Math.max(0, Math.min(stepperSteps.value.length - 1, Math.floor(saved.stepIndex)))
      activeStepIndex.value = idx
    }
  }
}

function initFromStepperStartAtComplete() {
  if (loadedFromStorage) return
  if (initializedFromStepperStartAt.value) return
  if (!stepperEnabled.value) return
  if (stepperStartAt.value !== 'complete') return

  const total = stepperSteps.value.length
  const last = total > 0 ? total - 1 : 0
  const files = stepperSteps.value[last]?.files
  if (!files) return

  const base = {
    indexHtml: normalizeLf(files.indexHtml),
    stylesCss: normalizeLf(files.stylesCss),
    mainJs: normalizeLf(files.mainJs)
  }
  const withGuides = buildCompleteFilesWithGuides(base)
  indexHtml.value = withGuides.indexHtml
  stylesCss.value = withGuides.stylesCss
  mainJs.value = withGuides.mainJs
  activeStepIndex.value = last
  initializedFromStepperStartAt.value = true
}

initFromStepperStartAtComplete()

watch([stepperEnabled, stepperStartAt, stepperSteps], () => {
  initFromStepperStartAtComplete()
})

function extractBody(html: string) {
  const input = String(html || '')
  const openIdx = input.search(/<body\b[^>]*>/i)
  if (openIdx < 0) return input
  const openTag = input.slice(openIdx).match(/<body\b[^>]*>/i)
  if (!openTag) return input
  const start = openIdx + openTag[0].length
  const closeIdx = input.search(/<\/body>/i)
  if (closeIdx < 0 || closeIdx <= start) return input.slice(start)
  return input.slice(start, closeIdx)
}

function stripScripts(html: string) {
  return String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/>/gi, '')
}

const previewIndexHtml = ref(indexHtml.value)
const previewStylesCss = ref(stylesCss.value)
const previewMainJs = ref(mainJs.value)
let previewSyncTimer = 0
let previewSyncPending = false

function syncPreviewNow() {
  previewSyncPending = false
  previewIndexHtml.value = indexHtml.value
  previewStylesCss.value = stylesCss.value
  previewMainJs.value = mainJs.value
}

function schedulePreviewSync(ms: number) {
  if (previewSyncPending) return
  previewSyncPending = true
  window.clearTimeout(previewSyncTimer)
  previewSyncTimer = window.setTimeout(() => {
    previewSyncTimer = 0
    syncPreviewNow()
  }, Math.max(0, Math.floor(ms)))
}

watch(
  [indexHtml, stylesCss, mainJs, stepperBusy, livePreviewWhileTyping],
  () => {
    if (stepperBusy.value && !livePreviewWhileTyping.value) {
      schedulePreviewSync(220)
      return
    }
    syncPreviewNow()
  },
  { immediate: true }
)

onUnmounted(() => window.clearTimeout(previewSyncTimer))

const previewBody = computed(() => sanitizeHtml(stripScripts(extractBody(previewIndexHtml.value))))

function resetToInitial() {
  typewriteRunId++
  stepperBusy.value = false
  activeTypewriteTarget.value = null
  activeTypewriteFinal.value = ''
  typewritePaused.value = false
  indexHtml.value = props.initial.indexHtml
  stylesCss.value = props.initial.stylesCss
  mainJs.value = props.initial.mainJs
  if (stepperEnabled.value) activeStepIndex.value = 0
  reveal.index.token = 0
  reveal.styles.token = 0
  reveal.main.token = 0
  follow.index.token = 0
  follow.styles.token = 0
  follow.main.token = 0
}

function normalizeLf(s: string) {
  return String(s || '').replace(/\r\n/g, '\n')
}

function countNewlines(s: string, endExclusive: number) {
  let count = 0
  const upto = Math.max(0, Math.min(s.length, endExclusive))
  for (let i = 0; i < upto; i++) if (s.charCodeAt(i) === 10) count++
  return count
}

function computeChangedRange(prev: string, next: string) {
  const a = normalizeLf(prev)
  const b = normalizeLf(next)
  if (a === b) return null

  const minLen = Math.min(a.length, b.length)
  let start = 0
  while (start < minLen && a.charCodeAt(start) === b.charCodeAt(start)) start++

  let endA = a.length - 1
  let endB = b.length - 1
  while (endA >= start && endB >= start && a.charCodeAt(endA) === b.charCodeAt(endB)) {
    endA--
    endB--
  }

  const fromLine = countNewlines(b, start) + 1
  const toLine = countNewlines(b, endB + 1) + 1
  return { fromLine, toLine: Math.max(fromLine, toLine) }
}

function computePatch(prev: string, next: string) {
  const a = normalizeLf(prev)
  const b = normalizeLf(next)
  if (a === b) return null

  const minLen = Math.min(a.length, b.length)
  let startIndex = 0
  while (startIndex < minLen && a.charCodeAt(startIndex) === b.charCodeAt(startIndex)) startIndex++

  let endA = a.length
  let endB = b.length
  while (endA > startIndex && endB > startIndex && a.charCodeAt(endA - 1) === b.charCodeAt(endB - 1)) {
    endA--
    endB--
  }

  const deleteCount = Math.max(0, endA - startIndex)
  const insertText = b.slice(startIndex, endB)
  const insertedLines = insertText ? insertText.split('\n').length : 1
  const fromLine = countNewlines(a, startIndex) + 1
  const toLine = Math.max(fromLine, fromLine + insertedLines - 1)
  return { startIndex, deleteCount, insertText, fromLine, toLine, nextNormalized: b }
}

type TextPatch = { startIndex: number; deleteCount: number; insertText: string; fromLine: number; toLine: number; nextNormalized: string }

type LineDiffOp = { type: 'equal' | 'insert' | 'delete'; line: string }

function splitLines(text: string) {
  const s = normalizeLf(text)
  if (!s) return ['']
  return s.split('\n')
}

function myersLineDiff(aLines: string[], bLines: string[]): LineDiffOp[] {
  const N = aLines.length
  const M = bLines.length
  const max = N + M
  const offset = max
  let v = new Array<number>(2 * max + 1).fill(0)
  v[offset + 1] = 0
  const trace: Array<number[]> = []

  for (let d = 0; d <= max; d++) {
    const vPrev = v
    const vNext = new Array<number>(2 * max + 1).fill(0)
    for (let k = -d; k <= d; k += 2) {
      const kIdx = offset + k
      let x: number
      if (k === -d || (k !== d && vPrev[offset + k - 1] < vPrev[offset + k + 1])) x = vPrev[offset + k + 1]
      else x = vPrev[offset + k - 1] + 1
      let y = x - k
      while (x < N && y < M && aLines[x] === bLines[y]) {
        x++
        y++
      }
      vNext[kIdx] = x
      if (x >= N && y >= M) {
        trace.push(vNext)
        const ops: LineDiffOp[] = []
        let curX = N
        let curY = M

        for (let dd = trace.length - 1; dd > 0; dd--) {
          const vvPrev = trace[dd - 1]
          const kCur = curX - curY
          let prevK: number
          if (kCur === -dd || (kCur !== dd && vvPrev[offset + kCur - 1] < vvPrev[offset + kCur + 1])) prevK = kCur + 1
          else prevK = kCur - 1
          const prevX = vvPrev[offset + prevK]
          const prevY = prevX - prevK

          while (curX > prevX && curY > prevY) {
            ops.push({ type: 'equal', line: aLines[curX - 1] })
            curX--
            curY--
          }
          if (curX === prevX) {
            ops.push({ type: 'insert', line: bLines[curY - 1] })
            curY--
          } else {
            ops.push({ type: 'delete', line: aLines[curX - 1] })
            curX--
          }
        }

        while (curX > 0 && curY > 0) {
          ops.push({ type: 'equal', line: aLines[curX - 1] })
          curX--
          curY--
        }
        while (curX > 0) {
          ops.push({ type: 'delete', line: aLines[curX - 1] })
          curX--
        }
        while (curY > 0) {
          ops.push({ type: 'insert', line: bLines[curY - 1] })
          curY--
        }

        ops.reverse()
        return ops
      }
    }
    trace.push(vNext)
    v = vNext
  }
  return []
}

type LineHunk = { aStartLine: number; aDeleteLines: number; insertLines: string[] }

function computeLineHunks(prevText: string, nextText: string): LineHunk[] {
  const a = splitLines(prevText)
  const b = splitLines(nextText)
  const ops = myersLineDiff(a, b)
  if (ops.length === 0) return []

  const hunks: LineHunk[] = []
  let aPos = 0
  let current: LineHunk | null = null

  const flush = () => {
    if (!current) return
    if (current.aDeleteLines > 0 || current.insertLines.length > 0) hunks.push(current)
    current = null
  }

  for (const op of ops) {
    if (op.type === 'equal') {
      flush()
      aPos++
      continue
    }
    if (!current) current = { aStartLine: aPos + 1, aDeleteLines: 0, insertLines: [] }
    if (op.type === 'delete') {
      current.aDeleteLines++
      aPos++
      continue
    }
    current.insertLines.push(op.line)
  }
  flush()
  return hunks
}

function indexAtLineStart(text: string, lineNumber: number) {
  const s = normalizeLf(text)
  const ln = Math.max(1, Math.floor(lineNumber))
  if (ln === 1) return 0
  let idx = 0
  let cur = 1
  while (cur < ln && idx < s.length) {
    const nextNl = s.indexOf('\n', idx)
    if (nextNl < 0) return s.length
    idx = nextNl + 1
    cur++
  }
  return idx
}

function buildPatchFromLineChange(currentText: string, startLine: number, deleteLines: number, insertText: string): TextPatch | null {
  const cur = normalizeLf(currentText)
  const startIndex = indexAtLineStart(cur, startLine)
  const endIndex = indexAtLineStart(cur, startLine + Math.max(0, Math.floor(deleteLines)))
  const deleteCount = Math.max(0, endIndex - startIndex)
  let finalInsertText = insertText
  if (finalInsertText && endIndex < cur.length && !finalInsertText.endsWith('\n')) finalInsertText += '\n'
  const nextNormalized = `${cur.slice(0, startIndex)}${finalInsertText}${cur.slice(startIndex + deleteCount)}`
  const effectiveInsert = finalInsertText ? (finalInsertText.endsWith('\n') ? finalInsertText.slice(0, -1) : finalInsertText) : ''
  const insertedLineCount = effectiveInsert ? effectiveInsert.split('\n').length : 0
  const fromLine = Math.max(1, Math.floor(startLine))
  const toLine = insertedLineCount > 0 ? Math.max(fromLine, fromLine + insertedLineCount - 1) : fromLine
  if (deleteCount === 0 && !finalInsertText) return null
  return { startIndex, deleteCount, insertText: finalInsertText, fromLine, toLine, nextNormalized }
}

function buildPatchesFromHunks(prevText: string, nextText: string): TextPatch[] {
  const hunks = computeLineHunks(prevText, nextText)
  if (hunks.length === 0) return []
  let current = normalizeLf(prevText)
  let lineDelta = 0
  const patches: TextPatch[] = []
  for (const h of hunks) {
    const startLine = h.aStartLine + lineDelta
    const insertText = h.insertLines.join('\n')
    const patch = buildPatchFromLineChange(current, startLine, h.aDeleteLines, insertText)
    if (!patch) continue
    patches.push(patch)
    current = patch.nextNormalized
    lineDelta += h.insertLines.length - h.aDeleteLines
  }
  return patches
}

function insertGuideAfterPatches(
  target: 'index' | 'styles' | 'main',
  baseText: string,
  firstPatch: TextPatch | null,
  guideText: string,
  guideId: string
) {
  const id = normalizeGuideId(guideId)
  if (!id || !firstPatch || stepperGuideMode.value !== 'comment') return baseText
  const text = normalizeLf(baseText)
  const lines = text ? text.split('\n') : []
  for (const line of lines) {
    if (!isGuideLine(target, line)) continue
    if (guideIdFromLine(line) === id) return text
  }
  const lineStart = indexAtLineStart(text, firstPatch.fromLine)
  const nextNl = text.indexOf('\n', lineStart)
  const line = text.slice(lineStart, nextNl >= 0 ? nextNl : text.length)
  const indent = line.match(/^\s*/)?.[0] || ''
  const commentLine = buildGuideComment(target, id, guideText, indent, firstPatch.insertText)
  if (!commentLine) return text
  return `${text.slice(0, lineStart)}${commentLine}${text.slice(lineStart)}`
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

async function waitWhilePaused(runId: number) {
  while (runId === typewriteRunId && stepperBusy.value && typewritePaused.value) {
    await sleep(40)
  }
}

function snippetFromInsert(insertText: string) {
  const raw = String(insertText || '').replace(/\r\n/g, '\n')
  const first = raw
    .split('\n')
    .map((s) => s.trim())
    .find((s) => !!s)
  const s = first || ''
  if (s.length <= 72) return s
  return `${s.slice(0, 69)}…`
}

function countNewlinesInString(s: string) {
  return countNewlines(s, s.length)
}

function normalizeGuideText(raw: string) {
  const s = String(raw || '').trim().replace(/\s+/g, ' ')
  if (!s) return ''
  return s.replace(/^(index\.html|styles\.css|main\.js)\s*[:：]\s*/i, '')
}

function normalizeGuideId(raw: string) {
  const s = String(raw || '').trim()
  if (!s) return ''
  return s.replace(/\s+/g, '_').replace(/[()]/g, '')
}

function guideTextForStep(step: StepperStep | undefined) {
  if (!stepperEnabled.value || stepperGuideMode.value !== 'comment' || !step) return ''
  const level = stepperGuideLevel.value
  if (level === 'coarse') return normalizeGuideText(String(step.guide || ''))
  return normalizeGuideText(String(step.label || ''))
}

function buildGuideComment(
  target: 'index' | 'styles' | 'main',
  guideId: string,
  guideText: string,
  indent: string,
  insertText: string
) {
  const text = normalizeGuideText(guideText)
  if (!text) return ''
  const snippet = snippetFromInsert(insertText)
  const eg = props.lang === 'zh' ? '例：' : 'e.g. '
  const body = snippet ? `${text} | ${eg}${snippet}` : text
  const id = normalizeGuideId(guideId)
  const head = id ? `GUIDE(step=${id}): ` : 'GUIDE: '
  if (target === 'index') return `${indent}<!-- ${head}${body} -->\n`
  if (target === 'styles') return `${indent}/* ${head}${body} */\n`
  return `${indent}// ${head}${body}\n`
}

type GuideEntry = { id?: string; commentLine: string; anchorLine?: string }

function isGuideLine(target: 'index' | 'styles' | 'main', line: string) {
  const s = String(line || '').trim()
  if (!s) return false
  if (target === 'index') return s.startsWith('<!-- GUIDE')
  if (target === 'styles') return s.startsWith('/* GUIDE')
  return s.startsWith('// GUIDE')
}

function guideIdFromLine(line: string) {
  const s = String(line || '').trim()
  const m = s.match(/GUIDE\(step=([^)]+)\)\s*:/i)
  const id = normalizeGuideId(m?.[1] || '')
  return id || undefined
}

function extractGuideEntries(target: 'index' | 'styles' | 'main', input: string) {
  const src = normalizeLf(input)
  if (!src) return [] as GuideEntry[]
  const lines = src.split('\n')
  const entries: GuideEntry[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!isGuideLine(target, line)) continue
    let anchorLine: string | undefined
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j]
      const nextTrim = String(next || '').trim()
      if (!nextTrim) continue
      if (isGuideLine(target, next)) continue
      anchorLine = next
      break
    }
    entries.push({ id: guideIdFromLine(line), commentLine: line, anchorLine })
  }
  return entries
}

function mergeGuideEntries(target: 'index' | 'styles' | 'main', baseText: string, entries: GuideEntry[]) {
  const src = normalizeLf(baseText)
  if (entries.length === 0) return src
  const lines = src ? src.split('\n') : []

  const hasLine = new Set(lines)
  const hasId = new Set<string>()
  for (const line of lines) {
    if (!isGuideLine(target, line)) continue
    const id = guideIdFromLine(line)
    if (id) hasId.add(id)
  }
  let searchFrom = 0
  for (const e of entries) {
    const commentLine = e.commentLine
    const id = normalizeGuideId(e.id || '') || guideIdFromLine(commentLine) || ''
    if (id && hasId.has(id)) continue
    if (!commentLine || hasLine.has(commentLine)) continue

    let insertAt = -1
    const anchor = e.anchorLine
    if (anchor) {
      for (let i = searchFrom; i < lines.length; i++) {
        if (lines[i] === anchor) {
          insertAt = i
          break
        }
      }
      if (insertAt < 0) {
        const anchorTrim = String(anchor || '').trim()
        if (anchorTrim) {
          for (let i = searchFrom; i < lines.length; i++) {
            if (String(lines[i] || '').trim() === anchorTrim) {
              insertAt = i
              break
            }
          }
        }
      }
    }
    if (insertAt < 0) insertAt = lines.length
    lines.splice(insertAt, 0, commentLine)
    hasLine.add(commentLine)
    if (id) hasId.add(id)
    searchFrom = Math.min(lines.length, insertAt + 1)
  }
  return lines.join('\n')
}

function mergeGuidesIntoFiles(prev: ThreeFiles, next: ThreeFiles) {
  if (stepperGuideMode.value !== 'comment') {
    return {
      indexHtml: normalizeLf(next.indexHtml),
      stylesCss: normalizeLf(next.stylesCss),
      mainJs: normalizeLf(next.mainJs)
    }
  }
  const indexEntries = extractGuideEntries('index', prev.indexHtml)
  const stylesEntries = extractGuideEntries('styles', prev.stylesCss)
  const mainEntries = extractGuideEntries('main', prev.mainJs)
  return {
    indexHtml: mergeGuideEntries('index', next.indexHtml, indexEntries),
    stylesCss: mergeGuideEntries('styles', next.stylesCss, stylesEntries),
    mainJs: mergeGuideEntries('main', next.mainJs, mainEntries)
  }
}

function applyPatchWithGuideComment(
  target: 'index' | 'styles' | 'main',
  prevValue: string,
  patch: { startIndex: number; deleteCount: number; insertText: string; fromLine: number; toLine: number; nextNormalized: string },
  guideText: string,
  guideId: string
) {
  const prev = normalizeLf(prevValue)
  const lineStart = prev.lastIndexOf('\n', Math.max(0, patch.startIndex - 1)) + 1
  const prefixLeft = prev.slice(0, lineStart)
  const midLeft = prev.slice(lineStart, patch.startIndex)
  const right = prev.slice(patch.startIndex + patch.deleteCount)
  const indent = midLeft.match(/^\s*/)?.[0] || ''
  const commentLine = stepperGuideMode.value === 'comment' ? buildGuideComment(target, guideId, guideText, indent, patch.insertText) : ''
  if (!commentLine) return patch.nextNormalized
  return `${prefixLeft}${commentLine}${midLeft}${patch.insertText}${right}`
}

function buildCompleteFilesWithGuides(baseComplete: ThreeFiles) {
  if (!stepperEnabled.value) return baseComplete
  if (stepperGuideMode.value !== 'comment') return baseComplete
  const steps = stepperSteps.value
  if (steps.length <= 1) return baseComplete

  let current = {
    indexHtml: normalizeLf(steps[0]?.files?.indexHtml || ''),
    stylesCss: normalizeLf(steps[0]?.files?.stylesCss || ''),
    mainJs: normalizeLf(steps[0]?.files?.mainJs || '')
  }

  for (let idx = 1; idx < steps.length; idx++) {
    const prev = current
    const nextRaw = steps[idx]?.files
    if (!nextRaw) continue
    const nextMerged = mergeGuidesIntoFiles(prev, nextRaw)
    const guideText = guideTextForStep(steps[idx])
    const guideId = steps[idx]?.id || ''

    const pIndex = computePatch(prev.indexHtml, nextMerged.indexHtml)
    const pStyles = computePatch(prev.stylesCss, nextMerged.stylesCss)
    const pMain = computePatch(prev.mainJs, nextMerged.mainJs)

    if (pIndex) {
      current = {
        indexHtml: applyPatchWithGuideComment('index', prev.indexHtml, pIndex, guideText, guideId),
        stylesCss: nextMerged.stylesCss,
        mainJs: nextMerged.mainJs
      }
      continue
    }
    if (pStyles) {
      current = {
        indexHtml: nextMerged.indexHtml,
        stylesCss: applyPatchWithGuideComment('styles', prev.stylesCss, pStyles, guideText, guideId),
        mainJs: nextMerged.mainJs
      }
      continue
    }
    if (pMain) {
      current = {
        indexHtml: nextMerged.indexHtml,
        stylesCss: nextMerged.stylesCss,
        mainJs: applyPatchWithGuideComment('main', prev.mainJs, pMain, guideText, guideId)
      }
      continue
    }
    current = nextMerged
  }

  const mergedComplete = mergeGuidesIntoFiles(current, baseComplete)
  return mergedComplete
}

type StepperCache = {
  states: ThreeFiles[]
  transitions: Array<{
    patchesIndex: TextPatch[]
    patchesStyles: TextPatch[]
    patchesMain: TextPatch[]
  } | null>
}

const stepperCache = ref<StepperCache | null>(null)

function buildStepperCache(steps: StepperStep[]) {
  if (!steps || steps.length === 0) return null

  const states: ThreeFiles[] = []
  const transitions: StepperCache['transitions'] = new Array(steps.length).fill(null)

  let current: ThreeFiles = {
    indexHtml: normalizeLf(steps[0]?.files?.indexHtml || ''),
    stylesCss: normalizeLf(steps[0]?.files?.stylesCss || ''),
    mainJs: normalizeLf(steps[0]?.files?.mainJs || '')
  }
  states[0] = current

  for (let idx = 1; idx < steps.length; idx++) {
    const nextRaw = steps[idx]?.files
    if (!nextRaw) {
      states[idx] = current
      continue
    }
    const nextMerged = mergeGuidesIntoFiles(current, nextRaw)
    const guideText = guideTextForStep(steps[idx])
    const guideId = steps[idx]?.id || ''

    const pIndex = computePatch(current.indexHtml, nextMerged.indexHtml)
    const pStyles = computePatch(current.stylesCss, nextMerged.stylesCss)
    const pMain = computePatch(current.mainJs, nextMerged.mainJs)

    if (pIndex) {
      current = {
        indexHtml: applyPatchWithGuideComment('index', current.indexHtml, pIndex, guideText, guideId),
        stylesCss: nextMerged.stylesCss,
        mainJs: nextMerged.mainJs
      }
    } else if (pStyles) {
      current = {
        indexHtml: nextMerged.indexHtml,
        stylesCss: applyPatchWithGuideComment('styles', current.stylesCss, pStyles, guideText, guideId),
        mainJs: nextMerged.mainJs
      }
    } else if (pMain) {
      current = {
        indexHtml: nextMerged.indexHtml,
        stylesCss: nextMerged.stylesCss,
        mainJs: applyPatchWithGuideComment('main', current.mainJs, pMain, guideText, guideId)
      }
    } else {
      current = nextMerged
    }
    states[idx] = current
  }

  for (let idx = 1; idx < states.length; idx++) {
    const prev = states[idx - 1]
    const next = states[idx]
    transitions[idx] = {
      patchesIndex: buildPatchesFromHunks(prev.indexHtml, next.indexHtml),
      patchesStyles: buildPatchesFromHunks(prev.stylesCss, next.stylesCss),
      patchesMain: buildPatchesFromHunks(prev.mainJs, next.mainJs)
    }
  }

  return { states, transitions } satisfies StepperCache
}

watch(
  [stepperSteps, stepperGuideMode],
  ([steps]) => {
    stepperCache.value = buildStepperCache(steps)
  },
  { immediate: true }
)

async function typewritePatches(
  target: 'index' | 'styles' | 'main',
  prevValue: string,
  patches: TextPatch[],
  guideText: string,
  guideId: string
) {
  const runId = ++typewriteRunId
  stepperBusy.value = true
  activeTypewriteTarget.value = target
  typewritePaused.value = false
  activeTypewriteFollowLine.value = null

  let finalSim = patches.length > 0 ? patches[patches.length - 1].nextNormalized : normalizeLf(prevValue)
  if (patches.length > 0) finalSim = insertGuideAfterPatches(target, finalSim, patches[0], guideText, guideId)
  activeTypewriteFinal.value = finalSim

  try {
    let current = normalizeLf(prevValue)
    for (let i = 0; i < patches.length; i++) {
      if (runId !== typewriteRunId) return
      const p = patches[i]
      await typewriteSinglePatch(runId, target, current, p, '', i === 0)
      current = p.nextNormalized
    }
    if (runId === typewriteRunId) {
      if (target === 'index') indexHtml.value = finalSim
      if (target === 'styles') stylesCss.value = finalSim
      if (target === 'main') mainJs.value = finalSim
    }
  } finally {
    if (runId === typewriteRunId) {
      stepperBusy.value = false
      activeTypewriteTarget.value = null
      activeTypewriteFinal.value = ''
      typewritePaused.value = false
    }
  }
}

async function typewriteSinglePatch(
  runId: number,
  target: 'index' | 'styles' | 'main',
  prevValue: string,
  patch: TextPatch,
  guideText: string,
  addInitialDelay: boolean
) {
  let raf = 0
  let pending: string | null = null
  const commit = (v: string) => {
    if (runId !== typewriteRunId) return
    if (target === 'index') indexHtml.value = v
    if (target === 'styles') stylesCss.value = v
    if (target === 'main') mainJs.value = v
  }
  const scheduleCommit = (v: string) => {
    pending = v
    if (raf) return
    raf = window.requestAnimationFrame(() => {
      raf = 0
      if (pending === null) return
      const value = pending
      pending = null
      commit(value)
    })
  }
  const flush = () => {
    if (raf) window.cancelAnimationFrame(raf)
    raf = 0
    if (pending === null) return
    const value = pending
    pending = null
    commit(value)
  }

  const guideMode = stepperGuideMode.value

  const prev = normalizeLf(prevValue)
  const lineStart = prev.lastIndexOf('\n', Math.max(0, patch.startIndex - 1)) + 1
  const prefixLeft = prev.slice(0, lineStart)
  const midLeft = prev.slice(lineStart, patch.startIndex)
  const right = prev.slice(patch.startIndex + patch.deleteCount)
  const placeholder = patch.insertText.replace(/[^\n]/g, ' ')

  const indent = midLeft.match(/^\s*/)?.[0] || ''
  const commentLine = guideMode === 'comment' ? buildGuideComment(target, '', guideText, indent, patch.insertText) : ''
  const commentPlaceholder = commentLine ? commentLine.replace(/[^\n]/g, ' ') : ''

  const cleared = commentLine
    ? `${prefixLeft}${commentPlaceholder}${midLeft}${placeholder}${right}`
    : `${prefixLeft}${midLeft}${placeholder}${right}`
  commit(cleared)

  const finalText = commentLine ? `${prefixLeft}${commentLine}${midLeft}${patch.insertText}${right}` : patch.nextNormalized

  const lineOffset = commentLine ? countNewlinesInString(commentLine) : 0
  if (target === 'index') {
    collapsed.index = false
    reveal.index.fromLine = patch.fromLine
    reveal.index.toLine = patch.toLine
    if (guideMode === 'highlight') reveal.index.token++
  }
  if (target === 'styles') {
    collapsed.styles = false
    reveal.styles.fromLine = patch.fromLine
    reveal.styles.toLine = patch.toLine
    if (guideMode === 'highlight') reveal.styles.token++
  }
  if (target === 'main') {
    collapsed.main = false
    reveal.main.fromLine = patch.fromLine
    reveal.main.toLine = patch.toLine
    if (guideMode === 'highlight') reveal.main.token++
  }

  if (target === 'index') {
    follow.index.line = patch.fromLine + lineOffset
    follow.index.token++
    activeTypewriteFollowLine.value = follow.index.line
  }
  if (target === 'styles') {
    follow.styles.line = patch.fromLine + lineOffset
    follow.styles.token++
    activeTypewriteFollowLine.value = follow.styles.line
  }
  if (target === 'main') {
    follow.main.line = patch.fromLine + lineOffset
    follow.main.token++
    activeTypewriteFollowLine.value = follow.main.line
  }

  await nextTick()
  if (addInitialDelay) await sleep(1100)
  else await sleep(220)

  const total = patch.insertText.length
  const baseDelay =
    total > 1200 ? 16 : total > 800 ? 18 : total > 520 ? 22 : total > 320 ? 26 : total > 180 ? 30 : 34

  const getDelay = (ch: string) => {
    const jitter = Math.floor(Math.random() * 16)
    if (ch === '\n') return baseDelay + 160 + jitter
    if (ch === ';' || ch === ',' || ch === ')' || ch === ']') return baseDelay + 45 + jitter
    if (ch === '}' || ch === '>') return baseDelay + 65 + jitter
    return baseDelay + jitter
  }

  if (total === 0) {
    if (runId === typewriteRunId) {
      commit(finalText)
    }
    return
  }

  let i = 0
  let typedNewlines = 0
  let followTick = 0
  try {
    if (commentLine) {
      let j = 0
      while (j < commentLine.length) {
        await waitWhilePaused(runId)
        if (runId !== typewriteRunId) return
        j += 1
        const cSegment = `${commentLine.slice(0, j)}${commentPlaceholder.slice(j)}`
        const value = `${prefixLeft}${cSegment}${midLeft}${placeholder}${right}`
        scheduleCommit(value)
        await sleep(8 + Math.floor(Math.random() * 14))
      }
      await sleep(260)
    }

    while (i < total) {
      await waitWhilePaused(runId)
      if (runId !== typewriteRunId) return
      i += 1
      const ch = patch.insertText.charAt(i - 1)
      if (ch === '\n') typedNewlines++
      const segment = `${patch.insertText.slice(0, i)}${placeholder.slice(i)}`
      const value = commentLine
        ? `${prefixLeft}${commentLine}${midLeft}${segment}${right}`
        : `${prefixLeft}${midLeft}${segment}${right}`
      scheduleCommit(value)
      if (ch === '\n' || i % 24 === 0) {
        followTick++
        const ln = patch.fromLine + lineOffset + typedNewlines
        if (target === 'index') {
          follow.index.line = ln
          follow.index.token = followTick
          activeTypewriteFollowLine.value = ln
        }
        if (target === 'styles') {
          follow.styles.line = ln
          follow.styles.token = followTick
          activeTypewriteFollowLine.value = ln
        }
        if (target === 'main') {
          follow.main.line = ln
          follow.main.token = followTick
          activeTypewriteFollowLine.value = ln
        }
      }
      const speed = Math.max(0.25, Math.min(3, Number(typingSpeed.value || 1)))
      await sleep(Math.max(4, Math.floor(getDelay(patch.insertText.charAt(i - 1)) / speed)))
    }
    if (runId === typewriteRunId) {
      commit(finalText)
    }
  } finally {
    flush()
  }
}

function fastForwardTyping() {
  if (!stepperBusy.value || !activeTypewriteTarget.value) return
  typewriteRunId++
  const target = activeTypewriteTarget.value
  const finalText = activeTypewriteFinal.value
  const followLine =
    typeof activeTypewriteFollowLine.value === 'number' && Number.isFinite(activeTypewriteFollowLine.value)
      ? Math.max(1, Math.floor(activeTypewriteFollowLine.value))
      : countNewlinesInString(finalText) + 1
  if (target === 'index') indexHtml.value = finalText
  if (target === 'styles') stylesCss.value = finalText
  if (target === 'main') mainJs.value = finalText
  stepperBusy.value = false
  activeTypewriteTarget.value = null
  activeTypewriteFinal.value = ''
  activeTypewriteFollowLine.value = null
  typewritePaused.value = false
  if (target === 'index') {
    follow.index.line = followLine
    follow.index.token++
  }
  if (target === 'styles') {
    follow.styles.line = followLine
    follow.styles.token++
  }
  if (target === 'main') {
    follow.main.line = followLine
    follow.main.token++
  }
}

function togglePause() {
  if (!stepperBusy.value) return
  typewritePaused.value = !typewritePaused.value
}

function jumpToStep(idx: number) {
  if (!stepperEnabled.value) return
  if (!Number.isFinite(idx)) return
  if (stepperBusy.value) return
  applyStep(idx)
}

async function applyStep(idx: number) {
  if (!stepperEnabled.value || stepperBusy.value) return
  const total = stepperSteps.value.length
  const nextIndex = Math.max(0, Math.min(total - 1, Math.floor(idx)))

  const prevIndex = activeStepIndex.value
  const prev = { indexHtml: indexHtml.value, stylesCss: stylesCss.value, mainJs: mainJs.value }
  const step = stepperSteps.value[nextIndex]
  if (!step?.files) return

  let next: ThreeFiles | null = null
  let patchesIndex: TextPatch[] = []
  let patchesStyles: TextPatch[] = []
  let patchesMain: TextPatch[] = []

  const cache = stepperCache.value
  if (cache && nextIndex === prevIndex + 1) {
    const expectedPrev = cache.states[prevIndex]
    const expectedNext = cache.states[nextIndex]
    const matchesExpected =
      normalizeLf(prev.indexHtml) === expectedPrev.indexHtml &&
      normalizeLf(prev.stylesCss) === expectedPrev.stylesCss &&
      normalizeLf(prev.mainJs) === expectedPrev.mainJs
    const tr = cache.transitions[nextIndex]
    if (matchesExpected && expectedNext && tr) {
      next = expectedNext
      patchesIndex = tr.patchesIndex
      patchesStyles = tr.patchesStyles
      patchesMain = tr.patchesMain
    }
  }

  if (!next) {
    const nextMerged = mergeGuidesIntoFiles(prev, step.files)
    next = nextMerged
    patchesIndex = buildPatchesFromHunks(prev.indexHtml, next.indexHtml)
    patchesStyles = buildPatchesFromHunks(prev.stylesCss, next.stylesCss)
    patchesMain = buildPatchesFromHunks(prev.mainJs, next.mainJs)
  }

  activeStepIndex.value = nextIndex
  const guideText = guideTextForStep(step)
  const guideId = step.id || ''

  if (patchesIndex.length > 0) {
    stylesCss.value = next.stylesCss
    mainJs.value = next.mainJs
    await typewritePatches('index', prev.indexHtml, patchesIndex, guideText, guideId)
    return
  }
  if (patchesStyles.length > 0) {
    indexHtml.value = next.indexHtml
    mainJs.value = next.mainJs
    await typewritePatches('styles', prev.stylesCss, patchesStyles, guideText, guideId)
    return
  }
  if (patchesMain.length > 0) {
    indexHtml.value = next.indexHtml
    stylesCss.value = next.stylesCss
    await typewritePatches('main', prev.mainJs, patchesMain, guideText, guideId)
    return
  }

  indexHtml.value = next.indexHtml
  stylesCss.value = next.stylesCss
  mainJs.value = next.mainJs
}

async function advanceStep() {
  if (!stepperEnabled.value) return
  if (stepperBusy.value) {
    fastForwardTyping()
    return
  }
  const total = stepperSteps.value.length
  const isLast = activeStepIndex.value >= total - 1
  if (isLast && total >= 2) {
    const blank = stepperSteps.value[0]?.files
    if (blank) {
      indexHtml.value = normalizeLf(blank.indexHtml)
      stylesCss.value = normalizeLf(blank.stylesCss)
      mainJs.value = normalizeLf(blank.mainJs)
      activeStepIndex.value = 0
      follow.index.token = 0
      follow.styles.token = 0
      follow.main.token = 0
      reveal.index.token = 0
      reveal.styles.token = 0
      reveal.main.token = 0
    }
    return
  }
  const next = isLast ? 0 : activeStepIndex.value + 1
  await applyStep(next)
}

let persistTimer = 0

watch(
  [
    indexHtml,
    stylesCss,
    mainJs,
    () => collapsed.index,
    () => collapsed.styles,
    () => collapsed.main,
    () => activeStepIndex.value,
    persisted
  ],
  () => {
    if (!persisted.value) return
    const key = persisted.value
    const payload = {
      indexHtml: indexHtml.value,
      stylesCss: stylesCss.value,
      mainJs: mainJs.value,
      collapsed: { index: collapsed.index, styles: collapsed.styles, main: collapsed.main },
      stepIndex: stepperEnabled.value && shouldPersistStepIndex.value ? activeStepIndex.value : undefined
    }
    window.clearTimeout(persistTimer)
    persistTimer = window.setTimeout(() => safeSetJson(key, payload), 250)
  }
)

onUnmounted(() => window.clearTimeout(persistTimer))
</script>
