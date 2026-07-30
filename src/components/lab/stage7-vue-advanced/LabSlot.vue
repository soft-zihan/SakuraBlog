<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">🎁 {{ lang === 'zh' ? '插槽系统' : 'Slot System' }}</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">{{ lang === 'zh' ? '理解插槽（Slot）如何让组件更灵活和可复用' : 'Understand how slots make components flexible and reusable' }}</p>
    </div>

    <!-- Main Container -->
    <div class="max-w-4xl mx-auto space-y-12">

      <!-- Part 1: Basic Slot (Default Slot) -->
      <section class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span class="text-2xl">1️⃣</span> {{ lang === 'zh' ? '基础插槽' : 'Default Slot' }}
        </h3>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {{ lang === 'zh' ? '插槽允许父组件向子组件传递内容。&lt;slot&gt; 标签是子组件中的占位符，父组件可以填充任意内容。' : 'Slots allow parent components to pass content to child components. The &lt;slot&gt; tag is a placeholder that can be filled with any content.' }}
        </p>

        <!-- Demo -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
          <p class="text-sm font-bold text-blue-700 dark:text-blue-300 mb-4">{{ lang === 'zh' ? '卡片组件示例：' : 'Card Component Demo:' }}</p>
          
          <!-- Card 1 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-300 dark:border-blue-600 mb-4 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl">🎓</span>
              <h4 class="font-bold text-gray-800 dark:text-gray-200">{{ lang === 'zh' ? '学习 Vue' : 'Learn Vue' }}</h4>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ lang === 'zh' ? 'Vue 是一个渐进式框架，易于学习且功能强大。' : 'Vue is a progressive framework that\'s easy to learn and powerful.' }}
            </p>
          </div>

          <!-- Card 2 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-300 dark:border-green-600 mb-4 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl">💡</span>
              <h4 class="font-bold text-gray-800 dark:text-gray-200">{{ lang === 'zh' ? '最佳实践' : 'Best Practice' }}</h4>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ lang === 'zh' ? '始终使用插槽使组件更灵活和可复用。' : 'Always use slots to make components flexible and reusable.' }}
            </p>
          </div>

          <!-- Card 3 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-purple-300 dark:border-purple-600 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl">🚀</span>
              <h4 class="font-bold text-gray-800 dark:text-gray-200">{{ lang === 'zh' ? '快速开发' : 'Quick Dev' }}</h4>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ lang === 'zh' ? '使用插槽可以快速创建可配置的组件。' : 'Slots allow you to quickly create configurable components.' }}
            </p>
          </div>
        </div>

        <!-- Code -->
        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{{ lang === 'zh' ? '📄 子组件 (Card.vue)' : 'Child Component (Card.vue)' }}</p>
            <div class="bg-gray-900 text-blue-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{{ basicSlotChild }}</pre>
            </div>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{{ lang === 'zh' ? '📄 父组件 (Parent.vue)' : 'Parent Component (Parent.vue)' }}</p>
            <div class="bg-gray-900 text-blue-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{{ basicSlotParent }}</pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Part 2: Named Slots -->
      <section class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span class="text-2xl">2️⃣</span> {{ lang === 'zh' ? '具名插槽' : 'Named Slots' }}
        </h3>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {{ lang === 'zh' ? '具名插槽让你在一个组件中定义多个 &lt;slot&gt;，每个插槽有不同的名字，父组件可以针对性地填充。' : 'Named slots allow you to define multiple slots in a component, each with a different name, enabling targeted content insertion from parent components.' }}
        </p>

        <!-- Demo -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6 space-y-6">
          <p class="text-sm font-bold text-green-700 dark:text-green-300">{{ lang === 'zh' ? '👤 用户资料卡示例：' : 'User Profile Card Demo:' }}</p>
          
          <!-- Profile Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <!-- Header Slot -->
            <div class="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white">
              <div class="text-center">
                <div class="text-5xl mb-2">👨‍💻</div>
                <h4 class="font-bold text-lg">{{ lang === 'zh' ? '张三' : 'John Doe' }}</h4>
                <p class="text-sm opacity-90">{{ lang === 'zh' ? 'Vue 开发者' : 'Vue Developer' }}</p>
              </div>
            </div>

            <!-- Content Slot -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h5 class="font-bold text-gray-800 dark:text-gray-200 mb-2">{{ lang === 'zh' ? '📝 简介' : 'Bio' }}</h5>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ lang === 'zh' ? '喜欢前端开发，专注于 Vue 和现代 JavaScript。' : 'Passionate about frontend development, focused on Vue and modern JavaScript.' }}
              </p>
            </div>

            <!-- Footer Slot -->
            <div class="bg-gray-50 dark:bg-gray-900 p-4 flex gap-2 justify-center">
              <button class="px-4 py-2 bg-green-500 text-white rounded font-bold text-sm hover:bg-green-600">
                {{ lang === 'zh' ? '关注' : 'Follow' }}
              </button>
              <button class="px-4 py-2 bg-gray-400 text-white rounded font-bold text-sm hover:bg-gray-500">
                {{ lang === 'zh' ? '消息' : 'Message' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Code -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{{ lang === 'zh' ? '📄 子组件 (Profile.vue)' : 'Child Component (Profile.vue)' }}</p>
            <div class="bg-gray-900 text-blue-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{{ namedSlotChild }}</pre>
            </div>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{{ lang === 'zh' ? '📄 使用方式' : 'Usage' }}</p>
            <div class="bg-gray-900 text-blue-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{{ namedSlotUsage }}</pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Part 3: Scoped Slots -->
      <section class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span class="text-2xl">3️⃣</span> {{ lang === 'zh' ? '作用域插槽（进阶）' : 'Scoped Slots (Advanced)' }}
        </h3>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {{ lang === 'zh' ? '作用域插槽让子组件能向父组件传递数据。子组件可以在插槽中绑定变量，父组件可以通过 #default="{ data }" 接收。' : 'Scoped slots allow child components to pass data to parent components. Child components bind variables in slots, and parent components receive them via #default="{ data }".' }}
        </p>

        <!-- Demo -->
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6">
          <p class="text-sm font-bold text-purple-700 dark:text-purple-300 mb-4">{{ lang === 'zh' ? '📋 列表渲染示例：' : 'List Rendering Demo:' }}</p>
          
          <div class="space-y-3">
            <!-- Item 1 -->
            <div v-for="(fruit, idx) in fruits" :key="idx" class="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-300 dark:border-purple-600">
              <div class="text-3xl">{{ fruit.icon }}</div>
              <div class="flex-1">
                <h5 class="font-bold text-gray-800 dark:text-gray-200">{{ fruit.name }}</h5>
                <p class="text-sm text-gray-500">{{ lang === 'zh' ? '价格：' : 'Price: ' }} <span class="font-bold text-purple-600">¥{{ fruit.price }}</span></p>
              </div>
              <button 
                @click="addToCart(idx)"
                class="px-3 py-1 bg-purple-500 text-white rounded font-bold text-sm hover:bg-purple-600"
              >
                {{ lang === 'zh' ? '加购' : 'Add' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Code -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{{ lang === 'zh' ? '📄 子组件 (List.vue)' : 'Child Component (List.vue)' }}</p>
            <div class="bg-gray-900 text-blue-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{{ scopedSlotChild }}</pre>
            </div>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{{ lang === 'zh' ? '📄 使用方式' : 'Usage' }}</p>
            <div class="bg-gray-900 text-blue-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{{ scopedSlotUsage }}</pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Part 4: Key Concept -->
      <section class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span class="text-2xl">💡</span> {{ lang === 'zh' ? '为什么使用插槽？' : 'Why Use Slots?' }}
        </h3>
        
        <div class="space-y-4">
          <div class="flex gap-3 items-start">
            <span class="text-2xl">✅</span>
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{{ lang === 'zh' ? '提高组件复用性' : 'Increase Component Reusability' }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ lang === 'zh' ? '同一个卡片组件可以显示不同内容，不需要为每种情况创建新组件。' : 'The same card component can display different content without creating new components for each case.' }}</p>
            </div>
          </div>
          
          <div class="flex gap-3 items-start">
            <span class="text-2xl">✅</span>
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{{ lang === 'zh' ? '父组件更灵活' : 'More Flexible Parent Components' }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ lang === 'zh' ? '父组件可以完全控制子组件显示的内容结构。' : 'Parent components can fully control the content structure displayed by child components.' }}</p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="text-2xl">✅</span>
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{{ lang === 'zh' ? '代码更简洁' : 'Cleaner Code' }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ lang === 'zh' ? '无需使用大量的 props 来配置组件的每个细节。' : 'No need to use many props to configure every detail of the component.' }}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const fruits = ref([
  { name: props.lang === 'zh' ? '苹果' : 'Apple', icon: '🍎', price: 5 },
  { name: props.lang === 'zh' ? '香蕉' : 'Banana', icon: '🍌', price: 3 },
  { name: props.lang === 'zh' ? '葡萄' : 'Grapes', icon: '🍇', price: 8 },
]);

const addToCart = (idx: number) => {
  fruits.value[idx].price += 0.5;
};

// Code snippets
const basicSlotChild = `<!-- Card.vue -->
<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  border: 2px solid;
  padding: 16px;
  border-radius: 8px;
}
</style>`;

const basicSlotParent = `<!-- Parent.vue -->
<template>
  <Card>
    <p>💡 这是插槽的内容</p>
  </Card>
</template>`;

const namedSlotChild = `<!-- Profile.vue -->
<template>
  <div class="profile">
    <slot name="header"></slot>
    <slot name="content"></slot>
    <slot name="footer"></slot>
  </div>
</template>`;

const namedSlotUsage = `<!-- 使用方式 -->
<Profile>
  <template #header>
    头部内容
  </template>
  
  <template #content>
    中间内容
  </template>
  
  <template #footer>
    底部内容
  </template>
</Profile>`;

const scopedSlotChild = `<!-- List.vue -->
<template>
  <div>
    <slot 
      v-for="item in items"
      :item="item"
      :index="index"
    ></slot>
  </div>
</template>`;

const scopedSlotUsage = `<!-- 接收数据 -->
<List :items="fruits">
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</List>`;
</script>
