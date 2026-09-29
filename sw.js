
const CACHE = "marketlens-v6";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())

  );

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys => {

        return Promise.all(

          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))

        );

      })
      .then(() => self.clients.claim())

  );

});


self.addEventListener("fetch", event => {

  const request = event.request;

  /*
   * Only handle normal GET requests.
   * POST requests such as the AI analysis request
   * must go directly to the backend.
   */

  if (request.method !== "GET") {
    return;
  }


  /*
   * Always get the newest index.html from the network.
   * This prevents Safari from running an old version
   * of MarketLens AI.
   */

  const url = new URL(
    request.url
  );


  if (
    url.pathname.endsWith(
      "/index.html"
    ) ||
    url.pathname === "/"
  ) {

    event.respondWith(

      fetch(request)
        .then(response => {

          if (response.ok) {

            const copy =
              response.clone();

            caches.open(CACHE)
              .then(cache => {
                cache.put(
                  request,
                  copy
                );
              });

          }

          return response;

        })
        .catch(() => {

          return caches.match(
            request
          );

        })

    );

    return;

  }


  /*
   * Other application files:
   * network first, then cache.
   */

  event.respondWith(

    fetch(request)
      .then(response => {

        if (response.ok) {

          const copy =
            response.clone();

          caches.open(CACHE)
            .then(cache => {

              cache.put(
                request,
                copy
              );

            });

        }

        return response;

      })
      .catch(() => {

        return caches.match(
          request
        );

      })

  );

});
