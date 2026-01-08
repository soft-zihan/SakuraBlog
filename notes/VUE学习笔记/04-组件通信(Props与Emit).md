# 04. 组件通信：父子组件的对话 🌸

> 在我们的架构中，[[AppSidebar.vue]](/AppSidebar.vue) 是父组件，[[FileTree.vue]](/FileTree.vue) 是子组件。
> 侧边栏要把文件数据给文件树展示，文件树被点击了要告诉侧边栏，侧边栏再告诉 [[App.vue]](/App.vue)。

## 1. Props：父亲给孩子的任务

在 [[FileTree.vue]](/FileTree.vue) 中，我们需要接收父亲传来的文件列表。

```typescript
// FileTree.vue
const props = defineProps<{
  nodes: FileNode[];       // 所有的文件节点
  currentPath: string;     // 当前选中了谁（用于高亮）
}>();
```

在 [[AppSidebar.vue]](/AppSidebar.vue) 中使用时：

```html
<!-- AppSidebar.vue -->
<FileTree 
  :nodes="filteredFileSystem" 
  :current-path="currentPath"
/>
```

这就是 **Props (属性)**。数据从父流向子。
**注意**：Props 是只读的！子组件不能修改 `nodes`，因为那是父亲的数据。

## 2. Emit：孩子给父亲的报告

当用户点击 [[FileTree]](/FileTree) 里的某个文件时，`FileTree` 只是一个展示组件，它不知道怎么打开文件。
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

回到 [[AppSidebar.vue]](/AppSidebar.vue)，父亲监听这个信号，并继续向上传递（因为真正的打开文件逻辑在爷爷 [[App.vue]](/App.vue) 里）：

```html
<!-- AppSidebar.vue -->
<FileTree 
  @select-file="$emit('select-file', $event)"
/>
```

## 3. 总结

*   **Props Down**: 数据向下流（App -> AppSidebar -> FileTree）。
*   **Events Up**: 事件向上冒（FileTree -> AppSidebar -> App）。

这种 **单向数据流** 保证了数据源的唯一性（Single Source of Truth），让代码逻辑清晰可维护。