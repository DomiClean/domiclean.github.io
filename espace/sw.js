/* Domi Clean — service worker
   Met en cache la coquille de l'application. Les données (Supabase) passent
   toujours par le réseau : on ne sert jamais une facture périmée depuis le cache. */

const CACHE = "domiclean-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Données et authentification : réseau uniquement.
  if (url.hostname.includes("supabase") || url.pathname.includes("/auth/")) return;

  // Navigation : réseau d'abord, coquille en secours si hors ligne.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(r => { caches.open(CACHE).then(c => c.put("./index.html", r.clone())); return r; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Ressources statiques : cache d'abord, mise à jour en arrière-plan.
  e.respondWith(
    caches.match(req).then(hit => {
      const reseau = fetch(req).then(r => {
        if (r.ok && url.origin === location.origin) caches.open(CACHE).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => hit);
      return hit || reseau;
    })
  );
});
