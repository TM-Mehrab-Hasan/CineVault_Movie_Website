const CACHE_NAME = 'cinemavault-v2'; // Updated version to clear old cache
const urlsToCache = [
  '/css/style.css',
  '/js/main.js',
  '/js/script.js',
  '/js/videos.js',
  '/js/content-manager.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Monoton&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // For HTML files, use network-first strategy to ensure fresh content
        if (event.request.url.includes('.html') || event.request.url.endsWith('/')) {
          return fetch(event.request)
            .then(fetchResponse => {
              // Update cache with fresh content
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
              return fetchResponse;
            })
            .catch(() => {
              // If network fails, return cached version
              return response;
            });
        }
        
        // For static assets, use cache-first strategy
        if (response) {
          return response;
        }
        
        // If not in cache, fetch from network and cache it
        return fetch(event.request).then(fetchResponse => {
          // Don't cache if it's not a successful response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return fetchResponse;
        });
      }
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old cache versions
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Handle cache refresh messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'REFRESH_CACHE') {
    // Clear specific cache entries
    caches.open(CACHE_NAME).then(cache => {
      cache.delete('/');
      cache.delete('/index.html');
    });
  }
});
