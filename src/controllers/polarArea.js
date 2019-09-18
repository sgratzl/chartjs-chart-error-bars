'use strict';

import * as Chart from 'chart.js';
import {calculateErrorBarValuesPixelsPolar} from './utils';
import {updateErrorBarElement} from '../elements/render';

const defaults = {};

Chart.defaults.polarAreaWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.polarArea, defaults]);

const polarAreaWithErrorBars = {
  dataElementType: Chart.elements.ArcWithErrorBar,

  _elementOptions() {
    return this.chart.options.elements.arcWithErrorBar;
  },

  updateElement(arc, index, reset) {
    Chart.controllers.polarArea.prototype.updateElement.call(this, arc, index, reset);

    updateErrorBarElement(this, arc, index, reset);

    calculateErrorBarValuesPixelsPolar(this, arc, arc._model, index, reset);
  }
};

export const PolarAreaWithErrorBars = Chart.controllers.polarAreaWithErrorBars = Chart.controllers.polarArea.extend(polarAreaWithErrorBars);
