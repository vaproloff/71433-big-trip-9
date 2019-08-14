const MILLISECONDS_IN_HOUR = 1000 * 60 * 60;
const MILLISECONDS_IN_MINUTE = 1000 * 60;

const formatDateToISO = (timeStamp) => {
  return new Date(timeStamp).toISOString();
};
const formatDateToSpecial = (timeStamp) => {
  return new Date(timeStamp).toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: false});
};

export const returnEventHtml = ({type, city, timeStart, duration, price, offers}) => `
  <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${(type === `Check-in` || type === `Restaurant` || type === `Sightseeing`) ? `in` : `to`} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDateToISO(timeStart)}">${formatDateToSpecial(timeStart)}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatDateToISO(timeStart + duration)}">${formatDateToSpecial(timeStart + duration)}</time>
        </p>
        <p class="event__duration">${Math.trunc(duration / (MILLISECONDS_IN_HOUR))}H ${Math.trunc((duration / (MILLISECONDS_IN_MINUTE)) % 60)}M</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${Array.from(offers).map((it) => `<li class="event__offer">
          <span class="event__offer-title">${it.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
         </li>
        `).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
`;
