const SW_VERSION = "onyx-v2";
const APP_SHELL_CACHE = `${SW_VERSION}-app-shell`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;
const MODEL_META_CACHE = `${SW_VERSION}-model-meta`;

const APP_SHELL_ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/icon.svg", "/icon-maskable.svg"];
const MODEL_META_HOSTS = ["huggingface.co", "cdn-lfs.huggingface.co"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE, MODEL_META_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }
  const network = await networkPromise;
  return network || caches.match("/index.html");
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || caches.match("/index.html");
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isModelMetaRequest = MODEL_META_HOSTS.some((host) => requestUrl.hostname.endsWith(host));
  const isNavigation = event.request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(networkFirst(event.request, RUNTIME_CACHE));
    return;
  }

  if (isModelMetaRequest) {
    event.respondWith(staleWhileRevalidate(event.request, MODEL_META_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request, RUNTIME_CACHE));
});
