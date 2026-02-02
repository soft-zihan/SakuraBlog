<template>
  <div class="mx-auto w-full max-w-4xl flex flex-col items-center text-center text-[var(--primary-400)] dark:text-gray-500 animate-fade-in pt-2 md:pt-4 pb-12">
    <div class="relative group cursor-default">
      <div class="text-[12rem] mb-4 opacity-90 animate-float drop-shadow-2xl filter saturate-150 transform hover:scale-105 transition-transform duration-700">🌸</div>
      <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-[var(--primary-800)]/20 dark:bg-[var(--primary-900)]/40 blur-2xl rounded-full group-hover:w-64 transition-all duration-500"></div>
    </div>
    <h2 class="text-5xl font-bold mb-4 tracking-tight drop-shadow-sm bg-gradient-to-r from-[var(--primary-500)] via-[var(--primary-400)] to-[var(--primary-600)] dark:from-[var(--primary-300)] dark:via-[var(--primary-200)] dark:to-[var(--primary-400)] text-transparent bg-clip-text">{{ t.welcome_title }}</h2>
    <p class="text-[var(--primary-500)]/80 dark:text-gray-300 max-w-lg mx-auto leading-relaxed text-lg">
      {{ t.welcome_desc }}<br>
      <span class="text-sm opacity-90 bg-white/70 dark:bg-gray-800/70 px-4 py-1.5 rounded-full mt-3 inline-block border border-white/70 dark:border-gray-700/70 shadow-sm backdrop-blur">{{ t.welcome_tags }}</span>
    </p>
    <div class="mt-10 w-full max-w-3xl">
      <div class="flex flex-wrap items-center justify-center gap-3">
        <button
          class="px-3 py-1.5 text-xs rounded-full border border-[var(--primary-200)]/80 dark:border-gray-700 text-[var(--primary-600)] dark:text-[var(--primary-300)] hover:bg-[var(--primary-50)]/80 dark:hover:bg-gray-800 transition-colors"
          :disabled="welcomePoemLoading"
          @click="$emit('load-random-poem')"
        >
          {{ lang === 'zh' ? '换一篇' : 'New' }}
        </button>
      </div>
      <div v-if="welcomePoemLoading" class="mt-4 text-sm text-gray-400">{{ lang === 'zh' ? '加载中...' : 'Loading...' }}</div>
      <div v-else-if="welcomePoemError" class="mt-4 text-sm text-amber-500">{{ welcomePoemError }}</div>
      <div v-else class="mt-6">
        <div class="text-center">
          <div class="text-2xl md:text-3xl font-bold tracking-wide text-[var(--primary-600)] dark:text-[var(--primary-300)] poem-font">
            {{ welcomePoem?.title || (lang === 'zh' ? '随机古诗文' : 'Random Poem') }}
          </div>
          <div v-if="welcomePoemAuthorLine" class="mt-2 text-base text-gray-500 dark:text-gray-400 poem-font">
            {{ welcomePoemAuthorLine }}
          </div>
        </div>
        <div v-if="welcomePoemLines.length" class="mt-6 space-y-2 text-xl md:text-2xl leading-relaxed text-[var(--primary-600)] dark:text-[var(--primary-200)] poem-font poem-page">
          <div v-for="(line, idx) in welcomePoemLines" :key="idx" class="poem-line" :style="{ animationDelay: `${idx * 120}ms` }">
            {{ line }}
          </div>
        </div>
        <div v-if="welcomePoemDetails.length" class="mt-8 w-full text-left space-y-6 text-sm text-gray-600 dark:text-gray-300">
          <div v-for="detail in welcomePoemDetails" :key="detail.label" class="pt-4 border-t border-white/60 dark:border-gray-700/60">
            <div class="text-xs font-semibold text-[var(--primary-500)] dark:text-[var(--primary-300)] mb-2">{{ detail.label }}</div>
            <div class="whitespace-pre-line leading-relaxed">{{ detail.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuwenItem } from '../composables/usePoem';

defineProps<{
  t: any;
  lang: string;
  welcomePoemLoading: boolean;
  welcomePoemError: string;
  welcomePoem: GuwenItem | null;
  welcomePoemAuthorLine: string;
  welcomePoemLines: string[];
  welcomePoemDetails: Array<{ label: string; value: string }>;
}>();

defineEmits<{
  (e: 'load-random-poem'): void;
}>();
</script>
