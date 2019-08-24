import {Position, renderElement, splitEventsByDay} from './utils';
import TripInfo from './components/trip-info';
import TripSort from './components/sort';
import EventDaysList from './components/days-list';
import EventCard from './components/event';
import EventEditCard from './components/event-edit';
import NoEventsMessage from './components/no-events';

class TripController {
  constructor(tripEventsSection, days, events) {
    this._tripEventsSection = tripEventsSection;
    this._events = events;
    this._tripSort = new TripSort();
    this._noEventsMessage = new NoEventsMessage();
    if (this._events.length) {
      this._tripInfo = new TripInfo(this._events[0], this._events[this._events.length - 1]);
      this._daysList = new EventDaysList(days);
      this._splittedEventsByDay = splitEventsByDay(this._events);
    }
  }

  _renderEventCard(eventMock, container, fragment) {
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
  }

  _renderDailyEvents(eventsMocks, container) {
    const documentFragment = document.createDocumentFragment();
    eventsMocks.forEach((it) => this._renderEventCard(it, container, documentFragment));
    renderElement(container, Position.BEFOREEND, documentFragment);
  }

  init() {
    if (this._events.length) {
      const tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
      renderElement(tripInfoSection, Position.AFTERBEGIN, this._tripInfo.getElement());
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._tripSort.getElement());
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._daysList.getElement());
      const eventCardsLists = this._tripEventsSection.getElement().querySelectorAll(`.trip-events__list`);
      eventCardsLists.forEach((it, i) => this._renderDailyEvents(this._splittedEventsByDay[i], it));
    } else {
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._noEventsMessage.getElement());
    }
  }
}

export default TripController;
