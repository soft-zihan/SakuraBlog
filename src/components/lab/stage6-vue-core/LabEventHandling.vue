<template>
  <div class="space-y-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ lang === 'zh' ? '事件处理' : 'Event Handling' }}</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">{{ lang === 'zh' ? '@click 基础、事件修饰符、键盘事件、传参方式' : '@click basics, event modifiers, keyboard events, parameter passing' }}</p>
    </div>

    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Part 1: 基础点击事件 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">1. {{ lang === 'zh' ? '基础点击事件' : 'Basic Click Event' }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ lang === 'zh' ? '使用 @click 绑定点击事件，可以直接写表达式或调用方法。' : 'Use @click to bindclick events. You can write expressions directly or call methods.' }}
        </p>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-4 text-center">
          <p class="text-4xl font-bold text-blue-500 mb-4">{{ clickCount }}</p>
          <button @click="clickCount++" class="px-4 py-2 bg-blue-500 text-white rounded font-bold">{{ lang === 'zh' ? '点击 +1' : 'Click +1' }}</button>
          <button @click="clickCount = 0" class="ml-2 px-4 py-2 bg-gray-400 text-white rounded">{{ lang === 'zh' ? '重置' : 'Reset' }}</button>
        </div>
        <div class="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-xs overflow-x-auto">
          <pre>&lt;button @click="clickCount++"&gt;{{ lang === 'zh' ? '点击' : 'Click' }}&lt;/button&gt;
&lt;button @click="clickCount = 0"&gt;{{ lang === 'zh' ? '重置' : 'Reset' }}&lt;/button&gt;</pre>
        </div>
      </div>

      <!-- Part 2: 方法调用与传参 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">2. {{ lang === 'zh' ? '方法调用方式' : 'Method Calling Patterns' }}</h3>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <!-- 方式1: 不带括号 -->
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <p class="font-bold text-green-700 dark:text-green-300 mb-2">✅ {{ lang === 'zh' ? '不带括号（无参数）' : 'Without parentheses (no args)' }}</p>
            <div class="bg-green-900 text-green-200 p-2 rounded font-mono text-xs">&lt;button @click="handleClick"&gt;</div>
            <p class="text-xs text-gray-500 mt-2">{{ lang === 'zh' ? 'Vue 自动传入 event 对象作为第一个参数' : 'Vue auto-passes event object as first argument' }}</p>
            <button @click="handleClickNoArgs" class="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm">{{ lang === 'zh' ? '测试' : 'Test' }}</button>
            <p class="text-xs mt-1 text-green-600">{{ lastEventType1 }}</p>
          </div>
          <!-- 方式2: 带括号 -->
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded border-l-4 border-green-500">
            <p class="font-bold text-green-700 dark:text-green-300 mb-2">✅ {{ lang === 'zh' ? '带括号（传参数）' : 'With parentheses (with args)' }}</p>
            <div class="bg-green-900 text-green-200 p-2 rounded font-mono text-xs">&lt;button @click="handleClick('hi')"&gt;</div>
            <p class="text-xs text-gray-500 mt-2">{{ lang === 'zh' ? '可以传递自定义参数' : 'Pass custom arguments' }}</p>
            <button @click="handleClickWithArgs('Hello!')" class="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm">{{ lang === 'zh' ? '测试' : 'Test' }}</button>
            <p class="text-xs mt-1 text-green-600">{{ lastEventType2 }}</p>
          </div>
        </div>
        <!-- 方式3: 同时传参和 $event -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
          <p class="font-bold text-blue-700 dark:text-blue-300 mb-2">💡 {{ lang === 'zh' ? '同时获取参数和事件对象' : 'Get both args and event object' }}</p>
          <div class="bg-blue-900 text-blue-200 p-2 rounded font-mono text-xs">&lt;button @click="handleClick('data', $event)"&gt;</div>
          <p class="text-xs text-gray-500 mt-2">{{ lang === 'zh' ? '使用 $event 显式传递原生事件' : 'Use $event to explicitly pass the native event' }}</p>
          <button @click="handleClickWithBoth('MyData', $event)" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">{{ lang === 'zh' ? '测试' : 'Test' }}</button>
          <p class="text-xs mt-1 text-blue-600">{{ lastEventType3 }}</p>
        </div>
      </div>

      <!-- Part 3: 事件修饰符 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">3. {{ lang === 'zh' ? '事件修饰符' : 'Event Modifiers' }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ lang === 'zh' ? '修饰符是 Vue 提供的快捷方式，简化事件处理代码。' : 'Modifiers are Vue shortcuts that simplify event handling code.' }}
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          <!-- .stop -->
          <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
            <p class="text-sm font-bold mb-2">.stop <span class="text-gray-500 font-normal">{{ lang === 'zh' ? '阻止冒泡' : 'Stop Propagation' }}</span></p>
            <div @click="stopCount.parent++" class="bg-orange-100 dark:bg-orange-800/30 p-3 rounded cursor-pointer">
              {{ lang === 'zh' ? '外层' : 'Parent' }}: {{ stopCount.parent }}
              <button @click.stop="stopCount.child++" class="ml-2 px-2 py-1 bg-orange-500 text-white rounded text-xs">{{ lang === 'zh' ? '内层' : 'Child' }}: {{ stopCount.child }}</button>
            </div>
            <div class="bg-gray-900 text-orange-200 p-2 rounded font-mono text-xs mt-2">&lt;button @click.stop="..."&gt;</div>
          </div>
          <!-- .prevent -->
          <div class="bg-pink-50 dark:bg-pink-900/20 p-4 rounded">
            <p class="text-sm font-bold mb-2">.prevent <span class="text-gray-500 font-normal">{{ lang === 'zh' ? '阻止默认行为' : 'Prevent Default' }}</span></p>
            <a href="https://vuejs.org" @click.prevent="preventDemo++" class="text-pink-600 underline cursor-pointer">
              {{ lang === 'zh' ? '点击不会跳转' : 'Click won\'t navigate' }} ({{ preventDemo }})
            </a>
            <div class="bg-gray-900 text-pink-200 p-2 rounded font-mono text-xs mt-2">&lt;a @click.prevent="..."&gt;</div>
          </div>
          <!-- .once -->
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
            <p class="text-sm font-bold mb-2">.once <span class="text-gray-500 font-normal">{{ lang === 'zh' ? '只执行一次' : 'Execute Once' }}</span></p>
            <button @click.once="onceCount++" :class="onceCount > 0 ? 'opacity-50' : ''" class="px-4 py-2 bg-purple-500 text-white rounded font-bold">{{ lang === 'zh' ? '点击' : 'Click' }} ({{ onceCount }})</button>
            <div class="bg-gray-900 text-purple-200 p-2 rounded font-mono text-xs mt-2">&lt;button @click.once="..."&gt;</div>
          </div>
          <!-- .self -->
          <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded">
            <p class="text-sm font-bold mb-2">.self <span class="text-gray-500 font-normal">{{ lang === 'zh' ? '仅自身触发' : 'Only Self' }}</span></p>
            <div @click.self="selfCount++" class="bg-teal-100 dark:bg-teal-800/30 p-3 rounded cursor-pointer">
              {{ lang === 'zh' ? '点这里' : 'Click here' }}: {{ selfCount }}
              <button class="ml-2 px-2 py-1 bg-teal-500 text-white rounded text-xs">{{ lang === 'zh' ? '按钮不触发' : 'Button won\'t trigger' }}</button>
            </div>
            <div class="bg-gray-900 text-teal-200 p-2 rounded font-mono text-xs mt-2">&lt;div @click.self="..."&gt;</div>
          </div>
        </div>
      </div>

      <!-- Part 4: 键盘事件 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">4. {{ lang === 'zh' ? '键盘事件' : 'Keyboard Events' }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ lang === 'zh' ? '使用按键修饰符监听特定按键。' : 'Use key modifiers to listen for specific keys.' }}
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded">
            <p class="text-sm font-bold mb-2">@keyup.enter</p>
            <input 
              v-model="keyboardInput" 
              @keyup.enter="addKeyboardItem" 
              type="text" 
              :placeholder="lang === 'zh' ? '输入并按 Enter' : 'Type and press Enter'" 
              class="px-3 py-2 border rounded w-full dark:bg-gray-800 dark:border-gray-600" 
            />
            <div class="flex flex-wrap gap-2 mt-3">
              <div v-for="(item, i) in keyboardItems" :key="i" class="bg-green-200 dark:bg-green-800 px-3 py-1 rounded flex gap-2 text-sm">
                <span>{{ item }}</span>
                <button @click="keyboardItems.splice(i, 1)" class="text-red-600">×</button>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
            <p class="text-sm font-bold mb-2">{{ lang === 'zh' ? '其他按键修饰符' : 'Other Key Modifiers' }}</p>
            <div class="space-y-2 text-sm font-mono">
              <div class="flex justify-between"><span>@keyup.esc</span><span class="text-gray-500">Escape</span></div>
              <div class="flex justify-between"><span>@keyup.tab</span><span class="text-gray-500">Tab</span></div>
              <div class="flex justify-between"><span>@keyup.delete</span><span class="text-gray-500">Delete/Backspace</span></div>
              <div class="flex justify-between"><span>@keyup.space</span><span class="text-gray-500">Space</span></div>
              <div class="flex justify-between"><span>@keyup.up/down/left/right</span><span class="text-gray-500">{{ lang === 'zh' ? '方向键' : 'Arrows' }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Part 5: 鼠标事件 -->
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h3 class="text-lg font-bold mb-4">5. {{ lang === 'zh' ? '鼠标事件' : 'Mouse Events' }}</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div 
            @mouseenter="mouseState = 'enter'" 
            @mouseleave="mouseState = 'leave'"
            class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded text-center transition-all"
            :class="mouseState === 'enter' ? 'bg-indigo-200 dark:bg-indigo-800 scale-105' : ''"
          >
            <p class="text-sm font-bold mb-2">@mouseenter / @mouseleave</p>
            <p class="text-xs text-gray-500">{{ lang === 'zh' ? '鼠标移入/移出' : 'Mouse enter/leave' }}</p>
            <p class="text-lg font-bold mt-2 text-indigo-600">{{ mouseState }}</p>
          </div>
          <div 
            @click.right.prevent="rightClickCount++"
            class="bg-rose-50 dark:bg-rose-900/20 p-6 rounded text-center cursor-context-menu"
          >
            <p class="text-sm font-bold mb-2">@click.right</p>
            <p class="text-xs text-gray-500">{{ lang === 'zh' ? '右键点击' : 'Right click' }}</p>
            <p class="text-lg font-bold mt-2 text-rose-600">{{ rightClickCount }}</p>
          </div>
          <div 
            @dblclick="dblClickCount++"
            class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded text-center cursor-pointer"
          >
            <p class="text-sm font-bold mb-2">@dblclick</p>
            <p class="text-xs text-gray-500">{{ lang === 'zh' ? '双击' : 'Double click' }}</p>
            <p class="text-lg font-bold mt-2 text-amber-600">{{ dblClickCount }}</p>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-sakura-200 dark:border-sakura-800">
        <h3 class="text-lg font-bold mb-4">💡 {{ lang === 'zh' ? '总结' : 'Summary' }}</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-bold text-sakura-600 mb-2">{{ lang === 'zh' ? '事件绑定' : 'Event Binding' }}</p>
            <ul class="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• @click="method" {{ lang === 'zh' ? '或' : 'or' }} @click="method()"</li>
              <li>• {{ lang === 'zh' ? '传参时用括号' : 'Use () when passing args' }}: @click="fn(arg)"</li>
              <li>• {{ lang === 'zh' ? '需要 event 时用' : 'Need event? Use' }} $event</li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sakura-600 mb-2">{{ lang === 'zh' ? '常用修饰符' : 'Common Modifiers' }}</p>
            <ul class="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• .stop {{ lang === 'zh' ? '阻止冒泡' : 'stop propagation' }}</li>
              <li>• .prevent {{ lang === 'zh' ? '阻止默认' : 'prevent default' }}</li>
              <li>• .once {{ lang === 'zh' ? '只触发一次' : 'trigger once' }}</li>
            </ul>
          </div>
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
const preventDemo = ref(0);
const selfCount = ref(0);
const keyboardInput = ref('');
const keyboardItems = ref<string[]>([]);
const mouseState = ref('leave');
const rightClickCount = ref(0);
const dblClickCount = ref(0);

// 方法调用演示
const lastEventType1 = ref('');
const lastEventType2 = ref('');
const lastEventType3 = ref('');

const handleClickNoArgs = (event: MouseEvent) => {
  lastEventType1.value = `Event type: ${event.type}`;
};

const handleClickWithArgs = (msg: string) => {
  lastEventType2.value = `Arg: ${msg}`;
};

const handleClickWithBoth = (data: string, event: MouseEvent) => {
  lastEventType3.value = `Data: ${data}, Event: ${event.type}`;
};

const addKeyboardItem = () => {
  if (keyboardInput.value.trim()) {
    keyboardItems.value.push(keyboardInput.value);
    keyboardInput.value = '';
  }
};
</script>