
<template>
  <aside class="w-full flex-shrink-0 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-white/60 dark:border-gray-700/50 h-full z-30 transition-all duration-300 ease-out">
    <!-- Profile Header -->
    <div class="p-6 pb-4 flex flex-col border-b flex-shrink-0 relative overflow-hidden" :style="softBorderStyle">
      <div class="absolute top-0 left-0 w-full h-24 pointer-events-none" :style="headerGlowStyle"></div>
      
      <!-- Language Switcher and Toggle Button Row -->
      <div class="flex justify-between items-center z-20 mb-4">
        <div class="flex">
          <button @click="$emit('toggle-lang')" class="text-xs font-bold px-2 py-1 rounded transition-colors shadow-sm border dark:border-gray-700" :style="languageButtonStyle">
            {{ lang === 'en' ? 'EN / 中' : '中 / EN' }}
          </button>
        </div>
        <div>
          <button @click="$emit('toggle-sidebar')" class="w-8 h-8 rounded-lg border shadow-sm flex items-center justify-center transition-colors" :style="languageButtonStyle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Avatar and Title -->
      <div class="flex items-center z-10" @click="handleLogoClick">
        <div class="relative group cursor-pointer z-10 mr-3">
          <div class="w-14 h-14 rounded-full p-1 shadow-xl group-hover:scale-105 transition-transform duration-300" :style="avatarRingStyle">
            <img 
              :src="avatarSrc" 
              @error="handleAvatarError"
              class="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800"
              alt="Avatar"
            />
          </div>
          <div class="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border text-xs" :style="softBorderStyle">🌸</div>
        </div>
        
        <div class="flex flex-col flex-1">
          <h1 class="text-lg font-bold tracking-tight z-10 transition-colors" :style="titleStyle">Sakura Notes</h1>
          <p class="text-xs mt-0.5 font-medium px-2 py-0.5 rounded-full z-10" :style="subtitleStyle">{{ t.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- View Toggles -->
    <div class="px-6 py-4 flex-shrink-0">
      <div class="flex p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 relative" :style="tabContainerStyle">
        <button 
          v-for="mode in ['latest', 'files', 'lab']"
          :key="mode"
          @click="$emit('update:viewMode', mode)"
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1 z-10"
          :class="viewMode === mode 
            ? (mode === 'lab' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-sm ring-1 ring-purple-100 dark:ring-purple-900' : 'shadow-sm ring-1') 
            : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'"
          :style="getViewModeStyle(mode)"
        >
          {{ mode === 'latest' ? '⏰ ' + t.tab_latest : (mode === 'files' ? '📁 ' + t.tab_files : '🧪 ' + t.tab_lab) }}
        </button>
      </div>
    </div>

    <!-- File List / Tree -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
      <div v-if="loading" class="flex flex-col items-center justify-center py-10 text-[var(--primary-400)]">
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
                  ? 'bg-gradient-to-r from-[var(--primary-50)] to-purple-50 dark:from-[var(--primary-900)]/30 dark:to-purple-900/20 border-[var(--primary-300)] dark:border-[var(--primary-700)]/50' 
                  : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'"
              >
                <span class="text-lg">{{ tab.icon }}</span>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{{ tab.shortLabel }}</div>
                  <div v-if="tab.noteNum" class="text-[10px] text-gray-400 dark:text-gray-500">{{ lang === 'zh' ? `笔记 ${tab.noteNum}` : `Note ${tab.noteNum}` }}</div>
                </div>
                <span v-if="activeLabTab === tab.id && currentTool === 'dashboard'" class="w-1.5 h-1.5 rounded-full bg-[var(--primary-500)]"></span>
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
                  class="p-2 rounded-lg cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-[var(--primary-100)] dark:hover:border-gray-700 flex items-center gap-2"
                  :class="{'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 border-[var(--primary-100)] dark:border-[var(--primary-800)]/30': currentFile?.path === note.path}"
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
                          <span class="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-[var(--primary-600)] dark:group-hover:text-[var(--primary-400)] transition-colors">{{ link.name }}</span>
                      </div>
                      <div class="text-[10px] text-gray-400 dark:text-gray-500 pl-6 mt-0.5 truncate group-hover:text-[var(--primary-500)] transition-colors">{{ link.desc }}</div>
                    </a>
                </div>
              </div>
            </div>

          </div>
      </div>

      <SidebarFilterPanel v-if="viewMode === 'latest' || viewMode === 'files'" :lang="lang" :file-system="fileSystem" />

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
          :viewCount="getArticleViews(file.path)"
          :commentCount="commentCounts[file.path] || 0"
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
    <div class="p-4 border-t flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-md" :style="softBorderStyle">
        <a href="https://github.com/soft-zihan/soft-zihan.github.io" target="_blank" class="text-xs text-[var(--primary-400)] hover:text-[var(--primary-600)] dark:text-gray-500 dark:hover:text-[var(--primary-400)] flex items-center gap-2 transition-colors group">
          <svg class="w-4 h-4 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span>Code</span>
        </a>
        <span class="text-[10px] text-[var(--primary-300)] dark:text-gray-600 font-mono">v1.1</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FileTree from './FileTree.vue';
import ArticleCard from './ArticleCard.vue';
import SidebarFilterPanel from './SidebarFilterPanel.vue';
import type { FileNode } from '../types';
import { NodeType } from '../types';
import { useArticleStore } from '../stores/articleStore';
import { useAppStore } from '../stores/appStore';

const articleStore = useArticleStore();
const appStore = useAppStore();

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
  getArticleViews: (path: string) => number;
  commentCounts: Record<string, number>;
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
  'toggle-sidebar',
  'reset',
  'logo-click',
  'update:viewMode',
  'select-tool',
  'toggle-folder',
  'select-file',
  'select-folder',
  'open-search',
  'open-music',
  'toggle-theme',
  'open-settings',
  'open-download',
  'update:activeLabTab' // For lab tab switching
]);

const handleLogoClick = () => {
  emit('reset');
  emit('logo-click');
};

// Handle lab tab click - select dashboard tool and switch tab
const handleLabTabClick = (tabId: string) => {
  emit('select-tool', 'dashboard');
  emit('update:activeLabTab', tabId);
};

const headerGlowStyle = computed(() => ({
  backgroundImage: `linear-gradient(to bottom, ${appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-100-50)'}, transparent)`
}))

const softBorderStyle = computed(() => ({
  borderColor: appStore.isDark ? 'rgba(255,255,255,0.08)' : 'var(--primary-100)'
}))

const languageButtonStyle = computed(() => ({
  backgroundColor: appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-50)',
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)',
  borderColor: appStore.isDark ? 'rgba(255,255,255,0.08)' : 'var(--primary-100)'
}))

const avatarRingStyle = computed(() => ({
  backgroundImage: `linear-gradient(135deg, ${appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)'}, ${appStore.isDark ? 'var(--primary-900)' : 'var(--primary-100)'})`
}))

const titleStyle = computed(() => ({
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-700)'
}))

const subtitleStyle = computed(() => ({
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)',
  backgroundColor: appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-50)'
}))

const tabContainerStyle = computed(() => ({
  backgroundColor: appStore.isDark ? 'rgba(255,255,255,0.04)' : 'var(--primary-50)'
}))

const getViewModeStyle = (mode: string) => {
  if (mode === 'lab') return {}
  if (props.viewMode === mode) {
    return {
      color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)',
      backgroundColor: appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-50)',
      '--tw-ring-color': appStore.isDark ? 'var(--primary-700)' : 'var(--primary-100)'
    }
  }
  return {
    color: appStore.isDark ? 'rgba(255,255,255,0.6)' : 'var(--primary-400)'
  }
}

// Avatar Logic: Prefer external, fallback to local
const avatarSrc = ref('https://picx.zhimg.com/80/v2-1e3a27439c019dff7f9f7a679005c950_720w.webp?source=1def8aca');
const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // If fallback also fails, avoid infinite loop
  if (!target.src.includes('image/Avatar.webp')) {
     // Fallback to local image. Assumes user puts 'Avatar.webp' in public/image/.
     avatarSrc.value = './image/Avatar.webp';
  }
};

const getCleanParentPath = (path: string) => {
  const parts = path.split('/');
  const parent = parts.slice(0, -1).join('/');
  return parent || 'Root';
};

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '';

 
</script>
