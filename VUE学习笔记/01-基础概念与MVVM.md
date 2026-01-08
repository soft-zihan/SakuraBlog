# 01. 基础概念：Vue 与 MVVM 🌸

> Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。

## 1. 为什么选择 Vue?

在传统的前端开发（Vanilla JS / jQuery）中，我们经常面临以下痛点：

### 1.1 痛点：DOM 操作繁琐
要修改页面上的一个文字，你需要：
1. `document.querySelector` 找到元素。
2. 修改 `innerText` 或 `innerHTML`。
3. 如果数据变了，要手动再次修改。

```javascript
// ❌ 传统写法：命令式编程
const div = document.querySelector('#app');
div.innerText = 'Hello World';
div.style.color = 'red';
```

### 1.2 解决方案：声明式渲染
Vue 允许你采用**声明式**的方式描述你的 UI。你只需要告诉 Vue "我想要显示什么"，而不需要告诉它 "怎么一步步去改 DOM"。

```html
<!-- ✅ Vue 写法：声明式编程 -->
<template>
  <div :style="{ color: textColor }">{{ message }}</div>
</template>

<script setup>
import { ref } from 'vue';
const message = ref('Hello World');
const textColor = ref('red');
</script>
```

当 `message.value` 改变时，Vue 会自动帮你更新 DOM。

## 2. 什么是 MVVM?

Vue 的设计受到了 **MVVM (Model-View-ViewModel)** 架构模式的启发。

### Model (模型)
**数据层**。在 Vue 3 中，这通常指你在 `<script setup>` 中定义的响应式数据（`ref`, `reactive`）。
*它是真理的唯一来源*。

### View (视图)
**视图层**。即用户看到的 DOM 界面。

### ViewModel (视图模型)
**Vue 实例本身**。它是连接 Model 和 View 的桥梁。
1. **Data Bindings (数据绑定)**: 当 Model 变化，ViewModel 自动更新 View。
2. **DOM Listeners (事件监听)**: 当 View 触发事件（如点击），ViewModel 自动修改 Model。

```mermaid
graph LR
A[View (DOM)] -- Events --> B(ViewModel (Vue))
B -- Data Bindings --> A
B <--> C[Model (JS Data)]
```

## 3. 渐进式框架

Vue 被称为"渐进式"框架，意味着你可以：
- **作为库使用**：只在一个简单的 HTML 页面引入 Vue CDN，控制一个小小的挂件。
- **作为框架使用**：使用 Vue CLI / Vite 构建大型单页应用 (SPA)。

## 4. 单文件组件 (SFC)

Vue 项目通常使用 `.vue` 文件，它将逻辑、结构和样式封装在一起：

```vue
<script setup>
  // 逻辑 (JavaScript)
  import { ref } from 'vue'
  const count = ref(0)
</script>

<template>
  <!-- 结构 (HTML) -->
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
  /* 样式 (CSS) */
  button { font-weight: bold; }
</style>
```

这种模式让代码维护变得非常简单，实现了**关注点分离**。