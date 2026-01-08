<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden border-2 border-orange-100 dark:border-gray-700 max-w-2xl mx-auto transition-all duration-500 relative min-h-[500px] flex flex-col">
    
    <!-- Phase 1: Game Start (Category Selection) -->
    <div v-if="gameState === 'start'" class="p-8 flex flex-col items-center justify-center text-center flex-1 animate-fade-in">
      <div class="text-6xl mb-4 animate-bounce">🥷</div>
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">{{ t.lab_quiz_title }}</h2>
      <p class="text-gray-500 mb-8">{{ t.lab_quiz_subtitle }}</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        <button @click="selectCategory('all')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">🎲</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_all }}</span>
        </button>
        <button @click="selectCategory('basic')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">🎨</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_basic }}</span>
        </button>
        <button @click="selectCategory('js')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">⚡</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_js }}</span>
        </button>
        <button @click="selectCategory('vue')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">🥝</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_vue }}</span>
        </button>
      </div>
    </div>

    <!-- Phase 2: Playing Screen -->
    <div v-if="gameState === 'playing'" class="p-6 md:p-8 flex flex-col flex-1 animate-fade-in relative">
      
      <!-- Top Bar: Streak & Score -->
      <div class="flex justify-between items-center mb-6 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
         <div class="flex items-center gap-4">
            <div class="text-xs font-bold uppercase text-gray-400">Q {{ currentQuestionIndex + 1 }} / {{ activeQuestions.length }}</div>
            <div class="flex items-center gap-1 font-bold text-orange-500 transition-all" :class="{'scale-125': streak > 2}">
               <span>🔥</span> {{ t.quiz_streak }}: {{ streak }}
            </div>
         </div>
         <div class="font-mono font-bold text-sakura-600 dark:text-sakura-400">{{ t.quiz_score }}: {{ totalScore }}</div>
      </div>

      <!-- Timer Bar -->
      <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <div 
          class="h-full transition-all duration-1000 ease-linear" 
          :class="timer < 5 ? 'bg-red-500' : 'bg-orange-500'"
          :style="{ width: (timer / 15 * 100) + '%' }"
        ></div>
      </div>

      <!-- Question -->
      <div class="flex-1 flex items-center justify-center mb-8 min-h-[120px]">
        <h3 class="text-xl md:text-2xl font-bold text-center text-gray-800 dark:text-gray-100 leading-relaxed">
          {{ currentQuestion.text }}
        </h3>
      </div>

      <!-- Options -->
      <div class="grid grid-cols-1 gap-3 mb-6">
        <button 
          v-for="(opt, idx) in currentQuestion.options" 
          :key="idx"
          @click="selectAnswer(idx)"
          class="p-4 rounded-xl border-2 font-bold text-left transition-all relative overflow-hidden group flex items-center"
          :class="[
             hiddenOptions.includes(idx) ? 'opacity-20 pointer-events-none filter blur-sm' : '',
             selectedAnswer === null 
               ? 'border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700' 
               : (idx === currentQuestion.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : (idx === selectedAnswer ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'opacity-40'))
          ]"
          :disabled="selectedAnswer !== null || hiddenOptions.includes(idx)"
        >
          <span class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center mr-3 text-xs flex-shrink-0 group-hover:bg-white transition-colors">
            {{ ['A', 'B', 'C', 'D'][idx] }}
          </span>
          <span class="flex-1">{{ opt }}</span>
          
          <!-- Result Icon -->
          <span v-if="selectedAnswer !== null && idx === currentQuestion.correct" class="text-green-500 ml-2">✓</span>
          <span v-if="selectedAnswer !== null && idx === selectedAnswer && idx !== currentQuestion.correct" class="text-red-500 ml-2">✗</span>
        </button>
      </div>

      <!-- Bottom Bar: Lifelines -->
      <div class="mt-auto flex justify-between items-center h-12">
         <div class="text-sm font-bold" :class="feedbackClass">{{ feedback }}</div>
         
         <!-- Lifeline: 50/50 -->
         <button 
           @click="use5050" 
           :disabled="lifelines.fiftyFiftyUsed || selectedAnswer !== null"
           class="px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition-all"
           :class="lifelines.fiftyFiftyUsed ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-400'"
           title="Remove 2 wrong answers"
         >
           <span>✂️</span> {{ t.quiz_lifeline_5050 }}
         </button>
      </div>
    </div>

    <!-- Phase 3: Result Screen -->
    <div v-if="gameState === 'ended'" class="p-8 flex flex-col items-center text-center animate-fade-in flex-1">
       <div class="text-6xl mb-4">{{ totalScore > activeQuestions.length * 8 ? '🏆' : (totalScore > activeQuestions.length * 5 ? '🥈' : '📚') }}</div>
       <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Training Complete!</h2>
       
       <div class="flex gap-8 my-6">
          <div class="flex flex-col">
             <span class="text-3xl font-bold text-orange-500">{{ correctCount }}</span>
             <span class="text-xs text-gray-400 uppercase">Correct</span>
          </div>
          <div class="flex flex-col">
             <span class="text-3xl font-bold text-sakura-500">{{ totalScore }}</span>
             <span class="text-xs text-gray-400 uppercase">Score</span>
          </div>
           <div class="flex flex-col">
             <span class="text-3xl font-bold text-blue-500">{{ maxStreak }}</span>
             <span class="text-xs text-gray-400 uppercase">Best Streak</span>
          </div>
       </div>
       
       <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 italic">
         "{{ getEndMessage() }}"
       </p>

       <!-- Wrong Answers Review -->
       <div v-if="reviewList.length > 0" class="w-full bg-red-50 dark:bg-gray-900/50 rounded-xl p-4 mb-8 text-left border border-red-100 dark:border-red-900/30">
          <h3 class="font-bold text-red-500 mb-4 flex items-center gap-2">
            <span>📝</span> {{ t.quiz_review }}
          </h3>
          <div class="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
             <div v-for="(item, idx) in reviewList" :key="idx" class="text-sm border-b border-red-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <div class="font-bold text-gray-700 dark:text-gray-200 mb-1">{{ idx + 1 }}. {{ item.question.text }}</div>
                <div class="text-red-500 text-xs mb-1">✗ {{ item.question.options[item.userAnswer] }}</div>
                <div class="text-green-600 text-xs mb-1">✓ {{ item.question.options[item.question.correct] }}</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs italic bg-white dark:bg-gray-800 p-2 rounded mt-2">
                   <span class="font-bold text-gray-400">{{ t.quiz_explanation }}:</span> {{ item.question.explanation }}
                </div>
             </div>
          </div>
       </div>

       <div class="flex gap-4">
         <button @click="resetGame" class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold rounded-xl transition-all">
           Categories
         </button>
         <button @click="startGame(lastCategory)" class="px-8 py-2 bg-sakura-500 hover:bg-sakura-600 text-white font-bold rounded-xl shadow-lg transition-all">
           Try Again
         </button>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import _ from 'lodash';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

type Category = 'basic' | 'js' | 'vue' | 'all';

type Question = {
  text: string;
  options: string[];
  correct: number;
  category: Category;
  explanation: string;
};

// --- Data: 50 Questions Pool ---
const allQuestions: Question[] = [
  // HTML/CSS (Basic)
  { category: 'basic', text: "What does the <a> tag stand for?", options: ["Anchor", "Article", "Aside", "Application"], correct: 0, explanation: "<a> stands for Anchor, defining a hyperlink." },
  { category: 'basic', text: "Which HTML5 tag is used for semantic navigation?", options: ["<div class='nav'>", "<navigation>", "<nav>", "<menu>"], correct: 2, explanation: "<nav> is the correct semantic tag for navigation links." },
  { category: 'basic', text: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "foreground"], correct: 2, explanation: "The 'color' property sets the color of the text." },
  { category: 'basic', text: "How do you center a flex item horizontally?", options: ["align-items: center", "justify-content: center", "text-align: center", "vertical-align: middle"], correct: 1, explanation: "In a flex row, 'justify-content' controls horizontal alignment." },
  { category: 'basic', text: "What is the Box Model order (inside out)?", options: ["Content > Margin > Border > Padding", "Content > Padding > Border > Margin", "Border > Content > Padding > Margin", "Padding > Content > Margin > Border"], correct: 1, explanation: "Content is core, surrounded by Padding, then Border, then Margin." },
  { category: 'basic', text: "Which unit is relative to the root HTML element font size?", options: ["em", "rem", "px", "%"], correct: 1, explanation: "'rem' stands for Root EM." },
  { category: 'basic', text: "Which selector has the highest specificity?", options: [".class", "#id", "div", "*"], correct: 1, explanation: "ID selectors (#) have higher specificity than classes and tags." },
  { category: 'basic', text: "How to make a grid with 3 equal columns?", options: ["display: grid; grid-template-columns: 1fr 1fr 1fr;", "display: grid; columns: 3;", "display: flex; flex: 3;", "grid-columns: auto auto auto;"], correct: 0, explanation: "1fr 1fr 1fr creates three equal fractional columns." },
  { category: 'basic', text: "Which pseudo-class selects the mouse-over state?", options: [":active", ":focus", ":hover", ":visited"], correct: 2, explanation: ":hover applies when the user mouses over an element." },
  { category: 'basic', text: "What is the default display value of <div>?", options: ["inline", "block", "inline-block", "flex"], correct: 1, explanation: "<div> is a block-level element by default." },

  // JavaScript (JS)
  { category: 'js', text: "Which keyword creates a constant variable?", options: ["var", "let", "const", "final"], correct: 2, explanation: "'const' declares variables that cannot be reassigned." },
  { category: 'js', text: "What is 'Closure'?", options: ["A function closing the app", "A function remembering its lexical scope", "A block of code inside {}", "An object method"], correct: 1, explanation: "A closure gives a function access to its outer function's scope even after the outer function has returned." },
  { category: 'js', text: "What does '===' operator do?", options: ["Assignment", "Loose equality (value only)", "Strict equality (value & type)", "Reference check"], correct: 2, explanation: "=== checks both value and type without type coercion." },
  { category: 'js', text: "Which array method returns a new array with transformed elements?", options: ["forEach", "filter", "map", "reduce"], correct: 2, explanation: ".map() creates a new array by applying a function to every element." },
  { category: 'js', text: "What is the output of: console.log(typeof null)?", options: ["'null'", "'undefined'", "'object'", "'number'"], correct: 2, explanation: "This is a historical bug in JS. typeof null returns 'object'." },
  { category: 'js', text: "How do you handle asynchronous code in modern JS?", options: ["Callbacks only", "Promise & async/await", "XMLHttpRequest", "Threads"], correct: 1, explanation: "Promises and async/await are the modern standard for async operations." },
  { category: 'js', text: "What keyword refers to the object executing the current function?", options: ["self", "it", "this", "me"], correct: 2, explanation: "'this' refers to the context object." },
  { category: 'js', text: "How to parse a JSON string into an object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.toObj()"], correct: 1, explanation: "JSON.parse() converts a JSON string to a JS object." },
  { category: 'js', text: "What is Event Bubbling?", options: ["Events stop at target", "Events go from target up to window", "Events go from window down to target", "Creating a custom event"], correct: 1, explanation: "Bubbling propagates the event from the target element up to the root." },
  { category: 'js', text: "Which is NOT a primitive type?", options: ["String", "Boolean", "Array", "Symbol"], correct: 2, explanation: "Array is a subtype of Object in JS." },

  // Vue Core & Ecosystem (Vue)
  { category: 'vue', text: "Which function creates reactive state for primitives?", options: ["reactive()", "ref()", "computed()", "watch()"], correct: 1, explanation: "ref() is used for primitives (and objects), reactive() is essentially for objects." },
  { category: 'vue', text: "How do you emit an event in <script setup>?", options: ["this.$emit", "defineProps", "defineEmits", "useEmit"], correct: 2, explanation: "defineEmits is the compiler macro used in script setup." },
  { category: 'vue', text: "Which directive creates two-way binding?", options: ["v-bind", "v-model", "v-on", "v-sync"], correct: 1, explanation: "v-model implements two-way binding for form inputs and components." },
  { category: 'vue', text: "Which hook runs after DOM is rendered?", options: ["onCreated", "onSetup", "onMounted", "onUpdated"], correct: 2, explanation: "onMounted is called after the component is mounted to the DOM." },
  { category: 'vue', text: "Difference between v-if and v-show?", options: ["v-show removes element", "v-if toggles CSS display", "v-if removes element", "No difference"], correct: 2, explanation: "v-if physically adds/removes the element; v-show just toggles 'display: none'." },
  { category: 'vue', text: "Shorthand for v-bind?", options: ["@", ":", "#", "$"], correct: 1, explanation: ":href is shorthand for v-bind:href." },
  { category: 'vue', text: "What is Pinia used for?", options: ["Routing", "State Management", "Styling", "Testing"], correct: 1, explanation: "Pinia is the official state management library for Vue." },
  { category: 'vue', text: "Which component keeps dynamic components alive?", options: ["<keep-alive>", "<live>", "<cache>", "<persist>"], correct: 0, explanation: "<keep-alive> caches component instances." },
  { category: 'vue', text: "In Vue Router, how to create a link?", options: ["<a href='...'>", "<router-link>", "<go-to>", "<link>"], correct: 1, explanation: "<router-link> (or RouterLink) creates a navigational link." },
  { category: 'vue', text: "What is the purpose of 'computed'?", options: ["Side effects", "Caching derived state", "Fetching data", "Defining constants"], correct: 1, explanation: "Computed properties cache results based on dependencies." },
  { category: 'vue', text: "What replaces 'this' in Composition API?", options: ["self", "Nothing (variables directly)", "ctx", "scope"], correct: 1, explanation: "In Composition API, we use variables directly within the setup scope." },
  { category: 'vue', text: "How to pass content into a component?", options: ["Props", "Slots", "Emits", "Provide"], correct: 1, explanation: "Slots allow passing template content into a component." },
  { category: 'vue', text: "Which directive loops over an array?", options: ["v-loop", "v-map", "v-for", "v-each"], correct: 2, explanation: "v-for='item in items' is the loop directive." },
  { category: 'vue', text: "What is 'Prop Drilling' solution in Vue?", options: ["Provide/Inject", "Props", "Emits", "Refs"], correct: 0, explanation: "Provide/Inject allows passing data deep into the component tree without prop drilling." },
  { category: 'vue', text: "Vue 3's build tool?", options: ["Webpack", "Vite", "Gulp", "Grunt"], correct: 1, explanation: "Vite is the default, ultra-fast build tool for Vue 3." }
];

// --- State ---
const gameState = ref<'start' | 'playing' | 'ended'>('start');
const activeQuestions = ref<Question[]>([]);
const currentQuestionIndex = ref(0);
const lastCategory = ref<Category>('all');

// Scoring & Gamification
const correctCount = ref(0);
const totalScore = ref(0);
const streak = ref(0);
const maxStreak = ref(0);
const timer = ref(15);
const selectedAnswer = ref<number | null>(null);
const feedback = ref('');
const reviewList = ref<{question: Question, userAnswer: number}[]>([]);
const lifelines = ref({ fiftyFiftyUsed: false });
const hiddenOptions = ref<number[]>([]);

let timerInterval: any = null;

// --- Computed ---
const currentQuestion = computed(() => activeQuestions.value[currentQuestionIndex.value]);
const feedbackClass = computed(() => feedback.value.includes('✓') ? 'text-green-500 animate-bounce' : 'text-red-500 animate-pulse');

// --- Methods ---

const selectCategory = (cat: Category) => {
  lastCategory.value = cat;
  startGame(cat);
};

const startGame = (cat: Category) => {
  // Filter & Shuffle
  let pool = cat === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.category === cat || (cat === 'vue' && q.category === 'basic')); // Fallback slightly if not enough
  
  if (pool.length < 5) pool = allQuestions; // Safety net

  // Pick 10 random questions
  activeQuestions.value = _.sampleSize(pool, 10);
  
  // Reset State
  gameState.value = 'playing';
  currentQuestionIndex.value = 0;
  correctCount.value = 0;
  totalScore.value = 0;
  streak.value = 0;
  maxStreak.value = 0;
  reviewList.value = [];
  lifelines.value = { fiftyFiftyUsed: false };
  
  startTimer();
};

const startTimer = () => {
  timer.value = 15;
  selectedAnswer.value = null;
  feedback.value = '';
  hiddenOptions.value = []; // Reset hidden options
  
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
  selectedAnswer.value = -1; // -1 indicates timeout/no selection
  feedback.value = "⏰ Time's up!";
  streak.value = 0; // Reset streak
  
  // Add to review
  reviewList.value.push({
    question: currentQuestion.value,
    userAnswer: -1
  });

  setTimeout(nextQuestion, 2000);
};

const selectAnswer = (idx: number) => {
  clearInterval(timerInterval);
  selectedAnswer.value = idx;
  
  const isCorrect = idx === currentQuestion.value.correct;

  if (isCorrect) {
    correctCount.value++;
    streak.value++;
    if (streak.value > maxStreak.value) maxStreak.value = streak.value;
    
    // Calculate Score: Base 100 + Time Bonus + Streak Bonus
    const timeBonus = timer.value * 10;
    const streakBonus = (streak.value - 1) * 20;
    totalScore.value += (100 + timeBonus + streakBonus);

    feedback.value = "✓ Correct! " + (streak.value > 1 ? `${streak.value} Streak! 🔥` : '');
  } else {
    streak.value = 0;
    feedback.value = "✗ Wrong!";
    // Add to review
    reviewList.value.push({
      question: currentQuestion.value,
      userAnswer: idx
    });
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

const use5050 = () => {
  if (lifelines.value.fiftyFiftyUsed) return;
  
  lifelines.value.fiftyFiftyUsed = true;
  const correct = currentQuestion.value.correct;
  const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
  
  // Randomly hide 2 wrong answers
  const toHide = _.sampleSize(wrongIndices, 2);
  hiddenOptions.value = toHide;
};

const getEndMessage = () => {
  const percentage = correctCount.value / activeQuestions.value.length;
  if (percentage === 1) return t.value.quiz_perfect;
  if (percentage >= 0.6) return t.value.quiz_good;
  return t.value.quiz_try;
};

const resetGame = () => {
   gameState.value = 'start';
};
</script>