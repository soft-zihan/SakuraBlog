# 02. JS Variables & Reactivity System 🌸

> **Goal**: Review JS variables (`let`, `const`) and understand Vue's Reactivity (`ref`, `reactive`).
> **Ref**: [📖 MDN JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [📖 Vue Reactivity](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)

## 1. JS Basics Review

JS is loosely typed.

* **Variables**:
  * `let`: Mutable (Recommended).
  * `const`: Immutable reference (Recommended).
  * `var`: Old school (Avoid).
* **Types**: Primitives (string, number, boolean...) and Objects.

**Pain Point**: In vanilla JS, changing a variable (`let name = "Sakura"`) does **not** update the HTML. You must verify and update the DOM manually.

## 2. Vue's Magic: Ref & Reactive

Vue 3 introduces a **Reactivity System**. Core concept: **Data changes, View updates automatically.**

### Ref (For Primitives)

Wraps a primitive in an object.

* **Definition**: `const isDark = ref(false);`
* **Mechanism**: Access/Modify via `.value`.
* **Source Code ([App.vue](/App.vue))**:
  ```typescript
  const isDark = ref(false); 

  // JS modification (Must use .value)
  const toggleTheme = (val) => {
      isDark.value = val; 
  };
  ```

  *Note: No `.value` needed in HTML templates `{{ isDark }}`.*

### Reactive (For Objects)

Uses ES6 **Proxy** to watch objects deeply.

* **Definition**: `const settings = reactive({ fontSize: 'normal' });`
* **Source Code ([components/LabVueList.vue](/components/LabVueList.vue))**:
  ```typescript
  const newItem = reactive({
      name: '',
      gender: 1, // 1:Male, 2:Female
      job: 1     // 1:Lecturer, 2:Teacher
  });

  // Modify like a normal object
  newItem.name = 'Xie Xun';
  ```

## 3. Computed Properties

If you want to **calculate** a value based on other data, use `computed`.

**Source Code ([App.vue](/App.vue))**:
Generating breadcrumbs from `currentPath`.

```typescript
const breadcrumbs = computed(() => {
  const path = currentPath.value; // Dependency
  if (!path) return [];
  // Logic...
  return parts; 
});
```

**Benefit**: `computed` results are **cached**. They only re-run if dependencies change.

## 4. Lab Experience

Go to **Laboratory -> Vue Core -> Reactivity** ([LabReactivity.vue](/components/LabReactivity.vue)) to experience how data drives the DOM.
