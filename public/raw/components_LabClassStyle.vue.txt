<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-pink-100 dark:border-gray-700 shadow-sm backdrop-blur-md h-full flex flex-col">
    <h3 class="text-lg font-bold text-pink-800 dark:text-pink-300 mb-2 flex items-center gap-2">
      {{ t.lab_class_title }}
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ t.lab_class_info }}</p>

    <div class="flex flex-col xl:flex-row gap-8 flex-1">
      
      <!-- Controls -->
      <div class="flex-1 space-y-6">
        
        <!-- Class Binding Controls -->
        <div class="bg-pink-50 dark:bg-gray-900 rounded-xl p-5 border border-pink-100 dark:border-gray-700">
           <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{{ t.lab_class_toggle }}</h4>
           
           <div class="space-y-3">
              <label class="flex items-center justify-between cursor-pointer group">
                 <span class="font-mono text-sm text-gray-700 dark:text-gray-200 group-hover:text-pink-600 transition-colors">isActive: boolean</span>
                 <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="classState.isActive" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                 </div>
              </label>

              <label class="flex items-center justify-between cursor-pointer group">
                 <span class="font-mono text-sm text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors">hasError: boolean</span>
                 <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="classState.hasError" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                 </div>
              </label>
           </div>
        </div>

        <!-- Style Binding Controls -->
        <div class="bg-blue-50 dark:bg-gray-900 rounded-xl p-5 border border-blue-100 dark:border-gray-700">
           <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{{ t.lab_class_style_ctrl }}</h4>
           
           <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                   <span>borderRadius</span>
                   <span class="font-mono">{{ styleState.borderRadius }}px</span>
                </div>
                <input type="range" v-model.number="styleState.borderRadius" min="0" max="50" class="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
              </div>
              
              <div>
                 <div class="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                   <span>rotate</span>
                   <span class="font-mono">{{ styleState.rotate }}deg</span>
                </div>
                <input type="range" v-model.number="styleState.rotate" min="0" max="360" class="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
              </div>

               <div class="flex items-center justify-between">
                 <span class="text-xs text-gray-600 dark:text-gray-300">textColor</span>
                 <input type="color" v-model="styleState.color" class="w-8 h-8 rounded cursor-pointer border-none p-0">
               </div>
           </div>
        </div>

      </div>

      <!-- Preview Area -->
      <div class="flex-1 flex flex-col gap-6">
         
         <!-- Visual Result -->
         <div class="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden min-h-[200px]">
            <div class="absolute top-2 left-2 text-[10px] text-gray-400 font-bold uppercase">{{ t.lab_class_result }}</div>
            
            <div 
               class="w-32 h-32 flex items-center justify-center font-bold text-lg shadow-xl transition-all duration-300 border-4"
               :class="{ 
                 'bg-pink-500 border-pink-600 text-white': classState.isActive,
                 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600': !classState.isActive,
                 'ring-4 ring-red-400 ring-offset-2': classState.hasError
               }"
               :style="{
                 borderRadius: styleState.borderRadius + 'px',
                 transform: `rotate(${styleState.rotate}deg)`,
                 color: classState.isActive ? 'white' : styleState.color
               }"
            >
               Vue
            </div>
         </div>

         <!-- Code Generated -->
         <div class="bg-[#1e1e1e] rounded-xl p-4 shadow-inner border border-gray-700 flex flex-col h-48">
            <div class="text-[10px] text-gray-500 border-b border-gray-700 pb-2 mb-2 font-mono flex items-center gap-2">
               <div class="w-2 h-2 rounded-full bg-green-500"></div> {{ t.lab_class_code }}
            </div>
            <div class="overflow-auto custom-scrollbar font-mono text-xs leading-relaxed">
               <div class="text-pink-400 mb-2">
                  &lt;div <span class="text-blue-400">:class</span>="<span class="text-yellow-300">{{ classObject }}</span>"
               </div>
               <div class="text-pink-400">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-400">:style</span>="<span class="text-green-300">{{ styleObject }}</span>"
               </div>
               <div class="text-pink-400 mt-2">&gt;</div>
            </div>
         </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const classState = reactive({
  isActive: true,
  hasError: false
});

const styleState = reactive({
  borderRadius: 12,
  rotate: 0,
  color: '#3b82f6'
});

const classObject = computed(() => {
  return `{ isActive: ${classState.isActive}, hasError: ${classState.hasError} }`;
});

const styleObject = computed(() => {
  return `{ 
  borderRadius: '${styleState.borderRadius}px',
  transform: 'rotate(${styleState.rotate}deg)',
  color: '${styleState.color}'
}`;
});
</script>