<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-teal-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <div class="flex items-start gap-4">
      <div class="flex-1">
        <h3 class="text-lg font-bold text-teal-800 dark:text-teal-300">
          {{ t.lab_list_keys_title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{
            isZh
              ? `${t.lab_list_keys_desc}：本例用“行内输入状态”演示：当列表发生重排时，如果 key 用 index，组件实例会被错误复用，导致输入内容跟着位置跑。`
              : `${t.lab_list_keys_desc}: local input state can drift when lists reorder if you use index as key.`
          }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="space-y-4">
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30 p-4">
          <div class="flex items-center gap-2">
            <div class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ isZh ? 'key 策略' : 'Key strategy' }}</div>
            <div class="ml-auto flex gap-2">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                :class="keyMode === 'id' ? 'bg-teal-600 text-white border-teal-700' : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'"
                @click="keyMode = 'id'"
              >
                :key="item.id"
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                :class="keyMode === 'index' ? 'bg-red-600 text-white border-red-700' : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'"
                @click="keyMode = 'index'"
              >
                :key="index"
              </button>
            </div>
          </div>

          <div class="mt-3">
            <LabActionBar>
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 hover:opacity-90"
              @click="reverse()"
            >
              {{ isZh ? '反转顺序' : 'Reverse' }}
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 hover:opacity-90"
              @click="shuffle()"
            >
              {{ isZh ? '随机重排' : 'Shuffle' }}
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 hover:opacity-90"
              @click="prepend()"
            >
              {{ isZh ? '头部插入' : 'Prepend' }}
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 hover:opacity-90"
              @click="reset()"
            >
              {{ isZh ? '重置列表' : 'Reset' }}
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
              :class="showLocalState ? 'bg-gray-900 text-white border-gray-800' : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'"
              @click="showLocalState = !showLocalState"
            >
              {{ isZh ? '显示内部状态' : 'Show local state' }}
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all"
              @click="reproKeyDrift"
            >
              {{ isZh ? '⚠️ 一键触发错位' : '⚠️ Repro drift' }}
            </button>
            </LabActionBar>
          </div>

          <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {{
              isZh
                ? '操作步骤：先在第 1 行输入任意内容 → 再点“反转/重排”。当 key=index 时，输入内容会跟着位置跑。'
                : 'Steps: type into row 1 → then reverse/shuffle. With key=index, your text may follow the position.'
            }}
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20 p-4">
          <div class="text-xs font-bold text-gray-600 dark:text-gray-300 mb-3">
            {{ isZh ? '列表渲染（每行有内部输入状态）' : 'Rendered list (each row has local state)' }}
          </div>

          <div v-if="keyMode === 'id'" class="space-y-2">
            <RowInput v-for="item in items" :key="item.id" :label="item.label" :id="item.id" :show-local="showLocalState" />
          </div>
          <div v-else class="space-y-2">
            <RowInput v-for="(item, index) in items" :key="index" :label="item.label" :id="item.id" :show-local="showLocalState" />
          </div>
        </div>
      </div>

      <div class="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {{ isZh ? '关键结论' : 'Key takeaways' }}
          </div>
        </div>
        <div class="p-4 flex-1 space-y-4">
          <LabCodeBlock
            :lang="props.lang"
            :title="isZh ? '✅ 推荐：使用稳定唯一 key' : '✅ Recommended: stable unique key'"
            :code="goodCode"
            path="src/components/lab/stage6-vue-core/LabListKeys.vue"
            token="find:goodCode"
          />
          <LabCodeBlock
            :lang="props.lang"
            :title="isZh ? '⚠️ 风险：使用 index 作为 key' : '⚠️ Risk: using index as key'"
            :code="badCode"
            path="src/components/lab/stage6-vue-core/LabListKeys.vue"
            token="find:badCode"
          />
          <div class="text-xs text-gray-400">
            {{
              isZh
                ? '原则：只要列表会插入/删除/重排，就不要用 index；用业务唯一 id（数据库 id、路径、哈希等）。'
                : 'Rule: if list can insert/remove/reorder, avoid index keys; prefer a stable business id.'
            }}
          </div>
        </div>
      </div>
    </div>

    <details class="mt-6 rounded-xl border border-teal-200 dark:border-teal-900/40 bg-teal-50/60 dark:bg-gray-900/20 p-4">
      <summary class="cursor-pointer font-bold text-teal-800 dark:text-teal-200 text-sm">
        {{ isZh ? '挑战：你能选对 key 吗？' : 'Challenge: can you pick the right key?' }}
      </summary>
      <div class="mt-4 space-y-3">
        <div class="text-xs text-gray-700 dark:text-gray-200">
          {{
            isZh
              ? '题目：当列表可能插入/删除/重排时，v-for 的 :key 最推荐用什么？'
              : 'Question: if a list can insert/remove/reorder, what is the best :key to use?'
          }}
        </div>

        <LabActionBar>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
            :class="challengeAnswer === 'id' ? 'bg-teal-600 text-white border-teal-700' : 'bg-white/70 dark:bg-gray-900/30 border-teal-200 dark:border-teal-900/40 text-gray-700 dark:text-gray-200'"
            @click="challengeAnswer = 'id'"
          >
            {{ isZh ? '稳定唯一 id' : 'Stable unique id' }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
            :class="challengeAnswer === 'index' ? 'bg-teal-600 text-white border-teal-700' : 'bg-white/70 dark:bg-gray-900/30 border-teal-200 dark:border-teal-900/40 text-gray-700 dark:text-gray-200'"
            @click="challengeAnswer = 'index'"
          >
            {{ isZh ? '数组下标 index' : 'Index' }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
            :class="challengeAnswer === 'random' ? 'bg-teal-600 text-white border-teal-700' : 'bg-white/70 dark:bg-gray-900/30 border-teal-200 dark:border-teal-900/40 text-gray-700 dark:text-gray-200'"
            @click="challengeAnswer = 'random'"
          >
            {{ isZh ? 'Math.random()' : 'Math.random()' }}
          </button>
        </LabActionBar>

        <LabActionBar>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition-all"
            @click="submitChallenge"
          >
            {{ isZh ? '提交答案' : 'Submit' }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-teal-200 dark:border-teal-900/40 text-gray-700 dark:text-gray-200 hover:opacity-90"
            @click="challengeResult = null"
          >
            {{ isZh ? '重置' : 'Reset' }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-900/30 border border-teal-200 dark:border-teal-900/40 text-gray-700 dark:text-gray-200 hover:opacity-90"
            @click="openCode('src/components/lab/stage6-vue-core/LabListKeys.vue', 'find::key')"
          >
            {{ isZh ? '对照源码' : 'View source' }}
          </button>
        </LabActionBar>

        <div v-if="challengeResult" class="rounded-lg p-3 border" :class="challengeResult.correct ? 'border-teal-300 bg-teal-50/60 dark:bg-teal-900/10' : 'border-red-300 bg-red-50/60 dark:bg-red-900/10'">
          <div class="text-sm font-bold" :class="challengeResult.correct ? 'text-teal-800 dark:text-teal-200' : 'text-red-700 dark:text-red-200'">
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
import { computed, defineComponent, h, nextTick, ref } from 'vue'
import { I18N } from '../../../constants'
import LabActionBar from '../ui/LabActionBar.vue'
import LabCodeBlock from '../ui/LabCodeBlock.vue'
import { openCode } from '../useOpenCode'
import { evaluateListKeysAnswer, type ListKeysAnswer, type ListKeysChallengeResult } from '../../../labs/logic/listKeysChallenge'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')
const t = computed(() => I18N[props.lang])

type Item = { id: string; label: string }

const initial: Item[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma' },
  { id: 'd', label: 'Delta' }
]

const items = ref<Item[]>([...initial])
const keyMode = ref<'id' | 'index'>('id')
const showLocalState = ref(false)

const challengeAnswer = ref<ListKeysAnswer>('index')
const challengeResult = ref<ListKeysChallengeResult | null>(null)

const submitChallenge = () => {
  challengeResult.value = evaluateListKeysAnswer(challengeAnswer.value)
}

const reverse = () => {
  items.value = [...items.value].reverse()
}

const shuffle = () => {
  const next = [...items.value]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  items.value = next
}

const prepend = () => {
  const id = Math.random().toString(16).slice(2, 6)
  items.value = [{ id, label: `New-${id}` }, ...items.value]
}

const reset = () => {
  items.value = [...initial]
}

const reproKeyDrift = async () => {
  showLocalState.value = true
  keyMode.value = 'index'
  reset()
  await nextTick()
  shuffle()
}

const RowInput = defineComponent({
  name: 'RowInput',
  props: {
    label: { type: String, required: true },
    id: { type: String, required: true },
    showLocal: { type: Boolean, default: false }
  },
  setup(p) {
    const note = ref('')
    const localId = ref(p.id)
    const mismatch = computed(() => p.showLocal && localId.value !== p.id)
    return () =>
      h('div', { class: ['flex items-center gap-3 rounded-lg border bg-white/70 dark:bg-gray-800/30 px-3 py-2', mismatch.value ? 'border-red-300 dark:border-red-800/50 bg-red-50/60 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'] }, [
        h('div', { class: 'w-16 text-xs font-mono text-gray-600 dark:text-gray-300' }, p.id),
        h('div', { class: 'flex-1 text-sm font-bold text-gray-800 dark:text-gray-100 truncate' }, p.label),
        p.showLocal
          ? h('div', { class: ['px-2 py-1 rounded-md text-[10px] font-mono border', mismatch.value ? 'border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-900/10 text-red-800 dark:text-red-200' : 'border-amber-200 dark:border-amber-900/40 bg-amber-50/80 dark:bg-amber-900/10 text-amber-800 dark:text-amber-200'] }, `local:${localId.value}`)
          : null,
        h('input', {
          value: note.value,
          onInput: (e: Event) => {
            const el = e.target as HTMLInputElement | null
            note.value = el?.value ?? ''
          },
          type: 'text',
          placeholder: props.lang === 'zh' ? '输入...' : 'Type...',
          class:
            'w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400'
        })
      ])
  }
})

const goodCode = computed(
  () => `<RowInput
  v-for="item in items"
  :key="item.id"
  :id="item.id"
  :label="item.label"
/>`
)

const badCode = computed(
  () => `<RowInput
  v-for="(item, index) in items"
  :key="index"
  :id="item.id"
  :label="item.label"
/>`
)
</script>
