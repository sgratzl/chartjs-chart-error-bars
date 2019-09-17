'use strict';

import * as Chart from 'chart.js';

const defaults = {

};

const horizontalDefaults = {

};

const verticalDefaults = {

};

const resolve = Chart.helpers.options.resolve;

Chart.defaults.barWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);
Chart.defaults.horizontalBarWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults, defaults]);

const barWithErrorBars = {
  dataElementType: Chart.elements.RectangleWithErrorBar,

  _elementOptions() {
    return this.chart.options.elements.rectangleWithErrorBar;
  },

  updateElement(elem, index, reset) {
    Chart.controllers.bar.prototype.updateElement.call(this, elem, index, reset);

    const custom = elem.custom || {};
    const options = this._elementOptions();

    const keys = []; // TODO list options
    // Scriptable options
    const context = {
      chart: this.chart,
      dataIndex: index,
      dataset: this.getDataset(),
      datasetIndex: this.index
    };

    keys.forEach((item) => {
      elem._model[item] = resolve([custom[item], dataset[item], options[item]], context, index);
    });
  },

  /**
   * @private
   */
  _updateElementGeometry(elem, index, reset) {
    Chart.controllers.bar.prototype._updateElementGeometry.call(this, elem, index, reset);
    this._calculateErrorBarValuesPixels(elem._model, this.index, index);
  },

  /**
   * @private
   */
  _calculateErrorBarValuesPixels(model, datasetIndex, index) {
    const data = this.chart.data.datasets[datasetIndex].data[index];
    if (!data) {
      return;
    }

    const scale = this._getValueScale();
		const horizontal = scale.isHorizontal();
    const keys = horizontal ? ['xMin', 'xMax'] : ['yMin', 'yMax'];

    for (const key of keys) {
      const v = data[key];
      if (Array.isArray(v)) {
        model[key] = v.map((d) => scale.getPixelForValue(d));
      } else if (typeof v === 'number') {
        model[key] = scale.getPixelForValue(v);
      }
    }
  }
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const BarWithErrorBars = Chart.controllers.barWithErrorBars = Chart.controllers.bar.extend(barWithErrorBars);
export const HorizontalBarWithErrorBars = Chart.controllers.horizontalBarWithErrorBars = Chart.controllers.horizontalBar.extend(barWithErrorBars);
