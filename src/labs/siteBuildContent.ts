export type SiteBuildVueMappingItem = {
  realLabelZh: string
  realLabelEn: string
  shellLabelZh: string
  shellLabelEn: string
  shellPath: string
  shellToken?: string
}

export const SITE_BUILD_VUE_MAPPING: SiteBuildVueMappingItem[] = [
  {
    realLabelZh: '真实：src/App.vue',
    realLabelEn: 'Real: src/App.vue',
    shellLabelZh: 'Shell：ShellApp.vue',
    shellLabelEn: 'Shell: ShellApp.vue',
    shellPath: 'src/components/lab/site-build-vue/ShellApp.vue',
    shellToken: '<ShellLayout'
  },
  {
    realLabelZh: '真实：src/layout/AppLayout.vue',
    realLabelEn: 'Real: src/layout/AppLayout.vue',
    shellLabelZh: 'Shell：ShellLayout.vue',
    shellLabelEn: 'Shell: ShellLayout.vue',
    shellPath: 'src/components/lab/site-build-vue/ShellLayout.vue',
    shellToken: '<ShellSidebar'
  },
  {
    realLabelZh: '真实：src/components/AppSidebar.vue',
    realLabelEn: 'Real: src/components/AppSidebar.vue',
    shellLabelZh: 'Shell：ShellSidebar.vue',
    shellLabelEn: 'Shell: ShellSidebar.vue',
    shellPath: 'src/components/lab/site-build-vue/ShellSidebar.vue',
    shellToken: '<aside'
  },
  {
    realLabelZh: '真实：src/components/AppHeader.vue',
    realLabelEn: 'Real: src/components/AppHeader.vue',
    shellLabelZh: 'Shell：ShellHeader.vue',
    shellLabelEn: 'Shell: ShellHeader.vue',
    shellPath: 'src/components/lab/site-build-vue/ShellHeader.vue',
    shellToken: '<header'
  },
  {
    realLabelZh: '真实：src/components/RightSidebar.vue',
    realLabelEn: 'Real: src/components/RightSidebar.vue',
    shellLabelZh: 'Shell：ShellRightPanel.vue',
    shellLabelEn: 'Shell: ShellRightPanel.vue',
    shellPath: 'src/components/lab/site-build-vue/ShellRightPanel.vue',
    shellToken: '<aside'
  },
  {
    realLabelZh: '真实：src/components/SearchModal.vue',
    realLabelEn: 'Real: src/components/SearchModal.vue',
    shellLabelZh: 'Shell：ShellModalHost.vue',
    shellLabelEn: 'Shell: ShellModalHost.vue',
    shellPath: 'src/components/lab/site-build-vue/ShellModalHost.vue',
    shellToken: 'Teleport'
  },
  {
    realLabelZh: '真实：src/stores/appStore.ts',
    realLabelEn: 'Real: src/stores/appStore.ts',
    shellLabelZh: 'Shell：shellStore.ts',
    shellLabelEn: 'Shell: shellStore.ts',
    shellPath: 'src/components/lab/site-build-vue/shellStore.ts',
    shellToken: 'defineStore'
  }
]

export const SITE_BUILD_VUE_TRANSFER_TASKS_ZH = [
  '把 ShellHeader 的按钮事件名改成更贴近真实项目（open-search/open-settings/open-download/toggle-theme 等）',
  '把右侧面板从“v-if”改成“常驻 + 过渡”，并保持开关逻辑不变',
  '为 ModalHost 增加“点击遮罩关闭 + Esc 关闭”的一致行为（已实现则保持）'
]

export const SITE_BUILD_VUE_TRANSFER_TASKS_EN = [
  'Rename ShellHeader intents to match the real project (open-search/open-settings/open-download/toggle-theme, etc.)',
  'Change right panel from v-if to persistent + transition while keeping behavior',
  'Ensure modal closes by overlay click + Esc consistently (keep if already done)'
]

export const SITE_BUILD_VUE_TRANSFER_ACCEPTANCE_ZH = [
  '折叠侧边栏/右侧面板/弹窗开关都还能正常工作',
  '重构后组件边界更清晰：Layout 只拼装，子组件只展示并发事件',
  '对照真实项目时能一眼看出“对应关系”'
]

export const SITE_BUILD_VUE_TRANSFER_ACCEPTANCE_EN = [
  'Sidebar/panel/modal toggles still work',
  'Cleaner boundaries: Layout wires, children emit intents',
  'Easy to map shell code to the real project'
]

export const SITE_BUILD_VUE_QUESTIONS = [
  {
    id: 'site_shell_boundary',
    questionZh: '下面哪种拆分更符合“代码尽量相似 + 易迁移”？',
    questionEn: 'Which split best matches “similar code + easy migration”?',
    optionsZh: ['把所有 UI 写在一个组件里', 'Layout 负责拼装，Sidebar/Header/Modal 各自独立', '把业务逻辑写进 CSS 里'],
    optionsEn: ['Put everything into one component', 'Layout wires, Sidebar/Header/Modal are separate', 'Put business logic into CSS'],
    answerIndex: 1,
    explanationZh: '真实项目就是靠组件边界与事件意图来组织复杂度，壳子复刻也要先对齐边界。',
    explanationEn: 'Real projects manage complexity with component boundaries and intents; the shell should align with that.'
  },
  {
    id: 'site_shell_state',
    questionZh: '“壳子交互”最核心的心智是什么？',
    questionEn: 'What is the core mental model for shell interactions?',
    optionsZh: ['直接到处改 DOM', '事件 → 状态 → UI（状态驱动）', '只靠动画就够了'],
    optionsEn: ['Mutate DOM everywhere', 'Event → state → UI (state-driven)', 'Animations alone are enough'],
    answerIndex: 1,
    explanationZh: '先建立状态开关，再让 CSS/组件根据状态渲染与过渡，逻辑更像真实项目也更稳。',
    explanationEn: 'Define a state switch first; let UI react to state for rendering/transition. This matches real code and is more robust.'
  }
]

