<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
    <div class="text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full mx-4">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin text-5xl">🌸</div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">正在登录...</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">正在与 GitHub 完成授权</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="space-y-4">
        <div class="text-5xl">✅</div>
        <h2 class="text-xl font-bold text-green-600 dark:text-green-400">登录成功!</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">正在跳转回设置页面...</p>
      </div>

      <!-- Error State -->
      <div v-else class="space-y-4">
        <div class="text-5xl">❌</div>
        <h2 class="text-xl font-bold text-red-600 dark:text-red-400">登录失败</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ error }}</p>
        <button 
          @click="goHome"
          class="mt-4 px-6 py-2 bg-[var(--primary-500)] text-white rounded-xl hover:bg-[var(--primary-600)] transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGitHubOAuth } from '../composables/useGitHubOAuth'

const loading = ref(true)
const success = ref(false)
const error = ref('')

const { handleCallback } = useGitHubOAuth()

const goHome = () => {
  window.location.href = window.location.pathname
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')
  const errorParam = params.get('error')

  // 检查 GitHub 返回的错误
  if (errorParam) {
    loading.value = false
    error.value = errorParam === 'access_denied' 
      ? '您取消了授权' 
      : `授权失败: ${errorParam}`
    return
  }

  // 检查必需参数
  if (!code || !state) {
    loading.value = false
    error.value = '缺少授权参数，请重新登录'
    return
  }

  // 处理回调
  const result = await handleCallback(code, state)
  loading.value = false

  if (result) {
    success.value = true
    // 1.5 秒后跳转回主页
    setTimeout(() => {
      window.location.href = window.location.pathname
    }, 1500)
  } else {
    error.value = 'Token 交换失败，请稍后重试'
  }
})
</script>
