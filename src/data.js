import {getRandomElementOfArray} from "./utils";
import {getRandomBoolean} from "./utils";
import {getRandomlyReducedArray} from "./utils";

const EVENTS_NUMBER = 4;
const IMAGE_MAX_NUMBER = 10;
const DESCRIPTION_MAX_SENTENCES = 3;
const DAYS_IN_WEEK = 7;
const MAX_TRIP_DURATION_DAYS = 3;
const MAX_DURATION_IN_HOURS = 3;
const OFFERS_MAX_NUMBER = 2;
const MAX_PRICE = 300;
const MILLISECONDS_IN_FIVE_MINUTES = 5 * 60 * 1000;
const EVENT_TYPES = [`Bus`, `Check-in`, `Drive`, `Flight`, `Restaurant`, `Ship`, `Sightseeing`, `Taxi`, `Train`, `Transport`];
const CITIES = [`Saint Petersburg`, `Chamonix`, `Geneva`, `Amsterdam`, `Moscow`, `Milan`, `Rome`, `Barcelona`, `Madrid`, `Paris`];
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const OFFERS = [
  {
    name: `luggage`,
    title: `Add luggage`,
    price: 10,
    isAdded: false
  }, {
    name: `comfort`,
    title: `Switch to comfort class`,
    price: 150,
    isAdded: false
  }, {
    name: `meal`,
    title: `Add meal`,
    price: 2,
    isAdded: false
  }, {
    name: `seats`,
    title: `Choose seats`,
    price: 9,
    isAdded: false
  }
];

const convertDaysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;
const convertHoursToMilliseconds = (hours) => hours * 60 * 60 * 1000;
const roundUpToFiveMinutes = (timeStamp) => Math.trunc(timeStamp / MILLISECONDS_IN_FIVE_MINUTES) * MILLISECONDS_IN_FIVE_MINUTES;

const generateRandomEvent = () => ({
  type: getRandomElementOfArray(EVENT_TYPES),
  city: getRandomElementOfArray(CITIES),
  imagesUrls: new Array(Math.round(Math.random() * IMAGE_MAX_NUMBER)).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`),
  description: getRandomlyReducedArray(DESCRIPTION.split(`. `), DESCRIPTION_MAX_SENTENCES).join(`. `),
  timeStart: roundUpToFiveMinutes(Date.now() + convertDaysToMilliseconds(Math.random() * MAX_TRIP_DURATION_DAYS + DAYS_IN_WEEK)),
  duration: roundUpToFiveMinutes(convertHoursToMilliseconds((Math.random() * (MAX_DURATION_IN_HOURS - 1) + 1))),
  price: Math.ceil(Math.random() * MAX_PRICE / 10) * 10,
  offers: new Set(getRandomlyReducedArray(OFFERS, OFFERS_MAX_NUMBER).map((it) => {
    it.isAdded = true;
    return it;
  })),
  isFavorite: getRandomBoolean()
});

export const events = new Array(EVENTS_NUMBER).fill(``).map(() => generateRandomEvent()).sort((a, b) => a.timeStart - b.timeStart);
export const menus = new Set([`Table`, `Stats`]);
export const filters = new Set([`Everything`, `Future`, `Past`]);
export {CITIES};
