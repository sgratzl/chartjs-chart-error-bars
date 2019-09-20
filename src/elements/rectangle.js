'use strict';

import * as Chart from 'chart.js';
import {transitionErrorBar, transitionErrorBarHelper, renderErrorBar, defaults} from './render';

Chart.defaults.global.elements.rectangleWithErrorBar = {
  ...Chart.defaults.global.elements.rectangle,
  ...defaults
};

export const RectangleWithErrorBar = Chart.elements.RectangleWithErrorBar = Chart.elements.Rectangle.extend({
  transition(ease) {
    const startBak = transitionErrorBarHelper(this._start);
    const r = Chart.elements.Rectangle.prototype.transition.call(this, ease);
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
    Chart.elements.Rectangle.prototype.draw.call(this);

    renderErrorBar(this._view, this._chart.ctx);
  }
});
