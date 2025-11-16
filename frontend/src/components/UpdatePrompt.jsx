import React, { useEffect, useState } from 'react';

export default function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setUpdateAvailable(true);
      setRegistration(e.detail.registration);
    };
    window.addEventListener('sw.updated', handler);
    return () => window.removeEventListener('sw.updated', handler);
  }, []);

  function reload() {
    if (!registration?.waiting) return window.location.reload();
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    registration.waiting.addEventListener('statechange', (e) => {
      if (e.target.state === 'activated') window.location.reload();
    });
  }

  if (!updateAvailable) return null;
  return (
    <div className="update-prompt">
      <div>New version available.</div>
      <button onClick={reload}>Refresh</button>
    </div>
  );
}
