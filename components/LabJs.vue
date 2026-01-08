<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-yellow-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ t.lab_js_info }}</p>

    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Interactive Area -->
      <div class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        
        <!-- Grandparent -->
        <div 
          @click.capture="logEvent('Grandparent', 'Capture')"
          @click="logEvent('Grandparent', 'Bubble')"
          class="w-full max-w-md p-8 rounded-xl border-4 transition-all duration-500 cursor-pointer relative group"
          :class="highlight === 'Grandparent' ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 shadow-[0_0_20px_rgba(234,179,8,0.5)] scale-105' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-yellow-300'"
        >
          <span class="absolute top-2 left-2 text-xs font-bold text-gray-400 uppercase">Grandparent (div)</span>
          
          <!-- Parent -->
          <div 
            @click.capture="logEvent('Parent', 'Capture')"
            @click.stop="stopProp ? null : logEvent('Parent', 'Bubble')" 
            @click="!stopProp && logEvent('Parent', 'Bubble')"
            class="w-full p-8 rounded-xl border-4 transition-all duration-500 cursor-pointer relative mt-4"
            :class="highlight === 'Parent' ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30 shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-105' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-orange-300'"
          >
             <span class="absolute top-2 left-2 text-xs font-bold text-gray-400 uppercase">Parent (div)</span>
             
             <!-- Child -->
             <div 
                @click.capture="logEvent('Child', 'Capture')"
                @click="logEvent('Child', 'Bubble')"
                class="w-full p-6 rounded-xl border-4 transition-all duration-500 cursor-pointer relative mt-4 text-center font-bold text-gray-600 dark:text-gray-300"
                :class="highlight === 'Child' ? 'border-red-500 bg-red-100 dark:bg-red-900/30 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-110' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-red-300'"
             >
                <span class="absolute top-2 left-2 text-xs font-bold text-gray-400 uppercase text-left">Child (div)</span>
                Click Me!
             </div>
          </div>
        </div>

      </div>

      <!-- Log / Controls -->
      <div class="w-full lg:w-80 flex flex-col gap-4">
         <!-- Settings -->
         <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl flex items-center justify-between">
           <span class="text-sm font-bold text-gray-600 dark:text-gray-300">Stop Propagation?</span>
           <button 
             @click="stopProp = !stopProp"
             class="w-12 h-6 rounded-full transition-colors relative"
             :class="stopProp ? 'bg-green-500' : 'bg-gray-400'"
           >
             <div class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200" :class="stopProp ? 'left-7' : 'left-1'"></div>
           </button>
         </div>
         <div class="text-[10px] text-gray-400 px-1" v-if="stopProp">
           * e.stopPropagation() applied at Parent Bubble phase
         </div>

         <!-- Log Console -->
         <div class="flex-1 bg-[#1e1e1e] rounded-xl overflow-hidden flex flex-col shadow-lg border border-gray-700">
            <div class="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-gray-700">
               <span class="text-xs font-bold text-gray-400 uppercase">{{ t.lab_js_log }}</span>
               <button @click="logs = []" class="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold">{{ t.lab_js_clear }}</button>
            </div>
            <div class="flex-1 p-4 overflow-y-auto font-mono text-xs custom-scrollbar h-64">
               <div v-if="logs.length === 0" class="text-gray-600 italic text-center mt-10">Waiting for clicks...</div>
               <div v-for="(log, i) in logs" :key="i" class="mb-2 animate-fade-in flex gap-2">
                  <span class="text-gray-500">[{{ log.id }}]</span>
                  <span :class="log.phase === 'Capture' ? 'text-blue-400' : 'text-green-400'">{{ log.phase }}</span>
                  <span class="text-gray-300">-> {{ log.target }}</span>
               </div>
            </div>
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

const highlight = ref<string | null>(null);
const logs = ref<{id: number, target: string, phase: string}[]>([]);
const stopProp = ref(false);
let logId = 1;

const logEvent = (target: string, phase: string) => {
  // If stopped at parent bubble, child capture/bubble happens, parent capture happens, but parent bubble logic prevents moving up if logic was standard JS. 
  // However, here we simulate the visual feedback.
  if (stopProp.value && target === 'Parent' && phase === 'Bubble') {
     logs.value.unshift({ id: logId++, target: target + ' (Stopped)', phase });
     highlight.value = target;
     setTimeout(() => highlight.value = null, 400);
     return;
  }

  // Add log
  logs.value.unshift({ id: logId++, target, phase });
  
  // Visual Flash
  highlight.value = target;
  setTimeout(() => {
    if (highlight.value === target) highlight.value = null;
  }, 400);
};
</script>