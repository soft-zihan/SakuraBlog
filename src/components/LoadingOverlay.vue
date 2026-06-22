<template>
  <div class="fixed inset-0 z-[2000] flex items-center justify-center px-6 text-center bg-white/70 dark:bg-gray-950/70 backdrop-blur-md">
    <div class="max-w-[560px] w-full">
      <div class="text-6xl mb-4 animate-spin-slow select-none">🌸</div>
      <div class="font-bold text-[1.05rem] text-rose-800 dark:text-rose-200">
        {{ title }}
      </div>
      <div class="mt-3 text-sm text-rose-900/80 dark:text-rose-200/80">
        {{ detail }}
      </div>
      <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          class="appearance-none border border-rose-800/25 bg-white/70 dark:bg-gray-900/60 text-rose-800 dark:text-rose-200 px-4 py-2 rounded-full font-bold"
          @click="reload"
        >
          {{ lang === 'zh' ? '刷新重试' : 'Reload' }}
        </button>
        <button
          type="button"
          class="appearance-none border border-rose-800/25 bg-rose-800/10 dark:bg-rose-300/10 text-rose-800 dark:text-rose-200 px-4 py-2 rounded-full font-bold"
          @click="enterLiteMode"
        >
          {{ lang === 'zh' ? '进入轻量模式' : 'Lite mode' }}
        </button>
      </div>
      <div class="mt-3 text-xs leading-6 text-rose-900/70 dark:text-rose-200/70">
        <div>{{ lang === 'zh' ? '如果一直加载：建议检查网络、清理站点缓存后重试。' : 'If it keeps loading, check network and refresh after clearing site cache.' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { perf } from '../utils/perf'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
const title = computed(() => (lang.value === 'zh' ? '正在加载 Sakura Notes…' : 'Loading Sakura Notes...'))

const detail = ref('')

let timers: number[] = []

const setDetail = (text: string) => {
  detail.value = text
}

const reload = () => {
  window.location.reload()
}

const enterLiteMode = () => {
  try {
    window.localStorage.setItem('sakura:liteMode:v1', '1')
  } catch {}
  window.location.reload()
}

onMounted(() => {
  perf.mark('ui:loadingOverlay:mounted')
  setDetail(lang.value === 'zh' ? '首次打开需要下载核心资源并初始化索引…' : 'Downloading core assets and initializing index...')

  timers.push(
    window.setTimeout(() => {
      setDetail(lang.value === 'zh' ? '正在初始化界面与文章索引…' : 'Initializing UI and article index...')
    }, 2000)
  )
})

onUnmounted(() => {
  perf.mark('ui:loadingOverlay:unmounted')
  for (const t of timers) window.clearTimeout(t)
  timers = []
})
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 3.5s linear infinite;
}
</style>
