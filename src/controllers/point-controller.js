import EventCard from '../components/event';
import EventEditCard from '../components/event-edit';
import {getFirstCapital, Position, renderElement, parseOffers} from '../utils';
import {getRandomOffers, OFFERS, TRANSFER_TYPES, getRandomDescription, getRandomImageUrls} from '../data';

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
      this._eventCardList.replaceChild(this._eventCard.getElement(), this._eventCardEdit.getElement());
      const formData = new FormData(this._eventCardEdit.getElement().querySelector(`form.event--edit`));
      const newEventData = {
        type: getFirstCapital(formData.get(`event-type`)),
        city: formData.get(`event-destination`),
        imagesUrls: [...this._eventCardEdit.getElement().querySelectorAll(`img.event__photo`)].map((it) => it.src),
        description: this._eventCardEdit.getElement().querySelector(`.event__destination-description`).innerText,
        timeStart: new Date(formData.get(`event-start-time`)).valueOf(),
        duration: new Date(formData.get(`event-end-time`)).valueOf() - new Date(formData.get(`event-start-time`)).valueOf(),
        price: parseInt(formData.get(`event-price`), 10),
        offers: parseOffers(OFFERS, this._eventCardEdit.getElement().querySelectorAll(`input.event__offer-checkbox`)),
        isFavorite: formData.get(`event-favorite`)
      };

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
        this._eventCardEdit.refreshOffers(getRandomOffers());
      }
    };
    const onDestinationChange = () => {
      this._eventCardEdit.getElement().querySelector(`.event__destination-description`).innerText = getRandomDescription();
      this._eventCardEdit.refreshImages(getRandomImageUrls());
    };

    this._eventCard.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEventEditClick);
    this._eventCardEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEditingCardClose);
    this._eventCardEdit.getElement().querySelector(`form.event--edit`).addEventListener(`submit`, onEditFormSubmit);
    this._eventCardEdit.getElement().querySelector(`.event__type-list`).addEventListener(`click`, onEventTypeClick);
    this._eventCardEdit.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, onDestinationChange);
    renderElement(this._fragment, Position.BEFOREEND, this._eventCard.getElement());
  }

  setDefaultView() {
    if (this._eventCardList.contains(this._eventCardEdit.getElement())) {
      this._eventCardList.replaceChild(this._eventCard.getElement(), this._eventCardEdit.getElement());
    }
  }
}

export default PointController;
