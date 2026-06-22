<template>
  <div class="space-y-12">
    <section class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-[var(--primary-50)] to-purple-50/60 dark:from-[var(--primary-900)]/20 dark:to-purple-900/10 rounded-2xl p-5 border border-[var(--primary-100)] dark:border-gray-700">
        <div class="flex items-start gap-3">
          <div class="text-2xl">🏗️</div>
          <div class="flex-1">
            <div class="font-bold text-gray-800 dark:text-gray-100">
              {{ isZh ? '网站搭建：复刻本站的 UI 外壳（删复杂逻辑）' : 'Site Build: recreate this site’s UI shell (logic stripped)' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{
                isZh
                  ? '本阶段追求“形状与交互像”：左侧可折叠栏、顶栏、右侧面板、弹窗与动效。复杂的数据/网络/文件树/路由等逻辑先不做。'
                  : 'This stage focuses on matching the frame and interactions: collapsible sidebar, topbar, right panel, modals, and motions. Data/routing/filesystem logic is intentionally removed.'
              }}
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/layout/AppLayout.vue', 'template')"
              >
                {{ isZh ? '对照源码：AppLayout.vue（布局骨架）' : 'Compare: AppLayout.vue (layout)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/components/AppSidebar.vue', '<aside')"
              >
                {{ isZh ? '对照源码：AppSidebar.vue（左侧栏）' : 'Compare: AppSidebar.vue (sidebar)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/components/AppHeader.vue', '<header')"
              >
                {{ isZh ? '对照源码：AppHeader.vue（顶栏）' : 'Compare: AppHeader.vue (header)' }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-900/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-200 font-bold hover:opacity-90"
                @click="openCode('src/App.vue', '<AppLayout')"
              >
                {{ isZh ? '对照源码：App.vue（整合入口）' : 'Compare: App.vue (wiring)' }}
              </button>
            </div>
            <div class="mt-4">
              <StageSyntaxChecklist :lang="lang" stage-id="site-build" />
            </div>
            <div class="mt-3">
              <StageOutcomeCard :lang="lang" stage-id="site-build" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-4">
      <details open class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20">
        <summary
          class="cursor-pointer select-none px-5 py-4 font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2"
        >
          <span class="text-lg">🧱</span>
          <span>{{ isZh ? '原生三件套：分文件编辑器（推荐）' : 'Vanilla trio: split-file editor (recommended)' }}</span>
        </summary>

        <div class="px-5 pb-5 space-y-4">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{
              isZh
                ? '三个文件各写各的：先从脚手架模板开始把结构补齐，再用预览迭代；需要时再对照下方示范版本。'
                : 'Edit each file separately: start from a scaffold template, iterate with the live preview, and consult the demo version only when stuck.'
            }}
          </div>
          <section id="lab-LabMiniSiteSplitPractice">
            <LabMiniSiteProject :lang="lang" step="js" editor="files" preset="blank" storage-id="site-build:practice:v1" :show-header="false" />
          </section>

          <section id="lab-LabMiniSiteSplitDemo">
            <div class="max-w-3xl mx-auto">
              <div class="text-sm font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                {{ isZh ? '示范（可编辑，可重置）' : 'Demo (editable, resettable)' }}
              </div>
            </div>
            <LabMiniSiteProject :lang="lang" step="js" editor="files" preset="demo" storage-id="site-build:demo:v1" :show-header="false" />
          </section>
        </div>
      </details>
    </section>

    <section id="lab-LabSiteBuildVue" class="max-w-4xl mx-auto px-4">
      <div class="max-w-3xl mx-auto mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-[var(--primary-500)]">
          🥝 {{ isZh ? 'Vue：把“壳子”组件化复刻，并让 props/emit/状态命名尽量贴近真实项目。' : 'Vue: rebuild the shell with components and match naming/flows to the real project.' }}
        </p>
      </div>
      <LabSiteBuildVueProject :lang="lang" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StageSyntaxChecklist from './StageSyntaxChecklist.vue'
import StageOutcomeCard from './StageOutcomeCard.vue'
import LabMiniSiteProject from '../ui/LabMiniSiteProject.vue'
import LabSiteBuildVueProject from '../ui/LabSiteBuildVueProject.vue'
import { openCode } from '../useOpenCode'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => props.lang === 'zh')
</script>
