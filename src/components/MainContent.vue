<template>
  <div 
    v-if="currentFile || (viewMode === 'lab' && currentTool) || currentFolder" 
    class="flex-1 flex flex-col overflow-hidden w-full"
  >
    
    <!-- Lab Tool View (Unified Dashboard) -->
    <div v-if="viewMode === 'lab' && currentTool === 'dashboard'" ref="scrollContainerRef" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
       <div class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
         <LabDashboard 
           :lang="lang" 
           :model-value="labDashboardTab" 
           @update:model-value="$emit('update:labDashboardTab', $event)"
           @tab-change="$emit('tab-change', $event)" 
           @select-lab="$emit('select-tool', $event)" 
         />
       </div>
    </div>

    <!-- Lab: Source Code Viewer -->
    <div v-else-if="viewMode === 'lab' && currentTool === 'source-code'" class="w-full h-full animate-fade-in">
       <SourceCodeViewer :lang="lang" />
    </div>

    <!-- Lab: Event Handling -->
    <div v-else-if="viewMode === 'lab' && currentTool === 'event-handling'" ref="scrollContainerRef" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
       <div class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
         <LabEventHandling :lang="lang" />
       </div>
    </div>

    <!-- Lab: Slot System -->
    <div v-else-if="viewMode === 'lab' && currentTool === 'slot'" ref="scrollContainerRef" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
       <div class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
         <LabSlot :lang="lang" />
       </div>
    </div>

    <!-- Folder View Component -->
    <div v-else-if="currentFolder" ref="scrollContainerRef" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
      <FolderView 
        :current-folder="currentFolder"
        @open-folder="$emit('open-folder', $event)"
        @open-file="$emit('open-file', $event)"
      />
    </div>

    <!-- Note Content View (ArticleReader) -->
    <ArticleReader
       v-else-if="currentFile" 
       :file="currentFile"
       :loading="contentLoading"
       :isRawMode="isRawMode"
       :lang="lang"
       :t="t"
       :getArticleViews="getArticleViews"
       :getArticleVisitors="getArticleVisitors"
       :getArticleComments="getArticleComments"
       :onContentClick="onContentClick"
       @scroll-container-change="handleScrollContainerFromArticleReader"
       @markdown-viewer-change="handleMarkdownViewerFromArticleReader"
       @update-comment-count="$emit('update-comment-count', $event)"
       @open-file="$emit('open-file', $event)"
       @open-search="$emit('open-search')"
       @open-settings="$emit('open-settings')"
       @open-music="$emit('open-music')"
       @open-write="$emit('open-write')"
       @open-download="$emit('open-download')"
       @toggle-theme="$emit('toggle-theme')"
    />

  </div>

  <!-- Empty State / Home -->
  <div v-else ref="scrollContainerRef" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6">
    <WelcomeScreen
      :t="t"
      :lang="lang"
      :welcome-poem-loading="welcomePoemLoading"
      :welcome-poem-error="welcomePoemError"
      :welcome-poem="welcomePoem"
      :welcome-poem-author-line="welcomePoemAuthorLine"
      :welcome-poem-lines="welcomePoemLines"
      :welcome-poem-details="welcomePoemDetails"
      @load-random-poem="$emit('load-random-poem')"
    />
    <div class="h-16"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, type Ref, defineAsyncComponent } from 'vue';
import type { FileNode } from '../types';
import type { GuwenItem } from '../composables/usePoem';

// Components
import WelcomeScreen from './WelcomeScreen.vue';

const LabDashboard = defineAsyncComponent(() => import('./lab/LabDashboard.vue'))
const SourceCodeViewer = defineAsyncComponent(() => import('./lab/SourceCodeViewer.vue'))
const LabEventHandling = defineAsyncComponent(() => import('./lab/stage6-vue-core/LabEventHandling.vue'))
const LabSlot = defineAsyncComponent(() => import('./lab/stage7-vue-advanced/LabSlot.vue'))
const FolderView = defineAsyncComponent(() => import('./FolderView.vue'))
const ArticleReader = defineAsyncComponent(() => import('../views/ArticleReader.vue'))

const props = defineProps<{
  viewMode: 'latest' | 'files' | 'lab';
  currentTool: string | null;
  currentFile: FileNode | null;
  currentFolder: FileNode | null;
  labDashboardTab: string;
  lang: 'en' | 'zh';
  t: any;
  loading: boolean;
  contentLoading: boolean;
  isRawMode: boolean;
  welcomePoemLoading: boolean;
  welcomePoemError: string;
  welcomePoem: GuwenItem | null;
  welcomePoemAuthorLine: string;
  welcomePoemLines: string[];
  welcomePoemDetails: Array<{ label: string; value: string }>;
  getArticleViews: (path: string) => number | undefined;
  getArticleVisitors: (path: string) => number | undefined;
  getArticleComments: (path: string) => number;
  onContentClick: (e: MouseEvent) => void;
}>();

const emit = defineEmits<{
  (e: 'update:labDashboardTab', val: string): void;
  (e: 'tab-change', val: string): void;
  (e: 'select-tool', val: string): void;
  (e: 'open-folder', val: FileNode): void;
  (e: 'open-file', val: FileNode): void;
  (e: 'update-comment-count', val: { path: string; count: number }): void;
  (e: 'load-random-poem'): void;
  (e: 'scroll-container-change', val: HTMLElement | null): void;
  (e: 'markdown-viewer-change', val: HTMLElement | null): void;
  (e: 'open-search'): void;
  (e: 'open-settings'): void;
  (e: 'open-music'): void;
  (e: 'open-write'): void;
  (e: 'open-download'): void;
  (e: 'toggle-theme'): void;
}>();

const scrollContainerRef = ref<HTMLElement | null>(null);

watch(scrollContainerRef, (el) => {
  emit('scroll-container-change', el);
}, { immediate: true });

watch(
  () => [props.viewMode, props.currentTool, props.labDashboardTab] as const,
  async ([viewMode, currentTool, tab], [prevViewMode, prevTool, prevTab]) => {
    if (viewMode !== 'lab' || currentTool !== 'dashboard') return;
    if (tab === prevTab && viewMode === prevViewMode && currentTool === prevTool) return;
    await nextTick();
    scrollContainerRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
  }
);

const handleScrollContainerFromArticleReader = (el: HTMLElement | null) => {
  scrollContainerRef.value = el
}

const handleMarkdownViewerFromArticleReader = (el: HTMLElement | null) => {
  emit('markdown-viewer-change', el)
}
</script>
