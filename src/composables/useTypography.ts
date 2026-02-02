import { watch } from 'vue'
import { useAppStore } from '../stores/appStore'

type ReaderDensity = 'compact' | 'normal' | 'loose'

const DENSITY_PRESETS: Record<ReaderDensity, Record<string, string>> = {
  compact: {
    '--reader-line-height': '1.48',
    '--reader-paragraph-line-height': '1.55',
    '--reader-paragraph-gap': '0.75em',
    '--reader-h1-font-size': '1.85em',
    '--reader-h2-font-size': '1.28em',
    '--reader-h3-font-size': '1.12em',
    '--reader-h4-font-size': '1.0em',
    '--reader-h5-font-size': '0.93em',
    '--reader-h6-font-size': '0.88em',
    '--reader-code-font-size': '0.86em',
    '--reader-pre-code-font-size': '12.5px',
    '--reader-code-line-height': '1.4',
    '--reader-h1-margin-bottom': '0.75em',
    '--reader-h1-padding-bottom': '0.25em',
    '--reader-h2-margin-top': '1.1em',
    '--reader-h2-margin-bottom': '0.55em',
    '--reader-h3-margin-top': '1.0em',
    '--reader-h3-margin-bottom': '0.45em',
    '--reader-h4-margin-top': '0.95em',
    '--reader-h4-margin-bottom': '0.4em',
    '--reader-h5-margin-top': '0.85em',
    '--reader-h5-margin-bottom': '0.35em',
    '--reader-h6-margin-top': '0.8em',
    '--reader-h6-margin-bottom': '0.3em',
    '--reader-list-margin-bottom': '1.0em',
    '--reader-list-item-gap': '0.45em',
    '--reader-blockquote-padding-y': '0.7rem',
    '--reader-blockquote-padding-x': '1.0rem',
    '--reader-blockquote-margin-y': '1.1em',
    '--reader-pre-padding-top': '3.0em',
    '--reader-pre-padding-x': '1.0em',
    '--reader-pre-padding-bottom': '1.0em',
    '--reader-pre-margin-y': '1.2em',
    '--reader-media-margin-y': '1.2em',
    '--reader-hr-margin-y': '1.6em',
    '--reader-table-margin-y': '1.2em',
    '--reader-table-cell-padding-y': '0.55em',
    '--reader-table-cell-padding-x': '0.75em',
    '--reader-page-padding': '0.85rem',
    '--reader-card-padding': '1.2rem',
    '--reader-header-padding': '1.0rem',
    '--reader-header-margin-bottom': '1.2rem',
    '--reader-header-padding-bottom': '0.9rem'
  },
  normal: {
    '--reader-line-height': '1.85',
    '--reader-paragraph-line-height': '1.9',
    '--reader-paragraph-gap': '1.6em',
    '--reader-h1-font-size': '2.2em',
    '--reader-h2-font-size': '1.6em',
    '--reader-h3-font-size': '1.3em',
    '--reader-h4-font-size': '1.1em',
    '--reader-h5-font-size': '1em',
    '--reader-h6-font-size': '0.95em',
    '--reader-code-font-size': '0.9em',
    '--reader-pre-code-font-size': '14px',
    '--reader-code-line-height': '1.5',
    '--reader-h1-margin-bottom': '1em',
    '--reader-h1-padding-bottom': '0.3em',
    '--reader-h2-margin-top': '1.5em',
    '--reader-h2-margin-bottom': '0.8em',
    '--reader-h3-margin-top': '1.5em',
    '--reader-h3-margin-bottom': '0.6em',
    '--reader-h4-margin-top': '1.4em',
    '--reader-h4-margin-bottom': '0.5em',
    '--reader-h5-margin-top': '1.2em',
    '--reader-h5-margin-bottom': '0.4em',
    '--reader-h6-margin-top': '1em',
    '--reader-h6-margin-bottom': '0.4em',
    '--reader-list-margin-bottom': '1.5em',
    '--reader-list-item-gap': '0.6em',
    '--reader-blockquote-padding-y': '1rem',
    '--reader-blockquote-padding-x': '1.5rem',
    '--reader-blockquote-margin-y': '2em',
    '--reader-pre-padding-top': '3.5em',
    '--reader-pre-padding-x': '1.5em',
    '--reader-pre-padding-bottom': '1.5em',
    '--reader-pre-margin-y': '2em',
    '--reader-media-margin-y': '2em',
    '--reader-hr-margin-y': '2.5em',
    '--reader-table-margin-y': '2em',
    '--reader-table-cell-padding-y': '0.8em',
    '--reader-table-cell-padding-x': '1em',
    '--reader-page-padding': '1.5rem',
    '--reader-card-padding': '2.5rem',
    '--reader-header-padding': '1.5rem',
    '--reader-header-margin-bottom': '2rem',
    '--reader-header-padding-bottom': '1.5rem'
  },
  loose: {
    '--reader-line-height': '2.05',
    '--reader-paragraph-line-height': '2.15',
    '--reader-paragraph-gap': '1.9em',
    '--reader-h1-font-size': '2.35em',
    '--reader-h2-font-size': '1.7em',
    '--reader-h3-font-size': '1.38em',
    '--reader-h4-font-size': '1.16em',
    '--reader-h5-font-size': '1.03em',
    '--reader-h6-font-size': '0.98em',
    '--reader-code-font-size': '0.94em',
    '--reader-pre-code-font-size': '15px',
    '--reader-code-line-height': '1.55',
    '--reader-h1-margin-bottom': '1.1em',
    '--reader-h1-padding-bottom': '0.35em',
    '--reader-h2-margin-top': '1.8em',
    '--reader-h2-margin-bottom': '0.95em',
    '--reader-h3-margin-top': '1.7em',
    '--reader-h3-margin-bottom': '0.75em',
    '--reader-h4-margin-top': '1.6em',
    '--reader-h4-margin-bottom': '0.65em',
    '--reader-h5-margin-top': '1.4em',
    '--reader-h5-margin-bottom': '0.55em',
    '--reader-h6-margin-top': '1.2em',
    '--reader-h6-margin-bottom': '0.5em',
    '--reader-list-margin-bottom': '1.7em',
    '--reader-list-item-gap': '0.75em',
    '--reader-blockquote-padding-y': '1.1rem',
    '--reader-blockquote-padding-x': '1.7rem',
    '--reader-blockquote-margin-y': '2.3em',
    '--reader-pre-padding-top': '3.7em',
    '--reader-pre-padding-x': '1.7em',
    '--reader-pre-padding-bottom': '1.7em',
    '--reader-pre-margin-y': '2.2em',
    '--reader-media-margin-y': '2.2em',
    '--reader-hr-margin-y': '2.8em',
    '--reader-table-margin-y': '2.2em',
    '--reader-table-cell-padding-y': '0.9em',
    '--reader-table-cell-padding-x': '1.2em',
    '--reader-page-padding': '1.75rem',
    '--reader-card-padding': '3rem',
    '--reader-header-padding': '1.75rem',
    '--reader-header-margin-bottom': '2.2rem',
    '--reader-header-padding-bottom': '1.75rem'
  }
}

export function useTypography() {
  const appStore = useAppStore()

  const applyDensity = (density: ReaderDensity) => {
    const root = document.documentElement
    const preset = DENSITY_PRESETS[density] || DENSITY_PRESETS.normal
    Object.entries(preset).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }

  const initTypography = () => {
    watch(
      () => appStore.userSettings.readerDensity,
      (density) => {
        const resolved = (density || 'normal') as ReaderDensity
        applyDensity(resolved in DENSITY_PRESETS ? resolved : 'normal')
      },
      { immediate: true }
    )
  }

  return {
    initTypography
  }
}
