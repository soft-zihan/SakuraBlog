<template>
  <div class="space-y-12">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-900/40 dark:to-purple-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-xl">✨</span> {{ isZh ? '扩展实验（可选加餐）' : 'Extensions (Optional)' }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ isZh ? '这些内容不强依赖主线项目，可按需学习与补强。' : 'These labs are optional and can be explored as needed.' }}
        </p>
      </div>
    </div>

    <section>
      <LabCodeEvolution :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧠</span> {{ isZh ? '浏览器渲染流水线' : 'Rendering Pipeline' }}
      </h2>
      <LabBrowserPipeline :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🌸</span> {{ isZh ? 'CSS 动画' : 'CSS Animation' }}
      </h2>
      <LabCssAnimation :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧩</span> {{ isZh ? 'CSS 性能与渲染成本' : 'CSS Performance' }}
      </h2>
      <LabCssPerformance :lang="lang" />
    </section>

    <section>
      <LabTailwind :lang="lang" />
    </section>

    <section>
      <LabCssFrameworks :lang="lang" />
    </section>

    <section>
      <LabTypeScriptAdvanced />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LabCodeEvolution from '../stage1-foundation/LabCodeEvolution.vue'
import LabBrowserPipeline from '../stage1-foundation/LabBrowserPipeline.vue'
import LabCssAnimation from '../stage3-css/LabCssAnimation.vue'
import LabCssPerformance from '../stage3-css/LabCssPerformance.vue'
import LabTailwind from '../stage5-engineering/LabTailwind.vue'
import LabCssFrameworks from '../stage5-engineering/LabCssFrameworks.vue'
import LabTypeScriptAdvanced from '../stage4-js-advanced/LabTypeScriptAdvanced.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
</script>

