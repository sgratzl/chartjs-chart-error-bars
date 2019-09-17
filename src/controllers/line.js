'use strict';

import * as Chart from 'chart.js';
import {calculateErrorBarValuesPixels} from './utils';
import {updateErrorBarElement} from '../elements/render';

const defaults = {};

Chart.defaults.lineWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.line, defaults]);

const lineWithErrorBars = {
  dataElementType: Chart.elements.PointWithErrorBar,

  _elementOptions() {
    return this.chart.options.elements.pointWithErrorBar;
  },

  updateElement: function (point, index, reset) {
    Chart.controllers.line.prototype.updateElement.call(this, point, index, reset);

    updateErrorBarElement(this, point, index, reset);

    calculateErrorBarValuesPixels(this, point._model, index, reset);
  }
};

export const LineWithErrorBars = Chart.controllers.lineWithErrorBars = Chart.controllers.line.extend(lineWithErrorBars);
