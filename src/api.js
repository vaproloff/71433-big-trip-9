import EventAdapter from './adapter';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(this._convertToJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(this._convertToJSON);
  }

  getEvents() {
    return this._load({url: `points`})
      .then(this._convertToJSON)
      .then(EventAdapter.parseEvents);
  }

  createEvent(eventData) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(eventData),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(this._convertToJSON)
      .then(EventAdapter.parseEvent);
  }

  updateEvent(eventID, eventData) {
    return this._load({
      url: `points/${eventID}`,
      method: Method.PUT,
      body: JSON.stringify(eventData),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(this._convertToJSON)
      .then(EventAdapter.parseEvent);
  }

  deleteEvent(eventID) {
    return this._load({url: `points/${eventID}`, method: Method.DELETE});
  }

  syncEvents(events) {
    return this._load({
      url: `points/sync`,
      method: `POST`,
      body: JSON.stringify(events),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(this._convertToJSON);
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _convertToJSON(response) {
    return response.json();
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw new Error(err);
      });
  }
}

export default API;
