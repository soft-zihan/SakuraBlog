<template>
  <!-- Dynamic Petals Container (Front layer - outside main for highest z-index) -->
  <PetalBackground v-if="appStore.showParticles && appStore.userSettings.petalLayer === 'front'" :speed="appStore.userSettings.petalSpeed" :isDark="appStore.isDark" layer="front" />

  <!-- Global Audio Player -->
  <GlobalAudio />

  <div class="flex flex-col md:flex-row w-full h-full max-w-[2560px] mx-auto overflow-hidden bg-gradient-to-br from-white/70 via-[var(--primary-50)]/50 to-purple-50/40 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-[var(--primary-900)]/40 backdrop-blur-[3px] border border-white/30 dark:border-gray-800/60 shadow-[0_12px_60px_rgba(15,23,42,0.12)] font-sans transition-colors duration-500 relative" :class="[appStore.userSettings.fontFamily === 'serif' ? 'font-serif' : appStore.userSettings.fontFamily === 'kaiti' ? 'font-kaiti' : 'font-sans', appStore.isDark ? 'dark' : '']">
    
    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
    />

    <!-- Left Sidebar: Navigation -->
    <AppSidebar 
      v-if="!readingMode"
      :class="[
        sidebarOpen ? 'translate-x-0 md:translate-x-0 md:w-72 lg:w-80' : '-translate-x-full md:-translate-x-full md:w-0 md:opacity-0 md:overflow-hidden md:pointer-events-none'
      ]"
      class="fixed md:relative z-40 transition-all duration-300 ease-out"
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
      :lab-tabs="labTabs"
      :active-lab-tab="labDashboardTab"
      :get-article-views="getArticleViews"
      :comment-counts="commentCounts"
      @toggle-lang="toggleLang"
      @reset="resetToHome"
      @logo-click="showToast(t.welcome_title)"
      @select-tool="selectTool"
      @toggle-folder="toggleFolder"
      @select-file="handleSidebarFileSelect"
      @select-folder="openFolder"
      @open-search="showSearch = true"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-right-sidebar="rightSidebarOpen = !rightSidebarOpen"
        @update:activeLabTab="handleLabTabChange"
      />

    <!-- Main Content Wrapper -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative isolate">
      <!-- Wallpaper Layer (behind decorations, excluding sidebar) -->
      <WallpaperLayer v-if="!readingMode" :is-dark="appStore.isDark" :light-url="wallpaperLightUrl" :dark-url="wallpaperDarkUrl" :bannerMode="appStore.userSettings.bannerMode" />

      <!-- Dynamic Petals Container (Back layer - inside main for proper z-index with isolate) -->
      <PetalBackground v-if="!readingMode && appStore.showParticles && appStore.userSettings.petalLayer === 'back'" :speed="appStore.userSettings.petalSpeed" :isDark="appStore.isDark" layer="back" />

      <!-- Decorative Background Elements -->
      <div v-if="!readingMode" class="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[var(--primary-100)]/40 to-purple-100/30 dark:from-[var(--primary-900)]/10 dark:to-purple-900/10 blur-3xl animate-float opacity-60"></div>
        <div class="absolute top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--primary-200)]/30 to-[var(--primary-50)]/20 dark:from-[var(--primary-800)]/10 dark:to-[var(--primary-900)]/5 blur-3xl animate-pulse-fast opacity-50" style="animation-duration: 8s;"></div>
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#9f123f 1px, transparent 1px); background-size: 32px 32px;"></div>
      </div>

      <!-- Header Component -->
      <AppHeader
        :lang="lang"
        :t="t"
        :breadcrumbs="breadcrumbs"
        :view-mode="viewMode"
        :current-tool="currentTool"
        :current-file="currentFile"
        :show-particles="appStore.showParticles"
        :is-dark="appStore.isDark"
        :petal-speed="appStore.userSettings.petalSpeed"
        :header-hidden="headerHidden"
        :dual-column-mode="dualColumnMode"
        :sidebar-open="sidebarOpen"
        :right-sidebar-open="rightSidebarOpen"
        :get-article-views="getArticleViews"
        v-model:isRawMode="isRawMode"
        @reset="resetToHome"
        @navigate="navigateToBreadcrumb"
        @copy-link="copyLink"
        @download="downloadSource"
        @open-settings="showSettings = true; headerHidden = false; if (isMobile) sidebarOpen = false"
        @open-theme-panel="handleThemePanelChange"
        @open-search="showSearch = true; if (isMobile) sidebarOpen = false"
        @open-music="musicStore.showMusicPlayer = true; if (isMobile) sidebarOpen = false"
        @open-write="showWriteEditor = true; if (isMobile) sidebarOpen = false"
        @open-download="showDownloadModal = true; if (isMobile) sidebarOpen = false"
        @toggle-theme="toggleTheme(!appStore.isDark)"
        @update:petal-speed="handlePetalSpeedChange"
        @toggle-dual-column="dualColumnMode = !dualColumnMode; if(dualColumnMode && !currentTool) currentTool = 'dashboard'"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-right-sidebar="rightSidebarOpen = !rightSidebarOpen"
      />

      <!-- Content Area -->
      <div class="flex-1 flex overflow-hidden z-10 relative">
        
        <!-- Selection Menu (Floating) -->
        <div 
          v-show="selectionMenu.show" 
          class="fixed z-50 flex bg-gray-900/95 text-white rounded-2xl shadow-2xl backdrop-blur-xl transform -translate-x-1/2 -translate-y-full mb-2 p-1.5 gap-0.5 border border-white/10"
          :style="{ top: selectionMenu.y + 'px', left: selectionMenu.x + 'px' }"
          @mousedown.prevent
        >
          <!-- Highlight Options -->
          <button @click="applyFormatHandler('highlight-yellow')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Yellow Highlight">
            <span class="w-4 h-4 bg-yellow-400 rounded-full inline-block ring-2 ring-yellow-300/50"></span>
          </button>
          <button @click="applyFormatHandler('highlight-green')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Green Highlight">
            <span class="w-4 h-4 bg-green-400 rounded-full inline-block ring-2 ring-green-300/50"></span>
          </button>
          <button @click="applyFormatHandler('highlight-blue')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Blue Highlight">
            <span class="w-4 h-4 bg-blue-400 rounded-full inline-block ring-2 ring-blue-300/50"></span>
          </button>
          <button @click="applyFormatHandler('highlight-pink')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Pink Highlight">
            <span class="w-4 h-4 bg-pink-400 rounded-full inline-block ring-2 ring-pink-300/50"></span>
          </button>
          
          <div class="w-px bg-white/20 mx-0.5"></div>
          
          <!-- Underline Styles -->
          <button @click="applyFormatHandler('underline-wavy')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Wavy Underline">
             <span class="underline decoration-wavy decoration-[var(--primary-400)] underline-offset-2">〰</span>
          </button>
          <button @click="applyFormatHandler('underline-double')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Double Underline">
             <span class="underline decoration-double decoration-blue-400 underline-offset-2">≡</span>
          </button>

          <div class="w-px bg-white/20 mx-0.5"></div>

          <!-- Block Highlight -->
          <button @click="applyFormatHandler('highlight-block')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Block Highlight">
            <span class="px-2 py-0.5 border border-yellow-300 rounded bg-yellow-200/40">▭</span>
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
             <LabDashboard :lang="lang" v-model="labDashboardTab" @tab-change="handleLabTabChange" @select-lab="selectTool" />
          </div>

          <!-- Lab: Source Code Viewer -->
          <div v-else-if="viewMode === 'lab' && currentTool === 'source-code'" class="w-full h-[calc(100vh-12rem)] animate-fade-in">
             <SourceCodeViewer :lang="lang" />
          </div>

          <!-- Lab: Event Handling -->
          <div v-else-if="viewMode === 'lab' && currentTool === 'event-handling'" class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
             <LabEventHandling :lang="lang" />
          </div>

          <!-- Lab: Slot System -->
          <div v-else-if="viewMode === 'lab' && currentTool === 'slot'" class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
             <LabSlot :lang="lang" />
          </div>

          <!-- Folder View Component -->
          <FolderView 
            v-else-if="currentFolder"
            :current-folder="currentFolder"
            @open-folder="openFolder"
            @open-file="openFile"
          />

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
             :onContentClick="handleContentClickEvent"
             @update-comment-count="handleCommentCountUpdate"
          />

        </div>

        <!-- Empty State / Home -->
        <div v-else id="scroll-container" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6">
          <div class="mx-auto w-full max-w-4xl flex flex-col items-center text-center text-[var(--primary-400)] dark:text-gray-500 animate-fade-in pt-2 md:pt-4 pb-12">
            <div class="relative group cursor-default">
              <div class="text-[12rem] mb-4 opacity-90 animate-float drop-shadow-2xl filter saturate-150 transform hover:scale-105 transition-transform duration-700">🌸</div>
              <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-[var(--primary-800)]/20 dark:bg-[var(--primary-900)]/40 blur-2xl rounded-full group-hover:w-64 transition-all duration-500"></div>
            </div>
            <h2 class="text-5xl font-bold mb-4 tracking-tight drop-shadow-sm bg-gradient-to-r from-[var(--primary-500)] via-[var(--primary-400)] to-[var(--primary-600)] dark:from-[var(--primary-300)] dark:via-[var(--primary-200)] dark:to-[var(--primary-400)] text-transparent bg-clip-text">{{ t.welcome_title }}</h2>
            <p class="text-[var(--primary-500)]/80 dark:text-gray-300 max-w-lg mx-auto leading-relaxed text-lg">
              {{ t.welcome_desc }}<br>
              <span class="text-sm opacity-90 bg-white/70 dark:bg-gray-800/70 px-4 py-1.5 rounded-full mt-3 inline-block border border-white/70 dark:border-gray-700/70 shadow-sm backdrop-blur">{{ t.welcome_tags }}</span>
            </p>
            <div class="mt-10 w-full max-w-3xl">
              <div class="flex flex-wrap items-center justify-center gap-3">
                <button
                  class="px-3 py-1.5 text-xs rounded-full border border-[var(--primary-200)]/80 dark:border-gray-700 text-[var(--primary-600)] dark:text-[var(--primary-300)] hover:bg-[var(--primary-50)]/80 dark:hover:bg-gray-800 transition-colors"
                  :disabled="welcomePoemLoading"
                  @click="loadRandomPoem"
                >
                  {{ lang === 'zh' ? '换一首' : 'New' }}
                </button>
              </div>
              <div v-if="welcomePoemLoading" class="mt-4 text-sm text-gray-400">{{ lang === 'zh' ? '加载中...' : 'Loading...' }}</div>
              <div v-else-if="welcomePoemError" class="mt-4 text-sm text-amber-500">{{ welcomePoemError }}</div>
              <div v-else class="mt-6">
                <div class="text-center">
                  <div class="text-2xl md:text-3xl font-bold tracking-wide text-[var(--primary-600)] dark:text-[var(--primary-300)] poem-font">
                    {{ welcomePoem?.title || (lang === 'zh' ? '随机古诗文' : 'Random Poem') }}
                  </div>
                  <div v-if="welcomePoemAuthorLine" class="mt-2 text-base text-gray-500 dark:text-gray-400 poem-font">
                    {{ welcomePoemAuthorLine }}
                  </div>
                </div>
                <div v-if="welcomePoemLines.length" class="mt-6 space-y-2 text-xl md:text-2xl leading-relaxed text-[var(--primary-600)] dark:text-[var(--primary-200)] poem-font poem-page">
                  <div v-for="(line, idx) in welcomePoemLines" :key="idx" class="poem-line" :style="{ animationDelay: `${idx * 120}ms` }">
                    {{ line }}
                  </div>
                </div>
                <div v-if="welcomePoemDetails.length" class="mt-8 w-full text-left space-y-6 text-sm text-gray-600 dark:text-gray-300">
                  <div v-for="detail in welcomePoemDetails" :key="detail.label" class="pt-4 border-t border-white/60 dark:border-gray-700/60">
                    <div class="text-xs font-semibold text-[var(--primary-500)] dark:text-[var(--primary-300)] mb-2">{{ detail.label }}</div>
                    <div class="whitespace-pre-line leading-relaxed">{{ detail.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="h-16"></div>
        </div>
      </div>
    </main>
    
    <!-- Dual Column Mode - Teleport to body for true fullscreen -->
    <Teleport to="body">
      <DualColumnView 
        v-if="viewMode === 'lab' && dualColumnMode"
        :lang="lang"
        :left-panel="dualColumnLeft"
        :right-panel="dualColumnRight"
        :lab-dashboard-tab="labDashboardTab"
        :lab-folder="labFolder"
        @update:left-panel="dualColumnLeft = $event"
        @update:right-panel="dualColumnRight = $event"
        @tab-change="handleLabTabChange"
        @select-file="openFile"
        @close="dualColumnMode = false"
      />
    </Teleport>
    
    <!-- Lightbox (Images) -->
    <div 
      v-if="lightboxImage" 
      class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out animate-fade-in p-4"
      @click="lightbox.closeLightbox()"
    >
       <img :src="lightboxImage" class="max-w-full max-h-full rounded-lg shadow-2xl scale-100 object-contain transition-transform duration-300" alt="Fullscreen preview" />
       <div class="absolute bottom-10 text-white/50 text-sm bg-black/50 px-4 py-2 rounded-full">Click anywhere to close</div>
    </div>

    <!-- Source Code Modal (Enhanced with Syntax Highlighting) -->
    <div 
      v-if="codeModal.showCodeModal.value" 
      class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4 md:p-10"
      @click.self="codeModal.closeCodeModal()"
    >
       <div class="bg-[#1e1e1e] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden relative transform transition-all duration-300 scale-100">
          <!-- Modal Header -->
          <div class="flex justify-between items-center px-6 py-4 bg-[#252526] border-b border-gray-700 shrink-0">
             <div class="flex items-center gap-2">
                <span class="text-2xl">📝</span>
                <div>
                   <h3 class="text-sm font-bold text-gray-200 font-mono">{{ codeModal.codeModalTitle.value }}</h3>
                   <span class="text-[10px] text-gray-500">{{ codeModal.codeModalPath.value || 'Read Only Preview' }}</span>
                </div>
             </div>
             <div class="flex gap-2">
               <button @click="codeModal.copyCodeContent(showToast, t.toast_copied)" class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-600">Copy</button>
               <button @click="codeModal.closeCodeModal()" class="text-gray-400 hover:text-white transition-colors bg-gray-700/50 hover:bg-red-500/50 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
             </div>
          </div>
          <!-- Modal Content with Syntax Highlighting -->
          <div class="flex-1 overflow-auto custom-scrollbar p-0 bg-[#1e1e1e]">
             <pre class="p-6 text-sm font-mono leading-relaxed whitespace-pre-wrap hljs"><code v-html="codeModal.highlightedCodeContent.value"></code></pre>
          </div>
       </div>
    </div>

    <!-- Toast Notification -->
    <Teleport to="body">
      <div v-if="appStore.toastMessage" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in pointer-events-none">
         <div class="bg-[var(--primary-500)]/90 dark:bg-[var(--primary-400)]/90 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl backdrop-blur font-medium text-sm flex items-center gap-2 border border-[var(--primary-200)]/60 dark:border-[var(--primary-300)]/40">
           <span>🌸</span> {{ appStore.toastMessage }}
         </div>
      </div>
    </Teleport>

    <!-- Settings Modal (New Component) -->
    <SettingsModal 
      v-if="showSettings" 
      @close="showSettings = false"
      :t="t"
      :is-dark="appStore.isDark"
      :lang="lang"
      :file-system="fileSystem"
      :lab-folder="labFolder"
    />

    <!-- Download Modal -->
    <DownloadModal
      v-if="showDownloadModal"
      @close="showDownloadModal = false"
      :lang="lang"
      :file-system="fileSystem"
      :lab-folder="labFolder"
    />

    <!-- Search Modal -->
    <SearchModal
      :showSearchModal="showSearch"
      @close="showSearch = false"
      :t="t"
      :lang="lang"
      :searchFn="search"
      :highlightFn="highlightMatches"
      :isLoadingContent="isLoadingContent"
      @select="handleSearchSelect"
    />

    <!-- Music Player Modal -->
    <MusicPlayer
      :lang="lang"
    />

    <!-- Write Editor Modal -->
    <WriteEditor
      :show="showWriteEditor"
      @close="showWriteEditor = false"
      :lang="lang"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { I18N, THEME_COLORS } from './constants';
import { NodeType } from './types';
import type { FileNode, BreadcrumbItem, TocItem } from './types';

// Components
import LabDashboard from './components/lab/LabDashboard.vue';
import SourceCodeViewer from './components/lab/SourceCodeViewer.vue';
import DualColumnView from './components/lab/DualColumnView.vue';
import SettingsModal from './components/SettingsModal.vue';
import DownloadModal from './components/DownloadModal.vue';
import PetalBackground from './components/PetalBackground.vue';
import WallpaperLayer from './components/WallpaperLayer.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import FolderView from './components/FolderView.vue';
import GlobalAudio from './components/GlobalAudio.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import SearchModal from './components/SearchModal.vue';
import WriteEditor from './components/WriteEditor.vue';
import GiscusComments from './components/GiscusComments.vue';

// Pinia Stores
import { useAppStore } from './stores/appStore';
import { useArticleStore } from './stores/articleStore';
import { useMusicStore } from './stores/musicStore';

// Composables
import { useSearch } from './composables/useSearch';
import { findNodeByPath, fetchFileContent } from './utils/fileUtils';
import { useCodeModal } from './composables/useCodeModal';
import { useLightbox } from './composables/useLightbox';
import { useSelectionMenu } from './composables/useSelectionMenu';
import { useContentClick, useFileVisibility, isSupportedInternalLink } from './composables/useContentClick';
import { useWallpapers } from './composables/useWallpapers';

// =====================
// Stores
// =====================
const appStore = useAppStore();
const articleStore = useArticleStore();
const { autoChangeWallpaper } = useWallpapers();
const musicStore = useMusicStore();
const showToast = (msg: string) => appStore.showToast(msg);


// =====================
// Search
// =====================
const { initSearchIndex, search, highlightMatches, showSearchModal: searchModalOpen, isLoadingContent, setFetchFunction, updateLanguage } = useSearch();

// =====================
// Lightbox
// =====================
const lightbox = useLightbox();
const { lightboxImage, handleImageClick } = lightbox;

// =====================
// Selection Menu
// =====================
const { selectionMenu, handleSelection, handleSelectionContextMenu, applyFormat, hideSelectionMenu, handleSelectionChange } = useSelectionMenu(showToast);
const handleSelectionEvent = (e: MouseEvent | TouchEvent) => handleSelection();
const handleSelectionContextMenuEvent = (e: MouseEvent) => handleSelectionContextMenu(e);
const applyFormatHandler = (format: string) => {
  const errorMsg = lang.value === 'zh' ? '应用格式失败' : 'Format failed';
  applyFormat(format, errorMsg);
};

// =====================
// i18n
// =====================
const lang = computed({
  get: () => appStore.lang,
  set: (val) => appStore.setLang(val)
});
const t = computed(() => I18N[lang.value]);

// =====================
// Core State
// =====================
const fileSystem = ref<FileNode[]>([]);
const currentFile = ref<FileNode | null>(null);
const currentFolder = ref<FileNode | null>(null);
const viewMode = computed({
  get: () => appStore.viewMode,
  set: (val) => appStore.viewMode = val
});
const loading = ref(true);
const expandedFolders = computed(() => appStore.expandedFolders);
const contentLoading = ref(false);
const currentTool = ref<'dashboard' | 'event-handling' | 'slot' | 'source-code' | null>(null);
const isRawMode = ref(false);
const readingMode = computed({
  get: () => appStore.readingMode,
  set: (value) => appStore.setReadingMode(value)
});
const commentCounts = ref<Record<string, number>>({});

// Modal States
const showSettings = ref(false);
const showDownloadModal = ref(false);
const showSearch = searchModalOpen;
const showWriteEditor = ref(false);
const sidebarOpen = computed({
  get: () => appStore.sidebarOpen,
  set: (val) => appStore.setSidebarOpen(val)
});
const rightSidebarOpen = computed({
  get: () => appStore.rightSidebarOpen,
  set: (val) => appStore.setRightSidebarOpen(val)
});
const handleThemePanelChange = (open: boolean) => {
  themePanelOpen.value = open;
  if (open) headerHidden.value = false;
};

// Dual Column Mode
const dualColumnMode = ref(false);
const dualColumnLeft = ref<'notes' | 'lab' | 'source'>('notes');
const dualColumnRight = ref<'notes' | 'lab' | 'source'>('lab');

// Mobile header scroll behavior
const headerHidden = ref(false);
const themePanelOpen = ref(false);
const lastScrollY = ref(0);
const isMobile = ref(false);
const mounted = ref(false);

// Wallpaper URLs
const wallpaperLightUrl = '/image/wallpaper-light.jpg';
const wallpaperDarkUrl = '/image/wallpaper-dark.jpg';
type GuwenItem = {
  title?: string;
  dynasty?: string;
  writer?: string;
  content?: string;
  remark?: string;
  translation?: string;
  shangxi?: string;
  type?: string;
};
const welcomePoem = ref<GuwenItem | null>(null);
const welcomePoemLoading = ref(false);
const welcomePoemError = ref('');
const guwenUrls = Object.values(import.meta.glob('./gushiwen/guwen/*.json', { as: 'url', eager: true })) as string[];

const parseGuwenItems = (raw: string) => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return (parsed as GuwenItem[]).filter(item => item?.content);
    }
    const data = (parsed as { data?: GuwenItem[] } | null)?.data;
    if (Array.isArray(data)) {
      return data.filter(item => item?.content);
    }
  } catch {
  }
  const items: GuwenItem[] = [];
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const item = JSON.parse(trimmed) as GuwenItem;
      if (item?.content) items.push(item);
    } catch {
      continue;
    }
  }
  return items;
};

const loadRandomPoem = async () => {
  if (!guwenUrls.length) {
    welcomePoemError.value = lang.value === 'zh' ? '未找到古诗文资源' : 'Poetry source missing';
    return;
  }
  welcomePoemLoading.value = true;
  welcomePoemError.value = '';
  try {
    const url = guwenUrls[Math.floor(Math.random() * guwenUrls.length)];
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const raw = await res.text();
    const items = parseGuwenItems(raw);
    if (!items.length) throw new Error('Empty data');
    welcomePoem.value = items[Math.floor(Math.random() * items.length)];
  } catch (e) {
    welcomePoemError.value = lang.value === 'zh' ? '诗文加载失败' : 'Failed to load poem';
  } finally {
    welcomePoemLoading.value = false;
  }
};

// =====================
// Composables 初始化
// =====================

// 代码弹窗
const codeModal = useCodeModal();

// 文件可见性
const { isFileVisible, collectAllTags } = useFileVisibility(articleStore);

// =====================
// Computed
// =====================
const welcomePoemLines = computed(() => {
  const content = welcomePoem.value?.content?.trim();
  if (!content) return [];
  return content.split(/\n+/).map(line => line.trim()).filter(Boolean);
});

const welcomePoemAuthorLine = computed(() => {
  const dynasty = welcomePoem.value?.dynasty?.trim();
  const writer = welcomePoem.value?.writer?.trim();
  if (!dynasty && !writer) return '';
  const dynastyText = dynasty ? `【${dynasty}】` : '';
  return `${dynastyText}${writer || ''}`;
});

const welcomePoemDetails = computed(() => {
  const items: Array<{ label: string; value: string }> = [];
  const dynasty = welcomePoem.value?.dynasty;
  const type = welcomePoem.value?.type;
  const remark = welcomePoem.value?.remark;
  const translation = welcomePoem.value?.translation;
  const shangxi = welcomePoem.value?.shangxi;
  if (remark) items.push({ label: lang.value === 'zh' ? '注释' : 'Notes', value: remark });
  if (translation) items.push({ label: lang.value === 'zh' ? '译文' : 'Translation', value: translation });
  if (shangxi) items.push({ label: lang.value === 'zh' ? '赏析' : 'Appreciation', value: shangxi });
  return items;
});

const welcomePoemNeedsScroll = computed(() => {
  return welcomePoemLines.value.length > 6 || welcomePoemDetails.value.length > 0;
});

const currentPath = computed(() => currentFile.value?.path || currentFolder.value?.path || '');

// Root Directory Logic based on Language
const currentLangRoot = computed(() => {
  const root = fileSystem.value.find(node => node.name === lang.value);
  return root ? root.children : [];
});

const filteredFileSystem = computed(() => {
  const filterTree = (nodes: FileNode[]): FileNode[] => {
    return nodes.map((node) => {
      if (node.type === NodeType.FILE) {
        return isFileVisible(node) ? node : null;
      }
      const children = node.children ? filterTree(node.children) : [];
      return { ...node, children } as FileNode;
    }).filter(Boolean) as FileNode[];
  };

  return filterTree(currentLangRoot.value || []);
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

  let files = flatten(currentLangRoot.value || []);
  files = files.filter(isFileVisible);

  return files.sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
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
  };
  return findFolderByName(fileSystem.value);
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

// Resource Categories
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


// =====================
// File Operations
// =====================
const updateUrl = (path: string | null) => {
  try {
    const url = new URL(window.location.href);
    if (path) {
      url.searchParams.set('path', path);
      url.searchParams.delete('lab');
      url.searchParams.delete('tab');
    } else {
      url.searchParams.delete('path');
    }
    window.history.pushState({}, '', url.toString());
  } catch (e) {
    console.error("Failed to update URL", e);
  }
};

const updateLabUrl = (tab?: string) => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lab', 'dashboard');
    if (tab) url.searchParams.set('tab', tab);
    else url.searchParams.delete('tab');
    url.searchParams.delete('path');
    window.history.pushState({}, '', url.toString());
  } catch (e) {
    console.error('Failed to update lab URL', e);
  }
};

const isPdfFile = (file: FileNode) => file.path.toLowerCase().endsWith('.pdf')

const openFile = async (file: FileNode) => {
  currentFile.value = file;
  currentFolder.value = null;
  currentTool.value = null;
  isRawMode.value = !!file.isSource;

  updateUrl(file.path);
  const container = document.getElementById('scroll-container');
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });

  hideSelectionMenu();

  if (!file.content && !isPdfFile(file)) {
    contentLoading.value = true;
    file.content = await fetchFileContent(file);
    contentLoading.value = false;
    currentFile.value = { ...file };
  }
};

const handleSidebarFileSelect = async (file: FileNode) => {
  await openFile(file);
  if (isMobile.value) {
    sidebarOpen.value = false;
  }
};

const openFolder = (folder: FileNode) => {
  currentFile.value = null;
  currentFolder.value = folder;
  currentTool.value = null;
  updateUrl(folder.path);
  if (viewMode.value === 'latest') viewMode.value = 'files';
  hideSelectionMenu();
};

const selectTool = (tool: string) => {
  currentTool.value = tool as 'dashboard' | 'event-handling' | 'slot' | 'source-code';
  currentFile.value = null;
  currentFolder.value = null;
  dualColumnMode.value = false; // Exit dual column when selecting specific tool
};

const labDashboardTab = ref<string>('note1-html-css');

// Lab tabs for sidebar (synced with LabDashboard)
const labTabs = computed(() => {
  const isZh = lang.value === 'zh'
  return [
    { id: 'note1-html-css', shortLabel: isZh ? 'HTML/CSS' : 'HTML/CSS', icon: '🎨', noteNum: 1 },
    { id: 'note2-javascript', shortLabel: 'JavaScript', icon: '⚡', noteNum: 2 },
    { id: 'note3-vue-basics', shortLabel: isZh ? 'Vue基础' : 'Vue Basics', icon: '🥝', noteNum: 3 },
    { id: 'note4-vue-engineering', shortLabel: isZh ? '工程化' : 'Engineering', icon: '🚀', noteNum: 4 },
    { id: 'challenge', shortLabel: isZh ? '挑战' : 'Challenge', icon: '🏆', noteNum: 0 },
  ]
})

const handleLabTabChange = (tab: string) => {
  labDashboardTab.value = tab;
  if (viewMode.value === 'lab' && currentTool.value === 'dashboard') {
    updateLabUrl(tab);
  }
};

const openLabDashboard = (tab?: string) => {
  viewMode.value = 'lab';
  currentTool.value = 'dashboard';
  currentFile.value = null;
  currentFolder.value = null;
  if (tab) labDashboardTab.value = tab;
  updateLabUrl(tab);
};

const navigateToBreadcrumb = (path: string) => {
  const node = findNodeByPath(fileSystem.value, path);
  if (node) {
    if (node.type === NodeType.DIRECTORY) openFolder(node);
    else openFile(node);
  }
};

const toggleFolder = (path: string) => {
  const idx = appStore.expandedFolders.indexOf(path);
  if (idx === -1) appStore.expandedFolders.push(path);
  else appStore.expandedFolders.splice(idx, 1);
};

const resetToHome = () => {
  currentFile.value = null;
  currentFolder.value = null;
  viewMode.value = 'latest';
  hideSelectionMenu();
  updateUrl(null);
  loadRandomPoem();
};

// =====================
// Global Code Open Helper
// =====================
const parseRangeToken = (raw?: string) => {
  if (!raw) return { startLine: undefined, endLine: undefined };
  const match = raw.match(/L?(\d+)(?:-L?(\d+))?/i);
  if (!match) return { startLine: undefined, endLine: undefined };
  const startLine = Number(match[1]);
  const endLine = match[2] ? Number(match[2]) : undefined;
  return {
    startLine: Number.isFinite(startLine) ? startLine : undefined,
    endLine: Number.isFinite(endLine || 0) ? endLine : undefined
  };
};

const buildLineSnippet = (content: string, startLine?: number, endLine?: number) => {
  if (!startLine) return content;
  const lines = content.split(/\r?\n/);
  const safeStart = Math.max(1, startLine);
  const safeEnd = Math.min(lines.length, endLine && endLine >= safeStart ? endLine : safeStart);
  const width = String(safeEnd).length;
  const slice = lines.slice(safeStart - 1, safeEnd);
  return slice.map((line, idx) => `${String(safeStart + idx).padStart(width, ' ')} | ${line}`).join('\n');
};

const openCodeByPath = async (path: string, range?: { startLine?: number; endLine?: number }) => {
  const fileName = path.split('/').pop() || path;
  const rangeLabel = range?.startLine
    ? ` (L${range.startLine}${range.endLine && range.endLine !== range.startLine ? `-L${range.endLine}` : ''})`
    : '';

  await codeModal.openCodeModal(`${fileName}${rangeLabel}`, 'Loading...', path);

  let node = findNodeByPath(fileSystem.value, path);
  let content = '';

  if (node && node.type === NodeType.FILE) {
    if (!node.content) {
      node.content = await fetchFileContent(node);
    }
    content = node.content;
  } else {
    content = await codeModal.fetchSourceCodeFile(path);
  }

  const finalContent = range?.startLine ? buildLineSnippet(content, range.startLine, range.endLine) : content;
  codeModal.setCodeModalContent(finalContent);
};

const handleOpenCodeEvent = async (e: Event) => {
  const detail = (e as CustomEvent).detail as {
    path?: string;
    startLine?: number;
    endLine?: number;
    range?: string;
  };
  if (!detail?.path) return;

  let startLine = detail.startLine;
  let endLine = detail.endLine;

  if (!startLine && detail.range) {
    const parsed = parseRangeToken(detail.range);
    startLine = parsed.startLine;
    endLine = parsed.endLine;
  }

  await openCodeByPath(detail.path, { startLine, endLine });
};

// =====================
// Content Click Handler
// =====================
const { handleContentClick } = useContentClick(
  currentFile,
  fileSystem,
  findNodeByPath,
  fetchFileContent,
  openFile,
  codeModal.openCodeModal,
  codeModal.setCodeModalContent,
  codeModal.fetchSourceCodeFile,
  handleImageClick,
  hideSelectionMenu,
  showToast,
  (tab?: string) => openLabDashboard(tab)
);

// 捕获阶段拦截内部链接点击（仅阻止默认跳转，不阻止传播，让冒泡阶段处理弹窗逻辑）
const handleLinkCapture = (e: Event) => {
  const mouseEvent = e as MouseEvent;
  const target = mouseEvent.target as HTMLElement;
  // 确保在 markdown-viewer 内部
  if (!target.closest('#markdown-viewer')) return;
  
  const link = target.closest('a');
  if (link) {
    const internalHref = link.getAttribute('data-internal-href');
    const href = link.getAttribute('href');
    // 如果有 data-internal-href 或者是支持的内部链接，立即阻止默认行为
    // 注意：不调用 stopPropagation()，让事件继续传播到冒泡阶段的 handleContentClickEvent
    if (internalHref || (href && isSupportedInternalLink(href))) {
      mouseEvent.preventDefault();
    }
  }
};

// Event handlers
const handleContentClickEvent = (e: MouseEvent) => {
  if (selectionMenu.value.locked) return;
  
  // 然后异步处理点击逻辑（捕获阶段已阻止默认行为，这里直接处理）
  handleContentClick(e, selectionMenu.value.locked);
};

// =====================
// Actions
// =====================
const toggleLang = async () => {
  const oldLang = lang.value;
  const newLang = oldLang === 'en' ? 'zh' : 'en';
  appStore.setLang(newLang);
  updateLanguage(newLang);

  if (viewMode.value === 'lab' && currentTool.value === 'dashboard') {
    return;
  }

  if (currentFolder.value && !currentFile.value) {
    return;
  }

  if (currentFile.value) {
    const oldPath = currentFile.value.path;
    const pathParts = oldPath.split('/');

    if (pathParts[0] === oldLang) {
      pathParts[0] = newLang;
      const newPath = pathParts.join('/');
      const newNode = findNodeByPath(fileSystem.value, newPath);

      if (newNode && newNode.type === NodeType.FILE) {
        await openFile(newNode);
        return;
      }
    }

    resetToHome();
    return;
  }
};

const toggleTheme = (val: boolean) => {
  appStore.setDark(val);
  if (val) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

const handlePetalSpeedChange = (speed: 'off' | 'slow' | 'fast') => {
  appStore.userSettings.petalSpeed = speed;
  appStore.showParticles = speed !== 'off';
};

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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(lang.value === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSearchSelect = (result: any) => {
  showSearch.value = false;
  sidebarOpen.value = false;

  const node = findNodeByPath(fileSystem.value, result.path);
  if (node && node.type === NodeType.FILE) {
    openFile(node);
  } else {
    showToast(t.value.file_not_found);
  }
};

const handleCommentCountUpdate = (payload: { path: string; count: number }) => {
  commentCounts.value[payload.path] = payload.count;
};

const getArticleViews = (path: string): number => {
  const likes = articleStore.getLikes(path);
  const baseViews = likes * (5 + Math.random() * 5);
  return Math.max(1, Math.round(baseViews));
};

const getArticleComments = (path: string): number => {
  const count = commentCounts.value[path];
  return typeof count === 'number' ? count : 0;
}

// =====================
// Keyboard Shortcuts
// =====================
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    showSearch.value = true;
  }
  if (e.key === 'Escape') {
    showSearch.value = false;
    musicStore.showMusicPlayer = false;
    showWriteEditor.value = false;
    sidebarOpen.value = false;
  }
};

// =====================
// Watchers
// =====================
const updateThemeColor = () => {
  const colorId = appStore.userSettings.themeColor || 'sakura';
  const theme = THEME_COLORS[colorId] || THEME_COLORS.sakura;
  const root = document.documentElement;
  
  Object.entries(theme.palette).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, value);
  });
  
  // Set main primary color for other uses
  root.style.setProperty('--primary-color', theme.preview);
};

watch(() => appStore.userSettings.themeColor, updateThemeColor, { immediate: true });

let wallpaperInterval: any = null
watch(() => appStore.userSettings.autoChangeMode, (mode) => {
  if (wallpaperInterval) clearInterval(wallpaperInterval)
  if (mode !== 'off') {
    autoChangeWallpaper()
    wallpaperInterval = setInterval(autoChangeWallpaper, 60000 * 5)
  }
}, { immediate: true })

// =====================
// Lifecycle
// =====================
onMounted(async () => {
  // Check mobile
  const checkMobile = () => {
    const mobile = window.innerWidth < 768;
    if (mobile !== isMobile.value) {
      isMobile.value = mobile;
      sidebarOpen.value = !mobile;
      return;
    }
    isMobile.value = mobile;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Mobile scroll behavior for header hide/show
  const scrollContainer = document.getElementById('scroll-container');
  const handleScroll = () => {
    if (!isMobile.value) {
      headerHidden.value = false;
      return;
    }
    if (themePanelOpen.value) {
      headerHidden.value = false;
      return;
    }

    const currentScrollY = scrollContainer?.scrollTop || 0;
    const delta = currentScrollY - lastScrollY.value;

    if (Math.abs(delta) > 5) {
      headerHidden.value = delta > 0 && currentScrollY > 50;
    }

    lastScrollY.value = currentScrollY;
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('selectionchange', handleSelectionChange);
  // 捕获阶段拦截内部链接点击
  document.addEventListener('click', handleLinkCapture, { capture: true });
  // 实验室/其他视图触发代码弹窗
  window.addEventListener('sakura-open-code', handleOpenCodeEvent as EventListener);

  if (appStore.isDark) document.documentElement.classList.add('dark');
  appStore.applyThemeColor(appStore.userSettings.themeColor);

  loadRandomPoem();

  // Initialize music store
  musicStore.loadPlaylist();

  // Set fetch function for search
  setFetchFunction(fetchFileContent);

  try {
    const res = await fetch(`./files.json?t=${Date.now()}`);
    if (res.ok) {
      fileSystem.value = await res.json();
      const params = new URLSearchParams(window.location.search);
      const targetPath = params.get('path');
      const sourcePath = params.get('source');
      const lab = params.get('lab');
      const tab = params.get('tab');

      // 处理代码文件弹窗路由
      if (sourcePath) {
        await openCodeByPath(sourcePath);
      }

      if (lab === 'dashboard') {
        openLabDashboard(tab || undefined);
      }

      if (targetPath) {
        const decodedTargetPath = decodeURIComponent(targetPath);
        const node = findNodeByPath(fileSystem.value, decodedTargetPath) || findNodeByPath(fileSystem.value, targetPath);

        if (node) {
          viewMode.value = 'files';

          if (node.type === NodeType.FILE) openFile(node);
          else openFolder(node);
        } else {
          console.warn("Path not found in file system:", targetPath);
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

    if (fileSystem.value.length > 0) {
      await initSearchIndex(fileSystem.value, lang.value);
      collectAllTags(currentLangRoot.value || [], articleStore.setAvailableTags);
    }

    nextTick(() => {
      const scrollEl = document.getElementById('scroll-container');
      if (scrollEl) {
        scrollEl.addEventListener('scroll', handleScroll, { passive: true });
      }
    });
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('click', handleLinkCapture, { capture: true });
  window.removeEventListener('sakura-open-code', handleOpenCodeEvent as EventListener);
  const scrollEl = document.getElementById('scroll-container');
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', () => {});
  }
});
</script>

<style>
body {
  user-select: none;
}

#markdown-viewer,
#markdown-viewer * {
  user-select: text;
}

#markdown-viewer ::selection {
  background: var(--primary-100);
}

.dark #markdown-viewer ::selection {
  background: var(--primary-900-30);
}

.article-style-compact {
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .article-style-compact {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .article-style-compact {
    padding: 2.5rem;
  }
}

.article-style-compact #markdown-viewer p,
.article-style-compact #markdown-viewer ul,
.article-style-compact #markdown-viewer ol {
  margin-top: 0.6em;
  margin-bottom: 0.6em;
}

/* Dynamic Title Colors */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: var(--primary-600);
}

.dark .markdown-body h1,
.dark .markdown-body h2,
.dark .markdown-body h3,
.dark .markdown-body h4,
.dark .markdown-body h5,
.dark .markdown-body h6 {
  color: var(--primary-300);
}

.font-kaiti {
  font-family: "KaiTi", "STKaiti", "楷体", "Microsoft YaHei", serif;
}

.article-style-compact #markdown-viewer h1,
.article-style-compact #markdown-viewer h2,
.article-style-compact #markdown-viewer h3,
.article-style-compact #markdown-viewer h4 {
  margin-top: 1.2em;
  margin-bottom: 0.6em;
}

.article-style-lined {
  --line-h: 2rem;
  --line-color: var(--primary-100);
  line-height: var(--line-h) !important;
  background-image: linear-gradient(to bottom, transparent calc(var(--line-h) - 1px), var(--line-color) calc(var(--line-h) - 1px)) !important;
  background-size: 100% var(--line-h) !important;
  background-position: 0 0.4rem; /* 稍微下移，让线条出现在文字下方 */
  background-attachment: local;
}

.article-style-lined #markdown-viewer p,
.article-style-lined #markdown-viewer ul,
.article-style-lined #markdown-viewer ol,
.article-style-lined #markdown-viewer li,
.article-style-lined #markdown-viewer h1,
.article-style-lined #markdown-viewer h2,
.article-style-lined #markdown-viewer h3,
.article-style-lined #markdown-viewer h4,
.article-style-lined #markdown-viewer blockquote {
  line-height: var(--line-h) !important;
  margin-bottom: var(--line-h) !important;
  margin-top: 0 !important;
}

.dark .article-style-lined {
  --line-color: var(--primary-900-30);
}

.article-style-grid {
  --line-h: 2rem;
  --line-color: var(--primary-100);
  line-height: var(--line-h) !important;
  background-image: 
    linear-gradient(to right, transparent calc(var(--line-h) - 1px), var(--line-color) calc(var(--line-h) - 1px)),
    linear-gradient(to bottom, transparent calc(var(--line-h) - 1px), var(--line-color) calc(var(--line-h) - 1px)) !important;
  background-size: var(--line-h) var(--line-h) !important;
  background-attachment: local;
}

.article-style-grid #markdown-viewer p,
.article-style-grid #markdown-viewer ul,
.article-style-grid #markdown-viewer ol,
.article-style-grid #markdown-viewer li,
.article-style-grid #markdown-viewer h1,
.article-style-grid #markdown-viewer h2,
.article-style-grid #markdown-viewer h3,
.article-style-grid #markdown-viewer h4,
.article-style-grid #markdown-viewer blockquote {
  line-height: var(--line-h) !important;
  margin-bottom: var(--line-h) !important;
  margin-top: 0 !important;
}

.dark .article-style-grid {
  --line-color: var(--primary-900-30);
}

.poem-font {
  font-family: "KaiTi", "STKaiti", "KaiTi_GB2312", "STSong", serif;
}

.poem-page {
  perspective: 900px;
}

.poem-line {
  opacity: 0;
  transform: rotateX(-18deg) translateY(10px) scale(0.98);
  transform-origin: top;
  transform-style: preserve-3d;
  animation: poem-turn 0.6s ease forwards;
}

@keyframes poem-turn {
  0% {
    opacity: 0;
    transform: rotateX(-18deg) translateY(10px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg) translateY(0) scale(1);
  }
}

input,
textarea,
[contenteditable="true"],
pre,
code {
  user-select: text;
}

#markdown-viewer h1 {
  color: var(--primary-600);
}
.dark #markdown-viewer h1 {
  color: var(--primary-400);
}

.sakura-block-highlight {
  background: rgba(252, 211, 77, 0.35);
  border: 1px solid rgba(252, 211, 77, 0.8);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0.05em 0.2em;
  border-radius: 0.35rem;
}
</style>
  opacity: 0;
  transform: rotateX(-18deg) translateY(10px) scale(0.98);
  transform-origin: top;
  transform-style: preserve-3d;
  animation: poem-turn 0.6s ease forwards;
}

@keyframes poem-turn {
  0% {
    opacity: 0;
    transform: rotateX(-18deg) translateY(10px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg) translateY(0) scale(1);
  }
}

input,
textarea,
[contenteditable="true"],
pre,
code {
  user-select: text;
}

#markdown-viewer h1 {
  color: var(--primary-600);
}
.dark #markdown-viewer h1 {
  color: var(--primary-400);
}

.sakura-block-highlight {
  background: rgba(252, 211, 77, 0.35);
  border: 1px solid rgba(252, 211, 77, 0.8);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0.05em 0.2em;
  border-radius: 0.35rem;
}
