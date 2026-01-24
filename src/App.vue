<template>
  <AppLayout
    :filtered-file-system="filteredFileSystem"
    :filtered-flat-files="filteredFlatFiles"
    :lab-folder="labFolder"
    :resource-categories="resourceCategories"
    :lab-tabs="labTabs"
    :lab-dashboard-tab="labDashboardTab"
    :comment-counts="commentCounts"
    :get-article-views="getArticleViews"
    :current-path="currentPath"
    :breadcrumbs="breadcrumbs"
    :dual-column-mode="dualColumnMode"
    :scroll-container="scrollContainer"
    @reset="resetToHome"
    @select-tool="selectTool"
    @toggle-folder="toggleFolder"
    @select-file="handleSidebarFileSelect"
    @select-folder="openFolder"
    @update:activeLabTab="handleLabTabChange"
    @navigate="navigateToBreadcrumb"
    @copy-link="copyLink"
    @download="downloadSource"
    @open-theme-panel="handleThemePanelChange"
    @update:petal-speed="handlePetalSpeedChange"
    @toggle-dual-column="dualColumnMode = !dualColumnMode; if(dualColumnMode && !appStore.currentTool) appStore.currentTool = 'dashboard'"
  >
    <!-- Dynamic Petals Container (Front layer) -->
    <PetalBackground v-if="appStore.showParticles && appStore.userSettings.petalLayer === 'front'" :speed="appStore.userSettings.petalSpeed" :isDark="appStore.isDark" layer="front" />

    <!-- Global Audio Player -->
    <GlobalAudio :show-floating="appStore.userSettings.musicPlayer === 'new'" />

    <!-- Selection Menu (Floating) -->
    <FloatingSelectionMenu 
      :selection-menu="selectionMenu" 
      @apply-format="applyFormatHandler"
    />

    <!-- Main Content -->
    <MainContent
      :view-mode="appStore.viewMode"
      :current-tool="appStore.currentTool"
      :current-file="appStore.currentFile"
      :current-folder="appStore.currentFolder"
      :lab-dashboard-tab="labDashboardTab"
      :lang="lang"
      :t="t"
      :loading="appStore.loading"
      :content-loading="appStore.contentLoading"
      :is-raw-mode="appStore.isRawMode"
      :welcome-poem-loading="welcomePoemLoading"
      :welcome-poem-error="welcomePoemError"
      :welcome-poem="welcomePoem"
      :welcome-poem-author-line="welcomePoemAuthorLine"
      :welcome-poem-lines="welcomePoemLines"
      :welcome-poem-details="welcomePoemDetails"
      :get-article-views="getArticleViews"
      :get-article-comments="getArticleComments"
      :on-content-click="handleContentClickEvent"
      :markdown-viewer-ref="markdownViewerRef"
      @update:labDashboardTab="handleLabTabChange"
      @tab-change="handleLabTabChange"
      @select-tool="selectTool"
      @open-folder="openFolder"
      @open-file="openFile"
      @update-comment-count="handleCommentCountUpdate"
      @load-random-poem="loadRandomPoem"
      @scroll-container-change="handleScrollContainerChange"
      @open-search="appStore.showSearch = true; if (layoutRef?.isMobile) appStore.sidebarOpen = false; appStore.setRightSidebarOpen(false)"
      @open-settings="appStore.showSettings = true; if (layoutRef?.isMobile) appStore.sidebarOpen = false; appStore.setRightSidebarOpen(false)"
      @open-music="musicStore.showMusicPlayer = true; if (layoutRef?.isMobile) appStore.sidebarOpen = false; appStore.setRightSidebarOpen(false)"
      @open-write="appStore.showWriteEditor = true; if (layoutRef?.isMobile) appStore.sidebarOpen = false; appStore.setRightSidebarOpen(false)"
      @open-download="appStore.showDownloadModal = true; if (layoutRef?.isMobile) appStore.sidebarOpen = false; appStore.setRightSidebarOpen(false)"
      @toggle-theme="toggleTheme(!appStore.isDark); appStore.setRightSidebarOpen(false)"
    />

    <!-- Dual Column Mode - Teleport to body for true fullscreen -->
    <Teleport to="body">
      <DualColumnView 
        v-if="appStore.viewMode === 'lab' && dualColumnMode"
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
    
    <!-- Modals -->
    <Lightbox />
    <CodeModal :t="t" />
    <Toast />
    
    <SettingsModal 
      v-if="appStore.showSettings" 
      @close="appStore.showSettings = false"
      :t="t"
      :is-dark="appStore.isDark"
      :lang="lang"
      :file-system="appStore.fileSystem"
      :lab-folder="labFolder"
    />

    <DownloadModal
      v-if="appStore.showDownloadModal"
      @close="appStore.showDownloadModal = false"
      :lang="lang"
      :file-system="appStore.fileSystem"
      :lab-folder="labFolder"
    />

    <SearchModal
      :showSearchModal="appStore.showSearch"
      @close="appStore.showSearch = false"
      :t="t"
      :lang="lang"
      :searchFn="search"
      :highlightFn="highlightMatches"
      :isLoadingContent="isLoadingContent"
      @select="handleSearchSelect"
    />

    <MusicPlayer :lang="lang" />
    <WriteEditor :show="appStore.showWriteEditor" @close="appStore.showWriteEditor = false" :lang="lang" />

  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted, defineAsyncComponent } from 'vue';
import { I18N, THEME_COLORS } from './constants';
import { NodeType } from './types';
import type { FileNode, BreadcrumbItem } from './types';

// Components
import AppLayout from './layout/AppLayout.vue';
import DualColumnView from './components/lab/DualColumnView.vue';
import PetalBackground from './components/PetalBackground.vue';
import GlobalAudio from './components/GlobalAudio.vue';
import FloatingSelectionMenu from './components/FloatingSelectionMenu.vue';
import MainContent from './components/MainContent.vue';
import Toast from './components/Toast.vue';

// Async Components
const SettingsModal = defineAsyncComponent(() => import('./components/SettingsModal.vue'));
const DownloadModal = defineAsyncComponent(() => import('./components/DownloadModal.vue'));
const SearchModal = defineAsyncComponent(() => import('./components/SearchModal.vue'));
const MusicPlayer = defineAsyncComponent(() => import('./components/MusicPlayer.vue'));
const WriteEditor = defineAsyncComponent(() => import('./components/WriteEditor.vue'));
const CodeModal = defineAsyncComponent(() => import('./components/Modals/CodeModal.vue'));
const Lightbox = defineAsyncComponent(() => import('./components/Modals/Lightbox.vue'));

// Pinia Stores
import { useAppStore } from './stores/appStore';
import { useArticleStore } from './stores/articleStore';
import { useMusicStore } from './stores/musicStore';
import { useLearningStore } from './stores/learningStore';

// Composables
import { useSearch } from './composables/useSearch';
import { findNodeByPath, fetchFileContent } from './utils/fileUtils';
import { useCodeModal } from './composables/useCodeModal';
import { useLightbox } from './composables/useLightbox';
import { useSelectionMenu } from './composables/useSelectionMenu';
import { useContentClick, useFileVisibility, isSupportedInternalLink } from './composables/useContentClick';
import { useWallpapers } from './composables/useWallpapers';
import { usePoem } from './composables/usePoem';
import { useToast } from './composables/useToast';
import { useRouting } from './composables/useRouting';
import { useFileOperations } from './composables/useFileOperations';
import { useFilteredFiles } from './composables/useFilteredFiles';
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';
import { useAppInit } from './composables/useAppInit';
import { useTheme } from './composables/useTheme';
import { useCodeOpener } from './composables/useCodeOpener';

// =====================
// Stores
// =====================
const appStore = useAppStore();
const articleStore = useArticleStore();
const learningStore = useLearningStore();
const { autoChangeWallpaper } = useWallpapers();
const musicStore = useMusicStore();
const { showToast } = useToast();
const markdownViewerRef = ref<HTMLElement | null>(null);

// =====================
// Search
// =====================
const { initSearchIndex, search, highlightMatches, isLoadingContent, setFetchFunction, updateLanguage } = useSearch();

// =====================
// Lightbox
// =====================
const lightbox = useLightbox();
const { handleImageClick } = lightbox;

// =====================
// Selection Menu
// =====================
const { selectionMenu, applyFormat, hideSelectionMenu, handleSelectionChange } = useSelectionMenu(markdownViewerRef, showToast);

const applyFormatHandler = (format: string) => {
  const errorMsg = lang.value === 'zh' ? '应用格式失败' : 'Format failed';
  applyFormat(format, errorMsg);
};

// =====================
// i18n
// =====================
const lang = computed(() => appStore.lang);
const t = computed(() => I18N[lang.value]);

// =====================
// Poem
// =====================
const { 
  welcomePoem, 
  welcomePoemLoading, 
  welcomePoemError, 
  loadRandomPoem, 
  welcomePoemLines, 
  welcomePoemAuthorLine, 
  welcomePoemDetails 
} = usePoem(lang);

// =====================
// Composables Initialization
// =====================
const { toggleTheme, initTheme } = useTheme();
const { initCodeOpener, openCodeByPath } = useCodeOpener();
initTheme();
initCodeOpener();

const scrollContainer = ref<HTMLElement | null>(null);
const { updateUrl, updateLabUrl } = useRouting();
const { openFile, openFolder, handleSidebarFileSelect } = useFileOperations(scrollContainer);
const { filteredFileSystem, filteredFlatFiles, labFolder, collectAllTags } = useFilteredFiles();

useKeyboardShortcuts();

// =====================
// Computed
// =====================
const currentPath = computed(() => appStore.currentFile?.path || appStore.currentFolder?.path || '');

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = currentPath.value;
  if (!path) return [];
  const parts = path.split('/');

  let accumulatedPath = '';
  return parts.map((part: string) => {
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

const commentCounts = ref<Record<string, number>>({});
const themePanelOpen = ref(false);

const handleThemePanelChange = (open: boolean) => {
  themePanelOpen.value = open;
};

// Dual Column Mode
const dualColumnMode = ref(false);
const dualColumnLeft = ref<'notes' | 'lab' | 'source'>('notes');
const dualColumnRight = ref<'notes' | 'lab' | 'source'>('lab');

const layoutRef = ref();

const selectTool = (tool: string) => {
  appStore.currentTool = tool as any;
  appStore.currentFile = null;
  appStore.currentFolder = null;
  dualColumnMode.value = false;
};

const labDashboardTab = ref<string>('project-builder');

// Lab tabs
const labTabs = computed(() => {
  const isZh = lang.value === 'zh'
  return [
    { id: 'project-builder', shortLabel: isZh ? 'Tlias 主线' : 'Tlias Path', icon: '🏗️', noteNum: 0, tag: 'Tlias' },
    { id: 'foundation', shortLabel: isZh ? '网页基础' : 'Foundation', icon: '🧱', noteNum: 1, disabled: !learningStore.canAccessStage('foundation') },
    { id: 'js-basics', shortLabel: isZh ? 'JS 基础' : 'JS Basics', icon: '⚡', noteNum: 2, disabled: !learningStore.canAccessStage('js-basics') },
    { id: 'css-layout', shortLabel: isZh ? 'CSS 布局' : 'CSS Layout', icon: '🎨', noteNum: 1, disabled: !learningStore.canAccessStage('css-layout') },
    { id: 'js-advanced', shortLabel: isZh ? 'JS 进阶/TS' : 'JS Adv/TS', icon: '🛡️', noteNum: 4, disabled: !learningStore.canAccessStage('js-advanced') },
    { id: 'engineering', shortLabel: isZh ? '工程化' : 'Engineering', icon: '🚀', noteNum: 4, disabled: !learningStore.canAccessStage('engineering') },
    { id: 'vue-core', shortLabel: isZh ? 'Vue 核心' : 'Vue Core', icon: '🥝', noteNum: 3, disabled: !learningStore.canAccessStage('vue-core') },
    { id: 'vue-advanced', shortLabel: isZh ? 'Vue 进阶' : 'Vue Adv', icon: '🧩', noteNum: 4, disabled: !learningStore.canAccessStage('vue-advanced') },
    { id: 'challenge', shortLabel: isZh ? '挑战' : 'Challenge', icon: '🏆', noteNum: 0, disabled: !learningStore.canAccessStage('challenge') },
    { id: 'extensions', shortLabel: isZh ? '扩展' : 'Extensions', icon: '✨', noteNum: 0, disabled: !learningStore.canAccessStage('extensions') },
  ]
})

const handleLabTabChange = (tab: string) => {
  labDashboardTab.value = tab;
  if (appStore.viewMode === 'lab' && appStore.currentTool === 'dashboard') {
    updateLabUrl(tab);
  }
};

const handleScrollContainerChange = (el: HTMLElement | null) => {
  scrollContainer.value = el;
};

const openLabDashboard = (tab?: string) => {
  appStore.viewMode = 'lab';
  appStore.currentTool = 'dashboard';
  appStore.currentFile = null;
  appStore.currentFolder = null;
  if (tab) labDashboardTab.value = tab;
  updateLabUrl(tab);
};

const navigateToBreadcrumb = (path: string) => {
  const node = findNodeByPath(appStore.fileSystem, path);
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
  appStore.currentFile = null;
  appStore.currentFolder = null;
  appStore.viewMode = 'latest';
  hideSelectionMenu();
  updateUrl(null);
  loadRandomPoem();
};

// =====================
// Global Code Open Helper
// =====================
// Logic moved to useCodeOpener.ts

// =====================
// Content Click Handler
// =====================
// Note: handleContentClick still needs codeModal methods, we should probably export them from useCodeOpener or keep useCodeModal here for this purpose.
// Checking imports: useCodeModal is imported. 
// We need to re-instantiate it since I removed the previous instantiation.
const codeModal = useCodeModal(); 

const { handleContentClick } = useContentClick(
  computed(() => appStore.currentFile),
  computed(() => appStore.fileSystem),
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

// 捕获阶段拦截内部链接点击
const handleLinkCapture = (e: Event) => {
  const mouseEvent = e as MouseEvent;
  const target = mouseEvent.target as HTMLElement;
  const viewer = markdownViewerRef.value;
  if (!viewer || !viewer.contains(target)) return;
  
  const link = target.closest('a');
  if (link) {
    const internalHref = link.getAttribute('data-internal-href');
    const href = link.getAttribute('href');
    if (internalHref || (href && isSupportedInternalLink(href))) {
      mouseEvent.preventDefault();
    }
  }
};

const handleContentClickEvent = (e: MouseEvent) => {
  if (selectionMenu.value.locked) return;
  handleContentClick(e, selectionMenu.value.locked);
};

// =====================
// Actions
// =====================

const handlePetalSpeedChange = (speed: 'off' | 'slow' | 'fast') => {
  appStore.userSettings.petalSpeed = speed;
  appStore.showParticles = speed !== 'off';
};

const copyLink = () => navigator.clipboard.writeText(window.location.href).then(() => showToast(t.value.link_copied));

const downloadSource = () => {
  if (appStore.currentFile) {
    const blob = new Blob([appStore.currentFile.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = appStore.currentFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }
};

const handleSearchSelect = (result: any) => {
  appStore.showSearch = false;
  appStore.sidebarOpen = false;

  const node = findNodeByPath(appStore.fileSystem, result.path);
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
// Watchers
// =====================
const updateThemeColor = () => {
  const colorId = appStore.userSettings.themeColor || 'sakura';
  const theme = THEME_COLORS[colorId] || THEME_COLORS.sakura;
  const root = document.documentElement;
  
  Object.entries(theme.palette).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, String(value));
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
// App Initialization
// =====================
useAppInit(
  lang,
  loadRandomPoem,
  openFile,
  openFolder,
  openCodeByPath,
  openLabDashboard
);

// =====================
// Lifecycle
// =====================
onMounted(async () => {
  document.addEventListener('selectionchange', handleSelectionChange);
  // 捕获阶段拦截内部链接点击
  document.addEventListener('click', handleLinkCapture, { capture: true });
});

onUnmounted(() => {
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('click', handleLinkCapture, { capture: true });
});
</script>

<style>
/* Styles moved to src/styles/app.css */
</style>
