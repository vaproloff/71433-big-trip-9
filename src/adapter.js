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

  static parseTask(data) {
    return new EventAdapter(data);
  }

  static parseTasks(data) {
    return data.map(EventAdapter.parseTask);
  }
}

export default EventAdapter;
