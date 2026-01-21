<template>
  <header 
    class="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/60 dark:border-gray-800/60 shrink-0 z-20 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-900/80"
    :class="[
      isMobile ? 'px-3 py-2' : 'h-16 px-6',
      { 'translate-y-0': !headerHidden || themeOpen, '-translate-y-full': headerHidden && !themeOpen }
    ]"
  >
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="h-full flex items-center justify-between">
      <!-- Breadcrumbs -->
      <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
        <span class="text-sakura-300 dark:text-sakura-500 mr-2 shrink-0 text-lg cursor-pointer hover:scale-110 transition-transform" @click="$emit('reset')">🏠</span>
        <span class="text-sakura-200 dark:text-gray-700 mx-1">/</span>
        <span class="font-bold text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-sakura-900/20 px-2 py-0.5 rounded mr-2">{{ lang }}</span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">{{ t.tab_lab }}</span>
           <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
           <span class="text-gray-500 dark:text-gray-400">{{ t.lab_dashboard }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs" :key="item.path">
          <span v-if="index > 0" class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer transition-colors px-2 py-1 rounded-md"
            :class="index === breadcrumbs.length - 1 ? 'font-bold text-sakura-600 dark:text-sakura-400 bg-sakura-50/50 dark:bg-sakura-900/30' : 'text-gray-500 dark:text-gray-400 hover:text-sakura-500 hover:bg-sakura-50/50 dark:hover:bg-gray-800'"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <!-- Desktop Actions -->
      <div class="flex gap-2 shrink-0 items-center">
        <!-- File Actions (before search) -->
        <template v-if="currentFile">
          <button v-if="!currentFile.isSource && !isPdf" @click="$emit('update:isRawMode', !isRawMode)" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors" :title="isRawMode ? t.view_render : t.view_source">
            <span class="text-lg">{{ isRawMode ? '👁️' : '🖊️' }}</span>
          </button>
          <button @click="$emit('copy-link')" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors" :title="t.copy_link">
            <span class="text-lg">🔗</span>
          </button>
          <button @click="$emit('download')" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-1" :title="t.download">
            <span class="text-sm">DL</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </template>

        <!-- Dual Column Mode Toggle (Lab Mode Only) -->
        <button 
          v-if="viewMode === 'lab'"
          @click="$emit('toggle-dual-column')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm"
          :class="dualColumnMode 
            ? 'bg-sakura-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/30 hover:text-sakura-600'"
          :title="lang === 'zh' ? '双栏阅读' : 'Dual Column'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="18" rx="1"/>
            <rect x="14" y="3" width="7" height="18" rx="1"/>
          </svg>
        </button>

        <!-- Search Button -->
        <button 
          @click="$emit('open-search')" 
          class="p-2 bg-white/70 dark:bg-gray-800/70 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-sakura-50/80 dark:hover:bg-sakura-900/30 hover:text-sakura-600 transition-all text-sm shadow-sm"
          title="Search (⌘K)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>

        <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <!-- Music Button -->
        <button 
          @click="$emit('open-music')" 
          class="p-2 hover:bg-sakura-50/80 dark:hover:bg-sakura-900/30 rounded-lg transition-colors relative"
          :title="t.music_player"
        >
          <span class="text-lg">🎵</span>
          <span v-if="musicStore.isPlaying" class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </button>

        <!-- Write Button -->
        <button 
          @click="$emit('open-write')" 
          class="p-2 hover:bg-sakura-50/80 dark:hover:bg-sakura-900/30 rounded-lg transition-colors"
          :title="t.write_title"
        >
          <span class="text-lg">✏️</span>
        </button>

        <div class="relative">
          <button
            @click.stop="openThemePanel"
            ref="themeButtonRef"
            class="p-2 hover:bg-white/80 dark:hover:bg-gray-700/80 rounded-lg transition-colors"
            :title="lang === 'zh' ? '主题' : 'Theme'"
          >
            <span class="text-lg">🎨</span>
          </button>
        </div>

        <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <button 
          @click="$emit('open-download')" 
          class="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
          :title="lang === 'zh' ? '批量下载' : 'Batch Download'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" x2="12" y1="15" y2="3"/>
          </svg>
        </button>

        <button @click="$emit('open-settings')" class="p-2 text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 hover:rotate-90 transition-all duration-500" :title="t.settings_title">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Layout (Two-row) -->
    <div v-else class="flex flex-col gap-2">
      <!-- Row 1: Breadcrumbs (scrollable) -->
      <div class="flex items-center text-xs overflow-x-auto no-scrollbar whitespace-nowrap py-1">
        <span class="text-sakura-300 dark:text-sakura-500 mr-1 shrink-0 cursor-pointer" @click="$emit('reset')">🏠</span>
        <span class="text-sakura-200 dark:text-gray-700 mx-1">/</span>
        <span class="font-bold text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-sakura-900/20 px-1.5 py-0.5 rounded text-[10px]">{{ lang }}</span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-1 text-sakura-300 dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded text-[10px]">{{ t.tab_lab }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs.slice(-2)" :key="item.path">
          <span class="mx-1 text-sakura-300 dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 truncate max-w-[100px]"
            :class="index === breadcrumbs.slice(-2).length - 1 ? 'font-bold text-sakura-600 dark:text-sakura-400' : ''"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <!-- Row 2: Actions -->
      <div class="flex items-center justify-between gap-1">
        <!-- Left: File Actions -->
        <div class="flex items-center gap-1">
          <template v-if="currentFile">
            <button v-if="!currentFile.isSource && !isPdf" @click="$emit('update:isRawMode', !isRawMode)" class="p-1.5 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors text-sm">
              {{ isRawMode ? '👁️' : '🖊️' }}
            </button>
            <button @click="$emit('copy-link')" class="p-1.5 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors text-sm">🔗</button>
            <div class="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px]">
              <span class="text-xs">📘</span>
              <span class="font-semibold">{{ getArticleViews(currentFile.path) }}</span>
            </div>
          </template>
        </div>

        <!-- Right: Main Actions -->
        <div class="flex items-center gap-1">
          <button @click="$emit('open-search')" class="p-1.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500 text-sm">🔍</button>
          <button @click="$emit('open-music')" class="p-1.5 hover:bg-sakura-50 dark:hover:bg-gray-700 rounded transition-colors text-sm relative">
            🎵
            <span v-if="musicStore.isPlaying" class="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          </button>
          <button @click="$emit('toggle-theme')" class="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors text-sm">{{ isDark ? '🌙' : '🌞' }}</button>
          <button @click="$emit('open-settings')" class="p-1.5 text-gray-400 hover:text-sakura-600 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="themeOpen"
        class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        @click.self="themeOpen = false"
      >
        <div
          ref="themePanelRef"
          class="w-[420px] max-w-[90vw] max-h-[70vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-xl p-4"
        >
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ lang === 'zh' ? '主题' : 'Theme' }}</div>
          <button @click="themeOpen = false" class="text-gray-400 hover:text-sakura-500">✕</button>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '字体' : 'Typography' }}</div>
          <div class="flex gap-2 mb-2">
            <button
              @click="appStore.userSettings.fontFamily = 'sans'"
              class="flex-1 py-2 border rounded-xl text-sm transition-colors"
              :class="appStore.userSettings.fontFamily === 'sans' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.fontFamily === 'sans' ? primaryButtonStyle : undefined"
            >Sans</button>
            <button
              @click="appStore.userSettings.fontFamily = 'serif'"
              class="flex-1 py-2 border rounded-xl text-sm font-serif transition-colors"
              :class="appStore.userSettings.fontFamily === 'serif' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.fontFamily === 'serif' ? primaryButtonStyle : undefined"
            >Serif</button>
          </div>
          <div class="flex gap-2">
            <button
              @click="appStore.userSettings.fontSize = 'small'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.fontSize === 'small' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.fontSize === 'small' ? primaryButtonStyle : undefined"
            >A</button>
            <button
              @click="appStore.userSettings.fontSize = 'normal'"
              class="flex-1 py-2 border rounded-xl text-sm transition-colors"
              :class="appStore.userSettings.fontSize === 'normal' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.fontSize === 'normal' ? primaryButtonStyle : undefined"
            >A+</button>
            <button
              @click="appStore.userSettings.fontSize = 'large'"
              class="flex-1 py-2 border rounded-xl text-lg transition-colors"
              :class="appStore.userSettings.fontSize === 'large' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.fontSize === 'large' ? primaryButtonStyle : undefined"
            >A++</button>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '文章样式' : 'Article Style' }}</div>
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="appStore.userSettings.articleStyle = 'classic'"
              class="py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'classic' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'classic' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '经典' : 'Classic' }}</button>
            <button
              @click="appStore.userSettings.articleStyle = 'clean'"
              class="py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'clean' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'clean' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '简洁' : 'Clean' }}</button>
            <button
              @click="appStore.userSettings.articleStyle = 'compact'"
              class="py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'compact' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'compact' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '紧凑' : 'Compact' }}</button>
            <button
              @click="appStore.userSettings.articleStyle = 'lined'"
              class="py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'lined' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'lined' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '横格' : 'Lined' }}</button>
            <button
              @click="appStore.userSettings.articleStyle = 'grid'"
              class="py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'grid' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'grid' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '方格' : 'Grid' }}</button>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '主题模式' : 'Mode' }}</div>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              @click="$emit('toggle-theme')"
              class="w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-colors"
              :class="isDark ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="isDark ? primaryButtonStyle : undefined"
            >
              {{ isDark ? '🌙' : '🌞' }}
            </button>
            <button
              @click="handlePetalToggle"
              class="w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-colors"
              :class="petalSpeed === 'off' ? 'border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800' : ''"
              :style="petalSpeed === 'off' ? undefined : primaryButtonStyle"
            >
              <span
                class="text-base"
                :class="petalSpeed === 'fast' ? 'animate-spin-fast' : petalSpeed === 'slow' ? 'animate-spin-slow' : ''"
              >
                🌸
              </span>
            </button>
            <button
              v-for="color in themeColors"
              :key="color.id"
              @click="setThemeColor(color.id)"
              class="w-8 h-8 rounded-full border transition-all"
              :class="appStore.userSettings.themeColor === color.id ? 'ring-2' : 'border-gray-200 dark:border-gray-700'"
              :style="[
                { backgroundColor: color.preview },
                appStore.userSettings.themeColor === color.id ? primaryRingStyle : null
              ]"
            ></button>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '樱花层级' : 'Petal Layer' }}</div>
          <div class="flex gap-2">
            <button
              @click="appStore.userSettings.petalLayer = 'back'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.petalLayer === 'back' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.petalLayer === 'back' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '文章后' : 'Behind' }}</button>
            <button
              @click="appStore.userSettings.petalLayer = 'front'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.petalLayer === 'front' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.petalLayer === 'front' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '文章前' : 'Front' }}</button>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '壁纸' : 'Wallpapers' }}</div>
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="appStore.userSettings.bannerMode = 'hide'"
              class="relative rounded-xl overflow-hidden border transition-all h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
              :class="appStore.userSettings.bannerMode === 'hide' ? 'ring-2' : 'border-gray-200 dark:border-gray-700'"
              :style="appStore.userSettings.bannerMode === 'hide' ? primaryRingStyle : undefined"
            >
              <span class="text-2xl text-gray-400">❌</span>
            </button>
            <button
              v-for="wp in currentThemeWallpapers"
              :key="wp.filename"
              @click="setWallpaperWithMode(wp.filename)"
              class="relative rounded-xl overflow-hidden border transition-all"
              :class="wp.filename === appStore.currentWallpaperFilename && appStore.userSettings.bannerMode !== 'hide' ? 'ring-2' : 'border-gray-200 dark:border-gray-700'"
              :style="wp.filename === appStore.currentWallpaperFilename && appStore.userSettings.bannerMode !== 'hide' ? primaryRingStyle : undefined"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-16 object-cover" />
              <div class="absolute inset-0 bg-black/10"></div>
            </button>
          </div>
          <div class="mt-3 flex gap-2">
            <input v-model="customWallpaperUrl" type="text" :placeholder="lang === 'zh' ? '壁纸链接' : 'Wallpaper URL'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <select v-model="customWallpaperTheme" class="px-2 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              <option value="auto">{{ lang === 'zh' ? '自适应' : 'Auto' }}</option>
              <option value="light">{{ lang === 'zh' ? '亮色' : 'Light' }}</option>
              <option value="dark">{{ lang === 'zh' ? '暗色' : 'Dark' }}</option>
            </select>
            <button @click="addWallpaperFromUrl" class="px-3 py-2 text-xs rounded-xl border border-sakura-400 text-sakura-600 dark:text-sakura-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/20">+</button>
          </div>
          <div class="mt-2 flex gap-2">
            <button @click="triggerWallpaperUpload" class="flex-1 py-2 border rounded-xl text-xs transition-colors border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sakura-600">{{ lang === 'zh' ? '本地上传' : 'Local Upload' }}</button>
            <button @click="clearCustomWallpapers" class="flex-1 py-2 border rounded-xl text-xs transition-colors border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500">{{ lang === 'zh' ? '清空自定义' : 'Clear Custom' }}</button>
          </div>
          <input ref="wallpaperFileInput" type="file" accept="image/*" class="hidden" @change="handleWallpaperFile" />
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bing</div>
          <div class="flex items-center gap-2 mb-2">
            <label class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <input type="checkbox" v-model="appStore.wallpaperApiSettings.bingEnabled" @change="handleBingToggle" />
              {{ lang === 'zh' ? '每日自动更换' : 'Daily Auto' }}
            </label>
            <select v-model="appStore.wallpaperApiSettings.bingCountry" @change="refreshBing" :disabled="isApiLoading" class="ml-auto px-2 py-1 text-xs border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="cn">CN</option>
              <option value="jp">JP</option>
              <option value="us">US</option>
              <option value="gb">GB</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="au">AU</option>
              <option value="br">BR</option>
              <option value="ca">CA</option>
              <option value="it">IT</option>
              <option value="es">ES</option>
              <option value="in">IN</option>
            </select>
            <select v-model.number="appStore.wallpaperApiSettings.bingCount" @change="refreshBing" :disabled="isApiLoading" class="px-2 py-1 text-xs border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <option :value="4">4</option>
              <option :value="8">8</option>
              <option :value="12">12</option>
            </select>
            <button @click="refreshBing" :disabled="isApiLoading" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sakura-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
            </button>
          </div>
          <div v-if="bingWallpapers.length" class="grid grid-cols-3 gap-2">
            <button
              v-for="wp in bingWallpapers"
              :key="wp.filename"
              @click="setWallpaperWithMode(wp.filename)"
              class="relative rounded-xl overflow-hidden border transition-all"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-16 object-cover" />
              <div class="absolute inset-0 bg-black/10"></div>
            </button>
          </div>
          <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无壁纸' : 'No wallpapers' }}</div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">UPX8</div>
          <div class="flex gap-2 mb-2">
            <input v-model="appStore.wallpaperApiSettings.upx8Keyword" type="text" :placeholder="lang === 'zh' ? '关键词（可为空）' : 'Keyword (optional)'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="searchUpx8" :disabled="isApiLoading" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sakura-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '搜索中' : 'Searching') : (lang === 'zh' ? '搜索' : 'Search') }}
            </button>
          </div>
          <div v-if="upx8Wallpapers.length" class="grid grid-cols-3 gap-2">
            <button
              v-for="wp in upx8Wallpapers"
              :key="wp.filename"
              @click="setWallpaperWithMode(wp.filename)"
              class="relative rounded-xl overflow-hidden border transition-all"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-16 object-cover" />
              <div class="absolute inset-0 bg-black/10"></div>
            </button>
          </div>
          <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '美女' : 'Beauty' }}</div>
          <div class="flex items-center gap-2 mb-2">
            <button @click="refreshBeauty" :disabled="isApiLoading" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sakura-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
            </button>
          </div>
          <div v-if="beautyWallpapers.length" class="grid grid-cols-3 gap-2">
            <button
              v-for="wp in beautyWallpapers"
              :key="wp.filename"
              @click="setWallpaperWithMode(wp.filename)"
              class="relative rounded-xl overflow-hidden border transition-all"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-16 object-cover" />
              <div class="absolute inset-0 bg-black/10"></div>
            </button>
          </div>
          <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '动漫' : 'Anime' }}</div>
          <div class="flex items-center gap-2 mb-2">
            <button @click="refreshAnime" :disabled="isApiLoading" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sakura-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
            </button>
          </div>
          <div v-if="animeWallpapers.length" class="grid grid-cols-3 gap-2">
            <button
              v-for="wp in animeWallpapers"
              :key="wp.filename"
              @click="setWallpaperWithMode(wp.filename)"
              class="relative rounded-xl overflow-hidden border transition-all"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-16 object-cover" />
              <div class="absolute inset-0 bg-black/10"></div>
            </button>
          </div>
          <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>
        </div>

        <div class="mb-2">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '自定义音乐' : 'Custom Music' }}</div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicTitle" type="text" :placeholder="lang === 'zh' ? '歌名' : 'Title'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <input v-model="customMusicArtist" type="text" :placeholder="lang === 'zh' ? '歌手' : 'Artist'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
          </div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicUrl" type="text" :placeholder="lang === 'zh' ? '音乐链接' : 'Music URL'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="triggerMusicUpload" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sakura-600">{{ lang === 'zh' ? '本地音频' : 'Local Audio' }}</button>
          </div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicCover" type="text" :placeholder="lang === 'zh' ? '封面链接（可选）' : 'Cover URL (optional)'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="triggerCoverUpload" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sakura-600">{{ lang === 'zh' ? '本地封面' : 'Local Cover' }}</button>
          </div>
          <div class="flex gap-2">
            <button @click="addCustomMusic" class="flex-1 py-2 border rounded-xl text-xs transition-colors border-sakura-400 text-sakura-600 dark:text-sakura-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/20">{{ lang === 'zh' ? '添加音乐' : 'Add Track' }}</button>
            <button @click="clearCustomMusic" class="flex-1 py-2 border rounded-xl text-xs transition-colors border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500">{{ lang === 'zh' ? '清空自定义' : 'Clear Custom' }}</button>
          </div>
          <input ref="musicFileInput" type="file" accept="audio/*" class="hidden" @change="handleMusicFile" />
          <input ref="coverFileInput" type="file" accept="image/*" class="hidden" @change="handleCoverFile" />
          <div v-if="musicStore.customTracks.length" class="mt-3 space-y-2">
            <div v-for="track in musicStore.customTracks" :key="track.id" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1">
              <span class="truncate flex-1">{{ track.title || track.url }}</span>
              <button @click="musicStore.removeCustomTrack(track.id)" class="text-red-400 hover:text-red-500">✕</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { THEME_COLOR_LIST } from '../constants';
import type { ThemeColorId } from '../constants';
import type { BreadcrumbItem, FileNode } from '../types';
import { useMusicStore } from '../stores/musicStore';
import { useAppStore } from '../stores/appStore';
import { useWallpapers } from '../composables/useWallpapers';

const musicStore = useMusicStore();
const appStore = useAppStore();
const {
  currentThemeWallpapers,
  bingWallpapers,
  upx8Wallpapers,
  beautyWallpapers,
  animeWallpapers,
  isApiLoading,
  addCustomWallpaper,
  fetchBingWallpapers,
  fetchUpx8Wallpaper,
  fetchBeautyWallpapers,
  fetchAnimeWallpapers,
  updateBingDaily,
  setWallpaper
} = useWallpapers();

const props = defineProps<{
  lang: string;
  t: any;
  breadcrumbs: BreadcrumbItem[];
  viewMode: string;
  currentTool: string | null;
  currentFile: FileNode | null;
  getArticleViews: (path: string) => number;
  showParticles: boolean;
  isRawMode: boolean;
  isDark: boolean;
  petalSpeed: 'off' | 'slow' | 'fast';
  headerHidden?: boolean;
  dualColumnMode?: boolean;
}>();

const emit = defineEmits([
  'reset', 
  'navigate', 
  'update:showParticles', 
  'update:isRawMode',
  'copy-link',
  'download',
  'open-settings',
  'open-search',
  'open-music',
  'open-write',
  'open-download',
  'toggle-theme',
  'update:petal-speed',
  'toggle-dual-column',
  'open-theme-panel'
]);

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const isPdf = computed(() => !!props.currentFile?.path && props.currentFile.path.toLowerCase().endsWith('.pdf'))

const themeOpen = ref(false);
const themeButtonRef = ref<HTMLElement | null>(null);
const themePanelRef = ref<HTMLElement | null>(null);

const themeColors = THEME_COLOR_LIST

const setThemeColor = (id: ThemeColorId) => {
  appStore.setThemeColor(id)
}

const openThemePanel = () => {
  themeOpen.value = !themeOpen.value;
  if (themeOpen.value) emit('open-theme-panel');
};

const primaryButtonStyle = computed(() => ({
  borderColor: appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)',
  backgroundColor: appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-50)',
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)'
}))

const primaryRingStyle = computed(() => ({
  borderColor: appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)',
  '--tw-ring-color': appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)'
}))

const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node | null;
  const btn = themeButtonRef.value;
  const panel = themePanelRef.value;
  if (!btn || !panel) return;
  if (target && (btn.contains(target) || panel.contains(target))) return;
  themeOpen.value = false;
};

const customWallpaperUrl = ref('');
const customWallpaperTheme = ref<'auto' | 'light' | 'dark'>('auto');
const wallpaperFileInput = ref<HTMLInputElement | null>(null);

const addWallpaperFromUrl = () => {
  const url = customWallpaperUrl.value.trim();
  if (!url) return;
  addCustomWallpaper({
    name: 'Custom',
    url,
    theme: customWallpaperTheme.value,
    source: 'url'
  });
  customWallpaperUrl.value = '';
};

const triggerWallpaperUpload = () => {
  wallpaperFileInput.value?.click();
};

const handleWallpaperFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const url = typeof reader.result === 'string' ? reader.result : '';
    if (!url) return;
    addCustomWallpaper({
      name: file.name,
      url,
      theme: customWallpaperTheme.value,
      source: 'local'
    });
    input.value = '';
  };
  reader.readAsDataURL(file);
};

const clearCustomWallpapers = () => {
  appStore.customWallpapers.splice(0, appStore.customWallpapers.length);
};

const setWallpaperWithMode = (filename: string) => {
  if (appStore.userSettings.bannerMode === 'hide') {
    appStore.updateSettings('bannerMode', 'normal');
  }
  setWallpaper(filename);
};

const handleBingToggle = () => {
  updateBingDaily();
};

const refreshBing = () => {
  fetchBingWallpapers(appStore.wallpaperApiSettings.bingCountry, appStore.wallpaperApiSettings.bingCount);
};

const searchUpx8 = () => {
  const kw = appStore.wallpaperApiSettings.upx8Keyword || undefined;
  fetchUpx8Wallpaper(kw);
};

const refreshBeauty = () => {
  fetchBeautyWallpapers(6);
};

const refreshAnime = () => {
  fetchAnimeWallpapers(6);
};

const customMusicTitle = ref('');
const customMusicArtist = ref('');
const customMusicUrl = ref('');
const customMusicCover = ref('');
const musicFileInput = ref<HTMLInputElement | null>(null);
const coverFileInput = ref<HTMLInputElement | null>(null);

const triggerMusicUpload = () => {
  musicFileInput.value?.click();
};

const handleMusicFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const url = typeof reader.result === 'string' ? reader.result : '';
    if (!url) return;
    customMusicUrl.value = url;
    if (!customMusicTitle.value) customMusicTitle.value = file.name;
    input.value = '';
  };
  reader.readAsDataURL(file);
};

const triggerCoverUpload = () => {
  coverFileInput.value?.click();
};

const handleCoverFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const url = typeof reader.result === 'string' ? reader.result : '';
    if (!url) return;
    customMusicCover.value = url;
    input.value = '';
  };
  reader.readAsDataURL(file);
};

const addCustomMusic = () => {
  const url = customMusicUrl.value.trim();
  if (!url) return;
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  musicStore.addCustomTrack({
    id,
    title: customMusicTitle.value || 'Custom',
    artist: customMusicArtist.value || '',
    cover: customMusicCover.value || undefined,
    url
  });
  customMusicTitle.value = '';
  customMusicArtist.value = '';
  customMusicUrl.value = '';
  customMusicCover.value = '';
};

const clearCustomMusic = () => {
  const ids = musicStore.customTracks.map(t => t.id);
  ids.forEach(id => musicStore.removeCustomTrack(id));
};

const getPetalSpeedLabel = (speed: 'off' | 'slow' | 'fast') => {
  if (props.lang === 'zh') {
    return speed === 'slow' ? '秒速五厘米' : speed === 'fast' ? '秒速十厘米' : '风停了~'
  }
  return speed === 'slow' ? '5cm/s' : speed === 'fast' ? '10cm/s' : 'Off'
}

const handlePetalToggle = () => {
  const speeds: Array<'off' | 'slow' | 'fast'> = ['off', 'slow', 'fast'];
  const currentIndex = speeds.indexOf(props.petalSpeed);
  const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
  emit('update:petal-speed', nextSpeed);
  appStore.showToast(getPetalSpeedLabel(nextSpeed));
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  document.addEventListener('click', handleDocumentClick);
  refreshBing();
  searchUpx8();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-spin-fast {
  animation: spin-fast 4s linear infinite;
}
</style>
