import {returnTripInfoHtml} from "./components/trip-info";
import {returnTripControlsHtml} from "./components/menu";
import {returnTripFiltersHtml} from "./components/filter";
import {returnTripSortHtml} from "./components/sort";
import {returnEventListHtml} from "./components/event-list";
import {events} from "./data";
import {menus} from "./data";
import {filters} from "./data";

const renderHtmlInContainer = (container, place, html) => {
  container.insertAdjacentHTML(place, html);
};

const countTotalTripCost = () => {
  return events.reduce((acc, it) => {
    return acc + it.price + [...it.offers].reduce((sum, element) => {
      return sum + element.price;
    }, 0);
  }, 0);
};

const tripInfoSection = document.querySelector(`section.trip-main__trip-info`);
renderHtmlInContainer(tripInfoSection, `afterbegin`, returnTripInfoHtml(events[0], events[events.length - 1]));

const tripControlsHeadings = document.querySelectorAll(`.trip-main__trip-controls h2`);
renderHtmlInContainer(tripControlsHeadings[0], `afterend`, returnTripControlsHtml([...menus]));
renderHtmlInContainer(tripControlsHeadings[1], `afterend`, returnTripFiltersHtml([...filters]));

// Подготовка временного контейнера с карточками
const eventListTempContainer = document.createElement(`div`);
renderHtmlInContainer(eventListTempContainer, `beforeend`, returnEventListHtml(events));

// Отрисовка строки сортировки и списка карточек
const tripEventsSection = document.querySelector(`section.trip-events`);
renderHtmlInContainer(tripEventsSection, `beforeend`, returnTripSortHtml() + eventListTempContainer.innerHTML);

document.querySelector(`.trip-info__cost-value`).innerText = countTotalTripCost();
