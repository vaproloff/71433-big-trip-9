import EventCard from './event';
import {ACTIVITY_TYPES, TRANSFER_TYPES, CITIES} from '../data';
import moment from 'moment';

class EventNewCard extends EventCard {
  constructor(eventData) {
    super(eventData);
  }
  getTemplate() {
    return `
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Transfer</legend>
                  
                  ${TRANSFER_TYPES.map((it) => `
                    <div class="event__type-item">
                      <input id="event-type-${it.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it.toLowerCase()}" ${this._type.toLowerCase() === it.toLowerCase() ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${it.toLowerCase()}" for="event-type-${it.toLowerCase()}-1">${it}</label>
                    </div>
                  `).join(``)}
                </fieldset>
                
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Activity</legend>
                  
                  ${ACTIVITY_TYPES.map((it) => `
                    <div class="event__type-item">
                      <input id="event-type-${it.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it.toLowerCase()}" ${this._type.toLowerCase() === it.toLowerCase() ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${it.toLowerCase()}" for="event-type-${it.toLowerCase()}-1">${it}</label>
                    </div>
                  `).join(``)}
                </fieldset>
              </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${this._type} ${TRANSFER_TYPES.includes(this._type) ? `to` : `in`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
                ${CITIES.map((it) => `<option value="${it}"></option>
                `).join(``)}
              </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._timeStart).format(`MM/DD/YY, HH:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._timeStart + this._duration).format(`MM/DD/YY, HH:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
      </form>`;
  }
}

export default EventNewCard;
