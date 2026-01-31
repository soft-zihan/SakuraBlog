<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="bg-white/90 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <span class="text-base">📈</span> {{ isZh ? '学习进度' : 'Learning Progress' }}
          </h3>
          <div class="flex items-center gap-2">
            <button
              v-if="activeStageId"
              @click="$emit('complete-stage')"
              class="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white transition-colors"
            >
              {{ isZh ? '完成本阶段' : 'Complete Stage' }}
            </button>
            <button
              @click="$emit('reset')"
              class="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            >
              {{ isZh ? '重置' : 'Reset' }}
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-2xl font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] w-16 text-right">
            {{ overallProgress?.percent ?? 0 }}%
          </div>
          <div class="flex-1 min-w-0">
            <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-[var(--primary-500)] rounded-full transition-[width] duration-500"
                :style="{ width: `${overallProgress?.percent ?? 0}%` }"
              ></div>
            </div>
            <div class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {{ overallProgress?.completed ?? 0 }} / {{ overallProgress?.total ?? 0 }}
            </div>
          </div>
        </div>

      </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isZh: boolean
  activeStageId: string | null
  overallProgress: { percent: number; completed: number; total: number }
  stageProgressItems: Array<{ stageId: string; percent: number; label: string }>
  nextRecommendedLab?: any
}>()

defineEmits<{
  (e: 'complete-stage'): void
  (e: 'reset'): void
}>()
</script>
