const DEFAULT_FILTER = `Everything`;

export const returnTripFiltersHtml = (filters) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((it) => `
      <div class="trip-filters__filter">
        <input id="filter-${it.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${it.toLowerCase()}" ${(it === DEFAULT_FILTER) ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${it.toLowerCase()}">${it}</label>
      </div>
    `).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;
