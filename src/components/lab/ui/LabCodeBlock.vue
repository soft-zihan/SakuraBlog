<template>
  <div class="bg-gray-900 rounded-xl p-4">
    <div v-if="title || path" class="flex items-center gap-3 mb-2">
      <span class="text-xs text-gray-400">{{ title }}</span>
      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="path"
          type="button"
          class="text-[10px] px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-200 font-bold hover:opacity-90 whitespace-nowrap"
          @click="openCode(path, token)"
        >
          {{ lang === 'zh' ? '打开源码' : 'Open code' }}
        </button>
      </div>
    </div>
    <div class="max-h-[360px] overflow-auto rounded-lg">
      <pre class="text-xs font-mono whitespace-pre leading-relaxed"><code class="hljs" v-html="highlighted"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { openCode } from '../useOpenCode'
import hljs from 'highlight.js/lib/common'
import { sanitizeHtml } from '@/utils/sanitize'

const props = defineProps<{
  lang: 'en' | 'zh'
  title?: string
  code?: string
  path?: string
  token?: string
}>()

function guessLanguage() {
  const base = String(props.path || props.title || '')
  const ext = base
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

const highlighted = computed(() => {
  const code = String(props.code || '').replace(/\r\n/g, '\n')
  const lang = guessLanguage()
  try {
    const html = hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value
    const sanitized = sanitizeHtml(html)
    return sanitized || html
  } catch {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const sanitized = sanitizeHtml(escaped)
    return sanitized || escaped
  }
})
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
