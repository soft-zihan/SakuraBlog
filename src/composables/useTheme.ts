import { watch } from 'vue';
import { useAppStore } from '../stores/appStore';
import { THEME_COLORS } from '../constants';

export function useTheme() {
  const appStore = useAppStore();

  const toggleTheme = (val: boolean) => {
    appStore.setDark(val);
    if (val) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const updateThemeColor = () => {
    const colorId = appStore.userSettings.themeColor || 'sakura';
    const theme = THEME_COLORS[colorId] || THEME_COLORS.sakura;
    const root = document.documentElement;
    
    // Apply palette colors
    Object.entries(theme.palette).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, String(value));
    });
    
    // Set main primary color for other uses
    root.style.setProperty('--primary-color', theme.preview);

    // Helper for RGBA conversion
    const hexToRgba = (hex: string, alpha: number) => {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Set specific derived colors with opacity
    // Note: These keys (900, 100) must exist in the palette.
    if (theme.palette[900]) {
        root.style.setProperty('--primary-900-30', hexToRgba(theme.palette[900], 0.3));
    }
    if (theme.palette[100]) {
        root.style.setProperty('--primary-100-50', hexToRgba(theme.palette[100], 0.5));
    }
    
    root.setAttribute('data-theme-color', colorId);
  };

  const initTheme = () => {
    watch(() => appStore.userSettings.themeColor, updateThemeColor, { immediate: true });
    
    // Initial Dark Mode check
    if (appStore.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    toggleTheme,
    updateThemeColor,
    initTheme
  };
}
