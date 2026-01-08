# 04. Component Communication: Parent-Child Dialogue 🌸

> `App.vue` is the parent, and `FileTree.vue` is the child.
> The parent needs to give file data to the child to display, and the child needs to tell the parent when it is clicked.

## 1. Props: Tasks from Parent to Child

In `FileTree.vue`, we need to receive the file list sent by the parent.

```typescript
// FileTree.vue
const props = defineProps<{
  nodes: FileNode[];       // All file nodes
  currentPath: string;     // Who is currently selected (for highlighting)
}>();
```

When used in `App.vue`:

```html
<!-- App.vue -->
<FileTree 
  :nodes="filteredFileSystem" 
  :current-path="currentPath"
/>
```

This is **Props**. Data flows from parent to child.
**Note**: Props are read-only! The child component cannot modify `nodes` because that is the parent's data.

## 2. Emit: Report from Child to Parent

When a user clicks a file in `FileTree`, `FileTree` itself cannot open the file (because it doesn't have the fetch logic; logic is in `App.vue`).
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

Back in `App.vue`, the parent listens for this signal:

```html
<!-- App.vue -->
<FileTree 
  @select-file="openFile"
/>
```

When the `select-file` signal is received, the parent executes its own `openFile` function to actually load the article content.

## 3. Summary

*   **Props Down**: Data flows down (Rendering the tree).
*   **Events Up**: Events bubble up (Click notification).

This **One-Way Data Flow** ensures a Single Source of Truth for data, making code logic clear and maintainable.