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
    try {
      const res = await fetch(`./data/files.json?t=${Date.now()}`);
      if (res.ok) {
        appStore.fileSystem = await res.json();
        
        // Handle URL parameters
        const params = new URLSearchParams(window.location.search);
        const targetPath = params.get('path');
        const sourcePath = params.get('source');
        const lab = params.get('lab');
        const tab = params.get('tab');

        // Source Code Modal Route
        if (sourcePath) {
          await openCodeByPath(sourcePath);
        }

        // Lab Route
        if (lab === 'dashboard') {
          openLabDashboard(tab || undefined, { syncUrl: false });
        }

        // File/Folder Route
        if (targetPath) {
          const decodedTargetPath = decodeURIComponent(targetPath);
          const node = findNodeByPath(appStore.fileSystem, decodedTargetPath) || findNodeByPath(appStore.fileSystem, targetPath);

          if (node) {
            appStore.viewMode = 'files';

            if (node.type === NodeType.FILE) openFile(node, { syncUrl: false });
            else openFolder(node, { syncUrl: false });
          } else {
            console.warn("Path not found in file system:", targetPath);
          }
        }
      } else {
        console.error("Failed to load files.json, status:", res.status);
      }
    } catch (e) {
      console.error("Failed to load file system", e);
      appStore.fileSystem = [];
    } finally {
      appStore.loading = false;
      await nextTick();
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));

      if (appStore.fileSystem.length > 0) {
        const root = appStore.fileSystem.find((node: FileNode) => node.type === NodeType.DIRECTORY && node.name === lang.value);
        const currentLangRoot = root?.children?.length
          ? root.children
          : appStore.fileSystem.filter((node: FileNode) => !(node.type === NodeType.DIRECTORY && node.path === 'source'));
        runWhenIdle(() => {
          searchApi.initSearchIndex(appStore.fileSystem, lang.value as 'en' | 'zh').catch(() => {});
        });
        runWhenIdle(() => {
          collectAllTags(currentLangRoot || [], articleStore.setAvailableTags);
        });
      }
    }
  };

  onMounted(async () => {
    loadRandomPoem();
    musicStore.loadPlaylist();
    searchApi.setFetchFunction(fetchFileContent);
    await initFileSystem();
  });
}
