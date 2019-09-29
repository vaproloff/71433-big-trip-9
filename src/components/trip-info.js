import AbstractComponent from './abstract-component';
import moment from 'moment';
import {Position, renderElement} from '../utils';

class TripInfo extends AbstractComponent {
  constructor() {
    super();
    this._startDate = null;
    this._finishDate = null;
    this._route = null;
  }

  refreshInfo(startDate, finishDate, route) {
    this.removeElement();
    if (startDate) {
      this._startDate = startDate;
      this._finishDate = finishDate;
      this._route = route;
      const infoSection = document.querySelector(`section.trip-main__trip-info`);
      renderElement(infoSection, Position.AFTERBEGIN, this.getElement());
    }
  }

  _getTemplate() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this._route}</h1>
    
        <p class="trip-info__dates">${TripInfo.getTripDatesString(this._startDate, this._finishDate)}</p>
      </div>
    `;
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
}

export default TripInfo;
