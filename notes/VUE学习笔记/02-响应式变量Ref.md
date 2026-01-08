
# 02. 响应式系统：App.vue 源码解析 🌸

> 为什么点击左侧菜单，右侧内容会自动变？为什么切换“暗黑模式”，整个网页颜色会自动变？
> 这就是 **响应式 (Reactivity)** 的魔力。

## 1. 看看 App.vue 的代码

打开 `src/App.vue`，找到 `<script setup>` 部分。你会看到这样的代码：

```typescript
import { ref, reactive } from 'vue';

// 1. ref: 适合基本类型 (数字, 字符串, 布尔值)
const currentFile = ref(null);
const isDark = ref(false);

// 2. reactive: 适合对象 (Object)
const userSettings = reactive({
  fontSize: 'normal',
  fontFamily: 'sans'
});
```

## 2. Ref vs Reactive

在 Vue 3 中，我们主要用这两个工具来定义“活”的数据：

*   **ref()**: 也就是 Reference (引用)。它像一个盒子，把数据包在里面。
    *   **JS 中使用**: 必须加 `.value`，例如 `isDark.value = true`。
    *   **模板中使用**: 不需要加 `.value`，例如 `{{ isDark }}`，Vue 会自动解包。
*   **reactive()**: 专门用于对象。
    *   **JS 中使用**: 不需要 `.value`，像普通对象一样读写，例如 `userSettings.fontSize = 'large'`。

## 3. 实战分析：组件通信与状态更新

在这个博客中，**设置弹窗** (`SettingsModal.vue`) 负责修改主题，但 `isDark` 状态实际上存在于 `App.vue` 中。这是如何工作的？

### 父组件 (App.vue)
```typescript
const isDark = ref(false);
const toggleTheme = (val) => { 
  // 注意：在 <script> 中修改 ref 需要 .value
  isDark.value = val; 
}
```

HTML 中：
```html
<SettingsModal 
  :is-dark="isDark" 
  @toggle-theme="toggleTheme" 
/>
```

### 子组件 (SettingsModal.vue)
```typescript
// 接收父组件的指令
emit('toggle-theme', true);
```

当你在弹窗里点击“深色模式”时，子组件发射信号，父组件收到信号后修改 `isDark.value`，Vue 自动更新整个页面的 class。

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

**新手提示**：
初学者最容易犯的错误就是在 `<script>` 里忘记写 `.value`。如果你发现 console.log 打印出来是一个 RefImpl 对象，说明你忘记加 `.value` 了。
