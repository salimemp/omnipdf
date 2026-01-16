const CACHE_NAME = "omnipdf-v1";
const STATIC_CACHE = "omnipdf-static-v1";
const DYNAMIC_CACHE = "omnipdf-dynamic-v1";

const STATIC_ASSETS = [
  "/",
  "/convert",
  "/dashboard",
  "/pricing",
  "/manifest.json",
  "/robots.txt",
];

const CACHE_STRATEGIES = {
  STATIC: "cache-first",
  API: "network-first",
  DYNAMIC: "stale-while-revalidate",
};

async function installEvent(event) {
  console.log("[SW] Installing service worker...");

  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(STATIC_ASSETS);

  event.waitUntil(self.skipWaiting());
}

async function activateEvent(event) {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name)),
      );
    }),
  );

  event.waitUntil(self.clients.claim());
}

async function fetchEvent(event) {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  if (
    url.pathname.startsWith("/static/") ||
    url.pathname.includes("_next/static")
  ) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidateStrategy(event.request));
}

async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(JSON.stringify({ error: "Offline", fallback: true }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

async function handlePush(event) {
  console.log("[SW] Push received:", event);

  let data = {
    title: "OmniPDF",
    body: "New notification",
    icon: "/icons/192x192.png",
    data: {},
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: "/icons/72x72.png",
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      { action: "open", title: "Open" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
}

async function handleNotificationClick(event) {
  console.log("[SW] Notification clicked:", event.action);

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/dashboard") && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
}

async function handleSync(event) {
  console.log("[SW] Background sync:", event.tag);

  if (event.tag === "sync-conversions") {
    event.waitUntil(syncConversions());
  }
}

async function syncConversions() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();

  const conversionRequests = requests.filter((request) =>
    request.url.includes("/api/convert"),
  );

  for (const request of conversionRequests) {
    try {
      const cachedResponse = await cache.match(request);
      const body = await cachedResponse.json();

      if (body.pending) {
        const networkResponse = await fetch(request.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (networkResponse.ok) {
          await cache.delete(request);
        }
      }
    } catch (error) {
      console.error("[SW] Sync failed for request:", request.url);
    }
  }
}

async function handleMessage(event) {
  console.log("[SW] Message received:", event.data);

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data.type === "CACHE_URLS") {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(event.data.urls);
  }
}

self.addEventListener("install", installEvent);
self.addEventListener("activate", activateEvent);
self.addEventListener("fetch", fetchEvent);
self.addEventListener("push", handlePush);
self.addEventListener("notificationclick", handleNotificationClick);
self.addEventListener("sync", handleSync);
self.addEventListener("message", handleMessage);
