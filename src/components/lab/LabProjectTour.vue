<template>
  <div class="space-y-6">
    <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-[var(--primary-100)] dark:border-gray-700 shadow-xl">
      <div class="flex items-start gap-4">
        <div class="text-4xl">🧭</div>
        <div class="flex-1">
          <h3 class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
            {{ lang === 'zh' ? '项目实战导览（本项目）' : 'Project Tour (This App)' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ lang === 'zh'
              ? '用真实源码理解 Vue：从入口、状态到渲染链路，一步步映射到学习笔记。'
              : 'Learn Vue with real code: entry, state, and rendering flow mapped to the notes.' }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="section in sections"
        :key="section.id"
        class="bg-white/80 dark:bg-gray-900/80 rounded-2xl p-6 border border-[var(--primary-100)]/60 dark:border-gray-700 shadow-lg"
      >
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl">{{ section.icon }}</span>
          <h4 class="font-bold text-gray-800 dark:text-gray-100">{{ section.title }}</h4>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {{ section.desc }}
        </p>

        <div class="space-y-3">
          <div
            v-for="item in section.items"
            :key="item.path"
            class="flex items-center justify-between gap-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/70 px-4 py-3"
          >
            <div class="min-w-0">
              <div class="text-sm font-mono text-gray-700 dark:text-gray-200 truncate">{{ item.path }}</div>
              <div class="text-[11px] text-gray-500 dark:text-gray-400">{{ item.note }}</div>
            </div>
            <button
              class="shrink-0 text-xs bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-3 py-1.5 rounded-lg transition-all"
              @click="openCode(item.path, item.range)"
            >
              {{ lang === 'zh' ? '打开代码' : 'Open Code' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-[var(--primary-50)] to-purple-50 dark:from-[var(--primary-900)]/20 dark:to-purple-900/20 rounded-2xl p-5 border border-[var(--primary-100)] dark:border-[var(--primary-800)]/30 text-sm text-gray-600 dark:text-gray-300">
      <div class="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 mb-2">
        <span>📌</span>
        <span>{{ lang === 'zh' ? '学习建议' : 'Learning Tips' }}</span>
      </div>
      <ul class="list-disc pl-5 space-y-1">
        <li>
          {{ lang === 'zh'
            ? '先阅读 VUE 学习笔记，再回到这里逐条打开代码对照。'
            : 'Read the Vue notes first, then return here to open each code file.' }}
        </li>
        <li>
          {{ lang === 'zh'
            ? '点击“打开代码”会弹出源码窗口，可结合代码行号定位。'
            : 'Click “Open Code” to show a source modal, with optional line ranges.' }}
        </li>
        <li>
          {{ lang === 'zh'
            ? '笔记中的 code:// 链接支持直接跳转到这里相同的源码片段。'
            : 'The code:// links in notes jump to the same code snippets.' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ lang: 'en' | 'zh' }>();

type SectionItem = {
  path: string;
  note: string;
  range?: string;
};

type Section = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  items: SectionItem[];
};

const openCode = (path: string, range?: string) => {
  window.dispatchEvent(new CustomEvent('sakura-open-code', { detail: { path, range } }));
};

const sections = computed<Section[]>(() => [
  {
    id: 'entry',
    icon: '🚪',
    title: props.lang === 'zh' ? '应用入口与挂载' : 'App Entry & Mount',
    desc: props.lang === 'zh'
      ? '从 Vite 入口到根组件 App.vue。'
      : 'From Vite entry to the root component.',
    items: [
      {
        path: 'src/main.ts',
        range: 'L1-L80',
        note: props.lang === 'zh' ? '应用创建与挂载' : 'App bootstrap & mount'
      },
      {
        path: 'src/App.vue',
        range: 'L1-L220',
        note: props.lang === 'zh' ? '整体布局与主视图' : 'Layout and main view'
      }
    ]
  },
  {
    id: 'render',
    icon: '🧩',
    title: props.lang === 'zh' ? '渲染链路与 Markdown' : 'Rendering & Markdown',
    desc: props.lang === 'zh'
      ? 'Markdown 渲染、点击拦截、代码弹窗。'
      : 'Markdown rendering, link interception, and code modal.',
    items: [
      {
        path: 'src/composables/useContentRenderer.ts',
        range: 'L1-L140',
        note: props.lang === 'zh' ? '渲染与 TOC 生成' : 'Render & TOC'
      },
      {
        path: 'src/composables/useContentClick.ts',
        range: 'L1-L180',
        note: props.lang === 'zh' ? '内部链接/代码链接处理' : 'Internal/code link handling'
      },
      {
        path: 'src/composables/useCodeModal.ts',
        range: 'L1-L120',
        note: props.lang === 'zh' ? '源码弹窗与高亮' : 'Code modal & highlight'
      }
    ]
  },
  {
    id: 'state',
    icon: '🧠',
    title: props.lang === 'zh' ? '状态与设置' : 'State & Settings',
    desc: props.lang === 'zh'
      ? '全局状态、用户设置与持久化。'
      : 'Global state and persistence.',
    items: [
      {
        path: 'src/stores/appStore.ts',
        range: 'L1-L120',
        note: props.lang === 'zh' ? '主题、语言、偏好设置' : 'Theme, language, preferences'
      },
      {
        path: 'src/stores/articleStore.ts',
        range: 'L1-L120',
        note: props.lang === 'zh' ? '文章收藏/标签/阅读量' : 'Article favorites/tags/views'
      }
    ]
  },
  {
    id: 'ui',
    icon: '🎨',
    title: props.lang === 'zh' ? '核心组件拆分' : 'Core Components',
    desc: props.lang === 'zh'
      ? 'UI 与交互模块化拆分。'
      : 'UI and interactions split into components.',
    items: [
      {
        path: 'src/components/AppHeader.vue',
        range: 'L1-L120',
        note: props.lang === 'zh' ? '顶部导航与操作' : 'Header controls'
      },
      {
        path: 'src/components/AppSidebar.vue',
        range: 'L1-L140',
        note: props.lang === 'zh' ? '侧边目录与视图切换' : 'Sidebar and view switch'
      },
      {
        path: 'src/components/SearchModal.vue',
        range: 'L1-L140',
        note: props.lang === 'zh' ? '全文搜索 UI' : 'Search modal UI'
      }
    ]
  }
]);
</script>
