import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

import { LEARNING_STAGES, LABS, NOTES, type StageId } from '../labs/labCatalog'

export { LEARNING_STAGES, LABS, NOTES } from '../labs/labCatalog'
export type { StageId, LabId } from '../labs/labCatalog'

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
  
  // 检查是否可以进入某个阶段（默认自由探索，不再阻断访问）
  const canAccessStage = computed(() => {
    return (stageId: StageId) => {
      void stageId
      return true
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
