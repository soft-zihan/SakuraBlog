<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/30">
      <h2 class="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-2">
        🏗️ HTML 语义化与可访问性
      </h2>
      <p class="text-indigo-600 dark:text-indigo-300">
        HTML 不仅仅是显示内容，更是赋予内容“意义”。语义化标签有助于 SEO（搜索引擎优化）和 Accessibility（无障碍访问）。
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 font-medium transition-colors rounded-t-lg flex items-center gap-2"
        :class="activeTab === tab.id 
          ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-b-0 border-gray-200 dark:border-gray-700 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
      >
        <span>{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 1: Semantic Structure Game -->
    <div v-if="activeTab === 'game'" class="animate-fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Wireframe (Drop Targets) -->
          <div class="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 relative min-h-[500px] flex flex-col gap-4">
            <h3 class="absolute -top-3 left-4 bg-gray-50 dark:bg-gray-900 px-2 text-sm font-bold text-gray-400">网页布局线框图</h3>
            
            <!-- Header Area -->
            <div 
              class="h-24 rounded-lg border-2 border-dashed transition-all flex items-center justify-center relative"
              :class="getZoneClass('header')"
              @click="selectZone('header')"
            >
              <span class="text-gray-400 font-bold pointer-events-none">页眉区域 (Logo, 搜索)</span>
              <div v-if="assignments.header" class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-mono font-bold rounded-lg border-2 border-indigo-500">
                &lt;{{ assignments.header }}&gt;
              </div>
            </div>

            <!-- Nav Area -->
            <div 
              class="h-12 rounded-lg border-2 border-dashed transition-all flex items-center justify-center relative"
              :class="getZoneClass('nav')"
              @click="selectZone('nav')"
            >
              <span class="text-gray-400 font-bold pointer-events-none">导航菜单</span>
              <div v-if="assignments.nav" class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-mono font-bold rounded-lg border-2 border-indigo-500">
                &lt;{{ assignments.nav }}&gt;
              </div>
            </div>

            <div class="flex flex-1 gap-4">
              <!-- Main Content -->
              <div class="flex-[2] flex flex-col gap-4">
                 <div 
                  class="flex-1 rounded-lg border-2 border-dashed transition-all flex items-center justify-center relative p-4"
                  :class="getZoneClass('main')"
                  @click="selectZone('main')"
                >
                  <span class="text-gray-400 font-bold pointer-events-none">主要内容区域</span>
                  <div v-if="assignments.main" class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-mono font-bold rounded-lg border-2 border-indigo-500 z-10">
                    &lt;{{ assignments.main }}&gt;
                  </div>
                  
                  <!-- Nested Article (Only visible if main is assigned or always?) Let's keep it simple for now -->
                  <div class="w-full h-full border-2 border-dotted border-gray-300 rounded m-4 flex items-center justify-center relative opacity-50">
                     <span class="text-xs text-gray-400">文章内容...</span>
                  </div>
                </div>
              </div>

              <!-- Sidebar -->
              <div 
                class="flex-1 rounded-lg border-2 border-dashed transition-all flex items-center justify-center relative"
                :class="getZoneClass('aside')"
                @click="selectZone('aside')"
              >
                <span class="text-gray-400 font-bold pointer-events-none">侧边栏 (广告, 推荐)</span>
                <div v-if="assignments.aside" class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-mono font-bold rounded-lg border-2 border-indigo-500">
                  &lt;{{ assignments.aside }}&gt;
                </div>
              </div>
            </div>

            <!-- Footer Area -->
            <div 
              class="h-20 rounded-lg border-2 border-dashed transition-all flex items-center justify-center relative"
              :class="getZoneClass('footer')"
              @click="selectZone('footer')"
            >
              <span class="text-gray-400 font-bold pointer-events-none">页脚 (版权, 链接)</span>
              <div v-if="assignments.footer" class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-mono font-bold rounded-lg border-2 border-indigo-500">
                &lt;{{ assignments.footer }}&gt;
              </div>
            </div>

          </div>

          <!-- Toolbox -->
          <div class="w-full lg:w-64 flex flex-col gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-4">可用标签</h3>
              <p class="text-xs text-gray-500 mb-4">点击左侧区域，然后选择正确的标签。</p>
              
              <div class="grid grid-cols-2 gap-2">
                <button 
                  v-for="tag in availableTags" 
                  :key="tag"
                  @click="assignTag(tag)"
                  :disabled="!selectedZone || isTagUsed(tag)"
                  class="p-2 rounded border font-mono text-sm transition-all text-center"
                  :class="[
                    isTagUsed(tag) 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                      : !selectedZone 
                        ? 'bg-white border-gray-200 text-gray-600 opacity-50 cursor-not-allowed'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400 hover:scale-105 shadow-sm cursor-pointer'
                  ]"
                >
                  &lt;{{ tag }}&gt;
                </button>
              </div>

              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                 <div class="flex justify-between items-center mb-2">
                   <span class="text-sm font-bold text-gray-600">完成度</span>
                   <span class="text-sm font-bold text-indigo-600">{{ progress }}%</span>
                 </div>
                 <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div class="h-full bg-indigo-500 transition-all duration-500" :style="{ width: `${progress}%` }"></div>
                 </div>
                 <p v-if="progress === 100" class="text-xs text-green-600 font-bold mt-2 text-center animate-bounce">
                   🎉 太棒了！结构完美！
                 </p>
                 <button v-if="progress === 100" @click="resetGame" class="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg transition-colors">
                   重置游戏
                 </button>
              </div>
            </div>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
              <strong>💡 提示：</strong>
              <ul class="list-disc list-inside mt-2 space-y-1">
                <li><code class="bg-blue-100/70 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-200/70 dark:border-blue-800/40 font-mono text-[11px]">&lt;header&gt;</code> 通常包含 Logo 和导航</li>
                <li><code class="bg-blue-100/70 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-200/70 dark:border-blue-800/40 font-mono text-[11px]">&lt;main&gt;</code> 是页面的核心内容</li>
                <li><code class="bg-blue-100/70 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-200/70 dark:border-blue-800/40 font-mono text-[11px]">&lt;aside&gt;</code> 是与主要内容相关但独立的部分</li>
                <li><code class="bg-blue-100/70 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-200/70 dark:border-blue-800/40 font-mono text-[11px]">&lt;nav&gt;</code> 用于主要导航链接</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: SEO Checker -->
    <div v-else-if="activeTab === 'seo'" class="animate-fade-in">
       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <!-- Editor -->
         <div class="flex flex-col h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
           <div class="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
             <span class="text-xs font-bold text-gray-600 dark:text-gray-400">index.html</span>
             <button @click="resetSeoCode" class="text-xs text-blue-600 hover:underline">重置代码</button>
           </div>
           <textarea 
             v-model="seoHtml" 
             class="flex-1 bg-white dark:bg-gray-800 p-4 font-mono text-sm resize-none focus:outline-none text-gray-800 dark:text-gray-200 leading-relaxed"
             spellcheck="false"
           ></textarea>
         </div>

         <!-- Analysis Report -->
         <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-[500px]">
           <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
             <span>📊</span> SEO 分析报告
           </h3>
           
           <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
             <!-- Score -->
             <div class="flex items-center gap-4 mb-6">
               <div class="relative w-20 h-20 flex items-center justify-center rounded-full border-4"
                 :class="seoScore >= 90 ? 'border-green-500 text-green-600' : seoScore >= 60 ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-600'"
               >
                 <span class="text-2xl font-bold">{{ seoScore }}</span>
               </div>
               <div>
                 <div class="text-sm text-gray-500">总评分</div>
                 <div class="font-bold text-gray-800 dark:text-gray-200">
                   {{ seoScore >= 90 ? '非常棒！' : seoScore >= 60 ? '还不错，有优化空间' : '需要改进' }}
                 </div>
               </div>
             </div>

             <!-- Checklist -->
             <div class="space-y-3">
               <div v-for="(item, idx) in seoChecklist" :key="idx" 
                 class="flex items-start gap-3 p-3 rounded-lg border transition-all"
                 :class="item.passed ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'"
               >
                 <div class="mt-0.5">
                   <span v-if="item.passed" class="text-green-600">✅</span>
                   <span v-else class="text-red-600">❌</span>
                 </div>
                 <div>
                   <div class="text-sm font-bold" :class="item.passed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'">{{ item.label }}</div>
                   <div class="text-xs mt-1" :class="item.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">{{ item.message }}</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
    </div>
    
    <!-- Tab 3: Accessibility -->
    <div v-if="activeTab === 'a11y'" class="animate-fade-in">
       <!-- Placeholder for now, can be expanded -->
       <div class="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
         <div class="text-6xl mb-4">♿</div>
         <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">可访问性可视化</h3>
         <p class="text-gray-500 max-w-md mx-auto mb-6">
           了解屏幕阅读器如何解析您的网页。ARIA 属性、语义化标签对于视障用户至关重要。
         </p>
         <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg inline-block text-left max-w-lg">
            <h4 class="font-bold text-yellow-800 dark:text-yellow-200 mb-2 text-sm">ARIA 核心原则</h4>
            <ul class="list-disc list-inside text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>首选原生语义化标签 (使用 button 而不是 div onclick)</li>
              <li>img 标签必须有 alt 属性</li>
              <li>表单元素必须有 label 关联</li>
              <li>使用 role 属性增强语义</li>
            </ul>
         </div>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const tabs = [
  { id: 'game', label: '语义化拼图', icon: '🧩' },
  { id: 'seo', label: 'SEO 检查器', icon: '🔍' },
  { id: 'a11y', label: '可访问性', icon: '♿' }
]

const activeTab = ref('game')

// === Game Logic ===
const selectedZone = ref<string | null>(null)
const assignments = reactive<Record<string, string>>({
  header: '',
  nav: '',
  main: '',
  aside: '',
  footer: ''
})

const availableTags = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section', 'div']

const correctMapping: Record<string, string> = {
  header: 'header',
  nav: 'nav',
  main: 'main',
  aside: 'aside',
  footer: 'footer'
}

function selectZone(zone: string) {
  selectedZone.value = zone
}

function getZoneClass(zone: string) {
  if (selectedZone.value === zone) {
    return 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md scale-[1.01]'
  }
  if (assignments[zone]) {
    return 'border-green-500 bg-green-50 dark:bg-green-900/10'
  }
  return 'border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-800'
}

function assignTag(tag: string) {
  if (selectedZone.value) {
    assignments[selectedZone.value] = tag
    selectedZone.value = null
  }
}

function isTagUsed(tag: string) {
  return Object.values(assignments).includes(tag)
}

const progress = computed(() => {
  let correct = 0
  const total = 5
  for (const [zone, tag] of Object.entries(assignments)) {
    if (tag === correctMapping[zone]) correct++
  }
  return (correct / total) * 100
})

function resetGame() {
  for (const key of Object.keys(assignments)) {
    assignments[key] = ''
  }
  selectedZone.value = null
}

// === SEO Logic ===
const defaultSeoHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>我的网页标题</title>
    <meta name="description" content="这是一个关于HTML学习的网页">
</head>
<body>
    <h1>欢迎来到我的网站</h1>
    <img src="logo.png" alt="网站Logo">
    <p>这里是正文内容...</p>
</body>
</html>`

const seoHtml = ref(defaultSeoHtml)

function resetSeoCode() {
  seoHtml.value = defaultSeoHtml
}

const seoChecklist = computed(() => {
  const code = seoHtml.value
  const checks = []
  
  // Title check
  const hasTitle = /<title>[\s\S]*?<\/title>/i.test(code) && !/<title>\s*<\/title>/i.test(code)
  checks.push({
    label: '页面标题 (Title)',
    passed: hasTitle,
    message: hasTitle ? '已包含标题标签' : '缺少 <title> 标签或内容为空'
  })

  // Meta Description
  const hasMetaDesc = /<meta\s+name=["']description["']\s+content=["'].+?["']\s*\/?>/i.test(code)
  checks.push({
    label: 'Meta 描述',
    passed: hasMetaDesc,
    message: hasMetaDesc ? '已包含 meta description' : '缺少 meta description 标签，影响搜索摘要'
  })

  // H1 Check
  const h1Count = (code.match(/<h1[\s\S]*?>/gi) || []).length
  checks.push({
    label: 'H1 标签',
    passed: h1Count === 1,
    message: h1Count === 1 ? '正确：页面有一个 H1' : (h1Count === 0 ? '缺少 H1 标签' : 'H1 标签过多（建议每个页面仅一个）')
  })

  // Image Alt
  const imgTags = code.match(/<img[\s\S]*?>/gi) || []
  const missingAlt = imgTags.some(img => !/alt=["'].*?["']/i.test(img))
  checks.push({
    label: '图片 Alt 属性',
    passed: imgTags.length > 0 && !missingAlt,
    message: imgTags.length === 0 ? '没有图片' : (missingAlt ? '有图片缺少 alt 属性' : '所有图片都有 alt 属性')
  })

  return checks
})

const seoScore = computed(() => {
  const passed = seoChecklist.value.filter(c => c.passed).length
  const total = seoChecklist.value.length
  return Math.round((passed / total) * 100)
})

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
