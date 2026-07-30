<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm grid place-items-center"
      @click="onOverlayClick"
    >
      <div
        ref="dialogRef"
        class="w-[min(760px,calc(100vw-28px))] rounded-[1.75rem] border border-white/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 shadow-[0_30px_120px_rgba(15,23,42,0.26)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
      >
        <div class="px-5 py-4 border-b border-white/60 dark:border-gray-700/60 flex items-center gap-3">
          <div class="font-extrabold text-gray-800 dark:text-gray-100">
            {{ title }}
          </div>
          <div class="ml-auto">
            <button
              ref="closeBtnRef"
              type="button"
              class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90"
              :title="lang === 'zh' ? '关闭' : 'Close'"
              @click.stop="$emit('close')"
            >
              ✕
            </button>
          </div>
        </div>
        <div class="p-5 text-sm text-gray-700 dark:text-gray-200 max-h-[min(80vh,720px)] overflow-y-auto">
          <div class="text-gray-600 dark:text-gray-300">
            {{ lang === 'zh' ? '这是 UI 壳子：只保留结构与动效占位，不实现真实业务逻辑。' : 'This is a UI shell: structure and motion placeholders only.' }}
          </div>
          <div v-if="kind === 'download'" class="mt-4 space-y-3">
            <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-4">
              <div class="font-extrabold text-gray-800 dark:text-gray-100">
                {{ lang === 'zh' ? '导出：可运行的 Vue 壳子 Starter' : 'Export: runnable Vue shell starter' }}
              </div>
              <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {{
                  lang === 'zh'
                    ? '会打包一个最小 Vite + Vue + Pinia + Tailwind 工程（只包含壳子：Sidebar/Header/RightPanel/Modal/Toast）。'
                    : 'Packages a minimal Vite + Vue + Pinia + Tailwind project (shell only: sidebar/header/right panel/modal/toast).'
                }}
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[var(--primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--primary-500)]/20 hover:opacity-90 disabled:opacity-60"
                  :disabled="isPackaging"
                  @click="downloadStarterZip"
                >
                  {{ isPackaging ? (lang === 'zh' ? '正在打包…' : 'Packaging…') : (lang === 'zh' ? '下载 zip' : 'Download zip') }}
                </button>
                <button
                  type="button"
                  class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
                  @click="copyCommands"
                >
                  {{ lang === 'zh' ? '复制启动命令' : 'Copy run commands' }}
                </button>
              </div>
            </div>
            <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-4">
              <div class="font-extrabold text-gray-800 dark:text-gray-100">
                {{ lang === 'zh' ? 'Starter 文件（可复制）' : 'Starter files (copyable)' }}
              </div>
              <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {{
                  lang === 'zh'
                    ? '这是“真正要保存的工程文件”，不是放到沙盒里渲染。你可以按“新增/替换清单”把它们落到本地项目。'
                    : 'These are real project files (not rendered in the sandbox). Apply them to your local project via the add/replace checklist.'
                }}
              </div>

              <div class="mt-4 space-y-3">
                <ShellCodeBlock
                  :lang="lang"
                  :title="lang === 'zh' ? '新增/替换清单（从三件套迁移到 Vue 工程）' : 'Add/replace checklist (migrate from 3-file to Vue)'"
                  :content="addReplaceChecklist"
                  :collapsed-lines="30"
                />

                <ShellCodeBlock :lang="lang" title="package.json" language="json" :content="starterFilesMap['package.json']" :collapsed-lines="22" />
                <ShellCodeBlock :lang="lang" title="tsconfig.json" language="json" :content="starterFilesMap['tsconfig.json']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="vite.config.ts" language="typescript" :content="starterFilesMap['vite.config.ts']" :collapsed-lines="18" />
                <ShellCodeBlock :lang="lang" title="tailwind.config.cjs" language="javascript" :content="starterFilesMap['tailwind.config.cjs']" :collapsed-lines="22" />
                <ShellCodeBlock :lang="lang" title="postcss.config.cjs" language="javascript" :content="starterFilesMap['postcss.config.cjs']" :collapsed-lines="18" />
                <ShellCodeBlock :lang="lang" title="index.html" language="html" :content="starterFilesMap['index.html']" :collapsed-lines="20" />
                <ShellCodeBlock :lang="lang" title="src/env.d.ts" language="typescript" :content="starterFilesMap['src/env.d.ts']" :collapsed-lines="18" />
                <ShellCodeBlock :lang="lang" title="src/index.css" language="css" :content="starterFilesMap['src/index.css']" :collapsed-lines="12" />
                <ShellCodeBlock :lang="lang" title="src/main.ts" language="typescript" :content="starterFilesMap['src/main.ts']" :collapsed-lines="20" />
                <ShellCodeBlock :lang="lang" title="src/App.vue" language="html" :content="starterFilesMap['src/App.vue']" :collapsed-lines="26" />

                <ShellCodeBlock :lang="lang" title="src/site-shell/shellStore.ts" language="typescript" :content="starterFilesMap['src/site-shell/shellStore.ts']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellApp.vue" language="html" :content="starterFilesMap['src/site-shell/ShellApp.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellLayout.vue" language="html" :content="starterFilesMap['src/site-shell/ShellLayout.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellHeader.vue" language="html" :content="starterFilesMap['src/site-shell/ShellHeader.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellSidebar.vue" language="html" :content="starterFilesMap['src/site-shell/ShellSidebar.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellRightPanel.vue" language="html" :content="starterFilesMap['src/site-shell/ShellRightPanel.vue']" :collapsed-lines="24" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellModalHost.vue" language="html" :content="starterFilesMap['src/site-shell/ShellModalHost.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellToastHost.vue" language="html" :content="starterFilesMap['src/site-shell/ShellToastHost.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellCodeBlock.vue" language="html" :content="starterFilesMap['src/site-shell/ShellCodeBlock.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellBuildGuide.vue" language="html" :content="starterFilesMap['src/site-shell/ShellBuildGuide.vue']" :collapsed-lines="26" />
                <ShellCodeBlock :lang="lang" title="src/site-shell/ShellSourceGuide.vue" language="html" :content="starterFilesMap['src/site-shell/ShellSourceGuide.vue']" :collapsed-lines="26" />
              </div>
            </div>
          </div>
          <ul v-else class="mt-4 space-y-3">
            <li
              v-for="(it, idx) in items"
              :key="idx"
              class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-4"
            >
              {{ it }}
            </li>
          </ul>
          <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {{ lang === 'zh' ? '快捷键：Esc 关闭' : 'Shortcut: Esc to close' }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import ShellCodeBlock from './ShellCodeBlock.vue'
import { useSiteBuildShellStore, type ShellModalKind } from './shellStore'

const props = defineProps<{
  lang: 'en' | 'zh'
  open: boolean
  kind: ShellModalKind | null
}>()

const store = useSiteBuildShellStore()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const MODAL_META: Record<
  ShellModalKind,
  {
    titleZh: string
    titleEn: string
    itemsZh: string[]
    itemsEn: string[]
  }
> = {
  search: {
    titleZh: '搜索（占位）',
    titleEn: 'Search (placeholder)',
    itemsZh: ['输入框 + 结果列表（占位条）', '支持从侧边栏/顶栏打开', '后续再接真实搜索索引'],
    itemsEn: ['Input + placeholder result list', 'Open from sidebar/header', 'Connect real search later']
  },
  settings: {
    titleZh: '设置（占位）',
    titleEn: 'Settings (placeholder)',
    itemsZh: ['主题/动效/字体（占位）', '按钮与布局对齐真实站点', '后续再接真实配置与持久化'],
    itemsEn: ['Theme/motion/font (placeholder)', 'Buttons/layout match real site', 'Connect real settings later']
  },
  music: {
    titleZh: '音乐（占位）',
    titleEn: 'Music (placeholder)',
    itemsZh: ['播放/暂停（占位）', '歌单（占位）'],
    itemsEn: ['Play/pause (placeholder)', 'Playlist (placeholder)']
  },
  download: {
    titleZh: '下载（导出）',
    titleEn: 'Download (export)',
    itemsZh: [],
    itemsEn: []
  }
}

const title = computed(() => {
  const zh = props.lang === 'zh'
  if (props.kind) {
    const meta = MODAL_META[props.kind]
    return zh ? meta.titleZh : meta.titleEn
  }
  return zh ? '弹窗' : 'Modal'
})

const kind = computed(() => props.kind)

const items = computed(() => {
  const zh = props.lang === 'zh'
  if (props.kind) {
    const meta = MODAL_META[props.kind]
    return zh ? meta.itemsZh : meta.itemsEn
  }
  return zh ? ['占位项'] : ['Placeholder']
})

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

const dialogRef = ref<HTMLElement | null>(null)
const closeBtnRef = ref<HTMLButtonElement | null>(null)

let cleanup: (() => void) | null = null
let restoreFocusEl: HTMLElement | null = null
let prevOverflow: string | null = null

const isPackaging = ref(false)

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1200)
}

function starterFiles() {
  const pkg = {
    name: 'site-shell-starter',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      typecheck: 'vue-tsc --noEmit'
    },
    dependencies: {
      pinia: '^3.0.0',
      vue: '^3.5.13'
    },
    devDependencies: {
      '@vitejs/plugin-vue': '^4.2.3',
      autoprefixer: '^10.4.24',
      postcss: '^8.5.6',
      tailwindcss: '^3.4.19',
      typescript: '^5.4.0',
      vite: '^4.4.5',
      'vue-tsc': '^2.0.6'
    }
  }

  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      module: 'ESNext',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      skipLibCheck: true,
      moduleResolution: 'Bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'preserve',
      strict: true,
      types: ['vite/client']
    },
    include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue']
  }

  const viteConfig = [
    "import { defineConfig } from 'vite'",
    "import vue from '@vitejs/plugin-vue'",
    '',
    'export default defineConfig({',
    '  plugins: [vue()],',
    "  base: './'",
    '})',
    ''
  ].join('\n')

  const CLOSE_SCRIPT_TAG = '</scr' + 'ipt>'
  const ENTRY_SCRIPT_TAG = '<scr' + 'ipt type="module" src="/src/main.ts"></scr' + 'ipt>'

  const indexHtml = [
    '<!doctype html>',
    '<html lang="zh-CN">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '    <title>Site Shell Starter</title>',
    '  </head>',
    '  <body>',
    '    <div id="app"></div>',
    ENTRY_SCRIPT_TAG,
    '  </body>',
    '</html>',
    ''
  ].join('\n')

  const tailwindConfigCjs = [
    'module.exports = {',
    "  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],",
    '  theme: {',
    '    extend: {}',
    '  },',
    '  plugins: []',
    '}',
    ''
  ].join('\n')

  const postcssConfigCjs = [
    'module.exports = {',
    '  plugins: {',
    '    tailwindcss: {},',
    '    autoprefixer: {}',
    '  }',
    '}',
    ''
  ].join('\n')

  const indexCss = ['@tailwind base;', '@tailwind components;', '@tailwind utilities;', ''].join('\n')

  const envDts = ["declare module '*.vue' {", '  import type { DefineComponent } from \'vue\'', '  const component: DefineComponent<{}, {}, any>', '  export default component', '}', ''].join('\n')

  const mainTs = [
    "import { createApp } from 'vue'",
    "import { createPinia } from 'pinia'",
    "import App from './App.vue'",
    "import './index.css'",
    '',
    'createApp(App).use(createPinia()).mount("#app")',
    ''
  ].join('\n')

  const appVue = [
    '<template>',
    '  <div class="min-h-screen p-6">',
    '    <ShellApp lang="zh" />',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import ShellApp from './site-shell/ShellApp.vue'",
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellStoreTs = [
    "import { defineStore } from 'pinia'",
    "import { computed, ref } from 'vue'",
    '',
    "export type ShellTool = 'build' | 'source-code'",
    "export type ShellModalKind = 'search' | 'settings' | 'music' | 'download'",
    '',
    'export type ShellAction =',
    "  | { type: 'toggle-sidebar' }",
    "  | { type: 'toggle-right-sidebar' }",
    "  | { type: 'toggle-theme' }",
    "  | { type: 'select-tool'; tool: ShellTool }",
    "  | { type: 'open-modal'; kind: ShellModalKind }",
    "  | { type: 'close-modal' }",
    '',
    "export const useSiteShellStore = defineStore('site-shell-starter', () => {",
    '  const isDark = ref(false)',
    '  const sidebarOpen = ref(true)',
    '  const rightSidebarOpen = ref(false)',
    "  const currentTool = ref<ShellTool>('build')",
    '  const toastMessage = ref("")',
    '  const activeModal = ref<ShellModalKind | null>(null)',
    '  const modalOpen = computed(() => activeModal.value != null)',
    '',
    '  function toggleTheme() {',
    '    isDark.value = !isDark.value',
    '  }',
    '',
    '  function toggleSidebar() {',
    '    sidebarOpen.value = !sidebarOpen.value',
    '  }',
    '',
    '  function toggleRightSidebar() {',
    '    rightSidebarOpen.value = !rightSidebarOpen.value',
    '  }',
    '',
    '  function selectTool(tool: ShellTool) {',
    '    currentTool.value = tool',
    '  }',
    '',
    '  function openModal(kind: ShellModalKind) {',
    '    activeModal.value = kind',
    '  }',
    '',
    '  function closeModal() {',
    '    activeModal.value = null',
    '  }',
    '',
    '  function showToast(message: string, duration = 2400) {',
    '    const captured = message',
    '    toastMessage.value = message',
    '    window.setTimeout(() => {',
    '      if (toastMessage.value === captured) toastMessage.value = ""',
    '    }, duration)',
    '  }',
    '',
    '  return {',
    '    isDark,',
    '    sidebarOpen,',
    '    rightSidebarOpen,',
    '    currentTool,',
    '    toastMessage,',
    '    activeModal,',
    '    modalOpen,',
    '    toggleTheme,',
    '    toggleSidebar,',
    '    toggleRightSidebar,',
    '    selectTool,',
    '    openModal,',
    '    closeModal,',
    '    showToast',
    '  }',
    '})',
    ''
  ].join('\n')

  const shellLayoutVue = [
    '<template>',
    '  <div',
    '    class="max-w-6xl mx-auto rounded-[2rem] border border-white/30 dark:border-gray-800/60 shadow-[0_12px_60px_rgba(15,23,42,0.12)] overflow-hidden bg-gradient-to-br from-white/70 via-[var(--primary-50)]/50 to-purple-50/40 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-[var(--primary-900)]/40 backdrop-blur-[3px]"',
    "    :class=\"isDark ? 'dark' : ''\"",
    '  >',
    '    <div class="relative h-[min(720px,calc(100vh-120px))] min-h-[560px] flex">',
    '      <div class="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#9f123f 1px, transparent 1px); background-size: 32px 32px;"></div>',
    '      <div class="absolute -top-[18%] -right-[12%] w-[780px] h-[780px] rounded-full bg-gradient-to-br from-[var(--primary-100)]/40 to-purple-100/30 dark:from-[var(--primary-900)]/10 dark:to-purple-900/10 blur-3xl opacity-60"></div>',
    '      <div class="absolute top-[30%] -left-[12%] w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-[var(--primary-200)]/30 to-[var(--primary-50)]/20 dark:from-[var(--primary-800)]/10 dark:to-[var(--primary-900)]/5 blur-3xl opacity-50"></div>',
    '',
    '      <div class="transition-all duration-300 flex-shrink-0" :class="sidebarOpen ? \'w-72 lg:w-80 opacity-100\' : \'w-0 opacity-0 overflow-hidden pointer-events-none\'">',
    '        <ShellSidebar :lang="lang" :current-tool="currentTool" @action="$emit(\'action\', $event)" />',
    '      </div>',
    '',
    '      <main class="flex-1 min-w-0 flex flex-col overflow-hidden relative isolate">',
    '        <ShellHeader :lang="lang" :sidebar-open="sidebarOpen" :right-sidebar-open="rightSidebarOpen" :is-dark="isDark" :current-tool="currentTool" @action="$emit(\'action\', $event)" />',
    '        <div class="flex-1 flex overflow-hidden">',
    '          <div class="flex-1 min-w-0 overflow-y-auto custom-scrollbar">',
    '            <div class="p-5"><slot /></div>',
    '          </div>',
    '          <div class="hidden md:block transition-all duration-300" :class="rightSidebarOpen ? \'w-[320px] lg:w-[360px] opacity-100\' : \'w-0 opacity-0 overflow-hidden pointer-events-none\'">',
    '            <ShellRightPanel :lang="lang" @close="$emit(\'action\', { type: \'toggle-right-sidebar\' })" />',
    '          </div>',
    '        </div>',
    '      </main>',
    '    </div>',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import ShellHeader from './ShellHeader.vue'",
    "import ShellRightPanel from './ShellRightPanel.vue'",
    "import ShellSidebar from './ShellSidebar.vue'",
    "import type { ShellAction, ShellTool } from './shellStore'",
    '',
    'defineProps<{',
    "  lang: 'en' | 'zh'",
    '  isDark: boolean',
    '  sidebarOpen: boolean',
    '  rightSidebarOpen: boolean',
    '  currentTool: ShellTool',
    '}>()',
    '',
    'defineEmits<{',
    "  (e: 'action', action: ShellAction): void",
    '}>()',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellHeaderVue = [
    '<template>',
    '  <header class="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/60 dark:border-gray-800/60 shrink-0 z-20 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-colors duration-300">',
    '    <div class="h-16 px-6 flex items-center justify-between">',
    '      <button type="button" class="mr-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-50)] dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors" :title="lang === \'zh\' ? \'切换侧边栏\' : \'Toggle Sidebar\'" @click="$emit(\'action\', { type: \'toggle-sidebar\' })">',
    '        <span class="text-sm">{{ sidebarOpen ? \'◀\' : \'▶\' }}</span>',
    '      </button>',
    '',
    '      <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap flex-1 mr-4 py-2">',
    '        <span class="text-[var(--primary-300)] dark:text-[var(--primary-500)] mr-2 shrink-0">🏠</span>',
    '        <span class="px-2 py-1 rounded-md font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/30" aria-current="page">',
    '          {{ currentTool === \'build\' ? (lang === \'zh\' ? \'构建\' : \'Build\') : (lang === \'zh\' ? \'源码\' : \'Source\') }}',
    '        </span>',
    '      </div>',
    '',
    '      <div class="flex items-center gap-2">',
    '        <button type="button" class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90" :title="lang === \'zh\' ? \'搜索\' : \'Search\'" @click="$emit(\'action\', { type: \'open-modal\', kind: \'search\' })">🔍</button>',
    '        <button type="button" class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90" :title="lang === \'zh\' ? \'切换主题\' : \'Toggle theme\'" @click="$emit(\'action\', { type: \'toggle-theme\' })">{{ isDark ? \'☀️\' : \'🌙\' }}</button>',
    '        <button type="button" class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90" :title="lang === \'zh\' ? \'下载\' : \'Download\'" @click="$emit(\'action\', { type: \'open-modal\', kind: \'download\' })">⬇️</button>',
    '        <button type="button" class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90" :title="lang === \'zh\' ? \'右侧面板\' : \'Right panel\'" @click="$emit(\'action\', { type: \'toggle-right-sidebar\' })">{{ rightSidebarOpen ? \'✕\' : \'➜\' }}</button>',
    '      </div>',
    '    </div>',
    '  </header>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import type { ShellAction, ShellModalKind, ShellTool } from './shellStore'",
    '',
    'defineProps<{',
    "  lang: 'en' | 'zh'",
    '  sidebarOpen: boolean',
    '  rightSidebarOpen: boolean',
    '  isDark: boolean',
    '  currentTool: ShellTool',
    '}>()',
    '',
    'defineEmits<{',
    "  (e: 'action', action: ShellAction | { type: 'open-modal'; kind: ShellModalKind }): void",
    '}>()',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellSidebarVue = [
    '<template>',
    '  <aside class="w-full flex-shrink-0 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-white/60 dark:border-gray-700/50 h-full z-30 transition-all duration-300 ease-out">',
    '    <div class="p-6 pb-4 flex flex-col border-b border-white/60 dark:border-gray-700/50 flex-shrink-0">',
    '      <div class="flex justify-end items-center mb-4">',
    '        <button type="button" class="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 shadow-sm inline-flex items-center justify-center transition-colors text-gray-700 dark:text-gray-200 hover:opacity-90" @click="$emit(\'action\', { type: \'toggle-sidebar\' })">',
    '          <span class="text-sm">‹</span>',
    '        </button>',
    '      </div>',
    '      <div class="flex items-center gap-3">',
    '        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary-100)] to-purple-100 dark:from-[var(--primary-900)]/40 dark:to-purple-900/30 border-4 border-white dark:border-gray-800 shadow-xl grid place-items-center">',
    '          <span class="text-xl">🌸</span>',
    '        </div>',
    '        <div class="flex flex-col flex-1">',
    '          <div class="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">Sakura Notes</div>',
    '          <div class="text-xs mt-0.5 font-medium px-2 py-0.5 rounded-full bg-[var(--primary-50)]/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200">',
    "            {{ lang === 'zh' ? '站点 UI 空壳（Starter）' : 'UI Shell (Starter)' }}",
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '',
    '    <div class="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">',
    '      <div class="px-2 mb-4 space-y-4 mt-4">',
    '        <div>',
    "          <div class=\"text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 pl-1\">🧰 {{ lang === 'zh' ? '工具' : 'Tools' }}</div>",
    '          <div class="space-y-2">',
    '            <button type="button" class="w-full text-left p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all flex items-center gap-3" :class="currentTool === \'build\' ? \'border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/60 dark:bg-indigo-900/20\' : \'border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 hover:bg-white dark:hover:bg-gray-800\'" @click="$emit(\'action\', { type: \'select-tool\', tool: \'build\' })">',
    '              <span class="text-xl">📦</span>',
    '              <div class="flex-1">',
    "                <div class=\"text-sm font-bold text-indigo-900 dark:text-indigo-200\">{{ lang === 'zh' ? '项目构建' : 'Build' }}</div>",
    "                <div class=\"text-[10px] text-indigo-600 dark:text-indigo-300\">{{ lang === 'zh' ? '如何跑起来与构建产物' : 'Run and build dist' }}</div>",
    '              </div>',
    '            </button>',
    '            <button type="button" class="w-full text-left p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all flex items-center gap-3" :class="currentTool === \'source-code\' ? \'border-green-200 dark:border-green-800/40 bg-green-50/60 dark:bg-green-900/20\' : \'border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 hover:bg-white dark:hover:bg-gray-800\'" @click="$emit(\'action\', { type: \'select-tool\', tool: \'source-code\' })">',
    '              <span class="text-xl">💻</span>',
    '              <div class="flex-1">',
    "                <div class=\"text-sm font-bold text-green-900 dark:text-green-200\">{{ lang === 'zh' ? '源码导览' : 'Source' }}</div>",
    "                <div class=\"text-[10px] text-green-600 dark:text-green-300\">{{ lang === 'zh' ? '状态 -> 布局 -> 交互' : 'State -> layout -> interactions' }}</div>",
    '              </div>',
    '            </button>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '',
    '    <div class="p-4 border-t border-white/60 dark:border-gray-700/50 flex flex-wrap gap-2">',
    '      <button type="button" class="text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold hover:opacity-90" @click="$emit(\'action\', { type: \'open-modal\', kind: \'search\' })">🔎 {{ lang === \'zh\' ? \'搜索\' : \'Search\' }}</button>',
    '      <button type="button" class="text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold hover:opacity-90" @click="$emit(\'action\', { type: \'open-modal\', kind: \'download\' })">⬇️ {{ lang === \'zh\' ? \'下载\' : \'Download\' }}</button>',
    '      <button type="button" class="text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold hover:opacity-90" @click="$emit(\'action\', { type: \'open-modal\', kind: \'settings\' })">⚙️ {{ lang === \'zh\' ? \'设置\' : \'Settings\' }}</button>',
    '    </div>',
    '  </aside>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import type { ShellAction, ShellTool } from './shellStore'",
    '',
    'defineProps<{',
    "  lang: 'en' | 'zh'",
    '  currentTool: ShellTool',
    '}>()',
    '',
    'defineEmits<{',
    "  (e: 'action', action: ShellAction): void",
    '}>()',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellRightPanelVue = [
    '<template>',
    '  <aside class="h-full border-l border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl p-4">',
    '    <div class="flex items-center justify-between">',
    "      <div class=\"text-sm font-extrabold text-gray-800 dark:text-gray-100\">{{ lang === 'zh' ? '右侧面板' : 'Right panel' }}</div>",
    '      <button type="button" class="text-xs px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold hover:opacity-90" @click="$emit(\'close\')">✕</button>',
    '    </div>',
    "    <div class=\"mt-3 text-xs text-gray-600 dark:text-gray-300\">{{ lang === 'zh' ? '这里保持壳子结构，具体内容留空即可。' : 'Keep the shell structure; leave contents empty.' }}</div>",
    '  </aside>',
    '</template>',
    '',
    '<script setup lang="ts">',
    'defineProps<{',
    "  lang: 'en' | 'zh'",
    '}>()',
    'defineEmits<{',
    "  (e: 'close'): void",
    '}>()',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellToastHostVue = [
    '<template>',
    '  <Teleport to="body">',
    '    <div v-if="message" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">',
    '      <button type="button" class="px-4 py-3 rounded-2xl bg-black/70 text-white text-xs font-extrabold shadow-lg border border-white/10 hover:opacity-90" @click="$emit(\'close\')">',
    '        {{ message }}',
    '      </button>',
    '    </div>',
    '  </Teleport>',
    '</template>',
    '',
    '<script setup lang="ts">',
    'defineProps<{',
    "  lang: 'en' | 'zh'",
    '  message: string',
    '}>()',
    'defineEmits<{',
    "  (e: 'close'): void",
    '}>()',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellCodeBlockVue = [
    '<template>',
    '  <section class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-[#0b1220] text-slate-100 overflow-hidden">',
    '    <div class="px-4 py-3 border-b border-white/10 flex items-center gap-3">',
    '      <div class="text-xs font-extrabold text-slate-200">{{ title }}</div>',
    '      <div class="text-[11px] text-slate-400">{{ metricsText }}</div>',
    '      <div class="ml-auto flex items-center gap-2">',
    '        <button type="button" class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-white/10 hover:bg-white/15 border border-white/10" @click="toggleExpanded">',
    "          {{ expanded ? (lang === 'zh' ? '收起' : 'Collapse') : (lang === 'zh' ? '展开' : 'Expand') }}",
    '        </button>',
    '        <button type="button" class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-white/10 hover:bg-white/15 border border-white/10" @click="copy">',
    "          {{ lang === 'zh' ? '复制' : 'Copy' }}",
    '        </button>',
    '      </div>',
    '    </div>',
    '    <pre class="p-4 text-[12px] leading-relaxed overflow-x-auto"><code>{{ displayed }}</code></pre>',
    '  </section>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import { computed, ref } from 'vue'",
    "import { useSiteShellStore } from './shellStore'",
    '',
    'const props = defineProps<{',
    "  lang: 'en' | 'zh'",
    '  title: string',
    '  content: string',
    '  collapsedLines?: number',
    '}>()',
    '',
    'const store = useSiteShellStore()',
    'const expanded = ref(false)',
    'const lines = computed(() => String(props.content || "").replace(/\\r\\n/g, "\\n").split("\\n"))',
    'const collapsedLines = computed(() => {',
    '  const n = Number(props.collapsedLines ?? 26)',
    '  return Number.isFinite(n) && n > 6 ? Math.floor(n) : 26',
    '})',
    'const metricsText = computed(() => {',
    '  const lineCount = lines.value.length',
    '  const chars = String(props.content || "").length',
    '  const kb = Math.max(0.1, chars / 1024)',
    "  return props.lang === 'zh' ? `${lineCount} 行 · ${kb.toFixed(1)} KB` : `${lineCount} lines · ${kb.toFixed(1)} KB`",
    '})',
    'const displayed = computed(() => {',
    '  if (expanded.value) return props.content',
    '  const n = collapsedLines.value',
    '  if (lines.value.length <= n) return props.content',
    '  const head = lines.value.slice(0, n).join("\\n")',
    '  const rest = lines.value.length - n',
    "  const tail = props.lang === 'zh' ? `\\n\\n…（已折叠 ${rest} 行）` : `\\n\\n…(${rest} lines collapsed)`",
    '  return `${head}${tail}`',
    '})',
    'function toggleExpanded() {',
    '  expanded.value = !expanded.value',
    '}',
    'async function copy() {',
    '  try {',
    '    await navigator.clipboard.writeText(props.content)',
    "    store.showToast(props.lang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard')",
    '  } catch {',
    "    store.showToast(props.lang === 'zh' ? '复制失败（浏览器可能禁止）' : 'Copy failed (blocked by browser)')",
    '  }',
    '}',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellBuildGuideVue = [
    '<template>',
    '  <section class="rounded-[1.6rem] border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.12)] overflow-hidden">',
    '    <div class="p-6 border-b border-white/60 dark:border-gray-700/60">',
    '      <div class="text-xs font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] tracking-wide">{{ lang === \'zh\' ? \'项目构建（Starter）\' : \'Build (Starter)\' }}</div>',
    '      <div class="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">{{ lang === \'zh\' ? \'先跑起来，再迭代\' : \'Run first, iterate later\' }}</div>',
    "      <div class=\"text-sm text-gray-600 dark:text-gray-300 mt-2\">{{ lang === 'zh' ? '这份 starter 已经接好 Tailwind 与 Pinia，你只需要 npm i 后运行即可。' : 'Tailwind and Pinia are already wired; just npm i and run.' }}</div>",
    '    </div>',
    '    <div class="p-6 space-y-4">',
    '      <ShellCodeBlock :lang="lang" :title="lang === \'zh\' ? \'命令\' : \'Commands\'" :content="commands" :collapsed-lines="16" />',
    '      <ShellCodeBlock :lang="lang" :title="lang === \'zh\' ? \'下一步\' : \'Next steps\'" :content="nextSteps" :collapsed-lines="24" />',
    '    </div>',
    '  </section>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import { computed } from 'vue'",
    "import ShellCodeBlock from './ShellCodeBlock.vue'",
    '',
    'const props = defineProps<{',
    "  lang: 'en' | 'zh'",
    '}>()',
    '',
    'const lang = computed(() => props.lang)',
    'const commands = computed(() => [\'npm i\', \'npm run dev\', \'\', \'npm run build\', \'npm run preview\'].join(\"\\n\"))',
    'const nextSteps = computed(() => {',
    "  if (lang.value === 'zh') {",
    '    return [',
    '      \'1) 先读 src/site-shell/shellStore.ts：状态在哪里\',',
    '      \'2) 再看 ShellLayout.vue：布局怎么拼起来\',',
    '      \'3) 最后看 ShellApp.vue：action 如何统一分发\',',
    '      \'\',',
    '      \'想更像真实项目：把 open-modal(kind) 拆成 open-search/open-settings/open-download 等显式意图。\'',
    '    ].join(\"\\n\")',
    '  }',
    '  return [',
    '    \'1) Read src/site-shell/shellStore.ts: where state lives\',',
    '    \'2) Then ShellLayout.vue: how layout is composed\',',
    '    \'3) Finally ShellApp.vue: centralized action dispatcher\',',
    '    \'\',',
    '    \'To get closer to real projects: split open-modal(kind) into explicit intents.\'',
    '  ].join(\"\\n\")',
    '})',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellSourceGuideVue = [
    '<template>',
    '  <section class="rounded-[1.6rem] border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.12)] overflow-hidden">',
    '    <div class="p-6 border-b border-white/60 dark:border-gray-700/60">',
    '      <div class="text-xs font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] tracking-wide">{{ lang === \'zh\' ? \'源码视角\' : \'Source view\' }}</div>',
    "      <div class=\"text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-1\">{{ lang === 'zh' ? '按顺序读：状态 → 布局 → 交互' : 'Read: state → layout → interaction' }}</div>",
    '      <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">{{ lang === \'zh\' ? \'这份 starter 的目标是让你学会“壳子工程怎么组织”，不是做业务功能。\' : \'This starter teaches shell architecture, not business features.\' }}</div>',
    '    </div>',
    '    <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">',
    '      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">',
    "        <div class=\"text-xs font-extrabold text-gray-500 dark:text-gray-400\">{{ lang === 'zh' ? '① 状态（Pinia）' : '1) State (Pinia)' }}</div>",
    '        <div class="mt-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">shellStore.ts</div>',
    "        <button type=\"button\" class=\"mt-3 px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90\" @click=\"copy('src/site-shell/shellStore.ts')\">{{ lang === 'zh' ? '复制路径' : 'Copy path' }}</button>",
    '      </div>',
    '      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">',
    "        <div class=\"text-xs font-extrabold text-gray-500 dark:text-gray-400\">{{ lang === 'zh' ? '② 布局（Slot）' : '2) Layout (Slot)' }}</div>",
    '        <div class="mt-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">ShellLayout.vue</div>',
    "        <button type=\"button\" class=\"mt-3 px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90\" @click=\"copy('src/site-shell/ShellLayout.vue')\">{{ lang === 'zh' ? '复制路径' : 'Copy path' }}</button>",
    '      </div>',
    '      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">',
    "        <div class=\"text-xs font-extrabold text-gray-500 dark:text-gray-400\">{{ lang === 'zh' ? '③ 交互（Action 分发）' : '3) Interaction (Dispatcher)' }}</div>",
    '        <div class="mt-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">ShellApp.vue</div>',
    "        <button type=\"button\" class=\"mt-3 px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90\" @click=\"copy('src/site-shell/ShellApp.vue')\">{{ lang === 'zh' ? '复制路径' : 'Copy path' }}</button>",
    '      </div>',
    '    </div>',
    '  </section>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import { computed } from 'vue'",
    "import { useSiteShellStore } from './shellStore'",
    '',
    'const props = defineProps<{',
    "  lang: 'en' | 'zh'",
    '}>()',
    '',
    'const lang = computed(() => props.lang)',
    'const store = useSiteShellStore()',
    'async function copy(text: string) {',
    '  try {',
    '    await navigator.clipboard.writeText(text)',
    "    store.showToast(lang.value === 'zh' ? '已复制路径' : 'Path copied')",
    '  } catch {',
    "    store.showToast(lang.value === 'zh' ? '复制失败（浏览器可能禁止）' : 'Copy failed (blocked by browser)')",
    '  }',
    '}',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellModalHostVue = [
    '<template>',
    '  <Teleport to="body">',
    '    <div v-if="open" class="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm grid place-items-center" @click="onOverlayClick">',
    '      <div class="w-[min(760px,calc(100vw-28px))] rounded-[1.75rem] border border-white/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 shadow-[0_30px_120px_rgba(15,23,42,0.26)] overflow-hidden" role="dialog" aria-modal="true" :aria-label="title">',
    '        <div class="px-5 py-4 border-b border-white/60 dark:border-gray-700/60 flex items-center gap-3">',
    '          <div class="font-extrabold text-gray-800 dark:text-gray-100">{{ title }}</div>',
    '          <div class="ml-auto">',
    "            <button type=\"button\" class=\"w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 text-gray-600 dark:text-gray-200 font-extrabold hover:opacity-90\" :title=\"lang === 'zh' ? '关闭' : 'Close'\" @click.stop=\"$emit('close')\">✕</button>",
    '          </div>',
    '        </div>',
    '        <div class="p-5 text-sm text-gray-700 dark:text-gray-200">',
    "          <div class=\"text-gray-600 dark:text-gray-300\">{{ lang === 'zh' ? '这是壳子弹窗：保持结构即可。' : 'Shell modal: keep structure only.' }}</div>",
    "          <div class=\"mt-4 text-xs text-gray-500 dark:text-gray-400\">{{ lang === 'zh' ? '快捷键：Esc 关闭' : 'Shortcut: Esc to close' }}</div>",
    '        </div>',
    '      </div>',
    '    </div>',
    '  </Teleport>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import { computed, onMounted, onUnmounted } from 'vue'",
    '',
    'const props = defineProps<{',
    "  lang: 'en' | 'zh'",
    '  open: boolean',
    "  kind: 'search' | 'settings' | 'music' | 'download' | null",
    '}>()',
    '',
    'defineEmits<{',
    "  (e: 'close'): void",
    '}>()',
    '',
    'const title = computed(() => {',
    "  if (props.lang === 'zh') {",
    "    if (props.kind === 'search') return '搜索（占位）'",
    "    if (props.kind === 'settings') return '设置（占位）'",
    "    if (props.kind === 'music') return '音乐（占位）'",
    "    if (props.kind === 'download') return '下载（占位）'",
    "    return '弹窗'",
    '  }',
    "  if (props.kind === 'search') return 'Search (placeholder)'",
    "  if (props.kind === 'settings') return 'Settings (placeholder)'",
    "  if (props.kind === 'music') return 'Music (placeholder)'",
    "  if (props.kind === 'download') return 'Download (placeholder)'",
    "  return 'Modal'",
    '})',
    '',
    'function onOverlayClick(e: MouseEvent) {',
    '  if (e.target === e.currentTarget) (e.currentTarget as HTMLElement).dispatchEvent(new Event("close"))',
    '}',
    '',
    'function onKey(e: KeyboardEvent) {',
    "  if (e.key === 'Escape') {",
    '    e.preventDefault()',
    '    window.dispatchEvent(new Event("shell-modal-close"))',
    '  }',
    '}',
    '',
    'onMounted(() => window.addEventListener("keydown", onKey))',
    'onUnmounted(() => window.removeEventListener("keydown", onKey))',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  const shellAppVue = [
    '<template>',
    '  <div>',
    '    <ShellLayout',
    '      :lang="lang"',
    '      :is-dark="store.isDark"',
    '      :sidebar-open="store.sidebarOpen"',
    '      :right-sidebar-open="store.rightSidebarOpen"',
    '      :current-tool="store.currentTool"',
    '      @action="handleAction"',
    '    >',
    '      <ShellBuildGuide v-if="store.currentTool === \'build\'" :lang="lang" />',
    '      <ShellSourceGuide v-else :lang="lang" />',
    '    </ShellLayout>',
    '',
    '    <ShellModalHost :lang="lang" :open="store.modalOpen" :kind="store.activeModal" @close="store.closeModal()" />',
    '    <ShellToastHost :lang="lang" :message="store.toastMessage" @close="store.toastMessage = \'\'" />',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "import { computed, onMounted, onUnmounted } from 'vue'",
    "import ShellBuildGuide from './ShellBuildGuide.vue'",
    "import ShellLayout from './ShellLayout.vue'",
    "import ShellModalHost from './ShellModalHost.vue'",
    "import ShellSourceGuide from './ShellSourceGuide.vue'",
    "import ShellToastHost from './ShellToastHost.vue'",
    "import { useSiteShellStore, type ShellAction } from './shellStore'",
    '',
    'const props = defineProps<{',
    "  lang: 'en' | 'zh'",
    '}>()',
    '',
    'const lang = computed(() => props.lang)',
    'const store = useSiteShellStore()',
    '',
    'function handleAction(action: ShellAction) {',
    "  if (action.type === 'toggle-sidebar') store.toggleSidebar()",
    "  else if (action.type === 'toggle-right-sidebar') store.toggleRightSidebar()",
    "  else if (action.type === 'toggle-theme') store.toggleTheme()",
    "  else if (action.type === 'select-tool') store.selectTool(action.tool)",
    "  else if (action.type === 'open-modal') store.openModal(action.kind)",
    "  else if (action.type === 'close-modal') store.closeModal()",
    '}',
    '',
    'function onKey(e: KeyboardEvent) {',
    "  if (e.key === '/' && !store.modalOpen) {",
    '    const el = e.target as HTMLElement | null',
    '    const tag = el?.tagName?.toLowerCase()',
    '    const editable = tag === "input" || tag === "textarea" || (el as any)?.isContentEditable',
    '    if (editable) return',
    '    e.preventDefault()',
    "    store.openModal('search')",
    '  }',
    '}',
    '',
    'onMounted(() => window.addEventListener("keydown", onKey))',
    'onUnmounted(() => window.removeEventListener("keydown", onKey))',
    CLOSE_SCRIPT_TAG,
    ''
  ].join('\n')

  return {
    'package.json': JSON.stringify(pkg, null, 2) + '\n',
    'tsconfig.json': JSON.stringify(tsconfig, null, 2) + '\n',
    'vite.config.ts': viteConfig,
    'index.html': indexHtml,
    'tailwind.config.cjs': tailwindConfigCjs,
    'postcss.config.cjs': postcssConfigCjs,
    'src/env.d.ts': envDts,
    'src/index.css': indexCss,
    'src/main.ts': mainTs,
    'src/App.vue': appVue,
    'src/site-shell/shellStore.ts': shellStoreTs,
    'src/site-shell/ShellApp.vue': shellAppVue,
    'src/site-shell/ShellLayout.vue': shellLayoutVue,
    'src/site-shell/ShellHeader.vue': shellHeaderVue,
    'src/site-shell/ShellSidebar.vue': shellSidebarVue,
    'src/site-shell/ShellRightPanel.vue': shellRightPanelVue,
    'src/site-shell/ShellModalHost.vue': shellModalHostVue,
    'src/site-shell/ShellToastHost.vue': shellToastHostVue,
    'src/site-shell/ShellCodeBlock.vue': shellCodeBlockVue,
    'src/site-shell/ShellBuildGuide.vue': shellBuildGuideVue,
    'src/site-shell/ShellSourceGuide.vue': shellSourceGuideVue
  }
}

const starterFilesMap = computed<Record<string, string>>(() => starterFiles())

const addReplaceChecklist = computed(() => {
  if (props.lang === 'zh') {
    return [
      '目标：把“分文件三件套（index.html / styles.css / main.js）”迁移进一个可运行的 Vue 工程。',
      '',
      '新增（Vue 工程必需）：',
      '- package.json / tsconfig.json / vite.config.ts',
      '- tailwind.config.cjs / postcss.config.cjs（如果你要用 Tailwind）',
      '- src/main.ts / src/App.vue / src/index.css / src/env.d.ts',
      '',
      '新增（把教程里的壳子组件落盘）：',
      '- src/site-shell/*（ShellApp / Layout / Header / Sidebar / RightPanel / Modal / Toast / store）',
      '',
      '替换（把“入口”切到 Vue）：',
      '- index.html：从静态三件套入口，替换为 Vue 工程入口（挂载 #app + 引入 /src/main.ts）',
      '',
      '迁移你的三件套内容（建议做法）：',
      '- 把原来的 HTML 结构，逐步拆进 App.vue / 组件（先追求“形状 + 交互链路”，再追求业务）',
      '- 把 styles.css 迁移为 src/index.css（或单独新建 src/style.css 并在 main.ts import）',
      '- 把 main.js 的交互迁移为 Pinia store + 组件事件（先把按钮/面板/弹窗的打开关闭跑通）',
      '',
      '验证：',
      '- npm i',
      '- npm run dev',
      '- npm run build && npm run preview'
    ].join('\n')
  }
  return [
    'Goal: migrate the 3-file trio (index.html / styles.css / main.js) into a runnable Vue project.',
    '',
    'Add (required for Vue project):',
    '- package.json / tsconfig.json / vite.config.ts',
    '- tailwind.config.cjs / postcss.config.cjs (if using Tailwind)',
    '- src/main.ts / src/App.vue / src/index.css / src/env.d.ts',
    '',
    'Add (persist the shell components):',
    '- src/site-shell/* (ShellApp / Layout / Header / Sidebar / RightPanel / Modal / Toast / store)',
    '',
    'Replace (switch entry to Vue):',
    '- index.html: mount #app + import /src/main.ts',
    '',
    'Migrate your trio (suggested):',
    '- Move HTML structure into App.vue/components; focus on “shape + interaction flow” first',
    '- Move styles.css into src/index.css (or create src/style.css and import it)',
    '- Move main.js interactions into Pinia store + component events',
    '',
    'Verify:',
    '- npm i',
    '- npm run dev',
    '- npm run build && npm run preview'
  ].join('\n')
})

async function downloadStarterZip() {
  if (isPackaging.value) return
  isPackaging.value = true
  try {
    const mod = await import('jszip')
    const JSZip = mod.default
    const zip = new JSZip()
    const files = starterFilesMap.value
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, 'site-shell-starter.zip')
    store.showToast(props.lang === 'zh' ? '已开始下载 zip' : 'Zip download started')
  } catch {
    store.showToast(props.lang === 'zh' ? '打包失败（请重试）' : 'Packaging failed (retry)')
  } finally {
    isPackaging.value = false
  }
}

async function copyCommands() {
  const text = ['npm i', 'npm run dev', '', 'npm run build', 'npm run preview'].join('\n')
  try {
    await navigator.clipboard.writeText(text)
    store.showToast(props.lang === 'zh' ? '已复制启动命令' : 'Commands copied')
  } catch {
    store.showToast(props.lang === 'zh' ? '复制失败（浏览器可能禁止）' : 'Copy failed (blocked by browser)')
  }
}

function getFocusable(root: HTMLElement) {
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href],button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
    )
  )
  return nodes.filter((el) => {
    const disabled = (el as HTMLButtonElement).disabled
    if (disabled) return false
    const style = window.getComputedStyle(el)
    return style.visibility !== 'hidden' && style.display !== 'none'
  })
}

function focusFirst() {
  const root = dialogRef.value
  if (!root) return
  const focusables = getFocusable(root)
  const first = focusables[0] ?? closeBtnRef.value ?? root
  first.focus()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
    return
  }
  if (e.key !== 'Tab') return
  const root = dialogRef.value
  if (!root) return
  const focusables = getFocusable(root)
  if (!focusables.length) {
    e.preventDefault()
    root.focus()
    return
  }
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement as HTMLElement | null
  if (e.shiftKey) {
    if (!active || active === first || !root.contains(active)) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (!active || active === last || !root.contains(active)) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(
  () => props.open,
  (open) => {
    cleanup?.()
    cleanup = null
    if (!open) {
      if (prevOverflow != null) document.body.style.overflow = prevOverflow
      prevOverflow = null
      restoreFocusEl?.focus?.()
      restoreFocusEl = null
      return
    }
    restoreFocusEl = document.activeElement as HTMLElement | null
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    cleanup = () => window.removeEventListener('keydown', onKey)
    nextTick().then(() => focusFirst())
  },
  { immediate: true }
)

onUnmounted(() => {
  cleanup?.()
  if (prevOverflow != null) document.body.style.overflow = prevOverflow
})
</script>
