import {returnTripInfoHtml} from "./components/trip-info";
import {returnTripControlsHtml} from "./components/menu";
import {returnTripFiltersHtml} from "./components/filter";
import {returnTripSortHtml} from "./components/sort";
import {returnEventListHtml} from "./components/event-list";
import {returnEventHtml} from "./components/event";
import {returnEventEditHtml} from "./components/event-edit";

// Функция рендеринга компонентов
const renderHtmlInContainer = (container, place, html) => {
  const node = document.createElement(`div`);
  node.innerHTML = html;
  switch (place) {
    case `afterbegin`:
      container.prepend(node.children[0]);
      break;
    case `afterend`:
      container.after(node.children[0]);
      break;
    case `beforebegin`:
      container.before(node.children[0]);
      break;
    case `beforeend`:
      container.append(node.children[0]);
      break;
  }
};

// Рендеринг компонентов шапки
const tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
renderHtmlInContainer(tripInfoSection, `afterbegin`, returnTripInfoHtml());

const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
renderHtmlInContainer(tripControlsHeadings[0], `afterend`, returnTripControlsHtml());
renderHtmlInContainer(tripControlsHeadings[1], `afterend`, returnTripFiltersHtml());

// Рендеринг компонентов контента
const mainContentFragment = document.createDocumentFragment();
renderHtmlInContainer(mainContentFragment, `beforeend`, returnTripSortHtml());
renderHtmlInContainer(mainContentFragment, `beforeend`, returnEventListHtml());
const tripEventsList = mainContentFragment.querySelector(` ul.trip-events__list`);
renderHtmlInContainer(tripEventsList, `beforeend`, returnEventEditHtml());
renderHtmlInContainer(tripEventsList, `beforeend`, returnEventHtml());
renderHtmlInContainer(tripEventsList, `beforeend`, returnEventHtml());
renderHtmlInContainer(tripEventsList, `beforeend`, returnEventHtml());

const tripEventsSection = document.querySelector(`section.trip-events`);
tripEventsSection.append(mainContentFragment);
