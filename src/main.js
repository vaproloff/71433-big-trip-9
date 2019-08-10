import {returnTripInfoHtml} from "./components/trip-info";
import {returnTripControlsHtml} from "./components/menu";
import {returnTripFiltersHtml} from "./components/filter";
import {returnTripSortHtml} from "./components/sort";
import {returnEventListHtml} from "./components/event-list";
import {returnEventHtml} from "./components/event";
import {returnEventEditHtml} from "./components/event-edit";

const renderHtmlInContainer = (container, place, html) => {
  container.insertAdjacentHTML(place, html);
};

const tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
renderHtmlInContainer(tripInfoSection, `afterbegin`, returnTripInfoHtml());

const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
renderHtmlInContainer(tripControlsHeadings[0], `afterend`, returnTripControlsHtml());
renderHtmlInContainer(tripControlsHeadings[1], `afterend`, returnTripFiltersHtml());

const tripEventsSection = document.querySelector(`section.trip-events`);
renderHtmlInContainer(tripEventsSection, `beforeend`, returnTripSortHtml() + returnEventListHtml());

const tripEventsList = tripEventsSection.querySelector(` ul.trip-events__list`);
renderHtmlInContainer(tripEventsList, `beforeend`, returnEventEditHtml() + returnEventHtml().repeat(3));
