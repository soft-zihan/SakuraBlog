# 03. The Directive Family 🌸

> **Goal**: Master common directives: `v-for`, `v-bind`, `v-model`, `v-on`, `v-if/show`.
> **Ref**: [📖 Vue Template Syntax](https://vuejs.org/guide/essentials/template-syntax.html)

Directives (`v-` prefix) are Vue's template superpowers. Let's look at **Laboratory -> Employee Management** ([components/LabVueList.vue](/components/LabVueList.vue)) examples.

## 1. v-for: List Rendering

Loops through arrays.

*   **Syntax**: `v-for="(item, index) in list" :key="item.id"`
*   **Source Code ([components/LabVueList.vue](/components/LabVueList.vue))**:
    Matching the Employee List example:
    ```html
    <tr v-for="(item, index) in items" :key="item.id">
        <td>{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        ...
    </tr>
    ```
    **Key**: `:key` is mandatory. It's the ID card for each node, ensuring efficient DOM updates.

## 2. v-bind (:): Dynamic Attributes

Makes HTML attributes dynamic.

*   **Syntax**: `<img :src="user.avatar">`
*   **Source Code ([components/AppSidebar.vue](/components/AppSidebar.vue))**:
    Dynamic class binding:
    ```html
    <button 
      :class="viewMode === 'latest' ? 'bg-white shadow' : 'text-gray-400'"
    >
      Latest
    </button>
    ```

## 3. v-model: Two-way Binding

Syncs Form Input <-> JS Data.

*   **Syntax**: `<input v-model="username">`
*   **Source Code ([components/LabVueList.vue](/components/LabVueList.vue))**:
    ```html
    <!-- Name Input -->
    <input v-model="newItem.name" type="text" />
    
    <!-- Job Select -->
    <select v-model="newItem.job">
        <option :value="1">Lecturer</option>
        <option :value="2">Teacher</option>
    </select>
    ```

## 4. v-on (@): Event Listening

Replaces `addEventListener`.

*   **Syntax**: `<button @click="handleClick">`
*   **Source Code ([components/LabVueList.vue](/components/LabVueList.vue))**:
    ```html
    <button @click="addItem">Add Employee</button>
    ```

## 5. v-if vs v-show

*   **v-if**: **Real Destroy/Create**.
    *   *Example*: [[LabVueList.vue]](file:///LabVueList.vue) - Showing "Male" (1) vs "Female" (2) tags.
        ```html
        <span v-if="item.gender === 1">Male</span>
        <span v-else-if="item.gender === 2">Female</span>
        ```
*   **v-show**: **CSS Toggle** (`display: none`).
    *   *Example*: [[LabVueList.vue]](file:///LabVueList.vue) - Showing Job Title.
        ```html
        <span v-show="item.job === 1">Lecturer</span>
        ```

## Summary

| Directive | Short | Purpose |
| :--- | :--- | :--- |
| `v-bind` | `:` | Dynamic Attributes |
| `v-on` | `@` | Event Listeners |
| `v-model` | - | Two-way Binding |
| `v-for` | - | Loops (Needs Key) |
| `v-if` | - | Conditional Render (Heavy) |
| `v-show` | - | CSS Toggle (Light) |