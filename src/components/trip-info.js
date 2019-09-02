import AbstractComponent from './abstract-component';
import moment from 'moment';

class TripInfo extends AbstractComponent {
  constructor(startDate, finishDate, route) {
    super();
    this._startDate = startDate;
    this._finishDate = finishDate;
    this._route = route;
  }

  static getTripDatesString(firstDate, lastDate) {
    const start = moment(firstDate).format(`MMM D`);
    const startMonth = new Date(firstDate).getMonth();
    const startDay = new Date(firstDate).getDate();
    const finishMonth = new Date(lastDate).getMonth();
    const finishDay = new Date(lastDate).getDate();
    let finish;

    if (finishMonth !== startMonth) {
      finish = moment(lastDate).format(`MMM D`);
    } else if (finishDay !== startDay) {
      finish = moment(lastDate).format(`D`);
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
