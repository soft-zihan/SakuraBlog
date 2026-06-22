import type { StageId } from './labCatalog'

export type StageOutcome = {
  goalsZh: string[]
  goalsEn: string[]
  criteriaZh: string[]
  criteriaEn: string[]
}

export const STAGE_OUTCOMES: Record<StageId, StageOutcome> = {
  foundation: {
    goalsZh: ['能写出正确的 HTML 文档骨架并解释各部分职责', '能用语义化标签组织页面结构（而不是全用 div）', '能定位常见资源加载与路径问题（404/大小写/相对路径）'],
    goalsEn: ['Write a correct HTML skeleton and explain each part', 'Structure a page with semantic tags (not only divs)', 'Debug common asset/path issues (404/case/relative paths)'],
    criteriaZh: ['✅ 给任意页面补齐 head 关键 meta（charset/viewport/description）并说明原因，通过 W3C 验证器检查（0 errors）', '✅ 能在 DevTools 里解释 DOM 结构与资源请求（Elements/Network）', '✅ 能做出"语义化前后"对比并说明可维护性收益，在 Lighthouse 中 Accessibility 得分 ≥ 90'],
    criteriaEn: ['✅ Add essential head meta (charset/viewport/description) and explain why, pass W3C validator (0 errors)', '✅ Explain DOM structure and requests in DevTools (Elements/Network)', '✅ Show semantic vs non-semantic structure and explain maintainability gains, Lighthouse Accessibility ≥ 90']
  },
  'css-layout': {
    goalsZh: ['能用 Flex/Grid 解决常见布局并解释取舍', '理解盒模型、定位、滚动容器与 z-index 生效条件', '能把 CSS 心智迁移到 Tailwind（知道类名对应属性）'],
    goalsEn: ['Solve common layouts with Flex/Grid and explain trade-offs', 'Understand box model/positioning/scroll containers/when z-index works', 'Translate CSS mental model to Tailwind (know what utilities mean)'],
    criteriaZh: ['✅ 做出一个响应式布局：移动端单列、桌面端两列（不写死像素），通过 Chrome DevTools 设备模拟测试（手机/平板/桌面）', '✅ 能解释一个 sticky 失效案例并指出滚动容器原因', '✅ 能用 DevTools 定位"谁在撑开/谁在溢出"的盒模型问题'],
    criteriaEn: ['✅ Build a responsive layout: single column on mobile, two columns on desktop (no hardcoded px), pass Chrome DevTools device simulation', '✅ Explain a sticky-not-working case and identify the scroll container cause', '✅ Use DevTools to debug box model/overflow issues']
  },
  'js-basics': {
    goalsZh: ['能用变量/函数/数组对象处理数据并写出可读代码', '能写 DOM 交互：选择元素、更新内容、绑定事件', '能用 Console/断点定位常见错误（类型、作用域、事件）'],
    goalsEn: ['Use variables/functions/arrays/objects to process data with readable code', 'Build DOM interactions: select/update/bind events', 'Debug common issues with console/breakpoints (types/scope/events)'],
    criteriaZh: ['✅ 完成一个动态列表：增删改 + 事件委托（closest），代码通过 ESLint 检查（0 warnings）', '✅ 能解释 let/const/var 的差异并举出一个真实坑', '✅ 能把一个"== 导致 bug"的例子改成更安全写法并解释'],
    criteriaEn: ['✅ Build a dynamic list: add/remove/update + event delegation (closest), code passes ESLint (0 warnings)', '✅ Explain let/const/var differences and give a real pitfall', '✅ Fix a"== causes bug"example with safer code and explain why']
  },
  'js-advanced': {
    goalsZh: ['理解事件循环与 async/await 的执行顺序，不靠背输出', '能写出带错误边界的请求流程（loading/success/error）', '能用 TypeScript 限定数据结构边界，减少运行时错误'],
    goalsEn: ['Understand event loop and async/await ordering without guessing', 'Implement request flows with error boundaries (loading/success/error)', 'Use TypeScript to bound data shapes and reduce runtime errors'],
    criteriaZh: ['✅ 能预测一段 Promise/setTimeout 混用代码的输出顺序并解释原因', '✅ 能把三段依赖请求写成 async/await 串行 + 可见错误提示', '✅ 能给一个函数补齐类型（泛型/联合）并解释类型带来的约束，TypeScript 编译通过且 strict: true 模式下无类型错误'],
    criteriaEn: ['✅ Predict output order for Promise/setTimeout code and explain why', '✅ Write a 3-step dependent request chain with async/await + visible error UI', '✅ Add types (generic/union) to a function and explain the constraints gained, TypeScript compiles with strict: true']
  },
  'vue-core': {
    goalsZh: ['掌握 Vue 响应式、模板语法、指令与生命周期的心智模型', '能把状态变化映射到 UI（列表/条件/事件）', '能避免常见响应式坑（解构/数组/key）'],
    goalsEn: ['Master Vue reactivity/template syntax/directives/lifecycle mental model', 'Map state changes to UI (lists/conditions/events)', 'Avoid common reactivity pitfalls (destructure/arrays/keys)'],
    criteriaZh: ['✅ 能解释 ref/reactive/computed/watch 的使用场景差异', '✅ 能写一个列表编辑场景并正确使用 key（展示错误用法对比）', '✅ 能在 onMounted 发起请求并在 onUnmounted 清理副作用，组件通过 Vue DevTools 检查，无警告'],
    criteriaEn: ['✅ Explain when to use ref/reactive/computed/watch', '✅ Build a list editing case with correct keys (and show wrong-case contrast)', '✅ Start a side effect in onMounted and clean it up in onUnmounted, component passes Vue DevTools check']
  },
  'vue-advanced': {
    goalsZh: ['掌握组件通信：props/emit、v-model、多 v-model、slot、provide/inject', '能抽离可复用逻辑到 composable', '能用 Pinia 管理跨组件状态并保持类型安全，理解 Vue Router 核心概念'],
    goalsEn: ['Master component communication: props/emit, v-model, multi v-model, slots, provide/inject', 'Extract reusable logic into composables', 'Use Pinia for cross-component state with type safety, understand Vue Router core concepts'],
    criteriaZh: ['✅ 能把一个"props drilling"案例改成 provide/inject 或 pinia 并说明取舍', '✅ 能实现一个带 slot 的可复用组件（header/body/actions）', '✅ 能写一个 composable 并在两个组件复用（含类型与边界），Pinia store 编写完整类型定义，TypeScript 无 any'],
    criteriaEn: ['✅ Refactor a props-drilling case into provide/inject or pinia and explain trade-offs', '✅ Build a reusable component with slots (header/body/actions)', '✅ Write a composable reused by two components (with types and boundaries), Pinia store with complete type definitions, no any']
  },
  engineering: {
    goalsZh: ['理解"开发/构建/部署"链路：Vite、依赖、产物与环境差异', '能读懂 package.json 与模块导入导出', '能做基础性能与体积意识（按需加载/缓存/压缩）'],
    goalsEn: ['Understand dev/build/deploy pipeline: Vite, deps, outputs, env differences', 'Read package.json and module import/export', 'Build basic performance/size awareness (lazy load/cache/compress)'],
    criteriaZh: ['✅ 能解释 dev 与 build 的差异（HMR/打包/静态资源路径）', '✅ 能定位一次依赖问题（版本/lockfile/安装）并说明排查路径', '✅ 能在一个页面里做一次"减少重复请求/缓存"的小优化'],
    criteriaEn: ['✅ Explain dev vs build differences (HMR/bundling/asset paths)', '✅ Debug a dependency issue (version/lockfile/install) and explain the process', '✅ Make a small optimization to reduce repeated requests or add caching']
  },
  challenge: {
    goalsZh: ['把前面阶段组合起来：完成一个可运行的小项目或闯关', '能用清晰的验收标准自评与复盘', '能读懂并修改本站代码的一小段实现'],
    goalsEn: ['Combine previous stages into a runnable mini project or quiz', 'Self-evaluate with clear acceptance criteria', 'Read and modify a small part of this site\'s code'],
    criteriaZh: ['✅ 完成一个 mini project：功能正确、错误可见、交互可用，部署到生产环境可访问（Vercel/Netlify/GitHub Pages）', '✅ 能指出自己最薄弱的 1-2 个点并回链到对应 Lab/笔记', '✅ 能提交一段改动（哪怕很小）并解释设计选择，Lighthouse 综合得分 ≥ 80，提交 README 文档包含功能说明、技术选型、部署步骤'],
    criteriaEn: ['✅ Finish a mini project: correct features, visible errors, usable interaction, deployed to production (Vercel/Netlify/GitHub Pages)', '✅ Identify 1-2 weakest areas and link back to the matching Lab/notes', '✅ Submit a small change and explain the design choices, Lighthouse score ≥ 80, submit README with features, tech stack, deployment steps']
  }
}
