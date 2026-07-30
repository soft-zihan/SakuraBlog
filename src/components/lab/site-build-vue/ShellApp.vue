<template>
  <div>
    <ShellLayout
      :lang="lang"
      :is-dark="store.isDark"
      :sidebar-open="store.sidebarOpen"
      :right-sidebar-open="store.rightSidebarOpen"
      :view-mode="store.viewMode"
      :stage="store.stage"
      :current-tool="store.currentTool"
      :breadcrumbs="store.breadcrumbs"
      :enable-files="enableFilesView"
      @action="handleAction"
    >
      <template v-if="mode === 'full'">
        <ShellFilesGuide v-if="store.viewMode === 'files'" :lang="lang" />
        <ShellBuildGuide v-else-if="store.currentTool === 'build'" :lang="lang" />
        <ShellSourceGuide v-else-if="store.currentTool === 'source-code'" :lang="lang" />
        <ShellTutorialPanel v-else :lang="lang" />
      </template>
    </ShellLayout>

    <ShellModalHost
      :lang="lang"
      :open="store.modalOpen"
      :kind="store.activeModal"
      @close="store.closeModal()"
    />
    <ShellToastHost :lang="lang" :message="store.toastMessage" @close="store.toastMessage = ''" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import ShellLayout from './ShellLayout.vue'
import ShellModalHost from './ShellModalHost.vue'
import ShellFilesGuide from './ShellFilesGuide.vue'
import ShellBuildGuide from './ShellBuildGuide.vue'
import ShellSourceGuide from './ShellSourceGuide.vue'
import ShellToastHost from './ShellToastHost.vue'
import ShellTutorialPanel from './ShellTutorialPanel.vue'
import { useSiteBuildShellStore, type ShellAction } from './shellStore'

const props = defineProps<{
  lang: 'en' | 'zh'
  mode?: 'full' | 'shell'
  enableFilesView?: boolean
}>()

const lang = computed(() => props.lang)
const mode = computed(() => props.mode ?? 'full')
const enableFilesView = computed(() => props.enableFilesView !== false)
const store = useSiteBuildShellStore()
let stopUrlSync: null | (() => void) = null
let suppressUrlSync = false
let suppressUrlSyncTimer = 0

function handleAction(action: ShellAction) {
  if (action.type === 'toggle-sidebar') store.toggleSidebar()
  else if (action.type === 'toggle-right-sidebar') {
    const ok = window.matchMedia('(min-width: 768px)').matches
    if (!ok) {
      store.showToast(lang.value === 'zh' ? '移动端暂不展示右侧面板（建议用桌面端体验）' : 'Right panel is desktop-only in this demo')
      return
    }
    store.toggleRightSidebar()
  } else if (action.type === 'toggle-theme') store.toggleTheme()
  else if (action.type === 'set-view-mode') {
    if (!enableFilesView.value && action.mode === 'files') {
      store.setViewMode('lab')
      store.showToast(lang.value === 'zh' ? '本区块不展示文件视角（原生三件套在上面的“原生三件套”区）' : 'Files view is disabled in this section')
      return
    }
    store.setViewMode(action.mode)
  }
  else if (action.type === 'navigate') navigateByPath(action.path)
  else if (action.type === 'select-tool') store.selectTool(action.tool)
  else if (action.type === 'set-stage') store.setStage(action.stage)
  else if (action.type === 'set-active-step') store.setActiveStep(action.stepId)
  else if (action.type === 'toggle-step-done') store.toggleStepDone(action.stepId)
  else if (action.type === 'open-search') store.openModal('search')
  else if (action.type === 'open-settings') store.openModal('settings')
  else if (action.type === 'open-music') store.openModal('music')
  else if (action.type === 'open-download') store.openModal('download')
  else if (action.type === 'open-modal') store.openModal(action.kind)
  else if (action.type === 'close-modal') store.closeModal()
}

function navigateByPath(path: string) {
  const parts = String(path || '').split('/').filter(Boolean)
  if (!parts.length) return
  if (parts[0] === 'latest') return store.setViewMode('latest')
  if (parts[0] === 'files') {
    if (!enableFilesView.value) {
      store.setViewMode('lab')
      return
    }
    return store.setViewMode('files')
  }
  if (parts[0] !== 'lab') return
  store.setViewMode('lab')
  const stage = parts[1]
  if (stage === 'foundation' || stage === 'css' || stage === 'js') store.setStage(stage)
  const tool = parts[2]
  if (tool === 'dashboard' || tool === 'build' || tool === 'source-code') store.selectTool(tool)
}

function onKey(e: KeyboardEvent) {
  if (e.key === '/' && !store.modalOpen) {
    const el = e.target as HTMLElement | null
    const tag = el?.tagName?.toLowerCase()
    const editable = tag === 'input' || tag === 'textarea' || (el as any)?.isContentEditable
    if (editable) return
    e.preventDefault()
    store.openModal('search')
  }
}

function applyStateFromUrl() {
  suppressUrlSync = true
  if (suppressUrlSyncTimer) window.clearTimeout(suppressUrlSyncTimer)
  suppressUrlSyncTimer = window.setTimeout(() => {
    suppressUrlSync = false
    suppressUrlSyncTimer = 0
  }, 0)

  const url = new URL(window.location.href)
  const stage = url.searchParams.get('sbv_stage')
  const tool = url.searchParams.get('sbv_tool')
  const view = url.searchParams.get('sbv_view')
  const step = url.searchParams.get('sbv_step')

  if (stage === 'foundation' || stage === 'css' || stage === 'js') store.setStage(stage)
  if (tool === 'dashboard' || tool === 'build' || tool === 'source-code' || tool === 'null') {
    store.selectTool(tool === 'null' ? null : tool)
  }
  if (view === 'latest' || view === 'files' || view === 'lab') {
    if (!enableFilesView.value && view === 'files') store.setViewMode('lab')
    else store.setViewMode(view)
  }
  if (typeof step === 'string' && step.trim()) store.setActiveStep(step.trim())
}

function syncStateToUrl() {
  if (suppressUrlSync) return
  const url = new URL(window.location.href)
  url.searchParams.set('sbv_stage', store.stage)
  url.searchParams.set('sbv_view', store.viewMode)
  url.searchParams.set('sbv_step', store.activeStepId)
  if (store.currentTool) url.searchParams.set('sbv_tool', store.currentTool)
  else url.searchParams.set('sbv_tool', 'null')
  const next = url.toString()
  if (next === window.location.href) return
  window.history.replaceState(window.history.state, '', next)
}

onMounted(() => {
  applyStateFromUrl()
  window.addEventListener('popstate', applyStateFromUrl)
  stopUrlSync = watch(
    [() => store.stage, () => store.viewMode, () => store.currentTool, () => store.activeStepId],
    () => syncStateToUrl(),
    { immediate: true }
  )
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('popstate', applyStateFromUrl)
  stopUrlSync?.()
  stopUrlSync = null
  if (suppressUrlSyncTimer) window.clearTimeout(suppressUrlSyncTimer)
  suppressUrlSyncTimer = 0
})
</script>
