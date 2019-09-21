import EventCard from './event';
import {TRANSFER_TYPES, ACTIVITY_TYPES, DESTINATIONS} from '../main';
import moment from 'moment';
import {getFirstCapital} from '../utils';

class EventEditCard extends EventCard {
  constructor(event) {
    super(event);
    this._imagesUrls = event.imagesUrls;
    this._description = event.description;
    this._isFavorite = event.isFavorite;
  }

  refreshOffers(offers = []) {
    const offersContainer = this.getElement().querySelector(`.event__available-offers`);
    offersContainer.innerHTML = ``;
    if (offers.length) {
      const offersContent = `
        ${offers.map((it) => `
          <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${it.title.toLowerCase().split(` `).join(`-`)}-${this._id}" type="checkbox" name="event-offer-${it.title.toLowerCase().split(` `).join(`-`)}">
          <label class="event__offer-label" for="event-offer-${it.title.toLowerCase().split(` `).join(`-`)}-${this._id}">
            <span class="event__offer-title">${it.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
          </label>
        </div>
        `).join(``)}`;
      offersContainer.insertAdjacentHTML(`beforeend`, offersContent);
      this.getElement().querySelector(`.event__section--offers`).classList.remove(`visually-hidden`);
    } else {
      this.getElement().querySelector(`.event__section--offers`).classList.add(`visually-hidden`);
    }
  }

  refreshDescription(description = ``) {
    this.getElement().querySelector(`.event__destination-description`).innerText = description;
  }

  refreshImages(imageUrls = []) {
    const imageContainer = this.getElement().querySelector(`.event__photos-tape`);
    imageContainer.innerHTML = ``;
    if (imageUrls.length) {
      imageContainer.insertAdjacentHTML(`beforeend`, `
      ${imageUrls.map((it) => `
        <img class="event__photo" src="${it.src}" alt="${it.description}">`).join(``)}
      `);
    }
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

  block() {
    this._element.querySelectorAll(`input, button`)
      .forEach((it) => it.setAttribute(`disabled`, `disabled`));
  }

  unblock() {
    this._element.querySelectorAll(`input, button`)
      .forEach((it) => it.removeAttribute(`disabled`));
    this._element.querySelector(`.event__save-btn`).textContent = `Save`;
    this._element.querySelector(`.event__reset-btn`).textContent = `Delete`;
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
        <form class="event  event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-${this._id}">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._id}" type="checkbox">
    
              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Transfer</legend>
                  
                  ${TRANSFER_TYPES.map((it) => `
                    <div class="event__type-item">
                      <input id="event-type-${it}-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it}" ${this._type === it ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${it}" for="event-type-${it}-${this._id}">${getFirstCapital(it)}</label>
                    </div>
                  `).join(``)}
                </fieldset>
                
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Activity</legend>
                  
                  ${ACTIVITY_TYPES.map((it) => `
                    <div class="event__type-item">
                      <input id="event-type-${it}-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it}" ${this._type === it ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${it}" for="event-type-${it}-${this._id}">${getFirstCapital(it)}</label>
                    </div>
                  `).join(``)}
                </fieldset>
              </div>
            </div>
    
            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-${this._id}">
                ${getFirstCapital(this._type)} ${TRANSFER_TYPES.includes(this._type) ? `to` : `in`}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-${this._id}" type="text" name="event-destination" value="${this._city}" list="destination-list-${this._id}">
              <datalist id="destination-list-${this._id}">
                ${DESTINATIONS.map((it) => `<option value="${it.name}"></option>
                `).join(``)}
              </datalist>
            </div>
    
            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${this._id}">
                From
              </label>
              <input class="event__input  event__input--time" id="event-start-time-${this._id}" type="text" name="event-start-time" value="${moment(this._timeStart).format(`MM/DD/YY, HH:mm`)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-${this._id}">
                To
              </label>
              <input class="event__input  event__input--time" id="event-end-time-${this._id}" type="text" name="event-end-time" value="${moment(this._timeStart + this._duration).format(`MM/DD/YY, HH:mm`)}">
            </div>
    
            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-${this._id}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-${this._id}" type="text" name="event-price" value="${this._price}">
            </div>
    
            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
    
            <input id="event-favorite-${this._id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
            <label class="event__favorite-btn" for="event-favorite-${this._id}">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </label>
    
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
    
          <section class="event__details">
    
            <section class="event__section  event__section--offers ${this._offers.length ? `` : `visually-hidden`}">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    
              <div class="event__available-offers">
                ${this._offers.map((it) => `
                  <div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${it.title.toLowerCase().split(` `).join(`-`)}-${this._id}" type="checkbox" name="event-offer-${it.title.toLowerCase().split(` `).join(`-`)}" ${it.accepted ? `checked` : ``}>
                  <label class="event__offer-label" for="event-offer-${it.title.toLowerCase().split(` `).join(`-`)}-${this._id}">
                    <span class="event__offer-title">${it.title}</span>
                    &plus;
                    &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
                  </label>
                </div>
                `).join(``)}
              </div>
            </section>
    
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${this._description}</p>
    
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${this._imagesUrls.map((it) => `
                    <img class="event__photo" src="${it.src}" alt="${it.description}">
                  `).join(``)}
                </div>
              </div>
            </section>
          </section>
        </form>
      </li>
    `;
  }
}

export default EventEditCard;
