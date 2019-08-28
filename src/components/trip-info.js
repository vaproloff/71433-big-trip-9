import {DateOption, getFormattedDate} from '../utils';
import AbstractComponent from './abstract-component';

class TripInfo extends AbstractComponent {
  constructor(startDate, finishDate, route) {
    super();
    this._startDate = startDate;
    this._finishDate = finishDate;
    this._route = route;
  }

  // static getTripDatesString(firstDate, lastDate) {
  //   const start = getFormattedDate(firstDate, DateOption.SHORT_DAY_MONTH);
  //   let finish;
  //   if (new Date(lastDate).getMonth() === new Date(firstDate).getMonth()) {
  //     if (new Date(lastDate).getDate() !== new Date(firstDate).getDate()) {
  //       finish = getFormattedDate(lastDate, DateOption.SHORT_DAY);
  //     }
  //   } else {
  //     finish = getFormattedDate(lastDate, DateOption.SHORT_DAY_MONTH);
  //   }
  //   return `${start}${finish ? `&nbsp;&mdash;&nbsp;${finish}` : ``}`;
  // }

  static getTripDatesString(firstDate, lastDate) {
    const start = getFormattedDate(firstDate, DateOption.SHORT_DAY_MONTH);
    const startMonth = new Date(firstDate).getMonth();
    const startDay = new Date(firstDate).getDate();
    const finishMonth = new Date(lastDate).getMonth();
    const finishDay = new Date(lastDate).getDate();
    let finish;

    if (finishMonth !== startMonth) {
      finish = getFormattedDate(lastDate, DateOption.SHORT_DAY_MONTH);
    } else if (finishDay !== startDay) {
      finish = getFormattedDate(lastDate, DateOption.SHORT_DAY);
    }
    return `${start}${finish ? `&nbsp;&mdash;&nbsp;${finish}` : ``}`;
  }

  getTemplate() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this._route}</h1>
    
        <p class="trip-info__dates">${TripInfo.getTripDatesString(this._startDate, this._finishDate)}</p>
      </div>
    `;
  }
}

export default TripInfo;
