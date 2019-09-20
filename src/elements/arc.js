'use strict';

import * as Chart from 'chart.js';
import {transitionErrorBar, transitionErrorBarHelper, renderErrorBarArc, defaults} from './render';

Chart.defaults.global.elements.arcWithErrorBar = {
  ...Chart.defaults.global.elements.arc,
  ...defaults
};

export const ArcWithErrorBar = Chart.elements.ArcWithErrorBar = Chart.elements.Arc.extend({
  transition(ease) {
    const startBak = transitionErrorBarHelper(this._start);
    const r = Chart.elements.Arc.prototype.transition.call(this, ease);
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
    Chart.elements.Arc.prototype.draw.call(this);

    renderErrorBarArc(this._view, this._chart.ctx);
  }
});
