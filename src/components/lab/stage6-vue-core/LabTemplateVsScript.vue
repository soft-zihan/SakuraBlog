<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-sakura-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <div class="flex items-start gap-4">
      <div class="text-3xl">🧭</div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-sakura-800 dark:text-sakura-300">
          {{ isZh ? '你现在在写：Template 还是 Script？' : 'Are you writing Template or Script?' }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{
            isZh
              ? '同一套响应式数据，在不同“语境”有不同规则。先把两套规则分清，后面学习会顺很多。'
              : 'The same reactive data behaves differently in two contexts. Separate the rules first; everything becomes easier.'
          }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="space-y-4">
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30 p-5">
          <div class="text-xs font-bold text-gray-700 dark:text-gray-200">
            {{ isZh ? '规则 1：Template 里写表达式，不写语句' : 'Rule 1: Template = expressions, not statements' }}
          </div>
          <div class="mt-3 space-y-2">
            <div class="flex items-start gap-2 text-xs">
              <span class="mt-0.5">✅</span>
              <div class="flex-1">
                <div class="text-gray-700 dark:text-gray-200">{{ isZh ? '允许：读取/运算/三元/函数调用' : 'Allowed: read/math/ternary/calls' }}</div>
                <pre class="mt-1 rounded-lg bg-[#1e1e1e] p-3 text-[11px] text-green-300 overflow-x-auto whitespace-pre-wrap">{{ templateOk }}</pre>
              </div>
            </div>
            <div class="flex items-start gap-2 text-xs">
              <span class="mt-0.5">❌</span>
              <div class="flex-1">
                <div class="text-gray-700 dark:text-gray-200">{{ isZh ? '不允许：if/for/let 等语句（用 v-if / v-for 替代）' : 'Not allowed: if/for/let statements (use v-if / v-for)' }}</div>
                <pre class="mt-1 rounded-lg bg-[#1e1e1e] p-3 text-[11px] text-red-300 overflow-x-auto whitespace-pre-wrap">{{ templateBad }}</pre>
                <div class="mt-1 text-[11px] text-gray-500">
                  {{ isZh ? '提示：报错通常像 “Unexpected token” 或 “Invalid expression”。' : 'Tip: errors often look like “Unexpected token” / “Invalid expression”.' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20 p-5">
          <div class="text-xs font-bold text-gray-700 dark:text-gray-200">
            {{ isZh ? '规则 2：.value 只在 Script 里出现' : 'Rule 2: .value only shows up in Script' }}
          </div>

          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-2">script</div>
              <pre class="rounded-lg bg-[#1e1e1e] p-3 text-[11px] text-green-300 overflow-x-auto whitespace-pre-wrap">{{ scriptSnippet }}</pre>
            </div>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
              <div class="text-[10px] uppercase font-bold text-gray-400 mb-2">template</div>
              <pre class="rounded-lg bg-[#1e1e1e] p-3 text-[11px] text-green-300 overflow-x-auto whitespace-pre-wrap">{{ templateSnippet }}</pre>
            </div>
          </div>

          <div class="mt-4 flex items-center gap-3">
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-bold bg-sakura-600 hover:bg-sakura-700 text-white transition-all"
              @click="count++"
            >
              {{ isZh ? '点击：count++' : 'Click: count++' }}
            </button>
            <div class="text-xs text-gray-600 dark:text-gray-300">
              {{ isZh ? '当前 count（模板显示）' : 'Current count (template view)' }}:
              <span class="font-mono font-bold text-sakura-700 dark:text-sakura-300">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-gray-900/30 p-5">
          <div class="text-xs font-bold text-indigo-800 dark:text-indigo-200">
            {{ isZh ? '快速判断：你应该写在哪里？' : 'Quick decision: where should it go?' }}
          </div>

          <div class="mt-3 space-y-2 text-xs text-gray-700 dark:text-gray-200">
            <div class="flex items-start gap-2">
              <span class="mt-0.5">1)</span>
              <div>
                <span class="font-bold">{{ isZh ? '展示' : 'Display' }}</span>
                <span class="text-gray-600 dark:text-gray-300"> — {{ isZh ? 'Template' : 'Template' }}</span>
                <div class="text-[11px] text-gray-500">{{ isZh ? '只做“把值渲染出来”。' : 'Render values.' }}</div>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-0.5">2)</span>
              <div>
                <span class="font-bold">{{ isZh ? '计算派生值' : 'Derived values' }}</span>
                <span class="text-gray-600 dark:text-gray-300"> — computed</span>
                <div class="text-[11px] text-gray-500">{{ isZh ? '需要缓存、可复用、无副作用。' : 'Cached, reusable, no side effects.' }}</div>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-0.5">3)</span>
              <div>
                <span class="font-bold">{{ isZh ? '响应变化做副作用' : 'Side effects' }}</span>
                <span class="text-gray-600 dark:text-gray-300"> — watch / watchEffect</span>
                <div class="text-[11px] text-gray-500">{{ isZh ? '请求、存储、日志、订阅等。' : 'Requests, persistence, logging, subscriptions.' }}</div>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-0.5">4)</span>
              <div>
                <span class="font-bold">{{ isZh ? '事件与流程' : 'Events & flow' }}</span>
                <span class="text-gray-600 dark:text-gray-300"> — Script 的函数</span>
                <div class="text-[11px] text-gray-500">{{ isZh ? '模板只负责触发函数，逻辑放函数里。' : 'Template triggers; Script handles logic.' }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20 p-5">
          <div class="text-xs font-bold text-gray-700 dark:text-gray-200">
            {{ isZh ? '常见卡点速查' : 'Common sticking points' }}
          </div>
          <div class="mt-3 grid grid-cols-1 gap-2 text-xs">
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
              <div class="font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '“为什么模板里不用 .value？”' : '“Why no .value in template?”' }}</div>
              <div class="mt-1 text-[11px] text-gray-500">
                {{ isZh ? '模板会自动解包 ref；但在脚本里你拿到的是 Ref 对象，所以要用 .value。' : 'Templates auto-unwrap refs; scripts get Ref objects, so use .value.' }}
              </div>
            </div>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
              <div class="font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '“为什么这里改了值，UI 没更新？”' : '“Why UI did not update?”' }}</div>
              <div class="mt-1 text-[11px] text-gray-500">
                {{ isZh ? '先确认改的是响应式来源（ref/reactive），而不是解构后的普通变量。' : 'Ensure you update reactive sources (ref/reactive), not destructured plain values.' }}
              </div>
            </div>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
              <div class="font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '“模板里想写 if 怎么办？”' : '“How to do if in template?”' }}</div>
              <div class="mt-1 text-[11px] text-gray-500">
                {{ isZh ? '用 v-if/v-else；复杂条件先抽 computed 再 v-if。' : 'Use v-if/v-else; extract complex conditions into computed.' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <details class="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/20 p-4">
      <summary class="cursor-pointer font-bold text-gray-700 dark:text-gray-200 text-sm">
        {{ isZh ? 'React 对照：JSX 也有“表达式规则”' : 'React compare: JSX also follows “expression rules”' }}
      </summary>
      <div class="mt-3 space-y-2 text-xs text-gray-700 dark:text-gray-300">
        <div>
          {{
            isZh
              ? '类比：Vue 的 Template 里写表达式；React 的 JSX 花括号里同样写表达式。控制流（if/for）要放在外层 JS 里，用条件渲染/数组 map 来表达。'
              : 'Analogy: Vue templates use expressions; React JSX braces also take expressions. Control flow lives in JS (conditional render / array map).'
          }}
        </div>
        <pre class="text-[11px] text-green-300 bg-gray-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{{ reactCompare }}</pre>
      </div>
    </details>

    <LabTransferAndCheck
      :lang="props.lang"
      :transfer-title-zh="'迁移题：把两套语境写成自己的 Checklist'"
      :transfer-title-en="'Transfer: build your own Template/Script checklist'"
      :transfer-desc-zh="'目标是做到：看到一段代码就能立刻判断应该写在 Template、Script、computed 还是 watch。'"
      :transfer-desc-en="'Goal: you can immediately tell whether code belongs in template, script, computed, or watch.'"
      :transfer-tasks-zh="[
        '列 5 条 Template 允许写的表达式形态（例：三元/??/?.）',
        '列 5 条 Template 不允许写的语句形态（例：if/for/let）以及替代方案（v-if/v-for/抽函数）',
        '列 3 条“逻辑下沉到 script”的判断标准（复杂流程/复用/可测试）'
      ]"
      :transfer-tasks-en="[
        'List 5 expression shapes allowed in templates (ternary/??/?. etc.)',
        'List 5 statement shapes not allowed in templates (if/for/let etc.) and their alternatives',
        'List 3 rules for pushing logic into script (complex flow/reuse/testability)'
      ]"
      :transfer-acceptance-zh="[
        '能解释为什么模板限制为表达式（可读性/可维护性）',
        '能解释 .value 的规则差异（模板解包 vs 脚本 Ref 对象）'
      ]"
      :transfer-acceptance-en="[
        'Explain why templates are expression-only (readability/maintainability)',
        'Explain .value rule differences (auto-unwrapping vs Ref objects)'
      ]"
      source-path="src/components/lab/stage6-vue-core/LabTemplateVsScript.vue"
      :questions="selfCheck"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import LabTransferAndCheck, { type LabSelfCheckQuestion } from '../ui/LabTransferAndCheck.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

const count = ref(0)

const templateOk = computed(() => {
  return `{{ count + 1 }}\n{{ isAdmin ? 'Admin' : 'User' }}\n{{ formatPrice(total) }}`
})

const templateBad = computed(() => {
  return `{{ if (count > 0) { count++ } }}\n{{ for (const x of list) {} }}\n{{ let a = 1 }}`
})

const scriptSnippet = computed(() => {
  if (isZh.value) {
    return `const count = ref(0)\ncount.value++\n\nconst total = computed(() => count.value * 2)`
  }
  return `const count = ref(0)\ncount.value++\n\nconst total = computed(() => count.value * 2)`
})

const templateSnippet = computed(() => {
  if (isZh.value) {
    return `<button @click=\"count++\">+1</button>\n<div>{{ count }}</div>`
  }
  return `<button @click=\"count++\">+1</button>\n<div>{{ count }}</div>`
})

const reactCompare = computed(() => {
  return `function Counter() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <div>{count}</div>
      <div>{count > 0 ? 'positive' : 'zero'}</div>
      {items.map(x => <Row key={x.id} item={x} />)}
    </>
  )
}`
})

const selfCheck: LabSelfCheckQuestion[] = [
  {
    id: 'ts-1',
    questionZh: '模板里允许写哪一类内容？',
    questionEn: 'What is allowed inside template interpolations?',
    optionsZh: ['表达式（读取/运算/三元/调用）', '语句（if/for/let）', '任意 JS 代码块'],
    optionsEn: ['Expressions (read/math/ternary/calls)', 'Statements (if/for/let)', 'Any JS block'],
    answerIndex: 0,
    explanationZh: '模板表达式只能写表达式；控制流通过 v-if/v-for 等指令表达，复杂逻辑下沉到脚本。',
    explanationEn: 'Templates accept expressions; control flow uses directives like v-if/v-for, and complex logic belongs in script.'
  },
  {
    id: 'ts-2',
    questionZh: '关于 ref 的 .value，哪个说法正确？',
    questionEn: 'Which statement about ref .value is correct?',
    optionsZh: ['模板里需要 .value，脚本里不需要', '脚本里需要 .value，模板里通常不需要', '两边都不需要'],
    optionsEn: ['Templates need .value, scripts do not', 'Scripts need .value, templates usually do not', 'Neither needs .value'],
    answerIndex: 1,
    explanationZh: '脚本里 ref 是 Ref 对象，需要 .value；模板会自动解包 ref，因此模板里一般直接用变量名。',
    explanationEn: 'In scripts, refs are Ref objects and require .value; templates auto-unwrap refs, so you usually use the variable name.'
  }
]
</script>
