<template>
  <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 flex flex-col relative shadow-xl">
    <div class="absolute -top-3 left-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
      {{ t.lab_props_child }}
    </div>

    <div class="flex-1 flex flex-col items-center justify-center py-6">
      <div class="relative transition-all duration-500" :class="isActive ? 'filter-none scale-100' : 'grayscale opacity-70 scale-95'">
        <div class="w-1 h-6 bg-gray-400 mx-auto transition-colors" :class="isActive ? 'bg-indigo-400' : 'bg-gray-400'"></div>
        <div class="w-3 h-3 rounded-full mx-auto -mb-1 animate-ping absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-400" v-if="isActive"></div>

        <div class="w-32 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl border-4 border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative shadow-lg">
          <div class="text-center p-2 w-full">
            <div class="text-[10px] font-bold text-gray-400 uppercase mb-1">Incoming Message</div>
            <div class="font-mono text-sm text-indigo-600 dark:text-indigo-300 truncate font-bold bg-indigo-50 dark:bg-gray-800 rounded px-1">{{ message || '...' }}</div>
          </div>
          <div class="absolute bottom-1 flex gap-8 opacity-20">
            <div class="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
            <div class="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
          </div>
        </div>

        <div class="w-20 h-16 bg-gray-200 dark:bg-gray-600 mx-auto rounded-b-xl border-x-4 border-b-4 border-gray-300 dark:border-gray-500 relative mt-[-4px] z-[-1]">
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 transition-colors duration-500 bg-white dark:bg-gray-800 flex items-center justify-center"
            :class="isActive ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'border-red-500'"
          >
            <div class="w-2 h-2 rounded-full" :class="isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></div>
          </div>
        </div>
      </div>

      <div class="mt-4 text-[11px] font-mono text-gray-500 dark:text-gray-400">
        hp: <span class="font-bold" :class="hp > 0 ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'">{{ hp }}</span>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <label class="text-[10px] font-bold text-gray-400 uppercase block mb-2 text-center">Emit Events to Parent</label>
      <div class="flex gap-3">
        <button
          type="button"
          :disabled="!isActive || hp <= 0"
          class="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="$emit('damage', 10)"
        >
          💥 {{ t.lab_props_action_hit }}
        </button>
        <button
          type="button"
          :disabled="!isActive"
          class="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 py-2 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="$emit('heal', 20)"
        >
          💊 {{ t.lab_props_action_heal }}
        </button>
      </div>
    </div>

    <div class="hidden md:block absolute bottom-10 -left-6 transform z-10">
      <div class="flex flex-col gap-1 items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500 animate-bounce"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span class="text-[10px] font-bold text-yellow-500">Emit</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { I18N } from '../../../constants'

const props = defineProps<{
  lang: 'en' | 'zh'
  message: string
  isActive: boolean
  hp: number
}>()

defineEmits<{
  (e: 'damage', amount: number): void
  (e: 'heal', amount: number): void
}>()

const t = computed(() => I18N[props.lang])
</script>
