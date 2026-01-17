<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-fade-in border border-white/50 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6">{{ t.settings_title }}</h3>
      
      <!-- Theme Toggle -->
      <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.theme }}</label>
          <div class="flex gap-2">
            <button @click="toggleTheme(false)" class="flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors" :class="!isDark ? 'border-sakura-500 bg-sakura-50 text-sakura-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🌞</span> {{ t.theme_light }}
            </button>
            <button @click="toggleTheme(true)" class="flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors" :class="isDark ? 'border-purple-500 bg-gray-700 text-purple-300' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🌙</span> {{ t.theme_dark }}
            </button>
          </div>
      </div>

      <!-- Banner Mode (NEW) -->
      <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.banner_settings || 'Banner Mode' }}</label>
          <div class="grid grid-cols-2 gap-2">
            <button @click="settings.bannerMode = 'normal'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'normal' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🖼️</span> {{ t.banner_normal || 'Normal' }}
            </button>
            <button @click="settings.bannerMode = 'fullscreen'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'fullscreen' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🖥️</span> {{ t.banner_fullscreen || 'Full' }}
            </button>
            <button @click="settings.bannerMode = 'background'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'background' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🎨</span> {{ t.banner_background || 'BG' }}
            </button>
            <button @click="settings.bannerMode = 'hide'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'hide' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🚫</span> {{ t.banner_hide || 'Hide' }}
            </button>
          </div>
      </div>

      <!-- Sakura Speed -->
      <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.sakura_speed }}</label>
          <div class="flex flex-col gap-2">
            <button @click="settings.petalSpeed = 'slow'" class="flex-1 py-3 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.petalSpeed === 'slow' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🌸</span> {{ t.speed_5cm }}
            </button>
            <button @click="settings.petalSpeed = 'fast'" class="flex-1 py-3 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.petalSpeed === 'fast' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>💨</span> {{ t.speed_10cm }}
            </button>
          </div>
      </div>

      <!-- Font Family -->
      <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.font_style }}</label>
          <div class="flex gap-2">
            <button @click="settings.fontFamily = 'sans'" class="flex-1 py-3 border rounded-xl transition-colors" :class="settings.fontFamily === 'sans' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">Sans</button>
            <button @click="settings.fontFamily = 'serif'" class="flex-1 py-3 border rounded-xl font-serif transition-colors" :class="settings.fontFamily === 'serif' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">Serif</button>
          </div>
      </div>

      <!-- Font Size -->
      <div class="mb-8">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.font_size }}</label>
          <div class="flex gap-2">
            <button @click="settings.fontSize = 'small'" class="flex-1 py-3 border rounded-xl text-xs transition-colors" :class="settings.fontSize === 'small' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A</button>
            <button @click="settings.fontSize = 'normal'" class="flex-1 py-3 border rounded-xl text-base transition-colors" :class="settings.fontSize === 'normal' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A+</button>
            <button @click="settings.fontSize = 'large'" class="flex-1 py-3 border rounded-xl text-xl transition-colors" :class="settings.fontSize === 'large' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A++</button>
          </div>
      </div>
      <button @click="$emit('close')" class="w-full py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold shadow-lg transition-colors">{{ t.done }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  t: any;
  isDark: boolean;
  settings: {
    fontSize: string;
    fontFamily: string;
    petalSpeed: string;
    bannerMode?: string;
  };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'toggle-theme', val: boolean): void;
}>();

const toggleTheme = (val: boolean) => {
  emit('toggle-theme', val);
};
</script>