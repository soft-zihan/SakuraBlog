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
          class="px-3 md:px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center gap-0.5 min-w-[60px] md:min-w-[90px]"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          <span class="text-lg md:text-xl">{{ tab.icon }}</span>
          <span class="text-[10px] md:text-xs">{{ tab.label.split(' ').pop() }}</span>
          <span class="text-[8px] text-gray-400 hidden md:block">{{ lang === 'zh' ? `第${tab.stage}阶段` : `Stage ${tab.stage}` }}</span>
        </button>
      </div>
    </div>

    <!-- Learning Progress Indicator -->
    <div class="max-w-3xl mx-auto mb-8 px-4">
      <div class="flex items-center gap-2">
        <template v-for="(tab, index) in tabs" :key="tab.id">
          <div 
            class="flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer"
            :class="tabs.findIndex(t => t.id === activeTab) >= index ? 'bg-sakura-400' : 'bg-gray-200 dark:bg-gray-700'"
            @click="activeTab = tab.id"
          ></div>
        </template>
      </div>
      <div class="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>{{ lang === 'zh' ? '入门' : 'Beginner' }}</span>
        <span>{{ lang === 'zh' ? '进阶' : 'Advanced' }}</span>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[500px] transition-all duration-500">
      
      <!-- Stage Info Banner -->
      <div class="max-w-4xl mx-auto mb-8 px-4">
        <div class="bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 border border-sakura-100 dark:border-sakura-800/30">
          <div class="flex items-start gap-4">
            <div class="text-4xl">{{ tabs.find(t => t.id === activeTab)?.icon }}</div>
            <div class="flex-1">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">
                {{ lang === 'zh' ? `第${tabs.find(t => t.id === activeTab)?.stage}阶段：` : `Stage ${tabs.find(t => t.id === activeTab)?.stage}: ` }}
                {{ tabs.find(t => t.id === activeTab)?.label.replace(/^[^\s]+\s/, '') }}
              </h3>
              <p class="text-sm text-sakura-600 dark:text-sakura-400 mt-1">
                🎯 {{ tabs.find(t => t.id === activeTab)?.goal }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ tabs.find(t => t.id === activeTab)?.desc }}
              </p>
            </div>
            <div class="hidden md:block text-right">
              <span class="text-xs text-gray-400">{{ lang === 'zh' ? '前置要求' : 'Prerequisites' }}</span>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <template v-if="activeTab === 'foundation'">{{ lang === 'zh' ? '无需基础' : 'None' }} ✅</template>
                <template v-else-if="activeTab === 'js-advanced'">{{ lang === 'zh' ? '完成 Web 基础' : 'Web Basics' }}</template>
                <template v-else-if="activeTab === 'engineering'">{{ lang === 'zh' ? '完成 JS 进阶' : 'JS Advanced' }}</template>
                <template v-else-if="activeTab === 'vue'">{{ lang === 'zh' ? '完成工程化' : 'Engineering' }}</template>
                <template v-else>{{ lang === 'zh' ? '完成所有阶段' : 'All stages' }}</template>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <span class="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? 'HTML 解析' : 'HTML Parsing' }}</span>
          </h2>
          <LabHtml :lang="lang" />
        </section>

        <!-- Part 3: HTML Basics (NEW) -->
        <section>
          <LabHtmlBasics :lang="lang" />
        </section>

        <!-- Next Step Guide -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '🎉 完成本阶段后' : '🎉 After this stage' }}
            </h3>
            <p class="text-gray-500 text-sm mb-6">
              {{ lang === 'zh' ? '你已经可以制作静态网页了！接下来学习 JavaScript 进阶，让网页动起来。' : 'You can now build static web pages! Next, learn advanced JS to make them interactive.' }}
            </p>
            <button 
              @click="activeTab = 'js-advanced'"
              class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              {{ lang === 'zh' ? '进入下一阶段 →' : 'Next Stage →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 2: JS Advanced -->
      <div v-else-if="activeTab === 'js-advanced'" class="space-y-12 animate-fade-in">
        
        <!-- JS Core Mechanics (moved from foundation) -->
        <section>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ lang === 'zh' ? 'JavaScript 核心机制' : 'JavaScript Core Mechanics' }}
            <span class="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? '事件冒泡/this' : 'Event Bubbling/this' }}</span>
          </h2>
          <LabJs :lang="lang" />
        </section>

        <!-- DOM Manipulation -->
        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
            <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? 'DOM API' : 'DOM API' }}</span>
          </h2>
          <LabDom :lang="lang" />
        </section>

        <!-- Async Programming (Ajax) -->
        <section class="max-w-4xl mx-auto">
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
            <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
            <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? 'Promise/async' : 'Promise/async' }}</span>
          </h2>
          <LabAjax :lang="lang" />
        </section>

        <!-- TypeScript Placeholder -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
            <div class="text-4xl mb-4">🔷</div>
            <h3 class="font-bold text-gray-700 dark:text-gray-300 text-lg mb-2">
              {{ lang === 'zh' ? 'TypeScript 类型系统' : 'TypeScript Type System' }}
            </h3>
            <p class="text-gray-500 text-sm mb-4">
              {{ lang === 'zh' ? '类型注解、接口、泛型 - 开发中...' : 'Type annotations, interfaces, generics - Coming soon...' }}
            </p>
            <span class="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
              {{ lang === 'zh' ? '🚧 即将推出' : '🚧 Coming Soon' }}
            </span>
          </div>
        </section>
      </div>

      <!-- Tab 3: Engineering -->
      <div v-else-if="activeTab === 'engineering'" class="space-y-12 animate-fade-in">
        
        <!-- Module System Placeholder -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
            <div class="text-4xl mb-4">📦</div>
            <h3 class="font-bold text-gray-700 dark:text-gray-300 text-lg mb-2">
              {{ lang === 'zh' ? '模块化系统' : 'Module System' }}
            </h3>
            <p class="text-gray-500 text-sm mb-4">
              {{ lang === 'zh' ? 'ESM vs CommonJS、导入导出、模块作用域' : 'ESM vs CommonJS, import/export, module scope' }}
            </p>
            <span class="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
              {{ lang === 'zh' ? '🚧 即将推出' : '🚧 Coming Soon' }}
            </span>
          </div>
        </section>

        <!-- NPM Placeholder -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
            <div class="text-4xl mb-4">📚</div>
            <h3 class="font-bold text-gray-700 dark:text-gray-300 text-lg mb-2">
              {{ lang === 'zh' ? 'NPM 包管理' : 'NPM Package Management' }}
            </h3>
            <p class="text-gray-500 text-sm mb-4">
              {{ lang === 'zh' ? 'package.json、依赖管理、语义化版本' : 'package.json, dependencies, semantic versioning' }}
            </p>
            <span class="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm">
              {{ lang === 'zh' ? '🚧 即将推出' : '🚧 Coming Soon' }}
            </span>
          </div>
        </section>

        <!-- Build Tools Placeholder -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
            <div class="text-4xl mb-4">⚙️</div>
            <h3 class="font-bold text-gray-700 dark:text-gray-300 text-lg mb-2">
              {{ lang === 'zh' ? '构建工具 (Vite)' : 'Build Tools (Vite)' }}
            </h3>
            <p class="text-gray-500 text-sm mb-4">
              {{ lang === 'zh' ? '为什么需要打包、Vite 配置、环境变量' : 'Why bundling, Vite config, env variables' }}
            </p>
            <span class="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm">
              {{ lang === 'zh' ? '🚧 即将推出' : '🚧 Coming Soon' }}
            </span>
          </div>
        </section>

        <!-- TailwindCSS Preview -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-cyan-200 dark:border-cyan-800/30 text-center">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="font-bold text-gray-700 dark:text-gray-300 text-lg mb-2">
              {{ lang === 'zh' ? 'TailwindCSS 快速入门' : 'TailwindCSS Quickstart' }}
            </h3>
            <p class="text-gray-500 text-sm mb-4">
              {{ lang === 'zh' ? '工具类 CSS、响应式设计、暗色模式' : 'Utility CSS, responsive design, dark mode' }}
            </p>
            <span class="inline-block px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full text-sm">
              {{ lang === 'zh' ? '🚧 即将推出' : '🚧 Coming Soon' }}
            </span>
          </div>
        </section>
      </div>

       <!-- Tab 4: Vue Core (was Tab 2) -->
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

      <!-- Tab 5: Challenge -->
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
import LabHtmlBasics from './LabHtmlBasics.vue';
import LabJs from './LabJs.vue';
import LabDom from './LabDom.vue';
import LabAjax from './LabAjax.vue';
import LabVueList from './LabVueList.vue';
import LabPropsEmit from './LabPropsEmit.vue';
import LabClassStyle from './LabClassStyle.vue';
import LabCodeEvolution from './LabCodeEvolution.vue';

defineEmits<{
  'select-lab': [lab: 'event-handling' | 'slot'];
}>();

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const activeTab = ref('foundation');

// Learning path stages - progressive learning from basics to advanced
const tabs = computed(() => [
  { 
    id: 'foundation', 
    label: props.lang === 'zh' ? '🌐 Web基础' : '🌐 Web Basics', 
    icon: '🌐',
    stage: 1,
    desc: props.lang === 'zh' ? 'HTML/CSS/JS 基础' : 'HTML/CSS/JS Basics',
    goal: props.lang === 'zh' ? '能制作经典动态网页' : 'Build interactive web pages'
  },
  { 
    id: 'js-advanced', 
    label: props.lang === 'zh' ? '⚡ JS进阶' : '⚡ JS Advanced', 
    icon: '⚡',
    stage: 2,
    desc: props.lang === 'zh' ? 'TypeScript/DOM/异步' : 'TypeScript/DOM/Async',
    goal: props.lang === 'zh' ? '掌握 JS 高级特性' : 'Master JS advanced features'
  },
  { 
    id: 'engineering', 
    label: props.lang === 'zh' ? '🔧 工程化' : '🔧 Engineering', 
    icon: '🔧',
    stage: 3,
    desc: props.lang === 'zh' ? '模块化/NPM/构建' : 'Modules/NPM/Build',
    goal: props.lang === 'zh' ? '不借助框架完成项目' : 'Build projects without frameworks'
  },
  { 
    id: 'vue', 
    label: props.lang === 'zh' ? '🥝 Vue 3' : '🥝 Vue 3', 
    icon: '🥝',
    stage: 4,
    desc: props.lang === 'zh' ? '响应式/组件/状态' : 'Reactivity/Components/State',
    goal: props.lang === 'zh' ? '构建现代 Web 应用' : 'Build modern web apps'
  },
  { 
    id: 'challenge', 
    label: props.lang === 'zh' ? '🏆 挑战赛' : '🏆 Challenge', 
    icon: '🏆',
    stage: 5,
    desc: props.lang === 'zh' ? '测验与项目' : 'Quiz & Projects',
    goal: props.lang === 'zh' ? '检验综合能力' : 'Test your skills'
  },
]);

// Web Standards State
const standards = reactive({
  html: true,
  css: false,
  js: false
});
</script>