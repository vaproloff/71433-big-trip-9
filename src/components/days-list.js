import {getFormattedDate, getISODate, DateOption, createElement, unrenderElement} from '../utils';

class EventDaysList {
  constructor(days) {
    this._days = days;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    unrenderElement(this._element);
    this._element = null;
  }

  getTemplate() {
    return `
      <ul class="trip-days">
        ${this._days.map((it, index) => `
          <li class="trip-days__item  day">
            <div class="day__info">
              <span class="day__counter">${index + 1}</span>
              <time class="day__date" datetime="${getISODate(it).split(`T`)[0]}">${getFormattedDate(it, DateOption.SHORT_DAY_MONTH)}</time>
            </div>
            <ul class="trip-events__list">
            
            </ul>
          </li>`).join(``)}
      </ul>
    `;
  }
}

export default EventDaysList;
