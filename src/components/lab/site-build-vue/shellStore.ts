import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { safeGetJson, safeSetJson } from '../../../utils/storage'

export type ShellModalKind = 'search' | 'settings' | 'music' | 'download'

export type ShellViewMode = 'latest' | 'files' | 'lab'

export type ShellStage = 'foundation' | 'css' | 'js'

export type ShellTool = 'dashboard' | 'build' | 'source-code' | null

export type ShellBreadcrumb = {
  name: string
  path: string
}

export type ShellAction =
  | { type: 'toggle-sidebar' }
  | { type: 'toggle-right-sidebar' }
  | { type: 'toggle-theme' }
  | { type: 'set-view-mode'; mode: ShellViewMode }
  | { type: 'navigate'; path: string }
  | { type: 'select-tool'; tool: ShellTool }
  | { type: 'set-stage'; stage: ShellStage }
  | { type: 'set-active-step'; stepId: string }
  | { type: 'toggle-step-done'; stepId: string }
  | { type: 'open-search' }
  | { type: 'open-settings' }
  | { type: 'open-music' }
  | { type: 'open-download' }
  | { type: 'open-modal'; kind: ShellModalKind }
  | { type: 'close-modal' }

export const useSiteBuildShellStore = defineStore('site-build-shell', () => {
  const STORAGE_KEY = 'site-build-vue:shell-state:v1'

  const isDark = ref(false)
  const sidebarOpen = ref(true)
  const rightSidebarOpen = ref(false)
  const viewMode = ref<ShellViewMode>('lab')
  const currentTool = ref<ShellTool>('dashboard')
  const stage = ref<ShellStage>('foundation')
  const activeStepId = ref('foundation:intro')
  const doneSteps = ref<Record<string, boolean>>({})
  const stepChecklist = ref<Record<string, { tasks?: Record<string, boolean>; checks?: Record<string, boolean> }>>({})
  const quizAnswers = ref<Record<string, number>>({})
  const toastMessage = ref('')

  const activeModal = ref<ShellModalKind | null>(null)
  const modalOpen = computed(() => activeModal.value != null)

  const breadcrumbs = computed<ShellBreadcrumb[]>(() => {
    const mode = viewMode.value
    if (mode !== 'lab') return [{ name: mode, path: mode }]
    const crumbs: ShellBreadcrumb[] = [
      { name: 'lab', path: 'lab' },
      { name: stage.value, path: `lab/${stage.value}` }
    ]
    if (currentTool.value) crumbs.push({ name: currentTool.value, path: `lab/${stage.value}/${currentTool.value}` })
    return crumbs
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setRightSidebarOpen(open: boolean) {
    rightSidebarOpen.value = open
  }

  function toggleRightSidebar() {
    rightSidebarOpen.value = !rightSidebarOpen.value
  }

  function setViewMode(mode: ShellViewMode) {
    viewMode.value = mode
    if (mode !== 'lab') currentTool.value = null
    else if (!currentTool.value) currentTool.value = 'dashboard'
  }

  function selectTool(tool: ShellTool) {
    currentTool.value = tool
    if (tool) viewMode.value = 'lab'
  }

  function setStage(next: ShellStage) {
    stage.value = next
    viewMode.value = 'lab'
    if (!currentTool.value) currentTool.value = 'dashboard'
  }

  function setActiveStep(stepId: string) {
    activeStepId.value = stepId
    viewMode.value = 'lab'
  }

  function toggleStepDone(stepId: string) {
    doneSteps.value = { ...doneSteps.value, [stepId]: !doneSteps.value[stepId] }
  }

  function isStepTaskChecked(stepId: string, taskText: string) {
    const step = stepChecklist.value[stepId]
    const tasks = step?.tasks
    return !!tasks?.[taskText]
  }

  function isStepCheckChecked(stepId: string, checkText: string) {
    const step = stepChecklist.value[stepId]
    const checks = step?.checks
    return !!checks?.[checkText]
  }

  function setStepTaskChecked(stepId: string, taskText: string, checked: boolean) {
    const prev = stepChecklist.value[stepId] || {}
    const tasks = { ...(prev.tasks || {}), [taskText]: !!checked }
    stepChecklist.value = { ...stepChecklist.value, [stepId]: { ...prev, tasks } }
  }

  function setStepCheckChecked(stepId: string, checkText: string, checked: boolean) {
    const prev = stepChecklist.value[stepId] || {}
    const checks = { ...(prev.checks || {}), [checkText]: !!checked }
    stepChecklist.value = { ...stepChecklist.value, [stepId]: { ...prev, checks } }
  }

  function getQuizAnswer(questionId: string) {
    const v = quizAnswers.value[questionId]
    return typeof v === 'number' && Number.isFinite(v) ? v : null
  }

  function setQuizAnswer(questionId: string, answerIndex: number) {
    const idx = Math.max(0, Math.floor(answerIndex))
    quizAnswers.value = { ...quizAnswers.value, [questionId]: idx }
  }

  function openModal(kind: ShellModalKind) {
    activeModal.value = kind
  }

  function closeModal() {
    activeModal.value = null
  }

  function showToast(message: string, duration = 2400) {
    const captured = message
    toastMessage.value = message
    window.setTimeout(() => {
      if (toastMessage.value === captured) toastMessage.value = ''
    }, duration)
  }

  function isViewMode(x: unknown): x is ShellViewMode {
    return x === 'latest' || x === 'files' || x === 'lab'
  }

  function isTool(x: unknown): x is ShellTool {
    return x === 'dashboard' || x === 'build' || x === 'source-code' || x === null
  }

  function isStage(x: unknown): x is ShellStage {
    return x === 'foundation' || x === 'css' || x === 'js'
  }

  const persisted = safeGetJson<{
    isDark?: unknown
    sidebarOpen?: unknown
    rightSidebarOpen?: unknown
    viewMode?: unknown
    currentTool?: unknown
    stage?: unknown
    activeStepId?: unknown
    doneSteps?: unknown
    stepChecklist?: unknown
    quizAnswers?: unknown
  }>(STORAGE_KEY)

  if (persisted) {
    if (typeof persisted.isDark === 'boolean') isDark.value = persisted.isDark
    if (typeof persisted.sidebarOpen === 'boolean') sidebarOpen.value = persisted.sidebarOpen
    if (typeof persisted.rightSidebarOpen === 'boolean') rightSidebarOpen.value = persisted.rightSidebarOpen
    if (isViewMode(persisted.viewMode)) viewMode.value = persisted.viewMode
    if (isTool(persisted.currentTool)) currentTool.value = persisted.currentTool
    if (isStage(persisted.stage)) stage.value = persisted.stage
    if (typeof persisted.activeStepId === 'string' && persisted.activeStepId.trim()) activeStepId.value = persisted.activeStepId
    if (persisted.doneSteps && typeof persisted.doneSteps === 'object') doneSteps.value = persisted.doneSteps as Record<string, boolean>
    if (persisted.stepChecklist && typeof persisted.stepChecklist === 'object') {
      stepChecklist.value = persisted.stepChecklist as Record<string, { tasks?: Record<string, boolean>; checks?: Record<string, boolean> }>
    }
    if (persisted.quizAnswers && typeof persisted.quizAnswers === 'object') quizAnswers.value = persisted.quizAnswers as Record<string, number>
  }

  watch(
    [isDark, sidebarOpen, rightSidebarOpen, viewMode, currentTool, stage, activeStepId, doneSteps, stepChecklist, quizAnswers],
    () => {
      safeSetJson(STORAGE_KEY, {
        isDark: isDark.value,
        sidebarOpen: sidebarOpen.value,
        rightSidebarOpen: rightSidebarOpen.value,
        viewMode: viewMode.value,
        currentTool: currentTool.value,
        stage: stage.value,
        activeStepId: activeStepId.value,
        doneSteps: doneSteps.value,
        stepChecklist: stepChecklist.value,
        quizAnswers: quizAnswers.value
      })
    }
  )

  return {
    isDark,
    sidebarOpen,
    rightSidebarOpen,
    viewMode,
    currentTool,
    stage,
    activeStepId,
    doneSteps,
    stepChecklist,
    quizAnswers,
    toastMessage,
    breadcrumbs,
    activeModal,
    modalOpen,
    toggleTheme,
    toggleSidebar,
    setRightSidebarOpen,
    toggleRightSidebar,
    setViewMode,
    selectTool,
    setStage,
    setActiveStep,
    toggleStepDone,
    isStepTaskChecked,
    isStepCheckChecked,
    setStepTaskChecked,
    setStepCheckChecked,
    getQuizAnswer,
    setQuizAnswer,
    openModal,
    closeModal,
    showToast
  }
})
