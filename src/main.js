import {Position, renderElement} from './utils';
import {events, menus, filters} from './data';
import Menu from './components/menu';
import TripFilter from './components/filter';
import TripController from './controllers/trip-controller';
import Statistics from './components/statistics';
import ScreenController from './controllers/screen-controller';

const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
const menu = new Menu([...menus]);
renderElement(tripControlsHeadings[0], Position.AFTEREND, menu.getElement());
renderElement(tripControlsHeadings[1], Position.AFTEREND, new TripFilter([...filters]).getElement());

const tripEventsSection = document.querySelector(`section.trip-events`);
const tripController = new TripController(tripEventsSection, events);
tripController.init();

const statistics = new Statistics();
renderElement(tripEventsSection, Position.AFTEREND, statistics.getElement());
statistics.hide();

const screenController = new ScreenController(menu, tripController, statistics);
screenController.init();
