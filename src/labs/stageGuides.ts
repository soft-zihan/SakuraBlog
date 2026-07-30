export type StageGuide = {
  titleZh: string
  titleEn: string
  leadZh: string
  leadEn: string
  prerequisitesZh: string[]
  prerequisitesEn: string[]
  syntaxPointsZh: string[]
  syntaxPointsEn: string[]
  commonPitfallsZh: string[]
  commonPitfallsEn: string[]
  extensionsZh: string[]
  extensionsEn: string[]
}

export const STAGE_GUIDES: Record<
  | 'foundation'
  | 'css-layout'
  | 'js-basics'
  | 'js-advanced'
  | 'engineering'
  | 'vue-core'
  | 'vue-advanced'
  | 'challenge',
  StageGuide
> = {
  foundation: {
    titleZh: '导读：网页基础（HTML）',
    titleEn: 'Guide: Web Foundation (HTML)',
    leadZh: '这一阶段解决“网页到底由什么组成、浏览器如何理解你的代码”。先把骨架搭对，再谈样式与交互。',
    leadEn: 'This stage answers “what a webpage is made of, and how browsers interpret your code”. Get structure right first.',
    prerequisitesZh: [
      '会用浏览器打开 HTML 文件并查看效果',
      '知道标签/属性/嵌套的基本概念',
      '理解“结构（HTML）/表现（CSS）/行为（JS）”三分法',
      '能分清相对路径与绝对路径（图片/链接）',
      '会用开发者工具查看 Elements/Network'
    ],
    prerequisitesEn: [
      'Open an HTML file in the browser',
      'Know tags/attributes/nesting at a high level',
      'Understand structure/style/behavior split',
      'Know relative vs absolute paths for assets',
      'Use DevTools (Elements/Network)'
    ],
    syntaxPointsZh: [
      'HTML 文档骨架：doctype/html/head/body',
      'head 常用 meta：charset/viewport/title',
      '语义化结构：header/nav/main/article/section/footer',
      '文本与分组：h1-h6/p/span/div/ul-ol-li',
      '链接与资源：a/img 的 href/src 与相对路径',
      '表格：table/thead/tbody/tr/th/td',
      '表单：form/label/input/select/textarea/button',
      'input 常见 type：text/password/email/checkbox/radio',
      '全局属性：id/class/style/data-*',
      '可访问性入门：img alt、label for、button type'
    ],
    syntaxPointsEn: [
      'Document skeleton: doctype/html/head/body',
      'Common head meta: charset/viewport/title',
      'Semantic layout: header/nav/main/article/section/footer',
      'Text & grouping: headings/paragraphs/lists',
      'Links & assets: a/img + relative paths',
      'Tables: table/thead/tbody/tr/th/td',
      'Forms: form/label/input/select/textarea/button',
      'Common input types (text/password/email/checkbox/radio)',
      'Global attributes: id/class/style/data-*',
      'Basic a11y: alt/label/button type'
    ],
    commonPitfallsZh: [
      '标签嵌套不合法导致布局/样式异常',
      '忘记 meta viewport 导致移动端缩放异常',
      '资源路径写错（相对路径层级/大小写）导致 404',
      'button 默认是 submit，表单里容易误触提交',
      '只追求“能显示”，忽略语义与可访问性（alt/label）'
    ],
    commonPitfallsEn: [
      'Invalid nesting breaks layout/styles',
      'Missing viewport breaks mobile rendering',
      'Wrong asset paths cause 404',
      'button defaults to submit inside forms',
      'Ignoring semantics/a11y (alt/label) hurts maintainability'
    ],
    extensionsZh: [
      '对照源码：src/index.html（入口与挂载点）',
      '多媒体标签：audio/video（格式与兼容性）',
      'SEO 入门：title/description/开放图谱（按需）',
      '浏览器渲染链路：解析 → 构建 DOM/CSSOM → 渲染',
      'iframe 安全：sandbox/referrerPolicy（按需）'
    ],
    extensionsEn: [
      'Source reference: src/index.html (entry & mount)',
      'Media tags: audio/video',
      'SEO basics: title/description/OG tags',
      'Rendering pipeline: parse → DOM/CSSOM → render',
      'iframe security: sandbox/referrerPolicy'
    ]
  },
  'css-layout': {
    titleZh: '导读：CSS 布局与表现',
    titleEn: 'Guide: CSS Layout & Styling',
    leadZh: '这一阶段解决“怎么把内容摆放整齐、在不同屏幕下保持可读”。你会理解 Tailwind 工具类背后的 CSS 原理。',
    leadEn: 'This stage focuses on layout and responsive styling. You will understand the CSS behind Tailwind utilities.',
    prerequisitesZh: [
      '能读懂并组合常见 class（含 Tailwind 工具类）',
      '理解盒模型：content/padding/border/margin',
      '理解选择器/优先级/继承的基本概念',
      '会用开发者工具查看 CSS 计算值与盒模型'
    ],
    prerequisitesEn: [
      'Read and combine common classes (incl. Tailwind utilities)',
      'Understand the box model',
      'Know selectors/specificity/inheritance at a high level',
      'Use DevTools to inspect computed styles'
    ],
    syntaxPointsZh: [
      '层叠与继承：cascade/inherit/initial',
      '选择器与优先级：class/id/后代/伪类/伪元素',
      '单位与响应式：px/%/em/rem/vw/vh',
      '盒模型与 box-sizing: border-box',
      'display：block/inline/inline-block/none',
      '定位：relative/absolute/fixed/sticky',
      '层叠上下文：z-index 生效条件',
      'Flex：容器与子项属性（对齐/伸缩）',
      'Grid：列/行/gap 与自适应布局',
      '溢出与滚动：overflow、滚动容器',
      '过渡与变换：transition/transform',
      '动画入门：keyframes 与 timing'
    ],
    syntaxPointsEn: [
      'Cascade & inheritance',
      'Selectors & specificity',
      'Units: px/%/em/rem/vw/vh',
      'Box model & box-sizing: border-box',
      'display: block/inline/inline-block/none',
      'Positioning: relative/absolute/fixed/sticky',
      'Stacking context: when z-index works',
      'Flexbox: alignment and sizing',
      'Grid: rows/cols/gap',
      'Overflow & scrolling',
      'Transitions & transforms',
      'Animations: keyframes basics'
    ],
    commonPitfallsZh: [
      '只背 Tailwind 类名，不理解对应 CSS 属性',
      'sticky 需要 top 且受滚动容器影响',
      'z-index 不生效：被层叠上下文隔离或未定位',
      'flex 子项默认可 shrink，容易被挤压溢出',
      'margin 折叠/高度塌陷导致“怎么推都不动”',
      '写死 px 不做响应式，移动端不可读'
    ],
    commonPitfallsEn: [
      'Memorizing utilities without understanding CSS',
      'sticky needs top and correct scroll container',
      'z-index fails due to stacking context / positioning',
      'Flex items shrink by default and may overflow',
      'Margin collapsing/layout quirks cause surprises',
      'Hardcoded px hurts responsive layouts'
    ],
    extensionsZh: [
      '对照源码：src/styles/app.css?find=--primary-100（全局样式与 CSS 变量）',
      'CSS 变量：var() + 主题切换思路',
      'calc()/clamp()：更稳的响应式尺寸',
      'prefers-reduced-motion：无障碍动画策略',
      '性能心智：重排/重绘与动画选型'
    ],
    extensionsEn: [
      'Source reference: src/styles/app.css?find=--primary-100 (global styles & CSS vars)',
      'CSS variables: var() and theming',
      'calc()/clamp() for responsive sizing',
      'prefers-reduced-motion for accessibility',
      'Layout vs paint performance mental model'
    ]
  },
  'js-basics': {
    titleZh: '导读：JavaScript 基础',
    titleEn: 'Guide: JavaScript Basics',
    leadZh: '这一阶段解决“让页面动起来”。你会把语法点落到：事件、DOM、数据处理与调试思路。',
    leadEn: 'This stage makes the page interactive: events, DOM, data handling, and debugging basics.',
    prerequisitesZh: [
      '能区分 HTML/CSS/JS 的职责',
      '会打开浏览器开发者工具（Console/Sources）',
      '理解变量、条件判断、函数的用途',
      '知道基本数据类型（number/string/boolean）'
    ],
    prerequisitesEn: [
      'Know the roles of HTML/CSS/JS',
      'Open DevTools (Console/Sources)',
      'Understand variables/conditions/functions',
      'Know primitive types (number/string/boolean)'
    ],
    syntaxPointsZh: [
      '书写规范与调试：console、断点、报错栈',
      '变量与作用域：let/const（块级作用域）',
      '数据类型与引用：原始值 vs 对象/数组',
      '运算符与比较：===、逻辑运算与短路',
      '类型转换：显式/隐式转换的边界',
      '流程控制：if/for/while/switch',
      '函数：声明/表达式/箭头函数',
      '数组方法：forEach/map/filter/reduce',
      '对象与 JSON：解构、JSON.parse/stringify',
      'DOM 获取与修改：querySelector/textContent/classList',
      '事件监听：addEventListener、事件对象、冒泡',
      '表单交互：input/change/submit + preventDefault'
    ],
    syntaxPointsEn: [
      'Debugging: console, breakpoints, stack traces',
      'Variables & scope: let/const',
      'Primitives vs reference types',
      'Operators & comparison: === and short-circuiting',
      'Type coercion: explicit vs implicit',
      'Control flow: if/for/while/switch',
      'Functions: declarations/expressions/arrow',
      'Array methods: map/filter/reduce',
      'Objects & JSON',
      'DOM: querySelector/textContent/classList',
      'Events: addEventListener, bubbling',
      'Forms: submit + preventDefault'
    ],
    commonPitfallsZh: [
      '隐式类型转换导致“看起来对但结果错”',
      '空值/未找到元素就调用属性（null is not an object）',
      '滥用 innerHTML（XSS 风险 + 性能问题）',
      '对动态元素重复绑定事件，遗漏事件委托',
      '修改 const 绑定对象的属性与“不可变”概念混淆'
    ],
    commonPitfallsEn: [
      'Implicit coercion produces surprising results',
      'Accessing properties on null/undefined',
      'Overusing innerHTML (XSS + performance)',
      'Missing event delegation for dynamic elements',
      'Confusing const binding with object immutability'
    ],
    extensionsZh: [
      '正则表达式入门：test/match/replace（按需）',
      '浏览器存储：localStorage/sessionStorage（按需）',
      '定时器：setTimeout/setInterval 与清理',
      '对照源码：src/utils/fileUtils.ts?find=findNodeByPath（文件树与读取工具）',
      '对照源码：src/composables/useContentClick.ts?find=code://（内部链接与 code:// 处理）'
    ],
    extensionsEn: [
      'Regex basics: test/match/replace',
      'Browser storage: localStorage/sessionStorage',
      'Timers: setTimeout/setInterval and cleanup',
      'Source reference: src/utils/fileUtils.ts?find=findNodeByPath (file tree & reading)',
      'Source reference: src/composables/useContentClick.ts?find=code:// (internal links & code://)'
    ]
  },
  'js-advanced': {
    titleZh: '导读：JS 进阶、异步与 TypeScript',
    titleEn: 'Guide: JS Advanced, Async & TypeScript',
    leadZh: '这一阶段解决“复杂交互为什么会乱、怎么让它稳定可维护”。核心是事件循环、Promise/async、类型约束。',
    leadEn: 'This stage is about maintainability: event loop, promises/async, and type safety with TypeScript.',
    prerequisitesZh: [
      '熟悉函数、作用域与闭包的基本概念',
      '会使用数组方法与对象解构',
      '能读懂基本报错堆栈并定位到文件行',
      '了解模块化（import/export）的大致用途'
    ],
    prerequisitesEn: [
      'Understand scope/closures at a basic level',
      'Use array methods and destructuring',
      'Read stack traces and locate file/line',
      'Know why modules (import/export) exist'
    ],
    syntaxPointsZh: [
      '事件循环：宏任务/微任务与执行顺序',
      'Promise：then/catch/finally 与链式调用',
      'async/await：try/catch 与错误边界',
      '并发控制：Promise.all/allSettled/race',
      '网络请求：fetch、状态码、超时与重试思路',
      '中止请求：AbortController（按需）',
      'ESM：named/default export、循环依赖心智',
      'TypeScript 基础：type/interface/可选/只读',
      '联合/交叉类型：表达“多种可能”',
      '泛型：让函数/组件更可复用',
      '类型收窄：typeof/in/判空/可辨识联合',
      'unknown vs any：安全的边界'
    ],
    syntaxPointsEn: [
      'Event loop: macro/microtasks ordering',
      'Promises: then/catch/finally and chaining',
      'async/await: try/catch and error boundaries',
      'Concurrency: all/allSettled/race',
      'Networking: fetch, status codes, retry ideas',
      'AbortController (optional)',
      'ES Modules: named/default export, cycles',
      'TS basics: type/interface/optional/readonly',
      'Union & intersection types',
      'Generics for reuse',
      'Type narrowing techniques',
      'unknown vs any'
    ],
    commonPitfallsZh: [
      '吞掉错误（catch 里空处理）导致静默失败',
      '忘记 await 或漏处理 Promise 造成竞态/未捕获拒绝',
      '把 async 函数当同步返回值用',
      'any 滥用等于放弃 TS',
      '用类型断言“骗过”编译器，埋下运行时崩溃',
      '以为 TS 会校验接口返回的数据结构（它不会）'
    ],
    commonPitfallsEn: [
      'Swallowing errors causes silent failures',
      'Missing await / unhandled promises cause races',
      'Treating async functions as synchronous',
      'Overusing any defeats TS',
      'Abusing type assertions hides real issues',
      'TS does not validate runtime JSON'
    ],
    extensionsZh: [
      '工具类型：Partial/Pick/Omit/Record（按需）',
      'tsconfig 关键项：strict/moduleResolution（按需）',
      '对照源码：src/types.ts?find=export%20interface%20FileNode（类型设计与边界）',
      '对照源码：src/utils/sanitize.ts?find=DOMPurify（运行时安全边界）',
      '网络可靠性：重试、退避、幂等等策略（按需）'
    ],
    extensionsEn: [
      'Utility types: Partial/Pick/Omit/Record',
      'tsconfig essentials: strict/moduleResolution',
      'Source reference: src/types.ts?find=export%20interface%20FileNode (type boundaries)',
      'Source reference: src/utils/sanitize.ts?find=DOMPurify (runtime safety)',
      'Network reliability patterns (retry/backoff/idempotency)'
    ]
  },
  engineering: {
    titleZh: '导读：前端工程化',
    titleEn: 'Guide: Frontend Engineering',
    leadZh: '这一阶段解决“项目为什么能跑起来、怎么构建与发布”。你会看懂依赖、构建配置与目录规范。',
    leadEn: 'This stage explains how the project builds and ships: dependencies, build config, and structure.',
    prerequisitesZh: [
      '会用 npm 安装依赖与运行脚本',
      '理解“模块/依赖”概念（import/export）',
      '知道开发构建（dev）与生产构建（build）的区别',
      '能看懂 package.json 与基本目录结构'
    ],
    prerequisitesEn: [
      'Run npm scripts',
      'Understand modules/dependencies',
      'Know dev vs production build',
      'Read package.json and project structure'
    ],
    syntaxPointsZh: [
      '脚本入口：dev/build/test/typecheck 的职责',
      '依赖分层：dependencies vs devDependencies',
      'Vite 配置：root/publicDir/outDir/assetsDir',
      'GitHub Pages：base 路径与静态资源引用',
      '构建前生成：scripts/* → public/data 与 public/raw',
      '运行时加载：fetch public/notes 渲染 Markdown',
      '路径别名：@/* 与 tsconfig paths',
      '环境变量：envDir 与 VITE_* 约定',
      '样式体系：Tailwind 工具类 + 少量全局 CSS',
      '状态管理：Pinia + 持久化插件的边界',
      '安全渲染：Markdown → sanitize 的必要性'
    ],
    syntaxPointsEn: [
      'Scripts: dev/build/test/typecheck responsibilities',
      'Deps: dependencies vs devDependencies',
      'Vite config: root/publicDir/outDir/assetsDir',
      'GitHub Pages: base path and asset URLs',
      'Build-prep scripts: scripts/* → public artifacts',
      'Runtime loading: fetch public/notes to render Markdown',
      'Path alias: @/* and tsconfig paths',
      'Env vars: envDir and VITE_* convention',
      'Styling: Tailwind + minimal global CSS',
      'State: Pinia with persistence boundaries',
      'Safe rendering: sanitize HTML output'
    ],
    commonPitfallsZh: [
      '不理解 base 路径导致资源 404（静态部署常见）',
      '把业务逻辑、数据处理、UI 全塞进一个组件',
      '随意复制依赖/配置但不知道作用与代价',
      '把 public 当源码目录用（路径/构建心智错位）',
      '生成脚本产物与运行时读取路径不一致'
    ],
    commonPitfallsEn: [
      'Wrong base path causes 404 on static hosting',
      'Stuffing logic/data/UI into one component',
      'Copying deps/config without understanding trade-offs',
      'Confusing public assets with source modules',
      'Mismatch between generated artifacts and runtime paths'
    ],
    extensionsZh: [
      '对照源码：vite.config.ts?find=base:（root/base/outDir）',
      '对照源码：scripts/generate-tree.ts?find=public/raw（生成 data/raw/notes）',
      '对照源码：src/composables/useContentRenderer.ts（渲染链路）',
      '测试心智：vitest + jsdom（按需）',
      '发布与缓存：静态站点的资源缓存策略（按需）'
    ],
    extensionsEn: [
      'Source: vite.config.ts (root/base/outDir)',
      'Source: scripts/generate-tree.ts (public artifacts)',
      'Source: src/composables/useContentRenderer.ts (rendering pipeline)',
      'Testing basics: vitest + jsdom',
      'Static hosting caching strategies'
    ]
  },
  'vue-core': {
    titleZh: '导读：Vue 核心（响应式与模板）',
    titleEn: 'Guide: Vue Core (Reactivity & Template)',
    leadZh: '这一阶段解决“数据如何变成 UI”。你会掌握 ref/reactive、模板语法与常用指令。',
    leadEn: 'This stage connects data to UI: reactivity, template syntax, and core directives.',
    prerequisitesZh: [
      '理解组件是可复用 UI 单元',
      '理解“状态 → 视图”的单向心智',
      '能写基本的 JS/TS 与函数',
      '能读懂基本的 props/事件（emit）概念'
    ],
    prerequisitesEn: [
      'Understand components as reusable UI units',
      'Understand “state → view” mental model',
      'Write basic JS/TS and functions',
      'Know props and emits at a high level'
    ],
    syntaxPointsZh: [
      '单文件组件（SFC）与 <script setup>',
      '响应式：ref/reactive 与 .value',
      '派生状态：computed',
      '模板表达式与指令：v-bind(:)、v-on(@)',
      '条件渲染：v-if/v-show',
      '列表渲染：v-for 与 key',
      '双向绑定：v-model（输入/表单）',
      '事件处理：事件对象与修饰符（.stop/.prevent）',
      '样式绑定：:class/:style 与条件样式',
      '生命周期：onMounted/onUnmounted（资源清理）',
      '基础组件通信：props 下发 + emit 上报'
    ],
    syntaxPointsEn: [
      'Single File Components and <script setup>',
      'Reactivity: ref/reactive and .value',
      'Derived state: computed',
      'Directives: v-bind(:) and v-on(@)',
      'Conditional rendering: v-if/v-show',
      'List rendering: v-for and key',
      'Two-way binding: v-model',
      'Event handling and modifiers',
      'Class/style binding',
      'Lifecycle: onMounted/onUnmounted',
      'Basic communication: props + emit'
    ],
    commonPitfallsZh: [
      '忘记 ref 需要 .value，导致逻辑不生效',
      'v-for 用不稳定 key（比如 index）导致复用错乱',
      '解构 reactive 导致丢失响应式（需要 toRefs）',
      '把 computed 当方法频繁调用或写副作用',
      '在同一元素上同时写 v-if 与 v-for（易踩坑）',
      '不清理事件/定时器导致内存泄漏'
    ],
    commonPitfallsEn: [
      'Forgetting .value on refs',
      'Unstable keys (e.g., index) cause rendering bugs',
      'Destructuring reactive objects loses reactivity',
      'Misusing computed as methods / with side effects',
      'Mixing v-if and v-for on the same element',
      'Not cleaning up listeners/timers'
    ],
    extensionsZh: [
      'watch/watchEffect：副作用与监听（按需）',
      '对照源码：src/main.ts?find=createApp（应用入口）',
      '对照源码：src/App.vue?find=useCodeOpener（全局初始化与事件桥）',
      '请求与生命周期：mounted 时拉数据、卸载时清理',
      '组件拆分心智：先边界，再复用'
    ],
    extensionsEn: [
      'watch/watchEffect (optional)',
      'Source: src/main.ts?find=createApp (app entry)',
      'Source: src/App.vue?find=useCodeOpener (global init & event bridge)',
      'Data fetching patterns with lifecycle',
      'Component boundaries and reuse mindset'
    ]
  },
  'vue-advanced': {
    titleZh: '导读：Vue 进阶（组件通信与状态管理）',
    titleEn: 'Guide: Vue Advanced (Communication & State)',
    leadZh: '这一阶段解决“项目变大以后怎么组织代码”。你会掌握 props/emit、插槽、组合式函数与 Pinia。',
    leadEn: 'This stage is about scaling: communication patterns, composables, and Pinia.',
    prerequisitesZh: [
      '能写基本组件并通过 props 传参',
      '理解响应式数据流与组件更新',
      '会读懂 composable 的返回值并正确解构',
      '具备基本 TypeScript 类型阅读能力'
    ],
    prerequisitesEn: [
      'Build components and pass props',
      'Understand reactive data flow and updates',
      'Read and use composable return values',
      'Read basic TypeScript types'
    ],
    syntaxPointsZh: [
      'Props 类型：defineProps/withDefaults（约束输入）',
      'Emit 类型：defineEmits（约束输出）',
      '插槽：默认/具名/作用域插槽',
      'Provide/Inject：跨层级依赖传递',
      '组合式函数：抽离数据与副作用（useX 模式）',
      'Pinia：store/state/getters/actions',
      'storeToRefs：避免解构丢响应（Pinia）',
      '持久化：pinia-plugin-persistedstate 的边界',
      '异步 action：加载态/错误态与重试',
      '可维护性：类型边界与模块边界'
    ],
    syntaxPointsEn: [
      'Typed props: defineProps/withDefaults',
      'Typed emits: defineEmits',
      'Slots: default/named/scoped',
      'Provide/Inject for cross-tree dependencies',
      'Composables: extract logic (useX pattern)',
      'Pinia: store/state/getters/actions',
      'storeToRefs to keep reactivity',
      'Persistence boundaries',
      'Async actions: loading/error states',
      'Maintainability: type and module boundaries'
    ],
    commonPitfallsZh: [
      '把全局状态当万能，导致耦合与难复用',
      '插槽过度设计导致组件不可读',
      'composable 里混入 UI 逻辑导致复用失败',
      '直接解构 store/state 丢失响应式（需要 storeToRefs）',
      '把副作用写在 computed 里，导致隐性 bug',
      '事件监听/订阅不清理导致泄漏'
    ],
    commonPitfallsEn: [
      'Overusing global state increases coupling',
      'Overusing slots hurts readability',
      'Mixing UI into composables reduces reuse',
      'Destructuring store breaks reactivity (use storeToRefs)',
      'Side effects in computed cause hidden bugs',
      'Not cleaning up listeners/subscriptions'
    ],
    extensionsZh: [
      '对照源码：src/stores/learningStore.ts?find=defineStore（Pinia 实战：学习进度）',
      '对照源码：src/stores/articleStore.ts?find=defineStore（Pinia 实战：文章交互）',
      '对照源码：src/composables/useBackup.ts?find=export function（组合式函数：备份/恢复）',
      '对照源码：src/composables/useTokenSecurity.ts?find=AES-GCM（组合式函数：加密策略）',
      'UI 组件库选型：何时引入（本项目用 Tailwind）',
      '表单与校验：规则/状态/错误提示（按需）'
    ],
    extensionsEn: [
      'Source: src/stores/learningStore.ts?find=defineStore (Pinia: learning progress)',
      'Source: src/stores/articleStore.ts?find=defineStore (Pinia: interactions)',
      'Source: src/composables/useBackup.ts?find=export function (composable: backup/restore)',
      'Source: src/composables/useTokenSecurity.ts?find=AES-GCM (composable: encryption)',
      'UI library selection (this project uses Tailwind)',
      'Forms and validation patterns'
    ]
  },
  challenge: {
    titleZh: '导读：综合挑战',
    titleEn: 'Guide: Final Challenge',
    leadZh: '这一阶段把前面学到的串起来：读需求、拆组件、实现交互、最后对照源码验证你的实现。',
    leadEn: 'This stage ties everything together: requirements, components, interactions, and verification via source.',
    prerequisitesZh: ['完成至少前 6 个 Stage 的核心内容', '能独立调试一个小功能', '理解“先跑通再优化”的节奏', '会查源码并定位到关键文件'],
    prerequisitesEn: ['Complete core content up to Stage 6', 'Debug a small feature independently', 'Ship first, then refine', 'Locate key files in the codebase'],
    syntaxPointsZh: [
      '任务拆解：需求 → 页面 → 组件 → 状态',
      '数据流设计：局部状态 vs 全局状态',
      '复用策略：组件/组合式函数/工具函数',
      '可维护性：类型、模块边界与命名',
      '体验：加载态/空态/错误态/反馈',
      '自检：用源码查看器对照实现与差异'
    ],
    syntaxPointsEn: [
      'Break down: requirements → page → components → state',
      'Data flow: local vs global state',
      'Reuse: components/composables/utils',
      'Maintainability: types, boundaries, naming',
      'UX: loading/empty/error states',
      'Self-check via source viewer'
    ],
    commonPitfallsZh: [
      '一开始就追求完美导致卡住',
      '不写类型导致后面返工',
      '忽视边界条件（空数据/失败情况）',
      '把临时方案“写死”进架构里',
      '没有做最小可用版本（MVP）导致发散'
    ],
    commonPitfallsEn: [
      'Perfectionism blocks progress',
      'Skipping types causes rework',
      'Ignoring edge cases',
      'Hardcoding temporary hacks into architecture',
      'No MVP leads to scope creep'
    ],
    extensionsZh: [
      '对照源码：src/components/lab/LabDashboard.vue?find=activeTab（Stage 与 Lab 组织方式）',
      '对照源码：src/components/lab/PanelContent.vue?find=LAB_TABS（左侧面板与阶段目录）',
      '对照源码：src/labs/labCatalog.ts（Stage/Lab 定义）',
      '补齐测试：vitest 覆盖核心逻辑（按需）',
      '重构心智：先保证行为不变，再抽象'
    ],
    extensionsEn: [
      'Source: src/components/lab/LabDashboard.vue?find=activeTab (stage organization)',
      'Source: src/components/lab/PanelContent.vue?find=LAB_TABS (sidebar & tabs)',
      'Source: src/labs/labCatalog.ts (definitions)',
      'Add tests with vitest (optional)',
      'Refactor mindset: preserve behavior first'
    ]
  }
}
