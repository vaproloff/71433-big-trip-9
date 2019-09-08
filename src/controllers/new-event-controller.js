import {getFirstCapital, Position, renderElement} from '../utils';
import moment from 'moment';
import EventNewCard from '../components/new-event';
import {TRANSFER_TYPES} from '../data';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

class NewEventController {
  constructor(tripEventsSection, newEventData, onDataChange, onCreateNewTask) {
    this._tripEventsSection = tripEventsSection;
    this._newEventData = newEventData;
    this._eventNewCard = new EventNewCard(newEventData);
    this._onDataChange = onDataChange;
    this._onCreateNewTask = onCreateNewTask;

    this._eventNewCard.getElement().querySelector(`.event__input--destination`).required = true;

    this.init();
    this._addFlatpickrs();
  }

  init() {
    this._onCreateNewTask();

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this.onNewTaskReset();
      }
    };

    const onNewTaskSubmit = (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._eventNewCard.getElement());
      const savedEventData = {
        type: getFirstCapital(formData.get(`event-type`)),
        city: formData.get(`event-destination`),
        imagesUrls: this._newEventData.imagesUrls,
        description: this._newEventData.description,
        timeStart: moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf(),
        duration: moment(formData.get(`event-end-time`), `MM/DD/YY, HH:mm`).valueOf() - moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf(),
        price: parseInt(formData.get(`event-price`), 10),
        offers: this._newEventData.offers,
        isFavorite: false
      };

      this._clearFlatpickr();
      this._onDataChange(savedEventData, null);
      document.removeEventListener(`keydown`, onEscKeyDown);
      this._eventNewCard.removeElement();
    };

    const onEventTypeClick = (evt) => {
      if (evt.target.tagName === `INPUT` && evt.target.value !== this._eventTypeChosen) {
        this._eventTypeChosen = evt.target.value;
        const eventTypeInput = this._eventNewCard.getElement().querySelector(`.event__type-output`);
        const eventTypeIcon = this._eventNewCard.getElement().querySelector(`.event__type-icon`);
        const eventTypeChosen = getFirstCapital(evt.target.value);
        eventTypeIcon.src = `img/icons/${eventTypeChosen.toLowerCase()}.png`;
        eventTypeInput.innerText = `${eventTypeChosen} ${TRANSFER_TYPES.includes(eventTypeChosen) ? `to` : `in`}`;
      }
    };

    const onStartDateChange = (evt) => {
      this._endFlatpickr.set(`minDate`, evt.target.value);
      const newStartTime = moment(evt.target.value, `MM/DD/YY, HH:mm`).valueOf();
      this._endFlatpickr.setDate(newStartTime + this._newEventData.duration);
    };

    this._eventNewCard.getElement().querySelector(`.event__type-list`).addEventListener(`click`, onEventTypeClick);
    this._eventNewCard.getElement().querySelector(`input[name="event-start-time"]`).addEventListener(`change`, onStartDateChange);
    this._eventNewCard.getElement().addEventListener(`submit`, onNewTaskSubmit);
    this._eventNewCard.getElement().addEventListener(`reset`, () => {
      this.onNewTaskReset();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });
    document.addEventListener(`keydown`, onEscKeyDown);

    if (this._tripEventsSection.querySelector(`.trip-events__trip-sort`)) {
      renderElement(this._tripEventsSection.querySelector(`.trip-events__trip-sort`), Position.AFTEREND, this._eventNewCard.getElement());
    } else {
      renderElement(this._tripEventsSection, Position.AFTERBEGIN, this._eventNewCard.getElement());
    }
  }

  _addFlatpickrs() {
    const startTimeInput = this._eventNewCard.getElement().querySelector(`input[name="event-start-time"]`);
    const endTimeInput = this._eventNewCard.getElement().querySelector(`input[name="event-end-time"]`);
    this._startFlatpickr = flatpickr(startTimeInput, {
      altInput: false,
      dateFormat: `m/d/y, H:i`,
      [`time_24hr`]: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._newEventData.timeStart,
    });
    this._endFlatpickr = flatpickr(endTimeInput, {
      altInput: false,
      dateFormat: `m/d/y, H:i`,
      [`time_24hr`]: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._newEventData.timeStart + this._newEventData.duration,
      minDate: this._newEventData.timeStart
    });
  }

  onNewTaskReset() {
    this._clearFlatpickr();
    this._eventNewCard.removeElement();
    this._onDataChange(null, null);
  }

  _clearFlatpickr() {
    this._startFlatpickr.destroy();
    this._endFlatpickr.destroy();
  }
}

export default NewEventController;
