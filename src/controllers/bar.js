'use strict';

import * as Chart from 'chart.js';
import {calculateErrorBarValuesPixels, generateTooltip} from './utils';
import {updateErrorBarElement} from '../elements/render';

const defaults = {
  scales: {
    yAxes: [{
      type: 'linearWithErrorBars'
    }]
  },
  tooltips: {
    callbacks: {
      label: generateTooltip(false)
    }
  }
};

const horizontalDefaults = {
  scales: {
    xAxes: [{
      type: 'linearWithErrorBars'
    }]
  },
  tooltips: {
    callbacks: {
      label: generateTooltip(true)
    }
  }
};

Chart.defaults.barWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.bar, defaults]);
Chart.defaults.horizontalBarWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults]);

const barWithErrorBars = {
  dataElementType: Chart.elements.RectangleWithErrorBar,

  _elementOptions() {
    return this.chart.options.elements.rectangleWithErrorBar;
  },

  /**
   * @private
   */
  _updateElementGeometry(elem, index, reset) {
    updateErrorBarElement(this, elem, index, reset);

    Chart.controllers.bar.prototype._updateElementGeometry.call(this, elem, index, reset);
    calculateErrorBarValuesPixels(this, elem._model, index, reset);
  }
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const BarWithErrorBars = Chart.controllers.barWithErrorBars = Chart.controllers.bar.extend(barWithErrorBars);
export const HorizontalBarWithErrorBars = Chart.controllers.horizontalBarWithErrorBars = Chart.controllers.horizontalBar.extend(barWithErrorBars);
