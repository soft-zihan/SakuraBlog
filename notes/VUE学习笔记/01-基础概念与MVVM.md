# 01. 项目结构与 Vue 入门 🌸

> 欢迎来到前端修炼场！不同于枯燥的文档，我们将**直接剖析这个博客本身的源码**，带你从零看懂 Vue 3 项目。

## 1. 这是一个什么样的项目？

这是一个纯静态的 Vue 3 单页应用 (SPA)。
源码就在你眼前，点击右上角的 **🖊️ (查看源码)** 按钮，你可以随时查看本文档的 Markdown 源码。而查看项目代码，可以去 Github 仓库。

我们先看看文件结构 (File Structure)：

```
sakura-notes/
├── index.html        # 入口 HTML (万物之源)
├── src/
│   ├── main.ts       # Vue 启动入口
│   ├── App.vue       # 根布局容器 (Layout)
│   ├── components/   # 组件文件夹
│   │   ├── AppSidebar.vue      # 左侧侧边栏 (导航逻辑)
│   │   ├── FileTree.vue        # 递归文件树组件
│   │   ├── LabDashboard.vue    # 实验室仪表盘
│   │   ├── PetalBackground.vue # 樱花背景动画
│   │   └── ...                 # 其他工具组件
│   └── constants.ts  # 常量数据 (如 Mock 数据、多语言文本)
├── public/           # 静态资源
└── notes/            # 你的 Markdown 笔记存放处
```

## 2. 一切从 index.html 开始

打开项目根目录的 `index.html`。不同于传统网页满屏的 `div`，Vue 项目的 HTML 通常很空：

```html
<body>
  <div id="app"></div> <!-- 挂载点 -->
  <script type="module" src="/src/main.ts"></script>
</body>
```

**原理**：
Vue 会接管 `id="app"` 的这个 div，并把我们写的所有组件“塞”进去。这就是 **SPA (Single Page Application)** 的核心——页面从未真正刷新，只是 JS 在不断地替换 div 里的内容。

## 3. main.ts：启动引擎

`src/main.ts` 是指挥官。

```typescript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

这句话的意思是：
1. 创建一个 Vue 应用实例。
2. 用 `App.vue` 作为根组件。
3. 把它挂载 (Mount) 到 `index.html` 里的 `#app` 上。

## 4. App.vue：页面骨架

`App.vue` 是核心文件，在最新的架构中，它主要充当**布局容器**和**状态管理器**：

1.  **Template (HTML)**: 它引用了 `<AppSidebar>` 来处理复杂的侧边栏逻辑，引用 `<PetalBackground>` 处理背景动画，主内容区则负责渲染 Markdown 内容。
2.  **Script (JS/TS)**: 它持有全局状态（如当前打开的文件 `currentFile`、主题模式 `isDark`），并通过 **Props** 将数据传递给 `<AppSidebar>`。
3.  **Style (CSS)**: 使用 Tailwind CSS 定义了全局的 Flex 布局。

这种将导航逻辑抽离到 `AppSidebar.vue` 的做法，让 `App.vue` 变得更加清爽，符合组件化开发的“关注点分离”原则。在下一章，我们将深入学习 Vue 3 的灵魂——**响应式系统 (Reactivity)**。