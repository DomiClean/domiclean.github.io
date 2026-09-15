// Désinstalle le service worker de l'espace client enregistré par erreur à la racine du site ; à supprimer dans quelques semaines.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.registration.unregister()));
