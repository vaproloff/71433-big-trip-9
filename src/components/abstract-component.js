import {createElement, deleteElement} from '../utils';

class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }
    return this._element;
  }

  removeElement() {
    deleteElement(this._element);
    this._element = null;
  }

  _getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }
}

export default AbstractComponent;
