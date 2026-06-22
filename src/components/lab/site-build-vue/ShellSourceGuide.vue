<template>
  <ShellGlassCard>
    <div class="p-6 border-b border-white/60 dark:border-gray-700/60">
      <div class="text-xs font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] tracking-wide">
        {{ lang === 'zh' ? '源码视角' : 'Source view' }}
      </div>
      <div class="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
        {{ lang === 'zh' ? '把“教程步骤”映射回 Vue 组件' : 'Map tutorial steps back to Vue components' }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {{
          lang === 'zh'
            ? '你现在看到的 UI 壳子是用“事件上抛 + store 统一分发”组织的。建议按下面顺序阅读源码：先看状态，再看布局，再看交互。'
            : 'This shell uses “emit actions + a store dispatcher”. Read in this order: state -> layout -> interactions.'
        }}
      </div>
    </div>

    <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
        <div class="text-xs font-extrabold text-gray-500 dark:text-gray-400">
          {{ lang === 'zh' ? ' 状态（Pinia）' : '1) State (Pinia)' }}
        </div>
        <div class="mt-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">shellStore.ts</div>
        <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {{ lang === 'zh' ? '所有 UI 状态（模式/阶段/步骤/面包屑/弹窗/提示）都集中在这里。' : 'All UI states live here: mode/stage/steps/breadcrumbs/modals/toast.' }}
        </div>
        <button
          type="button"
          class="mt-3 px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
          @click="copy(storePath)"
        >
          {{ lang === 'zh' ? '复制路径' : 'Copy path' }}
        </button>
      </div>

      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
        <div class="text-xs font-extrabold text-gray-500 dark:text-gray-400">
          {{ lang === 'zh' ? '② 布局（Slot）' : '2) Layout (Slot)' }}
        </div>
        <div class="mt-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">ShellLayout.vue</div>
        <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {{ lang === 'zh' ? '布局组件只负责“框架”，不关心主内容是什么：这就是可复用布局的核心。' : 'Layout owns the frame only. Main content is a slot: reusable layout 101.' }}
        </div>
        <button
          type="button"
          class="mt-3 px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
          @click="copy(layoutPath)"
        >
          {{ lang === 'zh' ? '复制路径' : 'Copy path' }}
        </button>
      </div>

      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
        <div class="text-xs font-extrabold text-gray-500 dark:text-gray-400">
          {{ lang === 'zh' ? '③ 交互（Action 分发）' : '3) Interaction (Action dispatcher)' }}
        </div>
        <div class="mt-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">ShellApp.vue</div>
        <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {{ lang === 'zh' ? '所有子组件只 emit action，父组件统一处理：这能避免“到处改状态”。' : 'Children only emit actions. The parent dispatches state changes: fewer scattered mutations.' }}
        </div>
        <button
          type="button"
          class="mt-3 px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
          @click="copy(appPath)"
        >
          {{ lang === 'zh' ? '复制路径' : 'Copy path' }}
        </button>
      </div>
    </div>

    <div class="px-6 pb-6">
      <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
        <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
          {{ lang === 'zh' ? '真实项目 ↔ 壳子组件对应表' : 'Real project ↔ shell mapping' }}
        </div>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-300">
          {{
            lang === 'zh'
              ? '先看真实项目的文件，再对照壳子版本：你要学的是“边界与意图”，不是把业务逻辑也照搬进来。'
              : 'Read the real file first, then compare to the shell. Focus on boundaries and intents, not business logic.'
          }}
        </div>

        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div
            v-for="(it, idx) in mapping"
            :key="idx"
            class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-4"
          >
            <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
              {{ lang === 'zh' ? it.realLabelZh : it.realLabelEn }}
            </div>
            <div class="mt-1 text-xs text-gray-600 dark:text-gray-300">
              {{ lang === 'zh' ? it.shellLabelZh : it.shellLabelEn }}
            </div>
            <div v-if="it.shellToken" class="mt-2 text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              token: {{ it.shellToken }}
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                class="px-3 py-2 rounded-xl text-[11px] font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
                @click="copy(realPath(it))"
              >
                {{ lang === 'zh' ? '复制真实路径' : 'Copy real path' }}
              </button>
              <button
                type="button"
                class="px-3 py-2 rounded-xl text-[11px] font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
                @click="copy(it.shellPath)"
              >
                {{ lang === 'zh' ? '复制壳子路径' : 'Copy shell path' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ShellGlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ShellGlassCard from './ShellGlassCard.vue'
import { useSiteBuildShellStore } from './shellStore'
import { SITE_BUILD_VUE_MAPPING } from '../../../labs/siteBuildContent'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
const store = useSiteBuildShellStore()

const storePath = 'src/components/lab/site-build-vue/shellStore.ts'
const layoutPath = 'src/components/lab/site-build-vue/ShellLayout.vue'
const appPath = 'src/components/lab/site-build-vue/ShellApp.vue'

const mapping = computed(() => SITE_BUILD_VUE_MAPPING)

function realPath(it: (typeof SITE_BUILD_VUE_MAPPING)[number]) {
  if (lang.value === 'zh') {
    const parts = String(it.realLabelZh || '').split('：')
    return parts[1] ? parts[1].trim() : it.realLabelZh
  }
  const parts = String(it.realLabelEn || '').split('Real:')
  return parts[1] ? parts[1].trim() : it.realLabelEn
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    store.showToast(lang.value === 'zh' ? '已复制路径' : 'Path copied')
  } catch {
    store.showToast(lang.value === 'zh' ? '复制失败（浏览器可能禁止）' : 'Copy failed (blocked by browser)')
  }
}
</script>
