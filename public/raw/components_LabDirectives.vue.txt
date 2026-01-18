<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-teal-100 dark:border-gray-700 shadow-sm backdrop-blur-md h-full flex flex-col">
    <h3 class="text-lg font-bold text-teal-800 dark:text-teal-300 mb-4 flex items-center gap-2">
      {{ t.lab_directives_title }}
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ t.lab_directives_info }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- Controls -->
      <div class="space-y-6">
        <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
           <div class="flex items-center justify-between mb-4">
             <span class="font-mono text-sm font-bold text-gray-600 dark:text-gray-300">isVisible:</span>
             <button 
               @click="isVisible = !isVisible" 
               class="px-3 py-1 rounded-lg text-xs font-bold transition-all"
               :class="isVisible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
             >
               {{ isVisible }}
             </button>
           </div>
           <div class="text-[10px] text-gray-400">Toggling this variable affects both examples below.</div>
        </div>

        <div class="space-y-4">
           <!-- Code v-if -->
           <div class="bg-[#1e1e1e] p-3 rounded-lg font-mono text-xs text-gray-300 border-l-4 border-purple-500">
             <span class="text-gray-500">&lt;div</span> <span class="text-purple-400">v-if</span>=<span class="text-green-400">"isVisible"</span><span class="text-gray-500">&gt;</span><br>
             &nbsp;&nbsp;I am v-if<br>
             <span class="text-gray-500">&lt;/div&gt;</span>
           </div>

           <!-- Code v-show -->
           <div class="bg-[#1e1e1e] p-3 rounded-lg font-mono text-xs text-gray-300 border-l-4 border-blue-500">
             <span class="text-gray-500">&lt;div</span> <span class="text-purple-400">v-show</span>=<span class="text-green-400">"isVisible"</span><span class="text-gray-500">&gt;</span><br>
             &nbsp;&nbsp;I am v-show<br>
             <span class="text-gray-500">&lt;/div&gt;</span>
           </div>
        </div>
      </div>

      <!-- DOM Visualization -->
      <div class="space-y-6">
        
        <!-- v-if Result -->
        <div class="relative p-4 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-900 min-h-[80px] flex items-center justify-center bg-white dark:bg-gray-800">
          <div class="absolute top-0 left-0 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-br-lg">DOM Tree (v-if)</div>
          
          <div v-if="isVisible" class="animate-fade-in bg-purple-500 text-white px-4 py-2 rounded shadow-lg">
            I am in the DOM
          </div>
          <div v-else class="text-gray-400 italic text-xs">
            <!-- Comment node -->
            &lt;!--v-if--&gt; (Node Removed)
          </div>
        </div>

        <!-- v-show Result -->
        <div class="relative p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-900 min-h-[80px] flex items-center justify-center bg-white dark:bg-gray-800">
          <div class="absolute top-0 left-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-br-lg">DOM Tree (v-show)</div>
          
          <div 
            class="transition-all duration-300 bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
            :style="{ display: isVisible ? 'block' : 'none' }"
          >
            I am hidden via CSS
          </div>
          <div v-if="!isVisible" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
             <span class="text-[10px] font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-600 dark:text-gray-300">style="display: none"</span>
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
const isVisible = ref(true);
</script>