import EventCard from './event-card';
import {ACTIVITY_TYPES, TRANSFER_TYPES, DESTINATIONS} from '../main';
import moment from 'moment';
import {getFirstCapital} from '../utils';

class EventNewCard extends EventCard {
  constructor(eventData) {
    super(eventData);
  }

  block() {
    this._element.querySelectorAll(`input, button`)
      .forEach((it) => it.setAttribute(`disabled`, `disabled`));
    this._element.querySelector(`.event__save-btn`).textContent = `Saving...`;
  }

  unblock() {
    this._element.querySelectorAll(`input, button`)
      .forEach((it) => it.removeAttribute(`disabled`));
    this._element.querySelector(`.event__save-btn`).textContent = `Save`;
  }

  shakeOnError() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._element.style.border = `3px solid red`;
    this._element.style.borderRadius = `18px`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._element.style.border = ``;
      this._element.style.borderRadius = ``;
    }, ANIMATION_TIMEOUT);
  }

  _getTemplate() {
    return `
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Transfer</legend>
                  
                  ${TRANSFER_TYPES.map((it) => `
                    <div class="event__type-item">
                      <input id="event-type-${it}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it}" ${this._type === it ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${it}" for="event-type-${it}-1">${getFirstCapital(it)}</label>
                    </div>
                  `).join(``)}
                </fieldset>
                
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Activity</legend>
                  
                  ${ACTIVITY_TYPES.map((it) => `
                    <div class="event__type-item">
                      <input id="event-type-${it}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it}" ${this._type === it ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${it}" for="event-type-${it}-1">${getFirstCapital(it)}</label>
                    </div>
                  `).join(``)}
                </fieldset>
              </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${getFirstCapital(this._type)} ${TRANSFER_TYPES.includes(this._type) ? `to` : `in`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
                ${DESTINATIONS.map((it) => `<option value="${it.name}"></option>
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
