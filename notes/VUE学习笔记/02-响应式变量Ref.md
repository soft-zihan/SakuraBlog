# 02. 响应式系统：App.vue 源码解析 🌸

> 为什么点击左侧菜单，右侧内容会自动变？为什么切换“暗黑模式”，整个网页颜色会自动变？
> 这就是 **响应式 (Reactivity)** 的魔力。

## 1. 看看 App.vue 的代码

打开 `src/App.vue`，找到 `<script setup>` 部分。你会看到这样的代码：

```typescript
import { ref } from 'vue';

// 这里的变量不仅仅是变量，它们是"活"的
const currentFile = ref(null);
const isDark = ref(false);
const viewMode = ref('latest');
```

## 2. 什么是 `ref`？

在普通 JS 中：
```js
let count = 0;
count = 1; // 变量变了，但网页界面不会自动刷新
```

在 Vue 中：
```js
const count = ref(0);
count.value = 1; // Vue 监测到 value 变了，自动通知 HTML 重新渲染！
```

**Ref** 全称 Reference (引用)。它是一个包装器，把普通数据变成了“响应式数据”。

## 3. 实战分析：切换暗黑模式

在这个博客的左下角（设置里）有一个切换主题的按钮。它是怎么工作的？

### 代码逻辑 (Script)
```typescript
const isDark = ref(false);

const toggleTheme = (val: boolean) => {
  isDark.value = val; // 1. 修改响应式数据
  // 2. 顺便操作 DOM class (Tailwind 需要)
  if (val) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};
```

### 模板绑定 (Template)
```html
<div :class="{ 'dark': isDark }">
  <!-- 页面内容 -->
</div>
```

当 `isDark.value` 变为 `true` 时，Vue 自动给 div 加上 `dark` 类名，页面瞬间变黑。

## 4. 实战分析：打开文件

```typescript
const currentFile = ref(null);

const openFile = (file) => {
  currentFile.value = file; // 核心只做了一件事：修改 currentFile
}
```

而在 HTML 模板中，我们使用了 `v-if` 指令：

```html
<div v-if="currentFile">
  <!-- 显示文章内容 -->
  <h1>{{ currentFile.name }}</h1>
</div>
<div v-else>
  <!-- 显示欢迎页 -->
  <h1>Welcome Home</h1>
</div>
```

因为 `currentFile` 是响应式的，一旦它从 `null` 变成了某个文件对象，Vue 就会瞬间销毁“欢迎页”，创建“文章内容页”。

**总结**：在 Vue 中，我们不需要手动去操作 DOM（比如 `document.getElementById('title').innerText = ...`）。我们只需要**修改数据**，Vue 负责更新视图。这就是 **数据驱动 (Data Driven)**。