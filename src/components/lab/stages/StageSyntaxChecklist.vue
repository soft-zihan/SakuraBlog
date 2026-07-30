<template>
  <details class="rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-white/60 dark:bg-gray-900/30 p-4">
    <summary class="cursor-pointer font-bold text-indigo-700 dark:text-indigo-300 text-sm">
      {{ isZh ? '知识清单（本阶段必备）' : 'Must-know checklist' }}
    </summary>
    <div class="mt-3" :class="isVueCore ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'">
      <span
        v-for="(it, idx) in points"
        :key="idx"
        class="text-xs px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-white/80 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200"
        :class="isVueCore ? 'block w-full' : ''"
      >
        {{ it }}
      </span>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STAGE_GUIDES, type StageGuide } from '../../../labs/stageGuides'
import type { StageId } from '../../../labs/labCatalog'

const props = defineProps<{
  lang: 'en' | 'zh'
  stageId: StageId
}>()

const isZh = computed(() => props.lang === 'zh')
const guide = computed<StageGuide>(() => STAGE_GUIDES[props.stageId])
const points = computed(() => (isZh.value ? guide.value.syntaxPointsZh : guide.value.syntaxPointsEn) || [])
const isVueCore = computed(() => props.stageId === 'vue-core')
</script>
