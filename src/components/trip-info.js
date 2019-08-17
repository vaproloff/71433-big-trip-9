const getTripDatesString = (firstDate, lastDate) => {
  const start = new Date(firstDate).toLocaleString(`en-US`, {day: `numeric`, month: `short`});
  let finish;
  if (new Date(lastDate).getMonth() === new Date(firstDate).getMonth()) {
    finish = new Date(lastDate).toLocaleString(`en-US`, {day: `numeric`});
  } else {
    finish = new Date(lastDate).toLocaleString(`en-US`, {day: `numeric`, month: `short`});
  }
  return `${start}&nbsp;&mdash;&nbsp;${finish}`;
};

export const returnTripInfoHtml = (firstEvent, lastEvent) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${firstEvent.city} &mdash; ... &mdash; ${lastEvent.city}</h1>

    <p class="trip-info__dates">${getTripDatesString(firstEvent.timeStart, lastEvent.timeStart + lastEvent.duration)}</p>
  </div>
`;
