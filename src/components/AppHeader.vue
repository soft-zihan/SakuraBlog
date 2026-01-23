<template>
  <header 
    class="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/60 dark:border-gray-800/60 shrink-0 z-20 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:bg-white/80 dark:hover:bg-gray-900/80"
    :class="[
      isMobile ? 'px-3 py-2' : 'h-16 px-6',
      { 'translate-y-0': !headerHidden || themeOpen, '-translate-y-full': headerHidden && !themeOpen }
    ]"
  >
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="h-full flex items-center justify-between">
      <!-- Left Sidebar Toggle (Desktop) -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="mr-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-50)] dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        :title="lang === 'zh' ? '切换侧边栏' : 'Toggle Sidebar'"
      >
        <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m10 15 3-3-3-3"/></svg>
      </button>

      <!-- Breadcrumbs -->
      <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
        <span class="text-[var(--primary-300)] dark:text-[var(--primary-500)] mr-2 shrink-0 cursor-pointer hover:scale-110 transition-transform" @click="$emit('reset')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-2 text-[var(--primary-300)] dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">{{ t.tab_lab }}</span>
           <span class="mx-2 text-[var(--primary-300)] dark:text-gray-600">›</span>
           <span class="text-gray-500 dark:text-gray-400">{{ t.lab_dashboard }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs" :key="item.path">
          <span v-if="Number(index) > 0" class="mx-2 text-[var(--primary-300)] dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer transition-colors px-2 py-1 rounded-md"
            :class="index === breadcrumbs.length - 1 ? 'font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/30' : 'text-gray-500 dark:text-gray-400 hover:text-[var(--primary-500)] hover:bg-[var(--primary-50)]/50 dark:hover:bg-gray-800'"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <ActionDockGroup
        layout="horizontal"
        :lang="lang as 'en' | 'zh'"
        :t="t"
        :current-file="currentFile"
        :is-raw-mode="isRawMode"
        :is-pdf="isPdf"
        :view-mode="viewMode"
        :dual-column-mode="dualColumnMode"
        :is-playing="musicStore.isPlaying"
        @update:isRawMode="$emit('update:isRawMode', $event)"
        @copy-link="$emit('copy-link')"
        @download="$emit('download')"
        @toggle-dual-column="$emit('toggle-dual-column')"
        @open-search="$emit('open-search')"
        @open-music="$emit('open-music')"
        @open-write="$emit('open-write')"
        @toggle-theme-panel="toggleThemePanel"
        @open-download="$emit('open-download')"
        @open-settings="$emit('open-settings')"
      />
    </div>

    <!-- Mobile Layout -->
    <div v-else class="flex items-center h-full px-3 gap-2">
      <!-- Left Sidebar Toggle Button -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 active:scale-95 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
      </button>

      <!-- Breadcrumbs (Scrollable) -->
      <div class="flex-1 flex items-center text-xs overflow-x-auto no-scrollbar whitespace-nowrap mask-linear px-2">
        <span class="text-[var(--primary-300)] dark:text-[var(--primary-500)] mr-1 shrink-0 cursor-pointer" @click="$emit('reset')">🏠</span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-1 text-[var(--primary-300)] dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded text-[10px]">{{ t.tab_lab }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs" :key="item.path">
          <span class="mx-1 text-[var(--primary-300)] dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 truncate max-w-[100px]"
            :class="index === breadcrumbs.length - 1 ? 'font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)]' : ''"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <!-- Right Sidebar Toggle Button -->
      <button 
        @click="$emit('toggle-right-sidebar')" 
        class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 active:scale-95 transition-transform"
      >
        <svg v-if="!rightSidebarOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M4 6h16M4 18h16"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="themeOpen"
        class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        @click.self="setThemePanelOpen(false)"
      >
        <div
          ref="themePanelRef"
          class="w-[420px] max-w-[90vw] max-h-[70vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-xl p-4"
        >
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ lang === 'zh' ? '主题' : 'Theme' }}</div>
          <button @click="setThemePanelOpen(false)" class="text-gray-400 hover:text-[var(--primary-500)]">✕</button>
        </div>

        <!-- 1. Typography -->
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
            <button
              @click="appStore.userSettings.fontFamily = 'kaiti'"
              class="flex-1 py-2 border rounded-xl text-sm transition-colors"
              style="font-family: KaiTi, STKaiti, serif"
              :class="appStore.userSettings.fontFamily === 'kaiti' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.fontFamily === 'kaiti' ? primaryButtonStyle : undefined"
            >楷体</button>
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

        <!-- 2. Theme Color & Mode -->
        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '主题模式' : 'Mode' }}</div>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              @click="$emit('toggle-theme')"
              class="w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-colors"
              :class="isDark ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="isDark ? primaryButtonStyle : undefined"
            >
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
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

        <!-- 3. Music Player -->
        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '音乐播放器' : 'Music Player' }}</div>
          <div class="flex gap-2">
            <button
              @click="appStore.userSettings.musicPlayer = appStore.userSettings.musicPlayer === 'new' ? 'old' : 'new'"
              class="flex-1 py-2 border rounded-xl text-sm transition-colors"
              :class="appStore.userSettings.musicPlayer === 'new' ? 'border-[var(--primary-500)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
            >
              {{ lang === 'zh' ? '切换播放器' : 'Toggle Player' }}
            </button>
          </div>
        </div>

        <!-- 4. Article Style -->
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

        <!-- 5. Petal Layer -->
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

        <!-- 6. Wallpaper Settings -->
        <div class="mb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '壁纸设置' : 'Wallpaper Settings' }}</div>
          
          <div class="flex flex-col gap-2 mb-3 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
             <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ lang === 'zh' ? '填充方式' : 'Fill Mode' }}</span>
                <div class="flex gap-1">
                   <button 
                     @click="appStore.userSettings.wallpaperFill = 'cover'" 
                     class="px-2 py-1 text-[10px] rounded border transition-colors"
                     :class="appStore.userSettings.wallpaperFill === 'cover' ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'"
                 >{{ lang === 'zh' ? '裁剪' : 'Cut' }}</button>
                 <button 
                   @click="appStore.userSettings.wallpaperFill = 'contain'" 
                   class="px-2 py-1 text-[10px] rounded border transition-colors"
                   :class="appStore.userSettings.wallpaperFill === 'contain' ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'"
                 >{{ lang === 'zh' ? '包含' : 'Contain' }}</button>
                 <button 
                   @click="appStore.userSettings.wallpaperFill = 'fill'" 
                   class="px-2 py-1 text-[10px] rounded border transition-colors"
                   :class="appStore.userSettings.wallpaperFill === 'fill' ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'"
                 >{{ lang === 'zh' ? '拉伸' : 'Stretch' }}</button>
              </div>
           </div>
           <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ lang === 'zh' ? '自动更换' : 'Auto Change' }}</span>
              <select v-model="appStore.userSettings.autoChangeMode" class="px-2 py-1 text-[10px] border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:border-[var(--primary-300)]">
                   <option value="off">{{ lang === 'zh' ? '关闭' : 'Off' }}</option>
                   <option value="custom">{{ lang === 'zh' ? '自定义列表' : 'Custom List' }}</option>
                   <option value="preset">{{ lang === 'zh' ? '预置壁纸' : 'Preset' }}</option>
                   <option value="anime">{{ lang === 'zh' ? '动漫' : 'Anime' }}</option>
                   <option value="beauty">{{ lang === 'zh' ? '美女' : 'Beauty' }}</option>
                   <option value="bing">Bing</option>
                   <option value="search">{{ lang === 'zh' ? '搜索结果' : 'Search' }}</option>
                </select>
             </div>
             <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ lang === 'zh' ? '自动更换间隔(秒)' : 'Auto Change Interval (s)' }}</span>
                <input type="number" v-model.number="appStore.userSettings.autoChangeTimer" class="w-16 px-2 py-1 text-[10px] border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:border-[var(--primary-300)]" min="0" placeholder="0=Off" />
             </div>
             <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ lang === 'zh' ? '百度搜索数量限制' : 'Baidu Search Limit' }}</span>
                <input type="number" v-model.number="appStore.wallpaperApiSettings.baiduLimit" class="w-16 px-2 py-1 text-[10px] border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:border-[var(--primary-300)]" min="1" max="20" />
             </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              @click="appStore.userSettings.bannerMode = 'hide'"
              class="relative rounded-xl overflow-hidden border transition-all h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
              :class="appStore.userSettings.bannerMode === 'hide' ? 'ring-2' : 'border-gray-200 dark:border-gray-700'"
              :style="appStore.userSettings.bannerMode === 'hide' ? primaryRingStyle : undefined"
              :title="lang === 'zh' ? '隐藏壁纸' : 'Hide Wallpaper'"
            >
              <span class="text-2xl text-gray-400">❌</span>
            </button>
            <div
              v-for="wp in customThemeWallpapers"
              :key="wp.id || wp.filename"
              class="relative group rounded-xl overflow-hidden border transition-all h-16"
              :class="wp.filename === appStore.currentWallpaperFilename && appStore.userSettings.bannerMode !== 'hide' ? 'ring-2' : 'border-gray-200 dark:border-gray-700'"
              :style="wp.filename === appStore.currentWallpaperFilename && appStore.userSettings.bannerMode !== 'hide' ? primaryRingStyle : undefined"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-full object-cover" />
              <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
              
              <button 
                v-if="wp.id"
                @click.stop="removeCustomWallpaper(wp.id)"
                class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-100 transition-opacity text-xs hover:bg-red-500"
              >✕</button>

              <button 
                @click.stop="downloadWallpaperItem(wp)"
                class="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-[var(--primary-500)]"
              >⬇</button>
            </div>
          </div>
          <div class="mt-3 flex gap-2">
            <input v-model="customWallpaperUrl" type="text" :placeholder="lang === 'zh' ? '壁纸链接' : 'Wallpaper URL'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="addWallpaperFromUrl" class="px-3 py-2 text-xs rounded-xl border border-[var(--primary-400)] text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/20">+</button>
          </div>
          <div class="mt-2 flex gap-2">
            <button @click="triggerWallpaperUpload" class="flex-1 py-2 border rounded-xl text-xs transition-colors border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)]">{{ lang === 'zh' ? '本地上传' : 'Local Upload' }}</button>
            <input ref="wallpaperFileInput" type="file" accept="image/*" class="hidden" @change="handleWallpaperFile" />
          </div>
          
          <div class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '预置壁纸' : 'Preset Wallpapers' }}</div>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="wp in presetThemeWallpapers"
              :key="wp.filename"
              class="relative group rounded-xl overflow-hidden border transition-all h-16"
              :class="wp.filename === appStore.currentWallpaperFilename && appStore.userSettings.bannerMode !== 'hide' ? 'ring-2' : 'border-gray-200 dark:border-gray-700'"
              :style="wp.filename === appStore.currentWallpaperFilename && appStore.userSettings.bannerMode !== 'hide' ? primaryRingStyle : undefined"
            >
              <img :src="wp.path || (wp as any).url" :alt="wp.name" class="w-full h-full object-cover" />
              <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
              
              <button 
                @click.stop="downloadWallpaperItem(wp)"
                class="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-[var(--primary-500)]"
              >⬇</button>
            </div>
          </div>

          <div class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bing</div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {{ lang === 'zh' ? '每日自动更新' : 'Auto Update' }}
            </span>
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
            <button @click="refreshBing" :disabled="isApiLoading" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
            </button>
          </div>
          <div v-if="bingWallpapers.length" class="grid grid-cols-3 gap-2">
            <div
              v-for="wp in bingWallpapers"
              :key="wp.filename"
              class="relative group rounded-xl overflow-hidden border transition-all h-16"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-full object-cover" />
              <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
              <button 
                @click.stop="addToWallpaperList(wp)"
                class="absolute top-1 left-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-[var(--primary-500)]"
              >+</button>
              <button 
                @click.stop="downloadWallpaperItem(wp)"
                class="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-[var(--primary-500)]"
              >⬇</button>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无壁纸' : 'No wallpapers' }}</div>

          <div class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">BAIDU</div>
          <div class="flex gap-2 mb-2">
            <input v-model="appStore.wallpaperApiSettings.baiduKeyword" type="text" :placeholder="lang === 'zh' ? '关键词（可为空）' : 'Keyword (optional)'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="searchBaidu" :disabled="isApiLoading" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '搜索中' : 'Searching') : (lang === 'zh' ? '搜索' : 'Search') }}
            </button>
          </div>
          <div v-if="baiduWallpapers.length" class="grid grid-cols-3 gap-2">
            <div
              v-for="wp in baiduWallpapers"
              :key="wp.filename"
              class="relative group rounded-xl overflow-hidden border transition-all h-16"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-full object-cover" />
              <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
              <button 
                @click.stop="addToWallpaperList(wp)"
                class="absolute top-1 left-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-[var(--primary-500)]"
              >+</button>
              <button 
                @click.stop="downloadWallpaperItem(wp)"
                class="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-[var(--primary-500)]"
              >⬇</button>
            </div>
          </div>
          <div v-else-if="appStore.wallpaperApiSettings.baiduKeyword !== undefined" class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

          <div class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ props.lang === 'zh' ? '美女' : 'Beauty' }}</div>
          <div class="flex items-center gap-2 mb-2">
            <button @click="refreshBeauty" :disabled="isApiLoading" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
            </button>
          </div>
          <div v-if="beautyWallpapers.length" class="grid grid-cols-3 gap-2">
            <div
              v-for="wp in beautyWallpapers"
              :key="wp.filename"
              class="relative group rounded-xl overflow-hidden border transition-all h-16"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-full object-cover" />
              <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
              <button 
                @click.stop="addToWallpaperList(wp)"
                class="absolute top-1 left-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-[var(--primary-500)]"
              >+</button>
              <button 
                @click.stop="downloadWallpaperItem(wp)"
                class="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-[var(--primary-500)]"
              >⬇</button>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

          <div class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '动漫' : 'Anime' }}</div>
          <div class="flex items-center gap-2 mb-2">
            <button @click="refreshAnime" :disabled="isApiLoading" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isApiLoading ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
            </button>
          </div>
          <div v-if="animeWallpapers.length" class="grid grid-cols-3 gap-2">
            <div
              v-for="wp in animeWallpapers"
              :key="wp.filename"
              class="relative group rounded-xl overflow-hidden border transition-all h-16"
            >
              <img :src="wp.path" :alt="wp.name" class="w-full h-full object-cover" />
              <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
              <button 
                @click.stop="addToWallpaperList(wp)"
                class="absolute top-1 left-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-[var(--primary-500)]"
              >+</button>
              <button 
                @click.stop="downloadWallpaperItem(wp)"
                class="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-[var(--primary-500)]"
              >⬇</button>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>
        </div>

        <!-- 6. Custom Music -->
        <div class="mb-2">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '自定义音乐' : 'Custom Music' }}</div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicTitle" type="text" :placeholder="lang === 'zh' ? '歌名' : 'Title'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <input v-model="customMusicArtist" type="text" :placeholder="lang === 'zh' ? '歌手' : 'Artist'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
          </div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicUrl" type="text" :placeholder="lang === 'zh' ? '音乐链接' : 'Music URL'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="triggerMusicUpload" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)]">{{ lang === 'zh' ? '本地音频' : 'Local Audio' }}</button>
          </div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicCover" type="text" :placeholder="lang === 'zh' ? '封面链接（可选）' : 'Cover URL (optional)'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="triggerCoverUpload" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)]">{{ lang === 'zh' ? '本地封面' : 'Local Cover' }}</button>
          </div>
          <div class="flex gap-2">
            <button @click="addCustomMusic" class="flex-1 py-2 border rounded-xl text-xs transition-colors border-[var(--primary-400)] text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/20">{{ lang === 'zh' ? '添加音乐' : 'Add Track' }}</button>
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
import { storeToRefs } from 'pinia';
import { THEME_COLOR_LIST } from '@/constants';
import type { ThemeColorId } from '@/constants';
import type { BreadcrumbItem, FileNode } from '@/types';
import { useMusicStore } from '@/stores/musicStore';
import { useAppStore } from '@/stores/appStore';
import { useWallpapers, type WallpaperItem } from '@/composables/useWallpapers';
import ActionDockGroup from './ActionDockGroup.vue';

const musicStore = useMusicStore();
const appStore = useAppStore();
const { sidebarOpen, rightSidebarOpen } = storeToRefs(appStore);
const {
  currentThemeWallpapers,
  presetThemeWallpapers,
  customThemeWallpapers,
  bingWallpapers,
  baiduWallpapers,
  beautyWallpapers,
  animeWallpapers,
  isApiLoading,
  addCustomWallpaper,
  fetchBingWallpapers,
  fetchBaiduWallpaper,
  fetchBeautyWallpapers,
  fetchAnimeWallpapers,
  updateBingDaily,
  setWallpaper,
  autoChangeWallpaper,
  downloadWallpaper
} = useWallpapers();

const addToWallpaperList = (wp: WallpaperItem | { name?: string; url: string; [key: string]: any }, theme?: 'light' | 'dark') => {
    const url = 'path' in wp ? wp.path : wp.url;
    addCustomWallpaper({
      name: wp.name || 'Wallpaper',
      url: url || '',
      theme: theme || (appStore.isDark ? 'dark' : 'light'),
      source: 'api'
    });
    // showToast(t.value.added_to_list);
  };

const downloadWallpaperItem = (wp: WallpaperItem) => {
  const url = wp.path || (wp as any).url;
  if (!url) return;
  downloadWallpaper(url);
};

const removeCustomWallpaper = (id: string) => {
  const idx = appStore.customWallpapers.findIndex((w: { id: string }) => w.id === id);
  if (idx !== -1) {
    appStore.customWallpapers.splice(idx, 1);
  }
};

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
  'open-theme-panel',
  'toggle-sidebar',
  'toggle-right-sidebar'
]);

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const isPdf = computed(() => !!props.currentFile?.path && props.currentFile.path.toLowerCase().endsWith('.pdf'))

const themeOpen = ref(false);
const themePanelRef = ref<HTMLElement | null>(null);

const themeColors = THEME_COLOR_LIST

const setThemeColor = (id: ThemeColorId) => {
  appStore.setThemeColor(id)
}

const setThemePanelOpen = (open: boolean) => {
  themeOpen.value = open;
  emit('open-theme-panel', open);
};

const toggleThemePanel = () => {
  setThemePanelOpen(!themeOpen.value);
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
  const target = e.target as HTMLElement | null;
  const panel = themePanelRef.value;
  const toggleButton = target?.closest('[data-theme-panel-toggle="true"]');

  if (showCollectionDropdown.value && collectionDropdownRef.value && target && !collectionDropdownRef.value.contains(target)) {
    showCollectionDropdown.value = false;
  }

  if (!themeOpen.value || !panel || !target) return;
  if (panel.contains(target) || toggleButton) return;
  setThemePanelOpen(false);
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

const searchBaidu = () => {
  const kw = appStore.wallpaperApiSettings.baiduKeyword || undefined;
  fetchBaiduWallpaper(kw);
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
  const ids = musicStore.customTracks.map((t: { id: string }) => t.id);
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

defineExpose({
  toggleThemePanel,
  setThemePanelOpen
});

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  document.addEventListener('click', handleDocumentClick);
  refreshBing();
  searchBaidu();
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
