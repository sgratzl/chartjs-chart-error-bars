'use strict';

import * as Chart from 'chart.js';
import {transitionErrorBar, transitionErrorBarHelper, renderErrorBar, defaults} from './render';

Chart.defaults.global.elements.pointWithErrorBar = {
  ...Chart.defaults.global.elements.point,
  ...defaults
};

export const PointWithErrorBar = Chart.elements.PointWithErrorBar = Chart.elements.Point.extend({
  transition(ease) {
    const startBak = transitionErrorBarHelper(this._start);
    const r = Chart.elements.Point.prototype.transition.call(this, ease);
    const model = this._model;
    const start = this._start;
    const view = this._view;

    // No animation -> No Transition
    if (!model || ease === 1) {
      return r;
    }

    transitionErrorBar(start, startBak, view, model, ease);

    return r;
  },

  draw() {
    Chart.elements.Point.prototype.draw.call(this);

    renderErrorBar(this._view, this._chart.ctx);
  }
});
