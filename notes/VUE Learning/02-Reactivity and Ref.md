
# 02. Reactivity System: App.vue Analysis 🌸

> Why does the content change automatically when I click the left menu? Why does the whole webpage color change when I toggle "Dark Mode"?
> This is the magic of **Reactivity**.

## 1. Look at the code in App.vue

Open `src/App.vue` and find the `<script setup>` section. You will see code like this:

```typescript
import { ref, reactive } from 'vue';

// 1. ref: Suitable for primitive types (number, string, boolean)
const currentFile = ref(null);
const isDark = ref(false);

// 2. reactive: Suitable for Objects
const userSettings = reactive({
  fontSize: 'normal',
  fontFamily: 'sans'
});
```

## 2. Ref vs Reactive

In Vue 3, we mainly use these two tools to define "alive" data:

*   **ref()**: Stands for Reference. It's like a box that wraps the data.
    *   **In JS**: You MUST use `.value`, e.g., `isDark.value = true`.
    *   **In Template**: You DO NOT need `.value`, e.g., `{{ isDark }}`, Vue unwraps it automatically.
*   **reactive()**: Specifically for Objects.
    *   **In JS**: No `.value` needed, read/write like a normal object, e.g., `userSettings.fontSize = 'large'`.

## 3. Real-world Analysis: Component Communication

In this blog, the **Settings Modal** (`SettingsModal.vue`) is responsible for toggling the theme, but the `isDark` state actually lives in `App.vue`. How does this work?

### Parent (App.vue)
```typescript
const isDark = ref(false);
const toggleTheme = (val) => { 
  // NOTE: Modifying a ref in <script> requires .value
  isDark.value = val; 
}
```

In HTML:
```html
<SettingsModal 
  :is-dark="isDark" 
  @toggle-theme="toggleTheme" 
/>
```

### Child (SettingsModal.vue)
```typescript
// Send signal to parent
emit('toggle-theme', true);
```

When you click "Dark Mode" in the modal, the child emits a signal. The parent receives it, updates `isDark.value`, and Vue automatically updates the class of the entire page.

## 4. Real-world Analysis: Opening a File

```typescript
const currentFile = ref(null);

const openFile = (file) => {
  currentFile.value = file; // The core task is just one thing: modify currentFile
}
```

In the HTML template, we use the `v-if` directive:

```html
<div v-if="currentFile">
  <!-- Show Article Content -->
  <h1>{{ currentFile.name }}</h1>
</div>
<div v-else>
  <!-- Show Welcome Page -->
  <h1>Welcome Home</h1>
</div>
```

Because `currentFile` is reactive, once it changes from `null` to a file object, Vue instantly destroys the "Welcome Page" and creates the "Article Content Page".

**Pro Tip**:
The most common mistake for beginners is forgetting `.value` inside `<script>`. If you see `console.log` printing a `RefImpl` object, it means you forgot to unwrap it with `.value`.
