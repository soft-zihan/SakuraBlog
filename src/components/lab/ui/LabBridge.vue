<template>
  <div class="max-w-4xl mx-auto px-4">
    <div class="text-[11px] font-extrabold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-2">
      {{ isZh ? '过渡' : 'Bridge' }}
    </div>
    <div class="space-y-3">
      <div class="flex items-start gap-3">
        <div class="mt-0.5 text-sm">✓</div>
        <div class="min-w-0">
          <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
            {{ isZh ? '本段你会带走' : 'Takeaways' }}
          </div>
          <div class="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ nowText }}
          </div>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <div class="mt-0.5 text-sm">→</div>
        <div class="min-w-0">
          <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
            {{ isZh ? '下一段我们解决' : 'Next focus' }}
          </div>
          <div class="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ nextText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  lang: 'en' | 'zh'
  nowZh: string
  nowEn: string
  nextZh: string
  nextEn: string
}>()

const isZh = computed(() => props.lang === 'zh')
const nowText = computed(() => (isZh.value ? props.nowZh : props.nowEn) || '')
const nextText = computed(() => (isZh.value ? props.nextZh : props.nextEn) || '')
</script>
