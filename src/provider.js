import EventAdapter from './adapter';

const STORE = {
  destinations: `DESTINATIONS`,
  offers: `OFFERS`,
  events: `EVENTS`
};

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.forEach((it) => this._store.setItem(STORE.destinations, it.name, it));
          return destinations;
        });
    } else {
      const destinationsMap = this._store.getItems(STORE.destinations);
      const destinations = Object.values(destinationsMap);

      return Promise.resolve(destinations);
    }
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.forEach((it) => this._store.setItem(STORE.offers, it.type, it));
          return offers;
        });
    } else {
      const offersMap = this._store.getItems(STORE.offers);
      const offers = Object.values(offersMap);

      return Promise.resolve(offers);
    }
  }

  getEvents() {
    if (this._isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          events.forEach((it) => this._store.setItem(STORE.events, it.id, it.toRAW()));
          return events;
        });
    } else {
      const rawEvents = this._store.getItems(STORE.events);
      const events = EventAdapter.parseEvents(Object.values(rawEvents));

      return Promise.resolve(events);
    }
  }

  createEvent(eventData) {
    if (this._isOnline()) {
      return this._api.createEvent(eventData)
        .then((event) => {
          this._store.setItem(STORE.events, event.id, event.toRAW());
          return event;
        });
    } else {
      eventData.id = this._generateId();
      this._store.setItem(STORE.events, eventData.id, eventData);
      return Promise.resolve(eventData);
    }
  }

  updateEvent(id, eventData) {
    if (this._isOnline()) {
      return this._api.updateEvent(id, eventData)
        .then((event) => {
          this._store.setItem(STORE.events, event.id, event.toRAW());
          return event;
        });
    } else {
      this._store.setItem(STORE.events, eventData.id, eventData);
      return Promise.resolve(eventData);
    }
  }

  deleteEvent(id) {
    if (this._isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => {
          this._store.removeItem(STORE.events, id);
        });
    } else {
      this._store.removeItem(STORE.events, id);
      return Promise.resolve(true);
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  syncEvents() {
    const events = this._store.getItems(STORE.events);
    return this._api.syncEvents(Object.values(events));
  }

  _generateId() {
    return Date.now() - Math.floor(Math.random() * Date.now());
  }
}

export default Provider;
