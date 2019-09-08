import {countTotalTripCost, getRandomElementOfArray, getTripInfoRoute, Position, renderElement, splitEventsByDay} from './../utils';
import TripInfo from './../components/trip-info';
import TripSort from './../components/sort';
import EventDaysList from './../components/days-list';
import NoEventsMessage from './../components/no-events';
import PointController from './point-controller';
import {ACTIVITY_TYPES, TRANSFER_TYPES} from '../main';
import moment from 'moment';
import NewEventController from './new-event-controller';
import EventAdapter from '../adapter';

class TripController {
  constructor(tripEventsSection, events, api, refreshCharts) {
    this._api = api;
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
    this._refreshCharts = refreshCharts;

    this._ableToCreateEvent = true;
    this._subscriptions = [];
    this._flatpickrs = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._onCreateNewTask = this._onCreateNewTask.bind(this);
  }

  _onDataChange(action, eventData) {
    switch (action) {
      case `delete`:
        this._api.deleteTask(eventData.id).then(() => {
          const eventIndex = this._events.findIndex((it) => it === eventData);
          this._events.splice(eventIndex, 1);
          this._reRenderBoard();
          this.toggleAbilityToCreateNewTask(true);
        });
        break;
      case `update`:
        this._api.updateTask(eventData.id, EventAdapter.toRAW(eventData))
          .then(() => this._api.getEvents())
          .then((events) => {
            this._events = events.sort((a, b) => a.timeStart - b.timeStart);
            this._reRenderBoard();
            this.toggleAbilityToCreateNewTask(true);
          });
        break;
      case `create`:
        this._api.createTask(EventAdapter.toRAW(eventData))
          .then(() => this._api.getEvents())
          .then((events) => {
            this._events = events.sort((a, b) => a.timeStart - b.timeStart);
            this._reRenderBoard();
            this.toggleAbilityToCreateNewTask(true);
          });
        break;
      default:
        this.toggleAbilityToCreateNewTask(true);
        break;
    }
  }

  _reRenderBoard() {
    this._flatpickrs.forEach((it) => it());
    this._daysList.removeElement();
    this._emptyDaysList.removeElement();
    this._sortAndSplitEvents();
    this._daysList.setNewDays(this._events);
    this._refreshTripInfo();
    this._refreshCharts(this._events);
    this._renderEvents();
    document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost(this._events);
    this._checkEventsAvailable();
  }

  _refreshTripInfo() {
    if (this._events.length) {
      const tripStartTime = this._events[0].timeStart;
      const tripFinishTime = this._events[this._events.length - 1].timeStart + this._events[this._events.length - 1].duration;
      this._tripInfo.refreshInfo(tripStartTime, tripFinishTime, getTripInfoRoute(this._events));
    } else {
      this._tripInfo.refreshInfo();
    }
  }

  _onChangeView() {
    if (this._newEventController) {
      this._newEventController.onNewTaskReset();
    }
    this._subscriptions.forEach((it) => it());
  }

  _onCreateNewTask() {
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
      this._flatpickrs.forEach((it) => it());
      this._daysList.removeElement();
      this._emptyDaysList.removeElement();
      this._currentSortingType = evt.target.dataset.sortType;
      this._sortAndSplitEvents();
      this._renderEvents();
    }
  }

  _createNewEvent() {
    if (this._noEventsMessage) {
      this._noEventsMessage.removeElement();
    }
    this.toggleAbilityToCreateNewTask(false);

    const defaultEventData = {
      type: getRandomElementOfArray([...ACTIVITY_TYPES, ...TRANSFER_TYPES]),
      city: ``,
      imagesUrls: [],
      description: ``,
      timeStart: moment().valueOf(),
      duration: moment.duration(1, `hours`).valueOf(),
      price: 0,
      offers: [],
      isFavorite: false
    };

    this._newEventController = new NewEventController(this._tripEventsSection, defaultEventData, this._onDataChange, this._onCreateNewTask);
  }

  hide() {
    if (this._tripEventsSection.classList.contains(`visually-hidden`)) {
      return;
    }
    this._tripEventsSection.classList.add(`visually-hidden`);
  }

  show() {
    if (this._tripEventsSection.classList.contains(`visually-hidden`)) {
      this._tripEventsSection.classList.remove(`visually-hidden`);
    }
  }

  toggleAbilityToCreateNewTask(ability) {
    if (this._ableToCreateEvent !== ability) {
      this._ableToCreateEvent = ability;
    }
  }

  _checkEventsAvailable() {
    if (!this._events.length) {
      this._tripSort.removeElement();
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._noEventsMessage.getElement());
    } else if (!this._tripEventsSection.querySelector(`.trip-events__trip-sort`)) {
      renderElement(this._tripEventsSection, Position.AFTERBEGIN, this._tripSort.getElement());
      this._tripSort.getElement().addEventListener(`click`, (evt) => this._onTripSortClick(evt));
    }
  }

  init() {
    if (this._events.length) {
      this._refreshTripInfo();
      this._daysList.setNewDays(this._events);
      renderElement(this._tripInfoSection, Position.AFTERBEGIN, this._tripInfo.getElement());
      renderElement(this._tripEventsSection, Position.AFTERBEGIN, this._tripSort.getElement());
      this._tripSort.getElement().addEventListener(`click`, (evt) => this._onTripSortClick(evt));
      this._renderEvents();
    } else {
      renderElement(this._tripEventsSection, Position.BEFOREEND, this._noEventsMessage.getElement());
    }
    document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
      if (this._ableToCreateEvent) {
        this._createNewEvent();
      }
    });
    document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost(this._events);
  }
}

export default TripController;
