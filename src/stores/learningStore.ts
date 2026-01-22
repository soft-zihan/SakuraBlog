import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// 学习阶段定义
export const LEARNING_STAGES = [
  { id: 'foundation', name: 'Web Foundation', nameZh: '网页基础' },
  { id: 'js-basics', name: 'JS Basics', nameZh: 'JS 基础' },
  { id: 'css-layout', name: 'CSS Layout', nameZh: 'CSS 布局' },
  { id: 'js-advanced', name: 'JS Advanced', nameZh: 'JS 进阶' },
  { id: 'engineering', name: 'Engineering', nameZh: '前端工程化' },
  { id: 'vue-core', name: 'Vue Core', nameZh: 'Vue 核心' },
  { id: 'vue-advanced', name: 'Vue Advanced', nameZh: 'Vue 进阶' },
  { id: 'challenge', name: 'Challenge', nameZh: '综合挑战' }
] as const

export type StageId = typeof LEARNING_STAGES[number]['id']

// 实验室列表
export const LABS = [
  // Stage 1: Foundation
  { id: 'LabCodeEvolution', stageId: 'foundation', name: 'Code Evolution', nameZh: '代码演进史' },
  { id: 'LabHtml', stageId: 'foundation', name: 'HTML Basics', nameZh: 'HTML 基础' },
  { id: 'LabHtmlBasics', stageId: 'foundation', name: 'HTML Elements', nameZh: 'HTML 元素' },
  
  // Stage 2: JS Basics
  { id: 'LabJsBasics', stageId: 'js-basics', name: 'JS Basics', nameZh: 'JS 基础语法' },
  
  // Stage 3: CSS
  { id: 'LabCssBasics', stageId: 'css-layout', name: 'CSS Basics', nameZh: 'CSS 基础' },
  { id: 'LabCssLayout', stageId: 'css-layout', name: 'CSS Layout', nameZh: 'CSS 布局' },
  { id: 'LabCssAnimation', stageId: 'css-layout', name: 'CSS Animation', nameZh: 'CSS 动画' },
  
  // Stage 4: JS Advanced
  { id: 'LabJs', stageId: 'js-advanced', name: 'JS Core', nameZh: 'JS 核心' },
  { id: 'LabDom', stageId: 'js-advanced', name: 'DOM', nameZh: 'DOM 操作' },
  { id: 'LabAjax', stageId: 'js-advanced', name: 'Ajax', nameZh: '网络请求' },
  { id: 'LabAsync', stageId: 'js-advanced', name: 'Async', nameZh: '异步编程' },
  { id: 'LabJsAdvanced', stageId: 'js-advanced', name: 'JS Advanced', nameZh: 'JS 进阶' },
  { id: 'LabTypeScript', stageId: 'js-advanced', name: 'TypeScript', nameZh: 'TypeScript' },
  
  // Stage 5: Engineering
  { id: 'LabModuleSystem', stageId: 'engineering', name: 'Modules', nameZh: '模块系统' },
  { id: 'LabNpm', stageId: 'engineering', name: 'NPM', nameZh: '包管理' },
  { id: 'LabBuildTools', stageId: 'engineering', name: 'Build Tools', nameZh: '构建工具' },
  { id: 'LabTailwind', stageId: 'engineering', name: 'Tailwind', nameZh: 'Tailwind CSS' },
  { id: 'LabCssFrameworks', stageId: 'engineering', name: 'CSS Frameworks', nameZh: 'CSS 框架' },
  
  // Stage 6: Vue Core
  { id: 'LabReactivity', stageId: 'vue-core', name: 'Reactivity', nameZh: '响应式' },
  { id: 'LabProjectTour', stageId: 'vue-core', name: 'Project Tour', nameZh: '项目导览' },
  { id: 'LabDirectives', stageId: 'vue-core', name: 'Directives', nameZh: '指令' },
  { id: 'LabClassStyle', stageId: 'vue-core', name: 'Class & Style', nameZh: '样式绑定' },
  { id: 'LabEventHandling', stageId: 'vue-core', name: 'Events', nameZh: '事件处理' },
  { id: 'LabVueList', stageId: 'vue-core', name: 'List Rendering', nameZh: '列表渲染' },
  { id: 'LabLifecycle', stageId: 'vue-core', name: 'Lifecycle', nameZh: '生命周期' },
  
  // Stage 7: Vue Advanced
  { id: 'LabPropsEmit', stageId: 'vue-advanced', name: 'Props & Emit', nameZh: '组件通信' },
  { id: 'LabSlot', stageId: 'vue-advanced', name: 'Slots', nameZh: '插槽' },
  { id: 'LabComposables', stageId: 'vue-advanced', name: 'Composables', nameZh: '组合式函数' },
  { id: 'LabPinia', stageId: 'vue-advanced', name: 'Pinia', nameZh: '状态管理' },
  { id: 'LabProvideInject', stageId: 'vue-advanced', name: 'Provide/Inject', nameZh: '依赖注入' },
  
  // Stage 8: Challenge
  { id: 'LabQuizGame', stageId: 'challenge', name: 'Quiz Game', nameZh: '知识测验' },
  { id: 'LabMiniProject', stageId: 'challenge', name: 'Mini Project', nameZh: '迷你项目' }
] as const

export type LabId = typeof LABS[number]['id']

// 笔记列表
export const NOTES = [
  { id: '00-A-JavaScript基础语法', stageId: 'js-basics', name: 'JS Basics', nameZh: 'JavaScript基础语法' },
  { id: '00-B-CSS基础与Tailwind', stageId: 'css-layout', name: 'CSS & Tailwind', nameZh: 'CSS基础与Tailwind' },
  { id: '01-基础概念与MVVM', stageId: 'vue-core', name: 'MVVM', nameZh: '基础概念与MVVM' },
  { id: '02-响应式变量Ref', stageId: 'vue-core', name: 'Ref', nameZh: '响应式变量Ref' },
  { id: '03-指令', stageId: 'vue-core', name: 'Directives', nameZh: '指令' },
  { id: '04-A-事件处理', stageId: 'vue-core', name: 'Events', nameZh: '事件处理' },
  { id: '04-B-插槽系统', stageId: 'vue-advanced', name: 'Slots', nameZh: '插槽系统' },
  { id: '04-组件通信', stageId: 'vue-advanced', name: 'Component Communication', nameZh: '组件通信' },
  { id: '05-生命周期', stageId: 'vue-core', name: 'Lifecycle', nameZh: '生命周期' }
] as const

export const useLearningStore = defineStore('learning', () => {
  // ========== State ==========
  
  // 已完成的实验室
  const completedLabs = ref<string[]>([])
  
  // 已完成的笔记
  const completedNotes = ref<string[]>([])
  
  // 当前学习的阶段
  const currentStageIndex = ref(0)
  
  // 上次访问时间
  const lastVisitedLab = ref<string | null>(null)
  
  // ========== Getters ==========
  
  // 当前阶段
  const currentStage = computed(() => LEARNING_STAGES[currentStageIndex.value])
  
  // 各阶段完成进度
  const stageProgress = computed(() => {
    return LEARNING_STAGES.map(stage => {
      const stageLabs = LABS.filter(lab => lab.stageId === stage.id)
      const completed = stageLabs.filter(lab => completedLabs.value.includes(lab.id))
      return {
        stageId: stage.id,
        total: stageLabs.length,
        completed: completed.length,
        percent: stageLabs.length > 0 ? Math.round((completed.length / stageLabs.length) * 100) : 0
      }
    })
  })
  
  // 总体进度
  const overallProgress = computed(() => {
    const total = LABS.length
    const completed = completedLabs.value.length
    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  })
  
  // 下一个推荐学习的实验室
  const nextRecommendedLab = computed(() => {
    for (const stage of LEARNING_STAGES) {
      const stageLabs = LABS.filter(lab => lab.stageId === stage.id)
      const nextLab = stageLabs.find(lab => !completedLabs.value.includes(lab.id))
      if (nextLab) return nextLab
    }
    return null
  })
  
  // 检查是否可以进入某个阶段（前置阶段完成度>=50%）
  const canAccessStage = computed(() => {
    return (stageId: StageId) => {
      const stageIndex = LEARNING_STAGES.findIndex(s => s.id === stageId)
      if (stageIndex === 0) return true // 第一阶段始终可访问
      
      const prevStage = LEARNING_STAGES[stageIndex - 1]
      const progress = stageProgress.value.find(p => p.stageId === prevStage.id)
      return progress ? progress.percent >= 50 : false
    }
  })
  
  // ========== Actions ==========
  
  // 标记实验室完成
  function completeLab(labId: string) {
    if (!completedLabs.value.includes(labId)) {
      completedLabs.value.push(labId)
      saveProgress()
    }
  }
  
  // 取消完成标记
  function uncompleteLab(labId: string) {
    const index = completedLabs.value.indexOf(labId)
    if (index !== -1) {
      completedLabs.value.splice(index, 1)
      saveProgress()
    }
  }
  
  // 标记笔记完成
  function completeNote(noteId: string) {
    if (!completedNotes.value.includes(noteId)) {
      completedNotes.value.push(noteId)
      saveProgress()
    }
  }
  
  // 设置当前阶段
  function setCurrentStage(stageIndex: number) {
    currentStageIndex.value = Math.max(0, Math.min(stageIndex, LEARNING_STAGES.length - 1))
    saveProgress()
  }
  
  // 记录最后访问的实验室
  function setLastVisitedLab(labId: string) {
    lastVisitedLab.value = labId
    saveProgress()
  }
  
  // 重置进度
  function resetProgress() {
    completedLabs.value = []
    completedNotes.value = []
    currentStageIndex.value = 0
    lastVisitedLab.value = null
    saveProgress()
  }
  
  // 保存到 localStorage
  function saveProgress() {
    const data = {
      completedLabs: completedLabs.value,
      completedNotes: completedNotes.value,
      currentStageIndex: currentStageIndex.value,
      lastVisitedLab: lastVisitedLab.value,
      lastSaved: Date.now()
    }
    localStorage.setItem('sakura-learning-progress', JSON.stringify(data))
  }
  
  // 从 localStorage 加载
  function loadProgress() {
    try {
      const saved = localStorage.getItem('sakura-learning-progress')
      if (saved) {
        const data = JSON.parse(saved)
        completedLabs.value = data.completedLabs || []
        completedNotes.value = data.completedNotes || []
        currentStageIndex.value = data.currentStageIndex || 0
        lastVisitedLab.value = data.lastVisitedLab || null
      }
    } catch (e) {
      console.error('Failed to load learning progress:', e)
    }
  }
  
  // 初始化时加载进度
  loadProgress()
  
  return {
    // State
    completedLabs,
    completedNotes,
    currentStageIndex,
    lastVisitedLab,
    
    // Getters
    currentStage,
    stageProgress,
    overallProgress,
    nextRecommendedLab,
    canAccessStage,
    
    // Actions
    completeLab,
    uncompleteLab,
    completeNote,
    setCurrentStage,
    setLastVisitedLab,
    resetProgress,
    loadProgress
  }
})
