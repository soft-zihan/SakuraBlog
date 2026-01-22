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
      appStore.showSearch = false;
      musicStore.showMusicPlayer = false;
      appStore.showWriteEditor = false;
      appStore.sidebarOpen = false;
      appStore.showSettings = false;
      appStore.showDownloadModal = false;
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
}
