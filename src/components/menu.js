const DEFAULT_MENU = `Table`;

export const returnTripControlsHtml = (menus) => `
  <nav class="trip-controls__trip-tabs  trip-tabs">
    ${menus.map((it) => `
      <a class="trip-tabs__btn  ${(it === DEFAULT_MENU) ? `trip-tabs__btn--active` : ``}" href="#">${it}</a>
    `).join(``)}
  </nav>
`;
