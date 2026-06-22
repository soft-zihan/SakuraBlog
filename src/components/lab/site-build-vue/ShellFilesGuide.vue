<template>
  <ShellGlassCard>
    <div class="p-6 border-b border-white/60 dark:border-gray-700/60">
      <div class="text-xs font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] tracking-wide">
        {{ lang === 'zh' ? '文件视角' : 'Files view' }}
      </div>
      <div class="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
        {{ lang === 'zh' ? '把“状态机”落在真实文件上' : 'Map the state machine to real files' }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {{
          lang === 'zh'
            ? '目标：把“页面结构 / 样式 / 交互”拆到 3 个真实文件里，每一步都能保存、能复现、能回退。'
            : 'Goal: split structure/styles/interactions into 3 real files so every step is saveable, reproducible, and revertible.'
        }}
      </div>

      <div class="mt-4 rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/35 p-4">
        <div class="text-xs font-extrabold text-gray-800 dark:text-gray-100">
          {{ lang === 'zh' ? '推荐学习顺序' : 'Suggested order' }}
        </div>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          {{
            lang === 'zh'
            ? '1) 先看“示范（完整版）”：理解目标长什么样，注释提示会保留。2) 想看过程就点“重播”：回到第 1 步（与动手写初始状态一致），按 1/2/3… 顺序一步步还原到示范。3) 再做“动手写”：按 1/2/3… 提示补齐。4) 最后用“对照参考（可改）”做对照与小改动验证。'
              : '1) Read the full example first: notes stay in the final. 2) Click Replay to restart (step 1 matches hands-on) and rebuild step by step. 3) Do hands-on and fill guided blanks. 4) Use editable reference to compare and tweak.'
          }}
        </div>
      </div>
    </div>

    <div class="p-6 space-y-5">
      <ShellThreeFilePlayground
        :lang="lang"
        :eyebrow="lang === 'zh' ? '示范（完整版，可逐步演示）' : 'Example (complete, replayable)'"
        :title="lang === 'zh' ? '示范：完整代码 + 提示注释（点“重播”回到第 1 步）' : 'Example: complete code + notes (click Replay to restart)'"
        :description="lang === 'zh' ? '默认展示完整版本（按钮显示为“重播”）。点“重播”会回到第 1 步（与动手写初始状态一致），之后每点一次就按 1/2/3… 顺序逐步还原到示范；注释保留。' : 'Shows the complete version by default (button shows Replay). Click Replay to restart from step 1 (same as hands-on), then advance step-by-step back to the complete example; notes stay.'"
        :allow-reset="true"
        file-action="none"
        :initial="SAMPLE_STEPPER_INITIAL"
        :stepper="{ steps: SAMPLE_STEPPER_STEPS, persist: false, guide: 'highlight', startAt: 'complete' }"
      />

      <ShellThreeFilePlayground
        :lang="lang"
        :eyebrow="lang === 'zh' ? '动手写（挖空练习）' : 'Hands-on (fill the blanks)'"
        :title="lang === 'zh' ? '从挖空脚手架开始：按①②等提示补齐 3 个文件' : 'Start from a scaffold: follow steps and fill 3 files'"
        :description="lang === 'zh' ? '代码里会保留详细提示注释（1/2/3…）。你把缺失部分补齐即可；无需删注释，注释保留。' : 'The code includes step-by-step notes (1/2/3...). Fill the missing parts; keep the notes.'"
        :allow-reset="true"
        :storage-key="'site-build-vue:files:practice:v5'"
        file-action="reset"
        file-action-label="还原"
        :initial="PRACTICE_INITIAL"
        :practice="{
          titleZh: '即时自检（不跑脚本也能验收）',
          titleEn: 'Instant checks (no script required)',
          rules: [
            {
              id: 'html-theme-btn',
              file: 'index',
              kind: 'regex',
              value: 'id\\s*=\\s*[\\x22\\x27]themeBtn[\\x22\\x27]',
              labelZh: 'HTML：存在按钮 #themeBtn',
              labelEn: 'HTML: button #themeBtn exists',
              hintZh: 'actions 区放一个 button，并确保 id=\'themeBtn\'。',
              hintEn: 'Add a button in actions and make sure id=\'themeBtn\'.'
            },
            {
              id: 'html-q',
              file: 'index',
              kind: 'regex',
              value: 'id\\s*=\\s*[\\x22\\x27]q[\\x22\\x27]',
              labelZh: 'HTML：存在输入框 #q',
              labelEn: 'HTML: input #q exists',
              hintZh: 'toolbar 里放一个 <input id=\'q\' placeholder=\'Search...\' />。',
              hintEn: 'Put <input id=\'q\' placeholder=\'Search...\' /> in the toolbar.'
            },
            {
              id: 'html-list',
              file: 'index',
              kind: 'regex',
              value: 'id\\s*=\\s*[\\x22\\x27]list[\\x22\\x27]',
              labelZh: 'HTML：存在列表容器 #list',
              labelEn: 'HTML: list container #list exists',
              hintZh: '主内容区放一个 <section id=\'list\' class=\'grid\'></section>。',
              hintEn: 'Add <section id=\'list\' class=\'grid\'></section> in main.'
            },
            {
              id: 'js-localstorage',
              file: 'main',
              kind: 'contains',
              value: 'localStorage',
              labelZh: 'JS：使用 localStorage 持久化主题',
              labelEn: 'JS: uses localStorage for theme',
              hintZh: '保存一个 key（例如 theme），刷新后读取并应用到 <html> 的 class。',
              hintEn: 'Save a key (e.g. theme), read it on load and apply to <html> class.'
            },
            {
              id: 'js-dark-toggle',
              file: 'main',
              kind: 'regex',
              value: 'classList\\.(toggle|add|remove)\\([^\\n\\)]*dark',
              labelZh: 'JS：能切换 .dark 类',
              labelEn: 'JS: toggles the .dark class',
              hintZh: '建议用 document.documentElement.classList.toggle(\'dark\', isDark)。',
              hintEn: 'Try document.documentElement.classList.toggle(\'dark\', isDark).'
            },
            {
              id: 'css-card',
              file: 'styles',
              kind: 'regex',
              value: '\\\\.card\\s*\\{',
              labelZh: 'CSS：存在 .card 样式',
              labelEn: 'CSS: .card style exists',
              hintZh: '先写 border/background/padding/圆角，让卡片“像面板”。',
              hintEn: 'Start with border/background/padding/radius.'
            },
            {
              id: 'js-render-card',
              file: 'main',
              kind: 'regex',
              value: 'class\\s*=\\s*[\\x22\\x27]card[\\x22\\x27]',
              labelZh: 'JS：render() 输出 .card',
              labelEn: 'JS: render() outputs .card',
              hintZh: 'render 里用模板字符串拼 <article class=card>...</article>。',
              hintEn: 'In render(), build <article class=card>...</article> with template strings.'
            },
            {
              id: 'js-filter-input',
              file: 'main',
              kind: 'regex',
              value: 'addEventListener\\(\\s*[\\x22\\x27]input[\\x22\\x27]',
              labelZh: 'JS：监听输入框 input 事件',
              labelEn: 'JS: listens to input event',
              hintZh: '给 #q 绑定 input 事件：过滤 data -> render(filtered)。',
              hintEn: 'Bind input on #q: filter data -> render(filtered).'
            }
          ]
        }"
      />

      <ShellThreeFilePlayground
        :lang="lang"
        :eyebrow="lang === 'zh' ? '对照参考（可改）' : 'Reference (editable)'"
        :title="lang === 'zh' ? '最小三件套：可编辑、可重置、可实时预览' : 'Minimal trio: editable, resettable, live preview'"
        :description="lang === 'zh' ? '用它对照你写的版本：先保证结构与交互链路一致，再微调样式与内容。' : 'Use this as a reference: match structure and interaction flow first, then polish.'"
        :allow-reset="true"
        :storage-key="'site-build-vue:files:sample:v4'"
        file-action="reset"
        file-action-label="还原"
        :initial="PRACTICE_COMPLETE"
      />
    </div>
  </ShellGlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ShellGlassCard from './ShellGlassCard.vue'
import ShellThreeFilePlayground from './ShellThreeFilePlayground.vue'
import { PRACTICE_COMPLETE, PRACTICE_INITIAL, buildSampleStepperSteps } from './filesGuideSamples'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)

const SAMPLE_STEPPER_STEPS = computed(() => buildSampleStepperSteps(lang.value))
const SAMPLE_STEPPER_INITIAL = computed(() => SAMPLE_STEPPER_STEPS.value[0]?.files || { indexHtml: '', stylesCss: '', mainJs: '' })
</script>
