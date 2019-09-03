export const Position = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  BEFOREEND: `beforeend`
};

export const DateOption = {
  SHORT_TIME: [`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: false}],
  FULL_DATE_AND_TIME: [`en-US`, {day: `2-digit`, month: `2-digit`, year: `2-digit`, hour: `2-digit`, minute: `2-digit`, hour12: false}],
  SHORT_DAY_MONTH: [`en-US`, {day: `numeric`, month: `short`}],
  SHORT_DAY: [`en-US`, {day: `numeric`}]
};

export const getRandomElementOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomBoolean = (probability = 1) => Boolean(Math.round(Math.random() * probability));

export const getRandomlyReducedArray = (arr, newLength) => {
  const arrCopy = arr.slice();
  return new Array(newLength) .fill(``).map(() => arrCopy.splice(Math.random() * arrCopy.length - 1, 1)[0]);
};

export const getFormattedDate = (timeStamp, localFormat) => new Date(timeStamp).toLocaleString(...localFormat);

export const getISODate = (timeStamp) => new Date(timeStamp).toISOString();

export const createElement = (html) => {
  const newElement = document.createElement(`div`);
  newElement.insertAdjacentHTML(`beforeend`, html);
  if (newElement.childElementCount === 1) {
    return newElement.firstElementChild;
  } else {
    throw new Error(`В функцию должна быть передана разметка с одним родительским элементом`);
  }
};

export const getFirstCapital = (str) => {
  return str ? str[0].toUpperCase() + str.slice(1) : ``;
};

export const renderElement = (container, place, element) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.AFTEREND:
      container.after(element);
      break;
    case Position.BEFOREBEGIN:
      container.before(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const deleteElement = (element) => {
  if (element) {
    element.remove();
  }
};

export const splitEventsByDay = (events) => {
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

export const countTotalTripCost = (events) => {
  return events.reduce((acc, it) => {
    return acc + it.price + it.offers.reduce((sum, element) => {
      return element.isAdded ? sum + element.price : sum;
    }, 0);
  }, 0);
};

export const getTripInfoRoute = (events) => {
  const cities = events.map((it) => it.city).filter((it, i, arr) => it !== arr[i - 1]);

  const firstPoint = cities[0];
  const transitPoint = `${cities.length === 3 ? ` &mdash; ${cities[1]}` : ``}${cities.length > 3 ? ` &mdash; ...` : ``}`;
  const lastPoint = cities.length > 1 ? ` &mdash; ${cities[cities.length - 1]}` : ``;

  return `${firstPoint}${transitPoint}${lastPoint}`;
};

export const parseOffers = (offersExamples, offersInputs) => {
  const offersExamplesCopy = offersExamples.slice().map((it) => Object.assign({}, it));
  const offersChosen = [...offersInputs].map((input) => input.name.split(`-`)[2]);
  const offersIsAdded = [...offersInputs].map((input) => input.checked);
  return offersExamplesCopy.filter((it) => offersChosen.includes(it.name)).map((it, index) => {
    it.isAdded = offersIsAdded[index];
    return it;
  });
};
