import {convertToHttpsUrl} from './utils';

class EventAdapter {
  constructor(data) {
    this.id = data[`id`];
    this.timeStart = data[`date_from`];
    this.duration = data[`date_to`] - data[`date_from`];
    this.type = data[`type`];
    this.offers = data[`offers`];
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.imagesUrls = data[`destination`][`pictures`].map((it) => {
      it.src = convertToHttpsUrl(it.src);
      return it;
    });
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  static parseEvent(data) {
    return new EventAdapter(data);
  }

  static parseEvents(data) {
    return data.map(EventAdapter.parseEvent);
  }

  static toRAW(data) {
    return {
      'id': data.id ? data.id : null,
      'date_from': data.timeStart,
      'date_to': data.timeStart + data.duration,
      'type': data.type,
      'offers': data.offers,
      'destination': {
        'name': data.city,
        'description': data.description,
        'pictures': data.imagesUrls
      },
      'base_price': data.price,
      'is_favorite': data.isFavorite
    };
  }
}

export default EventAdapter;
