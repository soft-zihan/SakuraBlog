import { onMounted, nextTick, type Ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useArticleStore } from '../stores/articleStore';
import { useMusicStore } from '../stores/musicStore';
import { useSearch } from './useSearch';
import { usePoem } from './usePoem';
import { useFilteredFiles } from './useFilteredFiles';
import { fetchFileContent, findNodeByPath } from '../utils/fileUtils';
import { NodeType } from '../types';
import type { FileNode } from '../types';

export function useAppInit(
  lang: Ref<string>,
  loadRandomPoem: () => void,
  openFile: (file: FileNode) => Promise<void>,
  openFolder: (folder: FileNode) => void,
  openCodeByPath: (path: string) => Promise<void>,
  openLabDashboard: (tab?: string) => void
) {
  const appStore = useAppStore();
  const articleStore = useArticleStore();
  const musicStore = useMusicStore();
  const { initSearchIndex, setFetchFunction } = useSearch();
  const { collectAllTags } = useFilteredFiles();

  const initFileSystem = async () => {
    try {
      const res = await fetch(`./files.json?t=${Date.now()}`);
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
          openLabDashboard(tab || undefined);
        }

        // File/Folder Route
        if (targetPath) {
          const decodedTargetPath = decodeURIComponent(targetPath);
          const node = findNodeByPath(appStore.fileSystem, decodedTargetPath) || findNodeByPath(appStore.fileSystem, targetPath);

          if (node) {
            appStore.viewMode = 'files';

            if (node.type === NodeType.FILE) openFile(node);
            else openFolder(node);
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

      if (appStore.fileSystem.length > 0) {
        const root = appStore.fileSystem.find((node: FileNode) => node.name === lang.value);
        const currentLangRoot = root ? root.children : [];
        await initSearchIndex(appStore.fileSystem, lang.value);
        collectAllTags(currentLangRoot || [], articleStore.setAvailableTags);
      }
    }
  };

  onMounted(async () => {
    loadRandomPoem();
    musicStore.loadPlaylist();
    setFetchFunction(fetchFileContent);
    await initFileSystem();
  });
}
