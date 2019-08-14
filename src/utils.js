export const getRandomElementOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomBoolean = (probability = 1) => Boolean(Math.round(Math.random() * probability));

export const getRandomlyReducedArray = (arr, minLength, maxLength) => {
  const arrCopy = arr.slice();
  return new Array(Math.round(Math.random() * (maxLength - minLength) + minLength))
    .fill(``).map(() => arrCopy.splice(Math.random() * arrCopy.length - 1, 1)[0]);
};
