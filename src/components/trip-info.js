import {DateOption, getFormattedDate} from '../utils';
import AbstractComponent from './abstract-component';

class TripInfo extends AbstractComponent {
  constructor(startDate, finishDate, cities) {
    super();
    this._startDate = startDate;
    this._finishDate = finishDate;
    this._cities = cities;
  }

  static getTripDatesString(firstDate, lastDate) {
    const start = getFormattedDate(firstDate, DateOption.SHORT_DAY_MONTH);
    let finish;
    if (new Date(lastDate).getDate() !== new Date(firstDate).getDate()) {
      if (new Date(lastDate).getMonth() === new Date(firstDate).getMonth()) {
        if (new Date(lastDate).getDate() !== new Date(firstDate).getDate()) {
          finish = getFormattedDate(lastDate, DateOption.SHORT_DAY);
        }
      } else {
        finish = getFormattedDate(lastDate, DateOption.SHORT_DAY_MONTH);
      }
    }
    return `${start}${finish ? `&nbsp;&mdash;&nbsp;${finish}` : ``}`;
  }

  getTemplate() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this._cities.map((it) => it).join(` — `)}</h1>
    
        <p class="trip-info__dates">${TripInfo.getTripDatesString(this._startDate, this._finishDate)}</p>
      </div>
    `;
  }
}

export default TripInfo;
