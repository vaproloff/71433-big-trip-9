import AbstractComponent from './abstract-component';

const DEFAULT_MENU = `Table`;

class Menu extends AbstractComponent {
  constructor(menus) {
    super();
    this._menus = menus;
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
