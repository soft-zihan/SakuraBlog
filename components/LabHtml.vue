<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ t.lab_html_info }}</p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Editor -->
      <div class="flex flex-col h-full">
        <div class="bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold flex justify-between">
          <span>HTML Input</span>
          <span class="text-gray-500">Editable</span>
        </div>
        <textarea 
          v-model="htmlCode" 
          class="w-full h-64 bg-[#1e1e1e] text-blue-300 p-4 font-mono text-sm focus:outline-none resize-none rounded-b-lg shadow-inner custom-scrollbar leading-relaxed"
          spellcheck="false"
        ></textarea>
        
        <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
           <button @click="setTemplate('nested')" class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs rounded hover:bg-indigo-100 transition-colors whitespace-nowrap">Nested Divs</button>
           <button @click="setTemplate('list')" class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs rounded hover:bg-indigo-100 transition-colors whitespace-nowrap">List & Button</button>
           <button @click="setTemplate('card')" class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs rounded hover:bg-indigo-100 transition-colors whitespace-nowrap">Card Component</button>
        </div>
      </div>

      <!-- Preview -->
      <div class="flex flex-col h-full">
         <div class="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold border border-b-0 border-gray-200 dark:border-gray-600">
          Live Render (Box Model Visualized)
        </div>
        <div class="relative flex-1 bg-white dark:bg-white p-4 rounded-b-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
           <!-- Rendered Content with Scoped Styles -->
           <div class="html-visualizer-sandbox h-full w-full overflow-auto" v-html="htmlCode"></div>
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
  card: `<div class="card">
  <img src="https://ui-avatars.com/api/?name=Vue&background=random" width="50" />
  <div class="content">
    <h4>User Card</h4>
    <p>This is a description.</p>
  </div>
</div>`
};

const htmlCode = ref(templates.nested);

const setTemplate = (key: keyof typeof templates) => {
  htmlCode.value = templates[key];
};
</script>

<style>
/* 
  Inject styles globally but specific to the sandbox class 
  to visualize the box model without affecting the rest of the app 
*/
.html-visualizer-sandbox * {
  border: 2px dashed rgba(99, 102, 241, 0.5) !important; /* Indigo */
  margin: 5px !important;
  padding: 5px !important;
  border-radius: 4px;
  background-color: rgba(99, 102, 241, 0.05);
  transition: all 0.3s;
}

.html-visualizer-sandbox *:hover {
  border-color: #f43f72 !important; /* Sakura */
  background-color: rgba(244, 63, 114, 0.1);
  cursor: default;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Reset specific elements that shouldn't look like boxes if empty */
.html-visualizer-sandbox br { border: none !important; margin: 0 !important; padding: 0 !important; }
</style>