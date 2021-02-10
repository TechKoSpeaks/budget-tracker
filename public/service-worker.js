

// Constant for all files to cache so they don't have to be written out within function //
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/index.js',
  '/db.js',
];


// Creating constants for cache name and the data for cache name to make comprehension easier
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";



// install event handler
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static').then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  console.log('Install');
  self.skipWaiting();
});



// activate
self.addEventListener('activate', function (evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});




// retrieve assets from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );



  evt.respondWith(
    caches.open(DATA_CACHE_NAME).then(cache => {
      return fetch(evt.request)
        .then(response => {
          if (response.status === 200) {
            cache.put(evt.request.url, response.clone());
          }
          return response;
        })
        .catch(err => {
          return cache.match(evt.request);
        });
    }),
  );

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    }),
  );
});
