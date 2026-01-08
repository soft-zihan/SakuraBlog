<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden border-2 border-orange-100 dark:border-gray-700 max-w-2xl mx-auto transition-all duration-500 relative">
    
    <!-- Game Start Screen -->
    <div v-if="gameState === 'start'" class="p-10 flex flex-col items-center justify-center text-center">
      <div class="text-6xl mb-6 animate-bounce">🥷</div>
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Vue Ninja Training</h2>
      <p class="text-gray-500 mb-8">Test your reflexes and Vue knowledge.</p>
      <button @click="startGame" class="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all text-lg">
        Start Training
      </button>
    </div>

    <!-- Playing Screen -->
    <div v-if="gameState === 'playing'" class="p-8">
      <div class="flex justify-between items-center mb-6">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-400">Question {{ currentQuestionIndex + 1 }} / {{ activeQuestions.length }}</div>
        <div class="flex items-center gap-2">
           <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
             <div class="h-full bg-orange-500 transition-all duration-1000 ease-linear" :style="{ width: (timer / 15 * 100) + '%' }"></div>
           </div>
           <span class="font-mono font-bold text-orange-600">{{ timer }}s</span>
        </div>
      </div>

      <div class="h-32 flex items-center justify-center mb-8">
        <h3 class="text-xl md:text-2xl font-bold text-center text-gray-800 dark:text-gray-100 leading-relaxed">
          {{ currentQuestion.text }}
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          v-for="(opt, idx) in currentQuestion.options" 
          :key="idx"
          @click="selectAnswer(idx)"
          class="p-4 rounded-xl border-2 font-bold text-left transition-all relative overflow-hidden group"
          :class="[
             selectedAnswer === null 
               ? 'border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700' 
               : (idx === currentQuestion.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : (idx === selectedAnswer ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'opacity-50'))
          ]"
          :disabled="selectedAnswer !== null"
        >
          <span class="mr-2 opacity-50">{{ ['A', 'B', 'C', 'D'][idx] }}.</span>
          <span>{{ opt }}</span>
        </button>
      </div>
      
      <div class="mt-4 h-6 text-center">
         <div v-if="feedback" class="font-bold animate-pulse" :class="feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'">{{ feedback }}</div>
      </div>
    </div>

    <!-- Result Screen -->
    <div v-if="gameState === 'ended'" class="p-10 text-center">
       <div class="text-6xl mb-4">{{ score > activeQuestions.length / 2 ? '🏆' : '📚' }}</div>
       <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Training Complete!</h2>
       <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">
         You scored <span class="font-bold text-orange-500">{{ score }}</span> / {{ activeQuestions.length }}
       </p>
       
       <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-8 text-sm text-left max-h-48 overflow-y-auto">
          <div v-if="score === activeQuestions.length">Perfect score! You are a true Vue Ninja! 🥷</div>
          <div v-else>Keep learning! Check the docs notes to improve your score.</div>
       </div>

       <button @click="startGame" class="px-8 py-3 bg-sakura-500 hover:bg-sakura-600 text-white font-bold rounded-xl shadow-lg transition-all">
         Try Again
       </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import _ from 'lodash';

type Question = {
  text: string;
  options: string[];
  correct: number;
};

// Expanded Question Pool (15 questions)
const allQuestions: Question[] = [
  { text: "Which function is used to create reactive state for primitives?", options: ["reactive()", "ref()", "computed()", "watch()"], correct: 1 },
  { text: "How do you emit an event from a child component in Script Setup?", options: ["this.$emit()", "defineProps()", "defineEmits()", "emit()"], correct: 2 },
  { text: "Which directive implements two-way data binding?", options: ["v-bind", "v-model", "v-on", "v-sync"], correct: 1 },
  { text: "Which lifecycle hook is called after the DOM is rendered?", options: ["onCreated", "onSetup", "onMounted", "onUpdated"], correct: 2 },
  { text: "In v-if vs v-show, which one removes the element from DOM?", options: ["v-show", "v-if", "Both", "Neither"], correct: 1 },
  { text: "What is the correct syntax to bind a dynamic attribute?", options: ["v-bind:id", ":id", "Both A and B", "None of the above"], correct: 2 },
  { text: "Which command creates a new Vue project via build tool?", options: ["npm create vue@latest", "npm install vue", "vue new app", "create-vue app"], correct: 0 },
  { text: "What is the purpose of 'computed' properties?", options: ["To trigger side effects", "To cache complex logic based on dependencies", "To fetch API data", "To define global variables"], correct: 1 },
  { text: "How do you pass data from Parent to Child?", options: ["Emits", "Props", "Slots", "Provide"], correct: 1 },
  { text: "Which tag is used to wrap dynamic components to keep them alive?", options: ["<keep-alive>", "<live-component>", "<persist>", "<cache>"], correct: 0 },
  { text: "What replaces 'this' keyword in Composition API?", options: ["self", "context", "Nothing, just use variables directly", "window"], correct: 2 },
  { text: "What does v-for require to track node identity?", options: ["id", "index", ":key", "name"], correct: 2 },
  { text: "Where should you perform DOM cleanup (e.g., remove listeners)?", options: ["onUnmounted", "onMounted", "onUpdated", "onBeforeMount"], correct: 0 },
  { text: "Which symbol acts as a prefix for Vue directives?", options: ["@", ":", "$", "v-"], correct: 3 },
  { text: "Can you use multiple root nodes in Vue 3 templates?", options: ["No", "Yes (Fragments)", "Only with v-if", "Only in JSX"], correct: 1 }
];

const gameState = ref<'start' | 'playing' | 'ended'>('start');
const activeQuestions = ref<Question[]>([]);
const currentQuestionIndex = ref(0);
const score = ref(0);
const timer = ref(15);
const selectedAnswer = ref<number | null>(null);
const feedback = ref('');
let timerInterval: any = null;

const currentQuestion = computed(() => activeQuestions.value[currentQuestionIndex.value]);

const startGame = () => {
  // Randomly select 5 unique questions
  activeQuestions.value = _.sampleSize(allQuestions, 5);
  
  gameState.value = 'playing';
  currentQuestionIndex.value = 0;
  score.value = 0;
  startTimer();
};

const startTimer = () => {
  timer.value = 15;
  selectedAnswer.value = null;
  feedback.value = '';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer.value--;
    if (timer.value <= 0) {
      handleTimeout();
    }
  }, 1000);
};

const handleTimeout = () => {
  clearInterval(timerInterval);
  selectedAnswer.value = -1; // No selection
  feedback.value = "Time's up!";
  setTimeout(nextQuestion, 1500);
};

const selectAnswer = (idx: number) => {
  clearInterval(timerInterval);
  selectedAnswer.value = idx;
  if (idx === currentQuestion.value.correct) {
    score.value++;
    feedback.value = "Correct!";
  } else {
    feedback.value = "Wrong!";
  }
  setTimeout(nextQuestion, 1500);
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < activeQuestions.value.length - 1) {
    currentQuestionIndex.value++;
    startTimer();
  } else {
    gameState.value = 'ended';
  }
};
</script>