<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <h3 class="text-lg font-bold text-indigo-800 dark:text-indigo-300">
      {{ t.lab_multi_vmodel_title }}
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {{
        isZh
          ? `${t.lab_multi_vmodel_desc}：当一个组件需要同步多个字段时，可以提供多个 v-model。每个字段对应一个 prop 与一个 update 事件。`
          : `${t.lab_multi_vmodel_desc}: expose multiple v-model bindings. Each maps to a prop + an update event.`
      }}
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="space-y-5">
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30 p-5">
          <div class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">
            {{ isZh ? '父组件状态（单一事实来源）' : 'Parent state (single source of truth)' }}
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-1">first</div>
              <div class="font-mono text-sm text-indigo-700 dark:text-indigo-300">{{ first }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-1">last</div>
              <div class="font-mono text-sm text-indigo-700 dark:text-indigo-300">{{ last }}</div>
            </div>
          </div>
          <div class="mt-3 text-sm text-gray-700 dark:text-gray-200">
            {{ isZh ? '预览：' : 'Preview: ' }}
            <span class="font-bold">{{ fullName || (isZh ? '（空）' : '(empty)') }}</span>
          </div>
        </div>

        <div class="rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/70 dark:bg-indigo-900/10 p-5">
          <div class="text-sm font-bold text-indigo-800 dark:text-indigo-200 mb-3">
            {{ isZh ? '子组件：NameEditor' : 'Child component: NameEditor' }}
          </div>

          <NameEditor
            v-model:first="first"
            v-model:last="last"
            :lang="props.lang"
          />

          <div class="mt-4 text-xs text-indigo-800/80 dark:text-indigo-200/80">
            {{
              isZh
                ? 'API 约定：props.first + emit(\"update:first\")；props.last + emit(\"update:last\")。'
                : 'Contract: props.first + emit(\"update:first\"); props.last + emit(\"update:last\").'
            }}
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <LabCodeBlock
          :lang="props.lang"
          :title="isZh ? '语法糖展开' : 'Sugar expansion'"
          :code="expansionCode"
          path="src/components/lab/stage7-vue-advanced/LabMultiVModel.vue"
          token="find:const expansionCode"
        />
        <div class="bg-[#1e1e1e] rounded-xl border border-gray-800 p-4">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {{ isZh ? '要点' : 'Notes' }}
          </div>
          <div class="text-xs text-gray-300 space-y-1">
            <div>
              {{
                isZh
                  ? '多 v-model 会让组件 API 更清晰，但字段名要稳定、语义要明确。'
                  : 'Multiple v-model can make APIs clearer, but field names should be stable and meaningful.'
              }}
            </div>
            <div>
              {{
                isZh
                  ? '不要在子组件里直接修改 props，必须通过 emit 回传更新。'
                  : 'Do not mutate props in child; emit updates instead.'
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <details class="mt-6 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-gray-900/20 p-4">
      <summary class="cursor-pointer font-bold text-indigo-800 dark:text-indigo-200 text-sm">
        {{ isZh ? '挑战：把 v-model:xxx 展开写对' : 'Challenge: expand v-model:xxx correctly' }}
      </summary>
      <div class="mt-4 space-y-3">
        <div class="text-xs text-gray-700 dark:text-gray-200">
          {{
            isZh
              ? '题目：下面哪一组 prop + 事件 对应 v-model:first？'
              : 'Question: which prop + event pair corresponds to v-model:first?'
          }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="rounded-lg border border-indigo-200 dark:border-indigo-900/40 bg-white/70 dark:bg-gray-900/20 p-3">
            <div class="text-[10px] uppercase font-bold text-gray-500 mb-2">{{ isZh ? 'Prop' : 'Prop' }}</div>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
                :class="challengeProp === 'first' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white/70 dark:bg-gray-900/30 border-indigo-200 dark:border-indigo-900/40 text-gray-700 dark:text-gray-200'"
                @click="challengeProp = 'first'"
              >
                first
              </button>
              <button
                type="button"
                class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
                :class="challengeProp === 'last' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white/70 dark:bg-gray-900/30 border-indigo-200 dark:border-indigo-900/40 text-gray-700 dark:text-gray-200'"
                @click="challengeProp = 'last'"
              >
                last
              </button>
            </div>
          </div>
          <div class="rounded-lg border border-indigo-200 dark:border-indigo-900/40 bg-white/70 dark:bg-gray-900/20 p-3">
            <div class="text-[10px] uppercase font-bold text-gray-500 mb-2">{{ isZh ? 'Event' : 'Event' }}</div>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
                :class="challengeEvent === 'update:first' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white/70 dark:bg-gray-900/30 border-indigo-200 dark:border-indigo-900/40 text-gray-700 dark:text-gray-200'"
                @click="challengeEvent = 'update:first'"
              >
                update:first
              </button>
              <button
                type="button"
                class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
                :class="challengeEvent === 'update:last' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white/70 dark:bg-gray-900/30 border-indigo-200 dark:border-indigo-900/40 text-gray-700 dark:text-gray-200'"
                @click="challengeEvent = 'update:last'"
              >
                update:last
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white transition-all"
            @click="submitChallenge"
          >
            {{ isZh ? '提交答案' : 'Submit' }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-indigo-200 dark:border-indigo-900/40 text-gray-700 dark:text-gray-200 hover:opacity-90"
            @click="challengeResult = null"
          >
            {{ isZh ? '重置' : 'Reset' }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-indigo-200 dark:border-indigo-900/40 text-gray-700 dark:text-gray-200 hover:opacity-90"
            @click="openCode('src/components/lab/stage7-vue-advanced/LabMultiVModel.vue', 'find:v-model:first')"
          >
            {{ isZh ? '对照源码' : 'View source' }}
          </button>
        </div>

        <div v-if="challengeResult" class="rounded-lg p-3 border" :class="challengeResult.correct ? 'border-indigo-300 bg-indigo-50/60 dark:bg-indigo-900/10' : 'border-red-300 bg-red-50/60 dark:bg-red-900/10'">
          <div class="text-sm font-bold" :class="challengeResult.correct ? 'text-indigo-800 dark:text-indigo-200' : 'text-red-700 dark:text-red-200'">
            {{ challengeResult.correct ? (isZh ? '✅ 正确' : '✅ Correct') : (isZh ? '❌ 不对' : '❌ Incorrect') }}
          </div>
          <div class="mt-1 text-xs text-gray-700 dark:text-gray-200">
            {{ isZh ? challengeResult.explanationZh : challengeResult.explanationEn }}
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import { I18N } from '../../../constants'
import LabCodeBlock from '../ui/LabCodeBlock.vue'
import { openCode } from '../useOpenCode'
import { evaluateMultiVModelChoice, type MultiVModelChoice, type MultiVModelChallengeResult } from '../../../labs/logic/multiVModelChallenge'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')
const t = computed(() => I18N[props.lang])

const first = ref(props.lang === 'zh' ? '樱花' : 'Sakura')
const last = ref(props.lang === 'zh' ? '笔记' : 'Notes')

const fullName = computed(() => [first.value, last.value].filter(Boolean).join(' '))

const challengeProp = ref<MultiVModelChoice['prop']>('last')
const challengeEvent = ref<MultiVModelChoice['event']>('update:last')
const challengeResult = ref<MultiVModelChallengeResult | null>(null)

const submitChallenge = () => {
  challengeResult.value = evaluateMultiVModelChoice({ prop: challengeProp.value, event: challengeEvent.value })
}

const NameEditor = defineComponent({
  name: 'NameEditor',
  props: {
    first: { type: String, required: true },
    last: { type: String, required: true },
    lang: { type: String as unknown as () => 'en' | 'zh', required: true }
  },
  emits: {
    'update:first': (v: string) => typeof v === 'string',
    'update:last': (v: string) => typeof v === 'string'
  },
  setup(p, { emit }) {
    const isZhInner = computed(() => p.lang === 'zh')
    return () =>
      h('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-3' }, [
        h('div', { class: 'space-y-1' }, [
          h('div', { class: 'text-xs font-bold text-indigo-700 dark:text-indigo-200' }, isZhInner.value ? '名（first）' : 'First'),
          h('input', {
            value: p.first,
            onInput: (e: Event) => {
              const el = e.target as HTMLInputElement | null
              emit('update:first', el?.value ?? '')
            },
            type: 'text',
            class:
              'w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all'
          })
        ]),
        h('div', { class: 'space-y-1' }, [
          h('div', { class: 'text-xs font-bold text-indigo-700 dark:text-indigo-200' }, isZhInner.value ? '姓（last）' : 'Last'),
          h('input', {
            value: p.last,
            onInput: (e: Event) => {
              const el = e.target as HTMLInputElement | null
              emit('update:last', el?.value ?? '')
            },
            type: 'text',
            class:
              'w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all'
          })
        ])
      ])
  }
})

const expansionCode = computed(() => {
  if (isZh.value) {
    return `<NameEditor
  v-model:first="first"
  v-model:last="last"
/>

等价于：

<NameEditor
  :first="first"
  :last="last"
  @update:first="(v) => (first = v)"
  @update:last="(v) => (last = v)"
/>`
  }
  return `<NameEditor
  v-model:first="first"
  v-model:last="last"
/>

Equivalent to:

<NameEditor
  :first="first"
  :last="last"
  @update:first="(v) => (first = v)"
  @update:last="(v) => (last = v)"
/>`
})
</script>
