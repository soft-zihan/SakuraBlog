<template>
  <div class="space-y-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ lang === 'zh' ? '事件处理' : 'Event Handling' }}</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">{{ lang === 'zh' ? 'Click、Modifiers、Keyboard Events' : '@click basics, event modifiers, keyboard events' }}</p>
    </div>

    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Part 1 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">1. {{ lang === 'zh' ? '基础点击事件' : 'Basic Click Event' }}</h3>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-4 text-center">
          <p class="text-4xl font-bold text-blue-500 mb-4">{{ clickCount }}</p>
          <button @click="clickCount++" class="px-4 py-2 bg-blue-500 text-white rounded font-bold">{{ lang === 'zh' ? '点击' : 'Click' }}</button>
          <button @click="clickCount = 0" class="ml-2 px-4 py-2 bg-gray-400 text-white rounded">{{ lang === 'zh' ? '重置' : 'Reset' }}</button>
        </div>
      </div>

      <!-- Part 2 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">2. {{ lang === 'zh' ? '事件修饰符' : 'Event Modifiers' }}</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-orange-50 p-4 rounded">
            <p class="text-sm font-bold mb-2">.stop {{ lang === 'zh' ? '阻止冒泡' : 'Prevent Propagation' }}</p>
            <div @click="stopCount.parent++" class="bg-orange-100 p-3 rounded cursor-pointer">
              {{ lang === 'zh' ? '外层' : 'Parent' }}: {{ stopCount.parent }}
              <button @click.stop="stopCount.child++" class="ml-2 px-2 py-1 bg-orange-500 text-white rounded text-xs">{{ lang === 'zh' ? '内层' : 'Child' }}: {{ stopCount.child }}</button>
            </div>
          </div>
          <div class="bg-purple-50 p-4 rounded">
            <p class="text-sm font-bold mb-2">.once {{ lang === 'zh' ? '只执行一次' : 'Execute Once' }}</p>
            <button @click.once="onceCount++" :disabled="onceCount > 0" class="px-4 py-2 bg-purple-500 text-white rounded font-bold">{{ lang === 'zh' ? '点击' : 'Click' }}</button>
            <p class="mt-2 text-lg font-bold text-purple-600">{{ onceCount }}</p>
          </div>
        </div>
      </div>

      <!-- Part 3 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">3. {{ lang === 'zh' ? '键盘事件' : 'Keyboard Events' }}</h3>
        <div class="bg-green-50 p-4 rounded">
          <input v-model="keyboardInput" @keyup.enter="addKeyboardItem" type="text" :placeholder="lang === 'zh' ? '输入并按 Enter' : 'Type and press Enter'" class="px-3 py-2 border rounded" />
          <div class="flex flex-wrap gap-2 mt-4">
            <div v-for="(item, i) in keyboardItems" :key="i" class="bg-green-200 px-3 py-1 rounded flex gap-2">
              <span>{{ item }}</span>
              <button @click="keyboardItems.splice(i, 1)" class="text-red-600">x</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Part 4 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">4. {{ lang === 'zh' ? '常见错误' : 'Common Mistakes' }}</h3>
        <div class="bg-red-50 p-4 rounded border-l-4 border-red-500">
          <p class="font-bold text-red-700 mb-2">{{ lang === 'zh' ? '错误：忘记加括号' : 'Wrong: Missing parentheses' }}</p>
          <div class="bg-red-900 text-red-200 p-2 rounded font-mono text-xs">&lt;button @click="handleClick"&gt;{{ lang === 'zh' ? '点击' : 'Click' }}&lt;/button&gt;</div>
          <p class="font-bold text-green-700 mt-3 mb-2">{{ lang === 'zh' ? '正确：加上括号' : 'Correct: Add parentheses' }}</p>
          <div class="bg-green-900 text-green-200 p-2 rounded font-mono text-xs">&lt;button @click="handleClick()"&gt;{{ lang === 'zh' ? '点击' : 'Click' }}&lt;/button&gt;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  lang: 'en' | 'zh';
}>();

const clickCount = ref(0);
const stopCount = ref({ parent: 0, child: 0 });
const onceCount = ref(0);
const keyboardInput = ref('');
const keyboardItems = ref<string[]>([]);

const addKeyboardItem = () => {
  if (keyboardInput.value.trim()) {
    keyboardItems.value.push(keyboardInput.value);
    keyboardInput.value = '';
  }
};
</script>