<template>
  <div class="flex flex-col md:flex-row w-full h-full max-w-[2560px] mx-auto overflow-hidden bg-gradient-to-br from-white/70 via-[var(--primary-50)]/50 to-purple-50/40 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-[var(--primary-900)]/40 backdrop-blur-[3px] border border-white/30 dark:border-gray-800/60 shadow-[0_12px_60px_rgba(15,23,42,0.12)] font-sans transition-colors duration-500 relative" :class="[appStore.userSettings.fontFamily === 'serif' ? 'font-serif' : appStore.userSettings.fontFamily === 'kaiti' ? 'font-kaiti' : 'font-sans', appStore.isDark ? 'dark' : '']">
    
    <!-- Mobile Overlay -->
    <div 
      v-if="appStore.sidebarOpen" 
      @click="appStore.sidebarOpen = false"
      class="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
    />

    <!-- Left Sidebar: Navigation -->
    <AppSidebar 
      v-if="!appStore.readingMode"
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
      @logo-click="showToast(t.welcome_title)"
      @select-tool="$emit('select-tool', $event)"
      @toggle-folder="$emit('toggle-folder', $event)"
      @select-file="$emit('select-file', $event)"
      @select-folder="$emit('select-folder', $event)"
      @open-search="appStore.showSearch = true"
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
        :sidebar-open="appStore.sidebarOpen"
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
        @toggle-sidebar="appStore.sidebarOpen = !appStore.sidebarOpen"
        @toggle-right-sidebar="appStore.rightSidebarOpen = !appStore.rightSidebarOpen"
      />

      <!-- Content Area -->
      <div class="flex-1 flex overflow-hidden z-10 relative">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useMusicStore } from '../stores/musicStore';
import { I18N } from '../constants';
import AppSidebar from '../components/AppSidebar.vue';
import AppHeader from '../components/AppHeader.vue';
import WallpaperLayer from '../components/WallpaperLayer.vue';
import PetalBackground from '../components/PetalBackground.vue';
import { useToast } from '../composables/useToast';

const props = defineProps<{
  filteredFileSystem: any[];
  filteredFlatFiles: any[];
  labFolder: any;
  resourceCategories: any[];
  labTabs: any[];
  labDashboardTab: string;
  commentCounts: Record<string, number>;
  getArticleViews: (path: string) => number;
  currentPath: string;
  breadcrumbs: any[];
  dualColumnMode: boolean;
}>();

const emit = defineEmits([
  'reset', 'select-tool', 'toggle-folder', 'select-file', 'select-folder',
  'update:activeLabTab', 'navigate', 'copy-link', 'download',
  'open-theme-panel', 'update:petal-speed', 'toggle-dual-column'
]);

const appStore = useAppStore();
const musicStore = useMusicStore();
const { showToast } = useToast();

const lang = computed(() => appStore.lang);
const t = computed(() => I18N[lang.value]);

const headerHidden = ref(false);
const lastScrollY = ref(0);
const isMobile = ref(false);
const themePanelOpen = ref(false); // Should be controlled by prop or store if needed globally

// Wallpaper URLs
const wallpaperLightUrl = '/image/wallpaper-light.jpg';
const wallpaperDarkUrl = '/image/wallpaper-dark.jpg';

// Mobile check and scroll handling
const checkMobile = () => {
  const mobile = window.innerWidth < 768;
  if (mobile !== isMobile.value) {
    isMobile.value = mobile;
    appStore.sidebarOpen = !mobile;
    return;
  }
  isMobile.value = mobile;
};

const handleScroll = () => {
  if (!isMobile.value) {
    headerHidden.value = false;
    return;
  }
  // If theme panel is open logic is missing here as state is local in App.vue originally
  
  const scrollContainer = document.getElementById('scroll-container');
  const currentScrollY = scrollContainer?.scrollTop || 0;
  const delta = currentScrollY - lastScrollY.value;

  if (Math.abs(delta) > 5) {
    headerHidden.value = delta > 0 && currentScrollY > 50;
  }

  lastScrollY.value = currentScrollY;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  nextTick(() => {
    const scrollEl = document.getElementById('scroll-container');
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  const scrollEl = document.getElementById('scroll-container');
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', handleScroll);
  }
});

defineExpose({
  isMobile,
  headerHidden
});
</script>
