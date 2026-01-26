
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
         <div class="font-mono font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)]">{{ t.quiz_score }}: {{ totalScore }}</div>
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
          {{ currentQuestionSafe.text }}
        </h3>
      </div>

      <!-- Options -->
      <div class="grid grid-cols-1 gap-3 mb-6">
        <button 
          v-for="(opt, idx) in currentQuestionSafe.options" 
          :key="idx"
          @click="selectAnswer(idx)"
          class="p-4 rounded-xl border-2 font-bold text-left transition-all relative overflow-hidden group flex items-center"
          :class="[
             hiddenOptions.includes(idx) ? 'opacity-20 pointer-events-none filter blur-sm' : '',
             selectedAnswer === null 
               ? 'border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700' 
               : (idx === currentCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : (idx === selectedAnswer ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'opacity-40'))
          ]"
          :disabled="selectedAnswer !== null || hiddenOptions.includes(idx)"
        >
          <span class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center mr-3 text-xs flex-shrink-0 group-hover:bg-white transition-colors">
            {{ ['A', 'B', 'C', 'D'][idx] }}
          </span>
          <span class="flex-1">{{ opt }}</span>
          
          <!-- Result Icon -->
          <span v-if="selectedAnswer !== null && idx === currentCorrect" class="text-green-500 ml-2">✓</span>
          <span v-if="selectedAnswer !== null && idx === selectedAnswer && idx !== currentCorrect" class="text-red-500 ml-2">✗</span>
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
                <div class="font-bold text-gray-700 dark:text-gray-200 mb-1">{{ idx + 1 }}. {{ item.question.content[props.lang].text }}</div>
                <div class="text-red-500 text-xs mb-1">✗ {{ item.question.content[props.lang].options[item.userAnswer] }}</div>
                <div class="text-green-600 text-xs mb-1">✓ {{ item.question.content[props.lang].options[item.question.correct] }}</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs italic bg-white dark:bg-gray-800 p-2 rounded mt-2">
                   <span class="font-bold text-gray-400">{{ t.quiz_explanation }}:</span> {{ item.question.content[props.lang].explanation }}
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
import { I18N } from '../../../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

type Category = 'basic' | 'js' | 'vue' | 'all';

// Dual-language Content
type LocalizedContent = {
  text: string;
  options: string[];
  explanation: string;
}

type Question = {
  category: Category;
  correct: number;
  content: {
    en: LocalizedContent;
    zh: LocalizedContent;
  }
};

// --- Data: Questions ---
const allQuestions: Question[] = [
  // HTML/CSS
  { 
    category: 'basic', 
    correct: 0, 
    content: {
      en: { text: "What is HTML responsible for?", options: ["Structure", "Presentation", "Behavior", "Database"], explanation: "HTML defines the structure (What is on the page)." },
      zh: { text: "HTML 在网页开发中负责什么？", options: ["结构 (Structure)", "表现 (Presentation)", "行为 (Behavior)", "数据库"], explanation: "HTML 负责网页的骨架和结构。" }
    }
  },
  { 
    category: 'basic', 
    correct: 1, 
    content: {
      en: { text: "What is CSS responsible for?", options: ["Structure", "Presentation", "Behavior", "Server logic"], explanation: "CSS (Cascading Style Sheets) controls the presentation and styling." },
      zh: { text: "CSS 负责什么？", options: ["结构", "表现 (样式/皮肤)", "交互行为", "后端逻辑"], explanation: "CSS 负责页面的表现，如颜色、布局、大小。" }
    }
  },
  { 
    category: 'basic', 
    correct: 2, 
    content: {
      en: { text: "Which language provides page 'Behavior'?", options: ["HTML", "CSS", "JavaScript", "SQL"], explanation: "JavaScript is the soul that provides interactivity (Behavior)." },
      zh: { text: "哪种语言赋予网页“行为” (Behavior)？", options: ["HTML", "CSS", "JavaScript", "SQL"], explanation: "JS 是网页的肌肉/灵魂，定义页面如何与用户交互。" }
    }
  },
  // JS
  { 
    category: 'js', 
    correct: 2, 
    content: {
      en: { text: "What is the output of: typeof null ?", options: ["null", "undefined", "object", "number"], explanation: "This is a known quirk in JS. typeof null returns 'object'." },
      zh: { text: "JS 中 typeof null 的结果是什么？", options: ["null", "undefined", "object", "number"], explanation: "这是 JS 的一个历史遗留特性，typeof null 返回 'object'。" }
    }
  },
  { 
    category: 'js', 
    correct: 1, 
    content: {
      en: { text: "Difference between == and === ?", options: ["No difference", "== converts type, === checks type & value", "=== converts type", "Both check type"], explanation: "== performs type coercion (1 == '1'), === does not (1 !== '1')." },
      zh: { text: "== 和 === 的区别是？", options: ["没区别", "== 会转换类型，=== 严格比较类型和值", "=== 会转换类型", "都比较类型"], explanation: "== 是宽松相等（进行隐式类型转换），=== 是严格相等（值和类型都必须相同）。" }
    }
  },
  { 
    category: 'js', 
    correct: 0, 
    content: {
      en: { text: "How to parse a JSON string?", options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "JSON.read()"], explanation: "JSON.parse() converts a JSON string into a JavaScript object." },
      zh: { text: "如何将 JSON 字符串转为 JS 对象？", options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "JSON.read()"], explanation: "JSON.parse() 用于解析 JSON 字符串。" }
    }
  },
  // Vue
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "Vue is a _____ framework.", options: ["Regressive", "Progressive", "Backend", "Static"], explanation: "Vue is a 'Progressive' framework, meaning you can use it gradually." },
      zh: { text: "Vue 是一个 ______ 框架。", options: ["退步式", "渐进式 (Progressive)", "后端", "静态"], explanation: "Vue 是渐进式框架，意味着你可以只在页面的一部分使用它，也可以构建整个应用。" }
    }
  },
  { 
    category: 'vue', 
    correct: 2, 
    content: {
      en: { text: "Which directive loops through an array?", options: ["v-loop", "v-each", "v-for", "v-map"], explanation: "Syntax: v-for='item in items'." },
      zh: { text: "哪个指令用于遍历数组？", options: ["v-loop", "v-each", "v-for", "v-map"], explanation: "v-for 指令用于基于数组渲染列表。" }
    }
  },
  { 
    category: 'vue', 
    correct: 0, 
    content: {
      en: { text: "Syntax for two-way binding?", options: ["v-model", "v-bind", "v-on", "v-connect"], explanation: "v-model creates a two-way binding on form inputs." },
      zh: { text: "双向数据绑定的指令是？", options: ["v-model", "v-bind", "v-on", "v-connect"], explanation: "v-model 用于在表单元素上创建双向数据绑定。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "What is the shorthand for v-bind?", options: ["@", ": (colon)", "#", "$"], explanation: "v-bind:href can be written as :href." },
      zh: { text: "v-bind 的缩写是什么？", options: ["@", ": (冒号)", "#", "$"], explanation: "v-bind:src 可以简写为 :src。" }
    }
  },
  { 
    category: 'vue', 
    correct: 0, 
    content: {
      en: { text: "What is the shorthand for v-on?", options: ["@", ":", "&", "^"], explanation: "v-on:click can be written as @click." },
      zh: { text: "v-on 的缩写是什么？", options: ["@", ":", "&", "^"], explanation: "v-on:click 可以简写为 @click。" }
    }
  },
  { 
    category: 'vue', 
    correct: 2, 
    content: {
      en: { text: "Which hook is called when the component is mounted?", options: ["created", "setup", "mounted", "updated"], explanation: "mounted() is called after the component has been mounted to the DOM. Best for Ajax." },
      zh: { text: "哪个生命周期钩子表示组件已挂载完成？", options: ["created", "setup", "mounted", "updated"], explanation: "mounted 表示 DOM 渲染完成，通常在此处发送 Ajax 请求初始化数据。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "v-if vs v-show: Which one modifies 'display:none'?", options: ["v-if", "v-show", "Both", "Neither"], explanation: "v-if adds/removes elements. v-show toggles CSS display property." },
      zh: { text: "v-if 和 v-show：哪个通过 'display:none' 控制？", options: ["v-if", "v-show", "都是", "都不是"], explanation: "v-show 只是切换 CSS 的 display 属性，v-if 是真正地创建或销毁 DOM 元素。" }
    }
  },
  { 
    category: 'vue', 
    correct: 3, 
    content: {
      en: { text: "Which library is recommended for Ajax in Vue?", options: ["jQuery", "Fetch API", "XMLHttpRequest", "Axios"], explanation: "Axios is the most popular promise-based HTTP client for Vue." },
      zh: { text: "在 Vue 中推荐使用哪个库发送 Ajax 请求？", options: ["jQuery", "Fetch API", "XMLHttpRequest", "Axios"], explanation: "Axios 是一个基于 Promise 的 HTTP 客户端，Vue 官方推荐使用它来代替 vue-resource。" }
    }
  },
  { 
    category: 'vue', 
    correct: 0, 
    content: {
      en: { text: "What is 'Interpolation' syntax?", options: ["{{ }}", "[[ ]]", "<? ?>", "<% %>"], explanation: "Mustache syntax {{ message }} is used for text interpolation." },
      zh: { text: "插值表达式的语法是什么？", options: ["{{ }}", "[[ ]]", "<? ?>", "<% %>"], explanation: "Vue 使用 Mustache 语法 (双大括号) 进行文本插值。" }
    }
  }
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
// Retrieve localized content dynamically based on props.lang
const currentQuestion = computed(() => {
  const q = activeQuestions.value[currentQuestionIndex.value];
  if (!q) return null;
  return {
    ...q,
    ...q.content[props.lang] // Flatten localized text/options into the object
  }
});
const currentQuestionSafe = computed(() => currentQuestion.value ?? { text: '', options: [], correct: -1 })
const currentCorrect = computed(() => currentQuestion.value?.correct ?? -1)
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
    : allQuestions.filter(q => q.category === cat || (cat === 'vue' && q.category === 'basic')); 
  
  if (pool.length < 5) pool = allQuestions; 

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
  hiddenOptions.value = []; 
  
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
  streak.value = 0; 
  
  if (currentQuestion.value) {
      reviewList.value.push({
        question: activeQuestions.value[currentQuestionIndex.value],
        userAnswer: -1
      });
  }

  setTimeout(nextQuestion, 2000);
};

const selectAnswer = (idx: number) => {
  if (!currentQuestion.value) return;

  clearInterval(timerInterval);
  selectedAnswer.value = idx;
  
  const isCorrect = idx === currentQuestion.value.correct;

  if (isCorrect) {
    correctCount.value++;
    streak.value++;
    if (streak.value > maxStreak.value) maxStreak.value = streak.value;
    
    const timeBonus = timer.value * 10;
    const streakBonus = (streak.value - 1) * 20;
    totalScore.value += (100 + timeBonus + streakBonus);

    feedback.value = "✓ Correct! " + (streak.value > 1 ? `${streak.value} Streak! 🔥` : '');
  } else {
    streak.value = 0;
    feedback.value = "✗ Wrong!";
    reviewList.value.push({
      question: activeQuestions.value[currentQuestionIndex.value],
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
  if (lifelines.value.fiftyFiftyUsed || !currentQuestion.value) return;
  
  lifelines.value.fiftyFiftyUsed = true;
  const correct = currentQuestion.value.correct;
  const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
  
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
