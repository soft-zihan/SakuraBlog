<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-[var(--primary-100)] dark:border-gray-700 shadow-xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 rounded-full text-[var(--primary-700)] dark:text-[var(--primary-300)] text-sm mb-4">
        <span>🌸</span>
        <span>{{ isZh ? 'CSS 动画' : 'CSS Animation' }}</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ isZh ? '过渡与动画' : 'Transitions & Animations' }}
      </h2>
      <p class="text-gray-500 text-sm">
        {{ isZh ? '学习 CSS 动画，理解 Sakura Notes 花瓣效果的实现' : 'Learn CSS animation, understand how Sakura Notes petal effects work' }}
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8">
      <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex gap-1 flex-wrap justify-center">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-600 text-[var(--primary-600)] dark:text-[var(--primary-300)] shadow' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="min-h-[500px]">
      
      <!-- Transition -->
      <div v-if="activeTab === 'transition'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🎚️ Transition 过渡' : '🎚️ CSS Transition' }}
          </h3>
          
          <!-- Interactive Demo -->
          <div class="flex flex-col items-center gap-6 mb-6">
            <div 
              class="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl cursor-pointer select-none"
              :style="{
                backgroundColor: transitionDemo.color,
                transform: `scale(${transitionDemo.scale}) rotate(${transitionDemo.rotate}deg)`,
                borderRadius: `${transitionDemo.radius}px`,
                transition: `all ${transitionDemo.duration}s ${transitionDemo.timing}`
              }"
              @mouseenter="transitionDemo.scale = 1.2; transitionDemo.rotate = 10"
              @mouseleave="transitionDemo.scale = 1; transitionDemo.rotate = 0"
            >
              🌸
            </div>
            
            <div class="text-sm text-gray-500">{{ isZh ? '鼠标悬停查看效果' : 'Hover to see effect' }}</div>
          </div>

          <!-- Controls -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="text-xs text-gray-500 block mb-1">Duration (s)</label>
              <input type="range" v-model.number="transitionDemo.duration" min="0.1" max="2" step="0.1" class="w-full">
              <div class="text-xs text-center">{{ transitionDemo.duration }}s</div>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Border Radius</label>
              <input type="range" v-model.number="transitionDemo.radius" min="0" max="64" step="4" class="w-full">
              <div class="text-xs text-center">{{ transitionDemo.radius }}px</div>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Timing</label>
              <select v-model="transitionDemo.timing" class="w-full px-2 py-1 rounded border dark:bg-gray-700 text-xs">
                <option value="ease">ease</option>
                <option value="linear">linear</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Color</label>
              <input type="color" v-model="transitionDemo.color" class="w-full h-8 rounded cursor-pointer">
            </div>
          </div>
        </div>

        <!-- Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <pre class="text-sm text-gray-100 font-mono"><code>{{ transitionCode }}</code></pre>
        </div>
      </div>

      <!-- Keyframes -->
      <div v-else-if="activeTab === 'keyframes'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-[var(--primary-50)] to-purple-50 dark:from-[var(--primary-900)]/20 dark:to-purple-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🎬 @keyframes 动画' : '🎬 @keyframes Animation' }}
          </h3>
          
          <!-- Animation Showcase -->
          <div class="flex justify-center items-center gap-8 mb-6 h-40">
            <div class="text-center">
              <div class="text-4xl animate-bounce mb-2">🌸</div>
              <div class="text-xs text-gray-500">bounce</div>
            </div>
            <div class="text-center">
              <div class="text-4xl animate-spin mb-2">⚙️</div>
              <div class="text-xs text-gray-500">spin</div>
            </div>
            <div class="text-center">
              <div class="text-4xl animate-pulse mb-2">💗</div>
              <div class="text-xs text-gray-500">pulse</div>
            </div>
            <div class="text-center">
              <div class="text-4xl animate-ping mb-2">📍</div>
              <div class="text-xs text-gray-500">ping</div>
            </div>
          </div>

          <!-- Custom Animation Builder -->
          <div class="bg-white dark:bg-gray-700 rounded-xl p-4">
            <h4 class="font-bold text-sm mb-3">{{ isZh ? '自定义动画' : 'Custom Animation' }}</h4>
            <div class="flex items-center gap-4 mb-4">
              <div 
                class="w-16 h-16 bg-[var(--primary-400)] rounded-xl flex items-center justify-center text-2xl"
                :style="{ animation: `${customAnimation.name} ${customAnimation.duration}s ${customAnimation.timing} infinite` }"
              >
                🌸
              </div>
              <div class="flex-1 grid grid-cols-3 gap-2">
                <select v-model="customAnimation.name" class="px-2 py-1 rounded border dark:bg-gray-600 text-xs">
                  <option value="float">float</option>
                  <option value="shake">shake</option>
                  <option value="swing">swing</option>
                </select>
                <input type="number" v-model.number="customAnimation.duration" min="0.5" max="5" step="0.5" class="px-2 py-1 rounded border dark:bg-gray-600 text-xs" placeholder="duration">
                <select v-model="customAnimation.timing" class="px-2 py-1 rounded border dark:bg-gray-600 text-xs">
                  <option value="linear">linear</option>
                  <option value="ease-in-out">ease-in-out</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <pre class="text-sm text-gray-100 font-mono"><code>{{ keyframesCode }}</code></pre>
        </div>
      </div>

      <!-- Petal Effect -->
      <div v-else-if="activeTab === 'petal'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-[var(--primary-50)] to-[var(--primary-50)] dark:from-[var(--primary-900)]/20 dark:to-[var(--primary-900)]/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '🌸 Sakura Notes 花瓣效果解析' : '🌸 Sakura Notes Petal Effect Analysis' }}
          </h3>
          
          <!-- Mini Petal Demo -->
          <div class="relative bg-gradient-to-b from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800 rounded-xl h-48 overflow-hidden mb-4">
            <div 
              v-for="petal in demoPetals" 
              :key="petal.id"
              class="absolute text-2xl transition-all duration-100"
              :style="{
                left: `${petal.x}%`,
                top: `${petal.y}%`,
                transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
                opacity: petal.opacity
              }"
            >
              🌸
            </div>
            <div class="absolute bottom-2 right-2 text-xs text-sky-700 dark:text-sky-300 bg-white/50 dark:bg-black/30 px-2 py-1 rounded">
              {{ isZh ? '花瓣数量' : 'Petals' }}: {{ demoPetals.length }}
            </div>
          </div>

          <div class="flex justify-center gap-3">
            <button 
              @click="togglePetalAnimation"
              class="px-4 py-2 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg text-sm transition-all"
            >
              {{ petalAnimating ? (isZh ? '暂停' : 'Pause') : (isZh ? '开始' : 'Start') }}
            </button>
            <button 
              @click="addPetal"
              class="px-4 py-2 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg text-sm transition-all"
            >
              {{ isZh ? '添加花瓣' : 'Add Petal' }}
            </button>
            <button 
              @click="resetPetals"
              class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-all"
            >
              {{ isZh ? '重置' : 'Reset' }}
            </button>
          </div>
        </div>

        <!-- Petal Physics Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <h4 class="font-bold text-sm text-gray-800 dark:text-gray-100 mb-2">📐 {{ isZh ? '花瓣物理属性' : 'Petal Physics' }}</h4>
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between"><span>baseSpeedY:</span><span class="text-blue-500">1-2 px/frame</span></div>
              <div class="flex justify-between"><span>baseSpeedX:</span><span class="text-green-500">-0.5~0.5 px/frame</span></div>
              <div class="flex justify-between"><span>swayAmp:</span><span class="text-purple-500">0-2 (摆动幅度)</span></div>
              <div class="flex justify-between"><span>swayFreq:</span><span class="text-orange-500">0.01-0.03</span></div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <h4 class="font-bold text-sm text-gray-800 dark:text-gray-100 mb-2">🌀 {{ isZh ? '漩涡效果' : 'Vortex Effect' }}</h4>
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between"><span>vortexRadius:</span><span class="text-blue-500">280 px</span></div>
              <div class="flex justify-between"><span>maxStrength:</span><span class="text-red-500">220</span></div>
              <div class="flex justify-between"><span>trigger:</span><span class="text-green-500">long press 200ms</span></div>
              <div class="flex justify-between"><span>motion:</span><span class="text-purple-500">tangent + radial</span></div>
            </div>
          </div>
        </div>

        <!-- Source Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-green-400">📍 components/petal/usePetals.ts</span>
          </div>
          <pre class="text-sm text-gray-100 font-mono"><code>{{ petalCode }}</code></pre>
        </div>
      </div>

      <!-- Performance -->
      <div v-else-if="activeTab === 'performance'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ isZh ? '⚡ 动画性能优化' : '⚡ Animation Performance' }}
          </h3>

          <!-- Performance Tips -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 border-green-300 dark:border-green-700">
              <div class="text-green-600 dark:text-green-400 font-bold mb-2">✅ {{ isZh ? '推荐' : 'Recommended' }}</div>
              <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">transform</code> {{ isZh ? '位移/缩放/旋转' : 'translate/scale/rotate' }}</li>
                <li>• <code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">opacity</code> {{ isZh ? '透明度' : 'opacity' }}</li>
                <li>• <code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">will-change</code> {{ isZh ? '提示GPU' : 'GPU hint' }}</li>
                <li>• <code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">requestAnimationFrame</code></li>
              </ul>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 border-red-300 dark:border-red-700">
              <div class="text-red-600 dark:text-red-400 font-bold mb-2">❌ {{ isZh ? '避免' : 'Avoid' }}</div>
              <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">width/height</code> {{ isZh ? '触发重排' : 'triggers reflow' }}</li>
                <li>• <code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">top/left</code> {{ isZh ? '触发重排' : 'triggers reflow' }}</li>
                <li>• <code class="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">box-shadow</code> {{ isZh ? '开销大' : 'expensive' }}</li>
                <li>• {{ isZh ? '过多 DOM 元素同时动画' : 'Too many DOM elements animating' }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Code -->
        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-green-400">📍 {{ isZh ? '性能优化示例' : 'Performance optimization example' }}</span>
          </div>
          <pre class="text-sm text-gray-100 font-mono"><code>{{ performanceCode }}</code></pre>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { I18N } from '../../../constants'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const t = computed(() => I18N[props.lang])
const isZh = computed(() => props.lang === 'zh')

const activeTab = ref('transition')
const tabs = computed(() => [
  { id: 'transition', icon: '🎚️', label: 'Transition' },
  { id: 'keyframes', icon: '🎬', label: 'Keyframes' },
  { id: 'petal', icon: '🌸', label: isZh.value ? '花瓣效果' : 'Petal Effect' },
  { id: 'performance', icon: '⚡', label: isZh.value ? '性能' : 'Performance' }
])

// Transition Demo
const transitionDemo = reactive({
  scale: 1,
  rotate: 0,
  radius: 16,
  duration: 0.3,
  timing: 'ease',
  color: 'var(--primary-500)'
})

const transitionCode = computed(() => `.element {
  /* 基础样式 */
  background-color: ${transitionDemo.color};
  border-radius: ${transitionDemo.radius}px;
  
  /* 过渡效果 */
  transition: all ${transitionDemo.duration}s ${transitionDemo.timing};
}

.element:hover {
  transform: scale(1.2) rotate(10deg);
}`)

// Keyframes Demo
const customAnimation = reactive({
  name: 'float',
  duration: 2,
  timing: 'ease-in-out'
})

const keyframesCode = `/* 定义关键帧动画 */
@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

@keyframes swing {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

/* 应用动画 */
.petal {
  animation: float 2s ease-in-out infinite;
}`

// Petal Demo
interface DemoPetal {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
  speedY: number
  speedX: number
}

const demoPetals = ref<DemoPetal[]>([])
const petalAnimating = ref(false)
let petalAnimationFrame: number | null = null
let nextPetalId = 0

const createDemoPetal = (): DemoPetal => ({
  id: nextPetalId++,
  x: Math.random() * 100,
  y: -10,
  rotation: Math.random() * 360,
  scale: Math.random() * 0.5 + 0.5,
  opacity: Math.random() * 0.4 + 0.6,
  speedY: Math.random() * 0.5 + 0.3,
  speedX: (Math.random() - 0.5) * 0.3
})

const addPetal = () => {
  if (demoPetals.value.length < 20) {
    demoPetals.value.push(createDemoPetal())
  }
}

const resetPetals = () => {
  demoPetals.value = []
  nextPetalId = 0
}

const updatePetals = () => {
  for (const petal of demoPetals.value) {
    petal.y += petal.speedY
    petal.x += petal.speedX + Math.sin(petal.y * 0.05) * 0.2
    petal.rotation += 1
    
    if (petal.y > 110) {
      petal.y = -10
      petal.x = Math.random() * 100
    }
  }
  
  if (petalAnimating.value) {
    petalAnimationFrame = requestAnimationFrame(updatePetals)
  }
}

const togglePetalAnimation = () => {
  petalAnimating.value = !petalAnimating.value
  if (petalAnimating.value) {
    if (demoPetals.value.length === 0) {
      for (let i = 0; i < 5; i++) addPetal()
    }
    updatePetals()
  } else if (petalAnimationFrame) {
    cancelAnimationFrame(petalAnimationFrame)
  }
}

onUnmounted(() => {
  if (petalAnimationFrame) {
    cancelAnimationFrame(petalAnimationFrame)
  }
})

const petalCode = `// 📍 components/petal/usePetals.ts

export interface Petal {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
  
  // 物理属性
  baseSpeedY: number    // 下落速度
  baseSpeedX: number    // 水平漂移
  swayAmp: number       // 摆动幅度
  swayFreq: number      // 摆动频率
  
  // 状态
  isDragging: boolean   // 是否被拖拽
  isLanded: boolean     // 是否已落地
  isInVortex: boolean   // 是否在漩涡中
}

// 创建花瓣
export const createPetal = (yStart = -50): Petal => ({
  id: nextId++,
  x: Math.random() * window.innerWidth,
  y: yStart,
  rotation: Math.random() * 360,
  scale: Math.random() * 0.5 + 0.8,
  
  baseSpeedY: Math.random() * 1 + 1,
  baseSpeedX: (Math.random() - 0.5) * 1,
  swayAmp: Math.random() * 2,
  swayFreq: Math.random() * 0.02 + 0.01,
  // ...
})

// 更新花瓣位置（每帧调用）
export function updatePetals(petals: Petal[], opts) {
  for (const p of petals) {
    if (p.isDragging || p.isLanded) continue
    
    // 漩涡物理 - 使用切向 + 径向运动
    if (vortexState.value.active) {
      const dx = vortexState.value.x - p.x
      const dy = vortexState.value.y - p.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // 距离越近，吸力越强
      const influence = (1 - distance / vortexRadius) ** 2
      // ...
    }
  }
}`

const performanceCode = `/* ✅ 推荐：只动画 transform 和 opacity */
.petal {
  /* 提示浏览器这个元素会变化 */
  will-change: transform, opacity;
  
  /* 使用 transform 而不是 top/left */
  transform: translate3d(var(--x), var(--y), 0) rotate(var(--r));
}

/* JavaScript 中使用 requestAnimationFrame */
function animate() {
  // 更新位置
  for (const petal of petals) {
    petal.y += petal.speedY
    petal.element.style.setProperty('--y', petal.y + 'px')
  }
  
  // 下一帧继续
  requestAnimationFrame(animate)
}

/* 批量更新 DOM，减少重排 */
function updateAllPetals() {
  // 先读取所有需要的值
  const updates = petals.map(p => calculateNewPosition(p))
  
  // 再一次性写入
  updates.forEach((update, i) => {
    petals[i].element.style.transform = update.transform
  })
}`
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

@keyframes swing {
  0%, 100% { transform: rotate(-10deg); transform-origin: top center; }
  50% { transform: rotate(10deg); transform-origin: top center; }
}
</style>
