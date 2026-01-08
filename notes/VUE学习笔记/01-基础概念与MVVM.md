# 01. Web 标准与 Vue 架构解析 🌸

> **学习目标**: 理解 Web 标准三剑客，掌握 Vue 渐进式框架的概念，了解单页面应用 (SPA) 的启动流程。

## 1. Web 标准三剑客 (The Triad)

Web 开发的基础是三项核心技术。在 **Sakura Notes** 这个项目中，它们的分工如下：

1.  **HTML (结构 Structure)**: 
    *   *理论*: 负责网页的骨架，定义页面有什么内容。
    *   *项目实战*: 打开根目录下的 [index.html](/index.html)，你会发现它非常简洁。核心只有一行 `<div id="app"></div>`。这是因为 Vue 是一个 **SPA (单页面应用)**，它接管了这个 `div`，所有的页面内容都是由 Vue 通过 JavaScript 动态生成的。
2.  **CSS (表现 Presentation)**: 
    *   *理论*: 负责网页的皮肤，定义页面长什么样。
    *   *项目实战*: 本项目使用了 **Tailwind CSS** (例如 `bg-sakura-50`, `text-teal-500`) 以及组件内的 `<style>` 标签来控制樱花主题的配色和动画效果。
3.  **JavaScript (行为 Behavior)**: 
    *   *理论*: 负责网页的灵魂，定义页面怎么动 (交互)。
    *   *项目实战*: 侧边栏的折叠、笔记的点击切换、实验室的互动，全都是由 TypeScript (JavaScript 的超集) 编写的逻辑驱动的。

## 2. Vue：渐进式框架

Vue (读音 /vjuː/) 是一款用于**构建用户界面**的**渐进式**框架。

### 什么是"数据驱动视图"？
在传统的开发中，我们需要手动操作 DOM (例如 `document.getElementById('id').innerHTML = ...`)。
而在 Vue 中，我们只需要关注**数据**。

**源码实战 ([[App.vue]](/App.vue))**:
```typescript
// 我们定义数据
const fileSystem = ref([]); 

// 并没有写 document.createElement('li')...
// 而是通过模板语法，Vue 自动帮我们渲染出左侧的文件树
```

### 什么是"渐进式"？
你不需要一开始就使用全家桶。
*   **局部改造**: 你可以只在一个 HTML 文件中引入 Vue。
*   **工程化开发**: 也可以像本项目一样，使用 Vite + Vue 3 + TypeScript 构建一个完整的现代化应用。

## 3. 项目启动流程 (Bootstrapping)

一切始于入口文件 [index.tsx](/index.tsx) (对应传统 Vue 项目的 `main.js`)：

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// 1. 创建应用实例
const app = createApp(App);
// 2. 挂载到 index.html 中的 #app 容器
app.mount('#app');
```

当浏览器执行这段代码时，Vue 引擎启动，解析根组件 [[App.vue]](/App.vue)，并将其渲染的内容"塞"进 [index.html](/index.html) 的 `#app` 容器中。

## 4. 单文件组件 (SFC)

打开 [[components/AppSidebar.vue]](/components/AppSidebar.vue)，你会看到 Vue 标志性的 `.vue` 文件结构，它完美对应了 Web 标准：

*   **`<template>`**: 定义 HTML 结构。
*   **`<script setup>`**: 定义 JavaScript 逻辑 (组合式 API)。
*   **`<style>`**: 定义 CSS 样式。

这种 **关注点分离 (Separation of Concerns)** 的模式，让代码非常易于维护。