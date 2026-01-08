# 01. Web Standards & Vue Architecture 🌸

> **Goal**: Understand the Web Standards Triad, Vue as a Progressive Framework, and SPA bootstrapping.
> **Ref**: [📖 MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [📖 Vue Guide](https://vuejs.org/guide/introduction.html)

## 1. The Web Standards Triad

Modern web development relies on three pillars. Here is how they apply to **Sakura Notes**:

1.  **HTML (Structure)**: 
    *   *Theory*: The skeleton. Defines WHAT is on the page.
    *   *Project*: Check root [index.html](/index.html). It's nearly empty (`<div id="app"></div>`). Why? Because Vue is a **SPA (Single Page Application)**. It takes over this div and injects content dynamically via JS.
2.  **CSS (Presentation)**: 
    *   *Theory*: The skin. Defines HOW it looks.
    *   *Project*: We use **Tailwind CSS** (e.g., `bg-sakura-50`) and component `<style>` tags to define the pink aesthetics and animations.
3.  **JavaScript (Behavior)**: 
    *   *Theory*: The soul. Defines HOW it interacts.
    *   *Project*: The sidebar toggling, note switching, and lab interactions are all powered by TypeScript logic.

## 2. Vue: The Progressive Framework

Vue is a **progressive** framework for **building user interfaces**.

### "Data-Driven View"
In traditional JS, you manually touch the DOM. In Vue, you only touch **Data**.

**Source Code ([App.vue](/App.vue))**:
```typescript
// We define data
const fileSystem = ref([]); 

// We DO NOT write document.createElement...
// Vue automatically renders the file tree based on fileSystem
```

### "Progressive"
*   **Partial**: You can use Vue in just one HTML file.
*   **Full Stack**: Or build a full engineering project like this blog (Vite + Vue 3).

## 3. Bootstrapping

Starts at [index.tsx](/index.tsx):

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// 1. Create App Instance
const app = createApp(App);
// 2. Mount to #app in index.html
app.mount('#app');
```

## 4. Single File Component (SFC)

[[components/AppSidebar.vue]](file:///components/AppSidebar.vue) demonstrates the standard `.vue` format:

*   **`<template>`**: HTML Structure.
*   **`<script setup>`**: JS Logic.
*   **`<style>`**: CSS Styles.

This **Separation of Concerns** keeps code clean and maintainable.