'use strict';

import * as Chart from 'chart.js';
import {modelKeys} from '../data';
import {updateErrorBarElement} from '../elements/render';

const defaults = {
  // TODO
};

const horizontalDefaults = {

};

const verticalDefaults = {

};

Chart.defaults.barWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);
Chart.defaults.horizontalBarWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults, defaults]);

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
    this._calculateErrorBarValuesPixels(elem._model, this.index, index, reset);
  },

  /**
   * @private
   */
  _calculateErrorBarValuesPixels(model, datasetIndex, index, reset) {
    const data = this.chart.data.datasets[datasetIndex].data[index];
    if (!data) {
      return;
    }

    const scale = this._getValueScale();
		const keys = modelKeys(scale.isHorizontal());
    const base = scale.getBasePixel();

    keys.forEach((key) => {
      const v = data[key];
      if (Array.isArray(v)) {
        model[key] = v.map((d) => reset ? base : scale.getPixelForValue(d));
      } else if (typeof v === 'number') {
        model[key] = reset ? base : scale.getPixelForValue(v);
      }
    });
  }
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const BarWithErrorBars = Chart.controllers.barWithErrorBars = Chart.controllers.bar.extend(barWithErrorBars);
export const HorizontalBarWithErrorBars = Chart.controllers.horizontalBarWithErrorBars = Chart.controllers.horizontalBar.extend(barWithErrorBars);
