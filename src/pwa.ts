import { registerSW } from 'virtual:pwa-register';

// Register the service worker
const updateSW = registerSW({
  onOfflineReady() {
    console.log('App ready to work offline');
  },
  onNeedRefresh() {
    console.log('New content available, please refresh');
    if (confirm('New content available. Reload the app?')) {
      updateSW(true);
    }
  },
  onRegisteredSW(swScriptUrl, registration) {
    console.log('SW registered at:', swScriptUrl);
    if (registration) {
      console.log('SW registration:', registration);
    }
  },
});

export { updateSW };
