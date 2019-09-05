import AbstractComponent from './abstract-component';
import moment from 'moment';

class EventDaysList extends AbstractComponent {
  constructor() {
    super();
    this._days = null;
  }

  setNewDays(events) {
    this._days = [...new Set(events.map((it) => new Date(it.timeStart).setHours(0, 0, 0, 0)))];
  }

  getTemplate() {
    return `
      <ul class="trip-days">
        ${this._days ? this._days.map((it, index) => `
          <li class="trip-days__item  day">
            <div class="day__info">
              <span class="day__counter">${index + 1}</span>
              <time class="day__date" datetime="${moment(it).toISOString().split(`T`)[0]}">${moment(it).format(`MMM D`)}</time>
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
