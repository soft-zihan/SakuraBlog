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

          <div class="mt-4 space-y-4">
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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无壁纸' : 'No wallpapers' }}</div>

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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else-if="appStore.wallpaperApiSettings.baiduKeyword !== undefined" class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>

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
                <button @click.stop="addToWallpaperList(wp)" class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                <button @click.stop="downloadWallpaperItem(wp)" class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">↓</button>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400">{{ lang === 'zh' ? '暂无结果' : 'No results' }}</div>
          </div>
        </div>

        <div class="mb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ lang === 'zh' ? '音乐设置' : 'Music Settings' }}</div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicTitle" type="text" :placeholder="lang === 'zh' ? '标题' : 'Title'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <input v-model="customMusicArtist" type="text" :placeholder="lang === 'zh' ? '作者' : 'Artist'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
          </div>
          <div class="flex gap-2 mb-2">
            <input v-model="customMusicUrl" type="text" :placeholder="lang === 'zh' ? '音乐链接或本地上传' : 'Music URL or Upload'" class="flex-1 px-3 py-2 text-xs border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            <button @click="triggerMusicUpload" class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[var(--primary-600)]">{{ lang === 'zh' ? '本地' : 'Local' }}</button>
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
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { THEME_COLOR_LIST } from '@/constants'
import type { ThemeColorId } from '@/constants'
import { useMusicStore } from '@/stores/musicStore'
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

const musicStore = useMusicStore()
const appStore = useAppStore()
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
  const url = 'path' in wp ? wp.path : wp.url
  addCustomWallpaper({
    name: wp.name || 'Wallpaper',
    url: url || '',
    theme: theme || (appStore.isDark ? 'dark' : 'light'),
    source: 'api'
  })
}

const downloadWallpaperItem = (wp: WallpaperItem) => {
  const url = wp.path || (wp as any).url
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

const customMusicTitle = ref('')
const customMusicArtist = ref('')
const customMusicUrl = ref('')
const customMusicCover = ref('')
const musicFileInput = ref<HTMLInputElement | null>(null)
const coverFileInput = ref<HTMLInputElement | null>(null)

const triggerMusicUpload = () => {
  musicFileInput.value?.click()
}

const handleMusicFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const url = typeof reader.result === 'string' ? reader.result : ''
    if (!url) return
    customMusicUrl.value = url
    if (!customMusicTitle.value) customMusicTitle.value = file.name
    input.value = ''
  }
  reader.readAsDataURL(file)
}

const triggerCoverUpload = () => {
  coverFileInput.value?.click()
}

const handleCoverFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const url = typeof reader.result === 'string' ? reader.result : ''
    if (!url) return
    customMusicCover.value = url
    input.value = ''
  }
  reader.readAsDataURL(file)
}

const addCustomMusic = () => {
  const url = customMusicUrl.value.trim()
  if (!url) return
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  musicStore.addCustomTrack({
    id,
    title: customMusicTitle.value || 'Custom',
    artist: customMusicArtist.value || '',
    cover: customMusicCover.value || undefined,
    url
  })
  customMusicTitle.value = ''
  customMusicArtist.value = ''
  customMusicUrl.value = ''
  customMusicCover.value = ''
}

const clearCustomMusic = () => {
  const ids = musicStore.customTracks.map((t: { id: string }) => t.id)
  ids.forEach(id => musicStore.removeCustomTrack(id))
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
