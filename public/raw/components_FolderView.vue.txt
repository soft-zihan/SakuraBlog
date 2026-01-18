<template>
  <div class="w-full max-w-6xl mx-auto">
     <div class="flex items-center gap-4 mb-8 p-8 bg-white/60 dark:bg-gray-800/60 rounded-[2rem] border border-white dark:border-gray-700 shadow-xl backdrop-blur-md">
       <span class="text-5xl bg-sakura-100 dark:bg-sakura-900/50 p-4 rounded-2xl shadow-inner text-sakura-500">📁</span>
       <div>
         <h2 class="text-3xl font-bold text-sakura-900 dark:text-sakura-100">{{ currentFolder.name }}</h2>
         <p class="text-sakura-500 dark:text-sakura-400 mt-1 font-medium">{{ currentFolder.children?.length || 0 }} items inside</p>
       </div>
     </div>
     <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
       <div 
          v-for="child in sortedFolderChildren" 
          :key="child.path"
          @click="handleSingleClick(child)"
          @dblclick="handleDoubleClick(child)"
          class="folder-card bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-md border border-white/70 dark:border-gray-700 hover:shadow-xl hover:shadow-sakura-100/30 dark:hover:shadow-black/40 hover:bg-white dark:hover:bg-gray-800 hover:border-sakura-200 dark:hover:border-sakura-800 cursor-pointer transition-all duration-300 flex flex-col h-48 backdrop-blur-sm group relative overflow-hidden select-none"
          :class="{ 'ring-2 ring-sakura-300 dark:ring-sakura-600': selectedItem === child.path }"
       >
         <div class="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-sakura-50 to-transparent dark:from-sakura-900/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
         <div class="flex items-start justify-between mb-4 relative z-10">
           <span class="text-5xl group-hover:scale-110 transition-transform drop-shadow-sm">{{ child.type === 'directory' ? '📂' : (child.isSource ? '💻' : '📝') }}</span>
           <div class="flex flex-col items-end gap-1">
             <span v-if="child.type === 'file'" class="text-[10px] text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-gray-900 px-2 py-1 rounded-full font-bold">{{ formatDate(child.lastModified) }}</span>
             <span v-if="child.type === 'directory'" class="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-full">{{ lang === 'zh' ? '双击打开' : 'Double-click' }}</span>
           </div>
         </div>
         <div class="mt-auto relative z-10">
           <h3 class="font-bold text-gray-700 dark:text-gray-200 truncate text-lg group-hover:text-sakura-600 dark:group-hover:text-sakura-400 transition-colors" :title="child.name">{{ child.name.replace('.md', '') }}</h3>
           <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate font-medium">
             {{ child.type === 'directory' ? `${child.children?.length || 0} items` : (child.isSource ? 'Source Code' : 'Markdown Note') }}
           </p>
         </div>
       </div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NodeType, type FileNode } from '../types';

const props = defineProps<{
  currentFolder: FileNode;
  lang?: 'en' | 'zh';
}>();

const emit = defineEmits(['open-folder', 'open-file']);

const selectedItem = ref<string | null>(null);
let clickTimer: ReturnType<typeof setTimeout> | null = null;

const sortedFolderChildren = computed(() => {
  if (!props.currentFolder || !props.currentFolder.children) return [];
  return [...props.currentFolder.children].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === NodeType.DIRECTORY ? -1 : 1;
  });
});

// Single click - select item (for files, also open)
const handleSingleClick = (child: FileNode) => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  
  // For files, single click opens
  if (child.type !== 'directory') {
    emit('open-file', child);
    return;
  }
  
  // For folders, single click selects (with delay to wait for potential double-click)
  clickTimer = setTimeout(() => {
    selectedItem.value = child.path;
  }, 200);
};

// Double click - open folder
const handleDoubleClick = (child: FileNode) => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  
  if (child.type === 'directory') {
    emit('open-folder', child);
  } else {
    emit('open-file', child);
  }
};

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '';
</script>