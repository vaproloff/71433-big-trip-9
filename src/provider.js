import EventAdapter from './adapter';

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  getEvents() {
    if (this._isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          events.map((it) => this._store.setItem(it.id, EventAdapter.toRAW(it)));
          return events;
        });
    } else {
      const rawEventsMap = this._store.getAll();
      const rawEvents = Object.keys(rawEventsMap).map((it) => rawEventsMap[it]);
      const events = EventAdapter.parseEvents(rawEvents);

      return Promise.resolve(events);
    }
  }

  createEvent(data) {
    if (this._isOnline()) {
      return this._api.createEvent(data)
        .then((event) => {
          this._store.setItem(event.id, EventAdapter.toRAW(event));
          return event;
        });
    } else {
      data.id = this._generateId();
      this._store.setItem(data.id, data);
      return Promise.resolve(data);
    }
  }

  updateEvent(id, data) {
    if (this._isOnline()) {
      return this._api.updateEvent(id, data)
        .then((event) => {
          this._store.setItem(event.id, EventAdapter.toRAW(event));
          return event;
        });
    } else {
      this._store.setItem(data.id, data);
      return Promise.resolve(data);
    }
  }

  deleteEvent(id) {
    if (this._isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => {
          this._store.removeItem(id);
        });
    } else {
      this._store.removeItem(id);
      return Promise.resolve(true);
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  syncEvents() {
    const events = this._store.getAll();
    return this._api.syncEvents(Object.keys(events).map((it) => events[it]));
  }

  _generateId() {
    return Math.random();
  }
}

export default Provider;
