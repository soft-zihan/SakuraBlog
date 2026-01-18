<template>
  <div class="lab-html-basics p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-sakura-600 dark:text-sakura-400 mb-4">
      🌐 HTML基础 - 网页骨架
    </h1>
    
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
      HTML (HyperText Markup Language) 是构建网页的基础语言。想象一下：如果网页是一栋房子，HTML就是它的框架和结构。
    </p>

    <!-- 学习路径导航 -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
      <p class="text-sm text-blue-800 dark:text-blue-300">
        <strong>📍 你现在的位置：</strong>第1阶段 - Web基础 → HTML基础
      </p>
      <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
        <strong>⏱️ 预计学习时间：</strong>30-45分钟
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
          ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-400 border-b-2 border-sakura-500' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 理论讲解 -->
    <div v-show="activeTab === 'theory'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">什么是HTML？</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          HTML使用"标签"(Tags)来标记网页内容。标签告诉浏览器："这是标题"、"这是段落"、"这是图片"等等。
        </p>
        
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <pre class="text-sm"><code>&lt;p&gt;这是一个段落&lt;/p&gt;
&lt;h1&gt;这是一个大标题&lt;/h1&gt;
&lt;img src="photo.jpg" alt="我的照片"&gt;</code></pre>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">HTML文档结构</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          每个HTML文档都有固定的基本结构：
        </p>
        
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <pre class="text-sm"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;网页标题&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;!-- 网页内容写在这里 --&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
        </div>
        
        <ul class="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;!DOCTYPE html&gt;</code> - 告诉浏览器这是HTML5文档</li>
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;html&gt;</code> - 根元素，包含整个网页</li>
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;head&gt;</code> - 页面元信息（标题、编码等）</li>
          <li><code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">&lt;body&gt;</code> - 页面可见内容</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">常用标签速览</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-sakura-600 dark:text-sakura-400 mb-2">文本类</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code>&lt;h1&gt; ~ &lt;h6&gt;</code> - 标题（1最大，6最小）</li>
              <li><code>&lt;p&gt;</code> - 段落</li>
              <li><code>&lt;strong&gt;</code> - 加粗强调</li>
              <li><code>&lt;em&gt;</code> - 斜体强调</li>
              <li><code>&lt;br&gt;</code> - 换行</li>
            </ul>
          </div>
          
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-sakura-600 dark:text-sakura-400 mb-2">链接与媒体</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code>&lt;a href="url"&gt;</code> - 超链接</li>
              <li><code>&lt;img src="url"&gt;</code> - 图片</li>
              <li><code>&lt;video&gt;</code> - 视频</li>
              <li><code>&lt;audio&gt;</code> - 音频</li>
            </ul>
          </div>
          
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-sakura-600 dark:text-sakura-400 mb-2">列表类</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code>&lt;ul&gt;</code> - 无序列表</li>
              <li><code>&lt;ol&gt;</code> - 有序列表</li>
              <li><code>&lt;li&gt;</code> - 列表项</li>
            </ul>
          </div>
          
          <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 class="font-bold text-sakura-600 dark:text-sakura-400 mb-2">容器类</h3>
            <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><code>&lt;div&gt;</code> - 块级容器</li>
              <li><code>&lt;span&gt;</code> - 行内容器</li>
              <li><code>&lt;section&gt;</code> - 章节</li>
              <li><code>&lt;article&gt;</code> - 文章</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- 实战练习 -->
    <div v-show="activeTab === 'practice'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">✍️ 动手练习：制作个人简介页</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          在下面的编辑器中，编写HTML代码创建一个简单的个人简介页面。右侧会实时预览效果。
        </p>

        <div class="grid md:grid-cols-2 gap-4">
          <!-- HTML编辑器 -->
          <div>
            <h3 class="font-bold mb-2 text-gray-800 dark:text-gray-200">HTML代码</h3>
            <textarea 
              v-model="htmlCode"
              class="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-700"
              placeholder="在这里写HTML..."
            ></textarea>
          </div>

          <!-- 预览区域 -->
          <div>
            <h3 class="font-bold mb-2 text-gray-800 dark:text-gray-200">实时预览</h3>
            <div 
              class="w-full h-96 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-auto"
              v-html="htmlCode"
            ></div>
          </div>
        </div>

        <div class="mt-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r">
          <p class="text-sm text-green-800 dark:text-green-300">
            <strong>💡 任务要求：</strong>
          </p>
          <ul class="text-sm text-green-700 dark:text-green-400 mt-2 space-y-1 ml-4">
            <li>1. 使用 <code>&lt;h1&gt;</code> 显示你的名字</li>
            <li>2. 使用 <code>&lt;p&gt;</code> 写一段自我介绍</li>
            <li>3. 使用 <code>&lt;ul&gt;</code> 列出你的3个爱好</li>
            <li>4. 使用 <code>&lt;a&gt;</code> 添加一个指向你喜欢的网站的链接</li>
          </ul>
        </div>
      </section>
    </div>

    <!-- 示例代码 -->
    <div v-show="activeTab === 'examples'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">📝 完整示例</h2>
        
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <pre class="text-sm overflow-x-auto"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;张三的个人主页&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;你好，我是张三&lt;/h1&gt;
  
  &lt;h2&gt;关于我&lt;/h2&gt;
  &lt;p&gt;我是一名前端开发学习者，热爱编程和设计。&lt;/p&gt;
  
  &lt;h2&gt;我的爱好&lt;/h2&gt;
  &lt;ul&gt;
    &lt;li&gt;编程&lt;/li&gt;
    &lt;li&gt;阅读&lt;/li&gt;
    &lt;li&gt;旅行&lt;/li&gt;
  &lt;/ul&gt;
  
  &lt;h2&gt;联系我&lt;/h2&gt;
  &lt;p&gt;
    访问我的 &lt;a href="https://github.com"&gt;GitHub&lt;/a&gt;
  &lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
        </div>
      </section>
    </div>

    <!-- 测验 -->
    <div v-show="activeTab === 'quiz'" class="space-y-6">
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">🎯 知识检验</h2>
        
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
              ✅ 正确！
            </p>
            <p v-else class="text-red-600 dark:text-red-400 font-bold">
              ❌ 错误。正确答案是：{{ q.options[q.correct] }}
            </p>
          </div>
        </div>

        <button 
          @click="checkAnswers"
          class="px-6 py-2 bg-sakura-500 hover:bg-sakura-600 text-white rounded-lg transition-colors font-bold"
        >
          {{ showResults ? '重新测验' : '提交答案' }}
        </button>

        <div v-if="showResults" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-lg font-bold text-blue-800 dark:text-blue-300">
            得分：{{ score }} / {{ quizQuestions.length }}
          </p>
        </div>
      </section>
    </div>

    <!-- 下一步 -->
    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">上一节</p>
          <p class="text-gray-700 dark:text-gray-300 font-medium">（无）</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400">下一节</p>
          <button 
            class="text-sakura-600 dark:text-sakura-400 font-bold hover:underline"
            @click="$emit('next-lesson', 'css-basics')"
          >
            CSS基础 - 网页衣服 →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tabs = [
  { id: 'theory', label: '📖 理论讲解' },
  { id: 'practice', label: '✍️ 实战练习' },
  { id: 'examples', label: '📝 示例代码' },
  { id: 'quiz', label: '🎯 知识检验' }
];

const activeTab = ref('theory');

// 练习区域的HTML代码
const htmlCode = ref(`<h1>我是标题</h1>
<p>这是一个段落。</p>
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
</ul>`);

// 测验题目
const quizQuestions = [
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
    options: [
      '声明文档类型为HTML5',
      '设置页面标题',
      '导入CSS样式',
      '定义网页布局'
    ],
    correct: 0
  }
];

const userAnswers = ref<number[]>([]);
const showResults = ref(false);

const score = computed(() => {
  return quizQuestions.reduce((acc, q, idx) => {
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
