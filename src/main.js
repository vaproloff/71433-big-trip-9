import {Position, renderElement} from './utils';
import {events, menus, filters, days} from './data';
import Menu from './components/menu';
import TripFilter from './components/filter';
import TripController from './controllers/trip-controller';


const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
renderElement(tripControlsHeadings[0], Position.AFTEREND, new Menu([...menus]).getElement());
renderElement(tripControlsHeadings[1], Position.AFTEREND, new TripFilter([...filters]).getElement());

const tripEventsSection = document.querySelector(`section.trip-events`);
const tripController = new TripController(tripEventsSection, days, events);
tripController.init();
