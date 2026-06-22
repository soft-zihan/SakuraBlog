<template>
  <section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[#0b1220] text-slate-100 overflow-hidden">
    <div
      class="px-4 py-3 border-b border-white/10 flex items-center gap-3 cursor-pointer select-none hover:bg-white/5"
      @click="toggleCollapsed"
    >
      <div class="text-xs font-extrabold text-slate-200">
        {{ title }}
      </div>
      <div v-if="copiedHint" class="text-[11px] text-[var(--primary-200)]">
        {{ copiedHint }}
      </div>
      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="action !== 'none'"
          type="button"
          class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-white/10 hover:bg-white/15 border border-white/10"
          @click.stop="performAction"
        >
          {{ actionText }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-white/10 hover:bg-white/15 border border-white/10"
          @click.stop="copy"
        >
          {{ lang === 'zh' ? '复制' : 'Copy' }}
        </button>
      </div>
    </div>

    <div v-show="!collapsed" class="relative" :style="editorStyle">
      <div
        v-if="flashStyle && highlightEnabled"
        class="absolute left-0 right-0 pointer-events-none z-[1] opacity-100 transition-opacity duration-300"
        :style="flashStyle"
      ></div>
      <pre ref="preRef" class="h-full p-4 text-[12px] leading-relaxed overflow-auto pointer-events-none select-none"
        ><code v-if="typing" class="hljs" v-text="normalizedValue"></code><code v-else class="hljs" v-html="highlighted"></code
      ></pre>
      <textarea
        ref="textareaRef"
        :value="normalizedValue"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        class="absolute inset-0 w-full h-full p-4 text-[12px] leading-relaxed font-mono whitespace-pre overflow-auto resize-none bg-transparent border-none outline-none text-transparent caret-slate-100 selection:bg-white/15 z-[2]"
        :placeholder="placeholder"
        @input="onInput"
        @scroll="onUserScroll"
      ></textarea>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import hljs from 'highlight.js/lib/common'
import { sanitizeHtml } from '@/utils/sanitize'

const props = defineProps<{
  lang: 'en' | 'zh'
  title: string
  modelValue: string
  language?: string
  placeholder?: string
  collapsed?: boolean
  typing?: boolean
  action?: 'none' | 'clear' | 'reset'
  resetValue?: string
  editorHeight?: number
  reveal?: {
    token: number
    fromLine: number
    toLine: number
  }
  follow?: {
    token: number
    line: number
  }
  highlight?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:collapsed', v: boolean): void
}>()

const preRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const copiedHint = ref('')
let copiedTimer = 0
const scrollTop = ref(0)
const flashActive = ref(false)
const flashRange = ref<{ fromLine: number; toLine: number } | null>(null)
let scrollAnimRaf = 0
let scrollAnimRunId = 0

const collapsed = computed(() => !!props.collapsed)
const typing = computed(() => !!props.typing)
const highlightEnabled = computed(() => props.highlight !== false)
const normalizedValue = computed(() => String(props.modelValue || '').replace(/\r\n/g, '\n'))

const editorHeight = computed(() => {
  const h = Number(props.editorHeight ?? 220)
  return Number.isFinite(h) && h >= 140 ? h : 220
})

const editorStyle = computed(() => ({ height: `${editorHeight.value}px` }))

const action = computed(() => (props.action || 'none') as 'none' | 'clear' | 'reset')

const actionText = computed(() => {
  if (action.value === 'reset' || action.value === 'clear') return props.lang === 'zh' ? '还原' : 'Reset'
  return ''
})

function guessLanguage() {
  const ext = String(props.title || '')
    .split('?')[0]
    .split('#')[0]
    .split('.')
    .pop()
    ?.toLowerCase()
  const map: Record<string, string> = {
    html: 'html',
    css: 'css',
    js: 'javascript',
    ts: 'typescript',
    vue: 'html',
    json: 'json',
    md: 'markdown',
    sh: 'bash',
    yml: 'yaml',
    yaml: 'yaml'
  }
  return (ext && map[ext]) || 'plaintext'
}

const hljsLanguage = computed(() => {
  const lang = String(props.language || '').trim()
  if (lang && hljs.getLanguage(lang)) return lang
  const guessed = guessLanguage()
  if (guessed && hljs.getLanguage(guessed)) return guessed
  return 'plaintext'
})

const highlighted = computed(() => {
  const code = normalizedValue.value || ''
  try {
    const html = hljs.highlight(code, { language: hljsLanguage.value }).value
    const sanitized = sanitizeHtml(html)
    return sanitized || html
  } catch {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const sanitized = sanitizeHtml(escaped)
    return sanitized || escaped
  }
})

function readEditorMetrics() {
  const ta = textareaRef.value
  if (!ta) return null
  const style = window.getComputedStyle(ta)
  const lineHeightRaw = style.lineHeight || ''
  const lineHeight = Number.parseFloat(lineHeightRaw)
  const paddingTop = Number.parseFloat(style.paddingTop || '0')
  return {
    lineHeight: Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : 18,
    paddingTop: Number.isFinite(paddingTop) ? paddingTop : 0,
    viewHeight: ta.clientHeight
  }
}

const flashStyle = computed(() => {
  if (!flashActive.value || !flashRange.value) return null
  const metrics = readEditorMetrics()
  if (!metrics) return null

  const fromLine = Math.max(1, Math.floor(flashRange.value.fromLine))
  const toLine = Math.max(fromLine, Math.floor(flashRange.value.toLine))
  const top = metrics.paddingTop + (fromLine - 1) * metrics.lineHeight - scrollTop.value
  const height = (toLine - fromLine + 1) * metrics.lineHeight
  return {
    top: `${Math.max(metrics.paddingTop, top)}px`,
    height: `${Math.max(metrics.lineHeight, height)}px`,
    background: 'linear-gradient(90deg, rgba(250,204,21,0.78), rgba(250,204,21,0.38), rgba(250,204,21,0.06))',
    borderLeft: '4px solid rgba(250,204,21,1)',
    boxShadow: 'inset 0 0 0 1px rgba(250,204,21,0.35)'
  } as const
})

function syncScroll() {
  const pre = preRef.value
  const ta = textareaRef.value
  if (!pre || !ta) return
  scrollTop.value = ta.scrollTop
  pre.scrollTop = ta.scrollTop
  pre.scrollLeft = ta.scrollLeft
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function smoothScrollToTop(targetTop: number, durationMs = 280) {
  const ta = textareaRef.value
  if (!ta) return
  const startTop = ta.scrollTop
  const endTop = Math.max(0, targetTop)
  const delta = endTop - startTop
  if (Math.abs(delta) < 1) return

  scrollAnimRunId++
  const runId = scrollAnimRunId
  if (scrollAnimRaf) window.cancelAnimationFrame(scrollAnimRaf)
  const startTime = performance.now()
  const duration = Math.max(120, Math.floor(durationMs))

  const step = (now: number) => {
    if (runId !== scrollAnimRunId) return
    const t = Math.min(1, (now - startTime) / duration)
    ta.scrollTop = startTop + delta * easeInOutCubic(t)
    syncScroll()
    if (t < 1) scrollAnimRaf = window.requestAnimationFrame(step)
    else scrollAnimRaf = 0
  }

  scrollAnimRaf = window.requestAnimationFrame(step)
}

function onUserScroll() {
  scrollAnimRunId++
  if (scrollAnimRaf) {
    window.cancelAnimationFrame(scrollAnimRaf)
    scrollAnimRaf = 0
  }
  syncScroll()
}

function onInput(e: Event) {
  const ta = e.target as HTMLTextAreaElement
  emit('update:modelValue', ta.value)
  window.requestAnimationFrame(syncScroll)
}

function toggleCollapsed() {
  emit('update:collapsed', !collapsed.value)
}

function performAction() {
  if (action.value === 'reset') emit('update:modelValue', String(props.resetValue ?? ''))
  else if (action.value === 'clear') emit('update:modelValue', props.resetValue != null ? String(props.resetValue) : '')
  window.requestAnimationFrame(() => {
    syncScroll()
    textareaRef.value?.focus()
  })
}

async function copy() {
  try {
    await navigator.clipboard.writeText(normalizedValue.value)
    copiedHint.value = props.lang === 'zh' ? '已复制' : 'Copied'
    if (copiedTimer) window.clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => {
      copiedTimer = 0
      copiedHint.value = ''
    }, 1200)
  } catch {
    copiedHint.value = props.lang === 'zh' ? '复制失败' : 'Copy failed'
    if (copiedTimer) window.clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => {
      copiedTimer = 0
      copiedHint.value = ''
    }, 1400)
  }
}

function revealAndFlash(fromLine: number, toLine: number) {
  const ta = textareaRef.value
  if (!ta) return
  const metrics = readEditorMetrics()
  if (!metrics) return

  const from = Math.max(1, Math.floor(fromLine))
  const to = Math.max(from, Math.floor(toLine))
  const targetTop = metrics.paddingTop + (from - 1) * metrics.lineHeight
  const desiredScrollTop = Math.max(0, targetTop - metrics.lineHeight * 2)
  smoothScrollToTop(desiredScrollTop, 320)
  ta.focus()

  flashRange.value = { fromLine: from, toLine: to }
  flashActive.value = true
}

function followLine(line: number) {
  const ta = textareaRef.value
  if (!ta) return
  const metrics = readEditorMetrics()
  if (!metrics) return
  const ln = Math.max(1, Math.floor(line))
  const targetTop = metrics.paddingTop + (ln - 1) * metrics.lineHeight
  const desiredScrollTop = Math.max(0, targetTop - metrics.lineHeight * 2)
  if (Math.abs(ta.scrollTop - desiredScrollTop) < metrics.lineHeight * 1.5) return
  smoothScrollToTop(desiredScrollTop, 200)
}

onMounted(() => syncScroll())
watch(() => props.modelValue, () => window.requestAnimationFrame(syncScroll))

watch(
  () => props.reveal?.token,
  async (token) => {
    if (!props.reveal) return
    if (!token) {
      flashActive.value = false
      flashRange.value = null
      return
    }
    await nextTick()
    revealAndFlash(props.reveal.fromLine, props.reveal.toLine)
  }
)

watch(
  () => props.follow?.token,
  async (token) => {
    if (!props.follow || !token) return
    await nextTick()
    followLine(props.follow.line)
  }
)
</script>

<style scoped>
:deep(.hljs) {
  display: block;
  white-space: pre;
  color: #d4d4d4;
}

:deep(.hljs-comment),
:deep(.hljs-quote) {
  color: #c0e8a6;
  font-style: normal;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag),
:deep(.hljs-built_in) {
  color: #569cd6;
  font-weight: 500;
}

:deep(.hljs-string),
:deep(.hljs-doctag),
:deep(.hljs-attr) {
  color: #ce9178;
}

:deep(.hljs-number),
:deep(.hljs-literal) {
  color: #b5cea8;
}

:deep(.hljs-function),
:deep(.hljs-title) {
  color: #dcdcaa;
}

:deep(.hljs-variable),
:deep(.hljs-template-variable) {
  color: #9cdcfe;
}

:deep(.hljs-type),
:deep(.hljs-class .hljs-title) {
  color: #4ec9b0;
}

:deep(.hljs-tag),
:deep(.hljs-name) {
  color: #569cd6;
}

:deep(.hljs-attribute),
:deep(.hljs-params) {
  color: #9cdcfe;
}

:deep(.hljs-regexp) {
  color: #d16969;
}

:deep(.hljs-symbol),
:deep(.hljs-bullet) {
  color: #d7ba7d;
}

:deep(.hljs-meta) {
  color: #569cd6;
}
</style>
