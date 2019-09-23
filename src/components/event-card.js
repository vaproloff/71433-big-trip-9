import AbstractComponent from './abstract-component';
import {TRANSFER_TYPES} from '../main';
import {getFirstCapital, getFormattedDuration} from '../utils';
import moment from 'moment';

class EventCard extends AbstractComponent {
  constructor(event) {
    super();
    this._id = event.id;
    this._type = event.type;
    this._city = event.city;
    this._timeStart = event.timeStart;
    this._duration = event.duration;
    this._price = event.price;
    this._offers = event.offers;
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="${getFirstCapital(this._type)}">
          </div>
          <h3 class="event__title">${getFirstCapital(this._type)} ${TRANSFER_TYPES.includes(this._type) ? `to` : `in`} ${this._city}</h3>
    
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${moment(this._timeStart).toISOString()}">${moment(this._timeStart).format(`HH:mm`)}</time>
              &mdash;
              <time class="event__end-time" datetime="${moment(this._timeStart + this._duration).toISOString()}">${moment(this._timeStart + this._duration).format(`HH:mm`)}</time>
            </p>
            <p class="event__duration">${getFormattedDuration(this._duration)}</p>
          </div>
    
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._price}</span>
          </p>
    
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._offers.filter((it) => it.accepted).map((it) => `<li class="event__offer">
              <span class="event__offer-title">${it.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
             </li>
            `).join(``)}
          </ul>
    
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }
}

export default EventCard;
