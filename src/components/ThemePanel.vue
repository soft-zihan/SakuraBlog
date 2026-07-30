<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/20 backdrop-blur-sm"
      @click.self="closePanel"
    >
      <div
        ref="themePanelRef"
        class="w-[420px] max-w-[90vw] max-h-[70vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-xl p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ lang === 'zh' ? '主题' : 'Theme' }}</div>
          <button @click="closePanel" class="text-gray-400 hover:text-[var(--primary-500)]">✕</button>
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
          <div class="flex gap-2 mt-2">
            <button
              @click="appStore.userSettings.readerDensity = 'compact'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.readerDensity === 'compact' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.readerDensity === 'compact' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '紧凑' : 'Compact' }}</button>
            <button
              @click="appStore.userSettings.readerDensity = 'normal'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.readerDensity === 'normal' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.readerDensity === 'normal' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '标准' : 'Normal' }}</button>
            <button
              @click="appStore.userSettings.readerDensity = 'loose'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.readerDensity === 'loose' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.readerDensity === 'loose' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '宽松' : 'Loose' }}</button>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '主题模式' : 'Mode' }}</div>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              @click="emit('toggle-theme')"
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

          <div class="mt-3 flex gap-2 flex-wrap">
            <button
              @click="appStore.userSettings.themeMode = 'manual'"
              class="flex-1 min-w-[84px] py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.themeMode === 'manual' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.themeMode === 'manual' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '手动' : 'Manual' }}</button>
            <button
              @click="appStore.userSettings.themeMode = 'system'"
              class="flex-1 min-w-[84px] py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.themeMode === 'system' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.themeMode === 'system' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '跟随系统' : 'System' }}</button>
            <button
              @click="appStore.userSettings.themeMode = 'time'"
              class="flex-1 min-w-[84px] py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.themeMode === 'time' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.themeMode === 'time' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '按时间' : 'Time' }}</button>
          </div>

          <div v-if="appStore.userSettings.themeMode === 'time'" class="mt-2 flex items-center gap-2 flex-wrap text-xs text-gray-500 dark:text-gray-400">
            <span>{{ lang === 'zh' ? '亮色' : 'Light' }}</span>
            <input
              v-model="appStore.userSettings.themeTimeLight"
              type="time"
              class="px-2 py-1 text-xs border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:border-[var(--primary-300)]"
            />
            <span>{{ lang === 'zh' ? '暗色' : 'Dark' }}</span>
            <input
              v-model="appStore.userSettings.themeTimeDark"
              type="time"
              class="px-2 py-1 text-xs border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:border-[var(--primary-300)]"
            />
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '音乐播放器' : 'Music Player' }}</div>
          <div class="flex gap-2">
            <button
              @click="appStore.userSettings.musicPlayer = 'new'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.musicPlayer === 'new' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.musicPlayer === 'new' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '悬浮' : 'Floating' }}</button>
            <button
              @click="appStore.userSettings.musicPlayer = 'old'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.musicPlayer === 'old' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.musicPlayer === 'old' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '迷你' : 'Mini' }}</button>
            <button
              @click="appStore.userSettings.musicPlayer = 'off'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.musicPlayer === 'off' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.musicPlayer === 'off' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '关闭' : 'Off' }}</button>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '文章样式' : 'Article Style' }}</div>
          <div class="flex gap-2">
            <button
              @click="appStore.userSettings.articleStyle = 'classic'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'classic' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'classic' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '经典' : 'Classic' }}</button>
            <button
              @click="appStore.userSettings.articleStyle = 'lined'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'lined' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'lined' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '下划线' : 'Lined' }}</button>
            <button
              @click="appStore.userSettings.articleStyle = 'grid'"
              class="flex-1 py-2 border rounded-xl text-xs transition-colors"
              :class="appStore.userSettings.articleStyle === 'grid' ? '' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
              :style="appStore.userSettings.articleStyle === 'grid' ? primaryButtonStyle : undefined"
            >{{ lang === 'zh' ? '方格' : 'Grid' }}</button>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '文章背景不透明度' : 'Article BG Opacity' }}</div>
          <div class="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <span class="text-xs text-gray-500">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              v-model.number="appStore.userSettings.articleBgOpacity"
              class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary-500)]"
            />
            <span class="text-xs text-gray-500">100%</span>
            <span class="text-xs font-mono font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] min-w-[3rem] text-right">
              {{ appStore.userSettings.articleBgOpacity }}%
            </span>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '目录不透明度' : 'TOC Opacity' }}</div>
          <div class="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <span class="text-xs text-gray-500">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              v-model.number="appStore.userSettings.tocOpacity"
              class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary-500)]"
            />
            <span class="text-xs text-gray-500">100%</span>
            <span class="text-xs font-mono font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] min-w-[3rem] text-right">
              {{ appStore.userSettings.tocOpacity }}%
            </span>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '快捷键' : 'Shortcuts' }}</div>
          <div class="space-y-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between gap-4">
              <span class="font-mono text-[10px] text-gray-500 dark:text-gray-400">Ctrl/Cmd + K</span>
              <span>{{ lang === 'zh' ? '打开搜索' : 'Open search' }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="font-mono text-[10px] text-gray-500 dark:text-gray-400">Esc</span>
              <span>{{ lang === 'zh' ? '打开/收起侧边栏（若有弹窗则优先关闭）' : 'Toggle sidebar (closes modals first)' }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="font-mono text-[10px] text-gray-500 dark:text-gray-400">← / →</span>
              <span>{{ lang === 'zh' ? '上一篇 / 下一篇文章' : 'Previous / next article' }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="font-mono text-[10px] text-gray-500 dark:text-gray-400">↑ / ↓</span>
              <span>{{ lang === 'zh' ? '上一篇 / 下一篇相邻标题' : 'Previous / next heading' }}</span>
            </div>
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

        <div class="mb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ lang === 'zh' ? '壁纸设置' : 'Wallpaper Settings' }}</div>
            <button
              @click="wallpaperSettingsOpen = !wallpaperSettingsOpen"
              class="text-xs text-gray-400 hover:text-[var(--primary-500)]"
            >{{ wallpaperSettingsOpen ? (lang === 'zh' ? '收起' : 'Collapse') : (lang === 'zh' ? '展开' : 'Expand') }}</button>
          </div>
          <div v-show="wallpaperSettingsOpen">
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
                <option value="wallhaven">Wallhaven</option>
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
              @click="appStore.updateSettings('bannerMode', 'hide')"
              class="relative group rounded-xl overflow-hidden border transition-all h-16"
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
            <input v-model="customWallpaperUrl" type="text" :placeholder="lang === 'zh' ? '壁纸链接' : 'Wallpaper URL'" class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="addWallpaperFromUrl" class="px-3 py-2 text-xs rounded-xl border border-[var(--primary-400)] text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/20 shrink-0">+</button>
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

          <div class="mt-4 space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {{ lang === 'zh' ? '每日自动更新' : 'Auto Update' }}
              </span>
              <select v-model="appStore.wallpaperApiSettings.bingCountry" @change="refreshBing" :disabled="apiLoading.bing" class="ml-auto px-2 py-1 text-xs border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
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
              <select v-model.number="appStore.wallpaperApiSettings.bingCount" @change="refreshBing" :disabled="apiLoading.bing" class="px-2 py-1 text-xs border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <option :value="4">4</option>
                <option :value="8">8</option>
                <option :value="12">12</option>
              </select>
              <button @click="refreshBing" :disabled="apiLoading.bing" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                {{ apiLoading.bing ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无壁纸' : 'No wallpapers' }}</div>

            <div class="flex gap-2 mb-2">
              <input v-model="appStore.wallpaperApiSettings.baiduKeyword" type="text" :placeholder="lang === 'zh' ? '关键词（可为空）' : 'Keyword (optional)'" class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
              <button @click="searchBaidu" :disabled="apiLoading.baidu" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                {{ apiLoading.baidu ? (lang === 'zh' ? '搜索中' : 'Searching') : (lang === 'zh' ? '搜索' : 'Search') }}
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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else-if="appStore.wallpaperApiSettings.baiduKeyword !== undefined" class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {{ lang === 'zh' ? '美女壁纸' : 'Beauty Wallpapers' }}
              </div>
              <button @click="refreshBeauty" :disabled="apiLoading.beauty" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                {{ apiLoading.beauty ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {{ lang === 'zh' ? '动漫壁纸' : 'Anime Wallpapers' }}
              </div>
              <button @click="refreshAnime" :disabled="apiLoading.anime" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                {{ apiLoading.anime ? (lang === 'zh' ? '加载中' : 'Loading') : (lang === 'zh' ? '刷新' : 'Refresh') }}
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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

            <div class="border-t border-gray-100 dark:border-gray-800 pt-4">
              <div class="flex items-center justify-between gap-2">
                <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">Wallhaven</div>
                <div class="mt-1 text-[10px] text-gray-400">
                  {{ lang === 'zh' ? '大陆地区请勿启用NSFW.' : 'API key enables NSFW.' }}
                </div>
                <button
                  @click="wallhavenOpen = !wallhavenOpen"
                  class="text-xs text-gray-400 hover:text-[var(--primary-500)]"
                >{{ wallhavenOpen ? (lang === 'zh' ? '收起' : 'Collapse') : (lang === 'zh' ? '展开' : 'Expand') }}</button>
              </div>
              <div v-show="wallhavenOpen" class="mt-3">
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="text-[10px] text-gray-400">
                  {{ !hasWallhavenApiKey ? (lang === 'zh' ? '未填 API Key：仅 SFW' : 'No API key: SFW only') : 'API Key ✓' }}
                </div>
                <div class="flex items-center gap-2">
                  <button @click="searchWallhaven" :disabled="apiLoading.wallhavenSearch" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ lang === 'zh' ? '搜索' : 'Search' }}
                  </button>
                </div>
              </div>

              <div class="flex gap-2 mb-2 flex-wrap">
                <input
                  v-model="appStore.wallpaperApiSettings.wallhaven.apiKey"
                  :type="showWallhavenApiKey ? 'text' : 'password'"
                  :placeholder="lang === 'zh' ? 'API Key（可选，用于 NSFW/设置/收藏夹）' : 'API Key (optional, for NSFW/settings/collections)'"
                  class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                />
                <button @click="showWallhavenApiKey = !showWallhavenApiKey" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] shrink-0 whitespace-nowrap">
                  {{ showWallhavenApiKey ? (lang === 'zh' ? '隐藏' : 'Hide') : (lang === 'zh' ? '显示' : 'Show') }}
                </button>
                <button @click="clearWallhavenApiKey" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 shrink-0 whitespace-nowrap">
                  {{ lang === 'zh' ? '清空' : 'Clear' }}
                </button>
              </div>

              <div class="flex gap-2 mb-2">
                <input v-model="appStore.wallpaperApiSettings.wallhaven.q" type="text" :placeholder="lang === 'zh' ? 'q：tag / -tag / +tag / @user / like:ID / type:png ...' : 'q: tag/-tag/+tag/@user/like:ID/type:png...'" class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
                <button @click="clearWallhavenSeed" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] shrink-0 whitespace-nowrap">
                  {{ lang === 'zh' ? '清Seed' : 'Clear seed' }}
                </button>
              </div>

              <div class="flex items-center justify-between gap-2 mb-2 text-xs">
                <span class="text-gray-500">{{ lang === 'zh' ? '分类' : 'Categories' }}</span>
                <div class="flex gap-1">
                  <button @click="toggleWallhavenBit('categories', 0)" class="px-2 py-1 text-[10px] rounded border transition-colors" :class="wallhavenBits.categories[0] ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    {{ lang === 'zh' ? '综合' : 'General' }}
                  </button>
                  <button @click="toggleWallhavenBit('categories', 1)" class="px-2 py-1 text-[10px] rounded border transition-colors" :class="wallhavenBits.categories[1] ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    Anime
                  </button>
                  <button @click="toggleWallhavenBit('categories', 2)" class="px-2 py-1 text-[10px] rounded border transition-colors" :class="wallhavenBits.categories[2] ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    {{ lang === 'zh' ? '人物' : 'People' }}
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 mb-2 text-xs">
                <span class="text-gray-500">Purity</span>
                <div class="flex gap-1">
                  <button @click="toggleWallhavenBit('purity', 0)" class="px-2 py-1 text-[10px] rounded border transition-colors" :class="wallhavenBits.purity[0] ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    SFW
                  </button>
                  <button @click="toggleWallhavenBit('purity', 1)" :disabled="!hasWallhavenApiKey" class="px-2 py-1 text-[10px] rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :class="wallhavenBits.purity[1] ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    Sketchy
                  </button>
                  <button @click="toggleWallhavenBit('purity', 2)" :disabled="!hasWallhavenApiKey" class="px-2 py-1 text-[10px] rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :class="wallhavenBits.purity[2] ? 'bg-white dark:bg-gray-700 border-[var(--primary-300)] text-[var(--primary-500)]' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    NSFW
                  </button>
                </div>
              </div>

              <div class="flex gap-2 mb-2">
                <select v-model="appStore.wallpaperApiSettings.wallhaven.sorting" class="flex-1 px-2 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none focus:border-[var(--primary-300)]">
                  <option value="date_added">date_added</option>
                  <option value="relevance">relevance</option>
                  <option value="random">random</option>
                  <option value="views">views</option>
                  <option value="favorites">favorites</option>
                  <option value="toplist">toplist</option>
                </select>
                <select v-model="appStore.wallpaperApiSettings.wallhaven.order" class="w-24 px-2 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none focus:border-[var(--primary-300)]">
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </select>
                <select v-if="appStore.wallpaperApiSettings.wallhaven.sorting === 'toplist'" v-model="appStore.wallpaperApiSettings.wallhaven.topRange" class="w-20 px-2 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none focus:border-[var(--primary-300)]">
                  <option value="1d">1d</option>
                  <option value="3d">3d</option>
                  <option value="1w">1w</option>
                  <option value="1M">1M</option>
                  <option value="3M">3M</option>
                  <option value="6M">6M</option>
                  <option value="1y">1y</option>
                </select>
              </div>

              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="text-xs text-gray-500">{{ lang === 'zh' ? '高级参数' : 'Advanced' }}</div>
                <button
                  @click="wallhavenAdvancedOpen = !wallhavenAdvancedOpen"
                  class="text-xs text-gray-400 hover:text-[var(--primary-500)]"
                >{{ wallhavenAdvancedOpen ? (lang === 'zh' ? '收起' : 'Hide') : (lang === 'zh' ? '展开' : 'Show') }}</button>
              </div>

              <div v-show="wallhavenAdvancedOpen">
              <div class="flex gap-2 mb-2 flex-wrap">
                <input v-model="appStore.wallpaperApiSettings.wallhaven.atleast" type="text" :placeholder="lang === 'zh' ? 'atleast: 1920x1080' : 'atleast: 1920x1080'" class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
                <input v-model="appStore.wallpaperApiSettings.wallhaven.resolutions" type="text" :placeholder="lang === 'zh' ? 'resolutions: 1920x1080,2560x1440' : 'resolutions: 1920x1080,2560x1440'" class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
              </div>
              <div class="flex gap-2 mb-2 flex-wrap">
                <input v-model="appStore.wallpaperApiSettings.wallhaven.ratios" type="text" :placeholder="lang === 'zh' ? 'ratios: 16x9,16x10' : 'ratios: 16x9,16x10'" class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
                <input v-model.number="appStore.wallpaperApiSettings.wallhaven.page" type="number" min="1" class="w-20 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:border-[var(--primary-300)] shrink-0" />
                <input v-model="appStore.wallpaperApiSettings.wallhaven.seed" type="text" placeholder="seed" class="w-28 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:border-[var(--primary-300)] shrink-0" />
              </div>

              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="text-xs text-gray-500">{{ lang === 'zh' ? '颜色' : 'Colors' }}</div>
                <button @click="clearWallhavenColors" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500">
                  {{ lang === 'zh' ? '清空' : 'Clear' }}
                </button>
              </div>
              <div class="flex flex-wrap gap-1 mb-3">
                <button
                  v-for="c in wallhavenColorList"
                  :key="c"
                  @click="toggleWallhavenColor(c)"
                  class="w-6 h-6 rounded border"
                  :class="wallhavenSelectedColors.includes(c) ? 'ring-2' : 'border-gray-200 dark:border-gray-700'"
                  :style="[{ backgroundColor: '#' + c }, wallhavenSelectedColors.includes(c) ? primaryRingStyle : null]"
                ></button>
              </div>
              </div>

              <div class="flex items-center justify-between gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {{ wallhavenMeta?.current_page || 0 }}/{{ wallhavenMeta?.last_page || 0 }} · {{ wallhavenMeta?.total || 0 }}
                </span>
                <div class="flex gap-2">
                  <button @click="wallhavenPrevPage" :disabled="apiLoading.wallhavenSearch || !wallhavenMeta || wallhavenMeta.current_page <= 1" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ lang === 'zh' ? '上一页' : 'Prev' }}
                  </button>
                  <button @click="wallhavenNextPage" :disabled="apiLoading.wallhavenSearch || !wallhavenMeta || wallhavenMeta.current_page >= wallhavenMeta.last_page" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ lang === 'zh' ? '下一页' : 'Next' }}
                  </button>
                </div>
              </div>

              <div v-if="wallhavenWallpapers.length" class="grid grid-cols-3 gap-2">
                <div v-for="wp in wallhavenWallpapers" :key="wp.id || wp.filename" class="relative group rounded-xl overflow-hidden border transition-all h-16">
                  <img :src="wp.path" :alt="wp.name" class="w-full h-full object-cover" />
                  <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
                  <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                  <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
                </div>
              </div>
              <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

              <div class="mt-3 flex items-center justify-between gap-2">
                <div class="text-xs text-gray-500">{{ lang === 'zh' ? '工具与收藏夹' : 'Tools & Collections' }}</div>
                <button
                  @click="wallhavenToolsOpen = !wallhavenToolsOpen"
                  class="text-xs text-gray-400 hover:text-[var(--primary-500)]"
                >{{ wallhavenToolsOpen ? (lang === 'zh' ? '收起' : 'Hide') : (lang === 'zh' ? '展开' : 'Show') }}</button>
              </div>
              <div v-show="wallhavenToolsOpen">
              <div class="mt-3 grid grid-cols-3 gap-2">
                <input v-model="wallhavenIdInput" type="text" placeholder="w/:id" class="col-span-2 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:border-[var(--primary-300)]" />
                <button @click="testWallhavenWallpaperById" :disabled="apiLoading.wallhavenWallpaper" class="px-2 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ lang === 'zh' ? '查ID' : 'Lookup ID' }}
                </button>
              </div>
              <div v-if="wallhavenIdWallpaper" class="mt-2 grid grid-cols-3 gap-2">
                <div class="relative group rounded-xl overflow-hidden border transition-all h-16">
                  <img :src="wallhavenIdWallpaper.path" :alt="wallhavenIdWallpaper.name" class="w-full h-full object-cover" />
                  <div @click="setWallpaperWithMode(wallhavenIdWallpaper.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
                  <button @click.stop="addToWallpaperList(wallhavenIdWallpaper)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-100 transition-opacity">+</button>
                  <button @click.stop="downloadWallpaperItem(wallhavenIdWallpaper)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-100 transition-opacity">↓</button>
                </div>
                <div class="col-span-2 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-2">
                  <div class="truncate">ID: {{ wallhavenIdWallpaper.id }}</div>
                  <div class="truncate">{{ wallhavenIdInfoText }}</div>
                </div>
              </div>

              <div class="mt-3 flex gap-2">
                <input v-model="wallhavenTagIdInput" type="number" placeholder="tag/:id" class="w-24 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:border-[var(--primary-300)]" />
                <button @click="testWallhavenTag" :disabled="apiLoading.wallhavenTag" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ lang === 'zh' ? '查Tag' : 'Lookup Tag' }}
                </button>
                <div class="flex-1 truncate text-[10px] text-gray-500 dark:text-gray-400 px-2 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                  {{ wallhavenTagText }}
                </div>
              </div>

              <div class="mt-3 flex gap-2">
                <button @click="testWallhavenSettings" :disabled="apiLoading.wallhavenSettings || !hasWallhavenApiKey" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ lang === 'zh' ? '读取Settings' : 'Load Settings' }}
                </button>
                <button @click="applyWallhavenSettingsToFilters" :disabled="!wallhavenUserSettingsData" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ lang === 'zh' ? '应用到筛选' : 'Apply' }}
                </button>
                <div class="flex-1 truncate text-[10px] text-gray-500 dark:text-gray-400 px-2 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                  {{ wallhavenSettingsText }}
                </div>
              </div>

              <div class="mt-3 border-t border-gray-100 dark:border-gray-800 pt-3">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ lang === 'zh' ? '收藏夹' : 'Collections' }}</div>
                  <div class="flex gap-2">
                    <button @click="loadMyWallhavenCollections" :disabled="apiLoading.wallhavenCollections || !hasWallhavenApiKey" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                      {{ lang === 'zh' ? '我的' : 'Mine' }}
                    </button>
                    <button @click="loadPublicWallhavenCollections" :disabled="apiLoading.wallhavenCollections || !appStore.wallpaperApiSettings.wallhaven.collectionsUsername" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                      {{ lang === 'zh' ? '公开' : 'Public' }}
                    </button>
                  </div>
                </div>

                <div class="flex gap-2 mb-2 flex-wrap">
                  <input v-model="appStore.wallpaperApiSettings.wallhaven.collectionsUsername" type="text" :placeholder="lang === 'zh' ? '用户名（用于公开收藏夹/加载收藏夹壁纸）' : 'Username (for public collections / loading)'" class="flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
                  <select v-model.number="appStore.wallpaperApiSettings.wallhaven.selectedCollectionId" class="w-32 px-2 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none focus:border-[var(--primary-300)]">
                    <option :value="null">{{ lang === 'zh' ? '选择' : 'Select' }}</option>
                    <option v-for="c in wallhavenCollectionsList" :key="c.id" :value="c.id">{{ c.label }} ({{ c.count }})</option>
                  </select>
                </div>

                <div class="flex gap-2 mb-2">
                  <select v-model="appStore.wallpaperApiSettings.wallhaven.collectionPurity" :disabled="!hasWallhavenApiKey" class="w-24 px-2 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none focus:border-[var(--primary-300)] disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="100">SFW</option>
                    <option value="110">S+K</option>
                    <option value="111">All</option>
                  </select>
                  <input v-model.number="appStore.wallpaperApiSettings.wallhaven.collectionPage" type="number" min="1" class="w-20 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:border-[var(--primary-300)]" />
                  <button @click="loadWallhavenCollectionWallpapers" :disabled="apiLoading.wallhavenCollection || !appStore.wallpaperApiSettings.wallhaven.selectedCollectionId || !appStore.wallpaperApiSettings.wallhaven.collectionsUsername" class="flex-1 px-2 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ lang === 'zh' ? '加载收藏夹' : 'Load' }}
                  </button>
                </div>

                <div class="flex items-center justify-between gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {{ wallhavenCollectionMeta?.current_page || 0 }}/{{ wallhavenCollectionMeta?.last_page || 0 }} · {{ wallhavenCollectionMeta?.total || 0 }}
                  </span>
                  <div class="flex gap-2">
                    <button @click="wallhavenCollectionPrevPage" :disabled="apiLoading.wallhavenCollection || !wallhavenCollectionMeta || wallhavenCollectionMeta.current_page <= 1" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                      {{ lang === 'zh' ? '上一页' : 'Prev' }}
                    </button>
                    <button @click="wallhavenCollectionNextPage" :disabled="apiLoading.wallhavenCollection || !wallhavenCollectionMeta || wallhavenCollectionMeta.current_page >= wallhavenCollectionMeta.last_page" class="px-2 py-1 text-xs border rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
                      {{ lang === 'zh' ? '下一页' : 'Next' }}
                    </button>
                  </div>
                </div>

                <div v-if="wallhavenCollectionListWallpapers.length" class="grid grid-cols-3 gap-2">
                  <div v-for="wp in wallhavenCollectionListWallpapers" :key="wp.id || wp.filename" class="relative group rounded-xl overflow-hidden border transition-all h-16">
                    <img :src="wp.path" :alt="wp.name" class="w-full h-full object-cover" />
                    <div @click="setWallpaperWithMode(wp.filename)" class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer"></div>
                    <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                    <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
                  </div>
                </div>
                <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>
              </div>
              </div>
              </div>
            </div>
          </div>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { THEME_COLOR_LIST } from '@/constants'
import type { ThemeColorId } from '@/constants'
import { useAppStore } from '@/stores/appStore'
import { useWallpapers, type WallpaperItem } from '@/composables/useWallpapers'

const props = defineProps<{
  open: boolean
  lang: string
  t: any
  isDark: boolean
  petalSpeed: 'off' | 'slow' | 'fast'
}>()

const emit = defineEmits(['update:open', 'toggle-theme', 'update:petal-speed'])

const appStore = useAppStore()
const {
  currentThemeWallpapers,
  presetThemeWallpapers,
  customThemeWallpapers,
  bingWallpapers,
  baiduWallpapers,
  beautyWallpapers,
  animeWallpapers,
  wallhavenWallpapers,
  wallhavenMeta,
  wallhavenCollectionsList,
  wallhavenCollectionListWallpapers,
  wallhavenCollectionMeta,
  apiLoading,
  addCustomWallpaper,
  fetchBingWallpapers,
  fetchBaiduWallpaper,
  fetchBeautyWallpapers,
  fetchAnimeWallpapers,
  fetchWallhavenSearch,
  fetchWallhavenWallpaperById,
  fetchWallhavenTagInfo,
  fetchWallhavenUserSettings,
  fetchWallhavenCollectionsList,
  fetchWallhavenCollectionWallpapersList,
  setWallpaper,
  downloadWallpaper
} = useWallpapers()

const closePanel = () => emit('update:open', false)

const themePanelRef = ref<HTMLElement | null>(null)
const themeColors = THEME_COLOR_LIST

const setThemeColor = (id: ThemeColorId) => {
  appStore.setThemeColor(id)
}

const primaryButtonStyle = computed(() => ({
  borderColor: appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)',
  backgroundColor: appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-50)',
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)'
}))

const primaryRingStyle = computed(() => ({
  borderColor: appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)',
  '--tw-ring-color': appStore.isDark ? 'var(--primary-700)' : 'var(--primary-300)'
}))

const wallpaperSettingsOpen = ref(true)

const customWallpaperUrl = ref('')
const wallpaperFileInput = ref<HTMLInputElement | null>(null)

const addWallpaperFromUrl = () => {
  const url = customWallpaperUrl.value.trim()
  if (!url) return
  addCustomWallpaper({
    name: 'Custom',
    url,
    source: 'url'
  })
  customWallpaperUrl.value = ''
}

const triggerWallpaperUpload = () => {
  wallpaperFileInput.value?.click()
}

const handleWallpaperFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const url = typeof reader.result === 'string' ? reader.result : ''
    if (!url) return
    addCustomWallpaper({
      name: file.name,
      url,
      source: 'local'
    })
    input.value = ''
  }
  reader.readAsDataURL(file)
}

const setWallpaperWithMode = (filename: string) => {
  if (appStore.userSettings.bannerMode === 'hide') {
    appStore.updateSettings('bannerMode', 'normal')
  }
  setWallpaper(filename)
}

const addToWallpaperList = (wp: WallpaperItem | { name?: string; url: string; [key: string]: any }, theme?: 'light' | 'dark') => {
  const raw: any = wp as any
  const filename = typeof raw.filename === 'string' ? raw.filename : ''
  const url = (typeof raw.url === 'string' && raw.url) ? raw.url : (filename.startsWith('http') || filename.startsWith('data:') || filename.startsWith('blob:') ? filename : raw.path)
  addCustomWallpaper({
    name: wp.name || 'Wallpaper',
    url: url || '',
    theme: theme || (appStore.isDark ? 'dark' : 'light'),
    source: 'api'
  })
}

const downloadWallpaperItem = (wp: WallpaperItem) => {
  const raw: any = wp as any
  const filename = typeof raw.filename === 'string' ? raw.filename : ''
  const url = (typeof raw.url === 'string' && raw.url) ? raw.url : (filename.startsWith('http') || filename.startsWith('data:') || filename.startsWith('blob:') ? filename : raw.path)
  if (!url) return
  downloadWallpaper(url)
}

const removeCustomWallpaper = (id: string) => {
  const idx = appStore.customWallpapers.findIndex((w: { id: string }) => w.id === id)
  if (idx !== -1) {
    appStore.customWallpapers.splice(idx, 1)
  }
}

const refreshBing = () => {
  fetchBingWallpapers(appStore.wallpaperApiSettings.bingCountry, appStore.wallpaperApiSettings.bingCount)
}

const searchBaidu = () => {
  const kw = appStore.wallpaperApiSettings.baiduKeyword || undefined
  fetchBaiduWallpaper(kw)
}

const refreshBeauty = () => {
  fetchBeautyWallpapers(6)
}

const refreshAnime = () => {
  fetchAnimeWallpapers(6)
}

const wallhavenOpen = ref(false)
const wallhavenAdvancedOpen = ref(false)
const wallhavenToolsOpen = ref(false)
const showWallhavenApiKey = ref(false)
const wallhavenIdInput = ref('')
const wallhavenIdWallpaper = ref<WallpaperItem | null>(null)
const wallhavenIdInfo = ref<any>(null)
const wallhavenTagIdInput = ref<number | null>(1)
const wallhavenTagText = ref('')
const wallhavenUserSettingsData = ref<any>(null)

const ensureWallhavenSettings = () => {
  const root: any = appStore.wallpaperApiSettings as any
  if (!root.wallhaven) {
    root.wallhaven = {
      apiKey: '',
      q: '',
      categories: '111',
      purity: '100',
      sorting: 'date_added',
      order: 'desc',
      topRange: '1M',
      atleast: '',
      resolutions: '',
      ratios: '',
      colors: '',
      page: 1,
      seed: '',
      collectionsUsername: '',
      selectedCollectionId: null,
      collectionPage: 1,
      collectionPurity: '100'
    }
  }
}

ensureWallhavenSettings()

const hasWallhavenApiKey = computed(() => !!String((appStore.wallpaperApiSettings as any).wallhaven?.apiKey || '').trim())

const wallhavenBits = computed(() => {
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven || {}
  const cats = String(w.categories || '111').padEnd(3, '0').slice(0, 3)
  const pur = String(w.purity || '100').padEnd(3, '0').slice(0, 3)
  return {
    categories: [cats[0] === '1', cats[1] === '1', cats[2] === '1'],
    purity: [pur[0] === '1', pur[1] === '1', pur[2] === '1']
  }
})

const toggleWallhavenBit = (kind: 'categories' | 'purity', idx: number) => {
  ensureWallhavenSettings()
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  const key = kind === 'categories' ? 'categories' : 'purity'
  const str = String(w[key] || (kind === 'categories' ? '111' : '100')).padEnd(3, '0').slice(0, 3)
  const arr = str.split('')
  const next = [...arr]

  if (kind === 'purity' && idx > 0 && !hasWallhavenApiKey.value) {
    w.purity = '100'
    return
  }

  next[idx] = next[idx] === '1' ? '0' : '1'
  if (next.join('') === '000') return

  if (kind === 'purity' && !hasWallhavenApiKey.value) {
    w.purity = '100'
    return
  }

  w[key] = next.join('')
}

const wallhavenColorList = [
  '660000', '990000', 'cc0000', 'cc3333', 'ea4c88', '993399', '663399', '333399',
  '0066cc', '0099cc', '66cccc', '77cc33', '669900', '336600', '666600', '999900',
  'cccc33', 'ffff00', 'ffcc33', 'ff9900', 'ff6600', 'cc6633', '996633', '663300',
  '000000', '999999', 'cccccc', 'ffffff', '424153'
]

const wallhavenSelectedColors = computed(() => {
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven || {}
  return String(w.colors || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)
})

const toggleWallhavenColor = (color: string) => {
  ensureWallhavenSettings()
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  const set = new Set(wallhavenSelectedColors.value)
  if (set.has(color)) set.delete(color)
  else set.add(color)
  w.colors = Array.from(set).join(',')
}

const clearWallhavenColors = () => {
  ensureWallhavenSettings()
  ;(appStore.wallpaperApiSettings as any).wallhaven.colors = ''
}

const clearWallhavenSeed = () => {
  ensureWallhavenSettings()
  ;(appStore.wallpaperApiSettings as any).wallhaven.seed = ''
}

const clearWallhavenApiKey = () => {
  ensureWallhavenSettings()
  ;(appStore.wallpaperApiSettings as any).wallhaven.apiKey = ''
}

const searchWallhaven = async () => {
  ensureWallhavenSettings()
  wallhavenIdWallpaper.value = null
  wallhavenIdInfo.value = null
  wallhavenTagText.value = ''
  try {
    await fetchWallhavenSearch()
  } catch {
  }
}

const wallhavenPrevPage = async () => {
  ensureWallhavenSettings()
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  const next = Math.max(1, Number(w.page || 1) - 1)
  w.page = next
  try {
    await fetchWallhavenSearch()
  } catch {
  }
}

const wallhavenNextPage = async () => {
  ensureWallhavenSettings()
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  const next = Math.max(1, Number(w.page || 1) + 1)
  w.page = next
  try {
    await fetchWallhavenSearch()
  } catch {
  }
}

const wallhavenIdInfoText = computed(() => {
  const info = wallhavenIdInfo.value
  if (!info) return ''
  const parts = [info.resolution, info.file_type, info.purity].filter(Boolean)
  return parts.join(' · ')
})

const testWallhavenWallpaperById = async () => {
  ensureWallhavenSettings()
  const id = wallhavenIdInput.value.trim()
  if (!id) return
  try {
    const res = await fetchWallhavenWallpaperById(id)
    wallhavenIdWallpaper.value = res.wallpaper
    wallhavenIdInfo.value = res.info
  } catch {
  }
}

const testWallhavenTag = async () => {
  const id = wallhavenTagIdInput.value
  if (!id) return
  try {
    const tag = await fetchWallhavenTagInfo(id)
    wallhavenTagText.value = `${tag.id} · ${tag.name} · ${tag.category} · ${tag.purity}`
  } catch {
    wallhavenTagText.value = ''
  }
}

const wallhavenSettingsText = computed(() => {
  const s = wallhavenUserSettingsData.value
  if (!s) return ''
  const cats = Array.isArray(s.categories) ? s.categories.join(',') : ''
  const pur = Array.isArray(s.purity) ? s.purity.join(',') : ''
  const top = s.toplist_range || ''
  return [cats && `cat:${cats}`, pur && `pur:${pur}`, top && `top:${top}`].filter(Boolean).join(' · ')
})

const testWallhavenSettings = async () => {
  try {
    wallhavenUserSettingsData.value = await fetchWallhavenUserSettings()
  } catch {
    wallhavenUserSettingsData.value = null
  }
}

const applyWallhavenSettingsToFilters = () => {
  ensureWallhavenSettings()
  const s = wallhavenUserSettingsData.value
  if (!s) return
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  const cats: string[] = Array.isArray(s.categories) ? s.categories : []
  const purity: string[] = Array.isArray(s.purity) ? s.purity : []
  const cBits = [
    cats.includes('general') ? '1' : '0',
    cats.includes('anime') ? '1' : '0',
    cats.includes('people') ? '1' : '0'
  ].join('')
  const pBits = [
    purity.includes('sfw') ? '1' : '0',
    purity.includes('sketchy') ? '1' : '0',
    purity.includes('nsfw') ? '1' : '0'
  ].join('')
  w.categories = cBits === '000' ? w.categories : cBits
  w.purity = hasWallhavenApiKey.value ? (pBits === '000' ? w.purity : pBits) : '100'
  w.resolutions = Array.isArray(s.resolutions) ? s.resolutions.join(',') : w.resolutions
  w.ratios = Array.isArray(s.aspect_ratios) ? s.aspect_ratios.join(',') : w.ratios
  w.topRange = s.toplist_range || w.topRange
}

const loadMyWallhavenCollections = async () => {
  try {
    await fetchWallhavenCollectionsList()
  } catch {
  }
}

const loadPublicWallhavenCollections = async () => {
  ensureWallhavenSettings()
  const username = String((appStore.wallpaperApiSettings as any).wallhaven.collectionsUsername || '').trim()
  if (!username) return
  try {
    await fetchWallhavenCollectionsList({ username } as any)
  } catch {
  }
}

const loadWallhavenCollectionWallpapers = async () => {
  ensureWallhavenSettings()
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  const username = String(w.collectionsUsername || '').trim()
  const id = w.selectedCollectionId
  if (!username || !id) return
  try {
    await fetchWallhavenCollectionWallpapersList({ username, id, page: w.collectionPage, purity: w.collectionPurity } as any)
  } catch {
  }
}

const wallhavenCollectionPrevPage = async () => {
  ensureWallhavenSettings()
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  w.collectionPage = Math.max(1, Number(w.collectionPage || 1) - 1)
  await loadWallhavenCollectionWallpapers()
}

const wallhavenCollectionNextPage = async () => {
  ensureWallhavenSettings()
  const w: any = (appStore.wallpaperApiSettings as any).wallhaven
  w.collectionPage = Math.max(1, Number(w.collectionPage || 1) + 1)
  await loadWallhavenCollectionWallpapers()
}

const getPetalSpeedLabel = (speed: 'off' | 'slow' | 'fast') => {
  if (props.lang === 'zh') {
    return speed === 'slow' ? '秒速五厘米' : speed === 'fast' ? '秒速十厘米' : '风停了~'
  }
  return speed === 'slow' ? '5cm/s' : speed === 'fast' ? '10cm/s' : 'Off'
}

const handlePetalToggle = () => {
  const speeds: Array<'off' | 'slow' | 'fast'> = ['off', 'slow', 'fast']
  const currentIndex = speeds.indexOf(props.petalSpeed)
  const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
  emit('update:petal-speed', nextSpeed)
  appStore.showToast(getPetalSpeedLabel(nextSpeed))
}

onMounted(() => {
  refreshBing()
  searchBaidu()
})
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
