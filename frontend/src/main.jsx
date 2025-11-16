import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './api'
import { registerServiceWorker } from './registerServiceWorker';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// register PWA service worker and dispatch a custom event when an update is available
registerServiceWorker((registration) => {
  // dispatch a global event your app can listen to (e.g. show a toast / update banner)
  window.dispatchEvent(new CustomEvent('sw.updated', { detail: { registration } }));
});