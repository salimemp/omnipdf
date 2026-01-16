"use client";

import { useState, useEffect, useCallback } from "react";

interface UseOfflineOptions {
  onOnline?: () => void;
  onOffline?: () => void;
}

interface UseOfflineReturn {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineAt: Date | null;
  isOfflineFirst: boolean;
  syncData: () => Promise<void>;
  queueForSync: (data: any) => void;
}

export function useOffline({
  onOnline,
  onOffline,
}: UseOfflineOptions = {}): UseOfflineReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isOfflineFirst, setIsOfflineFirst] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    setIsOfflineFirst(!navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setLastOnlineAt(new Date());
      onOnline?.();
    };

    const handleOffline = () => {
      setIsOnline(false);
      onOffline?.();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onOnline, onOffline]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedQueue = localStorage.getItem("offlineQueue");
    if (savedQueue) {
      try {
        setOfflineQueue(JSON.parse(savedQueue));
      } catch {
        setOfflineQueue([]);
      }
    }
  }, []);

  const syncData = useCallback(async () => {
    if (!isOnline || offlineQueue.length === 0) return;

    const queue = [...offlineQueue];
    setOfflineQueue([]);
    localStorage.removeItem("offlineQueue");

    for (const item of queue) {
      try {
        await fetch(item.url, {
          method: item.method || "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data),
        });
      } catch (error) {
        console.error("Sync failed for item:", item);
        setOfflineQueue((prev) => [...prev, item]);
      }
    }
  }, [isOnline, offlineQueue]);

  const queueForSync = useCallback(
    (data: any) => {
      const newQueue = [...offlineQueue, data];
      setOfflineQueue(newQueue);
      localStorage.setItem("offlineQueue", JSON.stringify(newQueue));

      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register("sync-conversions").catch(console.error);
        });
      }
    },
    [offlineQueue],
  );

  return {
    isOnline,
    wasOffline,
    lastOnlineAt,
    isOfflineFirst,
    syncData,
    queueForSync,
  };
}

export function useOfflineFileStorage() {
  const [storedFiles, setStoredFiles] = useState<File[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedFiles = localStorage.getItem("offlineFiles");
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        setStoredFiles(
          files.map(
            (f: any) => new File([new Blob()], f.name, { type: f.type }),
          ),
        );
      } catch {
        setStoredFiles([]);
      }
    }
  }, []);

  const saveFile = useCallback(
    (file: File) => {
      const newFiles = [...storedFiles, file];
      setStoredFiles(newFiles);
      localStorage.setItem(
        "offlineFiles",
        JSON.stringify(
          newFiles.map((f) => ({
            name: f.name,
            type: f.type,
            lastModified: f.lastModified,
          })),
        ),
      );

      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then((estimate) => {
          setStorageUsed(estimate.usage || 0);
        });
      }
    },
    [storedFiles],
  );

  const removeFile = useCallback(
    (fileName: string) => {
      const newFiles = storedFiles.filter((f) => f.name !== fileName);
      setStoredFiles(newFiles);
      localStorage.setItem(
        "offlineFiles",
        JSON.stringify(
          newFiles.map((f) => ({
            name: f.name,
            type: f.type,
            lastModified: f.lastModified,
          })),
        ),
      );
    },
    [storedFiles],
  );

  const clearAll = useCallback(() => {
    setStoredFiles([]);
    localStorage.removeItem("offlineFiles");
    setStorageUsed(0);
  }, []);

  return {
    files: storedFiles,
    storageUsed,
    saveFile,
    removeFile,
    clearAll,
  };
}

export function useBackgroundSync(tag: string = "default-sync") {
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("SyncManager" in window)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.sync.register(tag).catch(console.error);
    });
  }, [tag]);

  return { pendingSync };
}
