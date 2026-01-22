import { useAppStore } from '../stores/appStore';
import { useRouting } from './useRouting';
import { fetchFileContent } from '../utils/fileUtils';
import type { FileNode } from '../types';
import { useSelectionMenu } from './useSelectionMenu';

export function useFileOperations() {
  const appStore = useAppStore();
  const { updateUrl } = useRouting();
  const { hideSelectionMenu } = useSelectionMenu();

  const isPdfFile = (file: FileNode) => file.path.toLowerCase().endsWith('.pdf');

  const openFile = async (file: FileNode) => {
    appStore.currentFile = file;
    appStore.currentFolder = null;
    appStore.currentTool = null;
    appStore.isRawMode = !!file.isSource;
    
    updateUrl(file.path);
    
    const container = document.getElementById('scroll-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });

    hideSelectionMenu();

    if (!file.content && !isPdfFile(file)) {
      appStore.contentLoading = true;
      try {
          const content = await fetchFileContent(file);
          // Update content in file object and store
          const updatedFile = { ...file, content };
          appStore.currentFile = updatedFile;
          
          // Try to update original node if possible to cache content
          // This relies on file being a reference, but if it came from props it might not propagate back to fileSystem array
          // For now, we just update the current view.
      } finally {
          appStore.contentLoading = false;
      }
    }
  };

  const openFolder = (folder: FileNode) => {
    appStore.currentFile = null;
    appStore.currentFolder = folder;
    appStore.currentTool = null;
    updateUrl(folder.path);
    
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
