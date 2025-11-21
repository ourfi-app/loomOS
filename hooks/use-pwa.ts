
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isPWAInstalled,
  isPWASupported,
  registerServiceWorker,
  isOnline,
  requestPersistentStorage,
  getStorageEstimate,
  BeforeInstallPromptEvent,
} from '@/lib/pwa-utils';

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOnlineState, setIsOnlineState] = useState(true);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsInstalled(isPWAInstalled());
    setIsSupported(isPWASupported());
    setIsOnlineState(isOnline());

    // Register service worker
    registerServiceWorker().then((registration) => {
      setSwRegistration(registration);
    });

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Listen for online/offline
    const handleOnline = () => setIsOnlineState(true);
    const handleOffline = () => setIsOnlineState(false);

    // Listen for service worker update
    const handleSWUpdate = () => {
      setHasUpdate(true);
      setIsDismissed(false); // Reset dismissal when new update arrives
    };

    // Listen for dismiss action
    const handleDismissUpdate = () => {
      setIsDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('swUpdated', handleSWUpdate);
    window.addEventListener('dismissUpdate', handleDismissUpdate);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('swUpdated', handleSWUpdate);
      window.removeEventListener('dismissUpdate', handleDismissUpdate);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Install prompt error:', error);
      return false;
    }
  }, [deferredPrompt]);

  const updateServiceWorker = useCallback(async () => {
    if (swRegistration) {
      await swRegistration.update();
      window.location.reload();
    }
  }, [swRegistration]);

  const requestStorage = useCallback(async () => {
    return await requestPersistentStorage();
  }, []);

  const getStorage = useCallback(async () => {
    return await getStorageEstimate();
  }, []);

  return {
    isInstalled,
    isSupported,
    canInstall: !isInstalled && !!deferredPrompt,
    isOnline: isOnlineState,
    hasUpdate,
    isDismissed,
    swRegistration,
    promptInstall,
    updateServiceWorker,
    requestStorage,
    getStorage,
  };
}
