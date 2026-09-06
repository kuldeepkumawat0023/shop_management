'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/30 text-on-surface p-3 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 text-xs font-bold">
        <Download className="w-4 h-4 text-primary" />
        <span>Install App</span>
      </div>
      <Button size="sm" onClick={handleInstallClick} className="h-8 px-3 text-xs font-bold rounded-xl gradient-button text-white">
        Install
      </Button>
      <button 
        onClick={() => setIsVisible(false)} 
        className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
        aria-label="Dismiss install prompt"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
