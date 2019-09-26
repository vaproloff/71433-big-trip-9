import {getFirstCapital, Position, renderElement} from '../utils';
import moment from 'moment';
import EventNewCard from '../components/new-event-card';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {TRANSFER_TYPES, DESTINATIONS, OFFERS} from '../main';

class NewEventController {
  constructor(tripEventsSection, newEventData, onDataChange, onCreateNewTask) {
    this._tripEventsSection = tripEventsSection;
    this._newEventData = newEventData;
    this._eventNewCard = new EventNewCard(newEventData);
    this._onDataChange = onDataChange;
    this._onCreateNewTask = onCreateNewTask;

    this._eventNewCard.getElement().querySelector(`.event__input--destination`).required = true;

    this._init();
    this._addFlatpickrs();
  }

  _init() {
    this._onCreateNewTask();

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this.onNewTaskReset();
      }
    };

    const onNewTaskSubmit = (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._eventNewCard.getElement());
      this._newEventData.price = parseInt(formData.get(`event-price`), 10);
      this._newEventData.timeStart = moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf();
      this._newEventData.duration = moment(formData.get(`event-end-time`), `MM/DD/YY, HH:mm`).valueOf() - moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf();

      this._onDataChange(`create`, this._newEventData, this._eventNewCard);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEventTypeClick = (evt) => {
      if (evt.target.tagName === `INPUT` && evt.target.value.toLowerCase() !== this._newEventData.type) {
        this._newEventData.type = evt.target.value.toLowerCase();
        const eventTypeInput = this._eventNewCard.getElement().querySelector(`.event__type-output`);
        const eventTypeIcon = this._eventNewCard.getElement().querySelector(`.event__type-icon`);
        eventTypeIcon.src = `img/icons/${this._newEventData.type}.png`;
        eventTypeInput.innerText = `${getFirstCapital(this._newEventData.type)} ${TRANSFER_TYPES.includes(this._newEventData.type) ? `to` : `in`}`;

        if (OFFERS.map((it) => it.type).includes(this._newEventData.type)) {
          this._newEventData.offers = OFFERS.find((offer) => offer.type === this._newEventData.type).offers
            .map((it) => {
              return {
                title: it.name,
                price: it.price,
                accepted: false
              };
            });
        }
      }
    };

    const cities = [...this._eventNewCard.getElement().querySelectorAll(`.event__field-group--destination option`)]
      .map((it) => it.value);
    const onDestinationChange = (evt) => {
      if (!cities.includes(evt.target.value)) {
        evt.target.value = ``;
        return;
      }
      this._newEventData.city = evt.target.value;
      const cityIndex = DESTINATIONS.findIndex((it) => it.name === this._newEventData.city);
      this._newEventData.description = DESTINATIONS[cityIndex].description;
      this._newEventData.imagesUrls = DESTINATIONS[cityIndex].pictures;
    };

    const onStartDateChange = (evt) => {
      this._endFlatpickr.set(`minDate`, evt.target.value);
      const newStartTime = moment(evt.target.value, `MM/DD/YY, HH:mm`).valueOf();
      this._endFlatpickr.setDate(newStartTime + this._newEventData.duration);
    };

    this._eventNewCard.getElement().querySelector(`.event__type-list`).addEventListener(`click`, onEventTypeClick);
    this._eventNewCard.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, onDestinationChange);
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
    this.clearFlatpickr();
    this._eventNewCard.removeElement();
    this._onDataChange(null, null);
  }

  clearFlatpickr() {
    this._startFlatpickr.destroy();
    this._endFlatpickr.destroy();
  }
}

export default NewEventController;
