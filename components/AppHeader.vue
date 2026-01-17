<template>
  <header class="h-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/40 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm transition-all duration-300 hover:bg-white/60 dark:hover:bg-gray-900/60">
    <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
      <span class="text-sakura-300 dark:text-sakura-500 mr-2 shrink-0 text-lg cursor-pointer hover:scale-110 transition-transform" @click="$emit('reset')">🏠</span>
      <span class="text-sakura-200 dark:text-gray-700 mx-1">/</span>
      <!-- Language Root Indicator -->
      <span class="font-bold text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-sakura-900/20 px-2 py-0.5 rounded mr-2">{{ lang }}</span>
      
      <template v-if="viewMode === 'lab' && currentTool">
         <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
         <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">{{ t.tab_lab }}</span>
         <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
         <span class="text-gray-500 dark:text-gray-400">
            {{ t.lab_dashboard }}
         </span>
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

    <div class="flex gap-1 md:gap-2 shrink-0 items-center">
      <!-- Search Button (Cmd+K) -->
      <button 
        @click="$emit('open-search')" 
        class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/30 hover:text-sakura-600 transition-all text-sm"
        title="Search (⌘K)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span class="hidden md:inline">{{ t.search_placeholder }}</span>
        <kbd class="hidden md:inline px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-mono">⌘K</kbd>
      </button>

      <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>

      <!-- Music Button -->
      <button 
        @click="$emit('open-music')" 
        class="p-2 hover:bg-sakura-50 dark:hover:bg-sakura-900/30 rounded-lg transition-colors relative group"
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

      <!-- Particles Toggle -->
       <button @click="$emit('update:showParticles', !showParticles)" class="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center relative group" :title="showParticles ? 'Hide petals' : 'Show petals'">
         <span class="text-lg transition-all duration-300" :class="{'opacity-100 filter-none': showParticles, 'opacity-40 grayscale': !showParticles}">🌸</span>
       </button>
       <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

      <!-- Action Buttons -->
      <template v-if="currentFile">
         <!-- View Source Toggle (Only for Notes, Source files are always raw) -->
         <button v-if="!currentFile.isSource" @click="$emit('update:isRawMode', !isRawMode)" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" :title="isRawMode ? t.view_render : t.view_source">
            <span class="text-lg">{{ isRawMode ? '👁️' : '🖊️' }}</span>
         </button>

        <button @click="$emit('copy-link')" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" :title="t.copy_link">
          <span class="text-lg">🔗</span>
        </button>
        <button @click="$emit('download')" class="hidden md:flex p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors items-center gap-2 text-xs font-bold" :title="t.download">
          <span>DL</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>
        <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
      </template>

      <!-- Settings -->
      <button @click="$emit('open-settings')" class="p-2 text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 hover:rotate-90 transition-all duration-500" :title="t.settings_title">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { BreadcrumbItem, FileNode } from '../types';
import { useMusicStore } from '../stores/musicStore';

const musicStore = useMusicStore();

defineProps<{
  lang: string;
  t: any;
  breadcrumbs: BreadcrumbItem[];
  viewMode: string;
  currentTool: string | null;
  currentFile: FileNode | null;
  showParticles: boolean;
  isRawMode: boolean;
}>();

defineEmits([
  'reset', 
  'navigate', 
  'update:showParticles', 
  'update:isRawMode',
  'copy-link',
  'download',
  'open-settings',
  'open-search',
  'open-music',
  'open-write'
]);
</script>