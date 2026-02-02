export const LAB_TABS = [
  {
    id: 'foundation',
    icon: '🧱',
    shortLabelZh: 'HTML',
    shortLabelEn: 'HTML',
    labelZh: 'Stage 1: 网页基础',
    labelEn: 'Stage 1: Web Foundation',
    noteNum: 1,
    descZh: 'Web标准三剑客：HTML结构',
    descEn: 'Web Standards: HTML Structure',
    goalZh: '理解网页的组成结构',
    goalEn: 'Understand web page structure and basic styling',
    noteLink: '/notes/VUE学习笔记/1、HTML-CSS.md',
    relatedCode: 'index.html, App.vue'
  },
  {
    id: 'css-layout',
    icon: '🎨',
    shortLabelZh: 'CSS Layout',
    shortLabelEn: 'CSS Layout',
    labelZh: 'Stage 2: CSS 布局',
    labelEn: 'Stage 2: CSS Layout',
    noteNum: 1,
    descZh: 'Flexbox, Grid, 响应式设计, 动画',
    descEn: 'Flexbox, Grid, Responsive Design, Animation',
    goalZh: '精通现代 CSS 布局与动画',
    goalEn: 'Master modern CSS layout and animation',
    noteLink: '/notes/VUE学习笔记/1、HTML-CSS.md',
    relatedCode: 'styles/main.css'
  },
  {
    id: 'js-basics',
    icon: '⚡',
    shortLabelZh: 'JS Core',
    shortLabelEn: 'JS Core',
    labelZh: 'Stage 3: JS 基础',
    labelEn: 'Stage 3: JS Basics',
    noteNum: 2,
    descZh: 'JS基础语法、DOM操作、事件处理',
    descEn: 'JS Syntax, DOM, Events',
    goalZh: '掌握 JavaScript 核心语法与DOM操作',
    goalEn: 'Master JavaScript core syntax and DOM manipulation',
    noteLink: '/notes/VUE学习笔记/2、JavaScript.md',
    relatedCode: 'useSearch.ts'
  },
  {
    id: 'js-advanced',
    icon: '🛡️',
    shortLabelZh: 'TS/Async',
    shortLabelEn: 'TS/Async',
    labelZh: 'Stage 4: JS 进阶 & TS',
    labelEn: 'Stage 4: JS Advanced & TS',
    noteNum: 4,
    descZh: 'TypeScript类型系统、异步编程、网络请求',
    descEn: 'TypeScript, Async Programming, Ajax',
    goalZh: '掌握 TS 类型安全与异步处理',
    goalEn: 'Master TS type safety and async handling',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'types/*.ts'
  },
  {
    id: 'engineering',
    icon: '🚀',
    shortLabelZh: 'Engineering',
    shortLabelEn: 'Engineering',
    labelZh: 'Stage 5: 前端工程化',
    labelEn: 'Stage 5: Engineering',
    noteNum: 4,
    descZh: 'Vite, NPM, 模块化, Tailwind',
    descEn: 'Vite, NPM, Modules, Tailwind',
    goalZh: '构建专业的前端工程环境',
    goalEn: 'Build professional frontend engineering environment',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'vite.config.ts'
  },
  {
    id: 'vue-core',
    icon: '🥝',
    shortLabelZh: 'Vue Core',
    shortLabelEn: 'Vue Core',
    labelZh: 'Stage 6: Vue 核心',
    labelEn: 'Stage 6: Vue Core',
    noteNum: 3,
    descZh: 'Vue概述、响应式、指令、生命周期',
    descEn: 'Vue Overview, Reactivity, Directives, Lifecycle',
    goalZh: '掌握 Vue 3 核心概念与指令',
    goalEn: 'Master Vue 3 core concepts and directives',
    noteLink: '/notes/VUE学习笔记/3、Vue基础.md',
    relatedCode: 'App.vue'
  },
  {
    id: 'vue-advanced',
    icon: '🧩',
    shortLabelZh: 'Vue Adv',
    shortLabelEn: 'Vue Adv',
    labelZh: 'Stage 7: Vue 进阶',
    labelEn: 'Stage 7: Vue Advanced',
    noteNum: 4,
    descZh: '组件通信、组合式函数、Pinia、插槽',
    descEn: 'Props/Emit, Composables, Pinia, Slots',
    goalZh: '掌握 Vue 高级特性与状态管理',
    goalEn: 'Master Vue advanced features and state management',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'stores/*.ts'
  },
  {
    id: 'challenge',
    icon: '🏆',
    shortLabelZh: 'Challenge',
    shortLabelEn: 'Challenge',
    labelZh: 'Stage 8: 综合挑战',
    labelEn: 'Stage 8: Challenge',
    noteNum: 0,
    descZh: '综合测验与迷你项目',
    descEn: 'Quiz & Mini Projects',
    goalZh: '检验综合能力',
    goalEn: 'Test your skills',
    noteLink: '',
    relatedCode: 'Challenge'
  }
] as const

export type LabTabId = typeof LAB_TABS[number]['id']

export const LEARNING_STAGES = [
  { id: 'foundation', name: 'Web Foundation', nameZh: '网页基础' },
  { id: 'css-layout', name: 'CSS Layout', nameZh: 'CSS 布局' },
  { id: 'js-basics', name: 'JS Basics', nameZh: 'JS 基础' },
  { id: 'js-advanced', name: 'JS Advanced', nameZh: 'JS 进阶' },
  { id: 'engineering', name: 'Engineering', nameZh: '前端工程化' },
  { id: 'vue-core', name: 'Vue Core', nameZh: 'Vue 核心' },
  { id: 'vue-advanced', name: 'Vue Advanced', nameZh: 'Vue 进阶' },
  { id: 'challenge', name: 'Challenge', nameZh: '综合挑战' }
] as const

export type StageId = typeof LEARNING_STAGES[number]['id']

export const LABS = [
  { id: 'LabCodeEvolution', stageId: 'foundation', name: 'Code Evolution (Extra)', nameZh: '代码演进史（扩展）' },
  { id: 'LabHtml', stageId: 'foundation', name: 'HTML Basics', nameZh: 'HTML 基础' },
  { id: 'LabHtmlSemantic', stageId: 'foundation', name: 'HTML Semantics', nameZh: 'HTML 语义化' },
  { id: 'LabHtmlBasics', stageId: 'foundation', name: 'HTML Elements', nameZh: 'HTML 元素' },
  { id: 'LabBrowserPipeline', stageId: 'foundation', name: 'Rendering Pipeline (Extra)', nameZh: '渲染流水线（扩展）' },

  { id: 'LabCssBasics', stageId: 'css-layout', name: 'CSS Basics', nameZh: 'CSS 基础' },
  { id: 'LabCssLayout', stageId: 'css-layout', name: 'CSS Layout', nameZh: 'CSS 布局' },
  { id: 'LabCssAnimation', stageId: 'css-layout', name: 'CSS Animation (Extra)', nameZh: 'CSS 动画（扩展）' },
  { id: 'LabCssPerformance', stageId: 'css-layout', name: 'CSS Performance (Extra)', nameZh: 'CSS 性能（扩展）' },

  { id: 'LabJsBasics', stageId: 'js-basics', name: 'JS Basics', nameZh: 'JS 基础语法' },

  { id: 'LabJs', stageId: 'js-advanced', name: 'JS Core', nameZh: 'JS 核心' },
  { id: 'LabDom', stageId: 'js-advanced', name: 'DOM', nameZh: 'DOM 操作' },
  { id: 'LabJsAdvanced', stageId: 'js-advanced', name: 'Closures & Scope', nameZh: '闭包与作用域' },
  { id: 'LabEventLoop', stageId: 'js-advanced', name: 'Event Loop', nameZh: '事件循环' },
  { id: 'LabAjax', stageId: 'js-advanced', name: 'Ajax', nameZh: '网络请求' },
  { id: 'LabAsync', stageId: 'js-advanced', name: 'Async', nameZh: '异步编程' },
  { id: 'LabTypeScript', stageId: 'js-advanced', name: 'TypeScript', nameZh: 'TypeScript' },
  { id: 'LabTypeScriptAdvanced', stageId: 'js-advanced', name: 'TypeScript Advanced (Extra)', nameZh: 'TypeScript 进阶（扩展）' },

  { id: 'LabModuleSystem', stageId: 'engineering', name: 'Modules', nameZh: '模块系统' },
  { id: 'LabNpm', stageId: 'engineering', name: 'NPM', nameZh: '包管理' },
  { id: 'LabBuildTools', stageId: 'engineering', name: 'Build Tools', nameZh: '构建工具' },
  { id: 'LabTailwind', stageId: 'engineering', name: 'Tailwind (Extra)', nameZh: 'Tailwind CSS（扩展）' },
  { id: 'LabCssFrameworks', stageId: 'engineering', name: 'CSS Frameworks (Extra)', nameZh: 'CSS 框架（扩展）' },

  { id: 'LabReactivity', stageId: 'vue-core', name: 'Reactivity', nameZh: '响应式' },
  { id: 'LabProjectTour', stageId: 'vue-core', name: 'Project Tour', nameZh: '项目导览' },
  { id: 'LabDirectives', stageId: 'vue-core', name: 'Directives', nameZh: '指令' },
  { id: 'LabClassStyle', stageId: 'vue-core', name: 'Class & Style', nameZh: '样式绑定' },
  { id: 'LabEventHandling', stageId: 'vue-core', name: 'Events', nameZh: '事件处理' },
  { id: 'LabLifecycle', stageId: 'vue-core', name: 'Lifecycle', nameZh: '生命周期' },
  { id: 'LabVueList', stageId: 'vue-core', name: 'List Rendering', nameZh: '列表渲染' },

  { id: 'LabPropsEmit', stageId: 'vue-advanced', name: 'Props & Emit', nameZh: 'Props/Emit' },
  { id: 'LabSlot', stageId: 'vue-advanced', name: 'Slots', nameZh: '插槽' },
  { id: 'LabProvideInject', stageId: 'vue-advanced', name: 'Provide/Inject', nameZh: '依赖注入' },
  { id: 'LabComposables', stageId: 'vue-advanced', name: 'Composables', nameZh: '组合式函数' },
  { id: 'LabPinia', stageId: 'vue-advanced', name: 'Pinia', nameZh: 'Pinia' },

  { id: 'LabQuizGame', stageId: 'challenge', name: 'Quiz', nameZh: '综合测验' },
  { id: 'LabMiniProject', stageId: 'challenge', name: 'Mini Project', nameZh: '迷你项目' }
] as const

export type LabId = typeof LABS[number]['id']

export const NOTES: Array<{ id: string; name: string; nameZh: string; path: string }> = []

