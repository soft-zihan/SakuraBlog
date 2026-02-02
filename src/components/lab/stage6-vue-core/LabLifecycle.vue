
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <h3 class="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
      {{ t.lab_lifecycle_title }}
    </h3>
    
    <div class="flex flex-wrap gap-2 mb-8 justify-center">
      <button 
        @click="mountComponent" 
        :disabled="status !== 'unmounted'"
        class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm transform active:scale-95"
        :class="status === 'unmounted' ? 'bg-sakura-500 text-white hover:bg-sakura-600 shadow-sakura-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'"
      >
        1. {{ t.lab_lifecycle_btn_mount }}
      </button>
      <button 
        @click="updateComponent" 
        :disabled="status !== 'mounted'"
        class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm transform active:scale-95"
        :class="status === 'mounted' ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'"
      >
        2. {{ t.lab_lifecycle_btn_update }}
      </button>
      <button 
        @click="unmountComponent" 
        :disabled="status === 'unmounted'"
        class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm transform active:scale-95"
        :class="status !== 'unmounted' ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'"
      >
        3. {{ t.lab_lifecycle_btn_unmount }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Timeline Visualizer -->
      <div class="flex flex-col gap-4">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Execution Timeline</h4>
        <div class="relative h-24 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex items-center px-6 justify-between">
          <!-- Line -->
          <div class="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-700 -z-0"></div>
          
          <!-- Nodes -->
          <div v-for="step in steps" :key="step.key" class="relative z-10 flex flex-col items-center group transition-all duration-500" :class="{'opacity-100 scale-110': activeStep === step.key, 'opacity-40 grayscale': activeStep !== step.key}">
             <div 
               class="w-5 h-5 rounded-full border-4 bg-white dark:bg-gray-800 transition-colors duration-300 shadow-sm"
               :class="activeStep === step.key ? step.color : 'border-gray-300 dark:border-gray-600'"
             ></div>
             <span class="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">{{ step.label }}</span>
          </div>
        </div>

        <!-- Output Console -->
        <div class="flex-1 bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 h-32 overflow-y-auto custom-scrollbar shadow-inner">
           <div v-for="(log, i) in logs" :key="i" class="mb-1.5 border-l-2 border-transparent pl-2 animate-fade-in" :class="{'border-green-500 bg-green-500/10 text-green-300 font-bold': i === 0}">
             <span class="opacity-50 text-[10px] mr-2">[{{ log.time }}]</span> {{ log.msg }}
           </div>
           <div v-if="logs.length === 0" class="text-gray-600 italic h-full flex items-center justify-center">Waiting for events...</div>
        </div>
      </div>

      <!-- Visual Component Playground -->
      <div class="flex flex-col gap-4">
         <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Page View</h4>
         <div class="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 border-dashed rounded-xl flex items-center justify-center relative overflow-hidden min-h-[240px]">
            <div class="absolute top-2 right-2 text-[10px] font-mono px-2 py-1 rounded bg-white/70 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300">#app-container</div>
            
            <!-- The Visual Component -->
            <transition name="pop">
              <div 
                v-if="status === 'mounted' || status === 'updating'" 
                class="w-40 h-40 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 transition-all duration-500 relative"
                :class="isUpdating ? 'border-blue-500 shadow-blue-500/30 scale-105' : 'border-sakura-400 shadow-sakura-500/20'"
              >
                <div class="text-4xl mb-2 transition-transform duration-300" :class="{'rotate-12 scale-110': isUpdating}">📦</div>
                <div class="font-bold text-gray-700 dark:text-gray-200 text-sm">{{ t.lab_lifecycle_component }}</div>
                
                <div class="mt-3 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-[10px] font-mono text-gray-500 flex gap-2">
                   <span>{{ t.lab_lifecycle_state }}:</span>
                   <span class="font-bold text-blue-500">{{ updateCount }}</span>
                </div>

                <!-- Update Flash Effect -->
                <div v-if="isUpdating" class="absolute inset-0 bg-blue-500/10 rounded-2xl animate-pulse"></div>
              </div>
            </transition>

            <div v-if="status === 'unmounted'" class="text-gray-300 dark:text-gray-700 font-mono text-sm text-center">
              &lt;!-- Component Unmounted --&gt;
              <div class="text-[10px] mt-2 opacity-50">DOM is empty</div>
            </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { I18N } from '../../../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const status = ref<'unmounted' | 'mounted' | 'updating'>('unmounted');
const activeStep = ref('');
const logs = ref<{time: string, msg: string}[]>([]);
const updateCount = ref(0);
const isUpdating = ref(false);

const steps = [
  { key: 'create', label: 'Setup', color: 'border-purple-500 bg-purple-500' },
  { key: 'mount', label: 'Mounted', color: 'border-green-500 bg-green-500' },
  { key: 'update', label: 'Updated', color: 'border-blue-500 bg-blue-500' },
  { key: 'unmount', label: 'Unmounted', color: 'border-red-500 bg-red-500' },
];

const addLog = (msg: string) => {
  const time = new Date().toLocaleTimeString().split(' ')[0];
  logs.value.unshift({ time, msg });
};

const mountComponent = () => {
  activeStep.value = 'create';
  addLog('Initializing component (setup function)...');
  
  setTimeout(() => {
    activeStep.value = 'mount';
    status.value = 'mounted';
    updateCount.value = 1;
    addLog('Component mounted to DOM (onMounted)');
  }, 800);
};

const updateComponent = () => {
  status.value = 'updating';
  isUpdating.value = true;
  updateCount.value++;
  addLog(`State changed to: ${updateCount.value}`);
  
  setTimeout(() => {
    activeStep.value = 'update';
    status.value = 'mounted';
    isUpdating.value = false;
    addLog('DOM re-rendered (onUpdated)');
  }, 800);
};

const unmountComponent = () => {
  addLog('Unmount triggered. Cleaning up...');
  setTimeout(() => {
    activeStep.value = 'unmount';
    status.value = 'unmounted';
    addLog('Component destroyed (onUnmounted)');
  }, 800);
};
</script>

<style scoped>
.pop-enter-active {
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  animation: pop-out 0.3s ease-in;
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pop-out {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.5); opacity: 0; }
}
</style>
