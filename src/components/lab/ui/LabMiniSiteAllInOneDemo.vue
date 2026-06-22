<template>
  <LabMiniSiteProject :lang="lang" step="js" editor="combined" combined-role="demo" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LabMiniSiteProject from './LabMiniSiteProject.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
</script>

