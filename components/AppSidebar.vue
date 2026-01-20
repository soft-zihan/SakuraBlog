
<template>
  <aside class="w-full md:w-72 lg:w-80 flex-shrink-0 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-white/60 dark:border-gray-700/50 h-full z-30 transition-all duration-300">
    <!-- Profile Header -->
    <div class="p-8 pb-4 flex flex-col items-center border-b border-sakura-100/50 dark:border-gray-700/50 flex-shrink-0 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-sakura-50/50 to-transparent dark:from-sakura-900/20 pointer-events-none"></div>
      
      <!-- Language Switcher - 移动端放右上角避免与菜单按钮冲突 -->
      <div class="absolute top-4 left-4 z-20">
          <button @click="$emit('toggle-lang')" class="text-xs font-bold px-2 py-1 rounded bg-sakura-50 dark:bg-gray-800 text-sakura-600 dark:text-sakura-400 hover:bg-sakura-100 transition-colors shadow-sm border border-sakura-100 dark:border-gray-700">
            {{ lang === 'en' ? 'EN / 中' : '中 / EN' }}
          </button>
      </div>

      <div class="relative group cursor-pointer z-10" @click="$emit('reset')">
        <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-sakura-300 to-sakura-100 dark:from-sakura-700 dark:to-sakura-900 shadow-xl mb-4 group-hover:scale-105 transition-transform duration-300">
          <img 
            :src="avatarSrc" 
            @error="handleAvatarError"
            class="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800"
            alt="Avatar"
          />
        </div>
        <div class="absolute bottom-4 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-sakura-100 dark:border-gray-700 text-xs">🌸</div>
      </div>
      
      <h1 class="text-xl font-bold text-sakura-800 dark:text-sakura-300 tracking-tight z-10 hover:text-sakura-600 transition-colors" @click="$emit('reset')">Sakura Notes</h1>
      <p class="text-xs text-sakura-500 dark:text-sakura-400 mt-1 font-medium bg-sakura-50 dark:bg-gray-800 px-3 py-1 rounded-full z-10">{{ t.subtitle }}</p>
    </div>

    <!-- View Toggles -->
    <div class="px-6 py-4 flex-shrink-0">
      <div class="flex p-1.5 bg-sakura-50/80 dark:bg-gray-800/50 rounded-2xl border border-sakura-100 dark:border-gray-700 relative">
        <button 
          v-for="mode in ['latest', 'files', 'lab']"
          :key="mode"
          @click="$emit('update:viewMode', mode)"
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1 z-10"
          :class="viewMode === mode 
            ? (mode === 'lab' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-sm ring-1 ring-purple-100 dark:ring-purple-900' : 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-sm ring-1 ring-sakura-100 dark:ring-gray-600') 
            : 'text-sakura-400 dark:text-gray-500 hover:text-sakura-600 hover:bg-white/50 dark:hover:bg-gray-700/50'"
        >
          {{ mode === 'latest' ? '⏰ ' + t.tab_latest : (mode === 'files' ? '📁 ' + t.tab_files : '🧪 ' + t.tab_lab) }}
        </button>
      </div>
    </div>

    <!-- File List / Tree -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
      <div v-if="loading" class="flex flex-col items-center justify-center py-10 text-sakura-400">
        <div class="animate-bounce text-2xl mb-2">🌸</div>
        <span class="text-xs font-medium">{{ t.reading_notes }}</span>
      </div>

      <!-- LAB MODE SIDEBAR -->
      <div v-else-if="viewMode === 'lab'" class="animate-fade-in pb-20">
          <div class="px-2 mb-4">
            <!-- Lab Stage Tabs (always visible) -->
            <div v-if="labTabs && labTabs.length > 0" class="mb-4 space-y-1">
              <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 pl-1">
                🎯 {{ lang === 'zh' ? '学习阶段' : 'Learning Stages' }}
              </h3>
              <div 
                v-for="tab in labTabs" 
                :key="tab.id"
                @click="handleLabTabClick(tab.id)"
                class="p-2 rounded-lg cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border flex items-center gap-2"
                :class="activeLabTab === tab.id && currentTool === 'dashboard'
                  ? 'bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/30 dark:to-purple-900/20 border-sakura-200 dark:border-sakura-700/50' 
                  : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'"
              >
                <span class="text-lg">{{ tab.icon }}</span>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{{ tab.shortLabel }}</div>
                  <div v-if="tab.noteNum" class="text-[10px] text-gray-400 dark:text-gray-500">{{ lang === 'zh' ? `笔记 ${tab.noteNum}` : `Note ${tab.noteNum}` }}</div>
                </div>
                <span v-if="activeLabTab === tab.id && currentTool === 'dashboard'" class="w-1.5 h-1.5 rounded-full bg-sakura-500"></span>
              </div>
            </div>

            <!-- VUE Learning Notes Section -->
            <div v-if="labFolder" class="mb-4">
              <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 pl-1">
                📚 {{ lang === 'zh' ? 'VUE 学习笔记' : 'VUE Learning Notes' }}
              </h3>
              <div class="space-y-1">
                <div 
                  v-for="note in labFolderFiles" 
                  :key="note.path"
                  @click="$emit('select-file', note)"
                  class="p-2 rounded-lg cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-sakura-100 dark:hover:border-gray-700 flex items-center gap-2"
                  :class="{'bg-sakura-50 dark:bg-sakura-900/20 border-sakura-100 dark:border-sakura-800/30': currentFile?.path === note.path}"
                >
                  <span class="text-sm">📝</span>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{{ note.name.replace('.md', '') }}</span>
                </div>
              </div>
            </div>

            <!-- Source Code Explorer Link -->
            <div 
              @click="$emit('select-tool', 'source-code')"
              class="p-3 rounded-xl border border-green-100 dark:border-green-900/30 cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all mb-4 flex items-center gap-3 bg-green-50/50 dark:bg-gray-800/30"
              :class="{'ring-2 ring-green-300 dark:ring-green-700 bg-white dark:bg-gray-800': currentTool === 'source-code'}"
            >
              <span class="text-xl">💻</span>
              <div class="flex-1">
                <div class="text-sm font-bold text-green-900 dark:text-green-300">{{ lang === 'zh' ? '源码展示' : 'Source Code' }}</div>
                <div class="text-[10px] text-green-500 dark:text-green-400">{{ lang === 'zh' ? '带笔记的项目源码阅读' : 'Read project source with notes' }}</div>
              </div>
            </div>
            
            <!-- External Resources Section -->
            <div class="space-y-6">
              <div v-for="(cat, idx) in resourceCategories" :key="idx">
                <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 pl-1">
                    {{ cat.title }}
                </h3>
                <div class="space-y-2">
                    <a v-for="link in cat.items" :key="link.name" :href="link.url" target="_blank" class="block p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group relative overflow-hidden">
                      <div class="flex items-center gap-2 relative z-10">
                          <span class="text-base filter grayscale group-hover:grayscale-0 transition-all">{{ link.icon }}</span> 
                          <span class="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-sakura-600 dark:group-hover:text-sakura-400 transition-colors">{{ link.name }}</span>
                      </div>
                      <div class="text-[10px] text-gray-400 dark:text-gray-500 pl-6 mt-0.5 truncate group-hover:text-sakura-500 transition-colors">{{ link.desc }}</div>
                    </a>
                </div>
              </div>
            </div>

          </div>
      </div>

      <!-- Filter Section (for Latest and Files views) -->
      <div v-if="viewMode === 'latest' || viewMode === 'files'" class="px-2 mb-4">
        <!-- Favorites Filter -->
        <div class="mb-3">
          <button 
            @click="articleStore.toggleShowFavoritesOnly()"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            :class="articleStore.showFavoritesOnly 
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800' 
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <span>{{ articleStore.showFavoritesOnly ? '⭐' : '☆' }}</span>
            <span class="font-medium">{{ lang === 'zh' ? '仅显示收藏' : 'Favorites Only' }}</span>
            <span class="ml-auto text-xs opacity-70">({{ articleStore.favoritesCount }})</span>
          </button>
        </div>
        
        <!-- Tags Filter -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{{ lang === 'zh' ? '标签筛选' : 'Tags' }}</span>
            <div class="flex gap-1">
              <button 
                @click="articleStore.selectAllTags()"
                class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-sakura-100 hover:text-sakura-600"
              >
                {{ lang === 'zh' ? '全选' : 'All' }}
              </button>
              <button 
                @click="articleStore.deselectAllTags()"
                class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-sakura-100 hover:text-sakura-600"
              >
                {{ lang === 'zh' ? '清空' : 'None' }}
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button 
              v-for="tag in articleStore.availableTags"
              :key="tag"
              @click="articleStore.toggleTag(tag)"
              class="px-2 py-1 text-xs rounded-full transition-all"
              :class="articleStore.isTagSelected(tag)
                ? 'bg-sakura-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-sakura-100 dark:hover:bg-sakura-900/30'"
            >
              {{ tag === 'notag' ? (lang === 'zh' ? '无标签' : 'No Tag') : tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- Latest View (only for latest mode) -->
      <div v-if="viewMode === 'latest'" class="space-y-3 pb-20">
          <div v-if="filteredFlatFiles.length === 0" class="text-center text-gray-400 py-10 text-sm italic">
          {{ t.no_notes }}
        </div>
        <ArticleCard
          v-for="file in filteredFlatFiles" 
          :key="file.path"
          :file="file"
          :isActive="currentFile?.path === file.path"
          :showPath="true"
          :lang="lang as 'en' | 'zh'"
          @click="$emit('select-file', file)"
        />
      </div>

      <!-- Tree View (only for files mode, NOT lab mode) -->
      <div v-else-if="viewMode === 'files'" class="animate-fade-in pb-20 pt-2">
        <FileTree 
          :nodes="filteredFileSystem" 
          :expanded-paths="expandedFolders"
          :current-path="currentPath"
          @toggle-folder="$emit('toggle-folder', $event)"
          @select-file="$emit('select-file', $event)"
          @select-folder="$emit('select-folder', $event)"
        />
      </div>
    </div>
    
    <!-- Footer Info -->
    <div class="p-4 border-t border-sakura-100/50 dark:border-gray-700/50 flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
        <a href="https://github.com/soft-zihan/soft-zihan.github.io" target="_blank" class="text-xs text-sakura-400 hover:text-sakura-600 dark:text-gray-500 dark:hover:text-sakura-400 flex items-center gap-2 transition-colors group">
          <svg class="w-4 h-4 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span>Code</span>
        </a>
        <span class="text-[10px] text-sakura-300 dark:text-gray-600 font-mono">v1.1</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FileTree from './FileTree.vue';
import ArticleCard from './ArticleCard.vue';
import type { FileNode } from '../types';
import { NodeType } from '../types';
import { useArticleStore } from '../stores/articleStore';

const articleStore = useArticleStore();

const props = defineProps<{
  lang: string;
  t: any;
  viewMode: string;
  loading: boolean;
  fileSystem: FileNode[];
  filteredFileSystem: FileNode[];
  filteredFlatFiles: FileNode[];
  currentFile: FileNode | null;
  expandedFolders: string[];
  currentPath: string;
  labFolder: FileNode | null;
  resourceCategories: any[];
  currentTool: string | null;
  labTabs?: any[]; // Lab dashboard tabs from parent
  activeLabTab?: string; // Current active lab tab
}>();

// Compute files in labFolder (VUE学习笔记 or VUE Learning)
const labFolderFiles = computed(() => {
  if (!props.labFolder || !props.labFolder.children) return [];
  return props.labFolder.children
    .filter(node => node.type === NodeType.FILE && node.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }));
});

const emit = defineEmits([
  'toggle-lang',
  'reset',
  'update:viewMode',
  'select-tool',
  'toggle-folder',
  'select-file',
  'select-folder',
  'open-search',
  'update:activeLabTab' // For lab tab switching
]);

// Handle lab tab click - select dashboard tool and switch tab
const handleLabTabClick = (tabId: string) => {
  emit('select-tool', 'dashboard');
  emit('update:activeLabTab', tabId);
};

// Avatar Logic: Prefer external, fallback to local
const avatarSrc = ref('https://picx.zhimg.com/80/v2-1e3a27439c019dff7f9f7a679005c950_720w.webp?source=1def8aca');
const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // If fallback also fails, avoid infinite loop
  if (!target.src.includes('Avatar.webp')) {
     // Fallback to local image. Assumes user puts 'Avatar.webp' in public/ root.
     avatarSrc.value = './Avatar.webp';
  }
};

const getCleanParentPath = (path: string) => {
  const parts = path.split('/');
  const parent = parts.slice(0, -1).join('/');
  return parent || 'Root';
};

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '';
</script>
