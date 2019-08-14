export const returnTripControlsHtml = (menus) => `
  <nav class="trip-controls__trip-tabs  trip-tabs">
    ${menus.map((it) => `
      <a class="trip-tabs__btn  ${(menus[0] === it) ? `trip-tabs__btn--active` : ``}" href="#">${it}</a>
    `).join(``)}
  </nav>
`;
