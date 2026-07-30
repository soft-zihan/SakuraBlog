<template>
  <p class="text-sm text-gray-600 dark:text-gray-400 rounded-xl p-4 border-l-4" :class="[bgClass, borderClass]">
    <slot />
  </p>
</template>

<script setup lang="ts">
const { borderClass, bgClass: bgClassProp } = defineProps<{
  borderClass: string
  bgClass?: string
}>()

const bgClass = bgClassProp ?? 'bg-gray-50 dark:bg-gray-800/50'
</script>
