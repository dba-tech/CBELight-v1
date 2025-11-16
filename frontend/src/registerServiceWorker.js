// frontend/src/registerServiceWorker.js
export function registerServiceWorker(onUpdate) {
  if ('serviceWorker' in navigator) {
    // Wait for page load so all assets are ready
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';

      navigator.serviceWorker.register(swUrl).then((registration) => {
        console.log('[SW] Registered:', registration);

        // Listen for updates found (new worker installing)
        registration.onupdatefound = () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.onstatechange = () => {
            // When the new worker is installed...
            if (installing.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available (there's a previous controller)
                console.log('[SW] New content available; Please Refresh');
                if (typeof onUpdate === 'function') onUpdate(registration);
              } else {
                // First install
                console.log('[SW] Content cached for offline use.');
              }
            }
          };
        };
      }).catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
    });
  } else {
    console.log('[SW] Service workers are not supported in this browser.');
  }
}
