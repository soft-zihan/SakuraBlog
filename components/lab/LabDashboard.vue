<template>
  <div class="space-y-8">
    <!-- Stage Info Banner (simplified, no header/tabs) -->
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 border border-sakura-100 dark:border-sakura-800/30">
        <div class="flex items-start gap-4">
          <div class="text-4xl">{{ activeTabInfo?.icon }}</div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">
              {{ activeTabInfo?.noteNum ? (isZh ? `笔记${activeTabInfo?.noteNum}：` : `Note ${activeTabInfo?.noteNum}: `) : '' }}
              {{ activeTabInfo?.label }}
            </h3>
            <p class="text-sm text-sakura-600 dark:text-sakura-400 mt-1">
              🎯 {{ activeTabInfo?.goal }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {{ activeTabInfo?.desc }}
            </p>
          </div>
          <div class="hidden md:block text-right">
            <span class="text-xs text-gray-400">{{ isZh ? '关联本站代码' : 'Related Code' }}</span>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ activeTabInfo?.relatedCode }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[500px] transition-all duration-500">

      <!-- Note 1: HTML & CSS -->
      <div v-if="activeTab === 'note1-html-css'" class="space-y-12 animate-fade-in">
        
        <!-- Introduction Text -->
        <div class="max-w-3xl mx-auto px-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
            <h3 class="font-bold text-blue-800 dark:text-blue-200 mb-2">📚 {{ isZh ? '学习路线' : 'Learning Path' }}</h3>
            <p class="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              {{ isZh 
                ? 'Web 开发的基础是理解「三剑客」：HTML 负责结构、CSS 负责样式、JavaScript 负责行为。本章我们从代码的演化历史开始，逐步理解现代 Web 标准，并通过本站源码实例来巩固所学。' 
                : 'Web development basics: HTML for structure, CSS for styling, JavaScript for behavior. We start from code evolution history, understand modern web standards, and solidify learning through real site examples.'
              }}
            </p>
          </div>
        </div>

        <!-- Section: Web Standards -->
        <section>
          <LabCodeEvolution :lang="lang" />
        </section>

        <section class="max-w-4xl mx-auto">
          <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-sakura-100 dark:border-gray-700 shadow-xl relative overflow-hidden">
             <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>
             
             <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_standards_title }}</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t.lab_standards_desc }}</p>
             </div>

             <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div class="w-48 h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative transition-all duration-500" :class="{'border-sakura-400 dark:border-sakura-500 shadow-lg shadow-sakura-500/20': standards.css}">
                    <div v-if="standards.css" class="absolute inset-2 bg-gradient-to-br from-sakura-100 to-purple-100 dark:from-sakura-900/50 dark:to-purple-900/50 rounded-xl transition-all duration-500 animate-fade-in"></div>
                    <div v-if="standards.html" class="relative z-10 text-6xl transition-all duration-500" :class="{'animate-bounce': standards.js}">
                       <span v-if="!standards.css">🦴</span>
                       <span v-else>🤵</span>
                    </div>
                    <div v-else class="text-gray-300 dark:text-gray-700 text-sm font-mono text-center px-4">
                      &lt;div&gt;<br>Empty<br>&lt;/div&gt;
                    </div>
                    <div v-if="standards.js" class="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
                    <div v-if="standards.js" class="absolute -left-4 -bottom-4 text-2xl animate-spin-slow">⚙️</div>
                </div>

                <div class="flex flex-col gap-3 w-full md:w-auto">
                   <button @click="standards.html = !standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="standards.html ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'">
                      <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-lg">H</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_html }}</div>
                        <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_html }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-orange-500 border-orange-500': standards.html}"></div>
                      </div>
                   </button>
                   <button @click="standards.css = !standards.css" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.css ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']">
                      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">C</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_css }}</div>
                        <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_css }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-blue-500 border-blue-500': standards.css}"></div>
                      </div>
                   </button>
                   <button @click="standards.js = !standards.js" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.js ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']">
                      <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 font-bold text-lg">J</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_js }}</div>
                        <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_js }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-yellow-500 border-yellow-500': standards.js}"></div>
                      </div>
                   </button>
                </div>
             </div>
          </div>
        </section>

        <!-- Section: HTML Basics -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
              💡 {{ isZh ? '理解了 Web 标准后，我们来深入学习 HTML——网页的「骨架」。HTML 使用标签来描述页面结构，每个标签都有特定的语义含义。' : 'After understanding web standards, let\'s dive into HTML — the "skeleton" of web pages. HTML uses tags to describe page structure, each with specific semantic meaning.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧱</span> {{ t.lab_html_title }}
          </h2>
          <LabHtml :lang="lang" />
        </section>

        <section>
          <LabHtmlBasics :lang="lang" />
        </section>

        <!-- Section: CSS Basics & Layout -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? 'HTML 搭建好骨架后，CSS 负责「穿衣打扮」。通过选择器、属性值的组合，我们可以精确控制每个元素的外观。' : 'After HTML builds the skeleton, CSS handles the "styling". Through selectors and property values, we can precisely control each element\'s appearance.' }}
            </p>
          </div>
          <LabCssBasics :lang="lang" />
        </section>

        <section>
          <LabCssLayout :lang="lang" />
        </section>

        <!-- Section: CSS Animation (Extension) -->
        <section>
          <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🌸</span> {{ isZh ? 'CSS 动画' : 'CSS Animation' }}
            <span class="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '扩展：花瓣效果' : 'Extension: Petal Effect' }}</span>
          </h2>
          <LabCssAnimation :lang="lang" />
        </section>

        <!-- Section: Browser Pipeline -->
        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧠</span> {{ isZh ? '浏览器渲染流水线' : 'Rendering Pipeline' }}
          </h2>
          <LabBrowserPipeline :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已经理解了网页的基本结构与样式！接下来深入学习 JavaScript。' : 'You understand web structure and styling! Next, dive into JavaScript.'"
          @next="activeTab = 'note2-javascript'"
        />
      </div>

      <!-- Note 2: JavaScript -->
      <div v-else-if="activeTab === 'note2-javascript'" class="space-y-12 animate-fade-in">
        
        <!-- Introduction Text -->
        <div class="max-w-3xl mx-auto px-4">
          <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-100 dark:border-yellow-800/30">
            <h3 class="font-bold text-yellow-800 dark:text-yellow-200 mb-2">📚 {{ isZh ? '学习路线' : 'Learning Path' }}</h3>
            <p class="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
              {{ isZh 
                ? 'JavaScript 是网页的「大脑」，负责处理用户交互、数据操作和动态更新。我们将从变量、函数等基础语法开始，逐步深入到 DOM 操作和异步编程。掌握 JS 是学习 Vue 的前提。' 
                : 'JavaScript is the "brain" of web pages, handling user interactions, data operations, and dynamic updates. We start from variables and functions, then advance to DOM manipulation and async programming. Mastering JS is prerequisite for learning Vue.'
              }}
            </p>
          </div>
        </div>

        <!-- JS Basics -->
        <section>
          <LabJsBasics :lang="lang" />
        </section>

        <!-- JS Core Mechanics -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
              💡 {{ isZh ? '变量和函数是编程的基础。理解作用域、闭包等核心概念，能帮助你写出更健壮的代码。' : 'Variables and functions are programming fundamentals. Understanding scope and closures helps write more robust code.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ isZh ? 'JavaScript 核心机制' : 'JavaScript Core Mechanics' }}
          </h2>
          <LabJs :lang="lang" />
        </section>

        <!-- DOM -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? 'DOM（文档对象模型）是 JS 与 HTML 的桥梁。通过 DOM API，我们可以动态修改页面内容、样式和结构。Vue 的响应式系统正是基于 DOM 操作实现的。' : 'DOM (Document Object Model) bridges JS and HTML. Through DOM APIs, we can dynamically modify page content, styles, and structure. Vue\'s reactivity is built on DOM manipulation.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
          </h2>
          <LabDom :lang="lang" />
        </section>

        <!-- Closures & Scope -->
        <section>
          <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧠</span> {{ isZh ? '闭包与作用域' : 'Closures & Scope' }}
            <span class="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '扩展' : 'Extension' }}</span>
          </h2>
          <LabJsAdvanced :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '🎉 你已掌握 JavaScript 核心！接下来学习 Vue 3 框架基础。' : '🎉 You\'ve mastered JavaScript core! Next, learn Vue 3 framework basics.'"
          @next="activeTab = 'note3-vue-basics'"
        />
      </div>

      <!-- Note 3: Vue Basics -->
      <div v-else-if="activeTab === 'note3-vue-basics'" class="space-y-12 animate-fade-in">
        
        <!-- Introduction Text -->
        <div class="max-w-3xl mx-auto px-4">
          <div class="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
            <h3 class="font-bold text-green-800 dark:text-green-200 mb-2">📚 {{ isZh ? '学习路线' : 'Learning Path' }}</h3>
            <p class="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              {{ isZh 
                ? 'Vue 3 是现代前端框架的代表，核心概念包括：响应式系统（ref/reactive）、模板指令（v-if/v-for）、组件化开发。本节从项目导览开始，逐步体验 Vue 的核心特性。' 
                : 'Vue 3 represents modern frontend frameworks. Core concepts include: reactivity (ref/reactive), template directives (v-if/v-for), and component-based development. This section starts with a project tour.'
              }}
            </p>
          </div>
        </div>

        <!-- Project Tour -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-sakura-400">
              💡 {{ isZh ? '先从宏观角度了解这个博客项目的结构，看看 Vue 项目是如何组织代码的。' : 'First, get a macro view of this blog project\'s structure and how Vue projects organize code.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-sakura-600 dark:text-sakura-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧭</span> {{ isZh ? '项目实战导览' : 'Project Tour' }}
          </h2>
          <LabProjectTour :lang="lang" />
        </section>

        <!-- Reactivity -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-purple-400">
              💡 {{ isZh ? 'ref() 和 reactive() 是 Vue 3 响应式的核心。数据变化时，视图会自动更新，这是「声明式」编程的魅力。' : 'ref() and reactive() are Vue 3 reactivity core. Views auto-update when data changes - that\'s the power of declarative programming.' }}
            </p>
          </div>
           <h2 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
             <span class="text-2xl">🧪</span> {{ t.lab_reactivity }}
           </h2>
           <LabReactivity :lang="lang" />
        </section>

        <!-- Directives & Class Binding -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">👁️</span> {{ t.lab_directives }}
            </h2>
            <LabDirectives :lang="lang" />
          </section>

          <section>
              <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">💅</span> {{ t.lab_class_title }}
              </h2>
              <LabClassStyle :lang="lang" />
          </section>
        </div>

        <!-- Event Handling -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? 'Vue 用 @click、@input 等语法糖简化事件绑定，比原生 addEventListener 更直观。' : 'Vue uses @click, @input syntax sugar to simplify event binding, more intuitive than native addEventListener.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🖱️</span> {{ isZh ? '事件处理' : 'Event Handling' }}
          </h2>
          <LabEventHandling :lang="lang" />
        </section>

        <!-- List Rendering -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-teal-400">
              💡 {{ isZh ? 'v-for 用于循环渲染列表，v-if 用于条件渲染。注意：v-for 需要 :key 属性来优化 DOM 更新。' : 'v-for renders lists, v-if for conditional rendering. Note: v-for needs :key for optimized DOM updates.' }}
            </p>
          </div>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📋</span> {{ t.lab_vue_list_title }}
            </h2>
            <LabVueList :lang="lang" />
        </section>

        <!-- Ajax -->
        <section class="max-w-4xl mx-auto">
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
            <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
          </h2>
          <LabAjax :lang="lang" />
        </section>

        <!-- Async Programming -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
              💡 {{ isZh ? 'Promise 和 async/await 是处理异步操作的核心。理解它们对于处理 API 请求、文件读取等场景至关重要。' : 'Promise and async/await are core for async operations. Understanding them is crucial for API requests, file reading, etc.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ isZh ? '异步编程' : 'Async Programming' }}
            <span class="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 px-2 py-0.5 rounded-full ml-2">Promise & async/await</span>
          </h2>
          <LabAsync :lang="lang" />

        </section>

        <!-- Lifecycle -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? '组件有「生命周期」：创建→挂载→更新→销毁。onMounted 是最常用的钩子，用于组件挂载后执行初始化逻辑。' : 'Components have lifecycle: create → mount → update → unmount. onMounted is the most common hook for initialization after mounting.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎢</span> {{ t.lab_lifecycle }}
          </h2>
          <LabLifecycle :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '🎉 你已掌握 Vue 3 核心！接下来学习 Vue 工程化与 TypeScript。' : '🎉 You\'ve mastered Vue 3 core! Next, learn Vue Engineering and TypeScript.'"
          @next="activeTab = 'note4-vue-engineering'"
        />
      </div>

      <!-- Note 4: Vue Engineering & TS -->
      <div v-else-if="activeTab === 'note4-vue-engineering'" class="space-y-12 animate-fade-in">
        
        <!-- Introduction Text -->
        <div class="max-w-3xl mx-auto px-4">
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30">
            <h3 class="font-bold text-purple-800 dark:text-purple-200 mb-2">📚 {{ isZh ? '学习路线' : 'Learning Path' }}</h3>
            <p class="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
              {{ isZh 
                ? '工程化是大型项目的基石：TypeScript 提供类型安全，NPM 管理依赖，Vite 负责构建，Pinia 处理全局状态，组件通信则是 Vue 应用的神经系统。掌握这些，你就能驾驭真实项目。' 
                : 'Engineering is the foundation of large projects: TypeScript for type safety, NPM for dependencies, Vite for building, Pinia for global state, and component communication as the nervous system. Master these to handle real projects.'
              }}
            </p>
          </div>
        </div>

        <!-- TypeScript -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? 'TypeScript 是 JavaScript 的超集，添加了类型系统。类型检查能在编译时发现错误，提高代码质量。' : 'TypeScript is a superset of JavaScript with a type system. Type checking catches errors at compile time, improving code quality.' }}
            </p>
          </div>
          <LabTypeScript :lang="lang" />
        </section>

        <!-- Module System -->
        <section>
          <LabModuleSystem :lang="lang" />
        </section>

        <!-- NPM -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-red-400">
              💡 {{ isZh ? 'NPM 是 Node.js 的包管理器，package.json 定义项目依赖。理解 npm install、npm run dev 等命令是必备技能。' : 'NPM is Node.js package manager, package.json defines dependencies. Understanding npm install, npm run dev commands is essential.' }}
            </p>
          </div>
          <LabNpm :lang="lang" />
        </section>

        <!-- Build Tools -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
              💡 {{ isZh ? 'Vite 是新一代构建工具，开发时使用原生 ES 模块实现极速热更新，生产环境使用 Rollup 打包优化。' : 'Vite is next-gen build tool, using native ES modules for blazing-fast HMR in dev, Rollup for optimized production builds.' }}
            </p>
          </div>
          <LabBuildTools :lang="lang" />
        </section>

        <!-- Tailwind & CSS Frameworks -->
        <section>
          <LabTailwind :lang="lang" />
        </section>

        <section>
          <LabCssFrameworks :lang="lang" />
        </section>

        <!-- Props & Emit -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-indigo-400">
              💡 {{ isZh ? 'Props 是父→子单向数据流，Emit 是子→父事件通信。这是 Vue 组件通信的基础模式。' : 'Props are parent→child one-way data flow, Emit is child→parent event communication. This is the basic Vue component communication pattern.' }}
            </p>
          </div>
            <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📡</span> {{ t.lab_props_title }}
            </h2>
            <LabPropsEmit :lang="lang" />
        </section>

        <!-- Slot System -->
        <section>
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎁</span> {{ isZh ? '插槽系统' : 'Slot System' }}
          </h2>
          <LabSlot :lang="lang" />
        </section>

        <!-- Composables -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-green-400">
              💡 {{ isZh ? 'Composables 是 Vue 3 的逻辑复用方案，类似 React Hooks。把可复用逻辑封装成 use* 函数，多个组件共享。' : 'Composables are Vue 3\'s logic reuse pattern, similar to React Hooks. Encapsulate reusable logic into use* functions shared across components.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧩</span> {{ isZh ? 'Composables 组合式函数' : 'Composables' }}
            <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '本站源码剖析' : 'Site Code Analysis' }}</span>
          </h2>
          <LabComposables :lang="lang" />
        </section>

        <!-- Pinia -->
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-indigo-400">
              💡 {{ isZh ? 'Pinia 是 Vue 官方推荐的状态管理库，替代 Vuex。用于管理跨组件共享的全局状态，如用户信息、主题设置等。' : 'Pinia is Vue\'s official state management library, replacing Vuex. For managing global state shared across components, like user info, theme settings.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🍍</span> {{ isZh ? 'Pinia 状态管理' : 'Pinia State Management' }}
            <span class="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '本站源码剖析' : 'Site Code Analysis' }}</span>
          </h2>
          <LabPinia :lang="lang" />
        </section>

        <!-- Provide/Inject -->
        <section>
          <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">💉</span> {{ isZh ? '依赖注入' : 'Dependency Injection' }}
            <span class="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '扩展' : 'Extension' }}</span>
          </h2>
          <LabProvideInject :lang="lang" />
        </section>

        <!-- CSS Performance -->
        <section>
          <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧩</span> {{ isZh ? 'CSS 性能与渲染成本' : 'CSS Performance' }}
            <span class="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '扩展' : 'Extension' }}</span>
          </h2>
          <LabCssPerformance :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '🎉 恭喜完成全部学习！来挑战测验，检验你的综合能力吧！' : '🎉 Congratulations! Take the challenge quiz to test your skills!'"
          :button-text="isZh ? '进入挑战赛 🏆' : 'Take the Challenge 🏆'"
          @next="activeTab = 'challenge'"
        />
      </div>

      <!-- Challenge -->
      <div v-else-if="activeTab === 'challenge'" class="animate-fade-in space-y-12">
        
        <!-- Introduction Text -->
        <div class="max-w-3xl mx-auto px-4">
          <div class="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800/30">
            <h3 class="font-bold text-orange-800 dark:text-orange-200 mb-2">🏆 {{ isZh ? '挑战赛' : 'Challenge' }}</h3>
            <p class="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
              {{ isZh 
                ? '恭喜你完成了所有学习内容！现在是检验成果的时刻。通过测验检测知识掌握程度，通过迷你项目锻炼实战能力。准备好了吗？' 
                : 'Congratulations on completing all learning content! Now it\'s time to test your skills. Quiz tests knowledge, mini projects build practical ability. Ready?'
              }}
            </p>
          </div>
        </div>

         <section class="max-w-3xl mx-auto">
           <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2 justify-center">
             <span class="text-2xl">🥷</span> {{ t.lab_quiz }}
           </h2>
           <LabQuizGame :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
              💡 {{ isZh ? '最好的学习方式是动手实践。尝试完成这些迷你项目，把学到的知识转化为实际技能。' : 'The best way to learn is hands-on practice. Try completing these mini projects to turn knowledge into practical skills.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🏆</span> {{ isZh ? '迷你项目挑战' : 'Mini Project Challenge' }}
            <span class="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '综合实战' : 'Hands-on Practice' }}</span>
          </h2>
          <LabMiniProject :lang="lang" />
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { I18N } from '../../constants'

// Stage 1: Foundation
import LabCodeEvolution from './stage1-foundation/LabCodeEvolution.vue'
import LabHtml from './stage1-foundation/LabHtml.vue'
import LabHtmlBasics from './stage1-foundation/LabHtmlBasics.vue'
import LabBrowserPipeline from './stage1-foundation/LabBrowserPipeline.vue'

// Stage 2: JS Basics
import LabJsBasics from './stage2-js-basics/LabJsBasics.vue'

// Stage 3: CSS
import LabCssBasics from './stage3-css/LabCssBasics.vue'
import LabCssLayout from './stage3-css/LabCssLayout.vue'
import LabCssAnimation from './stage3-css/LabCssAnimation.vue'
import LabCssPerformance from './stage3-css/LabCssPerformance.vue'

// Stage 4: JS Advanced
import LabJs from './stage4-js-advanced/LabJs.vue'
import LabDom from './stage4-js-advanced/LabDom.vue'
import LabAjax from './stage4-js-advanced/LabAjax.vue'
import LabAsync from './stage4-js-advanced/LabAsync.vue'
import LabJsAdvanced from './stage4-js-advanced/LabJsAdvanced.vue'
import LabTypeScript from './stage4-js-advanced/LabTypeScript.vue'

// Stage 5: Engineering
import LabModuleSystem from './stage5-engineering/LabModuleSystem.vue'
import LabNpm from './stage5-engineering/LabNpm.vue'
import LabBuildTools from './stage5-engineering/LabBuildTools.vue'
import LabTailwind from './stage5-engineering/LabTailwind.vue'
import LabCssFrameworks from './stage5-engineering/LabCssFrameworks.vue'

// Stage 6: Vue Core
import LabReactivity from './stage6-vue-core/LabReactivity.vue'
import LabDirectives from './stage6-vue-core/LabDirectives.vue'
import LabClassStyle from './stage6-vue-core/LabClassStyle.vue'
import LabEventHandling from './stage6-vue-core/LabEventHandling.vue'
import LabVueList from './stage6-vue-core/LabVueList.vue'
import LabLifecycle from './stage6-vue-core/LabLifecycle.vue'
import LabProjectTour from './LabProjectTour.vue'

// Stage 7: Vue Advanced
import LabPropsEmit from './stage7-vue-advanced/LabPropsEmit.vue'
import LabSlot from './stage7-vue-advanced/LabSlot.vue'
import LabComposables from './stage7-vue-advanced/LabComposables.vue'
import LabPinia from './stage7-vue-advanced/LabPinia.vue'
import LabProvideInject from './stage7-vue-advanced/LabProvideInject.vue'

// Stage 8: Challenge
import LabQuizGame from './stage8-challenge/LabQuizGame.vue'
import LabMiniProject from './stage8-challenge/LabMiniProject.vue'

// Helper component for next stage navigation
const NextStageGuide = {
  props: {
    isZh: Boolean,
    nextText: String,
    buttonText: String
  },
  emits: ['next'],
  template: `
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-2xl mx-auto text-center">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          {{ isZh ? '🎉 完成本阶段后' : '🎉 After this stage' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">{{ nextText }}</p>
        <button 
          @click="$emit('next')"
          class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
        >
          {{ buttonText || (isZh ? '进入下一阶段 →' : 'Next Stage →') }}
        </button>
      </div>
    </div>
  `
}

const props = defineProps<{
  lang: 'en' | 'zh'
  initialTab?: string
  modelValue?: string // v-model support for external tab control
}>()

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
  (e: 'update:modelValue', tab: string): void
}>()

const t = computed(() => I18N[props.lang as 'en' | 'zh'])
const isZh = computed(() => props.lang === 'zh')

const activeTab = ref('note1-html-css')
const labTabStorageKey = computed(() => `lab_active_tab_${props.lang}`)

type LabTab = {
  id: string
  label: string
  shortLabel: string
  icon: string
  noteNum: number
  desc: string
  goal: string
  noteLink: string
  relatedCode: string
}

// 5 Learning Stages aligned with Notes 1-4 + Challenge
const tabs = computed<LabTab[]>(() => [
  { 
    id: 'note1-html-css', 
    label: isZh.value ? 'HTML & CSS 基础' : 'HTML & CSS Basics', 
    shortLabel: isZh.value ? 'HTML/CSS' : 'HTML/CSS',
    icon: '🎨',
    noteNum: 1,
    desc: isZh.value ? 'Web标准三剑客：HTML结构、CSS样式、JS行为' : 'Web Standards: HTML Structure, CSS Style, JS Behavior',
    goal: isZh.value ? '理解网页的组成结构与基本样式' : 'Understand web page structure and basic styling',
    noteLink: '/notes/VUE学习笔记/1、HTML-CSS.md',
    relatedCode: 'index.html, App.vue, styles'
  },
  { 
    id: 'note2-javascript', 
    label: isZh.value ? 'JavaScript 核心' : 'JavaScript Core', 
    shortLabel: 'JavaScript',
    icon: '⚡',
    noteNum: 2,
    desc: isZh.value ? '引入方式、基础语法、DOM操作、事件、对象、函数' : 'Syntax, Variables, Functions, DOM, Events, Objects',
    goal: isZh.value ? '掌握 JavaScript 核心语法与DOM操作' : 'Master JavaScript core syntax and DOM manipulation',
    noteLink: '/notes/VUE学习笔记/2、JavaScript.md',
    relatedCode: 'useSearch.ts, useFile.ts, appStore.ts'
  },
  { 
    id: 'note3-vue-basics', 
    label: isZh.value ? 'Vue 3 基础' : 'Vue 3 Basics', 
    shortLabel: 'Vue基础',
    icon: '🥝',
    noteNum: 3,
    desc: isZh.value ? 'Vue概述、指令系统、Ajax、生命周期' : 'Vue Overview, Directives, Ajax, Lifecycle',
    goal: isZh.value ? '掌握 Vue 3 核心概念与指令' : 'Master Vue 3 core concepts and directives',
    noteLink: '/notes/VUE学习笔记/3、Vue基础.md',
    relatedCode: 'App.vue, FileTree.vue, composables/*.ts'
  },
  { 
    id: 'note4-vue-engineering', 
    label: isZh.value ? 'Vue 工程化 & TS' : 'Vue Engineering & TS', 
    shortLabel: isZh.value ? '工程化' : 'Engineering',
    icon: '🚀',
    noteNum: 4,
    desc: isZh.value ? 'Vue工程化、TypeScript、ElementPlus' : 'Vue Engineering, TypeScript, ElementPlus',
    goal: isZh.value ? '构建专业的 Vue 项目架构' : 'Build professional Vue project architecture',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'vite.config.ts, tsconfig.json, stores/*.ts'
  },
  { 
    id: 'challenge', 
    label: isZh.value ? '综合挑战' : 'Challenge', 
    shortLabel: isZh.value ? '挑战' : 'Challenge',
    icon: '🏆',
    noteNum: 0,
    desc: isZh.value ? '综合测验与迷你项目' : 'Quiz & Mini Projects',
    goal: isZh.value ? '检验综合能力' : 'Test your skills',
    noteLink: '',
    relatedCode: isZh.value ? '综合应用' : 'Comprehensive'
  },
])

const activeTabInfo = computed<LabTab | undefined>(() => tabs.value.find((tab: LabTab) => tab.id === activeTab.value))
const activeTabIndex = computed(() => tabs.value.findIndex((tab: LabTab) => tab.id === activeTab.value))

onMounted(() => {
  const saved = localStorage.getItem(labTabStorageKey.value)
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved
  }
})

watch(
  () => props.initialTab,
  (val) => {
    if (val && tabs.value.some((tab: LabTab) => tab.id === val)) {
      activeTab.value = val
    }
  },
  { immediate: true }
)

// Sync with v-model
watch(() => props.modelValue, (val) => {
  if (val && tabs.value.some((tab: LabTab) => tab.id === val)) {
    activeTab.value = val
  }
}, { immediate: true })

watch(activeTab, (val: string) => {
  localStorage.setItem(labTabStorageKey.value, val)
  emit('tab-change', val)
  emit('update:modelValue', val)
})

watch(() => props.lang, () => {
  const saved = localStorage.getItem(labTabStorageKey.value)
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved
  }
})

// Web Standards State
const standards = reactive({
  html: true,
  css: false,
  js: false
})

// Expose tabs for sidebar
defineExpose({
  tabs,
  activeTab
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Section entrance animation */
section {
  animation: sectionFade 0.6s ease-out;
  animation-fill-mode: both;
}

section:nth-child(1) { animation-delay: 0.1s; }
section:nth-child(2) { animation-delay: 0.2s; }
section:nth-child(3) { animation-delay: 0.3s; }
section:nth-child(4) { animation-delay: 0.4s; }
section:nth-child(5) { animation-delay: 0.5s; }
section:nth-child(6) { animation-delay: 0.6s; }

@keyframes sectionFade {
  from { 
    opacity: 0; 
    transform: translateY(40px) scale(0.98);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

/* Smooth transition between stages */
.space-y-12 > * {
  transition: all 0.3s ease;
}
</style>
