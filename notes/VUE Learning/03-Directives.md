# 03. Directive Magic: FileTree Analysis 🌸

> Our file tree on the left can be nested infinitely. How is this achieved?
> This chapter will explain Vue template directives using `components/FileTree.vue`.

## 1. v-for: Loop Rendering

Open `src/components/FileTree.vue`.

The file tree is essentially an array, and we need to draw every item in that array. This is where `v-for` comes in.

```html
<ul>
  <li v-for="node in nodes" :key="node.path">
    <!-- Content -->
  </li>
</ul>
```

This code means: Iterate through the `nodes` array and generate an `<li>` tag for each `node`.
`:key` is very important; it gives each node a unique ID. If the data changes, Vue can use the key to precisely find the element to modify instead of brutally re-rendering the entire list.

## 2. v-if: Conditional Rendering

There are two things in the file tree: **Folders** and **Files**. Their display styles are completely different.

```html
<template>
  <!-- Case 1: If it is a directory -->
  <div v-if="node.type === 'directory'">
     <span>📁 {{ node.name }}</span>
  </div>

  <!-- Case 2: If it is a file -->
  <div v-else>
     <span>📄 {{ node.name }}</span>
  </div>
</template>
```

Vue will decide whether to render the top div or the bottom div based on the value of `node.type`.

## 3. Recursive Components: Infinite Nesting

What if a folder contains subfolders?
`FileTree.vue` does something very cool: **It calls itself inside its own template.**

```html
<div v-if="node.type === 'directory'">
    <!-- ...Folder Title... -->
    
    <!-- Recursive Call! Pass children nodes to itself -->
    <FileTree 
      :nodes="node.children" 
    />
</div>
```

This is a recursive component. As long as `node.children` has content, it will keep rendering downwards, thus achieving an infinite directory tree.

## 4. v-bind (:) and v-on (@)

Notice the colons and at symbols in the code:

*   `:nodes="node.children"`
    *   Full name `v-bind:nodes`.
    *   Meaning: Pass the JS variable `node.children` to the component's props.
*   `@click="toggleFolder"`
    *   Full name `v-on:click`.
    *   Meaning: When a click happens, execute the `toggleFolder` function in JS.

These two directives form the cornerstone of Vue component interaction: **Properties Pass Down, Events Bubble Up**. We will explain component communication in detail in the next chapter.