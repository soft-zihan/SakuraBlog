<template>
  <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-2xl mx-auto text-center">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        {{ isZh ? '🎉 完成本阶段后' : '🎉 After this stage' }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">{{ nextText }}</p>
      <button
        @click="$emit('next')"
        class="px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-xl font-bold transition-all hover:scale-105"
      >
        {{ buttonText || (isZh ? '进入下一阶段 →' : 'Next Stage →') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isZh: boolean
  nextText: string
  buttonText?: string
}>()

defineEmits<{
  (e: 'next'): void
}>()
</script>
