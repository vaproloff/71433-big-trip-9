import {returnTripInfoHtml} from "./components/trip-info";
import {returnTripControlsHtml} from "./components/menu";
import {returnTripFiltersHtml} from "./components/filter";
import {returnTripSortHtml} from "./components/sort";
import {returnEventListHtml} from "./components/event-list";
import {returnEventHtml} from "./components/event";
import {returnEventEditHtml} from "./components/event-edit";

const NUMBER_OF_EVENTS_TO_RENDER = 3;

const renderHtmlInContainer = (container, place, html) => {
  container.insertAdjacentHTML(place, html);
};

const tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
renderHtmlInContainer(tripInfoSection, `afterbegin`, returnTripInfoHtml());

const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
renderHtmlInContainer(tripControlsHeadings[0], `afterend`, returnTripControlsHtml());
renderHtmlInContainer(tripControlsHeadings[1], `afterend`, returnTripFiltersHtml());

// Подготовка временного контейнера с карточками
const eventListTempContainer = document.createElement(`div`);
const eventCardsHtml = returnEventEditHtml() + returnEventHtml().repeat(NUMBER_OF_EVENTS_TO_RENDER);
renderHtmlInContainer(eventListTempContainer, `beforeend`, returnEventListHtml(eventCardsHtml));

// Отрисовка строки сортировки и списка карточек
const tripEventsSection = document.querySelector(`section.trip-events`);
renderHtmlInContainer(tripEventsSection, `beforeend`, returnTripSortHtml() + eventListTempContainer.innerHTML);
