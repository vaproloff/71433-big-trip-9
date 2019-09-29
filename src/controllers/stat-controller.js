import Statistics from '../components/statistics';
import {Position, renderElement, getFormattedDuration} from '../utils';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const TYPE_TO_LABEL = {
  money: {
    'check-in': `STAY`,
    'restaurant': `EAT`,
    'sightseeing': `LOOK`,
    'bus': `RIDE`,
    'drive': `DRIVE`,
    'flight': `FLY`,
    'ship': `SAIL`,
    'taxi': `RIDE`,
    'train': `RIDE`,
    'transport': `RIDE`
  },
  transport: {
    'bus': `PUBLIC`,
    'drive': `DRIVE`,
    'flight': `FLY`,
    'ship': `SAIL`,
    'taxi': `TAXI`,
    'train': `PUBLIC`,
    'transport': `OTHER`
  },
  time: {
    'check-in': `IN HOTEL`,
    'restaurant': `EATING`,
    'sightseeing': `SIGHTSEEING`,
    'bus': `RIDING`,
    'drive': `DRIVING`,
    'flight': `FLYING`,
    'ship': `SAILING`,
    'taxi': `RIDING`,
    'train': `RIDING`,
    'transport': `RIDING`
  }
};


class StatController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._statistics = new Statistics();

    this._init();
  }

  show() {
    if (this._statistics.getElement().classList.contains(`visually-hidden`)) {
      this._statistics.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    if (this._statistics.getElement().classList.contains(`visually-hidden`)) {
      return;
    }
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  refreshCharts(events) {
    this._events = events;
    this._refreshChart(this._moneyChart, this._getMoneyData());
    this._refreshChart(this._transportChart, this._getTransportData());
    this._refreshChart(this._timeChart, this._getTimeData());
  }

  _refreshChart(chart, data) {
    data.forEach((it, i) => {
      chart.data.labels[i] = it.type;
      chart.data.datasets[0].data[i] = it.value;
    });
    while (data.length < chart.data.labels.length) {
      chart.data.labels.pop();
      chart.data.datasets[0].data.pop();
    }
    chart.update();
  }

  _init() {
    renderElement(this._container, Position.AFTEREND, this._statistics.getElement());
    this.hide();

    const moneyCtx = this._statistics.getElement().querySelector(`.statistics__chart--money`).getContext(`2d`);
    const moneyData = this._getMoneyData();
    const formatMoneyLabel = (value) => `€ ${value}`;
    this._moneyChart = new Chart(moneyCtx, this._getChartConfig(`MONEY`, moneyData, formatMoneyLabel));

    const transportCtx = this._statistics.getElement().querySelector(`.statistics__chart--transport`).getContext(`2d`);
    const transportData = this._getTransportData();
    const formatTransportLabel = (value) => `${value}x`;
    this._transportChart = new Chart(transportCtx, this._getChartConfig(`TRANSPORT`, transportData, formatTransportLabel));

    const timeCtx = this._statistics.getElement().querySelector(`.statistics__chart--time`).getContext(`2d`);
    const timeData = this._getTimeData();
    const formatTimeLabel = (value) => getFormattedDuration(value);
    this._timeChart = new Chart(timeCtx, this._getChartConfig(`TIME SPENT`, timeData, formatTimeLabel));
  }

  _getMoneyData() {
    const types = [...new Set(Object.values(TYPE_TO_LABEL.money))];
    return types.map((it) => {
      return {
        type: it,
        value: this._events.reduce((sum, event) => {
          if (TYPE_TO_LABEL.money[event.type] === it) {
            sum += event.price;
          }
          return sum;
        }, 0)
      };
    }).filter((it) => it.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  _getTransportData() {
    const types = [...new Set(Object.values(TYPE_TO_LABEL.transport))];
    return types.map((it) => {
      return {
        type: it,
        value: this._events.reduce((sum, event) => {
          if (TYPE_TO_LABEL.transport[event.type] === it) {
            sum++;
          }
          return sum;
        }, 0)
      };
    }).filter((it) => it.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  _getTimeData() {
    const types = [...new Set(Object.values(TYPE_TO_LABEL.time))];
    return types.map((it) => {
      return {
        type: it,
        value: this._events.reduce((sum, event) => {
          if (TYPE_TO_LABEL.time[event.type] === it) {
            sum += event.duration;
          }
          return sum;
        }, 0)
      };
    }).filter((it) => it.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  _getChartConfig(title, data, formatter) {
    return {
      type: `horizontalBar`,
      data: {
        labels: data.map((it) => it.type),
        datasets: [{
          data: data.map((it) => it.value),
          backgroundColor: `white`,
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          datalabels: {
            formatter,
            font: {
              size: 16
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
          }
        },
        layout: {
          padding: {
            left: 40,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          fontSize: 35,
          fontColor: `#000000`,
          position: `left`,
          fontStyle: `bold`,
          text: title
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false,
              beginAtZero: true,
            },
            minBarLength: 75
          }],
          yAxes: [{
            ticks: {
              fontSize: 15
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        }
      },
      plugins: [ChartDataLabels]
    };
  }
}

export default StatController;
