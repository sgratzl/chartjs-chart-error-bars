'use strict';

import * as Chart from 'chart.js';
import {calculateErrorBarValuesPixels, generateTooltip} from './utils';
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

const horizontalDefaults = {
  scales: {
    xAxes: [
      {
        type: 'linearWithErrorBars'
      }
    ]
  },
  tooltips: {
    callbacks: {
      label: generateTooltip(true)
    }
  }
};

Chart.defaults.barWithErrorBars = Chart.helpers.configMerge(Chart.defaults.bar, defaults);
Chart.defaults.horizontalBarWithErrorBars = Chart.helpers.configMerge(Chart.defaults.horizontalBar, horizontalDefaults);

if (Chart.defaults.global.datasets && Chart.defaults.global.datasets.bar) {
  Chart.defaults.global.datasets.barWithErrorBars = {...Chart.defaults.global.datasets.bar};
}
if (Chart.defaults.global.datasets && Chart.defaults.global.datasets.horizontalBar) {
  Chart.defaults.global.datasets.horizontalBarWithErrorBars = {...Chart.defaults.global.datasets.horizontalBar};
}

const barWithErrorBars = {
  dataElementType: Chart.elements.RectangleWithErrorBar,

  _elementOptions() {
    return this.chart.options.elements.rectangleWithErrorBar;
  },

  /**
   * @private
   */
  _updateElementGeometry(elem, index, reset, ...args) {
    updateErrorBarElement(this, elem, index, reset);

    Chart.controllers.bar.prototype._updateElementGeometry.call(this, elem, index, reset, ...args);
    calculateErrorBarValuesPixels(this, elem._model, index, reset);
  }
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const BarWithErrorBars = (Chart.controllers.barWithErrorBars = Chart.controllers.bar.extend(barWithErrorBars));
export const HorizontalBarWithErrorBars = (Chart.controllers.horizontalBarWithErrorBars = Chart.controllers.horizontalBar.extend(barWithErrorBars));
