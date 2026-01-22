<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {{ lang === 'zh' ? 'CSS 框架速览' : 'CSS Frameworks Overview' }}
      </h2>
      <p class="text-sm text-gray-500 mt-2">
        {{ lang === 'zh'
          ? '了解不同框架的定位与使用场景，选择最适合的工具。'
          : 'Learn where each framework shines and pick the best tool for your project.' }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in frameworks"
        :key="item.name"
        class="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ item.icon }}</span>
          <div>
            <div class="font-bold text-gray-800 dark:text-gray-100">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.tagline }}</div>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
          {{ item.desc }}
        </p>
        <div class="flex flex-wrap gap-2 mt-4">
          <span
            v-for="badge in item.badges"
            :key="badge"
            class="text-[10px] px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/30 text-sakura-700 dark:text-sakura-300"
          >
            {{ badge }}
          </span>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-sakura-100 dark:border-sakura-800/30">
      <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ lang === 'zh' ? '如何选择？' : 'How to choose?' }}
      </h3>
      <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc pl-5">
        <li>{{ lang === 'zh' ? '追求极致自由度：选 Tailwind。' : 'Need maximum control? Pick Tailwind.' }}</li>
        <li>{{ lang === 'zh' ? '快速上手、现成组件：选 Bootstrap / DaisyUI。' : 'Want ready-made components? Use Bootstrap or DaisyUI.' }}</li>
        <li>{{ lang === 'zh' ? '偏好一致的设计体系：选 Material UI。' : 'Prefer a strict design system? Go with Material UI.' }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const frameworks = computed(() => [
  {
    name: 'Tailwind CSS',
    icon: '🎨',
    tagline: props.lang === 'zh' ? '工具类优先' : 'Utility-first',
    desc: props.lang === 'zh'
      ? '通过组合类名快速构建 UI，适合高度定制化的设计。'
      : 'Compose classes to build UI fast, great for custom designs.',
    badges: [props.lang === 'zh' ? '高自由度' : 'Flexible', 'Design System']
  },
  {
    name: 'Bootstrap',
    icon: '🧱',
    tagline: props.lang === 'zh' ? '经典组件库' : 'Classic UI kit',
    desc: props.lang === 'zh'
      ? '组件齐全、上手快，适合原型和后台管理。'
      : 'Complete components and quick start, great for prototypes/admin.',
    badges: [props.lang === 'zh' ? '上手快' : 'Quick Start', 'Components']
  },
  {
    name: 'Material UI',
    icon: '🧩',
    tagline: props.lang === 'zh' ? 'Material 设计体系' : 'Material Design',
    desc: props.lang === 'zh'
      ? '遵循 Google Material 规范，风格统一。'
      : 'Consistent look following Google Material guidelines.',
    badges: [props.lang === 'zh' ? '规范一致' : 'Consistent', 'React-friendly']
  },
  {
    name: 'DaisyUI',
    icon: '🌼',
    tagline: props.lang === 'zh' ? 'Tailwind 组件扩展' : 'Tailwind components',
    desc: props.lang === 'zh'
      ? '在 Tailwind 上提供现成组件，效率与灵活兼顾。'
      : 'Prebuilt components on Tailwind for speed and flexibility.',
    badges: [props.lang === 'zh' ? '轻量' : 'Lightweight', 'Themes']
  }
])
</script>
