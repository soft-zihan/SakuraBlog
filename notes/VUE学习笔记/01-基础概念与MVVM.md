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
│   ├── App.vue       # 根组件 (整个页面的骨架)
│   ├── components/   # 组件文件夹 (如左侧文件树、实验室工具)
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

`App.vue` 是核心文件，它使用了 **SFC (Single File Component)** 格式：

1.  **Template (HTML)**: 定义了左侧侧边栏 (Sidebar) 和右侧内容区 (Main Content)。
2.  **Script (JS/TS)**: 包含了所有的逻辑，比如“当前打开了哪个文件”、“是否是暗黑模式”。
3.  **Style (CSS)**: 使用 Tailwind CSS 处理了大部分样式。

在下一章，我们将深入 `App.vue` 的 `<script setup>`，学习 Vue 3 的灵魂——**响应式系统 (Reactivity)**。