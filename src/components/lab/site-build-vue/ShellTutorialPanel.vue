<template>
  <ShellGlassCard>
    <div class="p-6 border-b border-white/60 dark:border-gray-700/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <div class="text-xs font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] tracking-wide">
          {{ lang === 'zh' ? '从零搭站：一步步完成' : 'Build a site from zero: step by step' }}
        </div>
        <div class="text-xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
          {{ stageTitle }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {{ stageDesc }}
        </div>
      </div>

      <div class="flex flex-wrap gap-2 items-center">
        <div class="text-xs font-extrabold text-gray-700 dark:text-gray-200 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30">
          {{ doneCount }} / {{ steps.length }} {{ lang === 'zh' ? '已完成' : 'done' }}
        </div>
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
          @click="jumpToFirstUndone"
        >
          {{ lang === 'zh' ? '继续下一步' : 'Continue' }}
        </button>
      </div>
    </div>

    <div v-if="activeStep" class="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
      <aside class="p-4 border-b lg:border-b-0 lg:border-r border-white/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-900/25">
        <div class="space-y-3">
          <div>
            <input
              v-model="stepQuery"
              type="text"
              class="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/35 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[var(--primary-400)]/40"
              :placeholder="lang === 'zh' ? '搜索步骤…' : 'Search steps...'"
            />
            <label class="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none">
              <input v-model="onlyUndone" type="checkbox" class="accent-[var(--primary-500)]" />
              <span>{{ lang === 'zh' ? '只看未完成' : 'Undone only' }}</span>
            </label>
          </div>

          <div class="space-y-2">
          <button
            v-for="it in sidebarSteps"
            :key="it.step.id"
            type="button"
            class="w-full text-left rounded-2xl border p-3 transition-colors"
            :class="it.step.id === activeStep.id ? 'border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/70 dark:bg-[var(--primary-900)]/25' : 'border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 hover:bg-white/90 dark:hover:bg-gray-800/50'"
            @click="store.setActiveStep(it.step.id)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-xl border grid place-items-center text-xs font-extrabold"
                :class="isDone(it.step.id) ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800/30' : 'bg-white/70 dark:bg-gray-900/30 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'"
              >
                {{ isDone(it.step.id) ? '✓' : it.order }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-extrabold text-gray-800 dark:text-gray-100 truncate">
                  {{ stepTitle(it.step) }}
                </div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  {{ stepGoal(it.step) }}
                </div>
              </div>
            </div>
          </button>
          </div>
        </div>
      </aside>

      <article class="p-6">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <div class="text-xs font-extrabold text-gray-500 dark:text-gray-400">
              {{ lang === 'zh' ? '当前步骤' : 'Current step' }}
            </div>
            <div class="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
              {{ stepTitle(activeStep) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {{ stepGoal(activeStep) }}
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90 disabled:opacity-50"
              :disabled="!prevStepId"
              @click="prevStepId && store.setActiveStep(prevStepId)"
            >
              ← {{ lang === 'zh' ? '上一步' : 'Prev' }}
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/80 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90 disabled:opacity-50"
              :disabled="!nextStepId"
              @click="nextStepId && store.setActiveStep(nextStepId)"
            >
              {{ lang === 'zh' ? '下一步' : 'Next' }} →
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[var(--primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--primary-500)]/20 hover:opacity-90"
              @click="store.toggleStepDone(activeStep.id)"
            >
              {{ isDone(activeStep.id) ? (lang === 'zh' ? '标记未完成' : 'Mark not done') : (lang === 'zh' ? '标记完成' : 'Mark done') }}
            </button>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div class="xl:col-span-2">
            <ShellLivePreview
              :lang="lang"
              :title="previewTitle"
              :html="previewHtml"
              :css="previewCss"
              :js="previewJs"
              :height="320"
              :show-reload="true"
            />
          </div>
          <section class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
            <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
              {{ lang === 'zh' ? '你要做什么' : 'What to do' }}
            </div>
            <ul class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li v-for="(t, idx) in stepTasks(activeStep)" :key="idx" class="flex gap-2">
                <label class="flex-1 flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    class="mt-0.5 accent-[var(--primary-500)]"
                    :checked="store.isStepTaskChecked(activeStep.id, t)"
                    @change="store.setStepTaskChecked(activeStep.id, t, ($event.target as HTMLInputElement).checked)"
                  />
                  <span class="flex-1">{{ t }}</span>
                </label>
              </li>
            </ul>
          </section>

          <section class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5">
            <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
              {{ lang === 'zh' ? '完成标准（自检）' : 'Definition of done' }}
            </div>
            <ul class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li v-for="(t, idx) in stepChecks(activeStep)" :key="idx" class="flex gap-2">
                <label class="flex-1 flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    class="mt-0.5 accent-green-600 dark:accent-green-300"
                    :checked="store.isStepCheckChecked(activeStep.id, t)"
                    @change="store.setStepCheckChecked(activeStep.id, t, ($event.target as HTMLInputElement).checked)"
                  />
                  <span class="flex-1">{{ t }}</span>
                </label>
              </li>
            </ul>
          </section>
        </div>

        <section v-if="activeStep.blocks?.length" class="mt-5 space-y-3">
          <ShellCodeBlock
            v-for="(b, idx) in activeStep.blocks"
            :key="idx"
            :lang="lang"
            :title="blockTitle(b)"
            :content="b.content"
            :collapsed-lines="34"
          />
        </section>

        <section
          v-if="isStageEnd && stageQuiz"
          class="mt-5 rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5"
        >
          <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
            {{ lang === 'zh' ? '小测（复盘一下）' : 'Quick quiz' }}
          </div>
          <div class="mt-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">
            {{ quizQuestion(stageQuiz) }}
          </div>
          <div class="mt-3 space-y-2">
            <button
              v-for="(opt, idx) in quizOptions(stageQuiz)"
              :key="idx"
              type="button"
              class="w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold transition-colors"
              :class="quizOptionClass(stageQuiz.id, idx)"
              @click="store.setQuizAnswer(stageQuiz.id, idx)"
            >
              {{ opt }}
            </button>
          </div>
          <div
            v-if="quizSelected(stageQuiz.id) !== null"
            class="mt-3 text-xs rounded-2xl border px-4 py-3"
            :class="quizSelected(stageQuiz.id) === stageQuiz.answerIndex ? 'border-green-200 bg-green-50/60 text-green-800 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-200' : 'border-amber-200 bg-amber-50/60 text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200'"
          >
            <div class="font-extrabold">
              {{ quizSelected(stageQuiz.id) === stageQuiz.answerIndex ? (lang === 'zh' ? '正确' : 'Correct') : (lang === 'zh' ? '再想想' : 'Try again') }}
            </div>
            <div class="mt-1 leading-relaxed">
              {{ quizExplanation(stageQuiz) }}
            </div>
          </div>
        </section>

        <section
          v-if="showTransferKit"
          class="mt-5 rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-5"
        >
          <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
            {{ lang === 'zh' ? '迁移练习：把壳子带进真实工程' : 'Transfer exercise: move shell into a real project' }}
          </div>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-4">
              <div class="text-xs font-extrabold text-gray-700 dark:text-gray-200">
                {{ lang === 'zh' ? '任务' : 'Tasks' }}
              </div>
              <ul class="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li v-for="(t, idx) in transferTasks" :key="idx" class="flex gap-2">
                  <span class="font-extrabold text-[var(--primary-500)]">•</span>
                  <span class="flex-1">{{ t }}</span>
                </li>
              </ul>
            </div>
            <div class="rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-4">
              <div class="text-xs font-extrabold text-gray-700 dark:text-gray-200">
                {{ lang === 'zh' ? '验收标准' : 'Acceptance' }}
              </div>
              <ul class="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li v-for="(t, idx) in transferAcceptance" :key="idx" class="flex gap-2">
                  <span class="font-extrabold text-green-600 dark:text-green-300">✓</span>
                  <span class="flex-1">{{ t }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </div>
    <div v-else class="p-6 text-sm text-gray-600 dark:text-gray-300">
      {{ loading ? (lang === 'zh' ? '加载中…' : 'Loading...') : (lang === 'zh' ? '暂无步骤' : 'No steps') }}
    </div>
  </ShellGlassCard>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ShellGlassCard from './ShellGlassCard.vue'
import ShellCodeBlock from './ShellCodeBlock.vue'
import ShellLivePreview from './ShellLivePreview.vue'
import { useSiteBuildShellStore } from './shellStore'
import {
  getTutorialStageMeta,
  loadTutorialStage,
  type TutorialCodeBlock,
  type TutorialStep
} from './tutorialStepsLoader'
import {
  SITE_BUILD_VUE_QUESTIONS,
  SITE_BUILD_VUE_TRANSFER_ACCEPTANCE_EN,
  SITE_BUILD_VUE_TRANSFER_ACCEPTANCE_ZH,
  SITE_BUILD_VUE_TRANSFER_TASKS_EN,
  SITE_BUILD_VUE_TRANSFER_TASKS_ZH
} from '../../../labs/siteBuildContent'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
const store = useSiteBuildShellStore()
const stageMeta = computed(() => getTutorialStageMeta(store.stage))
const steps = ref<TutorialStep[]>([])
const preview = ref<{ html: string; css: string; js: string }>({ html: '', css: '', js: '' })
const loading = ref(true)
let stageLoadRunId = 0

watch(
  () => store.stage,
  async (stage) => {
    stageLoadRunId++
    const runId = stageLoadRunId
    loading.value = true
    const data = await loadTutorialStage(stage)
    if (runId !== stageLoadRunId) return
    steps.value = data.steps
    preview.value = data.preview
    loading.value = false
  },
  { immediate: true }
)
const stepQuery = ref('')
const onlyUndone = ref(false)

function normalizeQuery(s: string) {
  return String(s || '').trim().toLowerCase()
}

const sidebarSteps = computed(() => {
  const q = normalizeQuery(stepQuery.value)
  return steps.value
    .map((step, idx) => ({
      step,
      order: idx + 1,
      haystack: normalizeQuery(`${step.titleZh} ${step.titleEn} ${step.goalZh} ${step.goalEn}`)
    }))
    .filter((it) => {
      if (onlyUndone.value && store.doneSteps[it.step.id]) return false
      if (!q) return true
      return it.haystack.includes(q)
    })
})

const activeStep = computed(() => {
  const found = steps.value.find((s) => s.id === store.activeStepId)
  return found ?? steps.value[0] ?? null
})

watch(
  [() => store.stage, () => store.activeStepId, () => steps.value],
  () => {
    if (!steps.value.length) return
    const exists = steps.value.some((s) => s.id === store.activeStepId)
    if (!exists) store.setActiveStep(steps.value[0].id)
  },
  { immediate: true }
)

const stageTitle = computed(() => (lang.value === 'zh' ? stageMeta.value.titleZh : stageMeta.value.titleEn))
const stageDesc = computed(() => (lang.value === 'zh' ? stageMeta.value.descZh : stageMeta.value.descEn))

const doneCount = computed(() => steps.value.filter((s) => !!store.doneSteps[s.id]).length)

function isDone(stepId: string) {
  return !!store.doneSteps[stepId]
}

function stepTitle(step: TutorialStep) {
  return lang.value === 'zh' ? step.titleZh : step.titleEn
}

function stepGoal(step: TutorialStep) {
  return lang.value === 'zh' ? step.goalZh : step.goalEn
}

function stepTasks(step: TutorialStep) {
  return lang.value === 'zh' ? step.tasksZh : step.tasksEn
}

function stepChecks(step: TutorialStep) {
  return lang.value === 'zh' ? step.checksZh : step.checksEn
}

function blockTitle(b: TutorialCodeBlock) {
  return lang.value === 'zh' ? b.labelZh : b.labelEn
}

const activeIndex = computed(() => {
  const step = activeStep.value
  if (!step) return -1
  return steps.value.findIndex((s) => s.id === step.id)
})

const prevStepId = computed(() => {
  const idx = activeIndex.value
  if (idx <= 0) return null
  return steps.value[idx - 1]?.id ?? null
})

const nextStepId = computed(() => {
  const idx = activeIndex.value
  if (idx < 0 || idx >= steps.value.length - 1) return null
  return steps.value[idx + 1]?.id ?? null
})

const previewTitle = computed(() => {
  return lang.value === 'zh' ? stageMeta.value.previewTitleZh : stageMeta.value.previewTitleEn
})

const previewHtml = computed(() => {
  return preview.value.html
})

const previewCss = computed(() => {
  return preview.value.css
})

const previewJs = computed(() => {
  return preview.value.js
})

const isStageEnd = computed(() => !nextStepId.value)

const stageQuiz = computed(() => {
  if (!isStageEnd.value) return null
  const id = store.stage === 'js' ? 'site_shell_state' : store.stage === 'foundation' ? 'site_shell_boundary' : null
  if (!id) return null
  return SITE_BUILD_VUE_QUESTIONS.find((q) => q.id === id) || null
})

function quizQuestion(q: (typeof SITE_BUILD_VUE_QUESTIONS)[number]) {
  return lang.value === 'zh' ? q.questionZh : q.questionEn
}

function quizOptions(q: (typeof SITE_BUILD_VUE_QUESTIONS)[number]) {
  return lang.value === 'zh' ? q.optionsZh : q.optionsEn
}

function quizExplanation(q: (typeof SITE_BUILD_VUE_QUESTIONS)[number]) {
  return lang.value === 'zh' ? q.explanationZh : q.explanationEn
}

function quizSelected(questionId: string) {
  return store.getQuizAnswer(questionId)
}

function quizOptionClass(questionId: string, optionIndex: number) {
  const selected = store.getQuizAnswer(questionId)
  if (selected === optionIndex) {
    return 'border-[var(--primary-200)] dark:border-[var(--primary-700)] bg-[var(--primary-50)]/70 dark:bg-[var(--primary-900)]/25 text-gray-800 dark:text-gray-100'
  }
  return 'border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 text-gray-700 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-800/50'
}

const showTransferKit = computed(() => isStageEnd.value && store.stage === 'js')
const transferTasks = computed(() => (lang.value === 'zh' ? SITE_BUILD_VUE_TRANSFER_TASKS_ZH : SITE_BUILD_VUE_TRANSFER_TASKS_EN))
const transferAcceptance = computed(() =>
  lang.value === 'zh' ? SITE_BUILD_VUE_TRANSFER_ACCEPTANCE_ZH : SITE_BUILD_VUE_TRANSFER_ACCEPTANCE_EN
)

function jumpToFirstUndone() {
  if (!steps.value.length) return
  const next = steps.value.find((s) => !store.doneSteps[s.id])
  store.setActiveStep((next ?? steps.value[0]).id)
}

function isEditable(el: EventTarget | null) {
  const node = el as HTMLElement | null
  const tag = node?.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || (node as any)?.isContentEditable
}

function onKey(e: KeyboardEvent) {
  if (isEditable(e.target)) return
  if (e.key === 'ArrowLeft') {
    if (prevStepId.value) store.setActiveStep(prevStepId.value)
    return
  }
  if (e.key === 'ArrowRight') {
    if (nextStepId.value) store.setActiveStep(nextStepId.value)
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
