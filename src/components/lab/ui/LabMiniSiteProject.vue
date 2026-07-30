<template>
  <div class="max-w-5xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
    <div v-if="showHeader" class="flex items-start gap-4 mb-6">
      <div class="text-3xl">{{ headerIcon }}</div>
      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            {{ headerTitle }}
          </h3>
          <div class="ml-auto flex items-center gap-2">
            <button
              v-if="!isCombinedDemo"
              type="button"
              class="px-3 py-2 rounded-xl text-xs font-extrabold border transition-colors"
              :class="isEditing ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white' : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90'"
              @click="isEditing = !isEditing"
            >
              {{ isEditing ? (isZh ? '编辑中' : 'Editing') : (isZh ? '开启编辑' : 'Edit') }}
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-xl text-xs font-extrabold border transition-colors bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
              :disabled="isPackaging"
              @click="downloadZip"
            >
              {{ isPackaging ? (isZh ? '打包中…' : 'Packaging…') : (isZh ? '下载 zip' : 'Download zip') }}
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {{ headerDesc }}
        </p>
        <div class="flex flex-wrap gap-2 mt-3">
          <span class="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 text-gray-700 dark:text-gray-200">
            {{ isZh ? '目标：做出一页“简化本站”' : 'Goal: build a simplified one-page site' }}
          </span>
          <span class="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 text-gray-700 dark:text-gray-200">
            {{ isZh ? '产物：index.html / styles.css / main.js' : 'Output: index.html / styles.css / main.js' }}
          </span>
          <span v-if="saveHint" class="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 text-gray-700 dark:text-gray-200">
            {{ saveHint }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div class="space-y-3">
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
          <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 flex items-center gap-2">
            <div class="text-xs font-extrabold text-gray-700 dark:text-gray-200">
              {{ isZh ? '预览（沙盒 iframe）' : 'Preview (sandbox iframe)' }}
            </div>
            <div class="ml-auto text-[10px] text-gray-500 dark:text-gray-400 font-mono">
              {{ previewBadge }}
            </div>
          </div>
          <iframe
            class="w-full h-[min(70vh,760px)] bg-white"
            :srcdoc="srcdocActive"
            sandbox="allow-scripts"
            referrerpolicy="no-referrer"
            :title="isZh ? '迷你站预览' : 'Mini site preview'"
          ></iframe>
        </div>

        <div v-if="upgradeHint && !isCombinedDemo" class="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-900/15 p-4">
          <div class="text-xs font-extrabold text-amber-800 dark:text-amber-200">
            {{ upgradeHint }}
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-if="missingStylesLink && (props.step === 'css' || props.step === 'js')"
              type="button"
              class="px-3 py-2 rounded-xl text-xs font-extrabold border transition-colors bg-white/80 dark:bg-gray-900/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200 hover:opacity-90"
              @click="upgradeIndexForCss"
            >
              {{ isZh ? '一键补齐 styles.css 引用' : 'Insert styles.css link' }}
            </button>
            <button
              v-if="missingMainScript && props.step === 'js'"
              type="button"
              class="px-3 py-2 rounded-xl text-xs font-extrabold border transition-colors bg-white/80 dark:bg-gray-900/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200 hover:opacity-90"
              @click="upgradeIndexForJs"
            >
              {{ isZh ? '一键补齐 main.js 引用' : 'Insert main.js script' }}
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <template v-if="!isCombinedEditor">
          <div class="flex items-center gap-2">
            <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
              {{ isZh ? '分文件编辑' : 'Split-file editor (edit each file separately)' }}
            </div>
            <div class="ml-auto text-[10px] text-gray-500 dark:text-gray-400 font-mono">
              {{ isZh ? '本地草稿自动保存' : 'Auto-saved locally' }}
            </div>
            <button
              v-if="demoStepperEnabled"
              type="button"
              class="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold bg-[var(--primary-600)] text-white hover:opacity-90"
              @click="advanceDemoStep"
            >
              {{ demoStepperButtonText }}
            </button>
          </div>

          <div class="space-y-3">
            <template v-if="isEditing">
              <LabEditableCodeBlock
                v-for="f in fileItems"
                :key="f.id"
                :lang="props.lang"
                :title="f.id"
                :language="fileLanguage(f.id)"
                :typing="demoTypingFileId === f.id"
                :highlight="false"
                action="reset"
                :reset-value="resetBaselineByFileId[f.id]"
                :editor-height="500"
                :model-value="draftByFileId[f.id] || ''"
                :collapsed="collapsedByFileId[f.id] || false"
                :placeholder="placeholderByFileId(f.id)"
                :reveal="demoRevealByFileId[f.id]"
                :follow="demoFollowByFileId[f.id]"
                @update:model-value="setDraft(f.id, $event)"
                @update:collapsed="(v) => (collapsedByFileId[f.id] = v)"
              />
            </template>
            <template v-else>
              <LabCodeBlock
                v-for="f in fileItems"
                :key="f.id"
                :lang="props.lang"
                :title="f.id"
                :code="draftByFileId[f.id] || ''"
              />
            </template>
          </div>
        </template>

        <div
          v-else-if="combinedRole === 'practice'"
          class="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900"
        >
          <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 flex items-center gap-2">
            <div class="text-xs font-extrabold text-gray-700 dark:text-gray-200">
              {{ isZh ? '编辑器' : 'Single editor (starter + TODO hints)' }}
            </div>
            <div class="ml-auto flex items-center gap-2">
              <button
                type="button"
                class="px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-colors bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
                @click="resetAllDrafts"
              >
                {{ isZh ? '空白模板' : 'Starter' }}
              </button>
              <button
                type="button"
                class="px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-colors bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
                @click="fillWithDemo"
              >
                {{ isZh ? '填入示范' : 'Fill Demo' }}
              </button>
              <div class="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div class="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                {{ isZh ? '本地草稿自动保存' : 'Auto-saved locally' }}
              </div>
            </div>
          </div>
          <textarea
            v-if="isEditing"
            v-model="combinedDraftModel"
            class="w-full h-[520px] p-4 font-mono text-xs leading-relaxed bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 outline-none"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
          ></textarea>
          <LabCodeBlock v-else :lang="props.lang" :title="isZh ? '三合一草稿（只读）' : 'Combined draft (read-only)'" :code="combinedDraftModel" />
        </div>

        <div
          v-else
          class="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900"
        >
          <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 flex items-center gap-2">
            <div class="text-xs font-extrabold text-gray-700 dark:text-gray-200">
              {{ isZh ? '三合一示范（只读）' : 'All-in-one demo (read-only)' }}
            </div>
          </div>
          <div class="p-4 space-y-3">
            <LabCodeBlock
              v-for="f in fileItems"
              :key="f.id"
              :lang="props.lang"
              :title="isZh ? '示范：' + f.labelZh : 'Demo: ' + f.labelEn"
              :code="defaultByFileId[f.id] || ''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import LabCodeBlock from './LabCodeBlock.vue'
import LabEditableCodeBlock from './LabEditableCodeBlock.vue'
import JSZip from 'jszip'
import { safeLocalStorage } from '@/utils/storage'
import { WIREFRAME_CSS, buildMiniJs, buildMiniSiteDefaultIndexHtml, buildMiniSiteFullCss, buildMiniSiteStarterFiles } from './miniSiteProjectSamples'
import { buildMiniSiteDemoSteps, computePatch } from './miniSiteProjectDemoStepper'
 
const props = defineProps<{
  lang: 'en' | 'zh'
  step: 'html' | 'css' | 'js'
  editor?: 'files' | 'combined'
  combinedRole?: 'practice' | 'demo'
  preset?: 'blank' | 'demo'
  storageId?: string
  showHeader?: boolean
}>()
 
const isZh = computed(() => props.lang === 'zh')
const showHeader = computed(() => props.showHeader !== false)
const editorLayout = computed(() => props.editor ?? 'files')
const isCombinedEditor = computed(() => editorLayout.value === 'combined')
const combinedRole = computed(() => props.combinedRole ?? 'practice')
const isCombinedDemo = computed(() => isCombinedEditor.value && combinedRole.value === 'demo')

const STORAGE_VERSION = 'v2'
 
type FileId = 'index.html' | 'styles.css' | 'main.js'
type FileItem = { id: FileId; labelZh: string; labelEn: string }
 
const fileItems = computed<FileItem[]>(() => {
  const base: FileItem[] = [{ id: 'index.html', labelZh: 'index.html', labelEn: 'index.html' }]
  if (props.step === 'css' || props.step === 'js') base.push({ id: 'styles.css', labelZh: 'styles.css', labelEn: 'styles.css' })
  if (props.step === 'js') base.push({ id: 'main.js', labelZh: 'main.js', labelEn: 'main.js' })
  return base
})
 
const activeFileId = ref<FileId>('index.html')
const isEditing = ref(true)
const collapsedByFileId = ref<Partial<Record<FileId, boolean>>>({})

type DemoReveal = { token: number; fromLine: number; toLine: number }
const demoRevealByFileId = reactive<Record<FileId, DemoReveal>>({
  'index.html': { token: 0, fromLine: 1, toLine: 1 },
  'styles.css': { token: 0, fromLine: 1, toLine: 1 },
  'main.js': { token: 0, fromLine: 1, toLine: 1 }
})

type DemoFollow = { token: number; line: number }
const demoFollowByFileId = reactive<Record<FileId, DemoFollow>>({
  'index.html': { token: 0, line: 1 },
  'styles.css': { token: 0, line: 1 },
  'main.js': { token: 0, line: 1 }
})

function fileLanguage(fileId: FileId) {
  if (fileId === 'index.html') return 'html'
  if (fileId === 'styles.css') return 'css'
  return 'javascript'
}

function placeholderByFileId(fileId: FileId) {
  return ''
}
 
const headerIcon = computed(() => {
  if (props.step === 'html') return '🧱'
  if (props.step === 'css') return '🎨'
  return '⚙️'
})
 
const headerTitle = computed(() => {
  if (props.step === 'html') return isZh.value ? '迷你项目：做出页面骨架（HTML）' : 'Mini project: build the skeleton (HTML)'
  if (props.step === 'css') return isZh.value ? '迷你项目：把页面“穿起来”（CSS）' : 'Mini project: style the page (CSS)'
  return isZh.value ? '迷你项目：让页面“动起来”（JS）' : 'Mini project: make it interactive (JS)'
})
 
const headerDesc = computed(() => {
  if (props.step === 'html') {
    return isZh.value
      ? '做网站布局：先把主要结构搭出来（左侧可折叠栏 + 顶栏 + 内容区 + 右侧面板/弹窗节点）。'
      : 'Build the shell: recreate the main frame (collapsible sidebar + top bar + content + placeholder panels/modals).'
  }
  if (props.step === 'css') {
    return isZh.value
      ? '只写 CSS：把玻璃拟态、渐变背景、浮动光斑、卡片 hover 等动效做出来。'
      : 'CSS only: recreate glass panels, gradient backdrop, floating blobs, and card hover animations.'
  }
  return isZh.value
    ? '只做站点交互框架：折叠侧边栏 / 打开右侧面板 / 弹出搜索与设置（不做真实数据逻辑）。'
    : 'Keep only shell interactions: collapse sidebar / open right panel / show search & settings (no real data logic).'
})
 
const previewBadge = computed(() => {
  if (props.step === 'html') return isZh.value ? '布局预览（基础样式）' : 'Layout preview (basic styles)'
  if (props.step === 'css') return isZh.value ? 'HTML + CSS 预览' : 'HTML + CSS'
  return isZh.value ? 'HTML + CSS + JS 预览' : 'HTML + CSS + JS'
})

type DemoStep = {
  label: string
  files: Record<FileId, string>
}

const demoSteps = computed<DemoStep[]>(() => {
  return buildMiniSiteDemoSteps({
    lang: props.lang,
    preset: props.preset,
    step: props.step,
    isCombinedEditor: isCombinedEditor.value,
    defaultIndexHtml: defaultIndexHtml.value,
    fullCss: fullCss.value,
    jsCode: jsCode.value
  }) as DemoStep[]
})

const demoStepperEnabled = computed(() => demoSteps.value.length >= 2)
const demoStepIndex = ref(0)
const demoStepperBusy = ref(false)
const demoTypingFileId = ref<FileId | null>(null)
let demoTypewriteRunId = 0
const activeDemoTypewriteFileId = ref<FileId | null>(null)
const activeDemoTypewriteFinal = ref<string>('')

function demoStepKey() {
  const scope = String(props.storageId || '').trim() || 'default'
  return `lab_mini_site_${STORAGE_VERSION}_${props.lang}_${scope}_demo_step`
}

function normalizeLf(s: string) {
  return String(s || '').replace(/\r\n/g, '\n')
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

async function typewriteDemoPatch(fileId: FileId, prevValue: string, patch: any, label: string) {
  const runId = ++demoTypewriteRunId
  demoStepperBusy.value = true
  demoTypingFileId.value = fileId
  activeDemoTypewriteFileId.value = fileId
  activeDemoTypewriteFinal.value = String(patch.nextNormalized || '')

  const prev = normalizeLf(prevValue)
  const lineStart = prev.lastIndexOf('\n', Math.max(0, patch.startIndex - 1)) + 1
  const prefixLeft = prev.slice(0, lineStart)
  const midLeft = prev.slice(lineStart, patch.startIndex)
  const right = prev.slice(patch.startIndex + patch.deleteCount)
  const placeholderBase = String(patch.insertText || patch.deleteText || '')
  const placeholder = placeholderBase.replace(/[^\n]/g, ' ')
  const cleared = `${prefixLeft}${midLeft}${placeholder}${right}`

  setDraft(fileId, cleared)
  collapsedByFileId.value[fileId] = false
  demoRevealByFileId[fileId].fromLine = patch.fromLine
  demoRevealByFileId[fileId].toLine = patch.toLine

  demoFollowByFileId[fileId].line = patch.fromLine
  demoFollowByFileId[fileId].token++

  await nextTick()
  await sleep(1200)

  const total = String(patch.insertText || '').length
  const baseDelay = total > 1600 ? 16 : total > 900 ? 18 : total > 520 ? 22 : total > 320 ? 26 : total > 180 ? 30 : 34
  const getDelay = (ch: string) => {
    const jitter = Math.floor(Math.random() * 16)
    if (ch === '\n') return baseDelay + 160 + jitter
    if (ch === ';' || ch === ',' || ch === ')' || ch === ']') return baseDelay + 45 + jitter
    if (ch === '}' || ch === '>') return baseDelay + 65 + jitter
    return baseDelay + jitter
  }

  let typedNewlines = 0
  let followTick = 0
  try {
    if (total === 0) {
      await sleep(500)
      if (runId === demoTypewriteRunId) setDraft(fileId, patch.nextNormalized)
      return
    }

    let i = 0
    followTick++
    demoFollowByFileId[fileId].line = patch.fromLine
    demoFollowByFileId[fileId].token = followTick
    while (i < total) {
      if (runId !== demoTypewriteRunId) return
      i += 1
      const ch = patch.insertText.charAt(i - 1)
      if (ch === '\n') typedNewlines++
      const segment = `${patch.insertText.slice(0, i)}${placeholder.slice(i)}`
      setDraft(fileId, `${prefixLeft}${midLeft}${segment}${right}`)
      if (ch === '\n' || i % 24 === 0) {
        followTick++
        demoFollowByFileId[fileId].line = patch.fromLine + typedNewlines
        demoFollowByFileId[fileId].token = followTick
      }
      await sleep(getDelay(patch.insertText.charAt(i - 1)))
    }
    if (runId === demoTypewriteRunId) {
      setDraft(fileId, patch.nextNormalized)
    }
  } finally {
    if (runId === demoTypewriteRunId) {
      demoStepperBusy.value = false
      demoTypingFileId.value = null
      activeDemoTypewriteFileId.value = null
      activeDemoTypewriteFinal.value = ''
    }
  }
}

function fastForwardDemoTyping() {
  if (!demoStepperBusy.value || !activeDemoTypewriteFileId.value) return
  demoTypewriteRunId++
  const fileId = activeDemoTypewriteFileId.value
  setDraft(fileId, activeDemoTypewriteFinal.value)
  demoStepperBusy.value = false
  demoTypingFileId.value = null
  activeDemoTypewriteFileId.value = null
  activeDemoTypewriteFinal.value = ''
  demoFollowByFileId[fileId].token++
}

async function applyDemoStep(idx: number) {
  if (!demoStepperEnabled.value || demoStepperBusy.value) return
  const total = demoSteps.value.length
  const nextIndex = Math.max(0, Math.min(total - 1, Math.floor(idx)))

  const prevFiles: Record<FileId, string> = {
    'index.html': indexHtmlDraft.value,
    'styles.css': stylesDraft.value,
    'main.js': jsDraft.value
  }
  const nextFiles = demoSteps.value[nextIndex]?.files
  if (!nextFiles) return

  const label = String(demoSteps.value[nextIndex]?.label || '').trim()
  demoStepIndex.value = nextIndex
  safeLocalStorage.setItem(demoStepKey(), String(nextIndex))

  const pIndex = computePatch(prevFiles['index.html'], nextFiles['index.html'])
  const pCss = computePatch(prevFiles['styles.css'], nextFiles['styles.css'])
  const pJs = computePatch(prevFiles['main.js'], nextFiles['main.js'])

  if (pIndex) {
    setDraft('styles.css', normalizeLf(nextFiles['styles.css']))
    setDraft('main.js', normalizeLf(nextFiles['main.js']))
    await typewriteDemoPatch('index.html', prevFiles['index.html'], pIndex, label)
    return
  }
  if (pCss) {
    setDraft('index.html', normalizeLf(nextFiles['index.html']))
    setDraft('main.js', normalizeLf(nextFiles['main.js']))
    await typewriteDemoPatch('styles.css', prevFiles['styles.css'], pCss, label)
    return
  }
  if (pJs) {
    setDraft('index.html', normalizeLf(nextFiles['index.html']))
    setDraft('styles.css', normalizeLf(nextFiles['styles.css']))
    await typewriteDemoPatch('main.js', prevFiles['main.js'], pJs, label)
    return
  }

  setDraft('index.html', normalizeLf(nextFiles['index.html']))
  setDraft('styles.css', normalizeLf(nextFiles['styles.css']))
  setDraft('main.js', normalizeLf(nextFiles['main.js']))
}

const demoStepperButtonText = computed(() => {
  if (!demoStepperEnabled.value) return ''
  const total = demoSteps.value.length
  const isLast = demoStepIndex.value >= total - 1
  const label = demoStepperBusy.value
    ? isZh.value
      ? '跳过'
      : 'Typing...'
    : isLast
      ? isZh.value
        ? '重播'
        : 'Replay'
      : isZh.value
        ? '逐步'
        : 'Step'
  const shownIdx = Math.min(demoStepIndex.value + 1, total)
  return `${label}（${shownIdx}/${total}）`
})

async function advanceDemoStep() {
  if (!demoStepperEnabled.value) return
  if (demoStepperBusy.value) {
    fastForwardDemoTyping()
    return
  }
  const total = demoSteps.value.length
  const next = demoStepIndex.value >= total - 1 ? 0 : demoStepIndex.value + 1
  await applyDemoStep(next)
}

const defaultIndexHtml = computed(() => buildMiniSiteDefaultIndexHtml({ lang: props.lang, step: props.step }))

const fullCss = computed(() => buildMiniSiteFullCss())
 
const jsCode = computed(() => {
  return buildMiniJs('demo')
})
 
const saveHint = ref('')
let saveHintTimer = 0

function storageKey(fileId: FileId) {
  const scope = String(props.storageId || '').trim()
  if (!scope) return `lab_mini_site_${STORAGE_VERSION}_${props.lang}_${fileId}`
  return `lab_mini_site_${STORAGE_VERSION}_${props.lang}_${scope}_${fileId}`
}

function combinedStorageKey() {
  const scope = String(props.storageId || '').trim()
  if (!scope) return `lab_mini_site_${STORAGE_VERSION}_${props.lang}_${props.step}_combined`
  return `lab_mini_site_${STORAGE_VERSION}_${props.lang}_${scope}_${props.step}_combined`
}

function legacyStorageKey(step: 'html' | 'css' | 'js', fileId: FileId) {
  return `lab_mini_site_${STORAGE_VERSION}_${props.lang}_${step}_${fileId}`
}

const indexHtmlDraft = ref('')
const stylesDraft = ref('')
const jsDraft = ref('')
const combinedDraft = ref('')

function loadDraft(fileId: FileId, fallback: string) {
  const saved = safeLocalStorage.getItem(storageKey(fileId))
  if (saved != null) return saved
  for (const s of ['js', 'css', 'html'] as const) {
    const legacy = safeLocalStorage.getItem(legacyStorageKey(s, fileId))
    if (legacy != null) return legacy
  }
  return fallback
}

function loadCombinedDraft(fallback: string) {
  const saved = safeLocalStorage.getItem(combinedStorageKey())
  if (saved != null) return saved
  return fallback
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const combinedMarkers: Record<FileId, { start: string; end: string }> = {
  'index.html': { start: '<!-- FILE:index.html -->', end: '<!-- END_FILE:index.html -->' },
  'styles.css': { start: '/* FILE:styles.css */', end: '/* END_FILE:styles.css */' },
  'main.js': { start: '/* FILE:main.js */', end: '/* END_FILE:main.js */' }
}

function buildCombinedText(files: Partial<Record<FileId, string>>, allowedIds: FileId[]) {
  const order: FileId[] = ['index.html', 'styles.css', 'main.js']
  const parts: string[] = []
  for (const id of order) {
    if (!allowedIds.includes(id)) continue
    const content = files[id] ?? ''
    const m = combinedMarkers[id]
    parts.push(`${m.start}\n${content}\n${m.end}`)
  }
  return `${parts.join('\n\n')}\n`
}

function parseCombinedText(text: string) {
  const out: Partial<Record<FileId, string>> = {}
  for (const id of Object.keys(combinedMarkers) as FileId[]) {
    const { start, end } = combinedMarkers[id]
    const re = new RegExp(`${escapeRegExp(start)}\\s*([\\s\\S]*?)\\s*${escapeRegExp(end)}`, 'm')
    const m = re.exec(text || '')
    if (m && typeof m[1] === 'string') out[id] = m[1].trimEnd()
  }
  return out
}

function replaceCombinedSection(text: string, fileId: FileId, nextContent: string) {
  const { start, end } = combinedMarkers[fileId]
  const re = new RegExp(`(${escapeRegExp(start)}\\s*)([\\s\\S]*?)(\\s*${escapeRegExp(end)})`, 'm')
  const raw = text || ''
  if (re.test(raw)) return raw.replace(re, `$1${nextContent}$3`)
  return `${raw.trimEnd()}\n\n${start}\n${nextContent}\n${end}\n`
}

const starterByFileId = computed<Record<FileId, string>>(() => buildMiniSiteStarterFiles(props.lang) as any)

const combinedStarter = computed(() => buildCombinedText(starterByFileId.value, fileItems.value.map((f) => f.id)))

function loadAllDrafts() {
  if (isCombinedEditor.value) {
    if (isCombinedDemo.value) return
    combinedDraft.value = loadCombinedDraft(combinedStarter.value)
  } else {
    const preset = props.preset || 'demo'
    const baseline: Record<FileId, string> =
      preset === 'blank'
        ? starterByFileId.value
        : { 'index.html': defaultIndexHtml.value, 'styles.css': fullCss.value, 'main.js': jsCode.value }
    indexHtmlDraft.value = loadDraft('index.html', baseline['index.html'])
    stylesDraft.value = loadDraft('styles.css', baseline['styles.css'])
    jsDraft.value = loadDraft('main.js', baseline['main.js'])
    const allowed = fileItems.value.map((f) => f.id)
    if (!allowed.includes(activeFileId.value)) activeFileId.value = allowed[0] ?? 'index.html'
  }
}

loadAllDrafts()

function setSaveHint(text: string) {
  saveHint.value = text
  if (saveHintTimer) window.clearTimeout(saveHintTimer)
  saveHintTimer = window.setTimeout(() => {
    saveHintTimer = 0
    saveHint.value = ''
  }, 1200)
}

const saveTimers: Partial<Record<FileId, number>> = {}
let combinedSaveTimer = 0

function scheduleSave(fileId: FileId, value: string) {
  const prev = saveTimers[fileId]
  if (prev) window.clearTimeout(prev)
  saveTimers[fileId] = window.setTimeout(() => {
    saveTimers[fileId] = undefined
    safeLocalStorage.setItem(storageKey(fileId), value)
    setSaveHint(isZh.value ? '草稿已保存' : 'Draft saved')
  }, 350)
}

function scheduleSaveCombined(value: string) {
  if (combinedSaveTimer) window.clearTimeout(combinedSaveTimer)
  combinedSaveTimer = window.setTimeout(() => {
    combinedSaveTimer = 0
    safeLocalStorage.setItem(combinedStorageKey(), value)
    setSaveHint(isZh.value ? '草稿已保存' : 'Draft saved')
  }, 350)
}

const combinedDraftModel = computed({
  get() {
    return combinedDraft.value
  },
  set(v: string) {
    combinedDraft.value = v
    scheduleSaveCombined(v)
  }
})

function setDraft(fileId: FileId, value: string) {
  if (fileId === 'index.html') indexHtmlDraft.value = value
  if (fileId === 'styles.css') stylesDraft.value = value
  if (fileId === 'main.js') jsDraft.value = value
  scheduleSave(fileId, value)
}

const draftByFileId = computed<Record<FileId, string>>(() => {
  const map: Record<FileId, string> = {
    'index.html': indexHtmlDraft.value,
    'styles.css': stylesDraft.value,
    'main.js': jsDraft.value
  }
  if (props.step === 'html') return { 'index.html': map['index.html'] } as Record<FileId, string>
  if (props.step === 'css') return { 'index.html': map['index.html'], 'styles.css': map['styles.css'] } as Record<FileId, string>
  return map
})

const effectiveDraftByFileId = computed<Record<FileId, string>>(() => {
  if (!isCombinedEditor.value) return draftByFileId.value
  const parsed = parseCombinedText(combinedDraft.value)
  const starter = starterByFileId.value
  const map: Record<FileId, string> = {
    'index.html': parsed['index.html'] ?? starter['index.html'],
    'styles.css': parsed['styles.css'] ?? starter['styles.css'],
    'main.js': parsed['main.js'] ?? starter['main.js']
  }
  if (props.step === 'html') return { 'index.html': map['index.html'] } as Record<FileId, string>
  if (props.step === 'css') return { 'index.html': map['index.html'], 'styles.css': map['styles.css'] } as Record<FileId, string>
  return map
})

function setEffectiveDraft(fileId: FileId, value: string) {
  if (!isCombinedEditor.value) {
    setDraft(fileId, value)
    return
  }
  combinedDraft.value = replaceCombinedSection(combinedDraft.value, fileId, value)
  scheduleSaveCombined(combinedDraft.value)
  setSaveHint(isZh.value ? '草稿已保存' : 'Draft saved')
}

const defaultByFileId = computed<Record<FileId, string>>(() => {
  const map: Record<FileId, string> = {
    'index.html': defaultIndexHtml.value,
    'styles.css': fullCss.value,
    'main.js': jsCode.value
  }
  if (props.step === 'html') return { 'index.html': map['index.html'] } as Record<FileId, string>
  if (props.step === 'css') return { 'index.html': map['index.html'], 'styles.css': map['styles.css'] } as Record<FileId, string>
  return map
})

const resetBaselineByFileId = computed<Record<FileId, string>>(() => {
  const preset = props.preset || 'demo'
  const map = preset === 'blank' ? starterByFileId.value : defaultByFileId.value
  if (props.step === 'html') return { 'index.html': map['index.html'] } as Record<FileId, string>
  if (props.step === 'css') return { 'index.html': map['index.html'], 'styles.css': map['styles.css'] } as Record<FileId, string>
  return map
})

const activeDraft = computed({
  get() {
    const map = draftByFileId.value as Record<string, string>
    return map[activeFileId.value] || ''
  },
  set(v: string) {
    setDraft(activeFileId.value, v)
  }
})

function stripExternalIncludes(html: string) {
  const linkStylesRe = /<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi
  const linkCssRe = /<link\b[^>]*href=["'][^"']+\.css(?:\?[^"']*)?["'][^>]*>/gi
  const baseRe = /<base\b[^>]*>/gi
  const scriptOpen = '<scr' + 'ipt'
  const scriptClose = '</scr' + 'ipt>'
  const scriptSrcRe = new RegExp(`${scriptOpen}\\b[^>]*\\bsrc=["'][^"']+["'][^>]*>${scriptClose}`, 'gi')
  return (html || '').replace(baseRe, '').replace(linkStylesRe, '').replace(linkCssRe, '').replace(scriptSrcRe, '')
}

function makeSrcdoc(html: string, css: string, js: string) {
  const styleTag = css ? `<style>${css}</style>` : ''
  const scriptTag = js ? `<scr` + `ipt>${js}</scr` + `ipt>` : ''
  let next = html || ''
  if (styleTag) {
    next = /<\/head>/i.test(next) ? next.replace(/<\/head>/i, `${styleTag}\n  </head>`) : `${styleTag}\n${next}`
  }
  if (scriptTag) {
    next = /<\/body>/i.test(next) ? next.replace(/<\/body>/i, `${scriptTag}\n  </body>`) : `${next}\n${scriptTag}`
  }
  return next
}
 
function buildStepSrcdoc(drafts: Partial<Record<FileId, string>>, mode: 'wireframe' | 'draft' | 'full' = 'draft') {
  const html = stripExternalIncludes(drafts['index.html'] || '')
  if (props.step === 'html') {
    const css = mode === 'full' ? fullCss.value : WIREFRAME_CSS
    return makeSrcdoc(html, css, '')
  }
  if (props.step === 'css') {
    const css = mode === 'full' ? fullCss.value : drafts['styles.css'] || ''
    return makeSrcdoc(html, css, '')
  }
  const css = mode === 'full' ? fullCss.value : drafts['styles.css'] || ''
  return makeSrcdoc(html, css, drafts['main.js'] || '')
}

const srcdocUser = computed(() => buildStepSrcdoc(effectiveDraftByFileId.value, props.step === 'html' ? 'wireframe' : 'draft'))
const srcdocDemo = computed(() => buildStepSrcdoc(defaultByFileId.value, 'full'))
const srcdocActive = computed(() => (isCombinedDemo.value ? srcdocDemo.value : srcdocUser.value))

const userFilesByFileId = computed<Record<FileId, string>>(() => {
  return isCombinedDemo.value ? defaultByFileId.value : effectiveDraftByFileId.value
})
 
const activeFileCode = computed(() => {
  const map = draftByFileId.value
  return map[activeFileId.value] || ''
})
 
const activeFileTitle = computed(() => {
  if (activeFileId.value === 'index.html') return isZh.value ? '文件：index.html（结构）' : 'File: index.html (structure)'
  if (activeFileId.value === 'styles.css') return isZh.value ? '文件：styles.css（样式）' : 'File: styles.css (style)'
  return isZh.value ? '文件：main.js（交互）' : 'File: main.js (interaction)'
})
 
const copiedId = ref<FileId | ''>('')
const copiedHint = ref('')
let copiedTimer = 0
 
function fallbackCopyText(text: string) {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', 'true')
  el.style.position = 'fixed'
  el.style.left = '-9999px'
  el.style.top = '0'
  document.body.appendChild(el)
  el.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(el)
  return ok
}

const copyToClipboard = async (id: FileId) => {
  const code = (userFilesByFileId.value as Record<string, string>)[id]
  if (!code) return
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code)
    } else {
      const ok = fallbackCopyText(code)
      if (!ok) throw new Error('copy_failed')
    }
    copiedId.value = id
    copiedHint.value = isZh.value ? '已复制到剪贴板' : 'Copied to clipboard'
  } catch {
    copiedId.value = id
    const ok = fallbackCopyText(code)
    copiedHint.value = ok ? (isZh.value ? '已复制到剪贴板' : 'Copied to clipboard') : (isZh.value ? '复制失败：请手动选择复制' : 'Copy failed: please select and copy manually')
  }
  if (copiedTimer) window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copiedTimer = 0
    copiedId.value = ''
    copiedHint.value = ''
  }, 1400)
}

const isPackaging = ref(false)

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const downloadZip = async () => {
  if (isPackaging.value) return
  isPackaging.value = true
  try {
    const zip = new JSZip()
    const files = userFilesByFileId.value
    for (const [name, content] of Object.entries(files)) {
      zip.file(name, content)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const date = new Date().toISOString().slice(0, 10)
    downloadBlob(blob, `sakura-mini-site-${props.lang}-${date}.zip`)
  } finally {
    isPackaging.value = false
  }
}

function downloadActiveFile() {
  const name = activeFileId.value
  const content = activeFileCode.value
  if (!content) return
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  downloadBlob(blob, name)
}

function resetFile(fileId: FileId) {
  const defaults = resetBaselineByFileId.value as Record<string, string>
  const next = defaults[fileId]
  if (typeof next !== 'string') return
  safeLocalStorage.removeItem(storageKey(fileId))
  if (fileId === 'index.html') indexHtmlDraft.value = next
  if (fileId === 'styles.css') stylesDraft.value = next
  if (fileId === 'main.js') jsDraft.value = next
  const preset = props.preset || 'demo'
  if (preset === 'blank') setSaveHint(isZh.value ? '已还原到脚手架模板' : 'Reset to scaffold template')
  else setSaveHint(isZh.value ? '已重置为示范默认' : 'Reset to demo default')
}

function resetActiveDraft() {
  resetFile(activeFileId.value)
}

function resetAllDrafts() {
  if (isCombinedEditor.value) {
    combinedDraft.value = combinedStarter.value
    safeLocalStorage.setItem(combinedStorageKey(), combinedDraft.value)
    setSaveHint(isZh.value ? '已还原到脚手架模板' : 'Reset to scaffold template')
    return
  }
  const ids = fileItems.value.map((f) => f.id)
  for (const id of ids) resetFile(id)
}

function fillWithDemo() {
  if (!isCombinedEditor.value) return
  combinedDraft.value = buildCombinedText(defaultByFileId.value, fileItems.value.map((f) => f.id))
  safeLocalStorage.setItem(combinedStorageKey(), combinedDraft.value)
  setSaveHint(isZh.value ? '已填入示范代码' : 'Filled with demo code')
}

const missingStylesLink = computed(() => {
  if (props.step === 'html') return false
  return !/href=["'](?:\.\/)?styles\.css["']/i.test((userFilesByFileId.value as any)['index.html'] || '')
})

const missingMainScript = computed(() => {
  if (props.step !== 'js') return false
  return !/src=["'](?:\.\/)?main\.js["']/i.test((userFilesByFileId.value as any)['index.html'] || '')
})

const upgradeHint = computed(() => {
  if (missingStylesLink.value && props.step !== 'html') return isZh.value ? '提示：你的 index.html 还没引用 styles.css（这一关要补齐）' : 'Tip: index.html is missing styles.css link'
  if (missingMainScript.value && props.step === 'js') return isZh.value ? '提示：你的 index.html 还没引用 main.js（这一关要补齐）' : 'Tip: index.html is missing main.js script'
  return ''
})

function insertBeforeHeadClose(html: string, injection: string) {
  const raw = html || ''
  if (/<\/head>/i.test(raw)) return raw.replace(/<\/head>/i, `${injection}\n  </head>`)
  return `${raw}\n${injection}`
}

function upgradeIndexForCss() {
  const html = ((userFilesByFileId.value as any)['index.html'] || '') as string
  if (!missingStylesLink.value) return
  const injection = '    <link rel="stylesheet" href="./styles.css" />'
  setEffectiveDraft('index.html', insertBeforeHeadClose(html, injection))
  setSaveHint(isZh.value ? '已补齐 styles.css 引用' : 'Inserted styles.css link')
}

function upgradeIndexForJs() {
  const html = ((userFilesByFileId.value as any)['index.html'] || '') as string
  if (!missingMainScript.value) return
  const scriptOpen = '<scr' + 'ipt'
  const scriptClose = '</scr' + 'ipt>'
  const injection = `    ${scriptOpen} defer src="./main.js">${scriptClose}`
  const next = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `\n${injection}\n  </body>`) : `${html}\n${injection}`
  setEffectiveDraft('index.html', next)
  setSaveHint(isZh.value ? '已补齐 main.js 引用' : 'Inserted main.js script')
}

watch(
  () => [props.lang, props.step, props.editor] as const,
  () => {
    loadAllDrafts()
  }
)

watch(
  () => fileItems.value.map((f) => f.id).join('|'),
  () => {
    const allowed = fileItems.value.map((f) => f.id)
    if (!allowed.includes(activeFileId.value)) activeFileId.value = allowed[0] ?? 'index.html'
  }
)

onBeforeUnmount(() => {
  if (copiedTimer) window.clearTimeout(copiedTimer)
  if (saveHintTimer) window.clearTimeout(saveHintTimer)
  if (combinedSaveTimer) window.clearTimeout(combinedSaveTimer)
  for (const t of Object.values(saveTimers)) {
    if (t) window.clearTimeout(t)
  }
})
</script>
