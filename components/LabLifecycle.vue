<template>
  <div class="bg-white/80 p-6 rounded-2xl border border-sakura-200 shadow-sm backdrop-blur-md mt-6">
    <h3 class="text-xl font-bold text-sakura-800 mb-4 flex items-center gap-2">
      {{ t.lab_lifecycle_title }}
    </h3>
    
    <div class="flex gap-2 mb-6 justify-center">
      <button 
        @click="mountComponent" 
        :disabled="status !== 'unmounted'"
        class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
        :class="status === 'unmounted' ? 'bg-sakura-500 text-white hover:bg-sakura-600 shadow-md' : 'bg-gray-100 text-gray-400'"
      >
        1. {{ t.lab_lifecycle_btn_mount }}
      </button>
      <button 
        @click="updateComponent" 
        :disabled="status !== 'mounted'"
        class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
        :class="status === 'mounted' ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md' : 'bg-gray-100 text-gray-400'"
      >
        2. {{ t.lab_lifecycle_btn_update }}
      </button>
      <button 
        @click="unmountComponent" 
        :disabled="status === 'unmounted'"
        class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
        :class="status !== 'unmounted' ? 'bg-red-400 text-white hover:bg-red-500 shadow-md' : 'bg-gray-100 text-gray-400'"
      >
        3. {{ t.lab_lifecycle_btn_unmount }}
      </button>
    </div>

    <!-- Timeline Visualizer -->
    <div class="relative h-24 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center px-10 justify-between">
      <!-- Line -->
      <div class="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-0"></div>
      
      <!-- Nodes -->
      <div v-for="step in steps" :key="step.key" class="relative z-10 flex flex-col items-center group transition-all duration-500" :class="{'opacity-100 scale-110': activeStep === step.key, 'opacity-40': activeStep !== step.key}">
         <div 
           class="w-4 h-4 rounded-full border-2 bg-white transition-colors duration-300"
           :class="activeStep === step.key ? step.color : 'border-gray-300'"
         ></div>
         <span class="mt-2 text-[10px] font-bold uppercase tracking-wider" :class="activeStep === step.key ? 'text-gray-700' : 'text-gray-300'">{{ step.label }}</span>
      </div>
    </div>

    <!-- Output Console -->
    <div class="mt-4 bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 h-24 overflow-y-auto custom-scrollbar">
       <div v-for="(log, i) in logs" :key="i" class="mb-1 border-l-2 border-transparent pl-2" :class="{'border-green-500 bg-green-500/10': i === 0}">
         <span class="opacity-50">[{{ log.time }}]</span> {{ log.msg }}
       </div>
       <div v-if="logs.length === 0" class="text-gray-600 italic">Waiting for events...</div>
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

const status = ref<'unmounted' | 'mounted' | 'updating'>('unmounted');
const activeStep = ref('');
const logs = ref<{time: string, msg: string}[]>([]);

const steps = [
  { key: 'create', label: 'Setup', color: 'border-purple-500 bg-purple-500' },
  { key: 'mount', label: 'onMounted', color: 'border-green-500 bg-green-500' },
  { key: 'update', label: 'onUpdated', color: 'border-blue-500 bg-blue-500' },
  { key: 'unmount', label: 'onUnmounted', color: 'border-red-500 bg-red-500' },
];

const addLog = (msg: string) => {
  const time = new Date().toLocaleTimeString().split(' ')[0];
  logs.value.unshift({ time, msg });
};

const mountComponent = () => {
  activeStep.value = 'create';
  addLog('Component initialized (setup)');
  setTimeout(() => {
    activeStep.value = 'mount';
    status.value = 'mounted';
    addLog('DOM inserted into page (onMounted)');
  }, 800);
};

const updateComponent = () => {
  status.value = 'updating';
  addLog('State changed...');
  setTimeout(() => {
    activeStep.value = 'update';
    status.value = 'mounted';
    addLog('View re-rendered (onUpdated)');
  }, 800);
};

const unmountComponent = () => {
  addLog('Teardown requested...');
  setTimeout(() => {
    activeStep.value = 'unmount';
    status.value = 'unmounted';
    addLog('Cleaned up side-effects (onUnmounted)');
  }, 800);
};
</script>