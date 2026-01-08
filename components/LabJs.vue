
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-yellow-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    
    <!-- Tab Switcher inside JS Lab -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
      <button 
        @click="activeTab = 'basics'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all"
        :class="activeTab === 'basics' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'"
      >
        {{ t.lab_js_tab_basics }}
      </button>
      <button 
        @click="activeTab = 'events'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all"
        :class="activeTab === 'events' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'"
      >
        {{ t.lab_js_tab_events }}
      </button>
    </div>

    <!-- Tab 1: Basics (Variables & Types) -->
    <div v-if="activeTab === 'basics'" class="animate-fade-in space-y-8">
       <p class="text-xs text-gray-500 dark:text-gray-400">
         {{ lang === 'zh' ? '对应 source-1.md：JS 是一门弱类型语言，变量类型由值决定。' : 'Ref source-1.md: JS is a loosely typed language. Variable types are determined by their values.' }}
       </p>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Typeof Playground -->
          <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
             <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-4 text-sm flex items-center gap-2">
               <span class="text-yellow-500">🔍</span> {{ t.lab_js_type_check }}
             </h4>
             
             <div class="space-y-4">
                <div class="flex items-center gap-2 text-sm font-mono">
                   <span class="text-purple-400">let</span>
                   <span class="text-blue-300">val</span>
                   <span class="text-gray-400">=</span>
                   <input v-model="typeInput" class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-green-600 dark:text-green-400 focus:outline-none w-40" placeholder="Try typing..." />
                   <span class="text-gray-400">;</span>
                </div>
                
                <div class="bg-[#1e1e1e] p-4 rounded-lg font-mono text-xs text-gray-300 shadow-inner">
                   <div>> <span class="text-blue-400">typeof</span> val</div>
                   <div class="mt-1 text-yellow-400 flex items-center gap-2">
                      <span class="text-lg">➜</span> "{{ computedType }}"
                   </div>
                </div>
                
                <div class="flex gap-2 flex-wrap">
                   <button @click="typeInput = '123'" class="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition">Number</button>
                   <button @click="typeInput = '\'Hello\''" class="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition">String</button>
                   <button @click="typeInput = 'true'" class="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition">Boolean</button>
                   <button @click="typeInput = 'null'" class="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition border border-yellow-500/50" title="JS Quirk">Null</button>
                   <button @click="typeInput = '{}'" class="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition">Object</button>
                </div>
             </div>
          </div>

          <!-- Operator Playground -->
          <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
             <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-4 text-sm flex items-center gap-2">
               <span class="text-yellow-500">⚖️</span> {{ t.lab_js_equality }}
             </h4>
             
             <div class="space-y-6">
                <div class="flex items-center justify-center gap-4 text-sm font-mono">
                   <div class="p-2 bg-white dark:bg-gray-800 border rounded text-center min-w-[60px]">10</div>
                   <div class="flex flex-col gap-2">
                      <button @click="compareMode = '=='" :class="compareMode === '==' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'" class="px-3 py-1 rounded font-bold transition">==</button>
                      <button @click="compareMode = '==='" :class="compareMode === '===' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'" class="px-3 py-1 rounded font-bold transition">===</button>
                   </div>
                   <div class="p-2 bg-white dark:bg-gray-800 border rounded text-center min-w-[60px] text-green-600">"10"</div>
                </div>

                <div class="bg-[#1e1e1e] p-4 rounded-lg font-mono text-xs text-gray-300 text-center relative overflow-hidden">
                   <div v-if="compareResult" class="text-green-400 font-bold text-xl animate-bounce">true</div>
                   <div v-else class="text-red-400 font-bold text-xl animate-pulse">false</div>
                   
                   <div class="mt-2 text-[10px] text-gray-500 border-t border-gray-700 pt-2">
                      <span v-if="compareMode === '=='">{{ lang === 'zh' ? '宽松相等：只比较值，自动类型转换' : 'Loose equality: compares value only, performs type coercion.' }}</span>
                      <span v-else>{{ lang === 'zh' ? '严格相等：同时比较值和类型 (Number !== String)' : 'Strict equality: compares both value and type.' }}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Tab 2: Events (Existing) -->
    <div v-else-if="activeTab === 'events'" class="flex flex-col lg:flex-row gap-8 animate-fade-in">
      
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
const activeTab = ref<'basics' | 'events'>('basics');

// --- Basics Logic ---
const typeInput = ref("'Hello'");
const compareMode = ref<'==' | '==='>('==');

const computedType = computed(() => {
  const val = typeInput.value.trim();
  if (val === 'null') return 'object'; // JS quirk
  if (val === 'undefined') return 'undefined';
  if (val === 'true' || val === 'false') return 'boolean';
  if (!isNaN(Number(val)) && val !== '') return 'number';
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) return 'string';
  if (val.startsWith('{') || val.startsWith('[')) return 'object';
  return 'undefined'; // simplified
});

const compareResult = computed(() => {
    // Simulate 10 vs "10"
    if (compareMode.value === '==') return 10 == "10" as any;
    if (compareMode.value === '===') return 10 === "10" as any;
    return false;
});

// --- Events Logic ---
const highlight = ref<string | null>(null);
const logs = ref<{id: number, target: string, phase: string}[]>([]);
const stopProp = ref(false);
let logId = 1;

const logEvent = (target: string, phase: string) => {
  if (stopProp.value && target === 'Parent' && phase === 'Bubble') {
     logs.value.unshift({ id: logId++, target: target + ' (Stopped)', phase });
     highlight.value = target;
     setTimeout(() => highlight.value = null, 400);
     return;
  }

  logs.value.unshift({ id: logId++, target, phase });
  
  highlight.value = target;
  setTimeout(() => {
    if (highlight.value === target) highlight.value = null;
  }, 400);
};
</script>
