<template>
  <div class="max-w-6xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
    <div class="flex items-start gap-4 mb-4">
      <div class="text-3xl">🥝</div>
      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            {{ isZh ? '迷你项目：Vue 复刻本站 UI 空壳' : 'Mini project: Vue UI shell replica' }}
          </h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {{
            isZh
              ? '教程/构建/源码导览放在沙盒外面方便阅读；沙盒里只保留“本站壳子”（侧边栏/顶栏/右侧面板/弹窗）。'
              : 'Guides stay outside the sandbox for readability; the sandbox only shows the site shell (sidebar/topbar/panel/modals).'
          }}
        </p>
      </div>
    </div>

    <div class="mt-4 space-y-6">
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-extrabold border transition-colors"
            :class="activeTool === 'dashboard' ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]' : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90'"
            @click="store.selectTool('dashboard')"
          >
            {{ isZh ? '教程看板' : 'Tutorial' }}
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-extrabold border transition-colors"
            :class="activeTool === 'build' ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]' : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90'"
            @click="store.selectTool('build')"
          >
            {{ isZh ? '项目构建' : 'Build' }}
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-extrabold border transition-colors"
            :class="activeTool === 'source-code' ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]' : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90'"
            @click="store.selectTool('source-code')"
          >
            {{ isZh ? '源码导览' : 'Source' }}
          </button>
        </div>

        <ShellTutorialPanel v-if="activeTool === 'dashboard'" :lang="lang" />
        <ShellBuildGuide v-else-if="activeTool === 'build'" :lang="lang" />
        <ShellSourceGuide v-else :lang="lang" />
      </div>

      <div>
        <ShellApp :lang="lang" mode="shell" :enable-files-view="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ShellApp from '../site-build-vue/ShellApp.vue'
import ShellTutorialPanel from '../site-build-vue/ShellTutorialPanel.vue'
import ShellBuildGuide from '../site-build-vue/ShellBuildGuide.vue'
import ShellSourceGuide from '../site-build-vue/ShellSourceGuide.vue'
import { useSiteBuildShellStore } from '../site-build-vue/shellStore'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => props.lang === 'zh')
const store = useSiteBuildShellStore()
const activeTool = computed(() => store.currentTool || 'dashboard')
</script>
