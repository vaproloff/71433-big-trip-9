import {DateOption, getFormattedDate} from '../utils';
import AbstractComponent from './abstract-component';

class TripInfo extends AbstractComponent {
  constructor(firstEvent, lastEvent) {
    super();
    this._firstEvent = firstEvent;
    this._lastEvent = lastEvent;
  }

  static getTripDatesString(firstDate, lastDate) {
    const start = getFormattedDate(firstDate, DateOption.SHORT_DAY_MONTH);

    let finish;
    if (new Date(lastDate).getMonth() === new Date(firstDate).getMonth()) {
      finish = getFormattedDate(lastDate, DateOption.SHORT_DAY);
    } else {
      finish = getFormattedDate(lastDate, DateOption.SHORT_DAY_MONTH);
    }
    return `${start}&nbsp;&mdash;&nbsp;${finish}`;
  }

  getTemplate() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this._firstEvent.city} &mdash; ... &mdash; ${this._lastEvent.city}</h1>
    
        <p class="trip-info__dates">${TripInfo.getTripDatesString(this._firstEvent.timeStart, this._lastEvent.timeStart + this._lastEvent.duration)}</p>
      </div>
    `;
  }
}

export default TripInfo;
