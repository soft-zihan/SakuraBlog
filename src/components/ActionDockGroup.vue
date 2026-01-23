<template>
  <ActionDock
    :layout="layout"
    :lang="lang"
    :t="t"
    :current-file="currentFile"
    :is-raw-mode="isRawMode"
    :is-pdf="isPdf"
    :view-mode="viewMode"
    :dual-column-mode="dualColumnMode"
    :is-playing="isPlaying"
    :show-file-actions="true"
    :show-dual-column-toggle="true"
    :show-search="true"
    :show-wallpaper-actions="true"
    :show-collection-dropdown="true"
    :show-favorite="false"
    :show-download-wallpaper="true"
    :show-theme-toggle="false"
    :show-music="true"
    :show-write="true"
    :show-theme-panel="true"
    :show-download="true"
    :show-settings="true"
    @update:isRawMode="emit('update:isRawMode', $event)"
    @copy-link="emit('copy-link')"
    @download="emit('download')"
    @toggle-dual-column="emit('toggle-dual-column')"
    @open-search="emit('open-search')"
    @change-wallpaper="changeWallpaper"
    @add-to-collection="addCurrentToList"
    @download-wallpaper="downloadCurrentWallpaper"
    @open-music="emit('open-music')"
    @open-write="emit('open-write')"
    @toggle-theme-panel="emit('toggle-theme-panel')"
    @open-download="emit('open-download')"
    @open-settings="emit('open-settings')"
  />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore';
import type { FileNode } from '@/types';
import { useToast } from '@/composables/useToast';
import { useWallpapers } from '@/composables/useWallpapers';
import ActionDock from './ActionDock.vue';

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
  downloadToast?: boolean;
}>(), {
  currentFile: null,
  isRawMode: false,
  isPdf: false,
  viewMode: '',
  dualColumnMode: false,
  isPlaying: false,
  downloadToast: false
});

const emit = defineEmits([
  'update:isRawMode',
  'copy-link',
  'download',
  'toggle-dual-column',
  'open-search',
  'open-music',
  'open-write',
  'toggle-theme-panel',
  'open-download',
  'open-settings'
]);

const appStore = useAppStore();
const { showToast } = useToast();
const { 
  changeWallpaperSameSeries, 
  downloadWallpaper, 
  currentWallpaperPath, 
  addCustomWallpaper
} = useWallpapers();

const changeWallpaper = async () => {
  showToast(props.lang === 'zh' ? '正在更换壁纸...' : 'Changing Wallpaper...');
  const success = await changeWallpaperSameSeries();
  if (success) {
    showToast(props.lang === 'zh' ? '壁纸已更换' : 'Wallpaper Updated');
  } else {
    showToast(props.lang === 'zh' ? '更换失败，请稍后再试' : 'Failed to change wallpaper');
  }
};

const addToWallpaperList = (wp: { name?: string; url: string }, theme?: 'light' | 'dark') => {
  addCustomWallpaper({
    name: wp.name || 'Wallpaper',
    url: wp.url,
    theme: theme || (appStore.isDark ? 'dark' : 'light'),
    source: 'api'
  });
};

const addCurrentToList = (theme?: 'light' | 'dark') => {
  const url = currentWallpaperPath.value;
  if (!url) return;
  addToWallpaperList({ name: 'Saved Wallpaper', url }, theme);
  showToast(theme === 'light' ? (props.lang === 'zh' ? '已添加到明亮主题' : 'Added to Light Theme') : (props.lang === 'zh' ? '已添加到深色主题' : 'Added to Dark Theme'));
};

const downloadCurrentWallpaper = () => {
  const url = currentWallpaperPath.value;
  if (!url) return;
  downloadWallpaper(url);
  if (props.downloadToast) {
    showToast(props.lang === 'zh' ? '开始下载...' : 'Downloading...');
  }
};
</script>
