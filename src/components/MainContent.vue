<template>
  <div 
    v-if="currentFile || (viewMode === 'lab' && currentTool) || currentFolder" 
    class="flex-1 flex flex-col overflow-hidden w-full"
  >
    
    <!-- Lab Tool View (Unified Dashboard) -->
    <div v-if="viewMode === 'lab' && currentTool === 'dashboard'" id="scroll-container" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
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
    <div v-else-if="viewMode === 'lab' && currentTool === 'event-handling'" id="scroll-container" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
       <div class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
         <LabEventHandling :lang="lang" />
       </div>
    </div>

    <!-- Lab: Slot System -->
    <div v-else-if="viewMode === 'lab' && currentTool === 'slot'" id="scroll-container" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
       <div class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
         <LabSlot :lang="lang" />
       </div>
    </div>

    <!-- Folder View Component -->
    <div v-else-if="currentFolder" id="scroll-container" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full">
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
       :getArticleComments="getArticleComments"
       :onContentClick="onContentClick"
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
  <div v-else id="scroll-container" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6">
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
import type { FileNode } from '../types';
import type { GuwenItem } from '../composables/usePoem';

// Components
import LabDashboard from './lab/LabDashboard.vue';
import SourceCodeViewer from './lab/SourceCodeViewer.vue';
import LabEventHandling from './lab/stage6-vue-core/LabEventHandling.vue';
import LabSlot from './lab/stage7-vue-advanced/LabSlot.vue';
import FolderView from './FolderView.vue';
import ArticleReader from '../views/ArticleReader.vue';
import WelcomeScreen from './WelcomeScreen.vue';

defineProps<{
  viewMode: string;
  currentTool: string | null;
  currentFile: FileNode | null;
  currentFolder: FileNode | null;
  labDashboardTab: string;
  lang: string;
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
  getArticleViews: (path: string) => number;
  getArticleComments: (path: string) => number;
  onContentClick: (e: MouseEvent) => void;
}>();

defineEmits<{
  (e: 'update:labDashboardTab', val: string): void;
  (e: 'tab-change', val: string): void;
  (e: 'select-tool', val: string): void;
  (e: 'open-folder', val: FileNode): void;
  (e: 'open-file', val: FileNode): void;
  (e: 'update-comment-count', val: { path: string; count: number }): void;
  (e: 'load-random-poem'): void;
}>();
</script>
