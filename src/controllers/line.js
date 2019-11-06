'use strict';

import * as Chart from 'chart.js';
import {calculateErrorBarValuesPixelsScatter, generateTooltip} from './utils';
import {updateErrorBarElement} from '../elements/render';

const defaults = {
  scales: {
    yAxes: [
      {
        type: 'linearWithErrorBars'
      }
    ]
  },
  tooltips: {
    callbacks: {
      label: generateTooltip(false)
    }
  }
};

Chart.defaults.lineWithErrorBars = Chart.helpers.configMerge(Chart.defaults.line, defaults);

if (Chart.defaults.global.datasets && Chart.defaults.global.datasets.line) {
  Chart.defaults.global.datasets.lineWithErrorBars = {...Chart.defaults.global.datasets.line};
}

const lineWithErrorBars = {
  dataElementType: Chart.elements.PointWithErrorBar,

  _elementOptions() {
    return this.chart.options.elements.pointWithErrorBar;
  },

  updateElement(point, index, reset, ...args) {
    Chart.controllers.line.prototype.updateElement.call(this, point, index, reset, ...args);

    updateErrorBarElement(this, point, index, reset);

    calculateErrorBarValuesPixelsScatter(this, point._model, index, reset);
  }
};

export const LineWithErrorBars = (Chart.controllers.lineWithErrorBars = Chart.controllers.line.extend(lineWithErrorBars));
