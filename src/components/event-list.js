import {returnEventHtml} from "./event";
import {returnEventEditHtml} from "./event-edit";
import {getFormattedDate, getISODate} from "../utils";

const shortDayOptions = [`en-US`, {day: `numeric`, month: `short`}];

const splitEventsByDay = (events) => {
  const temp = {};
  const getDateFromStamp = (timeStamp) => new Date(timeStamp).getDate().toString();
  events.forEach((it) => {
    if (!temp[getDateFromStamp(it.timeStart)]) {
      temp[getDateFromStamp(it.timeStart)] = [];
    }
    temp[getDateFromStamp(it.timeStart)].push(it);
  });
  return Object.keys(temp).map((key) => temp[key]);
};

export const returnEventListHtml = (events) => `
  <ul class="trip-days">
  ${splitEventsByDay(events).map((it, index) => `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${getISODate(it[0].timeStart).split(`T`)[0]}">${getFormattedDate(it[0].timeStart, shortDayOptions)}</time>
      </div>
      <ul class="trip-events__list">
        ${it.map((event, i) => (index === 0 && i === 0) ? returnEventEditHtml(event) : returnEventHtml(event)).join(``)}
      </ul>
    </li>
  `).join(``)}
  </ul>
`;
