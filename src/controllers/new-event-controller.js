import {getFirstCapital, Position, renderElement} from '../utils';
import moment from 'moment';
import EventNewCard from '../components/new-event';
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
      this._newEventData.price = parseInt(formData.get(`event-price`), 10);
      const savedEventData = {
        type: formData.get(`event-type`).toLowerCase(),
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
      this._onDataChange(`create`, savedEventData);
      document.removeEventListener(`keydown`, onEscKeyDown);
      this._eventNewCard.removeElement();
    };

    const onEventTypeClick = (evt) => {
      if (evt.target.tagName === `INPUT` && evt.target.value !== this._newEventData.type) {
        this._newEventData.type = evt.target.value;
        const eventTypeInput = this._eventNewCard.getElement().querySelector(`.event__type-output`);
        const eventTypeIcon = this._eventNewCard.getElement().querySelector(`.event__type-icon`);
        eventTypeIcon.src = `img/icons/${this._newEventData.type.toLowerCase()}.png`;
        eventTypeInput.innerText = `${getFirstCapital(this._newEventData.type)} ${TRANSFER_TYPES.includes(getFirstCapital(this._newEventData.type)) ? `to` : `in`}`;

        if (OFFERS.map((it) => it.type).includes(this._newEventData.type.toLowerCase())) {
          this._newEventData.offers = OFFERS.find((offer) => offer.type === this._newEventData.type.toLowerCase()).offers
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

    const onDestinationChange = (evt) => {
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
