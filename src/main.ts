import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import './styles/app.css';

try {
  const app = createApp(App);
  
  // Setup Pinia with persistence
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);
  
  app.mount('#app');
} catch (error) {
  console.error("Failed to mount Vue app:", error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error loading application. Please check console.</div>`;
}