import {returnEventHtml} from "./event";
import {returnEventEditHtml} from "./event-edit";

const splitEventsByDay = (events) => {
  const tempObject = {};
  events.forEach((it) => {
    if (typeof tempObject[new Date(it.timeStart).getDate()] === `undefined`) {
      tempObject[new Date(it.timeStart).getDate()] = [];
    }
    tempObject[new Date(it.timeStart).getDate()].push(it);
  });
  return Object.keys(tempObject).map((key) => tempObject[key]);
};
const formatDateToISODay = (timeStamp) => new Date(timeStamp).toISOString().split(`T`)[0];
const formatDateToDayList = (timeStamp) => new Date(timeStamp).toLocaleString(`en-US`, {day: `numeric`, month: `short`});

export const returnEventListHtml = (events) => `
  <ul class="trip-days">
  ${splitEventsByDay(events).map((it, index) => `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${formatDateToISODay(it[0].timeStart)}">${formatDateToDayList(it[0].timeStart)}</time>
      </div>
      <ul class="trip-events__list">
        ${it.map((event, i) => (index === 0 && i === 0) ? returnEventEditHtml(event) : returnEventHtml(event)).join(``)}
      </ul>
    </li>
  `).join(``)}
  </ul>
`;
