<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-sakura-200 dark:border-gray-700 shadow-sm backdrop-blur-md transition-colors">
    <h3 class="text-xl font-bold text-sakura-800 dark:text-sakura-300 mb-4 flex items-center gap-2">
      🧪 Reactivity & Computed
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">Type in the JS box to see how Data drives the View and how Computed properties update automatically.</p>

    <div class="flex flex-col gap-6">
      
      <!-- Top Row: Data Binding -->
      <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
        <!-- JavaScript / Data Model -->
        <div class="flex-1 w-full relative group">
          <div class="absolute -top-3 left-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-[10px] px-2 py-0.5 rounded font-mono font-bold">State (Ref)</div>
          <div class="bg-[#1e1e1e] p-4 rounded-xl shadow-lg border-2 border-transparent group-hover:border-sakura-300 transition-colors font-mono text-sm text-blue-300">
            <div class="mb-2 text-gray-400">// const name = ref('...')</div>
            <span class="text-purple-400">name</span>.<span class="text-blue-400">value</span> = "
            <input 
              v-model="name" 
              class="bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-sakura-500 min-w-[80px] max-w-[120px]"
            />
            "
          </div>
        </div>

        <!-- Arrow -->
        <div class="flex flex-col items-center gap-1 text-sakura-400">
          <span class="text-xs font-bold uppercase tracking-widest">Bind</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{'animate-pulse-fast text-sakura-600': isUpdating}"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>

        <!-- DOM / View -->
        <div class="flex-1 w-full relative">
          <div class="absolute -top-3 left-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-[10px] px-2 py-0.5 rounded font-mono font-bold">DOM</div>
          <div class="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-600 min-h-[80px] flex items-center justify-center relative overflow-hidden transition-all duration-300" :class="{'scale-[1.02] border-sakura-300 shadow-sakura-100/50': isUpdating}">
            <div class="text-gray-800 dark:text-gray-200 font-bold text-lg break-all text-center">Hello, {{ name }}!</div>
            <div class="absolute bottom-1 right-2 text-[10px] text-gray-300 dark:text-gray-500 font-mono">&lt;h1&gt;</div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Computed Logic -->
      <div class="flex flex-col md:flex-row gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
         <div class="flex-1">
            <div class="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">Computed Logic</div>
            <div class="bg-[#1e1e1e] p-3 rounded-lg font-mono text-xs text-gray-300">
               <span class="text-purple-400">const</span> uppercaseName = <span class="text-blue-400">computed</span>(() => {<br>
               &nbsp;&nbsp;<span class="text-purple-400">return</span> name.value.toUpperCase();<br>
               });
            </div>
         </div>
         <div class="flex items-center justify-center">
            <span class="text-2xl">👉</span>
         </div>
         <div class="flex-1">
            <div class="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">Result</div>
            <div class="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg border border-purple-200 dark:border-purple-700 h-[66px] flex items-center justify-center font-bold text-purple-800 dark:text-purple-300">
               {{ uppercaseName }}
            </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const name = ref('Vue');
const isUpdating = ref(false);

const uppercaseName = computed(() => name.value.toUpperCase());

watch(name, () => {
  isUpdating.value = true;
  setTimeout(() => isUpdating.value = false, 500);
});
</script>