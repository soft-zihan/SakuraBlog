import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useMusicStore } from '../stores/musicStore';

export function useKeyboardShortcuts() {
  const appStore = useAppStore();
  const musicStore = useMusicStore();

  const handleKeydown = (e: KeyboardEvent) => {
    // Search: Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      appStore.showSearch = true;
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
      const hasOverlay =
        appStore.showSearch ||
        appStore.showSettings ||
        appStore.showDownloadModal ||
        appStore.showWriteEditor ||
        musicStore.showMusicPlayer

      if (hasOverlay) {
        appStore.showSearch = false;
        musicStore.showMusicPlayer = false;
        appStore.showWriteEditor = false;
        appStore.showSettings = false;
        appStore.showDownloadModal = false;
        return
      }

      if (appStore.rightSidebarOpen) {
        appStore.rightSidebarOpen = false
        return
      }

      appStore.toggleSidebar()
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
}
