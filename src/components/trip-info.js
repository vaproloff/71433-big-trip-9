const formatDate = (timeStamp) => {
  return new Date(timeStamp).toLocaleString(`en-US`, {day: `numeric`, month: `short`});
};

export const returnTripInfoHtml = (firstEvent, lastEvent) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${firstEvent.city} &mdash; ... &mdash; ${lastEvent.city}</h1>

    <p class="trip-info__dates">${formatDate(firstEvent.timeStart)}&nbsp;&mdash;&nbsp;${formatDate(lastEvent.timeStart + lastEvent.duration)}</p>
  </div>
`;
