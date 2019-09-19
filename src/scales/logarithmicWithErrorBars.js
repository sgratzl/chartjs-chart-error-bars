'use strict';

import * as Chart from 'chart.js';
import {commonDataLimits} from '../data';

const logarithmicWithErrorBarsOptions = Chart.helpers.merge({}, [Chart.scaleService.getScaleDefaults('logarithmic')]);

export const LogarithmicWithErrorBarsScale = Chart.scaleService.getScaleConstructor('logarithmic').extend({
  determineDataLimits() {
    // Add whitespace around bars. Axis shouldn't go exactly from min to max
    this.minNotZero = null;
    commonDataLimits.call(this, this.isHorizontal(), (v, isHorizontal) => {
      const value = isHorizontal ? v.xMin : v.yMin;
      if (typeof value === 'number' && value !== 0 && (this.minNotZero === null || value < this.minNotZero)) {
        this.minNotZero = value;
      }
    });

    // Common base implementation to handle ticks.min, ticks.max
    this.handleTickRangeOptions();
  }
});
Chart.scaleService.registerScaleType('logarithmicWithErrorBars', LogarithmicWithErrorBarsScale, logarithmicWithErrorBarsOptions);
