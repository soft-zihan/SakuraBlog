<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm backdrop-blur-md h-full flex flex-col">
    <h3 class="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
      {{ t.lab_props_title }}
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ t.lab_props_info }}</p>

    <div class="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
      
      <!-- Parent Component -->
      <div class="flex-1 bg-indigo-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-900 p-6 flex flex-col relative">
         <div class="absolute -top-3 left-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
           {{ t.lab_props_parent }}
         </div>

         <div class="space-y-4 mb-6">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">Props: {{ t.lab_props_msg }}</label>
              <input v-model="message" type="text" class="w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" placeholder="Type message...">
            </div>
            
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">Props: {{ t.lab_props_status }}</label>
              <div class="flex gap-2">
                <button 
                  @click="isActive = true" 
                  class="flex-1 py-1.5 rounded text-xs font-bold border transition-all"
                  :class="isActive ? 'bg-green-500 text-white border-green-600 shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600'"
                >
                  Active
                </button>
                <button 
                   @click="isActive = false"
                   class="flex-1 py-1.5 rounded text-xs font-bold border transition-all"
                   :class="!isActive ? 'bg-red-500 text-white border-red-600 shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600'"
                >
                  Offline
                </button>
              </div>
            </div>
         </div>

         <!-- Log Area -->
         <div class="mt-auto bg-[#1e1e1e] rounded-lg p-3 h-32 overflow-hidden flex flex-col shadow-inner">
            <div class="text-[10px] text-gray-500 border-b border-gray-700 pb-1 mb-1 font-mono flex justify-between">
              <span>@ {{ t.lab_props_emit_log }}</span>
              <span @click="logs = []" class="cursor-pointer hover:text-white">🗑️</span>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1">
               <div v-for="(log, idx) in logs" :key="idx" class="text-green-400 animate-fade-in">
                  <span class="opacity-50 text-gray-500">[{{ log.time }}]</span> &lt;Child&gt; emitted: <span class="text-yellow-300">"{{ log.event }}"</span> payload: {{ log.payload }}
               </div>
               <div v-if="logs.length === 0" class="text-gray-600 italic">Listening for events...</div>
            </div>
         </div>

         <!-- Data Flow Arrow (Desktop) -->
         <div class="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
            <div class="flex flex-col gap-1 items-center">
              <span class="text-[10px] font-bold text-indigo-400">Props</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-indigo-400 animate-pulse"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
         </div>
      </div>

      <!-- Child Component -->
      <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 flex flex-col relative shadow-xl">
         <div class="absolute -top-3 left-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
           {{ t.lab_props_child }}
         </div>

         <!-- Robot Visual -->
         <div class="flex-1 flex flex-col items-center justify-center py-6">
            <div class="relative transition-all duration-500" :class="isActive ? 'filter-none scale-100' : 'grayscale opacity-70 scale-95'">
               <!-- Antenna -->
               <div class="w-1 h-6 bg-gray-400 mx-auto transition-colors" :class="isActive ? 'bg-indigo-400' : 'bg-gray-400'"></div>
               <div class="w-3 h-3 rounded-full mx-auto -mb-1 animate-ping absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-400" v-if="isActive"></div>
               
               <!-- Head -->
               <div class="w-32 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl border-4 border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative shadow-lg">
                  <!-- Screen Content (Props) -->
                  <div class="text-center p-2 w-full">
                     <div class="text-[10px] font-bold text-gray-400 uppercase mb-1">Incoming Message</div>
                     <div class="font-mono text-sm text-indigo-600 dark:text-indigo-300 truncate font-bold bg-indigo-50 dark:bg-gray-800 rounded px-1">{{ message || '...' }}</div>
                  </div>
                  <!-- Eyes -->
                  <div class="absolute bottom-1 flex gap-8 opacity-20">
                     <div class="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
                     <div class="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
                  </div>
               </div>
               
               <!-- Body -->
               <div class="w-20 h-16 bg-gray-200 dark:bg-gray-600 mx-auto rounded-b-xl border-x-4 border-b-4 border-gray-300 dark:border-gray-500 relative mt-[-4px] z-[-1]">
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 transition-colors duration-500 bg-white dark:bg-gray-800 flex items-center justify-center" :class="isActive ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'border-red-500'">
                     <div class="w-2 h-2 rounded-full" :class="isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Actions (Emit) -->
         <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <label class="text-[10px] font-bold text-gray-400 uppercase block mb-2 text-center">Emit Events to Parent</label>
            <div class="flex gap-3">
               <button 
                 @click="emitEvent('damage', 10)"
                 class="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800 transition-all active:scale-95"
               >
                 💥 {{ t.lab_props_action_hit }}
               </button>
               <button 
                 @click="emitEvent('heal', 20)"
                 class="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 py-2 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800 transition-all active:scale-95"
               >
                 💊 {{ t.lab_props_action_heal }}
               </button>
            </div>
         </div>
         
         <!-- Event Flow Arrow (Desktop) -->
         <div class="hidden md:block absolute bottom-10 -left-6 transform z-10">
            <div class="flex flex-col gap-1 items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500 animate-bounce"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span class="text-[10px] font-bold text-yellow-500">Emit</span>
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

// Parent State (Props source)
const message = ref('Hello Vue!');
const isActive = ref(true);

// Log State
const logs = ref<{time: string, event: string, payload: number}[]>([]);

const emitEvent = (eventName: string, val: number) => {
    // Simulate the emit logic visually
    const time = new Date().toLocaleTimeString().split(' ')[0];
    logs.value.unshift({ time, event: eventName, payload: val });
    
    // Auto-clear logs if too many
    if (logs.value.length > 6) logs.value.pop();
};
</script>