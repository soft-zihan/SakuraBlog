# 04. Component Communication: Parent-Child Dialogue 🌸

> In our architecture, [[AppSidebar.vue]](/AppSidebar.vue) is the parent, and [[FileTree.vue]](/FileTree.vue) is the child.
> The sidebar gives file data to the tree to display. When the tree is clicked, it tells the sidebar, which then tells [[App.vue]](/App.vue).

## 1. Props: Tasks from Parent to Child

In [[FileTree.vue]](/FileTree.vue), we need to receive the file list sent by the parent.

```typescript
// FileTree.vue
const props = defineProps<{
  nodes: FileNode[];       // All file nodes
  currentPath: string;     // Who is currently selected (for highlighting)
}>();
```

When used in [[AppSidebar.vue]](/AppSidebar.vue):

```html
<!-- AppSidebar.vue -->
<FileTree 
  :nodes="filteredFileSystem" 
  :current-path="currentPath"
/>
```

This is **Props**. Data flows from parent to child.
**Note**: Props are read-only! The child component cannot modify `nodes` because that is the parent's data.

## 2. Emit: Report from Child to Parent

When a user clicks a file in [[FileTree]](/FileTree), the `FileTree` is just a presentation component; it doesn't know how to open a file.
So, it must **send a notification**.

```typescript
// FileTree.vue
const emit = defineEmits(['select-file']);

// Executed when div is clicked
const handleFileClick = (node) => {
  // Emit a signal! Signal name is 'select-file', attaching data node
  emit('select-file', node); 
}
```

Back in [[AppSidebar.vue]](/AppSidebar.vue), the parent listens for this signal and passes it up further (because the real logic to open files is in the grandparent [[App.vue]](/App.vue)):

```html
<!-- AppSidebar.vue -->
<FileTree 
  @select-file="$emit('select-file', $event)"
/>
```

## 3. Summary

*   **Props Down**: Data flows down (App -> AppSidebar -> FileTree).
*   **Events Up**: Events bubble up (FileTree -> AppSidebar -> App).

This **One-Way Data Flow** ensures a Single Source of Truth for data, making code logic clear and maintainable.