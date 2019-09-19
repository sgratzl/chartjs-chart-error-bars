'use strict';

import * as Chart from 'chart.js';
import {commonDataLimits} from '../data';

const radialLinearWithErrorBarsOptions = Chart.helpers.merge({}, [Chart.scaleService.getScaleDefaults('radialLinear')]);

export const RadialLinearWithErrorBarsScale = Chart.scaleService.getScaleConstructor('radialLinear').extend({
  determineDataLimits() {
    commonDataLimits.call(this, false, null, true);
    this.handleTickRangeOptions();
  }
});
Chart.scaleService.registerScaleType('radialLinearWithErrorBars', RadialLinearWithErrorBarsScale, radialLinearWithErrorBarsOptions);
