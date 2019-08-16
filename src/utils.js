export const getRandomElementOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomBoolean = (probability = 1) => Boolean(Math.round(Math.random() * probability));

export const getRandomlyReducedArray = (arr, newLength) => {
  const arrCopy = arr.slice();
  return new Array(newLength) .fill(``).map(() => arrCopy.splice(Math.random() * arrCopy.length - 1, 1)[0]);
};

export const formatDate = (timeStamp, format) => {
  switch (format) {
    case `HH:MM`:
      return new Date(timeStamp).toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: false});
    case `MM/DD/YY, HH:MM`:
      return new Date(timeStamp).toLocaleString(`en-US`, {day: `2-digit`, month: `2-digit`, year: `2-digit`, hour: `2-digit`, minute: `2-digit`, hour12: false});
    case `Mon DD`:
      return new Date(timeStamp).toLocaleString(`en-US`, {day: `numeric`, month: `short`});
    case `ISO`:
      return new Date(timeStamp).toISOString();
    default:
      return ``;
  }
};
