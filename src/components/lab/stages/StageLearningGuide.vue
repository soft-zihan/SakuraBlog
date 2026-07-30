<template>
  <section class="max-w-4xl mx-auto px-4">
    <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-[var(--primary-100)] dark:border-gray-700 shadow-xl">
      <div class="flex items-start gap-4">
        <div class="text-3xl">🧠</div>
        <div class="flex-1">
          <h2 class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
            {{ isZh ? guide.titleZh : guide.titleEn }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {{ isZh ? guide.leadZh : guide.leadEn }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <details open class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-4">
          <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
            {{ isZh ? '先修知识' : 'Prerequisites' }}
          </summary>
          <ul class="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400 list-disc pl-5">
            <li v-for="(it, idx) in (isZh ? guide.prerequisitesZh : guide.prerequisitesEn)" :key="idx">{{ it }}</li>
          </ul>
        </details>

        <details open class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-4">
          <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
            {{ isZh ? '常见坑位' : 'Common pitfalls' }}
          </summary>
          <ul class="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400 list-disc pl-5">
            <li v-for="(it, idx) in (isZh ? guide.commonPitfallsZh : guide.commonPitfallsEn)" :key="idx">{{ it }}</li>
          </ul>
        </details>
      </div>

      <details open class="mt-4 rounded-2xl border border-indigo-100 dark:border-gray-700 bg-indigo-50/60 dark:bg-gray-900/30 p-4">
        <summary class="cursor-pointer font-bold text-indigo-700 dark:text-indigo-300 text-sm">
          {{ isZh ? '语法点地图（本 Stage 必备）' : 'Syntax map (must-know for this stage)' }}
        </summary>
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="(it, idx) in (isZh ? guide.syntaxPointsZh : guide.syntaxPointsEn)"
            :key="idx"
            class="text-xs px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-white/80 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200"
          >
            {{ it }}
          </span>
        </div>
      </details>

      <details
        v-if="(isZh ? guide.extensionsZh : guide.extensionsEn).length"
        class="mt-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-4"
      >
        <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
          {{ isZh ? '扩展（可选）' : 'Extensions (optional)' }}
        </summary>
        <ul class="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400 list-disc pl-5">
          <li v-for="(it, idx) in extensions" :key="idx">
            <button
              v-if="it.codeRef"
              type="button"
              class="text-left underline underline-offset-2 decoration-dotted hover:decoration-solid text-indigo-700 dark:text-indigo-300"
              @click.stop="openGuideCode(it.codeRef)"
            >
              {{ it.text }}
            </button>
            <span v-else>{{ it.text }}</span>
          </li>
        </ul>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STAGE_GUIDES, type StageGuide } from '../../../labs/stageGuides'
import { parseStageGuideCodeRef, type StageGuideCodeRef } from '../../../labs/stageGuideRefs'

const props = defineProps<{
  lang: 'en' | 'zh'
  stageId:
    | 'foundation'
    | 'css-layout'
    | 'js-basics'
    | 'js-advanced'
    | 'engineering'
    | 'vue-core'
    | 'vue-advanced'
    | 'challenge'
}>()

const isZh = computed(() => props.lang === 'zh')
const guide = computed<StageGuide>(() => STAGE_GUIDES[props.stageId])

const extensions = computed(() => {
  const list = (isZh.value ? guide.value.extensionsZh : guide.value.extensionsEn) || []
  return list.map(text => ({ text, codeRef: parseStageGuideCodeRef(text) }))
})

const openGuideCode = (codeRef: StageGuideCodeRef) => {
  window.dispatchEvent(
    new CustomEvent('sakura-open-code', {
      detail: { path: codeRef.path, range: codeRef.range, anchor: codeRef.anchor, find: codeRef.find }
    })
  )
}
</script>
