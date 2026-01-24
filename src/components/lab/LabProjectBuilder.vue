<script setup lang="ts">
import { ref, computed } from 'vue'

interface ProjectState {
  stage: 'wireframe' | 'html' | 'css' | 'js' | 'vue' | 'ts' | 'production'
  components: {
    departmentList: boolean
    employeeForm: boolean
    loginAuth: boolean
  }
  techStack: {
    html5: number // 掌握度0-100
    css3: number
    es6: number
    typescript: number
    vue3: number
  }
}

const projectState = ref<ProjectState>({
  stage: 'wireframe',
  components: {
    departmentList: false,
    employeeForm: false,
    loginAuth: false
  },
  techStack: {
    html5: 0,
    css3: 0,
    es6: 0,
    typescript: 0,
    vue3: 0
  }
})

const STAGES = [
  { id: 'wireframe', label: '线框图', icon: '📝' },
  { id: 'html', label: 'HTML结构', icon: '🦴' },
  { id: 'css', label: 'CSS样式', icon: '🎨' },
  { id: 'js', label: 'JS交互', icon: '⚡' },
  { id: 'vue', label: 'Vue改造', icon: '🖖' },
  { id: 'ts', label: 'TS强化', icon: '🛡️' },
  { id: 'production', label: '生产环境', icon: '🚀' }
] as const

const unlockedStageIndex = ref(0)

const currentStageIndex = computed(() => {
  return STAGES.findIndex(s => s.id === projectState.value.stage)
})

const stageSkillPresets: Record<ProjectState['stage'], Partial<ProjectState['techStack']>> = {
  wireframe: {},
  html: { html5: 35 },
  css: { html5: 45, css3: 40 },
  js: { html5: 55, css3: 55, es6: 45 },
  vue: { vue3: 45, es6: 55 },
  ts: { typescript: 55, vue3: 55 },
  production: { html5: 75, css3: 75, es6: 75, vue3: 75, typescript: 70 }
}

function applyStagePreset(stageId: ProjectState['stage']) {
  const preset = stageSkillPresets[stageId]
  if (!preset) return
  for (const [key, val] of Object.entries(preset) as Array<[keyof ProjectState['techStack'], number]>) {
    projectState.value.techStack[key] = Math.max(projectState.value.techStack[key], val)
  }
}

function canSelectStage(index: number) {
  return index <= unlockedStageIndex.value
}

function setStage(stageId: ProjectState['stage']) {
  const idx = STAGES.findIndex(s => s.id === stageId)
  if (idx === -1) return
  if (!canSelectStage(idx)) return
  projectState.value.stage = stageId
  applyStagePreset(stageId)
}

function unlockNextStage() {
  if (unlockedStageIndex.value >= STAGES.length - 1) return
  unlockedStageIndex.value += 1
  const nextStage = STAGES[unlockedStageIndex.value]
  if (!nextStage) return
  projectState.value.stage = nextStage.id
  applyStagePreset(nextStage.id)
}

const componentItems = computed(() => [
  { key: 'departmentList' as const, title: '部门管理', desc: '部门列表、新增/编辑/删除' },
  { key: 'employeeForm' as const, title: '员工管理', desc: '员工列表、表单校验、筛选' },
  { key: 'loginAuth' as const, title: '登录退出', desc: 'Token、路由守卫、权限控制' }
])

function toggleComponent(key: keyof ProjectState['components']) {
  projectState.value.components[key] = !projectState.value.components[key]
  if (projectState.value.components[key]) {
    if (key === 'departmentList') {
      projectState.value.techStack.html5 = Math.max(projectState.value.techStack.html5, 60)
      projectState.value.techStack.css3 = Math.max(projectState.value.techStack.css3, 55)
    }
    if (key === 'employeeForm') {
      projectState.value.techStack.es6 = Math.max(projectState.value.techStack.es6, 60)
      projectState.value.techStack.vue3 = Math.max(projectState.value.techStack.vue3, 60)
    }
    if (key === 'loginAuth') {
      projectState.value.techStack.typescript = Math.max(projectState.value.techStack.typescript, 60)
      projectState.value.techStack.vue3 = Math.max(projectState.value.techStack.vue3, 65)
    }
  }
}

const stageGuidance = computed(() => {
  const stage = projectState.value.stage
  const stageLabel = STAGES.find(s => s.id === stage)?.label || stage
  const hints: Record<ProjectState['stage'], { title: string; steps: string[] }> = {
    wireframe: { title: `当前：${stageLabel}`, steps: ['确定信息架构：部门 / 员工 / 登录', '画出页面线框与交互路径', '拆分组件与接口'] },
    html: { title: `当前：${stageLabel}`, steps: ['搭出页面骨架：表格/表单/弹窗', '补齐语义化与可访问性', '抽出可复用布局组件'] },
    css: { title: `当前：${stageLabel}`, steps: ['实现表格与表单布局', '做响应式：移动端断点', '补充动效与状态样式'] },
    js: { title: `当前：${stageLabel}`, steps: ['实现筛选/分页/校验交互', '接入接口请求与错误处理', '封装通用工具函数'] },
    vue: { title: `当前：${stageLabel}`, steps: ['组件化拆分与数据流', '状态管理与缓存策略', '路由与页面组织'] },
    ts: { title: `当前：${stageLabel}`, steps: ['补齐接口与数据模型类型', '抽出泛型工具类型', '约束组件 props/emit'] },
    production: { title: `当前：${stageLabel}`, steps: ['构建/部署链路', '性能优化与体积分析', '监控与错误上报'] }
  }
  return hints[stage]
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <span class="text-2xl leading-none">🏗️</span> Tlias 智能学习辅助系统构建器
      </h2>
      <p class="text-sm text-gray-500 mt-1">从零开始构建一个完整的企业级管理系统</p>
    </div>

    <!-- Timeline -->
    <div class="p-4 overflow-x-auto">
      <div class="flex items-center min-w-max gap-2">
        <div 
          v-for="(stage, index) in STAGES" 
          :key="stage.id"
          class="flex items-center"
        >
          <button 
            @click="setStage(stage.id)"
            :disabled="!canSelectStage(index)"
            class="flex flex-col items-center gap-2 px-4 py-2 rounded-xl transition-all"
            :class="[
              projectState.stage === stage.id 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' 
                : index <= unlockedStageIndex
                  ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-400 dark:bg-gray-900/50 dark:text-gray-600 cursor-not-allowed'
            ]"
          >
            <span class="text-2xl leading-none">{{ stage.icon }}</span>
            <span class="text-xs font-medium leading-tight">{{ stage.label }}</span>
          </button>
          <div 
            v-if="index < STAGES.length - 1" 
            class="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-2"
            :class="{ 'bg-blue-200 dark:bg-blue-900': index < currentStageIndex }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 min-h-[500px] border-t border-gray-200 dark:border-gray-700">
      <!-- Left: Code / Configuration -->
      <div class="lg:col-span-1 border-r border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/30">
        <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <span>⚙️</span> 项目配置
        </h3>
        
        <div class="space-y-6">
          <!-- Tech Stack Radar Placeholder -->
          <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">技能掌握度</h4>
            <div class="space-y-3">
              <div v-for="(value, key) in projectState.techStack" :key="key" class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="capitalize text-gray-600 dark:text-gray-400">{{ key }}</span>
                  <span class="font-mono text-gray-500">{{ value }}%</span>
                </div>
                <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-blue-500 rounded-full transition-all duration-500"
                    :style="{ width: `${value}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Component Status -->
          <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">核心模块状态</h4>
            <div class="space-y-2">
              <div 
                v-for="(isActive, key) in projectState.components" 
                :key="key"
                class="flex items-center gap-3 p-2 rounded-lg transition-colors"
                :class="isActive ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-50 text-gray-400 dark:bg-gray-800/50'"
              >
                <div class="w-4 h-4 rounded-full border flex items-center justify-center"
                  :class="isActive ? 'border-green-500 bg-green-500' : 'border-gray-300'"
                >
                  <span v-if="isActive" class="text-white text-[10px]">✓</span>
                </div>
                <span class="text-sm font-medium capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Preview -->
      <div class="lg:col-span-2 p-6 bg-gray-100 dark:bg-black/20 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span>👁️</span> 实时预览
          </h3>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">Desktop</button>
            <button class="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">Mobile</button>
          </div>
        </div>

        <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          <div class="p-6 space-y-6">
            <div class="flex items-start gap-4">
              <div class="text-5xl opacity-30">
                {{ STAGES.find(s => s.id === projectState.stage)?.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-extrabold text-gray-800 dark:text-gray-100">
                  {{ stageGuidance.title }}
                </h4>
                <div class="mt-2 space-y-1">
                  <div v-for="(step, idx) in stageGuidance.steps" :key="idx" class="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span class="mt-0.5 text-[10px] text-gray-400">•</span>
                    <span class="flex-1">{{ step }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div class="text-xs font-bold text-gray-600 dark:text-gray-300">主线功能模块</div>
                  <button
                    v-if="currentStageIndex === unlockedStageIndex && unlockedStageIndex < STAGES.length - 1"
                    @click="unlockNextStage"
                    class="px-3 py-1 text-xs font-bold rounded-lg bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white transition-colors"
                  >
                    进入下一阶段 →
                  </button>
                </div>
                <div class="p-4 space-y-3">
                  <button
                    v-for="item in componentItems"
                    :key="item.key"
                    @click="toggleComponent(item.key)"
                    class="w-full p-3 rounded-xl border transition-all flex items-start gap-3 text-left"
                    :class="projectState.components[item.key]
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
                      : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-900/20 dark:border-gray-700 dark:hover:bg-gray-800/30'"
                  >
                    <div class="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5"
                      :class="projectState.components[item.key] ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'"
                    >
                      <span v-if="projectState.components[item.key]" class="text-white text-xs leading-none">✓</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ item.title }}</div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{{ item.desc }}</div>
                    </div>
                    <div class="text-[10px] font-mono text-gray-400 mt-0.5">
                      {{ projectState.components[item.key] ? 'done' : 'todo' }}
                    </div>
                  </button>
                </div>
              </div>

              <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50/60 dark:bg-gray-800/30">
                <div class="text-xs font-bold text-gray-600 dark:text-gray-300 mb-3">阶段状态</div>
                <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <div class="flex justify-between">
                    <span>已解锁</span>
                    <span class="font-mono">{{ unlockedStageIndex + 1 }} / {{ STAGES.length }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>当前阶段</span>
                    <span class="font-mono">{{ currentStageIndex + 1 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>完成模块</span>
                    <span class="font-mono">
                      {{ Object.values(projectState.components).filter(Boolean).length }} / {{ Object.keys(projectState.components).length }}
                    </span>
                  </div>
                </div>
                <div class="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[var(--primary-500)] rounded-full transition-all duration-500"
                    :style="{ width: `${Math.round((Object.values(projectState.components).filter(Boolean).length / Object.keys(projectState.components).length) * 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
