<template>
  <div class="giscus-comments mt-12 pt-8 border-t border-sakura-100 dark:border-gray-700">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
      <span>💬</span>
      {{ lang === 'zh' ? '评论区' : 'Comments' }}
    </h3>
    
    <div ref="giscusContainer" class="giscus"></div>
    
    <!-- Loading State -->
    <div v-if="!loaded" class="flex items-center justify-center py-12 text-gray-400">
      <div class="animate-spin text-2xl mr-3">🌸</div>
      <span>{{ lang === 'zh' ? '加载评论中...' : 'Loading comments...' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  lang: 'en' | 'zh'
  isDark: boolean
  path: string
  // Giscus Configuration
  repo?: string
  repoId?: string
  category?: string
  categoryId?: string
}>()

const giscusContainer = ref<HTMLElement | null>(null)
const loaded = ref(false)

// Default config - user should override these
const config = {
  repo: props.repo || 'soft-zihan/soft-zihan.github.io',
  repoId: props.repoId || '', // Get from giscus.app
  category: props.category || 'Announcements',
  categoryId: props.categoryId || '', // Get from giscus.app
}

const loadGiscus = () => {
  if (!giscusContainer.value) return
  
  // Remove existing script
  const existingScript = document.querySelector('script[src="https://giscus.app/client.js"]')
  if (existingScript) {
    existingScript.remove()
  }
  
  // Clear container
  giscusContainer.value.innerHTML = ''
  
  // Create new script
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', config.repo)
  script.setAttribute('data-repo-id', config.repoId)
  script.setAttribute('data-category', config.category)
  script.setAttribute('data-category-id', config.categoryId)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', props.isDark ? 'dark_dimmed' : 'light')
  script.setAttribute('data-lang', props.lang === 'zh' ? 'zh-CN' : 'en')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true
  
  script.onload = () => {
    loaded.value = true
  }
  
  giscusContainer.value.appendChild(script)
}

// Update theme when it changes
const updateGiscusTheme = () => {
  const iframe = document.querySelector<HTMLIFrameElement>('.giscus-frame')
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: props.isDark ? 'dark_dimmed' : 'light' } } },
      'https://giscus.app'
    )
  }
}

watch(() => props.isDark, () => {
  updateGiscusTheme()
})

watch(() => props.lang, () => {
  nextTick(() => loadGiscus())
})

watch(() => props.path, () => {
  nextTick(() => loadGiscus())
})

onMounted(() => {
  // Only load if we have required config
  if (config.repoId && config.categoryId) {
    loadGiscus()
  } else {
    // Show placeholder message
    loaded.value = true
    if (giscusContainer.value) {
      giscusContainer.value.innerHTML = `
        <div class="text-center py-8 text-gray-400">
          <p>💡 ${props.lang === 'zh' ? '评论功能需要配置 Giscus' : 'Comments require Giscus configuration'}</p>
          <p class="text-sm mt-2">
            <a href="https://giscus.app" target="_blank" class="text-sakura-500 hover:underline">
              ${props.lang === 'zh' ? '前往 giscus.app 获取配置' : 'Visit giscus.app for configuration'}
            </a>
          </p>
        </div>
      `
    }
  }
})
</script>
