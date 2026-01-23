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

const currentStageIndex = computed(() => {
  return STAGES.findIndex(s => s.id === projectState.value.stage)
})

function setStage(stageId: ProjectState['stage']) {
  projectState.value.stage = stageId
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <span>🏗️</span> Tlias 智能学习辅助系统构建器
      </h2>
      <p class="text-sm text-gray-500 mt-1">从零开始构建一个完整的企业级管理系统</p>
    </div>

    <!-- Timeline -->
    <div class="p-4 overflow-x-auto">
      <div class="flex items-center min-w-max gap-2">
        <div 
          v-for="(stage, index) in STAGES" 
          :keyিনাstage.id"
          class="flex items-center"
        >
          <button 
            @click="setStage(stage.id)"
            class="flex flex-col items-center gap-2 px-4 py-2 rounded-xl transition-all"
            :class="[
              projectState.stage === stage.id 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' 
                : index <= currentStageIndex
                  ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-400 dark:bg-gray-900/50 dark:text-gray-600 cursor-not-allowed'
            ]"
          >
            <span class="text-2xl">{{ stage.icon }}</span>
            <span class="text-xs font-medium">{{ stage.label }}</span>
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

        <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
          <!-- Placeholder Content -->
          <div class="text-center p-8">
            <div class="text-6xl mb-4 opacity-20">
              {{ STAGES.find(s => s.id === projectState.stage)?.icon }}
            </div>
            <h4 class="text-xl font-bold text-gray-400 mb-2">
              {{ STAGES.find(s => s.id === projectState.stage)?.label }} 阶段
            </h4>
            <p class="text-gray-400 text-sm max-w-xs mx-auto">
              当前处于 {{ projectState.stage }} 阶段，左侧配置尚未完成。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
