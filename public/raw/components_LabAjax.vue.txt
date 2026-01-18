
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 md:p-10 rounded-3xl border border-green-100 dark:border-gray-700 shadow-xl backdrop-blur-md relative overflow-hidden">
    
    <!-- Background Decor -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-green-50 dark:bg-green-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

    <div class="text-center mb-10 relative z-10">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ t.lab_ajax_title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">{{ t.lab_ajax_desc }}</p>
        
        <!-- Mode Switcher -->
        <div class="inline-flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl shadow-inner">
            <button @click="mode = 'sync'" class="px-6 py-2 rounded-lg text-xs font-bold transition-all" :class="mode === 'sync' ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500'">{{ t.lab_ajax_sync }}</button>
            <button @click="mode = 'async'" class="px-6 py-2 rounded-lg text-xs font-bold transition-all" :class="mode === 'async' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-500'">{{ t.lab_ajax_async }}</button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <!-- Visual Flow -->
        <div class="flex flex-col gap-6">
            <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Request Flow</span>
                <span v-if="status === 'idle'" class="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">Idle</span>
                <span v-else class="text-[10px] px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 animate-pulse font-bold">Running...</span>
            </div>

            <!-- Step 1: Province -->
            <div class="relative pl-8 border-l-2 transition-all duration-500" :class="step >= 1 ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'">
                <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-500 bg-white dark:bg-gray-800" :class="step >= 1 ? 'border-green-500 scale-110' : 'border-gray-300'"></div>
                <div class="p-4 rounded-xl border transition-all duration-500 bg-white dark:bg-gray-800" :class="step === 1 ? 'border-green-500 shadow-lg shadow-green-100' : (step > 1 ? 'border-green-200 opacity-60' : 'border-gray-200 dark:border-gray-700 opacity-40')">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-sm">{{ t.lab_ajax_step_1 }}</span>
                        <span class="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 px-2 rounded text-gray-500">GET /province</span>
                    </div>
                    <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-green-500 transition-all duration-[1500ms] ease-out" :style="{ width: step === 1 ? '100%' : (step > 1 ? '100%' : '0%') }"></div>
                    </div>
                    <div v-if="step > 1" class="mt-2 text-xs text-green-600 font-bold animate-fade-in bg-green-50 dark:bg-green-900/20 p-2 rounded flex justify-between">
                       <span>Result: Hebei Province</span>
                       <span class="font-mono">id: 1</span>
                    </div>
                </div>
            </div>

            <!-- Step 2: City -->
            <div class="relative pl-8 border-l-2 transition-all duration-500" :class="step >= 2 ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'">
                <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-500 bg-white dark:bg-gray-800" :class="step >= 2 ? 'border-blue-500 scale-110' : 'border-gray-300'"></div>
                <div class="p-4 rounded-xl border transition-all duration-500 bg-white dark:bg-gray-800" :class="step === 2 ? 'border-blue-500 shadow-lg shadow-blue-100' : (step > 2 ? 'border-blue-200 opacity-60' : 'border-gray-200 dark:border-gray-700 opacity-40')">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-sm">{{ t.lab_ajax_step_2 }}</span>
                        <span class="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 px-2 rounded text-gray-500">GET /city?pid=1</span>
                    </div>
                    <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 transition-all duration-[1500ms] ease-out" :style="{ width: step === 2 ? '100%' : (step > 2 ? '100%' : '0%') }"></div>
                    </div>
                     <div v-if="step > 2" class="mt-2 text-xs text-blue-600 font-bold animate-fade-in bg-blue-50 dark:bg-blue-900/20 p-2 rounded flex justify-between">
                       <span>Result: Shijiazhuang</span>
                       <span class="font-mono">id: 101</span>
                    </div>
                </div>
            </div>

            <!-- Step 3: Area -->
             <div class="relative pl-8 border-l-2 border-transparent">
                <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-500 bg-white dark:bg-gray-800" :class="step >= 3 ? 'border-purple-500 scale-110' : 'border-gray-300'"></div>
                <div class="p-4 rounded-xl border transition-all duration-500 bg-white dark:bg-gray-800" :class="step === 3 ? 'border-purple-500 shadow-lg shadow-purple-100' : (step > 3 ? 'border-purple-200 opacity-60' : 'border-gray-200 dark:border-gray-700 opacity-40')">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-sm">{{ t.lab_ajax_step_3 }}</span>
                        <span class="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 px-2 rounded text-gray-500">GET /area?cid=101</span>
                    </div>
                    <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-purple-500 transition-all duration-[1500ms] ease-out" :style="{ width: step === 3 ? '100%' : (step > 3 ? '100%' : '0%') }"></div>
                    </div>
                     <div v-if="step > 3" class="mt-2 text-xs text-purple-600 font-bold animate-fade-in bg-purple-50 dark:bg-purple-900/20 p-2 rounded flex justify-between">
                       <span>Result: Changan District</span>
                       <span class="font-mono">id: 10101</span>
                    </div>
                </div>
            </div>
            
        </div>

        <!-- Code Block & Controls -->
        <div class="flex flex-col gap-6">
            <div class="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col flex-1 min-h-[300px]">
                <div class="bg-[#2d2d2d] px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span class="ml-2 text-xs text-gray-400 font-mono">{{ mode === 'sync' ? 'CallbackHell.js' : 'AsyncAwait.js' }}</span>
                </div>
                <div class="p-4 font-mono text-xs leading-relaxed overflow-auto custom-scrollbar flex-1 relative">
                    <!-- Sync Code (Callback Hell) -->
                    <div v-if="mode === 'sync'" class="transition-opacity duration-300">
<span class="text-gray-500">// 💀 Nested Callbacks</span>
<span :class="{'opacity-30': step !== 1}" class="transition-opacity duration-300">axios.get('/province').then(res => {</span>
  <span :class="{'opacity-30': step !== 1}" class="text-green-400 transition-opacity duration-300">const pid = res.data.id;</span>
  
  <span :class="{'opacity-30': step !== 2}" class="transition-opacity duration-300 pl-4">axios.get(`/city?pid=${pid}`).then(res => {</span>
    <span :class="{'opacity-30': step !== 2}" class="text-blue-400 transition-opacity duration-300 pl-4">const cid = res.data.id;</span>

    <span :class="{'opacity-30': step !== 3}" class="transition-opacity duration-300 pl-8">axios.get(`/area?cid=${cid}`).then(res => {</span>
      <span :class="{'opacity-30': step !== 3}" class="text-purple-400 transition-opacity duration-300 pl-8">this.area = res.data;</span>
      <span :class="{'opacity-30': step !== 3}" class="text-gray-500 transition-opacity duration-300 pl-8">// Finally done!</span>
    <span :class="{'opacity-30': step !== 3}" class="transition-opacity duration-300 pl-8">});</span>
  <span :class="{'opacity-30': step !== 2}" class="transition-opacity duration-300 pl-4">});</span>
<span :class="{'opacity-30': step !== 1}" class="transition-opacity duration-300">});</span>
                    </div>

                    <!-- Async Code -->
                    <div v-else class="transition-opacity duration-300">
<span class="text-gray-500">// ✨ Elegant Async/Await</span>
<span class="text-purple-400">async</span> function getData() {
  <span :class="{'opacity-30': step !== 1}" class="transition-opacity duration-300 block mb-2 mt-2">
  <span class="text-blue-400">const</span> p = <span class="text-purple-400">await</span> axios.get('/province');
  <span class="text-green-400">const pid = p.data.id;</span>
  </span>

  <span :class="{'opacity-30': step !== 2}" class="transition-opacity duration-300 block mb-2">
  <span class="text-blue-400">const</span> c = <span class="text-purple-400">await</span> axios.get(`/city?pid=${pid}`);
  <span class="text-blue-400">const cid = c.data.id;</span>
  </span>

  <span :class="{'opacity-30': step !== 3}" class="transition-opacity duration-300 block">
  <span class="text-blue-400">const</span> a = <span class="text-purple-400">await</span> axios.get(`/area?cid=${cid}`);
  <span class="text-purple-400">this.area = a.data;</span>
  </span>
}
                    </div>
                </div>
            </div>

            <button 
                @click="startRequest" 
                :disabled="status === 'running'"
                class="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                :class="status === 'running' ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/30'"
            >
                <span v-if="status === 'idle'">▶ {{ t.lab_ajax_start }}</span>
                <span v-else>⏳ Processing...</span>
            </button>
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
const mode = ref<'sync' | 'async'>('sync');
const status = ref<'idle' | 'running'>('idle');
const step = ref(0);

const startRequest = () => {
    if (status.value === 'running') return;
    status.value = 'running';
    step.value = 1;

    // Simulate Step 1
    setTimeout(() => {
        step.value = 2;
        // Simulate Step 2
        setTimeout(() => {
            step.value = 3;
            // Simulate Step 3
            setTimeout(() => {
                step.value = 4; // Complete
                setTimeout(() => {
                   status.value = 'idle';
                   step.value = 0;
                }, 2000);
            }, 1500);
        }, 1500);
    }, 1500);
};
</script>
