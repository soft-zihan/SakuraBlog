<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="engineering" />

    <section class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/30">
        <div class="flex items-start gap-3">
          <div class="text-2xl">🧱</div>
          <div class="flex-1">
            <div class="font-bold text-gray-800 dark:text-gray-100">
              {{ isZh ? '工程化的目标：可运行、可构建、可部署' : 'Engineering goal: run, build, deploy' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ isZh
                ? '你要能回答：入口在哪、依赖怎么装、构建做了什么、静态部署为什么需要 base 路径。读懂这些，项目就不会“看起来很大但摸不着头脑”。'
                : 'You should know: where entry is, how deps install, what build does, why static deploy needs base path. Then the project becomes readable.' }}
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-200 font-bold hover:opacity-90"
                @click="openLabNote('/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md')"
              >
                {{ isZh ? '打开：笔记4（工程化/TS）' : 'Open: Note 4 (Engineering/TS)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('vite.config.ts', 'find:defineConfig')"
              >
                {{ isZh ? '对照：vite.config.ts' : 'Compare: vite.config.ts' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('package.json', 'find:scripts')"
              >
                {{ isZh ? '对照：package.json（scripts/依赖）' : 'Compare: package.json (scripts/deps)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('tsconfig.json', 'find:compilerOptions')"
              >
                {{ isZh ? '对照：tsconfig.json（TS 编译）' : 'Compare: tsconfig.json' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/index.html', 'find:tailwindcss')"
              >
                {{ isZh ? '对照：Tailwind 配置（CDN）' : 'Compare: Tailwind config (CDN)' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 p-5">
          <h3 class="text-sm font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span class="text-base">🚀</span> {{ isZh ? '从 0 跑起来（最短路径）' : 'Get it running (shortest path)' }}
          </h3>
          <ol class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex gap-2">
              <span class="font-mono text-gray-400">1</span>
              <span>{{ isZh ? '装依赖：npm i' : 'Install deps: npm i' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="font-mono text-gray-400">2</span>
              <span>{{ isZh ? '启动开发：npm run dev' : 'Dev server: npm run dev' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="font-mono text-gray-400">3</span>
              <span>{{ isZh ? '看入口：src/main.ts → App.vue' : 'Entry: src/main.ts → App.vue' }}</span>
            </li>
          </ol>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-bold hover:opacity-90"
              @click="openCode('src/main.ts', 'find:createApp')"
            >
              {{ isZh ? '对照：src/main.ts（入口）' : 'Compare: src/main.ts (entry)' }}
            </button>
            <button
              type="button"
              class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-bold hover:opacity-90"
              @click="openCode('src/App.vue', 'template')"
            >
              {{ isZh ? '对照：App.vue（根组件）' : 'Compare: App.vue (root)' }}
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 p-5">
          <h3 class="text-sm font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span class="text-base">📦</span> {{ isZh ? '构建与部署（你一定会踩的坑）' : 'Build & deploy (common pitfalls)' }}
          </h3>
          <ul class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex gap-2">
              <span class="font-mono text-gray-400">•</span>
              <span>{{ isZh ? '静态部署要关注 base 路径（GitHub Pages 常见）' : 'Static deploy needs correct base (common on GitHub Pages)' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="font-mono text-gray-400">•</span>
              <span>{{ isZh ? '资源引用用相对路径 / import，避免构建后 404' : 'Use relative/imported assets to avoid 404 after build' }}</span>
            </li>
            <li class="flex gap-2">
              <span class="font-mono text-gray-400">•</span>
              <span>{{ isZh ? '构建产物 dist 是“纯静态文件”，不是 Node 服务' : 'dist is pure static files, not a Node server' }}</span>
            </li>
          </ul>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-bold hover:opacity-90"
              @click="openCode('vite.config.ts', 'find:base')"
            >
              {{ isZh ? '对照：vite.config.ts（base）' : 'Compare: vite.config.ts (base)' }}
            </button>
            <button
              type="button"
              class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-bold hover:opacity-90"
              @click="openCode('package.json', 'find:scripts')"
            >
              {{ isZh ? '对照：package.json（scripts）' : 'Compare: package.json (scripts)' }}
            </button>
          </div>
        </div>
      </div>

      <details class="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 p-5">
        <summary class="cursor-pointer font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? '扩展：排错 checklist' : 'Extras: debug checklist' }}
        </summary>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
          <div class="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/20 p-4">
            <div class="font-extrabold text-gray-800 dark:text-gray-100">{{ isZh ? '依赖/环境' : 'Deps / env' }}</div>
            <ul class="mt-2 space-y-1 text-xs">
              <li>• {{ isZh ? 'Node 版本是否满足（报奇怪语法错误时先看它）' : 'Check Node version first when syntax errors look weird' }}</li>
              <li>• {{ isZh ? '删 node_modules + 重新 npm i 试一次' : 'Try clean install (delete node_modules, npm i)' }}</li>
              <li>• {{ isZh ? '锁文件冲突：package-lock.json 是否一致' : 'Lockfile drift: verify package-lock.json' }}</li>
            </ul>
          </div>
          <div class="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/20 p-4">
            <div class="font-extrabold text-gray-800 dark:text-gray-100">{{ isZh ? '构建/部署' : 'Build / deploy' }}</div>
            <ul class="mt-2 space-y-1 text-xs">
              <li>• {{ isZh ? 'GitHub Pages：base 必须匹配仓库名/子路径' : 'GitHub Pages: base must match repo/subpath' }}</li>
              <li>• {{ isZh ? '刷新 404：需要 SPA 回退规则（不是 Vite 的锅）' : 'Refresh 404: needs SPA fallback rule (not Vite issue)' }}</li>
              <li>• {{ isZh ? '图片/字体路径：构建后 dist 里确认是否存在' : 'Asset paths: verify files exist in dist' }}</li>
            </ul>
          </div>
        </div>
      </details>
    </section>

    <section>
      <LabModuleSystem :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-red-400">
          💡 {{ isZh ? 'NPM 是 Node.js 的包管理器。' : 'NPM is Node.js package manager.' }}
        </p>
      </div>
      <LabNpm :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
          💡 {{ isZh ? 'Vite 是新一代构建工具。' : 'Vite is next-gen build tool.' }}
        </p>
      </div>
      <LabBuildTools :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-cyan-400">
          💡 {{ isZh ? 'Tailwind 不是“魔法”，它是 CSS 的高频用法被做成了工具类。先理解 CSS，再用 Tailwind 事半功倍。' : 'Tailwind is not magic—it’s CSS wrapped into utilities. CSS first, Tailwind faster.' }}
        </p>
      </div>
      <LabTailwind :lang="lang" />
    </section>

    <section>
      <LabCssFrameworks :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '工程化基础掌握了！接下来进入 Vue 核心。' : 'Engineering basics done! Next: Vue core.'"
      @next="emit('navigate', 'vue-core')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NextStageGuide from '../NextStageGuide.vue'
import StageLearningGuide from './StageLearningGuide.vue'
import LabModuleSystem from '../stage5-engineering/LabModuleSystem.vue'
import LabNpm from '../stage5-engineering/LabNpm.vue'
import LabBuildTools from '../stage5-engineering/LabBuildTools.vue'
import LabTailwind from '../stage5-engineering/LabTailwind.vue'
import LabCssFrameworks from '../stage5-engineering/LabCssFrameworks.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')

const openLabNote = (path: string) => {
  window.dispatchEvent(new CustomEvent('sakura:open-lab-note', { detail: { path } }))
}

const openCode = (path: string, token?: string) => {
  const raw = (token || '').trim()
  const isLineRange = !!raw && /^L?\d+(-L?\d+)?$/i.test(raw)
  const isFind = raw.toLowerCase().startsWith('find:')
  const range = isLineRange ? raw : undefined
  const anchor = !isLineRange && !isFind && raw ? raw : undefined
  const find = isFind ? raw.slice('find:'.length).trim() : undefined
  window.dispatchEvent(new CustomEvent('sakura-open-code', { detail: { path, range, anchor, find } }))
}
</script>
