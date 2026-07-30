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
import { GISCUS_CONFIG } from '../constants'

const props = defineProps<{
  lang: 'en' | 'zh'
  isDark: boolean
  path: string
  // Giscus Configuration - 用户需要在 giscus.app 获取这些值
  repo?: string       // 格式: "username/repo"
  repoId?: string     // 在 giscus.app 配置页面获取
  category?: string   // 通常是 "Announcements" 或 "General"
  categoryId?: string // 在 giscus.app 配置页面获取
}>()

const emit = defineEmits<{
  (e: 'update-comment-count', payload: { path: string; count: number }): void
}>()

const giscusContainer = ref<HTMLElement | null>(null)
const loaded = ref(false)

// Default config - 用户需要替换这些值
// 获取步骤:
// 1. 访问 https://giscus.app/zh-CN
// 2. 输入你的仓库名 (如 soft-zihan/SakuraBlog)
// 3. 选择 Discussion 分类 (建议使用 Announcements)
// 4. 复制生成的 data-repo-id 和 data-category-id
const config = {
  repo: props.repo || GISCUS_CONFIG.repo,
  repoId: props.repoId || GISCUS_CONFIG.repoId,
  category: props.category || GISCUS_CONFIG.category,
  categoryId: props.categoryId || GISCUS_CONFIG.categoryId,
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
  
  // 构建用于评论映射的唯一标识符（基于文章路径）
  // 由于应用是SPA（没有使用router），所有文章共享相同的pathname
  // 最佳方案：使用 url 映射，Giscus会自动包含 query 参数 (?path=xxx)
  // 这样每篇文章都有唯一的 URL，评论也会独立
  
  // Create new script
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', config.repo)
  script.setAttribute('data-repo-id', config.repoId)
  script.setAttribute('data-category', config.category)
  script.setAttribute('data-category-id', config.categoryId)
  script.setAttribute('data-mapping', 'url')  // 使用 url 映射，包含完整的 URL（含 query 参数）
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', props.lang === 'zh' ? 'zh-CN' : 'en')
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
      { giscus: { setConfig: { theme: 'preferred_color_scheme' } } },
      'https://giscus.app'
    )
  }
}

const handleGiscusMessage = (event: MessageEvent) => {
  if (event.origin !== 'https://giscus.app') return
  const discussion = (event.data as any)?.giscus?.discussion
  if (!discussion) return
  const count = discussion.totalCommentCount ?? discussion.totalReplyCount
  if (typeof count === 'number') {
    emit('update-comment-count', { path: props.path, count })
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
  window.addEventListener('message', handleGiscusMessage)
  // Only load if we have required config
  if (config.repoId && config.categoryId) {
    loadGiscus()
  } else {
    // Show placeholder message with setup instructions
    loaded.value = true
    if (giscusContainer.value) {
      giscusContainer.value.innerHTML = `
        <div class="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="text-4xl mb-4">💬</div>
          <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-2">
            ${props.lang === 'zh' ? '评论功能配置指南' : 'Comment System Setup Guide'}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ${props.lang === 'zh' 
              ? '请按以下步骤配置 Giscus 评论系统：' 
              : 'Follow these steps to configure Giscus comments:'}
          </p>
          <ol class="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 max-w-md mx-auto">
            <li>1️⃣ ${props.lang === 'zh' ? '访问' : 'Visit'} <a href="https://giscus.app/zh-CN" target="_blank" class="text-sakura-500 hover:underline">giscus.app</a></li>
            <li>2️⃣ ${props.lang === 'zh' ? '输入仓库名（如 soft-zihan/SakuraBlog）' : 'Enter your repo name (e.g., username/repo)'}</li>
            <li>3️⃣ ${props.lang === 'zh' ? '在仓库设置中启用 Discussions 功能' : 'Enable Discussions in your repo settings'}</li>
            <li>4️⃣ ${props.lang === 'zh' ? '选择 Discussion 分类（推荐 Announcements）' : 'Select a Discussion category (Announcements recommended)'}</li>
            <li>5️⃣ ${props.lang === 'zh' ? '复制 data-repo-id 和 data-category-id' : 'Copy data-repo-id and data-category-id'}</li>
            <li>6️⃣ ${props.lang === 'zh' ? '在 GiscusComments.vue 中填入这两个值' : 'Add these values to GiscusComments.vue'}</li>
          </ol>
          <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-left font-mono text-xs overflow-x-auto">
            <code class="text-sakura-600 dark:text-sakura-400">
              repoId: 'R_xxxxxx',<br>
              categoryId: 'DIC_xxxxxx'
            </code>
          </div>
        </div>
      `
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleGiscusMessage)
})
</script>
