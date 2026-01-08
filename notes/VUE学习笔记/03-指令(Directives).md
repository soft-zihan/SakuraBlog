# 03. 指令魔法：FileTree 组件解析 🌸

> 我们的左侧文件树是可以无限层级嵌套的。这是如何做到的？
> 本章将结合 `components/FileTree.vue` 讲解 Vue 的模板指令。

## 1. v-for：循环渲染列表

打开 `src/components/FileTree.vue`。

文件树本质上是一个数组，我们需要把数组里的每一项都画出来。这就用到了 `v-for`。

```html
<ul>
  <li v-for="node in nodes" :key="node.path">
    <!-- 内容 -->
  </li>
</ul>
```

这段代码的意思是：遍历 `nodes` 数组，为每个 `node` 生成一个 `<li>` 标签。
`:key` 是非常重要的，它给每个节点一个唯一的身份证号。如果数据变了，Vue 可以凭借 key 精准地找到要修改的那个元素，而不是暴力重绘整个列表。

## 2. v-if：条件渲染

文件树里有两种东西：**文件夹** 和 **文件**。它们的显示样式完全不同。

```html
<template>
  <!-- 情况1：如果是文件夹 -->
  <div v-if="node.type === 'directory'">
     <span>📁 {{ node.name }}</span>
  </div>

  <!-- 情况2：如果是文件 -->
  <div v-else>
     <span>📄 {{ node.name }}</span>
  </div>
</template>
```

Vue 会根据 `node.type` 的值，决定渲染上面的 div 还是下面的 div。

## 3. 递归组件：无限套娃

如果文件夹里还有子文件夹怎么办？
`FileTree.vue` 做了一件很酷的事：**它在自己的模板里，调用了它自己**。

```html
<div v-if="node.type === 'directory'">
    <!-- ...文件夹标题... -->
    
    <!-- 递归调用！把子节点传给自己 -->
    <FileTree 
      :nodes="node.children" 
    />
</div>
```

这就是递归组件。只要 `node.children` 还有内容，它就会一直渲染下去，从而实现了无限层级的目录树。

## 4. v-bind (:) 和 v-on (@)

注意看代码里的冒号和艾特符号：

*   `:nodes="node.children"`
    *   全称 `v-bind:nodes`。
    *   意思是：把 JS 里的变量 `node.children` 传递给组件的 props。
*   `@click="toggleFolder"`
    *   全称 `v-on:click`。
    *   意思是：当点击发生时，执行 JS 里的 `toggleFolder` 函数。

这两个指令构成了 Vue 组件交互的基石：**属性向下传递，事件向上传递**。下一章我们将详细讲解组件通信。