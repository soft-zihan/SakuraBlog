<template>
  <div class="max-w-5xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-indigo-200 dark:border-indigo-700 shadow-xl">
    <!-- Header -->
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🍍</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'Pinia 状态管理' : 'Pinia State Management' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '学习 Vue 3 官方状态管理库 — 以本站 Store 为例' : 'Learn Vue 3 official state management — using this site\'s stores' }}
        </p>
      </div>
    </div>

    <!-- Why Pinia -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
      <p class="text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-2">💡 {{ isZh ? '为什么需要 Pinia？' : 'Why Pinia?' }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div class="flex items-start gap-2">
          <span class="text-yellow-500">⚠️</span>
          <div>
            <p class="font-bold">{{ isZh ? '没有 Pinia 的困境' : 'Without Pinia' }}</p>
            <p>{{ isZh ? 'Props drilling: App → Header → Button，层层传递' : 'Props drilling: App → Header → Button' }}</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-green-500">✅</span>
          <div>
            <p class="font-bold">{{ isZh ? '使用 Pinia' : 'With Pinia' }}</p>
            <p>{{ isZh ? '任何组件直接 useAppStore()，无需层层传递' : 'Any component: useAppStore() directly' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Site Stores Overview -->
    <div class="mb-6">
      <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">
        🌸 {{ isZh ? '本站的 Pinia Stores' : 'This Site\'s Pinia Stores' }}
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          v-for="store in storesList"
          :key="store.id"
          @click="selectedStore = store.id"
          class="p-4 rounded-xl border text-left transition-all"
          :class="selectedStore === store.id 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md' 
            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">{{ store.icon }}</span>
            <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ store.name }}</span>
          </div>
          <p class="text-xs text-gray-500">{{ isZh ? store.descZh : store.descEn }}</p>
          <div class="flex flex-wrap gap-1 mt-2">
            <span 
              v-for="tag in store.tags" 
              :key="tag"
              class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              {{ tag }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Selected Store Detail -->
    <div v-if="currentStore" class="space-y-6">
      <!-- Store Structure -->
      <div class="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl">{{ currentStore.icon }}</span>
          <div>
            <h4 class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ currentStore.name }}.ts</h4>
            <p class="text-xs text-gray-500">📍 stores/{{ currentStore.name }}.ts</p>
          </div>
        </div>

        <!-- Pinia Store Anatomy -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <!-- State -->
          <div 
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="activeSection === 'state' 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
              : 'border-gray-200 dark:border-gray-700'"
            @click="activeSection = 'state'"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">📦</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">State</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ isZh ? '响应式状态数据' : 'Reactive state data' }}</p>
            <div class="mt-2 text-[10px] font-mono text-blue-600 dark:text-blue-400">
              {{ currentStore.stateVars.slice(0, 3).join(', ') }}{{ currentStore.stateVars.length > 3 ? '...' : '' }}
            </div>
          </div>

          <!-- Getters -->
          <div 
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="activeSection === 'getters' 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
              : 'border-gray-200 dark:border-gray-700'"
            @click="activeSection = 'getters'"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">🧮</span>
              <span class="font-bold text-green-600 dark:text-green-400">Getters</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ isZh ? '计算派生数据' : 'Computed derived data' }}</p>
            <div class="mt-2 text-[10px] font-mono text-green-600 dark:text-green-400">
              {{ currentStore.getters.slice(0, 2).join(', ') }}{{ currentStore.getters.length > 2 ? '...' : '' }}
            </div>
          </div>

          <!-- Actions -->
          <div 
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="activeSection === 'actions' 
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' 
              : 'border-gray-200 dark:border-gray-700'"
            @click="activeSection = 'actions'"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">⚡</span>
              <span class="font-bold text-orange-600 dark:text-orange-400">Actions</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ isZh ? '修改状态的方法' : 'Methods to modify state' }}</p>
            <div class="mt-2 text-[10px] font-mono text-orange-600 dark:text-orange-400">
              {{ currentStore.actions.slice(0, 2).join(', ') }}{{ currentStore.actions.length > 2 ? '...' : '' }}
            </div>
          </div>
        </div>

        <!-- Code Display -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-400">stores/{{ currentStore.name }}.ts</span>
            <span class="text-xs px-2 py-1 rounded" :class="{
              'bg-blue-500/20 text-blue-300': activeSection === 'state',
              'bg-green-500/20 text-green-300': activeSection === 'getters',
              'bg-orange-500/20 text-orange-300': activeSection === 'actions'
            }">
              {{ activeSection === 'state' ? 'State' : activeSection === 'getters' ? 'Getters' : 'Actions' }}
            </span>
          </div>
          <pre class="text-xs font-mono text-green-300 whitespace-pre-wrap leading-relaxed"><code>{{ currentStore.code[activeSection] }}</code></pre>
        </div>
      </div>

      <!-- Interactive Demo -->
      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700">
        <h4 class="font-bold text-purple-700 dark:text-purple-300 mb-3">
          🔬 {{ isZh ? '实时演示：修改 Store 状态' : 'Live Demo: Modify Store State' }}
        </h4>
        
        <div v-if="selectedStore === 'appStore'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Controls -->
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <span class="text-sm">🌙 isDark</span>
              <button 
                @click="demoState.isDark = !demoState.isDark"
                class="w-12 h-6 rounded-full transition-colors"
                :class="demoState.isDark ? 'bg-indigo-500' : 'bg-gray-300'"
              >
                <div class="w-5 h-5 bg-white rounded-full shadow transform transition-transform" :class="demoState.isDark ? 'translate-x-6' : 'translate-x-0.5'"></div>
              </button>
            </div>
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <span class="text-sm">🌐 lang</span>
              <select v-model="demoState.lang" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <span class="text-sm">🎨 fontSize</span>
              <select v-model="demoState.fontSize" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="small">小</option>
                <option value="normal">中</option>
                <option value="large">大</option>
              </select>
            </div>
          </div>
          
          <!-- State Preview -->
          <div class="bg-gray-900 rounded-lg p-3">
            <p class="text-xs text-gray-400 mb-2">{{ isZh ? '当前 Store 状态' : 'Current Store State' }}</p>
            <pre class="text-xs font-mono text-green-300">const appStore = useAppStore()

appStore.isDark = {{ demoState.isDark }}
appStore.lang = "{{ demoState.lang }}"
appStore.userSettings.fontSize = "{{ demoState.fontSize }}"

// Getter 派生值
appStore.t = I18N["{{ demoState.lang }}"]
appStore.fontSizeClass = "{{ fontSizeClass }}"</pre>
          </div>
        </div>

        <div v-else-if="selectedStore === 'musicStore'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <span class="text-sm">▶️ isPlaying</span>
              <button 
                @click="demoMusic.isPlaying = !demoMusic.isPlaying"
                class="px-3 py-1 rounded-lg text-sm font-bold transition-colors"
                :class="demoMusic.isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'"
              >
                {{ demoMusic.isPlaying ? 'Pause' : 'Play' }}
              </button>
            </div>
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <span class="text-sm">🔊 volume</span>
              <input type="range" v-model.number="demoMusic.volume" min="0" max="100" class="w-24" />
              <span class="text-xs w-8">{{ demoMusic.volume }}%</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <span class="text-sm">🔁 playMode</span>
              <select v-model="demoMusic.playMode" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="sequence">顺序</option>
                <option value="single">单曲</option>
                <option value="shuffle">随机</option>
              </select>
            </div>
          </div>
          
          <div class="bg-gray-900 rounded-lg p-3">
            <p class="text-xs text-gray-400 mb-2">{{ isZh ? '当前 Store 状态' : 'Current Store State' }}</p>
            <pre class="text-xs font-mono text-green-300">const musicStore = useMusicStore()

musicStore.isPlaying = {{ demoMusic.isPlaying }}
musicStore.volume = {{ demoMusic.volume / 100 }}
musicStore.playMode = "{{ demoMusic.playMode }}"

// Getter 派生值
musicStore.progress = {{ Math.round(demoMusic.volume * 0.8) }}%</pre>
          </div>
        </div>

        <div v-else class="text-center text-gray-500 py-8">
          {{ isZh ? '选择 appStore 或 musicStore 查看交互演示' : 'Select appStore or musicStore for interactive demo' }}
        </div>
      </div>

      <!-- Persist Plugin -->
      <div class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700">
        <h4 class="font-bold text-amber-700 dark:text-amber-300 mb-3">
          💾 {{ isZh ? 'Pinia 持久化插件' : 'Pinia Persist Plugin' }}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="text-xs text-gray-600 dark:text-gray-400">
            <p class="mb-2">{{ isZh ? '本站使用 pinia-plugin-persistedstate 自动保存用户设置：' : 'This site uses pinia-plugin-persistedstate to auto-save settings:' }}</p>
            <ul class="space-y-1">
              <li>✅ {{ isZh ? '语言偏好 (lang)' : 'Language preference (lang)' }}</li>
              <li>✅ {{ isZh ? '主题模式 (isDark)' : 'Theme mode (isDark)' }}</li>
              <li>✅ {{ isZh ? '字体设置 (userSettings)' : 'Font settings (userSettings)' }}</li>
              <li>✅ {{ isZh ? '壁纸选择 (currentWallpaperFilename)' : 'Wallpaper (currentWallpaperFilename)' }}</li>
            </ul>
          </div>
          <div class="bg-gray-900 rounded-lg p-3">
            <pre class="text-xs font-mono text-green-300">// stores/appStore.ts
export const useAppStore = defineStore('app', 
  () => {
    // ... state & actions
  }, 
  {
    persist: {
      pick: [
        'lang', 
        'isDark', 
        'currentWallpaperFilename', 
        'userSettings'
      ]
    }
  }
)</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Vuex vs Pinia Comparison -->
    <div class="mt-6 p-4 bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
      <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-3">
        ⚖️ {{ isZh ? 'Vuex vs Pinia 对比' : 'Vuex vs Pinia Comparison' }}
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
          <p class="font-bold text-red-600 dark:text-red-400 mb-2">❌ Vuex 4 ({{ isZh ? '旧方案' : 'Old' }})</p>
          <pre class="font-mono text-gray-600 dark:text-gray-400">// 需要 mutations
const store = createStore({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    asyncIncrement({ commit }) {
      commit('increment')
    }
  }
})</pre>
        </div>
        <div class="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
          <p class="font-bold text-green-600 dark:text-green-400 mb-2">✅ Pinia ({{ isZh ? '推荐' : 'Recommended' }})</p>
          <pre class="font-mono text-gray-600 dark:text-gray-400">// 无需 mutations，更简洁
const useCounterStore = defineStore('counter', 
  () => {
    const count = ref(0)
    
    function increment() {
      count.value++
    }
    
    return { count, increment }
  }
)</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

const selectedStore = ref('appStore')
const activeSection = ref<'state' | 'getters' | 'actions'>('state')

// Demo state for appStore
const demoState = reactive({
  isDark: false,
  lang: 'zh' as 'en' | 'zh',
  fontSize: 'normal' as 'small' | 'normal' | 'large'
})

// Demo state for musicStore
const demoMusic = reactive({
  isPlaying: false,
  volume: 70,
  playMode: 'sequence' as 'sequence' | 'single' | 'shuffle'
})

const fontSizeClass = computed(() => {
  switch (demoState.fontSize) {
    case 'small': return 'text-sm lg:text-base'
    case 'large': return 'text-xl lg:text-2xl'
    default: return 'text-base lg:text-lg'
  }
})

interface StoreInfo {
  id: string
  name: string
  icon: string
  descZh: string
  descEn: string
  tags: string[]
  stateVars: string[]
  getters: string[]
  actions: string[]
  code: {
    state: string
    getters: string
    actions: string
  }
}

const storesList: StoreInfo[] = [
  {
    id: 'appStore',
    name: 'appStore',
    icon: '⚙️',
    descZh: '全局应用设置',
    descEn: 'Global app settings',
    tags: ['lang', 'theme', 'settings', 'persist'],
    stateVars: ['lang', 'isDark', 'userSettings', 'showParticles', 'sidebarOpen', 'toastMessage'],
    getters: ['t (i18n)', 'fontSizeClass'],
    actions: ['toggleLang', 'toggleTheme', 'showToast', 'updateSettings'],
    code: {
      state: `// 📍 stores/appStore.ts - State 部分
export const useAppStore = defineStore('app', () => {
  // ===== State（响应式状态）=====
  
  // 语言设置
  const lang = ref<'en' | 'zh'>('zh')
  
  // 主题模式
  const isDark = ref(false)
  
  // 壁纸文件名（持久化）
  const currentWallpaperFilename = ref('')
  
  // 用户个性化设置
  const userSettings = ref({
    fontSize: 'normal' as 'small' | 'normal' | 'large',
    fontFamily: 'sans' as 'sans' | 'serif',
    petalSpeed: 'slow' as 'off' | 'slow' | 'fast',
    bannerMode: 'normal' as 'normal' | 'fullscreen' | 'background' | 'hide'
  })
  
  // UI 状态
  const showParticles = ref(true)
  const showSettings = ref(false)
  const sidebarOpen = ref(true)
  const toastMessage = ref('')
  // ...
})`,
      getters: `// 📍 stores/appStore.ts - Getters 部分
// ===== Getters（计算属性）=====

// 根据当前语言返回对应翻译对象
const t = computed(() => I18N[lang.value])
// 使用: {{ appStore.t.settings_title }} → "用户设置"

// 根据用户设置计算字体大小类名
const fontSizeClass = computed(() => {
  switch (userSettings.value.fontSize) {
    case 'small': 
      return 'text-sm lg:text-base leading-relaxed'
    case 'large': 
      return 'text-xl lg:text-2xl leading-loose'
    default: 
      return 'text-base lg:text-lg leading-loose'
  }
})
// 使用: <article :class="appStore.fontSizeClass">`,
      actions: `// 📍 stores/appStore.ts - Actions 部分
// ===== Actions（方法）=====

// 切换语言
function toggleLang() {
  lang.value = lang.value === 'en' ? 'zh' : 'en'
}

// 切换主题（同时更新 DOM）
function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 显示 Toast 消息
function showToast(msg: string, duration = 2000) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, duration)
}

// 更新用户设置（类型安全）
function updateSettings<K extends keyof typeof userSettings.value>(
  key: K, 
  value: typeof userSettings.value[K]
) {
  userSettings.value[key] = value
}`
    }
  },
  {
    id: 'musicStore',
    name: 'musicStore',
    icon: '🎵',
    descZh: '音乐播放器状态',
    descEn: 'Music player state',
    tags: ['playlist', 'playback', 'lyrics'],
    stateVars: ['playlist', 'currentIndex', 'isPlaying', 'currentTime', 'duration', 'volume', 'lyrics'],
    getters: ['currentTrack', 'progress', 'formattedTime'],
    actions: ['play', 'pause', 'next', 'setVolume', 'seek'],
    code: {
      state: `// 📍 stores/musicStore.ts - State 部分
export const useMusicStore = defineStore('music', () => {
  // ===== State =====
  
  // 播放列表
  const playlist = ref<MusicTrack[]>([])
  
  // 当前播放索引
  const currentIndex = ref(0)
  
  // 播放状态
  const isPlaying = ref(false)
  
  // 播放进度（秒）
  const currentTime = ref(0)
  const duration = ref(0)
  
  // 音量 (0-1)
  const volume = ref(0.7)
  const isMuted = ref(false)
  
  // 播放模式
  const playMode = ref<'sequence' | 'single' | 'shuffle'>('sequence')
  
  // 歌词相关
  const lyrics = ref<LyricLine[]>([])
  const currentLyricIndex = ref(-1)
  // ...
})`,
      getters: `// 📍 stores/musicStore.ts - Getters 部分
// ===== Getters =====

// 当前播放的曲目
const currentTrack = computed(() => 
  playlist.value[currentIndex.value] || null
)
// 使用: {{ musicStore.currentTrack?.title }}

// 播放进度百分比
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})
// 使用: <div :style="{ width: progress + '%' }">

// 格式化时间显示
const formattedCurrentTime = computed(() => 
  formatTime(currentTime.value)
)
const formattedDuration = computed(() => 
  formatTime(duration.value)
)
// 使用: {{ formattedCurrentTime }} / {{ formattedDuration }}

// 辅助函数
function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return \`\${min}:\${sec.toString().padStart(2, '0')}\`
}`,
      actions: `// 📍 stores/musicStore.ts - Actions 部分
// ===== Actions =====

// 播放指定曲目
function play(index?: number) {
  if (typeof index === 'number' && 
      index >= 0 && 
      index < playlist.value.length) {
    currentIndex.value = index
  }
  isPlaying.value = true
}

// 暂停
function pause() {
  isPlaying.value = false
}

// 切换播放/暂停
function togglePlay() {
  isPlaying.value = !isPlaying.value
}

// 下一曲（考虑播放模式）
function next() {
  if (playMode.value === 'shuffle') {
    currentIndex.value = Math.floor(
      Math.random() * playlist.value.length
    )
  } else {
    currentIndex.value = 
      (currentIndex.value + 1) % playlist.value.length
  }
}

// 设置音量
function setVolume(val: number) {
  volume.value = Math.max(0, Math.min(1, val))
  isMuted.value = val === 0
}`
    }
  },
  {
    id: 'articleStore',
    name: 'articleStore',
    icon: '📝',
    descZh: '文章交互状态',
    descEn: 'Article interactions',
    tags: ['likes', 'favorites', 'tags'],
    stateVars: ['likedArticles', 'favoriteArticles', 'selectedTags'],
    getters: ['isLiked', 'isFavorite', 'filteredArticles'],
    actions: ['toggleLike', 'toggleFavorite', 'setTags'],
    code: {
      state: `// 📍 stores/articleStore.ts - State 部分
export const useArticleStore = defineStore('article', () => {
  // ===== State =====
  
  // 点赞的文章路径集合
  const likedArticles = ref<Set<string>>(new Set())
  
  // 收藏的文章路径集合
  const favoriteArticles = ref<Set<string>>(new Set())
  
  // 当前选中的标签（用于筛选）
  const selectedTags = ref<string[]>([])
  
  // 阅读历史（可选）
  const readHistory = ref<string[]>([])
  // ...
})`,
      getters: `// 📍 stores/articleStore.ts - Getters 部分
// ===== Getters =====

// 检查文章是否已点赞
const isLiked = (path: string) => 
  likedArticles.value.has(path)

// 检查文章是否已收藏
const isFavorite = (path: string) => 
  favoriteArticles.value.has(path)

// 获取收藏列表数组
const favoriteList = computed(() => 
  Array.from(favoriteArticles.value)
)

// 统计数据
const stats = computed(() => ({
  totalLikes: likedArticles.value.size,
  totalFavorites: favoriteArticles.value.size,
  totalRead: readHistory.value.length
}))`,
      actions: `// 📍 stores/articleStore.ts - Actions 部分
// ===== Actions =====

// 切换点赞状态
function toggleLike(path: string) {
  if (likedArticles.value.has(path)) {
    likedArticles.value.delete(path)
  } else {
    likedArticles.value.add(path)
  }
}

// 切换收藏状态
function toggleFavorite(path: string) {
  if (favoriteArticles.value.has(path)) {
    favoriteArticles.value.delete(path)
  } else {
    favoriteArticles.value.add(path)
  }
}

// 设置标签筛选
function setTags(tags: string[]) {
  selectedTags.value = tags
}

// 添加到阅读历史
function addToHistory(path: string) {
  // 去重并保持最近阅读在前
  readHistory.value = [
    path,
    ...readHistory.value.filter(p => p !== path)
  ].slice(0, 50) // 最多保存 50 条
}`
    }
  }
]

const currentStore = computed(() => 
  storesList.find(s => s.id === selectedStore.value)
)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
