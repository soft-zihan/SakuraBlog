import { onMounted, nextTick, type Ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useArticleStore } from '../stores/articleStore';
import { useMusicStore } from '../stores/musicStore';
import { usePoem } from './usePoem';
import { useFilteredFiles } from './useFilteredFiles';
import { fetchFileContent, findNodeByPath } from '../utils/fileUtils';
import { NodeType } from '../types';
import type { FileNode } from '../types';

export function useAppInit(
  lang: Ref<string>,
  loadRandomPoem: () => void,
  openFile: (file: FileNode, options?: { syncUrl?: boolean }) => Promise<void>,
  openFolder: (folder: FileNode, options?: { syncUrl?: boolean }) => void,
  openCodeByPath: (path: string) => Promise<void>,
  openLabDashboard: (tab?: string, options?: { syncUrl?: boolean }) => void,
  searchApi: {
    initSearchIndex: (fs: FileNode[], lang: 'en' | 'zh') => Promise<void>
    setFetchFunction: (fn: (file: FileNode) => Promise<string>) => void
  }
) {
  const appStore = useAppStore();
  const articleStore = useArticleStore();
  const musicStore = useMusicStore();
  const { collectAllTags } = useFilteredFiles();

  const runWhenIdle = (fn: () => void) => {
    const w = window as any
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(() => fn(), { timeout: 1500 })
      return
    }
    window.setTimeout(fn, 0)
  }

  const initFileSystem = async () => {
    const cacheKey = 'sakura:filesJson:v1'
    const applyFileSystem = async (nextFs: FileNode[]) => {
      appStore.fileSystem = nextFs

      const params = new URLSearchParams(window.location.search)
      const targetPath = params.get('path')
      const sourcePath = params.get('source')
      const lab = params.get('lab')
      const tab = params.get('tab')

      if (sourcePath) {
        await openCodeByPath(sourcePath)
      }

      if (lab === 'dashboard') {
        openLabDashboard(tab || undefined, { syncUrl: false })
      }

      if (targetPath) {
        const decodedTargetPath = decodeURIComponent(targetPath)
        const node = findNodeByPath(appStore.fileSystem, decodedTargetPath) || findNodeByPath(appStore.fileSystem, targetPath)

        if (node) {
          appStore.viewMode = 'files'

          if (node.type === NodeType.FILE) openFile(node, { syncUrl: false })
          else openFolder(node, { syncUrl: false })
        } else {
          console.warn('Path not found in file system:', targetPath)
        }
      }
    }

    const postInit = async () => {
      appStore.loading = false
      await nextTick()
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))

      if (appStore.fileSystem.length > 0) {
        const root = appStore.fileSystem.find((node: FileNode) => node.type === NodeType.DIRECTORY && node.name === lang.value)
        const currentLangRoot = root?.children?.length
          ? root.children
          : appStore.fileSystem.filter((node: FileNode) => !(node.type === NodeType.DIRECTORY && node.path === 'source'))
        runWhenIdle(() => {
          searchApi.initSearchIndex(appStore.fileSystem, lang.value as 'en' | 'zh').catch(() => {})
        })
        runWhenIdle(() => {
          collectAllTags(currentLangRoot || [], articleStore.setAvailableTags)
        })
      }
    }

    let hasApplied = false
    try {
      const cachedRaw = window.localStorage.getItem(cacheKey)
      if (cachedRaw) {
        try {
          const cachedFs = JSON.parse(cachedRaw)
          if (Array.isArray(cachedFs)) {
            await applyFileSystem(cachedFs)
            hasApplied = true
            await postInit()
          }
        } catch {
          window.localStorage.removeItem(cacheKey)
        }
      }
    } catch {
    }

    try {
      const prefetched = (window as any).__sakuraFilesJsonPrefetch
      const res = prefetched
        ? await Promise.resolve(prefetched).catch(() => fetch(`./data/files.json`))
        : await fetch(`./data/files.json`);
      if (res.ok) {
        const raw = await (typeof res.clone === 'function' ? res.clone().text() : res.text())
        try {
          window.localStorage.setItem(cacheKey, raw)
        } catch {
        }

        if (!hasApplied) {
          const nextFs = JSON.parse(raw)
          await applyFileSystem(nextFs)
          hasApplied = true
          await postInit()
        } else {
          const cachedRaw = (() => {
            try {
              return window.localStorage.getItem(cacheKey)
            } catch {
              return null
            }
          })()
          if (cachedRaw !== raw) {
            const nextFs = JSON.parse(raw)
            await applyFileSystem(nextFs)
            await postInit()
          }
        }
      } else {
        console.error("Failed to load files.json, status:", res.status);
      }
    } catch (e) {
      console.error("Failed to load file system", e);
      if (!hasApplied) {
        appStore.fileSystem = []
        await postInit()
      }
    }
  };

  onMounted(async () => {
    searchApi.setFetchFunction(fetchFileContent);
    await initFileSystem();
    runWhenIdle(() => {
      if (appStore.currentFile || appStore.currentFolder) return
      if (appStore.viewMode !== 'latest') return
      loadRandomPoem()
    })
    runWhenIdle(() => {
      musicStore.loadPlaylist()
    })
  });
}
