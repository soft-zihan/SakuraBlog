<template>
  <div class="max-w-4xl mx-auto px-4">
    <div class="bg-gradient-to-r from-[var(--primary-50)] to-purple-50 dark:from-gray-900/60 dark:to-gray-800/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-3">
        <div class="text-3xl leading-none mt-0.5">{{ activeTabInfo?.icon }}</div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-extrabold text-gray-800 dark:text-gray-100 text-base truncate">
              {{ activeTabInfo?.label }}
            </h3>
          </div>

          <div class="mt-1 text-xs text-[var(--primary-600)] dark:text-[var(--primary-300)] font-bold">
            🎯 {{ activeTabInfo?.goal }}
          </div>

          <div class="mt-2 flex items-center flex-wrap gap-2">
            <div class="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-300">
              <span class="font-bold">{{ isZh ? '总进度' : 'Overall' }}</span>
              <span class="font-mono text-gray-500 dark:text-gray-400">
                {{ overallProgress?.completed ?? 0 }}/{{ overallProgress?.total ?? 0 }} · {{ overallProgress?.percent ?? 0 }}%
              </span>
            </div>
            <div v-if="activeStageProgress" class="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-300">
              <span class="font-bold">{{ isZh ? '本阶段' : 'This stage' }}</span>
              <span class="font-mono text-gray-500 dark:text-gray-400">
                {{ activeStageProgress.completed }}/{{ activeStageProgress.total }} · {{ activeStageProgress.percent }}%
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            v-if="activeStageProgress"
            type="button"
            class="text-[11px] px-3 py-1.5 rounded-lg border border-[var(--primary-200)] dark:border-[var(--primary-700)]/60 bg-white/80 dark:bg-gray-800/60 text-[var(--primary-700)] dark:text-[var(--primary-200)] font-bold hover:opacity-90"
            @click="$emit('complete-stage')"
          >
            {{ isZh ? '完成本阶段' : 'Complete stage' }}
          </button>
          <button
            type="button"
            class="text-[11px] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 font-bold hover:opacity-90"
            @click="$emit('reset')"
          >
            {{ isZh ? '重置' : 'Reset' }}
          </button>
        </div>
      </div>

      <div class="hidden md:flex items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
        <div class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
          {{ activeTabInfo?.desc }}
        </div>
        <div class="text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
          <span class="text-gray-400 dark:text-gray-500">{{ isZh ? '关联代码' : 'Code' }}:</span>
          <span class="ml-1 font-mono">{{ activeTabInfo?.relatedCode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isZh: boolean
  activeTabInfo?: any
  overallProgress?: { total: number; completed: number; percent: number } | null
  activeStageProgress?: { total: number; completed: number; percent: number; stageId: string; label?: string } | null
}>()

defineEmits<{
  (e: 'complete-stage'): void
  (e: 'reset'): void
}>()
</script>
