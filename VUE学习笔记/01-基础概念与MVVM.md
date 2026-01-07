# 基础概念：Vue 与 MVVM

Vue.js 是一套用于构建用户界面的 **渐进式 JavaScript 框架**。它的核心目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。

## 1. 为什么需要框架？

在原生 JavaScript 开发中，我们经常面临以下问题，而 Vue 致力于解决这些痛点：

### 1.1 繁琐的 DOM 操作
在原生 JS (Vanilla JS) 中，修改页面内容需要频繁调用 `document.getElementById` 或 `querySelector`，然后手动设置 `innerHTML`。
```javascript
// 原生 JS 写法
const box = document.querySelector('.box');
box.innerText = 'Hello';
box.style.color = 'red';
```
当页面交互变复杂时，代码中会充斥着大量的 DOM 操作，难以维护且容易出错（例如操作了不存在的 DOM）。

### 1.2 状态同步困难
如果一个数据（比如购物车数量）在页面的 Header、Sidebar 和 Main 区域都要显示，原生 JS 需要你手动去更新这三个地方。一旦漏掉一个，页面显示就会不一致。

### 1.3 代码组织混乱
原生开发中，HTML、CSS 和 JS 往往是分离的，或者逻辑混杂在一起。Vue 提出了 **组件化 (Component)** 的概念，把一个功能块（如导航栏）封装成一个独立的 `.vue` 文件，包含它自己的结构、样式和逻辑。

## 2. Vue 的解决方案

Vue 通过 **声明式渲染** 和 **MVVM 模式** 解决了上述问题。

```html
<!-- Vue 写法 -->
<template>
  <div class="box" :style="{ color: textColor }">{{ message }}</div>
</template>

<script setup>
import { ref } from 'vue';
const message = ref('Hello');
const textColor = ref('red');
</script>
```

你只需要改变 `message.value`，界面会自动更新。你不需要关心 DOM 是怎么被修改的。

## 3. MVVM 架构模式

Vue 的设计遵循 **MVVM (Model-View-ViewModel)** 模式。

*   **Model (模型)**:
    JavaScript 中的数据状态（如 `ref`, `reactive` 定义的对象）。它是真理的来源。

*   **View (视图)**:
    用户看到的界面（DOM）。

*   **ViewModel (视图模型)**:
    Vue 实例本身。它是连接 Model 和 View 的桥梁。
    *   它监听 Model 的变化，自动更新 View（数据绑定）。
    *   它监听 View 的交互（如点击），自动更新 Model（事件监听）。

## 总结

Vue 的核心优势在于：
1.  **解放双手**：不再手动操作 DOM。
2.  **数据驱动**：关注数据本身，而不是界面的渲染过程。
3.  **组件化**：构建可复用、易维护的大型应用。