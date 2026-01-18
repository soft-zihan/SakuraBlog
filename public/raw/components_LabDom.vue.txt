
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm backdrop-blur-md h-full flex flex-col">
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ t.lab_dom_desc }}</p>

    <div class="flex flex-col gap-6 flex-1">
      
      <!-- Simulation Box -->
      <div class="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8 relative flex items-center justify-center overflow-hidden">
          <div class="absolute top-2 left-2 text-[10px] text-gray-400 font-mono">Window</div>
          
          <!-- Target Element -->
          <div 
             id="target-box"
             ref="targetBox"
             class="p-6 rounded-xl border-2 transition-all duration-500 text-center shadow-lg"
             :class="boxClass"
             :style="boxStyle"
          >
             {{ boxText }}
          </div>
      </div>

      <!-- Control Panel -->
      <div class="grid grid-cols-2 gap-3">
         
         <!-- Action 1: innerHTML -->
         <button @click="changeText" class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group">
             <div class="text-[10px] text-gray-400 font-mono mb-1">document.querySelector('#box').innerHTML = ...</div>
             <div class="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500">abc {{ t.lab_dom_btn_text }}</div>
         </button>

         <!-- Action 2: Style -->
         <button @click="changeColor" class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left group">
             <div class="text-[10px] text-gray-400 font-mono mb-1">...style.backgroundColor = ...</div>
             <div class="text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-500">🎨 {{ t.lab_dom_btn_color }}</div>
         </button>

         <!-- Action 3: Hide -->
         <button @click="toggleDisplay(false)" class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-500 hover:shadow-md transition-all text-left group">
             <div class="text-[10px] text-gray-400 font-mono mb-1">...style.display = 'none'</div>
             <div class="text-xs font-bold text-red-600 dark:text-red-400 group-hover:text-red-500">👻 {{ t.lab_dom_btn_hide }}</div>
         </button>

         <!-- Action 4: Show -->
         <button @click="toggleDisplay(true)" class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 hover:shadow-md transition-all text-left group">
             <div class="text-[10px] text-gray-400 font-mono mb-1">...style.display = 'block'</div>
             <div class="text-xs font-bold text-green-600 dark:text-green-400 group-hover:text-green-500">👀 {{ t.lab_dom_btn_show }}</div>
         </button>

      </div>

      <!-- Console Log -->
      <div class="bg-[#1e1e1e] rounded-lg p-3 font-mono text-[10px] text-green-400 h-24 overflow-y-auto custom-scrollbar shadow-inner">
         <div class="text-gray-500 border-b border-gray-700 pb-1 mb-1">{{ t.lab_dom_console }}</div>
         <div v-for="(log, i) in logs" :key="i" class="mb-0.5">
            <span class="text-gray-500">></span> {{ log }}
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

const boxText = ref('Target Element (#box)');
const boxStyle = ref({ display: 'block', backgroundColor: '#ffffff' });
const boxClass = ref('border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-200');
const logs = ref<string[]>([]);

const addLog = (msg: string) => {
    logs.value.unshift(msg);
    if (logs.value.length > 20) logs.value.pop();
};

const changeText = () => {
    const texts = ['Hello World', 'JS is Magic', 'Sakura Notes', 'DOM Updated'];
    const random = texts[Math.floor(Math.random() * texts.length)];
    boxText.value = random;
    addLog(`element.innerHTML = "${random}"`);
};

const changeColor = () => {
    const colors = ['#fecdd7', '#bfdbfe', '#bbf7d0', '#fde68a', '#e9d5ff'];
    const random = colors[Math.floor(Math.random() * colors.length)];
    boxStyle.value.backgroundColor = random;
    // Reset to generic class to avoid conflict, but keep borders
    boxClass.value = 'border-gray-400 text-gray-800';
    addLog(`element.style.backgroundColor = "${random}"`);
};

const toggleDisplay = (show: boolean) => {
    boxStyle.value.display = show ? 'block' : 'none';
    addLog(`element.style.display = "${show ? 'block' : 'none'}"`);
};
</script>
