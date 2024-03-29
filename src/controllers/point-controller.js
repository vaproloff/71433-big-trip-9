import EventCard from '../components/event-card';
import EventEditCard from '../components/event-edit-card';
import {getFirstCapital, Position, renderElement, parseOffers, parseImages} from '../utils';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import moment from 'moment';
import {TRANSFER_TYPES, DESTINATIONS, OFFERS} from '../main';

class PointController {
  constructor(eventCardList, fragment, eventData, onDataChange, onChangeView) {
    this._eventCardList = eventCardList;
    this._fragment = fragment;
    this._eventData = eventData;
    this._eventCard = new EventCard(eventData);
    this._eventCardEdit = new EventEditCard(eventData);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventTypeChosen = eventData.type;

    this._init();
    this._addFlatpickrs();
  }

  setDefaultView() {
    if (this._eventCardList.contains(this._eventCardEdit.getElement())) {
      this._eventCardList.replaceChild(this._eventCard.getElement(), this._eventCardEdit.getElement());
    }
  }

  clearFlatpickr() {
    this._startFlatpickr.destroy();
    this._endFlatpickr.destroy();
  }

  _init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onEditingCardClose();
      }
    };

    const onEditingCardClose = () => {
      this._eventCardList.replaceChild(this._eventCard.getElement(), this._eventCardEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._eventCardEdit.getElement().querySelector(`form.event--edit`));
      this._eventData.type = formData.get(`event-type`).toLowerCase();
      this._eventData.city = formData.get(`event-destination`);
      this._eventData.imagesUrls = parseImages(this._eventCardEdit.getElement().querySelectorAll(`img.event__photo`));
      this._eventData.description = this._eventCardEdit.getElement().querySelector(`.event__destination-description`).innerText;
      this._eventData.timeStart = moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf();
      this._eventData.duration = moment(formData.get(`event-end-time`), `MM/DD/YY, HH:mm`).valueOf() - moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf();
      this._eventData.price = parseInt(formData.get(`event-price`), 10);
      this._eventData.offers = parseOffers(this._eventCardEdit.getElement().querySelectorAll(`.event__offer-label`));
      this._eventData.isFavorite = !!formData.get(`event-favorite`);

      this._onDataChange(`update`, this._eventData, this._eventCardEdit);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEventEditClick = () => {
      this._onChangeView();
      this._eventCardList.replaceChild(this._eventCardEdit.getElement(), this._eventCard.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onEventTypeClick = (evt) => {
      if (evt.target.tagName === `INPUT` && evt.target.value.toLowerCase() !== this._eventTypeChosen) {
        this._eventTypeChosen = evt.target.value.toLowerCase();
        const eventTypeInput = this._eventCardEdit.getElement().querySelector(`.event__type-output`);
        const eventTypeIcon = this._eventCardEdit.getElement().querySelector(`.event__type-icon`);
        eventTypeIcon.src = `img/icons/${this._eventTypeChosen}.png`;
        eventTypeInput.innerText = `${getFirstCapital(this._eventTypeChosen)} ${TRANSFER_TYPES.includes(this._eventTypeChosen) ? `to` : `in`}`;
        if (OFFERS.map((it) => it.type).includes(this._eventTypeChosen)) {
          this._eventCardEdit.refreshOffers(OFFERS.find((offer) => offer.type === this._eventTypeChosen).offers);
        } else {
          this._eventCardEdit.refreshOffers();
        }
      }
    };

    const cities = [...this._eventCardEdit.getElement().querySelectorAll(`.event__field-group--destination option`)]
      .map((it) => it.value);
    const onDestinationChange = (evt) => {
      if (!cities.includes(evt.target.value)) {
        evt.target.value = ``;
        return;
      }
      const cityChosen = evt.target.value;
      const cityIndex = DESTINATIONS.findIndex((it) => it.name === cityChosen);
      this._eventCardEdit.refreshDescription(DESTINATIONS[cityIndex].description);
      this._eventCardEdit.refreshImages(DESTINATIONS[cityIndex].pictures);
      this._eventCardEdit.getElement().querySelector(`.event__section--destination`).classList.remove(`visually-hidden`);
    };

    const onStartDateChange = (evt) => {
      this._endFlatpickr.set(`minDate`, evt.target.value);
      const newStartTime = moment(evt.target.value, `MM/DD/YY, HH:mm`).valueOf();
      this._endFlatpickr.setDate(newStartTime + this._eventData.duration);
    };

    this._eventCard.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEventEditClick);
    this._eventCardEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEditingCardClose);
    this._eventCardEdit.getElement().querySelector(`form.event--edit`).addEventListener(`submit`, onEditFormSubmit);
    this._eventCardEdit.getElement().querySelector(`.event__type-list`).addEventListener(`click`, onEventTypeClick);
    this._eventCardEdit.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, onDestinationChange);
    this._eventCardEdit.getElement().querySelector(`input[name="event-start-time"]`).addEventListener(`change`, onStartDateChange);
    this._eventCardEdit.getElement().querySelector(`form.event--edit`).addEventListener(`reset`, () => {
      this._onDataChange(`delete`, this._eventData, this._eventCardEdit);
    });

    renderElement(this._fragment, Position.BEFOREEND, this._eventCard.getElement());
  }

  _addFlatpickrs() {
    const startTimeInput = this._eventCardEdit.getElement().querySelector(`input[name="event-start-time"]`);
    const endTimeInput = this._eventCardEdit.getElement().querySelector(`input[name="event-end-time"]`);
    this._startFlatpickr = flatpickr(startTimeInput, {
      altInput: false,
      dateFormat: `m/d/y, H:i`,
      [`time_24hr`]: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._eventData.timeStart,
    });
    this._endFlatpickr = flatpickr(endTimeInput, {
      altInput: false,
      dateFormat: `m/d/y, H:i`,
      [`time_24hr`]: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._eventData.timeStart + this._eventData.duration,
      minDate: this._eventData.timeStart
    });
  }
}

export default PointController;
