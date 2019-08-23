import AbstractComponent from './abstract-component';
import {getFormattedDate, getISODate, DateOption} from '../utils';
import {TRANSFER_TYPES} from '../data';

const MILLISECONDS_IN_HOUR = 1000 * 60 * 60;
const MILLISECONDS_IN_MINUTE = 1000 * 60;

class EventCard extends AbstractComponent {
  constructor(event) {
    super();
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
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.toLowerCase()}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${this._type} ${TRANSFER_TYPES.includes(this._type) ? `to` : `in`} ${this._city}</h3>
    
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${getISODate(this._timeStart)}">${getFormattedDate(this._timeStart, DateOption.SHORT_TIME)}</time>
              &mdash;
              <time class="event__end-time" datetime="${getISODate(this._timeStart + this._duration)}">${getFormattedDate(this._timeStart + this._duration, DateOption.SHORT_TIME)}</time>
            </p>
            <p class="event__duration">${Math.trunc(this._duration / (MILLISECONDS_IN_HOUR))}H ${Math.trunc((this._duration / (MILLISECONDS_IN_MINUTE)) % 60)}M</p>
          </div>
    
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._price}</span>
          </p>
    
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._offers.map((it) => `<li class="event__offer">
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
