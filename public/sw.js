const CACHE_NAME = `BIG_TRIP_V1.0`;

// Настроим кеширование статики во время установки SW.
self.addEventListener(`install`, (evt) => {
  console.log(`sw, install`, {evt});
  // Активация SW не произойдет, пока кеш не будет настроен.
  evt.waitUntil(
    // Открываем наш кеш.
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Добавляем в кеш список статических ресурсов.
        return cache.addAll([
          `./`,
          `./index.html`,
          `./bundle.js`,
          `./css/style.css`,
          `./img/header-bg.png`,
          `./img/header-bg@2x.png`,
          `./img/logo.png`,
          `./img/icons/bus.png`,
          `./img/icons/check-in.png`,
          `./img/icons/drive.png`,
          `./img/icons/flight.png`,
          `./img/icons/restaurant.png`,
          `./img/icons/ship.png`,
          `./img/icons/sightseeing.png`,
          `./img/icons/taxi.png`,
          `./img/icons/train.png`,
          `./img/icons/transport.png`,
          `./img/icons/trip.png`,
        ])
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw`, `activate`, {evt});
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.error({err});
        throw err;
      })
  );
});
