<template>
  <header 
    class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/40 shrink-0 z-20 shadow-sm transition-all duration-300 hover:bg-white/60 dark:hover:bg-gray-900/60"
    :class="[
      isMobile ? 'px-3 py-2' : 'h-16 px-6',
      { 'translate-y-0': !headerHidden, '-translate-y-full': headerHidden }
    ]"
  >
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="h-full flex items-center justify-between">
      <!-- Breadcrumbs -->
      <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
        <span class="text-sakura-300 dark:text-sakura-500 mr-2 shrink-0 text-lg cursor-pointer hover:scale-110 transition-transform" @click="$emit('reset')">🏠</span>
        <span class="text-sakura-200 dark:text-gray-700 mx-1">/</span>
        <span class="font-bold text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-sakura-900/20 px-2 py-0.5 rounded mr-2">{{ lang }}</span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">{{ t.tab_lab }}</span>
           <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
           <span class="text-gray-500 dark:text-gray-400">{{ t.lab_dashboard }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs" :key="item.path">
          <span v-if="index > 0" class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer transition-colors px-2 py-1 rounded-md"
            :class="index === breadcrumbs.length - 1 ? 'font-bold text-sakura-600 dark:text-sakura-400 bg-sakura-50/50 dark:bg-sakura-900/30' : 'text-gray-500 dark:text-gray-400 hover:text-sakura-500 hover:bg-sakura-50/50 dark:hover:bg-gray-800'"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <!-- Desktop Actions -->
      <div class="flex gap-2 shrink-0 items-center">
        <!-- File Actions (before search) -->
        <template v-if="currentFile">
          <button v-if="!currentFile.isSource" @click="$emit('update:isRawMode', !isRawMode)" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors" :title="isRawMode ? t.view_render : t.view_source">
            <span class="text-lg">{{ isRawMode ? '👁️' : '🖊️' }}</span>
          </button>
          <button @click="$emit('copy-link')" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors" :title="t.copy_link">
            <span class="text-lg">🔗</span>
          </button>
          <button @click="$emit('download')" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-1" :title="t.download">
            <span class="text-sm">DL</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
          <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        </template>

        <!-- Search Button -->
        <button 
          @click="$emit('open-search')" 
          class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/30 hover:text-sakura-600 transition-all text-sm"
          title="Search (⌘K)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span>{{ t.search_placeholder }}</span>
          <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-mono">⌘K</kbd>
        </button>

        <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <!-- Music Button -->
        <button 
          @click="$emit('open-music')" 
          class="p-2 hover:bg-sakura-50 dark:hover:bg-sakura-900/30 rounded-lg transition-colors relative"
          :title="t.music_player"
        >
          <span class="text-lg">🎵</span>
          <span v-if="musicStore.isPlaying" class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </button>

        <!-- Write Button -->
        <button 
          @click="$emit('open-write')" 
          class="p-2 hover:bg-sakura-50 dark:hover:bg-sakura-900/30 rounded-lg transition-colors"
          :title="t.write_title"
        >
          <span class="text-lg">✏️</span>
        </button>

        <!-- Theme Toggle -->
        <button 
          @click="$emit('toggle-theme')" 
          class="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          :title="isDark ? t.theme_light : t.theme_dark"
        >
          <span class="text-lg transition-transform duration-300" :class="isDark ? 'rotate-0' : 'rotate-180'">{{ isDark ? '🌙' : '🌞' }}</span>
        </button>

        <!-- Petal Speed Toggle -->
        <div class="relative group/petal">
          <button 
            @click="cyclePetalSpeed" 
            class="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            :title="petalSpeedTitle"
          >
            <span 
              class="text-lg transition-all duration-300" 
              :class="{
                'opacity-40 grayscale': petalSpeed === 'off',
                'animate-spin-slow': petalSpeed === 'slow',
                'animate-spin-fast': petalSpeed === 'fast'
              }"
            >🌸</span>
          </button>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/petal:opacity-100 transition-opacity pointer-events-none">
            {{ petalSpeedTitle }}
          </div>
        </div>
         
        <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <!-- Settings -->
        <button @click="$emit('open-settings')" class="p-2 text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 hover:rotate-90 transition-all duration-500" :title="t.settings_title">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Layout (Two-row) -->
    <div v-else class="flex flex-col gap-2">
      <!-- Row 1: Breadcrumbs (scrollable) -->
      <div class="flex items-center text-xs overflow-x-auto no-scrollbar whitespace-nowrap py-1">
        <span class="text-sakura-300 dark:text-sakura-500 mr-1 shrink-0 cursor-pointer" @click="$emit('reset')">🏠</span>
        <span class="text-sakura-200 dark:text-gray-700 mx-1">/</span>
        <span class="font-bold text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-sakura-900/20 px-1.5 py-0.5 rounded text-[10px]">{{ lang }}</span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-1 text-sakura-300 dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded text-[10px]">{{ t.tab_lab }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs.slice(-2)" :key="item.path">
          <span class="mx-1 text-sakura-300 dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 truncate max-w-[100px]"
            :class="index === breadcrumbs.slice(-2).length - 1 ? 'font-bold text-sakura-600 dark:text-sakura-400' : ''"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <!-- Row 2: Actions -->
      <div class="flex items-center justify-between gap-1">
        <!-- Left: File Actions -->
        <div class="flex items-center gap-1">
          <template v-if="currentFile">
            <button v-if="!currentFile.isSource" @click="$emit('update:isRawMode', !isRawMode)" class="p-1.5 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors text-sm">
              {{ isRawMode ? '👁️' : '🖊️' }}
            </button>
            <button @click="$emit('copy-link')" class="p-1.5 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors text-sm">🔗</button>
          </template>
        </div>

        <!-- Right: Main Actions -->
        <div class="flex items-center gap-1">
          <button @click="$emit('open-search')" class="p-1.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500 text-sm">🔍</button>
          <button @click="$emit('open-music')" class="p-1.5 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded transition-colors text-sm relative">
            🎵
            <span v-if="musicStore.isPlaying" class="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          </button>
          <button @click="$emit('toggle-theme')" class="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors text-sm">{{ isDark ? '🌙' : '🌞' }}</button>
          <button @click="cyclePetalSpeed" class="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors text-sm" :class="{ 'opacity-40': petalSpeed === 'off' }">🌸</button>
          <button @click="$emit('open-settings')" class="p-1.5 text-gray-400 hover:text-sakura-600 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { BreadcrumbItem, FileNode } from '../types';
import { useMusicStore } from '../stores/musicStore';
import { useAppStore } from '../stores/appStore';

const musicStore = useMusicStore();
const appStore = useAppStore();

const props = defineProps<{
  lang: string;
  t: any;
  breadcrumbs: BreadcrumbItem[];
  viewMode: string;
  currentTool: string | null;
  currentFile: FileNode | null;
  showParticles: boolean;
  isRawMode: boolean;
  isDark: boolean;
  petalSpeed: 'off' | 'slow' | 'fast';
  headerHidden?: boolean;
}>();

const emit = defineEmits([
  'reset', 
  'navigate', 
  'update:showParticles', 
  'update:isRawMode',
  'copy-link',
  'download',
  'open-settings',
  'open-search',
  'open-music',
  'open-write',
  'toggle-theme',
  'update:petalSpeed'
]);

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// Petal speed tooltip text
const petalSpeedTitle = computed(() => {
  const titles: Record<string, string> = {
    off: props.lang === 'zh' ? '关闭' : 'Off',
    slow: props.lang === 'zh' ? '秒速五厘米' : '5cm/s',
    fast: props.lang === 'zh' ? '秒速十厘米' : '10cm/s'
  };
  return titles[props.petalSpeed] || '';
});

// Cycle through petal speeds: off -> slow -> fast -> off
const cyclePetalSpeed = () => {
  const speeds: Array<'off' | 'slow' | 'fast'> = ['off', 'slow', 'fast'];
  const currentIndex = speeds.indexOf(props.petalSpeed);
  const nextIndex = (currentIndex + 1) % speeds.length;
  emit('update:petalSpeed', speeds[nextIndex]);
};
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-spin-fast {
  animation: spin-fast 4s linear infinite;
}
</style>