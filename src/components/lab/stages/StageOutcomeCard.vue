<template>
  <details class="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/60 dark:bg-gray-900/30 p-4">
    <summary class="cursor-pointer font-bold text-emerald-700 dark:text-emerald-300 text-sm">
      {{ isZh ? '目标与完成标准（本阶段）' : 'Goals & completion criteria' }}
    </summary>
    <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '目标' : 'Goals' }}</div>
        <ul class="mt-2 text-xs text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
          <li v-for="(it, idx) in goals" :key="idx">{{ it }}</li>
        </ul>
      </div>
      <div>
        <div class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '完成标准' : 'Criteria' }}</div>
        <ul class="mt-2 text-xs text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
          <li v-for="(it, idx) in criteria" :key="idx">{{ it }}</li>
        </ul>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STAGE_OUTCOMES } from '../../../labs/stageOutcomes'
import type { StageId } from '../../../labs/labCatalog'

const props = defineProps<{
  lang: 'en' | 'zh'
  stageId: StageId
}>()

const isZh = computed(() => props.lang === 'zh')
const config = computed(() => STAGE_OUTCOMES[props.stageId])
const goals = computed(() => (isZh.value ? config.value.goalsZh : config.value.goalsEn) || [])
const criteria = computed(() => (isZh.value ? config.value.criteriaZh : config.value.criteriaEn) || [])
</script>

