# 03. 指令全家桶 (Directives) 🌸

> **学习目标**: 掌握 Vue 常用指令 `v-for`, `v-bind`, `v-model`, `v-on`, `v-if/show` 的用法。
> **参考教材**: [📖 Vue 指令文档](https://cn.vuejs.org/guide/essentials/template-syntax.html)

Vue 的模板语法中最强大的部分就是指令 (带有 `v-` 前缀的特殊属性)。让我们结合 **实验室 -> 员工管理系统** ([components/LabVueList.vue](/components/LabVueList.vue)) 中的代码来深入理解。

## 1. v-for: 列表渲染

这是最常用的指令，用于循环遍历数组。

*   **语法**: `v-for="(item, index) in list" :key="item.id"`
*   **源码实战 ([components/LabVueList.vue](/components/LabVueList.vue))**:
    在这个复刻员工列表的组件中：
    ```html
    <tr v-for="(item, index) in items" :key="item.id">
        <td>{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        ...
    </tr>
    ```
    **Key 的重要性**: `:key` 是节点的唯一身份证。Vue 依靠它来追踪每个节点的身份，从而重用和重新排序现有元素，极大提升渲染性能。

## 2. v-bind (:): 动态属性绑定

想要让 HTML 标签的属性（如 class, src, href, style）变成动态的？使用 `v-bind`，简写为 `:`。

*   **语法**: `<img :src="user.avatar">`
*   **源码实战 ([components/AppSidebar.vue](/components/AppSidebar.vue))**:
    我们根据当前模式 (`viewMode`) 动态改变按钮样式：
    ```html
    <button 
      :class="viewMode === 'latest' ? 'bg-white shadow' : 'text-gray-400'"
    >
      Latest
    </button>
    ```

## 3. v-model: 双向绑定

`v-model` 是表单元素的神器。它实现了**视图**与**数据**的同步：你改输入框，变量变；你改变量，输入框变。

*   **语法**: `<input v-model="username">`
*   **源码实战 ([components/LabVueList.vue](/components/LabVueList.vue))**:
    在添加员工的表单中：
    ```html
    <!-- 姓名输入框 -->
    <input v-model="newItem.name" type="text" />
    
    <!-- 职位下拉框 -->
    <select v-model="newItem.job">
        <option :value="1">讲师</option>
        <option :value="2">班主任</option>
    </select>
    ```

## 4. v-on (@): 事件监听

原生 JS 中我们用 `addEventListener`，在 Vue 中我们用 `@`。

*   **语法**: `<button @click="handleClick">`
*   **源码实战 ([components/LabVueList.vue](/components/LabVueList.vue))**:
    ```html
    <button @click="addItem">添加员工</button>
    ```
    点击按钮时，会触发 script 中定义的 `addItem` 函数。

## 5. v-if vs v-show: 条件渲染

*   **v-if**: **真正的销毁/重建**。条件为假时，DOM 元素根本不存在。
    *   *实战*: [[LabVueList.vue]](/LabVueList.vue) 中，根据性别数据 (`1:男, 2:女`) 显示不同颜色的标签：
        ```html
        <span v-if="item.gender === 1">男</span>
        <span v-else-if="item.gender === 2">女</span>
        <span v-else>其他</span>
        ```
*   **v-show**: **切换 CSS** `display: none`。元素始终在 DOM 中，只是看不见。
    *   *实战*: [[LabVueList.vue]](/LabVueList.vue) 中，根据职位数据 (`1:讲师`) 显示文本：
        ```html
        <span v-show="item.job === 1">讲师</span>
        ```

## 总结

| 指令 | 简写 | 作用 | 记忆口诀 |
| :--- | :--- | :--- | :--- |
| `v-bind` | `:` | 动态属性 | **冒号**绑定属性 |
| `v-on` | `@` | 事件监听 | **艾特**监听事件 |
| `v-model` | 无 | 双向绑定 | 表单神器 |
| `v-for` | 无 | 循环列表 | 必须加 Key |
| `v-if` | 无 | 条件渲染 | 真删真加 |
| `v-show` | 无 | 显示隐藏 | CSS 切换 |