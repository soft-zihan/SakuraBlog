<template>
  <div class="mt-6 space-y-4">
    <details
      v-if="transferTitle || transferDesc || transferTasks.length || transferAcceptance.length"
      class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-4"
    >
      <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
        {{ isZh ? '迁移题' : 'Transfer tasks' }}
      </summary>

      <div class="mt-4 space-y-3">
        <div v-if="transferTitle" class="text-sm font-bold text-gray-800 dark:text-gray-100">
          {{ transferTitle }}
        </div>
        <div v-if="transferDesc" class="text-xs text-gray-700 dark:text-gray-300">
          {{ transferDesc }}
        </div>

        <div v-if="transferTasks.length" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-4">
          <div class="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2">
            {{ isZh ? '任务' : 'Tasks' }}
          </div>
          <ul class="text-xs text-gray-700 dark:text-gray-200 space-y-1">
            <li v-for="(t, idx) in transferTasks" :key="idx">• {{ t }}</li>
          </ul>
        </div>

        <div v-if="transferAcceptance.length" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-4">
          <div class="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2">
            {{ isZh ? '验收标准' : 'Acceptance' }}
          </div>
          <ul class="text-xs text-gray-700 dark:text-gray-200 space-y-1">
            <li v-for="(a, idx) in transferAcceptance" :key="idx">• {{ a }}</li>
          </ul>
        </div>
      </div>
    </details>

    <details
      v-if="props.sourcePath"
      class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-4"
    >
      <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
        {{ isZh ? '对照源码' : 'Read source' }}
      </summary>

      <div class="mt-4 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <div class="text-[11px] text-gray-600 dark:text-gray-300">
            <span class="font-bold">{{ isZh ? '路径' : 'Path' }}:</span>
            <span class="ml-1 font-mono">{{ props.sourcePath }}</span>
          </div>
          <button
            type="button"
            class="ml-auto text-[11px] px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:opacity-90"
            @click="openSource"
          >
            {{ isZh ? '打开源码' : 'Open code' }}
          </button>
        </div>

        <div v-if="sourceFocus.trim()" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-4">
          <div class="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2">
            {{ isZh ? '带问题阅读（观察点）' : 'Reading prompts' }}
          </div>
          <pre class="text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{{ sourceFocus }}</pre>
        </div>
      </div>
    </details>

    <details class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-4">
      <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
        {{ isZh ? '思考' : 'Self-check (quick quiz)' }}
      </summary>

      <div class="mt-4 space-y-4">

        <div v-if="questions.length" class="flex flex-wrap items-center gap-2">
          <div class="text-[11px] text-gray-600 dark:text-gray-300">
            <span class="font-bold">{{ isZh ? '进度' : 'Progress' }}:</span>
            <span class="ml-1 font-mono">{{ answeredCount }}/{{ questions.length }}</span>
          </div>
          <div v-if="submitted" class="text-[11px] text-gray-600 dark:text-gray-300">
            <span class="font-bold">{{ isZh ? '得分' : 'Score' }}:</span>
            <span class="ml-1 font-mono">{{ correctCount }}/{{ questions.length }}</span>
          </div>
          <div v-if="questions.length && !allAnswered" class="text-[11px] text-amber-700 dark:text-amber-300">
            {{ isZh ? '请先完成全部题目再提交。' : 'Answer all questions before submitting.' }}
          </div>
        </div>

        <div v-if="questions.length === 0" class="text-xs text-gray-500 dark:text-gray-400">
          {{ isZh ? '暂无题目。' : 'No questions.' }}
        </div>

        <div v-for="q in questions" :key="q.id" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-4">
          <div class="text-xs font-bold text-gray-800 dark:text-gray-100">{{ isZh ? q.questionZh : q.questionEn }}</div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="(opt, idx) in (isZh ? q.optionsZh : q.optionsEn)"
              :key="idx"
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
              :class="optionClass(q.id, idx, q.answerIndex)"
              @click="pick(q.id, idx)"
            >
              {{ opt }}
            </button>
          </div>

          <div
            v-if="submitted && resultById[q.id]"
            class="mt-3 rounded-lg p-3 border"
            :class="resultById[q.id].correct ? 'border-green-300 bg-green-50/60 dark:bg-green-900/10' : 'border-red-300 bg-red-50/60 dark:bg-red-900/10'"
          >
            <div class="text-sm font-bold" :class="resultById[q.id].correct ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'">
              {{ resultById[q.id].correct ? (isZh ? '✅ 正确' : '✅ Correct') : (isZh ? '❌ 不对' : '❌ Incorrect') }}
            </div>
            <div v-if="!resultById[q.id].correct" class="mt-1 text-xs text-gray-700 dark:text-gray-200">
              <span class="font-bold">{{ isZh ? '正确答案' : 'Correct' }}:</span>
              <span class="ml-1">{{ (isZh ? q.optionsZh : q.optionsEn)[q.answerIndex] }}</span>
            </div>
            <div class="mt-1 text-xs text-gray-700 dark:text-gray-200">
              {{ isZh ? q.explanationZh : q.explanationEn }}
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white transition-all"
            :disabled="questions.length === 0 || !allAnswered"
            @click="submit"
          >
            {{ isZh ? '提交' : 'Submit' }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90 transition-all"
            @click="reset"
          >
            {{ isZh ? '重置' : 'Reset' }}
          </button>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { openCode, openCodeWithFocus } from '../useOpenCode'

export type LabSelfCheckQuestion = {
  id: string
  questionZh: string
  questionEn: string
  optionsZh: string[]
  optionsEn: string[]
  answerIndex: number
  explanationZh: string
  explanationEn: string
}

const props = defineProps<{
  lang: 'en' | 'zh'
  transferTitleZh?: string
  transferTitleEn?: string
  transferDescZh?: string
  transferDescEn?: string
  transferTasksZh?: string[]
  transferTasksEn?: string[]
  transferAcceptanceZh?: string[]
  transferAcceptanceEn?: string[]
  sourcePath?: string
  sourceToken?: string
  sourceFocusZh?: string
  sourceFocusEn?: string
  questions?: LabSelfCheckQuestion[]
}>()

const isZh = computed(() => props.lang === 'zh')

const transferTitle = computed(() => (isZh.value ? props.transferTitleZh : props.transferTitleEn) || '')
const transferDesc = computed(() => (isZh.value ? props.transferDescZh : props.transferDescEn) || '')
const transferTasks = computed(() => (isZh.value ? props.transferTasksZh : props.transferTasksEn) || [])
const transferAcceptance = computed(() => (isZh.value ? props.transferAcceptanceZh : props.transferAcceptanceEn) || [])
const sourceFocus = computed(() => (isZh.value ? props.sourceFocusZh : props.sourceFocusEn) || '')

const questions = computed(() => props.questions || [])

const pickedById = ref<Record<string, number | null>>({})
const submitted = ref(false)

const answeredCount = computed(() => {
  let n = 0
  for (const q of questions.value) if (typeof pickedById.value[q.id] === 'number') n += 1
  return n
})

const allAnswered = computed(() => {
  return questions.value.length > 0 && answeredCount.value === questions.value.length
})

const resultById = computed(() => {
  if (!submitted.value) return {}
  const out: Record<string, { correct: boolean }> = {}
  for (const q of questions.value) {
    const picked = pickedById.value[q.id]
    out[q.id] = { correct: typeof picked === 'number' && picked === q.answerIndex }
  }
  return out
})

const correctCount = computed(() => {
  if (!submitted.value) return 0
  let n = 0
  for (const q of questions.value) {
    const r = (resultById.value as Record<string, { correct: boolean }>)[q.id]
    if (r?.correct) n += 1
  }
  return n
})

const pick = (id: string, idx: number) => {
  pickedById.value = { ...pickedById.value, [id]: idx }
}

const optionClass = (id: string, idx: number, answerIndex: number) => {
  const base =
    'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
  const picked = pickedById.value[id] === idx

  if (!submitted.value) {
    return picked ? 'bg-[var(--primary-600)] text-white border-[var(--primary-700)]' : base
  }

  if (idx === answerIndex) {
    return 'bg-green-600 text-white border-green-700'
  }

  if (picked && idx !== answerIndex) {
    return 'bg-red-600 text-white border-red-700'
  }

  return base
}

const submit = () => {
  submitted.value = true
}

const reset = () => {
  pickedById.value = {}
  submitted.value = false
}

const openSource = () => {
  if (!props.sourcePath) return
  const focus = sourceFocus.value.trim()
  if (focus) {
    openCodeWithFocus(props.sourcePath, props.sourceToken, focus)
    return
  }
  openCode(props.sourcePath, props.sourceToken)
}
</script>
