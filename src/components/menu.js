import {createElement} from '../utils';

const DEFAULT_MENU = `Table`;

class Menu {
  constructor(menus) {
    this._menus = menus;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${this._menus.map((it) => `
          <a class="trip-tabs__btn  ${(it === DEFAULT_MENU) ? `trip-tabs__btn--active` : ``}" href="#">${it}</a>
        `).join(``)}
      </nav>
    `;
  }
}

export default Menu;
