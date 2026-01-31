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
    @open-theme-panel="handleThemePanelChange"
    @update:petal-speed="handlePetalSpeedChange"
    @toggle-dual-column="toggleDualColumnMode"
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
      :get-article-visitors="getArticleVisitors"
      :get-article-comments="getArticleComments"
      :on-content-click="handleContentClickEvent"
      @update:labDashboardTab="handleLabTabChange"
      @tab-change="handleLabTabChange"
      @select-tool="selectTool"
      @open-folder="openFolder"
      @open-file="openFile"
      @update-comment-count="handleCommentCountUpdate"
      @load-random-poem="loadRandomPoem"
      @scroll-container-change="handleScrollContainerChange"
      @markdown-viewer-change="handleMarkdownViewerChange"
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
        :open-note-path="dualColumnOpenNotePath"
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
import { useTypography } from './composables/useTypography';
import { useCodeOpener } from './composables/useCodeOpener';
import { useAppSearchIntegration } from './composables/useAppSearchIntegration';
import { LAB_TABS } from './labs/labCatalog'

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
const { initSearchIndex, search, highlightMatches, isLoadingContent, setFetchFunction, updateLanguage, loadFullContentAndRebuild } = useSearch();

// =====================
// Lightbox
// =====================
const lightbox = useLightbox();
const { handleImageClick } = lightbox;

// =====================
// Selection Menu
// =====================
const { selectionMenu, applyFormat, hideSelectionMenu, handleSelectionChange, handleSelectionContextMenu } = useSelectionMenu(markdownViewerRef, showToast);

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
const { initTypography } = useTypography();
const { initCodeOpener, openCodeByPath } = useCodeOpener();
initTheme();
initTypography();
initCodeOpener();

const scrollContainer = ref<HTMLElement | null>(null);
const { updateUrl, updateLabUrl } = useRouting();
const { openFile, openFolder, handleSidebarFileSelect } = useFileOperations(scrollContainer);
const { filteredFileSystem, filteredFlatFiles, labFolder, collectAllTags } = useFilteredFiles();

useKeyboardShortcuts();

const { handleSearchSelect } = useAppSearchIntegration({
  appStore,
  lang: lang as any,
  t: t as any,
  openFile,
  initSearchIndex,
  updateLanguage,
  showToast
})

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
const dualColumnOpenNotePath = ref<string | null>(null);

const handleOpenLabNoteEvent = (evt: Event) => {
  const e = evt as CustomEvent<{ path?: string }>
  const path = e.detail?.path
  if (!path) return
  const isMobile = !!layoutRef.value?.isMobile || window.innerWidth < 768
  if (isMobile) {
    const normalized = path.replace(/^\/+/, '')
    const node = findNodeByPath(appStore.fileSystem, normalized)
    if (node && node.type === NodeType.FILE) {
      dualColumnMode.value = false
      dualColumnOpenNotePath.value = null
      appStore.viewMode = 'lab'
      appStore.currentTool = null
      void openFile(node)
    } else {
      dualColumnMode.value = false
      dualColumnOpenNotePath.value = null
      openLabDashboard(labDashboardTab.value)
    }
    return
  }
  appStore.viewMode = 'lab'
  appStore.currentTool = 'dashboard'
  dualColumnMode.value = true
  dualColumnLeft.value = 'notes'
  dualColumnRight.value = 'lab'
  dualColumnOpenNotePath.value = path
}

const handleOpenLabSourceEvent = () => {
  const isMobile = !!layoutRef.value?.isMobile || window.innerWidth < 768
  if (isMobile) {
    dualColumnMode.value = false
    dualColumnOpenNotePath.value = null
    appStore.viewMode = 'lab'
    appStore.currentTool = 'source-code'
    appStore.currentFile = null
    appStore.currentFolder = null
    return
  }
  appStore.viewMode = 'lab'
  appStore.currentTool = 'dashboard'
  dualColumnMode.value = true
  dualColumnLeft.value = 'lab'
  dualColumnRight.value = 'source'
  dualColumnOpenNotePath.value = null
}

const layoutRef = ref();

const toggleDualColumnMode = () => {
  const isMobile = !!layoutRef.value?.isMobile || window.innerWidth < 768
  if (isMobile) {
    dualColumnMode.value = false
    dualColumnOpenNotePath.value = null
    return
  }
  dualColumnMode.value = !dualColumnMode.value
  if (dualColumnMode.value && !appStore.currentTool) appStore.currentTool = 'dashboard'
}

const selectTool = (tool: string) => {
  appStore.currentTool = tool as any;
  appStore.currentFile = null;
  appStore.currentFolder = null;
  dualColumnMode.value = false;
};

const labDashboardTab = ref<string>('foundation');

// Lab tabs
const labTabs = computed(() => {
  const isZh = lang.value === 'zh'
  return LAB_TABS.map(tab => ({
    id: tab.id,
    shortLabel: isZh ? tab.shortLabelZh : tab.shortLabelEn,
    icon: tab.icon,
    noteNum: tab.noteNum,
    disabled: !learningStore.canAccessStage(tab.id as any)
  }))
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

const handleMarkdownViewerChange = (el: HTMLElement | null) => {
  markdownViewerRef.value = el
}

const openLabDashboard = (tab?: string, options?: { syncUrl?: boolean }) => {
  const safeTab = tab ? tab.split('#')[0] : undefined
  appStore.viewMode = 'lab';
  appStore.currentTool = 'dashboard';
  appStore.currentFile = null;
  appStore.currentFolder = null;
  if (safeTab) labDashboardTab.value = safeTab;
  if (options?.syncUrl !== false) updateLabUrl(safeTab);
};

const applyUrlState = async () => {
  if (!appStore.fileSystem || appStore.fileSystem.length === 0) return

  const params = new URLSearchParams(window.location.search)
  const targetPath = params.get('path')
  const sourcePath = params.get('source')
  const lab = params.get('lab')
  const tab = params.get('tab')

  if (sourcePath) {
    try {
      await openCodeByPath(sourcePath, undefined, { syncUrl: false })
    } catch {}
  }

  if (lab === 'dashboard') {
    dualColumnMode.value = false
    dualColumnOpenNotePath.value = null
    openLabDashboard(tab || undefined, { syncUrl: false })
    return
  }

  if (targetPath) {
    const decodedTargetPath = decodeURIComponent(targetPath)
    const node =
      findNodeByPath(appStore.fileSystem, decodedTargetPath) || findNodeByPath(appStore.fileSystem, targetPath)
    if (node) {
      dualColumnMode.value = false
      dualColumnOpenNotePath.value = null
      appStore.viewMode = 'files'
      if (node.type === NodeType.FILE) await openFile(node, { syncUrl: false })
      else openFolder(node, { syncUrl: false })
    }
    return
  }

  dualColumnMode.value = false
  dualColumnOpenNotePath.value = null
  appStore.currentFile = null
  appStore.currentFolder = null
  appStore.currentTool = null
  appStore.viewMode = 'latest'
  hideSelectionMenu()
  loadRandomPoem()
}

const handlePopState = () => {
  void applyUrlState()
}

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
  codeModal.setHighlightRange,
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

const handleCommentCountUpdate = (payload: { path: string; count: number }) => {
  commentCounts.value[payload.path] = payload.count;
};

const getArticleViews = (path: string): number | undefined => {
  const cached = articleStore.getCachedStats(path);
  return cached ? cached.views : undefined;
};

const getArticleVisitors = (path: string): number | undefined => {
  const cached = articleStore.getCachedStats(path);
  return cached ? cached.visitors : undefined;
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

watch(() => appStore.showSearch, (open) => {
  if (!open) return
  const w = window as any
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(() => loadFullContentAndRebuild(), { timeout: 1000 })
    return
  }
  window.setTimeout(() => loadFullContentAndRebuild(), 0)
})

// =====================
// App Initialization
// =====================
useAppInit(
  lang,
  loadRandomPoem,
  openFile,
  openFolder,
  openCodeByPath,
  openLabDashboard,
  { initSearchIndex, setFetchFunction }
);

// =====================
// Lifecycle
// =====================
onMounted(async () => {
  document.addEventListener('selectionchange', handleSelectionChange);
  document.addEventListener('contextmenu', handleSelectionContextMenu, { capture: true });
  // 捕获阶段拦截内部链接点击
  document.addEventListener('click', handleLinkCapture, { capture: true });
  window.addEventListener('sakura:open-lab-note', handleOpenLabNoteEvent as EventListener);
  window.addEventListener('sakura:open-lab-source', handleOpenLabSourceEvent as EventListener);
  window.addEventListener('popstate', handlePopState);
});

onUnmounted(() => {
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('contextmenu', handleSelectionContextMenu, { capture: true });
  document.removeEventListener('click', handleLinkCapture, { capture: true });
  window.removeEventListener('sakura:open-lab-note', handleOpenLabNoteEvent as EventListener);
  window.removeEventListener('sakura:open-lab-source', handleOpenLabSourceEvent as EventListener);
  window.removeEventListener('popstate', handlePopState);
});
</script>

<style>
/* Styles moved to src/styles/app.css */
</style>
