# 04. 组件通信：父子组件的对话 🌸

> `App.vue` 是父亲，`FileTree.vue` 是孩子。
> 父亲要把文件数据给孩子展示，孩子被点击了要告诉父亲。

## 1. Props：父亲给孩子的任务

在 `FileTree.vue` 中，我们需要接收父亲传来的文件列表。

```typescript
// FileTree.vue
const props = defineProps<{
  nodes: FileNode[];       // 所有的文件节点
  currentPath: string;     // 当前选中了谁（用于高亮）
}>();
```

在 `App.vue` 中使用时：

```html
<!-- App.vue -->
<FileTree 
  :nodes="filteredFileSystem" 
  :current-path="currentPath"
/>
```

这就是 **Props (属性)**。数据从父流向子。
**注意**：Props 是只读的！子组件不能修改 `nodes`，因为那是父亲的数据。

## 2. Emit：孩子给父亲的报告

当用户点击 `FileTree` 里的某个文件时，`FileTree` 自己无法打开文件（因为它没有 fetch 逻辑，fetch 逻辑在 `App.vue` 里）。
所以，它必须**发出通知**。

```typescript
// FileTree.vue
const emit = defineEmits(['select-file']);

// 当 div 被点击时执行
const handleFileClick = (node) => {
  // 发射信号！信号名叫 'select-file'，附带数据 node
  emit('select-file', node); 
}
```

回到 `App.vue`，父亲监听这个信号：

```html
<!-- App.vue -->
<FileTree 
  @select-file="openFile"
/>
```

当收到 `select-file` 信号时，父亲执行自己的 `openFile` 函数，真正去加载文章内容。

## 3. 总结

*   **Props Down**: 数据向下流（渲染树）。
*   **Events Up**: 事件向上冒（点击通知）。

这种 **单向数据流** 保证了数据源的唯一性（Single Source of Truth），让代码逻辑清晰可维护。