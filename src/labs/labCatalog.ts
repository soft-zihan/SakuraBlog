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
    descZh: 'JS基础语法、函数、DOM操作、事件处理',
    descEn: 'JS Syntax, Functions, DOM, Events',
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
    id: 'vue-core',
    icon: '🥝',
    shortLabelZh: 'Vue Core',
    shortLabelEn: 'Vue Core',
    labelZh: 'Stage 5: Vue 核心',
    labelEn: 'Stage 5: Vue Core',
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
    labelZh: 'Stage 6: Vue 进阶',
    labelEn: 'Stage 6: Vue Advanced',
    noteNum: 4,
    descZh: '组件通信、组合式函数、Pinia、路由',
    descEn: 'Props/Emit, Composables, Pinia, Router',
    goalZh: '掌握 Vue 高级特性与状态管理',
    goalEn: 'Master Vue advanced features and state management',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'stores/*.ts'
  },
  {
    id: 'engineering',
    icon: '🚀',
    shortLabelZh: 'Engineering',
    shortLabelEn: 'Engineering',
    labelZh: 'Stage 7: 前端工程化',
    labelEn: 'Stage 7: Engineering',
    noteNum: 4,
    descZh: 'Vite, NPM, Git, 测试, Tailwind',
    descEn: 'Vite, NPM, Git, Testing, Tailwind',
    goalZh: '构建专业的前端工程环境',
    goalEn: 'Build professional frontend engineering environment',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'vite.config.ts'
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
  { id: 'vue-core', name: 'Vue Core', nameZh: 'Vue 核心' },
  { id: 'vue-advanced', name: 'Vue Advanced', nameZh: 'Vue 进阶' },
  { id: 'engineering', name: 'Engineering', nameZh: '前端工程化' },
  { id: 'challenge', name: 'Challenge', nameZh: '综合挑战' }
] as const

export type StageId = typeof LEARNING_STAGES[number]['id']

export const LABS = [
  // Stage 1: Web Foundation (5 Labs)
  { id: 'LabCodeEvolution', stageId: 'foundation', name: 'Code Evolution (Extra)', nameZh: '代码演进史（扩展）', difficulty: 'easy', tags: ['html', 'history'], concepts: ['web standards', 'evolution'] },
  { id: 'LabHtml', stageId: 'foundation', name: 'HTML Basics', nameZh: 'HTML 基础', difficulty: 'easy', tags: ['html', 'basics'], concepts: ['tags', 'attributes', 'nesting'] },
  { id: 'LabHtmlSemantic', stageId: 'foundation', name: 'HTML Semantics', nameZh: 'HTML 语义化', difficulty: 'easy', tags: ['html', 'semantics'], concepts: ['semantic tags', 'accessibility', 'SEO'] },
  { id: 'LabHtmlBasics', stageId: 'foundation', name: 'HTML Elements', nameZh: 'HTML 元素', difficulty: 'easy', tags: ['html', 'elements'], concepts: ['text', 'links', 'images', 'lists'] },
  { id: 'LabBrowserPipeline', stageId: 'foundation', name: 'Rendering Pipeline (Extra)', nameZh: '渲染流水线（扩展）', difficulty: 'medium', tags: ['browser', 'performance'], concepts: ['DOM', 'CSSOM', 'render tree'] },

  // Stage 2: CSS Layout (4 Labs)
  { id: 'LabCssBasics', stageId: 'css-layout', name: 'CSS Basics', nameZh: 'CSS 基础', difficulty: 'easy', tags: ['css', 'basics'], concepts: ['selectors', 'properties', 'box model'] },
  { id: 'LabCssLayout', stageId: 'css-layout', name: 'CSS Layout', nameZh: 'CSS 布局', difficulty: 'medium', tags: ['css', 'layout'], concepts: ['flexbox', 'grid', 'positioning'] },
  { id: 'LabCssAnimation', stageId: 'css-layout', name: 'CSS Animation (Extra)', nameZh: 'CSS 动画（扩展）', difficulty: 'medium', tags: ['css', 'animation'], concepts: ['transitions', 'transforms', 'keyframes'] },
  { id: 'LabCssPerformance', stageId: 'css-layout', name: 'CSS Performance (Extra)', nameZh: 'CSS 性能（扩展）', difficulty: 'hard', tags: ['css', 'performance'], concepts: ['repaint', 'reflow', 'GPU acceleration'] },

  // Stage 3: JS Basics (5 Labs) - 从 1 个扩展到 5 个
  { id: 'LabJsBasics', stageId: 'js-basics', name: 'JS Syntax', nameZh: 'JS 基础语法', difficulty: 'easy', tags: ['javascript', 'syntax'], concepts: ['variables', 'types', 'operators', 'control flow'] },
  { id: 'LabJsFunctions', stageId: 'js-basics', name: 'Functions & Scope', nameZh: '函数与作用域', difficulty: 'easy', tags: ['javascript', 'functions'], concepts: ['functions', 'scope', 'closures'] },
  { id: 'LabJsArrays', stageId: 'js-basics', name: 'Arrays & Objects', nameZh: '数组与对象', difficulty: 'easy', tags: ['javascript', 'data structures'], concepts: ['arrays', 'objects', 'JSON', 'array methods'] },
  { id: 'LabDom', stageId: 'js-basics', name: 'DOM Manipulation', nameZh: 'DOM 操作', difficulty: 'medium', tags: ['javascript', 'dom'], concepts: ['querySelector', 'textContent', 'classList', 'createElement'] },
  { id: 'LabEvents', stageId: 'js-basics', name: 'Events & Forms', nameZh: '事件与表单', difficulty: 'medium', tags: ['javascript', 'events'], concepts: ['addEventListener', 'event delegation', 'forms', 'validation'] },

  // Stage 4: JS Advanced & TS (6 Labs) - 从 8 个优化到 6 个
  { id: 'LabJsAdvanced', stageId: 'js-advanced', name: 'Closures & Scope', nameZh: '闭包与高级作用域', difficulty: 'hard', tags: ['javascript', 'advanced'], concepts: ['closures', 'execution context', 'hoisting'] },
  { id: 'LabEventLoop', stageId: 'js-advanced', name: 'Event Loop', nameZh: '事件循环', difficulty: 'hard', tags: ['javascript', 'async'], concepts: ['call stack', 'macro tasks', 'micro tasks'] },
  { id: 'LabAsync', stageId: 'js-advanced', name: 'Async Programming', nameZh: '异步编程', difficulty: 'hard', tags: ['javascript', 'async'], concepts: ['promises', 'async/await', 'error handling'] },
  { id: 'LabAjax', stageId: 'js-advanced', name: 'Network Requests', nameZh: '网络请求', difficulty: 'medium', tags: ['javascript', 'network'], concepts: ['fetch', 'HTTP', 'API', 'CORS'] },
  { id: 'LabTypeScript', stageId: 'js-advanced', name: 'TypeScript Basics', nameZh: 'TypeScript 基础', difficulty: 'medium', tags: ['typescript', 'basics'], concepts: ['types', 'interfaces', 'generics'] },
  { id: 'LabTypeScriptAdvanced', stageId: 'js-advanced', name: 'TypeScript Advanced (Extra)', nameZh: 'TypeScript 进阶（扩展）', difficulty: 'hard', tags: ['typescript', 'advanced'], concepts: ['utility types', 'type narrowing', 'discriminated unions'] },

  // Stage 5: Vue Core (7 Labs)
  { id: 'LabReactivity', stageId: 'vue-core', name: 'Reactivity', nameZh: '响应式', difficulty: 'medium', tags: ['vue', 'reactivity'], concepts: ['ref', 'reactive', 'computed'] },
  { id: 'LabProjectTour', stageId: 'vue-core', name: 'Project Tour', nameZh: '项目导览', difficulty: 'easy', tags: ['vue', 'project'], concepts: ['SFC', 'script setup', 'project structure'] },
  { id: 'LabDirectives', stageId: 'vue-core', name: 'Directives', nameZh: '指令', difficulty: 'easy', tags: ['vue', 'directives'], concepts: ['v-bind', 'v-on', 'v-if', 'v-for'] },
  { id: 'LabClassStyle', stageId: 'vue-core', name: 'Class & Style', nameZh: '样式绑定', difficulty: 'easy', tags: ['vue', 'styling'], concepts: [':class', ':style', 'conditional styling'] },
  { id: 'LabEventHandling', stageId: 'vue-core', name: 'Events', nameZh: '事件处理', difficulty: 'easy', tags: ['vue', 'events'], concepts: ['@click', 'modifiers', 'event object'] },
  { id: 'LabLifecycle', stageId: 'vue-core', name: 'Lifecycle', nameZh: '生命周期', difficulty: 'medium', tags: ['vue', 'lifecycle'], concepts: ['onMounted', 'onUnmounted', 'cleanup'] },
  { id: 'LabVueList', stageId: 'vue-core', name: 'List Rendering', nameZh: '列表渲染', difficulty: 'medium', tags: ['vue', 'lists'], concepts: ['v-for', 'key', 'list updates'] },

  // Stage 6: Vue Advanced (6 Labs) - 增加 Props/Emit 基础
  { id: 'LabPropsEmit', stageId: 'vue-advanced', name: 'Props & Emit', nameZh: 'Props/Emit 基础', difficulty: 'medium', tags: ['vue', 'communication'], concepts: ['defineProps', 'defineEmits', 'parent-child'] },
  { id: 'LabSlot', stageId: 'vue-advanced', name: 'Slots', nameZh: '插槽', difficulty: 'medium', tags: ['vue', 'slots'], concepts: ['default slots', 'named slots', 'scoped slots'] },
  { id: 'LabProvideInject', stageId: 'vue-advanced', name: 'Provide/Inject', nameZh: '依赖注入', difficulty: 'hard', tags: ['vue', 'communication'], concepts: ['provide', 'inject', 'cross-tree'] },
  { id: 'LabComposables', stageId: 'vue-advanced', name: 'Composables', nameZh: '组合式函数', difficulty: 'hard', tags: ['vue', 'composables'], concepts: ['useX pattern', 'logic reuse', 'reactivity'] },
  { id: 'LabPinia', stageId: 'vue-advanced', name: 'Pinia', nameZh: 'Pinia 状态管理', difficulty: 'hard', tags: ['vue', 'state'], concepts: ['store', 'state', 'getters', 'actions'] },
  { id: 'LabVueRouter', stageId: 'vue-advanced', name: 'Vue Router', nameZh: 'Vue Router 路由', difficulty: 'medium', tags: ['vue', 'routing'], concepts: ['routes', 'navigation', 'guards', 'dynamic routes'] },

  // Stage 7: Engineering (5 Labs)
  { id: 'LabModuleSystem', stageId: 'engineering', name: 'Modules', nameZh: '模块系统', difficulty: 'medium', tags: ['engineering', 'modules'], concepts: ['ESM', 'import/export', 'bundling'] },
  { id: 'LabNpm', stageId: 'engineering', name: 'NPM', nameZh: '包管理', difficulty: 'easy', tags: ['engineering', 'npm'], concepts: ['dependencies', 'scripts', 'lockfile'] },
  { id: 'LabBuildTools', stageId: 'engineering', name: 'Build Tools', nameZh: '构建工具', difficulty: 'medium', tags: ['engineering', 'build'], concepts: ['vite', 'dev server', 'production build'] },
  { id: 'LabTailwind', stageId: 'engineering', name: 'Tailwind (Extra)', nameZh: 'Tailwind CSS（扩展）', difficulty: 'medium', tags: ['engineering', 'css'], concepts: ['utility classes', 'responsive design'] },
  { id: 'LabCssFrameworks', stageId: 'engineering', name: 'CSS Frameworks (Extra)', nameZh: 'CSS 框架（扩展）', difficulty: 'medium', tags: ['engineering', 'css'], concepts: ['frameworks comparison', 'selection criteria'] },

  // Stage 8: Challenge (2 Labs)
  { id: 'LabQuizGame', stageId: 'challenge', name: 'Quiz', nameZh: '综合测验', difficulty: 'hard', tags: ['challenge', 'quiz'], concepts: ['comprehensive assessment'] },
  { id: 'LabMiniProject', stageId: 'challenge', name: 'Mini Project', nameZh: '迷你项目', difficulty: 'hard', tags: ['challenge', 'project'], concepts: ['application', 'integration', 'deployment'] }
] as const

export type LabId = typeof LABS[number]['id']

export const NOTES: Array<{ id: string; name: string; nameZh: string; path: string }> = []

