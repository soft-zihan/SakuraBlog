
// Giscus Configuration (get values from https://giscus.app)
export const GISCUS_CONFIG = {
  repo: import.meta.env.VITE_GISCUS_REPO || 'soft-zihan/SakuraBlog',
  repoId: import.meta.env.VITE_GISCUS_REPO_ID || 'R_kgDOQ1b8-A',
  category: import.meta.env.VITE_GISCUS_CATEGORY || 'Announcements',
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID || 'DIC_kwDOQ1b8-M4C1Ezk'
}

export const UMAMI_CONFIG = {
  enable: String(import.meta.env.VITE_UMAMI_ENABLE || '') === 'true' || (!!import.meta.env.VITE_UMAMI_SHARE_ID && (!!import.meta.env.VITE_UMAMI_BASE_URL || !!import.meta.env.VITE_UMAMI_SCRIPT_URL)),
  baseUrl: import.meta.env.VITE_UMAMI_BASE_URL || '',
  websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID || '',
  shareId: import.meta.env.VITE_UMAMI_SHARE_ID || '',
  timezone: import.meta.env.VITE_UMAMI_TIMEZONE || 'Asia/Shanghai',
  scriptUrl: import.meta.env.VITE_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js'
}

export const THEME_COLORS = {
  sakura: {
    id: 'sakura',
    preview: '#f43f72',
    palette: {
      50: '#fff0f5',
      100: '#ffe4e9',
      200: '#fecdd7',
      300: '#fda4b8',
      400: '#fc7096',
      500: '#f43f72',
      600: '#e11d59',
      700: '#be1245',
      800: '#9f123f',
      900: '#88133b'
    }
  },
  violet: {
    id: 'violet',
    preview: '#8b5cf6',
    palette: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95'
    }
  },
  cyan: {
    id: 'cyan',
    preview: '#06b6d4',
    palette: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63'
    }
  },
  amber: {
    id: 'amber',
    preview: '#f59e0b',
    palette: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    }
  },
  blue: {
    id: 'blue',
    preview: '#3b82f6',
    palette: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    }
  },
  green: {
    id: 'green',
    preview: '#22c55e',
    palette: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    }
  },
  red: {
    id: 'red',
    preview: '#ef4444',
    palette: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    }
  }
} as const

export type ThemeColorId = keyof typeof THEME_COLORS
export const THEME_COLOR_LIST = Object.values(THEME_COLORS)

import en from './locales/en'
import zh from './locales/zh'

export const I18N = {
  en,
  zh
}
