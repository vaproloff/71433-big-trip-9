import moment from 'moment';

export const Position = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  BEFOREEND: `beforeend`
};

export const getRandomElementOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomBoolean = (probability = 1) => Boolean(Math.round(Math.random() * probability));

export const getRandomlyReducedArray = (arr, newLength) => {
  const arrCopy = arr.slice();
  return arr.slice(0, newLength).map(() => arrCopy.splice(Math.random() * arrCopy.length - 1, 1)[0]);
};

export const getFormattedDuration = (duration) => {
  let formattedDuration = ``;
  if (moment.duration(duration).days()) {
    formattedDuration = `${moment.duration(duration).days()}D `;
  }
  if (moment.duration(duration).hours()) {
    formattedDuration = `${formattedDuration}${moment.duration(duration).hours()}H `;
  }
  if (moment.duration(duration).minutes()) {
    formattedDuration = `${formattedDuration}${moment.duration(duration).minutes()}M`;
  }
  return formattedDuration;
};

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
  const offersExamplesCopy = offersExamples.map((it) => Object.assign({}, it));
  const offersChosen = [...offersInputs].map((input) => input.name.split(`-`)[2]);
  const offersIsAdded = [...offersInputs].map((input) => input.checked);
  return offersExamplesCopy.filter((it) => offersChosen.includes(it.name)).map((it, index) => {
    it.isAdded = offersIsAdded[index];
    return it;
  });
};
