import {countTotalTripCost, getTripInfoRoute, Position, renderElement, splitEventsByDay} from './../utils';
import TripInfo from './../components/trip-info';
import TripSort from './../components/sort';
import EventDaysList from './../components/days-list';
import NoEventsMessage from './../components/no-events';
import PointController from './point-controller';

class TripController {
  constructor(tripEventsSection, events) {
    this._tripEventsSection = tripEventsSection;
    this._tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
    this._tripInfo = new TripInfo();
    this._tripSort = new TripSort();
    this._daysList = new EventDaysList();
    this._emptyDaysList = new EventDaysList();
    this._events = events;
    this._splittedEventsByDay = splitEventsByDay(this._events);
    this._noEventsMessage = new NoEventsMessage();
    this._currentSortingType = `default`;

    this._subscriptions = [];
    this._flatpickrs = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  _onDataChange(newEvent, oldEvent) {
    this._flatpickrs.forEach((it) => it());
    this._events[this._events.indexOf(oldEvent)] = newEvent;
    this._events.sort((a, b) => a.timeStart - b.timeStart);
    this._daysList.removeElement();
    this._emptyDaysList.removeElement();
    this._daysList.setNewDays(this._events);
    this._sortAndSplitEvents();
    this._refreshTripInfo();
    this._renderEvents();
    document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost(this._events);
  }

  _refreshTripInfo() {
    const tripStartTime = this._events[0].timeStart;
    const tripFinishTime = this._events[this._events.length - 1].timeStart + this._events[this._events.length - 1].duration;
    this._tripInfo.refreshInfo(tripStartTime, tripFinishTime, getTripInfoRoute(this._events));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _renderEventCard(eventMock, container, fragment) {
    const pointController = new PointController(container, fragment, eventMock, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
    this._flatpickrs.push(pointController.clearFlatpickr.bind(pointController));
  }

  _renderDailyEvents(eventsMocks, container) {
    const documentFragment = document.createDocumentFragment();
    eventsMocks.forEach((it) => this._renderEventCard(it, container, documentFragment));
    renderElement(container, Position.BEFOREEND, documentFragment);
  }

  _renderEvents() {
    let eventCardsLists;
    if (this._currentSortingType === `default`) {
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._daysList.getElement());
      eventCardsLists = this._daysList.getElement().querySelectorAll(`.trip-events__list`);
    } else {
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._emptyDaysList.getElement());
      eventCardsLists = this._emptyDaysList.getElement().querySelectorAll(`.trip-events__list`);
    }
    eventCardsLists.forEach((it, i) => this._renderDailyEvents(this._splittedEventsByDay[i], it));
  }

  _sortAndSplitEvents() {
    switch (this._currentSortingType) {
      case `time`:
        this._splittedEventsByDay = [this._events.slice().sort((a, b) => b.duration - a.duration)];
        break;
      case `price`:
        this._splittedEventsByDay = [this._events.slice().sort((a, b) => a.price - b.price)];
        break;
      case `default`:
        this._splittedEventsByDay = splitEventsByDay(this._events);
        break;
    }
  }

  _onTripSortClick(evt) {
    if (evt.target.tagName === `INPUT` && evt.target.dataset.sortType !== this._currentSortingType) {
      this._daysList.removeElement();
      this._emptyDaysList.removeElement();
      this._currentSortingType = evt.target.dataset.sortType;
      this._sortAndSplitEvents();
      this._renderEvents();
    }
  }

  init() {
    if (this._events.length) {
      this._refreshTripInfo();
      this._daysList.setNewDays(this._events);
      renderElement(this._tripInfoSection, Position.AFTERBEGIN, this._tripInfo.getElement());
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._tripSort.getElement());
      this._tripSort.getElement().addEventListener(`click`, (evt) => this._onTripSortClick(evt));
      this._renderEvents();
    } else {
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._noEventsMessage.getElement());
    }
    document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost(this._events);
  }
}

export default TripController;
