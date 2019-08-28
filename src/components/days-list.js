import {getFormattedDate, getISODate, DateOption} from '../utils';
import AbstractComponent from './abstract-component';

class EventDaysList extends AbstractComponent {
  constructor(days) {
    super();
    this._days = days;
  }

  getTemplate() {
    return `
      <ul class="trip-days">
        ${this._days ? this._days.map((it, index) => `
          <li class="trip-days__item  day">
            <div class="day__info">
              <span class="day__counter">${index + 1}</span>
              <time class="day__date" datetime="${getISODate(it).split(`T`)[0]}">${getFormattedDate(it, DateOption.SHORT_DAY_MONTH)}</time>
            </div>
            <ul class="trip-events__list">
            
            </ul>
          </li>`).join(``) : `
          <li class="trip-days__item  day">
            <div class="day__info"></div>
            <ul class="trip-events__list">
            
            </ul>
          </li>`}
      </ul>
    `;
  }
}

export default EventDaysList;
