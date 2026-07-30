import { useAppStore } from '../stores/appStore';

export function useToast() {
  const appStore = useAppStore();

  const showToast = (message: string, duration = 3000) => {
    appStore.toastMessage = message;
    setTimeout(() => {
      if (appStore.toastMessage === message) {
        appStore.toastMessage = '';
      }
    }, duration);
  };

  return { showToast };
}
