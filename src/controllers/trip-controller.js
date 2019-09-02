import {countTotalTripCost, getTripInfoRoute, Position, renderElement, splitEventsByDay} from './../utils';
import TripInfo from './../components/trip-info';
import TripSort from './../components/sort';
import EventDaysList from './../components/days-list';
import NoEventsMessage from './../components/no-events';
import PointController from './point-controller';

class TripController {
  constructor(tripEventsSection, days, events) {
    this._tripEventsSection = tripEventsSection;
    this._tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
    this._tripInfo = null;
    this._tripSort = new TripSort();
    this._daysList = new EventDaysList(days);
    this._emptyDaysList = new EventDaysList(null);
    this._events = events;
    this._splittedEventsByDay = splitEventsByDay(this._events);
    this._sortedEvents = this._events;
    this._noEventsMessage = new NoEventsMessage();
    this._currentSortingType = `default`;

    this._onDataChange = this._onDataChange.bind(this);
  }

  _onDataChange(newEvent, oldEvent) {
    this._events[this._events.indexOf(oldEvent)] = newEvent;
    this._splittedEventsByDay = splitEventsByDay(this._events);
    this._daysList.removeElement();
    this._emptyDaysList.removeElement();
    this._renderEvents(this._splittedEventsByDay, this._daysList.getElement());
  }

  _renderEventCard(eventMock, container, fragment) {
    const pointController = new PointController(container, fragment, eventMock, this._onDataChange);
  }

  _renderDailyEvents(eventsMocks, container) {
    const documentFragment = document.createDocumentFragment();
    eventsMocks.forEach((it) => this._renderEventCard(it, container, documentFragment));
    renderElement(container, Position.BEFOREEND, documentFragment);
  }

  _renderEvents(events, container) {
    renderElement(this._tripEventsSection, Position.BEFOREEND, container);
    const eventCardsLists = container.querySelectorAll(`.trip-events__list`);
    eventCardsLists.forEach((it, i) => this._renderDailyEvents(events[i], it));
  }

  _onTripSortClick(evt) {
    if (evt.target.tagName === `INPUT` && evt.target.dataset.sortType !== this._currentSortingType) {
      this._daysList.removeElement();
      this._emptyDaysList.removeElement();
      this._currentSortingType = evt.target.dataset.sortType;
      switch (this._currentSortingType) {
        case `time`:
          this._sortedEvents = this._events.slice().sort((a, b) => b.duration - a.duration);
          this._renderEvents([this._sortedEvents], this._emptyDaysList.getElement());
          break;
        case `price`:
          this._sortedEvents = this._events.slice().sort((a, b) => a.price - b.price);
          this._renderEvents([this._sortedEvents], this._emptyDaysList.getElement());
          break;
        case `default`:
          this._renderEvents(this._splittedEventsByDay, this._daysList.getElement());
          break;
      }
    }
  }

  init() {
    if (this._events.length) {
      const tripStartTime = this._events[0].timeStart;
      const tripFinishTime = this._events[this._events.length - 1].timeStart + this._events[this._events.length - 1].duration;
      this._tripInfo = new TripInfo(tripStartTime, tripFinishTime, getTripInfoRoute(this._events)).getElement();
      renderElement(this._tripInfoSection, Position.AFTERBEGIN, this._tripInfo);
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._tripSort.getElement());
      this._tripSort.getElement().addEventListener(`click`, (evt) => this._onTripSortClick(evt));
      this._renderEvents(this._splittedEventsByDay, this._daysList.getElement());
    } else {
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._noEventsMessage.getElement());
    }
    document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost(this._events);
  }
}

export default TripController;
