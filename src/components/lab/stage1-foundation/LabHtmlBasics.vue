<template>
  <div class="lab-html-basics p-6 max-w-5xl mx-auto bg-white/80 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
    <h1 class="text-3xl font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] mb-4">
      🌐 {{ t.lab_html_basics_title }}
    </h1>
    
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
      {{ t.lab_html_basics_intro }}
    </p>

    <!-- 学习路径导航 -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
      <p class="text-sm text-blue-800 dark:text-blue-300">
        <strong>{{ t.lab_html_basics_location_label }}</strong>{{ t.lab_html_basics_location_value }}
      </p>
      <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
        <strong>{{ t.lab_html_basics_time_label }}</strong>{{ t.lab_html_basics_time_value }}
      </p>
    </div>

    <!-- 内容选项卡 -->
    <div class="tabs flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 font-medium transition-colors rounded-t"
        :class="activeTab === tab.id 
          ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)] border-b-2 border-[var(--primary-500)]' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 理论讲解 -->
    <div v-show="activeTab === 'theory'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{{ t.lab_html_basics_theory_what_title }}</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          {{ t.lab_html_basics_theory_what_desc }}
        </p>
        
        <div class="bg-[#1e1e1e] text-green-200 p-4 rounded-lg border border-gray-700 shadow-inner">
          <pre class="text-sm"><code>{{ htmlTagExamplesCode }}</code></pre>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{{ t.lab_html_basics_theory_structure_title }}</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          {{ t.lab_html_basics_theory_structure_desc }}
        </p>
        
        <div class="bg-[#1e1e1e] text-green-200 p-4 rounded-lg border border-gray-700 shadow-inner">
          <pre class="text-sm"><code>{{ htmlDocStructureCode }}</code></pre>
        </div>
        
        <ul class="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;!DOCTYPE html&gt;</code> - {{ t.lab_html_basics_structure_doctype_desc }}</li>
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;html&gt;</code> - {{ t.lab_html_basics_structure_html_desc }}</li>
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;head&gt;</code> - {{ t.lab_html_basics_structure_head_desc }}</li>
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;body&gt;</code> - {{ t.lab_html_basics_structure_body_desc }}</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{{ t.lab_html_basics_theory_tags_title }}</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] mb-2">{{ t.lab_html_basics_tag_group_text }}</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;h1&gt; ~ &lt;h6&gt;</code> - {{ t.lab_html_basics_tag_h1_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;p&gt;</code> - {{ t.lab_html_basics_tag_p_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;strong&gt;</code> - {{ t.lab_html_basics_tag_strong_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;em&gt;</code> - {{ t.lab_html_basics_tag_em_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;br&gt;</code> - {{ t.lab_html_basics_tag_br_desc }}</li>
            </ul>
          </div>
          
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] mb-2">{{ t.lab_html_basics_tag_group_media }}</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;a href="url"&gt;</code> - {{ t.lab_html_basics_tag_a_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;img src="url"&gt;</code> - {{ t.lab_html_basics_tag_img_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;video&gt;</code> - {{ t.lab_html_basics_tag_video_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;audio&gt;</code> - {{ t.lab_html_basics_tag_audio_desc }}</li>
            </ul>
          </div>
          
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-sakura-600 dark:text-sakura-400 mb-2">{{ t.lab_html_basics_tag_group_list }}</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;ul&gt;</code> - {{ t.lab_html_basics_tag_ul_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;ol&gt;</code> - {{ t.lab_html_basics_tag_ol_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;li&gt;</code> - {{ t.lab_html_basics_tag_li_desc }}</li>
            </ul>
          </div>
          
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-sakura-600 dark:text-sakura-400 mb-2">{{ t.lab_html_basics_tag_group_container }}</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;div&gt;</code> - {{ t.lab_html_basics_tag_div_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;span&gt;</code> - {{ t.lab_html_basics_tag_span_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;section&gt;</code> - {{ t.lab_html_basics_tag_section_desc }}</li>
              <li><code class="bg-gray-200/80 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/50 dark:border-gray-600/40 font-mono text-[11px]">&lt;article&gt;</code> - {{ t.lab_html_basics_tag_article_desc }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- 实战练习 -->
    <div v-show="activeTab === 'practice'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{{ t.lab_html_basics_practice_title }}</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          {{ t.lab_html_basics_practice_desc }}
        </p>

        <div class="grid md:grid-cols-2 gap-4">
          <!-- HTML编辑器 -->
          <div>
            <h3 class="font-bold mb-2 text-gray-800 dark:text-gray-200">{{ t.lab_html_basics_practice_editor_title }}</h3>
            <textarea 
              v-model="htmlCode"
              class="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-700"
              :placeholder="t.lab_html_basics_practice_editor_placeholder"
            ></textarea>
          </div>

          <!-- 预览区域 -->
          <div>
            <h3 class="font-bold mb-2 text-gray-800 dark:text-gray-200">{{ t.lab_html_basics_practice_preview_title }}</h3>
            <div 
              class="w-full h-96 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-auto"
              v-html="sanitizedHtmlCode"
            ></div>
          </div>
        </div>

        <div class="mt-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r">
          <p class="text-sm text-green-800 dark:text-green-300">
            <strong>{{ t.lab_html_basics_practice_requirements_label }}</strong>
          </p>
          <ul class="text-sm text-green-700 dark:text-green-400 mt-2 space-y-1 ml-4">
            <li>1. {{ t.lab_html_basics_practice_req_1_prefix }} <code class="bg-green-100/80 dark:bg-green-900/30 px-1.5 py-0.5 rounded border border-green-200/70 dark:border-green-800/40 font-mono text-[11px]">&lt;h1&gt;</code> {{ t.lab_html_basics_practice_req_1_suffix }}</li>
            <li>2. {{ t.lab_html_basics_practice_req_2_prefix }} <code class="bg-green-100/80 dark:bg-green-900/30 px-1.5 py-0.5 rounded border border-green-200/70 dark:border-green-800/40 font-mono text-[11px]">&lt;p&gt;</code> {{ t.lab_html_basics_practice_req_2_suffix }}</li>
            <li>3. {{ t.lab_html_basics_practice_req_3_prefix }} <code class="bg-green-100/80 dark:bg-green-900/30 px-1.5 py-0.5 rounded border border-green-200/70 dark:border-green-800/40 font-mono text-[11px]">&lt;ul&gt;</code> {{ t.lab_html_basics_practice_req_3_suffix }}</li>
            <li>4. {{ t.lab_html_basics_practice_req_4_prefix }} <code class="bg-green-100/80 dark:bg-green-900/30 px-1.5 py-0.5 rounded border border-green-200/70 dark:border-green-800/40 font-mono text-[11px]">&lt;a&gt;</code> {{ t.lab_html_basics_practice_req_4_suffix }}</li>
          </ul>
        </div>
      </section>
    </div>

    <!-- 示例代码 -->
    <div v-show="activeTab === 'examples'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{{ t.lab_html_basics_examples_title }}</h2>
        
        <div class="bg-[#1e1e1e] text-green-200 p-4 rounded-lg border border-gray-700 shadow-inner">
          <pre class="text-sm overflow-x-auto"><code>{{ fullExampleCode }}</code></pre>
        </div>
      </section>
    </div>

    <!-- 测验 -->
    <div v-show="activeTab === 'quiz'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{{ t.lab_html_basics_quiz_title }}</h2>
        
        <div v-for="(q, idx) in quizQuestions" :key="idx" class="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p class="font-bold mb-3 text-gray-800 dark:text-gray-200">{{ idx + 1 }}. {{ q.question }}</p>
          <div class="space-y-2">
            <label 
              v-for="(option, optIdx) in q.options" 
              :key="optIdx"
              class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <input 
                type="radio" 
                :name="`quiz-${idx}`" 
                :value="optIdx"
                v-model="userAnswers[idx]"
                class="text-sakura-500"
              >
              <span class="text-gray-700 dark:text-gray-300">{{ option }}</span>
            </label>
          </div>
          
          <div v-if="showResults && userAnswers[idx] !== undefined" class="mt-3">
            <p v-if="userAnswers[idx] === q.correct" class="text-green-600 dark:text-green-400 font-bold">
              {{ t.lab_html_basics_quiz_correct }}
            </p>
            <p v-else class="text-red-600 dark:text-red-400 font-bold">
              {{ t.lab_html_basics_quiz_wrong }}{{ q.options[q.correct] }}
            </p>
          </div>
        </div>

        <button 
          @click="checkAnswers"
          class="px-6 py-2 bg-sakura-500 hover:bg-sakura-600 text-white rounded-lg transition-colors font-bold"
        >
          {{ showResults ? t.lab_html_basics_quiz_retry : t.lab_html_basics_quiz_submit }}
        </button>

        <div v-if="showResults" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-lg font-bold text-blue-800 dark:text-blue-300">
            {{ t.lab_html_basics_quiz_score_label }}{{ score }} / {{ quizQuestions.length }}
          </p>
        </div>
      </section>
    </div>

    
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { I18N } from '../../../constants'
import { sanitizeHtml } from '../../../utils/sanitize';

const props = defineProps<{ lang: 'en' | 'zh' }>()
const t = computed(() => I18N[props.lang])

const tabs = computed(() => [
  { id: 'theory', label: t.value.lab_html_basics_tab_theory },
  { id: 'practice', label: t.value.lab_html_basics_tab_practice },
  { id: 'examples', label: t.value.lab_html_basics_tab_examples },
  { id: 'quiz', label: t.value.lab_html_basics_tab_quiz }
])

const activeTab = ref('theory');

// 练习区域的HTML代码
const htmlCode = ref(
  props.lang === 'zh'
    ? `<h1>我是标题</h1>
<p>这是一个段落。</p>
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
</ul>`
    : `<h1>I am a heading</h1>
<p>This is a paragraph.</p>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>`
);

const sanitizedHtmlCode = computed(() => {
  return sanitizeHtml(htmlCode.value);
});

const htmlTagExamplesCode = computed(() =>
  props.lang === 'zh'
    ? `<p>这是一个段落</p>
<h1>这是一个大标题</h1>
<img src="photo.jpg" alt="我的照片">`
    : `<p>This is a paragraph</p>
<h1>This is a heading</h1>
<img src="photo.jpg" alt="My photo">`
);

const htmlDocStructureCode = computed(() =>
  props.lang === 'zh'
    ? `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <title>网页标题</title>
  </head>
  <body>
    <!-- 网页内容写在这里 -->
  </body>
</html>`
    : `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Page Title</title>
  </head>
  <body>
    <!-- Page content goes here -->
  </body>
</html>`
);

const fullExampleCode = computed(() =>
  props.lang === 'zh'
    ? `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>张三的个人主页</title>
</head>
<body>
  <h1>你好，我是张三</h1>
  
  <h2>关于我</h2>
  <p>我是一名前端开发学习者，热爱编程和设计。</p>
  
  <h2>我的爱好</h2>
  <ul>
    <li>编程</li>
    <li>阅读</li>
    <li>旅行</li>
  </ul>
  
  <h2>联系我</h2>
  <p>
    访问我的 <a href="https://github.com">GitHub</a>
  </p>
</body>
</html>`
    : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Alex's Homepage</title>
</head>
<body>
  <h1>Hi, I'm Alex</h1>
  
  <h2>About Me</h2>
  <p>I'm a frontend learner who loves coding and design.</p>
  
  <h2>My Hobbies</h2>
  <ul>
    <li>Coding</li>
    <li>Reading</li>
    <li>Traveling</li>
  </ul>
  
  <h2>Contact</h2>
  <p>
    Visit my <a href="https://github.com">GitHub</a>
  </p>
</body>
</html>`
);

// 测验题目
const quizQuestions = computed(() =>
  props.lang === 'zh'
    ? [
        {
          question: 'HTML中哪个标签用于创建最大的标题？',
          options: ['<heading>', '<h1>', '<title>', '<head>'],
          correct: 1
        },
        {
          question: '如何在HTML中创建超链接？',
          options: ['<link>', '<a>', '<url>', '<href>'],
          correct: 1
        },
        {
          question: 'HTML中哪个标签用于插入图片？',
          options: ['<image>', '<pic>', '<img>', '<photo>'],
          correct: 2
        },
        {
          question: '<!DOCTYPE html> 的作用是什么？',
          options: ['声明文档类型为HTML5', '设置页面标题', '导入CSS样式', '定义网页布局'],
          correct: 0
        }
      ]
    : [
        {
          question: 'Which tag creates the largest heading in HTML?',
          options: ['<heading>', '<h1>', '<title>', '<head>'],
          correct: 1
        },
        {
          question: 'How do you create a hyperlink in HTML?',
          options: ['<link>', '<a>', '<url>', '<href>'],
          correct: 1
        },
        {
          question: 'Which tag is used to insert an image in HTML?',
          options: ['<image>', '<pic>', '<img>', '<photo>'],
          correct: 2
        },
        {
          question: 'What is the purpose of <!DOCTYPE html> ?',
          options: [
            'Declare the document type as HTML5',
            'Set the page title',
            'Import CSS styles',
            'Define page layout'
          ],
          correct: 0
        }
      ]
);

const userAnswers = ref<number[]>([]);
const showResults = ref(false);

const score = computed(() => {
  return quizQuestions.value.reduce((acc, q, idx) => {
    return acc + (userAnswers.value[idx] === q.correct ? 1 : 0);
  }, 0);
});

const checkAnswers = () => {
  if (showResults.value) {
    // 重置
    userAnswers.value = [];
    showResults.value = false;
  } else {
    showResults.value = true;
  }
};
</script>

<style scoped>
code {
  @apply bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono;
}
</style>
