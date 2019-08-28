import {Position, renderElement, countTotalTripCost, getTripInfoRoute} from './utils';
import {events, menus, filters, days, splittedEventsByDay} from './data';
import TripInfo from './components/trip-info';
import Menu from './components/menu';
import TripFilter from './components/filter';
import TripSort from './components/sort';
import EventDaysList from './components/days-list';
import EventCard from './components/event';
import EventEditCard from './components/event-edit';
import NoEventsMessage from './components/no-events';

const renderEventCard = (eventMock, container, fragment) => {
  const eventCard = new EventCard(eventMock);
  const eventCardEdit = new EventEditCard(eventMock);
  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      onEditFormSubmit();
    }
  };
  const onEditFormSubmit = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    container.replaceChild(eventCard.getElement(), eventCardEdit.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };
  const onEventEditClick = () => {
    container.replaceChild(eventCardEdit.getElement(), eventCard.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  eventCard.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEventEditClick);
  eventCardEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEditFormSubmit);
  eventCardEdit.getElement().querySelector(`form.event--edit`).addEventListener(`submit`, onEditFormSubmit);
  renderElement(fragment, Position.BEFOREEND, eventCard.getElement());
};
const renderDailyEvents = (eventsMocks, container) => {
  const documentFragment = document.createDocumentFragment();
  eventsMocks.forEach((it) => renderEventCard(it, container, documentFragment));
  renderElement(container, Position.BEFOREEND, documentFragment);
};


const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
renderElement(tripControlsHeadings[0], Position.AFTEREND, new Menu([...menus]).getElement());
renderElement(tripControlsHeadings[1], Position.AFTEREND, new TripFilter([...filters]).getElement());

const tripEventsSection = document.querySelector(`section.trip-events`);

if (events.length) {
  const tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
  const tripStartTime = events[0].timeStart;
  const tripFinishTime = events[events.length - 1].timeStart + events[events.length - 1].duration;
  const tripInfo = new TripInfo(tripStartTime, tripFinishTime, getTripInfoRoute(events)).getElement();
  renderElement(tripInfoSection, Position.AFTERBEGIN, tripInfo);

  renderElement(tripEventsSection, Position.BEFOREEND, new TripSort().getElement());
  const daysList = new EventDaysList(days);
  renderElement(tripEventsSection, Position.BEFOREEND, daysList.getElement());
  const eventCardsLists = tripEventsSection.querySelectorAll(`.trip-events__list`);
  eventCardsLists.forEach((it, i) => renderDailyEvents(splittedEventsByDay[i], it));
} else {
  const noEventsMessage = new NoEventsMessage();
  renderElement(tripEventsSection, Position.BEFOREEND, noEventsMessage.getElement());
}

document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost(events);
