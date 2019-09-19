'use strict';

import * as Chart from 'chart.js';
import {LineWithErrorBars} from './line';
import {generateTooltipScatter} from './utils';

const defaults = {
  tooltips: {
		callbacks: {
			label: generateTooltipScatter
		}
	}
};

Chart.defaults.scatterWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.scatter, defaults]);

export const ScatterithErrorBars = Chart.controllers.scatterWithErrorBars = LineWithErrorBars;
