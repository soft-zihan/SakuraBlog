# 05. 生命的律动：Lifecycle 钩子 🌸

> 页面刷新时，Vue 是怎么把 `files.json` 加载出来的？
> 点击文章时，目录 (TOC) 是怎么生成的？
> 这涉及到了 **生命周期 (Lifecycle)**。

## 1. onMounted：出生时刻

打开 `src/App.vue` 的最底部，你会看到：

```typescript
onMounted(async () => {
  // 1. 设置暗黑模式
  if (isDark.value) document.documentElement.classList.add('dark');
  
  // 2. 核心：获取文件列表
  const res = await fetch('./files.json');
  fileSystem.value = await res.json();
});
```

`onMounted` 是最常用的钩子。它在 **组件挂载完成（DOM 已经生成）** 后立即执行。
这里适合做初始化的工作，比如发网络请求获取数据。

## 2. nextTick：稍等片刻

在 `openFile` 函数中，有一个很特殊的钩子：

```typescript
const openFile = async (file) => {
  // 1. 获取文章内容
  file.content = await fetch(path).then(res => res.text());
  
  // 2. 生成目录 TOC
  nextTick(() => {
     generateToc();
  });
}
```

为什么要用 `nextTick`？
1. 当我们赋值 `file.content` 时，Vue 的响应式系统被触发。
2. Vue 开始准备更新 DOM（把 Markdown 渲染成 HTML）。
3. **但是！DOM 更新是异步的。** 这行代码执行完时，网页上的 HTML 其实还没变。
4. 如果此时直接调用 `generateToc` 去查找 `<h1>` 标签，是找不到的。

`nextTick` 的意思是：**等 Vue 把 DOM 更新完之后，再执行我的回调函数。**
这样我们就能确保在生成目录时，文章标题已经在页面上渲染好了。

## 3. watch：暗中观察

我们还用到了 `watch` 来监听用户的设置：

```typescript
watch(() => userSettings.fontSize, (newValue) => {
  localStorage.setItem('sakura_fontsize', newValue);
});
```

`watch` 用于监听一个响应式变量。每当用户修改字体大小时，我们自动把它保存到浏览器缓存 (LocalStorage) 中。这样用户下次刷新页面，设置依然还在。

## 结语

恭喜你！通过分析这个博客的源码，你已经掌握了 Vue 3 的核心概念：
1. **SPA 结构** (index.html, main.ts, App.vue)
2. **响应式 ref** (数据驱动视图)
3. **组件与指令** (v-for, v-if, FileTree)
4. **组件通信** (Props, Emit)
5. **生命周期** (onMounted, nextTick)

现在，试着修改一下 `VUE学习笔记` 里的文件，开始你自己的 Vue 之旅吧！🌸