
<template>
  <!-- Dynamic Petals Container -->
  <PetalBackground v-if="showParticles" :speed="userSettings.petalSpeed" />

  <div class="flex flex-col md:flex-row w-full h-full max-w-[2560px] mx-auto overflow-hidden bg-white/30 dark:bg-gray-900/60 backdrop-blur-[2px] font-sans transition-colors duration-500" :class="[userSettings.fontFamily === 'serif' ? 'font-serif' : 'font-sans', isDark ? 'dark' : '']">
    
    <!-- Left Sidebar: Navigation -->
    <AppSidebar 
      :lang="lang"
      :t="t"
      v-model:viewMode="viewMode"
      :loading="loading"
      :file-system="fileSystem"
      :filtered-file-system="filteredFileSystem"
      :filtered-flat-files="filteredFlatFiles"
      :current-file="currentFile"
      :expanded-folders="expandedFolders"
      :current-path="currentPath"
      :lab-folder="labFolder"
      :resource-categories="resourceCategories"
      :current-tool="currentTool"
      @toggle-lang="toggleLang"
      @reset="resetToHome"
      @select-tool="selectTool"
      @toggle-folder="toggleFolder"
      @select-file="openFile"
      @select-folder="openFolder"
    />

    <!-- Main Content Wrapper -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative isolate">
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-sakura-100/40 to-purple-100/30 dark:from-sakura-900/10 dark:to-purple-900/10 blur-3xl animate-float opacity-60"></div>
        <div class="absolute top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sakura-200/30 to-sakura-50/20 dark:from-sakura-800/10 dark:to-sakura-900/5 blur-3xl animate-pulse-fast opacity-50" style="animation-duration: 8s;"></div>
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#9f123f 1px, transparent 1px); background-size: 32px 32px;"></div>
      </div>

      <!-- Navbar -->
      <header class="h-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/40 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm transition-all duration-300 hover:bg-white/60 dark:hover:bg-gray-900/60">
        <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
          <span class="text-sakura-300 dark:text-sakura-500 mr-2 shrink-0 text-lg cursor-pointer hover:scale-110 transition-transform" @click="resetToHome">🏠</span>
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
              @click="navigateToBreadcrumb(item.path)"
              class="cursor-pointer transition-colors px-2 py-1 rounded-md"
              :class="index === breadcrumbs.length - 1 ? 'font-bold text-sakura-600 dark:text-sakura-400 bg-sakura-50/50 dark:bg-sakura-900/30' : 'text-gray-500 dark:text-gray-400 hover:text-sakura-500 hover:bg-sakura-50/50 dark:hover:bg-gray-800'"
            >
              {{ item.name }}
            </span>
          </template>
        </div>

        <div class="flex gap-2 shrink-0 items-center">
          <!-- Particles Toggle -->
           <button @click="showParticles = !showParticles" class="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center relative group" :title="showParticles ? 'Hide petals' : 'Show petals'">
             <span class="text-lg transition-all duration-300" :class="{'opacity-100 filter-none': showParticles, 'opacity-40 grayscale': !showParticles}">🌸</span>
           </button>
           <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <!-- Action Buttons -->
          <template v-if="currentFile">
             <!-- View Source Toggle (Only for Notes, Source files are always raw) -->
             <button v-if="!currentFile.isSource" @click="isRawMode = !isRawMode" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" :title="isRawMode ? t.view_render : t.view_source">
                <span class="text-lg">{{ isRawMode ? '👁️' : '🖊️' }}</span>
             </button>

            <button @click="copyLink" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" :title="t.copy_link">
              <span class="text-lg">🔗</span>
            </button>
            <button @click="downloadSource" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" :title="t.download">
              <span>DL</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </button>
            <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
          </template>

          <!-- Settings -->
          <button @click="showSettings = true" class="p-2 text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 hover:rotate-90 transition-all duration-500" :title="t.settings_title">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 flex overflow-hidden z-10 relative">
        
        <!-- Selection Menu (Floating) -->
        <div 
          v-show="selectionMenu.show" 
          class="fixed z-50 flex bg-gray-900/90 text-white rounded-full shadow-xl backdrop-blur transform -translate-x-1/2 -translate-y-full mb-2 px-1 py-1"
          :style="{ top: selectionMenu.y + 'px', left: selectionMenu.x + 'px' }"
          @mousedown.prevent
        >
          <button @click="applyFormat('highlight')" class="px-3 py-1.5 hover:bg-white/20 rounded-full text-xs font-bold flex items-center gap-1">
            <span class="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
            {{ t.menu_highlight }}
          </button>
          <div class="w-px bg-white/20 my-1"></div>
          <button @click="applyFormat('underline')" class="px-3 py-1.5 hover:bg-white/20 rounded-full text-xs font-bold flex items-center gap-1">
             <span class="underline decoration-wavy decoration-white">U</span>
             {{ t.menu_underline }}
          </button>
        </div>

        <!-- Center Stage -->
        <div 
          v-if="currentFile || (viewMode === 'lab' && currentTool) || currentFolder" 
          id="scroll-container" 
          class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full" 
        >
          
          <!-- Lab Tool View (Unified Dashboard) -->
          <div v-if="viewMode === 'lab' && currentTool === 'dashboard'" class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
             <LabDashboard :lang="lang" />
          </div>

          <!-- Folder View -->
          <div v-else-if="currentFolder" class="w-full max-w-6xl mx-auto">
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
                  @click="child.type === 'directory' ? openFolder(child) : openFile(child)"
                  class="folder-card bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-md border border-white/70 dark:border-gray-700 hover:shadow-xl hover:shadow-sakura-100/30 dark:hover:shadow-black/40 hover:bg-white dark:hover:bg-gray-800 hover:border-sakura-200 dark:hover:border-sakura-800 cursor-pointer transition-all duration-300 flex flex-col h-48 backdrop-blur-sm group relative overflow-hidden"
               >
                 <div class="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-sakura-50 to-transparent dark:from-sakura-900/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                 <div class="flex items-start justify-between mb-4 relative z-10">
                   <span class="text-5xl group-hover:scale-110 transition-transform drop-shadow-sm">{{ child.type === 'directory' ? '📂' : (child.isSource ? '💻' : '📝') }}</span>
                   <span v-if="child.type === 'file'" class="text-[10px] text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-gray-900 px-2 py-1 rounded-full font-bold">{{ formatDate(child.lastModified) }}</span>
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

          <!-- Note Content View -->
          <div v-else-if="currentFile" 
             class="w-full max-w-4xl xl:max-w-5xl mx-auto bg-white/80 dark:bg-gray-900/80 p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-sakura-200/50 dark:border-gray-700 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-xl transition-all duration-300 relative"
             :class="fontSizeClass"
          >
             <div v-if="contentLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-20 rounded-[2rem] backdrop-blur-sm">
               <div class="flex flex-col items-center gap-4">
                  <div class="animate-spin text-4xl">🌸</div>
                  <div class="text-sm font-bold text-sakura-500 animate-pulse">Fetching Content...</div>
               </div>
             </div>

             <!-- Header -->
             <div class="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6 flex justify-between items-end">
                 <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight leading-tight">{{ currentFile.name.replace('.md', '') }}</h1>
                 <span v-if="currentFile.isSource" class="bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded text-xs font-mono">Read Only</span>
             </div>

            <!-- Markdown Content -->
            <div 
              v-if="!currentFile.isSource && !isRawMode"
              id="markdown-viewer"
              v-html="renderedContent" 
              class="markdown-body dark:text-gray-300 selection:bg-sakura-200 dark:selection:bg-sakura-900"
              @click="handleContentClick"
              @mouseup="handleSelection"
            ></div>

            <!-- Source Code / Raw Mode -->
            <div v-else class="relative group">
               <pre class="whitespace-pre-wrap font-mono text-sm bg-[#1e1e1e] text-blue-200 p-6 rounded-xl border border-gray-700 overflow-x-auto select-text shadow-inner"><code :class="currentFile.name.endsWith('.vue') ? 'language-html' : ''">{{ currentFile.content }}</code></pre>
            </div>
            
            <div class="mt-12 pt-8 border-t border-sakura-100 dark:border-gray-700 flex justify-between text-xs text-sakura-300 dark:text-gray-500">
              <span class="italic">Sakura Notes</span>
              <span>{{ t.updated }}: {{ formatDate(currentFile.lastModified) }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State / Home -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-sakura-300 dark:text-gray-600 animate-fade-in p-6 text-center">
            <div class="relative group cursor-default">
               <div class="text-[12rem] mb-6 opacity-90 animate-float drop-shadow-2xl filter saturate-150 transform hover:scale-105 transition-transform duration-700">🌸</div>
               <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-sakura-800/20 dark:bg-sakura-900/40 blur-2xl rounded-full group-hover:w-64 transition-all duration-500"></div>
            </div>
            <h2 class="text-5xl font-bold text-sakura-600 dark:text-sakura-400 mb-4 tracking-tight drop-shadow-sm">{{ t.welcome_title }}</h2>
            <p class="text-sakura-400 dark:text-gray-400 max-w-lg mx-auto leading-relaxed text-lg">
              {{ t.welcome_desc }}<br>
              <span class="text-sm opacity-70 bg-white/50 dark:bg-gray-800 px-4 py-1 rounded-full mt-2 inline-block border border-white/50 dark:border-gray-700">{{ t.welcome_tags }}</span>
            </p>
        </div>

        <!-- Right Sidebar (TOC) -->
        <aside v-if="currentFile && !currentTool && !isRawMode && !currentFile.isSource" class="hidden xl:flex w-72 2xl:w-80 flex-col gap-6 p-6 border-l border-white/30 dark:border-gray-700/30 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md overflow-y-auto custom-scrollbar z-20">
          
          <!-- Table of Contents -->
          <div v-if="toc.length > 0">
            <h3 class="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span>📑</span> {{ t.on_this_page }}
            </h3>
            <nav class="space-y-1 relative border-l-2 border-sakura-100 dark:border-gray-700 pl-4">
               <!-- Active Indicator -->
              <div 
                class="absolute left-[-2px] w-[2px] bg-sakura-500 transition-all duration-300 shadow-[0_0_8px_rgba(244,63,114,0.6)]"
                :style="{ top: activeIndicatorTop + 'px', height: '24px' }"
                v-if="activeHeaderId"
              ></div>
              <a 
                v-for="item in toc" 
                :key="item.id"
                :href="`#${item.id}`"
                class="block text-sm py-1.5 transition-all duration-200 leading-tight pr-2"
                :class="[
                  item.level === 1 ? 'font-bold mb-2 mt-4 text-sakura-800 dark:text-sakura-200' : 'font-normal',
                  item.level > 1 ? `ml-${(item.level-1)*3} text-xs` : '',
                  activeHeaderId === item.id ? 'text-sakura-600 dark:text-sakura-300 translate-x-1 font-medium scale-105 origin-left' : 'text-gray-500 dark:text-gray-500 hover:text-sakura-400'
                ]"
                @click.prevent="scrollToHeader(item.id)"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>

          <!-- Decorative / Meta Info -->
          <div class="mt-auto bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white/60 dark:border-gray-700 shadow-sm backdrop-blur-sm">
             <div class="text-[10px] uppercase font-bold text-sakura-400 dark:text-gray-500 mb-2">{{ t.note_details }}</div>
             <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
               <div class="flex justify-between"><span>{{ t.words }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentFile.content?.length || 0 }}</span></div>
               <div class="flex justify-between"><span>{{ t.lines }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentFile.content?.split('\n').length || 0 }}</span></div>
               <div class="flex justify-between"><span>{{ t.format }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentFile.isSource ? 'Code' : 'Markdown' }}</span></div>
             </div>
          </div>
        </aside>

      </div>
    </main>
    
    <!-- Lightbox (New) -->
    <div 
      v-if="lightboxImage" 
      class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out animate-fade-in p-4"
      @click="lightboxImage = null"
    >
       <img :src="lightboxImage" class="max-w-full max-h-full rounded-lg shadow-2xl scale-100 object-contain transition-transform duration-300" alt="Fullscreen preview" />
       <div class="absolute bottom-10 text-white/50 text-sm bg-black/50 px-4 py-2 rounded-full">Click anywhere to close</div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in">
       <div class="bg-gray-800/90 dark:bg-white/90 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl backdrop-blur font-medium text-sm flex items-center gap-2">
         <span>✅</span> {{ toastMessage }}
       </div>
    </div>

    <!-- Settings Modal (New Component) -->
    <SettingsModal 
      v-if="showSettings" 
      @close="showSettings = false"
      :t="t"
      :is-dark="isDark"
      :settings="userSettings"
      @toggle-theme="toggleTheme"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive, nextTick } from 'vue';
import { I18N } from './constants';
import { NodeType } from './types';
import type { FileNode, BreadcrumbItem, TocItem } from './types';
import LabDashboard from './components/LabDashboard.vue';
import SettingsModal from './components/SettingsModal.vue';
import PetalBackground from './components/PetalBackground.vue';
import AppSidebar from './components/AppSidebar.vue';

// i18n with Persistence
const savedLang = localStorage.getItem('sakura_lang');
const lang = ref<'en' | 'zh'>((savedLang === 'en' || savedLang === 'zh') ? savedLang : 'zh');
const t = computed(() => I18N[lang.value]);

const toggleLang = () => {
  lang.value = lang.value === 'en' ? 'zh' : 'en';
  localStorage.setItem('sakura_lang', lang.value);
  resetToHome();
};

// Theme
const isDark = ref(localStorage.getItem('sakura_theme') === 'dark');
const toggleTheme = (val: boolean) => {
  isDark.value = val;
  localStorage.setItem('sakura_theme', val ? 'dark' : 'light');
  if (val) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

// Data
const fileSystem = ref<FileNode[]>([]);
const currentFile = ref<FileNode | null>(null);
const currentFolder = ref<FileNode | null>(null); 
const viewMode = ref<'latest' | 'files' | 'lab'>('latest');
const expandedFolders = ref<string[]>([]);
const toc = ref<TocItem[]>([]);
const activeHeaderId = ref<string>('');
const loading = ref(true);
const contentLoading = ref(false);
const currentTool = ref<'dashboard' | null>(null);
const showParticles = ref(true);
const toastMessage = ref('');
const lightboxImage = ref<string | null>(null);
const isRawMode = ref(false);

const selectionMenu = ref({ show: false, x: 0, y: 0 });

const showSettings = ref(false);
const userSettings = reactive({
  fontSize: localStorage.getItem('sakura_fontsize') || 'normal',
  fontFamily: localStorage.getItem('sakura_fontfamily') || 'sans',
  petalSpeed: localStorage.getItem('sakura_petalspeed') || 'slow' // 'slow' | 'fast'
});

watch(() => userSettings.fontSize, (v) => localStorage.setItem('sakura_fontsize', v));
watch(() => userSettings.fontFamily, (v) => localStorage.setItem('sakura_fontfamily', v));
watch(() => userSettings.petalSpeed, (v) => localStorage.setItem('sakura_petalspeed', v));

// Computed
const fontSizeClass = computed(() => {
  switch(userSettings.fontSize) {
    case 'small': return 'text-sm lg:text-base leading-relaxed';
    case 'large': return 'text-xl lg:text-2xl leading-loose';
    default: return 'text-base lg:text-lg leading-loose';
  }
});

const currentPath = computed(() => currentFile.value?.path || currentFolder.value?.path || '');

// Resource Categories Data (Reactive to lang change)
const resourceCategories = computed(() => [
  {
    title: t.value.res_cat_platform,
    items: [
       { name: 'Vue Mastery', url: 'https://vuemastery.com', icon: '🎮', desc: lang.value === 'zh' ? '官方推荐的游戏化教程' : 'Gamified learning path' },
       { name: 'Scrimba', url: 'https://scrimba.com/learn/vue', icon: '📺', desc: lang.value === 'zh' ? '交互式视频编码' : 'Interactive video tutorials' },
       { name: 'Frontend Mentor', url: 'https://frontendmentor.io', icon: '🎨', desc: lang.value === 'zh' ? '真实设计稿还原挑战' : 'Real-world design challenges' },
    ]
  },
  {
    title: t.value.res_cat_frontend_games,
    items: [
       { name: 'Flexbox Froggy', url: 'https://flexboxfroggy.com', icon: '🐸', desc: lang.value === 'zh' ? '青蛙跳荷叶学布局' : 'Learn Flexbox with frogs' },
       { name: 'Grid Garden', url: 'https://cssgridgarden.com', icon: '🥕', desc: lang.value === 'zh' ? '种胡萝卜学网格' : 'Learn CSS Grid via gardening' },
       { name: 'CSS Diner', url: 'https://flukeout.github.io', icon: '🍽️', desc: lang.value === 'zh' ? '选择器餐厅' : 'Master CSS selectors' },
       { name: 'JavaScript 30', url: 'https://javascript30.com', icon: '🎹', desc: lang.value === 'zh' ? '30天原生JS挑战' : '30 Day Vanilla JS Challenge' },
    ]
  },
  {
     title: t.value.res_cat_vue_projects,
     items: [
       { name: 'Vue Tutorial', url: 'https://vuejs.org/tutorial/', icon: '🟩', desc: lang.value === 'zh' ? 'Vue 官方交互教程' : 'Official Interactive Tutorial' },
       { name: 'Vue Snake', url: 'https://github.com/search?q=vue+snake+game', icon: '🐍', desc: lang.value === 'zh' ? '贪吃蛇源码搜索' : 'Search Snake Game code' },
       { name: 'Vue Memory', url: 'https://codepen.io/search/pens?q=vue+memory+game', icon: '🃏', desc: lang.value === 'zh' ? '记忆卡片游戏' : 'Memory Card Game' },
     ]
  }
]);

// Root Directory Logic based on Language
const currentLangRoot = computed(() => {
   const root = fileSystem.value.find(node => node.name === lang.value);
   return root ? root.children : [];
});

const filteredFileSystem = computed(() => {
  return currentLangRoot.value || [];
});

const filteredFlatFiles = computed(() => {
  const flatten = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = [];
    for (const node of nodes) {
      if (node.type === NodeType.FILE) files.push(node);
      else if (node.children) files = files.concat(flatten(node.children));
    }
    return files;
  };
  return flatten(filteredFileSystem.value).sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
});

const labFolder = computed(() => {
  const targetName = lang.value === 'zh' ? 'VUE学习笔记' : 'VUE Learning';
  const findFolderByName = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
          if (node.type === NodeType.DIRECTORY && node.name.toLowerCase() === targetName.toLowerCase()) {
              return node;
          }
          if (node.children) {
              const found = findFolderByName(node.children);
              if (found) return found;
          }
      }
      return null;
  }
  const folder = findFolderByName(fileSystem.value);
  
  // Also include the source code folder in the lab view
  const srcFolder = fileSystem.value.find(node => node.path === 'source-code');
  if (srcFolder && folder) {
      // Return a combined virtual view or just modify folder (not ideal to mutate prop source)
      return { ...folder };
  }
  return folder;
});

const sortedFolderChildren = computed(() => {
  if (!currentFolder.value || !currentFolder.value.children) return [];
  return [...currentFolder.value.children].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === NodeType.DIRECTORY ? -1 : 1;
  });
});

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = currentPath.value;
  if (!path) return [];
  const parts = path.split('/');
  
  let accumulatedPath = '';
  return parts.map((part) => {
    accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part;
    return { name: part.replace('.md', ''), path: accumulatedPath };
  });
});

const setupMarkedRenderer = () => {
    // @ts-ignore
    if (!window.marked) return;
    // @ts-ignore
    const renderer = new window.marked.Renderer();
    renderer.heading = function(text: string, level: number) {
       const id = text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fa5]+/g, '');
       return `<h${level} id="${id}">${text}</h${level}>`;
    };
    // @ts-ignore
    window.marked.use({ renderer });
};

const renderedContent = computed(() => {
  if (!currentFile.value?.content) return '';
  setupMarkedRenderer();
  let rawContent = currentFile.value.content;
  if (currentFile.value.path) {
    // Determine the base folder of the current note
    const parentDirParts = currentFile.value.path.split('/');
    parentDirParts.pop(); // remove filename
    // Join parts to get directory path relative to root
    const parentDir = parentDirParts.join('/'); 
    const serverPrefix = 'notes/'; 
    
    // Improved Image Replacement Logic for GitHub Pages
    // When Markdown has `![img](assets/foo.png)`, we need to transform it to `notes/parent/assets/foo.png`
    
    const resolvePath = (relPath: string) => {
      // Ignore absolute paths or HTTP links
      if (relPath.startsWith('http') || relPath.startsWith('/') || relPath.startsWith('data:')) return relPath;
      
      const parts = relPath.split('/');
      const parentParts = parentDir.split('/').filter(p => p); 
      
      for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
          if (parentParts.length > 0) parentParts.pop();
        } else {
          parentParts.push(part);
        }
      }
      
      // If we are on GitHub Pages or nested path, ensure no double slashes
      return `${serverPrefix}${parentParts.join('/')}`;
    };

    // Replace Markdown Images
    rawContent = rawContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, relPath) => {
      return `![${alt}](${resolvePath(relPath)})`;
    });

    // Replace HTML Img Src
    rawContent = rawContent.replace(/src="([^"]+)"/g, (match, src) => {
        return `src="${resolvePath(src)}"`;
    });
  }
  // @ts-ignore
  return window.marked ? window.marked.parse(rawContent) : rawContent;
});

const activeIndicatorTop = computed(() => {
  if (!activeHeaderId.value) return 0;
  const idx = toc.value.findIndex(t => t.id === activeHeaderId.value);
  return idx * 28; 
});

const getCleanParentPath = (path: string) => {
  const parts = path.split('/');
  const parent = parts.slice(0, -1).join('/');
  return parent || 'Root';
};

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '';

const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

const openFile = async (file: FileNode) => {
  currentFile.value = file;
  currentFolder.value = null;
  currentTool.value = null;
  // Always default to Raw Mode for Source files, Render mode for Markdown
  isRawMode.value = !!file.isSource;
  
  updateUrl(file.path);
  const container = document.getElementById('scroll-container');
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  
  selectionMenu.value.show = false;

  if (!file.content) {
    contentLoading.value = true;
    try {
      // Determine fetch path based on file type
      // For Notes: ./notes/path/to/file.md
      // For Source: ./raw/path_to_file.txt (Generated by script)
      
      let fetchPath = '';
      if (file.isSource && file.fetchPath) {
          fetchPath = `./${file.fetchPath}`;
      } else {
          const encodedPath = file.path.split('/').map(p => encodeURIComponent(p)).join('/');
          fetchPath = `./notes/${encodedPath}`;
      }
      
      const res = await fetch(fetchPath);
      if (res.ok) {
        file.content = await res.text();
        if (!file.isSource) nextTick(() => generateToc());
      } else {
        console.error(`Fetch failed for ${fetchPath}: ${res.status}`);
        file.content = `# Error Loading Content\n\n**Status:** ${res.status} ${res.statusText}\n\n**Path:** \`${fetchPath}\`\n\nPlease check connection or file existence.`;
      }
    } catch (e: any) {
      console.error(e);
      file.content = `# Network Error\n\nFailed to fetch content.\n\n\`${e.message}\``;
    } finally {
      contentLoading.value = false;
      currentFile.value = { ...file }; 
    }
  } else {
    if (!file.isSource) nextTick(() => generateToc());
  }
};

const openFolder = (folder: FileNode) => {
  currentFile.value = null;
  currentFolder.value = folder;
  currentTool.value = null;
  updateUrl(folder.path);
  if (viewMode.value === 'latest') viewMode.value = 'files';
  selectionMenu.value.show = false;
};

const selectTool = (tool: string) => {
  currentTool.value = tool as 'dashboard';
  currentFile.value = null;
  currentFolder.value = null;
};

const navigateToBreadcrumb = (path: string) => {
  const node = findNodeByPath(fileSystem.value, path);
  if (node) {
    if (node.type === NodeType.DIRECTORY) openFolder(node);
    else openFile(node);
  }
};

const toggleFolder = (path: string) => {
  const idx = expandedFolders.value.indexOf(path);
  if (idx === -1) expandedFolders.value.push(path);
  else expandedFolders.value.splice(idx, 1);
};

const updateUrl = (path: string | null) => {
  const url = new URL(window.location.href);
  if (path) {
    url.searchParams.set('path', path);
  } else {
    url.searchParams.delete('path');
  }
  window.history.pushState({}, '', url.toString());
};

const resetToHome = () => {
  currentFile.value = null;
  currentFolder.value = null;
  viewMode.value = 'latest';
  selectionMenu.value.show = false;
  updateUrl(null);
};

const showToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => toastMessage.value = '', 2000);
}

const copyLink = () => navigator.clipboard.writeText(window.location.href).then(() => showToast(t.value.link_copied));

const downloadSource = () => {
  if (currentFile.value) {
    const blob = new Blob([currentFile.value.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.value.name;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// Selection Popup Logic
const handleSelection = () => {
  if (currentFile.value?.isSource) return; // No highlight for source code
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    selectionMenu.value.show = false;
    return;
  }
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const viewer = document.getElementById('markdown-viewer');
  if (!viewer || !viewer.contains(range.commonAncestorContainer)) {
      selectionMenu.value.show = false;
      return;
  }

  selectionMenu.value = {
    show: true,
    x: rect.left + rect.width / 2,
    y: rect.top - 10
  };
};

const applyFormat = (type: 'highlight' | 'underline') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    try {
        const span = document.createElement('span');
        if (type === 'highlight') {
            span.className = 'bg-yellow-200 dark:bg-yellow-800/60 rounded px-0.5 transition-colors shadow-sm';
        } else if (type === 'underline') {
            span.className = 'underline decoration-wavy decoration-sakura-500 underline-offset-4';
        }
        range.surroundContents(span);
        selection.removeAllRanges();
        selectionMenu.value.show = false;
    } catch (e) {
        showToast(t.value.selection_error);
    }
};

// Lightbox logic & Link Interception
const handleContentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  
  // 1. Handle Lightbox
  if (target.tagName === 'IMG') {
    lightboxImage.value = (target as HTMLImageElement).src;
    selectionMenu.value.show = false;
    return;
  }
  
  // 2. Intercept internal links
  const link = target.closest('a');
  if (link) {
    const href = link.getAttribute('href');
    // If it is a local link (starts with ./, ../ or no slash, and ends in .md)
    if (href && !href.startsWith('http') && !href.startsWith('//') && href.endsWith('.md')) {
      e.preventDefault(); // Stop Browser Jump
      
      let targetPath = '';
      if (currentFile.value?.path) {
        // Resolve relative path
        const currentDir = currentFile.value.path.split('/').slice(0, -1);
        const parts = href.split('/');
        
        for (const part of parts) {
           if (part === '.') continue;
           if (part === '..') {
              if (currentDir.length > 0) currentDir.pop();
           } else {
              currentDir.push(decodeURIComponent(part)); // Ensure decoding
           }
        }
        targetPath = currentDir.join('/');
      }

      // Try to find exact match
      let node = findNodeByPath(fileSystem.value, targetPath);
      
      // Fallback: Try fuzzy search if exact match fails (sometimes encoding differs)
      if (!node) {
         const flat = filteredFlatFiles.value;
         node = flat.find(f => f.path.endsWith(href)) || null;
      }

      if (node && node.type === NodeType.FILE) {
        openFile(node);
      } else {
        showToast(`Linked note not found: ${href}`);
      }
    }
  }

  selectionMenu.value.show = false;
};

const generateToc = () => {
  if (!currentFile.value?.content || currentFile.value.isSource) { toc.value = []; return; }
  const headers: TocItem[] = [];
  const lines = currentFile.value.content.split(/\r?\n/);
  let inCodeBlock = false;
  
  lines.forEach(line => {
    if (line.trim().startsWith('```')) inCodeBlock = !inCodeBlock;
    if (inCodeBlock) return;
    
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      const id = text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fa5]+/g, ''); 
      headers.push({ id, text, level: match[1].length });
    }
  });
  toc.value = headers;
  
  nextTick(() => {
     const el = document.getElementById('scroll-container');
     if (el) {
       el.removeEventListener('scroll', updateActiveHeader);
       el.addEventListener('scroll', updateActiveHeader);
     }
  });
};

const updateActiveHeader = () => {
  const container = document.getElementById('scroll-container');
  if (!container) return;
  const scrollPosition = container.scrollTop;
  
  let active = '';
  for (const item of toc.value) {
    const el = document.getElementById(item.id);
    if (el) {
       if (el.offsetTop - container.offsetTop - 150 <= scrollPosition) {
         active = item.id;
       }
    }
  }
  if (active) activeHeaderId.value = active;
};

const scrollToHeader = (id: string) => {
  const el = document.getElementById(id);
  const container = document.getElementById('scroll-container');
  if (el && container) {
     el.scrollIntoView({ behavior: 'smooth', block: 'start' });
     activeHeaderId.value = id;
  }
};

watch(currentFile, () => {
    if (!currentFile.value?.isSource) generateToc();
});

onMounted(async () => {
  document.addEventListener('selectionchange', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
          selectionMenu.value.show = false;
      }
  });

  if (isDark.value) document.documentElement.classList.add('dark');
  
  try {
    // Explicitly using ./files.json to ensure relative fetch
    const res = await fetch(`./files.json?t=${Date.now()}`);
    if (res.ok) {
      fileSystem.value = await res.json();
      const params = new URLSearchParams(window.location.search);
      const targetPath = params.get('path'); 
      
      if (targetPath) {
        const node = findNodeByPath(fileSystem.value, targetPath);
        if (node) {
          if (targetPath.includes('VUE学习笔记') || targetPath.includes('VUE Learning')) viewMode.value = 'lab';
          else viewMode.value = 'files';
          node.type === NodeType.FILE ? openFile(node) : openFolder(node);
        }
      }
    } else {
       console.error("Failed to load files.json, status:", res.status);
    }
  } catch (e) {
    console.error("Failed to load file system", e);
    fileSystem.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
