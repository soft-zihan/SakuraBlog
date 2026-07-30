<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">🔄 Event Loop Simulator</h2>
      <p class="text-gray-500 text-sm">Visualize Call Stack, Web APIs, Microtasks, and Macrotasks</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Code & Controls -->
      <div class="lg:col-span-1 flex flex-col gap-4">
        <div class="bg-gray-900 rounded-xl overflow-hidden flex flex-col flex-1 min-h-[300px]">
          <div class="px-4 py-2 bg-gray-800 text-gray-400 text-xs font-bold border-b border-gray-700">
            JS Code
          </div>
          <div class="p-4 font-mono text-sm text-blue-300 whitespace-pre leading-relaxed flex-1 overflow-auto">
<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 1 }">console.log('Start');</span>

<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 2 }">setTimeout(() => {</span>
<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 3 }">  console.log('Timeout');</span>
<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 4 }">}, 0);</span>

<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 5 }">Promise.resolve().then(() => {</span>
<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 6 }">  console.log('Promise');</span>
<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 7 }">});</span>

<span :class="{ 'bg-yellow-500/30 text-yellow-200': currentLine === 8 }">console.log('End');</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button 
            @click="step" 
            :disabled="isFinished"
            class="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            {{ isFinished ? 'Finished' : 'Step ➡️' }}
          </button>
          <button 
            @click="reset" 
            class="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Right: Visualization -->
      <div class="lg:col-span-2 grid grid-cols-2 gap-4">
        
        <!-- Call Stack -->
        <div class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col h-[200px] relative">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Call Stack</h3>
          <div class="flex-1 flex flex-col-reverse justify-start gap-2 overflow-hidden border-t border-gray-100 dark:border-gray-800 pt-2">
             <transition-group name="list">
               <div v-for="frame in callStack" :key="frame.id" class="bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 p-2 rounded text-center text-sm font-mono shadow-sm">
                 {{ frame.name }}
               </div>
             </transition-group>
          </div>
        </div>

        <!-- Web APIs -->
        <div class="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 flex flex-col h-[200px]">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Web APIs</h3>
          <div class="flex-1 flex flex-col gap-2 relative">
             <transition-group name="list">
               <div v-for="api in webApis" :key="api.id" class="bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 p-2 rounded text-center text-sm font-mono shadow-sm flex justify-between items-center">
                 <span>{{ api.name }}</span>
                 <span class="text-xs opacity-70">{{ api.timeLeft }}ms</span>
               </div>
             </transition-group>
          </div>
        </div>

        <!-- Microtask Queue -->
        <div class="bg-white dark:bg-gray-900 border-2 border-yellow-200 dark:border-yellow-800/50 rounded-xl p-4 flex flex-col h-[150px]">
          <h3 class="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-2">
            Microtask Queue
            <span class="text-[10px] bg-yellow-100 dark:bg-yellow-900/50 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-300">Promise</span>
          </h3>
          <div class="flex-1 flex items-center gap-2 overflow-x-auto px-2">
             <transition-group name="list-h">
               <div v-for="task in microTasks" :key="task.id" class="bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded text-sm font-mono shadow-sm whitespace-nowrap">
                 {{ task.name }}
               </div>
             </transition-group>
          </div>
        </div>

        <!-- Callback Queue (Macrotask) -->
        <div class="bg-white dark:bg-gray-900 border-2 border-green-200 dark:border-green-800/50 rounded-xl p-4 flex flex-col h-[150px]">
          <h3 class="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-2">
             Callback Queue
             <span class="text-[10px] bg-green-100 dark:bg-green-900/50 px-1.5 py-0.5 rounded text-green-700 dark:text-green-300">Macrotask</span>
          </h3>
          <div class="flex-1 flex items-center gap-2 overflow-x-auto px-2">
             <transition-group name="list-h">
               <div v-for="task in macroTasks" :key="task.id" class="bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-3 py-2 rounded text-sm font-mono shadow-sm whitespace-nowrap">
                 {{ task.name }}
               </div>
             </transition-group>
          </div>
        </div>

      </div>
    </div>
    
    <!-- Console Log -->
    <div class="mt-6 bg-black rounded-xl p-4 font-mono text-sm h-32 overflow-auto border border-gray-700 shadow-inner">
       <div class="text-gray-500 text-xs mb-2 border-b border-gray-800 pb-1">Console Output</div>
       <div v-for="(log, i) in logs" :key="i" class="text-green-400 mb-1">
         > {{ log }}
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

type Task = { id: number, name: string, timeLeft?: number }

const stepIndex = ref(0)
const currentLine = ref(0)
const callStack = ref<Task[]>([])
const webApis = ref<Task[]>([])
const microTasks = ref<Task[]>([])
const macroTasks = ref<Task[]>([])
const logs = ref<string[]>([])
const isFinished = ref(false)

// Simulation steps
// 0: Start
// 1: console.log('Start')
// 2: setTimeout() -> Call Stack
// 3: setTimeout() -> Web APIs
// 4: Promise.resolve().then() -> Call Stack
// 5: Promise.then() -> Microtask Queue
// 6: console.log('End')
// 7: Main Script Done (Stack Empty)
// 8: Process Microtasks -> console.log('Promise')
// 9: Timer Done -> Web APIs -> Callback Queue
// 10: Event Loop -> Callback Queue -> Stack -> console.log('Timeout')

const steps = [
  // Step 1: console.log('Start')
  () => {
    currentLine.value = 1
    callStack.value.push({ id: 1, name: "console.log('Start')" })
    logs.value.push('Start')
  },
  () => {
    callStack.value.pop()
  },
  
  // Step 2: setTimeout
  () => {
    currentLine.value = 2
    callStack.value.push({ id: 2, name: "setTimeout" })
  },
  () => {
    callStack.value.pop()
    webApis.value.push({ id: 3, name: "Timer(0ms)", timeLeft: 0 })
    currentLine.value = 4
  },
  
  // Step 3: Promise
  () => {
    currentLine.value = 5
    callStack.value.push({ id: 4, name: "Promise.then" })
  },
  () => {
    callStack.value.pop()
    microTasks.value.push({ id: 5, name: "() => log('Promise')" })
    currentLine.value = 7
  },
  
  // Step 4: console.log('End')
  () => {
    currentLine.value = 8
    callStack.value.push({ id: 6, name: "console.log('End')" })
    logs.value.push('End')
  },
  () => {
    callStack.value.pop()
  },
  
  // Step 5: Microtasks
  () => {
    currentLine.value = -1 // System check
    // Event Loop checks Microtasks
  },
  () => {
    const task = microTasks.value.shift()
    if (task) {
      currentLine.value = 6
      callStack.value.push({ id: 7, name: "console.log('Promise')" })
      logs.value.push('Promise')
    }
  },
  () => {
    callStack.value.pop()
  },
  
  // Step 6: Macrotasks
  () => {
    // Timer completes
    const api = webApis.value.shift()
    if (api) {
      macroTasks.value.push({ id: 8, name: "() => log('Timeout')" })
    }
  },
  () => {
    const task = macroTasks.value.shift()
    if (task) {
      currentLine.value = 3
      callStack.value.push({ id: 9, name: "console.log('Timeout')" })
      logs.value.push('Timeout')
    }
  },
  () => {
    callStack.value.pop()
    isFinished.value = true
    currentLine.value = 0
  }
]

function step() {
  if (stepIndex.value < steps.length) {
    steps[stepIndex.value]()
    stepIndex.value++
  }
}

function reset() {
  stepIndex.value = 0
  currentLine.value = 0
  callStack.value = []
  webApis.value = []
  microTasks.value = []
  macroTasks.value = []
  logs.value = []
  isFinished.value = false
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active,
.list-h-enter-active,
.list-h-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-h-enter-from,
.list-h-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
