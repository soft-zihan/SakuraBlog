
# 05. Rhythm of Life: Lifecycle Hooks 🌸

> How is `files.json` loaded when the page refreshes?
> How is the Table of Contents (TOC) generated when clicking an article?
> This involves **Lifecycle**.

## 1. onMounted: The Moment of Birth

Open the bottom of `src/App.vue` and you will see:

```typescript
onMounted(async () => {
  // 1. Set Dark Mode
  if (isDark.value) document.documentElement.classList.add('dark');
  
  // 2. Core: Fetch file list
  const res = await fetch('./files.json');
  fileSystem.value = await res.json();
});
```

`onMounted` is the most commonly used hook. It executes immediately after the **component is mounted (DOM has been generated)**.
This is suitable for initialization work, such as making network requests to get data.

## 2. nextTick: Wait a Moment

In the `openFile` function, there is a very special hook:

```typescript
const openFile = async (file) => {
  // 1. Get article content
  file.content = await fetch(path).then(res => res.text());
  
  // 2. Generate TOC
  nextTick(() => {
     generateToc();
  });
}
```

Why use `nextTick`?
1. When we assign `file.content`, Vue's reactivity system is triggered.
2. Vue starts preparing to update the DOM (render Markdown into HTML).
3. **But! DOM updates are asynchronous.** When this line of code finishes executing, the HTML on the webpage hasn't actually changed yet.
4. If we call `generateToc` directly at this time to look for `<h1>` tags, we won't find them.

`nextTick` means: **Wait until Vue finishes updating the DOM, then execute my callback function.**
This ensures that when generating the TOC, the article headers are already rendered on the page.

## 3. onUnmounted: Cleanup the Battlefield

Although `App.vue` as the root component is rarely unmounted, we often use this hook in `Lab` components.

For example, in `LabQuizGame.vue`, we start a timer (`setInterval`). If the user switches to another page before the game ends, we MUST destroy this timer, otherwise it will keep running in the background and consume memory.

```typescript
// LabQuizGame.vue Pseudo code
onUnmounted(() => {
  clearInterval(timerInterval); // Stop timer when component is destroyed
});
```

**Principle**: If you create a timer or add a `window.addEventListener` in `onMounted`, you must clean them up in `onUnmounted`.

## 4. watch: Secret Observation

We also use `watch` to listen to user settings:

```typescript
watch(() => userSettings.fontSize, (newValue) => {
  localStorage.setItem('sakura_fontsize', newValue);
});
```

`watch` is used to listen to a reactive variable. Whenever the user changes the font size, we automatically save it to the browser cache (LocalStorage). This way, the setting remains when the user refreshes the page next time.

## Conclusion

Congratulations! By analyzing the source code of this blog, you have mastered the core concepts of Vue 3:
1. **SPA Structure** (index.html, main.ts, App.vue)
2. **Reactivity** (ref/reactive)
3. **Directives** (v-for, v-if vs v-show)
4. **Component Communication** (Props, Emit)
5. **Lifecycle** (onMounted, onUnmounted, nextTick)

Now, try modifying the files in `notes/` and start your own Vue journey! 🌸
