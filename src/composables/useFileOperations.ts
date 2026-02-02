import type { Ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useRouting } from './useRouting';
import { fetchFileContent, fetchRenderedHtml } from '../utils/fileUtils';
import type { FileNode } from '../types';
import { useSelectionMenu } from './useSelectionMenu';

export function useFileOperations(scrollContainer?: Ref<HTMLElement | null>) {
  const appStore = useAppStore();
  const { updateUrl } = useRouting();
  const { hideSelectionMenu } = useSelectionMenu();

  const isPdfFile = (file: FileNode) => file.path.toLowerCase().endsWith('.pdf');

  const openFile = async (file: FileNode, options?: { syncUrl?: boolean }) => {
    appStore.currentFile = file;
    appStore.currentFolder = null;
    appStore.currentTool = null;
    appStore.isRawMode = !!file.isSource;
    
    // Ensure we are not in lab mode, otherwise MainContent might prioritize lab view
    // if (appStore.viewMode === 'lab') {
    //   appStore.viewMode = 'files';
    // }
    
    if (options?.syncUrl !== false) updateUrl(file.path);
    
    const container = scrollContainer?.value || null;
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });

    hideSelectionMenu();

    const shouldPreferRendered = !file.isSource && !isPdfFile(file) && !!file.renderPath && !appStore.isRawMode
    if (shouldPreferRendered && !file.renderedHtml) {
      appStore.contentLoading = true;
      try {
        const html = await fetchRenderedHtml(file)
        if (html) {
          const ids = (file.toc || []).slice(0, 40).map(i => i.id)
          const ok = ids.length === 0 || ids.every(id => html.includes(`id="${id}"`))
          if (ok) {
            const updatedFile = { ...file, renderedHtml: html };
            appStore.currentFile = updatedFile;
            const pathKey = file.path
            const runWhenIdle = (fn: () => void) => {
              const w = window as any
              if (typeof w.requestIdleCallback === 'function') {
                w.requestIdleCallback(() => fn(), { timeout: 1500 })
                return
              }
              window.setTimeout(fn, 0)
            }
            runWhenIdle(async () => {
              if (appStore.currentFile?.path !== pathKey) return
              if (appStore.currentFile?.content) return
              const content = await fetchFileContent(file)
              if (appStore.currentFile?.path !== pathKey) return
              appStore.currentFile = { ...(appStore.currentFile as any), content: content || '' }
            })
            return
          }
        }
      } finally {
        appStore.contentLoading = false;
      }
    }

    if (!file.content && !isPdfFile(file)) {
      appStore.contentLoading = true;
      try {
          const content = await fetchFileContent(file);
          // Update content in file object and store
          const updatedFile = { ...file, content: content || '' };
          appStore.currentFile = updatedFile;
          
          // Try to update original node if possible to cache content
          // This relies on file being a reference, but if it came from props it might not propagate back to fileSystem array
          // For now, we just update the current view.
      } finally {
          appStore.contentLoading = false;
      }
    }
  };

  const openFolder = (folder: FileNode, options?: { syncUrl?: boolean }) => {
    appStore.currentFile = null;
    appStore.currentFolder = folder;
    appStore.currentTool = null;
    if (options?.syncUrl !== false) updateUrl(folder.path);
    
    if (appStore.viewMode === 'latest') appStore.viewMode = 'files';
    
    hideSelectionMenu();
  };
  
  const handleSidebarFileSelect = async (file: FileNode) => {
    await openFile(file);
  };
  
  return {
    openFile,
    openFolder,
    handleSidebarFileSelect,
    isPdfFile
  };
}
