class ScreenController {
  constructor(menu, table, stats) {
    this._menu = menu;
    this._table = table;
    this._stats = stats;
    this._currentScreen = `Table`;
  }

  init() {
    this._menu.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName === `A` && this._currentScreen !== evt.target.textContent) {
        this._menu.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        this._currentScreen = evt.target.textContent;
        switch (evt.target.textContent) {
          case `Table`:
            this._stats.hide();
            this._table.show();
            this._table.setAbilityToCreateNewTask(true);
            break;
          case `Stats`:
            this._table.hide();
            this._stats.show();
            this._table.setAbilityToCreateNewTask(false);
            break;
        }
      }
    });
  }
}

export default ScreenController;
