# 01. Project Structure & Vue Intro 🌸

> Welcome to the frontend training ground! Unlike boring documentation, we will **dissect the source code of this blog directly** to help you understand Vue 3 from scratch.

## 1. What kind of project is this?

This is a purely static Vue 3 Single Page Application (SPA).
The source code is right in front of your eyes. Click the **🖊️ (View Source)** button in the top right corner to view the Markdown source of this document at any time. To see the project code, you can visit the Github repository.

Let's look at the File Structure:

```text
sakura-notes/
├── index.html        # Entry HTML (The root of everything)
├── src/
│   ├── main.ts       # Vue Startup Entry
│   ├── App.vue       # Root Component (Skeleton of the page)
│   ├── components/   # Component folder (e.g., Sidebar, Lab Tools)
│   └── constants.ts  # Constants (e.g., Mock Data, i18n text)
├── public/           # Static Assets
└── notes/            # Where your Markdown notes live
```

## 2. It all starts with index.html

Open `index.html` in the project root. Unlike traditional webpages filled with `div`s, the HTML of a Vue project is usually very empty:

```html
<body>
  <div id="app"></div> <!-- Mount Point -->
  <script type="module" src="/src/main.ts"></script>
</body>
```

**Principle**:
Vue will take over the div with `id="app"` and "stuff" all the components we write into it. This is the core of **SPA (Single Page Application)**—the page never truly refreshes, JS simply swaps the content inside the div.

## 3. main.ts: Starting the Engine

`src/main.ts` is the commander.

```typescript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

This code means:
1. Create a Vue application instance.
2. Use `App.vue` as the root component.
3. Mount it to `#app` in `index.html`.

## 4. App.vue: Page Skeleton

`App.vue` is the core file, utilizing the **SFC (Single File Component)** format:

1.  **Template (HTML)**: Defines the Sidebar and Main Content area.
2.  **Script (JS/TS)**: Contains all logic, such as "which file is currently open" or "is dark mode active".
3.  **Style (CSS)**: Uses Tailwind CSS to handle most styles.

In the next chapter, we will dive into `<script setup>` of `App.vue` and learn the soul of Vue 3—**Reactivity**.