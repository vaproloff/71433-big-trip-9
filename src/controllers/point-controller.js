import EventCard from '../components/event';
import EventEditCard from '../components/event-edit';
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
    this._eventTypeChosen = eventData.type.toLowerCase();

    this.init();
    this._addFlatpickrs();
  }

  init() {
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
      const newEventData = {
        type: formData.get(`event-type`),
        city: formData.get(`event-destination`),
        imagesUrls: parseImages(this._eventCardEdit.getElement().querySelectorAll(`img.event__photo`)),
        description: this._eventCardEdit.getElement().querySelector(`.event__destination-description`).innerText,
        timeStart: moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf(),
        duration: moment(formData.get(`event-end-time`), `MM/DD/YY, HH:mm`).valueOf() - moment(formData.get(`event-start-time`), `MM/DD/YY, HH:mm`).valueOf(),
        price: parseInt(formData.get(`event-price`), 10),
        offers: parseOffers(this._eventCardEdit.getElement().querySelectorAll(`.event__offer-label`)),
        isFavorite: formData.get(`event-favorite`)
      };
      this._eventCardList.replaceChild(this._eventCard.getElement(), this._eventCardEdit.getElement());

      this._onDataChange(newEventData, this._eventData);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEventEditClick = () => {
      this._onChangeView();
      this._eventCardList.replaceChild(this._eventCardEdit.getElement(), this._eventCard.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onEventTypeClick = (evt) => {
      if (evt.target.tagName === `INPUT` && evt.target.value !== this._eventTypeChosen) {
        this._eventTypeChosen = evt.target.value;
        const eventTypeInput = this._eventCardEdit.getElement().querySelector(`.event__type-output`);
        const eventTypeIcon = this._eventCardEdit.getElement().querySelector(`.event__type-icon`);
        const eventTypeChosen = getFirstCapital(evt.target.value);
        eventTypeIcon.src = `img/icons/${eventTypeChosen.toLowerCase()}.png`;
        eventTypeInput.innerText = `${eventTypeChosen} ${TRANSFER_TYPES.includes(eventTypeChosen) ? `to` : `in`}`;
        if (OFFERS.map((it) => it.type).includes(eventTypeChosen.toLowerCase())) {
          this._eventCardEdit.refreshOffers(OFFERS.find((offer) => offer.type === eventTypeChosen.toLowerCase()).offers);
        } else {
          this._eventCardEdit.refreshOffers();
        }
      }
    };

    const onDestinationChange = (evt) => {
      const cityChosen = evt.target.value;
      const cityIndex = DESTINATIONS.findIndex((it) => it.name === cityChosen);
      if (cityIndex >= 0) {
        this._eventCardEdit.refreshDescription(DESTINATIONS[cityIndex].description);
        this._eventCardEdit.refreshImages(DESTINATIONS[cityIndex].pictures);
        this._eventCardEdit.getElement().querySelector(`.event__section--destination`).classList.remove(`visually-hidden`);
      } else {
        this._eventCardEdit.getElement().querySelector(`.event__section--destination`).classList.add(`visually-hidden`);
        this._eventCardEdit.refreshDescription();
        this._eventCardEdit.refreshImages();
      }
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
      this._onDataChange(null, this._eventData);
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

  setDefaultView() {
    if (this._eventCardList.contains(this._eventCardEdit.getElement())) {
      this._eventCardList.replaceChild(this._eventCard.getElement(), this._eventCardEdit.getElement());
    }
  }

  clearFlatpickr() {
    this._startFlatpickr.destroy();
    this._endFlatpickr.destroy();
  }
}

export default PointController;
