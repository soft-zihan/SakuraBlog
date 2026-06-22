<template>
  <section class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 overflow-hidden">
    <div class="px-4 py-3 border-b border-white/60 dark:border-gray-700/60 flex items-center gap-3">
      <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
        {{ title }}
      </div>
      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="showReload"
          type="button"
          class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
          @click="reload"
        >
          {{ lang === 'zh' ? '刷新预览' : 'Reload' }}
        </button>
      </div>
    </div>
    <div class="p-4">
      <iframe
        ref="iframeRef"
        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white"
        :style="{ height: `${height}px` }"
        sandbox="allow-scripts"
        :srcdoc="srcdoc"
      ></iframe>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { sanitizeHtml } from '../../../utils/sanitize'

const props = defineProps<{
  lang: 'en' | 'zh'
  title: string
  html: string
  css?: string
  js?: string
  jsMode?: 'script' | 'module'
  height?: number
  showReload?: boolean
}>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const nonce = ref(0)

const height = computed(() => {
  const h = Number(props.height ?? 340)
  return Number.isFinite(h) && h > 180 ? h : 340
})

const SCRIPT_OPEN = '<scr' + 'ipt>'
const SCRIPT_CLOSE = '</scr' + 'ipt>'
const SCRIPT_OPEN_MODULE = '<scr' + 'ipt type="module">'

const BASE_CSS = [
  ':root {',
  '  color-scheme: light dark;',
  '  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;',
  '}',
  'html, body { height: 100%; }',
  'body {',
  '  margin: 0;',
  '  color: #0f172a;',
  '  background: radial-gradient(circle at 20% 10%, rgba(236,72,153,0.10), transparent 45%),',
  '    radial-gradient(circle at 90% 0%, rgba(99,102,241,0.10), transparent 45%),',
  '    #f8fafc;',
  '}',
  '.shell-preview-root {',
  '  min-height: 100%;',
  '  box-sizing: border-box;',
  '  padding: 16px;',
  '}'
].join('\n')

const srcdoc = computed(() => {
  const css = String(props.css || '')
  const js = String(props.js || '')
  const html = sanitizeHtml(String(props.html || ''))
  const boot = `window.__SHELL_PREVIEW_NONCE__=${nonce.value};`
  const style = `<style>${BASE_CSS}\n${css}</style>`
  const open = props.jsMode === 'module' ? SCRIPT_OPEN_MODULE : SCRIPT_OPEN
  const script = js ? `${open}${boot}\n${js}\n${SCRIPT_CLOSE}` : `${open}${boot}${SCRIPT_CLOSE}`
  return `<!doctype html><html><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />${style}</head><body><div class=\"shell-preview-root\">${html}</div>${script}</body></html>`
})

function reload() {
  nonce.value += 1
  const iframe = iframeRef.value
  if (!iframe) return
  iframe.srcdoc = srcdoc.value
}
</script>
