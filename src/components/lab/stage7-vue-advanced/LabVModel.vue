<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <h3 class="text-lg font-bold text-indigo-800 dark:text-indigo-300">
      {{ isZh ? 'v-model：表单双向绑定与组件约定' : 'v-model: two-way binding & component contract' }}
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {{
        isZh
          ? 'v-model 本质是语法糖：父组件传入值 + 监听子组件的 update 事件。理解它能让你写出更清晰的组件 API。'
          : 'v-model is syntactic sugar: parent passes a value + listens to child update events. Understanding it helps design clean component APIs.'
      }}
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="space-y-6">
        <div class="bg-indigo-50 dark:bg-indigo-900/15 rounded-xl border border-indigo-200 dark:border-indigo-900/40 p-5">
          <div class="text-sm font-bold text-indigo-800 dark:text-indigo-200 mb-3">
            {{ isZh ? '1) 原生表单控件' : '1) Native form controls' }}
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                <span>{{ isZh ? '昵称（trim）' : 'Nickname (trim)' }}</span>
                <span class="font-mono text-indigo-700 dark:text-indigo-300">{{ nickname }}</span>
              </div>
              <input
                v-model.trim="nickname"
                type="text"
                class="w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                :placeholder="isZh ? '输入昵称...' : 'Type nickname...'"
              />
            </div>

            <div>
              <div class="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                <span>{{ isZh ? '年龄（number）' : 'Age (number)' }}</span>
                <span class="font-mono text-indigo-700 dark:text-indigo-300">{{ age }}</span>
              </div>
              <input
                v-model.number="age"
                type="range"
                min="1"
                max="99"
                class="w-full accent-indigo-600"
              />
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-indigo-200 dark:border-gray-700">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-1">
                {{ isZh ? '预览' : 'Preview' }}
              </div>
              <div class="text-sm text-gray-800 dark:text-gray-100">
                {{ isZh ? '你好，' : 'Hi, ' }}<span class="font-bold">{{ nickname || (isZh ? '匿名' : 'Anonymous') }}</span
                >{{ isZh ? '！' : '!' }}
                <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">({{ isZh ? '年龄' : 'age' }} {{ age }})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">
            {{ isZh ? '2) 自定义组件的 v-model（modelValue 约定）' : '2) v-model on custom components (modelValue contract)' }}
          </div>

          <div class="space-y-4">
            <VModelTextInput v-model="title" :label="isZh ? '标题' : 'Title'" />
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-1">parent state</div>
              <div class="font-mono text-sm text-indigo-700 dark:text-indigo-300">{{ title }}</div>
            </div>
          </div>

          <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {{
              isZh
                ? '默认 v-model 对应 props.modelValue 与 emit("update:modelValue", value)。'
                : 'Default v-model maps to props.modelValue and emit("update:modelValue", value).'
            }}
          </div>
        </div>
      </div>

      <div class="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {{ isZh ? '语法糖展开' : 'Sugar expansion' }}
          </div>
        </div>
        <div class="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <pre class="text-[11px] text-green-300 overflow-x-auto whitespace-pre-wrap">{{ expansionCode }}</pre>
        </div>
        <div class="border-t border-gray-800 p-4">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {{ isZh ? '要点' : 'Notes' }}
          </div>
          <div class="text-xs text-gray-300 space-y-1">
            <div>
              {{
                isZh
                  ? '当你设计组件 API 时，把 v-model 看成“受控组件”：值从父来，更新通过事件回去。'
                  : 'When designing component APIs, treat v-model as a controlled component: value from parent, updates via events.'
              }}
            </div>
            <div>
              {{
                isZh
                  ? '如果需要多个 v-model，可以使用 v-model:xxx，对应 props.xxx 与 update:xxx。'
                  : 'For multiple v-model, use v-model:xxx mapping to props.xxx and update:xxx.'
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <details class="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-4">
      <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
        {{ isZh ? 'React 对照：受控输入（value + onChange）' : 'React compare: controlled input (value + onChange)' }}
      </summary>
      <div class="mt-3 space-y-2 text-xs text-gray-700 dark:text-gray-300">
        <div>
          {{
            isZh
              ? '类比：Vue v-model 是受控组件语法糖；React 则常用 value/onChange 明确表达“值从父来，更新回父”。'
              : 'Analogy: Vue v-model is sugar for controlled components; React commonly uses value/onChange explicitly.'
          }}
        </div>
        <pre class="text-[11px] text-green-300 bg-gray-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{{ reactCompare }}</pre>
      </div>
    </details>

    <LabTransferAndCheck
      :lang="props.lang"
      :transfer-title-zh="'迁移题：设计一个可复用受控输入组件'"
      :transfer-title-en="'Transfer: design a reusable controlled input'"
      :transfer-desc-zh="'把 v-model 的约定迁移到组件 API 设计：让父组件拥有状态，子组件只负责展示与发出更新。'"
      :transfer-desc-en="'Move the v-model contract into component API design: parent owns state; child renders and emits updates.'"
      :transfer-tasks-zh="[
        '实现一个 <TextField>：支持 v-model（modelValue + update:modelValue）',
        '额外：支持 v-model:trimmed 或 v-model:error（多个 v-model 的 API 设计）',
        '要求：子组件不直接修改父状态，只 emit 更新'
      ]"
      :transfer-tasks-en="[
        'Implement a <TextField> with v-model (modelValue + update:modelValue)',
        'Bonus: support multiple v-model (v-model:trimmed or v-model:error)',
        'Child must not mutate parent state directly; only emit updates'
      ]"
      :transfer-acceptance-zh="[
        '父组件改值能驱动子组件 UI 同步',
        '子组件输入能触发 update 事件并更新父组件状态',
        '多个 v-model 的命名与更新事件约定清晰'
      ]"
      :transfer-acceptance-en="[
        'Parent updates drive child UI',
        'Child input emits updates to change parent state',
        'Multiple v-model names and update events are consistent'
      ]"
      source-path="src/components/lab/stage7-vue-advanced/LabVModel.vue"
      :questions="selfCheck"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import LabTransferAndCheck, { type LabSelfCheckQuestion } from '../ui/LabTransferAndCheck.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

const nickname = ref('')
const age = ref(18)
const title = ref(isZh.value ? '我的第一篇文章' : 'My first post')

const VModelTextInput = defineComponent({
  name: 'VModelTextInput',
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, default: '' }
  },
  emits: {
    'update:modelValue': (v: string) => typeof v === 'string'
  },
  setup(p, { emit }) {
    const onInput = (e: Event) => {
      const el = e.target as HTMLInputElement | null
      emit('update:modelValue', el?.value ?? '')
    }

    return () =>
      h('div', { class: 'space-y-1' }, [
        h(
          'div',
          { class: 'text-xs font-bold text-gray-500 dark:text-gray-400' },
          p.label
        ),
        h('input', {
          value: p.modelValue,
          onInput,
          type: 'text',
          class:
            'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all'
        })
      ])
  }
})

const expansionCode = computed(() => {
  if (isZh.value) {
    return `<VModelTextInput v-model="title" />

等价于：

<VModelTextInput
  :modelValue="title"
  @update:modelValue="(v) => (title = v)"
/>`
  }

  return `<VModelTextInput v-model="title" />

Equivalent to:

<VModelTextInput
  :modelValue="title"
  @update:modelValue="(v) => (title = v)"
/>`
})

const reactCompare = computed(() => {
  return `function Parent() {
  const [value, setValue] = useState('')
  return <TextField value={value} onChange={setValue} />
}

function TextField({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}`
})

const selfCheck: LabSelfCheckQuestion[] = [
  {
    id: 'vm-1',
    questionZh: '自定义组件默认 v-model 对应哪一对约定？',
    questionEn: 'Default v-model on custom components maps to which contract?',
    optionsZh: ['value + input', 'modelValue + update:modelValue', 'checked + change'],
    optionsEn: ['value + input', 'modelValue + update:modelValue', 'checked + change'],
    answerIndex: 1,
    explanationZh: 'Vue 3 默认 v-model 约定为 props.modelValue 与 emit(\"update:modelValue\", v)。',
    explanationEn: 'Vue 3 default v-model uses props.modelValue and emit(\"update:modelValue\", v).'
  },
  {
    id: 'vm-2',
    questionZh: '为什么说 v-model 更像“受控组件”？',
    questionEn: 'Why is v-model like a “controlled component”?',
    optionsZh: ['因为子组件拥有状态', '因为值从父来，更新通过事件回去', '因为它会自动做双向数据流'],
    optionsEn: ['Because child owns the state', 'Because value comes from parent and updates go back via events', 'Because it always makes two-way data flow automatically'],
    answerIndex: 1,
    explanationZh: '把 v-model 看成受控组件：父组件持有单一真相，子组件通过 emit 请求更新。',
    explanationEn: 'Treat v-model as controlled: parent holds source of truth, child requests updates via emits.'
  }
]
</script>
