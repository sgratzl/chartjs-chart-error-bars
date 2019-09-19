'use strict';

import * as Chart from 'chart.js';
import {calculateErrorBarValuesPixelsPolar, generateTooltipPolar} from './utils';
import {updateErrorBarElement} from '../elements/render';

const defaults = {
  tooltips: {
    callbacks: {
      label: generateTooltipPolar
    }
  }
};

Chart.defaults.polarAreaWithErrorBars = Chart.helpers.merge({}, [Chart.defaults.polarArea, defaults]);

const superClass = Chart.controllers.polarArea.prototype;

const polarAreaWithErrorBars = {
  dataElementType: Chart.elements.ArcWithErrorBar,

  _elementOptions() {
    return this.chart.options.elements.arcWithErrorBar;
  },

  _getPatchedDataset() {
    const dataset = superClass.getDataset.call(this);
    return Object.assign({}, dataset, {
      // inline d.v
      data: dataset.data.map((d) => d != null && typeof d.y === 'number' ? d.y : d)
    })
  },

  _withPatching(f) {
    try {
      this.getDataset = this._getPatchedDataset.bind(this);
      return f();
    } finally {
      delete this.getDataset;
    }
  },

  updateElement(arc, index, reset) {
    this._withPatching(() => superClass.updateElement.call(this, arc, index, reset));

    updateErrorBarElement(this, arc, index, reset);

    calculateErrorBarValuesPixelsPolar(this, arc, arc._model, index, reset);
  },

  countVisibleElements() {
    return this._withPatching(() => superClass.countVisibleElements.call(this));
  },

  _computeAngle(index) {
    return this._withPatching(() => superClass._computeAngle.call(this, index));
  }
};

export const PolarAreaWithErrorBars = Chart.controllers.polarAreaWithErrorBars = Chart.controllers.polarArea.extend(polarAreaWithErrorBars);
