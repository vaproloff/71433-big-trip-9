export const getRandomElementOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomBoolean = (probability = 1) => Boolean(Math.round(Math.random() * probability));

export const getRandomlyReducedArray = (arr, newLength) => {
  const arrCopy = arr.slice();
  return new Array(newLength) .fill(``).map(() => arrCopy.splice(Math.random() * arrCopy.length - 1, 1)[0]);
};

export const getFormattedDate = (timeStamp, localFormat) => new Date(timeStamp).toLocaleString(...localFormat);

export const getISODate = (timeStamp) => new Date(timeStamp).toISOString();
