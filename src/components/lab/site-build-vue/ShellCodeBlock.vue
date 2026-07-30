<template>
  <section class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-[#0b1220] text-slate-100 overflow-hidden">
    <div
      class="px-4 py-3 border-b border-white/10 flex items-center gap-3 cursor-pointer select-none hover:bg-white/5"
      role="button"
      tabindex="0"
      :aria-expanded="expanded"
      @click="toggleExpanded"
      @keydown.enter.prevent="toggleExpanded"
      @keydown.space.prevent="toggleExpanded"
    >
      <div class="text-xs font-extrabold text-slate-200">
        {{ title }}
      </div>
      <div class="ml-auto flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-white/10 hover:bg-white/15 border border-white/10"
          @click.stop="copy"
        >
          {{ lang === 'zh' ? '复制' : 'Copy' }}
        </button>
      </div>
    </div>
    <pre class="p-4 text-[12px] leading-relaxed overflow-x-auto"><code class="hljs" v-html="highlighted"></code></pre>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import hljs from 'highlight.js/lib/common'
import { sanitizeHtml } from '../../../utils/sanitize'
import { useSiteBuildShellStore } from './shellStore'

const props = defineProps<{
  lang: 'en' | 'zh'
  title: string
  content: string
  collapsedLines?: number
  language?: string
}>()

const store = useSiteBuildShellStore()
const expanded = ref(false)

const lines = computed(() => String(props.content || '').replace(/\r\n/g, '\n').split('\n'))

const collapsedLines = computed(() => {
  const n = Number(props.collapsedLines ?? 26)
  return Number.isFinite(n) && n > 6 ? Math.floor(n) : 26
})

const displayed = computed(() => {
  if (expanded.value) return props.content
  const n = collapsedLines.value
  if (lines.value.length <= n) return props.content
  const head = lines.value.slice(0, n).join('\n')
  const rest = lines.value.length - n
  const tail = props.lang === 'zh' ? `\n\n…（已折叠 ${rest} 行）` : `\n\n…(${rest} lines collapsed)`
  return `${head}${tail}`
})

function guessLanguage() {
  const ext = String(props.title || '')
    .split('?')[0]
    .split('#')[0]
    .split('.')
    .pop()
    ?.toLowerCase()
  const map: Record<string, string> = {
    vue: 'html',
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    md: 'markdown',
    py: 'python',
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
  const code = String(displayed.value || '').replace(/\r\n/g, '\n')
  try {
    const html = hljs.highlight(code, { language: hljsLanguage.value }).value
    return sanitizeHtml(html)
  } catch {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return sanitizeHtml(escaped)
  }
})

function toggleExpanded() {
  expanded.value = !expanded.value
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.content)
    store.showToast(props.lang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard')
  } catch {
    store.showToast(props.lang === 'zh' ? '复制失败（浏览器可能禁止）' : 'Copy failed (blocked by browser)')
  }
}
</script>

<style scoped>
:deep(.hljs) {
  display: block;
  white-space: pre;
  color: #d4d4d4;
}

:deep(.hljs-comment),
:deep(.hljs-quote) {
  color: #6a9955;
  font-style: italic;
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
