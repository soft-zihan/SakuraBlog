
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ t.lab_html_info }}</p>
      
      <!-- View Mode Toggle -->
      <div class="bg-indigo-50 dark:bg-gray-900 p-1 rounded-lg flex gap-1 flex-shrink-0">
         <button 
           @click="debugMode = true"
           class="px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1"
           :class="debugMode ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
         >
           <span>📐</span> {{ t.lab_html_debug }}
         </button>
         <button 
           @click="debugMode = false"
           class="px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1"
           :class="!debugMode ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
         >
           <span>👁️</span> {{ t.lab_html_preview }}
         </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Editor -->
      <div class="flex flex-col h-full min-h-[300px]">
        <div class="bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold flex justify-between items-center">
          <span>HTML Input</span>
          <span class="text-[10px] bg-gray-700 px-2 py-0.5 rounded">Editable</span>
        </div>
        <textarea 
          v-model="htmlCode" 
          class="w-full flex-1 bg-[#1e1e1e] text-blue-300 p-4 font-mono text-sm focus:outline-none resize-none rounded-b-lg shadow-inner custom-scrollbar leading-relaxed"
          spellcheck="false"
        ></textarea>
        
        <div class="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
           <button @click="setTemplate('nested')" class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded hover:bg-indigo-100 transition-colors whitespace-nowrap">Nested Divs</button>
           <button @click="setTemplate('list')" class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded hover:bg-indigo-100 transition-colors whitespace-nowrap">List & Button</button>
           <button @click="setTemplate('card')" class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded hover:bg-indigo-100 transition-colors whitespace-nowrap">User Card</button>
           <button @click="setTemplate('flex')" class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded hover:bg-indigo-100 transition-colors whitespace-nowrap">Flex Layout</button>
        </div>
      </div>

      <!-- Preview -->
      <div class="flex flex-col h-full min-h-[300px]">
         <div class="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold border border-b-0 border-gray-200 dark:border-gray-600 flex justify-between">
          <span>{{ debugMode ? t.lab_html_debug : t.lab_html_preview }}</span>
        </div>
        <div class="relative flex-1 bg-white dark:bg-gray-800 p-4 rounded-b-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
           <!-- Rendered Content with Scoped Styles -->
           <div 
             class="html-visualizer-sandbox h-full w-full overflow-auto custom-scrollbar" 
             :class="{'debug-mode': debugMode}"
             v-html="htmlCode"
           ></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);
const debugMode = ref(true);

const templates = {
  nested: `<div class="p-4">
  Parent Div
  <div class="m-4 p-4">
    Child Div
    <div class="m-4 p-4">
      Grandchild
    </div>
  </div>
</div>`,
  list: `<h3>My Todo List</h3>
<ul>
  <li>Learn HTML</li>
  <li>
    <span>Learn CSS</span>
    <button>Done</button>
  </li>
  <li>Learn Vue</li>
</ul>`,
  card: `<div style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #eee; border-radius: 8px;">
  <img src="https://ui-avatars.com/api/?name=Vue&background=random" width="50" style="border-radius: 50%;" />
  <div>
    <h4 style="margin: 0;">User Card</h4>
    <p style="margin: 0; color: #888;">This is a description.</p>
  </div>
</div>`,
  flex: `<div style="display: flex; gap: 10px; height: 100%;">
  <div style="flex: 1; background: #f0f9ff; padding: 10px;">Sidebar</div>
  <div style="flex: 2; background: #fff0f5; padding: 10px;">
     <h2>Main Content</h2>
     <p>Flexbox makes layout easy!</p>
  </div>
</div>`
};

const htmlCode = ref(templates.nested);

const setTemplate = (key: keyof typeof templates) => {
  htmlCode.value = templates[key];
};
</script>

<style scoped>
/* 
  Debug Mode Styles using :deep() to penetrate v-html content
*/
.html-visualizer-sandbox.debug-mode :deep(*) {
  border: 2px dashed rgba(99, 102, 241, 0.4) !important; /* Indigo */
  margin: 5px !important;
  padding: 5px !important;
  border-radius: 4px;
  background-color: rgba(99, 102, 241, 0.05);
  transition: all 0.3s;
}

.html-visualizer-sandbox.debug-mode :deep(*:hover) {
  border-color: #f43f72 !important; /* Sakura */
  background-color: rgba(244, 63, 114, 0.1);
  cursor: default;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Default Styles to make unstyled HTML look decent in Preview Mode */
.html-visualizer-sandbox :deep(h3), .html-visualizer-sandbox :deep(h4), .html-visualizer-sandbox :deep(h2) {
  font-weight: bold;
  margin-bottom: 0.5em;
}
.html-visualizer-sandbox :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5em;
}
.html-visualizer-sandbox :deep(button) {
  background: #f43f72;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 5px;
  font-size: 0.8em;
  cursor: pointer;
}
</style>