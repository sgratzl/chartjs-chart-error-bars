'use strict';

import * as Chart from 'chart.js';

export const verticalDefaults = {

};
export const horizontalDefaults = {

};

const defaults = {
  tooltips: {
    callbacks: {
      // label(item, data) {
      // return 'TODO';
      // }
    }
  }
};

Chart.defaults.errorbar = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);

const errorbar = {
  dataElementType: Chart.elements.ErrorBar,

  _elementOptions() {
    return this.chart.options.elements.errorbar;
  },

  updateElement(elem, index, reset) {
    const dataset = this.getDataset();
    const custom = elem.custom || {};
    const options = this._elementOptions();

    Chart.controllers.bar.prototype.updateElement.call(this, elem, index, reset);
    const resolve = Chart.helpers.options.resolve;

    const keys = []; // TODO list options
    // Scriptable options
    const context = {
      chart: this.chart,
      dataIndex: index,
      dataset,
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
    elem._model.errorbar = this._calculateErrorBarValuesPixels(this.index, index);
  },

  /**
   * @private
   */
  _calculateErrorBarValuesPixels(datasetIndex, index) {
    const scale = this._getValueScale();
    const data = this.chart.data.datasets[datasetIndex].data[index];
    if (!data) {
      return null;
    }
    // const v = asBoxPlotStats(data, scale.options.ticks);

    const r = {};
    // Object.keys(v).forEach((key) => {
    //   if (key !== 'outliers') {
    //     r[key] = scale.getPixelForValue(Number(v[key]));
    //   }
    // });
    return r;
  }
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const ErrorBar = Chart.controllers.errorbar = Chart.controllers.bar.extend(errorbar);
