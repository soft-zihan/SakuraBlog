# 01. 基础概念：Vue 与 MVVM 🌸

Vue.js 是一套用于构建用户界面的 **渐进式 JavaScript 框架**。它的核心目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。

## 1. 前端开发的三个时代

在理解 Vue 之前，我们先回顾一下网页开发的演变史，这能帮你理解为什么我们需要 Vue。

### 1.1 静态 HTML 时代
最早的网页只是纯文本和标签。
```html
<!-- index.html -->
<h1>Hello World</h1>
<p>This is static.</p>
```
**特点**：页面内容写死在 HTML 文件里。如果想修改文字，必须手动修改源代码并刷新浏览器。

### 1.2 原生 JS (DOM 操作) 时代
为了让网页“动”起来（比如点击按钮数字+1），我们引入了 JavaScript。通过 JS 操作 DOM（文档对象模型）来修改页面。

```javascript
// 命令式编程 (Imperative)
// 1. 获取元素 (查询 DOM)
const div = document.getElementById('app');
const btn = document.getElementById('btn');
// 2. 定义数据
let count = 0;

// 3. 绑定事件
btn.onclick = () => {
  // 4. 修改数据
  count++;
  // 5. 手动更新视图 (修改 DOM)
  div.innerText = count; 
};
```
**痛点**：
- **繁琐**：即使是很小的修改，也需要先“找到元素”，再“修改元素”。
- **难维护**：当页面复杂时，JS 代码里到处都是 DOM 操作，一旦 HTML 结构变了（比如 `id` 变了），JS 代码就会报错。

### 1.3 Vue (声明式编程) 时代
Vue 帮我们把“数据”和“视图”关联起来。你只需要告诉 Vue：“这个 div 显示这个变量”，剩下的同步工作由框架完成。

```html
<!-- 声明式编程 (Declarative) -->
<template>
  <div>{{ count }}</div>
  <button @click="count++">+1</button>
</template>

<script setup>
import { ref } from 'vue';
// 定义数据
const count = ref(0);
// 我们只需要关注数据！视图会自动更新。
</script>
```

## 2. MVVM 架构模式

Vue 的设计受到了 **MVVM (Model-View-ViewModel)** 模式的启发。这是一种专门为前端界面设计的架构模式。

*   **View (视图)**:
    用户看到的界面（HTML 模板）。它负责结构、布局和样式。

*   **Model (模型)**:
    JavaScript 中的数据对象（如 `ref`, `reactive` 定义的数据）。它是业务逻辑和数据的源头。

*   **ViewModel (视图模型)**:
    Vue 框架的核心（Vue 实例）。它是一个“中间人”或“调度者”。
    *   **Data Binding (数据绑定)**: 它可以自动将 Model 的变化同步到 View（数据变了 -> 界面自动变）。
    *   **DOM Listeners (事件监听)**: 它可以自动监听 View 的用户交互，并更新 Model（点击按钮 -> 数据自动变）。

**核心价值**：开发者不再需要直接接触 DOM，只需要关注数据（Model）的变化。Vue 帮你搞定剩下的脏活累活。

## 3. 声明式渲染 (Declarative Rendering)

Vue 的核心特性是 **声明式渲染**。

- **命令式 (Imperative)**: 关注“怎么做”。（比如：第一步拿锤子，第二步拿钉子，第三步敲下去）。原生 JS 操作 DOM 就是命令式的。
- **声明式 (Declarative)**: 关注“要什么”。（比如：我要一张桌子）。Vue 的模板语法就是声明式的。

你只需要声明：`<h1>{{ title }}</h1>`，Vue 就会保证 `h1` 里的内容永远等于 `title` 变量的值，无论 `title` 怎么变、何时变。

## 总结

Vue 的本质是：
1.  **数据驱动**：通过 MVVM 模式，让视图随数据自动变化。
2.  **组件化**：将 UI 切割成独立可复用的代码块（如 Header, Sidebar）。
3.  **高性能**：通过虚拟 DOM 和高效的 Diff 算法减少页面重绘。