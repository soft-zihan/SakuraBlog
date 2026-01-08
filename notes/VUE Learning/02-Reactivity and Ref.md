# 02. Reactivity System: App.vue Analysis 🌸

> Why does the content change automatically when I click the left menu? Why does the whole webpage color change when I toggle "Dark Mode"?
> This is the magic of **Reactivity**.

## 1. Look at the code in App.vue

Open `src/App.vue` and find the `<script setup>` section. You will see code like this:

```typescript
import { ref } from 'vue';

// These variables are not just variables, they are "alive"
const currentFile = ref(null);
const isDark = ref(false);
const viewMode = ref('latest');
```

## 2. What is `ref`?

In plain JS:
```js
let count = 0;
count = 1; // The variable changed, but the webpage interface won't update automatically
```

In Vue:
```js
const count = ref(0);
count.value = 1; // Vue detects that .value changed and automatically notifies HTML to re-render!
```

**Ref** stands for Reference. It is a wrapper that turns normal data into "reactive data".

## 3. Real-world Analysis: Toggling Dark Mode

There is a theme toggle button in the bottom left corner (in settings) of this blog. How does it work?

### Logic (Script)
```typescript
const isDark = ref(false);

const toggleTheme = (val: boolean) => {
  isDark.value = val; // 1. Modify reactive data
  // 2. Manipulate DOM class (Required for Tailwind)
  if (val) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};
```

### Template Binding (Template)
```html
<div :class="{ 'dark': isDark }">
  <!-- Page Content -->
</div>
```

When `isDark.value` becomes `true`, Vue automatically adds the `dark` class to the div, turning the page dark instantly.

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

**Summary**: In Vue, we don't need to manually manipulate the DOM (like `document.getElementById('title').innerText = ...`). We only need to **modify data**, and Vue takes care of updating the view. This is **Data Driven**.