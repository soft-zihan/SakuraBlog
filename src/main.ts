import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState, type StorageLike } from 'pinia-plugin-persistedstate';
import App from './App.vue';
import './styles/app.css';
import { UMAMI_CONFIG } from './constants';
import { createSafeStorageLike } from './utils/storage';

const initUmamiTracker = () => {
  if (!UMAMI_CONFIG.enable) return
  if (!UMAMI_CONFIG.websiteId) return

  const src = UMAMI_CONFIG.scriptUrl || (UMAMI_CONFIG.baseUrl ? `${UMAMI_CONFIG.baseUrl}/script.js` : '')
  if (!src) return

  const existing = document.querySelector(`script[data-website-id="${UMAMI_CONFIG.websiteId}"]`)
  if (existing) return

  const script = document.createElement('script')
  script.defer = true
  script.src = src
  script.setAttribute('data-website-id', UMAMI_CONFIG.websiteId)
  script.setAttribute('data-auto-track', 'false')
  document.head.appendChild(script)
}

try {
  initUmamiTracker()
  const app = createApp(App);
  
  // Setup Pinia with persistence
  const pinia = createPinia();
  const safeStorage: StorageLike = createSafeStorageLike()
  pinia.use(createPersistedState({ storage: safeStorage }));
  app.use(pinia);
  
  app.mount('#app');
} catch (error) {
  console.error("Failed to mount Vue app:", error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error loading application. Please check console.</div>`;
}
