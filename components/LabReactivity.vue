
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-sakura-200 dark:border-gray-700 shadow-sm backdrop-blur-md transition-colors relative">
    <!-- View Source Toggle -->
    <button 
      @click="showCode = !showCode" 
      class="absolute top-4 right-4 text-xs font-bold text-sakura-500 hover:text-sakura-600 bg-sakura-50 dark:bg-gray-900 px-3 py-1 rounded-full transition-colors border border-sakura-100 dark:border-gray-700 z-10"
    >
      {{ showCode ? 'Hide Code' : 'View Code' }}
    </button>

    <h3 class="text-xl font-bold text-sakura-800 dark:text-sakura-300 mb-4 flex items-center gap-2">
      {{ t.lab_reactivity_title }}
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-8">{{ t.lab_reactivity_info }}</p>

    <div v-if="!showCode" class="flex flex-col gap-10">
      
      <!-- Top Row: Data Binding -->
      <div class="flex flex-col md:flex-row gap-4 items-center justify-center relative">
        <!-- JavaScript / Data Model -->
        <div class="flex-1 w-full max-w-sm relative group z-10">
          <div class="absolute -top-3 left-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-[10px] px-2 py-0.5 rounded font-mono font-bold shadow-sm z-20">JS Data (Ref)</div>
          <div class="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl border-2 transition-all duration-300 font-mono text-sm text-blue-300 relative overflow-hidden" :class="isUpdating ? 'border-sakura-400 shadow-sakura-500/20' : 'border-gray-700'">
             
            <!-- Glow effect -->
            <div v-if="isUpdating" class="absolute inset-0 bg-sakura-500/5 animate-pulse"></div>

            <div class="mb-3 text-gray-500 text-xs">// Define reactive state</div>
            <div class="flex items-center flex-wrap gap-2">
              <span class="text-purple-400">const</span> 
              <span class="text-white">name</span> 
              <span class="text-gray-400">=</span> 
              <span class="text-blue-400">ref</span>(<span class="text-green-400">"</span>
              <input 
                v-model="name" 
                class="bg-gray-800 border-b-2 border-sakura-500 text-white focus:outline-none min-w-[60px] max-w-[140px] px-1 text-center font-bold"
              />
              <span class="text-green-400">"</span>)
            </div>
          </div>
        </div>

        <!-- Animated Connection -->
        <div class="hidden md:flex flex-col items-center justify-center w-24 h-full relative text-sakura-400">
           <svg class="w-full h-12" viewBox="0 0 100 50">
             <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#f43f72" />
                </marker>
             </defs>
             <path d="M0,25 Q50,25 90,25" fill="none" stroke="#fecdd7" stroke-width="2" />
             <path v-if="isUpdating" d="M0,25 Q50,25 90,25" fill="none" stroke="#f43f72" stroke-width="3" marker-end="url(#arrowhead)" class="path-flow" />
           </svg>
           <span class="text-[10px] font-bold uppercase tracking-widest text-sakura-300 mt-1">Auto Update</span>
        </div>

        <!-- DOM / View -->
        <div class="flex-1 w-full max-w-sm relative z-10">
          <div class="absolute -top-3 left-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-[10px] px-2 py-0.5 rounded font-mono font-bold shadow-sm z-20">DOM (Template)</div>
          <div class="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-xl border-2 min-h-[100px] flex items-center justify-center relative overflow-hidden transition-all duration-300" :class="isUpdating ? 'border-green-400 scale-[1.02] shadow-green-500/20' : 'border-gray-100 dark:border-gray-600'">
            <div class="text-gray-800 dark:text-gray-100 font-bold text-xl break-all text-center">
              Hello, <span class="text-sakura-500 border-b-2 border-sakura-200 transition-colors" :class="{'bg-sakura-100 dark:bg-sakura-900': isUpdating}">{{ name }}</span>!
            </div>
            <div class="absolute bottom-2 right-3 text-[10px] text-gray-300 dark:text-gray-500 font-mono font-bold">&lt;h1&gt;</div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Computed Logic -->
      <div class="flex flex-col md:flex-row gap-6 border-t border-gray-100 dark:border-gray-700 pt-8 relative">
         <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Dependent Logic</div>
         
         <div class="flex-1">
            <div class="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2">
               <span>⚡ Computed Property</span>
               <span class="text-[10px] bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded font-normal text-purple-600">Cached</span>
            </div>
            <div class="bg-[#1e1e1e] p-4 rounded-xl font-mono text-xs text-gray-300 shadow-md">
               <span class="text-purple-400">const</span> uppercase = <span class="text-blue-400">computed</span>(() => {<br>
               &nbsp;&nbsp;<span class="text-gray-500">// Only runs when 'name' changes</span><br>
               &nbsp;&nbsp;<span class="text-purple-400">return</span> name.value.toUpperCase();<br>
               });
            </div>
         </div>

         <div class="flex items-center justify-center text-gray-300 dark:text-gray-600">
            <span class="text-2xl transform rotate-90 md:rotate-0">➔</span>
         </div>

         <div class="flex-1">
            <div class="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">Output Result</div>
            <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 h-[86px] flex items-center justify-center font-bold text-2xl text-purple-700 dark:text-purple-300 shadow-sm transition-all" :class="{'scale-105 bg-purple-100 dark:bg-purple-900/40': isUpdating}">
               {{ uppercaseName }}
            </div>
         </div>
      </div>
    </div>

    <!-- Code View -->
    <div v-else class="animate-fade-in">
      <div class="bg-[#1e1e1e] p-6 rounded-2xl overflow-x-auto text-xs font-mono text-gray-300 leading-relaxed shadow-inner border border-gray-700">
<pre>&lt;template&gt;
  &lt;div&gt;
    &lt;!-- View updates automatically --&gt;
    &lt;h1&gt;Hello, {{ name }}!&lt;/h1&gt;
    &lt;p&gt;Uppercase: {{ uppercaseName }}&lt;/p&gt;
    
    &lt;!-- v-model binds input to data --&gt;
    &lt;input v-model="name" /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, computed } from 'vue';

// 1. Reactive State
const name = ref('Vue');

// 2. Computed Property (Updates when 'name' changes)
const uppercaseName = computed(() => {
  return name.value.toUpperCase();
});
&lt;/script&gt;</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const name = ref('Vue');
const isUpdating = ref(false);
const showCode = ref(false);

const uppercaseName = computed(() => name.value.toUpperCase());

watch(name, () => {
  isUpdating.value = true;
  setTimeout(() => isUpdating.value = false, 600);
});
</script>

<style scoped>
.path-flow {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 0.6s linear forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>