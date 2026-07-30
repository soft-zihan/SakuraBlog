<template>
  <div :class="containerClass">
    <template v-if="showFileActions && currentFile">
      <button v-if="!currentFile.isSource && !isPdf" @click="$emit('update:isRawMode', !isRawMode)" :class="iconButtonClass" :title="isRawMode ? t.view_render : t.view_source">
        <svg v-if="isRawMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        <span v-if="showLabels" :class="labelClass">{{ isRawMode ? t.view_render : t.view_source }}</span>
      </button>
      <button @click="$emit('copy-link')" :class="iconButtonClass" :title="t.copy_link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <span v-if="showLabels" :class="labelClass">{{ t.copy_link }}</span>
      </button>
    </template>

    <button v-if="showDualColumnToggle && viewMode === 'lab'" @click="$emit('toggle-dual-column')" :class="dualColumnClass" :title="lang === 'zh' ? '双栏阅读' : 'Dual Column'">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="18" rx="1"/>
        <rect x="14" y="3" width="7" height="18" rx="1"/>
      </svg>
      <span v-if="showLabels" :class="labelClass">{{ lang === 'zh' ? '双栏阅读' : 'Dual Column' }}</span>
    </button>

    <button v-if="showSearch" @click="$emit('open-search')" :class="iconButtonClass" title="Search (⌘K)">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <span v-if="showLabels" :class="labelClass">{{ t.search }}</span>
    </button>

    <div v-if="showDivider" :class="dividerClass"></div>

    <template v-if="showWallpaperActions">
      <button @click="$emit('change-wallpaper')" :class="iconButtonClass" :title="lang === 'zh' ? '更换壁纸' : 'Next Wallpaper'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span v-if="showLabels" :class="labelClass">{{ lang === 'zh' ? '换壁纸' : 'Next WP' }}</span>
      </button>

      <div v-if="showCollectionDropdown" class="relative z-50" ref="collectionDropdownRef">
        <button @click.stop="toggleCollectionDropdown" class="p-3 -m-1 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400" :class="collectionOpen ? 'bg-[var(--primary-50)]/80 dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)]' : ''" :title="lang === 'zh' ? '收藏壁纸' : 'Save Wallpaper'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
        <div v-if="collectionOpen" class="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-fade-in origin-top-right space-y-1">
          <button @click="handleAddToCollection('light')" class="w-full text-left px-4 py-3 text-xs rounded-lg flex items-center gap-3 transition-colors border shadow-sm group bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300">
            <span class="w-3 h-3 rounded-full bg-white border border-gray-300 shadow-sm group-hover:scale-110 transition-transform"></span>
            {{ lang === 'zh' ? '添加到明亮主题' : 'Add to Light Theme' }}
          </button>
          <button @click="handleAddToCollection('dark')" class="w-full text-left px-4 py-3 text-xs rounded-lg flex items-center gap-3 transition-colors border shadow-sm group bg-gray-900 border-gray-700 text-white hover:bg-black hover:border-gray-600">
            <span class="w-3 h-3 rounded-full bg-black border border-gray-600 shadow-sm group-hover:scale-110 transition-transform"></span>
            {{ lang === 'zh' ? '添加到深色主题' : 'Add to Dark Theme' }}
          </button>
        </div>
      </div>

      <button v-if="showFavorite" @click="$emit('toggle-favorite')" :class="iconButtonClass" :title="lang === 'zh' ? '收藏' : 'Save'">
        <span class="text-lg">{{ isFavorite ? '★' : '☆' }}</span>
        <span v-if="showLabels" :class="labelClass">{{ lang === 'zh' ? '收藏' : 'Save' }}</span>
      </button>

      <button v-if="showDownloadWallpaper" @click="$emit('download-wallpaper')" :class="iconButtonClass" :title="lang === 'zh' ? '下载壁纸' : 'Download Wallpaper'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        <span v-if="showLabels" :class="labelClass">{{ lang === 'zh' ? '下载' : 'DL WP' }}</span>
      </button>
    </template>

    <button v-if="showThemeToggle" @click="$emit('toggle-theme')" :class="iconButtonClass" :title="t.theme">
      <span class="text-lg">{{ isDark ? '🌙' : '☀️' }}</span>
      <span v-if="showLabels" :class="labelClass">{{ t.theme }}</span>
    </button>

    <button v-if="showMusic" @click="$emit('open-music')" :class="iconButtonClass" :title="t.music_player">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      <span v-if="isPlaying" class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      <span v-if="showLabels" :class="labelClass">{{ t.music_player }}</span>
    </button>

    <button v-if="showWrite" @click="$emit('open-write')" :class="iconButtonClass" :title="t.write_title">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
      <span v-if="showLabels" :class="labelClass">{{ t.write_title }}</span>
    </button>

    <button v-if="showThemePanel" @click="$emit('toggle-theme-panel')" :class="iconButtonClass" :title="lang === 'zh' ? '主题' : 'Theme'" data-theme-panel-toggle="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
      <span v-if="showLabels" :class="labelClass">{{ lang === 'zh' ? '主题' : 'Theme' }}</span>
    </button>

    <div v-if="showEndDivider" :class="dividerClass"></div>

    <button v-if="showDownload" @click="$emit('open-download')" :class="iconButtonClass" :title="lang === 'zh' ? '批量下载' : 'Batch Download'">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" x2="12" y1="15" y2="3"/>
      </svg>
      <span v-if="showLabels" :class="labelClass">{{ lang === 'zh' ? '批量下载' : 'Batch Download' }}</span>
    </button>

    <button v-if="showSettings" @click="$emit('open-settings')" :class="iconButtonClass" :title="t.settings_title">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      <span v-if="showLabels" :class="labelClass">{{ t.settings_title }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { FileNode } from '@/types';

const props = withDefaults(defineProps<{
  layout: 'horizontal' | 'vertical';
  lang: 'en' | 'zh';
  t: any;
  currentFile?: FileNode | null;
  isRawMode?: boolean;
  isPdf?: boolean;
  viewMode?: string;
  dualColumnMode?: boolean;
  isPlaying?: boolean;
  isDark?: boolean;
  isFavorite?: boolean;
  showLabels?: boolean;
  showFileActions?: boolean;
  showDualColumnToggle?: boolean;
  showSearch?: boolean;
  showWallpaperActions?: boolean;
  showCollectionDropdown?: boolean;
  showFavorite?: boolean;
  showDownloadWallpaper?: boolean;
  showThemeToggle?: boolean;
  showMusic?: boolean;
  showWrite?: boolean;
  showThemePanel?: boolean;
  showDownload?: boolean;
  showSettings?: boolean;
}>(), {
  currentFile: null,
  isRawMode: false,
  isPdf: false,
  viewMode: '',
  dualColumnMode: false,
  isPlaying: false,
  isDark: false,
  isFavorite: false,
  showLabels: false,
  showFileActions: true,
  showDualColumnToggle: true,
  showSearch: true,
  showWallpaperActions: true,
  showCollectionDropdown: false,
  showFavorite: false,
  showDownloadWallpaper: true,
  showThemeToggle: false,
  showMusic: true,
  showWrite: true,
  showThemePanel: true,
  showDownload: true,
  showSettings: true
});

const emit = defineEmits([
  'update:isRawMode',
  'copy-link',
  'toggle-dual-column',
  'open-search',
  'change-wallpaper',
  'add-to-collection',
  'download-wallpaper',
  'toggle-favorite',
  'toggle-theme',
  'open-music',
  'open-write',
  'toggle-theme-panel',
  'open-download',
  'open-settings'
]);

const isVertical = computed(() => props.layout === 'vertical');
const containerClass = computed(() => isVertical.value ? 'flex flex-col gap-4 items-center' : 'flex gap-2 shrink-0 items-center');
const iconButtonClass = computed(() => {
  if (props.showLabels || isVertical.value) {
    return 'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 w-full aspect-square hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative z-10';
  }
  return 'p-2 hover:bg-[var(--primary-50)]/80 dark:hover:bg-[var(--primary-900)]/30 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative z-10';
});
const labelClass = computed(() => 'text-[10px] mt-1 font-medium truncate w-full text-center');
const dividerClass = computed(() => isVertical.value ? 'w-8 h-px bg-gray-200 dark:bg-gray-700 shrink-0' : 'w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1');
const dualColumnClass = computed(() => {
  if (props.showLabels || isVertical.value) {
    return props.dualColumnMode ? 'flex flex-col items-center justify-center p-2 rounded-xl transition-colors w-full aspect-square bg-[var(--primary-500)] text-white' : 'flex flex-col items-center justify-center p-2 rounded-xl transition-colors w-full aspect-square bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30 hover:text-[var(--primary-600)]';
  }
  return props.dualColumnMode ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm bg-[var(--primary-500)] text-white' : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30 hover:text-[var(--primary-600)]';
});

const showDivider = computed(() => props.showSearch && (props.showWallpaperActions || props.showThemeToggle));
const showEndDivider = computed(() => props.showThemePanel && (props.showDownload || props.showSettings));

const collectionOpen = ref(false);
const collectionDropdownRef = ref<HTMLElement | null>(null);

const toggleCollectionDropdown = () => {
  collectionOpen.value = !collectionOpen.value;
};

const handleAddToCollection = (theme?: 'light' | 'dark') => {
  collectionOpen.value = false;
  emit('add-to-collection', theme);
};

const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node | null;
  if (!collectionOpen.value || !collectionDropdownRef.value) return;
  if (target && collectionDropdownRef.value.contains(target)) return;
  collectionOpen.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>
