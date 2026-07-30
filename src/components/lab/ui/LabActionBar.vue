<template>
  <div class="flex flex-wrap gap-2" :class="justifyClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { align = 'start' } = defineProps<{
  align?: 'start' | 'center' | 'end'
}>()

const justifyClass = computed(() => {
  if (align === 'center') return 'justify-center'
  if (align === 'end') return 'justify-end'
  return 'justify-start'
})
</script>
