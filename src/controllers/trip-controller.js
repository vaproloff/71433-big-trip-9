import {countTotalTripCost, getTripInfoRoute, Position, renderElement, splitEventsByDay} from './../utils';
import TripInfo from './../components/trip-info';
import TripSort from './../components/trip-sort';
import EventDaysList from './../components/event-days-list';
import NoEventsMessage from './../components/no-events-message';
import PointController from './point-controller';
import moment from 'moment';
import NewEventController from './new-event-controller';
import EventAdapter from '../adapter';

class TripController {
  constructor(tripEventsSection, events, provider, refreshCharts) {
    this._provider = provider;
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
    this._currentFilter = `everything`;
    this._refreshCharts = refreshCharts;

    this._ableToCreateEvent = true;
    this._subscriptions = [];
    this._flatpickrs = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._onCreateNewTask = this._onCreateNewTask.bind(this);
  }

  _onDataChange(action, eventData, element) {
    switch (action) {
      case `delete`:
        element.block();
        element.getElement().querySelector(`.event__reset-btn`).textContent = `Deleting...`;
        this._provider.deleteEvent(eventData.id)
          .then(() => this._provider.getEvents())
          .then((events) => {
            this._events = events;
            this._reRenderBoard(true);
            this.setAbilityToCreateNewTask(true);
          })
          .catch(() => {
            element.shakeOnError();
            element.unblock();
          });
        break;
      case `update`:
        element.block();
        element.getElement().querySelector(`.event__save-btn`).textContent = `Saving...`;
        this._provider.updateEvent(eventData.id, eventData.toRAW())
          .then(() => this._provider.getEvents())
          .then((events) => {
            this._events = events.sort((a, b) => a.timeStart - b.timeStart);
            this._reRenderBoard(true);
            this.setAbilityToCreateNewTask(true);
          })
          .catch(() => {
            element.shakeOnError();
            element.unblock();
          });
        break;
      case `create`:
        element.block();
        this._provider.createEvent(eventData.toRAW())
          .then(() => this._provider.getEvents())
          .then((events) => {
            this._newEventController.clearFlatpickr();
            element.removeElement();
            this._events = events.sort((a, b) => a.timeStart - b.timeStart);
            this._reRenderBoard(true);
            this.setAbilityToCreateNewTask(true);
          })
          .catch(() => {
            element.shakeOnError();
            element.unblock();
          });
        break;
      default:
        this.setAbilityToCreateNewTask(true);
        break;
    }
  }

  _reRenderBoard(isFull) {
    this._flatpickrs.forEach((it) => it());
    this._daysList.removeElement();
    this._emptyDaysList.removeElement();
    this._sortAndSplitEvents();
    if (isFull) {
      this._daysList.setNewDays(this._events);
      this._refreshTripInfo();
      document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost(this._events);
      this._refreshCharts(this._events);
      this._checkEventsAvailable();
    }
    this._renderEvents();
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
    switch (this._currentFilter) {
      case `everything`:
        this._splittedEventsByDay = this._events;
        break;
      case `future`:
        this._splittedEventsByDay = this._events.filter((it) => it.timeStart > moment().valueOf());
        break;
      case `past`:
        this._splittedEventsByDay = this._events.filter((it) => (it.timeStart + it.duration) <= moment().valueOf());
        break;
    }

    switch (this._currentSortingType) {
      case `time`:
        this._splittedEventsByDay = [this._splittedEventsByDay.slice().sort((a, b) => b.duration - a.duration)];
        break;
      case `price`:
        this._splittedEventsByDay = [this._splittedEventsByDay.slice().sort((a, b) => a.price - b.price)];
        break;
      case `default`:
        this._daysList.setNewDays(this._splittedEventsByDay);
        this._splittedEventsByDay = splitEventsByDay(this._splittedEventsByDay);
        break;
    }
  }

  _onTripSortClick(evt) {
    if (evt.target.tagName === `INPUT` && evt.target.dataset.sortType !== this._currentSortingType) {
      this._currentSortingType = evt.target.dataset.sortType;
      this._reRenderBoard();
    }
  }

  _onFilterClick(evt) {
    if (evt.target.tagName === `INPUT` && evt.target.value !== this._currentFilter) {
      this._currentFilter = evt.target.value;
      this._reRenderBoard();
    }
  }

  _createNewEvent() {
    if (this._noEventsMessage) {
      this._noEventsMessage.removeElement();
    }
    this.setAbilityToCreateNewTask(false);

    const defaultEventData = {
      'id': null,
      'date_from': moment().valueOf(),
      'date_to': moment().valueOf() + moment.duration(1, `hours`).valueOf(),
      'type': `bus`,
      'offers': [],
      'destination': {
        'name': ``,
        'description': ``,
        'pictures': []
      },
      'base_price': 0,
      'is_favorite': false
    };

    this._newEventController = new NewEventController(this._tripEventsSection, EventAdapter.parseEvent(defaultEventData), this._onDataChange, this._onCreateNewTask);
  }

  hide() {
    if (this._tripEventsSection.classList.contains(`visually-hidden`)) {
      return;
    }
    this._tripEventsSection.classList.add(`visually-hidden`);
    document.querySelectorAll(`.trip-filters__filter-input`).forEach((it) => {
      it.disabled = true;
    });
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  show() {
    if (this._tripEventsSection.classList.contains(`visually-hidden`)) {
      this._tripEventsSection.classList.remove(`visually-hidden`);
    }
    document.querySelectorAll(`.trip-filters__filter-input`).forEach((it) => {
      it.disabled = false;
    });
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  setAbilityToCreateNewTask(ability) {
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
      document.querySelector(`.trip-filters`).addEventListener(`click`, (evt) => this._onFilterClick(evt));
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
