<template>
  <div class="space-y-8">
    <LabStageBanner :is-zh="isZh" :active-tab-info="activeTabInfo" />

    <LabProgressOverview
      v-if="activeStageId"
      :is-zh="isZh"
      :active-stage-id="activeStageId"
      :overall-progress="learningStore.overallProgress"
      :stage-progress-items="stageProgressItems"
      :next-recommended-lab="learningStore.nextRecommendedLab"
      :skill-radar-items="skillRadarItems"
      @complete-stage="completeCurrentStage"
      @reset="resetLearningProgress"
    />

    <!-- Content Area -->
    <div class="min-h-[500px]">
      <component :is="activeStageComponent" :lang="lang" @navigate="activeTab = $event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useLearningStore, LEARNING_STAGES, LABS, type StageId } from '../../stores/learningStore'
import { LAB_TABS } from '../../labs/labCatalog'
import LabStageBanner from './dashboard/LabStageBanner.vue'
import LabProgressOverview from './dashboard/LabProgressOverview.vue'
import StageFoundation from './stages/StageFoundation.vue'
import StageCssLayout from './stages/StageCssLayout.vue'
import StageJsBasics from './stages/StageJsBasics.vue'
import StageJsAdvanced from './stages/StageJsAdvanced.vue'
import StageEngineering from './stages/StageEngineering.vue'
import StageVueCore from './stages/StageVueCore.vue'
import StageVueAdvanced from './stages/StageVueAdvanced.vue'
import StageChallenge from './stages/StageChallenge.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
  initialTab?: string
  modelValue?: string // v-model support for external tab control
}>()

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
  (e: 'update:modelValue', tab: string): void
}>()

const isZh = computed(() => props.lang === 'zh')

const activeTab = ref('foundation')
const labTabStorageKey = computed(() => `lab_active_tab_${props.lang}`)

const learningStore = useLearningStore()

const stageMetaById = computed(() => {
  const map: Record<string, { name: string; nameZh: string }> = {}
  for (const s of LEARNING_STAGES) map[s.id] = { name: s.name, nameZh: s.nameZh }
  return map
})

const stageProgressItems = computed(() => {
  return learningStore.stageProgress.map(p => ({
    ...p,
    label: isZh.value ? stageMetaById.value[p.stageId]?.nameZh : stageMetaById.value[p.stageId]?.name
  }))
})

const activeStageId = computed<StageId | null>(() => {
  if (LEARNING_STAGES.some(s => s.id === activeTab.value)) return activeTab.value as StageId
  return null
})

const skillRadarItems = computed(() => {
  const byId = new Map(stageProgressItems.value.map(p => [p.stageId, p.percent]))
  const js = Math.round(((byId.get('js-basics') || 0) + (byId.get('js-advanced') || 0)) / 2)
  const vue = Math.round(((byId.get('vue-core') || 0) + (byId.get('vue-advanced') || 0)) / 2)
  const ts = learningStore.completedLabs.includes('LabTypeScript') ? 100 : 0
  return [
    { name: isZh.value ? 'HTML 语义化' : 'HTML Semantics', value: byId.get('foundation') || 0 },
    { name: isZh.value ? 'CSS 布局' : 'CSS Layout', value: byId.get('css-layout') || 0 },
    { name: isZh.value ? 'JS 核心' : 'JS Core', value: js },
    { name: 'TypeScript', value: ts },
    { name: isZh.value ? 'Vue 生态' : 'Vue Ecosystem', value: vue },
    { name: isZh.value ? '工程化' : 'Engineering', value: byId.get('engineering') || 0 }
  ]
})

function completeStage(stageId: StageId) {
  const labsInStage = LABS.filter(l => l.stageId === stageId)
  for (const lab of labsInStage) learningStore.completeLab(lab.id)
}

function completeCurrentStage() {
  if (!activeStageId.value) return
  completeStage(activeStageId.value)
}

function resetLearningProgress() {
  learningStore.resetProgress()
}

type LabTab = {
  id: string
  label: string
  shortLabel: string
  icon: string
  noteNum: number
  desc: string
  goal: string
  noteLink: string
  relatedCode: string
}

const tabs = computed<LabTab[]>(() => {
  return LAB_TABS.map(tab => ({
    id: tab.id,
    label: isZh.value ? tab.labelZh : tab.labelEn,
    shortLabel: isZh.value ? tab.shortLabelZh : tab.shortLabelEn,
    icon: tab.icon,
    noteNum: tab.noteNum,
    desc: isZh.value ? tab.descZh : tab.descEn,
    goal: isZh.value ? tab.goalZh : tab.goalEn,
    noteLink: tab.noteLink,
    relatedCode: tab.relatedCode
  }))
})

const activeTabInfo = computed<LabTab | undefined>(() => tabs.value.find((tab: LabTab) => tab.id === activeTab.value))
const activeStageComponent = computed(() => {
  const map: Record<string, any> = {
    foundation: StageFoundation,
    'css-layout': StageCssLayout,
    'js-basics': StageJsBasics,
    'js-advanced': StageJsAdvanced,
    engineering: StageEngineering,
    'vue-core': StageVueCore,
    'vue-advanced': StageVueAdvanced,
    challenge: StageChallenge
  }
  return map[activeTab.value] || StageFoundation
})

onMounted(() => {
  const saved = localStorage.getItem(labTabStorageKey.value)
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved
  }
})

watch(
  () => props.initialTab,
  (val) => {
    if (val && tabs.value.some((tab: LabTab) => tab.id === val)) {
      activeTab.value = val
    }
  },
  { immediate: true }
)

// Sync with v-model
watch(() => props.modelValue, (val) => {
  if (val && tabs.value.some((tab: LabTab) => tab.id === val)) {
    activeTab.value = val
  }
}, { immediate: true })

watch(activeTab, (val: string) => {
  localStorage.setItem(labTabStorageKey.value, val)
  emit('tab-change', val)
  emit('update:modelValue', val)
})

watch(() => props.lang, () => {
  const saved = localStorage.getItem(labTabStorageKey.value)
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved
  }
})

// Expose tabs for sidebar
defineExpose({
  tabs,
  activeTab
})
</script>
