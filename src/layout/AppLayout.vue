<template>
  <div class="flex flex-col md:flex-row w-full h-full max-w-[2560px] mx-auto overflow-hidden bg-gradient-to-br from-white/70 via-[var(--primary-50)]/50 to-purple-50/40 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-[var(--primary-900)]/40 backdrop-blur-[3px] border border-white/30 dark:border-gray-800/60 shadow-[0_12px_60px_rgba(15,23,42,0.12)] font-sans transition-colors duration-500 relative" :class="[appStore.userSettings.fontFamily === 'serif' ? 'font-serif' : appStore.userSettings.fontFamily === 'kaiti' ? 'font-kaiti' : 'font-sans', appStore.isDark ? 'dark' : '']">
    
    <!-- Left Sidebar: Navigation -->
    <AppSidebar 
      v-if="!isMobile && !appStore.readingMode"
      :class="[
        appStore.sidebarOpen ? 'translate-x-0 md:translate-x-0 md:w-72 lg:w-80' : '-translate-x-full md:-translate-x-full md:w-0 md:opacity-0 md:overflow-hidden md:pointer-events-none'
      ]"
      class="fixed md:relative z-40 transition-all duration-300 ease-out"
      :lang="lang"
      :t="t"
      v-model:viewMode="appStore.viewMode"
      :loading="appStore.loading"
      :file-system="appStore.fileSystem"
      :filtered-file-system="filteredFileSystem"
      :filtered-flat-files="filteredFlatFiles"
      :current-file="appStore.currentFile"
      :expanded-folders="appStore.expandedFolders"
      :current-path="currentPath"
      :lab-folder="labFolder"
      :resource-categories="resourceCategories"
      :current-tool="appStore.currentTool"
      :lab-tabs="labTabs"
      :active-lab-tab="labDashboardTab"
      :get-article-views="getArticleViews"
      :comment-counts="commentCounts"
      @toggle-lang="appStore.toggleLang"
      @reset="$emit('reset')"
      @logo-click="showToast(t.welcome_title); if(isMobile) appStore.sidebarOpen = false"
      @select-tool="$emit('select-tool', $event); if(isMobile) appStore.sidebarOpen = false"
      @toggle-folder="$emit('toggle-folder', $event)"
      @select-file="$emit('select-file', $event); if(isMobile) appStore.sidebarOpen = false"
      @select-folder="$emit('select-folder', $event)"
      @open-search="appStore.showSearch = true; if(isMobile) appStore.sidebarOpen = false"
      @toggle-sidebar="appStore.sidebarOpen = !appStore.sidebarOpen"
      @toggle-right-sidebar="appStore.rightSidebarOpen = !appStore.rightSidebarOpen"
      @update:activeLabTab="$emit('update:activeLabTab', $event)"
    />

    <!-- Main Content Wrapper -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative isolate">
      <!-- Wallpaper Layer -->
      <WallpaperLayer v-if="!appStore.readingMode" :is-dark="appStore.isDark" :light-url="wallpaperLightUrl" :dark-url="wallpaperDarkUrl" :bannerMode="appStore.userSettings.bannerMode" />

      <!-- Dynamic Petals Container (Back layer) -->
      <PetalBackground v-if="!appStore.readingMode && appStore.showParticles && appStore.userSettings.petalLayer === 'back'" :speed="appStore.userSettings.petalSpeed" :isDark="appStore.isDark" layer="back" />

      <!-- Decorative Background Elements -->
      <div v-if="!appStore.readingMode" class="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[var(--primary-100)]/40 to-purple-100/30 dark:from-[var(--primary-900)]/10 dark:to-purple-900/10 blur-3xl animate-float opacity-60"></div>
        <div class="absolute top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--primary-200)]/30 to-[var(--primary-50)]/20 dark:from-[var(--primary-800)]/10 dark:to-[var(--primary-900)]/5 blur-3xl animate-pulse-fast opacity-50" style="animation-duration: 8s;"></div>
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#9f123f 1px, transparent 1px); background-size: 32px 32px;"></div>
      </div>

      <!-- Header Component -->
      <AppHeader
        ref="headerRef"
        :lang="lang"
        :t="t"
        :breadcrumbs="breadcrumbs"
        :view-mode="appStore.viewMode"
        :current-tool="appStore.currentTool"
        :current-file="appStore.currentFile"
        :show-particles="appStore.showParticles"
        :is-dark="appStore.isDark"
        :petal-speed="appStore.userSettings.petalSpeed"
        :header-hidden="headerHidden"
        :dual-column-mode="dualColumnMode"
        :sidebar-open="isMobile ? mobileShellPage === 0 : appStore.sidebarOpen"
        :right-sidebar-open="appStore.rightSidebarOpen"
        :get-article-views="getArticleViews"
        v-model:isRawMode="appStore.isRawMode"
        @reset="$emit('reset')"
        @navigate="$emit('navigate', $event)"
        @copy-link="$emit('copy-link')"
        @download="$emit('download')"
        @open-settings="appStore.showSettings = true; headerHidden = false; if (isMobile) appStore.sidebarOpen = false"
        @open-theme-panel="$emit('open-theme-panel', $event)"
        @open-search="appStore.showSearch = true; if (isMobile) appStore.sidebarOpen = false"
        @open-music="musicStore.showMusicPlayer = true; if (isMobile) appStore.sidebarOpen = false"
        @open-write="appStore.showWriteEditor = true; if (isMobile) appStore.sidebarOpen = false"
        @open-download="appStore.showDownloadModal = true; if (isMobile) appStore.sidebarOpen = false"
        @toggle-theme="appStore.toggleTheme()"
        @update:petal-speed="$emit('update:petal-speed', $event)"
        @toggle-dual-column="$emit('toggle-dual-column')"
        @toggle-sidebar="handleHeaderToggleSidebar"
        @toggle-right-sidebar="handleHeaderToggleRightSidebar"
      />

      <div class="flex-1 flex overflow-hidden z-10 relative">
        <div
          v-if="isMobile"
          ref="mobileShellRef"
          class="flex h-full w-full overflow-x-auto overflow-y-hidden no-scrollbar overscroll-x-contain"
          style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
          @scroll.passive="handleMobileShellScroll"
        >
          <div class="flex h-full w-full">
            <div class="h-full w-full basis-full shrink-0 grow-0 max-w-full" style="scroll-snap-align: start;">
              <AppSidebar
                v-if="!appStore.readingMode"
                class="h-full w-full max-w-full"
                :lang="lang"
                :t="t"
                v-model:viewMode="appStore.viewMode"
                :loading="appStore.loading"
                :file-system="appStore.fileSystem"
                :filtered-file-system="filteredFileSystem"
                :filtered-flat-files="filteredFlatFiles"
                :current-file="appStore.currentFile"
                :expanded-folders="appStore.expandedFolders"
                :current-path="currentPath"
                :lab-folder="labFolder"
                :resource-categories="resourceCategories"
                :current-tool="appStore.currentTool"
                :lab-tabs="labTabs"
                :active-lab-tab="labDashboardTab"
                :get-article-views="getArticleViews"
                :comment-counts="commentCounts"
                @toggle-lang="appStore.toggleLang"
                @reset="$emit('reset'); scrollToMobilePage(1)"
                @logo-click="showToast(t.welcome_title); scrollToMobilePage(1)"
                @select-tool="$emit('select-tool', $event); scrollToMobilePage(1)"
                @toggle-folder="$emit('toggle-folder', $event)"
                @select-file="$emit('select-file', $event); scrollToMobilePage(1)"
                @select-folder="$emit('select-folder', $event); scrollToMobilePage(1)"
                @open-search="appStore.showSearch = true; scrollToMobilePage(1)"
                @toggle-sidebar="scrollToMobilePage(1)"
                @toggle-right-sidebar="appStore.rightSidebarOpen = !appStore.rightSidebarOpen"
                @update:activeLabTab="$emit('update:activeLabTab', $event); scrollToMobilePage(1)"
              />
            </div>

            <div class="h-full w-full basis-full shrink-0 grow-0 max-w-full flex overflow-hidden" style="scroll-snap-align: start;">
              <slot></slot>
            </div>

            <div class="h-full w-full basis-full shrink-0 grow-0 max-w-full overflow-y-auto custom-scrollbar" style="scroll-snap-align: start;">
              <div class="p-4">
                <div class="max-w-md mx-auto bg-white/85 dark:bg-gray-900/85 p-4 rounded-[2rem] shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-white/60 dark:border-gray-700/60 min-h-[calc(100%-2rem)] backdrop-blur-xl transition-all duration-300">
                  <div class="flex items-center justify-between mb-6">
                    <button
                      type="button"
                      class="px-3 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-white/60 dark:border-gray-700/60 text-sm text-gray-700 dark:text-gray-200"
                      @click="scrollToMobilePage(1)"
                    >
                      ← {{ lang === 'zh' ? '返回' : 'Back' }}
                    </button>
                    <div class="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span>📑</span>
                      <span>{{ t.on_this_page }}</span>
                    </div>
                    <div class="w-[72px]"></div>
                  </div>

                  <ArticleToc
                    :toc="mobileToc"
                    :active-header-id="mobileActiveHeaderId"
                    :empty-text="lang === 'zh' ? '暂无目录' : 'No TOC'"
                    @select="handleMobileTocSelect"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex-1 flex overflow-hidden relative">
          <slot></slot>
        </div>

        <RightSidebar 
          v-if="isMobile && appStore.rightSidebarOpen"
          :is-open="true"
          :lang="lang"
          :current-file="appStore.currentFile"
          :is-raw-mode="appStore.isRawMode"
          :view-mode="appStore.viewMode"
          :dual-column-mode="dualColumnMode"
          @update:isRawMode="appStore.isRawMode = $event"
          @copy-link="$emit('copy-link')"
          @download="$emit('download')"
          @toggle-dual-column="$emit('toggle-dual-column')"
          @open-search="appStore.showSearch = true"
          @open-settings="appStore.showSettings = true"
          @open-music="musicStore.showMusicPlayer = true"
          @open-write="appStore.showWriteEditor = true"
          @open-download="appStore.showDownloadModal = true"
          @toggle-theme-panel="handleRightSidebarThemePanel"
        />
      </div>
    </main>

    <!-- Mini Player -->
    <MiniPlayer v-if="appStore.userSettings.musicPlayer === 'old'" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick, defineAsyncComponent } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useMusicStore } from '../stores/musicStore';
import { useArticleNavStore } from '../stores/articleNavStore';
import { I18N } from '../constants';
import type { BreadcrumbItem, FileNode } from '../types';
import AppSidebar from '../components/AppSidebar.vue';
import AppHeader from '../components/AppHeader.vue';
import ArticleToc from '../components/ArticleToc.vue';
import WallpaperLayer from '../components/WallpaperLayer.vue';
import PetalBackground from '../components/PetalBackground.vue';
import { useToast } from '../composables/useToast';
import MiniPlayer from '../components/MiniPlayer.vue';

const RightSidebar = defineAsyncComponent(() => import('../components/RightSidebar.vue'));

const props = defineProps<{
  filteredFileSystem: FileNode[];
  filteredFlatFiles: FileNode[];
  labFolder: FileNode | null;
  resourceCategories: Array<{
    title: string;
    items: Array<{ name: string; url: string; icon: string; desc: string }>;
  }>;
  labTabs: Array<{ id: string; shortLabel: string; icon: string; noteNum: number }>;
  labDashboardTab: string;
  commentCounts: Record<string, number>;
  getArticleViews: (path: string) => number;
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  dualColumnMode: boolean;
  scrollContainer: HTMLElement | null;
}>();

const emit = defineEmits([
  'reset', 'select-tool', 'toggle-folder', 'select-file', 'select-folder',
  'update:activeLabTab', 'navigate', 'copy-link', 'download',
  'open-theme-panel', 'update:petal-speed', 'toggle-dual-column'
]);

const appStore = useAppStore();
const musicStore = useMusicStore();
const articleNavStore = useArticleNavStore();
const { showToast } = useToast();

const lang = computed(() => appStore.lang);
const t = computed(() => I18N[lang.value]);

const mobileToc = computed(() => {
  const file = appStore.currentFile
  if (!file || file.isSource || appStore.isRawMode) return []
  if (articleNavStore.articlePath !== file.path) return []
  return articleNavStore.toc
})

const mobileActiveHeaderId = computed(() => {
  if (mobileToc.value.length === 0) return ''
  return articleNavStore.activeHeaderId
})

const headerHidden = ref(false);
const headerRef = ref<InstanceType<typeof AppHeader> | null>(null);
const lastScrollY = ref(0);
const isMobile = ref(false);
const activeScrollContainer = ref<HTMLElement | null>(null);
const mobileShellRef = ref<HTMLElement | null>(null);
const mobileShellPage = ref(1);
const mobileShellScrollRaf = ref<number | null>(null);
const contentScrollRaf = ref<number | null>(null);

const handleRightSidebarThemePanel = () => {
  headerRef.value?.toggleThemePanel?.();
};

const handleMobileTocSelect = async (id: string) => {
  if (appStore.rightSidebarOpen) appStore.rightSidebarOpen = false;
  scrollToMobilePage(1, 'auto');
  await nextTick();
  const waitForArticlePage = () => {
    const el = mobileShellRef.value
    if (!el) return true
    const width = el.clientWidth || 1
    const page = Math.round(el.scrollLeft / width)
    return page === 1
  }
  const tryRequest = () => {
    if (waitForArticlePage()) {
      window.requestAnimationFrame(() => {
        articleNavStore.requestScrollTo(id);
      });
      return
    }
    window.requestAnimationFrame(tryRequest)
  }
  window.requestAnimationFrame(tryRequest)
};

// Wallpaper URLs
const wallpaperLightUrl = '/image/wallpaper-light.jpg';
const wallpaperDarkUrl = '/image/wallpaper-dark.jpg';

// Mobile check and scroll handling
const checkMobile = () => {
  const mobile = window.innerWidth < 768;
  if (mobile !== isMobile.value) {
    isMobile.value = mobile;
    if (mobile) {
      appStore.sidebarOpen = false;
      appStore.rightSidebarOpen = false;
    } else {
      appStore.sidebarOpen = true;
    }
    return;
  }
  isMobile.value = mobile;
};

const scrollToMobilePage = (page: number, behavior: ScrollBehavior = 'smooth') => {
  const el = mobileShellRef.value;
  if (!el) return;
  const width = el.clientWidth;
  el.scrollTo({ left: width * page, behavior });
  mobileShellPage.value = page;
  if (page !== 1) headerHidden.value = false;
};

const handleMobileShellScroll = () => {
  if (!isMobile.value) return;
  if (mobileShellScrollRaf.value != null) return;
  mobileShellScrollRaf.value = window.requestAnimationFrame(() => {
    mobileShellScrollRaf.value = null;
    const el = mobileShellRef.value;
    if (!el) return;
    const width = el.clientWidth || 1;
    const page = Math.round(el.scrollLeft / width);
    if (page !== mobileShellPage.value) {
      mobileShellPage.value = page;
      if (page !== 1) headerHidden.value = false;
    }
  });
};

const handleScroll = () => {
  if (!isMobile.value) {
    headerHidden.value = false;
    return;
  }
  if (mobileShellPage.value !== 1) {
    headerHidden.value = false;
    return;
  }
  if (contentScrollRaf.value != null) return;
  contentScrollRaf.value = window.requestAnimationFrame(() => {
    contentScrollRaf.value = null;
    const currentScrollY = activeScrollContainer.value?.scrollTop || 0;
    const delta = currentScrollY - lastScrollY.value;
    if (Math.abs(delta) > 5) {
      const nextHidden = delta > 0 && currentScrollY > 50;
      if (nextHidden !== headerHidden.value) headerHidden.value = nextHidden;
    }
    lastScrollY.value = currentScrollY;
  });
};

const handleHeaderToggleSidebar = () => {
  if (isMobile.value) {
    return;
  }
  appStore.sidebarOpen = !appStore.sidebarOpen;
};

const handleHeaderToggleRightSidebar = () => {
  if (isMobile.value) {
    headerHidden.value = false;
    appStore.rightSidebarOpen = !appStore.rightSidebarOpen;
    return;
  }
  appStore.rightSidebarOpen = !appStore.rightSidebarOpen;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (activeScrollContainer.value) {
    activeScrollContainer.value.removeEventListener('scroll', handleScroll);
  }
  if (mobileShellScrollRaf.value != null) {
    window.cancelAnimationFrame(mobileShellScrollRaf.value);
  }
  if (contentScrollRaf.value != null) {
    window.cancelAnimationFrame(contentScrollRaf.value);
  }
});

watch(() => props.scrollContainer, (el) => {
  if (activeScrollContainer.value && activeScrollContainer.value !== el) {
    activeScrollContainer.value.removeEventListener('scroll', handleScroll);
  }
  if (el && activeScrollContainer.value !== el) {
    el.addEventListener('scroll', handleScroll, { passive: true });
  }
  activeScrollContainer.value = el;
}, { immediate: true });

watch(isMobile, async (mobile) => {
  if (!mobile) return;
  await nextTick();
  scrollToMobilePage(1, 'auto');
}, { immediate: true });

defineExpose({
  isMobile,
  headerHidden
});
</script>
