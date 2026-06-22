<template>
  <ShellGlassCard>
    <div class="p-6 border-b border-white/60 dark:border-gray-700/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <div class="text-xs font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] tracking-wide">
          {{ lang === 'zh' ? '项目构建（Vue）' : 'Project build (Vue)' }}
        </div>
        <div class="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
          {{ lang === 'zh' ? '把 UI 壳子落到你自己的可运行工程里' : 'Move the UI shell into a runnable local project' }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {{
            lang === 'zh'
              ? '目标是：你能在本地创建一个 Vue 工程，跑起来、构建出 dist，并且知道每个壳子组件对应哪个文件。'
              : 'Goal: create a Vue project locally, run it, build dist, and know where each shell piece lives.'
          }}
        </div>
      </div>

      <div class="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[var(--primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--primary-500)]/20 hover:opacity-90"
          @click="store.openModal('download')"
        >
          {{ lang === 'zh' ? '一键导出 Starter Zip' : 'Export starter zip' }}
        </button>
      </div>
    </div>

    <div class="p-6 space-y-4">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
          <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
            {{ lang === 'zh' ? '你要完成的闭环' : 'The loop you want to complete' }}
          </div>
          <ul class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li class="flex gap-2">
              <span class="text-green-600 dark:text-green-300 font-extrabold">✓</span>
              <span class="flex-1">{{ lang === 'zh' ? '创建项目（Vite + Vue + TS）' : 'Scaffold (Vite + Vue + TS)' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="text-green-600 dark:text-green-300 font-extrabold">✓</span>
              <span class="flex-1">{{ lang === 'zh' ? '把壳子组件放进 src/site-shell' : 'Put shell components under src/site-shell' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="text-green-600 dark:text-green-300 font-extrabold">✓</span>
              <span class="flex-1">{{ lang === 'zh' ? 'npm run dev 能看到侧边栏/顶栏/右侧面板/弹窗' : 'npm run dev shows sidebar/header/right panel/modals' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="text-green-600 dark:text-green-300 font-extrabold">✓</span>
              <span class="flex-1">{{ lang === 'zh' ? 'npm run build + npm run preview 能验证 dist' : 'npm run build + npm run preview validates dist' }}</span>
            </li>
          </ul>
        </section>

        <section class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
          <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
            {{ lang === 'zh' ? '常见坑（最容易卡住）' : 'Common pitfalls' }}
          </div>
          <ul class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li class="flex gap-2">
              <span class="font-extrabold text-[var(--primary-500)]">•</span>
              <span class="flex-1">{{ lang === 'zh' ? '静态部署到子路径时，vite base 需要设置（例如 ./ 或 /repo-name/）' : 'If deploying under a subpath, configure Vite base (./ or /repo-name/)' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="font-extrabold text-[var(--primary-500)]">•</span>
              <span class="flex-1">{{ lang === 'zh' ? 'Tailwind 必须接入，否则 class 都是“纯字符串”不会生效' : 'Tailwind must be wired, otherwise utility classes do nothing' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="font-extrabold text-[var(--primary-500)]">•</span>
              <span class="flex-1">{{ lang === 'zh' ? '先跑通“状态 → 视图”，再做业务；壳子阶段不要引入路由/接口' : 'Get “state → UI” working first; skip routing/network during shell phase' }}</span>
            </li>
          </ul>
        </section>
      </div>

      <ShellCodeBlock :lang="lang" :title="lang === 'zh' ? '1) 创建工程（命令）' : '1) Scaffold (commands)'" :content="commands" :collapsed-lines="18" />
      <ShellCodeBlock :lang="lang" :title="lang === 'zh' ? '2) 目标目录结构' : '2) Target folder structure'" :content="tree" :collapsed-lines="26" />
      <ShellCodeBlock :lang="lang" :title="lang === 'zh' ? '3) 运行与构建（命令）' : '3) Run & build (commands)'" :content="runCommands" :collapsed-lines="18" />
    </div>
  </ShellGlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ShellGlassCard from './ShellGlassCard.vue'
import ShellCodeBlock from './ShellCodeBlock.vue'
import { useSiteBuildShellStore } from './shellStore'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const store = useSiteBuildShellStore()
const lang = computed(() => props.lang)

const commands = computed(() => {
  if (lang.value === 'zh') {
    return [
      '方案 A（最快）：',
      '1) 下载 Starter Zip（右上角按钮）并解压',
      '2) 在项目根目录执行 npm i',
      '3) npm run dev',
      '',
      '方案 B（自己新建工程）：',
      'npm create vite@latest my-site-shell -- --template vue-ts',
      'cd my-site-shell',
      'npm i',
      '',
      '然后把 Starter Zip 里的配置与 src/site-shell 复制进来。'
    ].join('\n')
  }
  return [
    'Option A (fastest):',
    '1) Download and unzip the starter zip',
    '2) npm i',
    '3) npm run dev',
    '',
    'Option B (scaffold yourself):',
    'npm create vite@latest my-site-shell -- --template vue-ts',
    'cd my-site-shell',
    'npm i',
    '',
    'Then copy configs + src/site-shell from the starter zip.'
  ].join('\n')
})

const tree = computed(() =>
  [
    'my-site-shell/',
    '  index.html',
    '  package.json',
    '  tsconfig.json',
    '  vite.config.ts',
    '  tailwind.config.cjs',
    '  postcss.config.cjs',
    '  src/',
    '    main.ts',
    '    App.vue',
    '    index.css',
    '    site-shell/',
    '      ShellApp.vue',
    '      ShellLayout.vue',
    '      ShellHeader.vue',
    '      ShellSidebar.vue',
    '      ShellRightPanel.vue',
    '      ShellModalHost.vue',
    '      ShellToastHost.vue',
    '      shellStore.ts'
  ].join('\n')
)

const runCommands = computed(() => {
  if (lang.value === 'zh') {
    return ['npm run dev', '', 'npm run build', 'npm run preview'].join('\n')
  }
  return ['npm run dev', '', 'npm run build', 'npm run preview'].join('\n')
})
</script>
