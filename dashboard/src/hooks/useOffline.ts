import { useState, useEffect } from 'react';

/**
 * Hook to monitor network connectivity status.
 * Crucial for Offline POS functionality to determine if bills should be synced to server or stored locally.
 */
export const useOffline = () => {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Set initial state
    setIsOffline(!window.navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOffline, isOnline: !isOffline };
};
