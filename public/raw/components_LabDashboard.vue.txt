<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_dashboard }}</h1>
      <p class="text-sakura-500">{{ t.lab_dashboard_desc }}</p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8 px-4">
      <div class="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex flex-wrap justify-center gap-2 shadow-inner">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          <span>{{ tab.icon }}</span>
          <span class="hidden md:inline">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[500px] transition-all duration-500">
      
      <!-- Tab 1: Web Foundation (HTML/CSS/JS) -->
      <div v-if="activeTab === 'foundation'" class="space-y-12 animate-fade-in">
        
        <!-- Part 0: Code Evolution Journey (NEW - Entry Point for Beginners) -->
        <section>
          <LabCodeEvolution :lang="lang" />
        </section>

        <!-- Part 1: Web Standards Triad Visualization -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-sakura-100 dark:border-gray-700 shadow-xl relative overflow-hidden">
             <!-- Background decoration -->
             <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>
             
             <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_standards_title }}</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t.lab_standards_desc }}</p>
             </div>

             <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
                <!-- Interactive Figure -->
                <div class="w-48 h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative transition-all duration-500" :class="{'border-sakura-400 dark:border-sakura-500 shadow-lg shadow-sakura-500/20': standards.css}">
                    <!-- CSS Skin Background -->
                    <div v-if="standards.css" class="absolute inset-2 bg-gradient-to-br from-sakura-100 to-purple-100 dark:from-sakura-900/50 dark:to-purple-900/50 rounded-xl transition-all duration-500 animate-fade-in"></div>

                    <!-- HTML Skeleton (Always visible if toggle is on, but styled differently) -->
                    <div v-if="standards.html" class="relative z-10 text-6xl transition-all duration-500" :class="{'animate-bounce': standards.js}">
                       <span v-if="!standards.css">🦴</span>
                       <span v-else>🤵</span>
                    </div>
                    <div v-else class="text-gray-300 dark:text-gray-700 text-sm font-mono text-center px-4">
                      &lt;div&gt;<br>Empty<br>&lt;/div&gt;
                    </div>

                    <!-- JS Effect -->
                    <div v-if="standards.js" class="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
                    <div v-if="standards.js" class="absolute -left-4 -bottom-4 text-2xl animate-spin-slow">⚙️</div>
                </div>

                <!-- Controls -->
                <div class="flex flex-col gap-3 w-full md:w-auto">
                   <!-- HTML Toggle -->
                   <button @click="standards.html = !standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="standards.html ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'"
                   >
                      <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-lg">H</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_html }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_html }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-orange-500 border-orange-500': standards.html}"></div>
                      </div>
                   </button>

                   <!-- CSS Toggle -->
                   <button @click="standards.css = !standards.css" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[
                      !standards.html ? 'cursor-not-allowed opacity-40' : '',
                      standards.css ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                    ]"
                   >
                      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">C</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_css }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_css }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-blue-500 border-blue-500': standards.css}"></div>
                      </div>
                   </button>

                   <!-- JS Toggle -->
                   <button @click="standards.js = !standards.js" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[
                       !standards.html ? 'cursor-not-allowed opacity-40' : '',
                       standards.js ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                    ]"
                   >
                      <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 font-bold text-lg">J</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_js }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_js }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-yellow-500 border-yellow-500': standards.js}"></div>
                      </div>
                   </button>
                </div>
             </div>
          </div>
        </section>

        <!-- Part 2: Browser Kernel Simulator (Enhanced HTML Lab) -->
        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧱</span> {{ t.lab_html_title }}
          </h2>
          <LabHtml :lang="lang" />
        </section>

        <!-- Part 3: JS Event Bubbling & DOM Manipulation -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section>
            <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">⚡</span> {{ lang === 'zh' ? 'JS 核心机制' : 'JS Core Mechanics' }}
            </h2>
            <LabJs :lang="lang" />
            </section>
            
            <section>
             <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
            </h2>
             <LabDom :lang="lang" />
            </section>
        </div>

        <!-- Learning Path (Roadmap) -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-sakura-100 dark:border-gray-700 shadow-xl">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span class="text-2xl">🗺️</span>
              {{ lang === 'zh' ? '前端学习路径' : 'Frontend Learning Path' }}
            </h2>
            <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li>1) HTML / CSS / JS → {{ lang === 'zh' ? '打好基础，并能做简单交互' : 'build essentials and simple interactivity' }}</li>
              <li>2) TypeScript + DOM / Web API → {{ lang === 'zh' ? '提升类型与浏览器API应用能力' : 'strengthen types and browser APIs' }}</li>
              <li>3) 模块化（ESM/CJS） → {{ lang === 'zh' ? '理解模块加载与组织' : 'understand module loading and organization' }}</li>
              <li>4) npm 包管理 → {{ lang === 'zh' ? '学会依赖管理与脚本' : 'learn dependency management and scripts' }}</li>
              <li>5) CSS 框架（TailwindCSS） → {{ lang === 'zh' ? '快速搭建现代样式' : 'rapidly style modern UIs' }}</li>
              <li>6) UI 框架（Vue） → {{ lang === 'zh' ? '组件化、响应式与生态' : 'components, reactivity, ecosystem' }}</li>
            </ul>
            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <a href="zh/VUE学习笔记/01-基础概念与MVVM.md" class="p-4 rounded-xl border hover:border-sakura-400 transition-colors">📝 HTML/CSS/JS</a>
              <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener" class="p-4 rounded-xl border hover:border-sakura-400 transition-colors">🧩 TypeScript</a>
              <a href="https://developer.mozilla.org/docs/Web/API" target="_blank" rel="noopener" class="p-4 rounded-xl border hover:border-sakura-400 transition-colors">🧪 Web API</a>
              <a href="https://nodejs.org/docs/latest/api/modules.html" target="_blank" rel="noopener" class="p-4 rounded-xl border hover:border-sakura-400 transition-colors">📦 ESM/CJS</a>
              <a href="https://docs.npmjs.com/" target="_blank" rel="noopener" class="p-4 rounded-xl border hover:border-sakura-400 transition-colors">🔧 npm</a>
              <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener" class="p-4 rounded-xl border hover:border-sakura-400 transition-colors">🎨 TailwindCSS</a>
              <a href="https://vuejs.org/guide/introduction.html" target="_blank" rel="noopener" class="p-4 rounded-xl border hover:border-sakura-400 transition-colors">🟩 Vue</a>
            </div>
          </div>
        </section>
      </div>

      <!-- Tab 2: Vue Core -->
      <div v-else-if="activeTab === 'vue'" class="space-y-12 animate-fade-in">
         
        <!-- Part 1: Reactivity - Vue's Core Foundation -->
        <section>
           <h2 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
             <span class="text-2xl">🧪</span> {{ t.lab_reactivity }}
             <span class="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? '核心基础' : 'Core' }}</span>
           </h2>
           <LabReactivity :lang="lang" />
        </section>

        <!-- Part 2: Directives & Class/Style Binding (Side by Side) -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">👁️</span> {{ t.lab_directives }}
              <span class="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-0.5 rounded-full ml-2">v-if / v-show</span>
            </h2>
            <LabDirectives :lang="lang" />
          </section>

          <section>
              <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">💅</span> {{ t.lab_class_title }}
                <span class="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-2">:class / :style</span>
              </h2>
              <LabClassStyle :lang="lang" />
          </section>
        </div>

        <!-- Part 3: List Rendering - Full Width (Employee Management System) -->
        <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📋</span> {{ t.lab_vue_list_title }}
              <span class="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-0.5 rounded-full ml-2">v-for / v-model</span>
            </h2>
            <LabVueList :lang="lang" />
        </section>

        <!-- Part 4: Component Communication -->
        <section>
            <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📡</span> {{ t.lab_props_title }}
              <span class="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">Props ↓ Emit ↑</span>
            </h2>
            <LabPropsEmit :lang="lang" />
        </section>

        <!-- Part 5: Lifecycle -->
        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎢</span> {{ t.lab_lifecycle }}
            <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? '组件生命周期' : 'Component Lifecycle' }}</span>
          </h2>
          <LabLifecycle :lang="lang" />
        </section>

        <!-- Quick Navigation to New Labs -->
        <div class="mt-16 pt-12 border-t border-gray-300 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <span class="text-2xl">🚀</span> {{ lang === 'zh' ? '最新实验室' : 'New Labs' }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              @click="$emit('select-lab', 'event-handling')"
              class="group p-6 rounded-xl border-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-left hover:scale-105 transform"
            >
              <div class="text-2xl mb-2">🖱️</div>
              <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-1">{{ lang === 'zh' ? '事件处理' : 'Event Handling' }}</h4>
              <p class="text-sm text-blue-600 dark:text-blue-400">{{ lang === 'zh' ? '@click、修饰符、键盘事件' : '@click, modifiers, keyboard' }}</p>
            </button>
            
            <button 
              @click="$emit('select-lab', 'slot')"
              class="group p-6 rounded-xl border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all text-left hover:scale-105 transform"
            >
              <div class="text-2xl mb-2">🎁</div>
              <h4 class="font-bold text-green-700 dark:text-green-300 mb-1">{{ lang === 'zh' ? '插槽系统' : 'Slot System' }}</h4>
              <p class="text-sm text-green-600 dark:text-green-400">{{ lang === 'zh' ? '基础、具名、作用域插槽' : 'Default, named, scoped' }}</p>
            </button>
          </div>
        </div>
      </div>
      
       <!-- Tab 3: Network -->
      <div v-else-if="activeTab === 'network'" class="space-y-12 animate-fade-in">
         <section class="max-w-4xl mx-auto">
           <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
             <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
           </h2>
           <LabAjax :lang="lang" />
        </section>
      </div>

      <!-- Tab 4: Challenge -->
      <div v-else-if="activeTab === 'challenge'" class="animate-fade-in">
         <section class="max-w-3xl mx-auto">
           <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2 justify-center">
             <span class="text-2xl">🥷</span> {{ t.lab_quiz }}
           </h2>
           <LabQuizGame :lang="lang" />
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { I18N } from '../constants';
import LabQuizGame from './LabQuizGame.vue';
import LabReactivity from './LabReactivity.vue';
import LabDirectives from './LabDirectives.vue';
import LabLifecycle from './LabLifecycle.vue';
import LabHtml from './LabHtml.vue';
import LabJs from './LabJs.vue';
import LabDom from './LabDom.vue';

defineEmits<{
  'select-lab': [lab: 'event-handling' | 'slot'];
}>();
import LabAjax from './LabAjax.vue';
import LabVueList from './LabVueList.vue';
import LabPropsEmit from './LabPropsEmit.vue';
import LabClassStyle from './LabClassStyle.vue';
import LabCodeEvolution from './LabCodeEvolution.vue';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const activeTab = ref('foundation');

const tabs = computed(() => [
  { id: 'foundation', label: t.value.cat_foundation, icon: '🌐' },
  { id: 'vue', label: t.value.cat_vue, icon: '🥝' },
  { id: 'network', label: t.value.cat_network, icon: '📡' },
  { id: 'challenge', label: t.value.cat_challenge, icon: '🏆' },
]);

// Web Standards State
const standards = reactive({
  html: true,
  css: false,
  js: false
});
</script>