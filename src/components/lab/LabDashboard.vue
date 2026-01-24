<template>
  <div class="space-y-8">
    <!-- Stage Info Banner (simplified, no header/tabs) -->
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-gradient-to-r from-[var(--primary-50)] to-purple-50 dark:from-[var(--primary-900)]/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 border border-[var(--primary-100)] dark:border-[var(--primary-800)]/30">
        <div class="flex items-start gap-4">
          <div class="text-4xl">{{ activeTabInfo?.icon }}</div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">
              {{ activeTabInfo?.noteNum ? (isZh ? `笔记${activeTabInfo?.noteNum}：` : `Note ${activeTabInfo?.noteNum}: `) : '' }}
              {{ activeTabInfo?.label }}
            </h3>
            <p class="text-sm text-[var(--primary-600)] dark:text-[var(--primary-400)] mt-1">
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

    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white/90 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <div class="flex items-center justify-between gap-3 mb-4">
            <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <span class="text-base">📈</span> {{ isZh ? '学习进度' : 'Learning Progress' }}
            </h3>
            <div class="flex items-center gap-2">
              <button
                v-if="activeStageId"
                @click="completeCurrentStage"
                class="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white transition-colors"
              >
                {{ isZh ? '完成本阶段' : 'Complete Stage' }}
              </button>
              <button
                @click="resetLearningProgress"
                class="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                {{ isZh ? '重置' : 'Reset' }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-2xl font-extrabold text-[var(--primary-600)] dark:text-[var(--primary-300)] w-16 text-right">
              {{ learningStore.overallProgress.percent }}%
            </div>
            <div class="flex-1 min-w-0">
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-[var(--primary-500)] rounded-full transition-all duration-500"
                  :style="{ width: `${learningStore.overallProgress.percent}%` }"
                ></div>
              </div>
              <div class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                {{ learningStore.overallProgress.completed }} / {{ learningStore.overallProgress.total }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div
              v-for="p in stageProgressItems"
              :key="p.stageId"
              class="p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/20"
            >
              <div class="flex items-center justify-between text-xs">
                <div class="font-bold text-gray-700 dark:text-gray-200">
                  {{ p.label }}
                </div>
                <div class="font-mono text-gray-500 dark:text-gray-400">
                  {{ p.percent }}%
                </div>
              </div>
              <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-[var(--primary-500)] rounded-full transition-all duration-500" :style="{ width: `${p.percent}%` }"></div>
              </div>
            </div>
          </div>

          <div v-if="learningStore.nextRecommendedLab" class="mt-4 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white/70 dark:bg-gray-900/10">
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {{ isZh ? '下一推荐' : 'Next Recommended' }}
            </div>
            <div class="text-sm font-bold text-gray-700 dark:text-gray-200 mt-1">
              {{ isZh ? learningStore.nextRecommendedLab.nameZh : learningStore.nextRecommendedLab.name }}
            </div>
          </div>
        </div>

        <div class="bg-white/90 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3">
            <span class="text-base">🧭</span> {{ isZh ? '技能雷达' : 'Skill Radar' }}
          </h3>
          <SkillRadar :skills="skillRadarItems" :size="240" />
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[500px] transition-all duration-500">

      <!-- Project Builder -->
      <div v-if="activeTab === 'project-builder'" class="animate-fade-in">
        <LabProjectBuilder />
      </div>

      <!-- Stage 1: HTML & CSS -->
      <div v-else-if="activeTab === 'foundation'" class="space-y-12 animate-fade-in">
        <!-- Standards Interactive -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-[var(--primary-100)] dark:border-gray-700 shadow-xl relative overflow-hidden">
             <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>
             
             <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_standards_title }}</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t.lab_standards_desc }}</p>
             </div>

             <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div class="w-48 h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative transition-all duration-500" :class="{'border-[var(--primary-400)] dark:border-[var(--primary-500)] shadow-lg shadow-[var(--primary-500)]/20': standards.css}">
                    <div v-if="standards.css" class="absolute inset-2 bg-gradient-to-br from-[var(--primary-100)] to-purple-100 dark:from-[var(--primary-900)]/50 dark:to-purple-900/50 rounded-xl transition-all duration-500 animate-fade-in"></div>
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
          <LabHtmlSemantic :lang="lang" />
        </section>

        <section>
          <LabHtmlBasics :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已经理解了网页的基本结构与样式！接下来深入学习 JavaScript。' : 'You understand web structure and styling! Next, dive into JavaScript.'"
          @next="activeTab = 'js-basics'"
        />
      </div>

      <!-- Stage 2: JS Core -->
      <div v-else-if="activeTab === 'js-basics'" class="space-y-12 animate-fade-in">
        <section>
          <LabJsBasics :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '掌握了 JS 核心，接下来我们来看看现代 CSS 布局。' : 'Mastered JS Core? Next let\'s check out modern CSS layout.'"
          @next="activeTab = 'css-layout'"
        />
      </div>

      <!-- Stage 3: CSS Layout -->
      <div v-else-if="activeTab === 'css-layout'" class="space-y-12 animate-fade-in">
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? 'CSS 负责「穿衣打扮」。通过选择器、属性值的组合，我们可以精确控制每个元素的外观。' : 'CSS handles the "styling". Through selectors and property values, we can precisely control each element\'s appearance.' }}
            </p>
          </div>
          <LabCssBasics :lang="lang" />
        </section>

        <section>
          <LabCssLayout :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '布局搞定！现在进入 TypeScript 和异步编程的世界。' : 'Layout done! Now enter the world of TypeScript and Async.' "
          @next="activeTab = 'js-advanced'"
        />
      </div>

      <!-- Stage 4: TS & Async -->
      <div v-else-if="activeTab === 'js-advanced'" class="space-y-12 animate-fade-in">
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

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? 'DOM（文档对象模型）是 JS 与 HTML 的桥梁。通过 DOM API，我们可以动态修改页面内容、样式和结构。' : 'DOM bridges JS and HTML. Through DOM APIs, we can dynamically modify page content, styles, and structure.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
          </h2>
          <LabDom :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧠</span> {{ isZh ? '闭包与作用域' : 'Closures & Scope' }}
          </h2>
          <LabJsAdvanced :lang="lang" />
        </section>

        <section>
          <LabEventLoop />
        </section>

        <section class="max-w-4xl mx-auto">
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
            <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
          </h2>
          <LabAjax :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
              💡 {{ isZh ? 'Promise 和 async/await 是处理异步操作的核心。' : 'Promise and async/await are core for async operations.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ isZh ? '异步编程' : 'Async Programming' }}
          </h2>
          <LabAsync :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? 'TypeScript 是 JavaScript 的超集，添加了类型系统。' : 'TypeScript is a superset of JavaScript with a type system.' }}
            </p>
          </div>
          <LabTypeScript :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          @next="activeTab = 'engineering'"
        />
      </div>

      <!-- Stage 5: Engineering -->
      <div v-else-if="activeTab === 'engineering'" class="space-y-12 animate-fade-in">
        <section>
          <LabModuleSystem :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-red-400">
              💡 {{ isZh ? 'NPM 是 Node.js 的包管理器。' : 'NPM is Node.js package manager.' }}
            </p>
          </div>
          <LabNpm :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
              💡 {{ isZh ? 'Vite 是新一代构建工具。' : 'Vite is next-gen build tool.' }}
            </p>
          </div>
          <LabBuildTools :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          @next="activeTab = 'vue-core'"
        />
      </div>

      <!-- Stage 6: Vue Core -->
      <div v-else-if="activeTab === 'vue-core'" class="space-y-12 animate-fade-in">
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-sakura-400">
              💡 {{ isZh ? '先从宏观角度了解这个博客项目的结构。' : 'First, get a macro view of this blog project structure.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-sakura-600 dark:text-sakura-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧭</span> {{ isZh ? '项目实战导览' : 'Project Tour' }}
          </h2>
          <LabProjectTour :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-purple-400">
              💡 {{ isZh ? 'ref() 和 reactive() 是 Vue 3 响应式的核心。' : 'ref() and reactive() are Vue 3 reactivity core.' }}
            </p>
          </div>
           <h2 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
             <span class="text-2xl">🧪</span> {{ t.lab_reactivity }}
           </h2>
           <LabReactivity :lang="lang" />
        </section>

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

        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🖱️</span> {{ isZh ? '事件处理' : 'Event Handling' }}
          </h2>
          <LabEventHandling :lang="lang" />
        </section>

        <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📋</span> {{ t.lab_vue_list_title }}
            </h2>
            <LabVueList :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
              💡 {{ isZh ? '组件有「生命周期」：创建→挂载→更新→销毁。' : 'Components have lifecycle: create → mount → update → unmount.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎢</span> {{ t.lab_lifecycle }}
          </h2>
          <LabLifecycle :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          @next="activeTab = 'vue-advanced'"
        />
      </div>

      <!-- Stage 7: Vue Advanced -->
      <div v-else-if="activeTab === 'vue-advanced'" class="space-y-12 animate-fade-in">
        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-indigo-400">
              💡 {{ isZh ? 'Props 是父→子单向数据流，Emit 是子→父事件通信。' : 'Props are parent→child one-way data flow, Emit is child→parent event communication.' }}
            </p>
          </div>
            <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📡</span> {{ t.lab_props_title }}
            </h2>
            <LabPropsEmit :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎁</span> {{ isZh ? '插槽系统' : 'Slot System' }}
          </h2>
          <LabSlot :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-green-400">
              💡 {{ isZh ? 'Composables 是 Vue 3 的逻辑复用方案。' : 'Composables are Vue 3\'s logic reuse pattern.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧩</span> {{ isZh ? 'Composables 组合式函数' : 'Composables' }}
          </h2>
          <LabComposables :lang="lang" />
        </section>

        <section>
          <div class="max-w-3xl mx-auto px-4 mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-indigo-400">
              💡 {{ isZh ? 'Pinia 是 Vue 官方推荐的状态管理库。' : 'Pinia is Vue\'s official state management library.' }}
            </p>
          </div>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🍍</span> {{ isZh ? 'Pinia 状态管理' : 'Pinia State Management' }}
          </h2>
          <LabPinia :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">💉</span> {{ isZh ? '依赖注入' : 'Dependency Injection' }}
          </h2>
          <LabProvideInject :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          @next="activeTab = 'challenge'"
        />
      </div>

      <!-- Stage 8: Challenge -->
      <div v-else-if="activeTab === 'challenge'" class="animate-fade-in space-y-12">
        <div class="max-w-3xl mx-auto px-4">
          <div class="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800/30">
            <h3 class="font-bold text-orange-800 dark:text-orange-200 mb-2">🏆 {{ isZh ? '挑战赛' : 'Challenge' }}</h3>
            <p class="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
              {{ isZh 
                ? '恭喜你完成了所有学习内容！现在是检验成果的时刻。' 
                : 'Congratulations on completing all learning content! Now it\'s time to test your skills.'
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
          <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🏆</span> {{ isZh ? '迷你项目挑战' : 'Mini Project Challenge' }}
          </h2>
          <LabMiniProject :lang="lang" />
        </section>
      </div>

      <div v-else-if="activeTab === 'extensions'" class="animate-fade-in space-y-12">
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-900/40 dark:to-purple-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span class="text-xl">✨</span> {{ isZh ? '扩展实验（可选加餐）' : 'Extensions (Optional)' }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ isZh ? '这些内容不强依赖主线项目，可按需学习与补强。' : 'These labs are optional and can be explored as needed.' }}
            </p>
          </div>
        </div>

        <section>
          <LabCodeEvolution :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧠</span> {{ isZh ? '浏览器渲染流水线' : 'Rendering Pipeline' }}
          </h2>
          <LabBrowserPipeline :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🌸</span> {{ isZh ? 'CSS 动画' : 'CSS Animation' }}
          </h2>
          <LabCssAnimation :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧩</span> {{ isZh ? 'CSS 性能与渲染成本' : 'CSS Performance' }}
          </h2>
          <LabCssPerformance :lang="lang" />
        </section>

        <section>
          <LabTailwind :lang="lang" />
        </section>

        <section>
          <LabCssFrameworks :lang="lang" />
        </section>

        <section>
          <LabTypeScriptAdvanced />
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { I18N } from '../../constants'
import { useLearningStore, LEARNING_STAGES, LABS, type StageId } from '../../stores/learningStore'
import SkillRadar from './SkillRadar.vue'

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
import LabEventLoop from './stage4-js-advanced/LabEventLoop.vue'
import LabTypeScript from './stage4-js-advanced/LabTypeScript.vue'
import LabTypeScriptAdvanced from './stage4-js-advanced/LabTypeScriptAdvanced.vue'

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
import LabProjectBuilder from './LabProjectBuilder.vue'

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
          class="px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-xl font-bold transition-all hover:scale-105"
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

const activeTab = ref('project-builder')
const labTabStorageKey = computed(() => `lab_active_tab_${props.lang}`)

const learningStore = useLearningStore()

const stageMetaById = computed(() => {
  const map: Record<string, { name: string; nameZh: string }> = {}
  for (const s of LEARNING_STAGES) map[s.id] = { name: s.name, nameZh: s.nameZh }
  return map
})

const stageProgressItems = computed(() => {
  return learningStore.stageProgress.map(p => ({
    ...p,
    label: isZh.value ? stageMetaById.value[p.stageId]?.nameZh : stageMetaById.value[p.stageId]?.name
  }))
})

const activeStageId = computed<StageId | null>(() => {
  if (activeTab.value === 'project-builder') return null
  if (LEARNING_STAGES.some(s => s.id === activeTab.value)) return activeTab.value as StageId
  return null
})

const skillRadarItems = computed(() => {
  const byId = new Map(stageProgressItems.value.map(p => [p.stageId, p.percent]))
  const js = Math.round(((byId.get('js-basics') || 0) + (byId.get('js-advanced') || 0)) / 2)
  const vue = Math.round(((byId.get('vue-core') || 0) + (byId.get('vue-advanced') || 0)) / 2)
  const ts = learningStore.completedLabs.includes('LabTypeScript') ? 100 : 0
  return [
    { name: isZh.value ? 'HTML 语义化' : 'HTML Semantics', value: byId.get('foundation') || 0 },
    { name: isZh.value ? 'CSS 布局' : 'CSS Layout', value: byId.get('css-layout') || 0 },
    { name: isZh.value ? 'JS 核心' : 'JS Core', value: js },
    { name: 'TypeScript', value: ts },
    { name: isZh.value ? 'Vue 生态' : 'Vue Ecosystem', value: vue },
    { name: isZh.value ? '工程化' : 'Engineering', value: byId.get('engineering') || 0 }
  ]
})

function completeStage(stageId: StageId) {
  const labsInStage = LABS.filter(l => l.stageId === stageId)
  for (const lab of labsInStage) learningStore.completeLab(lab.id)
}

function completeCurrentStage() {
  if (!activeStageId.value) return
  completeStage(activeStageId.value)
}

function resetLearningProgress() {
  learningStore.resetProgress()
}

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

// 8 Learning Stages + Project Builder
const tabs = computed<LabTab[]>(() => [
  {
    id: 'project-builder',
    label: isZh.value ? '项目构建器' : 'Project Builder',
    shortLabel: isZh.value ? '构建器' : 'Builder',
    icon: '🏗️',
    noteNum: 0,
    desc: isZh.value ? '从零开始构建企业级管理系统' : 'Build an enterprise management system from scratch',
    goal: isZh.value ? '掌握完整项目开发流程' : 'Master the complete project development process',
    noteLink: '',
    relatedCode: 'LabProjectBuilder.vue'
  },
  { 
    id: 'foundation', 
    label: isZh.value ? 'Stage 1: 网页基础' : 'Stage 1: Web Foundation', 
    shortLabel: 'HTML/CSS',
    icon: '🧱',
    noteNum: 1,
    desc: isZh.value ? 'Web标准三剑客：HTML结构、CSS样式' : 'Web Standards: HTML Structure, CSS Style',
    goal: isZh.value ? '理解网页的组成结构与基本样式' : 'Understand web page structure and basic styling',
    noteLink: '/notes/VUE学习笔记/1、HTML-CSS.md',
    relatedCode: 'index.html, App.vue'
  },
  { 
    id: 'js-basics', 
    label: isZh.value ? 'Stage 2: JS 基础' : 'Stage 2: JS Basics', 
    shortLabel: 'JS Core',
    icon: '⚡',
    noteNum: 2,
    desc: isZh.value ? 'JS基础语法、DOM操作、事件处理' : 'JS Syntax, DOM, Events',
    goal: isZh.value ? '掌握 JavaScript 核心语法与DOM操作' : 'Master JavaScript core syntax and DOM manipulation',
    noteLink: '/notes/VUE学习笔记/2、JavaScript.md',
    relatedCode: 'useSearch.ts'
  },
  {
    id: 'css-layout',
    label: isZh.value ? 'Stage 3: CSS 布局' : 'Stage 3: CSS Layout',
    shortLabel: 'CSS Layout',
    icon: '🎨',
    noteNum: 1,
    desc: isZh.value ? 'Flexbox, Grid, 响应式设计, 动画' : 'Flexbox, Grid, Responsive Design, Animation',
    goal: isZh.value ? '精通现代 CSS 布局与动画' : 'Master modern CSS layout and animation',
    noteLink: '/notes/VUE学习笔记/1、HTML-CSS.md',
    relatedCode: 'styles/main.css'
  },
  {
    id: 'js-advanced',
    label: isZh.value ? 'Stage 4: JS 进阶 & TS' : 'Stage 4: JS Advanced & TS',
    shortLabel: 'TS/Async',
    icon: '🛡️',
    noteNum: 4,
    desc: isZh.value ? 'TypeScript类型系统、异步编程、网络请求' : 'TypeScript, Async Programming, Ajax',
    goal: isZh.value ? '掌握 TS 类型安全与异步处理' : 'Master TS type safety and async handling',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'types/*.ts'
  },
  {
    id: 'engineering',
    label: isZh.value ? 'Stage 5: 前端工程化' : 'Stage 5: Engineering',
    shortLabel: 'Engineering',
    icon: '🚀',
    noteNum: 4,
    desc: isZh.value ? 'Vite, NPM, 模块化, Tailwind' : 'Vite, NPM, Modules, Tailwind',
    goal: isZh.value ? '构建专业的前端工程环境' : 'Build professional frontend engineering environment',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'vite.config.ts'
  },
  { 
    id: 'vue-core', 
    label: isZh.value ? 'Stage 6: Vue 核心' : 'Stage 6: Vue Core', 
    shortLabel: 'Vue Core',
    icon: '🥝',
    noteNum: 3,
    desc: isZh.value ? 'Vue概述、响应式、指令、生命周期' : 'Vue Overview, Reactivity, Directives, Lifecycle',
    goal: isZh.value ? '掌握 Vue 3 核心概念与指令' : 'Master Vue 3 core concepts and directives',
    noteLink: '/notes/VUE学习笔记/3、Vue基础.md',
    relatedCode: 'App.vue'
  },
  { 
    id: 'vue-advanced', 
    label: isZh.value ? 'Stage 7: Vue 进阶' : 'Stage 7: Vue Advanced', 
    shortLabel: 'Vue Adv',
    icon: '🧩',
    noteNum: 4,
    desc: isZh.value ? '组件通信、组合式函数、Pinia、插槽' : 'Props/Emit, Composables, Pinia, Slots',
    goal: isZh.value ? '掌握 Vue 高级特性与状态管理' : 'Master Vue advanced features and state management',
    noteLink: '/notes/VUE学习笔记/4、Vue3+TS+ElementPlus.md',
    relatedCode: 'stores/*.ts'
  },
  { 
    id: 'challenge', 
    label: isZh.value ? 'Stage 8: 综合挑战' : 'Stage 8: Challenge', 
    shortLabel: 'Challenge',
    icon: '🏆',
    noteNum: 0,
    desc: isZh.value ? '综合测验与迷你项目' : 'Quiz & Mini Projects',
    goal: isZh.value ? '检验综合能力' : 'Test your skills',
    noteLink: '',
    relatedCode: 'Challenge'
  },
  {
    id: 'extensions',
    label: isZh.value ? '扩展：可选加餐' : 'Extensions: Optional',
    shortLabel: isZh.value ? '扩展' : 'Extensions',
    icon: '✨',
    noteNum: 0,
    desc: isZh.value ? '不强依赖主线项目的补充实验' : 'Optional labs for extra practice',
    goal: isZh.value ? '按需补强与拓展' : 'Learn and reinforce as needed',
    noteLink: '',
    relatedCode: 'Various'
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
