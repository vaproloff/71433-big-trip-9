import {Position, renderElement} from './utils';
import Menu from './components/menu';
import TripFilter from './components/trip-filter';
import TripController from './controllers/trip-controller';
import ScreenController from './controllers/screen-controller';
import API from './api';
import StatController from './controllers/stat-controller';
import Provider from './provider';
import Store from './store';

const ACTIVITY_TYPES = [`check-in`, `restaurant`, `sightseeing`];
const TRANSFER_TYPES = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];
let OFFERS;
let DESTINATIONS;
let EVENTS;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const menus = [...new Set([`Table`, `Stats`])];
const filters = [...new Set([`Everything`, `Future`, `Past`])];

const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
const menu = new Menu([...menus]);
renderElement(tripControlsHeadings[0], Position.AFTEREND, menu.getElement());
const filter = new TripFilter([...filters]).getElement();
renderElement(tripControlsHeadings[1], Position.AFTEREND, filter);

const store = new Store(window.localStorage);
const api = new API(END_POINT, AUTHORIZATION);
const provider = new Provider(api, store);

Promise.all([provider.getOffers(), provider.getDestinations(), provider.getEvents()])
  .then((values) => {
    [OFFERS, DESTINATIONS, EVENTS] = values;
    const tripEventsSection = document.querySelector(`section.trip-events`);
    const statController = new StatController(tripEventsSection, EVENTS);
    const tripController = new TripController(tripEventsSection, EVENTS, provider, statController.refreshCharts.bind(statController));
    tripController.init();
    const screenController = new ScreenController(menu, tripController, statController);
    screenController.init();
  });

document.title = `${document.title}${window.navigator.onLine ? `` : `[OFFLINE]`}`;
window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncEvents();
});

export {OFFERS, DESTINATIONS, ACTIVITY_TYPES, TRANSFER_TYPES};
