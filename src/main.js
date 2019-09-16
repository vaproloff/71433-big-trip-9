import {Position, renderElement} from './utils';
import Menu from './components/menu';
import TripFilter from './components/filter';
import TripController from './controllers/trip-controller';
import ScreenController from './controllers/screen-controller';
import API from './api';
import StatController from './controllers/stat-controller';
import Provider from './provider';
import Store from './store';

const menus = [...new Set([`Table`, `Stats`])];
const filters = [...new Set([`Everything`, `Future`, `Past`])];
const ACTIVITY_TYPES = [`Check-in`, `Restaurant`, `Sightseeing`];
const TRANSFER_TYPES = [`Bus`, `Drive`, `Flight`, `Ship`, `Taxi`, `Train`, `Transport`];
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
const menu = new Menu([...menus]);
renderElement(tripControlsHeadings[0], Position.AFTEREND, menu.getElement());
renderElement(tripControlsHeadings[1], Position.AFTEREND, new TripFilter([...filters]).getElement());

let OFFERS;
let DESTINATIONS;

const store = new Store(`EVENTS_V1.0`, window.localStorage);
const api = new API(END_POINT, AUTHORIZATION);
const provider = new Provider(api, store);
provider.getOffers().then((offers) => {
  OFFERS = offers;

  provider.getDestinations().then((destinations) => {
    DESTINATIONS = destinations;

    provider.getEvents().then((events) => {
      const tripEventsSection = document.querySelector(`section.trip-events`);
      const statController = new StatController(tripEventsSection, events);

      const tripController = new TripController(tripEventsSection, events, provider, statController.refreshCharts.bind(statController));
      tripController.init();

      const screenController = new ScreenController(menu, tripController, statController);
      screenController.init();
    });
  });
});

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncEvents();
});

export {OFFERS, DESTINATIONS, ACTIVITY_TYPES, TRANSFER_TYPES};
