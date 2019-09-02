import EventCard from '../components/event';
import EventEditCard from '../components/event-edit';
import {getFirstCapital, Position, renderElement} from '../utils';

class PointController {
  constructor(eventCardList, fragment, eventData, onDataChange) {
    this._eventCardList = eventCardList;
    this._fragment = fragment;
    this._eventData = eventData;
    this._eventCard = new EventCard(eventData);
    this._eventCardEdit = new EventEditCard(eventData);
    this._onDataChange = onDataChange;

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
        imagesUrls: this._eventData.imagesUrls,
        description: this._eventData.description,
        timeStart: new Date(formData.get(`event-start-time`)).valueOf(),
        duration: new Date(formData.get(`event-end-time`)).valueOf() - new Date(formData.get(`event-start-time`)).valueOf(),
        price: parseInt(formData.get(`event-price`), 10),
        offers: this._eventData.offers.map((it) => {
          it[`isAdded`] = formData.get(`event-offer-${it[`name`]}`) === `on`;
          return it;
        }),
        isFavorite: formData.get(`event-favorite`)
      };

      this._onDataChange(newEventData, this._eventData);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };
    const onEventEditClick = () => {
      this._eventCardList.replaceChild(this._eventCardEdit.getElement(), this._eventCard.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    this._eventCard.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEventEditClick);
    this._eventCardEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEditingCardClose);
    this._eventCardEdit.getElement().querySelector(`form.event--edit`).addEventListener(`submit`, onEditFormSubmit);
    renderElement(this._fragment, Position.BEFOREEND, this._eventCard.getElement());
  }
}

export default PointController;
