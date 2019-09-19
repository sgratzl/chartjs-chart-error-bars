'use strict';

import * as Chart from 'chart.js';
import {commonDataLimits} from '../data';

const linearWithErrorBarsOptions = Chart.helpers.merge({}, [Chart.scaleService.getScaleDefaults('linear')]);

export const LinearWithErrorBarsScale = Chart.scaleService.getScaleConstructor('linear').extend({
  determineDataLimits() {
    commonDataLimits.call(this, this.isHorizontal());
    // Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
    this.handleTickRangeOptions();
  }
});
Chart.scaleService.registerScaleType('linearWithErrorBars', LinearWithErrorBarsScale, linearWithErrorBarsOptions);
