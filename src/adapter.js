class EventAdapter {
  constructor(data) {
    this.id = data[`id`];
    this.timeStart = data[`date_from`];
    this.duration = data[`date_to`] - data[`date_from`];
    this.type = data[`type`];
    this.offers = data[`offers`];
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.imagesUrls = data[`destination`][`pictures`];
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  static parseEvent(data) {
    return new EventAdapter(data);
  }

  static parseEvents(data) {
    return data.map(EventAdapter.parseEvent);
  }

  toRAW() {
    return {
      'id': this.id,
      'date_from': this.timeStart,
      'date_to': this.timeStart + this.duration,
      'type': this.type,
      'offers': this.offers,
      'destination': {
        'name': this.city,
        'description': this.description,
        'pictures': this.imagesUrls
      },
      'base_price': this.price,
      'is_favorite': this.isFavorite
    };
  }
}

export default EventAdapter;
